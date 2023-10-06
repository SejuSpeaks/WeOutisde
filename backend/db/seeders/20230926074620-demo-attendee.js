'use strict';

/** @type {import('sequelize-cli').Migration} */
const { Attendee } = require('../models')
const options = {};

if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA
}
const attendees = [
  {

    userId: 2,
    eventId: 3,
    status: 'attending'
  },
  {

    userId: 1,
    eventId: 1,
    status: 'waitlist'
  },
  {

    userId: 3,
    eventId: 2,
    status: 'pending'
  },
  {

    userId: 3,
    eventId: 3,
    status: 'host'
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
      await Attendee.bulkCreate(attendees, { validate: true })
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
    await Attendee.destroy({
      where: {},
      truncate: true
    })
  }
};
