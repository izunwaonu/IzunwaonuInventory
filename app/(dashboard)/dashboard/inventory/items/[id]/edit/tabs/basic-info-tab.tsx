// "use client"

// import { UpdateCard } from "../update-card"
// import { WeightThumbnailCard } from "../components/weight-thumbnail-card"
// import { CategoryBrandCard } from "../components/category-brand-card"
// import type { ProductData } from "@/types/item"
// import type { Options } from "react-tailwindcss-select/dist/components/type"

// interface BasicTabProps {
//   item: ProductData
//   onUpdate: (data: Partial<ProductData>) => Promise<void>
//   brandOptions: Options
//   categoryOptions: Options
// }

// export function BasicTab({ item, onUpdate, brandOptions, categoryOptions }: BasicTabProps) {
//   return (
//     <div className="space-y-6">
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         <UpdateCard
//           title="Product Identification"
//           fields={[
//             { name: "name", label: "Name", type: "text", value: item.name },
//             { name: "slug", label: "Slug", type: "text", value: item.slug },
//           ]}
//           onUpdate={onUpdate}
//         />

//         <UpdateCard
//           title="Product Codes"
//           fields={[
//             { name: "sku", label: "SKU", type: "text", value: item.sku },
//             { name: "barcode", label: "Barcode", type: "text", value: item.barcode || "" },
//           ]}
//           onUpdate={onUpdate}
//         />

//         <WeightThumbnailCard item={item} onUpdate={onUpdate} />

//         <CategoryBrandCard
//           item={item}
//           onUpdate={onUpdate}
//           brandOptions={brandOptions}
//           categoryOptions={categoryOptions}
//         />

//         <UpdateCard
//           title="Product Description"
//           fields={[{ name: "description", label: "Description", type: "textarea", value: item.description || "" }]}
//           onUpdate={onUpdate}
//         />

//         <UpdateCard
//           title="Product Images"
//           fields={[
//             {
//               name: "imageUrls",
//               label: "Additional Image URLs (comma separated)",
//               type: "textarea",
//               value: Array.isArray(item.imageUrls) ? item.imageUrls.join(", ") : "",
//             },
//           ]}
//           onUpdate={(data) => {
//             // Convert comma-separated string back to array if needed
//             if (typeof data.imageUrls === "string") {
//               data.imageUrls = data.imageUrls
//                 .split(",")
//                 .map((url) => url.trim())
//                 .filter(Boolean)
//             }
//             return onUpdate(data)
//           }}
//         />
//       </div>
//     </div>
//   )
// }
"use client"

import { UpdateCard } from "../update-card"
import { WeightThumbnailCard } from "../components/weight-thumbnail-card"
import { CategoryBrandCard } from "../components/category-brand-card"
import { ProductImagesCard } from "../components/product-images-card"
import type { ProductData } from "@/types/item"
import type { Options } from "react-tailwindcss-select/dist/components/type"

interface BasicTabProps {
  item: ProductData
  onUpdate: (data: Partial<ProductData>) => Promise<void>
  brandOptions: Options
  categoryOptions: Options
}

export function BasicTab({ item, onUpdate, brandOptions, categoryOptions }: BasicTabProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <UpdateCard
          title="Product Identification"
          fields={[
            { name: "name", label: "Name", type: "text", value: item.name },
            { name: "slug", label: "Slug", type: "text", value: item.slug },
          ]}
          onUpdate={onUpdate}
        />

        <UpdateCard
          title="Product Codes"
          fields={[
            { name: "sku", label: "SKU", type: "text", value: item.sku },
            { name: "barcode", label: "Barcode", type: "text", value: item.barcode || "" },
          ]}
          onUpdate={onUpdate}
        />

        <WeightThumbnailCard item={item} onUpdate={onUpdate} />

        <CategoryBrandCard
          item={item}
          onUpdate={onUpdate}
          brandOptions={brandOptions}
          categoryOptions={categoryOptions}
        />

        <UpdateCard
          title="Product Description"
          fields={[{ name: "description", label: "Description", type: "textarea", value: item.description || "" }]}
          onUpdate={onUpdate}
        />

        <ProductImagesCard item={item} onUpdate={onUpdate} />
      </div>
    </div>
  )
}
