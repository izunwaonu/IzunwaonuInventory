import { MetricCard } from "@/components/metric-card";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  Box,
  Download,
  ShoppingBag,
  ShoppingCart,
  Users,
} from "lucide-react";

const metrics = [
  {
    title: "Total Sales",
    value: "$120,784.02",
    change: {
      value: "12.3%",
      trend: "up" as const,
      today: "+$1,453.89 today",
    },
    color: "bg-blue-500",
  },
  {
    title: "Total Orders",
    value: "28,834",
    change: {
      value: "20.1%",
      trend: "up" as const,
      today: "+2,676 today",
    },
    color: "bg-purple-500",
  },
  {
    title: "Visitor",
    value: "18,896",
    change: {
      value: "5.6%",
      trend: "down" as const,
      today: "-876 today",
    },
    color: "bg-violet-500",
  },
  {
    title: "Refunded",
    value: "2,876",
    change: {
      value: "13%",
      trend: "up" as const,
      today: "+34 today",
    },
    color: "bg-indigo-500",
  },
];

const recentActivity = [
  {
    customer: "Sarah Johnson",
    email: "sarah.j@example.com",
    status: "Completed",
    amount: "$234.50",
    date: "5 min ago",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    customer: "Michael Chen",
    email: "m.chen@example.com",
    status: "Pending",
    amount: "$129.99",
    date: "10 min ago",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    customer: "Emma Wilson",
    email: "emma.w@example.com",
    status: "Processing",
    amount: "$549.00",
    date: "15 min ago",
    avatar: "/placeholder.svg?height=40&width=40",
  },
];

const topProducts = [
  {
    name: "Wireless Earbuds Pro",
    sales: 1234,
    revenue: "$45,678",
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    name: "Smart Watch Elite",
    sales: 987,
    revenue: "$39,480",
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    name: "Premium Laptop Stand",
    sales: 865,
    revenue: "$25,950",
    image: "/placeholder.svg?height=40&width=40",
  },
];
const bigCards = [
  {
    title: "Total Sales",
    value: "$120,784.02",
    change: "+12.3%",
    trend: "up",
    icon: ShoppingCart,
  },
  {
    title: "Total Orders",
    value: "28,834",
    change: "+20.1%",
    trend: "up",
    icon: ShoppingBag,
  },
  {
    title: "Total Products",
    value: "1,429",
    change: "+8.3%",
    trend: "up",
    icon: Box,
  },
  {
    title: "Total Users",
    value: "12,456",
    change: "+15.2%",
    trend: "up",
    icon: Users,
  },
];
export default function DashboardMain() {
  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              Here's your statistics overview.
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <Select defaultValue="7d">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
                <SelectItem value="12m">Last 12 months</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export to Excel
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-12 gap-6">
          {/* Big Cards - 4 cards in a row */}
          {bigCards.map((card, index) => (
            <Card key={index} className="col-span-3 relative overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {card.title}
                </CardTitle>
                <card.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{card.value}</div>
                <div
                  className={`flex items-center text-sm ${card.trend === "up" ? "text-green-600" : "text-red-600"}`}
                >
                  View details
                  <ArrowRight className="mr-1 h-4 w-4" />
                </div>
              </CardContent>
              <div className="absolute right-0 bottom-0 opacity-5">
                <card.icon className="h-24 w-24 text-primary" />
              </div>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Recent Activity Table */}
          <Card className="col-span-8">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest customer transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead className="text-right">Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentActivity.map((activity) => (
                    <TableRow key={activity.email}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar>
                            <AvatarImage
                              src={activity.avatar}
                              alt={activity.customer}
                            />
                            <AvatarFallback>
                              {activity.customer
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">
                              {activity.customer}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {activity.email}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium
                          ${
                            activity.status === "Completed"
                              ? "bg-green-100 text-green-800"
                              : activity.status === "Pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {activity.status}
                        </div>
                      </TableCell>
                      <TableCell>{activity.amount}</TableCell>
                      <TableCell className="text-right">
                        {activity.date}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Top Selling Products */}
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Top Selling Products</CardTitle>
              <CardDescription>Best performing products</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {topProducts.map((product, index) => (
                  <div key={index} className="flex items-center">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={product.image} alt={product.name} />
                      <AvatarFallback>P</AvatarFallback>
                    </Avatar>
                    <div className="ml-4 space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {product.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {product.sales.toLocaleString()} sales
                      </p>
                    </div>
                    <div className="ml-auto font-medium">{product.revenue}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
