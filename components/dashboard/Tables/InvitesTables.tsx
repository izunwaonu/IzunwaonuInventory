"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search } from "lucide-react"
import { format } from "date-fns"
export type Invite = {
    id: string,
    email: string,
    status: boolean,
    createdAt: string|Date,
  };

// Mock data based on the Prisma model
// const mockInvites = [
//   {
//     id: "1",
//     email: "john.doe@example.com",
//     status: false,
//     createdAt: new Date("2023-05-15T09:24:45"),
//   },
//   {
//     id: "2",
//     email: "jane.smith@example.com",
//     status: true,
//     createdAt: new Date("2023-05-14T14:32:19"),
//   },
//   {
//     id: "3",
//     email: "michael.brown@example.com",
//     status: false,
//     createdAt: new Date("2023-05-13T11:15:30"),
//   },
//   {
//     id: "4",
//     email: "sarah.wilson@example.com",
//     status: true,
//     createdAt: new Date("2023-05-12T16:45:22"),
//   },
//   {
//     id: "5",
//     email: "david.johnson@example.com",
//     status: false,
//     createdAt: new Date("2023-05-11T10:05:17"),
//   },
// ]

export default function InviteTable({data}:{data:Invite[]}) {
  const [searchQuery, setSearchQuery] = useState("")
  const [invites, setInvites] = useState<Invite[]>(data)

  // Filter invites based on search query
  const filteredInvites = invites.filter((invite) => invite.email.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <CardTitle>Invite List</CardTitle>
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by email..."
              className="w-full pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead className="hidden md:table-cell">Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInvites.length > 0 ? (
                filteredInvites.map((invite) => (
                  <TableRow key={invite.id}>
                    <TableCell className="font-medium">{invite.email}</TableCell>
                    <TableCell className="hidden md:table-cell">{format(invite.createdAt, "MMM dd, yyyy")}</TableCell>
                    <TableCell>
                      <Badge
                        variant={invite.status ? "default" : "secondary"}
                        className={invite.status ? "bg-emerald-500 hover:bg-emerald-500/80" : ""}
                      >
                        {invite.status ? "Success" : "Pending"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="h-24 text-center">
                    No invites found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}

