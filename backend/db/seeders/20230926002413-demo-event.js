'use strict';

/** @type {import('sequelize-cli').Migration} */
const { Event } = require('../models')
const options = {};

if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA
}
const events = [
  {
    groupId: 3,
    venueId: 1,
    host: 2,
    startTime: "7:00pm",
    endTime: "6:00am",
    name: 'go touch grass',
    type: 'In person',
    capacity: 40,
    price: 10.00,
    description: 'Very first outside Moment',
    startDate: '10/31/2024',
    endDate: '10/31/2024',
    previewImage: 'https://media4.manhattan-institute.org/sites/cj/files/on-the-need-to-touch-grass.jpg'
  },
  {
    groupId: 1,
    venueId: 3,
    host: 3,
    startTime: "7:00pm",
    endTime: "6:00am",
    name: 'The Minecraft multiverse',
    type: 'Online',
    capacity: 200,
    price: 0,
    description: 'Gamer moment',
    startDate: '02/23/2024',
    endDate: '12/12/2121',
    previewImage: 'https://www.minecraft.net/etc.clientlibs/minecraft/clientlibs/main/resources/img/minecraft-creeper-face.jpg'
  },
  {

    groupId: 2,
    venueId: 2,
    host: 1,
    startTime: "7:00pm",
    endTime: "6:00am",
    name: 'Making Synths',
    type: 'In person', //fix so people can put inperson In Person ect.
    capacity: 5,
    price: 2.00, //fix price
    description: 'not very Gamer moment',
    startDate: '12/25/2024',
    endDate: '12/25/2025',
    previewImage: 'https://imgix.bustle.com/inverse/30/87/20/15/856a/4cf9/a71a/aa4e5ba6e593/synth2.jpeg?w=1200&h=630&fit=crop&crop=faces&fm=jpg'
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
    await Event.bulkCreate(events, { validate: true })
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */

    await Event.destroy({
      where: {}
    })
  }
};
