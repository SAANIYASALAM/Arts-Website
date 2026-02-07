import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default async function RegisterStudentsPage() {
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
  
  // Get available arts events
  const { data: artsEvents } = await supabase
    .from('Arts_Events')
    .select('*')
    .order('event_name');
  
  // Get available sports events
  const { data: sportsEvents } = await supabase
    .from('Sports_Events')
    .select('*')
    .order('event_name');
  
  // Get students in the house
  const { data: students } = await supabase
    .from('Students')
    .select('*')
    .eq('house_id', userData.house_id)
    .order('name');
  
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Register Students</h1>
        <p className="text-gray-600 mt-2">Register students from {houseName} for events</p>
      </div>
      
      <Tabs defaultValue="arts">
        <TabsList>
          <TabsTrigger value="arts">Arts Events</TabsTrigger>
          <TabsTrigger value="sports">Sports Events</TabsTrigger>
        </TabsList>
        
        <TabsContent value="arts">
          <Card>
            <CardHeader>
              <CardTitle>Arts Event Registration</CardTitle>
              <CardDescription>
                Select an event and students to register. Remember participation limits:
                Single events: 4 per student, Group events: 2 per student
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500 py-8">
                Registration form will appear here. Select an arts event, choose participants 
                (and accompanists for group events), and submit the registration.
              </p>
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold mb-2">Available Events ({artsEvents?.length || 0})</h4>
                <ul className="list-disc list-inside space-y-1">
                  {artsEvents?.map(event => (
                    <li key={event.event_id}>{event.event_name} ({event.is_group})</li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="sports">
          <Card>
            <CardHeader>
              <CardTitle>Sports Event Registration</CardTitle>
              <CardDescription>
                Select an event and students to register. Remember participation limits:
                Individual events: 3 per student, Team events: 2 per student
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500 py-8">
                Registration form will appear here. Select a sports event, choose participants, 
                and submit the registration.
              </p>
              <div className="mt-4 p-4 bg-green-50 rounded-lg">
                <h4 className="font-semibold mb-2">Available Events ({sportsEvents?.length || 0})</h4>
                <ul className="list-disc list-inside space-y-1">
                  {sportsEvents?.map(event => (
                    <li key={event.event_id}>{event.event_name} ({event.is_group})</li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
