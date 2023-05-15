
'use strict';

const connectClient = require('./../Helper/connectClient.js');
const { FileSystemWallet, Gateway} = require('fabric-network');
const path = require('path');

exports.login = async (username, password, organization) =>{
    try {
        console.log('user: %s from organization: %s', username, organization)
        let connection = await connectClient.connectClient(username, organization);
        const network = connection[0];
        const gateway = connection[1];

        // Get the contract from the network.
        const contract = network.getContract('registerloginscdataports');
        console.log(username, password, organization);
        const result = await contract.evaluateTransaction('login',username, password);
        console.log(`${result.toString()}`);
        // Disconnect from the gateway.
        await gateway.disconnect();
        return result;

    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        return "wrong credentials";
    }
}

exports.updatePassword = async (username, organization, previouspassword, newpassword) =>{
    try {

        let connection = await connectClient.connectClient(username, organization);
        const network = connection[0];
        const gateway = connection[1];

        // Get the contract from the network.
        const contract = network.getContract('registerloginscdataports');
        console.log(username, organization);
        const result = await contract.submitTransaction('updateUserPasswordObligatory',username, previouspassword, newpassword);
        console.log(`${result.toString()}`);
        // Disconnect from the gateway.
        await gateway.disconnect();
        return ('Success');
        
    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        return ('Fail ' + error);;
    }
}

const writeOrgsLocal = async function (){
    try {
        let username = 'adminNetThPA';
        let organization = 'ThPA';
        const ccpPath = path.resolve(__dirname, '..','..', '..', 'Dataports_Global_Network_full/connection-files', 'connection-'+organization+'.json');

        const wallet_info= '../dataportsappGlobal/app/dataportswallet/' + organization + '/';

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), wallet_info);
        const wallet = new FileSystemWallet(walletPath);
        console.log(`Wallet path to add org to list: ${walletPath}`);

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccpPath, { wallet, identity: username, discovery: { enabled: true, asLocalhost: true } });
 
        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('global');
        const channel = await network.getChannel();
        const orgsList = await channel.getOrganizations();
        let x;
        let newOrgsList;
        let finalnewOrgsList;
        let emptyjson = {} // empty Object
        let key = 'Organization'; 
        emptyjson[key] = [];
        for (x in orgsList){
            newOrgsList = orgsList[x].id;
            finalnewOrgsList = newOrgsList.replace("MSP", '');
            if (finalnewOrgsList != 'Orderer'){
                emptyjson[key].push(finalnewOrgsList);
            }                        
        }
        return (JSON.stringify(emptyjson));

    } catch (error) {
        console.error(`Failed: ${error}`);
    }
}

exports.writeOrgsLocal = writeOrgsLocal;
