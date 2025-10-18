import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route, createBrowserRouter, RouterProvider } from "react-router-dom";
import { WalletProvider } from "@/components/WalletProvider";
import Index from "./pages/Index";
import Donate from "./pages/Donate";
import DonationHistory from "./pages/DonationHistory";
import NotFound from "./pages/NotFound";

// Create router with future flags to suppress warnings
const router = createBrowserRouter([
  {
    path: "/",
    element: <Index />,
  },
  {
    path: "/donate",
    element: <Donate />,
  },
  {
    path: "/history",
    element: <DonationHistory />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
], {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true,
  }
});

const App = () => (
  <WalletProvider>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <RouterProvider router={router} />
    </TooltipProvider>
  </WalletProvider>
);

export default App;