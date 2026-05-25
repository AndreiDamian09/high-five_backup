"use strict";
module.exports = (sequelize, DataTypes) => {
  const Application = sequelize.define(
    "Application",
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
      cover_letter: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      cv_snapshot: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM(
          "pending",
          "reviewed",
          "accepted",
          "rejected",
          "high_five_pending",
          "in_progress",
          "completed",
          "cancelled"
        ),
        defaultValue: "pending",
      },
      match_score: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true,
      },
      employer_notes: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      reviewed_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      tableName: "applications",
      underscored: true,
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      indexes: [
        {
          unique: true,
          fields: ["job_id", "candidate_id"],
        },
      ],
    }
  );

  Application.associate = (models) => {
    Application.belongsTo(models.Job, { foreignKey: "job_id" });
    Application.belongsTo(models.Candidate, { foreignKey: "candidate_id" });
    Application.hasMany(models.SupportTicket, { foreignKey: "application_id" });
    Application.hasMany(models.Milestone, { foreignKey: "application_id" });
    Application.hasMany(models.Review, { foreignKey: "application_id" });
  };

  return Application;
};
