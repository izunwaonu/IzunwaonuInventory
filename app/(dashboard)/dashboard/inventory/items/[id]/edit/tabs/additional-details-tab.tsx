// "use client"

// import { UpdateCard } from "../update-card"
// import type { ProductData } from "@/types/item"

// interface AdditionalTabProps {
//   item: ProductData
//   onUpdate: (data: Partial<ProductData>) => Promise<void>
// }

// export function AdditionalTab({ item, onUpdate }: AdditionalTabProps) {
//   return (
//     <div className="space-y-6">
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         <UpdateCard
//           title="Product Dimensions"
//           fields={[{ name: "dimensions", label: "Dimensions", type: "text", value: item.dimensions || "" }]}
//           onUpdate={onUpdate}
//         />

//         <UpdateCard
//           title="Unit Information"
//           fields={[
//             {
//               name: "unitId",
//               label: "Unit",
//               type: "select",
//               value: item.unitId || "",
//               options: [{ value: "none", label: "None" }],
//             },
//             { name: "unitOfMeasure", label: "Unit of Measure", type: "text", value: item.unitOfMeasure || "" },
//           ]}
//           onUpdate={onUpdate}
//         />

//         <UpdateCard
//           title="Product Identifiers"
//           fields={[
//             { name: "upc", label: "UPC", type: "text", value: item.upc || "" },
//             { name: "ean", label: "EAN", type: "text", value: item.ean || "" },
//           ]}
//           onUpdate={onUpdate}
//         />

//         <UpdateCard
//           title="Additional Identifiers"
//           fields={[
//             { name: "mpn", label: "MPN", type: "text", value: item.mpn || "" },
//             { name: "isbn", label: "ISBN", type: "text", value: item.isbn || "" },
//           ]}
//           onUpdate={onUpdate}
//         />

//         <UpdateCard
//           title="Timestamps"
//           fields={[
//             {
//               name: "createdAt",
//               label: "Created At",
//               type: "text",
//               value: new Date(item.createdAt).toLocaleString(),
//               disabled: true,
//             },
//             {
//               name: "updatedAt",
//               label: "Updated At",
//               type: "text",
//               value: new Date(item.updatedAt).toLocaleString(),
//               disabled: true,
//             },
//           ]}
//           onUpdate={onUpdate}
//         />
//       </div>
//     </div>
//   )
// }


"use client"

import { UpdateCard } from "../update-card"
import type { ProductData } from "@/types/item"

interface AdditionalTabProps {
  item: ProductData
  onUpdate: (data: Partial<ProductData>) => Promise<void>
}

export function AdditionalTab({ item, onUpdate }: AdditionalTabProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <UpdateCard
          title="Product Dimensions"
          fields={[{ name: "dimensions", label: "Dimensions", type: "text", value: item.dimensions || "" }]}
          onUpdate={onUpdate}
        />

        <UpdateCard
          title="Product Identifiers"
          fields={[
            { name: "upc", label: "UPC", type: "text", value: item.upc || "" },
            { name: "ean", label: "EAN", type: "text", value: item.ean || "" },
          ]}
          onUpdate={onUpdate}
        />

        <UpdateCard
          title="Additional Identifiers"
          fields={[
            { name: "mpn", label: "MPN", type: "text", value: item.mpn || "" },
            { name: "isbn", label: "ISBN", type: "text", value: item.isbn || "" },
          ]}
          onUpdate={onUpdate}
        />

        <UpdateCard
          title="Timestamps"
          fields={[
            {
              name: "createdAt",
              label: "Created At",
              type: "text",
              value: new Date(item.createdAt).toLocaleString(),
              disabled: true,
            },
            {
              name: "updatedAt",
              label: "Updated At",
              type: "text",
              value: new Date(item.updatedAt).toLocaleString(),
              disabled: true,
            },
          ]}
          onUpdate={onUpdate}
        />
      </div>
    </div>
  )
}
