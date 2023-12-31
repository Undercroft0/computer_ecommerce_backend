const { DataTypes, Model } = require('sequelize');
const moment = require('moment');
const db = require('../services/database');
const ProductSpecification = require('./product_specification');

class ProductCategory extends Model {}

ProductCategory.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
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
    modelName: 'ProductCategory',
    tableName: 'product_categories',
    freezeTableName: true,
  }
);

ProductCategory.hasMany(ProductSpecification, {
  foreignKey: 'category_id',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

module.exports = ProductCategory;
