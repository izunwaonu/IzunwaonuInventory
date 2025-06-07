'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Activity, ShoppingCart, Package, ArrowRightLeft, Settings } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface RecentActivityProps {
  activities: Array<{
    id: string;
    type: 'SALE' | 'PURCHASE' | 'TRANSFER' | 'ADJUSTMENT';
    title: string;
    description: string;
    user: string;
    date: string;
    status: string;
  }>;
}

export function RecentActivity({ activities }: RecentActivityProps) {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'SALE':
        return <ShoppingCart className="h-4 w-4 text-green-600" />;
      case 'PURCHASE':
        return <Package className="h-4 w-4 text-blue-600" />;
      case 'TRANSFER':
        return <ArrowRightLeft className="h-4 w-4 text-purple-600" />;
      case 'ADJUSTMENT':
        return <Settings className="h-4 w-4 text-orange-600" />;
      default:
        return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
      case 'completed':
      case 'paid':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
      case 'draft':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled':
      case 'canceled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-gray-800">
          <Activity className="h-5 w-5 text-blue-600" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-96">
          <div className="space-y-1 p-6 pt-0">
            {activities.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Activity className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No recent activity</p>
              </div>
            ) : (
              activities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-shrink-0 mt-1">{getActivityIcon(activity.type)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium text-gray-900 truncate">{activity.title}</p>
                      <Badge variant="outline" className={getStatusColor(activity.status)}>
                        {activity.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">{activity.description}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>by {activity.user}</span>
                      <span>
                        {formatDistanceToNow(new Date(activity.date), { addSuffix: true })}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
