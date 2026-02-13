module.exports = (sequelize, DataTypes) => {
    const Experience = sequelize.define('Experience', {
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
        type: DataTypes.ENUM('ootel', 'kinnitatud', 'tagasi lükatud', 'mustand'),
        allowNull: false,
    },
},
    {
        tableName: 'experience',
        freezeTableName: true,
        timestamps: false,
    },
);
    return Experience;
}