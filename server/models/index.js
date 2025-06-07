// models/index.js
import { Sequelize } from 'sequelize';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize Sequelize
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: process.env.DB_PATH || join(__dirname, '..', 'database.sqlite'),
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  define: {
    underscored: true,
    freezeTableName: true,
  },
});

const db = {};

// Import models
const modelFiles = [
  'transaction.js',
  'plaid-account.js',
  'plaid-item.js'
];

// Load all models
for (const file of modelFiles) {
  const modelPath = join(__dirname, file);
  if (fs.existsSync(modelPath)) {
    const { default: model } = await import(modelPath);
    const modelInstance = model(sequelize, Sequelize.DataTypes);
    const modelName = modelInstance.name;
    db[modelName] = modelInstance;
  }
}

// Define model associations
if (db.plaid_item && db.plaid_account) {
  // PlaidItem has many PlaidAccounts
  db.plaid_item.hasMany(db.plaid_account, {
    foreignKey: 'plaid_item_id',
    as: 'accounts'
  });
  
  // PlaidAccount belongs to PlaidItem
  db.plaid_account.belongsTo(db.plaid_item, {
    foreignKey: 'plaid_item_id'
  });
}

if (db.plaid_account && db.transaction) {
  // PlaidAccount has many Transactions
  db.plaid_account.hasMany(db.transaction, {
    foreignKey: 'plaid_account_id',
    as: 'transactions'
  });
  
  // Transaction belongs to PlaidAccount
  db.transaction.belongsTo(db.plaid_account, {
    foreignKey: 'plaid_account_id',
    as: 'Account'
  });
}

if (db.plaid_item && db.transaction) {
  // PlaidItem has many Transactions (through accounts)
  db.plaid_item.hasMany(db.transaction, {
    foreignKey: 'plaid_item_id',
    as: 'transactions'
  });
  
  // Transaction belongs to PlaidItem
  db.transaction.belongsTo(db.plaid_item, {
    foreignKey: 'plaid_item_id'
  });
}

// Add Sequelize instance and constructor to db object
db.sequelize = sequelize;
db.Sequelize = Sequelize;

// Create aliases for easier access (matching our repository names)
db.Transaction = db.transaction;
db.PlaidAccount = db.plaid_account;
db.PlaidItem = db.plaid_item;

export default db;