export class PlaidItemMapper {
  /**
   * Convert database model to DTO
   * @param {Object} plaidItem - Database plaid item model
   * @returns {Object} Plaid item DTO with camelCase fields
   */
  static toDTO(plaidItem) {
    if (!plaidItem) return null;

    return {
      id: plaidItem.id,
      userId: plaidItem.user_id,
      accessToken: plaidItem.access_token, // Keep for internal use only
      itemId: plaidItem.item_id,
      institutionName: plaidItem.institution_name,
      cursor: plaidItem.cursor,
      lastSynced: plaidItem.last_synced,
      requiresReauth: plaidItem.requires_reauth,
      errorCode: plaidItem.error_code,
      errorMessage: plaidItem.error_message,
      isActive: plaidItem.is_active,
      createdAt: plaidItem.createdAt,
      updatedAt: plaidItem.updatedAt
    };
  }

  /**
   * Convert to safe DTO (without sensitive fields)
   * @param {Object} plaidItem - Database plaid item model
   * @returns {Object} Safe plaid item DTO
   */
  static toSafeDTO(plaidItem) {
    const dto = this.toDTO(plaidItem);
    if (dto) {
      delete dto.accessToken; // Remove sensitive data
    }
    return dto;
  }
}