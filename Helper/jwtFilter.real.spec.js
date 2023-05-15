const axios = require('axios');
let TokensManager = require('../Helper/tokensManager.js');
const jwt = require('jsonwebtoken');

function testHealth(token, cb){
    console.log("Testing Health:....")
    let options={}
    if(token!=null){
        options={
            headers: {
                'authorization': `Bearer ${token}`
              }
        }
    }
    axios
      .get('http://localhost:8080/health',options)
      .then(res => {
        console.log(`statusCode: ${res.status}`);
        console.log(res.data);
        if(cb!=undefined)cb();
      })
      .catch(error => {
        console.error("ERROR: ")
        console.log(`statusCode: ${error.response.status}`);
        console.log(error.response.data);
        if(cb!=undefined)cb();
      });
}


function getToken(cb){

  const params=new URLSearchParams({
    client_id:"DataAccess",
    client_secret:"ydA5pw32n2UFdqrCFhx5K6nsvyFUlPBg", 
    username:"dal-read",
    password:"dataports",
    grant_type:"password" 
  });

  const options={
    method: "post",
    url: "https://iam.dataports.com.es:8443/auth/realms/DataPorts/protocol/openid-connect/token",
    data: params,
    headers: { "Content-Type": "application/x-www-form-urlencoded" }
  }
  

  axios(options)
    .then(res=>{
      cb(res.data.access_token);
   })
   .catch(error => {
    console.error("ERROR: ")
    console.log(`statusCode: ${error.response.status}`);
    console.log(error.response.data);
    //console.log(error);
    //if(cb!=undefined)cb();
  });

}

getToken(res=>{
  testHealth(res);
});
