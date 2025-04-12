"use client";

import { useState, useEffect } from "react";
import { LandingPage } from "@/components/landing-page";
import { FinancialForm, type FinancialFormValues } from "@/components/financial-form";
import { ResultsDisplay } from "@/components/results-display";
import { FreedomCalculatorForm, type FreedomCalculatorFormValues } from "@/components/freedom-calculator-form";
import { FreedomCalculatorResults } from "@/components/freedom-calculator-results";
import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { trackPageView, trackCalculatorUse, trackResultsViewed } from "@/lib/analytics";

type CalculatorType = "temporary" | "complete";
type Step = "landing" | "form" | "results";

export default function Home() {
  const [calculatorType, setCalculatorType] = useState<CalculatorType>("temporary");
  const [currentStep, setCurrentStep] = useState<Step>("landing");
  const [temporaryData, setTemporaryData] = useState<FinancialFormValues | null>(null);
  const [completeData, setCompleteData] = useState<FreedomCalculatorFormValues | null>(null);
  const { theme, setTheme } = useTheme();

  // Load saved data from localStorage on initial render
  useEffect(() => {
    const savedTemporaryData = localStorage.getItem("temporaryData");
    const savedCompleteData = localStorage.getItem("completeData");
    
    if (savedTemporaryData) {
      setTemporaryData(JSON.parse(savedTemporaryData));
    }
    
    if (savedCompleteData) {
      setCompleteData(JSON.parse(savedCompleteData));
    }
  }, []);

  useEffect(() => {
    trackPageView(window.location.pathname);
  }, []);

  const handleStartTemporary = () => {
    setCalculatorType("temporary");
    setCurrentStep("form");
    trackCalculatorUse("temporary");
  };

  const handleStartComplete = () => {
    setCalculatorType("complete");
    setCurrentStep("form");
    trackCalculatorUse("complete");
  };

  const handleTemporaryFormSubmit = (data: FinancialFormValues) => {
    setTemporaryData(data);
    setCurrentStep("results");
    trackResultsViewed("temporary", data);
    
    // Save to localStorage for persistence
    localStorage.setItem("temporaryData", JSON.stringify(data));
  };

  const handleCompleteFormSubmit = (data: FreedomCalculatorFormValues) => {
    setCompleteData(data);
    setCurrentStep("results");
    trackResultsViewed("complete", data);
    
    // Save to localStorage for persistence
    localStorage.setItem("completeData", JSON.stringify(data));
  };

  const handleAdjust = () => {
    setCurrentStep("form");
  };

  const handleBackToHome = () => {
    setCurrentStep("landing");
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  // SVG icons for theme toggle
  const SunIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  );

  const MoonIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Header */}
      <header className="py-2 px-4 flex items-center justify-between">
        <div className="flex-1">
          {currentStep !== "landing" && (
            <button 
              onClick={handleBackToHome}
              className="text-sm text-muted-foreground hover:text-primary"
            >
              ← Back to Home
            </button>
          )}
        </div>
        
        <div className="flex-1 text-center">
          {currentStep !== "landing" && (
            <h1 className="text-2xl font-bold text-primary">
              {calculatorType === "temporary" ? "Can I Quit?" : "Complete Financial Freedom"}
            </h1>
          )}
        </div>
        
        <div className="flex-1 flex justify-end">
          <Button
            onClick={toggleTheme}
            size="icon"
            variant="ghost"
            className="rounded-full w-8 h-8"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <SunIcon /> : <MoonIcon />}
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="h-full">
          {currentStep === "landing" && (
            <LandingPage 
              onStartTemporary={handleStartTemporary} 
              onStartComplete={handleStartComplete} 
            />
          )}
          
          {currentStep === "form" && calculatorType === "temporary" && (
            <FinancialForm 
              onSubmit={handleTemporaryFormSubmit} 
            />
          )}
          
          {currentStep === "form" && calculatorType === "complete" && (
            <FreedomCalculatorForm 
              onSubmit={handleCompleteFormSubmit} 
            />
          )}
          
          {currentStep === "results" && calculatorType === "temporary" && temporaryData && (
            <ResultsDisplay 
              financialData={temporaryData} 
              onAdjust={handleAdjust} 
            />
          )}
          
          {currentStep === "results" && calculatorType === "complete" && completeData && (
            <FreedomCalculatorResults 
              financialData={completeData} 
              onAdjust={handleAdjust} 
            />
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-2 px-4 text-center text-xs text-muted-foreground">
        <p> {new Date().getFullYear()} Can I Quit? - Plan your escape from the 9-to-5 grind.</p>
      </footer>
    </div>
  );
}
