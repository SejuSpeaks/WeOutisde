'use strict';

/** @type {import('sequelize-cli').Migration} */
const { GroupImage } = require('../models')
const options = {};

if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA
}
const images = [
  {

    groupId: 1,
    url: 'https://picsum.photos/200'
  },
  {

    groupId: 3,
    url: 'https://picsum.photos/200'
  },
  {

    groupId: 2,
    url: 'https://picsum.photos/200'
  }
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
      await GroupImage.bulkCreate(images, { validate: true }, options)
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
        await GroupImage.destroy({
          where: {
            id: image.id
          }
        }, options)
      } catch (error) {
        console.log(error)
      }
    }
  }
};
