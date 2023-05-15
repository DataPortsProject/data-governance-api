const getIMToken = require('./getIMToken.js')
const axios = require('axios');

const getDataSourceIDsVPF = async function () {
  
    try {
        console.log('Request SI-VPF for data source IDs');
        var token = await getIMToken.requestIMToken();
        console.log(token.access_token)

        const headers = {
            'Fiware-Service': 'metadata',
            'Authorization' : 'Bearer' + ' ' + token.access_token
          }
        const config = {
            method: 'get',
            url: 'https://dps.dataports.com.es:9000/orion/v2/entities?type=DataSource&attrs=id&limit=1000',
            headers: headers

        }

        let res = await axios(config);
        console.log('The VPF IDs:')
        console.log(res.data);
        return(res.data);

    } catch (error) {
        console.error(`Failed to get data source IDs: ${error}`);
        return (`Failed: ${error}`);
    }    
}
exports.getDataSourceIDsVPF = getDataSourceIDsVPF;

const getDataSourceIDsThPA = async function () {
  
    try {
        console.log('Request SI-ThPA for data source IDs');
        var token = await getIMToken.requestIMToken();
        console.log(token.access_token)

        const headers = {
            'Fiware-Service': 'metadata',
            'Authorization' : 'Bearer' + ' ' + token.access_token
          }
        const config = {
            method: 'get',
            url: 'https://f120.thpa.gr:9000/orion/v2/entities?type=DataSource&attrs=id&limit=1000',
            headers: headers
        }

        let res = await axios(config);
        console.log('The ThPA IDs:')
        console.log(res.data);
        return(res.data);

    } catch (error) {
        console.error(`Failed to get data source IDs: ${error}`);
        return (`Failed: ${error}`);
    }    
}
exports.getDataSourceIDsThPA = getDataSourceIDsThPA;

const getDataSourceIDsBaleares = async function () {
  
    try {
        console.log('Request for SI-Baleares data source IDs');
        var token = await getIMToken.requestIMToken();
        console.log(token.access_token)

        const headers = {
            'Fiware-Service': 'metadata',
            'Authorization' : 'Bearer' + ' ' + token.access_token
          }
        const config = {
            method: 'get',
            url: 'https://perico1.dcom.upv.es:8080/orion/v2/entities?type=DataSource&attrs=id&limit=1000',
            headers: headers
        }

        let res = await axios(config);
        console.log('The Baleares IDs:')
        console.log(res.data);
        return(res.data);

    } catch (error) {
        console.error(`Failed to get data source IDs: ${error}`);
        return (`Failed: ${error}`);
    }    
}
exports.getDataSourceIDsBaleares = getDataSourceIDsBaleares;

const getAllDataSourceIDs = async function () {
  
    try {
        const vpfDataSourceIDs = await getDataSourceIDsVPF();
        const thpaDataSourceIDs = await getDataSourceIDsThPA();
        const balearesDataSourceIDs = await getDataSourceIDsBaleares();

        const allDataSourceIDs = vpfDataSourceIDs.concat(thpaDataSourceIDs).concat(balearesDataSourceIDs);

        return (allDataSourceIDs);


    } catch (error) {
        console.error(`Failed to get all data source IDs: ${error}`);
        return (`Failed: ${error}`);
    }    
}
exports.getAllDataSourceIDs = getAllDataSourceIDs;  

