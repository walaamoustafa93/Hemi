// RowActions.tsx
"use client";

import { useState } from "react";
import { Row } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EllipsisIcon, Pencil, Trash2 } from "lucide-react";

import { AlertDialog, AlertDialogContent } from "@/components/ui/alert-dialog";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import EditConnections from "@/components/CRUD/Connections/EditConnections";
import DeleteConnections from "@/components/CRUD/Connections/DeleteConnections";
import { Devices } from "@/types";
import { dataPolling, dataType } from "@/lib/ConnectionsData";

export function RowActions({
  row,
  ProjectId,
  fetchDevices
}: {
  row: Row<Devices>;
  ProjectId: string;
  fetchDevices: () => Promise<void>;
}) {
  const [isEditDeviceOpen, setIsEditDeviceOpen] = useState(false);
  const [isDeleteDeviceOpen, setIsDeleteDeviceOpen] = useState(false);

  const handleEditUserOpen = () => setIsEditDeviceOpen(true);
  const handleDeleteUserOpen = () => setIsDeleteDeviceOpen(true);
  const handleCloseEditDialog = () => setIsEditDeviceOpen(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="flex justify-end">
            <Button
              size="icon"
              variant="ghost"
              className="shadow-none"
              aria-label="Edit item"
            >
              <EllipsisIcon size={16} aria-hidden="true" />
            </Button>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuGroup>
            <DropdownMenuItem
              onClick={handleEditUserOpen}
              className="flex justify-between items-center"
            >
              <span>Edit Device</span>
              <Pencil className="text-blue-500" />
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleDeleteUserOpen}
              className="flex justify-between items-center"
            >
              <span>Delete Device</span>
              <Trash2 className="text-red-500" />
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <Sheet open={isEditDeviceOpen} onOpenChange={setIsEditDeviceOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Edit Device</SheetTitle>
          </SheetHeader>
          <EditConnections
          fetchDevices={fetchDevices}
            onClose={handleCloseEditDialog}
            devices={row.original}
            selectType={dataType}
            selectPolling={dataPolling}
            ProjectId={ProjectId}
          />
        </SheetContent>
      </Sheet>

      {/* Delete User Dialog */}
      <AlertDialog
        open={isDeleteDeviceOpen}
        onOpenChange={setIsDeleteDeviceOpen}
      >
        <AlertDialogContent>
          <DeleteConnections fetchDevices={fetchDevices} devices={row.original} />
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
