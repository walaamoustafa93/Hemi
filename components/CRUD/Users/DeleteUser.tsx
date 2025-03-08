import React from "react";
import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { buttonVariants } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import { cn } from "@/lib/utils";
import { User } from "@/types";
import { CircleAlert } from "lucide-react";

export default function DeleteUser({
  users,
  fetchUsers,
}: {
  users: User;
  fetchUsers: () => Promise<void>;
}) {

  const handleDelete = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/${users.id}`,
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
        console.error("Error deleting view:", errorData);
        throw new Error(errorData.message || "Failed to delete the view.");
      }
      fetchUsers();
      toast.success(" User has been deleted successfully.");
    } catch (err) {
      if (err instanceof Error) {
        toast.error(`Failed to deleted User: ${err.message}`);
      } else {
        toast.error("Failed to deleted User due to an unknown error.");
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
          This action cannot be undone. Do you want to permanently delete the
          user <strong>{users.username}</strong>?
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction
          className={cn(buttonVariants({ variant: "destructive" }))}
          onClick={handleDelete}
        >
          Delete
        </AlertDialogAction>
      </AlertDialogFooter>
    </>
  );
}
