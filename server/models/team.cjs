"use strict";

module.exports = (sequelize, DataTypes) => {
  const Team = sequelize.define(
    "Team",
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      owner_candidate_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: "candidates", key: "id" },
      },
      name: {
        type: DataTypes.STRING(120),
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      visibility: {
        type: DataTypes.ENUM("public", "private"),
        defaultValue: "public",
      },
    },
    {
      tableName: "teams",
      underscored: true,
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  Team.associate = (models) => {
    Team.belongsTo(models.Candidate, { as: "Owner", foreignKey: "owner_candidate_id" });
    Team.belongsToMany(models.Candidate, {
      as: "Members",
      through: models.TeamMember,
      foreignKey: "team_id",
      otherKey: "candidate_id",
    });
    Team.hasMany(models.ChatMessage, { foreignKey: "team_id" });
  };

  return Team;
};
