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

interface TaxCalculationCardProps {
  item: ProductData
  onUpdate: (data: Partial<ProductData>) => Promise<void>
  taxRateOptions: Options
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

export function TaxCalculationCard({ item, onUpdate, taxRateOptions }: TaxCalculationCardProps) {
  const [taxRate, setTaxRate] = useState<Option>(createEmptyOption("Tax Rate"))
  const [tax, setTax] = useState<number>(item.tax || 0)
  const [isUpdating, setIsUpdating] = useState(false)
  const [isDirty, setIsDirty] = useState(false)

  // Calculate tax amount based on selling price and tax rate
  const taxAmount = (item.sellingPrice * tax) / 100
  const totalWithTax = item.sellingPrice + taxAmount

  // Initialize selected option based on item data
  useEffect(() => {
    if (item.taxRateId) {
      const selectedTaxRate = taxRateOptions.find((opt) => "value" in opt && opt.value === item.taxRateId) as
        | Option
        | undefined

      if (selectedTaxRate) {
        setTaxRate(selectedTaxRate)
      }
    } else {
      setTaxRate(createEmptyOption("Tax Rate"))
    }

    setTax(item.tax || 0)
  }, [item.taxRateId, item.tax, taxRateOptions])

  // Track changes
  useEffect(() => {
    const taxRateValue = getOptionValue(taxRate)
    const taxRateChanged = taxRateValue !== item.taxRateId && taxRateValue !== ""
    const taxChanged = tax !== (item.tax || 0)

    setIsDirty(taxRateChanged || taxChanged)
  }, [taxRate, tax, item.taxRateId, item.tax])

  const handleSubmit = async () => {
    setIsUpdating(true)
    try {
      const taxRateId = getOptionValue(taxRate)

      const updateData: Partial<ProductData> = {}

      // Handle tax rate selection
      if (taxRateId !== item.taxRateId && taxRateId !== "") {
        updateData.taxRateId = taxRateId || undefined
      } else if (taxRateId === "" && item.taxRateId) {
        updateData.taxRateId = undefined
      }

      // Handle tax percentage
      if (tax !== (item.tax || 0)) {
        updateData.tax = tax
      }

      await onUpdate(updateData)
      setIsDirty(false)
      toast.success("Tax information updated successfully")
    } catch (error) {
      console.error("Tax update error:", error)
      toast.error("Failed to update tax information")
    } finally {
      setIsUpdating(false)
    }
  }

  // Type-safe handler for the select component
  const handleTaxRateChange = (value: Option) => {
    if ("value" in value) {
      setTaxRate(value)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Tax Calculation</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <FormSelectInput
            options={taxRateOptions}
            label="Tax Rate"
            option={taxRate}
            setOption={handleTaxRateChange}
            href="/dashboard/inventory/tax-rates"
            toolTipText="Add New Tax Rate"
          />

          <div className="space-y-2">
            <Label htmlFor="tax">Tax Percentage (%)</Label>
            <Input
              id="tax"
              type="number"
              step="0.01"
              min="0"
              max="100"
              value={tax}
              onChange={(e) => setTax(Number.parseFloat(e.target.value) || 0)}
              placeholder="Enter tax percentage"
            />
          </div>

          {/* Tax Calculation Display */}
          <div className="bg-gray-50 p-4 rounded-md space-y-2">
            <div className="flex justify-between text-sm">
              <span>Selling Price:</span>
              <span>${item.sellingPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Tax ({tax}%):</span>
              <span>${taxAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-semibold border-t pt-2">
              <span>Total with Tax:</span>
              <span>${totalWithTax.toFixed(2)}</span>
            </div>
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
            "Update Tax Information"
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
