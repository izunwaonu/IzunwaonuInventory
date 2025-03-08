"use client";
import { cn } from "@/lib/utils";
import React, { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { CircleHelp, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
type TextInputProps = {
  register: any;
  errors: any;
  label: string;
  type?: string;
  name: string;
  toolTipText?: string;
  placeholder?: string;
  forgotPasswordLink?: string;
  icon?: any;
};
export default function PasswordInput({
  register,
  errors,
  label,
  type = "text",
  name,
  toolTipText,
  icon,
  placeholder,
  forgotPasswordLink,
}: TextInputProps) {
  const Icon = icon;
  const [passType, setPassType] = useState(type);
  return (
    <div>
      <div className="flex space-x-2 items-center">
        <div className="flex items-center justify-between w-full">
          <label
            htmlFor="password"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            {label}
          </label>
          {forgotPasswordLink && (
            <div className="text-sm">
              <Link
                href={forgotPasswordLink}
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Forgot password?
              </Link>
            </div>
          )}
        </div>
        {toolTipText && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button>
                  <CircleHelp className="w-4 h-4 text-slate-500" />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{toolTipText}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      <div className="mt-2">
        <div className="relative rounded-md ">
          {icon && (
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Icon className="text-slate-300 w-4 h-4" />
            </div>
          )}
          <input
            id={name}
            type={passType}
            {...register(name, {
              required: true,
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            })}
            className={cn(
              "block w-full rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 text-sm",
              (errors[name] && "focus:ring-red-500 pl-8") || (icon && "pl-8")
            )}
            placeholder={placeholder || label}
          />
          <button
            type="button"
            onClick={() =>
              setPassType((prev) => (prev === "password" ? "text" : "password"))
            }
            className="bg-white py-2 px-3 rounded-tr-md rounded-br-md absolute inset-y-0 right-1 my-[2px] flex items-center"
          >
            {passType === "password" ? (
              <Eye className="w-4 h-4 text-slate-600" />
            ) : (
              <EyeOff className="w-4 h-4 text-slate-600" />
            )}
          </button>
        </div>
        {errors[name] && (
          <span className="text-xs text-red-600">{errors[name].message}</span>
        )}
      </div>
    </div>
  );
}
