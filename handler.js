'use strict';

const databaseManager = require('./databaseManager.js');
const uuidv1 = require('uuid/v1');

function createResponse(statusCode, message) {
  return {
    statusCode: statusCode,
    body: JSON.stringify(message)
  };
}

module.exports.saveItem = (event, context, callback) => {
  const item = JSON.parse(event.body);
  console.log(item);
  item.itemId = uuidv1();

  return databaseManager.saveItem(item).then(response => {
    console.log('saveItem response', response);
    return createResponse(200, response);
  });
};

module.exports.getItem = (event, context, callback) => {
  const itemId = event.pathParameters.itemId;

  return databaseManager.getItem(itemId).then(response => {
    console.log('getItem response: ', response);
    return createResponse(200, response);
  });
};

module.exports.deleteItem = (event, context, callback) => {
  const itemId = event.pathParameters.itemId;

  // TODO: add error handling
  return databaseManager.deleteItem(itemId).then(response => {
    return createResponse(200, 'Item was deleted');
  });
};

module.exports.updateItem = (event, context, callback) => {
  const itemId = event.pathParameters.itemId;
  const body = JSON.parse(event.body);
  const paramName = body.paramName;
  const paramValue = body.paramValue;

  return databaseManager.updateItem(itemId, paramName, paramValue).then(response => {
    console.log('updateItem response: ', response);
    return createResponse(200, response);
  });
};
