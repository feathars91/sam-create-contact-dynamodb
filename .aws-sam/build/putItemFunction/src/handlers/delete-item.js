// Create clients and set shared const values outside of the handler.

// Get the DynamoDB table name from environment variables
const tableName = process.env.SAMPLE_TABLE;

// Create a DocumentClient that represents the query to add an item
const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();


exports.deleteItemHandler = async (event) => {
  if (event.httpMethod !== 'DELETE') {
    throw new Error(`deleteMethod only accept DELETE method, you tried: ${event.httpMethod}`);
  }
  // All log statements are written to CloudWatch
  console.info('received:', event);
 
  // Get id from pathParameters from APIGateway because of `/{id}` at template.yaml
  const id = event.pathParameters.contactId;
 
 
  var params = {
    TableName : tableName,
    Key: { id: id },
  };
  
  const result = await docClient.delete(params).promise();

  console.log(result);
  
      var res = {
        message: "Contact sucessfully deleted"
    };

  const response = {
    statusCode: 202,
    body: JSON.stringify(res)
  };
 
  // All log statements are written to CloudWatch
  console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);
  return response;
}