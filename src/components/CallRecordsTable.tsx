import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CallRecord {
  id: string;
  audioName: string;
  callType: 'Request' | 'Inquiry' | 'Complaint';
  satisfactionRate: 'high' | 'medium' | 'low';
  agentAttitude: string;
  status: 'Success' | 'Failed';
  date: string;
}

const CallRecordsTable = () => {
  const callRecords: CallRecord[] = [
    {
      id: "1755774784036",
      audioName: "Service-Request-Sample",
      callType: "Request",
      satisfactionRate: "high",
      agentAttitude: "Helpful and attentive",
      status: "Success",
      date: "21-Aug-2025"
    },
    {
      id: "1754474786063",
      audioName: "Product Delivery Sample",
      callType: "Request", 
      satisfactionRate: "high",
      agentAttitude: "متفاون ومفيد",
      status: "Success",
      date: "06-Aug-2025"
    },
    {
      id: "1754474617375",
      audioName: "Service-Request-Sample-mp4",
      callType: "Request",
      satisfactionRate: "high", 
      agentAttitude: "Helpful and informative",
      status: "Success",
      date: "06-Aug-2025"
    },
    {
      id: "1754389512606",
      audioName: "Meeting in Internal System_UX-20250520_150547-Meeting Recording",
      callType: "Inquiry",
      satisfactionRate: "high",
      agentAttitude: "Helpful and cooperative", 
      status: "Success",
      date: "05-Aug-2025"
    },
    {
      id: "1753701124367",
      audioName: "Telecom-Sample",
      callType: "Inquiry",
      satisfactionRate: "high",
      agentAttitude: "Helpful and informative",
      status: "Success", 
      date: "28-Jul-2025"
    }
  ];

  const getBadgeVariant = (type: string) => {
    switch (type) {
      case 'Request': return 'default';
      case 'Inquiry': return 'secondary';
      case 'Complaint': return 'destructive';
      default: return 'default';
    }
  };

  const getSatisfactionIcon = (rate: string) => {
    return rate === 'high' ? '😊' : rate === 'medium' ? '😐' : '😞';
  };

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Customer Calls Records</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Call Audio Name</TableHead>
                <TableHead>Call Type</TableHead>
                <TableHead>Satisfaction Rate</TableHead>
                <TableHead>Agent Attitude</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {callRecords.map((record) => (
                <TableRow key={record.id} className="hover:bg-muted/50">
                  <TableCell>
                    <Button variant="link" className="p-0 h-auto font-normal text-primary">
                      {record.id}-{record.audioName}
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getBadgeVariant(record.callType)} className="bg-analytics-green text-white">
                      {record.callType}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-2xl">{getSatisfactionIcon(record.satisfactionRate)}</span>
                  </TableCell>
                  <TableCell className="max-w-xs truncate">
                    {record.agentAttitude}
                  </TableCell>
                  <TableCell>
                    <span className="text-green-600 font-medium">{record.status}</span>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {record.date}
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default CallRecordsTable;