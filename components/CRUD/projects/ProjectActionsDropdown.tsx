"use client";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Trash2, Save } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AlertDialog, AlertDialogContent } from "@/components/ui/alert-dialog";
import EditProject from "./EditProject";
import { Projects } from "@/types";
import DeleteProject from "./Deletproject";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
const ProjectActionsDropdown = ({ projects }: { projects: Projects }) => {
  const [isEditProjectOpen, setIsEditProjectOpen] = useState(false);
  const [isDeleteProjectOpen, setIsDeleteProjectOpen] = useState(false);

  const handleEditProjectOpen = () => {
    setIsEditProjectOpen(true);
  };

  const handleDeleteProjectOpen = () => {
    setIsDeleteProjectOpen(true);
  };
  const handleCloseEditDialog = () => {
    setIsEditProjectOpen(false); // Close the edit dialog
  };
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="mr-8" asChild>
          <span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <MoreHorizontal />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Edit, Delete, or Save</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </span>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem className="flex justify-between items-center">
            <span>Save Project</span>
            <Save className="text-green-500" />
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={handleEditProjectOpen}
            className="flex justify-between items-center"
          >
            <span>Edit Project</span>
            <Pencil className="text-blue-500" />
          </DropdownMenuItem>

          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={handleDeleteProjectOpen}
            className="flex justify-between items-center"
          >
            <span>Delete Project</span>
            <Trash2 className="text-red-500" />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Edit View Dialog */}
      <Dialog open={isEditProjectOpen} onOpenChange={setIsEditProjectOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Project</DialogTitle>
          </DialogHeader>
          {/* Pass the full project object */}
          <EditProject project={projects} onClose={handleCloseEditDialog} />
        </DialogContent>
      </Dialog>

      {/* Delete View Dialog */}
      <AlertDialog
        open={isDeleteProjectOpen}
        onOpenChange={setIsDeleteProjectOpen}
      >
        <AlertDialogContent>
          {/* Pass the full project object */}
          <DeleteProject project={projects} />
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
export default ProjectActionsDropdown;
