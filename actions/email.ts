'use server';

import { Resend } from 'resend';
import { db } from '@/prisma/db';
import PurchaseOrderEmail from '@/emails/purchase-order-email';
import { format } from 'date-fns';
import { updatePurchaseOrderStatus } from './purchase-orders';
import { getAuthenticatedUser } from '@/config/useAuth';
import InvoiceEmail from '@/emails/invoice-email';

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
        CreatedBy: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
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

    // Auto-update status from DRAFT to SUBMITTED when email is sent
    if (purchaseOrder.status === 'DRAFT') {
      await updatePurchaseOrderStatus(purchaseOrderId, 'SUBMITTED');
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
      createdByName: purchaseOrder.CreatedBy
        ? `${purchaseOrder.CreatedBy.firstName} ${purchaseOrder.CreatedBy.lastName}`
        : 'System',
      createdByEmail: purchaseOrder.CreatedBy?.email || 'contact@izuinventory.com',
      items: purchaseOrder.lines.map((line) => ({
        name: line.item.name,
        sku: line.item.sku,
        quantity: line.quantity,
        unitPrice: Number(line.unitPrice),
        total: Number(line.total),
      })),
      buyerEmail: 'contact@izuinventory.com',
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

export async function sendInvoiceEmail(orderId: string) {
  try {
    const user = await getAuthenticatedUser();
    const orgId = user.orgId;

    // Get the sales order with all related data
    const order = await db.salesOrder.findFirst({
      where: {
        id: orderId,
        orgId,
      },
      include: {
        customer: true,
        organization: true,
        location: true,
        createdBy: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        lines: {
          include: {
            item: {
              select: {
                name: true,
                sku: true,
              },
            },
          },
        },
      },
    });

    if (!order) {
      return {
        success: false,
        error: 'Order not found',
      };
    }

    // Check if customer has an email
    if (!order.customer?.email) {
      return {
        success: false,
        error: "Customer email not found. Please update the customer's email address.",
      };
    }

    // Format the data for the email template
    const emailData = {
      companyName: order.organization.name,
      companyLogo: '/logo.png',
      companyAddress: order.organization.address || '',
      companyEmail: 'izunwaonu2@gmail.com',
      companyPhone: '+2348138390681',
      orderNumber: order.orderNumber,
      orderDate: new Date(order.date).toLocaleDateString(),
      orderTime: new Date(order.date).toLocaleTimeString(),
      totalAmount: order.total.toLocaleString(),
      customerName: order.customer.name,
      customerEmail: order.customer.email,
      customerPhone: order.customer.phone || '',
      customerAddress: order.customer.address || '',
      locationName: order.location.name,
      locationAddress: order.location.address || '',
      createdByName: order.createdBy
        ? `${order.createdBy.firstName} ${order.createdBy.lastName}`
        : 'Staff',
      createdByEmail: order.createdBy?.email || '',
      paymentMethod: order.paymentMethod || 'Cash',
      items: order.lines.map((line) => ({
        name: line.item.name,
        sku: line.item.sku,
        quantity: line.quantity,
        unitPrice: Number(line.unitPrice),
        total: Number(line.total),
      })),
      subtotal: Number(order.subtotal),
      discount: Number(order.discount || 0),
      taxAmount: Number(order.taxAmount || 0),
      total: Number(order.total),
      notes: order.notes || '',
    };

    // Send the email
    const { data: emailResponse, error: emailError } = await resend.emails.send({
      from: `${order.organization.name} <noreply@${process.env.DOMAIN || 'izunwaonu2@gmail.com'}>`,
      to: order.customer.email,
      subject: `Invoice: ${order.orderNumber} - Thank you for your purchase`,
      react: InvoiceEmail(emailData),
    });

    if (emailError) {
      console.error('❌ Email sending failed:', String(emailError));
      return {
        success: false,
        error: `Failed to send email: ${emailError.message || 'Unknown error'}`,
      };
    }

    console.log('✅ Invoice email sent successfully:', emailResponse?.id);

    return {
      success: true,
      data: {
        emailId: emailResponse?.id,
        sentTo: order.customer.email,
      },
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('Error sending invoice email:', errorMessage);
    return {
      success: false,
      error: 'Failed to send invoice email. Please try again.',
    };
  }
}
