'use client';

import type { Meeting } from '@/types';
import { Badge } from '@meeting-baas/ui/badge';
import { Checkbox } from '@meeting-baas/ui/checkbox';
import type { ColumnDef } from '@tanstack/react-table';

import { DataTableColumnHeader } from './data-table-column-header';
import { DataTableRowActions } from "./data-table-row-actions"

export const columns: ColumnDef<Meeting>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'id',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Recording" />,
    cell: ({ row }) => <div>{row.getValue('id')}</div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'botId',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Bot ID" />,
    cell: ({ row }) => <div>{row.getValue('botId')}</div>,
    enableSorting: false,
  },
  {
    accessorKey: 'name',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
    cell: ({ row }) => <div>{row.getValue('name')}</div>,
  },
  {
    accessorKey: 'attendees',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Attendees" />,
    cell: ({ row }) => {
      const attendees: string[] = row.getValue('attendees') || [];

      return (
        <div className="flex gap-2 text-right font-medium">
          {attendees.map((attendee) => (
            <Badge key={attendee}>{attendee}</Badge>
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Created At" />,
    cell: ({ row }) => {
      const date = new Date(row.getValue('createdAt'));

      if (!(date instanceof Date) || isNaN(date.getTime())) {
        return <div className="font-medium">Invalid Date</div>;
      }
      const formatted = new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      }).format(date);

      return <div className="font-medium">{formatted}</div>;
    },
  },

//   {
//     id: 'actions',
//     enableHiding: false,
//     cell: (props) => (
//       <RowActions row={props.row} deleteMeeting={deleteMeeting} renameMeeting={renameMeeting} />
//     ),
//   },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
