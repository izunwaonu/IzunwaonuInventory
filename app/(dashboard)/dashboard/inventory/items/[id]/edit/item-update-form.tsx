

"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"
import type { ProductData } from "@/types/item"
import type { Options } from "react-tailwindcss-select/dist/components/type"
import { updateItem } from "./action"
import { BasicTab } from "./tabs/basic-info-tab"
import { AdditionalTab } from "./tabs/additional-details-tab"
import { PricingTab } from "./tabs/inventory-pricing-tab"

interface ItemUpdateFormProps {
  item: ProductData
  brandOptions: Options
  categoryOptions: Options
  unitOptions: Options
  taxRateOptions: Options
}

export function ItemUpdateForm({
  item,
  brandOptions,
  categoryOptions,
  unitOptions,
  taxRateOptions,
}: ItemUpdateFormProps) {
  const handleUpdate = async (data: Partial<ProductData>) => {
    try {
      const result = await updateItem(item.id, data)

      if (result.success) {
        toast.success(result.message || "Item updated successfully")
      } else {
        toast.error(result.message || "Failed to update item")
      }
    } catch (error) {
      console.error("Update error:", error)
      toast.error("An unexpected error occurred while updating the item")
    }
  }

  return (
    <Tabs defaultValue="basic" className="w-full">
      <TabsList className="grid w-full grid-cols-3 mb-8">
        <TabsTrigger value="basic">Basic Information</TabsTrigger>
        <TabsTrigger value="pricing">Pricing & Inventory</TabsTrigger>
        <TabsTrigger value="additional">Additional Details</TabsTrigger>
      </TabsList>

      <TabsContent value="basic">
        <BasicTab item={item} onUpdate={handleUpdate} brandOptions={brandOptions} categoryOptions={categoryOptions} />
      </TabsContent>

      <TabsContent value="pricing">
        <PricingTab item={item} onUpdate={handleUpdate} unitOptions={unitOptions} taxRateOptions={taxRateOptions} />
      </TabsContent>

      <TabsContent value="additional">
        <AdditionalTab item={item} onUpdate={handleUpdate} />
      </TabsContent>
    </Tabs>
  )
}
