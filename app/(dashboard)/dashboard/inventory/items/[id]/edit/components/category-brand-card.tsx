"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import FormSelectInput from "@/components/FormInputs/FormSelectInput"
import type { ProductData } from "@/types/item"
import type { Option, Options } from "react-tailwindcss-select/dist/components/type"

interface CategoryBrandCardProps {
  item: ProductData
  onUpdate: (data: Partial<ProductData>) => Promise<void>
  brandOptions: Options
  categoryOptions: Options
}

// Helper function to safely extract value from Option
const getOptionValue = (option: Option): string | null => {
  return typeof option === "object" && "value" in option ? String(option.value) : null
}

// Create a default empty option
const createEmptyOption = (label: string): Option => ({
  value: "",
  label: `Select ${label}...`,
})

export function CategoryBrandCard({ item, onUpdate, brandOptions, categoryOptions }: CategoryBrandCardProps) {
  // Initialize with empty options instead of null
  const [category, setCategory] = useState<Option>(createEmptyOption("Category"))
  const [brand, setBrand] = useState<Option>(createEmptyOption("Brand"))
  const [isUpdating, setIsUpdating] = useState(false)
  const [isDirty, setIsDirty] = useState(false)

  // Initialize selected options based on item data
  useEffect(() => {
    if (item.categoryId) {
      const selectedCategory = categoryOptions.find((opt) => "value" in opt && opt.value === item.categoryId) as
        | Option
        | undefined

      if (selectedCategory) {
        setCategory(selectedCategory)
      }
    } else {
      setCategory(createEmptyOption("Category"))
    }

    if (item.brandId) {
      const selectedBrand = brandOptions.find((opt) => "value" in opt && opt.value === item.brandId) as
        | Option
        | undefined

      if (selectedBrand) {
        setBrand(selectedBrand)
      }
    } else {
      setBrand(createEmptyOption("Brand"))
    }
  }, [item.categoryId, item.brandId, categoryOptions, brandOptions])

  // Track changes
  useEffect(() => {
    const categoryValue = getOptionValue(category)
    const brandValue = getOptionValue(brand)

    const categoryChanged = categoryValue !== item.categoryId && categoryValue !== ""
    const brandChanged = brandValue !== item.brandId && brandValue !== ""

    setIsDirty(categoryChanged || brandChanged)
  }, [category, brand, item.categoryId, item.brandId])

  const handleSubmit = async () => {
    setIsUpdating(true)
    try {
      const categoryId = getOptionValue(category)
      const brandId = getOptionValue(brand)

      const updateData: Partial<ProductData> = {}

      // Only include fields that have changed and aren't empty strings
      if (categoryId !== item.categoryId && categoryId !== "") {
        updateData.categoryId = categoryId || undefined
      } else if (categoryId === "" && item.categoryId) {
        // Handle clearing the category
        updateData.categoryId = undefined
      }

      if (brandId !== item.brandId && brandId !== "") {
        updateData.brandId = brandId || undefined
      } else if (brandId === "" && item.brandId) {
        // Handle clearing the brand
        updateData.brandId = undefined
      }

      await onUpdate(updateData)
      setIsDirty(false)
      toast.success("Category and brand updated successfully")
    } catch (error) {
      console.error("Category & Brand update error:", error)
      toast.error("Failed to update category and brand")
    } finally {
      setIsUpdating(false)
    }
  }

  // Type-safe handlers for the select components
  const handleCategoryChange = (value: Option) => {
    if ("value" in value) {
      setCategory(value)
    }
  }

  const handleBrandChange = (value: Option) => {
    if ("value" in value) {
      setBrand(value)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Product Organization</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <FormSelectInput
            options={categoryOptions}
            label="Category"
            option={category}
            setOption={handleCategoryChange}
            href="/dashboard/inventory/categories"
            toolTipText="Add New Category"
          />

          <FormSelectInput
            options={brandOptions}
            label="Brand"
            option={brand}
            setOption={handleBrandChange}
            href="/dashboard/inventory/brands"
            toolTipText="Add New Brand"
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSubmit} disabled={isUpdating || !isDirty} className="w-full">
          {isUpdating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Updating...
            </>
          ) : (
            "Update Category & Brand"
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
