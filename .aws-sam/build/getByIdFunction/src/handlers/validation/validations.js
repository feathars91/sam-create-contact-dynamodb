
  function validateEmpty(fieldName, input) {
    if ( input.length == 0) {
      var res = {
        errors: {
          message: fieldName + " cannot be empty",
        },
      };
      return {
        statusCode: 400,
        body: JSON.stringify(res),
      };
    } 
    
    if (input == null && input == "") {
      var res = {
        errors: {
          message: fieldName + " cannot be empty",
        },
      };
      return {
        statusCode: 400,
        body: JSON.stringify(res),
      };
    }
    else{
      return 'not empty'
    }
  }
  
    function validateGeneral(fieldName, input) {
    const generalRegexp = /^[a-zA-Z]+/;
    var bool_validate_general = generalRegexp.test(input);

    if (!bool_validate_general) {

      var res = {
        errors: {
          message: fieldName + " must be a valid input of /^[a-zA-Z]+/",
        },
      };
      return {
        statusCode: 400,
        body: JSON.stringify(res),
      };
    }else{ 
      return 'ok' }
  }
  
    function validateEmail(input){
  const emailRegexp =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  var bool_validate = emailRegexp.test(input);
  if (!bool_validate) {
    var res = {
      errors: {
        message: input + "is not a valid input for email",
      },
    };
    return {
      statusCode: 400,
      body: JSON.stringify(res),
    };
  }else{ return 'ok'}
  
  }
  
    function ValidatePhone(input){
  const phoneRegexp =
    /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
  var bool_phone_validate = phoneRegexp.test(input);
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
  }else{return 'ok'}
  }
  
  module.exports = {
   validateEmpty,
   validateGeneral,
   validateEmail,
   ValidatePhone
}