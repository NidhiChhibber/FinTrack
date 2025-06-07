export function toTransactionDto(transaction) {
  return {
    id: transaction.id,
    name: transaction.name,
    amount: transaction.amount,
    date: transaction.date,
    category: transaction.category,
    merchantName: transaction.merchant_name,
    plaidId: transaction.plaid_id,
  };
}