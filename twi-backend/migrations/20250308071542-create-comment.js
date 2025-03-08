"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      "Comments",
      {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        text: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        userId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: "Users",
            key: "id",
          },
          onDelete: "CASCADE",
        },
        postId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: "Posts",
            key: "id",
          },
          onDelete: "CASCADE",
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },
      },
      {
        schema: "twitterapp",
      }
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Comments", { schema: "twitterapp" });
  },
};
