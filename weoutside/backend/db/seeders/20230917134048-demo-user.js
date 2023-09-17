'use strict';
const options = {};

if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA
}

const { User } = require('../models');
const bcrypt = require("bcryptjs");

const users = [
  {
    email: 'thisisemail@gmail.com',
    username: 'Hooligan',
    hashedPassword: bcrypt.hashSync('theFirstPass')
  },
  {
    email: 'bawgusPatrol@gmail.com',
    username: 'theBawgis',
    hashedPassword: bcrypt.hashSync('ThisisnotagoodPassword')
  },
  {
    email: 'Hacker@gmail.com',
    username: 'iAmAHacker',
    hashedPassword: bcrypt.hashSync('1234')
  },
  {
    email: 'America@gmail.com',
    username: 'Joe Biden',
    hashedPassword: bcrypt.hashSync('IamJoeBiden')
  },
]

/** @type {import('sequelize-cli').Migration} */
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
      await User.bulkCreate(users, { validate: true })

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

    for (let userInfo of users) {
      options.tableName = 'Users'
      try {
        await User.destroy({
          where: {
            email: userInfo.email
          },
        }, options)
      } catch (error) {
        console.log(error)
      }
    }

    // await queryInterface.bulkDelete('Users', null, {});

  }
};
