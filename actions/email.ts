'use server';

import { Resend } from 'resend';
import { db } from '@/prisma/db';
import PurchaseOrderEmail from '@/emails/purchase-order-email';
import { format } from 'date-fns';

// Initialize Resend with your API key
const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendPurchaseOrderEmail(purchaseOrderId: string) {
  try {
    // Get the purchase order with all related data
    const purchaseOrder = await db.purchaseOrder.findUnique({
      where: {
        id: purchaseOrderId,
      },
      include: {
        supplier: true,
        deliveryLocation: true,
        lines: {
          include: {
            item: true,
          },
        },
      },
    });

    if (!purchaseOrder) {
      return {
        success: false,
        error: 'Purchase order not found',
      };
    }

    // Log supplier data to debug
    console.log('Supplier data:', purchaseOrder.supplier);

    // Check if supplier has an email
    if (!purchaseOrder.supplier.email) {
      return {
        success: false,
        error: "Supplier email not found. Please update the supplier's email address.",
      };
    }

    // Format the data for the email template
    const emailData = {
      companyName: 'IzuInventory',
      poNumber: purchaseOrder.poNumber,
      orderDate: format(new Date(purchaseOrder.date), 'MMMM d, yyyy'),
      deliveryDate: purchaseOrder.expectedDeliveryDate
        ? format(new Date(purchaseOrder.expectedDeliveryDate), 'MMMM d, yyyy')
        : null,
      totalAmount: purchaseOrder.total.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
      supplierName: purchaseOrder.supplier.name,
      supplierContact: `${purchaseOrder.supplier.contactPerson || 'Contact'} - ${
        purchaseOrder.supplier.email
      }`,
      deliveryAddress:
        purchaseOrder.deliveryLocation.address || purchaseOrder.deliveryLocation.name,
      items: purchaseOrder.lines.map((line) => ({
        name: line.item.name,
        quantity: line.quantity,
        unitPrice: Number(line.unitPrice),
        total: Number(line.total),
      })),
      buyerEmail: 'izunwaonu2@gmail.com',
      companyAddress: '123 Business Street, Suite 100, Business City, BC 12345',
      companyPhone: '+1 (555) 123-4567',
      notes: purchaseOrder.notes || undefined,
    };

    // Send the email
    const { data: emailResponse, error: emailError } = await resend.emails.send({
      from: 'IzuInventory <izu@inventory.mirronet.com>',
      to: purchaseOrder.supplier.email,
      subject: `Purchase Order: ${purchaseOrder.poNumber} - Action Required`,
      react: PurchaseOrderEmail(emailData),
    });

    if (emailError) {
      console.error('❌ Email sending failed:', String(emailError));
      return {
        success: false,
        error: `Failed to send email: ${emailError.message || 'Unknown error'}`,
      };
    }

    console.log('✅ Email sent successfully:', emailResponse?.id);

    return {
      success: true,
      data: {
        emailId: emailResponse?.id,
        sentTo: purchaseOrder.supplier.email,
      },
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('Error sending purchase order email:', errorMessage);
    return {
      success: false,
      error: 'Failed to send purchase order email. Please try again.',
    };
  }
}
