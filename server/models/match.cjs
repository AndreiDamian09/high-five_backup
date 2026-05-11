"use strict";
module.exports = (sequelize, DataTypes) => {
  const Match = sequelize.define(
    "Match",
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      job_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: "jobs", key: "id" },
      },
      candidate_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: "candidates", key: "id" },
      },
      match_score: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
      },
      match_reasons: {
        type: DataTypes.JSONB,
        allowNull: true,
      },
      is_notified_candidate: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      is_notified_employer: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      tableName: "matches",
      underscored: true,
      timestamps: true,
      createdAt: "created_at",
      updatedAt: false,
      indexes: [
        {
          unique: true,
          fields: ["job_id", "candidate_id"],
        },
      ],
    }
  );

  Match.associate = (models) => {
    Match.belongsTo(models.Job, { foreignKey: "job_id" });
    Match.belongsTo(models.Candidate, { foreignKey: "candidate_id" });
  };

  return Match;
};
