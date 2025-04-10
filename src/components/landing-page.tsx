import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

interface LandingPageProps {
  onGetStarted: () => void;
}

export function LandingPage({ onGetStarted }: LandingPageProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        <div className="space-y-2">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter">
            <span className="text-primary">Can I Quit?</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-[600px] mx-auto">
            Find out when you can finally quit your job.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="py-4"
        >
          <div className="bg-muted p-6 rounded-lg max-w-[500px] mx-auto">
            <h2 className="text-xl font-semibold mb-4">Discover Your Freedom Timeline</h2>
            <ul className="text-left space-y-3">
              <li className="flex items-start">
                <span className="mr-2 text-primary">💰</span>
                <span>Calculate how long you can survive without a job</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-primary">📈</span>
                <span>Get your personal Freedom Score</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-primary">🧮</span>
                <span>Explore "What If" scenarios to plan your escape</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-primary">🗓️</span>
                <span>See your potential Quit Date</span>
              </li>
            </ul>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button 
            onClick={onGetStarted} 
            size="lg" 
            className="text-lg px-8"
          >
            Start Now
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}
