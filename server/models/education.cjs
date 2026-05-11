"use strict";
module.exports = (sequelize, DataTypes) => {
  const Education = sequelize.define(
    "Education",
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      candidate_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: "candidates", key: "id" },
      },
      institution_name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      degree: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      field_of_study: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      start_date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      end_date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      is_current: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      grade: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      tableName: "education",
      underscored: true,
      timestamps: true,
      createdAt: "created_at",
      updatedAt: false,
    }
  );

  Education.associate = (models) => {
    Education.belongsTo(models.Candidate, { foreignKey: "candidate_id" });
  };

  return Education;
};
