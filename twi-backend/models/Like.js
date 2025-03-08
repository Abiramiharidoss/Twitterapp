module.exports = (sequelize, DataTypes) => {
  const Like = sequelize.define(
    "Like",
    {},
    {
      schema: "twitterapp",
      tableName: "Likes",
      timestamps: true,
    }
  );

  Like.associate = (models) => {
    Like.belongsTo(models.User, { foreignKey: "userId", onDelete: "CASCADE" });
    Like.belongsTo(models.Post, { foreignKey: "postId", onDelete: "CASCADE" });
  };

  return Like;
};
