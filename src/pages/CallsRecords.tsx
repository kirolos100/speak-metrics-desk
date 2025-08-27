import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { apiListCalls, CallListItem } from "@/lib/api";

function emojiFromSentiment(analysis: any): string {
  // Debug: log the analysis structure for the first few calls
  if (analysis && typeof analysis === 'object') {
    console.log('Analysis structure:', Object.keys(analysis));
    if (analysis["Call Generated Insights"]) {
      console.log('Call Generated Insights keys:', Object.keys(analysis["Call Generated Insights"]));
    }
  }
  
  // First try to get Customer Sentiment from Call Generated Insights (actual JSON structure)
  if (analysis?.["Call Generated Insights"]?.["Customer Sentiment"]) {
    const sentiment = analysis["Call Generated Insights"]["Customer Sentiment"];
    if (sentiment === "Positive") return "😊";
    if (sentiment === "Negative") return "😞";
    if (sentiment === "Neutral") return "😐";
  }
  
  // Fallback: try other possible locations for Customer Sentiment
  if (analysis?.insights?.customer_sentiment) {
    const sentiment = analysis.insights.customer_sentiment;
    if (sentiment === "Positive") return "😊";
    if (sentiment === "Negative") return "😞";
    if (sentiment === "Neutral") return "😐";
  }
  
  // Fallback: try numeric sentiment score if available
  const s = analysis?.sentiment;
  const score = typeof s === "object" ? Number(s?.score) : Number(s);
  if (!isFinite(score)) return "😐";
  if (score >= 4.5) return "😊";
  if (score >= 3.5) return "😐";
  return "😞";
}

const CallsRecords = () => {
  const [rows, setRows] = useState<CallListItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const data = await apiListCalls();
        setRows(data);
      } catch (e) {
        console.error(e);
        setRows([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Customer Calls Records</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Audio File Name</TableHead>
                    <TableHead>Call Category</TableHead>
                    <TableHead>Customer Satisfaction</TableHead>
                    <TableHead>Agent Attitude</TableHead>
                    <TableHead>File Upload Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading && (
                    <TableRow><TableCell colSpan={5}>Loading...</TableCell></TableRow>
                  )}
                  {!loading && rows.length === 0 && (
                    <TableRow><TableCell colSpan={5}>No calls found in the container.</TableCell></TableRow>
                  )}
                  {!loading && rows.map((r) => {
                    const cat = (r as any).call_category || r.analysis?.disposition?.score || "-";
                    const attitude = (r as any).agent_attitude || r.analysis?.agent_attitude || r.analysis?.AgentAttitude || "-";
                    const when = r.uploaded_at ? new Date(r.uploaded_at).toLocaleString() : "-";
                    return (
                      <TableRow key={r.call_id} className="hover:bg-muted/50">
                        <TableCell>
                          <Button variant="link" className="p-0 h-auto font-normal text-primary" onClick={() => { window.location.href = `/calls/${r.call_id}`; }}>
                            {r.audio_name}
                          </Button>
                        </TableCell>
                        <TableCell>
                          <Badge>{cat}</Badge>
                        </TableCell>
                        <TableCell className="text-2xl">{emojiFromSentiment(r.analysis)}</TableCell>
                        <TableCell className="max-w-xs truncate">{attitude}</TableCell>
                        <TableCell className="text-muted-foreground">{when}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </main>
      
      <Footer />
    </div>
  );
};

export default CallsRecords;