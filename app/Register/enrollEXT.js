'use strict';

const FabricCAServices = require('fabric-ca-client');
const { FileSystemWallet, X509WalletMixin } = require('fabric-network');
const fs = require('fs');
const path = require('path');
const jsonReader = require ('./init/readJSON.js');

const ccpPath = path.resolve(__dirname, '..','..', '..', 'Dataports_Global_Network_full/connection-files', 'connection-EXT.json');
const ccpJSON = fs.readFileSync(ccpPath, 'utf8');
const ccp = JSON.parse(ccpJSON);

let register = require('./registerApi.js');
let semanticInteroperabilitySubscription = require('./../SemanticInteroperability/subscription.js')

async function main() {
    try {

        // Create a new CA client for interacting with the CA.
        const caInfo = ccp.certificateAuthorities['ca-EXT'];
        const caTLSCACerts = caInfo.tlsCACerts.pem;
        const ca = new FabricCAServices(caInfo.url, { trustedRoots: caTLSCACerts, verify: false }, caInfo.caName);

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), '../dataportsappGlobal/app/dataportswallet/EXT');
        const wallet = new FileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the admin user.
        const adminExists = await wallet.exists('adminNetEXT');
        if (adminExists) {
            console.log('An identity for the admin user "adminNetEXT" already exists in the wallet');
            return;
        }
        // Enroll the admin user, and import the new identity into the wallet.
        const enrollment = await ca.enroll({ enrollmentID: 'adminNetEXT', enrollmentSecret: 'adminpw',
            attr_reqs: [{ name: "dataportsRole", optional: false },
            { name: "username", optional: false },
            { name: "name", optional: false },
            { name: "surname", optional: false },
            { name: "email", optional: false },
            { name: "organization", optional: false },
            { name: "externalOrg", optional: true },
            { name: "isExternalUser", optional: false }]});
        const identity = X509WalletMixin.createIdentity('EXTMSP', enrollment.certificate, enrollment.key.toBytes());
        await wallet.import('adminNetEXT', identity);

        let adminNetEXTJSON = await jsonReader.readFile('adminNetEXT.json');
        console.log('Successfully enrolled network admin user "adminNetEXT" and imported it into the dataports wallet');
        await register.registerUser("adminNetEXT","EXT","x1x2x3", adminNetEXTJSON);

        console.log("EXT network admin registered on Data Governance")
        let EXTorgJSON = await jsonReader.readFile('EXT.json');
        await register.registrationOrg("adminNetEXT","EXT", "x1x2x3", EXTorgJSON);
       
        console.log("EXT organization and the 1st admin registered on Data Governance")
        let adminVPFextJSON = await jsonReader.readFile('adminVPFext.json');
        await register.registerUser("adminNetEXT","EXT","x1x2x3", adminVPFextJSON);     

        //register external org dataports and users
        console.log('Registering DataPorts external organization');
        let dataPortsJSON = await jsonReader.readFile('DataPorts.json');
        await register.registrationOrg("adminThPAext","EXT","x1x2x3", dataPortsJSON);
        
        //Register VPF Semantic Interoperability component
        console.log('Registering VPF Semantic Interoperability component');
        let semanticInteroperabilityVPFJSON = await jsonReader.readFile('SemanticInteroperabilityVPF.json');
        await register.registerUser("data-gov@dataports.org","EXT", "dataports123", semanticInteroperabilityVPFJSON);

        //Register ThPA Semantic Interoperability component
        console.log('Registering ThPA Semantic Interoperability component');
        let semanticInteroperabilityThPAJSON = await jsonReader.readFile('SemanticInteroperabilityThPA.json');
        await register.registerUser("data-gov@dataports.org","EXT", "dataports123", semanticInteroperabilityThPAJSON);
        
        //Register Baleares Semantic Interoperability component
        console.log('Registering Baleares Semantic Interoperability component');
        let semanticInteroperabilityBalearesJSON = await jsonReader.readFile('SemanticInteroperabilityBaleares.json');
        await register.registerUser("data-gov@dataports.org","EXT", "dataports123", semanticInteroperabilityBalearesJSON);
        
        //Register Data Abstraction and Virtualization component
        console.log('Registering Data Abstraction and Virtualization component');
        let dataAbstractionandVirtualizationJSON = await jsonReader.readFile('DataAbstractionandVirtualization.json');
        await register.registerUser("data-gov@dataports.org","EXT", "x1x2x3", dataAbstractionandVirtualizationJSON);

        //Register Data Access Container component
        console.log('Registering Data Access Container component');
        let dataAccessContainerJSON = await jsonReader.readFile('DataAccessContainer.json');
        await register.registerUser("data-gov@dataports.org","EXT", "x1x2x3", dataAccessContainerJSON);
        
        //Register ProcessBased Analytics component
        console.log('Registering ProcessBased Analytics component');
        let processBasedAnalyticsJSON = await jsonReader.readFile('ProcessBasedAnalytics.json');
        await register.registerUser("data-gov@dataports.org","EXT", "x1x2x3", processBasedAnalyticsJSON);

        //Register Automated Model Training Engine
        console.log('Registering Automated Model Training Engine');
        let automatedModelTrainingEngineJSON = await jsonReader.readFile('AutomatedModelTrainingEngine.json');
        await register.registerUser("data-gov@dataports.org","EXT", "x1x2x3", automatedModelTrainingEngineJSON);
        console.log('The registration process is finished');

    } catch (error) {
        console.error(`Failed to enroll EXT admins: ${error}`);
    }
    try {
        //Semantic interop subscription for VPF
        console.log('Create VPF subscription Semantic Interoperability')
        await semanticInteroperabilitySubscription.createSubscriptionSemanticInteroperabilityVPF();

        //Semantic interop subscription for ThPA
        console.log('Create ThPA subscription Semantic Interoperability')
        await semanticInteroperabilitySubscription.createSubscriptionSemanticInteroperabilityThPA();

        //Semantic interop subscription for Baleares
        console.log('Create Baleares subscription Semantic Interoperability')
        await semanticInteroperabilitySubscription.createSubscriptionSemanticInteroperabilityBaleares();
        

    } catch (error) {
        console.error(`Failed to create Semantic Interoperability Subscription: ${error}`);
    }
}


main();