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
      date: DataTypes.DATEONLY,
      category: DataTypes.STRING,

      category_corrected: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },

      merchant_name: DataTypes.STRING,

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
    }
  );
};
