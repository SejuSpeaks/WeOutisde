'use strict';

/** @type {import('sequelize-cli').Migration} */
const { Membership } = require('../models')
const options = {};

if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA
}
const members = [ //cohost member pending host
  {
    id: 1,
    userId: 2,
    groupId: 2,
    status: 'host'
  },
  {
    id: 2,
    userId: 3,
    groupId: 1,
    status: 'member'
  },
  {
    id: 3,
    userId: 1,
    groupId: 3,
    status: 'pending'
  },
  {
    id: 4,
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
      await Membership.bulkCreate(members, { validate: true }, options)
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
    for (let member of members) {
      try {
        await Membership.destroy({
          where: {
            id: member.id
          }
        }, options)
      } catch (error) {
        console.log(error)
      }
    }
  }

};
