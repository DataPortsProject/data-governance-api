'use strict';

const FabricCAServices = require('fabric-ca-client');
const { FileSystemWallet, X509WalletMixin } = require('fabric-network');
const fs = require('fs');
const path = require('path');
const jsonReader = require ('./init/readJSON.js');

const ccpPath = path.resolve(__dirname, '..','..', '..', 'Dataports_Global_Network_full/connection-files', 'connection-ThPA.json');
const ccpJSON = fs.readFileSync(ccpPath, 'utf8');
const ccp = JSON.parse(ccpJSON);

let register = require('./registerApi.js');

async function main() {
    try {

        // Create a new CA client for interacting with the CA.
        const caInfo = ccp.certificateAuthorities['ca-ThPA'];
        const caTLSCACerts = caInfo.tlsCACerts.pem;
        const ca = new FabricCAServices(caInfo.url, { trustedRoots: caTLSCACerts, verify: false }, caInfo.caName);

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), '../dataportsappGlobal/app/dataportswallet/ThPA');
        const wallet = new FileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the admin user.
        const adminExists = await wallet.exists('adminNetThPA');
        if (adminExists) {
            console.log('An identity for the admin user "adminNetThPA" already exists in the wallet');
            return;
        }
        // Enroll the admin user, and import the new identity into the wallet.
        const enrollment = await ca.enroll({ enrollmentID: 'adminNetThPA', enrollmentSecret: 'adminpw',
            attr_reqs: [{ name: "dataportsRole", optional: false },
            { name: "username", optional: false },
            { name: "name", optional: false },
            { name: "surname", optional: false },
            { name: "email", optional: false },
            { name: "organization", optional: false },
            { name: "externalOrg", optional: true },
            { name: "isExternalUser", optional: false }]});
        const identity = X509WalletMixin.createIdentity('ThPAMSP', enrollment.certificate, enrollment.key.toBytes());
        await wallet.import('adminNetThPA', identity);
        console.log('Successfully enrolled network admin user "adminNetThPA" and imported it into the dataports wallet');
        let adminNetThPAJSON = await jsonReader.readFile('adminNetThPA.json');
        await register.registerUser("adminNetThPA","ThPA", "x1x2x3", adminNetThPAJSON);
        console.log("ThPA network admin registered on Data Governance")
        let ThPAorgJSON = await jsonReader.readFile('ThPA.json');
        await register.registrationOrg("adminNetThPA","ThPA", "x1x2x3", ThPAorgJSON);
        console.log("ThPA organization and its admin registered on Data Governance")       

    } catch (error) {
        console.error(`Failed to enroll ThPA admins: ${error}`);
    }
}

main();