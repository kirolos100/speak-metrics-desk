import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MetricCard from "@/components/MetricCard";
import PieChartComponent from "@/components/PieChart";
import BarSimple from "@/components/BarSimple";
import ServicesList from "@/components/ServicesList";
import { useEffect, useState } from "react";
import { apiSummary } from "@/lib/api";
import { Smile } from "lucide-react";

const Dashboard = () => {
  const [summary, setSummary] = useState<any | null>(null);
  useEffect(() => {
    (async () => {
      try { setSummary(await apiSummary()); } catch {}
    })();
  }, []);

  const colorMap: Record<string, string> = {
    // Resolution Status colors (primary focus)
    Resolved: "#10B981",      // Green
    resolved: "#10B981",
    Escalated: "#3B82F6",     // Blue
    escalated: "#3B82F6",
    Pending: "#F59E0B",       // Amber
    pending: "#F59E0B",
    other: "#6B7280",         // Gray
    
    // Disposition colors
    Failed: "#EF4444",        // Red
    
    // Category colors
    Inquiry: "#8B5CF6",       // Purple
    Issue: "#F59E0B",         // Amber
    Request: "#06B6D4",       // Cyan
    
    // Sentiment colors
    Positive: "#10B981",      // Green
    Neutral: "#F59E0B",       // Amber
    Negative: "#EF4444",      // Red
    
    // Additional fallback colors
    default: "#3B82F6",       // Blue
  };
  // Dispositions removed per request
  const dispData: any[] = [];
  const catData = Object.entries(summary?.categories || {}).map(([name, value]) => ({ 
    name, 
    value: Number(value), 
    color: colorMap[name] || colorMap[name.toLowerCase()] || colorMap.default 
  }));
  const resStatusData = Object.entries(summary?.resolution_status || {}).map(([name, value]) => ({ 
    name, 
    value: Number(value), 
    color: colorMap[name] || colorMap[name.toLowerCase()] || colorMap.default 
  }));
  const sentLabelData = Object.entries(summary?.sentiment_labels || {}).map(([name, value]) => ({ 
    name, 
    value: Number(value), 
    color: colorMap[name] || colorMap[name.toLowerCase()] || colorMap.default 
  }));
  // Agent Professionalism as fixed categories for pie with normalization
  const rawProf: Record<string, number> = summary?.agent_professionalism || {};
  const profBuckets = Object.entries(rawProf).reduce(
    (acc, [k, v]) => {
      const key = (k || "").toString().trim().toLowerCase();
      const val = Number(v) || 0;
      if (key.includes("high")) acc.high += val;
      else if (key.includes("need")) acc.needs += val;
      else acc.prof += val;
      return acc;
    },
    { high: 0, prof: 0, needs: 0 }
  );
  // Order: Highly Professional, Needs Improvement, Professional
  const professionalismData = [
    { name: "Highly Professional", value: profBuckets.high, color: "#10B981" },
    { name: "Needs Improvement", value: profBuckets.needs, color: "#EF4444" },
    { name: "Professional", value: profBuckets.prof, color: "#3B82F6" },
  ];
  // servicesData removed per request

  // Build bar data from counts
  const toBarData = (obj: Record<string, number> | any) => Object.entries(obj || {}).map(([name, value]) => ({ name, value: Number(value), color: colorMap[name] || colorMap[name?.toLowerCase?.()] || colorMap.default }));
  const resStatusBar = toBarData(summary?.resolution_status || {}).map((d) => ({
    ...d,
    color: d.name?.toLowerCase?.() === "resolved" ? "#10B981" : d.name?.toLowerCase?.() === "escalated" ? "#3B82F6" : "#F59E0B",
  }));
  const professionalismBar = toBarData(summary?.agent_professionalism || {});
  const subjectsTable = Object.entries(summary?.subjects || {}).map(([name, value]) => ({ name, value: Number(value) }));

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <MetricCard title="Total Number of Calls" value={String(summary?.total_calls ?? "-")} gradient="primary" />
          <MetricCard
            title="Customer Satisfaction Rate"
            value={summary?.avg_sentiment ? `${Math.round((summary.avg_sentiment / 5) * 100)}%` : "-"}
            gradient="purple"
            icon={<Smile />}
          />
          <MetricCard title="Average AHT" value={summary?.avg_aht_seconds ? String(Math.round(summary.avg_aht_seconds)) : "-"} unit="sec" gradient="coral" />
          {/* Removed Avg Talk and Avg Hold per request */}
        </div>

        {/* Charts Section: mixed types */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <BarSimple title="Resolution Status" data={resStatusBar} color="#3B82F6" />
          <PieChartComponent title="Customer Satisfaction" data={sentLabelData} />
          {/* Categories as table (left) */}
          <div className="shadow-card bg-white border rounded-md">
            <div className="px-4 py-3 border-b font-semibold text-lg">Categories</div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-base">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left px-5 py-3">Category</th>
                    <th className="text-left px-5 py-3">Count</th>
                  </tr>
                </thead>
                <tbody>
                  {catData.length === 0 && (
                    <tr><td className="px-5 py-3" colSpan={2}>No data</td></tr>
                  )}
                  {catData.map((r) => (
                    <tr key={r.name} className="border-t">
                      <td className="px-5 py-3 font-medium">{r.name}</td>
                      <td className="px-5 py-3">{r.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          {/* Agent Professionalism pie (right) */}
          <PieChartComponent title="Agent Professionalism" data={professionalismData} />
        </div>

        {/* Overall Insights moved to AI Insights page */}
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;

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