'use client';

import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { AlertDialog, AlertDialogContent } from '@/components/ui/alert-dialog';
import EditViews from '@/components/CRUD/Views/EditViews';
import DeleteViews from '@/components/CRUD/Views/DeleteViews';
import { Dashboard } from '@/types';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
interface ViewActionsDropdownProps {
  projectId: number | null;
  views: Dashboard;
}

const ViewActionsDropdown = ({
  projectId,
  views,
}: ViewActionsDropdownProps) => {
  const [isEditViewOpen, setIsEditViewOpen] = useState(false);
  const [isDeleteViewOpen, setIsDeleteViewOpen] = useState(false);

  const handleEditViewOpen = () => {
    setIsEditViewOpen(true);
  };

  const handleDeleteViewOpen = () => {
    setIsDeleteViewOpen(true);
  };

  const handleCloseEditDialog = () => {
    setIsEditViewOpen(false); // Close the edit dialog
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="mr-3" asChild>
          <span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <MoreHorizontal />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Edit or Delete View</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </span>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            onClick={handleEditViewOpen}
            className="flex justify-between items-center"
          >
            <span>Edit View</span>
            <Pencil className="text-blue-500" />
          </DropdownMenuItem>

          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={handleDeleteViewOpen}
            className="flex justify-between items-center"
          >
            <span>Delete View</span>

            <Trash2 className="text-red-500" />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Edit View Dialog */}
      <Dialog open={isEditViewOpen} onOpenChange={setIsEditViewOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Canvas</DialogTitle>
          </DialogHeader>
          <EditViews
            projectId={projectId}
            view={views}
            onClose={handleCloseEditDialog}
          />
        </DialogContent>
      </Dialog>

      {/* Delete View Dialog */}
      <AlertDialog open={isDeleteViewOpen} onOpenChange={setIsDeleteViewOpen}>
        <AlertDialogContent>
          <DeleteViews projectId={projectId} view={views} />
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ViewActionsDropdown;
