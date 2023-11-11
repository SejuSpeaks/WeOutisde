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
      Event.belongsToMany(models.User, {
        through: models.Attendee,
        as: 'attendee',
        foreignKey: 'eventId',
        otherKey: 'userId',
      }),
        Event.belongsTo(models.Group, { foreignKey: 'groupId' }),
        Event.hasMany(models.EventImage, { foreignKey: 'eventId', as: 'EventImages' }),
        Event.belongsTo(models.Venue, { foreignKey: 'venueId' });
      Event.belongsTo(models.User, { foreignKey: "host", as: 'Host', onDelete: 'cascade' });
    }
  }
  Event.init({
    groupId: DataTypes.INTEGER,
    venueId: DataTypes.INTEGER,
    host: DataTypes.INTEGER,
    startTime: DataTypes.STRING,
    endTime: DataTypes.STRING,
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
    capacity: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    price: DataTypes.FLOAT,
    startDate: {
      type: DataTypes.STRING,
      validate: {
        checkDate(date) {
          const currentDate = new Date

          const [yearProvided, monthProvided, dayProvided] = date.split('-') //parse this
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


          const [yearStarted, monthStarted, dayStarted] = startDate.split('-')
          const [yearProvided, monthProvided, dayProvided] = date.split('-')
          const dateStarted = new Date(`${yearStarted}-${monthStarted}-${dayStarted}`)
          const endDate = new Date(`${yearProvided}-${monthProvided}-${dayProvided}`)


          if (endDate < dateStarted) throw new Error('End date is less than start date')
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
