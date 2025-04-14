"use client";
import { createUnit } from "@/actions/units";

import TextInput from "@/components/FormInputs/TextInput";
import { Button } from "@/components/ui/button";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Check, LayoutGrid, Loader2, Plus, PlusCircle, UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {toast} from "sonner";
export type inviteData = {
    email: string;
    orgId: string;
    orgName: string;
    roleId: string;
    roleName:string;
}
export type UnitFormProps = {
  name: string;
  symbol: string;
  orgId: string;
}

export default function UnitForm ({
  
  orgId,

}: {
  orgId: string;
 
}){ 
const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UnitFormProps>();

  
  const [loading, setLoading] = useState(false);
  
  const saveUnit = async (data:UnitFormProps) => {
    setLoading(true);
    
  data.orgId = orgId,
    console.log(data);
    try {
      const res = await createUnit(data);
      console.log(res);
      if (res.status!==200) {
        setLoading(false);
        toast.error(res.error);
        
        return
      }
      setLoading(false);
      toast.success("Unit created successfully");
    } catch (error) {
      setLoading(false);
      toast.success("Something went wrong")
      console.log(error)
    }
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" className="h-8 gap-1">
          <LayoutGrid className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
           Create Unit
          </span>
          <span className="md:sr-only">Add</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle></DialogTitle>
        </DialogHeader>
        <Card className="w-full ">
          <CardHeader>
            <CardTitle>Create New Unit</CardTitle>
          </CardHeader>
          <CardFooter className="flex flex-col gap-4">
            <form onSubmit={handleSubmit(saveUnit)} className="flex flex-col w-full gap-2">
              <TextInput
                  register={register}
                  errors={errors}
                  label="Unit Title"
                  name="name"
                />
                <TextInput
                  register={register}
                  errors={errors}
                  label="Unit Symbol"
                  name="symbol"
                />
              
              {loading ? (
                <Button disabled>
                  <Loader2 className="animate-spin mr-2 h-4 w-4" />
                  Please wait...
                </Button>
              ) : (
                <Button>
                  <Check className="mr-2 h-4 w-4" /> Create Unit
                </Button>
              )}
            </form>
          </CardFooter>
        </Card>
        {/* <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter> */}
      </DialogContent>
    </Dialog>
  )};

