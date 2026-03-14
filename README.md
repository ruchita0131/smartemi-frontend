# SmartEMI Planner — Frontend

A React dashboard for AI-powered personal loan optimization.

## Live Links

- Application: https://smartemi-frontend.vercel.app
- Backend API: https://smartemi-api.onrender.com/docs

## Demo Account

| Field    | Value             |
|----------|-------------------|
| Email    | demo@smartemi.in  |
| Password | demo1234          |

---

## Features

**Dashboard**
Real-time financial overview with income, total EMI, expenses, and disposable income. Includes a Debt-to-Income ratio health indicator that color-codes the user's financial situation.

**AI Analysis**
Animated visualization of the LangGraph pipeline. Each of the 5 agents lights up in sequence as the pipeline runs. Results include financial health score, Avalanche vs Snowball strategy comparison, loan closure projections, and a Gemini AI report with personalized advice.

**Scenario Simulator**
Interactive slider to simulate extra monthly payments. Shows side-by-side comparison of original vs accelerated repayment timeline, including months saved and total interest saved.

**AI Chat**
Floating chat widget on every page. The AI has full access to the user's financial profile and answers questions with specific rupee amounts. Persists conversation history within the session.

**Dark Mode**
System-aware dark and light mode toggle. Preference is saved to localStorage and persists across sessions.

**Profile Dropdown**
Navbar displays user initials as an avatar. Clicking opens a dropdown with name, email, and account details.

---

## Tech Stack

| Layer       | Technology                            |
|-------------|---------------------------------------|
| Framework   | React 19 with Vite                    |
| Styling     | Tailwind CSS v4                       |
| Routing     | React Router v6                       |
| HTTP Client | Axios with JWT interceptors           |
| Icons       | Lucide React                          |
| Charts      | Recharts                              |
| Deployment  | Vercel                                |

---

## Running Locally
```bash
git clone https://github.com/ruchita0131/smartemi-frontend
cd smartemi-frontend
npm install
cp .env.example .env.local
# Set VITE_API_URL in .env.local
npm run dev
```

## Environment Variables
```
VITE_API_URL=https://smartemi-api.onrender.com
```

---

## Project Structure
```
smartemi-frontend/
├── src/
│   ├── App.jsx                  # Routes and app shell
│   ├── api/
│   │   └── client.js            # Axios instance with auth interceptor
│   ├── context/
│   │   ├── AuthContext.jsx      # Global authentication state
│   │   └── ThemeContext.jsx     # Dark/light mode state
│   ├── pages/
│   │   ├── LoginPage.jsx
│   │   ├── SignupPage.jsx
│   │   ├── DashboardPage.jsx
│   │   ├── AnalysisPage.jsx
│   │   └── ScenariosPage.jsx
│   └── components/
│       ├── Navbar.jsx           # Navigation with profile dropdown
│       ├── SummaryCard.jsx      # Financial metric card
│       ├── AgentGraph.jsx       # LangGraph pipeline visualization
│       ├── AddLoanModal.jsx     # Modal form for adding loans
│       ├── AddExpenseModal.jsx  # Modal form for adding expenses
│       └── ChatWidget.jsx       # Floating AI chat interface
├── .env.example
└── package.json
```

---

## Deployment

Frontend is deployed on Vercel with automatic deployments on push to main.
```bash
npx vercel --prod
```