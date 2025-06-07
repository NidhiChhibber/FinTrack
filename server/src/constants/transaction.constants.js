import { TransactionType } from '../enums/index.js';

export const TRANSACTION_CONSTANTS = Object.freeze({
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 50,
    MAX_PAGE_SIZE: 1000,
    MIN_PAGE_SIZE: 1
  },
  
  CLASSIFICATION: {
    DEFAULT_CONFIDENCE: 0.8,
    HIGH_CONFIDENCE_THRESHOLD: 0.9,
    LOW_CONFIDENCE_THRESHOLD: 0.5
  },
  
  SYNC: {
    MAX_TRANSACTIONS_PER_REQUEST: 500,
    DEFAULT_START_DATE: '2020-01-01',
    RETRY_ATTEMPTS: 3,
    RETRY_DELAY_MS: 1000,
    BATCH_SIZE: 100
  },
  
  CATEGORIES: {
    DEFAULT: 'Uncategorized',
    INCOME: [
      'Salary', 'Freelance', 'Investment Income', 
      'Business Income', 'Government Benefits', 'Other Income'
    ],
    EXPENSE: [
      'Groceries', 'Gas', 'Restaurants', 'Utilities', 'Rent',
      'Insurance', 'Healthcare', 'Entertainment', 'Shopping',
      'Travel', 'Education', 'Personal Care'
    ]
  },
  
  VALIDATION: {
    MAX_AMOUNT: 1000000,
    MIN_AMOUNT: -1000000,
    MAX_NAME_LENGTH: 255,
    MAX_DESCRIPTION_LENGTH: 500
  }
});