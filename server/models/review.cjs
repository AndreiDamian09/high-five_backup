"use strict";
module.exports = (sequelize, DataTypes) => {
  const Review = sequelize.define(
    "Review",
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      application_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: "applications", key: "id" },
      },
      reviewer_user_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: "users", key: "id" },
      },
      reviewee_user_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: "users", key: "id" },
      },
      rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: { min: 1, max: 5 },
      },
      comment: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      reviewer_role: {
        type: DataTypes.ENUM("employer", "candidate"),
        allowNull: false,
      },
    },
    {
      tableName: "reviews",
      underscored: true,
      timestamps: true,
      createdAt: "created_at",
      updatedAt: false,
      indexes: [
        {
          unique: true,
          fields: ["application_id", "reviewer_user_id"],
        },
      ],
    }
  );

  Review.associate = (models) => {
    Review.belongsTo(models.Application, { foreignKey: "application_id" });
    Review.belongsTo(models.User, { as: "Reviewer", foreignKey: "reviewer_user_id" });
    Review.belongsTo(models.User, { as: "Reviewee", foreignKey: "reviewee_user_id" });
  };

  return Review;
};
