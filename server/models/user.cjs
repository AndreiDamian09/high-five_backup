"use strict";
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
      email: { type: DataTypes.STRING(255), allowNull: false, unique: true },
      password_hash: { type: DataTypes.STRING(255), allowNull: true },
      oauth_provider: { type: DataTypes.ENUM("google", "linkedin"), allowNull: true },
      oauth_id: { type: DataTypes.STRING(255), allowNull: true },
      role: { type: DataTypes.ENUM("candidate", "employer", "admin"), defaultValue: "candidate" },
      is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
      is_verified: { type: DataTypes.BOOLEAN, defaultValue: false },
    },
    {
      tableName: "users",
      underscored: true,
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  User.associate = (models) => {
    User.hasOne(models.Candidate, { foreignKey: "user_id" });
    User.hasOne(models.Employer, { foreignKey: "user_id" });
    User.hasMany(models.Notification, { foreignKey: "user_id" });
    User.hasMany(models.AuditLog, { foreignKey: "user_id" });
    User.hasMany(models.ChatMessage, { as: "SentMessages", foreignKey: "sender_user_id" });
    User.hasMany(models.SupportTicket, { as: "OpenedTickets", foreignKey: "opened_by_user_id" });
  };

  return User;
};
