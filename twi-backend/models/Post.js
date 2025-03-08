module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define(
    "Post",
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      image: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      schema: "twitterapp", // Use the correct schema
      tableName: "Posts",
      timestamps: true, // Includes createdAt & updatedAt
    }
  );

  Post.associate = (models) => {
    Post.belongsTo(models.User, {
      foreignKey: "userId",
      onDelete: "CASCADE",
    });
    Post.hasMany(models.Like, { foreignKey: "postId", onDelete: "CASCADE" });
    Post.hasMany(models.Comment, { foreignKey: "postId", onDelete: "CASCADE" });
  };

  return Post;
};
