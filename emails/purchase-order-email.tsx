import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Row,
  Column,
  Text,
  Heading,
  Button,
  Tailwind,
} from '@react-email/components';

interface PurchaseOrderEmailProps {
  companyName: string;
  poNumber: string;
  orderDate: string;
  deliveryDate: string | null;
  totalAmount: string;
  supplierName: string;
  supplierContact: string;
  deliveryAddress: string;
  createdByName: string;
  createdByEmail: string;
  items: Array<{
    name: string;
    sku: string | null;
    quantity: number;
    unitPrice: number;
    total: number;
  }>;
  buyerEmail: string;
  companyAddress: string;
  companyPhone: string;
  notes?: string;
}

export default function PurchaseOrderEmail({
  companyName,
  poNumber,
  orderDate,
  deliveryDate,
  totalAmount,
  supplierName,
  supplierContact,
  deliveryAddress,
  createdByName,
  createdByEmail,
  items,
  buyerEmail,
  companyAddress,
  companyPhone,
  notes,
}: PurchaseOrderEmailProps) {
  const subtotal = items.reduce((sum, item) => sum + item.total, 0);

  return (
    <Html lang="en" dir="ltr">
      <Tailwind>
        <Head />
        <Body className="bg-gray-50 font-sans">
          <Container className="bg-white max-w-[600px] mx-auto my-8 shadow-lg">
            {/* Header */}
            <Section className="bg-slate-900 text-white p-8">
              <Row>
                <Column className="w-2/3">
                  <Heading className="text-2xl font-bold m-0 mb-2">{companyName}</Heading>
                  <Text className="text-slate-300 text-sm m-0">{companyAddress}</Text>
                  <Text className="text-slate-300 text-sm m-0">Phone: {companyPhone}</Text>
                </Column>
                <Column className="w-1/3 text-right">
                  <Text className="text-slate-300 text-sm m-0 mb-1">PURCHASE ORDER</Text>
                  <Text className="text-white text-xl font-bold m-0">{poNumber}</Text>
                </Column>
              </Row>
            </Section>

            {/* Order Information */}
            <Section className="p-8 pb-4">
              <Row>
                <Column className="w-1/2 pr-4">
                  <Text className="text-slate-600 text-xs font-semibold uppercase tracking-wide m-0 mb-2">
                    Bill To
                  </Text>
                  <Text className="text-slate-900 font-semibold text-sm m-0 mb-1">
                    {supplierName}
                  </Text>
                  <Text className="text-slate-600 text-sm m-0">{supplierContact}</Text>
                </Column>
                <Column className="w-1/2 pl-4">
                  <Text className="text-slate-600 text-xs font-semibold uppercase tracking-wide m-0 mb-2">
                    Ship To
                  </Text>
                  <Text className="text-slate-900 font-semibold text-sm m-0 mb-1">
                    {companyName}
                  </Text>
                  <Text className="text-slate-600 text-sm m-0">{deliveryAddress}</Text>
                </Column>
              </Row>
            </Section>

            {/* Order Details */}
            <Section className="px-8 pb-6">
              <Row>
                <Column className="w-1/3">
                  <Text className="text-slate-600 text-xs font-semibold uppercase tracking-wide m-0 mb-1">
                    Order Date
                  </Text>
                  <Text className="text-slate-900 text-sm m-0">{orderDate}</Text>
                </Column>
                <Column className="w-1/3">
                  <Text className="text-slate-600 text-xs font-semibold uppercase tracking-wide m-0 mb-1">
                    Delivery Date
                  </Text>
                  <Text className="text-slate-900 text-sm m-0">{deliveryDate || 'TBD'}</Text>
                </Column>
                <Column className="w-1/3">
                  <Text className="text-slate-600 text-xs font-semibold uppercase tracking-wide m-0 mb-1">
                    Created By
                  </Text>
                  <Text className="text-slate-900 text-sm m-0">{createdByName}</Text>
                </Column>
              </Row>
            </Section>

            {/* Items Table */}
            <Section className="px-8">
              {/* Table Header */}
              <div className="bg-slate-100 border-y border-slate-200">
                <Row className="py-3 px-4">
                  <Column className="w-2/5">
                    <Text className="text-slate-700 text-xs font-semibold uppercase tracking-wide m-0">
                      Description
                    </Text>
                  </Column>
                  <Column className="w-1/5 text-center">
                    <Text className="text-slate-700 text-xs font-semibold uppercase tracking-wide m-0">
                      Qty
                    </Text>
                  </Column>
                  <Column className="w-1/5 text-right">
                    <Text className="text-slate-700 text-xs font-semibold uppercase tracking-wide m-0">
                      Rate
                    </Text>
                  </Column>
                  <Column className="w-1/5 text-right">
                    <Text className="text-slate-700 text-xs font-semibold uppercase tracking-wide m-0">
                      Amount
                    </Text>
                  </Column>
                </Row>
              </div>

              {/* Table Rows */}
              {items.map((item, index) => (
                <div
                  key={index}
                  className={`border-b border-slate-200 ${index % 2 === 1 ? 'bg-slate-50' : ''}`}
                >
                  <Row className="py-4 px-4">
                    <Column className="w-2/5">
                      <Text className="text-slate-900 text-sm font-medium m-0">{item.name}</Text>
                      {item.sku && (
                        <Text className="text-slate-500 text-xs m-0 mt-1">SKU: {item.sku}</Text>
                      )}
                    </Column>
                    <Column className="w-1/5 text-center">
                      <Text className="text-slate-900 text-sm m-0">{item.quantity}</Text>
                    </Column>
                    <Column className="w-1/5 text-right">
                      <Text className="text-slate-900 text-sm m-0">
                        ${item.unitPrice.toFixed(2)}
                      </Text>
                    </Column>
                    <Column className="w-1/5 text-right">
                      <Text className="text-slate-900 text-sm font-medium m-0">
                        ${item.total.toFixed(2)}
                      </Text>
                    </Column>
                  </Row>
                </div>
              ))}
            </Section>

            {/* Total */}
            <Section className="px-8 py-6">
              <Row>
                <Column className="w-3/5"></Column>
                <Column className="w-2/5">
                  <div className="border-t border-slate-200 pt-4">
                    <Row>
                      <Column className="w-1/2">
                        <Text className="text-slate-600 text-sm m-0">Subtotal:</Text>
                      </Column>
                      <Column className="w-1/2 text-right">
                        <Text className="text-slate-900 text-sm m-0">${subtotal.toFixed(2)}</Text>
                      </Column>
                    </Row>
                    <Row className="mt-2">
                      <Column className="w-1/2">
                        <Text className="text-slate-900 text-lg font-bold m-0">Total:</Text>
                      </Column>
                      <Column className="w-1/2 text-right">
                        <Text className="text-slate-900 text-lg font-bold m-0">${totalAmount}</Text>
                      </Column>
                    </Row>
                  </div>
                </Column>
              </Row>
            </Section>

            {/* Notes */}
            {notes && (
              <Section className="px-8 py-4 bg-amber-50 border-l-4 border-amber-400">
                <Text className="text-amber-800 text-xs font-semibold uppercase tracking-wide m-0 mb-2">
                  Notes
                </Text>
                <Text className="text-amber-700 text-sm m-0">{notes}</Text>
              </Section>
            )}

            {/* Action Buttons */}
            <Section className="px-8 py-6 bg-slate-50 text-center">
              <Text className="text-slate-600 text-sm m-0 mb-4">
                Please confirm receipt of this purchase order and provide delivery confirmation.
              </Text>
              <Row>
                <Column className="w-1/2 pr-2">
                  <Button
                    href={`mailto:${createdByEmail}?subject=PO ${poNumber} - Confirmed&body=Dear ${createdByName},%0D%0A%0D%0AWe confirm receipt of Purchase Order ${poNumber}.%0D%0A%0D%0AEstimated delivery: [Please specify]%0D%0A%0D%0AThank you for your business.%0D%0A%0D%0ABest regards,%0D%0A${supplierName}`}
                    className="bg-green-600 text-white px-6 py-3 rounded text-sm font-medium w-full"
                  >
                    Confirm Order
                  </Button>
                </Column>
                <Column className="w-1/2 pl-2">
                  <Button
                    href={`mailto:${createdByEmail}?subject=PO ${poNumber} - Questions&body=Dear ${createdByName},%0D%0A%0D%0ARegarding Purchase Order ${poNumber}, we have the following questions:%0D%0A%0D%0A[Your questions here]%0D%0A%0D%0ABest regards,%0D%0A${supplierName}`}
                    className="bg-slate-600 text-white px-6 py-3 rounded text-sm font-medium w-full"
                  >
                    Ask Questions
                  </Button>
                </Column>
              </Row>
            </Section>

            {/* Footer */}
            <Section className="px-8 py-4 bg-slate-900 text-center">
              <Text className="text-slate-400 text-xs m-0">
                This is an automated message from {companyName}. Please do not reply to this email.
              </Text>
              <Text className="text-slate-400 text-xs m-0 mt-1">
                For questions, contact {createdByName} at {createdByEmail}
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
