import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Send, MessageCircle } from "lucide-react";

const ChatWithCalls = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Chat with your calls</h1>
          <p className="text-gray-600">Ask questions about your call center data and get AI-powered insights</p>
        </div>

        <Card className="h-[600px] flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              AI Assistant
            </CardTitle>
          </CardHeader>
          
          <CardContent className="flex-1 flex flex-col">
            <div className="flex-1 bg-gray-50 rounded-lg p-4 mb-4 overflow-y-auto">
              <div className="space-y-4">
                <div className="bg-white p-3 rounded-lg shadow-sm">
                  <p className="text-sm text-gray-600 mb-1">AI Assistant</p>
                  <p>Hello! I'm here to help you analyze your call center data. You can ask me questions like:</p>
                  <ul className="mt-2 text-sm text-gray-600 list-disc list-inside">
                    <li>What's the average call duration today?</li>
                    <li>Which agent has the highest satisfaction rate?</li>
                    <li>Show me calls with low satisfaction scores</li>
                    <li>What are the most common call types?</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Input 
                placeholder="Ask a question about your calls..." 
                className="flex-1"
              />
              <Button>
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