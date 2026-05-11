"use strict";
module.exports = (sequelize, DataTypes) => {
  const SavedJob = sequelize.define(
    "SavedJob",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      candidate_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: "candidates", key: "id" },
      },
      job_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: "jobs", key: "id" },
      },
    },
    {
      tableName: "saved_jobs",
      underscored: true,
      timestamps: true,
      createdAt: "created_at",
      updatedAt: false,
      indexes: [
        {
          unique: true,
          fields: ["candidate_id", "job_id"],
        },
      ],
    }
  );

  SavedJob.associate = (models) => {
    SavedJob.belongsTo(models.Candidate, { foreignKey: "candidate_id" });
    SavedJob.belongsTo(models.Job, { foreignKey: "job_id" });
  };

  return SavedJob;
};
