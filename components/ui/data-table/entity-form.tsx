// components/ui/data-table/entity-form.tsx
"use client";

import { ReactNode } from "react";
import { UseFormReturn, FieldValues } from "react-hook-form";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";

interface EntityFormProps<TFormValues extends FieldValues> {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  form: UseFormReturn<TFormValues>;
  onSubmit: (values: TFormValues) => void | Promise<void>;
  children: ReactNode;
  isSubmitting?: boolean;
  submitLabel?: string;
  cancelLabel?: string;
  size?: "sm" | "md" | "lg" | "xl";
  disableWhenSubmitting?: boolean;
}

export default function EntityForm<TFormValues extends FieldValues>({
  open,
  onOpenChange,
  title,
  form,
  onSubmit,
  children,
  isSubmitting = false,
  submitLabel = "Save",
  cancelLabel = "Cancel",
  size = "sm",
  disableWhenSubmitting = true,
}: EntityFormProps<TFormValues>) {
  // Map size string to actual width class
  const sizeClasses = {
    sm: "sm:max-w-[425px]",
    md: "sm:max-w-[550px]",
    lg: "sm:max-w-[650px]",
    xl: "sm:max-w-[800px]",
  };

  const widthClass = sizeClasses[size];

  return (
    <Dialog
      open={open}
      onOpenChange={(newOpen) => {
        if (isSubmitting && disableWhenSubmitting) return;
        onOpenChange(newOpen);
      }}
    >
      <DialogContent className={widthClass}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {children}
            <DialogFooter className="mt-6">
              <DialogClose asChild>
                <Button
                  type="button"
                  variant="outline"
                  disabled={isSubmitting && disableWhenSubmitting}
                >
                  {cancelLabel}
                </Button>
              </DialogClose>
              <Button
                type="submit"
                disabled={isSubmitting && disableWhenSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  submitLabel
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
