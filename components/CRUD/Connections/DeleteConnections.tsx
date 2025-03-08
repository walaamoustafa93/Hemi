import React from "react";
import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { CircleAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "react-hot-toast";
import { Devices } from "@/types";
import { buttonVariants } from "@/components/ui/button";

export default function DeleteConnections({
  devices,
  fetchDevices,
}: {
  devices: Devices;
  fetchDevices: () => Promise<void>;
}) {

  const handleDeleteDevice = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/devices/${devices.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to delete the device.");
        return; // Exit early if the response is not OK
      }

      fetchDevices();
      toast.success("The device has been deleted successfully.");
    } catch (err) {
      if (err instanceof Error) {
        toast.error(`Failed to delete device: ${err.message}`);
      } else {
        toast.error("Failed to delete device due to an unknown error.");
      }
    }
  };

  return (
    <>
      <AlertDialogHeader>
        <AlertDialogTitle className="flex items-center gap-2">
          <CircleAlert className="opacity-80" size={16} strokeWidth={2} />
          Are you sure?
        </AlertDialogTitle>
        <AlertDialogDescription>
          This action cannot be undone. You will permanently delete the device{" "}
          <strong>{devices.name}</strong>.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction
          onClick={handleDeleteDevice}
          className={cn(buttonVariants({ variant: "destructive" }))}
        >
          Delete
        </AlertDialogAction>
      </AlertDialogFooter>
    </>
  );
}
