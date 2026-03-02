import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import CVTailor from "./pages/CVTailor";
import LoginPage from "./pages/LoginPage";
import ApplyPage from "./pages/ApplyPage";
import ScreeningChatPage from "./pages/ScreeningChatPage";
import HelpCenter from "./pages/HelpCenter";
import SupportTickets from "./pages/SupportTickets";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/cv-tailor" element={<CVTailor />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/apply/:roleId" element={<ApplyPage />} />
          <Route path="/apply/:tenantSlug/:jobId" element={<ApplyPage />} />
          <Route path="/screening/:sessionId" element={<ScreeningChatPage />} />
          <Route path="/help" element={<HelpCenter />} />
          <Route path="/support" element={<SupportTickets />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
