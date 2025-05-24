"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import FormSelectInput from "@/components/FormInputs/FormSelectInput"
import type { ProductData } from "@/types/item"
import type { Option, Options } from "react-tailwindcss-select/dist/components/type"

interface UnitCardProps {
  item: ProductData
  onUpdate: (data: Partial<ProductData>) => Promise<void>
  unitOptions: Options
}

// Create a default empty option
const createEmptyOption = (label: string): Option => ({
  value: "",
  label: `Select ${label}...`,
})

// Helper function to safely extract value from Option
const getOptionValue = (option: Option): string | null => {
  return typeof option === "object" && "value" in option ? String(option.value) : null
}

export function UnitCard({ item, onUpdate, unitOptions }: UnitCardProps) {
  const [unit, setUnit] = useState<Option>(createEmptyOption("Unit"))
  const [unitOfMeasure, setUnitOfMeasure] = useState<string>(item.unitOfMeasure || "")
  const [isUpdating, setIsUpdating] = useState(false)
  const [isDirty, setIsDirty] = useState(false)

  // Initialize selected option based on item data
  useEffect(() => {
    if (item.unitId) {
      const selectedUnit = unitOptions.find((opt) => "value" in opt && opt.value === item.unitId) as Option | undefined

      if (selectedUnit) {
        setUnit(selectedUnit)
      }
    } else {
      setUnit(createEmptyOption("Unit"))
    }

    setUnitOfMeasure(item.unitOfMeasure || "")
  }, [item.unitId, item.unitOfMeasure, unitOptions])

  // Track changes
  useEffect(() => {
    const unitValue = getOptionValue(unit)
    const unitChanged = unitValue !== item.unitId && unitValue !== ""
    const unitOfMeasureChanged = unitOfMeasure !== (item.unitOfMeasure || "")

    setIsDirty(unitChanged || unitOfMeasureChanged)
  }, [unit, unitOfMeasure, item.unitId, item.unitOfMeasure])

  const handleSubmit = async () => {
    setIsUpdating(true)
    try {
      const unitId = getOptionValue(unit)

      const updateData: Partial<ProductData> = {}

      // Handle unit selection
      if (unitId !== item.unitId && unitId !== "") {
        updateData.unitId = unitId || undefined
      } else if (unitId === "" && item.unitId) {
        updateData.unitId = undefined
      }

      // Handle unit of measure
      if (unitOfMeasure !== (item.unitOfMeasure || "")) {
        updateData.unitOfMeasure = unitOfMeasure || undefined
      }

      await onUpdate(updateData)
      setIsDirty(false)
      toast.success("Unit information updated successfully")
    } catch (error) {
      console.error("Unit update error:", error)
      toast.error("Failed to update unit information")
    } finally {
      setIsUpdating(false)
    }
  }

  // Type-safe handler for the select component
  const handleUnitChange = (value: Option) => {
    if ("value" in value) {
      setUnit(value)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Unit Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <FormSelectInput
            options={unitOptions}
            label="Unit"
            option={unit}
            setOption={handleUnitChange}
            href="/dashboard/inventory/units"
            toolTipText="Add New Unit"
          />

          <div className="space-y-2">
            <Label htmlFor="unitOfMeasure">Unit of Measure</Label>
            <Input
              id="unitOfMeasure"
              value={unitOfMeasure}
              onChange={(e) => setUnitOfMeasure(e.target.value)}
              placeholder="e.g., kg, pieces, liters"
            />
          </div>
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
            "Update Unit Information"
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
