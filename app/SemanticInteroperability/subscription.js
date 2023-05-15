const axios = require('axios')
const getIMToken = require('./getIMToken.js')

const createSubscriptionSemanticInteroperabilityVPF = async function () {  
  try {
        var token = await getIMToken.requestIMToken();
        console.log(token.access_token)
        const headers = {
          'Fiware-Service': 'metadata',
          'Authorization' : 'Bearer'  + ' ' + token.access_token
        }
        axios.post('https://dps.dataports.com.es:9000/orion/v2/subscriptions', {
            "subject":
              {
              "entities":[{"idPattern":".*", "type": "DataSource"}]
              },
            "notification":
              {
                "httpCustom": {
                  "url":"https://iam.dataports.com.es:9443/createDataSourceMetadata",
                  "headers": {
                  "si_account_username": "si-vpf@dataports.org",
                  "si_account_password": "dataports123"
                  }
                }               
              }
          },
          {
              headers: headers
          }
        )
        .then((response) => {
          console.log(`The response is: ${response}`);
        }, (error) => {
          console.log(`The error is: ${error}`);
        });
    } catch (error) {
        return (`Failed: ${error}`);
    }
}
exports.createSubscriptionSemanticInteroperabilityVPF = createSubscriptionSemanticInteroperabilityVPF;

const createSubscriptionSemanticInteroperabilityThPA = async function () {  
  try {
        var token = await getIMToken.requestIMToken();
        console.log(token.access_token)
        const headers = {
          'Fiware-Service': 'metadata',
          'Authorization' : 'Bearer'  + ' ' + token.access_token
        }
        axios.post('https://f120.thpa.gr:9000/orion/v2/subscriptions', {
            "subject":
              {
              "entities":[{"idPattern":".*", "type": "DataSource"}]
              },
            "notification":
              {
                "httpCustom": {
                  "url":"https://iam.dataports.com.es:9443/createDataSourceMetadata",
                  "headers": {
                  "si_account_username": "si-thpa@dataports.org",
                  "si_account_password": "dataports123"
                  }
                }               
              }
          },
          {
              headers: headers
          }
        )
        .then((response) => {
          console.log(`The response is: ${(response)}`);
        }, (error) => {
          console.log(`The error is: ${error}`);
        });
    } catch (error) {
        return (`Failed: ${error}`);
    }
}
exports.createSubscriptionSemanticInteroperabilityThPA = createSubscriptionSemanticInteroperabilityThPA;

const createSubscriptionSemanticInteroperabilityBaleares = async function () {  
  try {
        var token = await getIMToken.requestIMToken();
        console.log(token.access_token)
        const headers = {
          'Fiware-Service': 'metadata',
          'Authorization' : 'Bearer'  + ' ' + token.access_token
        }
        axios.post('https://perico1.dcom.upv.es:8080/orion/v2/subscriptions', {
            "subject":
              {
              "entities":[{"idPattern":".*", "type": "DataSource"}]
              },
            "notification":
              {
                "httpCustom": {
                  "url":"https://iam.dataports.com.es:9443/createDataSourceMetadata",
                  "headers": {
                  "si_account_username": "si-bpa@dataports.org",
                  "si_account_password": "dataports123"
                  }
                }               
              }
          },
          {
              headers: headers
          }
        )
        .then((response) => {
          console.log(`The response is: ${(response)}`);
        }, (error) => {
          console.log(`The error is: ${error}`);
        });
    } catch (error) {
        return (`Failed: ${error}`);
    }
}
exports.createSubscriptionSemanticInteroperabilityBaleares = createSubscriptionSemanticInteroperabilityBaleares;

/*
async function main() {
  try {
      console.log('call sem');
      await createSubscriptionSemanticInteroperabilityVPF();
      //console.log(testVPF);
      //await createSubscriptionSemanticInteroperabilityThPA();
      //console.log(testThPA);
      //await createSubscriptionSemanticInteroperabilityBaleares();
      //console.log(testThPA);
      //requestIMToken()
      //  .then(data => {
      //      response.json({ message: 'Request received!', data })
      //  })
      //  .catch(err => console.log(err))

      //var token = await requestIMToken();
      //.then(data => {
      //    response.json({ message: 'Request received!', data })
      //})
      //.catch(err => console.log(err))
      //console.log("The Data Governance token from the IM is:")
      //console.log(token.access_token)

  } catch (error) {
      console.error(`Failed: ${error}`);
      process.exit(1);
  }
}

main();
*/





