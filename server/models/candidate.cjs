"use strict";
module.exports = (sequelize, DataTypes) => {
  const Candidate = sequelize.define(
    "Candidate",
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
        unique: true,
        references: { model: "users", key: "id" },
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      phone: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      city: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      country: {
        type: DataTypes.STRING(100),
        allowNull: true,
        defaultValue: "România",
      },
      date_of_birth: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      profile_picture_url: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      linkedin_url: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
      github_url: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
      portfolio_url: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
      about_me: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      experience_years: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
      education: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      preferred_industries: {
        type: DataTypes.ARRAY(
          DataTypes.ENUM(
            "IT & Software",
            "Medicină & Sănătate",
            "Educație",
            "Financiar & Contabilitate",
            "Juridic",
            "Inginerie & Construcții",
            "Resurse Umane",
            "Design & Creativitate",
            "Logistică & Transport",
            "Vânzări & Marketing",
            "Horeca & Turism",
            "Auto & Mecanică",
            "Imobiliare",
            "Agricultură & Zootehnie",
            "Administrativ & Secretariat",
            "Client Service & Support",
            "Beauty & Wellness",
            "Securitate & Pază"
          )
        ),
        allowNull: true,
      },
      preferred_locations: {
        type: DataTypes.ARRAY(DataTypes.STRING(100)),
        allowNull: true,
      },
      expected_salary_min: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      expected_salary_max: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      available_from: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      is_open_to_work: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      xp: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      level: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
        allowNull: false,
      },
      rank: {
        type: DataTypes.ENUM("bronze", "silver", "gold", "platinum"),
        defaultValue: "bronze",
        allowNull: false,
      },
      cv_raw_text: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      embedding: {
        type: 'VECTOR(1536)',
        allowNull: true,
        get() {
          const raw = this.getDataValue('embedding');
          if (!raw) return null;
          if (Array.isArray(raw)) return raw;
          // pgvector returns "[0.1,0.2,...]" string
          const str = typeof raw === 'string' ? raw : String(raw);
          return str.replace(/^\[|\]$/g, '').split(',').map(Number);
        },
        set(val) {
          if (!val) return this.setDataValue('embedding', null);
          if (Array.isArray(val)) {
            this.setDataValue('embedding', `[${val.join(',')}]`);
          } else {
            this.setDataValue('embedding', val);
          }
        },
      },
    },
    {
      tableName: "candidates",
      underscored: true,
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  Candidate.associate = (models) => {
    Candidate.belongsTo(models.User, { foreignKey: "user_id" });
    Candidate.hasMany(models.WorkExperience, { foreignKey: "candidate_id" });
    Candidate.hasMany(models.Education, { foreignKey: "candidate_id" });
    Candidate.hasMany(models.Application, { foreignKey: "candidate_id" });
    Candidate.hasMany(models.Match, { foreignKey: "candidate_id" });
    Candidate.hasMany(models.SavedJob, { foreignKey: "candidate_id" });
    Candidate.hasMany(models.SavedCandidate, { foreignKey: "candidate_id" });
    Candidate.hasMany(models.Team, { as: "OwnedTeams", foreignKey: "owner_candidate_id" });
    Candidate.hasMany(models.TeamMember, { foreignKey: "candidate_id" });
    Candidate.hasMany(models.Achievement, { foreignKey: "candidate_id" });
    Candidate.belongsToMany(models.Team, {
      as: "Teams",
      through: models.TeamMember,
      foreignKey: "candidate_id",
      otherKey: "team_id",
    });
    Candidate.belongsToMany(models.Skill, {
      through: models.CandidateSkill,
      foreignKey: "candidate_id",
      otherKey: "skill_id",
    });
  };

  return Candidate;
};
