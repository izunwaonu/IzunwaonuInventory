import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CloudUpload } from "lucide-react";
import Link from "next/link";

export function DialogDemo() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Edit Profile</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Excel Upload</DialogTitle>
          <DialogDescription>
            You can Bring all your Data from excel, Please Download the Sample
            file First to Make Sure you have Data Columns Required
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Button asChild variant="outline">
            <Link href="/Categories.xlsx" download>
              Download Sample Categories Data
            </Link>
          </Button>

          <div className="flex items-center justify-center w-full">
            <label
              htmlFor="dropzone-file"
              className="flex flex-col items-center justify-center w-full h-36 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <CloudUpload className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" />

                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-semibold">Click to upload</span> or drag
                  and drop
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Only Excel Files (.xlsx)
                </p>
              </div>
              <input
                id="dropzone-file"
                accept=".xls,.xlsx"
                type="file"
                className="hidden"
              />
            </label>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Upload the Categories</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
