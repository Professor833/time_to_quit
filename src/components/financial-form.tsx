import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const formSchema = z.object({
  savings: z.coerce.number().min(0, {
    message: "Savings must be a positive number.",
  }),
  monthlyExpenses: z.coerce.number().min(0, {
    message: "Monthly expenses must be a positive number.",
  }),
  emergencyBuffer: z.coerce.number().min(0, {
    message: "Emergency buffer must be a positive number.",
  }),
  sideIncome: z.coerce.number().min(0, {
    message: "Side income must be a positive number.",
  }),
});

export type FinancialFormValues = z.infer<typeof formSchema>;

interface FinancialFormProps {
  onSubmit: (values: FinancialFormValues) => void;
}

export function FinancialForm({ onSubmit }: FinancialFormProps) {
  const form = useForm<FinancialFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      savings: 0,
      monthlyExpenses: 0,
      emergencyBuffer: 3,
      sideIncome: 0,
    },
  });

  const handleSubmit = (data: FinancialFormValues) => {
    onSubmit(data);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Income & Expense Form</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="savings"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>💰 Total Savings</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2">₹</span>
                      <Input 
                        placeholder="0" 
                        type="number" 
                        className="pl-8" 
                        {...field} 
                      />
                    </div>
                  </FormControl>
                  <FormDescription>
                    Your current total savings amount.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="monthlyExpenses"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>💸 Monthly Expenses</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2">₹</span>
                      <Input 
                        placeholder="0" 
                        type="number" 
                        className="pl-8" 
                        {...field} 
                      />
                    </div>
                  </FormControl>
                  <FormDescription>
                    Your average monthly expenses.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="emergencyBuffer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>🛟 Emergency Buffer (months)</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="3" 
                      type="number" 
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    How many months of expenses you want to keep as a safety buffer.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="sideIncome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>📈 Side Income (Monthly)</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2">₹</span>
                      <Input 
                        placeholder="0" 
                        type="number" 
                        className="pl-8" 
                        {...field} 
                      />
                    </div>
                  </FormControl>
                  <FormDescription>
                    Any monthly income you&apos;ll have after quitting your job.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">Calculate My Freedom</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
