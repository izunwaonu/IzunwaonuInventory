import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
  Row,
  Column,
} from '@react-email/components';

interface InvoiceEmailProps {
  companyName: string;
  companyLogo: string;
  companyAddress: string;
  companyEmail: string;
  companyPhone: string;
  orderNumber: string;
  orderDate: string;
  orderTime: string;
  totalAmount: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  locationName: string;
  locationAddress: string;
  createdByName: string;
  createdByEmail: string;
  paymentMethod: string;
  items: Array<{
    name: string;
    sku: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }>;
  subtotal: number;
  discount: number;
  taxAmount: number;
  total: number;
  notes: string;
}

export default function InvoiceEmail({
  companyName = 'Your Company',
  companyLogo = '/logo.png',
  companyAddress = '',
  companyEmail = '',
  companyPhone = '',
  orderNumber = 'INV-001',
  orderDate = '',
  orderTime = '',
  totalAmount = '0',
  customerName = 'Customer',
  customerEmail = '',
  customerPhone = '',
  customerAddress = '',
  locationName = '',
  locationAddress = '',
  createdByName = 'Staff',
  createdByEmail = '',
  paymentMethod = 'Cash',
  items = [],
  subtotal = 0,
  discount = 0,
  taxAmount = 0,
  total = 0,
  notes = '',
}: InvoiceEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Invoice {orderNumber} - Thank you for your purchase</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Img src={companyLogo} width="80" height="80" alt={companyName} style={logo} />
            <Heading style={companyNameStyle}>{companyName}</Heading>
            {companyAddress && <Text style={addressText}>{companyAddress}</Text>}
            {companyPhone && <Text style={contactText}>Phone: {companyPhone}</Text>}
            {companyEmail && (
              <Text style={contactText}>
                Email: <Link href={`mailto:${companyEmail}`}>{companyEmail}</Link>
              </Text>
            )}
          </Section>

          {/* Invoice Details */}
          <Section style={invoiceSection}>
            <Row>
              <Column style={leftColumn}>
                <Heading style={sectionHeading}>Bill To:</Heading>
                <Text style={customerText}>{customerName}</Text>
                {customerEmail && <Text style={customerText}>{customerEmail}</Text>}
                {customerPhone && <Text style={customerText}>{customerPhone}</Text>}
                {customerAddress && <Text style={customerText}>{customerAddress}</Text>}
              </Column>
              <Column style={rightColumn}>
                <Heading style={sectionHeading}>Invoice Details:</Heading>
                <Text style={invoiceText}>Invoice #: {orderNumber}</Text>
                <Text style={invoiceText}>Date: {orderDate}</Text>
                <Text style={invoiceText}>Time: {orderTime}</Text>
                <Text style={invoiceText}>Cashier: {createdByName}</Text>
                <Text style={invoiceText}>Location: {locationName}</Text>
              </Column>
            </Row>
          </Section>

          {/* Items Table */}
          <Section style={tableSection}>
            <Heading style={sectionHeading}>Items Purchased:</Heading>
            <table style={table}>
              <thead>
                <tr style={tableHeader}>
                  <th style={tableHeaderCell}>Item</th>
                  <th style={tableHeaderCell}>Qty</th>
                  <th style={tableHeaderCell}>Price</th>
                  <th style={tableHeaderCell}>Total</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr key={index} style={tableRow}>
                    <td style={tableCell}>
                      {item.name}
                      <br />
                      <span style={skuText}>SKU: {item.sku}</span>
                    </td>
                    <td style={tableCellCenter}>{item.quantity}</td>
                    <td style={tableCellCenter}>NGN{item.unitPrice.toLocaleString()}</td>
                    <td style={tableCellCenter}>NGN{item.total.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Section>

          {/* Totals */}
          <Section style={totalsSection}>
            <Row>
              <Column style={totalsColumn}>
                <table style={totalsTable}>
                  <tr>
                    <td style={totalsLabel}>Subtotal:</td>
                    <td style={totalsValue}>NGN{subtotal.toLocaleString()}</td>
                  </tr>
                  {discount > 0 && (
                    <tr>
                      <td style={totalsLabel}>Discount:</td>
                      {/* <td style={[totalsValue, { color: "#d32f2f" }]}>-NGN{discount.toLocaleString()}</td>
                       */}
                      <td style={{ ...totalsValue, color: '#d32f2f' }}>
                        -NGN{discount.toLocaleString()}
                      </td>
                    </tr>
                  )}
                  {taxAmount > 0 && (
                    <tr>
                      <td style={totalsLabel}>Tax:</td>
                      <td style={totalsValue}>NGN{taxAmount.toLocaleString()}</td>
                    </tr>
                  )}
                  <tr style={grandTotalRow}>
                    <td style={grandTotalLabel}>Total:</td>
                    <td style={grandTotalValue}>NGN{total.toLocaleString()}</td>
                  </tr>
                </table>
              </Column>
            </Row>
          </Section>

          {/* Payment Info */}
          <Section style={paymentSection}>
            <Heading style={sectionHeading}>Payment Information:</Heading>
            <Text style={paymentText}>Payment Method: {paymentMethod}</Text>
            <Text style={paymentText}>Status: Paid</Text>
          </Section>

          {/* Notes */}
          {notes && (
            <Section style={notesSection}>
              <Heading style={sectionHeading}>Notes:</Heading>
              <Text style={notesText}>{notes}</Text>
            </Section>
          )}

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>Thank you for your business!</Text>
            <Text style={footerText}>
              If you have any questions about this invoice, please contact us at{' '}
              <Link href={`mailto:${companyEmail}`}>{companyEmail}</Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// Styles
const main = {
  backgroundColor: '#f6f9fc',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
};

const header = {
  textAlign: 'center' as const,
  padding: '20px 0',
  borderBottom: '2px solid #007bff',
  marginBottom: '20px',
};

const logo = {
  margin: '0 auto 10px',
};

const companyNameStyle = {
  color: '#ff1493',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '0 0 10px',
};

const addressText = {
  color: '#666',
  fontSize: '14px',
  margin: '2px 0',
};

const contactText = {
  color: '#007bff',
  fontSize: '14px',
  margin: '2px 0',
};

const invoiceSection = {
  padding: '20px',
  backgroundColor: '#e0f7fa',
  borderRadius: '5px',
  marginBottom: '20px',
};

const leftColumn = {
  width: '50%',
  paddingRight: '10px',
};

const rightColumn = {
  width: '50%',
  paddingLeft: '10px',
};

const sectionHeading = {
  color: '#007bff',
  fontSize: '16px',
  fontWeight: 'bold',
  margin: '0 0 10px',
};

const customerText = {
  color: '#333',
  fontSize: '14px',
  margin: '2px 0',
};

const invoiceText = {
  color: '#333',
  fontSize: '14px',
  margin: '2px 0',
};

const tableSection = {
  marginBottom: '20px',
};

const table = {
  width: '100%',
  borderCollapse: 'collapse' as const,
  border: '1px solid #ddd',
};

const tableHeader = {
  backgroundColor: '#007bff',
};

const tableHeaderCell = {
  color: '#fff',
  padding: '12px',
  textAlign: 'center' as const,
  fontWeight: 'bold',
  border: '1px solid #ddd',
};

const tableRow = {
  borderBottom: '1px solid #ddd',
};

const tableCell = {
  padding: '12px',
  border: '1px solid #ddd',
  fontSize: '14px',
};

const tableCellCenter = {
  padding: '12px',
  border: '1px solid #ddd',
  textAlign: 'center' as const,
  fontSize: '14px',
};

const skuText = {
  color: '#666',
  fontSize: '12px',
};

const totalsSection = {
  marginBottom: '20px',
};

const totalsColumn = {
  width: '100%',
  textAlign: 'right' as const,
};

const totalsTable = {
  marginLeft: 'auto',
  borderCollapse: 'collapse' as const,
};

const totalsLabel = {
  padding: '5px 20px 5px 0',
  fontSize: '14px',
  color: '#333',
};

const totalsValue = {
  padding: '5px 0',
  fontSize: '14px',
  color: '#333',
  textAlign: 'right' as const,
};

const grandTotalRow = {
  borderTop: '2px solid #007bff',
};

const grandTotalLabel = {
  padding: '10px 20px 10px 0',
  fontSize: '16px',
  fontWeight: 'bold',
  color: '#ff1493',
};

const grandTotalValue = {
  padding: '10px 0',
  fontSize: '16px',
  fontWeight: 'bold',
  color: '#ff1493',
  textAlign: 'right' as const,
};

const paymentSection = {
  backgroundColor: '#e8f5e9',
  padding: '15px',
  borderRadius: '5px',
  marginBottom: '20px',
};

const paymentText = {
  color: '#333',
  fontSize: '14px',
  margin: '2px 0',
};

const notesSection = {
  backgroundColor: '#fff3cd',
  padding: '15px',
  borderRadius: '5px',
  marginBottom: '20px',
};

const notesText = {
  color: '#333',
  fontSize: '14px',
  margin: '0',
};

const footer = {
  textAlign: 'center' as const,
  padding: '20px 0',
  borderTop: '1px solid #ddd',
  marginTop: '20px',
};

const footerText = {
  color: '#666',
  fontSize: '14px',
  margin: '5px 0',
};
