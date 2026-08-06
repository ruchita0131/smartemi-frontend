export const DEMO_SUMMARY = {
  monthly_income: 150000,
  total_emi: 61678,
  total_expenses: 63000,
  disposable_income: 25322,
  expenses: [
    { id: 101, category: 'Rent & Housing', amount: 30000 },
    { id: 102, category: 'Groceries & Supplies', amount: 15000 },
    { id: 103, category: 'Utilities & Internet', amount: 8000 },
    { id: 104, category: 'Lifestyle & Shopping', amount: 10000 }
  ],
  loans: [
    { id: 201, loan_type: 'personal', principal: 300000, interest_rate: 13.5, tenure_months: 36, emi: 10183 },
    { id: 202, loan_type: 'car', principal: 600000, interest_rate: 9.0, tenure_months: 60, emi: 12455 },
    { id: 203, loan_type: 'home', principal: 4500000, interest_rate: 8.5, tenure_months: 240, emi: 39040 }
  ]
};

export const DEMO_ANALYSIS = {
  analysis: {
    health_score: 68,
    health_label: 'Moderate Risk',
    dti_ratio: 41.1,
    monthly_surplus: 25322
  },
  strategy: {
    recommended_method: 'avalanche',
    avalanche: {
      total_interest: 218450,
      months_to_payoff: 46
    },
    snowball: {
      total_interest: 261250,
      months_to_payoff: 48
    }
  },
  forecast: {
    projections: [
      { loan_type: 'personal', closure_date: 'October 2027', total_interest_remaining: 66588, months_remaining: 14 },
      { loan_type: 'car', closure_date: 'August 2029', total_interest_remaining: 147300, months_remaining: 36 },
      { loan_type: 'home', closure_date: 'August 2046', total_interest_remaining: 4869600, months_remaining: 240 }
    ]
  },
  advice: `SmartEMI AI Financial Strategy Assessment:

1. Debt-to-Income (DTI) Analysis:
Your current DTI ratio sits at 41.1%, placing your profile in the Moderate Risk tier. Over 40% of your net monthly earnings (₹61,678) are allocated directly toward debt servicing.

2. Recommended Repayment Acceleration:
We strongly recommend adopting the Debt Avalanche Strategy. Prioritize paying off your Personal Loan (₹300,000 @ 13.5% interest) first by deploying ₹10,000 of your ₹25,322 monthly disposable income toward its principal.

3. Projected Financial Savings:
By targeting the Personal Loan, you will eliminate it in just 14 months instead of 36 months, saving ₹42,800 in uncalculated interest payments and releasing ₹10,183/month back into your disposable cash flow.`
};

export const DEMO_CHAT_RESPONSES = [
  "Based on your profile, allocating ₹10,000 of your ₹25,322 disposable income toward your 13.5% Personal Loan will save you ₹42,800 in total interest!",
  "Your current Debt-to-Income ratio is 41.1%. Paying off your Personal Loan will drop your DTI to a healthy 34.3%.",
  "Your Home Loan has an 8.5% interest rate over 20 years. Making just one extra EMI payment every year can shorten your tenure by 4 years!",
  "I recommend keeping at least ₹50,000 as an emergency liquidity fund before making aggressive lump-sum prepayments."
];
