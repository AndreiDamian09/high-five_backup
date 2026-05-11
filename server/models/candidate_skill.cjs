"use strict";
module.exports = (sequelize, DataTypes) => {
  const CandidateSkill = sequelize.define(
    "CandidateSkill",
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
      skill_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "skills", key: "id" },
      },
      proficiency_level: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
          min: 1,
          max: 5,
        },
      },
      years_experience: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
    },
    {
      tableName: "candidate_skills",
      underscored: true,
      timestamps: false,
      indexes: [
        {
          unique: true,
          fields: ["candidate_id", "skill_id"],
        },
      ],
    }
  );

  return CandidateSkill;
};
