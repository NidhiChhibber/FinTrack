export default (sequelize, DataTypes) => {
  return sequelize.define('plaid_account', {
    plaid_item_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'plaid_items',
        key: 'id'
      }
    },
    account_id: {
      type: DataTypes.STRING,
      allowNull: false
    },
    name: DataTypes.STRING,
    mask: DataTypes.STRING,
    type: DataTypes.STRING,
    subtype: DataTypes.STRING,
    official_name: DataTypes.STRING
  }, {
    indexes: [
      {
        unique: true,
        fields: ['plaid_item_id', 'account_id']
      }
    ]
  });
};
