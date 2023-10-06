'use strict';

const { Venue } = require('../models')
const options = {};

if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA
}

const venues = [
  {
    groupId: 3,
    address: '1155 Obsidian Street',
    city: 'Netherand',
    state: 'Swedim',
    lat: '234.3892',
    lng: '553.2348'
  },
  {
    groupId: 1,
    address: 'John young prk',
    city: 'Kissimmee',
    state: 'Florida',
    lat: '2223.12312',
    lng: '3345.2345348'
  },
  {
    groupId: 2,
    address: 'The Kove',
    city: 'Orlando',
    state: 'Florida',
    lat: '2567.12342',
    lng: '35675.2345908'
  },
]

/** @type {import('sequelize-cli').Migration} */
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
    await Venue.bulkCreate(venues)
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */

    await Venue.destroy({
      where: {},
      truncate: true
    })
  }
};
