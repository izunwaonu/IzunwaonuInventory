
import { notFound } from "next/navigation"
import { ItemUpdateForm } from "./item-update-form"
import { db } from "@/prisma/db"
import { getOrgCategories } from "@/actions/categories"
import { getOrgBrand } from "@/actions/brands"
import { getOrgUnit } from "@/actions/units"
import { getOrgTaxes } from "@/actions/tax"
import { Toaster } from "sonner"
import { getItemById } from "@/actions/items"
import { ArrowLeft, Calendar, Hash } from "lucide-react"
import Link from "next/link"
import { Suspense } from "react"
import EditPageSkeleton from "./edit-loading"

export default async function ItemEditPage({ params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id


 // Format the updated date
  const formatDate = (dateString?: string | Date) => {
    if (!dateString) return 'Not updated'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }


  try {
   
    const {data:item, success,error} = await getItemById(id)

    if (!item) {
      notFound()
    }

    const units = await getOrgUnit(item.orgId)
    const taxRates = await getOrgTaxes(item.orgId)
    const categories = await getOrgCategories(item.orgId)
    const brands = await getOrgBrand(item.orgId)

    const brandOptions = brands.map((item) => ({
      label: item.name,
      value: item.id,
    }))

    const categoryOptions = categories.map((item) => ({
      label: item.title,
      value: item.id,
    }))

    const unitOptions = units.map((unit) => ({
      label: unit.name,
      value: unit.id,
    }))

    const taxRateOptions = taxRates.map((taxRate) => ({
      label: taxRate.name,
      value: taxRate.id,
    }))

    return (
      <Suspense fallback={<EditPageSkeleton />}>
             <div className="container py-10">
        <div className="mb-8">
      {/* Back Button */}
      <Link href='/dashboard/inventory/items'
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors duration-200 mb-6 group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
        <span className="text-sm font-medium">Back to Items</span>
      </Link>

      {/* Main Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-6 shadow-sm">
        <div className="flex flex-col space-y-4">
          {/* Title */}
          <h1 className="text-xl font-bold text-gray-900 leading-tight">
            Update Item: <span className=" text-gray-600">{item.name}</span>
          </h1>
          
          {/* SKU and Updated Info */}
          <div className="flex flex-wrap items-center gap-6 text-sm">
            {/* SKU */}
            {item.sku && (
              <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-gray-200 shadow-sm">
                <Hash className="w-4 h-4 text-gray-500" />
                <span className="text-gray-600 font-sm">SKU:</span>
                <span className="font-semibold text-gray-900">{item.sku}</span>
              </div> 
            )}
            
            {/* Last Updated */}
            <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-gray-200 shadow-sm">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span className="text-gray-600 font-medium">Last Updated:</span>
              <span className="font-semibold text-gray-900">{formatDate(item.updatedAt)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
        {/* <h1 className="text-3xl font-bold mb-8">Update Item: {item.name}</h1> */}
        <ItemUpdateForm
          brandOptions={brandOptions}
          categoryOptions={categoryOptions}
          item={item}
          unitOptions={unitOptions}
          taxRateOptions={taxRateOptions}
        />
      </div>

      </Suspense>
      
    )
  } catch (error) {
    console.error("Error loading item:", error)
    notFound()
  }
}
