"use strict";

module.exports = (sequelize, DataTypes) => {
  const ChatMessage = sequelize.define(
    "ChatMessage",
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      sender_user_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: "users", key: "id" },
      },
      job_id: {
        type: DataTypes.UUID,
        allowNull: true,
        references: { model: "jobs", key: "id" },
      },
      team_id: {
        type: DataTypes.UUID,
        allowNull: true,
        references: { model: "teams", key: "id" },
      },
      channel: {
        type: DataTypes.ENUM("project", "team"),
        allowNull: false,
      },
      body: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      tableName: "chat_messages",
      underscored: true,
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  ChatMessage.associate = (models) => {
    ChatMessage.belongsTo(models.User, { as: "Sender", foreignKey: "sender_user_id" });
    ChatMessage.belongsTo(models.Job, { foreignKey: "job_id" });
    ChatMessage.belongsTo(models.Team, { foreignKey: "team_id" });
  };

  return ChatMessage;
};
