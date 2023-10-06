'use strict';

const { query } = require('express');

/** @type {import('sequelize-cli').Migration} */
const options = {};
options.tableName = 'Users'

if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addColumn(options, 'firstName', {
      type: Sequelize.STRING(80)
    })

    await queryInterface.addColumn(options, 'lastName', {
      type: Sequelize.STRING(80)
    })
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */

    await queryInterface.removeColumn(options, 'firstName');
    await queryInterface.removeColumn(options, 'lastName')
  }
};
