const dynamodb = require("aws-sdk/clients/dynamodb");
const docClient = new dynamodb.DocumentClient();
const uuidv1 = require("uuid/v1");
// Get the DynamoDB table name from environment variables
const tableName = process.env.SAMPLE_TABLE;

exports.putItemHandler = async (event) => {
  if (event.httpMethod !== "POST") {
    throw new Error(
      `postMethod only accepts POST method, you tried: ${event.httpMethod} method.`
    );
  }
  // All log statements are written to CloudWatch
  console.info("received:", event);

  const body = JSON.parse(event.body);
  console.log(body);


  const emailToValidate = body.email[0].address;
  const emailRegexp =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  var bool_validate = emailRegexp.test(emailToValidate);
  if (!bool_validate) {
    var res = {
      errors: {
        message: emailToValidate + "is not a valid input for email",
      },
    };
    return {
      statusCode: 400,
      body: JSON.stringify(res),
    };
  }


  const firstNameToValidate = body.firstName;
  if (firstNameToValidate == null && firstNameToValidate == '') {
    var res = {
      errors: {
        message:  "firstName cannot be empty",
      },
    };
    return {
      statusCode: 400,
      body: JSON.stringify(res),
    };
  }


  const phoneToValidate = body.phone[0].number;;
  const phoneRegexp =/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
  var bool_phone_validate = phoneRegexp.test(phoneToValidate);
  if (!bool_phone_validate) {
    var res = {
      errors: {
        message: "phone number must be at least 11 characters",
      },
    };
    return {
      statusCode: 400,
      body: JSON.stringify(res),
    };
  }


  const id = uuidv1();
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
      email: { SS: { address: { S: email }, type: { S: emailType } } },
      phone: { SS: { number: { S: phone }, type: { S: phoneType } } },
      address: {
        M: {
          street: { S: street },
          city: { S: city },
          region: { S: region },
          country: { S: country },
          postalCode: { S: postalCode },
          type: { S: addressType },
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
