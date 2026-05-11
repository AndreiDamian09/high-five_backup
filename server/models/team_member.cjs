"use strict";

module.exports = (sequelize, DataTypes) => {
  const TeamMember = sequelize.define(
    "TeamMember",
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      team_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: "teams", key: "id" },
      },
      candidate_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: "candidates", key: "id" },
      },
      role: {
        type: DataTypes.ENUM("owner", "member"),
        defaultValue: "member",
      },
    },
    {
      tableName: "team_members",
      underscored: true,
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      indexes: [{ unique: true, fields: ["team_id", "candidate_id"] }],
    }
  );

  TeamMember.associate = (models) => {
    TeamMember.belongsTo(models.Team, { foreignKey: "team_id" });
    TeamMember.belongsTo(models.Candidate, { foreignKey: "candidate_id" });
  };

  return TeamMember;
};
