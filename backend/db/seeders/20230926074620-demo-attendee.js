'use strict';

/** @type {import('sequelize-cli').Migration} */
const { Attendee } = require('../models')
const attendees = [
  {
    id: 1,
    userId: 2,
    eventId: 3,
    status: 'attending'
  },
  {
    id: 2,
    userId: 1,
    eventId: 1,
    status: 'waitlist'
  },
  {
    id: 3,
    userId: 3,
    eventId: 2,
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
    await Attendee.bulkCreate(attendees, { validate: true })
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    for (let attendee of attendees) {
      try {
        await Attendee.destroy({
          where: {
            id: attendee.id
          }
        })
      } catch (error) {
        console.log(error)
      }
    }
  }
};
