"use client";

import { useState } from "react";
import { LandingPage } from "@/components/landing-page";
import { FinancialForm, type FinancialFormValues } from "@/components/financial-form";
import { ResultsDisplay } from "@/components/results-display";

export default function Home() {
  const [currentStep, setCurrentStep] = useState<"landing" | "form" | "results">("landing");
  const [financialData, setFinancialData] = useState<FinancialFormValues | null>(null);

  const handleGetStarted = () => {
    setCurrentStep("form");
  };

  const handleFormSubmit = (data: FinancialFormValues) => {
    setFinancialData(data);
    setCurrentStep("results");
    
    // Save to localStorage for persistence
    localStorage.setItem("financialData", JSON.stringify(data));
  };

  const handleAdjust = () => {
    setCurrentStep("form");
  };

  return (
    <div className="min-h-screen p-4 md:p-8 flex flex-col">
      <header className="py-4 mb-6">
        <h1 className="text-3xl font-bold text-center text-primary">
          {currentStep === "landing" ? "" : "Can I Quit?"}
        </h1>
      </header>

      <main className="flex-1 flex items-center justify-center">
        {currentStep === "landing" && (
          <LandingPage onGetStarted={handleGetStarted} />
        )}
        
        {currentStep === "form" && (
          <FinancialForm 
            onSubmit={handleFormSubmit} 
          />
        )}
        
        {currentStep === "results" && financialData && (
          <ResultsDisplay 
            financialData={financialData} 
            onAdjust={handleAdjust} 
          />
        )}
      </main>

      <footer className="py-4 mt-8 text-center text-sm text-muted-foreground">
        <p> {new Date().getFullYear()} Can I Quit? - Plan your escape from the 9-to-5 grind.</p>
      </footer>
    </div>
  );
}
