import { Sequelize, DataTypes } from 'sequelize';
import TransactionModel from './transaction.js';
import PlaidAccountModel from './plaid-account.js';
import PlaidItemModel from './plaid-item.js'; 

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite',
  logging: false, // optional: disable SQL logging
});

// Define models
const Transaction = TransactionModel(sequelize, DataTypes);
const PlaidAccount = PlaidAccountModel(sequelize, DataTypes);
const PlaidItem = PlaidItemModel(sequelize, DataTypes); // define this too

// Set up relationships
PlaidAccount.hasMany(Transaction, { foreignKey: 'account_id' });
Transaction.belongsTo(PlaidAccount, { foreignKey: 'account_id' });

PlaidItem.hasMany(PlaidAccount, { foreignKey: 'plaid_item_id' });
PlaidAccount.belongsTo(PlaidItem, { foreignKey: 'plaid_item_id' });

// Final model export
const db = {
  sequelize,
  Sequelize,
  Transaction,
  PlaidAccount,
  PlaidItem
};

export default db;
export { sequelize };