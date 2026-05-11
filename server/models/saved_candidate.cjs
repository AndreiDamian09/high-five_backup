"use strict";
module.exports = (sequelize, DataTypes) => {
  const SavedCandidate = sequelize.define(
    "SavedCandidate",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      employer_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: "employers", key: "id" },
      },
      candidate_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: "candidates", key: "id" },
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      tableName: "saved_candidates",
      underscored: true,
      timestamps: true,
      createdAt: "created_at",
      updatedAt: false,
      indexes: [
        {
          unique: true,
          fields: ["employer_id", "candidate_id"],
        },
      ],
    }
  );

  SavedCandidate.associate = (models) => {
    SavedCandidate.belongsTo(models.Employer, { foreignKey: "employer_id" });
    SavedCandidate.belongsTo(models.Candidate, { foreignKey: "candidate_id" });
  };

  return SavedCandidate;
};
