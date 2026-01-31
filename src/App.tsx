import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";

// Pages
import Dashboard from "./pages/Dashboard";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ContactList from "./pages/account/ContactList";
import ContactForm from "./pages/account/ContactForm";
import ProductList from "./pages/account/ProductList";
import ProductForm from "./pages/account/ProductForm";
import AnalyticalAccountList from "./pages/account/AnalyticalAccountList";
import AnalyticalAccountForm from "./pages/account/AnalyticalAccountForm";
import BudgetList from "./pages/account/BudgetList";
import BudgetForm from "./pages/account/BudgetForm";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function ProtectedRoute({ children, adminOnly = false }: { children: React.ReactNode; adminOnly?: boolean }) {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}

function AppRoutes() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Auth Routes */}
      <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />} />
      <Route path="/signup" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* Dashboard */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />

      {/* Account Module - Admin Only */}
      <Route path="/account/contacts" element={<ProtectedRoute adminOnly><ContactList /></ProtectedRoute>} />
      <Route path="/account/contacts/:id" element={<ProtectedRoute adminOnly><ContactForm /></ProtectedRoute>} />
      <Route path="/account/products" element={<ProtectedRoute adminOnly><ProductList /></ProtectedRoute>} />
      <Route path="/account/products/:id" element={<ProtectedRoute adminOnly><ProductForm /></ProtectedRoute>} />
      <Route path="/account/analytical-accounts" element={<ProtectedRoute adminOnly><AnalyticalAccountList /></ProtectedRoute>} />
      <Route path="/account/analytical-accounts/:id" element={<ProtectedRoute adminOnly><AnalyticalAccountForm /></ProtectedRoute>} />
      <Route path="/account/budgets" element={<ProtectedRoute adminOnly><BudgetList /></ProtectedRoute>} />
      <Route path="/account/budgets/:id" element={<ProtectedRoute adminOnly><BudgetForm /></ProtectedRoute>} />

      {/* Purchase Module */}
      <Route path="/purchase/orders" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/purchase/bills" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/purchase/payments" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />

      {/* Sale Module */}
      <Route path="/sale/orders" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/sale/invoices" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/sale/payments" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />

      {/* Catch-all */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
