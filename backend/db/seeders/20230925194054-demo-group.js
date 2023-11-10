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
    about: 'we code everyday',
    type: 'Online',
    private: false,
    city: 'New York',
    state: 'New York',
    previewImage: 'https://spaces-wp.imgix.net/2016/06/coding-in-the-classroom.png?auto=compress,format&q=50'
  },
  {
    organizerId: 1,
    name: 'Minecraft',
    about: 'Just Minecraft dude',
    type: 'In person',
    private: false,
    city: 'Kissimmee',
    state: 'Florida',
    previewImage: 'https://media.entertainmentearth.com/assets/images/de6a2ddfe2a44dde94d425e36f379de1xl.jpg'
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
