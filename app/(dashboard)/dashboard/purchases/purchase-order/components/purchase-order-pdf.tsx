'use client';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFViewer,
  PDFDownloadLink,
  Image,
} from '@react-pdf/renderer';
import { format } from 'date-fns';

interface PurchaseOrderData {
  id: string;
  poNumber: string;
  date: string;
  status: string;
  subtotal: number;
  taxAmount: number;
  shippingCost: number | null;
  discount: number | null;
  total: number;
  notes: string | null;
  paymentTerms: string | null;
  expectedDeliveryDate: string | null;
  supplier: {
    id: string;
    name: string;
    email: string | null;
    contactPerson: string | null;
    phone: string | null;
  };
  deliveryLocation: {
    id: string;
    name: string;
    address: string | null;
  };
  lines: Array<{
    id: string;
    quantity: number;
    unitPrice: number;
    total: number;
    item: {
      id: string;
      name: string;
      sku: string | null;
    };
  }>;
}

// Professional PDF styles - simplified for one page
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 0,
    fontFamily: 'Helvetica',
  },
  letterhead: {
    backgroundColor: '#1E40AF',
    padding: 20,
    color: '#FFFFFF',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    width: 60,
    height: 60,
  },
  companyInfo: {
    alignItems: 'flex-end',
  },
  companyName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 3,
  },
  companyTagline: {
    fontSize: 10,
    opacity: 0.9,
  },
  poTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 10,
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1E40AF',
    marginBottom: 8,
    paddingBottom: 3,
    borderBottom: '1px solid #E2E8F0',
  },
  infoGrid: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  infoColumn: {
    flex: 1,
    marginRight: 10,
  },
  infoLabel: {
    fontSize: 8,
    color: '#64748B',
    marginBottom: 2,
    fontWeight: 'bold',
  },
  infoValue: {
    fontSize: 10,
    color: '#0F172A',
    marginBottom: 4,
  },
  table: {
    marginTop: 5,
    marginBottom: 10,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#1E40AF',
    color: '#FFFFFF',
    padding: 8,
    fontSize: 9,
    fontWeight: 'bold',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    padding: 6,
    fontSize: 9,
  },
  tableRowEven: {
    backgroundColor: '#F8FAFC',
  },
  tableCol1: {
    flex: 3,
  },
  tableCol2: {
    flex: 1,
    textAlign: 'center',
  },
  tableCol3: {
    flex: 1,
    textAlign: 'right',
  },
  tableCol4: {
    flex: 1,
    textAlign: 'right',
  },
  summaryContainer: {
    marginTop: 10,
    alignItems: 'flex-end',
  },
  summaryRow: {
    flexDirection: 'row',
    marginBottom: 3,
  },
  summaryLabel: {
    fontSize: 9,
    color: '#64748B',
    width: 80,
    textAlign: 'right',
    marginRight: 10,
  },
  summaryValue: {
    fontSize: 9,
    color: '#0F172A',
    width: 80,
    textAlign: 'right',
  },
  totalRow: {
    flexDirection: 'row',
    marginTop: 3,
    paddingTop: 3,
    borderTopWidth: 1,
    borderTopColor: '#1E40AF',
  },
  totalLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#1E40AF',
    width: 80,
    textAlign: 'right',
    marginRight: 10,
  },
  totalValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1E40AF',
    width: 80,
    textAlign: 'right',
  },
  notes: {
    fontSize: 9,
    color: '#4B5563',
    marginTop: 10,
    padding: 8,
    backgroundColor: '#FFFBEB',
    borderRadius: 4,
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    textAlign: 'center',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingTop: 10,
  },
  footerText: {
    fontSize: 8,
    color: '#94A3B8',
    textAlign: 'center',
  },
});

// PDF Document Component
const PurchaseOrderPDF = ({ purchaseOrder }: { purchaseOrder: PurchaseOrderData }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Letterhead */}
      <View style={styles.letterhead}>
        <View style={styles.headerContent}>
          <View>
            <Image style={styles.logo} src="/logo.png" />
          </View>
          <View style={styles.companyInfo}>
            <Text style={styles.companyName}>IzuInventory</Text>
            <Text style={styles.companyTagline}>Professional Inventory Management</Text>
          </View>
        </View>
        <Text style={styles.poTitle}>PURCHASE ORDER: {purchaseOrder.poNumber}</Text>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Order & Supplier Information */}
        <View style={styles.infoGrid}>
          <View style={styles.infoColumn}>
            <Text style={styles.sectionTitle}>Order Information</Text>
            <Text style={styles.infoLabel}>ORDER DATE</Text>
            <Text style={styles.infoValue}>
              {format(new Date(purchaseOrder.date), 'MMMM dd, yyyy')}
            </Text>

            <Text style={styles.infoLabel}>EXPECTED DELIVERY</Text>
            <Text style={styles.infoValue}>
              {purchaseOrder.expectedDeliveryDate
                ? format(new Date(purchaseOrder.expectedDeliveryDate), 'MMMM dd, yyyy')
                : 'To be confirmed'}
            </Text>

            <Text style={styles.infoLabel}>STATUS</Text>
            <Text style={styles.infoValue}>{purchaseOrder.status.replace('_', ' ')}</Text>

            <Text style={styles.infoLabel}>PAYMENT TERMS</Text>
            <Text style={styles.infoValue}>{purchaseOrder.paymentTerms || 'Net 30'}</Text>
          </View>

          <View style={styles.infoColumn}>
            <Text style={styles.sectionTitle}>Supplier Information</Text>
            <Text style={styles.infoLabel}>SUPPLIER</Text>
            <Text style={styles.infoValue}>{purchaseOrder.supplier.name}</Text>

            {purchaseOrder.supplier.contactPerson && (
              <>
                <Text style={styles.infoLabel}>CONTACT PERSON</Text>
                <Text style={styles.infoValue}>{purchaseOrder.supplier.contactPerson}</Text>
              </>
            )}

            {purchaseOrder.supplier.email && (
              <>
                <Text style={styles.infoLabel}>EMAIL</Text>
                <Text style={styles.infoValue}>{purchaseOrder.supplier.email}</Text>
              </>
            )}

            {purchaseOrder.supplier.phone && (
              <>
                <Text style={styles.infoLabel}>PHONE</Text>
                <Text style={styles.infoValue}>{purchaseOrder.supplier.phone}</Text>
              </>
            )}
          </View>
        </View>

        {/* Delivery Location */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delivery Location</Text>
          <Text style={styles.infoValue}>{purchaseOrder.deliveryLocation.name}</Text>
          {purchaseOrder.deliveryLocation.address && (
            <Text style={styles.infoValue}>{purchaseOrder.deliveryLocation.address}</Text>
          )}
        </View>

        {/* Items Table */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Items</Text>
          <View style={styles.table}>
            {/* Table Header */}
            <View style={styles.tableHeader}>
              <Text style={styles.tableCol1}>Item Description</Text>
              <Text style={styles.tableCol2}>Quantity</Text>
              <Text style={styles.tableCol3}>Unit Price(NGN)</Text>
              <Text style={styles.tableCol4}>Total (NGN)</Text>
            </View>

            {/* Table Rows */}
            {purchaseOrder.lines.map((line, index) => (
              <View
                key={line.id}
                style={[styles.tableRow, index % 2 === 1 ? styles.tableRowEven : {}]}
              >
                <View style={styles.tableCol1}>
                  <Text>{line.item.name}</Text>
                  {line.item.sku && (
                    <Text style={{ fontSize: 8, color: '#64748B' }}>SKU: {line.item.sku}</Text>
                  )}
                </View>
                <Text style={styles.tableCol2}>{line.quantity}</Text>
                <Text style={styles.tableCol3}>{Number(line.unitPrice).toFixed(2)}</Text>
                <Text style={styles.tableCol4}>{Number(line.total).toFixed(2)}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Order Summary */}
        <View style={styles.summaryContainer}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal:</Text>
            <Text style={styles.summaryValue}>NGN{Number(purchaseOrder.subtotal).toFixed(2)}</Text>
          </View>

          {purchaseOrder.discount && Number(purchaseOrder.discount) > 0 && (
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Discount:</Text>
              <Text style={[styles.summaryValue, { color: '#059669' }]}>
                -NGN{Number(purchaseOrder.discount).toFixed(2)}
              </Text>
            </View>
          )}

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Tax:</Text>
            <Text style={styles.summaryValue}>NGN{Number(purchaseOrder.taxAmount).toFixed(2)}</Text>
          </View>

          {purchaseOrder.shippingCost && Number(purchaseOrder.shippingCost) > 0 && (
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Shipping:</Text>
              <Text style={styles.summaryValue}>
                NGN{Number(purchaseOrder.shippingCost).toFixed(2)}
              </Text>
            </View>
          )}

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total:</Text>
            <Text style={styles.totalValue}>NGN{Number(purchaseOrder.total).toFixed(2)}</Text>
          </View>
        </View>

        {/* Notes */}
        {purchaseOrder.notes && (
          <View style={styles.notes}>
            <Text style={{ fontWeight: 'bold', marginBottom: 3 }}>Notes:</Text>
            <Text>{purchaseOrder.notes}</Text>
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Purchase Order {purchaseOrder.poNumber} • Generated on{' '}
            {format(new Date(), 'MMMM d, yyyy')}
          </Text>
          <Text style={styles.footerText}>
            IzuInventory • Email: contact@izuinventory.com • Phone: +1 (555) 123-4567
          </Text>
        </View>
      </View>
    </Page>
  </Document>
);

// PDF Viewer/Download Component
export const PurchaseOrderPDFViewer = ({
  purchaseOrder,
  mode = 'download',
}: {
  purchaseOrder: PurchaseOrderData;
  mode?: 'view' | 'download';
}) => {
  if (mode === 'view') {
    return (
      <PDFViewer style={{ width: '100%', height: '600px' }}>
        <PurchaseOrderPDF purchaseOrder={purchaseOrder} />
      </PDFViewer>
    );
  }

  return (
    <PDFDownloadLink
      document={<PurchaseOrderPDF purchaseOrder={purchaseOrder} />}
      fileName={`${purchaseOrder.poNumber}.pdf`}
      className="inline-flex items-center"
    >
      {({ blob, url, loading, error }) => (loading ? 'Generating PDF...' : 'Download PDF')}
    </PDFDownloadLink>
  );
};
