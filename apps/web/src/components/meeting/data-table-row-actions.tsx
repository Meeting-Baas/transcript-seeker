'use client';

import type { Row } from '@tanstack/react-table';
import { useState } from 'react';
import { useMeetings } from '@/hooks/use-meetings';
import { StorageBucketAPI } from '@/lib/storage-bucket-api';
import { deleteMeeting as deleteMeetingDb, renameMeeting as renameMeetingDb } from '@/queries';
import { Meeting } from '@/types';
import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { CopyIcon, EyeIcon, LoaderCircle, PencilIcon, TrashIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { mutate } from 'swr';
import { z } from 'zod';

import { Button } from '@meeting-baas/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@meeting-baas/ui/dropdown-menu';

import type { formSchema as renameSchema } from './rename-modal';
import RenameModal from './rename-modal';

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions({ row }: DataTableRowActionsProps<Meeting>) {
  const meeting = row.original;
  const [showRename, setShowRename] = useState(false);
  const { meetings } = useMeetings();

  async function deleteMeeting(id: number, botId: string) {
    try {
      const storageAPI = new StorageBucketAPI('local_files');
      await storageAPI.init();

      // todo: see if this uses botId or id storageAPI
      await deleteMeetingDb({ id: id });
      if (await storageAPI.get(`${botId}.mp4`)) await storageAPI.del(`${botId}.mp4`);
      mutate('meetings');

      console.log('updated meetings:', meetings);
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

      console.log('updated meetings:', meetings);
      toast.success('Successfully renamed meeting.');
    } catch (error) {
      console.error('Error renaming meeting:', error);
      toast.error('Failed to rename meeting.');
    }
  }

  return (
    <div className="flex w-full items-center justify-end gap-2">
      {meeting.status === 'loaded' ? (
        <Button size="icon" asChild className="h-8 w-8 p-0">
          <Link to={`/meeting/${meeting.botId}`}>
            <EyeIcon className="h-4 w-4" />
          </Link>
        </Button>
      ) : (
        <Button variant={'outline'} size={'icon'} className="h-8 w-8 p-0">
          <LoaderCircle className="h-4 w-4 animate-spin" />
        </Button>
      )}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="flex h-8 w-8 p-0 data-[state=open]:bg-muted">
            <span className="sr-only">Open menu</span>
            <DotsHorizontalIcon className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px] space-y-1">
          {/* <DropdownMenuLabel>Actions</DropdownMenuLabel> */}
          <DropdownMenuItem onClick={() => navigator.clipboard.writeText(meeting.botId)}>
            <CopyIcon className="mr-0.5 h-4 w-4" />
            Copy Bot ID
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setShowRename(true)}>
            <PencilIcon className="mr-0.5 h-4 w-4" />
            Rename
          </DropdownMenuItem>
          <DropdownMenuItem
            className="bg-red-500/30 text-red-500 focus:bg-red-500/50 focus:text-red-600"
            onClick={() => deleteMeeting(meeting.id, meeting.botId)}
          >
            <TrashIcon className="mr-0.5 h-4 w-4" />
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
