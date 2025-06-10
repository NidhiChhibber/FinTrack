# 💸 FinTrack - Personal Finance Tracker

FinTrack is a full-stack personal finance tracker built with **React**, **Node.js**, **SQLite**, and **Plaid**. It allows users to link bank accounts, track income and expenses, categorize transactions (with AI-assisted predictions), and monitor net worth — all in a beautiful, secure, and extensible app.

## 🚀 Features

* 🔐 JWT-based authentication with refresh-safe session
* 🏦 Plaid integration for live bank and transaction data
* 📊 Dashboard with net worth, account balances, and category breakdown
* 🧠 ML-powered transaction categorization with feedback loop
* 🗕️ Advanced transaction filtering (date, category, amount, account, etc.)
* 💾 SQLite database with Sequelize ORM
* 🌙 Theme support via context (dark/light/system)
* ⚙️ Clean modular codebase and reusable hooks
* 🧪 React Query for API caching and devtools

## 🧱 Tech Stack

* **Frontend**: React + TypeScript + Tailwind + ShadCN UI
* **Backend**: Node.js + Express + SQLite + Sequelize
* **Auth**: JWT + React Context
* **Banking API**: Plaid
* **ML Layer**: Python (invoked from Node using `child_process`)
* **Tooling**: Vite, React Query Devtools, VSCode

## 📁 Project Structure

```
client/
🔺🔊 components/         # UI components
🔺🔊 context/            # Theme, Auth, App providers
🔺🔊 hooks/              # Custom React hooks
🔺🔊 pages/              # Dashboard, Transactions, etc.
🔺🔊 services/api/       # API interaction modules
🔺🔊 styles/             # Tailwind + globals
🔺🔊 App.tsx             # Main app entry

server/
🔺🔊 models/             # Sequelize models
🔺🔊 routes/             # Auth, transactions, plaid APIs
🔺🔊 ml/                 # Python ML script
🔺🔊 server.js           # Express server entry
```

## 🧲 Running Locally

### Prerequisites

* Node.js ≥ 18
* Python ≥ 3.8
* SQLite installed (or use file-based DB)
* Plaid developer (sandbox) credentials

### Setup

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/fintrack.git
cd fintrack
```

2. **Install and run the backend**

```bash
cd server
npm install
npm run dev
```

3. **Install and run the frontend**

```bash
cd ../client
npm install
npm run dev
```

4. **Environment Variables**

Create a `.env` file in `/server`:

```env
#Plaid
PLAID_CLIENT_ID=
PLAID_SECRET=
PLAID_ENV=sandbox


# Authentication
JWT_SECRET=
SESSION_SECRET=
CLIENT_URL=http://localhost:5173

# Google OAuth
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

## 🔒 Auth Flow

* On login/register, user receives a JWT token (saved in `localStorage`)
* App restores auth state on page refresh using `AuthProvider` and `/api/auth/verify`
* Protected routes use `ProtectedRoute` wrapper to redirect unauthorized users to `/login`

## 🧠 Machine Learning (Auto Categorization)

* New transactions are categorized using a Python script
* Users can manually update predicted categories
* Feedback is stored and can later be used to improve the model
* Node runs Python using `child_process.exec()`

## 🔌 API Endpoints

| Method | Endpoint                            | Description                       |
| ------ | ----------------------------------- | --------------------------------- |
| POST   | `/api/auth/register`                | Register a new user               |
| POST   | `/api/auth/login`                   | Log in and receive a token        |
| GET    | `/api/auth/verify`                  | Validate token and get user info  |
| GET    | `/api/transactions`                 | Fetch user transactions (filters) |
| PUT    | `/api/transactions/by-plaid-id/:id` | Update transaction category       |
| POST   | `/api/plaid/sync_transactions`      | Sync latest bank transactions     |
| GET    | `/api/plaid/accounts/:userId`       | Get linked Plaid accounts         |

## 🚣️ Sample Hook Usage

```ts
const { data: transactions } = useTransactionsByDateRange(
  "2024-06-01",
  "2025-06-08",
  user.id
);
```

## ✅ Roadmap

* [x] Plaid bank linking and account sync
* [x] Transaction filtering by all parameters
* [x] ML-based auto categorization
* [x] Category feedback and correction
* [ ] Monthly budgeting module
* [ ] Recurring transaction detection
* [ ] PDF/CSV export
* [ ] PWA/mobile support
* [ ] Cloud DB support (PostgreSQL/Supabase)

## Screenshots 
<img width="1511" alt="Screenshot 2025-06-08 at 11 20 08 PM" src="https://github.com/user-attachments/assets/90535073-8c47-431d-8212-181d8a784b03" />
<img width="1511" alt="Screenshot 2025-06-08 at 10 35 34 PM" src="https://github.com/user-attachments/assets/65a7c0c7-604a-4d0b-9f4f-509a6529692f" />
<img width="1512" alt="Screenshot 2025-06-08 at 10 35 04 PM" src="https://github.com/user-attachments/assets/50036b0f-d690-4d0c-abad-fa10939837ec" />
<img width="1075" alt="Screenshot 2025-06-08 at 10 35 12 PM" src="https://github.com/user-attachments/assets/05a2aafd-c261-45cd-a9f8-81a7dab23f2b" />

## 👤 Author

Built with by Divy Nidhi Chhibber

> Empowering people to take control of their financial lives.
