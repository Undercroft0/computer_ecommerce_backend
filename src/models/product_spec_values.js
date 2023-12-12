// models/product_specification_value.js
const { DataTypes, Model } = require('sequelize');
const moment = require('moment');
const db = require('../services/database');

class ProductSpecificationValue extends Model {}

ProductSpecificationValue.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    specificationId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    value: {
      type: DataTypes.STRING,
      allowNull: true,
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
    modelName: 'ProductSpecificationValue',
    tableName: 'product_specification_values',
    freezeTableName: true,
  }
);

module.exports = ProductSpecificationValue;
