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
//         <Body className="bg-gray-100 font-sans py-[40px]">
//           <Container className="bg-white max-w-[600px] mx-auto rounded-[12px] shadow-lg overflow-hidden">
//             {/* Header */}
//             <Section className="bg-gradient-to-r from-blue-600 to-purple-600 px-[32px] py-[24px]">
//               <Heading className="text-white text-[28px] font-bold m-0 text-center">
//                 Purchase Order
//               </Heading>
//               <Text className="text-blue-100 text-[16px] text-center m-0 mt-[8px]">
//                 New order request from {companyName}
//               </Text>
//             </Section>

//             {/* Order Details */}
//             <Section className="px-[32px] py-[24px]">
//               <Row>
//                 <Column className="w-1/2">
//                   <div className="bg-green-50 border-l-[4px] border-solid border-green-500 p-[16px] rounded-[8px]">
//                     <Text className="text-green-800 font-bold text-[14px] m-0 mb-[4px]">
//                       PO NUMBER
//                     </Text>
//                     <Text className="text-green-900 text-[18px] font-bold m-0">{poNumber}</Text>
//                   </div>
//                 </Column>
//                 <Column className="w-1/2 pl-[16px]">
//                   <div className="bg-orange-50 border-l-[4px] border-solid border-orange-500 p-[16px] rounded-[8px]">
//                     <Text className="text-orange-800 font-bold text-[14px] m-0 mb-[4px]">
//                       ORDER DATE
//                     </Text>
//                     <Text className="text-orange-900 text-[18px] font-bold m-0">{orderDate}</Text>
//                   </div>
//                 </Column>
//               </Row>

//               <Row className="mt-[16px]">
//                 <Column className="w-1/2">
//                   <div className="bg-purple-50 border-l-[4px] border-solid border-purple-500 p-[16px] rounded-[8px]">
//                     <Text className="text-purple-800 font-bold text-[14px] m-0 mb-[4px]">
//                       DELIVERY DATE
//                     </Text>
//                     <Text className="text-purple-900 text-[18px] font-bold m-0">
//                       {deliveryDate || 'Not specified'}
//                     </Text>
//                   </div>
//                 </Column>
//                 <Column className="w-1/2 pl-[16px]">
//                   <div className="bg-red-50 border-l-[4px] border-solid border-red-500 p-[16px] rounded-[8px]">
//                     <Text className="text-red-800 font-bold text-[14px] m-0 mb-[4px]">
//                       TOTAL AMOUNT
//                     </Text>
//                     <Text className="text-red-900 text-[24px] font-bold m-0">${totalAmount}</Text>
//                   </div>
//                 </Column>
//               </Row>
//             </Section>

//             {/* Supplier Information */}
//             <Section className="px-[32px] py-[16px] bg-gray-50">
//               <Heading className="text-gray-800 text-[20px] font-bold m-0 mb-[16px]">
//                 📋 Order Details
//               </Heading>
//               <Text className="text-gray-700 text-[16px] m-0 mb-[8px]">
//                 <strong>Supplier:</strong> {supplierName}
//               </Text>
//               <Text className="text-gray-700 text-[16px] m-0 mb-[8px]">
//                 <strong>Contact:</strong> {supplierContact}
//               </Text>
//               <Text className="text-gray-700 text-[16px] m-0">
//                 <strong>Delivery Address:</strong> {deliveryAddress}
//               </Text>
//             </Section>

//             {/* Items Table */}
//             <Section className="px-[32px] py-[24px]">
//               <Heading className="text-gray-800 text-[20px] font-bold m-0 mb-[16px]">
//                 🛍️ Items Ordered
//               </Heading>

//               {/* Table Header */}
//               <div className="bg-gradient-to-r from-indigo-500 to-blue-500 rounded-t-[8px] p-[12px]">
//                 <Row>
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
//                     className={`p-[12px] ${index % 2 === 1 ? 'bg-gray-50' : ''} ${
//                       index < items.length - 1 ? 'border-b-[1px] border-solid border-gray-100' : ''
//                     }`}
//                   >
//                     <Row>
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
//               <Section className="px-[32px] py-[16px] bg-yellow-50">
//                 <Heading className="text-gray-800 text-[18px] font-bold m-0 mb-[8px]">
//                   📝 Notes
//                 </Heading>
//                 <Text className="text-gray-700 text-[14px] m-0">{notes}</Text>
//               </Section>
//             )}

//             {/* Action Buttons */}
//             <Section className="px-[32px] py-[24px] text-center bg-gradient-to-r from-green-50 to-blue-50">
//               <Text className="text-gray-700 text-[16px] m-0 mb-[20px]">
//                 Please confirm receipt of this purchase order and provide an estimated delivery
//                 timeline.
//               </Text>

//               <Row>
//                 <Column className="w-1/2 pr-[8px]">
//                   <Button
//                     href={`mailto:${buyerEmail}?subject=PO ${poNumber} - Confirmed`}
//                     className="bg-green-600 text-white px-[24px] py-[12px] rounded-[8px] text-[16px] font-bold w-full box-border"
//                   >
//                     ✅ Confirm Order
//                   </Button>
//                 </Column>
//                 <Column className="w-1/2 pl-[8px]">
//                   <Button
//                     href={`mailto:${buyerEmail}?subject=PO ${poNumber} - Questions`}
//                     className="bg-blue-600 text-white px-[24px] py-[12px] rounded-[8px] text-[16px] font-bold w-full box-border"
//                   >
//                     💬 Ask Questions
//                   </Button>
//                 </Column>
//               </Row>
//             </Section>

//             <Hr className="border-gray-200 my-[20px]" />

//             {/* Footer */}
//             <Section className="px-[32px] py-[20px] bg-gray-50">
//               <Text className="text-gray-600 text-[14px] text-center m-0 mb-[8px]">
//                 <strong>{companyName}</strong>
//               </Text>
//               <Text className="text-gray-500 text-[12px] text-center m-0 mb-[4px]">
//                 {companyAddress}
//               </Text>
//               <Text className="text-gray-500 text-[12px] text-center m-0 mb-[4px]">
//                 Phone: {companyPhone} | Email: {buyerEmail}
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
  Hr,
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
  items: Array<{
    name: string;
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
  items,
  buyerEmail,
  companyAddress,
  companyPhone,
  notes,
}: PurchaseOrderEmailProps) {
  return (
    <Html lang="en" dir="ltr">
      <Tailwind>
        <Head />
        <Body className="bg-gray-50 font-sans py-[20px] px-[10px] sm:py-[40px] sm:px-[20px]">
          <Container className="bg-white max-w-[600px] mx-auto rounded-[12px] shadow-xl overflow-hidden border border-gray-200">
            {/* Header */}
            <Section className="bg-gradient-to-r from-blue-600 to-indigo-700 px-[20px] py-[32px] sm:px-[32px]">
              <Heading className="text-white text-[24px] sm:text-[28px] font-bold m-0 text-center">
                Purchase Order
              </Heading>
              <Text className="text-blue-100 text-[14px] sm:text-[16px] text-center m-0 mt-[8px]">
                New order request from {companyName}
              </Text>
            </Section>

            {/* Order Details */}
            <Section className="px-[20px] py-[24px] sm:px-[32px]">
              <Row className="flex-col sm:flex-row">
                <Column className="w-full sm:w-1/2 mb-[16px] sm:mb-0">
                  <div className="bg-emerald-50 border-l-[4px] border-solid border-emerald-500 p-[16px] rounded-[8px] shadow-sm">
                    <Text className="text-emerald-700 font-semibold text-[12px] sm:text-[14px] m-0 mb-[4px] uppercase tracking-wide">
                      PO NUMBER
                    </Text>
                    <Text className="text-emerald-900 text-[18px] sm:text-[18px] font-bold m-0">
                      {poNumber}
                    </Text>
                  </div>
                </Column>
                <Column className="w-full sm:w-1/2 sm:pl-[16px]">
                  <div className="bg-orange-50 border-l-[4px] border-solid border-orange-500 p-[16px] rounded-[8px] shadow-sm">
                    <Text className="text-orange-700 font-semibold text-[12px] sm:text-[14px] m-0 mb-[4px] uppercase tracking-wide">
                      ORDER DATE
                    </Text>
                    <Text className="text-orange-900 text-[18px] sm:text-[18px] font-bold m-0">
                      {orderDate}
                    </Text>
                  </div>
                </Column>
              </Row>

              <Row className="mt-[16px] flex-col sm:flex-row">
                <Column className="w-full sm:w-1/2 mb-[16px] sm:mb-0">
                  <div className="bg-purple-50 border-l-[4px] border-solid border-purple-500 p-[16px] rounded-[8px] shadow-sm">
                    <Text className="text-purple-700 font-semibold text-[12px] sm:text-[14px] m-0 mb-[4px] uppercase tracking-wide">
                      DELIVERY DATE
                    </Text>
                    <Text className="text-purple-900 text-[18px] sm:text-[18px] font-bold m-0">
                      {deliveryDate || 'Not specified'}
                    </Text>
                  </div>
                </Column>
                <Column className="w-full sm:w-1/2 sm:pl-[16px]">
                  <div className="bg-red-50 border-l-[4px] border-solid border-red-500 p-[16px] rounded-[8px] shadow-sm">
                    <Text className="text-red-700 font-semibold text-[12px] sm:text-[14px] m-0 mb-[4px] uppercase tracking-wide">
                      TOTAL AMOUNT
                    </Text>
                    <Text className="text-red-900 text-[22px] sm:text-[24px] font-bold m-0">
                      ${totalAmount}
                    </Text>
                  </div>
                </Column>
              </Row>
            </Section>

            {/* Supplier Information */}
            <Section className="px-[20px] py-[16px] sm:px-[32px] bg-slate-50">
              <Heading className="text-slate-800 text-[18px] sm:text-[20px] font-bold m-0 mb-[16px]">
                Order Details
              </Heading>
              <Text className="text-slate-700 text-[14px] sm:text-[16px] m-0 mb-[8px]">
                <strong>Supplier:</strong> {supplierName}
              </Text>
              <Text className="text-slate-700 text-[14px] sm:text-[16px] m-0 mb-[8px]">
                <strong>Contact:</strong> {supplierContact}
              </Text>
              <Text className="text-slate-700 text-[14px] sm:text-[16px] m-0">
                <strong>Delivery Address:</strong> {deliveryAddress}
              </Text>
            </Section>

            {/* Items Table */}
            <Section className="px-[20px] py-[24px] sm:px-[32px]">
              <Heading className="text-slate-800 text-[18px] sm:text-[20px] font-bold m-0 mb-[16px]">
                Items Ordered
              </Heading>

              {/* Table Header */}
              <div className="bg-gradient-to-r from-indigo-600 to-blue-600 rounded-t-[8px] p-[12px]">
                <Row className="hidden sm:flex">
                  <Column className="w-2/5">
                    <Text className="text-white font-bold text-[14px] m-0">Item Description</Text>
                  </Column>
                  <Column className="w-1/5 text-center">
                    <Text className="text-white font-bold text-[14px] m-0">Quantity</Text>
                  </Column>
                  <Column className="w-1/5 text-center">
                    <Text className="text-white font-bold text-[14px] m-0">Unit Price</Text>
                  </Column>
                  <Column className="w-1/5 text-center">
                    <Text className="text-white font-bold text-[14px] m-0">Total</Text>
                  </Column>
                </Row>
              </div>

              {/* Items */}
              <div className="border-solid border-[1px] border-gray-200 border-t-0">
                {items.map((item, index) => (
                  <div
                    key={index}
                    className={`p-[12px] sm:p-[16px] ${
                      index % 2 === 1 ? 'bg-gray-50' : 'bg-white'
                    } ${
                      index < items.length - 1 ? 'border-b-[1px] border-solid border-gray-100' : ''
                    }`}
                  >
                    {/* Mobile Layout */}
                    <div className="block sm:hidden">
                      <Text className="text-gray-800 text-[14px] font-semibold m-0 mb-[8px]">
                        {item.name}
                      </Text>
                      <div className="flex justify-between mb-[4px]">
                        <Text className="text-gray-600 text-[13px] m-0">
                          Qty:{' '}
                          <span className="font-semibold text-indigo-600">{item.quantity}</span>
                        </Text>
                        <Text className="text-gray-600 text-[13px] m-0">
                          Unit:{' '}
                          <span className="font-semibold text-emerald-600">
                            ${item.unitPrice.toFixed(2)}
                          </span>
                        </Text>
                      </div>
                      <div className="flex justify-between">
                        <Text className="text-gray-600 text-[13px] m-0">Total:</Text>
                        <Text className="text-gray-800 text-[14px] m-0 font-bold">
                          ${item.total.toFixed(2)}
                        </Text>
                      </div>
                    </div>

                    {/* Desktop Layout */}
                    <Row className="hidden sm:flex">
                      <Column className="w-2/5">
                        <Text className="text-gray-800 text-[14px] m-0">{item.name}</Text>
                      </Column>
                      <Column className="w-1/5 text-center">
                        <Text className="text-gray-800 text-[14px] m-0">{item.quantity}</Text>
                      </Column>
                      <Column className="w-1/5 text-center">
                        <Text className="text-gray-800 text-[14px] m-0">
                          ${item.unitPrice.toFixed(2)}
                        </Text>
                      </Column>
                      <Column className="w-1/5 text-center">
                        <Text className="text-gray-800 text-[14px] m-0 font-bold">
                          ${item.total.toFixed(2)}
                        </Text>
                      </Column>
                    </Row>
                  </div>
                ))}
              </div>
            </Section>

            {/* Notes */}
            {notes && (
              <Section className="px-[20px] py-[16px] sm:px-[32px] bg-amber-50 border-l-[4px] border-amber-500">
                <Heading className="text-amber-800 text-[16px] sm:text-[18px] font-bold m-0 mb-[8px]">
                  📝 Notes
                </Heading>
                <Text className="text-amber-900 text-[14px] m-0">{notes}</Text>
              </Section>
            )}

            {/* Action Buttons */}
            <Section className="px-[20px] py-[24px] sm:px-[32px] text-center bg-gradient-to-r from-green-50 to-blue-50">
              <Text className="text-gray-700 text-[14px] sm:text-[16px] m-0 mb-[20px]">
                Please confirm receipt of this purchase order and provide an estimated delivery
                timeline.
              </Text>

              <Row className="flex-col sm:flex-row">
                <Column className="w-full sm:w-1/2 mb-[12px] sm:mb-0 sm:pr-[8px]">
                  <Button
                    href={`mailto:${buyerEmail}?subject=PO ${poNumber} - Confirmed`}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-[24px] py-[12px] rounded-[8px] text-[16px] font-bold w-full box-border shadow-sm"
                  >
                    Confirm Order
                  </Button>
                </Column>
                <Column className="w-full sm:w-1/2 sm:pl-[8px]">
                  <Button
                    href={`mailto:${buyerEmail}?subject=PO ${poNumber} - Questions`}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-[24px] py-[12px] rounded-[8px] text-[16px] font-bold w-full box-border shadow-sm"
                  >
                    Ask Questions
                  </Button>
                </Column>
              </Row>
            </Section>

            <Hr className="border-gray-200 my-[20px]" />

            {/* Footer */}
            <Section className="px-[20px] py-[20px] sm:px-[32px] bg-gray-50">
              <Text className="text-gray-600 text-[14px] text-center m-0 mb-[8px]">
                <strong>{companyName}</strong>
              </Text>
              <Text className="text-gray-500 text-[12px] text-center m-0 mb-[4px]">
                {companyAddress}
              </Text>
              <Text className="text-gray-500 text-[12px] text-center m-0 mb-[4px]">
                Phone: {companyPhone} | Email: admin@izunwaonu.com.ng
              </Text>
              <Text className="text-gray-400 text-[11px] text-center m-0">
                © {new Date().getFullYear()} {companyName}. All rights reserved.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
