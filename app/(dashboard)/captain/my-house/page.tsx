import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default async function MyHousePage() {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');
  
  // Get user's house info
  const { data: userData } = await supabase
    .from('Users')
    .select('house_id, Houses(house_name)')
    .eq('user_id', user.id)
    .single();
  
  const houseName = userData?.Houses ? (Array.isArray(userData.Houses) ? userData.Houses[0]?.house_name : (userData.Houses as any)?.house_name) : 'Unknown';
  
  if (!userData?.house_id) {
    return <div>No house assigned</div>;
  }
  
  // Get students in the house
  const { data: students } = await supabase
    .from('Students')
    .select('*')
    .eq('house_id', userData.house_id)
    .order('name');
  
  // Get arts registrations for this house
  const { data: artsRegistrations } = await supabase
    .from('Arts_Registrations')
    .select(`
      arts_reg_id,
      Arts_Events(event_name),
      Arts_Reg_Details(
        Students(name),
        role
      )
    `)
    .eq('house_id', userData.house_id);
  
  // Get sports registrations for this house
  const { data: sportsRegistrations } = await supabase
    .from('Sports_Registrations')
    .select(`
      sports_reg_id,
      Sports_Events(event_name),
      Sports_Reg_Details(
        Students(name)
      )
    `)
    .eq('house_id', userData.house_id);
  
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">{houseName}</h1>
        <p className="text-gray-600 mt-2">Your house dashboard</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>{students?.length || 0}</CardTitle>
            <CardDescription>Total Students</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{artsRegistrations?.length || 0}</CardTitle>
            <CardDescription>Arts Registrations</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{sportsRegistrations?.length || 0}</CardTitle>
            <CardDescription>Sports Registrations</CardDescription>
          </CardHeader>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Students in {houseName}</CardTitle>
          <CardDescription>All students assigned to your house</CardDescription>
        </CardHeader>
        <CardContent>
          {students && students.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Class</TableHead>
                  <TableHead>Year</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((student) => (
                  <TableRow key={student.student_id}>
                    <TableCell>{student.student_id}</TableCell>
                    <TableCell className="font-medium">{student.name}</TableCell>
                    <TableCell>{student.class || 'N/A'}</TableCell>
                    <TableCell>{student.year || 'N/A'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-center text-gray-500 py-4">No students assigned to your house yet</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
