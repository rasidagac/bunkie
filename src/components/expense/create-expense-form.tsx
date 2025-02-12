"use client";

import FormSubmitButton from "@/components/form-submit-button";
import { toast } from "@/hooks/use-toast";
import createExpense from "@actions/expenses/createExpense";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@ui/form";
import { Input } from "@ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface CreateExpenseFormProps {
  house_id: string;
  user_id: string;
}

const formSchema = z.object({
  title: z.string().nonempty(),
  price: z.coerce.number(),
  currency: z.union([z.literal("TRY"), z.literal("USD"), z.literal("EUR")]),
  image: z.instanceof(FileList).optional(),
});

export type CreateExpenseValues = z.infer<typeof formSchema>;

export default function CreateExpenseForm({
  house_id,
  user_id,
}: CreateExpenseFormProps) {
  const form = useForm<CreateExpenseValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      price: 0,
      currency: "TRY",
    },
  });

  const imageRef = form.register("image");

  async function handleSubmit(values: CreateExpenseValues) {
    console.log(values);
    createExpense(house_id, user_id, values).then(() => {
      form.reset();
      toast({ title: "Expense created successfully" });
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-col gap-4"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Expense Title</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="image"
          render={() => (
            <FormItem>
              <FormLabel>Image</FormLabel>
              <FormControl>
                <Input type="file" accept="image/*" {...imageRef} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormSubmitButton>Create Expense</FormSubmitButton>
      </form>
    </Form>
  );
}
