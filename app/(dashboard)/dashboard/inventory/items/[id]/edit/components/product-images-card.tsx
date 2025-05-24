"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Loader2, X } from "lucide-react"
import { toast } from "sonner"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { UploadButton } from "@/lib/uploadthing"
import Image from "next/image"
import type { ProductData } from "@/types/item"

interface ProductImagesCardProps {
  item: ProductData
  onUpdate: (data: Partial<ProductData>) => Promise<void>
}

// Maximum number of images allowed
const MAX_IMAGES = 4

export function ProductImagesCard({ item, onUpdate }: ProductImagesCardProps) {
  const [images, setImages] = useState<string[]>([])
  const [isUpdating, setIsUpdating] = useState(false)
  const [isDirty, setIsDirty] = useState(false)

  // Initialize images with item data (no defaults)
  useEffect(() => {
    if (item.imageUrls && item.imageUrls.length > 0) {
      setImages(item.imageUrls.slice(0, MAX_IMAGES))
    } else {
      setImages([])
    }
  }, [item.imageUrls])

  // Track changes
  useEffect(() => {
    // Check if images have changed from the original
    const originalImages = item.imageUrls || []

    // If lengths are different, they've changed
    if (originalImages.length !== images.length) {
      setIsDirty(true)
      return
    }

    // Check if any image has changed
    const hasChanged = images.some((img, index) => {
      return index >= originalImages.length || img !== originalImages[index]
    })

    setIsDirty(hasChanged)
  }, [images, item.imageUrls])

  const handleImagesUpload = (newImageUrls: string[]) => {
    // Add new images up to the maximum of 4
    const updatedImages = [...images, ...newImageUrls].slice(0, MAX_IMAGES)
    setImages(updatedImages)

    // Show notification if we had to truncate images
    if (images.length + newImageUrls.length > MAX_IMAGES) {
      toast.info(`Maximum of ${MAX_IMAGES} images allowed. Some images were not added.`)
    }
  }

  const handleRemoveImage = (index: number) => {
    const updatedImages = [...images]
    updatedImages.splice(index, 1)
    setImages(updatedImages)
  }

  const handleSubmit = async () => {
    setIsUpdating(true)
    try {
      await onUpdate({ imageUrls: images })
      setIsDirty(false)
      toast.success("Product images updated successfully")
    } catch (error) {
      console.error("Product images update error:", error)
      toast.error("Failed to update product images")
    } finally {
      setIsUpdating(false)
    }
  }

  // Calculate how many empty slots we have
  const emptySlots = MAX_IMAGES - images.length

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Product Images ({images.length}/{MAX_IMAGES})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Image Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {images.map((imageUrl, index) => (
            <div key={index} className="relative group">
              <div className="aspect-square w-full rounded-md overflow-hidden border">
                <Image
                  alt={`Product image ${index + 1}`}
                  className="object-contain rounded-md w-full h-full"
                  src={imageUrl || "/placeholder.svg"}
                  width={100}
                  height={100}
                />
              </div>
              <button
                onClick={() => handleRemoveImage(index)}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Remove image"
              >
                <X size={16} />
              </button>
            </div>
          ))}

          {/* Empty slots */}
          {Array.from({ length: emptySlots }).map((_, index) => (
            <div
              key={`empty-${index}`}
              className="aspect-square w-full rounded-md border border-dashed border-gray-300 flex items-center justify-center text-gray-400"
            >
              <span>Empty</span>
            </div>
          ))}
        </div>

        {/* Upload Button - only show if we have room for more images */}
        {emptySlots > 0 && (
          <div className="mt-4">
            <UploadButton
              className="w-full ut-button:bg-blue-500 ut-button:ut-readying:bg-blue-500/80"
              endpoint="itemImages" // Changed from productImage to imageUploader
              onClientUploadComplete={(res) => {
                if (res && res.length > 0) {
                  handleImagesUpload(res.map((item) => item.url))
                }
              }}
              onUploadError={(error: Error) => {
                toast.error(`Upload error: ${error.message}`)
              }}
              config={{
                mode: "auto",
                appendOnPaste: true,
              }}
            />
            <p className="text-xs text-gray-500 mt-1 text-center">
              Upload up to {emptySlots} more image{emptySlots !== 1 ? "s" : ""} (maximum {MAX_IMAGES} total)
            </p>
          </div>
        )}

        {/* Update Button */}
        <Button
          onClick={handleSubmit}
          disabled={isUpdating || !isDirty}
          className="w-full bg-red-500 hover:bg-red-600 text-white mt-4"
        >
          {isUpdating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Updating Images...
            </>
          ) : (
            "Update Images"
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
