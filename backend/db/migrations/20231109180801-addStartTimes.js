'use strict';

/** @type {import('sequelize-cli').Migration} */
let options = {};
options.tableName = "Events";

if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addColumn(options, 'startTime', {
      type: Sequelize.DataTypes.STRING,
    })

    await queryInterface.addColumn(options, 'endTime', {
      type: Sequelize.DataTypes.STRING,
    })

  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn(options, 'startTime')
    await queryInterface.removeColumn(options, 'endTime')

  }
};
