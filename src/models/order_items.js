const { DataTypes, Model } = require('sequelize');
const moment = require('moment');
const OrderDetails = require('./order_details');
const Product = require('./product');
const db = require('../services/database');

class OrderItems extends Model {}

OrderItems.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    orderDetailId: {
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
    modelName: 'OrderItems',
    tableName: 'order_items',
    freezeTableName: true,
  }
);

// Define the association between OrderDetails and OrderItems
OrderDetails.hasMany(OrderItems, {
  foreignKey: 'orderDetailId',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

Product.hasMany(Product, {
  foreignKey: 'productId',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

module.exports = OrderItems;
