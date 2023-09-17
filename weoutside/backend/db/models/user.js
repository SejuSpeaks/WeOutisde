'use strict';
const {
  Model,
  Validator
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init({
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        min: 4,
        max: 30,
        checkForEmail(value) {
          if (Validator.isEmail(value)) {
            throw new Error("Cant be Email Buddy")
          }
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      validate: {
        min: 3,
        max: 256,
        isEmail: true
      }
    },
    hashedPassword: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        min: 60,
        max: 60
      }
    }
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};
