# 💸 FinTrack – Personal Finance Tracker

FinTrack is a full-stack personal finance application that helps users track, categorize, and analyze their spending. It integrates with Plaid to sync transactions from real bank accounts and uses machine learning to auto-categorize them.

---

## 🚀 Features

* 🔄 Sync bank transactions via [Plaid](https://plaid.com/)
* 🧠 ML-based auto-categorization of expenses
* 📝 Manual category editing with feedback loop for model retraining
* 📆 Filter by date range
* 📊 Pagination and sorting
* 🌙 Dark mode with smooth UI using Tailwind + ShadCN
* 📦 Lightweight backend using Express + Sequelize + SQLite

---

## 🧱 Tech Stack

| Frontend     | Backend       | ML             | Other      |
| ------------ | ------------- | -------------- | ---------- |
| React + Vite | Node.js       | Python         | SQLite     |
| Tailwind CSS | Express.js    | scikit-learn   | Plaid API  |
| ShadCN UI    | Sequelize ORM | CSV retraining | TypeScript |

---

## 🛠️ Setup Instructions

### 1. Clone the repo

```bash
git clone https://github.com/YOUR_USERNAME/fintrack.git
cd fintrack
```

### 2. Install dependencies

```bash
# Client
cd client
npm install

# Server
cd ../server
npm install
```

### 3. Set up environment variables

Create a `.env` file in `server/` with your Plaid keys:

```env
PLAID_CLIENT_ID=your_client_id
PLAID_SECRET=your_secret
PLAID_ENV=sandbox
```

---

### 4. Run locally

```bash
# From project root
npm install concurrently

npm run dev
# This will start both client and server
```

---

## 🔁 Machine Learning

* The backend includes an ML pipeline to retrain a classifier using corrected categories.
* Triggers via `/api/ml/retrain-model`
* Uses CSV export of user-edited data → retrains Python model

---

## 📷 Screenshots

| Sync + Table View                 | Editable Categories               |
| --------------------------------- | --------------------------------- |
| ![screenshot1](screenshots/1.png) | ![screenshot2](screenshots/2.png) |

---

## 📌 Roadmap


## 🧑‍💻 Author

Made with ❤️ by Divy

---
