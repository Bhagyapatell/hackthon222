import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { usePortalBillDetail, generatePaymentNumber } from '@/hooks/usePortalData';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, CreditCard, AlertCircle, CheckCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

type PaymentMode = 'cash' | 'bank_transfer' | 'cheque' | 'online';

export default function PortalPayBill() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { bill, loading, refresh } = usePortalBillDetail(id || '');
  const { toast } = useToast();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentMode, setPaymentMode] = useState<PaymentMode>('online');
  const [reference, setReference] = useState('');
  const [notes, setNotes] = useState('');
  const [amount, setAmount] = useState('');

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value);
  };

  const balance = bill ? Number(bill.total_amount) - Number(bill.paid_amount) : 0;

  // Initialize amount with balance
  if (bill && !amount && balance > 0) {
    setAmount(balance.toString());
  }

  const handlePayment = async () => {
    if (!bill || !id) return;

    const paymentAmount = parseFloat(amount);

    // Validation
    if (isNaN(paymentAmount) || paymentAmount <= 0) {
      toast({
        title: 'Invalid Amount',
        description: 'Please enter a valid payment amount',
        variant: 'destructive',
      });
      return;
    }

    if (paymentAmount > balance) {
      toast({
        title: 'Amount Exceeds Balance',
        description: `Payment amount cannot exceed balance due (${formatCurrency(balance)})`,
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Generate payment number
      const paymentNumber = await generatePaymentNumber('BPAY');

      // Create payment record
      const { error: paymentError } = await supabase
        .from('bill_payments')
        .insert({
          vendor_bill_id: id,
          payment_number: paymentNumber,
          payment_date: new Date().toISOString().split('T')[0],
          amount: paymentAmount,
          mode: paymentMode,
          status: 'completed',
          reference: reference || null,
          notes: notes || null,
        });

      if (paymentError) throw paymentError;

      // Calculate new paid amount and status
      const newPaidAmount = Number(bill.paid_amount) + paymentAmount;
      const newStatus = newPaidAmount >= Number(bill.total_amount) ? 'paid' : 'partially_paid';

      // Update bill
      const { error: updateError } = await supabase
        .from('vendor_bills')
        .update({
          paid_amount: newPaidAmount,
          status: newStatus,
        })
        .eq('id', id);

      if (updateError) throw updateError;

      setPaymentSuccess(true);
      toast({
        title: 'Payment Successful',
        description: `Payment of ${formatCurrency(paymentAmount)} has been recorded`,
      });

      // Refresh data
      refresh();

    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: 'Payment Failed',
        description: 'An error occurred while processing the payment. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="space-y-6 max-w-2xl mx-auto">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-64 w-full" />
        </div>
      </MainLayout>
    );
  }

  if (!bill) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center py-12">
          <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Bill not found</p>
          <Button variant="outline" className="mt-4" onClick={() => navigate('/portal/vendor-bills')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Bills
          </Button>
        </div>
      </MainLayout>
    );
  }

  if (balance <= 0) {
    return (
      <MainLayout>
        <div className="max-w-2xl mx-auto">
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertTitle>Bill Already Paid</AlertTitle>
            <AlertDescription>
              This bill has been fully paid. No payment is required.
            </AlertDescription>
          </Alert>
          <Button variant="outline" className="mt-4" onClick={() => navigate(`/portal/vendor-bills/${id}`)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            View Bill
          </Button>
        </div>
      </MainLayout>
    );
  }

  if (paymentSuccess) {
    return (
      <MainLayout>
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="h-16 w-16 rounded-full bg-chart-3/20 flex items-center justify-center mb-4">
                <CheckCircle className="h-8 w-8 text-chart-3" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">Payment Successful!</h2>
              <p className="text-muted-foreground text-center mb-6">
                Your payment has been recorded successfully.
              </p>
              <div className="flex gap-4">
                <Button variant="outline" onClick={() => navigate('/portal/vendor-bills')}>
                  Back to Bills
                </Button>
                <Button onClick={() => navigate(`/portal/vendor-bills/${id}`)}>
                  View Bill
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(`/portal/vendor-bills/${id}`)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Pay Bill</h1>
            <p className="text-muted-foreground">{bill.bill_number}</p>
          </div>
        </div>

        {/* Bill Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Bill Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-sm text-muted-foreground">Total Amount</p>
                <p className="text-lg font-semibold">{formatCurrency(bill.total_amount)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Already Paid</p>
                <p className="text-lg font-semibold text-chart-3">{formatCurrency(bill.paid_amount)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Balance Due</p>
                <p className="text-lg font-semibold text-destructive">{formatCurrency(balance)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Payment Details
            </CardTitle>
            <CardDescription>Enter your payment information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Payment Amount *</Label>
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                max={balance}
                min={1}
              />
              <p className="text-sm text-muted-foreground">
                Maximum payable: {formatCurrency(balance)}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="mode">Payment Mode *</Label>
              <Select value={paymentMode} onValueChange={(value: PaymentMode) => setPaymentMode(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select payment mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="online">Online Payment</SelectItem>
                  <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                  <SelectItem value="cheque">Cheque</SelectItem>
                  <SelectItem value="cash">Cash</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reference">Reference / Transaction ID</Label>
              <Input
                id="reference"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                placeholder="Enter transaction reference"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any notes about this payment"
                rows={3}
              />
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => navigate(`/portal/vendor-bills/${id}`)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                className="flex-1"
                onClick={handlePayment}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Processing...' : `Pay ${formatCurrency(parseFloat(amount) || 0)}`}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
