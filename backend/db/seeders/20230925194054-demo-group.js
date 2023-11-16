'use strict';

/** @type {import('sequelize-cli').Migration} */

const { Group } = require('../models')
const options = {};

if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA
}

const groups = [
  {
    organizerId: 3,
    name: 'Daily Coding',
    about: 'We focus on becoming better programmers. everyday we have classes from 4am to 11pm',
    type: 'Online',
    private: false,
    city: 'New York',
    state: 'New York',
    previewImage: 'https://spaces-wp.imgix.net/2016/06/coding-in-the-classroom.png?auto=compress,format&q=50'
  },
  {
    organizerId: 1,
    name: 'Minecraft',
    about: 'We minecraft everyday no matter what is happening in our lives we will minecraft alright',
    type: 'In person',
    private: false,
    city: 'Kissimmee',
    state: 'Florida',
    previewImage: 'https://assets-prd.ignimgs.com/2022/06/29/minecraft-treehouse-thumbnail-1656532676907.jpg'
  },
  {
    organizerId: 2,
    name: 'How to live',
    about: 'community cult',
    type: 'In person',
    private: true,
    city: 'New York',
    state: 'New York',
    previewImage: 'https://parade.com/.image/t_share/MTkwNTgwOTYzOTM4NDc3MTgx/10-best-cult-podcasts.jpg'
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
    await Group.destroy({
      where: {}
    })
  }
};
