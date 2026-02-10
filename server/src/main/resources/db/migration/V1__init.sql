-- Initial schema for FinTrack (Java backend)

create table if not exists users (
  id bigserial primary key,
  auth0_id varchar(255) unique,
  username varchar(255) unique,
  email varchar(255) unique,
  name varchar(255),
  avatar varchar(1024),
  created_at timestamptz,
  updated_at timestamptz
);

create unique index if not exists idx_users_auth0_id on users(auth0_id);

create table if not exists plaid_items (
  id bigserial primary key,
  user_id varchar(64) not null,
  item_id varchar(255),
  access_token text,
  institution_id varchar(255),
  institution_name varchar(255),
  cursor text,
  last_synced timestamptz,
  requires_reauth boolean default false,
  error_code varchar(255),
  error_message text,
  is_active boolean default true,
  created_at timestamptz,
  updated_at timestamptz
);

create index if not exists idx_plaid_items_user_id on plaid_items(user_id);
create unique index if not exists idx_plaid_items_item_id on plaid_items(item_id);

create table if not exists accounts (
  id bigserial primary key,
  user_id varchar(64),
  account_id varchar(255),
  name varchar(255),
  official_name varchar(255),
  type varchar(255),
  subtype varchar(255),
  account_type varchar(255),
  account_subtype varchar(255),
  balance double precision default 0,
  available_balance double precision,
  credit_limit double precision,
  balance_last_updated timestamptz,
  display_name varchar(255),
  color varchar(64),
  is_hidden boolean default false,
  is_active boolean default true,
  deactivated_at timestamptz,
  plaid_item_id bigint,
  created_at timestamptz,
  updated_at timestamptz
);

create index if not exists idx_accounts_user_id on accounts(user_id);
create unique index if not exists idx_accounts_account_id on accounts(account_id);

create table if not exists transactions (
  id bigserial primary key,
  user_id varchar(64),
  plaid_id varchar(255),
  name varchar(1024),
  amount double precision default 0,
  normalized_amount double precision,
  date date,
  category varchar(255),
  merchant_name varchar(255),
  transaction_type varchar(64),
  account_type varchar(64),
  account_subtype varchar(255),
  is_recurring boolean default false,
  is_excluded_from_budget boolean default false,
  category_corrected boolean default false,
  category_source varchar(64),
  confidence double precision,
  description text,
  plaid_item_id bigint,
  plaid_account_id bigint,
  created_at timestamptz,
  updated_at timestamptz
);

create index if not exists idx_transactions_user_id on transactions(user_id);
create unique index if not exists idx_transactions_plaid_id on transactions(plaid_id);

create table if not exists transaction_tags (
  transaction_id bigint not null,
  tags varchar(255)
);

create index if not exists idx_transaction_tags_tx_id on transaction_tags(transaction_id);
