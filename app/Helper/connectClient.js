'use strict';

const { FileSystemWallet, Gateway } = require('fabric-network');
const path = require('path');

const connectClient = async function(username, organization, newUser) {
    try {
        console.log ('The user %s %s is connected to dataports client', username, organization)
        const con_profile = 'connection-'+ organization +'.json';
        const ccpPath = path.resolve(__dirname, '..','..', '..', 'Dataports_Global_Network_full/connection-files/', con_profile);
        let wallet_info= '../dataportsappGlobal/app/dataportswallet/' + organization;
                
        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), wallet_info);
        const wallet = new FileSystemWallet(walletPath);
        console.log(`Wallet path on connection: ${walletPath}`);

        if ((newUser != username) && (newUser!=undefined)){
            if (newUser) {
                console.log("The new user is %s",newUser)
                const usernameExists = await wallet.exists(newUser);
                if (usernameExists) {
                    console.log('An identity for the user %s already exists in the Dataports wallet', newUser);
                    return ('Unavailable username');
                }
            }
        }
        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccpPath, { wallet, identity: username, discovery: { enabled: true, asLocalhost: true } });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('global');

        return [network, gateway];

    } catch (error) {
        console.error(`Failed to connect: ${error}`);
        return error;
    }
}

exports.connectClient = connectClient;
