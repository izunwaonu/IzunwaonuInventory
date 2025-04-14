"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { MoreHorizontal, Pencil, Trash } from "lucide-react";
import {toast} from "sonner";
import Link from "next/link";
import { deleteUser } from "@/actions/users";
import { deleteUnit } from "@/actions/units";
import { deleteBrand } from "@/actions/brands";

type ActionColumnProps = {
  row: any;
  model: any;
  editEndpoint: string;
  id: string | undefined;
  
};
export default function ActionColumn({
  row,
  model,
  editEndpoint,
  id = "",
}: ActionColumnProps) {
  const isActive = row.isActive;
  async function handleDelete() {
    try {
      if (model === "unit") {
        const res = await deleteUnit(id);
        if (res?.ok) {
         
          toast.success(`${model} Deleted Successfully`);
        }
      
      } else if (model === "user") {
        const res = await deleteUser(id);
        if (res?.ok) {
          window.location.reload();
        }
        toast.success(`${model} Deleted Successfully`);
      }
      else if (model === "brand") {
        const res = await deleteBrand(id);
        if (res?.ok) {
          window.location.reload();
        }
        toast.success(`${model} Deleted Successfully`);
      }
    } catch (error) {
      console.log(error);
      toast.error("Unit Couldn't be deleted");
    }
  }
  return (
  
    <div className="flex items-center">
    <AlertDialog>
          <AlertDialogTrigger asChild>
            {/* <DropdownMenuItem className="text-red-600 hover:text-red-700 transition-all duration-500 cursor-pointer">
              
            </DropdownMenuItem> */}
            <Button
              variant={"ghost"}
              size={"icon"}
              className="text-red-600 hover:text-red-700 transition-all duration-500 cursor-pointer "
            >
              <Trash className="w-4 h-4  mr-2 flex-shrink-0" />
              
            </Button>
          </AlertDialogTrigger>

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete this{" "}
                {model}.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <Button variant={"destructive"} onClick={() => handleDelete()}>
                Permanently Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
    </AlertDialog>
    {editEndpoint && <Button 
    variant={"ghost"} 
    size={"icon"} 
    className="text-green-600 hover:text-green-700 transition-all duration-500 cursor-pointer "  asChild
    >
            <Link href={editEndpoint} >
            <Pencil className="w-4 h-4 " />
          
           </Link>
    </Button>}
    
    
    </div>
   
  );
}
