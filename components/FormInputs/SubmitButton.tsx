import { cn } from "@/lib/utils";
import { Loader, Plus } from "lucide-react";
import React from "react";
type SubmitButtonProps = {
  title: string;
  loadingTitle?: string;
  className?: string;
  loaderIcon?: any;
  buttonIcon?: any;
  loading: boolean;
  showIcon?: boolean;
  size?: "default" | "sm" | "lg" | "icon" | null | undefined;
};
export default function SubmitButton({
  title,
  loadingTitle = "Saving Please wait...",
  loading,
  className,
  loaderIcon = Loader,
  buttonIcon = Plus,
  showIcon = true,
}: SubmitButtonProps) {
  const LoaderIcon = loaderIcon;
  const ButtonIcon = buttonIcon;
  return (
    <>
      {loading ? (
        <button
          type="button"
          disabled
          className={cn(
            "items-center flex justify-center rounded-md bg-indigo-600/55 px-3 py-2 text-sm font-semibold leading-6 text-white shadow-sm  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 cursor-not-allowed",
            className
          )}
        >
          <LoaderIcon className="w-4 h-4 animate-spin mr-2" />
          {loadingTitle}
        </button>
      ) : (
        <button
          type="submit"
          className={cn(
            "flex items-center justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600",
            className
          )}
        >
          {showIcon && <ButtonIcon className="w-4 h-4 mr-2" />}
          {title}
        </button>
      )}
    </>
  );
}
