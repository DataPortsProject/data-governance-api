const qs = require('qs');
const axios = require('axios');

const requestIMToken = async function () {

    var data = qs.stringify({
      'grant_type': 'password',
      'client_id': 'DataGovernance',
      'client_secret': 'jD2MEc6QKboUfiezsEh77beQ4xhtDs21',
      'username': 'data-gov@dataports.org',
      'password': 'dataports' 
    });
    var config = {
      method: 'post',
      url: 'https://iam.dataports.com.es:8443/auth/realms/DataPorts/protocol/openid-connect/token',
      headers: { 
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data : data
    };
  
    const responseData = await axios(config);
  
    return(responseData.data);
  }
  exports.requestIMToken = requestIMToken;