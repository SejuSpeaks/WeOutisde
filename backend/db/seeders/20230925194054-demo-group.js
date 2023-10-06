'use strict';

/** @type {import('sequelize-cli').Migration} */

const { Group } = require('../models')
const options = {};

if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA
}

const groups = [
  {
    organizerId: 3,
    name: 'Daily Coding',
    about: 'we code everyday',
    type: 'Online',
    private: false,
    city: 'New York',
    state: 'New York',
    previewImage: 'https://picsum.photos/200'
  },
  {
    organizerId: 1,
    name: 'Minecraft',
    about: 'Just Minecraft dude',
    type: 'In person',
    private: false,
    city: 'Kissimmee',
    state: 'Florida',
    previewImage: 'https://picsum.photos/200'
  },
  {
    organizerId: 2,
    name: 'How to live',
    about: 'community cult',
    type: 'In person',
    private: true,
    city: 'New York',
    state: 'New York',
    previewImage: 'https://picsum.photos/200'
  },
]

module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    try {
      await Group.bulkCreate(groups, options)
    } catch (error) {
      console.log(error)
    }
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    for (let group of groups) {
      options.tableName = 'Groups'
      try {
        await Group.destroy({
          where: {
            name: group.name
          }
        }, options)
      } catch (error) {
        console.log(error)
      }
    }
  }
};
