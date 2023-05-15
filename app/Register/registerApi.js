'use strict';

const { FileSystemWallet, Gateway} = require('fabric-network');
const path = require('path');
const generator = require('generate-password');
const { randomUUID } = require('crypto');

let enroll_registerOrgAdmin = require('./enroll&registerOrgAdmin.js');
let connectClient = require('./../Helper/connectClient.js');
let enroll_registerUser = require('./enroll&registerUser.js');
let update_UserInfo = require('./UpdateUserAttrs.js');
let metadataApi = require('./../Metadata/metadataApi.js');
let dataSharingApi = require('./../DataSharing/dataSharingApi.js');
let datetimeHelper = require('./../Helper/dateTime.js');

function isEmptyObject(obj) {
  for (let key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      return false;
    }
  }
  return true;
} 
  
const generatePassword = async function() {
  try {
    return generator.generate({
      length: 10,
      numbers: true,
      symbols: true,
      strict: true
    });
  } catch (error) {
    console.error(`Failed to generate password: ${error}`);
    return 'Fail';
  }
}


exports.generatePassword = generatePassword;

const registrationOrg = async function(netAdminusername, netAdminorg, password, body) {
    try {
        let title = body.title;
        let role = body.role;
        let vat_number = body.vat_number;
        let country = body.country; 
        let city = body.city; 
        let postal_code = body.postal_code;
        let address = body.address; 
        let phone = body.phone;
        let username = body.newUsersusername;
        let name= body.name;
        let surname = body.surname;
        let email = body.email;  
        let externalOrg = body.externalOrg;
        let isExternalUser = body.isExternalUser; 
        let isExternalOrg = body.isExternalOrg;
          
        let usertype = 'admin';
        vat_number = vat_number.toString();
        postal_code = postal_code.toString();
        phone = phone.toString();
        console.log('The input values:',netAdminusername, netAdminorg, title, role, vat_number, country, city, postal_code, address, phone, username, name, surname, email, password, externalOrg, isExternalUser, isExternalOrg)
        const checkEmail = await GetUserByEmail(netAdminusername, netAdminorg, email);
        if (checkEmail === 'Unavailable email'){
          return ('Unavailable email');
        }

        let connection = await connectClient.connectClient(netAdminusername,netAdminorg, username);
        if (connection === 'Unavailable username'){
          return 'Unavailable username';
        }
        const network = connection[0];
        const gateway = connection[1];
        
        console.log('New organization registration! org: %s role: %s  vat number: %s country:%s city:%s postal code: %s address: %s phone: %s', title, role, vat_number, country, city, postal_code, address, phone );       
        
        // Get the contract from the network.
        const contract = network.getContract('registerloginscdataports');

        let finaluserid;
        while (true){
          finaluserid = randomUUID();
          const checkIdentifier = await contract.evaluateTransaction('getUsersByID', finaluserid)
          const queryresult = isEmptyObject(checkIdentifier);
          if (queryresult === true) {
              console.log('The finaluserid is %s',finaluserid) 
              break;
          }                  
        }

        let datetime = await datetimeHelper.getDateTime();
        const result = await contract.submitTransaction('registerOrg',title, role, vat_number, country, city, postal_code, address, phone, datetime, username, password, name, surname, email, usertype, finaluserid, externalOrg, isExternalUser, isExternalOrg);
        await enroll_registerOrgAdmin.registerOrgAdmin(netAdminusername, netAdminorg, usertype, body);
        console.log(`${result.toString()}`);
        console.log('Success');
        // Disconnect from the gateway.
        await gateway.disconnect();
        console.log(password);
        return password;

    } catch (error) {
        console.error(`Failed to register: ${error}`);
        return ('Fail ' + error.stack);
    }
}

exports.registrationOrg = registrationOrg;

const registerUser = async function(adminusername, adminorg, password, body) {
  try {
      console.log('The user registration process started')
           
      let username = body.newUsersusername;
      let name = body.name;
      let surname = body.surname;
      let email = body.email;  
      let organization = body.userorganization;
      let usertype = body.usertype;
      let externalOrg = body.externalOrg;
      let isExternalUser = body.isExternalUser;

      const checkEmail = await GetUserByEmail(adminusername, adminorg, email);
      console.log("Email status : " + checkEmail);
      if (checkEmail === 'Unavailable email'){
        return ('Unavailable email');
      }

      let connection = await connectClient.connectClient(adminusername, adminorg, username);
      const network = connection[0];
      const gateway = connection[1];

      const checkUsername = await checkAvailableUsername(network, username);
      console.log("Username status : " + checkUsername);
      if (checkUsername === 'Unavailable username'){
        return ('Unavailable username');
      }
      // Get the contract from the network.
      const contract = network.getContract('registerloginscdataports');
      
      let finaluserid;
      while (true){
        finaluserid = randomUUID();
        console.log('Checking for finaluserid %s',finaluserid)
        const checkIdentifier = await contract.evaluateTransaction('getUsersByID', finaluserid)
        const queryresult = isEmptyObject(checkIdentifier);
        if (queryresult === true) {
            console.log('The finaluserid is %s',finaluserid) 
            break;
        }                
      }
      let datetime = await datetimeHelper.getDateTime();
      const result = await contract.submitTransaction('registerUser', finaluserid, username, password, name, surname, email, organization, usertype, datetime, externalOrg, isExternalUser);
      console.log('The result is:' + `${result.toString()}`);
      console.log('Success');

      if (usertype == 'user'){
          await enroll_registerUser.registerOrgUser(adminusername, adminorg,usertype, body);
      }else if (usertype == 'admin'){
          await enroll_registerOrgAdmin.registerOrgAdmin(adminusername, adminorg,usertype, body);
      }
      await gateway.disconnect();
      console.log(password);
      return password;

  } catch (error) {
      console.error(`Failed to register: ${error}`);
      return (`Fail ${error.stack}`);
      
  }
}

exports.registerUser = registerUser;

const updateOrgInfo = async function(netAdminusername, netAdminorg, body) {
  try { 
      let title = body.title;
      let role = body.role;
      let vat_number = body.vat_number;
      let country = body.country; 
      let city = body.city; 
      let postal_code = body.postal_code;
      let address = body.address; 
      let phone = body.phone;
      let externalOrgName = body.externalOrgName;
      
      vat_number = vat_number.toString();
      postal_code = postal_code.toString();
      phone = phone.toString();   

      let connection = await connectClient.connectClient(netAdminusername,netAdminorg);
      const network = connection[0];
      const gateway = connection[1];

      // Get the contract from the network.
      const contract = network.getContract('registerloginscdataports');

      const result = await contract.submitTransaction('updateOrgInfo',title, role,vat_number, country, city, postal_code,address, phone, externalOrgName);
      console.log(`${result.toString()}`);
      await gateway.disconnect();
      return ('Success');

  } catch (error) {
      console.error(`Failed to register: ${error}`);
      return ('Fail ' + error);
  }
}

exports.updateOrgInfo = updateOrgInfo;

const QueryUsersPerOrg = async function(organization,username) {
  try {
      let connection = await connectClient.connectClient(username, organization);
      const network = connection[0];

      // Get the contract from the network.
      const contract = network.getContract('registerloginscdataports');
      const result = await contract.evaluateTransaction('queryUsersPerOrg');
      console.log(result.toString());
      return result.toString();

    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        return ('Fail ' + error);
  }  
}

exports.QueryUsersPerOrg = QueryUsersPerOrg;

const QueryUsersPerExternalOrg = async function(organization,username) {
  try {
      let connection = await connectClient.connectClient(username, organization);
      const network = connection[0];

      // Get the contract from the network.
      const contract = network.getContract('registerloginscdataports');
      const result = await contract.evaluateTransaction('queryUsersPerExternalOrg');
      console.log(result.toString());
      return result.toString();

    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        return ('Fail ' + error);
  }  
}
exports.QueryUsersPerExternalOrg = QueryUsersPerExternalOrg;

const GetOrgsByManagerAdmin = async function(organization,username) {
  try {
      let connection = await connectClient.connectClient(username, organization);
      const network = connection[0];

      // Get the contract from the network.
      const contract = network.getContract('registerloginscdataports');
      const result = await contract.evaluateTransaction('getOrgsByManagerAdmin');
      console.log(result.toString());
      return result.toString();

  } catch (error) {
      console.error(`Failed to evaluate transaction: ${error}`);
      return ('Fail ' + error);
  }  
}
exports.GetOrgsByManagerAdmin = GetOrgsByManagerAdmin;

const GetInternalOrgByName = async function(organization,username) {
  try {
      let connection = await connectClient.connectClient(username, organization);
      const network = connection[0];

      // Get the contract from the network.
      const contract = network.getContract('registerloginscdataports');
      const result = await contract.evaluateTransaction('getInternalOrgByName');
      console.log(result.toString());
      return result.toString();

    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        return ('Fail ' + error);
  }  
}
exports.GetInternalOrgByName = GetInternalOrgByName;

const GetExtOrgs = async function(organization,username) {
  try {
      let connection = await connectClient.connectClient(username, organization);
      const network = connection[0];

      // Get the contract from the network.
      const contract = network.getContract('registerloginscdataports');
      const result = await contract.evaluateTransaction('getExtOrgs');
      console.log(result.toString());
      return result.toString();

    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        return ('Fail ' + error);
  }  
}
exports.GetExtOrgs = GetExtOrgs;

const GetUserByRange = async function(organization,username) {
  try {
      let connection = await connectClient.connectClient(username, organization);
      const network = connection[0];
      const contract = network.getContract('registerloginscdataports');
      const result = await contract.evaluateTransaction('getUsersByRange');
      console.log(`Transaction has been evaluated, result is: ${result.toString()}`);
      return result.toString();

    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        return ('Fail ' + error);
  }  
}

exports.GetUserByRange = GetUserByRange;

const GetOrgByRange = async function(organization,username) {
  try {

      let connection = await connectClient.connectClient(username, organization);
      const network = connection[0];

      // Get the contract from the network.
      const contract = network.getContract('registerloginscdataports');
      const result = await contract.evaluateTransaction('getOrgsByRange');
      console.log(`Transaction has been evaluated, result is: ${result.toString()}`);
      return result;

    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
  }  
}

exports.GetOrgByRange = GetOrgByRange;

const ReturnLoggedInUser = async function(organization,username) {
  try {

      let connection = await connectClient.connectClient(username, organization);
      const network = connection[0];
      // Get the contract from the network.
      const contract = network.getContract('registerloginscdataports');
      const result = await contract.evaluateTransaction('returnLoggedInUser');
      console.log(`Transaction has been evaluated, result is: ${result.toString()}`);
      return result;

    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
  }  
}

exports.ReturnLoggedInUser = ReturnLoggedInUser;


const updateUserInfo = async function(username, organization, newName, newSurname,  newEmail, NewPassword) {
  try {
      const checkEmail = await GetUserByEmail(username, organization, newEmail);
      if (checkEmail === 'Unavailable email'){
        return ('Unavailable email');
      }

      await update_UserInfo.updateUserAttrs(username, organization, newEmail, newName, newSurname);
      let connection = await connectClient.connectClient(username, organization);
      const network = connection[0];
      const gateway = connection[1];

      // Get the contract from the network.
      const contract = network.getContract('registerloginscdataports');

      const result = await contract.submitTransaction('updateUserInfo',username, newName, newSurname,  newEmail, NewPassword);
      console.log(`${result.toString()}`);
      const Connect2metadataApi = await metadataApi.updateUserInfoMetadataHelper(username, organization, newEmail); 
      console.log(Connect2metadataApi);
      console.log('Is searching for values to update on Metadata SC');
      const Connect2dataSharingApi = await dataSharingApi.updateUserInfoDataSharingHelper(username, organization, newName, newSurname);
      console.log(Connect2dataSharingApi);
      console.log('Success');
      await gateway.disconnect();
      return ('Success');


  } catch (error) {
      console.error(`Failed to update user info: ${error}`);
      return ('Fail ' + error);
  }
}

exports.updateUserInfo = updateUserInfo;


const GetUserByEmail = async function(username, organization, email) {
  try {
      console.log('Is searching for available email : %s', email)
      let connection = await connectClient.connectClient(username, organization);
      const network = connection[0];
      // Get the contract from the network.
      const contract = network.getContract('registerloginscdataports');
      const result = await contract.evaluateTransaction('getUserByEmail',email);
      console.log(`The email checked, the result is: ${result.toString()}`);
      const JSON_objest = JSON.parse(result.toString());
      let count = Object.keys(JSON_objest).length;
      if (count === 0){
        return ('Available email');
      }if (count > 0) {
        console.log("The found email");
        console.log("Emails: " + JSON_objest[0]["Record"]["email"])
        if ((JSON_objest[0]["Record"]["email"] === email) && (JSON_objest[0]["Record"]["username"] === username)){
          return ('Available email');
        }
        else{
          return ('Unavailable email')
        }
      }
  } catch (error) {
      console.error(`Failed to evaluate transaction: ${error}`);
  }  
}

exports.GetUserByEmail = GetUserByEmail;

const checkAvailableUsername = async function(network, username) {
  try {
      console.log('Is searching for available username : %s', username)
      const contract = network.getContract('registerloginscdataports');
      const result = await contract.evaluateTransaction('checkAvailableUsername', username);
      console.log(`Transaction has been evaluated, result is: ${result.toString()}`);
      const JSON_objest = JSON.parse(result.toString());
      let count = Object.keys(JSON_objest).length;
      if (count === 0){
        return ('Available username');
      }
      else{
        return ('Unavailable username')
      }
     

  } catch (error) {
      console.error(`Failed to evaluate transaction: ${error}`);
  }  
}
exports.checkAvailableUsername = checkAvailableUsername;

const deactivateAccount = async function(adminusername, adminorg, username) {
  try {
      console.log('Input values:');
      console.log(adminusername, adminorg, username);

      const con_profile = 'connection-'+ adminorg +'.json';
      const ccpPath = path.resolve(__dirname, '..','..', '..', 'Dataports_Global_Network_full/connection-files/', con_profile);
      let wallet_info = '../dataportsappGlobal/app/dataportswallet/' + adminorg 

      // Create a new file system based wallet for managing identities.
      const walletPath = path.join(process.cwd(), wallet_info);
      const wallet = new FileSystemWallet(walletPath);
      console.log(`Wallet path for org user: ${walletPath}`);
      

      // Create a new gateway for connecting to our peer node.
      const gateway = new Gateway();
      await gateway.connect(ccpPath, { wallet, identity: adminusername, discovery: { enabled: true, asLocalhost: true } });
      const network = await gateway.getNetwork('global');
      
      const checkUsername = await checkAvailableUsername(network, username);
      console.log("Username status : " + checkUsername);
      if (checkUsername === 'Available username'){
        return ('Available username');
      }
      // Get the CA client object from the gateway for interacting with the CA.
      const ca = gateway.getClient().getCertificateAuthority();
      const adminIdentity = gateway.getCurrentIdentity();
      const identityService = ca.newIdentityService();

      let rimraf = require("rimraf");
      const dir = process.cwd() + '/app/dataportswallet/' + adminorg +'/' + username;

      identityService.delete(username, adminIdentity, true).then(function() {

      try {
          rimraf.sync(dir);

          console.log(`${dir} is deleted!`);
      }catch (err) {
            console.error(`Error while deleting ${dir}. error:${err}`);
            throw err;
      }
      });

      const callSCfunction = await deactivateAccountSM (adminusername, adminorg, username);
      console.log(callSCfunction);
      if (callSCfunction.includes("Fail")){
        return('Failed to revoke user ' + callSCfunction);

      }
      console.log('Successfully revoked user %s', username);
      return ('The user revoked successfully');
  } catch (error) {
      console.error(`Failed to revoke user %s: ${error}`, username);
      return ('Fail ' + error);
      
  }
}
exports.deactivateAccount = deactivateAccount;

const deactivateAccountSM = async function(adminUsername, adminOrganization, username) {
  try {
      let connection = await connectClient.connectClient(adminUsername, adminOrganization);
      const network = connection[0];
      const gateway = connection[1];

      // Get the contract from the network.
      const contract = network.getContract('registerloginscdataports');
      let status = 'Inactive';
      const result = await contract.submitTransaction('deactivateAccount',username, status);
      console.log(`${result.toString()}`);
      await gateway.disconnect();
      return ('Success');


  } catch (error) {
      console.error(`Failed to deactivate user: ${error}`);
      return ('Fail' + error);
  }
}
exports.deactivateAccountSM = deactivateAccountSM;

const activateAccount = async function(adminUsername, adminOrganization, password, body) {
  try {
      let connection = await connectClient.connectClient(adminUsername, adminOrganization);
      const network = connection[0];
      const gateway = connection[1];

      // Get the contract from the network.
      const contract = network.getContract('registerloginscdataports');
      let status = 'Active';

      console.log("Is activating account...")
      const resultActivate = await contract.submitTransaction('activateAccount', body.username, status);
      console.log("Is updating user info...")
      const resultUpdateInfo = await contract.submitTransaction('updateUserInfo', body.username, body.name, body.surname,  body.email, password);
      console.log(`${resultActivate.toString()}`);
      console.log(`${resultUpdateInfo.toString()}`);
      if (body.usertype == 'user'){
        console.log("Create HLF cred for user")
        await enroll_registerUser.registerOrgUser(adminUsername, adminOrganization, body.usertype, body);
      }else if (body.usertype == 'admin'){
          console.log("Create HLF cred for admin")
          await enroll_registerOrgAdmin.registerOrgAdmin(adminUsername, adminOrganization, body.usertype, body);
      }

      await gateway.disconnect();
      return password;
  } catch (error) {
      console.error(`Failed to activate user info: ${error}`);
      return ('Fail ' + error);
  }
}

exports.activateAccount = activateAccount;

const getActiveAccounts = async function(username, organization) {
  try {
      let connection = await connectClient.connectClient(username, organization);
      const network = connection[0];
      let status = 'Active';
      // Get the contract from the network.
      const contract = network.getContract('registerloginscdataports');
      const result = await contract.evaluateTransaction('queryUsersBasedonStatus',status);
      console.log(`Transaction has been evaluated, result is: ${result.toString()}`);

      return (result);

  } catch (error) {
      console.error(`Failed to evaluate transaction: ${error}`);
      return ('Fail ' + error);
  }
}

exports.getActiveAccounts = getActiveAccounts;

const getInactiveAccounts = async function(username, organization) {
  try {
      let connection = await connectClient.connectClient(username, organization);
      const network = connection[0];
      let status = 'Inactive';
      // Get the contract from the network.
      const contract = network.getContract('registerloginscdataports');
      const result = await contract.evaluateTransaction('queryUsersBasedonStatus',status);
      console.log(`Transaction has been evaluated, result is: ${result.toString()}`);

      return (result);

  } catch (error) {
      console.error(`Failed to evaluate transaction: ${error}`);
      return ('Fail ' + error);
  } 
}

exports.getInactiveAccounts = getInactiveAccounts;

const getActiveAccountsByOrg = async function(username, organization) {
  try {
      let connection = await connectClient.connectClient(username, organization);
      const network = connection[0];
      let status = 'Active';
      // Get the contract from the network.
      const contract = network.getContract('registerloginscdataports');
      const result = await contract.evaluateTransaction('queryUsersBasedonStatusAndOrg',status);
      console.log(`Transaction has been evaluated, result is: ${result.toString()}`);

      return (result);

  } catch (error) {
      console.error(`Failed to evaluate transaction: ${error}`);
      return ('Fail ' + error);
  }  
}
exports.getActiveAccountsByOrg = getActiveAccountsByOrg;

const getInactiveAccountsByOrg = async function(username, organization) {
  try {
      let connection = await connectClient.connectClient(username, organization);
      const network = connection[0];
      let status = 'Inactive';
      // Get the contract from the network.
      const contract = network.getContract('registerloginscdataports');
      const result = await contract.evaluateTransaction('queryUsersBasedonStatusAndOrg',status);
      console.log(`Transaction has been evaluated, result is: ${result.toString()}`);

      return (result);

  } catch (error) {
      console.error(`Failed to evaluate transaction: ${error}`);
      return ('Fail ' + error);
  }  
}

exports.getInactiveAccountsByOrg = getInactiveAccountsByOrg;

const resetPassword = async function(adminUsername, adminOrganization, username, password) {
  try {
      let connection = await connectClient.connectClient(adminUsername, adminOrganization);
      const network = connection[0];
      const gateway = connection[1];

      // Get the contract from the network.
      const contract = network.getContract('registerloginscdataports');

      const result = await contract.submitTransaction('resetPassword',username, password);
      console.log(`${result.toString()}`);
      await gateway.disconnect();
      return password;

  } catch (error) {
      console.error(`Failed to reset password: ${error}`);
      return ('Fail');
  }
}
exports.resetPassword = resetPassword;