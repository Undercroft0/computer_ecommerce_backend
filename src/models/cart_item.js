const { DataTypes, Model } = require('sequelize');
const moment = require('moment');
const db = require('../services/database');
const Cart = require('./cart'); // Assuming you have a Cart model
const Product = require('./products'); // Assuming you have a Product model

class CartItem extends Model {}

CartItem.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    cartId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    quantity: {
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
    modelName: 'CartItem',
    tableName: 'cart_items',
    freezeTableName: true,
  }
);

// Define associations between CartItem, Cart, and Product
CartItem.belongsTo(Cart, {
  foreignKey: 'cartId',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

CartItem.belongsTo(Product, {
  foreignKey: 'productId',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

module.exports = CartItem;
