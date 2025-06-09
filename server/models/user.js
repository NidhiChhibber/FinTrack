// server/models/user.js
export default (sequelize, DataTypes) => {
  return sequelize.define(
    'user',
    {
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          len: [3, 50],
          is: /^[a-zA-Z0-9_]+$/
        }
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true
        }
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false
      },
      name: {
        type: DataTypes.STRING,
        allowNull: true // We'll use username as display name
      },
      avatar: DataTypes.STRING,
      isEmailVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      lastLoginAt: DataTypes.DATE,
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      }
    },
    {
      tableName: 'users',
      timestamps: true,
      indexes: [
        { fields: ['username'] },
        { fields: ['email'] }
      ]
    }
  );
};