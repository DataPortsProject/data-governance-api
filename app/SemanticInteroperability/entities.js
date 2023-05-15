const axios = require('axios')
const metadataApi = require('./../Metadata/metadataApi.js')
const getIMToken = require('./getIMToken.js')

const searchDatasourceMetadataVPF = async function (usernameOfProvider, orgOfProvider, datasetName, dataSourceID) {
  
    try {
        console.log('Is searching for the entity %s at the VPF semantic interoperability component', dataSourceID);
        let token = await getIMToken.requestIMToken();
        console.log(token.access_token)
        let data = ''
        const headers = {
            'Fiware-Service': 'metadata',
            'Authorization' : 'Bearer'  + ' ' + token.access_token
        }
        const config = {
            method: 'get',
            url: `https://dps.dataports.com.es:9000/orion/v2/entities?type=DataSource&id=${dataSourceID}`,
            headers: headers,
            data : data
        }
    
        let res = await axios(config)
        console.log(res.data);

        console.log(`Status: ${res.status}`)
        console.log(`Date: ${res.headers.date}`)

        if (res.data.length > 0){
            let id = res.data[0].id;
            console.log('Found data source metadata for id: %s', id)
            let dataSourceType = res.data[0].type;

            let dataModelsType = '';
            let dataModelsValue = '';
            let dataModelsMetadata = {};

            if (res.data[0].dataModels){
                dataModelsType = res.data[0].dataModels.type;
                dataModelsValue = res.data[0].dataModels.value;
                dataModelsMetadata = res.data[0].dataModels.metadata;
            } 

            let dataProvidedType = '';
            let dataProvidedValue = '';
            let dataProvidedMetadata = {};

            if (res.data[0].dataProvided){
                dataProvidedType = res.data[0].dataProvided.type;
                dataProvidedValue = res.data[0].dataProvided.value;
                dataProvidedMetadata = res.data[0].dataProvided.metadata;           
            }

            let attributes = res.data[0].attributes;
            let service = res.data[0].service;
            let servicePath = res.data[0].servicePath;
            let mapping = res.data[0].mapping;
            let dataportsDataModelandFormat = res.data[0].isPartOfDataPortsModel;
            
            await metadataApi.createDataSourceMetadataInternal(usernameOfProvider,orgOfProvider, datasetName, id, dataSourceType, dataModelsType, dataModelsValue, dataModelsMetadata, 
                dataProvidedType, dataProvidedValue, dataProvidedMetadata, attributes, service, servicePath, mapping, dataportsDataModelandFormat);
            return (true);
        }else{
            console.log('No VPF data source found for id: %s', dataSourceID)
            return (false);
        }

    } catch (error) {
        console.error(`Failed: ${error}`);
        return (`Failed: ${error}`);
    }
}


exports.searchDatasourceMetadataVPF = searchDatasourceMetadataVPF;

const searchDatasourceMetadataThPA = async function (usernameOfProvider, orgOfProvider, datasetName, dataSourceID) {
  
    try {
        console.log('Is searching for the entity %s at the ThPA semantic interoperability component', dataSourceID);
        let token = await getIMToken.requestIMToken();
        console.log(token.access_token)
        let data = ''
        const headers = {
            'Fiware-Service': 'metadata',
            'Authorization' : 'Bearer'  + ' ' + token.access_token
        }
        const config = {
            method: 'get',
            url: `https://f120.thpa.gr:9000/orion/v2/entities?type=DataSource&id=${dataSourceID}`,
            headers: headers,
            data : data
        }
    
        let res = await axios(config)
        console.log(res.data);

        console.log(`Status: ${res.status}`)
        console.log(`Date: ${res.headers.date}`)

        if (res.data.length > 0){
            let id = res.data[0].id;
            console.log('Found data source metadata for id: %s', id)
            let dataSourceType = res.data[0].type;

            let dataModelsType = '';
            let dataModelsValue = '';
            let dataModelsMetadata = {};

            if (res.data[0].dataModels){
                dataModelsType = res.data[0].dataModels.type;
                dataModelsValue = res.data[0].dataModels.value;
                dataModelsMetadata = res.data[0].dataModels.metadata;
            } 

            let dataProvidedType = '';
            let dataProvidedValue = '';
            let dataProvidedMetadata = {};

            if (res.data[0].dataProvided){
                dataProvidedType = res.data[0].dataProvided.type;
                dataProvidedValue = res.data[0].dataProvided.value;
                dataProvidedMetadata = res.data[0].dataProvided.metadata;           
            }

            let attributes = res.data[0].attributes;
            let service = res.data[0].service;
            let servicePath = res.data[0].servicePath;
            let mapping = res.data[0].mapping;
            let dataportsDataModelandFormat = res.data[0].isPartOfDataPortsModel;
            
            await metadataApi.createDataSourceMetadataInternal(usernameOfProvider,orgOfProvider, datasetName, id, dataSourceType, dataModelsType, dataModelsValue, dataModelsMetadata, 
                dataProvidedType, dataProvidedValue, dataProvidedMetadata, attributes, service, servicePath, mapping, dataportsDataModelandFormat);
            return (true);
        }else{
            console.log('No ThPA data source found for id: %s', dataSourceID)
            return(false);
        }
    } catch (error) {
        console.error(`Failed: ${error}`);
        return (`Failed: ${error}`);
    }
}


exports.searchDatasourceMetadataThPA = searchDatasourceMetadataThPA;


const searchDatasourceMetadataBaleares = async function (usernameOfProvider, orgOfProvider, datasetName, dataSourceID) {
  
    try {
        console.log('Is searching for the entity %s at the Baleares semantic interoperability component', dataSourceID);
        let token = await getIMToken.requestIMToken();
        console.log(token.access_token)
        let data = ''
        const headers = {
            'Fiware-Service': 'metadata',
            'Authorization' : 'Bearer'  + ' ' + token.access_token
        }
        const config = {
            method: 'get',
            url: `https://perico1.dcom.upv.es:8080/orion/v2/entities?type=DataSource&id=${dataSourceID}`,
            headers: headers,
            data : data
        }
    
        let res = await axios(config)
        console.log(res.data);

        console.log(`Status: ${res.status}`)
        console.log(`Date: ${res.headers.date}`)

        if (res.data.length > 0){
            let id = res.data[0].id;
            console.log('Found data source metadata for id: %s', id)
            let dataSourceType = res.data[0].type;

            let dataModelsType = '';
            let dataModelsValue = '';
            let dataModelsMetadata = {};

            if (res.data[0].dataModels){
                dataModelsType = res.data[0].dataModels.type;
                dataModelsValue = res.data[0].dataModels.value;
                dataModelsMetadata = res.data[0].dataModels.metadata;
            } 

            let dataProvidedType = '';
            let dataProvidedValue = '';
            let dataProvidedMetadata = {};

            if (res.data[0].dataProvided){
                dataProvidedType = res.data[0].dataProvided.type;
                dataProvidedValue = res.data[0].dataProvided.value;
                dataProvidedMetadata = res.data[0].dataProvided.metadata;           
            }

            let attributes = res.data[0].attributes;
            let service = res.data[0].service;
            let servicePath = res.data[0].servicePath;
            let mapping = res.data[0].mapping;
            let dataportsDataModelandFormat = res.data[0].isPartOfDataPortsModel;
            
            await metadataApi.createDataSourceMetadataInternal(usernameOfProvider,orgOfProvider, datasetName, id, dataSourceType, dataModelsType, dataModelsValue, dataModelsMetadata, 
                dataProvidedType, dataProvidedValue, dataProvidedMetadata, attributes, service, servicePath, mapping, dataportsDataModelandFormat);
            return (true);
        }else{
            console.log('No Baleares data source found for id: %s', dataSourceID)
            return(false);
        }
    } catch (error) {
        console.error(`Failed: ${error}`);
        return (`Failed: ${error}`);
    }
}

exports.searchDatasourceMetadataBaleares = searchDatasourceMetadataBaleares;