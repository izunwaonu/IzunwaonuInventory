'use client';

import { useState } from 'react';
import { Printer, Mail, Download, X, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { pdf } from '@react-pdf/renderer';
import { sendInvoiceEmail } from '@/actions/email';
import InvoicePDF from './invoice-pdf';

interface ReceiptDialogProps {
  isOpen: boolean;
  onClose: () => void;
  order: any;
}

export function ReceiptDialog({ isOpen, onClose, order }: ReceiptDialogProps) {
  const [printing, setPrinting] = useState(false);
  const [emailing, setEmailing] = useState(false);
  const [generatingPDF, setGeneratingPDF] = useState(false);

  const handlePrint = async () => {
    setPrinting(true);
    try {
      // Generate PDF and print
      const blob = await pdf(<InvoicePDF invoiceData={order} />).toBlob();
      const url = URL.createObjectURL(blob);

      const printWindow = window.open(url, '_blank');
      if (printWindow) {
        printWindow.onload = () => {
          printWindow.print();
          printWindow.close();
        };
      }

      URL.revokeObjectURL(url);
      toast.success('Invoice sent to printer');
    } catch (error) {
      console.error('Error printing invoice:', error);
      toast.error('Failed to print invoice');
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
      const result = await sendInvoiceEmail(order.order.id);
      if (result.success) {
        toast.success('Invoice sent via email successfully');
      } else {
        toast.error(result.error || 'Failed to send email');
      }
    } catch (error) {
      console.error('Error sending email:', error);
      toast.error('Failed to send email');
    } finally {
      setEmailing(false);
    }
  };

  const handleDownloadPDF = async () => {
    setGeneratingPDF(true);
    try {
      const blob = await pdf(<InvoicePDF invoiceData={order} />).toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `invoice-${order.order.orderNumber}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success('Invoice PDF downloaded');
    } catch (error) {
      console.error('Error downloading PDF:', error);
      toast.error('Failed to download PDF');
    } finally {
      setGeneratingPDF(false);
    }
  };

  const handleDownloadHTML = () => {
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
      toast.success('Receipt HTML downloaded');
    } catch (error) {
      console.error('Error downloading HTML:', error);
      toast.error('Failed to download HTML');
    }
  };

  const generateReceiptHTML = () => {
    const { order: orderData, change, amountPaid } = order;

    // Safely get creator name
    const creatorName = orderData.createdBy
      ? `${orderData.createdBy.firstName || ''} ${orderData.createdBy.lastName || ''}`.trim()
      : 'Staff';

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
            <div>Cashier: ${creatorName}</div>
            ${orderData.customer ? `<div>Customer: ${orderData.customer.name}</div>` : ''}
          </div>
          
          <div class="items">
            ${orderData.lines
              .map(
                (line: any) => `
              <div class="item">
                <div>
                  <div>${line.item.name}</div>
                  <div style="font-size: 12px;">${
                    line.quantity
                  } x ₦${line.unitPrice.toLocaleString()}</div>
                </div>
                <div>₦${line.total.toLocaleString()}</div>
              </div>
            `,
              )
              .join('')}
          </div>
          
          <div class="totals">
            <div class="total-line">
              <span>Subtotal:</span>
              <span>₦${orderData.subtotal.toLocaleString()}</span>
            </div>
            ${
              orderData.discount > 0
                ? `<div class="total-line">
                <span>Discount:</span>
                <span>-₦${orderData.discount.toLocaleString()}</span>
              </div>`
                : ''
            }
            ${
              orderData.taxAmount > 0
                ? `<div class="total-line">
                <span>Tax:</span>
                <span>₦${orderData.taxAmount.toLocaleString()}</span>
              </div>`
                : ''
            }
            <div class="total-line grand-total">
              <span>Total:</span>
              <span>₦${orderData.total.toLocaleString()}</span>
            </div>
            <div class="total-line">
              <span>Paid (${orderData.paymentMethod}):</span>
              <span>₦${amountPaid.toLocaleString()}</span>
            </div>
            ${
              change > 0
                ? `<div class="total-line">
                <span>Change:</span>
                <span>₦${change.toLocaleString()}</span>
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

  // Safely get creator name
  const creatorName = orderData.createdBy
    ? `${orderData.createdBy.firstName || ''} ${orderData.createdBy.lastName || ''}`.trim()
    : 'Staff';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Receipt & Invoice</DialogTitle>
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
                <span>{creatorName}</span>
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
                    <span>₦{line.total.toLocaleString()}</span>
                  </div>
                  <div className="text-xs text-gray-500 ml-2">
                    {line.quantity} x ₦{line.unitPrice.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>

            <Separator className="my-2" />

            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>₦{orderData.subtotal.toLocaleString()}</span>
              </div>
              {orderData.discount > 0 && (
                <div className="flex justify-between text-red-600">
                  <span>Discount:</span>
                  <span>-₦{orderData.discount.toLocaleString()}</span>
                </div>
              )}
              {orderData.taxAmount > 0 && (
                <div className="flex justify-between">
                  <span>Tax:</span>
                  <span>₦{orderData.taxAmount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-base border-t pt-1">
                <span>Total:</span>
                <span>₦{orderData.total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Paid ({orderData.paymentMethod}):</span>
                <span>₦{amountPaid.toLocaleString()}</span>
              </div>
              {change > 0 && (
                <div className="flex justify-between">
                  <span>Change:</span>
                  <span>₦{change.toLocaleString()}</span>
                </div>
              )}
            </div>

            <div className="text-center mt-4 text-xs">
              <p>Thank you for your business!</p>
              <p>Please come again</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" onClick={handlePrint} disabled={printing}>
              <Printer className="h-4 w-4 mr-2" />
              {printing ? 'Printing...' : 'Print Receipt'}
            </Button>

            <Button variant="outline" onClick={handleDownloadPDF} disabled={generatingPDF}>
              <FileText className="h-4 w-4 mr-2" />
              {generatingPDF ? 'Generating...' : 'Download PDF'}
            </Button>

            {orderData.customer?.email && (
              <Button variant="outline" onClick={handleEmail} disabled={emailing}>
                <Mail className="h-4 w-4 mr-2" />
                {emailing ? 'Sending...' : 'Email Invoice'}
              </Button>
            )}

            <Button variant="outline" onClick={handleDownloadHTML}>
              <Download className="h-4 w-4 mr-2" />
              Download HTML
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
