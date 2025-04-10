import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ResponsiveContainer, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Line, ComposedChart } from "recharts";
import { motion } from "framer-motion";
import { 
  calculateFinancialFreedomYears,
  formatYearsAndMonths,
  formatCrores,
  formatCurrency
} from "@/lib/utils";
import type { FreedomCalculatorFormValues } from "./freedom-calculator-form";

interface FreedomCalculatorResultsProps {
  financialData: FreedomCalculatorFormValues;
  onAdjust: () => void;
}

export function FreedomCalculatorResults({ financialData, onAdjust }: FreedomCalculatorResultsProps) {
  const [adjustedData, setAdjustedData] = useState<FreedomCalculatorFormValues>(financialData);
  const [showLeanLifestyle, setShowLeanLifestyle] = useState(false);
  
  // Calculate results based on current data
  const freedomResults = calculateFinancialFreedomYears(
    adjustedData.currentNetWorth,
    adjustedData.annualIncome,
    adjustedData.annualExpenses,
    adjustedData.incomeGrowthRate,
    adjustedData.inflationRate,
    adjustedData.investmentReturn,
    adjustedData.withdrawalRate
  );
  
  // Calculate lean lifestyle results (30% reduction in expenses)
  const leanExpenses = adjustedData.annualExpenses * 0.7;
  const leanFreedomResults = calculateFinancialFreedomYears(
    adjustedData.currentNetWorth,
    adjustedData.annualIncome,
    leanExpenses,
    adjustedData.incomeGrowthRate,
    adjustedData.inflationRate,
    adjustedData.investmentReturn,
    adjustedData.withdrawalRate
  );
  
  // Prepare chart data
  const chartData = freedomResults.yearlyProjections.map((projection, index) => {
    const leanProjection = index < leanFreedomResults.yearlyProjections.length 
      ? leanFreedomResults.yearlyProjections[index] 
      : null;
      
    return {
      year: projection.year,
      netWorth: Math.round(projection.netWorth),
      targetCorpus: Math.round(projection.targetCorpus),
      leanNetWorth: leanProjection ? Math.round(leanProjection.netWorth) : 0,
      leanTargetCorpus: leanProjection ? Math.round(leanProjection.targetCorpus) : 0
    };
  });
  
  // Calculate progress percentage
  const progressPercentage = Math.min(
    100,
    (adjustedData.currentNetWorth / freedomResults.finalCorpusNeeded) * 100
  );
  
  // Handle slider changes for savings rate
  const handleSavingsRateChange = (value: number) => {
    const newExpenses = adjustedData.annualIncome * (1 - value / 100);
    setAdjustedData(prev => ({
      ...prev,
      annualExpenses: newExpenses
    }));
  };
  
  // Calculate current savings rate
  const currentSavingsRate = Math.round(
    ((adjustedData.annualIncome - adjustedData.annualExpenses) / adjustedData.annualIncome) * 100
  );
  
  // Prepare data for sharing
  const shareResults = () => {
    const text = `I'll reach financial freedom in ${formatYearsAndMonths(freedomResults.yearsToFreedom)}! Final corpus needed: ${formatCrores(freedomResults.finalCorpusNeeded)}. #FinancialFreedom`;
    
    if (navigator.share) {
      navigator.share({
        title: 'My Financial Freedom Plan',
        text: text,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(text);
      alert('Results copied to clipboard!');
    }
  };
  
  // Format the expected freedom year with months
  const formattedFreedomTime = formatYearsAndMonths(freedomResults.yearsToFreedom);
  const formattedLeanFreedomTime = formatYearsAndMonths(leanFreedomResults.yearsToFreedom);

  return (
    <div className="space-y-8 w-full max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-2xl font-bold">Your Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center space-y-2">
              <h3 className="text-xl font-medium">Progress to Total Independence</h3>
              <Progress value={progressPercentage} className="h-4" />
              <p className="text-3xl font-bold text-primary">{Math.round(progressPercentage)}%</p>
              <p className="text-muted-foreground">of your target corpus</p>
            </div>
            
            <div className="p-4 bg-muted rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div>
                  <h3 className="font-medium">⏱️ Time to Freedom</h3>
                  <p className="text-2xl font-bold">
                    {formattedFreedomTime}
                  </p>
                </div>
                
                <div>
                  <h3 className="font-medium">💰 Final Corpus Needed</h3>
                  <p className="text-2xl font-bold">
                    {formatCrores(freedomResults.finalCorpusNeeded)}
                  </p>
                </div>
                
                <div>
                  <h3 className="font-medium">📅 Expected Year</h3>
                  <p className="text-2xl font-bold">
                    {freedomResults.freedomYear}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="pt-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium">📊 Net Worth vs Target Growth</h3>
                <button 
                  onClick={() => setShowLeanLifestyle(!showLeanLifestyle)}
                  className="px-3 py-1 text-sm bg-muted rounded-md hover:bg-muted/80 transition-colors"
                >
                  {showLeanLifestyle ? "Hide" : "Show"} Lean Lifestyle
                </button>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="year" 
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) => `${value}`}
                    />
                    <YAxis 
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) => 
                        value >= 10000000 
                          ? `${(value / 10000000).toFixed(1)}Cr` 
                          : value >= 100000 
                            ? `${(value / 100000).toFixed(1)}L` 
                            : value
                      }
                    />
                    <Tooltip 
                      formatter={(value: number) => [formatCurrency(value), ""]}
                      labelFormatter={(label) => `Year: ${label}`}
                    />
                    <Legend />
                    <Area 
                      type="monotone" 
                      dataKey="netWorth" 
                      name="Net Worth" 
                      stroke="#4f46e5" 
                      fill="#4f46e5" 
                      fillOpacity={0.3} 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="targetCorpus" 
                      name="Target Corpus" 
                      stroke="#ef4444" 
                      strokeWidth={2}
                      dot={false}
                    />
                    {showLeanLifestyle && (
                      <>
                        <Area 
                          type="monotone" 
                          dataKey="leanNetWorth" 
                          name="Lean Net Worth" 
                          stroke="#10b981" 
                          fill="#10b981" 
                          fillOpacity={0.3} 
                        />
                        <Line 
                          type="monotone" 
                          dataKey="leanTargetCorpus" 
                          name="Lean Target" 
                          stroke="#f59e0b" 
                          strokeWidth={2}
                          dot={false}
                        />
                      </>
                    )}
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            {showLeanLifestyle && (
              <div className="p-4 bg-muted rounded-lg">
                <h3 className="font-medium text-center mb-2">🧘 Lean Lifestyle Results</h3>
                <p className="text-center text-sm mb-4">If you reduce expenses by 30%</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                  <div>
                    <h3 className="font-medium">⏱️ Time to Freedom</h3>
                    <p className="text-xl font-bold text-green-500">
                      {formattedLeanFreedomTime}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium">💰 Final Corpus Needed</h3>
                    <p className="text-xl font-bold text-green-500">
                      {formatCrores(leanFreedomResults.finalCorpusNeeded)}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium">📅 Expected Year</h3>
                    <p className="text-xl font-bold text-green-500">
                      {leanFreedomResults.freedomYear}
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            <div className="p-4 bg-muted rounded-lg">
              <h3 className="font-medium mb-4">💼 Savings Rate</h3>
              <div className="px-1 py-4">
                <div className="relative w-full h-12 flex items-center">
                  <div className="absolute w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                  <div 
                    className="absolute h-3 bg-blue-500 dark:bg-blue-400 rounded-full" 
                    style={{ 
                      width: `${currentSavingsRate}%`,
                      maxWidth: '100%'
                    }}
                  ></div>
                  <div 
                    className="absolute w-7 h-7 bg-white border-2 border-blue-500 rounded-full shadow-lg cursor-pointer"
                    style={{ 
                      left: `calc(${currentSavingsRate}% - 14px)`,
                      maxWidth: '100%',
                      minWidth: '0%'
                    }}
                    onMouseDown={(e) => {
                      const slider = e.currentTarget.parentElement;
                      if (!slider) return;
                      
                      const handleMouseMove = (moveEvent: MouseEvent) => {
                        const rect = slider.getBoundingClientRect();
                        const x = Math.max(0, Math.min(moveEvent.clientX - rect.left, rect.width));
                        const percentage = Math.round((x / rect.width) * 100);
                        handleSavingsRateChange(percentage);
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
                <div className="flex justify-between mt-1 text-sm">
                  <span>0%</span>
                  <span className="font-medium">{currentSavingsRate}%</span>
                  <span>100%</span>
                </div>
                <p className="text-center mt-2 text-sm text-muted-foreground">
                  Adjust your savings rate to see how it impacts your freedom timeline
                </p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
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
