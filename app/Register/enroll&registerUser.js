
'use strict';

const { FileSystemWallet, Gateway, X509WalletMixin } = require('fabric-network');
const path = require('path');

const registerOrgUser = async function(adminusername, adminorg, usertype, body) {
    try {
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

        console.log('Enrolls and register the user username: %s title: %s name: %s surname: %s email: %s  externalOrg: %s externalUser: %s',registeredUser, registeredOrg, body.name, body.surname, body.email, body.externalOrg, body.isExternalUser)
        const con_profile = 'connection-'+ adminorg +'.json';
        const ccpPath = path.resolve(__dirname, '..','..', '..', 'Dataports_Global_Network_full/connection-files/', con_profile);
        let wallet_info = '../dataportsappGlobal/app/dataportswallet/' + adminorg;
        console.log(body)
        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), wallet_info);
        const wallet = new FileSystemWallet(walletPath);
        console.log(`Wallet path for org user: ${walletPath}`);
        
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
        await gateway.connect(ccpPath, { wallet, identity: adminusername, discovery: { enabled: true, asLocalhost: true } });

        // Get the CA client object from the gateway for interacting with the CA.
        const ca = gateway.getClient().getCertificateAuthority();
        const adminIdentity = gateway.getCurrentIdentity();

        console.log('Is registering identity %s', registeredUser);
        // Register the user, enroll the user, and import the new identity into the wallet.
        const secret = await ca.register({ affiliation: adminorg.toLowerCase() + '.department1', enrollmentID: registeredUser, role: 'client', maxEnrollments: -1,
        attrs: [ {"name": "dataportsRole", "value": usertype, "ecert": true}, 
            {"name": "username", "value": registeredUser, "ecert": true},
            {"name": "name", "value": body.name, "ecert": true}, 
            {"name": "surname", "value": body.surname, "ecert": true},
            {"name": "email", "value": body.email, "ecert": true},
            {"name": "organization", "value": registeredOrg, "ecert": true},
            {"name": "externalOrg", "value": body.externalOrg, "ecert": true},
            {"name": "isExternalUser", "value": String(body.isExternalUser), "ecert": true},
            {"name": "hf.Registrar.Roles", "value": "client"},
            {"name": "hf.Registrar.Attributes", "value": "dataportsRole, username, name, surname, organization, email, externalOrg, isExternalUser, hf.Registrar.Roles"} ] }, adminIdentity);

        console.log('Is enrolling identity %s', registeredUser);
        const enrollment = await ca.enroll({ enrollmentID: registeredUser, enrollmentSecret: secret,
            attr_reqs: [{ name: "dataportsRole", optional: false },
            { name: "username", optional: false },
            { name: "name", optional: false },
            { name: "surname", optional: false },
            { name: "email", optional: false },
            { name: "organization", optional: false },
            { name: "externalOrg", optional: true },
            { name: "isExternalUser", optional: false },
         ]}); 
  
        const MSP = registeredOrg +'MSP';
        const userIdentity = X509WalletMixin.createIdentity(MSP, enrollment.certificate, enrollment.key.toBytes());
        await wallet.import(registeredUser, userIdentity);
        console.log('Successfully registered and enrolled admin user %s and imported it into the wallet', registeredUser);

        return ('Has been registered and enrolled successfully');
    } catch (error) {
        console.error(`Failed to register user: ${error}`);
        return (error);
    }
}

exports.registerOrgUser = registerOrgUser;