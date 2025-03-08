module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define(
    "Comment",
    {
      text: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      schema: "twitterapp",
      tableName: "Comments",
      timestamps: true,
    }
  );

  Comment.associate = (models) => {
    Comment.belongsTo(models.User, {
      foreignKey: "userId",
      onDelete: "CASCADE",
    });
    Comment.belongsTo(models.Post, {
      foreignKey: "postId",
      onDelete: "CASCADE",
    });
  };

  return Comment;
};
