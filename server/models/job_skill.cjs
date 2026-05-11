"use strict";
module.exports = (sequelize, DataTypes) => {
  const JobSkill = sequelize.define(
    "JobSkill",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      job_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: "jobs", key: "id" },
      },
      skill_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "skills", key: "id" },
      },
      is_required: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      min_proficiency: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
          min: 1,
          max: 5,
        },
      },
    },
    {
      tableName: "job_skills",
      underscored: true,
      timestamps: false,
      indexes: [
        {
          unique: true,
          fields: ["job_id", "skill_id"],
        },
      ],
    }
  );

  return JobSkill;
};
