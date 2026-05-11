"use strict";

module.exports = (sequelize, DataTypes) => {
  const SupportTicket = sequelize.define(
    "SupportTicket",
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      job_id: {
        type: DataTypes.UUID,
        allowNull: true,
        references: { model: "jobs", key: "id" },
      },
      application_id: {
        type: DataTypes.UUID,
        allowNull: true,
        references: { model: "applications", key: "id" },
      },
      opened_by_user_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: "users", key: "id" },
      },
      subject: {
        type: DataTypes.STRING(180),
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      category: {
        type: DataTypes.ENUM("solution_quality", "payment", "collaboration", "other"),
        defaultValue: "other",
      },
      priority: {
        type: DataTypes.ENUM("low", "normal", "high"),
        defaultValue: "normal",
      },
      status: {
        type: DataTypes.ENUM("open", "in_review", "resolved", "closed"),
        defaultValue: "open",
      },
      resolution_note: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      tableName: "support_tickets",
      underscored: true,
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  SupportTicket.associate = (models) => {
    SupportTicket.belongsTo(models.User, { as: "OpenedBy", foreignKey: "opened_by_user_id" });
    SupportTicket.belongsTo(models.Job, { foreignKey: "job_id" });
    SupportTicket.belongsTo(models.Application, { foreignKey: "application_id" });
  };

  return SupportTicket;
};
