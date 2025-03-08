"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Posts", "text", { schema: "twitterapp" });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn(
      "Posts",
      "text",
      {
        type: Sequelize.STRING,
        allowNull: false,
      },
      { schema: "twitterapp" }
    );
  },
};
