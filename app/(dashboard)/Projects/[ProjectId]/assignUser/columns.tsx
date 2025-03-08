// columns.tsx
import { ColumnDef } from "@tanstack/react-table";
import { User } from "@/types";
import { Checkbox } from "@/components/ui/checkbox";
import { RowActions } from "./RowActions";
import { Badge } from "@/components/ui/badge";


export const getColumns = (ProjectId: string, projectName: string,fetchUsers: () => Promise<void>): ColumnDef<User>[] => [  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
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
    cell: ({ row }) => <div className="font-medium">{row.getValue("username")}</div>,
    size: 180,
    filterFn: (row, _columnId, filterValue) => {
      const searchableRowContent = `${row.original.username} ${row.original.username}`.toLowerCase();
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
    header: "Status",
    accessorKey: "status",
    cell: ({ row }) => {
      const status = row.original.status; 
  
      const badgeColor = {
        active: "bg-gray-500",
        invited: "bg-blue-500",
        assigned: "bg-custom-green2",
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
    accessorKey: "groups",
    header: "Groups",
    cell: ({ row }) => {
      const groups = row.original.groups;
      return (
        <>
          {groups.map((group, index) => (
            <span key={index} className="mr-2">
              {group.name}
            </span>
          ))}
        </>
      );
    },
  },



  {
    header: "Created At",
    accessorKey: "createdAt",
    cell: ({ row }) => <div>{new Date(row.getValue("createdAt")).toLocaleDateString()}</div>,
    size: 120,
  },
  {
    header: "Updated At",
    accessorKey: "updatedAt",
    cell: ({ row }) => <div>{new Date(row.getValue("updatedAt")).toLocaleDateString()}</div>,
    size: 120,
  },

  
  {

    id: "actions",
    header: () => <span className="sr-only">Actions</span>,
    cell: ({ row }) =>  <RowActions fetchUsers={fetchUsers} projectName={projectName} ProjectId={ProjectId} row={row} />,
    size: 60,
    enableHiding: false,
  },
];