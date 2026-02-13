module.exports = (sequelize, DataTypes) => {
    const Proof = sequelize.define('Proof', {
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
            allowNull: true
        }

    },
        {
            tableName: 'proof',
            freezeTableName: true,
            timeStamps: false,
        },
    );
    return Proof;
}