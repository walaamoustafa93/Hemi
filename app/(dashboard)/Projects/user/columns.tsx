// columns.tsx
import { ColumnDef } from "@tanstack/react-table";
import { User } from "@/types";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { RowActions } from "./RowActions";

export const getColumns = (fetchUsers: () => Promise<void>): ColumnDef<User>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    size: 28,
    enableSorting: false,
    enableHiding: false,
  },
  {
    header: "Username",
    accessorKey: "username",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("username")}</div>
    ),
    size: 180,
    filterFn: (row, filterValue) => {
      const searchableRowContent =
        `${row.original.username} ${row.original.email}`.toLowerCase();
      const searchTerm = (filterValue ?? "").toLowerCase();
      return searchableRowContent.includes(searchTerm);
    },
    enableHiding: false,
  },
  {
    header: "Email",
    accessorKey: "email",
    size: 220,
  },
  {
    header: "Groups",
    accessorKey: "groups",
    cell: ({ row }) => (
      <div>
        {row.original.groups.map((group) => {
          let badgeColor = "gray-500"; 
          if (group.name === "SuperAdmin") {
            badgeColor = "bg-blue-500"; 
          } else if (group.name === "Operator") {
            badgeColor = "bg-gray-500"; 
          }

          return (
            <Badge key={group.id} className={`mr-1 ${badgeColor}`}>
              {group.name}
            </Badge>
          );
        })}
      </div>
    ),
    size: 180,
  },
  {
    header: "Status",
    accessorKey: "status",
    cell: ({ row }) => {
      const status = row.original.status; 
  
      const badgeColor = {
        active: "bg-custom-green2",
        invited: "bg-blue-500",
        assigned: "bg-gray-500",
      }[status] || "bg-gray-500"; 
  
      return (
        <Badge className={`mr-1 ${badgeColor}`}>
          {status}
        </Badge>
      );
    },
    size: 180,
  },

  {
    header: "Created At",
    accessorKey: "createdAt",
    cell: ({ row }) => (
      <div>{new Date(row.getValue("createdAt")).toLocaleDateString()}</div>
    ),
    size: 120,
  },
  {
    id: "actions",
    header: () => <span className="sr-only">Actions</span>,
    cell: ({ row }) => <RowActions fetchUsers={fetchUsers} row={row} />,
    size: 60,
    enableHiding: false,
  },
];
