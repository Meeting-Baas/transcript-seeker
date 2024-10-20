'use client';

import { ChevronDownIcon, DotsHorizontalIcon } from '@radix-ui/react-icons';
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table';
import type { Row } from '@tanstack/react-table';
import * as React from 'react';

import { Button } from '@meeting-baas/ui/button';
import { Checkbox } from '@meeting-baas/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@meeting-baas/ui/dropdown-menu';
import { Input } from '@meeting-baas/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@meeting-baas/ui/table';

import { Badge } from '@meeting-baas/ui/badge';
import { CopyIcon, EyeIcon, LoaderCircleIcon, PencilIcon, TrashIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

import { StorageBucketAPI } from '@/lib/bucketAPI';
import { Meeting } from '@/types';
import RenameModal from './components/rename-modal';

import { z } from 'zod';
import { formSchema as renameSchema } from './components/rename-modal';
import useSWR from 'swr';
import {
  getMeetings,
  deleteMeeting as deleteMeetingDb,
  renameMeeting as renameMeetingDb,
} from '@/queries';

const fetchMeetings = async () => {
  const meetings = await getMeetings();
  if (!meetings) return [];
  if (Array.isArray(meetings)) {
    return meetings;
  }
  return [];
};

const columns: (
  deleteMeeting: (id: number, botId: string) => void,
  renameMeeting: (id: number, newName: string) => void,
) => ColumnDef<Meeting>[] = (deleteMeeting, renameMeeting) => [
  // {
  //   id: 'select',
  //   header: ({ table }) => (
  //     <Checkbox
  //       checked={
  //         table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')
  //       }
  //       onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
  //       aria-label="Select all"
  //     />
  //   ),
  //   cell: ({ row }) => (
  //     <Checkbox
  //       checked={row.getIsSelected()}
  //       onCheckedChange={(value) => row.toggleSelected(!!value)}
  //       aria-label="Select row"
  //     />
  //   ),
  //   enableSorting: false,
  //   enableHiding: false,
  // },
  {
    accessorKey: 'bot_id',
    header: 'Bot ID',
    cell: ({ row }) => <div>{row.getValue('bot_id')}</div>,
  },
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => <div>{row.getValue('name')}</div>,
  },
  {
    accessorKey: 'attendees',
    header: () => 'Attendees',
    cell: ({ row }) => {
      let attendees: string[] = row.getValue('attendees') || [];

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
    header: 'Created At',
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
    sortingFn: (rowA, rowB, columnId) => {
      const dateA = new Date(rowA.getValue(columnId));
      const dateB = new Date(rowB.getValue(columnId));
      return dateA.getTime() - dateB.getTime();
    },
  },

  {
    id: 'actions',
    enableHiding: false,
    cell: (props) => (
      <RowActions row={props.row} deleteMeeting={deleteMeeting} renameMeeting={renameMeeting} />
    ),
  },
];

function RowActions({
  row,
  deleteMeeting,
  renameMeeting,
}: {
  row: Row<Meeting>;
  deleteMeeting: (id: number, botId: string) => void;
  renameMeeting: (id: number, newName: string) => void;
}) {
  const [showRename, setShowRename] = React.useState(false);
  const { original: meeting } = row;

  return (
    <div className="flex w-full items-center justify-end gap-2">
      {meeting.status === 'loaded' ? (
        <Button size="icon" asChild className="h-8 w-8 p-0">
          <Link to={`/meeting/${meeting.bot_id}`}>
            <EyeIcon className="h-4 w-4" />
          </Link>
        </Button>
      ) : (
        <Button variant={'outline'} size={'icon'} className="h-8 w-8 p-0">
          <LoaderCircleIcon className="h-4 w-4 animate-spin" />
        </Button>
      )}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <DotsHorizontalIcon className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="space-y-1">
          {/* <DropdownMenuLabel>Actions</DropdownMenuLabel> */}
          <DropdownMenuItem onClick={() => navigator.clipboard.writeText(meeting.bot_id)}>
            <CopyIcon className="mr-2 h-4 w-4" />
            Copy Bot ID
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setShowRename(true)}>
            <PencilIcon className="mr-2 h-4 w-4" />
            Rename
          </DropdownMenuItem>
          <DropdownMenuItem
            className="bg-red-500/30 text-red-500 focus:bg-red-500/50 focus:text-red-600"
            onClick={() => deleteMeeting(meeting.id, meeting.bot_id)}
          >
            <TrashIcon className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <RenameModal
        open={showRename}
        onOpenChange={setShowRename}
        defaultValues={{
          name: meeting.name,
        }}
        onSubmit={(values: z.infer<typeof renameSchema>) => {
          renameMeeting(meeting.id, values.name);
          setShowRename(false);
        }}
      />
    </div>
  );
}

function MeetingTable() {
  const [sorting, setSorting] = React.useState<SortingState>([
    {
      id: 'createdAt',
      desc: true,
    },
  ]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({
    bot_id: false,
  });
  const [rowSelection, setRowSelection] = React.useState({});

  const { data, mutate, isLoading } = useSWR('meetings', () => fetchMeetings());

  const table = useReactTable({
    data: data!,
    columns: columns(deleteMeeting, renameMeeting),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  async function deleteMeeting(id: number, botId: string) {
    try {
      const storageAPI = new StorageBucketAPI('local_files');
      await storageAPI.init();

      // todo: see if this uses botId or id storageAPI
      await deleteMeetingDb({ id: id });
      if (await storageAPI.get(`${botId}.mp4`)) await storageAPI.del(`${botId}.mp4`);
      mutate();

      console.log('updating meetings', data);

      toast.success('Successfully deleted meeting.');
    } catch (error) {
      console.error('error', error);
    }
  }

  async function renameMeeting(id: number, newName: string) {
    try {
      console.log(id);
      await renameMeetingDb({ id, name: newName });
      mutate();

      console.log('Updated meetings:', data);
      toast.success('Successfully renamed meeting.');
    } catch (error) {
      console.error('Error renaming meeting:', error);
      toast.error('Failed to rename meeting.');
    }
  }

  return (
    <div className="w-full sm:max-h-[70dvh] sm:min-h-[50dvh] sm:overflow-auto">
      <div className="mb-4 flex items-center gap-2 rounded-b-md border-x border-b border-border px-2 pb-2 pt-1 empty:pb-0">
        {data?.length && data?.length > 0 ? (
          <>
            {/* TODO: implement search module connectivity here */}
            <Input
              placeholder="Filter Bot Id..."
              value={(table.getColumn('bot_id')?.getFilterValue() as string) ?? ''}
              onChange={(event) => table.getColumn('bot_id')?.setFilterValue(event.target.value)}
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="ml-auto">
                  Columns <ChevronDownIcon className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => {
                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) => column.toggleVisibility(!!value)}
                      >
                        {column.id}
                      </DropdownMenuCheckboxItem>
                    );
                  })}
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        ) : (<></>)}
      </div>
      {data?.length && data?.length > 0 ? (
        <>
          <div className="flex-grow overflow-auto rounded-md sm:max-h-[calc(70dvh-186px)]">
            <div className="flex-grow overflow-auto rounded-md border">
              <Table>
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => {
                        return (
                          <TableHead key={header.id}>
                            {header.isPlaceholder
                              ? null
                              : flexRender(header.column.columnDef.header, header.getContext())}
                          </TableHead>
                        );
                      })}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => (
                      <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id}>
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={columns.length} className="h-24 text-center">
                        No results.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
          <div className="flex items-center justify-end space-x-2 py-4">
            {/* <div className="flex-1 text-sm text-muted-foreground">
              {table.getFilteredSelectedRowModel().rows.length} of{' '}
              {table.getFilteredRowModel().rows.length} row(s) selected.
            </div> */}
            <div className="space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                Next
              </Button>
            </div>
          </div>
        </>
      ) : (
        <p>{isLoading ? 'Loading...' : 'No results.'}</p>
      )}
    </div>
  );
}

export default MeetingTable;