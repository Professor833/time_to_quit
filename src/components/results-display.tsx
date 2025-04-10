import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { motion } from "framer-motion";
import { 
  calculateMonthsOfFreedom, 
  calculateFreedomScore, 
  calculateQuitDate, 
  formatDate, 
  calculateBurndownData,
  formatCurrency,
  calculateRequiredSavings
} from "@/lib/utils";
import type { FinancialFormValues } from "./financial-form";

interface ResultsDisplayProps {
  financialData: FinancialFormValues;
  onAdjust: () => void;
}

export function ResultsDisplay({ financialData, onAdjust }: ResultsDisplayProps) {
  const [adjustedData, setAdjustedData] = useState<FinancialFormValues>(financialData);
  
  // Use buffer time from form input
  const targetMonths = adjustedData.emergencyBuffer;
  
  // Calculate results based on current data
  const monthsOfFreedom = calculateMonthsOfFreedom(
    adjustedData.savings, 
    adjustedData.monthlyExpenses, 
    adjustedData.sideIncome
  );
  
  const freedomScore = calculateFreedomScore(
    monthsOfFreedom, 
    targetMonths // Use buffer time directly as target
  );
  
  const quitDate = calculateQuitDate(monthsOfFreedom);
  const burndownData = calculateBurndownData(
    adjustedData.savings, 
    adjustedData.monthlyExpenses, 
    adjustedData.sideIncome, 
    monthsOfFreedom
  );

  // For minimalist mode
  const minimalistExpenses = adjustedData.monthlyExpenses * 0.7; // 30% reduction
  const minimalistMonths = calculateMonthsOfFreedom(
    adjustedData.savings, 
    minimalistExpenses, 
    adjustedData.sideIncome
  );
  
  // Calculate required savings to reach goal
  const requiredSavings = calculateRequiredSavings(
    adjustedData.monthlyExpenses,
    targetMonths,
    adjustedData.sideIncome
  );
  
  // Calculate savings gap (how much more is needed)
  const savingsGap = Math.max(0, requiredSavings - adjustedData.savings);
  const hasReachedGoal = adjustedData.savings >= requiredSavings;

  // Handle slider changes
  const handleExpensesChange = (value: number[]) => {
    setAdjustedData(prev => ({
      ...prev,
      monthlyExpenses: value[0]
    }));
  };

  const handleSavingsChange = (value: number[]) => {
    setAdjustedData(prev => ({
      ...prev,
      savings: value[0]
    }));
  };

  const handleSideIncomeChange = (value: number[]) => {
    setAdjustedData(prev => ({
      ...prev,
      sideIncome: value[0]
    }));
  };

  // Reset adjustments
  const resetAdjustments = () => {
    setAdjustedData(financialData);
  };

  // Prepare data for sharing
  const shareResults = () => {
    const text = `I'm ${freedomScore}% to quitting my job! I can survive for ${monthsOfFreedom.toFixed(1)} months without income. #CanIQuit`;
    
    if (navigator.share) {
      navigator.share({
        title: 'My Freedom Score',
        text: text,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(text);
      alert('Results copied to clipboard!');
    }
  };

  return (
    <div className="space-y-8 w-full max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-2xl font-bold">Your Freedom Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center space-y-2">
              <h3 className="text-xl font-medium">Freedom Score</h3>
              <Progress value={freedomScore} className="h-4" />
              <p className="text-3xl font-bold text-primary">{freedomScore}%</p>
              <p className="text-muted-foreground">to your ideal freedom goal</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="p-4 bg-muted rounded-lg">
                <h3 className="font-medium">🔥 Months of Freedom</h3>
                <p className="text-2xl font-bold">
                  {monthsOfFreedom === Infinity ? "∞" : monthsOfFreedom.toFixed(1)}
                </p>
              </div>
              
              <div className="p-4 bg-muted rounded-lg">
                <h3 className="font-medium">📅 Quit Date ETA</h3>
                <p className="text-2xl font-bold">
                  {monthsOfFreedom === Infinity ? "Anytime!" : formatDate(quitDate)}
                </p>
              </div>
              
              <div className="p-4 bg-muted rounded-lg">
                <h3 className="font-medium">🧘 Minimalist Mode</h3>
                <p className="text-2xl font-bold">
                  {minimalistMonths === Infinity ? "∞" : minimalistMonths.toFixed(1)} months
                </p>
                <p className="text-xs text-muted-foreground">If you cut expenses by 30%</p>
              </div>
            </div>
            
            <div className="p-4 bg-muted rounded-lg mt-4">
              <h3 className="font-medium text-center mb-2">💰 Savings Goal</h3>
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Required for {targetMonths} months:</p>
                  <p className="text-xl font-bold">{formatCurrency(requiredSavings)}</p>
                </div>
                <div className="text-right">
                  {!hasReachedGoal ? (
                    <>
                      <p className="font-medium text-amber-500">Savings Gap:</p>
                      <p className="text-xl font-bold text-amber-500">{formatCurrency(savingsGap)}</p>
                    </>
                  ) : (
                    <p className="text-xl font-bold text-green-500">Goal Reached! 🎉</p>
                  )}
                </div>
              </div>
              <Progress 
                value={(adjustedData.savings / requiredSavings) * 100} 
                className="h-4 mt-2" 
                max={100}
              />
            </div>
            
            <div className="pt-6">
              <h3 className="font-medium mb-4">📊 Savings Burndown</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={burndownData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="month" 
                      label={{ value: 'Months', position: 'insideBottomRight', offset: 0 }} 
                    />
                    <YAxis 
                      label={{ value: 'Savings (₹)', angle: -90, position: 'insideLeft' }} 
                      tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}K`}
                    />
                    <Tooltip 
                      formatter={(value) => [`₹${value}`, 'Savings']}
                      labelFormatter={(label) => `Month ${label}`}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="savings" 
                      stroke="#8884d8" 
                      fill="#8884d8" 
                      fillOpacity={0.3} 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-xl font-bold">🧮 What If Scenarios</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="font-medium">Monthly Expenses</span>
                  <span className="font-semibold">{formatCurrency(adjustedData.monthlyExpenses)}</span>
                </div>
                <div className="px-1 py-4">
                  <div className="relative w-full h-12 flex items-center">
                    <div className="absolute w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                    <div 
                      className="absolute h-3 bg-blue-500 dark:bg-blue-400 rounded-full" 
                      style={{ 
                        width: `${((adjustedData.monthlyExpenses - (financialData.monthlyExpenses * 0.5)) / (financialData.monthlyExpenses)) * 100}%`,
                        maxWidth: '100%'
                      }}
                    ></div>
                    <div 
                      className="absolute w-7 h-7 bg-white border-2 border-blue-500 rounded-full shadow-lg cursor-pointer"
                      style={{ 
                        left: `calc(${((adjustedData.monthlyExpenses - (financialData.monthlyExpenses * 0.5)) / (financialData.monthlyExpenses)) * 100}% - 14px)`,
                        maxWidth: '100%',
                        minWidth: '0%'
                      }}
                      onMouseDown={(e) => {
                        const slider = e.currentTarget.parentElement;
                        if (!slider) return;
                        
                        const handleMouseMove = (moveEvent: MouseEvent) => {
                          const rect = slider.getBoundingClientRect();
                          const x = Math.max(0, Math.min(moveEvent.clientX - rect.left, rect.width));
                          const percentage = x / rect.width;
                          const min = financialData.monthlyExpenses * 0.5;
                          const max = financialData.monthlyExpenses * 1.5;
                          const value = Math.round((min + percentage * (max - min)) / 1000) * 1000;
                          handleExpensesChange([value]);
                        };
                        
                        const handleMouseUp = () => {
                          document.removeEventListener('mousemove', handleMouseMove);
                          document.removeEventListener('mouseup', handleMouseUp);
                        };
                        
                        document.addEventListener('mousemove', handleMouseMove);
                        document.addEventListener('mouseup', handleMouseUp);
                      }}
                    ></div>
                  </div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-2">
                  <span className="font-medium">Total Savings</span>
                  <span className="font-semibold">{formatCurrency(adjustedData.savings)}</span>
                </div>
                <div className="px-1 py-4">
                  <div className="relative w-full h-12 flex items-center">
                    <div className="absolute w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                    <div 
                      className="absolute h-3 bg-blue-500 dark:bg-blue-400 rounded-full" 
                      style={{ 
                        width: `${(adjustedData.savings / Math.max(requiredSavings * 1.5, financialData.savings * 1.5)) * 100}%`,
                        maxWidth: '100%'
                      }}
                    ></div>
                    
                    {/* Goal marker */}
                    {requiredSavings > 0 && (
                      <div 
                        className="absolute h-6 w-1 bg-green-500 rounded-full" 
                        style={{ 
                          left: `${(requiredSavings / Math.max(requiredSavings * 1.5, financialData.savings * 1.5)) * 100}%`,
                        }}
                      ></div>
                    )}
                    
                    <div 
                      className="absolute w-7 h-7 bg-white border-2 border-blue-500 rounded-full shadow-lg cursor-pointer"
                      style={{ 
                        left: `calc(${(adjustedData.savings / Math.max(requiredSavings * 1.5, financialData.savings * 1.5)) * 100}% - 14px)`,
                        maxWidth: '100%',
                        minWidth: '0%'
                      }}
                      onMouseDown={(e) => {
                        const slider = e.currentTarget.parentElement;
                        if (!slider) return;
                        
                        const handleMouseMove = (moveEvent: MouseEvent) => {
                          const rect = slider.getBoundingClientRect();
                          const x = Math.max(0, Math.min(moveEvent.clientX - rect.left, rect.width));
                          const percentage = x / rect.width;
                          const maxValue = Math.max(requiredSavings * 1.5, financialData.savings * 1.5);
                          const value = Math.round((percentage * maxValue) / 10000) * 10000;
                          handleSavingsChange([value]);
                        };
                        
                        const handleMouseUp = () => {
                          document.removeEventListener('mousemove', handleMouseMove);
                          document.removeEventListener('mouseup', handleMouseUp);
                        };
                        
                        document.addEventListener('mousemove', handleMouseMove);
                        document.addEventListener('mouseup', handleMouseUp);
                      }}
                    ></div>
                  </div>
                  {requiredSavings > 0 && (
                    <div className="flex justify-between mt-1 text-xs">
                      <span>Current: {formatCurrency(adjustedData.savings)}</span>
                      <span className="text-green-500">Goal: {formatCurrency(requiredSavings)}</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-2">
                  <span className="font-medium">Side Income</span>
                  <span className="font-semibold">{formatCurrency(adjustedData.sideIncome)}</span>
                </div>
                <div className="px-1 py-4">
                  <div className="relative w-full h-12 flex items-center">
                    <div className="absolute w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                    <div 
                      className="absolute h-3 bg-blue-500 dark:bg-blue-400 rounded-full" 
                      style={{ 
                        width: `${(adjustedData.sideIncome / financialData.monthlyExpenses) * 100}%`,
                        maxWidth: '100%'
                      }}
                    ></div>
                    <div 
                      className="absolute w-7 h-7 bg-white border-2 border-blue-500 rounded-full shadow-lg cursor-pointer"
                      style={{ 
                        left: `calc(${(adjustedData.sideIncome / financialData.monthlyExpenses) * 100}% - 14px)`,
                        maxWidth: '100%',
                        minWidth: '0%'
                      }}
                      onMouseDown={(e) => {
                        const slider = e.currentTarget.parentElement;
                        if (!slider) return;
                        
                        const handleMouseMove = (moveEvent: MouseEvent) => {
                          const rect = slider.getBoundingClientRect();
                          const x = Math.max(0, Math.min(moveEvent.clientX - rect.left, rect.width));
                          const percentage = x / rect.width;
                          const min = 0;
                          const max = financialData.monthlyExpenses;
                          const value = Math.round((min + percentage * (max - min)) / 1000) * 1000;
                          handleSideIncomeChange([value]);
                        };
                        
                        const handleMouseUp = () => {
                          document.removeEventListener('mousemove', handleMouseMove);
                          document.removeEventListener('mouseup', handleMouseUp);
                        };
                        
                        document.addEventListener('mousemove', handleMouseMove);
                        document.addEventListener('mouseup', handleMouseUp);
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button 
                onClick={resetAdjustments} 
                className="flex-1 h-10 px-4 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-2 border-gray-300 dark:border-gray-600 rounded-md font-medium hover:bg-gray-100 dark:hover:bg-gray-700 shadow-md"
              >
                Reset Adjustments
              </button>
              <button 
                onClick={onAdjust} 
                className="flex-1 h-10 px-4 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-2 border-gray-300 dark:border-gray-600 rounded-md font-medium hover:bg-gray-100 dark:hover:bg-gray-700 shadow-md"
              >
                Start Over
              </button>
              <button 
                onClick={shareResults} 
                className="flex-1 h-10 px-4 py-2 bg-blue-500 text-white rounded-md font-medium hover:bg-blue-600 shadow-md"
              >
                Share Results
              </button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
