import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { signOut } from '@/app/(auth)/actions';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect('/login');
  }
  
  // Get user role
  const { data: userData } = await supabase
    .from('Users')
    .select('role, house_id, Houses(house_name)')
    .eq('user_id', user.id)
    .single();
  
  const isAdmin = userData?.role === 'Admin';
  const houseName = userData?.Houses ? (Array.isArray(userData.Houses) ? userData.Houses[0]?.house_name : (userData.Houses as any)?.house_name) : 'N/A';
  
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-8">
              <Link href="/" className="text-xl font-bold text-blue-600">
                Layatharang & Chakravyuh 2026
              </Link>
              
              {isAdmin ? (
                <div className="flex space-x-4">
                  <Link href="/admin/events">
                    <Button variant="ghost">Events</Button>
                  </Link>
                  <Link href="/admin/results">
                    <Button variant="ghost">Results</Button>
                  </Link>
                </div>
              ) : (
                <div className="flex space-x-4">
                  <Link href="/captain/my-house">
                    <Button variant="ghost">My House</Button>
                  </Link>
                  <Link href="/captain/register">
                    <Button variant="ghost">Register Students</Button>
                  </Link>
                </div>
              )}
              
              <Link href="/leaderboard">
                <Button variant="ghost">Leaderboard</Button>
              </Link>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-sm">
                <p className="font-medium">{user.email}</p>
                <p className="text-gray-500">
                  {isAdmin ? 'Admin' : `House Captain - ${houseName}`}
                </p>
              </div>
              <form action={signOut}>
                <Button type="submit" variant="outline">
                  Logout
                </Button>
              </form>
            </div>
          </div>
        </div>
      </nav>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
