export class AccountMapper {
  /**
   * Convert database model to DTO
   * @param {Object} account - Database account model
   * @returns {Object} Account DTO with camelCase fields
   */
  static toDTO(account) {
    if (!account) return null;

    return {
      id: account.id,
      accountId: account.account_id,
      name: account.name,
      officialName: account.official_name,
      type: account.type,
      subtype: account.subtype,
      accountType: account.account_type,
      accountSubtype: account.account_subtype,
      balance: account.balance,
      availableBalance: account.available_balance,
      creditLimit: account.credit_limit,
      balanceLastUpdated: account.balance_last_updated,
      displayName: account.display_name,
      color: account.color,
      isHidden: account.is_hidden,
      isActive: account.is_active,
      deactivatedAt: account.deactivated_at,
      plaidItemId: account.plaid_item_id,
      createdAt: account.createdAt,
      updatedAt: account.updatedAt
    };
  }

  /**
   * Convert array of models to DTOs
   * @param {Array} accounts - Array of account models
   * @returns {Array} Array of account DTOs
   */
  static toDTOArray(accounts) {
    if (!Array.isArray(accounts)) return [];
    return accounts.map(account => this.toDTO(account));
  }
}