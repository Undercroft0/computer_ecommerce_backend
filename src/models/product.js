const { DataTypes, Model } = require('sequelize');
const moment = require('moment');
const ProductInventory = require('./product_inventory');
const ProductCategory = require('./product_category');

module.exports = (sequelize) => {
  const Product = sequelize.define('Product', {
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
    
  });
// Define the association to ProductCategory
Product.belongsTo(ProductCategory, {
    foreignKey: "category_id",
    targetKey: "id",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  
  // Define the association to ProductInventory
  Product.hasMany(ProductInventory, {
    foreignKey: "product_id",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  return Product;
};
