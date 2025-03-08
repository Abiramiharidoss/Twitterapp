"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Posts", "title", {
      type: Sequelize.STRING,
      allowNull: false,
    }, { schema: "twitterapp" });

    await queryInterface.addColumn("Posts", "description", {
      type: Sequelize.TEXT,
      allowNull: false,
    }, { schema: "twitterapp" });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Posts", "title", { schema: "twitterapp" });
    await queryInterface.removeColumn("Posts", "description", { schema: "twitterapp" });
  },
};
