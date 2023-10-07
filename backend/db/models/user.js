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
      User.hasMany(models.Group, { foreignKey: 'organizerId', }),
        User.belongsToMany(models.Group, {
          through: models.Membership,
          foreignKey: 'userId',
          otherKey: 'groupId',
        }),
        User.belongsToMany(models.Event, {
          through: models.Attendee,
          foreignKey: 'userId', //foreign key refers to what youre on
          otherKey: 'eventId' //other key = table connection to
        })
    }
  }
  User.init({
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        args: true,
        msg: 'User with that username already exists'
      },
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
      unique: {
        args: true,
        msg: 'User with that email already exists'
      },
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
    },
    firstName: {
      type: DataTypes.STRING
    },
    lastName: {
      type: DataTypes.STRING
    }
  },
    {//scopes go after sequelize has been initalized at the bottomn
      sequelize,
      modelName: 'User',
      defaultScope: {
        attributes: {
          exclude: ['hashedPassword', 'createdAt', 'email']
        }
      },
      scopes: {
      }
    });
  return User;
};
