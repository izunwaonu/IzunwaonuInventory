// // "use client"

// // import { useState, useEffect } from "react"
// // import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
// // import { Button } from "@/components/ui/button"
// // import { Input } from "@/components/ui/input"
// // import { Textarea } from "@/components/ui/textarea"
// // import { Checkbox } from "@/components/ui/checkbox"
// // import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// // import { Label } from "@/components/ui/label"
// // import { Loader2 } from "lucide-react"

// // interface FieldOption {
// //   value: string
// //   label: string
// // }

// // interface Field {
// //   name: string
// //   label: string
// //   type: "text" | "number" | "textarea" | "checkbox" | "select"
// //   value: string | number | boolean
// //   options?: FieldOption[]
// // }

// // interface UpdateCardProps {
// //   title: string
// //   fields: Field[]
// //   onUpdate: (data: Record<string, any>) => Promise<void>
// // }

// // export function UpdateCard({ title, fields, onUpdate }: UpdateCardProps) {
// //   const [formData, setFormData] = useState<Record<string, any>>({})
// //   const [isUpdating, setIsUpdating] = useState(false)
// //   const [isDirty, setIsDirty] = useState(false)

// //   useEffect(() => {
// //     const initialData: Record<string, any> = {}
// //     fields.forEach((field) => {
// //       initialData[field.name] = field.value
// //     })
// //     setFormData(initialData)
// //   }, [fields])

// //   const handleChange = (name: string, value: any) => {
// //     setFormData((prev) => ({ ...prev, [name]: value }))
// //     setIsDirty(true)
// //   }

// //   const handleSubmit = async () => {
// //     setIsUpdating(true)
// //     try {
// //       await onUpdate(formData)
// //       setIsDirty(false)
// //     } finally {
// //       setIsUpdating(false)
// //     }
// //   }

// //   return (
// //     <Card>
// //       <CardHeader>
// //         <CardTitle className="text-lg">{title}</CardTitle>
// //       </CardHeader>
// //       <CardContent className="space-y-4">
// //         {fields.map((field) => (
// //           <div key={field.name} className="space-y-2">
// //             <Label htmlFor={field.name}>{field.label}</Label>

// //             {field.type === "text" && (
// //               <Input
// //                 id={field.name}
// //                 value={formData[field.name] || ""}
// //                 onChange={(e) => handleChange(field.name, e.target.value)}
// //               />
// //             )}

// //             {field.type === "number" && (
// //               <Input
// //                 id={field.name}
// //                 type="number"
// //                 value={formData[field.name] || 0}
// //                 onChange={(e) => handleChange(field.name, Number.parseFloat(e.target.value) || 0)}
// //               />
// //             )}

// //             {field.type === "textarea" && (
// //               <Textarea
// //                 id={field.name}
// //                 value={formData[field.name] || ""}
// //                 onChange={(e) => handleChange(field.name, e.target.value)}
// //               />
// //             )}

// //             {field.type === "checkbox" && (
// //               <div className="flex items-center space-x-2">
// //                 <Checkbox
// //                   id={field.name}
// //                   checked={!!formData[field.name]}
// //                   onCheckedChange={(checked) => handleChange(field.name, checked)}
// //                 />
// //                 <label
// //                   htmlFor={field.name}
// //                   className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
// //                 >
// //                   {field.label}
// //                 </label>
// //               </div>
// //             )}

// //             {field.type === "select" && field.options && (
// //               <Select
// //                 value={formData[field.name] ? String(formData[field.name]) : "none"}
// //                 onValueChange={(value) => handleChange(field.name, value === "none" ? null : value)}
// //               >
// //                 <SelectTrigger>
// //                   <SelectValue placeholder="Select..." />
// //                 </SelectTrigger>
// //                 <SelectContent>
// //                   {field.options.map((option) => (
// //                     <SelectItem key={option.value} value={option.value}>
// //                       {option.label}
// //                     </SelectItem>
// //                   ))}
// //                 </SelectContent>
// //               </Select>
// //             )}
// //           </div>
// //         ))}
// //       </CardContent>
// //       <CardFooter>
// //         <Button onClick={handleSubmit} disabled={isUpdating || !isDirty} className="w-full">
// //           {isUpdating ? (
// //             <>
// //               <Loader2 className="mr-2 h-4 w-4 animate-spin" />
// //               Updating...
// //             </>
// //           ) : (
// //             "Update"
// //           )}
// //         </Button>
// //       </CardFooter>
// //     </Card>
// //   )
// // }

// "use client"

// import { useState, useEffect } from "react"
// import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Textarea } from "@/components/ui/textarea"
// import { Checkbox } from "@/components/ui/checkbox"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Label } from "@/components/ui/label"
// import { Loader2 } from "lucide-react"

// interface FieldOption {
//   value: string
//   label: string
// }

// interface Field {
//   name: string
//   label: string
//   type: "text" | "number" | "textarea" | "checkbox" | "select"
//   value: string | number | boolean
//   options?: FieldOption[]
//   disabled?: boolean
// }

// interface UpdateCardProps {
//   title: string
//   fields: Field[]
//   onUpdate: (data: Record<string, any>) => Promise<void>
// }

// export function UpdateCard({ title, fields, onUpdate }: UpdateCardProps) {
//   const [formData, setFormData] = useState<Record<string, any>>({})
//   const [isUpdating, setIsUpdating] = useState(false)
//   const [isDirty, setIsDirty] = useState(false)

//   useEffect(() => {
//     const initialData: Record<string, any> = {}
//     fields.forEach((field) => {
//       initialData[field.name] = field.value
//     })
//     setFormData(initialData)
//   }, [fields])

//   const handleChange = (name: string, value: any) => {
//     setFormData((prev) => ({ ...prev, [name]: value }))
//     setIsDirty(true)
//   }

//   const handleSubmit = async () => {
//     setIsUpdating(true)
//     try {
//       await onUpdate(formData)
//       setIsDirty(false)
//     } finally {
//       setIsUpdating(false)
//     }
//   }

//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle className="text-lg">{title}</CardTitle>
//       </CardHeader>
//       <CardContent className="space-y-4">
//         {fields.map((field) => (
//           <div key={field.name} className="space-y-2">
//             <Label htmlFor={field.name}>{field.label}</Label>

//             {field.type === "text" && (
//               <Input
//                 id={field.name}
//                 value={formData[field.name] || ""}
//                 onChange={(e) => handleChange(field.name, e.target.value)}
//                 disabled={field.disabled}
//               />
//             )}

//             {field.type === "number" && (
//               <Input
//                 id={field.name}
//                 type="number"
//                 value={formData[field.name] || 0}
//                 onChange={(e) => handleChange(field.name, Number.parseFloat(e.target.value) || 0)}
//                 disabled={field.disabled}
//               />
//             )}

//             {field.type === "textarea" && (
//               <Textarea
//                 id={field.name}
//                 value={formData[field.name] || ""}
//                 onChange={(e) => handleChange(field.name, e.target.value)}
//                 disabled={field.disabled}
//               />
//             )}

//             {field.type === "checkbox" && (
//               <div className="flex items-center space-x-2">
//                 <Checkbox
//                   id={field.name}
//                   checked={!!formData[field.name]}
//                   onCheckedChange={(checked) => handleChange(field.name, checked)}
//                   disabled={field.disabled}
//                 />
//                 <label
//                   htmlFor={field.name}
//                   className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
//                 >
//                   {field.label}
//                 </label>
//               </div>
//             )}

//             {field.type === "select" && field.options && (
//               <Select
//                 value={formData[field.name] ? String(formData[field.name]) : "none"}
//                 onValueChange={(value) => handleChange(field.name, value === "none" ? null : value)}
//                 disabled={field.disabled}
//               >
//                 <SelectTrigger>
//                   <SelectValue placeholder="Select..." />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {field.options.map((option) => (
//                     <SelectItem key={option.value} value={option.value}>
//                       {option.label}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             )}
//           </div>
//         ))}
//       </CardContent>
//       <CardFooter>
//         <Button onClick={handleSubmit} disabled={isUpdating || !isDirty} className="w-full">
//           {isUpdating ? (
//             <>
//               <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//               Updating...
//             </>
//           ) : (
//             "Update"
//           )}
//         </Button>
//       </CardFooter>
//     </Card>
//   )
// }

"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

interface FieldOption {
  value: string
  label: string
}

interface Field {
  name: string
  label: string
  type: "text" | "number" | "textarea" | "checkbox" | "select"
  value: string | number | boolean
  options?: FieldOption[]
  disabled?: boolean
}

interface UpdateCardProps {
  title: string
  fields: Field[]
  onUpdate: (data: Record<string, any>) => Promise<void>
}

export function UpdateCard({ title, fields, onUpdate }: UpdateCardProps) {
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [isUpdating, setIsUpdating] = useState(false)
  const [isDirty, setIsDirty] = useState(false)

  useEffect(() => {
    const initialData: Record<string, any> = {}
    fields.forEach((field) => {
      initialData[field.name] = field.value
    })
    setFormData(initialData)
  }, [fields])

  const handleChange = (name: string, value: any) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
    setIsDirty(true)
  }

  const handleSubmit = async () => {
    setIsUpdating(true)
    try {
      // Only send the fields that belong to this card
      const updateData: Record<string, any> = {}
      fields.forEach((field) => {
        if (!field.disabled) {
          updateData[field.name] = formData[field.name]
        }
      })

      await onUpdate(updateData)
      setIsDirty(false)
    } catch (error) {
      console.error("Card update error:", error)
      toast.error("Failed to update this section")
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {fields.map((field) => (
          <div key={field.name} className="space-y-2">
            <Label htmlFor={field.name}>{field.label}</Label>

            {field.type === "text" && (
              <Input
                id={field.name}
                value={formData[field.name] || ""}
                onChange={(e) => handleChange(field.name, e.target.value)}
                disabled={field.disabled}
              />
            )}

            {field.type === "number" && (
              <Input
                id={field.name}
                type="number"
                step="any"
                value={formData[field.name] || 0}
                onChange={(e) => handleChange(field.name, Number.parseFloat(e.target.value) || 0)}
                disabled={field.disabled}
              />
            )}

            {field.type === "textarea" && (
              <Textarea
                id={field.name}
                value={formData[field.name] || ""}
                onChange={(e) => handleChange(field.name, e.target.value)}
                disabled={field.disabled}
              />
            )}

            {field.type === "checkbox" && (
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={field.name}
                  checked={!!formData[field.name]}
                  onCheckedChange={(checked) => handleChange(field.name, checked)}
                  disabled={field.disabled}
                />
                <label
                  htmlFor={field.name}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {field.label}
                </label>
              </div>
            )}

            {field.type === "select" && field.options && (
              <Select
                value={formData[field.name] ? String(formData[field.name]) : "none"}
                onValueChange={(value) => handleChange(field.name, value === "none" ? null : value)}
                disabled={field.disabled}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent>
                  {field.options.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        ))}
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleSubmit}
          disabled={isUpdating || !isDirty || fields.every((field) => field.disabled)}
          className="w-full"
        >
          {isUpdating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Updating...
            </>
          ) : (
            "Update"
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
