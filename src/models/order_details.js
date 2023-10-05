const { DataTypes, Model } = require('sequelize');
const moment = require('moment');
const db = require('../services/database');
const User = require('./users');

class OrderDetails extends Model {}

OrderDetails.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      get() {
        return moment(this.getDataValue('createdAt')).format('YYYY/MM/DD HH:mm');
      },
    },
    updatedAt: {
      type: DataTypes.DATE,
      get() {
        return moment(this.getDataValue('updatedAt')).format('YYYY/MM/DD HH:mm');
      },
    },
  },
  {
    sequelize: db,
    modelName: 'OrderDetails',
    tableName: 'order_details',
    freezeTableName: true,
  }
);

module.exports = OrderDetails;
