'use client';

import type React from 'react';

import { useState } from 'react';
import { CreditCard, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { processPOSSale } from '@/actions/pos';
import type { CartItem, Customer } from '@/types/pos';

interface PaymentDialogProps {
  cart: CartItem[];
  customer: Customer | null;
  totals: {
    subtotal: number;
    discount: number;
    taxAmount: number;
    total: number;
  };
  onSuccess: (orderData: any) => void;
  trigger: React.ReactNode;
}

export function PaymentDialog({ cart, customer, totals, onSuccess, trigger }: PaymentDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [amountPaid, setAmountPaid] = useState(totals.total.toString());
  const [notes, setNotes] = useState('');
  const [processing, setProcessing] = useState(false);

  const change = Number(amountPaid) - totals.total;
  const isValidPayment = Number(amountPaid) >= totals.total;

  const quickAmounts = [
    totals.total,
    Math.ceil(totals.total / 10) * 10, // Round up to nearest 10
    Math.ceil(totals.total / 20) * 20, // Round up to nearest 20
    Math.ceil(totals.total / 50) * 50, // Round up to nearest 50
  ].filter((amount, index, arr) => arr.indexOf(amount) === index); // Remove duplicates

  const handlePayment = async () => {
    if (!isValidPayment) {
      toast.error('Payment amount is insufficient');
      return;
    }

    setProcessing(true);
    try {
      const result = await processPOSSale({
        customerId: customer?.id,
        locationId: 'default', // You should get this from user's current location
        items: cart.map((item) => ({
          itemId: item.id,
          quantity: item.quantity,
          unitPrice: item.price,
          discount: item.discount,
          taxRate: 0, // You can make this configurable
        })),
        paymentMethod,
        amountPaid: Number(amountPaid),
        notes,
      });

      if (result.success) {
        setIsOpen(false);
        // Reset form
        setPaymentMethod('cash');
        setAmountPaid(totals.total.toString());
        setNotes('');

        // Add a small delay to ensure the dialog closes before showing the receipt
        setTimeout(() => {
          onSuccess(result.data);
          toast.success('Sale completed successfully!');
        }, 300);
      } else {
        toast.error(result.error || 'Failed to process payment');
      }
    } catch (error) {
      console.error('Error processing payment:', error);
      toast.error('Failed to process payment');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Payment
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Order Summary */}
          <Card>
            <CardContent className="p-4">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Items ({cart.length}):</span>
                  <span>{cart.reduce((sum, item) => sum + item.quantity, 0)} units</span>
                </div>
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>₦{totals.subtotal.toFixed(2)}</span>
                </div>
                {totals.discount > 0 && (
                  <div className="flex justify-between text-red-600">
                    <span>Discount:</span>
                    <span>-₦{totals.discount.toFixed(2)}</span>
                  </div>
                )}
                {totals.taxAmount > 0 && (
                  <div className="flex justify-between">
                    <span>Tax:</span>
                    <span>₦{totals.taxAmount.toFixed(2)}</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span className="text-green-600">₦{totals.total.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Method */}
          <div className="space-y-2">
            <Label>Payment Method</Label>
            <Select value={paymentMethod} onValueChange={setPaymentMethod}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cash">Cash</SelectItem>
                <SelectItem value="card">Credit/Debit Card</SelectItem>
                <SelectItem value="mobile">Mobile Payment</SelectItem>
                <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                <SelectItem value="check">Check</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Amount Paid */}
          <div className="space-y-2">
            <Label>Amount Paid</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="number"
                step="0.01"
                value={amountPaid}
                onChange={(e) => setAmountPaid(e.target.value)}
                className="pl-10"
                placeholder="0.00"
              />
            </div>
          </div>

          {/* Quick Amount Buttons */}
          {paymentMethod === 'cash' && (
            <div className="space-y-2">
              <Label>Quick Amounts</Label>
              <div className="grid grid-cols-2 gap-2">
                {quickAmounts.map((amount) => (
                  <Button
                    key={amount}
                    variant="outline"
                    size="sm"
                    onClick={() => setAmountPaid(amount.toString())}
                  >
                    ₦{amount.toFixed(2)}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Change */}
          {paymentMethod === 'cash' && Number(amountPaid) > 0 && (
            <Card
              className={change >= 0 ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}
            >
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Change:</span>
                  <span
                    className={`text-lg font-bold ${
                      change >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    ₦{Math.abs(change).toFixed(2)}
                  </span>
                </div>
                {change < 0 && <p className="text-sm text-red-600 mt-1">Insufficient payment</p>}
              </CardContent>
            </Card>
          )}

          {/* Notes */}
          <div className="space-y-2">
            <Label>Notes (Optional)</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any notes for this sale..."
              rows={2}
            />
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
            disabled={processing}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button
            onClick={handlePayment}
            disabled={!isValidPayment || processing}
            className="w-full sm:w-auto"
          >
            {processing ? 'Processing...' : `Complete Sale`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
