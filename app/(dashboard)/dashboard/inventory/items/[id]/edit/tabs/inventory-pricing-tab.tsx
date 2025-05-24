

// "use client"

// import { UpdateCard } from "../update-card"
// import type { ProductData } from "@/types/item"

// interface PricingTabProps {
//   item: ProductData
//   onUpdate: (data: Partial<ProductData>) => Promise<void>
// }

// export function PricingTab({ item, onUpdate }: PricingTabProps) {
//   return (
//     <div className="space-y-6">
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         <UpdateCard
//           title="Pricing Information"
//           fields={[
//             { name: "costPrice", label: "Cost Price", type: "number", value: item.costPrice },
//             { name: "sellingPrice", label: "Selling Price", type: "number", value: item.sellingPrice },
//           ]}
//           onUpdate={onUpdate}
//         />

//         <UpdateCard
//           title="Tax Information"
//           fields={[
//             { name: "tax", label: "Tax Rate (%)", type: "number", value: item.tax || 0 },
//             {
//               name: "taxRateId",
//               label: "Tax Rate",
//               type: "select",
//               value: item.taxRateId || "",
//               options: [{ value: "none", label: "None" }],
//             },
//           ]}
//           onUpdate={onUpdate}
//         />

//         <UpdateCard
//           title="Inventory Levels"
//           fields={[
//             { name: "minStockLevel", label: "Minimum Stock Level", type: "number", value: item.minStockLevel },
//             { name: "maxStockLevel", label: "Maximum Stock Level", type: "number", value: item.maxStockLevel || 0 },
//           ]}
//           onUpdate={onUpdate}
//         />

//         <UpdateCard
//           title="Inventory Settings"
//           fields={[
//             { name: "isActive", label: "Active", type: "checkbox", value: item.isActive },
//             { name: "isSerialTracked", label: "Serial Tracked", type: "checkbox", value: item.isSerialTracked },
//           ]}
//           onUpdate={onUpdate}
//         />

//         <UpdateCard
//           title="Sales Information"
//           fields={[
//             { name: "salesCount", label: "Sales Count", type: "number", value: item.salesCount, disabled: true },
//             { name: "salesTotal", label: "Sales Total", type: "number", value: item.salesTotal, disabled: true },
//           ]}
//           onUpdate={onUpdate}
//         />
//       </div>
//     </div>
//   )
// }

"use client"

import { UpdateCard } from "../update-card"
import { UnitCard } from "../components/unit-card"
import { TaxCalculationCard } from "../components/tax-calculation-card"
import type { ProductData } from "@/types/item"
import type { Options } from "react-tailwindcss-select/dist/components/type"

interface PricingTabProps {
  item: ProductData
  onUpdate: (data: Partial<ProductData>) => Promise<void>
  unitOptions: Options
  taxRateOptions: Options
}

export function PricingTab({ item, onUpdate, unitOptions, taxRateOptions }: PricingTabProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <UpdateCard
          title="Pricing Information"
          fields={[
            { name: "costPrice", label: "Cost Price", type: "number", value: item.costPrice },
            { name: "sellingPrice", label: "Selling Price", type: "number", value: item.sellingPrice },
          ]}
          onUpdate={onUpdate}
        />

        <TaxCalculationCard item={item} onUpdate={onUpdate} taxRateOptions={taxRateOptions} />

        <UpdateCard
          title="Inventory Levels"
          fields={[
            { name: "minStockLevel", label: "Minimum Stock Level", type: "number", value: item.minStockLevel },
            { name: "maxStockLevel", label: "Maximum Stock Level", type: "number", value: item.maxStockLevel || 0 },
          ]}
          onUpdate={onUpdate}
        />

        <UpdateCard
          title="Inventory Settings"
          fields={[
            { name: "isActive", label: "Active", type: "checkbox", value: item.isActive },
            { name: "isSerialTracked", label: "Serial Tracked", type: "checkbox", value: item.isSerialTracked },
          ]}
          onUpdate={onUpdate}
        />

        <UnitCard item={item} onUpdate={onUpdate} unitOptions={unitOptions} />

        <UpdateCard
          title="Sales Information"
          fields={[
            { name: "salesCount", label: "Sales Count", type: "number", value: item.salesCount, disabled: true },
            { name: "salesTotal", label: "Sales Total", type: "number", value: item.salesTotal, disabled: true },
          ]}
          onUpdate={onUpdate}
        />
      </div>
    </div>
  )
}
