const experience = require("./experience");

module.exports = (sequelize, DataTypes) => {
  const Proof = sequelize.define(
    "Proof",
    {
      proof_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      file_name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      proof_url: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      tableName: "proof",
      freezeTableName: true,
      timestamps: false,
    },
  );

  Proof.associate = (models) => {
    Proof.belongsTo(models.Experience, {
      foreignKey: {
        name: "experience_id",
      },
      as: "experience",
    });
  };

  return Proof;
};
