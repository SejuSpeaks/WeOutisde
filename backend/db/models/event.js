'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Event extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Event.init({
    groupId: DataTypes.INTEGER,
    venueId: DataTypes.INTEGER,
    name: {
      type: DataTypes.STRING,
      validate: {
        min: 5,
        max: 80
      }
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false
    },
    type: {
      type: DataTypes.STRING,
      validate: {
        isIn: [['Online', 'In person']]
      }
    },
    capacity: DataTypes.INTEGER,
    price: DataTypes.FLOAT,
    startDate: {
      type: DataTypes.STRING,
      validate: {
        checkDate(date) {
          // MM/DD/YYYY format
          const currentDate = new Date

          const [monthProvided, dayProvided, yearProvided] = date.split('/') //parse this
          const dateProvided = new Date(`${yearProvided}-${monthProvided}-${dayProvided}`)


          if (dateProvided < currentDate) {
            throw new Error('Start date must be in future')
          }
        }
      }
    }, //cant be before current Date
    endDate: {
      type: DataTypes.STRING,
      validate: {
        checkEndDate(date) {
          const startDate = this.startDate

          const [monthProvided, dayProvided, yearProvided] = date.split('/')
          const endDate = new Date(`${yearProvided}-${monthProvided}-${dayProvided}`)


          if (endDate < startDate) throw new Error('End date is less than start date')
        }
      }
    },  //has to be after startDate
    previewImage: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Event',
  });
  return Event;
};
