import { createClient } from '@/lib/supabase/server';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { createArtsEvent, createSportsEvent } from '../actions';

export default async function AdminEventsPage() {
  const supabase = await createClient();
  
  // Get arts events
  const { data: artsEvents } = await supabase
    .from('Arts_Events')
    .select('*')
    .order('event_name');
  
  // Get sports events
  const { data: sportsEvents } = await supabase
    .from('Sports_Events')
    .select('*')
    .order('event_name');
  
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Event Management</h1>
        <p className="text-gray-600 mt-2">Create and manage Arts and Sports events</p>
      </div>
      
      <Tabs defaultValue="arts">
        <TabsList>
          <TabsTrigger value="arts">Arts Events</TabsTrigger>
          <TabsTrigger value="sports">Sports Events</TabsTrigger>
        </TabsList>
        
        <TabsContent value="arts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Create Arts Event</CardTitle>
              <CardDescription>Add a new arts event to the festival</CardDescription>
            </CardHeader>
            <CardContent>
              <form action={createArtsEvent} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="event_name">Event Name</Label>
                    <Input id="event_name" name="event_name" required />
                  </div>
                  <div>
                    <Label htmlFor="is_group">Event Type</Label>
                    <Select name="is_group" required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Single">Single</SelectItem>
                        <SelectItem value="Group">Group</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="slots_per_house">Slots per House</Label>
                    <Input id="slots_per_house" name="slots_per_house" type="number" defaultValue="3" required />
                  </div>
                  <div>
                    <Label htmlFor="max_participants">Max Participants</Label>
                    <Input id="max_participants" name="max_participants" type="number" defaultValue="1" required />
                  </div>
                  <div>
                    <Label htmlFor="max_accompanists">Max Accompanists</Label>
                    <Input id="max_accompanists" name="max_accompanists" type="number" defaultValue="0" />
                  </div>
                  <div>
                    <Label htmlFor="first_pts">1st Place Points</Label>
                    <Input id="first_pts" name="first_pts" type="number" defaultValue="5" required />
                  </div>
                  <div>
                    <Label htmlFor="second_pts">2nd Place Points</Label>
                    <Input id="second_pts" name="second_pts" type="number" defaultValue="3" required />
                  </div>
                  <div>
                    <Label htmlFor="third_pts">3rd Place Points</Label>
                    <Input id="third_pts" name="third_pts" type="number" defaultValue="1" required />
                  </div>
                </div>
                <Button type="submit">Create Arts Event</Button>
              </form>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Existing Arts Events</CardTitle>
            </CardHeader>
            <CardContent>
              {artsEvents && artsEvents.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Event Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Slots</TableHead>
                      <TableHead>Max Participants</TableHead>
                      <TableHead>Points (1st/2nd/3rd)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {artsEvents.map((event) => (
                      <TableRow key={event.event_id}>
                        <TableCell className="font-medium">{event.event_name}</TableCell>
                        <TableCell>{event.is_group}</TableCell>
                        <TableCell>{event.slots_per_house}</TableCell>
                        <TableCell>{event.max_participants}</TableCell>
                        <TableCell>{event.first_pts}/{event.second_pts}/{event.third_pts}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-center text-gray-500 py-4">No arts events created yet</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="sports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Create Sports Event</CardTitle>
              <CardDescription>Add a new sports event to the festival</CardDescription>
            </CardHeader>
            <CardContent>
              <form action={createSportsEvent} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="sports_event_name">Event Name</Label>
                    <Input id="sports_event_name" name="event_name" required />
                  </div>
                  <div>
                    <Label htmlFor="sports_is_group">Event Type</Label>
                    <Select name="is_group" required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Individual">Individual</SelectItem>
                        <SelectItem value="Team">Team</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="sports_slots_per_house">Slots per House</Label>
                    <Input id="sports_slots_per_house" name="slots_per_house" type="number" defaultValue="3" required />
                  </div>
                  <div>
                    <Label htmlFor="sports_max_participants">Max Participants</Label>
                    <Input id="sports_max_participants" name="max_participants" type="number" defaultValue="1" required />
                  </div>
                  <div>
                    <Label htmlFor="sports_first_pts">1st Place Points</Label>
                    <Input id="sports_first_pts" name="first_pts" type="number" defaultValue="5" required />
                  </div>
                  <div>
                    <Label htmlFor="sports_second_pts">2nd Place Points</Label>
                    <Input id="sports_second_pts" name="second_pts" type="number" defaultValue="3" required />
                  </div>
                  <div>
                    <Label htmlFor="sports_third_pts">3rd Place Points</Label>
                    <Input id="sports_third_pts" name="third_pts" type="number" defaultValue="1" required />
                  </div>
                </div>
                <Button type="submit">Create Sports Event</Button>
              </form>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Existing Sports Events</CardTitle>
            </CardHeader>
            <CardContent>
              {sportsEvents && sportsEvents.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Event Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Slots</TableHead>
                      <TableHead>Max Participants</TableHead>
                      <TableHead>Points (1st/2nd/3rd)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sportsEvents.map((event) => (
                      <TableRow key={event.event_id}>
                        <TableCell className="font-medium">{event.event_name}</TableCell>
                        <TableCell>{event.is_group}</TableCell>
                        <TableCell>{event.slots_per_house}</TableCell>
                        <TableCell>{event.max_participants}</TableCell>
                        <TableCell>{event.first_pts}/{event.second_pts}/{event.third_pts}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-center text-gray-500 py-4">No sports events created yet</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
