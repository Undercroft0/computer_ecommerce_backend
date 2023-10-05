const { DataTypes, Model } = require('sequelize');
const moment = require('moment');
const ProductInventory = require('./product_inventory');
const ProductCategory = require('./product_category');
const db = require("../services/database"); 

class Product extends Model {}

Product.init(
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
      type: DataTypes.TEXT,
    },
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    price: {
      type: DataTypes.FLOAT,
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
    },
  },
  {
    sequelize: db,
    modelName: 'Product',
    freezeTableName: true,
  }
);

Product.belongsTo(ProductCategory, {
  foreignKey: "category_id",
  targetKey: "id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

Product.hasMany(ProductInventory, {
  foreignKey: "product_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

module.exports = Product;
