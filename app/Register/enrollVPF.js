'use strict';

const FabricCAServices = require('fabric-ca-client');
const { FileSystemWallet, X509WalletMixin } = require('fabric-network');
const fs = require('fs');
const path = require('path');
const jsonReader = require ('./init/readJSON.js');

const ccpPath = path.resolve(__dirname, '..','..', '..', 'Dataports_Global_Network_full/connection-files', 'connection-VPF.json');
const ccpJSON = fs.readFileSync(ccpPath, 'utf8');
const ccp = JSON.parse(ccpJSON);

let register = require('./registerApi.js');

async function main() {
    try {

        // Create a new CA client for interacting with the CA.
        const caInfo = ccp.certificateAuthorities['ca-VPF'];
        const caTLSCACerts = caInfo.tlsCACerts.pem;
        const ca = new FabricCAServices(caInfo.url, { trustedRoots: caTLSCACerts, verify: false }, caInfo.caName);

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), '../dataportsappGlobal/app/dataportswallet/VPF');
        const wallet = new FileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the admin user.
        const adminExists = await wallet.exists('adminNetVPF');
        if (adminExists) {
            console.log('An identity for the admin user "adminNetVPF" already exists in the wallet');
            return;
        }
        // Enroll the admin user, and import the new identity into the wallet.
        const enrollment = await ca.enroll({ enrollmentID: 'adminNetVPF', enrollmentSecret: 'adminpw',
            attr_reqs: [{ name: "dataportsRole", optional: false },
            { name: "username", optional: false },
            { name: "name", optional: false },
            { name: "surname", optional: false },
            { name: "email", optional: false },
            { name: "organization", optional: false },
            { name: "externalOrg", optional: true },
            { name: "isExternalUser", optional: false }]});
        const identity = X509WalletMixin.createIdentity('VPFMSP', enrollment.certificate, enrollment.key.toBytes());
        await wallet.import('adminNetVPF', identity);
        console.log('Successfully enrolled network admin user "adminNetVPF" and imported it into the dataports wallet');
        let adminNetVPF = await jsonReader.readFile('adminNetVPF.json');
        await register.registerUser("adminNetVPF","VPF","x1x2x3", adminNetVPF);
        console.log("VPF network admin registered on Data Governance");
        let VPForgJSON = await jsonReader.readFile('VPF.json');
        await register.registrationOrg("adminNetVPF","VPF","x1x2x3", VPForgJSON);
        
        console.log("VPF organization and its admin registered on Data Governance")       

    } catch (error) {
        console.error(`Failed to enroll VPF admins: ${error}`);
    }
}

main();