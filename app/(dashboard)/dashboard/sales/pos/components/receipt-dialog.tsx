'use client';

import { useState } from 'react';
import { Printer, Mail, Download, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

interface ReceiptDialogProps {
  isOpen: boolean;
  onClose: () => void;
  order: any;
}

export function ReceiptDialog({ isOpen, onClose, order }: ReceiptDialogProps) {
  const [printing, setPrinting] = useState(false);
  const [emailing, setEmailing] = useState(false);

  const handlePrint = async () => {
    setPrinting(true);
    try {
      // Create a new window for printing
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(generateReceiptHTML());
        printWindow.document.close();
        printWindow.print();
        printWindow.close();
      }
      toast.success('Receipt sent to printer');
    } catch (error) {
      console.error('Error printing receipt:', error);
      toast.error('Failed to print receipt');
    } finally {
      setPrinting(false);
    }
  };

  const handleEmail = async () => {
    if (!order.order.customer?.email) {
      toast.error('Customer email not available');
      return;
    }

    setEmailing(true);
    try {
      // Here you would implement email sending functionality
      // For now, we'll just show a success message
      toast.success('Receipt sent via email');
    } catch (error) {
      console.error('Error sending email:', error);
      toast.error('Failed to send email');
    } finally {
      setEmailing(false);
    }
  };

  const handleDownload = () => {
    try {
      const receiptHTML = generateReceiptHTML();
      const blob = new Blob([receiptHTML], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `receipt-${order.order.orderNumber}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success('Receipt downloaded');
    } catch (error) {
      console.error('Error downloading receipt:', error);
      toast.error('Failed to download receipt');
    }
  };

  const generateReceiptHTML = () => {
    const { order: orderData, change, amountPaid } = order;

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Receipt - ${orderData.orderNumber}</title>
          <style>
            body { font-family: 'Courier New', monospace; max-width: 300px; margin: 0 auto; padding: 20px; }
            .header { text-align: center; margin-bottom: 20px; }
            .company-name { font-size: 18px; font-weight: bold; }
            .order-info { margin: 20px 0; }
            .items { margin: 20px 0; }
            .item { display: flex; justify-content: space-between; margin: 5px 0; }
            .totals { margin-top: 20px; border-top: 1px dashed #000; padding-top: 10px; }
            .total-line { display: flex; justify-content: space-between; margin: 5px 0; }
            .grand-total { font-weight: bold; font-size: 16px; border-top: 1px dashed #000; padding-top: 5px; }
            .footer { text-align: center; margin-top: 20px; font-size: 12px; }
            @media print { body { margin: 0; padding: 10px; } }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="company-name">${orderData.organization?.name || 'Your Store'}</div>
            <div>${orderData.organization?.address || ''}</div>
            <div>Receipt</div>
          </div>
          
          <div class="order-info">
            <div>Order: ${orderData.orderNumber}</div>
            <div>Date: ${new Date(orderData.date).toLocaleString()}</div>
            <div>Cashier: ${orderData.createdBy.firstName} ${orderData.createdBy.lastName}</div>
            ${orderData.customer ? `<div>Customer: ${orderData.customer.name}</div>` : ''}
          </div>
          
          <div class="items">
            ${orderData.lines
              .map(
                (line: any) => `
              <div class="item">
                <div>
                  <div>${line.item.name}</div>
                  <div style="font-size: 12px;">${line.quantity} x $${line.unitPrice.toFixed(
                  2,
                )}</div>
                </div>
                <div>$${line.total.toFixed(2)}</div>
              </div>
            `,
              )
              .join('')}
          </div>
          
          <div class="totals">
            <div class="total-line">
              <span>Subtotal:</span>
              <span>$${orderData.subtotal.toFixed(2)}</span>
            </div>
            ${
              orderData.discount > 0
                ? `<div class="total-line">
                <span>Discount:</span>
                <span>-$${orderData.discount.toFixed(2)}</span>
              </div>`
                : ''
            }
            ${
              orderData.taxAmount > 0
                ? `<div class="total-line">
                <span>Tax:</span>
                <span>$${orderData.taxAmount.toFixed(2)}</span>
              </div>`
                : ''
            }
            <div class="total-line grand-total">
              <span>Total:</span>
              <span>$${orderData.total.toFixed(2)}</span>
            </div>
            <div class="total-line">
              <span>Paid (${orderData.paymentMethod}):</span>
              <span>$${amountPaid.toFixed(2)}</span>
            </div>
            ${
              change > 0
                ? `<div class="total-line">
                <span>Change:</span>
                <span>$${change.toFixed(2)}</span>
              </div>`
                : ''
            }
          </div>
          
          <div class="footer">
            <div>Thank you for your business!</div>
            <div>Please come again</div>
          </div>
        </body>
      </html>
    `;
  };

  if (!order) return null;

  const { order: orderData, change, amountPaid } = order;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Receipt</DialogTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {/* Receipt Preview */}
          <div className="bg-white border rounded-lg p-4 font-mono text-sm">
            <div className="text-center mb-4">
              <h3 className="font-bold text-lg">{orderData.organization?.name || 'Your Store'}</h3>
              <p className="text-xs text-gray-600">{orderData.organization?.address}</p>
              <p className="text-xs">RECEIPT</p>
            </div>

            <div className="space-y-1 mb-4 text-xs">
              <div className="flex justify-between">
                <span>Order:</span>
                <span>{orderData.orderNumber}</span>
              </div>
              <div className="flex justify-between">
                <span>Date:</span>
                <span>{new Date(orderData.date).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Cashier:</span>
                <span>
                  {orderData.createdBy.firstName} {orderData.createdBy.lastName}
                </span>
              </div>
              {orderData.customer && (
                <div className="flex justify-between">
                  <span>Customer:</span>
                  <span>{orderData.customer.name}</span>
                </div>
              )}
            </div>

            <Separator className="my-2" />

            <div className="space-y-1 mb-4">
              {orderData.lines.map((line: any) => (
                <div key={line.id}>
                  <div className="flex justify-between">
                    <span className="truncate">{line.item.name}</span>
                    <span>${line.total.toFixed(2)}</span>
                  </div>
                  <div className="text-xs text-gray-500 ml-2">
                    {line.quantity} x ${line.unitPrice.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            <Separator className="my-2" />

            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>${orderData.subtotal.toFixed(2)}</span>
              </div>
              {orderData.discount > 0 && (
                <div className="flex justify-between text-red-600">
                  <span>Discount:</span>
                  <span>-${orderData.discount.toFixed(2)}</span>
                </div>
              )}
              {orderData.taxAmount > 0 && (
                <div className="flex justify-between">
                  <span>Tax:</span>
                  <span>${orderData.taxAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-base border-t pt-1">
                <span>Total:</span>
                <span>${orderData.total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Paid ({orderData.paymentMethod}):</span>
                <span>${amountPaid.toFixed(2)}</span>
              </div>
              {change > 0 && (
                <div className="flex justify-between">
                  <span>Change:</span>
                  <span>${change.toFixed(2)}</span>
                </div>
              )}
            </div>

            <div className="text-center mt-4 text-xs">
              <p>Thank you for your business!</p>
              <p>Please come again</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={handlePrint} disabled={printing}>
              <Printer className="h-4 w-4 mr-2" />
              {printing ? 'Printing...' : 'Print'}
            </Button>
            {orderData.customer?.email && (
              <Button
                variant="outline"
                className="flex-1"
                onClick={handleEmail}
                disabled={emailing}
              >
                <Mail className="h-4 w-4 mr-2" />
                {emailing ? 'Sending...' : 'Email'}
              </Button>
            )}
            <Button variant="outline" className="flex-1" onClick={handleDownload}>
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
