// models/plaid-account.js
export default (sequelize, DataTypes) => {
  return sequelize.define(
    'plaid_account',
    {
      account_id: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        comment: 'Plaid account ID'
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      official_name: DataTypes.STRING,
      type: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: 'Original Plaid account type'
      },
      subtype: DataTypes.STRING,
      
      // Our enhanced account types
      account_type: {
        type: DataTypes.ENUM,
        values: ['checking', 'savings', 'credit', 'investment', 'loan'],
        allowNull: false
      },
      account_subtype: DataTypes.STRING,
      
      // Balance information
      balance: {
        type: DataTypes.DECIMAL(12, 2),
        defaultValue: 0
      },
      available_balance: DataTypes.DECIMAL(12, 2),
      credit_limit: DataTypes.DECIMAL(12, 2),
      balance_last_updated: DataTypes.DATE,
      
      // Display preferences
      display_name: DataTypes.STRING,
      color: DataTypes.STRING,
      is_hidden: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      
      // Status
      is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      },
      deactivated_at: DataTypes.DATE,
      
      // Foreign key
      plaid_item_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'plaid_items',
          key: 'id',
        },
      },
    },
    {
      tableName: 'plaid_accounts',
      timestamps: true,
    }
  );
};