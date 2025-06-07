import { PlaidEnvironment } from '../enums/index.js';

export const PLAID_CONSTANTS = Object.freeze({
  ENVIRONMENTS: PlaidEnvironment,
  
  CONFIG: {
    PRODUCTS: ['transactions', 'auth', 'identity'],
    COUNTRY_CODES: ['US'],
    LANGUAGE: 'en',
    CLIENT_NAME: 'FinTrack'
  },
  
  SANDBOX_INSTITUTIONS: {
    PLATYPUS_BANK: 'ins_109508',
    FIRST_PLATYPUS_BANK: 'ins_109509',
    TATTERSALL_FCU: 'ins_109510'
  },
  
  SYNC: {
    INITIAL_FETCH_DAYS: 730, // 2 years
    MAX_TRANSACTIONS_PER_SYNC: 500,
    RETRY_ATTEMPTS: 3,
    RETRY_DELAY_MS: 2000
  },
  
  ERRORS: {
    ITEM_LOGIN_REQUIRED: 'ITEM_LOGIN_REQUIRED',
    INSUFFICIENT_CREDENTIALS: 'INSUFFICIENT_CREDENTIALS',
    INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
    RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED'
  }
});

// src/constants/api.constants.js
export const API_CONSTANTS = Object.freeze({
  RESPONSE_CODES: {
    SUCCESS: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    INTERNAL_SERVER_ERROR: 500,
    SERVICE_UNAVAILABLE: 503
  },
  
  HEADERS: {
    CONTENT_TYPE: 'Content-Type',
    AUTHORIZATION: 'Authorization',
    CORRELATION_ID: 'X-Correlation-ID'
  },
  
  CONTENT_TYPES: {
    JSON: 'application/json',
    FORM_DATA: 'multipart/form-data'
  }
});