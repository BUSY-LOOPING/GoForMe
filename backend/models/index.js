import User from './User.js';
import UserRole from './UserRole.js';
import ServiceCategory from './ServiceCategory.js';
import Service from './Service.js';
import ServiceField from './ServiceField.js';
import Order from './Order.js';
import PaymentMethod from './PaymentMethod.js';
import Payment from './Payment.js';
import RunnerPayout from './RunnerPayout.js';
import Notification from './Notification.js';
import Ticket from './Ticket.js';
import Message from './Message.js';
import RunnerImage from './RunnerImage.js';
import RefreshToken from './RefreshToken.js';
import {sequelize} from '../config/db.js';

const models = {
  User,
  UserRole,
  ServiceCategory,
  Service,
  ServiceField,
  Order,
  PaymentMethod,
  Payment,
  RunnerPayout,
  Notification,
  Ticket,
  Message,
  RunnerImage,
  RefreshToken
};

Object.keys(models).forEach(modelName => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

export {
  sequelize,
  User,
  UserRole,
  ServiceCategory,
  Service,
  ServiceField,
  Order,
  PaymentMethod,
  Payment,
  RunnerPayout,
  Notification,
  Ticket,
  Message,
  RunnerImage,
  RefreshToken
};

export default models;
