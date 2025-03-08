import React from 'react';
import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { Dashboard } from '@/types';
import { CircleAlert } from 'lucide-react';

export default function DeleteViews({
  projectId,
  view,
}: {
  projectId: number | null;
  view: Dashboard;
}) {
  const router = useRouter();

  const handleDelete = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/views/${projectId}/${view.id}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        toast.error(errorData.message || 'Failed to delete the view.');
      }
      router.refresh();
      toast.success('The view has been deleted successfully.');
    } catch (err) {
      if (err instanceof Error) {
        toast.error(`Failed to deleted view: ${err.message}`);
      } else {
        toast.error('Failed to deleted view due to an unknown error.');
      }
    }
  };

  return (
    <>
      <AlertDialogHeader>
        <AlertDialogTitle className="flex items-center gap-2">
          <CircleAlert className="opacity-80" size={16} strokeWidth={2} />
          Are you sure?
        </AlertDialogTitle>{' '}
        <AlertDialogDescription>
          This action cannot be undone. {view.name} will be permanently deleted.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction
          className={cn(buttonVariants({ variant: 'destructive' }))}
          onClick={handleDelete}
        >
          Delete
        </AlertDialogAction>
      </AlertDialogFooter>
    </>
  );
}
