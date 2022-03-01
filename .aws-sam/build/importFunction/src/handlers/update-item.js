const dynamodb = require("aws-sdk/clients/dynamodb");
const docClient = new dynamodb.DocumentClient();
const uuidv1 = require("uuid/v1");
// Get the DynamoDB table name from environment variables
const tableName = process.env.SAMPLE_TABLE;
const validation = require('./validation/validations')

exports.updateItemHandler = async (event) => {
  if (event.httpMethod !== "PUT") {
    throw new Error(
      `putMethod only accepts PUT method, you tried: ${event.httpMethod} method.`
    );
  }
  // All log statements are written to CloudWatch
  console.info("received:", event);

  const body = JSON.parse(event.body);
  console.log(body);

//validation --
  var arrRequiredFields = {
    firstName: body.firstName,
    lastName: body.lastName,
    email: body.email[0].address,
    phone: body.phone[0].number,
  };

  for (var key in arrRequiredFields) {
    if (validation.validateEmpty(key, arrRequiredFields[key]) != 'not empty') {
      return validation.validateEmpty(key, arrRequiredFields[key])
    }
  }

  var arrGeneralExpFields = {
    firstName: body.firstName,
    lastName: body.lastName
  };

  for (var key in arrGeneralExpFields) {
    if (validation.validateGeneral(key, arrGeneralExpFields[key]) != 'ok') {
      return validation.validateGeneral(key, arrGeneralExpFields[key])
    }
  }

  const emailToValidate = body.email[0].address;

  if (validation.validateEmail(emailToValidate) != 'ok') {
    return validation.validateEmail(emailToValidate)
  }

  const phoneToValidate = body.phone[0].number;

  if (validation.ValidatePhone(phoneToValidate) != 'ok') {
    return validation.ValidatePhone(phoneToValidate)
  }

//email exists validation - not needed for update items. Documentation is wrong.
/*   var params_email = {
    TableName: tableName,
    FilterExpression: "contains (email, :userEmail)",
    ExpressionAttributeValues: {
      ":userEmail": emailToValidate
    }
  };
  const email_result = await docClient.scan(params_email).promise();
  
  if(email_result.Count > 0){
    var res = {
      errors: {
        message: "Email already exists",
      },
    };
    return {
      statusCode: 400,
      body: JSON.stringify(res),
    };
  } */

  const id = event.pathParameters.contactId;

  const firstName = body.firstName;
  const lastName = body.lastName;
  const email = body.email[0].address;
  const emailType = body.email[0].type;
  const phone = body.phone[0].number;
  const phoneType = body.phone[0].type;
  const street = body.address[0].street;
  const city = body.address[0].city;
  const region = body.address[0].region;
  const country = body.address[0].country;
  const postalCode = body.address[0].postalCode;
  const addressType = body.address[0].type;
  const jobTitle = body.jobTitle;
  const appId = body.appId;
  const companies = body.companies;
  const groups = body.groups;
  const dob = body.dob;
  const importSource = body.importSource;

  var params = {
    TableName: tableName,
    Item: {
      id: id,
      firstName: firstName,
      lastName: lastName,
      email: email, 
      emailType: emailType,
      phone: { number: phone, type: phoneType },
      address: {
        M: {
          street: street,
          city: city,
          region: region,
          country: country,
          postalCode: postalCode,
          type: addressType,
        },
      },
      jobTitle: jobTitle,
      companies: companies,
      groups: groups,
      dob: dob,
      importSource: importSource,
      appId: appId,
    },
  };

  const result = await docClient.put(params).promise();

  const response = {
    statusCode: 201,
    body: JSON.stringify(params.Item),
  };

  // All log statements are written to CloudWatch
  console.info(
    `response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`
  );
  return response;
};
