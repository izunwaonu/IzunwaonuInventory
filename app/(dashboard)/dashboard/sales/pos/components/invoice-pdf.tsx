import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    backgroundColor: '#fff',
    padding: 30,
    position: 'relative',
  },
  watermarkContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: -1,
  },
  watermark: {
    width: '70%',
    opacity: 0.07,
  },
  header: {
    textAlign: 'center',
    paddingBottom: 15,
    borderBottomWidth: 2,
    borderBottomColor: '#007bff',
    marginBottom: 20,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 10,
    alignSelf: 'center',
  },
  companyName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ff1493',
    marginBottom: 5,
  },
  address: {
    fontSize: 11,
    color: '#555',
    marginBottom: 2,
    textAlign: 'center',
  },
  contactInfo: {
    fontSize: 11,
    textAlign: 'center',
    color: '#007bff',
    marginBottom: 2,
  },
  combinedSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: '#e0f7fa',
    borderRadius: 5,
    marginBottom: 15,
  },
  leftColumn: {
    width: '48%',
  },
  rightColumn: {
    width: '48%',
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#007bff',
    marginBottom: 5,
  },
  sectionText: {
    fontSize: 11,
    color: '#333',
    marginBottom: 3,
  },
  table: {
    marginBottom: 15,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#007bff',
    paddingVertical: 8,
    paddingHorizontal: 5,
  },
  tableHeaderText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingVertical: 6,
    paddingHorizontal: 5,
  },
  tableCell: {
    fontSize: 11,
    textAlign: 'center',
    paddingHorizontal: 2,
  },
  qtyColumn: { width: '10%' },
  itemColumn: { width: '50%' },
  priceColumn: { width: '20%' },
  totalColumn: { width: '20%' },
  totalQuantityRow: {
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'right',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#000',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 10,
  },
  grandTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#ff1493',
    backgroundColor: '#ffe6f2',
    padding: 12,
    borderRadius: 5,
    marginBottom: 15,
  },
  paymentSection: {
    backgroundColor: '#e8f5e9',
    padding: 12,
    borderRadius: 5,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#4caf50',
  },
  paymentTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#007bff',
    marginBottom: 8,
  },
  paymentText: {
    fontSize: 11,
    color: '#333',
    marginBottom: 3,
  },
  locationSection: {
    backgroundColor: '#fff3cd',
    padding: 12,
    borderRadius: 5,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ffeaa7',
  },
  signatories: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 15,
  },
  signatureBlock: {
    alignItems: 'center',
    width: '45%',
  },
  signatureLine: {
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    width: '100%',
    height: 40,
    marginBottom: 5,
  },
  signatureText: {
    fontSize: 11,
    color: '#555',
    fontWeight: 'bold',
  },
  footer: {
    textAlign: 'center',
    fontSize: 11,
    color: '#555',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    paddingTop: 10,
    fontStyle: 'italic',
  },
});

interface InvoiceData {
  order: {
    id: string;
    orderNumber: string;
    date: string;
    customer?: {
      name: string;
      email?: string;
      phone?: string;
      address?: string;
    };
    organization: {
      name: string;
      address?: string;
      email?: string;
      phone?: string;
      logo?: string;
    };
    location: {
      name: string;
      address?: string;
    };
    createdBy: {
      firstName: string;
      lastName: string;
      email: string;
    };
    lines: Array<{
      item: {
        name: string;
        sku: string;
      };
      quantity: number;
      unitPrice: number;
      total: number;
    }>;
    subtotal: number;
    taxAmount: number;
    discount: number;
    total: number;
    paymentMethod: string;
    notes?: string;
  };
  amountPaid: number;
  change: number;
}

export default function InvoicePDF({ invoiceData }: { invoiceData: InvoiceData }) {
  const { order, amountPaid, change } = invoiceData;
  const totalQuantity = order.lines.reduce((sum, line) => sum + line.quantity, 0);
  const createdByName = `${order.createdBy.firstName} ${order.createdBy.lastName}`;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Watermark */}
        {order.organization.logo && (
          <View style={styles.watermarkContainer}>
            <Image src={order.organization.logo || '/placeholder.svg'} style={styles.watermark} />
          </View>
        )}

        {/* Header */}
        <View style={styles.header}>
          {order.organization.logo && (
            <Image src={order.organization.logo || '/placeholder.svg'} style={styles.logo} />
          )}
          <Text style={styles.companyName}>{order.organization.name}</Text>
          {order.organization.address && (
            <Text style={styles.address}>{order.organization.address}</Text>
          )}
          {order.organization.phone && (
            <Text style={styles.address}>Phone: {order.organization.phone}</Text>
          )}
          {order.organization.email && (
            <Text style={styles.contactInfo}>Email: {order.organization.email}</Text>
          )}
        </View>

        {/* Customer and Invoice Details */}
        <View style={styles.combinedSection}>
          <View style={styles.leftColumn}>
            <Text style={styles.sectionTitle}>Customer Details</Text>
            <Text style={styles.sectionText}>
              Customer: {order.customer?.name || 'Walk-in Customer'}
            </Text>
            {order.customer?.phone && (
              <Text style={styles.sectionText}>Phone: {order.customer.phone}</Text>
            )}
            {order.customer?.email && (
              <Text style={styles.sectionText}>Email: {order.customer.email}</Text>
            )}
            {order.customer?.address && (
              <Text style={styles.sectionText}>Address: {order.customer.address}</Text>
            )}
          </View>
          <View style={styles.rightColumn}>
            <Text style={styles.sectionTitle}>Invoice - Order #{order.orderNumber}</Text>
            <Text style={styles.sectionText}>
              Date: {new Date(order.date).toLocaleDateString()}
            </Text>
            <Text style={styles.sectionText}>
              Time: {new Date(order.date).toLocaleTimeString()}
            </Text>
            <Text style={styles.sectionText}>Cashier: {createdByName}</Text>
            <Text style={styles.sectionText}>Email: {order.createdBy.email}</Text>
          </View>
        </View>

        {/* Location Details */}
        <View style={styles.locationSection}>
          <Text style={styles.sectionTitle}>Location Details</Text>
          <Text style={styles.sectionText}>Location: {order.location.name}</Text>
          {order.location.address && (
            <Text style={styles.sectionText}>Address: {order.location.address}</Text>
          )}
        </View>

        {/* Items Table */}
        <View style={styles.table}>
          <Text style={[styles.sectionTitle, { marginBottom: 10 }]}>Order Items</Text>

          {/* Table Header */}
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderText, styles.qtyColumn]}>Qty</Text>
            <Text style={[styles.tableHeaderText, styles.itemColumn]}>Item Name</Text>
            <Text style={[styles.tableHeaderText, styles.priceColumn]}>Price</Text>
            <Text style={[styles.tableHeaderText, styles.totalColumn]}>Total</Text>
          </View>

          {/* Table Rows */}
          {order.lines.map((line, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.qtyColumn]}>{line.quantity}</Text>
              <Text style={[styles.tableCell, styles.itemColumn, { textAlign: 'left' }]}>
                {line.item.name}
                {line.item.sku && (
                  <Text style={{ fontSize: 9, color: '#666' }}> ({line.item.sku})</Text>
                )}
              </Text>
              <Text style={[styles.tableCell, styles.priceColumn]}>
                NGN{line.unitPrice.toLocaleString()}
              </Text>
              <Text style={[styles.tableCell, styles.totalColumn]}>
                NGN{line.total.toLocaleString()}
              </Text>
            </View>
          ))}

          {/* Total Quantity */}
          <Text style={styles.totalQuantityRow}>Total Quantity: {totalQuantity}</Text>
        </View>

        {/* Totals Section */}
        <View style={{ marginBottom: 15 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 }}>
            <Text style={styles.sectionText}>Subtotal:</Text>
            <Text style={styles.sectionText}>NGN{order.subtotal.toLocaleString()}</Text>
          </View>
          {order.discount > 0 && (
            <View
              style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 }}
            >
              <Text style={[styles.sectionText, { color: '#d32f2f' }]}>Discount:</Text>
              <Text style={[styles.sectionText, { color: '#d32f2f' }]}>
                -NGN{order.discount.toLocaleString()}
              </Text>
            </View>
          )}
          {order.taxAmount > 0 && (
            <View
              style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 }}
            >
              <Text style={styles.sectionText}>Tax:</Text>
              <Text style={styles.sectionText}>NGN{order.taxAmount.toLocaleString()}</Text>
            </View>
          )}
        </View>

        {/* Grand Total */}
        <Text style={styles.grandTotal}>Grand Total: NGN{order.total.toLocaleString()}</Text>

        {/* Payment Details */}
        <View style={styles.paymentSection}>
          <Text style={styles.paymentTitle}>Payment Details</Text>
          <Text style={styles.paymentText}>Payment Method: {order.paymentMethod}</Text>
          <Text style={styles.paymentText}>Amount Paid:NGN{amountPaid.toLocaleString()}</Text>
          {change > 0 && (
            <Text style={styles.paymentText}>Change Given: NGN{change.toLocaleString()}</Text>
          )}
        </View>

        {/* Notes */}
        {order.notes && (
          <View style={styles.locationSection}>
            <Text style={styles.sectionTitle}>Notes</Text>
            <Text style={styles.sectionText}>{order.notes}</Text>
          </View>
        )}

        {/* Signatures */}
        <View style={styles.signatories}>
          <View style={styles.signatureBlock}>
            <View style={styles.signatureLine} />
            <Text style={styles.signatureText}>Customer's Signature</Text>
          </View>
          <View style={styles.signatureBlock}>
            <View style={styles.signatureLine} />
            <Text style={styles.signatureText}>Cashier's Signature</Text>
          </View>
        </View>

        {/* Footer */}
        <Text style={styles.footer}>Thank you for your patronage, and may you remain blessed.</Text>
      </Page>
    </Document>
  );
}
