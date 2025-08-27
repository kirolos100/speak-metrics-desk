import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiGetCall } from "@/lib/api";
import React from "react";

const Section = ({ title, children }: { title: string; children: any }) => (
  <Card className="shadow-card">
    <CardHeader><CardTitle className="text-lg font-semibold">{title}</CardTitle></CardHeader>
    <CardContent>{children}</CardContent>
  </Card>
);

const CallDetails = () => {
  const { id } = useParams();
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      if (!id) return;
      setLoading(true);
      try {
        setData(await apiGetCall(id));
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {loading && <div>Loading...</div>}
        {!loading && data && (
          <>
            <Section title="Call Audio">
              {data.audio_url ? (
                <audio controls className="w-full">
                  <source src={data.audio_url} />
                </audio>
              ) : (
                <div>No audio available.</div>
              )}
            </Section>

            <Section title="Transcript">
              <div className="bg-white p-4 rounded border max-h-[480px] overflow-auto">
                <TranscriptArabic text={data.transcript || ""} />
              </div>
            </Section>

            <Section title="Insights">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="text-sm text-gray-600">Customer Sentiment</div>
                  <div className="p-3 bg-white rounded border">{data.insights?.customer_sentiment || '-'}</div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm text-gray-600">Call Categorization</div>
                  <div className="p-3 bg-white rounded border">{data.insights?.call_categorization || '-'}</div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm text-gray-600">Resolution Status</div>
                  <div className="p-3 bg-white rounded border">{data.insights?.resolution_status || '-'}</div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm text-gray-600">Main Subject</div>
                  <div className="p-3 bg-white rounded border">{data.insights?.main_subject || '-'}</div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm text-gray-600">Services</div>
                  <div className="p-3 bg-white rounded border">{data.insights?.services || '-'}</div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm text-gray-600">Call Outcome</div>
                  <div className="p-3 bg-white rounded border">{data.insights?.call_outcome || '-'}</div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm text-gray-600">Agent Attitude</div>
                  <div className="p-3 bg-white rounded border">{data.insights?.agent_attitude || '-'}</div>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <div className="text-sm text-gray-600">Call Summary</div>
                  <div className="p-3 bg-white rounded border whitespace-pre-wrap">{data.insights?.call_summary || data.analysis?.summary || '-'}</div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm text-gray-600">FCR</div>
                  <div className="p-3 bg-white rounded border">{typeof data.insights?.fcr === 'object' ? `${String(data.insights?.fcr?.score)}${data.insights?.fcr?.explanation ? ` - ${data.insights?.fcr?.explanation}` : ''}` : (String(data.insights?.fcr ?? '-') )}</div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm text-gray-600">AHT</div>
                  <div className="p-3 bg-white rounded border">{typeof data.insights?.aht === 'object' ? `${String(data.insights?.aht?.score)} sec${data.insights?.aht?.explanation ? ` - ${data.insights?.aht?.explanation}` : ''}` : (typeof data.analysis?.["Average Handling Time (AHT)"] === 'object' ? `${data.analysis?.["Average Handling Time (AHT)"].score} sec - ${data.analysis?.["Average Handling Time (AHT)"].explanation || ''}` : '-' )}</div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm text-gray-600">Talk time</div>
                  <div className="p-3 bg-white rounded border">{String(data.insights?.talk_time_seconds ?? '-')}</div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm text-gray-600">Hold time</div>
                  <div className="p-3 bg-white rounded border">{String(data.insights?.hold_time_seconds ?? '-')}</div>
                </div>
              </div>
            </Section>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default CallDetails;

function TranscriptArabic({ text }: { text: string }) {
  // Remove timestamps like [00:00:01.720] and split by speaker labels
  const cleaned = (text || "").replace(/\[[^\]]+\]\s*/g, "");
  const lines = cleaned.split(/\n+/).map((l) => l.trim()).filter(Boolean);
  const blocks: Array<{ speaker: string; content: string[] }> = [];
  lines.forEach((line) => {
    const m = /^(Agent|Customer)\s*[:：]\s*(.*)$/i.exec(line);
    if (m) {
      const speaker = m[1].toLowerCase() === "agent" ? "Agent" : "Customer";
      const content = m[2];
      blocks.push({ speaker, content: [content] });
    } else if (blocks.length > 0) {
      blocks[blocks.length - 1].content.push(line);
    } else {
      blocks.push({ speaker: "", content: [line] });
    }
  });
  return (
    <div className="space-y-4" dir="rtl" style={{ fontFamily: 'Tahoma, "Noto Naskh Arabic", system-ui' }}>
      {blocks.map((b, idx) => (
        <div key={idx} className="leading-8 text-[1.05rem] text-gray-900">
          {b.speaker && <div className="font-bold mb-1">{b.speaker}:</div>}
          <div className="whitespace-pre-wrap">{b.content.join("\n")}</div>
        </div>
      ))}
    </div>
  );
}
