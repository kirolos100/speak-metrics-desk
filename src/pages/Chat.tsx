import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Send, MessageCircle, RefreshCw, AlertCircle, CheckCircle } from "lucide-react";
import { useState } from "react";
import { apiChat, apiReindexAllCalls } from "@/lib/api";

const ChatWithCalls = () => {
  const [q, setQ] = useState("");
  const [messages, setMessages] = useState<Array<{ role: "ai" | "user"; text: string }>>([
    {
      role: "ai",
      text:
        "Hello! I'm here to help you analyze your call center data. You can ask me questions like:\n- What's the average call duration today?\n- Which agent has the highest satisfaction rate?\n- Show me calls with low satisfaction scores\n- What are the most common call types?\n\nBefore we start chatting, make sure all your calls are properly indexed by clicking the 'Re-index All Calls' button below.",
    },
  ]);
  const [busy, setBusy] = useState(false);
  const [isReindexing, setIsReindexing] = useState(false);
  const [indexStatus, setIndexStatus] = useState<{
    status: 'idle' | 'success' | 'error';
    message: string;
    details?: string;
  }>({ status: 'idle', message: '' });

  const handleReindex = async () => {
    setIsReindexing(true);
    setIndexStatus({ status: 'idle', message: 'Starting re-indexing...' });
    
    try {
      const result = await apiReindexAllCalls();
      
      if (result.status === 'success') {
        setIndexStatus({
          status: 'success',
          message: `Successfully re-indexed ${result.indexed_count} documents`,
          details: `Previous count: ${result.previous_count}, New count: ${result.new_count}`
        });
        
        // Add a success message to the chat
        setMessages(prev => [...prev, {
          role: 'ai',
          text: `✅ Index updated successfully! I now have access to ${result.indexed_count} call documents and can answer questions about your call center data.`
        }]);
      } else {
        setIndexStatus({
          status: 'error',
          message: result.message,
          details: `Total calls found: ${result.total_calls}`
        });
      }
    } catch (error) {
      setIndexStatus({
        status: 'error',
        message: 'Failed to re-index calls',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setIsReindexing(false);
    }
  };

  const ask = async () => {
    const text = q.trim();
    if (!text) return;
    setMessages((m) => [...m, { role: "user", text }]);
    setQ("");
    setBusy(true);
    try {
      const res = await apiChat(text, messages);
      setMessages((m) => [...m, { role: "ai", text: res.answer || "" }]);
    } catch (e: any) {
      setMessages((m) => [...m, { role: "ai", text: e?.message || "Failed to chat" }]);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Chat with your calls</h1>
          <p className="text-gray-600">Ask questions about your call center data and get AI-powered insights</p>
        </div>

        {/* Re-index Section */}
        <Card className="mb-6 border-2 border-blue-100 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-800">
              <RefreshCw className="h-5 w-5" />
              Index Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-blue-700 text-sm">
                Before chatting, ensure all your calls are properly indexed in the search database. 
                This button will re-index all existing calls to make them available for AI analysis.
              </p>
              
              <Button 
                onClick={handleReindex}
                disabled={isReindexing}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isReindexing ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Re-indexing...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Re-index All Calls
                  </>
                )}
              </Button>

              {/* Status Display */}
              {indexStatus.status !== 'idle' && (
                <div className={`p-3 rounded-lg flex items-center gap-2 ${
                  indexStatus.status === 'success' 
                    ? 'bg-green-100 text-green-800 border border-green-200' 
                    : 'bg-red-100 text-red-800 border border-red-200'
                }`}>
                  {indexStatus.status === 'success' ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <AlertCircle className="h-4 w-4" />
                  )}
                  <div>
                    <p className="font-medium">{indexStatus.message}</p>
                    {indexStatus.details && (
                      <p className="text-sm opacity-80">{indexStatus.details}</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Chat Interface */}
        <Card className="flex flex-col min-h-[60vh]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              AI Assistant
            </CardTitle>
          </CardHeader>

          <CardContent className="flex-1 flex flex-col">
            <div className="bg-gray-50 rounded-lg p-4 mb-4 overflow-y-auto" style={{ maxHeight: "70vh" }}>
              <div className="space-y-4">
                {messages.map((m, i) => (
                  <div key={i} className={`p-3 rounded-lg shadow-sm ${m.role === "ai" ? "bg-white" : "bg-analytics-blue/10"}`}>
                    <p className="text-sm text-gray-600 mb-1">{m.role === "ai" ? "AI Assistant" : "You"}</p>
                    <div 
                      className="whitespace-pre-wrap text-sm leading-relaxed" 
                      dangerouslySetInnerHTML={{ __html: m.role === "ai" ? cleanLLM(m.text) : m.text }} 
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <Input
                placeholder="Ask a question about your calls..."
                className="flex-1"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={(e) => (e.key === "Enter" ? ask() : undefined)}
              />
              <Button onClick={ask} disabled={busy}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
      
      <Footer />
    </div>
  );
};

export default ChatWithCalls;

function cleanLLM(text: string): string {
  if (!text) return "";
  
  // Remove JSON code fences and formatting
  let cleaned = text
    .replace(/```json\s*/g, '')
    .replace(/```\s*/g, '')
    .replace(/^\s*{\s*/, '')
    .replace(/\s*}\s*$/, '')
    .trim();
  
  // If the text looks like JSON, try to extract meaningful content
  if (cleaned.startsWith('[') || cleaned.startsWith('{')) {
    try {
      const parsed = JSON.parse(cleaned);
      if (Array.isArray(parsed)) {
        // Convert array of call data to readable format
        return parsed.map((call, index) => {
          const summary = call.summary || call['Call Generated Insights']?.['Call Summary'] || 'No summary available';
          const sentiment = call.sentiment?.score || call['Call Generated Insights']?.['Customer Sentiment'] || 'Unknown';
          const category = call['Call Generated Insights']?.['Call Categorization'] || 'Unknown';
          
          return `**Call ${index + 1}:** ${summary}\n\n**Sentiment:** ${sentiment}\n**Category:** ${category}\n\n`;
        }).join('---\n\n');
      } else if (typeof parsed === 'object') {
        // Convert single call object to readable format
        const summary = parsed.summary || parsed['Call Generated Insights']?.['Call Summary'] || 'No summary available';
        const sentiment = parsed.sentiment?.score || parsed['Call Generated Insights']?.['Customer Sentiment'] || 'Unknown';
        const category = parsed['Call Generated Insights']?.['Call Categorization'] || 'Unknown';
        
        return `**Summary:** ${summary}\n\n**Sentiment:** ${sentiment}\n**Category:** ${category}`;
      }
    } catch (e) {
      // If JSON parsing fails, return the cleaned text as is
      return cleaned;
    }
  }
  
  // Convert **text** to <strong>text</strong> for bold formatting
  cleaned = cleaned.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  
  return cleaned;
}


