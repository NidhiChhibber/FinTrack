// models/plaid-item.js
export default (sequelize, DataTypes) => {
  return sequelize.define(
    'plaid_item',
    {
      user_id: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: 'User identifier'
      },
      access_token: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        comment: 'Plaid access token'
      },
      item_id: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        comment: 'Plaid item ID'
      },
      institution_name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      
      // Transaction sync management
      cursor: {
        type: DataTypes.STRING,
        comment: 'Plaid sync cursor for transactions'
      },
      last_synced: DataTypes.DATE,
      
      // Error handling
      requires_reauth: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      error_code: DataTypes.STRING,
      error_message: DataTypes.TEXT,
      
      // Status
      is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      },
    },
    {
      tableName: 'plaid_items',
      timestamps: true,
    }
  );
};