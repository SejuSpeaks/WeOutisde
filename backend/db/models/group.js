'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Group extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Group.belongsTo(models.User, { foreignKey: 'organizerId', as: 'Organizer' }),
        Group.hasMany(models.Venue, { foreignKey: 'groupId', as: 'Venues', onDelete: 'cascade' }), //review
        Group.belongsToMany(models.User, {
          through: models.Membership,
          as: 'Members',
          foreignKey: 'groupId',
          otherKey: 'userId',
          onDelete: 'cascade'
        }),
        Group.hasMany(models.GroupImage, { foreignKey: 'groupId', as: 'GroupImages', onDelete: 'cascade' }),
        Group.hasMany(models.Event, { foreignKey: 'groupId', onDelete: 'cascade' })

    }
  }
  Group.init({
    organizerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      validate: {
        max: 60,
        notEmpty: true
      }
    },
    about: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        max: 250,
        min: 50
      }
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [['Online', 'In person']]
      }
    },
    private: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false
    },
    previewImage: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Group',
    defaultScope: {
      attributes: {
        exclude: []
      }
    }
  });
  return Group;
};
