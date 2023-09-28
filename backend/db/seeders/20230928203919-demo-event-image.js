'use strict';

/** @type {import('sequelize-cli').Migration} */
const { EventImage } = require('../models')
const images = [
  {
    id: 1,
    eventId: 1,
    url: 'https://picsum.photos/200'
  },
  {
    id: 2,
    eventId: 3,
    url: 'https://picsum.photos/200'
  },
  {
    id: 3,
    eventId: 1,
    url: 'https://picsum.photos/200'
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
      await EventImage.bulkCreate(images, { validate: true })
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
    for (let image of images) {
      try {
        await EventImage.destroy({
          where: {
            id: image.id
          }
        })
      } catch (error) {
        console.log(error)
      }
    }
  }
};
