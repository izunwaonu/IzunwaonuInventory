'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: string;
  change?: number;
  icon: LucideIcon;
  trend?: 'up' | 'down';
  gradient: string;
  description?: string;
  alert?: string;
}

export function StatsCard({
  title,
  value,
  change,
  icon: Icon,
  trend,
  gradient,
  description,
  alert,
}: StatsCardProps) {
  return (
    <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 group">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
            <p className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{value}</p>

            {change !== undefined && (
              <div className="flex items-center gap-1">
                {trend === 'up' ? (
                  <TrendingUp className="h-4 w-4 text-green-600" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-600" />
                )}
                <span
                  className={cn(
                    'text-sm font-medium',
                    trend === 'up' ? 'text-green-600' : 'text-red-600',
                  )}
                >
                  {Math.abs(change).toFixed(1)}%
                </span>
                {description && <span className="text-xs text-gray-500 ml-1">{description}</span>}
              </div>
            )}

            {!change && description && <p className="text-xs text-gray-500">{description}</p>}

            {alert && (
              <Badge variant="destructive" className="mt-2 text-xs">
                {alert}
              </Badge>
            )}
          </div>

          <div
            className={cn(
              'w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center group-hover:scale-110 transition-transform duration-300',
              gradient,
            )}
          >
            <Icon className="h-6 w-6 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
