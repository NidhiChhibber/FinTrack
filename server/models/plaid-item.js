export default (sequelize, DataTypes) => {
  return sequelize.define('plaid_item', {
    user_id: {
      type: DataTypes.STRING,
      allowNull: false
    },
    item_id: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    access_token: {
      type: DataTypes.STRING,
      allowNull: false
    },
    institution_name: DataTypes.STRING,
    cursor: DataTypes.STRING
  });
};
