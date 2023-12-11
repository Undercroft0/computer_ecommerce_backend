// models/product_specification.js
const { DataTypes, Model } = require('sequelize');
const moment = require('moment');
const db = require('../services/database');

class ProductSpecification extends Model {}

ProductSpecification.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    specification: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    value: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    category_id: {
      type: DataTypes.INTEGER,
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
    modelName: 'ProductSpecification',
    tableName: 'product_specifications',
    freezeTableName: true,
  }
);

module.exports = ProductSpecification;
