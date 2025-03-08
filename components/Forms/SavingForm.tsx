"use client";

import { Card, CardContent } from "@/components/ui/card";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Saving } from "@prisma/client";
import { SavingProps } from "@/types/types";
import FormHeader from "./FormHeader";
import TextInput from "../FormInputs/TextInput";
import FormFooter from "./FormFooter";

import FormSelectInput from "../FormInputs/FormSelectInput";
import { convertIsoToDateString } from "@/lib/convertISODateToNorma";
import { createSavings } from "@/actions/savings";
import { convertDateToIso } from "@/lib/convertDateToIso";

export type SelectOptionProps = {
  label: string;
  value: string;
};
type SavingFormProps = {
  editingId?: string | undefined;
  initialData?: Saving | undefined | null;
  members: SelectOptionProps[];
};
export interface Member {
  id: string;
  name: string;
}
export const months = [
  {
    label: "January",
    value: "JANUARY",
  },
  {
    label: "February",
    value: "FEBRUARY",
  },
  {
    label: "March",
    value: "MARCH",
  },
  {
    label: "April",
    value: "APRIL",
  },
  {
    label: "May",
    value: "MAY",
  },
  {
    label: "June",
    value: "JUNE",
  },
  {
    label: "July",
    value: "JULY",
  },
  {
    label: "August",
    value: "AUGUST",
  },
  {
    label: "September",
    value: "SEPTEMBER",
  },
  {
    label: "October",
    value: "OCTOBER",
  },
  {
    label: "November",
    value: "NOVEMBER",
  },
  {
    label: "December",
    value: "DECEMBER",
  },
];
export default function SavingForm({
  editingId,
  initialData,
  members,
}: SavingFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SavingProps>({
    defaultValues: {
      paymentDate: convertIsoToDateString(new Date().toISOString()),
      // description: initialData?.description || "",
    },
  });
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const initialUserId = initialData?.userId;
  const initialMonthValue = initialData?.month;
  const initialUser = members.find((item) => item.value === initialUserId);
  const initialMonth = months.find((item) => item.value === initialMonthValue);
  const [selectedUser, setSelectedUser] = useState<any>(initialUser);
  const [selectedMonth, setSelectedMonth] = useState<any>(initialMonth);

  async function saveSavings(data: SavingProps) {
    try {
      data.amount = Number(data.amount);
      data.month = selectedMonth.value;
      data.name = selectedUser.label;
      data.userId = selectedUser.value;
      data.paymentDate = convertDateToIso(data.paymentDate);
      setLoading(true);

      if (editingId) {
        // await updateCategoryById(editingId, data);
        setLoading(false);
        // Toast
        toast.success("Updated Successfully!");
        //reset
        reset();
        //route
        router.push("/dashboard/savings");
      } else {
        // console.log(data);
        await createSavings(data);
        setLoading(false);
        // Toast
        toast.success("Successfully Created!");
        //reset
        reset();
        //route
        router.push("/dashboard/savings");
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  }
  // async function handleDeleteAll() {
  // setLoading(true);
  // try {
  // await deleteManyCategories();
  // setLoading(false);
  // } catch (error) {
  // console.log(error);
  // }
  // }

  // FIELDS
  //   amount      Int
  //   month       String
  //   name        String
  //   userId      String    @db.ObjectId
  // paymentDate DateTime  @default(now())

  return (
    <form className="" onSubmit={handleSubmit(saveSavings)}>
      <FormHeader
        href="/savings"
        parent=""
        title="Saving"
        editingId={editingId}
        loading={loading}
        hideBtn={true}
      />

      <div className="grid grid-cols-12 gap-6 py-8">
        <div className="lg:col-span-8 col-span-full space-y-3">
          <Card>
            <CardContent>
              <div className="grid gap-6">
                <div className="grid gap-3 mt-3">
                  <FormSelectInput
                    label="Members"
                    options={members}
                    option={selectedUser}
                    setOption={setSelectedUser}
                    toolTipText="Add New Member"
                    href="/register"
                  />
                  <TextInput
                    register={register}
                    errors={errors}
                    label="Amount"
                    name="amount"
                  />
                  <FormSelectInput
                    label="Months"
                    options={months}
                    option={selectedMonth}
                    setOption={setSelectedMonth}
                  />
                  <TextInput
                    register={register}
                    errors={errors}
                    label="Payment Date"
                    name="paymentDate"
                    type="date"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <FormFooter
        href="/savings"
        editingId={editingId}
        loading={loading}
        title="Saving"
        parent=""
      />
    </form>
  );
}
