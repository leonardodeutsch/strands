"use client"
import * as z from "zod";
import { useForm } from 'react-hook-form';
import { Button } from '../ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from '../ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { usePathname, useRouter } from 'next/navigation';
import { CommentValidation } from '@/lib/validations/strand';
import Image from "next/image";
import { addCommentToStrand } from "@/lib/actions/strand.actions";
// import { createStrand } from '@/lib/actions/strand.actions';

interface Props {
  strandId: string;
  currentUserImg: string;
  currentUserId: string;
}

const Comment = ({ strandId, currentUserImg, currentUserId }: Props) => {
  const router = useRouter();
  const pathname = usePathname();

  const form = useForm({
    resolver: zodResolver(CommentValidation),
    defaultValues: {
      strand: ''
    }
  });

  const onSubmit = async (values: z.infer<typeof CommentValidation>) => {
    await addCommentToStrand(strandId, values.strand, JSON.parse(currentUserId), pathname)

    form.reset();
  }
  
  return (
    <Form {...form}>
      <form 
        onSubmit={form.handleSubmit(onSubmit)} 
        className="comment-form"
      >
        <FormField
          control={form.control}
          name="strand"
          render={({ field }) => (
            <FormItem className="flex gap-3 w-full items-center">
              <FormLabel>
                <Image src={currentUserImg} alt="Profile image" width={48} height={48} className="rounded-full object-cover"/>
              </FormLabel>
              <FormControl className="border-none bg-transparent">
                <Input
                  type="text"
                  placeholder="Comment..."
                  className="no-focus text-light-1 outline-none"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type="submit" className="comment-form_btn">
          Reply
        </Button>
      </form>
    </Form>
  )
}

export default Comment;