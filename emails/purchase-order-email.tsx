// import {
//   Html,
//   Head,
//   Body,
//   Container,
//   Section,
//   Row,
//   Column,
//   Text,
//   Heading,
//   Button,
//   Hr,
//   Tailwind,
// } from '@react-email/components';

// interface PurchaseOrderEmailProps {
//   companyName: string;
//   poNumber: string;
//   orderDate: string;
//   deliveryDate: string | null;
//   totalAmount: string;
//   supplierName: string;
//   supplierContact: string;
//   deliveryAddress: string;
//   items: Array<{
//     name: string;
//     quantity: number;
//     unitPrice: number;
//     total: number;
//   }>;
//   buyerEmail: string;
//   companyAddress: string;
//   companyPhone: string;
//   notes?: string;
// }

// export default function PurchaseOrderEmail({
//   companyName,
//   poNumber,
//   orderDate,
//   deliveryDate,
//   totalAmount,
//   supplierName,
//   supplierContact,
//   deliveryAddress,
//   items,
//   buyerEmail,
//   companyAddress,
//   companyPhone,
//   notes,
// }: PurchaseOrderEmailProps) {
//   return (
//     <Html lang="en" dir="ltr">
//       <Tailwind>
//         <Head />
//         <Body className="bg-gray-50 font-sans py-[20px] px-[10px] sm:py-[40px] sm:px-[20px]">
//           <Container className="bg-white max-w-[600px] mx-auto rounded-[12px] shadow-xl overflow-hidden border border-gray-200">
//             {/* Header */}
//             <Section className="bg-gradient-to-r from-blue-600 to-indigo-700 px-[20px] py-[32px] sm:px-[32px]">
//               <Heading className="text-white text-[24px] sm:text-[28px] font-bold m-0 text-center">
//                 Purchase Order
//               </Heading>
//               <Text className="text-blue-100 text-[14px] sm:text-[16px] text-center m-0 mt-[8px]">
//                 New order request from {companyName}
//               </Text>
//             </Section>

//             {/* Order Details */}
//             <Section className="px-[20px] py-[24px] sm:px-[32px]">
//               <Row className="flex-col sm:flex-row">
//                 <Column className="w-full sm:w-1/2 mb-[16px] sm:mb-0">
//                   <div className="bg-emerald-50 border-l-[4px] border-solid border-emerald-500 p-[16px] rounded-[8px] shadow-sm">
//                     <Text className="text-emerald-700 font-semibold text-[12px] sm:text-[14px] m-0 mb-[4px] uppercase tracking-wide">
//                       PO NUMBER
//                     </Text>
//                     <Text className="text-emerald-900 text-[18px] sm:text-[18px] font-bold m-0">
//                       {poNumber}
//                     </Text>
//                   </div>
//                 </Column>
//                 <Column className="w-full sm:w-1/2 sm:pl-[16px]">
//                   <div className="bg-orange-50 border-l-[4px] border-solid border-orange-500 p-[16px] rounded-[8px] shadow-sm">
//                     <Text className="text-orange-700 font-semibold text-[12px] sm:text-[14px] m-0 mb-[4px] uppercase tracking-wide">
//                       ORDER DATE
//                     </Text>
//                     <Text className="text-orange-900 text-[18px] sm:text-[18px] font-bold m-0">
//                       {orderDate}
//                     </Text>
//                   </div>
//                 </Column>
//               </Row>

//               <Row className="mt-[16px] flex-col sm:flex-row">
//                 <Column className="w-full sm:w-1/2 mb-[16px] sm:mb-0">
//                   <div className="bg-purple-50 border-l-[4px] border-solid border-purple-500 p-[16px] rounded-[8px] shadow-sm">
//                     <Text className="text-purple-700 font-semibold text-[12px] sm:text-[14px] m-0 mb-[4px] uppercase tracking-wide">
//                       DELIVERY DATE
//                     </Text>
//                     <Text className="text-purple-900 text-[18px] sm:text-[18px] font-bold m-0">
//                       {deliveryDate || 'Not specified'}
//                     </Text>
//                   </div>
//                 </Column>
//                 <Column className="w-full sm:w-1/2 sm:pl-[16px]">
//                   <div className="bg-red-50 border-l-[4px] border-solid border-red-500 p-[16px] rounded-[8px] shadow-sm">
//                     <Text className="text-red-700 font-semibold text-[12px] sm:text-[14px] m-0 mb-[4px] uppercase tracking-wide">
//                       TOTAL AMOUNT
//                     </Text>
//                     <Text className="text-red-900 text-[22px] sm:text-[24px] font-bold m-0">
//                       ${totalAmount}
//                     </Text>
//                   </div>
//                 </Column>
//               </Row>
//             </Section>

//             {/* Supplier Information */}
//             <Section className="px-[20px] py-[16px] sm:px-[32px] bg-slate-50">
//               <Heading className="text-slate-800 text-[18px] sm:text-[20px] font-bold m-0 mb-[16px]">
//                 Order Details
//               </Heading>
//               <Text className="text-slate-700 text-[14px] sm:text-[16px] m-0 mb-[8px]">
//                 <strong>Supplier:</strong> {supplierName}
//               </Text>
//               <Text className="text-slate-700 text-[14px] sm:text-[16px] m-0 mb-[8px]">
//                 <strong>Contact:</strong> {supplierContact}
//               </Text>
//               <Text className="text-slate-700 text-[14px] sm:text-[16px] m-0">
//                 <strong>Delivery Address:</strong> {deliveryAddress}
//               </Text>
//             </Section>

//             {/* Items Table */}
//             <Section className="px-[20px] py-[24px] sm:px-[32px]">
//               <Heading className="text-slate-800 text-[18px] sm:text-[20px] font-bold m-0 mb-[16px]">
//                 Items Ordered
//               </Heading>

//               {/* Table Header */}
//               <div className="bg-gradient-to-r from-indigo-600 to-blue-600 rounded-t-[8px] p-[12px]">
//                 <Row className="hidden sm:flex">
//                   <Column className="w-2/5">
//                     <Text className="text-white font-bold text-[14px] m-0">Item Description</Text>
//                   </Column>
//                   <Column className="w-1/5 text-center">
//                     <Text className="text-white font-bold text-[14px] m-0">Quantity</Text>
//                   </Column>
//                   <Column className="w-1/5 text-center">
//                     <Text className="text-white font-bold text-[14px] m-0">Unit Price</Text>
//                   </Column>
//                   <Column className="w-1/5 text-center">
//                     <Text className="text-white font-bold text-[14px] m-0">Total</Text>
//                   </Column>
//                 </Row>
//               </div>

//               {/* Items */}
//               <div className="border-solid border-[1px] border-gray-200 border-t-0">
//                 {items.map((item, index) => (
//                   <div
//                     key={index}
//                     className={`p-[12px] sm:p-[16px] ${
//                       index % 2 === 1 ? 'bg-gray-50' : 'bg-white'
//                     } ${
//                       index < items.length - 1 ? 'border-b-[1px] border-solid border-gray-100' : ''
//                     }`}
//                   >
//                     {/* Mobile Layout */}
//                     <div className="block sm:hidden">
//                       <Text className="text-gray-800 text-[14px] font-semibold m-0 mb-[8px]">
//                         {item.name}
//                       </Text>
//                       <div className="flex justify-between mb-[4px]">
//                         <Text className="text-gray-600 text-[13px] m-0">
//                           Qty:{' '}
//                           <span className="font-semibold text-indigo-600">{item.quantity}</span>
//                         </Text>
//                         <Text className="text-gray-600 text-[13px] m-0">
//                           Unit:{' '}
//                           <span className="font-semibold text-emerald-600">
//                             ${item.unitPrice.toFixed(2)}
//                           </span>
//                         </Text>
//                       </div>
//                       <div className="flex justify-between">
//                         <Text className="text-gray-600 text-[13px] m-0">Total:</Text>
//                         <Text className="text-gray-800 text-[14px] m-0 font-bold">
//                           ${item.total.toFixed(2)}
//                         </Text>
//                       </div>
//                     </div>

//                     {/* Desktop Layout */}
//                     <Row className="hidden sm:flex">
//                       <Column className="w-2/5">
//                         <Text className="text-gray-800 text-[14px] m-0">{item.name}</Text>
//                       </Column>
//                       <Column className="w-1/5 text-center">
//                         <Text className="text-gray-800 text-[14px] m-0">{item.quantity}</Text>
//                       </Column>
//                       <Column className="w-1/5 text-center">
//                         <Text className="text-gray-800 text-[14px] m-0">
//                           ${item.unitPrice.toFixed(2)}
//                         </Text>
//                       </Column>
//                       <Column className="w-1/5 text-center">
//                         <Text className="text-gray-800 text-[14px] m-0 font-bold">
//                           ${item.total.toFixed(2)}
//                         </Text>
//                       </Column>
//                     </Row>
//                   </div>
//                 ))}
//               </div>
//             </Section>

//             {/* Notes */}
//             {notes && (
//               <Section className="px-[20px] py-[16px] sm:px-[32px] bg-amber-50 border-l-[4px] border-amber-500">
//                 <Heading className="text-amber-800 text-[16px] sm:text-[18px] font-bold m-0 mb-[8px]">
//                   📝 Notes
//                 </Heading>
//                 <Text className="text-amber-900 text-[14px] m-0">{notes}</Text>
//               </Section>
//             )}

//             {/* Action Buttons */}
//             <Section className="px-[20px] py-[24px] sm:px-[32px] text-center bg-gradient-to-r from-green-50 to-blue-50">
//               <Text className="text-gray-700 text-[14px] sm:text-[16px] m-0 mb-[20px]">
//                 Please confirm receipt of this purchase order and provide an estimated delivery
//                 timeline.
//               </Text>

//               <Row className="flex-col sm:flex-row">
//                 <Column className="w-full sm:w-1/2 mb-[12px] sm:mb-0 sm:pr-[8px]">
//                   <Button
//                     href={`mailto:${buyerEmail}?subject=PO ${poNumber} - Confirmed`}
//                     className="bg-emerald-600 hover:bg-emerald-700 text-white px-[24px] py-[12px] rounded-[8px] text-[16px] font-bold w-full box-border shadow-sm"
//                   >
//                     Confirm Order
//                   </Button>
//                 </Column>
//                 <Column className="w-full sm:w-1/2 sm:pl-[8px]">
//                   <Button
//                     href={`mailto:${buyerEmail}?subject=PO ${poNumber} - Questions`}
//                     className="bg-blue-600 hover:bg-blue-700 text-white px-[24px] py-[12px] rounded-[8px] text-[16px] font-bold w-full box-border shadow-sm"
//                   >
//                     Ask Questions
//                   </Button>
//                 </Column>
//               </Row>
//             </Section>

//             <Hr className="border-gray-200 my-[20px]" />

//             {/* Footer */}
//             <Section className="px-[20px] py-[20px] sm:px-[32px] bg-gray-50">
//               <Text className="text-gray-600 text-[14px] text-center m-0 mb-[8px]">
//                 <strong>{companyName}</strong>
//               </Text>
//               <Text className="text-gray-500 text-[12px] text-center m-0 mb-[4px]">
//                 {companyAddress}
//               </Text>
//               <Text className="text-gray-500 text-[12px] text-center m-0 mb-[4px]">
//                 Phone: {companyPhone} | Email: admin@izunwaonu.com.ng
//               </Text>
//               <Text className="text-gray-400 text-[11px] text-center m-0">
//                 © {new Date().getFullYear()} {companyName}. All rights reserved.
//               </Text>
//             </Section>
//           </Container>
//         </Body>
//       </Tailwind>
//     </Html>
//   );
// }

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
