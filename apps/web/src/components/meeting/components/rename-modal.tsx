import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@meeting-baas/ui/dialog';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@meeting-baas/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@meeting-baas/ui/form';

import { Input } from '@meeting-baas/ui/input';

export const formSchema = z.object({
  name: z.string().min(2, {
    message: 'Name must be at least 2 characters.',
  }),
});

interface RenameModalProps {
  open: boolean;
  onOpenChange: (value: boolean) => void;
  defaultValues: z.infer<typeof formSchema>;
  onSubmit: (values: z.infer<typeof formSchema>) => void;
}

export default function RenameModal({
  open,
  onOpenChange,
  defaultValues,
  onSubmit,
}: RenameModalProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues,
  });

  // function onSubmit(values: z.infer<typeof formSchema>) {
  //   handleSubmit(values)
  // }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Rename meeting</DialogTitle>
          <DialogDescription>
            Make changes to your meeting here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Unnamed Meeting" {...field} />
                  </FormControl>
                  <FormDescription>This is the name of the meeting.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
