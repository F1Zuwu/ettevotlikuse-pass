module.exports = (sequelize, DataTypes) => {
  const Experience = sequelize.define(
    "Experience",
    {
      experience_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      title: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      reflectionanswer: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM(
          "ootel",
          "kinnitatud",
          "tagasi lükatud",
          "mustand",
        ),
        allowNull: false,
      },
      approval_token: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      approval_token_expires_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      approver_email: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      approver_feedback: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      approved_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        references: { model: "user", key: "user_id" },
        allowNull: true,
      },
      category_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "category",
          key: "category_id",
        },
        onDelete: "CASCADE",
      },
      reflection_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "reflection",
          key: "reflection_id",
        },
        onDelete: "CASCADE",
      },
    },
    {
      tableName: "experience",
      freezeTableName: true,
      timestamps: true,
    },
  );

  Experience.associate = (models) => {
    Experience.belongsTo(models.User, {
      foreignKey: "user_id",
      as: "user",
    });

    Experience.hasMany(models.Proof, {
      foreignKey: "experience_id",
      as: "proofs",
      onDelete: "CASCADE",
    });

    Experience.belongsTo(models.Reflection, {
      foreignKey: "reflection_id",
      as: "reflection",
    });

    Experience.belongsTo(models.Category, {
      foreignKey: "category_id",
      as: "category",
    });
  };

  return Experience;
};
