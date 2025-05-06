
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/context/AuthContext";
import { DataProvider } from "@/context/DataContext";
import { defineAbility } from "@casl/ability";

// Pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Tables from "./pages/Tables";
import NewOrder from "./pages/NewOrder";
import Orders from "./pages/Orders";
import Menu from "./pages/Menu";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import Categories from "./pages/Categories";
import TablesManagement from "./pages/TablesManagement";
import StaffOverview from "./pages/StaffOverview";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Initialize with empty ability - this will be updated when user logs in
const ability = defineAbility(() => {});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ThemeProvider defaultTheme="light">
        <BrowserRouter>
          <AuthProvider>
            <DataProvider>
              <Toaster />
              <Sonner position="top-center" />
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/tables" element={<Tables />} />
                <Route path="/new-order" element={<NewOrder />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/menu" element={<Menu />} />
                <Route path="/categories" element={<Categories />} />
                <Route path="/tables-management" element={<TablesManagement />} />
                <Route path="/staff-overview" element={<StaffOverview />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </DataProvider>
          </AuthProvider>
        </BrowserRouter>
      </ThemeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
