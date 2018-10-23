'use strict';

const uuid = require('uuid/v1');
const AWS = require('aws-sdk');

const QUEUE_URL = process.env.PENDING_ORDER_QUEUE;

var sqs = new AWS.SQS({
    region: process.env.REGION
});

module.exports.makeAnOrder = async (event, context) => {
    const orderId = uuid();
    let messageBody = {
        orderId : orderId
    };
    const params = {
        MessageBody: JSON.stringify(messageBody),
        QueueUrl: QUEUE_URL
    };

    sqs.sendMessage(params, function(err, data) {
        if(err) {
            return _sendResponse(500, err);
        } else {
            const message = {
                'orderId' : orderId,
                'messageId' : data.MessageId
            }
            return _sendResponse(200, message);
        }
    });

    return _sendResponse(500, 'err');

};

function _sendResponse(statusCode, message) {
	return {
		statusCode: statusCode,
		body: JSON.stringify(message)
	};
}