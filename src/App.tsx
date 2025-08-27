import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import CallsRecords from "./pages/CallsRecords";
import UploadRecords from "./pages/UploadRecords";
import NotFound from "./pages/NotFound";
import CallDetails from "./pages/CallDetails";
import Chat from "./pages/Chat";
import AIInsights from "./pages/AIInsights";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/calls" element={<CallsRecords />} />
          <Route path="/calls/:id" element={<CallDetails />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/upload" element={<UploadRecords />} />
          <Route path="/insights" element={<AIInsights />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
