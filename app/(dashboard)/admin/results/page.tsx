import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function AdminResultsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Results Management</h1>
        <p className="text-gray-600 mt-2">Enter competition winners and manage results</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Enter Winners</CardTitle>
          <CardDescription>
            Select an event and enter the top 3 winners
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 py-8">
            Winner entry form will be available here. Select an event, view registrations, 
            and assign 1st, 2nd, and 3rd place positions.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
