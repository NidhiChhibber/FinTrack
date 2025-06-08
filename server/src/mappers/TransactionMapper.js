// server/src/mappers/TransactionMapper.js

export class TransactionMapper {
  /**
   * Convert database model to DTO
   * @param {Object} transaction - Database transaction model
   * @returns {Object} Transaction DTO with camelCase fields
   */
  static toDTO(transaction) {
    if (!transaction) return null;

    return {
      id: transaction.id,
      plaidId: transaction.plaid_id,
      name: transaction.name,
      amount: transaction.amount,
      normalizedAmount: transaction.normalized_amount,
      date: transaction.date,
      category: transaction.category,
      merchantName: transaction.merchant_name,
      transactionType: transaction.transaction_type,
      accountType: transaction.account_type,
      accountSubtype: transaction.account_subtype,
      isRecurring: transaction.is_recurring,
      isExcludedFromBudget: transaction.is_excluded_from_budget,
      categoryCorrected: transaction.category_corrected,
      categorySource: transaction.category_source,
      confidence: transaction.confidence,
      description: transaction.description,
      tags: transaction.tags,
      plaidItemId: transaction.plaid_item_id,
      plaidAccountId: transaction.plaid_account_id,
      createdAt: transaction.createdAt,
      updatedAt: transaction.updatedAt,
      // Include related account if available - simplified to avoid circular dependency
      account: transaction.Account ? {
        id: transaction.Account.id,
        name: transaction.Account.name,
        accountType: transaction.Account.account_type,
        accountId: transaction.Account.account_id
      } : null
    };
  }

  /**
   * Convert array of models to DTOs
   * @param {Array} transactions - Array of transaction models
   * @returns {Array} Array of transaction DTOs
   */
  static toDTOArray(transactions) {
    if (!Array.isArray(transactions)) return [];
    return transactions.map(tx => this.toDTO(tx));
  }

  /**
   * Convert DTO create request to database format
   * @param {Object} createRequest - Transaction create request DTO
   * @returns {Object} Database format object
   */
  static fromCreateRequest(createRequest) {
    return {
      name: createRequest.name,
      amount: createRequest.amount,
      normalized_amount: createRequest.normalizedAmount,
      date: createRequest.date,
      category: createRequest.category,
      merchant_name: createRequest.merchantName,
      transaction_type: createRequest.transactionType,
      account_type: createRequest.accountType,
      account_subtype: createRequest.accountSubtype,
      description: createRequest.description,
      tags: createRequest.tags,
      plaid_account_id: createRequest.plaidAccountId,
      plaid_item_id: createRequest.plaidItemId,
      is_recurring: createRequest.isRecurring || false,
      is_excluded_from_budget: createRequest.isExcludedFromBudget || false
    };
  }

  /**
   * Convert DTO update request to database format
   * @param {Object} updateRequest - Transaction update request DTO
   * @returns {Object} Database format object
   */
  static fromUpdateRequest(updateRequest) {
    const dbData = {};
    
    if (updateRequest.category !== undefined) dbData.category = updateRequest.category;
    if (updateRequest.transactionType !== undefined) dbData.transaction_type = updateRequest.transactionType;
    if (updateRequest.description !== undefined) dbData.description = updateRequest.description;
    if (updateRequest.tags !== undefined) dbData.tags = updateRequest.tags;
    if (updateRequest.isExcludedFromBudget !== undefined) dbData.is_excluded_from_budget = updateRequest.isExcludedFromBudget;
    if (updateRequest.merchantName !== undefined) dbData.merchant_name = updateRequest.merchantName;
    
    return dbData;
  }
}