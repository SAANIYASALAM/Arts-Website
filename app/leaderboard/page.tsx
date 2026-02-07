import { createClient } from '@/lib/supabase/server';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface HouseScore {
  house_id: number;
  house_name: string;
  total_points: number;
  arts_points: number;
  sports_points: number;
}

async function getLeaderboard(): Promise<HouseScore[]> {
  const supabase = await createClient();
  
  // Get all houses
  const { data: houses } = await supabase
    .from('Houses')
    .select('house_id, house_name')
    .order('house_name');
  
  if (!houses) return [];
  
  const leaderboard: HouseScore[] = [];
  
  for (const house of houses) {
    // Calculate arts points
    const { data: artsWinners } = await supabase
      .from('Arts_Winners')
      .select(`
        position,
        Arts_Registrations!inner (
          house_id,
          Arts_Events (
            first_pts,
            second_pts,
            third_pts
          )
        )
      `)
      .eq('Arts_Registrations.house_id', house.house_id);
    
    let artsPoints = 0;
    artsWinners?.forEach((winner: any) => {
      const event = winner.Arts_Registrations?.Arts_Events;
      if (event) {
        if (winner.position === '1') artsPoints += event.first_pts || 0;
        else if (winner.position === '2') artsPoints += event.second_pts || 0;
        else if (winner.position === '3') artsPoints += event.third_pts || 0;
      }
    });
    
    // Calculate sports points
    const { data: sportsWinners } = await supabase
      .from('Sports_Winners')
      .select(`
        position,
        Sports_Registrations!inner (
          house_id,
          Sports_Events (
            first_pts,
            second_pts,
            third_pts
          )
        )
      `)
      .eq('Sports_Registrations.house_id', house.house_id);
    
    let sportsPoints = 0;
    sportsWinners?.forEach((winner: any) => {
      const event = winner.Sports_Registrations?.Sports_Events;
      if (event) {
        if (winner.position === 1) sportsPoints += event.first_pts || 0;
        else if (winner.position === 2) sportsPoints += event.second_pts || 0;
        else if (winner.position === 3) sportsPoints += event.third_pts || 0;
      }
    });
    
    leaderboard.push({
      house_id: house.house_id,
      house_name: house.house_name,
      arts_points: artsPoints,
      sports_points: sportsPoints,
      total_points: artsPoints + sportsPoints,
    });
  }
  
  // Sort by total points descending
  return leaderboard.sort((a, b) => b.total_points - a.total_points);
}

export default async function LeaderboardPage() {
  const leaderboard = await getLeaderboard();
  
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Live Leaderboard</h1>
            <p className="text-lg text-gray-700 mt-2">
              Layatharang & Chakravyuh 2026
            </p>
          </div>
          <Link href="/">
            <Button variant="outline">Back to Home</Button>
          </Link>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>House Standings</CardTitle>
            <CardDescription>
              Real-time scores from Arts and Sports events
            </CardDescription>
          </CardHeader>
          <CardContent>
            {leaderboard.length === 0 ? (
              <p className="text-center text-gray-500 py-8">
                No results yet. Check back once competitions begin!
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">Rank</TableHead>
                    <TableHead>House Name</TableHead>
                    <TableHead className="text-right">Arts Points</TableHead>
                    <TableHead className="text-right">Sports Points</TableHead>
                    <TableHead className="text-right font-bold">Total Points</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leaderboard.map((house, index) => (
                    <TableRow key={house.house_id}>
                      <TableCell className="font-bold">
                        {index + 1}
                        {index === 0 && " 🏆"}
                        {index === 1 && " 🥈"}
                        {index === 2 && " 🥉"}
                      </TableCell>
                      <TableCell className="font-medium">{house.house_name}</TableCell>
                      <TableCell className="text-right">{house.arts_points}</TableCell>
                      <TableCell className="text-right">{house.sports_points}</TableCell>
                      <TableCell className="text-right font-bold text-lg">
                        {house.total_points}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
