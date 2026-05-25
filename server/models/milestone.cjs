"use strict";
module.exports = (sequelize, DataTypes) => {
  const Milestone = sequelize.define(
    "Milestone",
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
      application_id: {
        type: DataTypes.UUID,
        allowNull: true,
        references: { model: "applications", key: "id" },
      },
      title: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      due_date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      order: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM("pending", "in_review", "approved", "rejected"),
        defaultValue: "pending",
        allowNull: false,
      },
    },
    {
      tableName: "milestones",
      underscored: true,
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  Milestone.associate = (models) => {
    Milestone.belongsTo(models.Job, { foreignKey: "job_id" });
    Milestone.belongsTo(models.Application, { foreignKey: "application_id" });
  };

  return Milestone;
};
