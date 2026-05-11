"use strict";
module.exports = (sequelize, DataTypes) => {
  const Skill = sequelize.define(
    "Skill",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
      },
      category: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
    },
    {
      tableName: "skills",
      underscored: true,
      timestamps: true,
      createdAt: "created_at",
      updatedAt: false,
    }
  );

  Skill.associate = (models) => {
    Skill.belongsToMany(models.Candidate, {
      through: models.CandidateSkill,
      foreignKey: "skill_id",
      otherKey: "candidate_id",
    });
    Skill.belongsToMany(models.Job, {
      through: models.JobSkill,
      foreignKey: "skill_id",
      otherKey: "job_id",
    });
  };

  return Skill;
};
