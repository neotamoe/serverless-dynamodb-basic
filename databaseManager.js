'use strict'

const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();


const TABLE_NAME = process.env.ITEMS_DYNAMODB_TABLE;

module.exports.saveItem = item => {
    const params = {
        TableName: TABLE_NAME,
        Item: item
    };

    return dynamo.put(params).promise().then(() => {
        return item.itemId;
    });
};

module.exports.getItem = itemId => {
    const params = {
        Key: {
            itemId: itemId    
        },
        TableName: TABLE_NAME
    };

    return dynamo.get(params).promise().then((result) => {
        return result.Item;
    });
};

module.exports.deleteItem = itemId => {
    const params = {
        Key: {
            itemId: itemId    
        },
        TableName: TABLE_NAME
    };

    return dynamo.delete(params).promise();
};

module.exports.updateItem = (itemId, paramsName, paramsValue) => {
    const params = {
        Key: {
            itemId: itemId    
        },
        TableName: TABLE_NAME,
        ConditionExpression:'attribute_exists(itemId)',
        UpdateExpression: 'set ' + paramsName + ' = :v',  // dynamically say what value to set
        ExpressionAttributeValues: {
            ':v': paramsValue
        },
        ReturnValues: 'ALL_NEW'
    };

    return dynamo.update(params).promise().then((response) => {
        return response.Attributes;
    });
};