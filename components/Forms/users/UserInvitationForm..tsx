"use client";
import { sendInvite } from "@/actions/users";
import FormSelectInput from "@/components/FormInputs/FormSelectInput";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Plus, PlusCircle, UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {toast} from "sonner";
export type inviteData = {
    email: string;
    orgId: string;
    orgName: string;
    roleId: string;
    roleName:string;
}

export function UserInvitationForm({
  roles,
  orgId,
  orgName,
}: {
  roles: {
    label: string;
    value: string;
  }[];
  orgId: string;
  orgName: string;
}) {
  const [email, setEmail] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<any>(roles[0]);
  const router = useRouter();
  const sendInvitation = async () => {
    setLoading(true);
    if (!email.trim()) {
      setErr("Email is required");
      return;
    }
    const data:inviteData = {
      email,
      orgId,
      roleName:selectedRole.label,
      orgName,
      roleId: selectedRole.value as string,
    };
    console.log(data);
    try {
      const res = await sendInvite(data);
      console.log(res);
      if (res.status!==200) {
        setLoading(false);
        toast.error(res.error);
        setErr(res.error??"")
        return
      }
      setLoading(false);
      toast.success("Invite sent successfully")
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
          <UserPlus className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            Invite User
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
            <CardTitle>Invite New User</CardTitle>
          </CardHeader>
          <CardFooter className="flex flex-col gap-4">
            <div className="flex flex-col w-full gap-2">
              <Input
              className="block w-full rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-rose-600 sm:text-sm sm:leading-6 text-sm"
                type="email"
                placeholder="example-user@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && sendInvitation()}
              />
              {err && <p className="text-red-500 -mt-1">{err}</p>}
              <FormSelectInput
                label="Blog Categories"
                options={roles}
                option={selectedRole}
                setOption={setSelectedRole}
              />
              {loading ? (
                <Button disabled>
                  <Loader2 className="animate-spin mr-2 h-4 w-4" />
                  Please wait...
                </Button>
              ) : (
                <Button onClick={sendInvitation}>
                  <Plus className="mr-2 h-4 w-4" /> Invite User
                </Button>
              )}
            </div>
          </CardFooter>
        </Card>
        {/* <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter> */}
      </DialogContent>
    </Dialog>
  );
}
