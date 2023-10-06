'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  const { Op } = require('sequelize')
  class Attendee extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Attendee.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      onDelete: 'cascade'
    },
    eventId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      onDelete: 'cascade'
    },
    status: {
      type: DataTypes.STRING,
      validate: {
        isIn: [['attending', 'pending', 'waitlist', 'host', 'co-host']]
      },
      defaultValue: 'pending'
    }
  }, {
    sequelize,
    modelName: 'Attendee',
    scopes: {
      notValid: {
        where: {
          status: {
            [Op.ne]: 'pending'
          }
        }
      }
    }
  });
  return Attendee;
};
