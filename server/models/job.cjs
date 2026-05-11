"use strict";
module.exports = (sequelize, DataTypes) => {
  const Job = sequelize.define(
    "Job",
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      employer_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: "employers", key: "id" },
      },
      title: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      requirements: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      responsibilities: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      industry: {
        type: DataTypes.ENUM(
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
        ),
        allowNull: true,
      },
      location: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      is_remote: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      job_type: {
        type: DataTypes.STRING(50),
        allowNull: true,
        defaultValue: "full-time",
      },
      experience_level: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      salary_min: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      salary_max: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      salary_currency: {
        type: DataTypes.STRING(10),
        allowNull: true,
        defaultValue: "RON",
      },
      benefits: {
        type: DataTypes.ARRAY(DataTypes.TEXT),
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM("active", "paused", "closed", "draft"),
        defaultValue: "active",
      },
      views_count: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      applications_count: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
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
      expires_at: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
    },
    {
      tableName: "jobs",
      underscored: true,
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  Job.associate = (models) => {
    Job.belongsTo(models.Employer, { foreignKey: "employer_id" });
    Job.hasMany(models.Application, { foreignKey: "job_id" });
    Job.hasMany(models.Match, { foreignKey: "job_id" });
    Job.hasMany(models.SavedJob, { foreignKey: "job_id" });
    Job.hasMany(models.ChatMessage, { foreignKey: "job_id" });
    Job.hasMany(models.SupportTicket, { foreignKey: "job_id" });
    Job.belongsToMany(models.Skill, {
      through: models.JobSkill,
      foreignKey: "job_id",
      otherKey: "skill_id",
    });
  };

  return Job;
};
