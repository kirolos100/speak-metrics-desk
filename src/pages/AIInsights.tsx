import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { apiSummary } from "@/lib/api";

const AIInsights = () => {
  const [summary, setSummary] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        setSummary(await apiSummary());
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold">AI Insights</CardTitle>
          </CardHeader>
          <CardContent>
            {loading && <div>Loading...</div>}
            {!loading && (
              <div className="space-y-4">
                <div className="text-sm text-gray-600">Overall Insights</div>
                <div className="p-6 bg-white rounded border leading-8 whitespace-pre-wrap" style={{ fontFamily: 'Tahoma, "Noto Naskh Arabic", system-ui', fontSize: '1.05rem' }}>
                  <BulletList text={summary?.overall_insights || "No insights available yet."} />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default AIInsights;

// Lightweight renderer for markdown-like bullets, with only **bold** spans bolded
function BulletList({ text }: { text: string }) {
  const lines = (text || "").split(/\n+/).map((l) => l.trim()).filter(Boolean);
  const cleanLine = (line: string) => {
    // strip bullets, hashes, and ordered list numbers
    let t = line.replace(/^[-*]+\s+/, "");
    t = t.replace(/^#+\s+/, "");
    t = t.replace(/^\d+\.\s+/, "");
    return t;
  };
  const renderWithBold = (t: string) => {
    const parts = t.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((p, i) => {
      const m = /^\*\*([^*]+)\*\*$/.exec(p);
      if (m) return <span key={i} className="font-semibold">{m[1]}</span>;
      return <span key={i}>{p}</span>;
    });
  };
  return (
    <div className="space-y-2">
      {lines.map((line, idx) => {
        const t = cleanLine(line);
        if (!t) return null;
        return (
          <div key={idx} className="flex items-start gap-2">
            <div className="text-gray-800">{renderWithBold(t)}</div>
          </div>
        );
      })}
    </div>
  );
}


