// import { Suspense } from 'react';
// import { Button } from '@/components/ui/button';
// import { Badge } from '@/components/ui/badge';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Input } from '@/components/ui/input';
// import { Plus, Search, Eye, Package } from 'lucide-react';
// import Link from 'next/link';
// import { format } from 'date-fns';
// import { getTransfers } from '@/actions/transfers';

// const statusColors = {
//   DRAFT: 'bg-gray-100 text-gray-800',
//   APPROVED: 'bg-blue-100 text-blue-800',
//   IN_TRANSIT: 'bg-yellow-100 text-yellow-800',
//   COMPLETED: 'bg-green-100 text-green-800',
//   CANCELED: 'bg-red-100 text-red-800',
// };

// const statusLabels = {
//   DRAFT: 'Draft',
//   APPROVED: 'Approved',
//   IN_TRANSIT: 'In Transit',
//   COMPLETED: 'Completed',
//   CANCELED: 'Cancelled',
// };

// async function TransfersTable() {
//   const transfers = await getTransfers();

//   return (
//     <Card>
//       <CardContent className="p-0">
//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead className="border-b bg-gray-50">
//               <tr>
//                 <th className="text-left py-3 px-4 font-medium text-gray-900">Transfer #</th>
//                 <th className="text-left py-3 px-4 font-medium text-gray-900">Date</th>
//                 <th className="text-left py-3 px-4 font-medium text-gray-900">From</th>
//                 <th className="text-left py-3 px-4 font-medium text-gray-900">To</th>
//                 <th className="text-left py-3 px-4 font-medium text-gray-900">Items</th>
//                 <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
//                 <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {transfers.length === 0 ? (
//                 <tr>
//                   <td colSpan={7} className="text-center py-8 text-gray-500">
//                     <Package className="h-12 w-12 mx-auto mb-4 text-gray-300" />
//                     <p className="text-lg font-medium">No transfers found</p>
//                     <p className="text-sm">Create your first batch transfer to get started</p>
//                   </td>
//                 </tr>
//               ) : (
//                 transfers.map((transfer) => (
//                   <tr key={transfer.id} className="border-b hover:bg-gray-50">
//                     <td className="py-3 px-4">
//                       <Link
//                         href={`/dashboard/transfers/${transfer.id}`}
//                         className="text-red-600 hover:text-red-800 font-medium"
//                       >
//                         {transfer.transferNumber}
//                       </Link>
//                     </td>
//                     <td className="py-3 px-4 text-gray-600">
//                       {format(new Date(transfer.date), 'MMM dd, yyyy')}
//                     </td>
//                     <td className="py-3 px-4 text-gray-900">{transfer.fromLocation.name}</td>
//                     <td className="py-3 px-4 text-gray-900">{transfer.toLocation.name}</td>
//                     <td className="py-3 px-4 text-gray-600">
//                       {transfer.lines.length} item{transfer.lines.length !== 1 ? 's' : ''}
//                     </td>
//                     <td className="py-3 px-4">
//                       <Badge className={statusColors[transfer.status as keyof typeof statusColors]}>
//                         {statusLabels[transfer.status as keyof typeof statusLabels]}
//                       </Badge>
//                     </td>
//                     <td className="py-3 px-4">
//                       <Link href={`/dashboard/inventory/transfers/${transfer.id}`}>
//                         <Button variant="outline" size="sm">
//                           <Eye className="h-4 w-4 mr-1" />
//                           View
//                         </Button>
//                       </Link>
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>
//       </CardContent>
//     </Card>
//   );
// }

// function TransfersTableSkeleton() {
//   return (
//     <Card>
//       <CardContent className="p-0">
//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead className="border-b bg-gray-50">
//               <tr>
//                 <th className="text-left py-3 px-4 font-medium text-gray-900">Transfer #</th>
//                 <th className="text-left py-3 px-4 font-medium text-gray-900">Date</th>
//                 <th className="text-left py-3 px-4 font-medium text-gray-900">From</th>
//                 <th className="text-left py-3 px-4 font-medium text-gray-900">To</th>
//                 <th className="text-left py-3 px-4 font-medium text-gray-900">Items</th>
//                 <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
//                 <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {[...Array(5)].map((_, i) => (
//                 <tr key={i} className="border-b">
//                   <td className="py-3 px-4">
//                     <div className="h-4 bg-gray-200 rounded animate-pulse w-24"></div>
//                   </td>
//                   <td className="py-3 px-4">
//                     <div className="h-4 bg-gray-200 rounded animate-pulse w-20"></div>
//                   </td>
//                   <td className="py-3 px-4">
//                     <div className="h-4 bg-gray-200 rounded animate-pulse w-28"></div>
//                   </td>
//                   <td className="py-3 px-4">
//                     <div className="h-4 bg-gray-200 rounded animate-pulse w-28"></div>
//                   </td>
//                   <td className="py-3 px-4">
//                     <div className="h-4 bg-gray-200 rounded animate-pulse w-16"></div>
//                   </td>
//                   <td className="py-3 px-4">
//                     <div className="h-6 bg-gray-200 rounded animate-pulse w-20"></div>
//                   </td>
//                   <td className="py-3 px-4">
//                     <div className="h-8 bg-gray-200 rounded animate-pulse w-16"></div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </CardContent>
//     </Card>
//   );
// }

// export default function TransfersPage() {
//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//         <div>
//           <h1 className="text-3xl font-bold text-gray-900">Stock Transfers</h1>
//           <p className="text-gray-600 mt-1">Manage inventory transfers between locations</p>
//         </div>
//         <div className="flex gap-2">
//           <Link href="/dashboard/inventory/current-stock">
//             <Button variant="outline">
//               <Package className="h-4 w-4 mr-2" />
//               View Inventory
//             </Button>
//           </Link>
//           <Link href="/dashboard/inventory/transfers/create">
//             <Button>
//               <Plus className="h-4 w-4 mr-2" />
//               Create Batch Transfer
//             </Button>
//           </Link>
//         </div>
//       </div>

//       {/* Search and Filters */}
//       <Card>
//         <CardHeader>
//           <CardTitle>Search Transfers</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="flex gap-4">
//             <div className="relative flex-1">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
//               <Input placeholder="Search by transfer number, location..." className="pl-10" />
//             </div>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Transfers Table */}
//       <Suspense fallback={<TransfersTableSkeleton />}>
//         <TransfersTable />
//       </Suspense>
//     </div>
//   );
// }

import { Suspense } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Package, Eye } from 'lucide-react';
import { format } from 'date-fns';
import { getTransfers } from '@/actions/transfers';

const statusColors = {
  DRAFT: 'bg-gray-100 text-gray-800',
  APPROVED: 'bg-blue-100 text-blue-800',
  IN_TRANSIT: 'bg-yellow-100 text-yellow-800',
  COMPLETED: 'bg-green-100 text-green-800',
  CANCELED: 'bg-red-100 text-red-800',
};

const statusLabels = {
  DRAFT: 'Draft',
  APPROVED: 'Approved',
  IN_TRANSIT: 'In Transit',
  COMPLETED: 'Completed',
  CANCELED: 'Cancelled',
};

async function TransfersList() {
  const transfers = await getTransfers();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Stock Transfers</h1>
          <p className="text-gray-600 mt-1">Manage inventory transfers between locations</p>
        </div>
        <div className="flex gap-2">
          <Link href="/dashboard/inventory/current-stock">
            <Button variant="outline">
              <Package className="h-4 w-4 mr-2" />
              View Inventory
            </Button>
          </Link>
          <Link href="/dashboard/inventory/transfers/create">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Batch Transfer
            </Button>
          </Link>
        </div>
      </div>

      {/* Transfers Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Transfers</CardTitle>
        </CardHeader>
        <CardContent>
          {transfers.length === 0 ? (
            <div className="text-center py-8">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No transfers found</h3>
              <p className="text-gray-600 mb-4">Get started by creating your first transfer</p>
              <Link href="/dashboard/inventory/transfers/create">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Transfer
                </Button>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-2 font-medium">Transfer #</th>
                    <th className="text-left py-3 px-2 font-medium">Date</th>
                    <th className="text-left py-3 px-2 font-medium">From</th>
                    <th className="text-left py-3 px-2 font-medium">To</th>
                    <th className="text-center py-3 px-2 font-medium">Items</th>
                    <th className="text-center py-3 px-2 font-medium">Status</th>
                    <th className="text-center py-3 px-2 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {transfers.map((transfer) => (
                    <tr key={transfer.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-2">
                        <Link
                          href={`/dashboard/inventory/transfers/${transfer.id}`}
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          {transfer.transferNumber}
                        </Link>
                      </td>
                      <td className="py-3 px-2 text-gray-600">
                        {format(new Date(transfer.date), 'MMM dd, yyyy')}
                      </td>
                      <td className="py-3 px-2">
                        <div>
                          <p className="font-medium">{transfer.fromLocation.name}</p>
                          {transfer.fromLocation.address && (
                            <p className="text-sm text-gray-500">{transfer.fromLocation.address}</p>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-2">
                        <div>
                          <p className="font-medium">{transfer.toLocation.name}</p>
                          {transfer.toLocation.address && (
                            <p className="text-sm text-gray-500">{transfer.toLocation.address}</p>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-2 text-center">
                        <span className="font-medium">
                          {transfer.lines.length} item{transfer.lines.length !== 1 ? 's' : ''}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-center">
                        <Badge
                          className={statusColors[transfer.status as keyof typeof statusColors]}
                        >
                          {statusLabels[transfer.status as keyof typeof statusLabels]}
                        </Badge>
                      </td>
                      <td className="py-3 px-2 text-center">
                        <Link href={`/dashboard/inventory/transfers/${transfer.id}`}>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function TransfersListSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-10 w-32 bg-gray-200 rounded animate-pulse"></div>
      </div>
      <div className="h-96 bg-gray-200 rounded animate-pulse"></div>
    </div>
  );
}

export default function TransfersPage() {
  return (
    <Suspense fallback={<TransfersListSkeleton />}>
      <TransfersList />
    </Suspense>
  );
}
