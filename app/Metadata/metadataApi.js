
'use strict';
const { randomUUID } = require('crypto');

let connectClient = require('./../Helper/connectClient.js');
let datetimeHelper = require('./../Helper/dateTime.js');
let registerApi = require('./../Register/registerApi.js')
let semanticInteroperabilityEntities = require('./../SemanticInteroperability/entities.js')

function dateIsValid(dateStr) {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
  
    if (dateStr.match(regex) === null) {
      return false;
    }
  
    const date = new Date(dateStr);
  
    const timestamp = date.getTime();
  
    if (typeof timestamp !== 'number' || Number.isNaN(timestamp)) {
      return false;
    }
  
    return date.toISOString().startsWith(dateStr);
  }

const uploadMetadata = async function(usernameOfProvider, organizationOfProvider, body) {
    try {
        let emailOfProvider = body.emailOfProvider;
        let usernameOfOwner = body.usernameOfOwner;
        let orgOfOwner = body.orgOfOwner; 
        let datasetName = body.datasetName; 
        let datasetDescription = body.datasetDescription;
        let themeCategory = body.themeCategory;
        let keywordTag = body.keywordTag;
        let language = body.language;
        let distribution = body.distribution;
        let dataVelocity = body.dataVelocity;
        let spatialGeographicCoverage = body.spatialGeographicCoverage;
        let temporalCoverageStart = body.temporalCoverageStart;
        let temporalCoverageEnd = body.temporalCoverageEnd;
        let industryDomain = body.industryDomain;
        let dataVolume = body.dataVolume;
        let comments = body.comments;
        let accessRights = body.accessRights;
        let contractAgreementHash = body.contractAgreementHash;
        let contractAgreementURL = body.contractAgreementURL; 
        let termsConditionsHash = body.termsConditionsHash;
        let termsConditionsURL = body.termsConditionsURL;
        let copyrightHash = body.copyrightHash;
        let copyrightURL = body.copyrightURL;
        let customAccessRights = body.customAccessRights.toString();
        let endpoint = body.endpoint;
        let blockchain = body.blockchain;
        let hasAgent = body.hasAgent.toString();
        let dataSourceID = body.dataSourceID;
        let dataSourceIDFlag = false;

        if (dataSourceID) {
            console.log("Is checking for data source ID %s", dataSourceID);
            const getMetadataByDataSourceID = await queryMetadataByDataSourceID(usernameOfProvider, organizationOfProvider, dataSourceID);
            console.log(getMetadataByDataSourceID);

            let jsonGetMetadataByDataSourceID = JSON.parse(getMetadataByDataSourceID);

            if (jsonGetMetadataByDataSourceID.length > 0) {
                console.log("The data source ID %s is not available",dataSourceID)
                return ('Failed: Occupied Data Source ID')
            }else {
                dataSourceIDFlag = true;
            }
        }

        if((temporalCoverageStart) && (temporalCoverageStart != ' ')){
            let checkTemporalCoverageStart = dateIsValid(temporalCoverageStart);
            if (checkTemporalCoverageStart===false){
                return ("Not valid temporalCoverageStart format. YYYY-MM-DD")
            }
        }
        if ((temporalCoverageEnd) && (temporalCoverageEnd != ' ')){
            let checkTemporalCoverageEnd = dateIsValid(temporalCoverageEnd);
            if (checkTemporalCoverageEnd===false){
                return ("Not valid temporalCoverageEnd format. YYYY-MM-DD")
            }
        }
        let connection = await connectClient.connectClient(usernameOfProvider,organizationOfProvider);
        console.log('client is connected')
        const network = connection[0];
        const gateway = connection[1];

        let checkloggedInUser = await registerApi.ReturnLoggedInUser( organizationOfProvider, usernameOfProvider);
        let JSON_objest = JSON.parse(checkloggedInUser.toString());
        console.log(JSON_objest);

        if ((JSON_objest.email === emailOfProvider) && (JSON_objest.username === usernameOfProvider) && (JSON_objest.organization === organizationOfProvider)){
            console.log('There is a creds match')
        }else{
            return('email does not match to username');
        }
        if(usernameOfOwner){
            let checkUsername = await registerApi.checkAvailableUsername(network, usernameOfOwner);
            if (checkUsername === 'Available username'){
            return ('Available username');
            }
        }

        // Get the contract from the network.
        const contract = network.getContract('metadatasc');

        let releaseDateTime = await datetimeHelper.getDateTime();
        let modificationDateTime = ' ';

        let identifier; 
        while (true){
            identifier = randomUUID();
            console.log('The metadata identifier is: ', identifier)
            const checkIdentifier = await queryMetadataByIdentifier(usernameOfProvider, organizationOfProvider, identifier);
            const queryresult = isEmptyObject(JSON.parse(checkIdentifier));
            console.log('The query result for the identifier is :',queryresult)
            if (queryresult === true) {
                console.log('The metadata identifier is %s',identifier) 
                break;
            }
                    
        }
       
        if (dataVolume == null) {
            dataVolume === 0;
        }
        console.log("Uploading dataset metadata");
        await contract.submitTransaction('uploadMetadata',usernameOfProvider, organizationOfProvider, emailOfProvider,usernameOfOwner,orgOfOwner,
        datasetName, identifier, datasetDescription, releaseDateTime, modificationDateTime, themeCategory, keywordTag, language, distribution, dataVelocity,
        spatialGeographicCoverage, temporalCoverageStart, temporalCoverageEnd, industryDomain, dataVolume, comments,
        accessRights, contractAgreementHash, contractAgreementURL, termsConditionsHash,
        termsConditionsURL, copyrightHash, copyrightURL, customAccessRights,
        endpoint, blockchain, hasAgent, dataSourceID,
        '','','','','','','','','','','','');
        console.log('The metadata: uploaded');
        await gateway.disconnect();

        if (dataSourceIDFlag === true) {
            console.log('Is searching on SI-VPF for Datasource Metadata');
            const SearchIDVPF = await semanticInteroperabilityEntities.searchDatasourceMetadataVPF(usernameOfProvider, organizationOfProvider, datasetName, dataSourceID);
            console.log(SearchIDVPF);
          
            if (SearchIDVPF !== true) {
              console.log('Is searching on SI-ThPA for Datasource Metadata');
              const SearchIDThPA = await semanticInteroperabilityEntities.searchDatasourceMetadataThPA(usernameOfProvider, organizationOfProvider, datasetName, dataSourceID);
              console.log(SearchIDThPA);
          
              if (SearchIDThPA !== true) {
                console.log('Is searching on SI-Baleares for Datasource Metadata');
                await semanticInteroperabilityEntities.searchDatasourceMetadataBaleares(usernameOfProvider, organizationOfProvider, datasetName, dataSourceID);
              }
            } 
        }
        return('Success');

    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        return ('Fail' + error);
    }
}

exports.uploadMetadata = uploadMetadata;


const updateMetadata = async function(usernameOfProvider, organizationOfProvider, body) {
    try {

        let emailOfProvider = body.emailOfProvider;
        let usernameOfOwner = body.usernameOfOwner;
        let orgOfOwner = body.orgOfOwner; 
        let datasetName = body.datasetName; 
        let datasetDescription = body.datasetDescription;
        let themeCategory = body.themeCategory;
        let keywordTag = body.keywordTag;
        let language = body.language;
        let distribution = body.distribution;
        let dataVelocity = body.dataVelocity;
        let spatialGeographicCoverage = body.spatialGeographicCoverage;
        let temporalCoverageStart = body.temporalCoverageStart;
        let temporalCoverageEnd = body.temporalCoverageEnd;
        let industryDomain = body.industryDomain;
        let dataVolume = body.dataVolume;
        let comments = body.comments;
        let accessRights = body.accessRights;
        let contractAgreementHash = body.contractAgreementHash;
        let contractAgreementURL = body.contractAgreementURL; 
        let termsConditionsHash = body.termsConditionsHash;
        let termsConditionsURL = body.termsConditionsURL;
        let copyrightHash = body.copyrightHash;
        let copyrightURL = body.copyrightURL;
        let customAccessRights = body.customAccessRights.toString();
        let endpoint = body.endpoint;
        let blockchain = body.blockchain;
        let hasAgent = body.hasAgent.toString();
        let dataSourceID = body.dataSourceID;
        let dataSourceIDFlag = false;

        if((temporalCoverageStart) && (temporalCoverageStart != ' ')){
            let checkTemporalCoverageStart = dateIsValid(temporalCoverageStart);
            if (checkTemporalCoverageStart===false){
                return ("Not valid temporalCoverageStart format. YYYY-MM-DD")
            }
        }
        if ((temporalCoverageEnd) && (temporalCoverageEnd != ' ')){
            let checkTemporalCoverageEnd = dateIsValid(temporalCoverageEnd);
            if (checkTemporalCoverageEnd===false){
                return ("Not valid temporalCoverageEnd format. YYYY-MM-DD")
            }
        }
        console.log('The logged in user is: ', usernameOfProvider, organizationOfProvider)
        let connection = await connectClient.connectClient(usernameOfProvider, organizationOfProvider);
        const network = connection[0];
        const gateway = connection[1];

        let checkloggedInUser = await registerApi.ReturnLoggedInUser( organizationOfProvider, usernameOfProvider);
        let JSON_objest = JSON.parse(checkloggedInUser.toString());
        console.log(JSON_objest);

        if ((JSON_objest.email === emailOfProvider) && (JSON_objest.username === usernameOfProvider) && (JSON_objest.organization === organizationOfProvider)){
            console.log('There is a creds match')
        }else{
            return('email does not match to username');
        }
        if(usernameOfOwner){
            let checkUsername = await registerApi.checkAvailableUsername(network, usernameOfOwner);
            if (checkUsername === 'Available username'){
            return ('Available username');
            }
        }

        // Get the contract from the network.
        const contract = network.getContract('metadatasc');

        let modificationDateTime = await datetimeHelper.getDateTime();

        if (dataVolume == null) {
            dataVolume === 0;
        }

        if (dataSourceID) {
            console.log("Is checking for data source ID %s", dataSourceID);
            const getMetadataByDataSourceID = await queryMetadataByDataSourceID(usernameOfProvider, organizationOfProvider, dataSourceID);
            console.log(getMetadataByDataSourceID);

            let jsonGetMetadataByDataSourceID = JSON.parse(getMetadataByDataSourceID);
            if (jsonGetMetadataByDataSourceID.length > 0 && datasetName != jsonGetMetadataByDataSourceID[0].Record.datasetName) {
                console.log("The data source ID %s is not available is occupied from dataset %s", dataSourceID, jsonGetMetadataByDataSourceID[0].Record.datasetName)
                return ('Failed: Occupied Data Source ID')
            }else if (jsonGetMetadataByDataSourceID.length < 1) {
                dataSourceIDFlag = true;
            }
        }else if (dataSourceID == ' ' || dataSourceID == ''){
            console.log("Is checking for empty input data source ID");
            const getMetadataByDataSetName = await queryMetadataByName(usernameOfProvider, organizationOfProvider, datasetName);
            let jsonGetMetadataByDatasetName = JSON.parse(getMetadataByDataSetName);
            console.log(jsonGetMetadataByDatasetName);
            if (dataSourceID != jsonGetMetadataByDatasetName.dataSourceMetadata.dataSourceID) {
                await createDataSourceMetadataInternal(usernameOfProvider, organizationOfProvider, datasetName, 
                    ' ', ' ',' ', ' ', {}, ' ', ' ', {},{},' ',' ', {}, 'false')
            }else{
                console.log('The data source ID is not updated');
            }
        }

        await contract.submitTransaction('updateMetadata',usernameOfProvider, organizationOfProvider, emailOfProvider,usernameOfOwner,orgOfOwner,
        datasetName, datasetDescription, modificationDateTime, themeCategory, keywordTag, language, distribution, dataVelocity,
        spatialGeographicCoverage,  temporalCoverageStart, temporalCoverageEnd, industryDomain, dataVolume, comments,
        accessRights, contractAgreementHash, contractAgreementURL, termsConditionsHash,
        termsConditionsURL, copyrightHash, copyrightURL, customAccessRights,
        endpoint, blockchain, hasAgent, dataSourceID);
        console.log('The metadata updated');
        await gateway.disconnect();

        if (dataSourceIDFlag === true) {
            console.log('Is searching on SI-VPF for Datasource Metadata');
            const SearchIDVPF = await semanticInteroperabilityEntities.searchDatasourceMetadataVPF(usernameOfProvider, organizationOfProvider, datasetName, dataSourceID);
            console.log(SearchIDVPF);
          
            if (SearchIDVPF !== true) {
              console.log('Is searching on SI-ThPA for Datasource Metadata');
              const SearchIDThPA = await semanticInteroperabilityEntities.searchDatasourceMetadataThPA(usernameOfProvider, organizationOfProvider, datasetName, dataSourceID);
              console.log(SearchIDThPA);
          
              if (SearchIDThPA !== true) {
                console.log('Is searching on SI-Baleares for Datasource Metadata');
                await semanticInteroperabilityEntities.searchDatasourceMetadataBaleares(usernameOfProvider, organizationOfProvider, datasetName, dataSourceID);
              }
            } 
        }
        return('Success');

    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        return('Fail' + error);
    }
}

exports.updateMetadata = updateMetadata;

const queryLoggerMetadata= async function(username, organization) {
    try {
        let connection = await connectClient.connectClient(username, organization);
        const network = connection[0];
 
        // Get the contract from the network.
        const contract = network.getContract('metadatasc');

        const result  = await contract.evaluateTransaction('queryLoggerMetadata');
        console.log(result.toString());
        return result.toString();

    } catch (error) {
        console.error(`Failed to query: ${error}`);
        return(`Fail: ${error}`);
    }
}

exports.queryLoggerMetadata =queryLoggerMetadata;

const queryMetadataByIdentifier = async function(username, organization, identifier) {
    try {
        let connection = await connectClient.connectClient(username, organization);
        const network = connection[0];
 
        // Get the contract from the network.
        const contract = network.getContract('metadatasc');

        const result = await contract.evaluateTransaction('queryMetadataByIdentifier', identifier);
        return result.toString();

    } catch (error) {
        console.error(`Failed to query: ${error}`);
        return(`Fail: ${error}`);
    }
}

exports.queryMetadataByIdentifier = queryMetadataByIdentifier;

const queryMetadataByName = async function(username, organization, datasetname) {
    try {
        let connection = await connectClient.connectClient(username, organization);
        const network = connection[0];
 
        // Get the contract from the network.
        const contract = network.getContract('metadatasc');

        const result = await contract.evaluateTransaction('queryMetadataByName', datasetname);
        return result.toString();

    } catch (error) {
        console.error(`Failed to query: ${error}`);
        return(`Fail: ${error}`);
    }
}

exports.queryMetadataByName = queryMetadataByName;

const queryMetadataByDataSourceID = async function(username, organization, dataSourceID) {
    try {
        let connection = await connectClient.connectClient(username, organization);
        const network = connection[0];
 
        // Get the contract from the network.
        const contract = network.getContract('metadatasc');

        const result = await contract.evaluateTransaction('queryMetadataByDataSourceID', dataSourceID);
        return result.toString();

    } catch (error) {
        console.error(`Failed to query: ${error}`);
        return(`Fail: ${error}`);
    }
}

exports.queryMetadataByDataSourceID = queryMetadataByDataSourceID;


const queryMetadataByOwner = async function(username, organization) {
    try {
        let connection = await connectClient.connectClient(username, organization);
        const network = connection[0];
 
        // Get the contract from the network.
        const contract = network.getContract('metadatasc');

        const result = await contract.evaluateTransaction('queryMetadataByOwner');
        console.log(result.toString());
        return result.toString();

    } catch (error) {
        console.error(`Failed to query: ${error}`);
        return(`Fail: ${error}`);
    }
}

exports.queryMetadataByOwner = queryMetadataByOwner;

const queryMetadataByOwnerAndDatasetName = async function(username, organization, datasetName) {
    try {
        let connection = await connectClient.connectClient(username, organization);
        const network = connection[0];
 
        // Get the contract from the network.
        const contract = network.getContract('metadatasc');

        const result = await contract.evaluateTransaction('queryMetadataByOwnerAndDatasetName', datasetName);
        return result.toString();

    } catch (error) {
        console.error(`Failed to query: ${error}`);
        return(`Fail: ${error}`);
    }
}

exports.queryMetadataByOwnerAndDatasetName = queryMetadataByOwnerAndDatasetName;

const queryMetadataByProvider = async function(username, organization) {
    try {
        let connection = await connectClient.connectClient(username, organization);
        const network = connection[0];
 
        // Get the contract from the network.
        const contract = network.getContract('metadatasc');

        const result = await contract.evaluateTransaction('queryMetadataByProvider');
        console.log(result.toString());
        return result.toString();

    } catch (error) {
        console.error(`Failed to query: ${error}`);
        return(`Fail: ${error}`);
    }
}

exports.queryMetadataByProvider = queryMetadataByProvider;

const queryMetadataByProviderAndDatasetName = async function(username, organization, datasetName) {
    try {
        let connection = await connectClient.connectClient(username, organization);
        const network = connection[0];
 
        // Get the contract from the network.
        const contract = network.getContract('metadatasc');

        const result = await contract.evaluateTransaction('queryMetadataByProviderAndDatasetName', datasetName);
        return result.toString();

    } catch (error) {
        console.error(`Failed to query: ${error}`);
        return(`Fail: ${error}`);
    }
}

exports.queryMetadataByProviderAndDatasetName = queryMetadataByProviderAndDatasetName;

const queryMetadataByOrganizationOwner = async function(username, organization) {
    try {
        let connection = await connectClient.connectClient(username, organization);
        const network = connection[0];
 
        // Get the contract from the network.
        const contract = network.getContract('metadatasc');

        const result = await contract.evaluateTransaction('queryMetadataByOrganizationOwner');
        console.log(result.toString());
        return result.toString();

    } catch (error) {
        console.error(`Failed to query: ${error}`);
        return(`Fail: ${error}`);
    }
}

exports.queryMetadataByOrganizationOwner = queryMetadataByOrganizationOwner;

const queryMetadataByOrganizationOwnerAndDatasetName = async function(username, organization, datasetName) {
    try {
        let connection = await connectClient.connectClient(username, organization);
        const network = connection[0];
 
        // Get the contract from the network.
        const contract = network.getContract('metadatasc');

        const result = await contract.evaluateTransaction('queryMetadataByOrganizationOwnerAndDatasetName', datasetName);
        return result.toString();

    } catch (error) {
        console.error(`Failed to query: ${error}`);
        return(`Fail: ${error}`);
    }
}

exports.queryMetadataByOrganizationOwnerAndDatasetName = queryMetadataByOrganizationOwnerAndDatasetName;


const querymetadatastruct = async function(username, organization) {
    try {
        let connection = await connectClient.connectClient(username, organization);
        const network = connection[0];
 
        // Get the contract from the network.
        const contract = network.getContract('metadatasc');

        const result = await contract.evaluateTransaction('queryMetadataStruct');
        return result.toString();

    } catch (error) {
        console.error(`Failed to query: ${error}`);
        return(`Fail: ${error}`);
    }
}

exports.querymetadatastruct = querymetadatastruct;

const queryMetadataBy1CondOperator = async function(username, organization, field, operand,value) {
    try {
        let connection = await connectClient.connectClient(username, organization);
        const network = connection[0];
        console.log(typeof(parseInt(value)));
        let callQueryConstructor = constructor4LteOrGte(field, operand,parseInt(value));
        let queryStr = JSON.stringify(callQueryConstructor);
        console.log(queryStr)
        const contract = network.getContract('metadatasc');
        const result = await contract.evaluateTransaction('queryMetadataByQueryString',queryStr);
        console.log(result.toString());
        return result.toString();

    } catch (error) {
        console.error(`Failed to query: ${error}`);
        return(`Fail: ${error}`);
    }
}

exports.queryMetadataBy1CondOperator = queryMetadataBy1CondOperator;

const queryMetadataBy2CondOperators = async function(username, organization, field, operand1, operand2,valueMin, valueMax) {
    try {
        let connection = await connectClient.connectClient(username, organization);
        const network = connection[0];

        let callQueryConstructor = constructor4LteANDGte(field, operand1, operand2, parseInt(valueMin), parseInt(valueMax));
        let queryStr = JSON.stringify(callQueryConstructor);
        console.log(queryStr)
        const contract = network.getContract('metadatasc');
        const result = await contract.evaluateTransaction('queryMetadataByQueryString',queryStr);
        console.log(result.toString());
        return result.toString();

    } catch (error) {
        console.error(`Failed to query: ${error}`);
        return (`Fail: ${error}`);
    }
}

exports.queryMetadataBy2CondOperators = queryMetadataBy2CondOperators;


const queryMetadataByFieldAndValue = async function(username, organization, field, value) {
    try {
        let connection = await connectClient.connectClient(username, organization);
        const network = connection[0];

        let callQueryConstructor = constructorFieldValueStr(field, value);
        let queryStr = JSON.stringify(callQueryConstructor);
        console.log(queryStr)
        const contract = network.getContract('metadatasc');
        const result = await contract.evaluateTransaction('queryMetadataByQueryString',queryStr);
        console.log(result.toString());
        return result.toString();

    } catch (error) {
        console.error(`Failed to query: ${error}`);
        return(`Fail: ${error}`);
    }
}

exports.queryMetadataByFieldAndValue = queryMetadataByFieldAndValue;


const queryMetadataByFreeText = async function(username, organization, field, value) {
    try {
        let connection = await connectClient.connectClient(username, organization);
        const network = connection[0];

        let callQueryConstructor = constructor4FreeText(field, value);
        let queryStr = JSON.stringify(callQueryConstructor);
        console.log(queryStr)
        const contract = network.getContract('metadatasc');
        const result = await contract.evaluateTransaction('queryMetadataByQueryString',queryStr);
        console.log(result.toString());
        return result.toString();

    } catch (error) {
        console.error(`Failed to query: ${error}`);
        return(`Fail: ${error}`);
    }
}

exports.queryMetadataByFreeText = queryMetadataByFreeText;


const queryMetadataInArray = async function(username, organization, field, value) {
    try {
        let connection = await connectClient.connectClient(username, organization);
        const network = connection[0];

        let callQueryConstructor = constructor4Arrays(field, value);
        let queryStr = JSON.stringify(callQueryConstructor);
        console.log(queryStr)
        const contract = network.getContract('metadatasc');
        const result = await contract.evaluateTransaction('queryMetadataByQueryString',queryStr);
        console.log(result.toString());
        return result.toString();

    } catch (error) {
        console.error(`Failed to query: ${error}`);
        return(`Fail: ${error}`);
    }
}

exports.queryMetadataInArray = queryMetadataInArray;

const queryMetadataCombination = async function(username, organization, body) {
    try {
        let connection = await connectClient.connectClient(username, organization);
        const network = connection[0];
        let usernameOfProvider = body.usernameOfProvider;
        if (body.usernameOfProvider == " " || body.usernameOfProvider == "undefined"){
            usernameOfProvider = "";   
        }
        let orgOfProvider = body.orgOfProvider;
        if (body.orgOfProvider == " " || body.orgOfProvider == "undefined"){
            orgOfProvider = "";       
        }
        let orgOfOwner = body.orgOfOwner; 
        if (body.orgOfOwner == " " || body.orgOfOwner == "undefined"){
            orgOfOwner = "";   
        }
        let datasetName = body.datasetName; 
        if (body.datasetName == " " || body.datasetName == "undefined"){
            datasetName = "";   
        }
        let themeCategory = body.themeCategory;
        if (body.themeCategory == " " || body.themeCategory == "undefined"){
            themeCategory = "";   
        }
        let keywordTag = body.keywordTag;
        if (body.keywordTag == " " || body.keywordTag == "undefined"){
            keywordTag = "";   
        }
        let language = body.language;
        if (body.language == " " || body.language == "undefined"){
            language = "";   
        }
        let distribution = body.distribution;
        if (body.distribution == " " || body.distribution == "undefined"){
            distribution = "";   
        }
        let dataVelocityMin = body.dataVelocityMin;
        if (body.dataVelocityMin == " " || body.dataVelocityMin == "undefined"){
            dataVelocityMin = ""; 
        }
        let operandDataVelocityMin = body.operandDataVelocityMin;
        if (body.operandDataVelocityMin == " " || body.operandDataVelocityMin == "undefined"){
            operandDataVelocityMin = ""; 
        }
        let dataVelocityMax = body.dataVelocityMax;
        if (body.dataVelocityMax == " " || body.dataVelocityMax == "undefined"){
            dataVelocityMax = ""; 
        }
        let operandDataVelocityMax = body.operandDataVelocityMax;
        if (body.operandDataVelocityMax == " " || body.operandDataVelocityMax == "undefined"){
            operandDataVelocityMax = ""; 
        }
        let spatialGeographicCoverage = body.spatialGeographicCoverage;
        if (body.spatialGeographicCoverage == " " || body.spatialGeographicCoverage == "undefined"){
            spatialGeographicCoverage = ""; 
        }
        let temporalCoverageStart = body.temporalCoverageStart;
        if (body.temporalCoverageStart == " " || body.temporalCoverageStart == "undefined"){
            temporalCoverageStart = ""; 
        }else if((temporalCoverageStart) && (temporalCoverageStart != ' ')){
            let checkTemporalCoverageStart = dateIsValid(temporalCoverageStart);
            if (checkTemporalCoverageStart===false){
                return ("Not valid temporalCoverageStart format. YYYY-MM-DD")
            }
        }

        let operandTmcS = body.operandTmcS;
        if (body.operandTmcS == " " || body.operandTmcS == "undefined"){
            operandTmcS = ""; 
        }
        let temporalCoverageEnd = body.temporalCoverageEnd;
        if (body.temporalCoverageEnd == " " || body.temporalCoverageEnd == "undefined"){
            temporalCoverageEnd = ""; 
        }else if ((temporalCoverageEnd) && (temporalCoverageEnd != ' ')){
            let checkTemporalCoverageEnd = dateIsValid(temporalCoverageEnd);
            if (checkTemporalCoverageEnd===false){
                return ("Not valid temporalCoverageEnd format. YYYY-MM-DD")
            }
        }
        let operandTmcE = body. operandTmcE;
        if (body.operandTmcE == " " || body.operandTmcE == "undefined"){
            operandTmcE = ""; 
        }
        let industryDomain = body.industryDomain;
        if (body.industryDomain == " " || body.industryDomain == "undefined"){
            industryDomain = ""; 
        }
        let dataVolumeMin = body.dataVolumeMin;
        if (body.dataVolumeMin == " " || body.dataVolumeMin == "undefined"){
            dataVolumeMin = ""; 
        }
        let operandDataVolumeMin = body.operandDataVolumeMin;
        if (body.operandDataVolumeMin == " " || body.operandDataVolumeMin == "undefined"){
            operandDataVolumeMin = ""; 
        }
        let dataVolumeMax = body.dataVolumeMax;
        if (body.dataVolumeMax == " " || body.dataVolumeMax == "undefined"){
            dataVolumeMax = ""; 
        }
        let operandDataVolumeMax = body.operandDataVolumeMax;
        if (body.operandDataVolumeMax == " " || body.operandDataVolumeMax == "undefined"){
            operandDataVolumeMax = ""; 
        }
        let accessRights = body.accessRights;
        if (body.accessRights == " " || body.accessRights == "undefined"){
            accessRights = ""; 
        }
        let customAccessRights = body.customAccessRights;
        if (body.customAccessRights == " " || body.customAccessRights == "undefined"){
            customAccessRights = ""; 
        }
        let identifier = body.identifier;
        if (body.identifier == " " || body.identifier == "undefined"){
            identifier = ""; 
        }
        let versionMin = body.versionMin;
        if (body.versionMin == " " || body.versionMin == "undefined"){
            versionMin = ""; 
        }
        let operandVersionMin = body.operandVersionMin;
        if (body.operandVersionMin == " " || body.operandVersionMin == "undefined"){
            operandVersionMin = ""; 
        }
        let versionMax = body.versionMax;
        if (body.versionMax == " " || body.versionMax == "undefined"){
            versionMax = ""; 
        }
        let operandVersionMax = body.operandVersionMax;
        if (body.operandVersionMax == " " || body.operandVersionMax == "undefined"){
            operandVersionMax = ""; 
        }
        let dataSourceValue = body.dataSourceValue;
        if (body.dataSourceValue == " " || body.dataSourceValue == "undefined"){
            dataSourceValue = ""; 
        }
        let hasAgent = body.hasAgent;
        if (body.hasAgent == " " || body.hasAgent == "undefined"){
            hasAgent = ""; 
        }

        let callQueryConstructor = constructor4Combinations(usernameOfProvider, orgOfProvider, 
            orgOfOwner, datasetName, themeCategory, keywordTag, language, distribution, 
            parseInt(dataVelocityMin), operandDataVelocityMin, parseInt(dataVelocityMax), operandDataVelocityMax,
            spatialGeographicCoverage, temporalCoverageStart, operandTmcS, temporalCoverageEnd, operandTmcE,
            industryDomain, parseInt(dataVolumeMin), operandDataVolumeMin, parseInt(dataVolumeMax), operandDataVolumeMax, accessRights,
            customAccessRights, identifier, parseInt(versionMin), operandVersionMin, parseInt(versionMax), operandVersionMax, dataSourceValue, hasAgent);
        let queryStr = JSON.stringify(callQueryConstructor);
        console.log(queryStr)
        const contract = network.getContract('metadatasc');
        const result = await contract.evaluateTransaction('queryMetadataByQueryString',queryStr);
        console.log(result.toString());
        return result.toString();

    } catch (error) {
        console.error(`Failed to query: ${error}`);
        return(`Fail: ${error}`);
    }
}

exports.queryMetadataCombination = queryMetadataCombination;

const queryCustomLists = async function(username, organization) {
    try {
        const getMetadata = await querymetadatastruct(username, organization);

        const uniqueUsernameOfProviders = [...new Set(JSON.parse(getMetadata).map(item => item.Record.usernameOfProvider))];

        const uniqueOrgOfProviders = [...new Set(JSON.parse(getMetadata).map(item => item.Record.orgOfProvider))];
      
        const uniqueOrgOfOwners = [...new Set(JSON.parse(getMetadata).map(item => item.Record.orgOfOwner))];
      
        let customLists = {"usernameOfProviders" : uniqueUsernameOfProviders,
        "orgOfProviders" : uniqueOrgOfProviders,
        "orgOfOwners": uniqueOrgOfOwners
       };

       return (JSON.stringify(customLists));
    } catch (error) {
        console.error(`Failed to query: ${error}`);
        return(`Fail: ${error}`);
    }
}

exports.queryCustomLists = queryCustomLists;

const queryDataSourceMetadataByDataProvided = async function(username, organization, value) {
    try {
        let connection = await connectClient.connectClient(username, organization);
        const network = connection[0];

        let callQueryConstructor = constructor4DataSourceDataProvided(value);
        let queryStr = JSON.stringify(callQueryConstructor);
        console.log(queryStr)
        const contract = network.getContract('metadatasc');
        const result = await contract.evaluateTransaction('queryMetadataByQueryString',queryStr);
        console.log(result.toString());
        return result.toString();

    } catch (error) {
        console.error(`Failed to query: ${error}`);
        return(`Fail: ${error}`);
    }
}

exports.queryDataSourceMetadataByDataProvided = queryDataSourceMetadataByDataProvided;

function constructor4LteOrGte(field, operand, value){
    let querySelector = {
        selector: {
            docType:"Metadata",
            [field]: {
               [operand]:value
            } 
        }
    };
    return querySelector
}

function constructor4LteANDGte(field, operand1, operand2, valueMin, valueMax){
    let querySelector = {
        selector: {
            docType:"Metadata",
            [field]: {
                [operand1]:valueMin,
                [operand2]:valueMax
            } 
        }
    };
    return querySelector
}

function constructor4Dates(field1, field2, operand1, operand2, valueMin, valueMax){
    let querySelector = {
        selector: {
            docType:"Metadata",
            [field1]: {
                [operand1]:valueMin
            },
            [field2]: {
                [operand2]:valueMax
            }  
        }
    };
    return querySelector
}

function constructorFieldValueStr(field, value){
    let querySelector = {
        selector: {
            docType:"Metadata",
            [field] : value
        }
    };
    return querySelector
}

function constructor4Arrays(field, value){
    let querySelector = {
        selector: {
            docType:"Metadata",
            [field] :{
                $in : [value]
            }
        }
    };
    return querySelector
}

function constructor4DataSourceDataProvided(value){
    let querySelector = {
        selector: {
            docType:"Metadata",
            "dataSourceMetadata.dataSourceID" :{
                $regex : "(?i)" + value
            }
        }
    };
    return querySelector
}

    function constructor4Combinations(usernameOfProvider, orgOfProvider, 
        orgOfOwner, datasetName, themeCategory, keywordTag, language, distribution, 
        dataVelocityMin, operandDataVelocityMin, dataVelocityMax, operandDataVelocityMax,
        spatialGeographicCoverage, temporalCoverageStart, operandTmcS, temporalCoverageEnd, operandTmcE,
        industryDomain, dataVolumeMin, operandDataVolumeMin, dataVolumeMax, operandDataVolumeMax, accessRights,
        customAccessRights, identifier, versionMin, operandVersionMin, versionMax, operandVersionMax, dataSourceValue, hasAgent){
        let querySelector = {};

        if (operandDataVelocityMin === "") {
            operandDataVelocityMin = "$gte"
            dataVelocityMin = 0
        }
        if (operandDataVelocityMax === "") {
            operandDataVelocityMax = "$lte"
            dataVelocityMax = Number.MAX_SAFE_INTEGER
        }
        if (operandDataVolumeMin === "") {
            operandDataVolumeMin = "$gte"
            dataVolumeMin = 0
        }
        if (operandDataVolumeMax === "") {
            operandDataVolumeMax = "$lte"
            dataVolumeMax = Number.MAX_SAFE_INTEGER
        }
        if (operandVersionMin === "") {
            operandVersionMin = "$gte"
            versionMin = 0
        }
        if (operandVersionMax === "") {
            operandVersionMax = "$lte"
            versionMax = Number.MAX_SAFE_INTEGER
        }
        if (accessRights === "") {
            accessRights = "read"
        }
        if (temporalCoverageStart !=="" && temporalCoverageEnd !=="") {
            console.log("The temporal coverage is non empty")
            querySelector = {
                selector: {
                    docType:"Metadata",
                    "usernameOfProvider" : {
                        $regex : usernameOfProvider
                    },
                    "orgOfProvider" : {
                        $regex : orgOfProvider
                    },
                    "orgOfOwner" : {
                        $regex : orgOfOwner
                    },
                    "datasetName" : {
                        $regex : "(?i)" + datasetName
                    },
                    "identifier" : {
                        $regex : "(?i)" + identifier
                    },
                    "hasAgent" : {
                        $regex : "(?i)" + hasAgent
                    },
                    "themeCategory" : {
                        $regex : "(?i)" + themeCategory
                    },
                    "keywordTag" : {
                        $regex : "(?i)" + keywordTag
                    },
                    "language" : {
    
                        $regex : language
                    },
                    "distribution" : {
                        $regex : distribution
                    },
                    "spatialGeographicCoverage" : {
                        $regex : "(?i)" + spatialGeographicCoverage
                    },
                    "industryDomain" : {
                        $regex : industryDomain
                    },
                    "customAccessRights" : {
                        $elemMatch: {
                           $regex: customAccessRights
                        }
                    },
                    "accessRights" : {
                        $in : [accessRights]
                    }, 
                    "temporalCoverageStart": {
                        [operandTmcS]:temporalCoverageEnd
                    },
                    "temporalCoverageEnd": {                    
                        [operandTmcE]:temporalCoverageStart
                    },
                    "dataVelocity": {
                        [operandDataVelocityMin]:dataVelocityMin,
                        [operandDataVelocityMax]:dataVelocityMax
                    },
                    "dataVolume": {
                        [operandDataVolumeMin]:dataVolumeMin,
                        [operandDataVolumeMax]:dataVolumeMax
                    },
                    "version": {
                        [operandVersionMin]:versionMin,
                        [operandVersionMax]:versionMax
                    },
                    "dataSourceMetadata.dataSourceID" :{
                        $regex : "(?i)" + dataSourceValue
                    }      
                }
            };
        }
        else if (temporalCoverageStart ==="" && temporalCoverageEnd ==="") {
            console.log("The temporal coverage is empty")
            querySelector = {
                selector: {
                    docType:"Metadata",
                    "usernameOfProvider" : {
                        $regex : usernameOfProvider
                    },
                    "orgOfProvider" : {
                        $regex : orgOfProvider
                    },
                    "orgOfOwner" : {
                        $regex : orgOfOwner
                    },
                    "datasetName" : {
                        $regex : "(?i)" + datasetName
                    },
                    "identifier" : {
                        $regex : "(?i)" + identifier
                    },
                    "hasAgent" : {
                        $regex : "(?i)" + hasAgent
                    },
                    "themeCategory" : {
                        $regex : "(?i)" + themeCategory
                    },
                    "keywordTag" : {
                        $regex : "(?i)" + keywordTag
                    },
                    "language" : {
                        $regex : language
                    },
                    "distribution" : {
                        $regex : distribution
                    },
                    "spatialGeographicCoverage" : {
                        $regex : "(?i)" + spatialGeographicCoverage
                    },
                    "industryDomain" : {
                        $regex : industryDomain
                    },
                    "customAccessRights" : {
                        $elemMatch: {
                           $regex: customAccessRights
                        }
                    },
                    "accessRights" : {
                        $in : [accessRights]
                    }, 
                    "dataVelocity": {
                        [operandDataVelocityMin]:dataVelocityMin,
                        [operandDataVelocityMax]:dataVelocityMax
                    },
                    "dataVolume": {
                        [operandDataVolumeMin]:dataVolumeMin,
                        [operandDataVolumeMax]:dataVolumeMax
                    },
                    "version": {
                        [operandVersionMin]:versionMin,
                        [operandVersionMax]:versionMax
                    },
                    "dataSourceMetadata.dataSourceID" :{
                        $regex : "(?i)" + dataSourceValue
                    }       
                }
            };
        }
        else if (temporalCoverageStart !=="" && temporalCoverageEnd ==="") {
            console.log("The temporal coverage start is non empty and the temporal coverage end is empty")
            querySelector = {
                selector: {
                    docType:"Metadata",
                    "usernameOfProvider" : {
                        $regex : usernameOfProvider
                    },
                    "orgOfProvider" : {
                        $regex : orgOfProvider
                    },
                    "orgOfOwner" : {
                        $regex : orgOfOwner
                    },
                    "datasetName" : {
                        $regex : "(?i)" + datasetName
                    },
                    "identifier" : {
                        $regex : "(?i)" + identifier
                    },
                    "hasAgent" : {
                        $regex : "(?i)" + hasAgent
                    },
                    "themeCategory" : {
                        $regex : "(?i)" + themeCategory
                    },
                    "keywordTag" : {
                        $regex : "(?i)" + keywordTag
                    },
                    "language" : {
                        $regex : language
                    },
                    "distribution" : {
                        $regex : distribution
                    },
                    "spatialGeographicCoverage" : {
                        $regex : "(?i)" + spatialGeographicCoverage
                    },
                    "industryDomain" : {
                        $regex : industryDomain
                    },
                    "customAccessRights" : {
                        $elemMatch: {
                           $regex: customAccessRights
                        }
                    },
                    "accessRights" : {
                        $in : [accessRights]
                    }, 
                    "temporalCoverageStart": {
                        [operandTmcS]:temporalCoverageStart
                    },
                    "dataVelocity": {
                        [operandDataVelocityMin]:dataVelocityMin,
                        [operandDataVelocityMax]:dataVelocityMax
                    },
                    "dataVolume": {
                        [operandDataVolumeMin]:dataVolumeMin,
                        [operandDataVolumeMax]:dataVolumeMax
                    },
                    "version": {
                        [operandVersionMin]:versionMin,
                        [operandVersionMax]:versionMax
                    },
                    "dataSourceMetadata.dataSourceID" :{
                        $regex : "(?i)" + dataSourceValue
                    }       
                }
            };
        }
        else if (temporalCoverageStart ==="" && temporalCoverageEnd !=="") {
            console.log("The temporal coverage start is empty and the temporal coverage end is non empty")
            querySelector = {
                selector: {
                    docType:"Metadata",
                    "usernameOfProvider" : {
                        $regex : usernameOfProvider
                    },
                    "orgOfProvider" : {
                        $regex : orgOfProvider
                    },
                    "orgOfOwner" : {
                        $regex : orgOfOwner
                    },
                    "datasetName" : {
                        $regex : "(?i)" + datasetName
                    },
                    "identifier" : {
                        $regex : "(?i)" + identifier
                    },
                    "hasAgent" : {
                        $regex : "(?i)" + hasAgent
                    },
                    "themeCategory" : {
                        $regex : "(?i)" + themeCategory
                    },
                    "keywordTag" : {
                        $regex : "(?i)" + keywordTag
                    },
                    "language" : {
                        $regex : language
                    },
                    "distribution" : {
                        $regex : distribution
                    },
                    "spatialGeographicCoverage" : {
                        $regex : "(?i)" + spatialGeographicCoverage
                    },
                    "industryDomain" : {
                        $regex : industryDomain
                    },
                    "customAccessRights" : {
                        $elemMatch: {
                           $regex: customAccessRights
                        }
                    },
                    "accessRights" : {
                        $in : [accessRights]
                    }, 
                    "temporalCoverageEnd": {
                        [operandTmcE]:temporalCoverageEnd
                    },  
                    "dataVelocity": {
                        [operandDataVelocityMin]:dataVelocityMin,
                        [operandDataVelocityMax]:dataVelocityMax
                    },
                    "dataVolume": {
                        [operandDataVolumeMin]:dataVolumeMin,
                        [operandDataVolumeMax]:dataVolumeMax
                    },
                    "version": {
                        [operandVersionMin]:versionMin,
                        [operandVersionMax]:versionMax
                    },
                    "dataSourceMetadata.dataSourceID" :{
                        $regex : "(?i)" + dataSourceValue
                    }       
                }
            };
        }else{
            console.log("Something went wrong with temporal coverage")
        }
        return querySelector
}

function constructor4FreeText(field, value){
    let querySelector = {
        selector: {
            docType:"Metadata",
            [field] : {
                $regex : "(?i)" + value
            }
        }
    };
    return querySelector
}    

const getMetadataRole = async function(username, organization, datasetName) {
    try {
        let callQueryMetadataByProviderAndDatasetName = await queryMetadataByProviderAndDatasetName(username, organization, datasetName);
        let callQueryMetadataByOwnerAndDatasetName = await queryMetadataByOrganizationOwnerAndDatasetName(username, organization, datasetName);
        let checkEmptyProvider = await isNonEmptyObject(JSON.parse(callQueryMetadataByProviderAndDatasetName));
        let checkEmptyOwner = await isNonEmptyObject(JSON.parse(callQueryMetadataByOwnerAndDatasetName));
        if (callQueryMetadataByProviderAndDatasetName){
            console.log(callQueryMetadataByProviderAndDatasetName);
        }
        let metadataRoleJSON = new Object();
        metadataRoleJSON.provider=checkEmptyProvider;
        metadataRoleJSON.owner=checkEmptyOwner;
        console.log(metadataRoleJSON);
        return metadataRoleJSON;

    } catch (error) {
        console.error(`Failed to query: ${error}`);
        return(`Fail: ${error}`);
    }
}

exports.getMetadataRole = getMetadataRole;

function isNonEmptyObject(obj) {
    for (let key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        return true;
      }
    }
    return false;
  }

const updateUserInfoMetadata = async function(jsonObject, connectedUser, connectedOrgofUser, newEmail) {
    try {
        let count = Object.keys(jsonObject).length;
        console.log(count);
        let connection = await connectClient.connectClient(connectedUser, connectedOrgofUser);
            const network = connection[0];
            const gateway = connection[1];
        for (count in jsonObject) { 
            let datasetName = jsonObject[count].Record.datasetName;
            // Get the contract from the network.
            const contract = network.getContract('metadatasc');

            const result = await contract.submitTransaction('changeProviderEmail', newEmail, datasetName);
            console.log(result.toString())
                        
          }
 
          await gateway.disconnect();
          return ('Success')
                      

    } catch (error) {
        console.error(`Failed to update user info(DataGovernanceSC): ${error}`);
    }
}

exports.updateUserInfoMetadata = updateUserInfoMetadata;

const updateUserInfoMetadataHelper = async function(username, organization, newEmail) {
    try {
        let connection = await connectClient.connectClient(username, organization);
        const network = connection[0];

        // Get the contract from the network.
        const contract = network.getContract('metadatasc');

        const result0 = await contract.evaluateTransaction('queryMetadataByProvider');
        const result = result0.toString();
        const resultJSON = JSON.parse(result)
        console.log(result);
        await updateUserInfoMetadata(resultJSON, username, organization, newEmail)
        return result;

    } catch (error) {
        console.error(`Failed to query: ${error}`);
        return(`Fail: ${error}`);
    }
}

exports.updateUserInfoMetadataHelper = updateUserInfoMetadataHelper;

const splitStr = async function(str, separator) {
    console.log('The string value is: ', str);
    console.log('The separator is: ', separator);
    // Function to split string
    let string = str.split(separator);
      
    console.log(string);
    return(string);
}

exports.splitStr = splitStr;

function isEmptyObject(obj) {
    for (let key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        return false;
      }
    }
    return true;
  } 

//Data source metadata
const createDataSourceMetadata = async function(organization, username, dataSourceID, dataSourceType,
    dataModelsType, dataModelsValue, dataModelsMetadata, dataProvidedType, dataProvidedValue, dataProvidedMetadata,
    attributes, service, servicePath,  mapping, dataportsDataModelandFormat) {
    try {

        if (service == undefined){
            service = '';
        }
        if (servicePath == undefined){
            servicePath = '';
        }
        if (mapping == undefined){
            mapping = {};
        }
        if (dataportsDataModelandFormat == undefined){
            dataportsDataModelandFormat = '';
        }
        if (attributes == undefined){
            attributes = {};
        }
        const getMetadataByDataSourceID = await queryMetadataByDataSourceID(username, organization, dataSourceID);
        console.log(getMetadataByDataSourceID);

        let jsonGetMetadataByDataSourceID = JSON.parse(getMetadataByDataSourceID);

        if (jsonGetMetadataByDataSourceID.length < 1) {
            return ('Failed: No metadata found')
        }
        const datasetName = jsonGetMetadataByDataSourceID[0].Record.datasetName;

        let checkExistedDatasourceMetadata = jsonGetMetadataByDataSourceID[0].Record.dataSourceMetadata.dataSourceType;

        if (checkExistedDatasourceMetadata ===""){
            
            let connection = await connectClient.connectClient(username, organization);
            console.log('client is connected')

            const network = connection[0];
            const gateway = connection[1];  

            let datetime = await datetimeHelper.getDateTime();
            console.log('The data source metadata is uploading');

            // Get the contract from the network.
            const contract = network.getContract('metadatasc');
            console.log('The data source metadata:')
            console.log('datetime: %s , datasetName: %s, datasourceID: %s, dataSourceType: %s,',datetime, datasetName, dataSourceID, dataSourceType);
            console.log('dataModelsType: %s , dataModelsValue: %s, dataModelsMetadata: %s' , dataModelsType, dataModelsValue, JSON.stringify(dataModelsMetadata));
            console.log('dataProvidedType: %s , dataProvidedValue: %s, dataModelsMetadata: %s' , dataProvidedType, JSON.stringify(dataProvidedValue), JSON.stringify(dataProvidedMetadata));
            console.log('attributes: %s , service: %s, servicePath: %s, mapping: %s, dataportsDataModelandFormat: %s',JSON.stringify(attributes), service, servicePath, JSON.stringify(mapping), dataportsDataModelandFormat);

            await contract.submitTransaction('createDataSourceMetadata',datetime, datasetName, dataSourceID, dataSourceType,
            dataModelsType, dataModelsValue, JSON.stringify(dataModelsMetadata), dataProvidedType, JSON.stringify(dataProvidedValue), JSON.stringify(dataProvidedMetadata),
            JSON.stringify(attributes), service, servicePath, JSON.stringify(mapping), dataportsDataModelandFormat.toString());
            console.log('The data source metadata is uploaded');
            await gateway.disconnect();

        }else{
            console.log('The data source metadata is updating');
            await updateDataSourceMetadata (username, organization, datasetName, dataModelsType, dataModelsValue, dataModelsMetadata, dataProvidedType, dataProvidedValue, dataProvidedMetadata,
                attributes, service, servicePath, mapping, dataportsDataModelandFormat.toString());
        }
                
        return('Success');   

    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        return ('Fail');
    }
}

exports.createDataSourceMetadata = createDataSourceMetadata;

const updateDataSourceMetadata = async function(usernameOfProvider, orgOfProvider, datasetName, dataModelsType, dataModelsValue, dataModelsMetadata, dataProvidedType, dataProvidedValue, dataProvidedMetadata,
    attributes, service, servicePath, mapping, dataportsDataModelandFormat) {
    try {
        console.log('Updating Data source metadata %s', datasetName)
        let connection = await connectClient.connectClient(usernameOfProvider,orgOfProvider);
        console.log('client is connected')
        const network = connection[0];
        const gateway = connection[1];

        let datetime = await datetimeHelper.getDateTime();
        // Get the contract from the network.
        const contract = network.getContract('metadatasc');
        await contract.submitTransaction('updateDataSourceMetadata',datasetName, dataModelsType, dataModelsValue, 
        JSON.stringify(dataModelsMetadata), dataProvidedType, JSON.stringify(dataProvidedValue), JSON.stringify(dataProvidedMetadata),
        JSON.stringify(attributes), service, servicePath, JSON.stringify(mapping), dataportsDataModelandFormat, datetime);

        console.log('The data source metadata is updated');
        await gateway.disconnect();
        return('Success');

    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        return ('Fail');
    }
}

exports.updateDataSourceMetadata = updateDataSourceMetadata;


const createDataSourceMetadataInternal = async function(usernameOfProvider,orgOfProvider, datasetName, datasourceID, dataSourceType,
    dataModelsType, dataModelsValue, dataModelsMetadata, dataProvidedType, dataProvidedValue, dataProvidedMetadata,
    attributes, service, servicePath, mapping, dataportsDataModelandFormat) {
    try {
        
        if (service == undefined){
            service = '';
        }
        if (servicePath == undefined){
            servicePath = '';
        }
        if (mapping == undefined){
            mapping = {};
        }
        if (dataportsDataModelandFormat == undefined){
            dataportsDataModelandFormat = 'false' ;
        }
        if (attributes == undefined){
            attributes = {};
        }
            
        let connection = await connectClient.connectClient(usernameOfProvider,orgOfProvider);
        console.log('client is connected')

        const network = connection[0];
        const gateway = connection[1];  

        let datetime = await datetimeHelper.getDateTime();

        console.log('The data source metadata:')
        console.log('datetime: %s , datasetName: %s, datasourceID: %s, dataSourceType: %s,',datetime, datasetName, datasourceID, dataSourceType);
        console.log('dataModelsType: %s , dataModelsValue: %s, dataModelsMetadata: %s' , dataModelsType, dataModelsValue, JSON.stringify(dataModelsMetadata));
        console.log('dataProvidedType: %s , dataProvidedValue: %s, dataModelsMetadata: %s' , dataProvidedType, JSON.stringify(dataProvidedValue), JSON.stringify(dataProvidedMetadata));
        console.log('attributes: %s , service: %s, servicePath: %s, mapping: %s, dataportsDataModelandFormat: %s',JSON.stringify(attributes), service, servicePath, JSON.stringify(mapping), dataportsDataModelandFormat);
        // Get the contract from the network.
        const contract = network.getContract('metadatasc');
        await contract.submitTransaction('createDataSourceMetadata',datetime, datasetName, datasourceID, dataSourceType,
        dataModelsType, dataModelsValue, JSON.stringify(dataModelsMetadata), dataProvidedType, JSON.stringify(dataProvidedValue), JSON.stringify(dataProvidedMetadata),
        JSON.stringify(attributes), service, servicePath, JSON.stringify(mapping), dataportsDataModelandFormat);
        console.log('The data source metadata is uploaded from the internal process');
        await gateway.disconnect();        
                
        return('Success');   

    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        return ('Fail');
    }
}

exports.createDataSourceMetadataInternal = createDataSourceMetadataInternal;
