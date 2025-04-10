import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

interface LandingPageProps {
  onStartTemporary: () => void;
  onStartComplete: () => void;
}

export function LandingPage({ onStartTemporary, onStartComplete }: LandingPageProps) {
  return (
    <div className="h-full flex flex-col items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl md:text-6xl font-bold mb-3">Can I Quit?</h1>
        <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl">
          Calculate your financial freedom and plan your future
        </p>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
      >
        <div className="bg-muted p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-3">Temporary Freedom</h2>
          <p className="mb-4 text-muted-foreground text-base">
            Calculate how long you can survive without a job based on your current savings and expenses.
          </p>
          <ul className="space-y-2 mb-5 text-sm">
            <li className="flex items-start">
              <span className="mr-2 text-green-500">✅</span>
              <span>See how many months you can survive</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-green-500">✅</span>
              <span>Calculate your freedom score</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-green-500">✅</span>
              <span>Visualize your savings burndown</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-green-500">✅</span>
              <span>Explore &ldquo;what if&rdquo; scenarios</span>
            </li>
          </ul>
          <Button onClick={onStartTemporary} className="w-full py-2 text-base">
            Start Temporary Freedom Calculator
          </Button>
        </div>
        
        <div className="bg-muted p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-3">Complete Financial Freedom</h2>
          <p className="mb-4 text-muted-foreground text-base">
            Find out when you can stop working forever with passive income covering your expenses.
          </p>
          <ul className="space-y-2 mb-5 text-sm">
            <li className="flex items-start">
              <span className="mr-2 text-green-500">✅</span>
              <span>Calculate years to financial independence</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-green-500">✅</span>
              <span>Account for inflation and investment returns</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-green-500">✅</span>
              <span>See your required corpus size</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-green-500">✅</span>
              <span>Explore lean lifestyle options</span>
            </li>
          </ul>
          <Button onClick={onStartComplete} className="w-full py-2 text-base">
            Start Complete Freedom Calculator
          </Button>
        </div>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="text-center text-muted-foreground text-sm"
      >
        <p className="max-w-lg">
          Take control of your financial future and discover when you can achieve freedom from the 9-to-5 grind.
        </p>
      </motion.div>
    </div>
  );
}
