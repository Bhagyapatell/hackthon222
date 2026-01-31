import { useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/contexts/AuthContext';
import { usePortalDashboard, usePortalSalesOrders, usePortalInvoices } from '@/hooks/usePortalData';
import {
  TrendingUp,
  TrendingDown,
  ShoppingCart,
  DollarSign,
  ArrowRight,
  FileText,
  Receipt,
  CreditCard,
} from 'lucide-react';
import { format } from 'date-fns';

export default function PortalDashboard() {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const { stats, loading: statsLoading } = usePortalDashboard();
  const { orders: salesOrders, loading: ordersLoading } = usePortalSalesOrders();
  const { invoices, loading: invoicesLoading } = usePortalInvoices();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'paid':
      case 'confirmed':
        return 'default';
      case 'partially_paid':
      case 'draft':
        return 'secondary';
      case 'cancelled':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const loading = statsLoading || ordersLoading || invoicesLoading;

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold text-foreground">
            Welcome, {profile?.name || user?.email?.split('@')[0]}!
          </h1>
          <p className="text-muted-foreground">
            {format(new Date(), 'EEEE, MMMM d, yyyy')} • Portal Dashboard
          </p>
        </div>

        {/* Quick Stats */}
        {loading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="border-l-4 border-l-chart-3">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Budget (Income)
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-chart-3" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(stats.totalBudgetedIncome)}</div>
                <p className="text-xs text-muted-foreground">Total budgeted income</p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-chart-2">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Budget (Expense)
                </CardTitle>
                <TrendingDown className="h-4 w-4 text-chart-2" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(stats.totalBudgetedExpense)}</div>
                <p className="text-xs text-muted-foreground">Total budgeted expense</p>
              </CardContent>
            </Card>

            <Card 
              className="border-l-4 border-l-primary cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => navigate('/portal/sales-orders')}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Pending Orders
                </CardTitle>
                <ShoppingCart className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.pendingSalesOrders + stats.pendingPurchaseOrders}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.pendingSalesOrders} sales, {stats.pendingPurchaseOrders} purchase
                </p>
              </CardContent>
            </Card>

            <Card 
              className="border-l-4 border-l-destructive cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => navigate('/portal/invoices')}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Pending Payments
                </CardTitle>
                <DollarSign className="h-4 w-4 text-destructive" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.unpaidInvoices + stats.unpaidBills}</div>
                <p className="text-xs text-muted-foreground">
                  {formatCurrency(stats.unpaidInvoiceAmount + stats.unpaidBillAmount)} total due
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Button
            variant="outline"
            className="h-auto flex-col gap-2 p-4"
            onClick={() => navigate('/portal/sales-orders')}
          >
            <ShoppingCart className="h-6 w-6" />
            <span>My Sales Orders</span>
            <span className="text-xs text-muted-foreground">
              {salesOrders.length} orders
            </span>
          </Button>

          <Button
            variant="outline"
            className="h-auto flex-col gap-2 p-4"
            onClick={() => navigate('/portal/invoices')}
          >
            <FileText className="h-6 w-6" />
            <span>My Invoices</span>
            <span className="text-xs text-muted-foreground">
              {stats.unpaidInvoices} unpaid
            </span>
          </Button>

          <Button
            variant="outline"
            className="h-auto flex-col gap-2 p-4"
            onClick={() => navigate('/portal/purchase-orders')}
          >
            <Receipt className="h-6 w-6" />
            <span>My Purchase Orders</span>
            <span className="text-xs text-muted-foreground">
              As vendor
            </span>
          </Button>

          <Button
            variant="outline"
            className="h-auto flex-col gap-2 p-4"
            onClick={() => navigate('/portal/vendor-bills')}
          >
            <CreditCard className="h-6 w-6" />
            <span>My Vendor Bills</span>
            <span className="text-xs text-muted-foreground">
              {stats.unpaidBills} unpaid
            </span>
          </Button>
        </div>

        {/* Recent Activity */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Sales Orders</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => navigate('/portal/sales-orders')}>
                View all <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              {ordersLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-16" />
                  ))}
                </div>
              ) : salesOrders.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No sales orders yet
                </div>
              ) : (
                <div className="space-y-3">
                  {salesOrders.slice(0, 5).map((order) => (
                    <div
                      key={order.id}
                      className="flex items-center justify-between rounded-lg border border-border p-3 transition-colors hover:bg-muted/30 cursor-pointer"
                      onClick={() => navigate(`/portal/sales-orders/${order.id}`)}
                    >
                      <div>
                        <p className="font-medium">{order.order_number}</p>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(order.order_date), 'dd MMM yyyy')}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{formatCurrency(order.total_amount)}</p>
                        <Badge variant={getStatusVariant(order.status)} className="mt-1">
                          {order.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Invoices</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => navigate('/portal/invoices')}>
                View all <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              {invoicesLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-16" />
                  ))}
                </div>
              ) : invoices.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No invoices yet
                </div>
              ) : (
                <div className="space-y-3">
                  {invoices.slice(0, 5).map((invoice) => {
                    const balance = Number(invoice.total_amount) - Number(invoice.paid_amount);
                    return (
                      <div
                        key={invoice.id}
                        className="flex items-center justify-between rounded-lg border border-border p-3 transition-colors hover:bg-muted/30 cursor-pointer"
                        onClick={() => navigate(`/portal/invoices/${invoice.id}`)}
                      >
                        <div>
                          <p className="font-medium">{invoice.invoice_number}</p>
                          <p className="text-sm text-muted-foreground">
                            Due: {format(new Date(invoice.due_date), 'dd MMM yyyy')}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className={`font-medium ${balance > 0 ? 'text-destructive' : 'text-chart-3'}`}>
                            {formatCurrency(balance)} due
                          </p>
                          <Badge variant={getStatusVariant(invoice.status)} className="mt-1">
                            {invoice.status.replace('_', ' ')}
                          </Badge>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
