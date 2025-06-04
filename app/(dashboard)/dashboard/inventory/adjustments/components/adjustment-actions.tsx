'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Loader2, Check, Package } from 'lucide-react';
import { updateAdjustmentStatus } from '@/actions/adjustments';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface AdjustmentActionsProps {
  adjustmentId: string;
  currentStatus: string;
  canApprove: boolean;
  canComplete: boolean;
  size?: 'default' | 'sm';
}

export function AdjustmentActions({
  adjustmentId,
  currentStatus,
  canApprove,
  canComplete,
  size = 'default',
}: AdjustmentActionsProps) {
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false);
  const [isCompleteDialogOpen, setIsCompleteDialogOpen] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const router = useRouter();

  const handleApprove = async () => {
    setIsApproving(true);
    try {
      const result = await updateAdjustmentStatus(adjustmentId, 'APPROVED');
      if (result.success) {
        toast.success('Adjustment approved successfully');
        setIsApproveDialogOpen(false);
        router.refresh();
      } else {
        toast.error(result.error || 'Failed to approve adjustment');
      }
    } catch (error) {
      toast.error('Failed to approve adjustment');
    } finally {
      setIsApproving(false);
    }
  };

  const handleComplete = async () => {
    setIsCompleting(true);
    try {
      const result = await updateAdjustmentStatus(adjustmentId, 'COMPLETED');
      if (result.success) {
        toast.success('Adjustment completed successfully. Inventory has been updated.');
        setIsCompleteDialogOpen(false);
        router.refresh();
      } else {
        toast.error(result.error || 'Failed to complete adjustment');
      }
    } catch (error) {
      toast.error('Failed to complete adjustment');
    } finally {
      setIsCompleting(false);
    }
  };

  if (!canApprove && !canComplete) {
    return null;
  }

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
        {canApprove && (
          <Button
            size={size}
            onClick={() => setIsApproveDialogOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto"
          >
            <Check className="h-4 w-4 mr-2" />
            Approve Adjustment
          </Button>
        )}
        {canComplete && (
          <Button
            size={size}
            onClick={() => setIsCompleteDialogOpen(true)}
            className="bg-green-600 hover:bg-green-700 w-full sm:w-auto"
          >
            <Package className="h-4 w-4 mr-2" />
            Complete Adjustment
          </Button>
        )}
      </div>

      {/* Approve Adjustment Dialog */}
      <Dialog open={isApproveDialogOpen} onOpenChange={setIsApproveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve Adjustment</DialogTitle>
            <DialogDescription>
              Are you sure you want to approve this adjustment? This action will change the status
              from "Draft" to "Approved" and allow the adjustment to proceed.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsApproveDialogOpen(false)}
              disabled={isApproving}
            >
              Cancel
            </Button>
            <Button
              onClick={handleApprove}
              disabled={isApproving}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isApproving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Approving...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Approve Adjustment
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Complete Adjustment Dialog */}
      <Dialog open={isCompleteDialogOpen} onOpenChange={setIsCompleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Complete Adjustment</DialogTitle>
            <DialogDescription>
              Are you sure you want to complete this adjustment? This action will:
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Mark the adjustment as completed</li>
                <li>Update inventory quantities at the location</li>
                <li>This action cannot be undone</li>
              </ul>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCompleteDialogOpen(false)}
              disabled={isCompleting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleComplete}
              disabled={isCompleting}
              className="bg-green-600 hover:bg-green-700"
            >
              {isCompleting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Completing...
                </>
              ) : (
                <>
                  <Package className="h-4 w-4 mr-2" />
                  Complete Adjustment
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
