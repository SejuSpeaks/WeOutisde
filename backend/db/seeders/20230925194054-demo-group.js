'use strict';

/** @type {import('sequelize-cli').Migration} */

const { Group } = require('../models')

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
    const groups = [
      {
        organizerId: 10,
        name: 'Daily Coding',
        about: 'we code everyday',
        type: 'Online',
        private: false,
        city: 'New York',
        state: 'New York',
        previewImage: 'https://picsum.photos/200'
      },
      {
        organizerId: 11,
        name: 'Minecraft',
        about: 'Just Minecraft dude',
        type: 'In person',
        private: false,
        city: 'Kissimmee',
        state: 'Florida',
        previewImage: 'https://picsum.photos/200'
      },
      {
        organizerId: 12,
        name: 'How to live',
        about: 'community cult',
        type: 'In person',
        private: true,
        city: 'New York',
        state: 'New York',
        previewImage: 'https://picsum.photos/200'
      },
    ]

    try {
      await Group.bulkCreate(groups)
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
    await queryInterface.bulkDelete('Groups', null, {});
  }
};
