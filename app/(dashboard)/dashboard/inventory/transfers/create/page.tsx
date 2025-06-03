// import { Suspense } from 'react';
// import { ArrowLeft } from 'lucide-react';
// import Link from 'next/link';
// import { Button } from '@/components/ui/button';

// import { getLocationsForTransfer, getItemsWithInventory } from '@/actions/transfers';
// import { CreateTransferForm } from '../components/create-transfer-form';

// async function CreateTransferContent() {
//   const [locations, items] = await Promise.all([
//     getLocationsForTransfer(),
//     getItemsWithInventory(),
//   ]);

//   return <CreateTransferForm locations={locations} items={items} />;
// }

// function CreateTransferSkeleton() {
//   return (
//     <div className="space-y-6">
//       <div className="h-8 bg-gray-200 rounded animate-pulse w-64"></div>
//       <div className="space-y-4">
//         <div className="h-32 bg-gray-200 rounded animate-pulse"></div>
//         <div className="h-20 bg-gray-200 rounded animate-pulse"></div>
//         <div className="h-40 bg-gray-200 rounded animate-pulse"></div>
//       </div>
//     </div>
//   );
// }

// export default function CreateTransferPage() {
//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex items-center gap-4">
//         <Link href="/dashboard/transfers">
//           <Button variant="outline" size="sm">
//             <ArrowLeft className="h-4 w-4 mr-2" />
//             Back
//           </Button>
//         </Link>
//         <h1 className="text-3xl font-bold text-gray-900">Create Batch Transfer</h1>
//       </div>

//       {/* Form */}
//       <Suspense fallback={<CreateTransferSkeleton />}>
//         <CreateTransferContent />
//       </Suspense>
//     </div>
//   );
// }

import { Suspense } from 'react';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { getLocations, getItemsWithInventory } from '@/actions/transfers';
import { CreateTransferForm } from '../components/create-transfer-form';

async function CreateTransferContent() {
  const [locations, items] = await Promise.all([getLocations(), getItemsWithInventory()]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/inventory/transfers">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Create Batch Transfer</h1>
          <p className="text-gray-600 mt-1">Transfer inventory between locations</p>
        </div>
      </div>

      {/* Form */}
      <CreateTransferForm locations={locations} items={items} />
    </div>
  );
}

function CreateTransferSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="h-8 w-16 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-8 w-64 bg-gray-200 rounded animate-pulse"></div>
      </div>
      <div className="h-96 bg-gray-200 rounded animate-pulse"></div>
    </div>
  );
}

export default function CreateTransferPage() {
  return (
    <Suspense fallback={<CreateTransferSkeleton />}>
      <CreateTransferContent />
    </Suspense>
  );
}
