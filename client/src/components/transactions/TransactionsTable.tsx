import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "../../components/ui/card"
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "../../components/ui/table"
import { Button } from "../../components/ui/button"
import { format } from "date-fns"
import { useState } from "react"
import { Badge } from "../ui/badge"
import {CATEGORIES, CATEGORY_COLORS} from "../../constants/categories"

export function TransactionsTable({
  transactions,
  onSync,
  onFilter,
  onDelete,
  onUpdateCategory,
}: {
  transactions: any[]
  onSync: () => void
  onFilter: (start?: string, end?: string) => void
  onDelete: (id: string) => void
  onUpdateCategory: (id: string, cat: string) => void
}) {
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [page, setPage] = useState(1)
  const pageSize = 10
  const [editingId, setEditingId] = useState<string | null>(null)


  


  const paginatedTxs = transactions.slice(
    (page - 1) * pageSize,
    page * pageSize
  )

  return (
    <Card>
      <CardHeader>
            <div className="flex justify-between items-center flex-wrap gap-4">
            <h2 className="text-lg font-semibold">Transactions</h2>
            <Button onClick={onSync}>Sync from Bank</Button>
            </div>
        </CardHeader>

      <CardContent>
    <div className="flex flex-wrap gap-4 items-end">
      <div className="flex flex-col">
        <label className="text-sm text-muted-foreground">Start</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="bg-muted text-foreground border border-border rounded-md px-3 py-1.5 text-sm shadow-sm"
        />
      </div>
      <div className="flex flex-col">
        <label className="text-sm text-muted-foreground">End</label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="bg-muted text-foreground border border-border rounded-md px-3 py-1.5 text-sm shadow-sm"
        />
      </div>
      <div className="flex gap-2">
        <Button onClick={() => onFilter(startDate, endDate)}>Apply</Button>
        <Button variant="secondary" onClick={() => onFilter()}>Reset</Button>
      </div>
    </div>
  </CardContent>

      <CardContent className="pt-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Description</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedTxs.map((tx) => (
              <TableRow key={tx.plaidId}>
                <TableCell>{tx.name}</TableCell>
                <TableCell className={tx.amount >= 0 ? "text-green-400" : "text-red-400"}>
                  ${tx.amount.toFixed(2)}
                </TableCell>
                <TableCell>{format(new Date(tx.date), "MMM d, yyyy")}</TableCell>
                <TableCell>
                    {editingId === tx.plaidId ? (
                        <select
                        value={tx.category}
                        onChange={(e) => {
                            onUpdateCategory(tx.plaidId, e.target.value)
                            setEditingId(null)
                        }}
                        onBlur={() => setEditingId(null)}
                        autoFocus
                        className={`bg-muted text-foreground border border-border rounded-md px-2 py-1 text-sm ${CATEGORY_COLORS[tx.category ?? "Uncategorized"]}`}
                        >
                        {CATEGORIES.map((cat) => (
                            <option key={cat} value={cat}>
                            {cat}
                            </option>
                        ))}
                        </select>
                    ) : (
                        <Badge
                        variant="outline"
                        className={`cursor-pointer ${CATEGORY_COLORS[tx.category ?? "Uncategorized"]}`}
                        onClick={() => setEditingId(tx.plaidId)}
                        >
                        {tx.category || "Uncategorized"}
                        </Badge>
                    )}
                    </TableCell>

                <TableCell className="text-right">
                  <Button size="sm" variant="destructive" onClick={() => onDelete(tx.plaidId)}>
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>

      <CardFooter className="justify-between">
        <span className="text-sm text-muted-foreground">
          Page {page} of {Math.ceil(transactions.length / pageSize)}
        </span>
        <div className="space-x-2">
          <Button size="sm" variant="outline" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
            Previous
          </Button>
          <Button
            size="sm"
            variant="outline"
            disabled={page * pageSize >= transactions.length}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
