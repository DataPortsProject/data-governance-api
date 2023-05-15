
'use strict';
let connectClient = require('./../Helper/connectClient.js');
let datetimeHelper = require('./../Helper/dateTime.js');
let metadata = require('./../Metadata/metadataApi.js');

const { randomUUID } = require('crypto');

function isEmptyObject(obj) {
    for (let key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        return false;
      }
    }
    return true;
  }
  
const getPermissionsByDataSourceID = async function(username, organization, dataSourceID) {
    try {
        const getMetadataByDataSourceID = await metadata.queryMetadataByDataSourceID(username, organization, dataSourceID);
        console.log(getMetadataByDataSourceID);

        let jsonGetMetadataByDataSourceID = JSON.parse(getMetadataByDataSourceID);

        if (jsonGetMetadataByDataSourceID.length < 1) {
            return ('Failed: No metadata found')
        }

        const datasetName = jsonGetMetadataByDataSourceID[0].Record.datasetName;

        if (jsonGetMetadataByDataSourceID[0].Record.usernameOfProvider == username){
            const checkPermissionsProvider = await metadata.queryMetadataByProviderAndDatasetName(username, organization, datasetName);
            console.log(checkPermissionsProvider);

            const accessRights = JSON.parse(checkPermissionsProvider)[0].Record.accessRights;
            const customAccessRights = JSON.parse(checkPermissionsProvider)[0].Record.customAccessRights;

            const result = [...accessRights, ...customAccessRights];
            console.log('The result is:');
            console.log(result);

            return(result);

        }else{        

            console.log('Get permissions for user: %s organization: %s datasetName: %s dataSourceID %s', username, organization, datasetName, dataSourceID);
            let connection = await connectClient.connectClient(username, organization);
            const network = connection[0];
            const gateway = connection[1];

            // Get the contract from the network.
            const contract = network.getContract('datasharingscdataports');
            console.log('Get user-level permission user %s for dataset: %s', username, datasetName)
            const resultOfUserLevel = await contract.evaluateTransaction('querySpecificDatasetPermissionByConsumer', datasetName);
            const resultOfUserLevelObject = JSON.parse(resultOfUserLevel.toString());
            console.log(resultOfUserLevelObject);
            let userLevelPermission = resultOfUserLevelObject.map(function(obj) {
                return [obj.Record.users.permission, obj.Record.users.customAccessRights];
            });
            let mergedUserLevelPermission = [].concat.apply([], userLevelPermission);
            console.log(mergedUserLevelPermission);

            console.log('Get org-level permission user %s for dataset: %s', username, datasetName)
            const resultOfOrgLevel = await contract.evaluateTransaction('queryAccessOrgConsumerByDatasetName', datasetName);
            const resultOfOrgLevelObject = JSON.parse(resultOfOrgLevel.toString());
            console.log(resultOfOrgLevelObject);
            let orgLevelPermission = resultOfOrgLevelObject.map(function(obj) {
                return [obj.Record.permission, obj.Record.customAccessRights];
            });
            let mergedOrgLevelPermission = [].concat.apply([], orgLevelPermission);
            console.log(mergedOrgLevelPermission);

            console.log('Get public-level permission user %s for dataset: %s', username, datasetName)
            const resultOfPublicLevel = await contract.evaluateTransaction('queryPublicDatasetsByDatasetName', datasetName);
            const resultOfPublicLevelObject = JSON.parse(resultOfPublicLevel.toString());
            console.log(resultOfPublicLevelObject);
            let publicLevelPermission = resultOfPublicLevelObject.map(function(obj) {
                return [obj.Record.permission, obj.Record.customAccessRights];
            });
            let mergedPublicLevelPermission = [].concat.apply([], publicLevelPermission);
            console.log(mergedPublicLevelPermission);

            const combined = mergedUserLevelPermission
                .concat(mergedOrgLevelPermission)
                .concat(mergedPublicLevelPermission)
                .filter((value, index, self) => {
                return self.indexOf(value) === index;
            })
            .filter((value) => value !== undefined);

            console.log(combined);
            console.log(combined.length);
            const responseArray = [];

            combined.forEach((arr) => {
            arr.forEach((value) => {
                if (!responseArray.includes(value)) {
                    responseArray.push(value);
                }
            });
            });

            await gateway.disconnect();
            return (responseArray);
        }
        
    } catch (error) {
        console.error(`Failed to get permissions: ${error}`);
        return (`Fail  ${error}`);
    }
}

exports.getPermissionsByDataSourceID = getPermissionsByDataSourceID;  

function removeDuplicates(permissionsArray) {
    let newArrayForDatasets = [];
              
    // Declare an empty object
    let uniqueObject = {};
        
    // Loop for the array elements
    for (let i in permissionsArray) {

        // Extract the title
        let objTitle =permissionsArray[i].Record.dataset_name;
        
        // Use the title as the index
        uniqueObject[objTitle] = permissionsArray[i];
    }
        
    // Loop to push unique object into array
    for (let i in uniqueObject) {
        newArrayForDatasets.push(uniqueObject[i]);
    }
        
    // Display the unique objects
    return(newArrayForDatasets);
}

const getDataSourceIDsForGrantedUser = async function(username, organization) {
    try {
        console.log('Get user-level permission user %s', username)
        const getUserLevelPermissions = await queryDatasetPermissionByAuthorizedUsers(username, organization);

        console.log('Get org-level permission organization %s', organization)
        const getOrgLevelPermissions = await queryAllAccessByOrgConsumer(username, organization);

        console.log('Get public-level permission organization')
        const getPublicLevelPermissions = await queryPublicDatasets(username, organization);

        let permissionsArray = JSON.parse(getUserLevelPermissions).concat(JSON.parse(getOrgLevelPermissions), JSON.parse(getPublicLevelPermissions));

        let uniquePermissionsArray = removeDuplicates(permissionsArray);

        const getMetadataEntities = await metadata.querymetadatastruct(username, organization);

        let commonValuesResult =JSON.parse(getMetadataEntities).filter(function (o1){
            return uniquePermissionsArray.some(function (o2) {
                return o2.Record.dataset_name === o1.Record.datasetName; // return the ones with equal dataset Name
           });
        });
        let resultOfGrantedIDs = commonValuesResult.filter(o => (o.Record.dataSourceMetadata.dataSourceID)).map(a => a.Record.dataSourceMetadata.dataSourceID);

        return (resultOfGrantedIDs);       

    } catch (error) {
        console.error(`Failed to get permissions for all datasets: ${error}`);
        return (`Fail  ${error}`);
    }
}

exports.getDataSourceIDsForGrantedUser = getDataSourceIDsForGrantedUser;  

const authorizeOrgs = async function(username, organization, requestID) {
    try {
        let connection = await connectClient.connectClient(username, organization);
        const network = connection[0];
        const gateway = connection[1];

        let datetime = await datetimeHelper.getDateTime();

        // Get the contract from the network.
        const contract = network.getContract('datasharingscdataports');

        const result = await contract.submitTransaction('authorizeOrgs',requestID, datetime);
        console.log('Authorize user event has been completed');
        await gateway.disconnect();
        return ('Success');
        

    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        return ('Fail');
    }
}

exports.authorizeOrgs = authorizeOrgs;

const authorizeUser = async function(username, organization, requestID) {
    try {
        console.log (requestID);
        let connection = await connectClient.connectClient(username, organization);
        const network = connection[0];
        const gateway = connection[1];

        // Get the contract from the network.
        const contract = network.getContract('datasharingscdataports');
        let datetime = await datetimeHelper.getDateTime(); 

        const result = await contract.submitTransaction('authorizeUsers', requestID, datetime);
        console.log('Authorize user event has been completed');
        console.log(result.toString());
        await gateway.disconnect();
        return ('Success');
        

    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        return ('Fail');
    }
}

exports.authorizeUser = authorizeUser;

const deleteRequest = async function(username, organization, requestID) {
    try {
        console.log(requestID);
        let connection = await connectClient.connectClient(username, organization);
        const network = connection[0];
        const gateway = connection[1];

        let datetime = await datetimeHelper.getDateTime(); 

        // Get the contract from the network.
        const contract = network.getContract('datasharingscdataports');
        
        await contract.submitTransaction('deleteRequest', requestID, datetime);
        console.log('Revoke access is finished');
        await gateway.disconnect();
        return ('Success');

    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        return ('Fail');
    }
}

exports.deleteRequest = deleteRequest;

const deleteRequestOrgs = async function(username, organization, requestID) {
    try {
        console.log(requestID);
        let connection = await connectClient.connectClient(username, organization);
        const network = connection[0];
        const gateway = connection[1];

        let datetime = await datetimeHelper.getDateTime();

        // Get the contract from the network.
        const contract = network.getContract('datasharingscdataports');
        
        await contract.submitTransaction('deleteRequestOrgs', requestID, datetime);
        console.log('Revoke access is finished');
        await gateway.disconnect();
        return ('Success');

    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        return ('Fail');
    }
}

exports.deleteRequestOrgs = deleteRequestOrgs;

const requestAccess = async function(username, organization, datasetname, permission, customAccessRights) {
    try {
        console.log(username, organization, datasetname, permission);
        let connection = await connectClient.connectClient(username, organization);
        const network = connection[0];
        const gateway = connection[1];

        // Get the contract from the network.
        const contract = network.getContract('datasharingscdataports');
        let finalrequestID; 
        while (true){
            finalrequestID = randomUUID();
            const resultidrequest = await contract.evaluateTransaction('getRequestByID', finalrequestID)
            const queryresult = isEmptyObject( resultidrequest);
            if (queryresult === true) {
                console.log('The final request id is %s',finalrequestID) 
                break;
            }
                    
        }
        let datetime = await datetimeHelper.getDateTime();        

        const result = await contract.submitTransaction('requestAccess', finalrequestID, datasetname, permission, datetime,  customAccessRights.toString());
        console.log('The request has been submitted');

        console.log(result)
        await gateway.disconnect();
        return ('Success')

    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        return (`Fail ${error}`);
      }
}

exports.requestAccess = requestAccess;

const requestAccessByOrg = async function(username, organization, datasetname, permission, customAccessRights) {
    try {
        console.log(username, organization, datasetname, permission);
        let connection = await connectClient.connectClient(username, organization);
        const network = connection[0];
        const gateway = connection[1];

        // Get the contract from the network.
        const contract = network.getContract('datasharingscdataports');
        let finalrequestID;
        while (true){
            finalrequestID = randomUUID();
            const resultidrequest = await contract.evaluateTransaction('getRequestByID', finalrequestID)
            const queryresult = isEmptyObject( resultidrequest);
            if (queryresult === true) {
                console.log('The request id is %s',finalrequestID) 
                break;
            }
                    
        }      
        let datetime = await datetimeHelper.getDateTime();
        const result = await contract.submitTransaction('requestAccessByOrg', finalrequestID, datasetname, permission, datetime, customAccessRights.toString());
        console.log('The request has been submitted');

        console.log(result)
        await gateway.disconnect();
        return ('Success');

    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        return ('Fail');
    }
}

exports.requestAccessByOrg = requestAccessByOrg;


const revokeAccess = async function(username, organization, datasetname, permission,usernameofuser, customAccessRights) {
    try {
        let connection = await connectClient.connectClient(username, organization);
        const network = connection[0];
        const gateway = connection[1];

        let datetime = await datetimeHelper.getDateTime(); 

        // Get the contract from the network.
        const contract = network.getContract('datasharingscdataports');       
        const result = await contract.submitTransaction('revokeAccess', datasetname, permission,usernameofuser, datetime, customAccessRights.toString());
        console.log('Revoke access is finished');
        

        console.log(result.toString());
        await gateway.disconnect();
        return ('Success');

    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        return ('Fail');
    }
}

exports.revokeAccess = revokeAccess;

const revokeAccessOrg = async function(username, organization, datasetname, permission,authOrganization, customAccessRights) {
    try {
        let connection = await connectClient.connectClient(username, organization);
        const network = connection[0];
        const gateway = connection[1];

        let datetime = await datetimeHelper.getDateTime();

        // Get the contract from the network.
        const contract = network.getContract('datasharingscdataports');
        
        const result = await contract.submitTransaction('revokeAccessOrg', datasetname, permission, authOrganization, datetime, customAccessRights.toString());
        console.log('Revoke access is finished');
        

        console.log(result.toString());
        await gateway.disconnect();
        return ('Success');

    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        return ('Fail');
    }
}

exports.revokeAccessOrg = revokeAccessOrg;

const revokeDatasetPublic = async function(username, organization, datasetname, permission, customAccessRights) {
    try {
        let connection = await connectClient.connectClient(username, organization);
        const network = connection[0];
        const gateway = connection[1];
        let datetime = await datetimeHelper.getDateTime();

        // Get the contract from the network.
        const contract = network.getContract('datasharingscdataports');
        
        const result = await contract.submitTransaction('revokeDatasetPublic', datasetname, permission, datetime, customAccessRights.toString());
        

        console.log(result.toString())
        await gateway.disconnect();
        return ('Success');

    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        return ('Fail');
    }
}

exports.revokeDatasetPublic = revokeDatasetPublic;

const setDatasetLimits = async function(username, organization, datasetname, date, fee) {
    try {
        let connection = await connectClient.connectClient(username, organization);
        const network = connection[0];
        const gateway = connection[1];

        // Get the contract from the network.
        const contract = network.getContract('datasharingscdataports');
        
        const result = await contract.submitTransaction('setDatasetLimits', datasetname, date, fee);
        

        console.log(result)
        await gateway.disconnect();
        return ('Success');

    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        return ('Fail');
    }
}

exports.setDatasetLimits = setDatasetLimits;


const setDatasetPublic = async function(username, organization, datasetname, permission, customAccessRights) {
    try {
        let connection = await connectClient.connectClient(username, organization);
        const network = connection[0];
        const gateway = connection[1];

        // Get the contract from the network.
        const contract = network.getContract('datasharingscdataports');
        let datetime = await datetimeHelper.getDateTime();
        const result = await contract.submitTransaction('setDatasetPublic', datasetname, permission, datetime, customAccessRights.toString());
        

        console.log(result.toString())
        await gateway.disconnect();
        return ('Success');

    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        return (error.toString());
    }
}

exports.setDatasetPublic = setDatasetPublic;

const queryAllAccessByOrgConsumer = async function(username, organization) {
    try {
        let connection = await connectClient.connectClient(username, organization);
        const network = connection[0];
        const gateway = connection[1];

        // Get the contract from the network.
        const contract = network.getContract('datasharingscdataports');

        const result = await contract.evaluateTransaction('queryAllAccessByOrgConsumer');

        await gateway.disconnect();
        console.log(result.toString());
        return result.toString();

    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
    }
}

exports.queryAllAccessByOrgConsumer = queryAllAccessByOrgConsumer;

const queryAllAccessByOrgProvider = async function(username, organization) {
    try {
        let connection = await connectClient.connectClient(username, organization);
        const network = connection[0];
        const gateway = connection[1];

        // Get the contract from the network.
        const contract = network.getContract('datasharingscdataports');

        const result = await contract.evaluateTransaction('queryAllAccessByOrgProvider');
        await gateway.disconnect();
        console.log(result.toString());
        return result.toString();

    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
    }
}

exports.queryAllAccessByOrgProvider = queryAllAccessByOrgProvider;

const queryAllAccessRequestsByOrgConsumer = async function(username, organization) {
    try {
        let connection = await connectClient.connectClient(username, organization);
        const network = connection[0];
        const gateway = connection[1];

        // Get the contract from the network.
        const contract = network.getContract('datasharingscdataports');

        const result = await contract.evaluateTransaction('queryAllAccessRequestsByOrgConsumer');

        console.log(result.toString());
        await gateway.disconnect();
        return result.toString();

    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
    }
}

exports.queryAllAccessRequestsByOrgConsumer = queryAllAccessRequestsByOrgConsumer;

const queryAllAccessRequestsByOrgProvider = async function(username, organization) {
    try {
        let connection = await connectClient.connectClient(username, organization);
        const network = connection[0];
        const gateway = connection[1];

        // Get the contract from the network.
        const contract = network.getContract('datasharingscdataports');

        const result = await contract.evaluateTransaction('queryAllAccessRequestsByOrgProvider');

        console.log(result.toString());
        await gateway.disconnect();
        return result.toString();

    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
    }
}

exports.queryAllAccessRequestsByOrgProvider = queryAllAccessRequestsByOrgProvider;

const queryAccessRequestsOrgConsumerByDatasetName = async function(username, organization, datasetname) {
    try {
        let connection = await connectClient.connectClient(username, organization);
        const network = connection[0];
        const gateway = connection[1];

        // Get the contract from the network.
        const contract = network.getContract('datasharingscdataports');

        const result = await contract.evaluateTransaction('queryAccessRequestsOrgConsumerByDatasetName', datasetname);

        console.log(result.toString());
        await gateway.disconnect();
        return result.toString();

    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
    }
}

exports.queryAccessRequestsOrgConsumerByDatasetName = queryAccessRequestsOrgConsumerByDatasetName;

const queryAccessRequestsOrgProviderByDatasetName = async function(username, organization, datasetname) {
    try {
        let connection = await connectClient.connectClient(username, organization);
        const network = connection[0];
        const gateway = connection[1];

        // Get the contract from the network.
        const contract = network.getContract('datasharingscdataports');

        const result = await contract.evaluateTransaction('queryAccessRequestsOrgProviderByDatasetName', datasetname);

        console.log(result.toString());
        await gateway.disconnect();
        return result.toString();

    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
    }
}

exports.queryAccessRequestsOrgProviderByDatasetName = queryAccessRequestsOrgProviderByDatasetName;

const queryAccessOrgConsumerByDatasetName = async function(username, organization, datasetname) {
    try {
        let connection = await connectClient.connectClient(username, organization);
        const network = connection[0];
        const gateway = connection[1];

        // Get the contract from the network.
        const contract = network.getContract('datasharingscdataports');

        const result = await contract.evaluateTransaction('queryAccessOrgConsumerByDatasetName', datasetname);

        console.log(result.toString());
        await gateway.disconnect();
        return result.toString();

    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
    }
}

exports.queryAccessOrgConsumerByDatasetName = queryAccessOrgConsumerByDatasetName;


const queryAccessOrgProviderByDatasetName = async function(username, organization, datasetname) {
    try {
        let connection = await connectClient.connectClient(username, organization);
        const network = connection[0];
        const gateway = connection[1];

        // Get the contract from the network.
        const contract = network.getContract('datasharingscdataports');

        const result = await contract.evaluateTransaction('queryAccessOrgProviderByDatasetName', datasetname);

        console.log(result.toString());
        await gateway.disconnect();
        return result.toString();

    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
    }
}

exports.queryAccessOrgProviderByDatasetName = queryAccessOrgProviderByDatasetName;


const queryPublicDatasetsByProvider = async function(username, organization) {
    try {
        let connection = await connectClient.connectClient(username, organization);
        const network = connection[0];
        const gateway = connection[1];

        // Get the contract from the network.
        const contract = network.getContract('datasharingscdataports');

        const result = await contract.evaluateTransaction('queryPublicDatasetsByProvider');

        console.log(result.toString());
        await gateway.disconnect();
        return result.toString();

    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
    }
}

exports.queryPublicDatasetsByProvider = queryPublicDatasetsByProvider;

const queryPublicDatasets = async function(username, organization) {
    try {
        let connection = await connectClient.connectClient(username, organization);
        const network = connection[0];
        const gateway = connection[1];

        // Get the contract from the network.
        const contract = network.getContract('datasharingscdataports');

        const result = await contract.evaluateTransaction('queryPublicDatasets');

        console.log(result.toString());
        await gateway.disconnect();
        return result.toString();

    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
    }
}

exports.queryPublicDatasets = queryPublicDatasets;

const queryPublicDatasetsByDatasetName = async function(username, organization,datasetName) {
    try {
        console.log('The inputs for queryPublicDatasetsByDatasetName function are: ',username, organization,datasetName);
        let connection = await connectClient.connectClient(username, organization);
        const network = connection[0];
        const gateway = connection[1];

        // Get the contract from the network.
        const contract = network.getContract('datasharingscdataports');

        const result = await contract.evaluateTransaction('queryPublicDatasetsByDatasetName', datasetName);

        console.log(result.toString());
        await gateway.disconnect();
        return result.toString();

    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
    }
}

exports.queryPublicDatasetsByDatasetName = queryPublicDatasetsByDatasetName;

const queryDatasetPermissionForOrgUserByOrgAdmin = async function(username, organization) {
    try {
        let connection = await connectClient.connectClient(username, organization);
        const network = connection[0];
        const gateway = connection[1];

        // Get the contract from the network.
        const contract = network.getContract('datasharingscdataports');

        const result = await contract.evaluateTransaction('queryDatasetPermissionForOrgUserByOrgAdmin');

        console.log(result.toString());
        await gateway.disconnect();
        return result.toString();

    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
    }
}

exports.queryDatasetPermissionForOrgUserByOrgAdmin = queryDatasetPermissionForOrgUserByOrgAdmin;

const querySpecificDatasetPermissionByProvider = async function(username, organization, datasetname) {
    try {
        let connection = await connectClient.connectClient(username, organization);
        const network = connection[0];
        const gateway = connection[1];
 

        // Get the contract from the network.
        const contract = network.getContract('datasharingscdataports');

        const result = await contract.evaluateTransaction('querySpecificDatasetPermissionByProvider', datasetname);

        console.log(result.toString());
        await gateway.disconnect();
        return result.toString();

    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
    }
}

exports.querySpecificDatasetPermissionByProvider = querySpecificDatasetPermissionByProvider;

const queryAllAccessRequestsProvider = async function(username, organization) {
    try {
        let connection = await connectClient.connectClient(username, organization);
        const network = connection[0];
        const gateway = connection[1];

        // Get the contract from the network.
        const contract = network.getContract('datasharingscdataports');

        const result = await contract.evaluateTransaction('queryAllAccessRequestsProvider');

        console.log(result.toString());
        await gateway.disconnect();
        return result.toString();

    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
    }
}

exports.queryAllAccessRequestsProvider = queryAllAccessRequestsProvider;

const queryAllAccessRequestsConsumer = async function(username, organization) {
    try {
        let connection = await connectClient.connectClient(username, organization);
        const network = connection[0];
        const gateway = connection[1];

        // Get the contract from the network.
        const contract = network.getContract('datasharingscdataports');

        const result = await contract.evaluateTransaction('queryAllAccessRequestsConsumer');

        console.log(result.toString());
        await gateway.disconnect();
        return result.toString();

    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
    }
}

exports.queryAllAccessRequestsConsumer = queryAllAccessRequestsConsumer;


const queryAccessRequestsProviderByName = async function(username, organization, datasetname) {
    try {
        let connection = await connectClient.connectClient(username, organization);
        const network = connection[0];
        const gateway = connection[1];
 

        // Get the contract from the network.
        const contract = network.getContract('datasharingscdataports');

        const result = await contract.evaluateTransaction('queryAccessRequestsProviderByName', datasetname);

        console.log(result.toString());
        await gateway.disconnect();
        return result.toString();

    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
    }
}

exports.queryAccessRequestsProviderByName = queryAccessRequestsProviderByName;

const queryDatasetPermissionByProvider = async function(username, organization) {
    try {
        let connection = await connectClient.connectClient(username, organization);
        const network = connection[0];
        const gateway = connection[1];

        // Get the contract from the network.
        const contract = network.getContract('datasharingscdataports');

        const result = await contract.evaluateTransaction('queryDatasetPermissionByProvider');

        console.log(result.toString());
        await gateway.disconnect();
        return result.toString();

    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
    }
}

exports.queryDatasetPermissionByProvider = queryDatasetPermissionByProvider;

const queryDatasetPermissionByAuthorizedUsers = async function(username, organization) {
    try {
        let connection = await connectClient.connectClient(username, organization);
        const network = connection[0];
        const gateway = connection[1];

        // Get the contract from the network.
        const contract = network.getContract('datasharingscdataports');
        
        const result = await contract.evaluateTransaction('queryDatasetPermissionByAuthorizedUsers');
        console.log('The query result is:');

        console.log(result.toString());
        await gateway.disconnect();
        return result.toString();

    } catch (error) {
        console.error(`Failed to query: ${error}`);
    }
}

exports.queryDatasetPermissionByAuthorizedUsers = queryDatasetPermissionByAuthorizedUsers;

const queryDatasetLimitByName = async function(username, organization, datasetname) {
    try {
        let connection = await connectClient.connectClient(username, organization);
        const network = connection[0];
        const gateway = connection[1];

        // Get the contract from the network.
        const contract = network.getContract('datasharingscdataports');

        const result = await contract.evaluateTransaction('queryDatasetLimitByName',datasetname);

        console.log(result.toString());
        await gateway.disconnect();
        return result.toString();

    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
    }
}

const updateUserInfoDataSharing = async function(jsonObject, connectedUser, connectedOrgofUser, newName, newSurname) {
    try {
        let count = Object.keys(jsonObject).length;
        console.log(count);
        let connection = await connectClient.connectClient(connectedUser, connectedOrgofUser);
            const network = connection[0];
            const gateway = connection[1];
        for (count in jsonObject) { 
            let datasetKey = jsonObject[count].Key ;
            console.log(datasetKey);
            const contract = network.getContract('datasharingscdataports');

            const result = await contract.submitTransaction('updateInfoAuthorizeUsers', datasetKey, newName, newSurname);
    
            console.log(result)
                        
          }
 

          await gateway.disconnect();
          return ('Success')
                      

    } catch (error) {
        console.error(`Failed to update user info(DataGovernanceSC): ${error}`);
    }
}
exports.updateUserInfoDataSharing = updateUserInfoDataSharing;


const updateUserInfoDataSharingHelper = async function(username, organization, newName, newSurname) {
    try {
        let connection = await connectClient.connectClient(username, organization);
        const network = connection[0];
        const gateway = connection[1];
 

        // Get the contract from the network.
        const contract = network.getContract('datasharingscdataports');

        const result = await contract.evaluateTransaction('queryDatasetPermissionByAuthorizedUsers');

        const resultJSON = JSON.parse(result)
        console.log(result.toString());
        await updateUserInfoDataSharing(resultJSON, username, organization, newName, newSurname)
        await gateway.disconnect();
        return result.toString();

    } catch (error) {
        console.error(`Failed to query: ${error}`);
    }
}

exports.updateUserInfoDataSharingHelper = updateUserInfoDataSharingHelper;

exports.queryDatasetLimitByName = queryDatasetLimitByName;

const getPermissionsByProviderAndDataset = async function(username, organization, datasetName) {
    try {
        let connection = await connectClient.connectClient(username, organization);
        const network = connection[0];
        const gateway = connection[1];

        // Get the contract from the network.
        const contract = network.getContract('datasharingscdataports');

        const result = await contract.evaluateTransaction('getPermissionsByProviderAndDataset',datasetName);

        console.log(result.toString());
        await gateway.disconnect();
        return result.toString();
        

    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        return ('Fail');
    }
}
exports.getPermissionsByProviderAndDataset = getPermissionsByProviderAndDataset;


const queryAllAccessRevokeByOrgConsumer = async function(username, organization) {
    try {
        let connection = await connectClient.connectClient(username, organization);
        const network = connection[0];
        const gateway = connection[1];

        // Get the contract from the network.
        const contract = network.getContract('datasharingscdataports');

        const result = await contract.evaluateTransaction('queryAllAccessRevokeByOrgConsumer');

        console.log(result.toString());
        await gateway.disconnect();
        return result.toString();

    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
    }
}

exports.queryAllAccessRevokeByOrgConsumer = queryAllAccessRevokeByOrgConsumer;

const queryAccessRevokeOrgConsumerByDatasetName = async function(username, organization, datasetname) {
    try {
        let connection = await connectClient.connectClient(username, organization);
        const network = connection[0];
        const gateway = connection[1];

        // Get the contract from the network.
        const contract = network.getContract('datasharingscdataports');

        const result = await contract.evaluateTransaction('queryAccessRevokeOrgConsumerByDatasetName', datasetname);

        console.log(result.toString());
        await gateway.disconnect();
        return result.toString();

    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
    }
}

exports.queryAccessRevokeOrgConsumerByDatasetName = queryAccessRevokeOrgConsumerByDatasetName;

const queryAllRevokeAccessByOrgProvider = async function(username, organization) {
    try {
        let connection = await connectClient.connectClient(username, organization);
        const network = connection[0];
        const gateway = connection[1];

        // Get the contract from the network.
        const contract = network.getContract('datasharingscdataports');

        const result = await contract.evaluateTransaction('queryAllRevokeAccessByOrgProvider');

        console.log(result.toString());
        await gateway.disconnect();
        return result.toString();

    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
    }
}

exports.queryAllRevokeAccessByOrgProvider = queryAllRevokeAccessByOrgProvider;

const queryAccessRevokeOrgProviderByDatasetName = async function(username, organization, datasetname) {
    try {
        let connection = await connectClient.connectClient(username, organization);
        const network = connection[0];
        const gateway = connection[1];

        // Get the contract from the network.
        const contract = network.getContract('datasharingscdataports');

        const result = await contract.evaluateTransaction('queryAccessRevokeOrgProviderByDatasetName', datasetname);

        console.log(result.toString());
        await gateway.disconnect();
        return result.toString();

    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
    }
}

exports.queryAccessRevokeOrgProviderByDatasetName = queryAccessRevokeOrgProviderByDatasetName;

const requestRevokeAccessByOrg = async function(username, organization, datasetname, permission, customAccessRights) {
    try {
        console.log(username, organization, datasetname, permission);
        let connection = await connectClient.connectClient(username, organization);
        const network = connection[0];
        const gateway = connection[1];

        // Get the contract from the network.
        const contract = network.getContract('datasharingscdataports');
        let finalrequestID;
        while (true){
            finalrequestID = randomUUID();
            const resultidrequest = await contract.evaluateTransaction('getRequestByID', finalrequestID)
            const queryresult = isEmptyObject( resultidrequest);
            if (queryresult === true) {
                console.log('The request id is %s',finalrequestID) 
                break;
            }       
        }        
        let datetime = await datetimeHelper.getDateTime();
        const result = await contract.submitTransaction('requestRevokeAccessByOrg', finalrequestID, datasetname, permission, datetime, customAccessRights.toString());
        console.log('The request has been submitted');

        console.log(result)
        await gateway.disconnect();
        return ('Success');

    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        return ('Fail');
    }
}

exports.requestRevokeAccessByOrg = requestRevokeAccessByOrg;

const revokeAccessByOrgFromRequest = async function(username, organization, requestID) {
    try {
        let connection = await connectClient.connectClient(username, organization);
        const network = connection[0];
        const gateway = connection[1];

        // Get the contract from the network.
        const contract = network.getContract('datasharingscdataports');

        const result = await contract.evaluateTransaction('getRequestByID', requestID);

        const infoFromRevokeRequest = JSON.parse(result);
        console.log(result.toString());
        console.log(typeof(result))
        console.log(infoFromRevokeRequest.dataset_name);
        console.log(infoFromRevokeRequest.organization);
        console.log(infoFromRevokeRequest.permission);
        console.log(infoFromRevokeRequest.customAccessRights);
        await deleteRequestOrgs(username, organization, requestID);
        await revokeAccessOrg(username, organization, infoFromRevokeRequest.dataset_name, infoFromRevokeRequest.permission, infoFromRevokeRequest.organization, infoFromRevokeRequest.customAccessRights.toString());
        await gateway.disconnect();
        return 'Success';

    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        return ('Fail');
    }
}

exports.revokeAccessByOrgFromRequest  = revokeAccessByOrgFromRequest ;

const requestRevokeAccessByUser = async function(username, organization, datasetname, permission, customAccessRights) {
    try {
        console.log(username, organization, datasetname, permission);
        let connection = await connectClient.connectClient(username, organization);
        const network = connection[0];
        const gateway = connection[1];

        // Get the contract from the network.
        const contract = network.getContract('datasharingscdataports');
        let finalrequestID;
        while (true){
            finalrequestID = randomUUID();
            const resultidrequest = await contract.evaluateTransaction('getRequestByID', finalrequestID)
            const queryresult = isEmptyObject( resultidrequest);
            if (queryresult === true) {
                console.log('The request id is %s',finalrequestID) 
                break;
            }
                    
        }     
        let datetime = await datetimeHelper.getDateTime();
        const result = await contract.submitTransaction('requestRevokeAccess', finalrequestID, datasetname, permission, datetime, customAccessRights.toString());
        console.log('The request has been submitted');

        console.log(result)
        await gateway.disconnect();
        return ('Success');

    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        return ('Fail');
    }
}

exports.requestRevokeAccessByUser = requestRevokeAccessByUser;


const revokeAccessByUserFromRequest = async function(username, organization, requestID) {
    try {
        let connection = await connectClient.connectClient(username, organization);
        const network = connection[0];
        const gateway = connection[1];

        // Get the contract from the network.
        const contract = network.getContract('datasharingscdataports');

        const result = await contract.evaluateTransaction('getRequestByID', requestID);

        const infoFromRevokeRequest = JSON.parse(result);
        console.log(result.toString());
        await deleteRequest(username, organization, requestID);
        console.log('The info from request:');
        console.log(username, organization, infoFromRevokeRequest.dataset_name, infoFromRevokeRequest.permission, infoFromRevokeRequest.username, infoFromRevokeRequest.customAccessRights);
        await revokeAccess(username, organization, infoFromRevokeRequest.dataset_name, infoFromRevokeRequest.permission, infoFromRevokeRequest.username, infoFromRevokeRequest.customAccessRights);
        await gateway.disconnect();
        return 'Success';

    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        return ('Fail');
    }
}

exports.revokeAccessByUserFromRequest  = revokeAccessByUserFromRequest ;

const queryAllRevokeAccessByUserProvider = async function(username, organization) {
    try {
        let connection = await connectClient.connectClient(username, organization);
        const network = connection[0];
        const gateway = connection[1];

        // Get the contract from the network.
        const contract = network.getContract('datasharingscdataports');

        const result = await contract.evaluateTransaction('queryAllRevokeAccessByUserProvider');

        console.log(result.toString());
        await gateway.disconnect();
        return result.toString();

    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
    }
}

exports.queryAllRevokeAccessByUserProvider = queryAllRevokeAccessByUserProvider;

const queryAccessRevokeUserProviderByDatasetName = async function(username, organization, datasetname) {
    try {
        let connection = await connectClient.connectClient(username, organization);
        const network = connection[0];
        const gateway = connection[1];

        // Get the contract from the network.
        const contract = network.getContract('datasharingscdataports');

        const result = await contract.evaluateTransaction('queryAccessRevokeUserProviderByDatasetName', datasetname);

        console.log(result.toString());
        await gateway.disconnect();
        return result.toString();

    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
    }
}

exports.queryAccessRevokeUserProviderByDatasetName = queryAccessRevokeUserProviderByDatasetName;

const queryAllAccessRevokeByUserConsumer = async function(username, organization) {
    try {
        let connection = await connectClient.connectClient(username, organization);
        const network = connection[0];
        const gateway = connection[1];

        // Get the contract from the network.
        const contract = network.getContract('datasharingscdataports');

        const result = await contract.evaluateTransaction('queryAllAccessRevokeByUserConsumer');

        console.log(result.toString());
        await gateway.disconnect();
        return result.toString();

    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
    }
}

exports.queryAllAccessRevokeByUserConsumer = queryAllAccessRevokeByUserConsumer;

const queryAccessRevokeUserConsumerByDatasetName = async function(username, organization, datasetname) {
    try {
        let connection = await connectClient.connectClient(username, organization);
        const network = connection[0];
        const gateway = connection[1];

        // Get the contract from the network.
        const contract = network.getContract('datasharingscdataports');

        const result = await contract.evaluateTransaction('queryAccessRevokeUserConsumerByDatasetName', datasetname);

        console.log(result.toString());
        await gateway.disconnect();
        return result.toString();

    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
    }
}

exports.queryAccessRevokeUserConsumerByDatasetName = queryAccessRevokeUserConsumerByDatasetName;
