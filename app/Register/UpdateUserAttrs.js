
'use strict';

const { FileSystemWallet, Gateway} = require('fabric-network');
const path = require('path');

const updateUserAttrs = async function(username, organization, name, surname, email) {
    try {
        const con_profile = 'connection-'+ organization +'.json';
        const ccpPath = path.resolve(__dirname, '..','..', '..', 'Dataports_Global_Network_full/connection-files/', con_profile);
        let wallet_info = '../dataportsappGlobal/app/dataportswallet/' + organization

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), wallet_info);
        const wallet = new FileSystemWallet(walletPath);
        console.log(`Wallet path for org user: ${walletPath}`);
    

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccpPath, { wallet, identity: username, discovery: { enabled: true, asLocalhost: true } });
        const ca = gateway.getClient().getCertificateAuthority();
        const adminIdentity = gateway.getCurrentIdentity();
        const identityService = ca.newIdentityService();

        let updateObj = { attrs:
            [
                {"name": "name", "value": name, "ecert": true}, 
                {"name": "surname", "value": surname, "ecert": true},
                {"name": "email", "value": email, "ecert": true}
            ]
        }

        // update identity
        const response = await identityService.update(username,updateObj,adminIdentity)
        console.log("userIdenity attributes: ",response.result.attrs)
        } catch (error) {
        console.error(`Failed to update attributes: ${error}`);
        return error;
        }
}

exports.updateUserAttrs = updateUserAttrs;

