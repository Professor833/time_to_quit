# Can I Quit?

A financial freedom calculator that helps you determine how long you can survive without a job based on your savings, expenses, and financial goals.

## App Summary

"Can I Quit?" empowers people with the clarity they need to plan their escape from the 9-to-5 grind — guilt-free and financially sound. The application provides a visual representation of your financial runway and helps you make informed decisions about when you can quit your job.

## Core Features

- **Savings + Expenses Input**: Enter your total savings, monthly expenses, and buffer goal
- **Time-To-Quit Calculation**: See how many months/years you can survive without income
- **Freedom Score**: 0–100 score showing progress toward quitting
- **"What If" Simulations**: Adjust expenses/income/savings to test different scenarios
- **Freedom Date Forecast**: Know when you can realistically quit if you keep saving
- **Minimalist Mode**: See how cutting expenses by 30% affects your freedom timeline
- **Quit Plan Summary**: Monthly graph view showing burn vs save
- **Shareable Milestones**: Share your progress with friends and family

## Getting Started

First, install the dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Tech Stack

- **Next.js + TypeScript**: Fast, SEO-friendly framework for building the application
- **Tailwind CSS**: Utility-first CSS framework for styling
- **shadcn/ui**: Beautiful prebuilt components with modern vibes
- **Framer Motion**: For satisfying micro-animations
- **Recharts**: To show the "burn vs save" graph
- **localStorage**: For data persistence (will be upgraded to a backend if needed)

## User Flow

1. **Landing Page**: Introduction to the app with a "Start Now" CTA
2. **Income & Expense Form**: Input your financial details
3. **Result Page**: View your Freedom Score, months of freedom, and burndown graph
4. **What If Scenarios**: Adjust sliders to see how changes affect your timeline

## Future Enhancements

- User accounts for saving multiple scenarios
- Notifications for reaching financial milestones
- More detailed financial planning tools
- Mobile app version

## License

This project is licensed under the MIT License.
