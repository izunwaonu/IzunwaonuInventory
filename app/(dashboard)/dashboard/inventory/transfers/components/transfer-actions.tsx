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
import { Loader2, Check, Truck } from 'lucide-react';
import { updateTransferStatus } from '@/actions/transfers';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface TransferActionsProps {
  transferId: string;
  currentStatus: string;
  canApprove: boolean;
  canComplete: boolean;
  size?: 'default' | 'sm';
}

export function TransferActions({
  transferId,
  currentStatus,
  canApprove,
  canComplete,
  size = 'default',
}: TransferActionsProps) {
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false);
  const [isCompleteDialogOpen, setIsCompleteDialogOpen] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const router = useRouter();

  const handleApprove = async () => {
    setIsApproving(true);
    try {
      const result = await updateTransferStatus(transferId, 'APPROVED');
      if (result.success) {
        toast.success('Transfer approved successfully');
        setIsApproveDialogOpen(false);
        router.refresh();
      } else {
        toast.error(result.error || 'Failed to approve transfer');
      }
    } catch (error) {
      toast.error('Failed to approve transfer');
    } finally {
      setIsApproving(false);
    }
  };

  const handleComplete = async () => {
    setIsCompleting(true);
    try {
      const result = await updateTransferStatus(transferId, 'COMPLETED');
      if (result.success) {
        toast.success('Transfer completed successfully. Inventory has been updated.');
        setIsCompleteDialogOpen(false);
        router.refresh();
      } else {
        toast.error(result.error || 'Failed to complete transfer');
      }
    } catch (error) {
      toast.error('Failed to complete transfer');
    } finally {
      setIsCompleting(false);
    }
  };

  if (!canApprove && !canComplete) {
    return null;
  }

  return (
    <>
      <div className="flex gap-2">
        {canApprove && (
          <Button
            size={size}
            onClick={() => setIsApproveDialogOpen(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Check className="h-4 w-4 mr-2" />
            Approve Transfer
          </Button>
        )}
        {canComplete && (
          <Button
            size={size}
            onClick={() => setIsCompleteDialogOpen(true)}
            className="bg-green-600 hover:bg-green-700"
          >
            <Truck className="h-4 w-4 mr-2" />
            Complete Transfer
          </Button>
        )}
      </div>

      {/* Approve Transfer Dialog */}
      <Dialog open={isApproveDialogOpen} onOpenChange={setIsApproveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve Transfer</DialogTitle>
            <DialogDescription>
              Are you sure you want to approve this transfer? This action will change the status
              from "Draft" to "Approved" and allow the transfer to proceed.
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
                  Approve Transfer
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Complete Transfer Dialog */}
      <Dialog open={isCompleteDialogOpen} onOpenChange={setIsCompleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Complete Transfer</DialogTitle>
            <DialogDescription>
              Are you sure you want to complete this transfer? This action will:
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Mark the transfer as completed</li>
                <li>Update inventory quantities at both locations</li>
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
                  <Truck className="h-4 w-4 mr-2" />
                  Complete Transfer
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
