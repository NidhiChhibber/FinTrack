import React, { useEffect, useState } from "react"
import { format } from "date-fns"
import {
  getTransactions,
  deleteTransaction,
  updateTransactionCategory,
} from "../../api/transactionApi"
import { syncTransactions } from "../../api/plaidApi"
import { Transaction } from "@/types/transaction"
import { TransactionsTable } from "../../components/transactions/TransactionsTable"

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [startDate, setStartDate] = useState<string>("")
  const [endDate, setEndDate] = useState<string>("")

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0]
    setStartDate(today)
    setEndDate(today)
    loadTransactions(today, today)
  }, [])

  const loadTransactions = async (start?: string, end?: string) => {
    try {
      const txs = await getTransactions(start, end)
      setTransactions(txs)
    } catch (err) {
      console.error("Failed to load transactions", err)
    }
  }

  const onDelete = async (plaidId: string) => {
    try {
      await deleteTransaction(plaidId)
      setTransactions((prev) => prev.filter((tx) => tx.plaidId !== plaidId))
    } catch (err) {
      console.error("Delete failed", err)
    }
  }

  const onUpdateCategory = async (plaidId: string, newCategory: string) => {
    try {
      await updateTransactionCategory(plaidId, newCategory)
      setTransactions((prev) =>
        prev.map((tx) =>
          tx.plaidId === plaidId ? { ...tx, category: newCategory } : tx
        )
      )
    } catch (err) {
      console.error("Failed to update category", err)
    }
  }

  const onSync = async () => {
    try {
      await syncTransactions("user-id")
      await loadTransactions(startDate, endDate)
    } catch (err) {
      alert("Sync failed")
    }
  }

  return (
    <div className="p-6">
      <TransactionsTable
        transactions={transactions}
        onSync={onSync}
        onFilter={loadTransactions}
        onDelete={onDelete}
        onUpdateCategory={onUpdateCategory}
      />
    </div>
  )
}
