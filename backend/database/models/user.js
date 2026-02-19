module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      firstname: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      lastname: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      phone: {
        type: DataTypes.STRING(30),
        allowNull: true,
      },
      birthday: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      profileimg: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      role: {
        type: DataTypes.ENUM("admin", "user"),
        allowNull: false,
        defaultValue: "user",
      },
    },
    {
      tableName: "user",
      freezeTableName: true,
      timestamps: true,
    },
  );

  User.associate = (models) => {
    User.hasMany(models.Experience, {
      foreignKey: "user_id",
      as: "experiences",
    });
  };

  return User;
};
