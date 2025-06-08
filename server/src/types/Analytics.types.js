/**
 * @typedef {Object} TransactionSummary
 * @property {number} totalIncome - Total income amount
 * @property {number} totalExpenses - Total expense amount
 * @property {number} netIncome - Net income (income - expenses)
 * @property {number} transactionCount - Total transaction count
 * @property {number} checkingBalance - Total checking balance
 * @property {number} savingsBalance - Total savings balance
 * @property {number} creditCardDebt - Total credit card debt
 * @property {number} investmentValue - Total investment value
 * @property {CategoryBreakdown[]} categoryBreakdown - Spending by category
 * @property {MonthlyTrend[]} [monthlyTrends] - Monthly spending trends
 * @property {string} periodStart - Analysis period start date
 * @property {string} periodEnd - Analysis period end date
 */

/**
 * @typedef {Object} CategoryBreakdown
 * @property {string} category - Category name
 * @property {number} amount - Total amount for category
 * @property {number} percentage - Percentage of total spending
 * @property {number} transactionCount - Number of transactions
 * @property {number} averageAmount - Average transaction amount
 * @property {string} [color] - UI color for category
 */

/**
 * @typedef {Object} MonthlyTrend
 * @property {string} month - Month identifier (YYYY-MM)
 * @property {string} monthName - Human readable month name
 * @property {number} income - Income for month
 * @property {number} expenses - Expenses for month
 * @property {number} netIncome - Net income for month
 * @property {number} transactionCount - Transaction count for month
 */

/**
 * @typedef {Object} SpendingTrend
 * @property {string} period - Time period identifier
 * @property {number} amount - Amount for period
 * @property {number} transactionCount - Transaction count
 * @property {number} [previousPeriodAmount] - Previous period amount for comparison
 * @property {number} [changePercent] - Percentage change from previous period
 */