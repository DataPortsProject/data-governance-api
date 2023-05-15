
'use strict';

const { FileSystemWallet, Gateway, X509WalletMixin } = require('fabric-network');
const path = require('path');

const registerOrgAdmin = async function(netAdminusername, netAdminorg, usertype, body) {
    try {
        console.log('The network admin: %s %s', netAdminusername, netAdminorg)
        let registeredUser = '';
        if  (typeof body.newUsersusername != 'undefined'){
            registeredUser = body.newUsersusername;
        } else if (typeof body.username != 'undefined'){
            registeredUser = body.username;
        }

        console.log(registeredUser);

        let registeredOrg = '';
        if  (typeof body.title!= 'undefined'){
            registeredOrg = body.title;
        } else if (typeof body.organization != 'undefined'){
            registeredOrg = body.organization;
        }else if (typeof body.userorganization != 'undefined'){
            registeredOrg = body.userorganization;
        }

        console.log(registeredOrg);

        console.log('Enrolls and register the org admin username: %s title: %s name: %s surname: %s email: %s  externalOrg: %s externalUser: %s', registeredUser, registeredOrg, body.name, body.surname, body.email, body.externalOrg, body.isExternalUser)
        const con_profile = 'connection-'+ netAdminorg +'.json';
        const ccpPath = path.resolve(__dirname, '..','..', '..', 'Dataports_Global_Network_full/connection-files/', con_profile);

        const wallet_info= '../dataportsappGlobal/app/dataportswallet/' + netAdminorg;

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), wallet_info);
        const wallet = new FileSystemWallet(walletPath);
        console.log(`Wallet path for org admin: ${walletPath}`);

        console.log('Check for the identity %s if already exists in the wallet', registeredUser);
        // Check to see if we've already enrolled the user.
        const userExists = await wallet.exists(registeredUser);
        if (userExists) {
            console.log('An identity for the user %s already exists in the wallet', registeredUser);
            return;
        }else{
            console.log('An identity for the user %s does not exist in the wallet', registeredUser);
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccpPath, { wallet, identity: netAdminusername, discovery: { enabled: true, asLocalhost: true } });

        // Get the CA client object from the gateway for interacting with the CA.
        const ca = gateway.getClient().getCertificateAuthority();
        const adminIdentity = gateway.getCurrentIdentity();

        console.log('Is registering identity %s', registeredUser);
        const secret = await ca.register({
            affiliation: netAdminorg.toLowerCase() + '.department1',
            enrollmentID: registeredUser,
            role: 'client',
            attrs: [ {"name": "hf.Registrar.Roles", "value": "client"}, 
                {"name": "hf.Registrar.DelegateRoles", "value": "client"}, 
                {"name": "hf.Revoker", "value": "true"},
                {"name": "hf.IntermediateCA", "value": "true"}, 
                {"name": "hf.GenCRL", "value": "true"}, 
                {"name": "hf.AffiliationMgr", "value": "true"}, 
                {"name": "dataportsRole", "value": usertype}, 
                {"name": "username", "value": registeredUser},
                {"name": "name", "value": body.name}, 
                {"name": "surname", "value": body.surname},
                {"name": "email", "value": body.email},
                {"name": "organization", "value": registeredOrg},
                {"name": "externalOrg", "value": body.externalOrg, "ecert": true},
                {"name": "isExternalUser", "value": String(body.isExternalUser), "ecert": true}, 
                {"name": "hf.Registrar.Attributes", "value": "dataportsRole, username, name, surname, organization, email, externalOrg, isExternalUser,hf.Registrar.Roles,hf.Registrar.DelegateRoles,hf.Revoker,hf.IntermediateCA,hf.GenCRL,hf.Registrar.Attributes,hf.AffiliationMgr"} ] }
        , adminIdentity);
        console.log('Is enrolling identity %s', registeredUser);
        const enrollment = await ca.enroll({ enrollmentID: registeredUser, enrollmentSecret: secret,
            attr_reqs: [{ name: "dataportsRole", optional: false },
            { name: "username", optional: false },
            { name: "name", optional: false },
            { name: "surname", optional: false },
            { name: "email", optional: false },
            { name: "organization", optional: false },
            { name: "externalOrg", optional: true },
            { name: "isExternalUser", optional: false },]});   

        const MSP = registeredOrg +'MSP';
        console.log('The MSP is: ' + MSP);
        const userIdentity = X509WalletMixin.createIdentity(MSP, enrollment.certificate, enrollment.key.toBytes());
        await wallet.import(registeredUser, userIdentity);
        console.log('Successfully registered and enrolled admin user %s and imported it into the wallet', registeredUser);

        return ('Has been registered and enrolled successfully');
    } catch (error) {
        console.error(`Failed to register admin: ${error}`);
        return (error);
        
    }
}

exports.registerOrgAdmin = registerOrgAdmin;