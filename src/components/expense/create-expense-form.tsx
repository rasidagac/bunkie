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
  house_id: string;
  user_id: string;
}

const SPLIT_TYPES = {
  equal: "Equal",
  custom: "Custom",
  percentage: "Percentage",
} as const;

type SplitType = keyof typeof SPLIT_TYPES;

const formSchema = z.object({
  title: z.string().nonempty(),
  price: z.coerce.number(),
  currency: z.union([z.literal("TRY"), z.literal("USD"), z.literal("EUR")]),
  split_type: z.enum(["equal", "custom", "percentage"]).default("equal"),
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
      split_type: "equal",
    },
  });

  const imageRef = form.register("image");

  async function handleSubmit(values: CreateExpenseValues) {
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
          name="currency"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Currency</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="TRY">TRY</SelectItem>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="EUR">EUR</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="split_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Split Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select split type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.entries(SPLIT_TYPES).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
