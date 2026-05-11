"use strict";
module.exports = (sequelize, DataTypes) => {
  const Employer = sequelize.define(
    "Employer",
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
      company_name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      company_description: {
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
      company_size: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      website_url: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
      logo_url: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      headquarters_city: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      headquarters_country: {
        type: DataTypes.STRING(100),
        allowNull: true,
        defaultValue: "România",
      },
      founded_year: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      contact_phone: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      contact_email: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      is_verified_company: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      tableName: "employers",
      underscored: true,
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  Employer.associate = (models) => {
    Employer.belongsTo(models.User, { foreignKey: "user_id" });
    Employer.hasMany(models.Job, { foreignKey: "employer_id" });
    Employer.hasMany(models.SavedCandidate, { foreignKey: "employer_id" });
  };

  return Employer;
};
