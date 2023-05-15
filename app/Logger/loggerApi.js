
'use strict';

let connectClient = require('./../Helper/connectClient.js');

//QueryMetadata History
const queryLoggerMetadata = async function(username, organization) {
    try {
        console.log(username, organization);
        let connection = await connectClient.connectClient(username, organization);
        const network = connection[0];

        // Get the contract from the network.
        const contract = network.getContract('logger');
  
        const result = await contract.evaluateTransaction('queryLoggerMetadata');        console.log(result.toString());
        return result.toString();

    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
    }    
}

exports.queryLoggerMetadata = queryLoggerMetadata;

//User level-Requests access-History
//Query regarding the access requests-Provider
const queryAccessRequestsProvider = async function(username, organization) {
    try {
        console.log(username, organization);
        let connection = await connectClient.connectClient(username, organization);
        const network = connection[0];

        // Get the contract from the network.
        const contract = network.getContract('logger');
  
        const result = await contract.evaluateTransaction('queryLoggerAccessProvider');        console.log(result.toString());
        return result.toString();

    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
    }
    
}
exports.queryAccessRequestsProvider = queryAccessRequestsProvider;

//Query regarding the access requests by dataset -Provider
const queryAccessRequestsProviderByDataset = async function(username, organization, datasetName) {
    try {
        console.log(username, organization);
        let connection = await connectClient.connectClient(username, organization);
        const network = connection[0];

        // Get the contract from the network.
        const contract = network.getContract('logger');
  
        const result = await contract.evaluateTransaction('queryLoggerAccessProviderByDatasetName', datasetName);        console.log(result.toString());
        return result.toString();

    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
    }
    
}
exports.queryAccessRequestsProviderByDataset = queryAccessRequestsProviderByDataset;

//Query regarding the access requests-Consumer
const queryAccessRequestsConsumer = async function(username, organization) {
    try {
        console.log(username, organization);
        let connection = await connectClient.connectClient(username, organization);
        const network = connection[0];

        // Get the contract from the network.
        const contract = network.getContract('logger');  
        const result = await contract.evaluateTransaction('queryLoggerAccessConsumer');       
        console.log(result.toString());
        return result.toString();

    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
    }
    
}
exports.queryAccessRequestsConsumer = queryAccessRequestsConsumer;

//Query regarding the access requests by dataset-Consumer
const queryAccessRequestsConsumerByDataset = async function(username, organization, datasetName) {
    try {
        console.log(username, organization);
        let connection = await connectClient.connectClient(username, organization);
        const network = connection[0];

        // Get the contract from the network.
        const contract = network.getContract('logger');  
        const result = await contract.evaluateTransaction('queryLoggerAccessConsumerByDatasetName', datasetName);        console.log(result.toString());
        return result.toString();

    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
    }
    
}
exports.queryAccessRequestsConsumerByDataset = queryAccessRequestsConsumerByDataset;

//Organization level-Requests access-History
//Query regarding the access requests-Provider
const queryAccessRequestsOrgProvider = async function(username, organization) {
    try {
        console.log(username, organization);
        let connection = await connectClient.connectClient(username, organization);
        const network = connection[0];

        // Get the contract from the network.
        const contract = network.getContract('logger');  
        const result = await contract.evaluateTransaction('queryLoggerAccessOrgProvider');        console.log(result.toString());
        return result.toString();

    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
    }
    
}
exports.queryAccessRequestsOrgProvider = queryAccessRequestsOrgProvider;

//Query regarding the access requests by dataset -Provider
const queryAccessRequestsOrgProviderByDataset = async function(username, organization, datasetName) {
    try {
        console.log(username, organization);
        let connection = await connectClient.connectClient(username, organization);
        const network = connection[0];

        // Get the contract from the network.
        const contract = network.getContract('logger');  
        const result = await contract.evaluateTransaction('queryLoggerAccessOrgProviderByDatasetName', datasetName);        console.log(result.toString());
        return result.toString();

    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
    }
    
}
exports.queryAccessRequestsOrgProviderByDataset = queryAccessRequestsOrgProviderByDataset;

//Query regarding the access requests-Consumer
const queryAccessRequestsOrgConsumer = async function(username, organization) {
    try {
        console.log(username, organization);
        let connection = await connectClient.connectClient(username, organization);
        const network = connection[0];

        // Get the contract from the network.
        const contract = network.getContract('logger');  
        const result = await contract.evaluateTransaction('queryLoggerAccessOrgConsumer');        console.log(result.toString());
        return result.toString();

    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
    }
    
}
exports.queryAccessRequestsOrgConsumer = queryAccessRequestsOrgConsumer;

//Query regarding the access requests by dataset-Consumer
const queryAccessRequestsOrgConsumerByDataset = async function(username, organization, datasetName) {
    try {
        console.log(username, organization);
        let connection = await connectClient.connectClient(username, organization);
        const network = connection[0];

        // Get the contract from the network.
        const contract = network.getContract('logger');  
        const result = await contract.evaluateTransaction('queryLoggerAccessOrgConsumerByDatasetName', datasetName);        console.log(result.toString());
        return result.toString();

    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
    }
    
}
exports.queryAccessRequestsOrgConsumerByDataset = queryAccessRequestsOrgConsumerByDataset;

//User level-Revoked Access-History
//Query revoked Access-Provider
const queryRevokedAccessProvider = async function(username, organization) {
    try {
        console.log(username, organization);
        let connection = await connectClient.connectClient(username, organization);
        const network = connection[0];

        // Get the contract from the network.
        const contract = network.getContract('logger');  
        const result = await contract.evaluateTransaction('queryLoggerRevokedAccessProvider');        console.log(result.toString());
        return result.toString();

    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
    }
    
}
exports.queryRevokedAccessProvider = queryRevokedAccessProvider;

//Query revoked the access by dataset-Provider
const queryRevokedAccessProviderByDataset = async function(username, organization, datasetName) {
    try {
        console.log(username, organization);
        let connection = await connectClient.connectClient(username, organization);
        const network = connection[0];

        // Get the contract from the network.
        const contract = network.getContract('logger');  
        const result = await contract.evaluateTransaction('queryLoggerRevokedAccessProviderByDatasetName', datasetName);        console.log(result.toString());
        return result.toString();

    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
    }
    
}
exports.queryRevokedAccessProviderByDataset = queryRevokedAccessProviderByDataset;

//Query revoked the access-Consumer
const queryRevokedAccessConsumer = async function(username, organization) {
    try {
        console.log(username, organization);
        let connection = await connectClient.connectClient(username, organization);
        const network = connection[0];

        // Get the contract from the network.
        const contract = network.getContract('logger');  
        const result = await contract.evaluateTransaction('queryLoggerRevokedAccessConsumer');        console.log(result.toString());
        return result.toString();

    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
    }
    
}
exports.queryRevokedAccessConsumer = queryRevokedAccessConsumer;

//Query revoked the access by dataset-Consumer
const queryRevokedAccessConsumerByDataset = async function(username, organization, datasetName) {
    try {
        console.log(username, organization);
        let connection = await connectClient.connectClient(username, organization);
        const network = connection[0];

        // Get the contract from the network.
        const contract = network.getContract('logger');  
        const result = await contract.evaluateTransaction('queryLoggerRevokedAccessConsumerByDatasetName', datasetName);        console.log(result.toString());
        return result.toString();

    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
    }
    
}
exports.queryRevokedAccessConsumerByDataset = queryRevokedAccessConsumerByDataset;

//Organization level-Revoked Access-History
//Query revoked the access-Provider
const queryRevokedAccessOrgProvider = async function(username, organization) {
    try {
        console.log(username, organization);
        let connection = await connectClient.connectClient(username, organization);
        const network = connection[0];

        // Get the contract from the network.
        const contract = network.getContract('logger');  
        const result = await contract.evaluateTransaction('queryLoggerRevokedAccessOrgProvider');        console.log(result.toString());
        return result.toString();

    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
    }
    
}
exports.queryRevokedAccessOrgProvider = queryRevokedAccessOrgProvider;

//Query revoked the access by dataset-Provider
const queryRevokedAccessOrgProviderByDataset = async function(username, organization, datasetName) {
    try {
        console.log(username, organization);
        let connection = await connectClient.connectClient(username, organization);
        const network = connection[0];

        // Get the contract from the network.
        const contract = network.getContract('logger');  
        const result = await contract.evaluateTransaction('queryLoggerRevokedAccessOrgProviderByDatasetName', datasetName);        console.log(result.toString());
        return result.toString();

    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
    }
    
}
exports.queryRevokedAccessOrgProviderByDataset = queryRevokedAccessOrgProviderByDataset;

//Query revoked the access-Consumer
const queryRevokedAccessOrgConsumer = async function(username, organization) {
    try {
        console.log(username, organization);
        let connection = await connectClient.connectClient(username, organization);
        const network = connection[0];

        // Get the contract from the network.
        const contract = network.getContract('logger');  
        const result = await contract.evaluateTransaction('queryLoggerRevokedAccessOrgConsumer');        console.log(result.toString());
        return result.toString();

    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
    }
    
}
exports.queryRevokedAccessOrgConsumer = queryRevokedAccessOrgConsumer;

//Query revoked the access by dataset-Provider
const queryRevokedAccessOrgConsumerByDataset = async function(username, organization, datasetName) {
    try {
        console.log(username, organization);
        let connection = await connectClient.connectClient(username, organization);
        const network = connection[0];

        // Get the contract from the network.
        const contract = network.getContract('logger');  
        const result = await contract.evaluateTransaction('queryLoggerRevokedAccessOrgConsumerByDatasetName', datasetName);        console.log(result.toString());
        return result.toString();

    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
    }
    
}
exports.queryRevokedAccessOrgConsumerByDataset = queryRevokedAccessOrgConsumerByDataset;

//Logger-Public access
//Query revoked public access-Provider
const queryLoggerRevokedAccessPublicProvider = async function(username, organization) {
    try {
        console.log(username, organization);
        let connection = await connectClient.connectClient(username, organization);
        const network = connection[0];

        // Get the contract from the network.
        const contract = network.getContract('logger'); 
        const result = await contract.evaluateTransaction('queryLoggerRevokedAccessPublicProvider');        console.log(result.toString());
        return result.toString();

    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
    }
    
}
exports.queryLoggerRevokedAccessPublicProvider = queryLoggerRevokedAccessPublicProvider;

//Query revoked public access by dataset-Provider
const queryLoggerRevokedAccessPublicProviderByDatasetName = async function(username, organization, datasetName) {
    try {
        console.log(username, organization);
        let connection = await connectClient.connectClient(username, organization);
        const network = connection[0];

        // Get the contract from the network.
        const contract = network.getContract('logger');  
        const result = await contract.evaluateTransaction('queryLoggerRevokedAccessPublicProviderByDatasetName', datasetName);        console.log(result.toString());
        return result.toString();

    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
    }
    
}
exports.queryLoggerRevokedAccessPublicProviderByDatasetName = queryLoggerRevokedAccessPublicProviderByDatasetName;

//Query revoked public access-Consumer
const queryLoggerAllRevokedAccessPublic = async function(username, organization) {
    try {
        console.log(username, organization);
        let connection = await connectClient.connectClient(username, organization);
        const network = connection[0];

        // Get the contract from the network.
        const contract = network.getContract('logger');  
        const result = await contract.evaluateTransaction('queryLoggerAllRevokedAccessPublic');        console.log(result.toString());
        return result.toString();

    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
    }
    
}
exports.queryLoggerAllRevokedAccessPublic = queryLoggerAllRevokedAccessPublic;

//Query revoked public access by dataset-Consumer
const queryLoggerAllRevokedAccessPublicByDatasetName = async function(username, organization, datasetName) {
    try {
        console.log(username, organization);
        let connection = await connectClient.connectClient(username, organization);
        const network = connection[0];

        // Get the contract from the network.
        const contract = network.getContract('logger');  
        const result = await contract.evaluateTransaction('queryLoggerAllRevokedAccessPublicByDatasetName', datasetName);       
        console.log(result.toString());
        return result.toString();

    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
    }
    
}
exports.queryLoggerAllRevokedAccessPublicByDatasetName = queryLoggerAllRevokedAccessPublicByDatasetName;

//Query public access-Consumer
const queryLoggerAllAccessPublic = async function(username, organization) {
    try {
        console.log(username, organization);
        let connection = await connectClient.connectClient(username, organization);
        const network = connection[0];

        // Get the contract from the network.
        const contract = network.getContract('logger');  
        const result = await contract.evaluateTransaction('queryLoggerAllAccessPublic');        console.log(result.toString());
        return result.toString();

    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
    }
    
}
exports.queryLoggerAllAccessPublic = queryLoggerAllAccessPublic;

//Query public access by dataset name-Consumer
const queryLoggerAllAccessPublicByDatasetName = async function(username, organization, datasetName) {
    try {
        console.log(username, organization);
        let connection = await connectClient.connectClient(username, organization);
        const network = connection[0];

        // Get the contract from the network.
        const contract = network.getContract('logger');  
        const result = await contract.evaluateTransaction('queryLoggerAllAccessPublicByDatasetName', datasetName);        console.log(result.toString());
        return result.toString();

    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
    }
    
}
exports.queryLoggerAllAccessPublicByDatasetName = queryLoggerAllAccessPublicByDatasetName;

//Query public access by dataset name-Consumer
const queryLoggerAllAccessPublicProvider = async function(username, organization) {
    try {
        console.log(username, organization);
        let connection = await connectClient.connectClient(username, organization);
        const network = connection[0];

        // Get the contract from the network.
        const contract = network.getContract('logger');  
        const result = await contract.evaluateTransaction('queryLoggerAllAccessPublicProvider');        console.log(result.toString());
        return result.toString();

    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
    }
    
}
exports.queryLoggerAllAccessPublicProvider = queryLoggerAllAccessPublicProvider;

const queryLoggerAccessByDatasetName = async function(username, organization, datasetName) {
    try {
        console.log(username, organization);
        let connection = await connectClient.connectClient(username, organization);
        const network = connection[0];

        // Get the contract from the network.
        const contract = network.getContract('logger');  
        const result = await contract.evaluateTransaction('queryLoggerAccessByDatasetName', datasetName);        console.log(result.toString());
        return result.toString();

    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
    }   
}

exports.queryLoggerAccessByDatasetName = queryLoggerAccessByDatasetName;




const queryClearingHouseAccess = async function(username, organization) {
    try {
        console.log(username, organization);
        let connection = await connectClient.connectClient(username, organization);
        const network = connection[0];

        // Get the contract from the network.
        const contract = network.getContract('logger');
  
        const result = await contract.evaluateTransaction('queryLoggerAccess');
        console.log(result.toString());
        return result.toString();

    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
    }   
}

exports.queryClearingHouseAccess= queryClearingHouseAccess;


const queryLoggerAccessByOrg = async function(username, organization) {
    try {
        console.log(username, organization);
        let connection = await connectClient.connectClient(username, organization);
        const network = connection[0];

        // Get the contract from the network.
        const contract = network.getContract('logger');
  
        const result = await contract.evaluateTransaction('queryLoggerAccessOrg');
        console.log(result.toString());
        return result.toString();

    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
    }   
}

exports.queryLoggerAccessByOrg= queryLoggerAccessByOrg;


const queryLoggerAllDatasourceMetadata = async function(username, organization) {
    try {
        console.log(username, organization);
        let connection = await connectClient.connectClient(username, organization);
        const network = connection[0];

        // Get the contract from the network.
        const contract = network.getContract('logger');
  
        const result = await contract.evaluateTransaction('queryLoggerAllDatasourceMetadata');
        console.log(result.toString());
        return result.toString();

    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
    }   
}

exports.queryLoggerAllDatasourceMetadata = queryLoggerAllDatasourceMetadata;

const queryLoggerDatasourceMetadataByName = async function(username, organization, datasetName) {
    try {
        console.log(username, organization);
        let connection = await connectClient.connectClient(username, organization);
        const network = connection[0];

        // Get the contract from the network.
        const contract = network.getContract('logger');
  
        const result = await contract.evaluateTransaction('queryLoggerDatasourceMetadataByName', datasetName);
        console.log(result.toString());
        return result.toString();

    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
    }
    
}
exports.queryLoggerDatasourceMetadataByName = queryLoggerDatasourceMetadataByName;