import sequelize from '../database.js';
import PlaidAccount from '../models/plaid-account.js';
import Transaction from '../models/transaction.js';

async function runMigrations() {
  try {
    await sequelize.authenticate();
    console.log('DB connected');

    await sequelize.sync(); // Creates tables if needed
    console.log('Tables synced');
  } catch (err) {
    console.error('Migration failed ', err);
  }
}

runMigrations();
