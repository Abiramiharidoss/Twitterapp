"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn(
      "Users",
      "profilePic",
      {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: "/default-avatar.png",
      },
      {
        schema: "twitterapp", // Ensure it is added under the correct schema
      }
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Users", "profilePic", {
      schema: "twitterapp",
    });
  },
};
