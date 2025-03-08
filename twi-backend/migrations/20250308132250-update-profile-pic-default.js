'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Users', 'profilePic', {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: '/uploads/default-avatar.png',
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Users', 'profilePic', {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: null, // Revert to previous default value if necessary
    });
  }
};