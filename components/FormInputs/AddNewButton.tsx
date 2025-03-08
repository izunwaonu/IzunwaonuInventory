import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
type AddNewButtonProps = {
  href: string;
  toolTipText: string;
};
export default function AddNewButton({ href, toolTipText }: AddNewButtonProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button asChild variant={"outline"} size={"sm"}>
            <Link href={href}>
              <Plus className="w-4 h-4" />
            </Link>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{toolTipText}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
