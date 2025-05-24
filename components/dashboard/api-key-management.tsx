

// "use client"

// import { useState } from "react"
// import { Button } from "@/components/ui/button"
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card"
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog"
// import { Input } from "@/components/ui/input"
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table"
// import { Copy, Eye, EyeOff, Loader2, MoreHorizontal } from "lucide-react"
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"
// import { toast } from "sonner"
// import { createAPIKey, deleteAPIKey } from "@/actions/apiKey"
// import { ApiKey } from "@prisma/client"
// import { timeAgo } from "@/lib/timeAgo"

// function maskApiKey(key: string):string{
//   const prefix = key.substring(0,8);
//   return `${prefix}${".".repeat(10)
//   }`
// }

// export function ApiKeyManagement({orgKeys}:{orgKeys:ApiKey[]}) {
//   const [apiKeys, setApiKeys] = useState<ApiKey[]>(orgKeys)
//   const [newKeyName, setNewKeyName] = useState("")
//   const [showCreateDialog, setShowCreateDialog] = useState(false)
//   const [newlyCreatedKey, setNewlyCreatedKey] = useState<ApiKey | null>(null)
//   const [showKeyDialog, setShowKeyDialog] = useState(false)
//   const [visibleKeyId, setVisibleKeyId] = useState<string | null>(null)
//   const [keyToRevoke, setKeyToRevoke] = useState<string | null>(null)
//   const [isCreating, setIsCreating] = useState(false)
//   const [isRevoking, setIsRevoking] = useState(false)

//   const handleCreateKey = async () => {
//     if (!newKeyName.trim()) return
//   setIsCreating(true)
//     const { data, error } = await createAPIKey(newKeyName)
//     if (error || !data) {
//       toast.error("API key failed to create", {
//         description: error,
//       })
//       setIsCreating(false)
//       return
//     }

//     setNewKeyName("")
//     setShowCreateDialog(false)
//     setNewlyCreatedKey(data)
//     setShowKeyDialog(true)
//     setApiKeys((prev) => [...prev, data])
//     setIsCreating(false)
//   }

//   const copyToClipboard = (text: string) => {
//     navigator.clipboard.writeText(text)
//     toast.success("API key copied to your clipboard", {
//       description: "The API key has been copied to your clipboard.",
//     })
//   }

//   const toggleKeyVisibility = (id: string) => {
//     setVisibleKeyId(visibleKeyId === id ? null : id)
//   }

//   const closeNewKeyDialog = () => {
//     setNewlyCreatedKey(null)
//     setShowKeyDialog(false)
//   }
  
//    const handleRevokeKey = async (id: string, name: string) => {
//     setIsRevoking(true)
//     const {success} = await deleteAPIKey(id)
//     if (success){
//       setApiKeys(apiKeys.filter((key) => key.id !== id))
//     setKeyToRevoke(null);
//     toast.success("API key deleted", {
//       description: `The API key "${name}" has been revoked.`,
//     });
//     setIsRevoking(false)
//     }else{
//        toast.error("API key fail to delete", {
//       description: "Something went wrong. Please try again",
//     });
//      setIsRevoking(false)
//     }
    
//   }

//   return (
//     <>
//       <Card>
//         <CardHeader>
//           <CardTitle>API Keys</CardTitle>
//           <CardDescription>
//             These keys will allow you to authenticate API requests.
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <Table>
//             <TableHeader>
//               <TableRow>
//                 <TableHead>Name</TableHead>
//                 <TableHead>Key</TableHead>
//                 <TableHead>Created</TableHead>
//                 <TableHead className="w-[50px]">Actions</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {apiKeys.length > 0 ? (
//                 apiKeys.map((apiKey) => (
//                   <TableRow key={apiKey.id}>
//                     <TableCell className="font-medium">{apiKey.name}</TableCell>
//                     <TableCell>
//                       <div className="flex items-center space-x-2">
//                         <code className="text-sm">
//                           {visibleKeyId === apiKey.id
//                             ? apiKey.key
//                             : apiKey.key.replace(
//                                 /(?<=^.{10}).*(?=.{1}$)/,
//                                 "•".repeat(20)
//                               )}
//                         </code>
//                         <Button
//                           variant="ghost"
//                           size="icon"
//                           onClick={() => toggleKeyVisibility(apiKey.id)}
//                         >
//                           {visibleKeyId === apiKey.id ? (
//                             <EyeOff className="h-4 w-4" />
//                           ) : (
//                             <Eye className="h-4 w-4" />
//                           )}
//                           <span className="sr-only">
//                             {visibleKeyId === apiKey.id ? "Hide" : "Show"}
//                           </span>
//                         </Button>
//                       </div>
//                     </TableCell>
//                     <TableCell>{timeAgo(apiKey.createdAt)}</TableCell>
//                     <TableCell>
//                       <DropdownMenu>
//                         <DropdownMenuTrigger asChild>
//                           <Button variant="ghost" size="icon">
//                             <MoreHorizontal className="h-4 w-4" />
//                             <span className="sr-only">Open menu</span>
//                           </Button>
//                         </DropdownMenuTrigger>
//                         <DropdownMenuContent align="end">
//                           <DropdownMenuItem
//                             onClick={() => copyToClipboard(apiKey.key)}
//                           >
//                             Copy
//                           </DropdownMenuItem>
//                           <DropdownMenuItem
//                             onClick={() => handleRevokeKey(apiKey.id, apiKey.name)}
//                             className="text-destructive"
//                           >
//                             Delete
//                           </DropdownMenuItem>
//                         </DropdownMenuContent>
//                       </DropdownMenu>
//                     </TableCell>
//                   </TableRow>
//                 ))
//               ) : (
//                 <TableRow>
//                   <TableCell colSpan={4} className="text-center py-6">
//                     No API Keys Yet
//                   </TableCell>
//                 </TableRow>
//               )}
//             </TableBody>
//           </Table>

//           <div className="mt-4 flex justify-center ">
//             {
//               isCreating?(
//                 <button disabled  >
//                   <Loader2 className="animate-spin"/>
//                   Creating... Please wait.
//                 </button>
//               ):(
//                 <Button
//               variant="outline"
//               onClick={() => setShowCreateDialog(true)}
//               className="flex bg-rose-600 text-white items-center gap-1"
//             >
//               <span>+</span> Create key
//             </Button>
//               )
//             }
            
//           </div>
//         </CardContent>
//       </Card>

//       {/* Create Key Dialog */}
//       <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>Create a new key</DialogTitle>
//             <DialogDescription>
//               Select a name to identify the key in the dashboard.
//             </DialogDescription>
//           </DialogHeader>
//           <Input
//             placeholder="Key name"
//             value={newKeyName}
//             onChange={(e) => setNewKeyName(e.target.value)}
//           />
//           <DialogFooter>
//             <Button
//               variant="default"
//               onClick={handleCreateKey}
//               className="bg-red-600 hover:bg-red-700"
//             >
//               Create Key
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       {/* Newly Created Key Dialog */}
//       <Dialog open={showKeyDialog} onOpenChange={closeNewKeyDialog}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>API Key Created</DialogTitle>
//             <DialogDescription>
//               Make sure to copy your API key now. You won&apos;t be able to see it again!
//             </DialogDescription>
//           </DialogHeader>
//           <div className="p-4 bg-muted rounded-md border">
//             <div className="flex justify-between items-center mb-2">
//               <span className="font-medium">{newlyCreatedKey?.name}</span>
//               <Button
//                 variant="ghost"
//                 size="sm"
//                 onClick={() =>
//                   newlyCreatedKey && copyToClipboard(newlyCreatedKey.key)
//                 }
//               >
//                 <Copy className="h-4 w-4" />
//                 <span className="sr-only">Copy</span>
//               </Button>
//             </div>
//             <code className="text-sm break-all block">{newlyCreatedKey?.key}</code>
//           </div>
//           <DialogFooter>
//             <Button variant="outline" onClick={closeNewKeyDialog}>
//               Close
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </>
//   )
// }


"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Copy,
  Key,
  Loader2,
  MoreHorizontal,
  Plus,
  Shield,
  Trash2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
// import { createAPIKey, deleteAPIKey } from "@/actions/apiKeys";
import { ApiKey } from "@prisma/client";
import { timeAgo } from "@/lib/timeAgo";
import { createAPIKey, deleteAPIKey } from "@/actions/apiKey";

function maskApiKey(key: string): string {
  // Show the "sk_live_" prefix and mask the rest
  const prefix = key.substring(0, 8); // "sk_live_"
  return `${prefix}${"•".repeat(10)}`;
}

export function ApiKeyManagement({ orgKeys }: { orgKeys: ApiKey[] }) {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>(orgKeys);

  const [newKeyName, setNewKeyName] = useState("");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newlyCreatedKey, setNewlyCreatedKey] = useState<ApiKey | null>(null);
  const [showKeyDialog, setShowKeyDialog] = useState(false);
  const [keyToRevoke, setKeyToRevoke] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isRevoking, setIsRevoking] = useState(false);

  const handleCreateKey = async () => {
    if (!newKeyName.trim()) return;
    setIsCreating(true);
    const { data, error } = await createAPIKey(newKeyName);
    console.log(newKeyName);
    if (error || !data) {
      toast.error("Api Key Failed to Create", {
        description: error,
      });
      setIsCreating(false);
      return;
    }

    const key = data;
    setNewKeyName("");
    setShowCreateDialog(false);
    setNewlyCreatedKey(key);
    setShowKeyDialog(true);
    setIsCreating(false);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("API key copied to clipboard", {
      description: "The API key has been copied to your clipboard.",
    });
  };
  const handleRevokeKey = async (id: string) => {
    setIsRevoking(true);
    const { success } = await deleteAPIKey(id);
    if (success) {
      setApiKeys(apiKeys.filter((key) => key.id !== id));
      setKeyToRevoke(null);
      toast.success("API key revoked", {
        description: "The API key has been revoked successfully.",
      });
      setIsRevoking(false);
    } else {
      toast.error("API Failed to delete", {
        description: "Something went wrong, Please try again",
      });
      setIsRevoking(false);
    }
  };
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <Card className="border-border pb-4">
        <CardHeader className="bg-muted/50 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <div>
                <CardTitle className="text-xl">API Keys</CardTitle>
                <CardDescription>
                  Manage your API keys for authentication
                </CardDescription>
              </div>
            </div>
            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" /> Create new key
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create a new key</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <p className="text-sm text-muted-foreground">
                      Select a name to identify the key in the dashboard.
                    </p>
                    <Input
                      id="name"
                      value={newKeyName}
                      onChange={(e) => setNewKeyName(e.target.value)}
                      placeholder="Enter key name"
                    />
                  </div>
                  {isCreating ? (
                    <Button disabled className="w-full">
                      <Loader2 className="animate-spin" />
                      Creating Please wait...
                    </Button>
                  ) : (
                    <Button
                      className="w-full bg-primary hover:bg-primary/90"
                      onClick={handleCreateKey}
                      disabled={!newKeyName.trim()}
                    >
                      Create Key
                    </Button>
                  )}
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Key</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {apiKeys.length > 0 ? (
                apiKeys.map((apiKey) => (
                  <TableRow key={apiKey.id}>
                    <TableCell className="font-medium flex items-center gap-2">
                      <Key className="h-4 w-4 text-muted-foreground" />
                      {apiKey.name}
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {maskApiKey(apiKey.key)}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {timeAgo(apiKey.createdAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(apiKey.key)}
                          className="h-8 text-xs"
                        >
                          <Copy className="h-3.5 w-3.5 mr-1" />
                          Copy
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setKeyToRevoke(apiKey.id)}
                          className="h-8 text-xs text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-3.5 w-3.5 mr-1" />
                          Revoke
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="h-32 text-center">
                    <div className="flex flex-col items-center justify-center gap-3 py-8">
                      <div className="rounded-full bg-muted p-3">
                        <Key className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <div className="space-y-1 text-center">
                        <p className="font-medium">No API Keys Yet</p>
                        <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                          Create your first API key to authenticate requests to
                          our API.
                        </p>
                      </div>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button className="mt-2">
                            <Plus className="h-4 w-4 mr-2" /> Create key
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Create a new key</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div className="space-y-2">
                              <Label htmlFor="name">Name</Label>
                              <p className="text-sm text-muted-foreground">
                                Select a name to identify the key in the
                                dashboard.
                              </p>
                              <Input
                                id="name"
                                value={newKeyName}
                                onChange={(e) => setNewKeyName(e.target.value)}
                                placeholder="Enter key name"
                              />
                            </div>
                            {isCreating ? (
                              <Button className="w-full" disabled>
                                <Loader2 className="animate-spin" />
                                Creating Please wait...
                              </Button>
                            ) : (
                              <Button
                                className="w-full bg-primary hover:bg-primary/90"
                                onClick={handleCreateKey}
                                disabled={!newKeyName.trim()}
                              >
                                Create Key
                              </Button>
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Dialog to show newly created key */}
      <Dialog open={showKeyDialog} onOpenChange={setShowKeyDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Your API Key
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="rounded-md bg-amber-50 border border-amber-200 p-3 text-amber-800">
              <p className="text-sm font-medium">
                Make sure to copy your API key now. You won't be able to see it
                again.
              </p>
            </div>
            <div className="bg-muted p-4 rounded-md flex items-center justify-between">
              <code className="text-sm font-mono break-all">
                {newlyCreatedKey?.key}
              </code>
              <Button
                variant="outline"
                size="sm"
                className="ml-2 shrink-0"
                onClick={() =>
                  newlyCreatedKey && copyToClipboard(newlyCreatedKey.key)
                }
              >
                <Copy className="h-4 w-4 mr-1" />
                Copy
              </Button>
            </div>
            <Button className="w-full" onClick={() => setShowKeyDialog(false)}>
              Done
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      {/* Revoke confirmation dialog */}
      <Dialog
        open={keyToRevoke !== null}
        onOpenChange={(open) => !open && setKeyToRevoke(null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <Trash2 className="h-5 w-5" />
              Revoke API Key
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="rounded-md bg-destructive/10 border border-destructive/20 p-3 text-destructive">
              <p className="text-sm font-medium">
                Are you sure you want to revoke this API key? This action cannot
                be undone.
              </p>
            </div>
            <p className="text-sm text-muted-foreground">
              Once revoked, any applications or services using this key will no
              longer be able to authenticate.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              {isRevoking ? (
                <Button disabled>
                  <Loader2 className="animate-spin" />
                  Revoking Please wait...
                </Button>
              ) : (
                <Button
                  variant="destructive"
                  onClick={() => keyToRevoke && handleRevokeKey(keyToRevoke)}
                >
                  Revoke Key
                </Button>
              )}
              <Button variant="outline" onClick={() => setKeyToRevoke(null)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

