'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, ShoppingCart, Package, ArrowRightLeft, Users, BarChart3 } from 'lucide-react';
import Link from 'next/link';

export function QuickActions() {
  const actions = [
    {
      title: 'New Sale',
      description: 'Create POS sale',
      icon: ShoppingCart,
      href: '/dashboard/sales/pos',
      gradient: 'from-green-500 to-emerald-600',
    },
    {
      title: 'Add Item',
      description: 'Create new product',
      icon: Plus,
      href: '/dashboard/items/new',
      gradient: 'from-blue-500 to-cyan-600',
    },
    {
      title: 'Purchase Order',
      description: 'Order from supplier',
      icon: Package,
      href: '/dashboard/purchases/new',
      gradient: 'from-purple-500 to-pink-600',
    },
    {
      title: 'Transfer Stock',
      description: 'Move between locations',
      icon: ArrowRightLeft,
      href: '/dashboard/transfers/new',
      gradient: 'from-orange-500 to-red-600',
    },
    {
      title: 'Sales Report',
      description: 'View analytics',
      icon: BarChart3,
      href: '/dashboard/reports/sales',
      gradient: 'from-indigo-500 to-purple-600',
    },
    {
      title: 'Add Customer',
      description: 'New customer',
      icon: Users,
      href: '/dashboard/customers/new',
      gradient: 'from-teal-500 to-cyan-600',
    },
  ];

  return (
    <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
      <CardContent className="p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {actions.map((action) => (
            <Link key={action.title} href={action.href}>
              <Button
                variant="outline"
                className="h-auto p-4 flex flex-col items-center gap-2 hover:shadow-md transition-all duration-300 group border-gray-200 hover:border-gray-300"
              >
                <div
                  className={`w-10 h-10 rounded-lg bg-gradient-to-br ${action.gradient} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                >
                  <action.icon className="h-5 w-5 text-white" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-900">{action.title}</p>
                  <p className="text-xs text-gray-500">{action.description}</p>
                </div>
              </Button>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
