'use strict';

/** @type {import('sequelize-cli').Migration} */
const { Membership } = require('../models')
const options = {};

if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA
}
const members = [ //cohost member pending host
  {
    userId: 2,
    groupId: 2,
    status: 'host'
  },
  {
    userId: 3,
    groupId: 1,
    status: 'member'
  },
  {
    userId: 1,
    groupId: 3,
    status: 'pending'
  },
  {
    userId: 3,
    groupId: 1,
    status: 'member'
  },
];
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
      await Membership.bulkCreate(members, { validate: true })
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
    await Membership.destroy({
      where: {},
      truncate: true
    })
  }

};
