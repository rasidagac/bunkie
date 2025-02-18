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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@ui/select";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface CreateExpenseFormProps {
  groupId: string;
  userId: string;
}

const formSchema = z.object({
  title: z.string().nonempty(),
  amount: z.coerce.number(),
  currency: z.union([z.literal("TRY"), z.literal("USD"), z.literal("EUR")]),
  split_type: z.enum(["equal", "custom", "percentage"]).default("equal"),
  image: z.instanceof(File).array().optional(),
});

export type CreateExpenseValues = z.infer<typeof formSchema>;

export default function CreateExpenseForm({
  groupId,
  userId,
}: CreateExpenseFormProps) {
  const form = useForm<CreateExpenseValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      amount: 0,
      currency: "TRY",
      split_type: "equal",
    },
  });

  const imageRef = form.register("image");

  async function handleSubmit(values: CreateExpenseValues) {
    createExpense(groupId, userId, values).then(() => {
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
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <div className="grid grid-cols-12 gap-x-2">
                  <Input type="number" className="col-span-9" {...field} />
                  <Select
                    onValueChange={(value: "TRY" | "USD" | "EUR") =>
                      form.setValue("currency", value)
                    }
                    defaultValue={form.getValues("currency")}
                  >
                    <FormControl>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="TRY">TRY</SelectItem>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="EUR">EUR</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
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
