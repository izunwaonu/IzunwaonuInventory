"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

import type { ProductData } from "@/types/item"
import ImageUploadButton from "@/components/FormInputs/ImageUploadButton"

interface WeightThumbnailCardProps {
  item: ProductData
  onUpdate: (data: Partial<ProductData>) => Promise<void>
}

export function WeightThumbnailCard({ item, onUpdate }: WeightThumbnailCardProps) {
  const [weight, setWeight] = useState<number>(item.weight || 0)
  const [thumbnail, setThumbnail] = useState<string>(item.thumbnail || "")
  const [isUpdating, setIsUpdating] = useState(false)
  const [isDirty, setIsDirty] = useState(false)

  useEffect(() => {
    setWeight(item.weight || 0)
    setThumbnail(item.thumbnail || "")
  }, [item.weight, item.thumbnail])

  const handleWeightChange = (value: number) => {
    setWeight(value)
    setIsDirty(true)
  }

  const handleThumbnailChange = (url: string) => {
    setThumbnail(url)
    setIsDirty(true)
  }

  const handleSubmit = async () => {
    setIsUpdating(true)
    try {
      const updateData = {
        weight,
        thumbnail,
      }

      await onUpdate(updateData)
      setIsDirty(false)
      toast.success("Weight and thumbnail updated successfully")
    } catch (error) {
      console.error("Weight & Thumbnail update error:", error)
      toast.error("Failed to update weight and thumbnail")
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Weight & Thumbnail</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="weight">Weight</Label>
          <Input
            id="weight"
            type="number"
            step="0.01"
            value={weight}
            onChange={(e) => handleWeightChange(Number.parseFloat(e.target.value) || 0)}
            placeholder="Enter weight"
          />
        </div>

        <div className="space-y-2">
          <Label>Thumbnail</Label>
          <ImageUploadButton
            title="Product Thumbnail"
            imageUrl={thumbnail || "/placeholder.svg?height=80&width=80"}
            setImageUrl={handleThumbnailChange}
            endpoint="itemImage" // Changed from imageUploader to productImage
            display="vertical"
            size="lg"
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleSubmit}
          disabled={isUpdating || !isDirty}
          className="w-full bg-red-400 hover:bg-red-500 text-white"
        >
          {isUpdating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Updating...
            </>
          ) : (
            "Update Weight & Thumbnail"
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
