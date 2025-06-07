// models/transaction.js
export default (sequelize, DataTypes) => {
  return sequelize.define(
    'transaction',
    {
      plaid_id: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      name: DataTypes.STRING,
      amount: DataTypes.FLOAT,
      normalized_amount: {
        type: DataTypes.FLOAT,
        allowNull: false,
        comment: 'Positive for income, negative for expenses'
      },
      date: DataTypes.DATEONLY,
      category: DataTypes.STRING,
      transaction_type: {
        type: DataTypes.ENUM,
        values: ['income', 'expense', 'transfer', 'payment', 'refund', 'fee'],
        allowNull: false,
        defaultValue: 'expense'
      },
      merchant_name: DataTypes.STRING,
      account_type: {
        type: DataTypes.ENUM,
        values: ['checking', 'savings', 'credit', 'investment', 'loan'],
        allowNull: false
      },
      account_subtype: DataTypes.STRING,
      
      // Categorization metadata
      category_corrected: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      category_source: {
        type: DataTypes.ENUM,
        values: ['plaid', 'user', 'ai', 'rule'],
        defaultValue: 'plaid'
      },
      confidence: {
        type: DataTypes.FLOAT,
        defaultValue: 0.8
      },
      
      // Additional fields
      is_recurring: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      is_excluded_from_budget: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      description: DataTypes.TEXT,
      tags: DataTypes.JSON,

      // Foreign keys
      plaid_item_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'plaid_items',
          key: 'id',
        },
      },
      plaid_account_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'plaid_accounts',
          key: 'id',
        },
      },
    },
    {
      tableName: 'transactions',
      timestamps: true, // adds createdAt and updatedAt
    }
  );
};