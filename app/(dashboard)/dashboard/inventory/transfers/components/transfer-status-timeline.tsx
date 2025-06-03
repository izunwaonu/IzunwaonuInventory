// import { Check, Truck, Package } from 'lucide-react';

// interface TransferStatusTimelineProps {
//   currentStatus: string;
// }

// const statusSteps = [
//   {
//     key: 'DRAFT',
//     label: 'Created',
//     description: 'Transfer created',
//     icon: Package,
//   },
//   {
//     key: 'APPROVED',
//     label: 'Approved',
//     description: 'Transfer approved',
//     icon: Check,
//   },
//   {
//     key: 'IN_TRANSIT',
//     label: 'In Transit',
//     description: 'Items in transit',
//     icon: Truck,
//   },
//   {
//     key: 'COMPLETED',
//     label: 'Completed',
//     description: 'Transfer completed',
//     icon: Check,
//   },
// ];

// export function TransferStatusTimeline({ currentStatus }: TransferStatusTimelineProps) {
//   const getCurrentStepIndex = () => {
//     const index = statusSteps.findIndex((step) => step.key === currentStatus);
//     return index === -1 ? 0 : index;
//   };

//   const currentStepIndex = getCurrentStepIndex();

//   return (
//     <div className="space-y-4">
//       {statusSteps.map((step, index) => {
//         const isCompleted = index <= currentStepIndex;
//         const isCurrent = index === currentStepIndex;
//         const IconComponent = step.icon;

//         return (
//           <div key={step.key} className="flex items-center gap-4">
//             {/* Icon */}
//             <div
//               className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
//                 isCompleted
//                   ? 'bg-green-100 border-green-500 text-green-600'
//                   : isCurrent
//                   ? 'bg-blue-100 border-blue-500 text-blue-600'
//                   : 'bg-gray-100 border-gray-300 text-gray-400'
//               }`}
//             >
//               {isCompleted && index < currentStepIndex ? (
//                 <Check className="h-5 w-5" />
//               ) : (
//                 <IconComponent className="h-5 w-5" />
//               )}
//             </div>

//             {/* Content */}
//             <div className="flex-1">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <h4
//                     className={`font-medium ${
//                       isCompleted ? 'text-green-600' : isCurrent ? 'text-blue-600' : 'text-gray-400'
//                     }`}
//                   >
//                     {step.label}
//                   </h4>
//                   <p
//                     className={`text-sm ${
//                       isCompleted ? 'text-green-600' : isCurrent ? 'text-blue-600' : 'text-gray-400'
//                     }`}
//                   >
//                     {step.description}
//                   </p>
//                 </div>
//                 {isCurrent && <span className="text-sm text-blue-600 font-medium">Current</span>}
//               </div>
//             </div>

//             {/* Connector Line */}
//             {index < statusSteps.length - 1 && (
//               <div className="absolute left-5 mt-12 w-0.5 h-8 bg-gray-200"></div>
//             )}
//           </div>
//         );
//       })}
//     </div>
//   );
// }

import { Check, Clock, Truck, Package } from 'lucide-react';

interface TransferStatusTimelineProps {
  currentStatus: string;
}

const statusSteps = [
  {
    key: 'DRAFT',
    label: 'Created',
    description: 'Transfer created',
    icon: Package,
  },
  {
    key: 'APPROVED',
    label: 'Approved',
    description: 'Transfer approved',
    icon: Check,
  },
  {
    key: 'IN_TRANSIT',
    label: 'In Transit',
    description: 'Items in transit',
    icon: Truck,
  },
  {
    key: 'COMPLETED',
    label: 'Completed',
    description: 'Transfer completed',
    icon: Check,
  },
];

export function TransferStatusTimeline({ currentStatus }: TransferStatusTimelineProps) {
  const getCurrentStepIndex = () => {
    const index = statusSteps.findIndex((step) => step.key === currentStatus);
    return index === -1 ? 0 : index;
  };

  const currentStepIndex = getCurrentStepIndex();

  return (
    <div className="space-y-4">
      {statusSteps.map((step, index) => {
        const isCompleted = index < currentStepIndex;
        const isCurrent = index === currentStepIndex;
        const isUpcoming = index > currentStepIndex;
        const Icon = step.icon;

        return (
          <div key={step.key} className="flex items-center gap-4">
            {/* Status Icon */}
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                isCompleted
                  ? 'bg-green-100 border-green-500 text-green-600'
                  : isCurrent
                  ? 'bg-blue-100 border-blue-500 text-blue-600'
                  : 'bg-gray-100 border-gray-300 text-gray-400'
              }`}
            >
              {isCompleted ? <Check className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
            </div>

            {/* Status Content */}
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h4
                  className={`font-medium ${
                    isCompleted || isCurrent ? 'text-gray-900' : 'text-gray-500'
                  }`}
                >
                  {step.label}
                </h4>
                {isCurrent && (
                  <div className="flex items-center gap-1 text-blue-600">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm">Current</span>
                  </div>
                )}
              </div>
              <p
                className={`text-sm ${
                  isCompleted || isCurrent ? 'text-gray-600' : 'text-gray-400'
                }`}
              >
                {step.description}
              </p>
            </div>

            {/* Connector Line */}
            {index < statusSteps.length - 1 && (
              <div className="absolute left-5 mt-12 w-0.5 h-8 bg-gray-200"></div>
            )}
          </div>
        );
      })}
    </div>
  );
}
