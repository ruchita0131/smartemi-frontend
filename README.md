# SmartEMI Planner — Frontend Dashboard

SmartEMI is an AI-powered personal finance and debt optimization web application built with React 19, Tailwind CSS v4, and Recharts. It connects to a multi-agent LangGraph execution pipeline to analyze user loans, calculate Debt-to-Income (DTI) metrics, simulate prepayment scenarios, and render personalized financial advice.

---

## Live Links

- **Live Web Application:** https://ruchita0131.github.io/smartemi-frontend/
- **Backend OpenAPI Documentation:** https://smartemi-api.onrender.com/docs

---

## Key Features

1. **Recruiter Demo Mode:** Instant, zero-latency access with pre-configured loan profiles (Home, Personal, Car loans) and simulated LangGraph agent pipeline execution without requiring backend cold-start delays.
2. **Real-Time Financial Dashboard:** Calculates Debt-to-Income (DTI) health indicators, disposable cash flow, active EMI burdens, and categorized expenses.
3. **LangGraph 5-Agent Execution Visualizer:** Step-by-step animated visual representation of multi-agent analysis (Data Normalizer, DTI Evaluator, Strategy Comparator, Timeline Forecast, Gemini AI Consultant).
4. **Interactive Prepayment Simulator:** Real-time EMI acceleration calculator evaluating the Debt Avalanche (highest interest rate first) versus Debt Snowball (lowest balance first) strategies.
5. **Context-Aware AI Financial Advisor:** Floating chat widget providing tailored guidance based on the user's active loan and expense profile.

---

## Tech Stack

- **Framework:** React 19 + Vite 7
- **Styling:** Tailwind CSS v4
- **Routing:** React Router v7 (HashRouter for static hosting resilience)
- **Charts:** Recharts
- **HTTP Client:** Axios with JWT request interceptors
- **Icons:** Lucide React

---

## Project Structure

```
smartemi-frontend/
├── src/
│   ├── App.jsx                  # HashRouter configuration and routes
│   ├── api/
│   │   └── client.js            # Axios client with JWT interceptor
│   ├── context/
│   │   ├── AuthContext.jsx      # Global session and demo state
│   │   └── ThemeContext.jsx     # Dark/light mode theme provider
│   ├── data/
│   │   └── demoData.js          # Demo mode dataset (Loans, Expenses, LangGraph Output)
│   ├── pages/
│   │   ├── LoginPage.jsx        # Auth landing with Demo Mode CTA
│   │   ├── DashboardPage.jsx    # DTI summary, loan & expense manager
│   │   ├── AnalysisPage.jsx     # LangGraph 5-agent pipeline visualizer
│   │   └── ScenariosPage.jsx    # Interactive EMI acceleration simulator
│   └── components/
│       ├── Navbar.jsx           # Top navigation bar
│       ├── AgentGraph.jsx       # LangGraph agent step visualizer
│       └── ChatWidget.jsx       # Floating AI chat assistant
└── package.json
```

---

## Getting Started

### Prerequisites
- Node.js 20+
- npm 10+

### Local Setup
```bash
git clone https://github.com/ruchita0131/smartemi-frontend.git
cd smartemi-frontend
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## Deployment

Published to GitHub Pages via automated build:
```bash
npm run build
npx gh-pages -d dist
```

---

## License

Distributed under the MIT License. See `LICENSE` for details.