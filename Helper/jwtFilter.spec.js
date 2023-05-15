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
        if(cb!=undefined)cb(res.data.access_token);
      })
      .catch(error => {
        console.error("ERROR: ")
        console.log(`statusCode: ${error.response.status}`);
        console.log(error.response.data);
        if(cb!=undefined)cb();
      });
}

const testIssuer = "http://test.dataports.local:3005";
const TEST_TOKEN_SECRET = "f7a9ba668fe711ecb9090242ac120002"

const generateTestToken = async function(username, organization) {
    var random16Array = new Uint8Array(16);
    // crypto.getRandomValues(random16Array);
    var b64 = Buffer.from(random16Array).toString('base64');

    return jwt.sign({"username": username, "organization": organization}, TEST_TOKEN_SECRET, {expiresIn: "60m", notBefore: 0, issuer: testIssuer, jwtid: b64, subject: username})
};


testHealth(null,()=>{
    //TokensManager.generateAccessToken
    console.log("Not Found\n\n")
    generateTestToken("user","org").then((token)=>{
        testHealth(token,()=>{
            console.log("Found + Lot info\n\n")
            TokensManager.generateAccessToken("user","org").then((token)=>{
                testHealth(token,()=>{
                    console.log("Not Found + issuer\n\n")
                    testHealth(fakeToken,()=>{
                        console.log("Error\n\n")
                    });
                });
            });
        });
    });
});;

let fakeToken="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InVzZXIiLCJvcmdhbml6YXRpb24iOiJVcmciLCJpYXQiOjE2NTQwODczOTgsIm5iZiI6MTY1NDA4NzM5OCwiZXhwIjoxNjU0MDkwOTk4LCJpc3MiOiJodHRwOi8vdGVzdC5kYXRhcG9ydHMubG9jYWw6MzAwNSIsInN1YiI6InVzZXIiLCJqdGkiOiJBQUFBQUFBQUFBQUFBQUFBQUFBQUFBPT0ifQ.nTcjKxpHSJQUe0KqJlXTeqX8i2XxP9Xd0JnGzFpLyww"

