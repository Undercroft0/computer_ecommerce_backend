const { DataTypes, Model } = require('sequelize');
const moment = require('moment');
const ProductInventory = require('./product_inventory');
const ProductCategory = require('./product_category');
const ProductImage = require('./product_image'); // Import the new model
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
      type: DataTypes.STRING,
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
    modelName: 'product',
    freezeTableName: true,
    tableName: 'product',
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

Product.hasMany(ProductImage, { as: 'images', foreignKey: 'productId' }); // New association with ProductImage model

module.exports = Product;
