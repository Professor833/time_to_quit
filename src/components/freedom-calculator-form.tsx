import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { motion } from "framer-motion";

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
  annualFreedomGoal: z.coerce.number().min(0, {
    message: "Annual freedom goal must be a positive number.",
  }),
  currentNetWorth: z.coerce.number().min(0, {
    message: "Net worth must be a positive number.",
  }),
  annualIncome: z.coerce.number().min(0, {
    message: "Annual income must be a positive number.",
  }),
  incomeGrowthRate: z.coerce.number().min(0, {
    message: "Income growth rate must be a positive number.",
  }),
  annualExpenses: z.coerce.number().min(0, {
    message: "Annual expenses must be a positive number.",
  }),
  inflationRate: z.coerce.number().min(0, {
    message: "Inflation rate must be a positive number.",
  }),
  investmentReturn: z.coerce.number().min(0, {
    message: "Investment return must be a positive number.",
  }),
  withdrawalRate: z.coerce.number().min(0, {
    message: "Withdrawal rate must be a positive number.",
  }),
});

export type FreedomCalculatorFormValues = z.infer<typeof formSchema>;

interface FreedomCalculatorFormProps {
  onSubmit: (values: FreedomCalculatorFormValues) => void;
}

export function FreedomCalculatorForm({ onSubmit }: FreedomCalculatorFormProps) {
  const form = useForm<FreedomCalculatorFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      annualFreedomGoal: 2000000, // 20 lakhs per year
      currentNetWorth: 5000000, // 50 lakhs
      annualIncome: 1200000, // 12 lakhs per year
      incomeGrowthRate: 5, // 5% annual growth
      annualExpenses: 600000, // 6 lakhs per year
      inflationRate: 6, // 6% inflation
      investmentReturn: 8, // 8% return
      withdrawalRate: 4, // 4% safe withdrawal rate
    },
  });

  const handleSubmit = (data: FreedomCalculatorFormValues) => {
    onSubmit(data);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Complete Financial Freedom</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="annualFreedomGoal"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>🎯 Annual Freedom Goal</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2">₹</span>
                          <Input 
                            placeholder="2000000" 
                            type="number" 
                            className="pl-8" 
                            {...field} 
                          />
                        </div>
                      </FormControl>
                      <FormDescription>
                        Annual income needed for comfortable living
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="currentNetWorth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>💰 Current Net Worth</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2">₹</span>
                          <Input 
                            placeholder="5000000" 
                            type="number" 
                            className="pl-8" 
                            {...field} 
                          />
                        </div>
                      </FormControl>
                      <FormDescription>
                        Total investable assets
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="annualIncome"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>💵 Annual Income</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2">₹</span>
                          <Input 
                            placeholder="1200000" 
                            type="number" 
                            className="pl-8" 
                            {...field} 
                          />
                        </div>
                      </FormControl>
                      <FormDescription>
                        Your current annual income
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="incomeGrowthRate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>📈 Income Growth Rate (%)</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute right-3 top-1/2 -translate-y-1/2">%</span>
                          <Input 
                            placeholder="5" 
                            type="number" 
                            className="pr-8" 
                            {...field} 
                          />
                        </div>
                      </FormControl>
                      <FormDescription>
                        Expected annual income growth
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="annualExpenses"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>💸 Annual Expenses</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2">₹</span>
                          <Input 
                            placeholder="600000" 
                            type="number" 
                            className="pl-8" 
                            {...field} 
                          />
                        </div>
                      </FormControl>
                      <FormDescription>
                        Your current annual expenses
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="inflationRate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>📊 Inflation Rate (%)</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute right-3 top-1/2 -translate-y-1/2">%</span>
                          <Input 
                            placeholder="6" 
                            type="number" 
                            className="pr-8" 
                            {...field} 
                          />
                        </div>
                      </FormControl>
                      <FormDescription>
                        Expected annual inflation
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="investmentReturn"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>📈 Investment Return (%)</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute right-3 top-1/2 -translate-y-1/2">%</span>
                          <Input 
                            placeholder="8" 
                            type="number" 
                            className="pr-8" 
                            {...field} 
                          />
                        </div>
                      </FormControl>
                      <FormDescription>
                        Expected annual return on investments
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="withdrawalRate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>🧮 Withdrawal Rate (%)</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute right-3 top-1/2 -translate-y-1/2">%</span>
                          <Input 
                            placeholder="4" 
                            type="number" 
                            className="pr-8" 
                            {...field} 
                          />
                        </div>
                      </FormControl>
                      <FormDescription>
                        Safe withdrawal rate (typically 3.5-4%)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button type="submit" className="w-full">Calculate My Freedom</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
