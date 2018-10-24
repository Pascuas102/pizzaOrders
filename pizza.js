'use strict';

const uuid = require('uuid/v1');
const AWS = require('aws-sdk');

const QUEUE_URL = process.env.PENDING_ORDER_QUEUE;

var sqs = new AWS.SQS({
    region: process.env.REGION
});

module.exports.makeAnOrder = (event, context, callback) => {
	const orderId = uuid();
    const data = JSON.parse(event.body);
    let name = data.name;
    let address = data.address;
    let pizzas = data.pizzas;

	const params = {
		MessageBody: JSON.stringify({
            orderId: orderId,
            clientName: name,
            clientAddress: address,
            clientOrderedPizzas: pizzas,
        }),
		QueueUrl: QUEUE_URL
	};

	sqs.sendMessage(params, function(err, data) {
		if (err) {
			sendResponse(500, err, callback);
		} else {
			const message = {
				orderId: orderId,
				messageId: data.MessageId
			};
			sendResponse(200, message, callback);
		}
	});
};

module.exports.prepairOrder = (event, context, callback) => {
    console.log(event)

    callback();
}


function sendResponse(statusCode, message, callback) {
	const response = {
		statusCode: statusCode,
		body: JSON.stringify(message)
	};
	callback(null, response);
}