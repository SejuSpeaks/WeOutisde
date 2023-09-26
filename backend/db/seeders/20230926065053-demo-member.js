'use strict';

/** @type {import('sequelize-cli').Migration} */
const { Membership } = require('../models')
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
  }
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
    for (let member of members) {
      try {
        await Membership.destroy({
          where: {
            id: member.id
          }
        })
      } catch (error) {
        console.log(error)
      }
    }
  }

};
