module.exports = (sequelize, DataTypes) => {
    const Approver = sequelize.define('Approver', {
        approver_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        email: {
            type: DataTypes.STIRNG(100),
            allowNull: false,
        },
        feedback: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
    },
        {
            tableName: 'approver',
            freezeTableName: true,
            timestamps: false,
        },
    );
    return Approver;
}