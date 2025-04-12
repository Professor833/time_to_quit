// Custom analytics events for tracking user interactions

// Track page views
export function trackPageView(url: string) {
  if (typeof window !== 'undefined') {
    try {
      // This will be captured by Vercel Analytics automatically
      console.log(`[Analytics] Page view: ${url}`);
      
      // You can add additional custom tracking here
      // Example: If you want to use Google Analytics or another service
    } catch (error) {
      console.error('[Analytics] Error tracking page view:', error);
    }
  }
}

// Track calculator usage
export function trackCalculatorUse(calculatorType: 'temporary' | 'complete', inputData?: Record<string, unknown>) {
  if (typeof window !== 'undefined') {
    try {
      const eventName = 'calculator_use';
      const properties = {
        calculator_type: calculatorType,
        ...inputData
      };
      
      // Log the event for debugging
      console.log(`[Analytics] ${eventName}:`, properties);
      
      // Send to Vercel Analytics via custom events
      // This requires Vercel Web Analytics
      if (window.va) {
        window.va('event', {
          name: eventName,
          ...properties
        });
      }
    } catch (error) {
      console.error('[Analytics] Error tracking calculator use:', error);
    }
  }
}

// Track results viewed
export function trackResultsViewed(calculatorType: 'temporary' | 'complete', results: Record<string, unknown>) {
  if (typeof window !== 'undefined') {
    try {
      const eventName = 'results_viewed';
      const properties = {
        calculator_type: calculatorType,
        freedom_score: results.freedomScore || results.yearsToFreedom,
        // Don't include sensitive financial data
      };
      
      console.log(`[Analytics] ${eventName}:`, properties);
      
      if (window.va) {
        window.va('event', {
          name: eventName,
          ...properties
        });
      }
    } catch (error) {
      console.error('[Analytics] Error tracking results viewed:', error);
    }
  }
}

// Track what-if scenario usage
export function trackWhatIfScenario(adjustmentType: string, oldValue: number, newValue: number) {
  if (typeof window !== 'undefined') {
    try {
      const eventName = 'what_if_scenario';
      const properties = {
        adjustment_type: adjustmentType,
        percentage_change: Math.round(((newValue - oldValue) / oldValue) * 100)
      };
      
      console.log(`[Analytics] ${eventName}:`, properties);
      
      if (window.va) {
        window.va('event', {
          name: eventName,
          ...properties
        });
      }
    } catch (error) {
      console.error('[Analytics] Error tracking what-if scenario:', error);
    }
  }
}

// Add type definition for window.va
declare global {
  interface Window {
    va?: (event: 'beforeSend' | 'event' | 'pageview', properties?: unknown) => void;
  }
}
