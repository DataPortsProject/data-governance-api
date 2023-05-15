'use strict';
//MetadataSC
let Metadata = require('./../app/Metadata/metadataApi.js');
//Validation
let validation = require('./../app/Validation/validator.js');
//token Validation
let tokenValidation = require('./../app/Helper/validateTokens.js');

const express = require('express');
const router = express.Router();

router.use((req, res, next) => {
    const timestamp = new Date().toLocaleString();
    console.log(`[${timestamp}] Request received: ${req.method} ${req.url}`);
    next();
  })


  router.get('/testing',async (req, res) => {
    console.log('The header is:')
    console.log(req.headers);
    console.log('The body is:')
    console.log(req.body);
    
});
//Integration with Sem Int
let semIntIDs = require('./../app/SemanticInteroperability/dataSourceIDs.js');

router.get('/dataSourceIDsVPF',async (req, res) => {
    try{
        console.log("Searching for VPF data source IDs")
        semIntIDs.getDataSourceIDsVPF()
        .then((result) => {
            res.json({
                result: result
            })
         });      
    } catch (error) {
        console.error(`Failed: ${error}`);
        return error
    }
});  

router.get('/dataSourceIDsThPA',async (req, res) => {
    try{
        console.log("Searching for ThPA data source IDs")
        semIntIDs.getDataSourceIDsThPA()
        .then((result) => {
            res.json({
                result: result
            })
         });      
    } catch (error) {
        console.error(`Failed: ${error}`);
        return error
    }
}); 

router.get('/getAllDataSourceIDs',async (req, res) => {
    try{
        console.log("Searching for ThPA & VPF & Baleares data source IDs")
        semIntIDs.getAllDataSourceIDs()
        .then((result) => {
            res.json({
                result: result
            })
         });      
    } catch (error) {
        console.error(`Failed: ${error}`);
        return error
    }
});  

router.get('/queryMetadataByName/:datasetName',async (req, res) => {
    try{
        let tokenCheck = await tokenValidation.tokenValidation(req);
        console.log(tokenCheck);
        if (tokenCheck[0] === "CustomError") {
            return res.status(tokenCheck[1]).json(tokenCheck[2]);
        }
        
        let username = tokenCheck[0]
        let organization = tokenCheck[1]
        let datasetName = req.params.datasetName;

        Metadata.queryMetadataByName(username, organization, datasetName)
        .then((result) => {
            result = JSON.parse(result.toString())
            res.json({
                result: result
            })
         });      
    } catch (error) {
        console.error(`Failed: ${error}`);
        return error
    }
});  

router.get('/queryMetadataByName/:datasetName',async (req, res) => {
    try{
        let tokenCheck = await tokenValidation.tokenValidation(req);
        console.log(tokenCheck);
        if (tokenCheck[0] === "CustomError") {
            return res.status(tokenCheck[1]).json(tokenCheck[2]);
        }
        
        let username = tokenCheck[0]
        let organization = tokenCheck[1]
        let datasetName = req.params.datasetName;

        Metadata.queryMetadataByName(username, organization, datasetName)
        .then((result) => {
            result = JSON.parse(result.toString())
            res.json({
                result: result
            })
         });      
    } catch (error) {
        console.error(`Failed: ${error}`);
        return error
    }
});  

router.get('/queryMetadataByDataSourceID/:dataSourceID',async (req, res) => {
    try{
        let tokenCheck = await tokenValidation.tokenValidation(req);
        console.log(tokenCheck);
        if (tokenCheck[0] === "CustomError") {
            return res.status(tokenCheck[1]).json(tokenCheck[2]);
        }
        
        let username = tokenCheck[0]
        let organization = tokenCheck[1]
        let dataSourceID = req.params.dataSourceID;

        Metadata.queryMetadataByDataSourceID(username, organization, dataSourceID)
        .then((result) => {
            result = JSON.parse(result.toString())
            res.json({
                result: result
            })
         });      
    } catch (error) {
        console.error(`Failed: ${error}`);
        return error
    }
}); 

router.get('/queryMetadataByOwner',async (req, res) => {
    try{
        let tokenCheck = await tokenValidation.tokenValidation(req);
        console.log(tokenCheck);
        if (tokenCheck[0] === "CustomError") {
            return res.status(tokenCheck[1]).json(tokenCheck[2]);
        }
        
        let username = tokenCheck[0]
        let organization = tokenCheck[1]   
        Metadata.queryMetadataByOwner(username, organization)
        .then((result) => {
            result = JSON.parse(result.toString())
            res.json({
                result: result
            })
         });      
    } catch (error) {
        console.error(`Failed: ${error}`);
        return error
    }
});  

router.get('/queryMetadataByOwnerAndDatasetName/:datasetName',async (req, res) => {
    try{
        let tokenCheck = await tokenValidation.tokenValidation(req);
        console.log(tokenCheck);
        if (tokenCheck[0] === "CustomError") {
            return res.status(tokenCheck[1]).json(tokenCheck[2]);
        }
        
        let username = tokenCheck[0]
        let organization = tokenCheck[1]
        let datasetName = req.params.datasetName;

        Metadata.queryMetadataByOwnerAndDatasetName(username, organization, datasetName)
        .then((result) => {
            result = JSON.parse(result.toString())
            res.json({
                result: result
            })
        });      
    } catch (error) {
        console.error(`Failed: ${error}`);
        return error
    }
}); 

router.get('/queryMetadataByProvider',async (req, res) => {
    try{
        let tokenCheck = await tokenValidation.tokenValidation(req);
        console.log(tokenCheck);
        if (tokenCheck[0] === "CustomError") {
            return res.status(tokenCheck[1]).json(tokenCheck[2]);
        }
        
        let username = tokenCheck[0]
        let organization = tokenCheck[1]  
        Metadata.queryMetadataByProvider(username, organization)
        .then((result) => {
            result = JSON.parse(result.toString())
            res.json({
                result: result
            })
         });      
    } catch (error) {
        console.error(`Failed: ${error}`);
        return error
    }
});  

router.get('/queryMetadataByProviderAndDatasetName/:datasetName',async (req, res) => {
    try{
        let tokenCheck = await tokenValidation.tokenValidation(req);
        console.log(tokenCheck);
        if (tokenCheck[0] === "CustomError") {
            return res.status(tokenCheck[1]).json(tokenCheck[2]);
        }
        
        let username = tokenCheck[0]
        let organization = tokenCheck[1]
        let datasetName = req.params.datasetName;

        Metadata.queryMetadataByProviderAndDatasetName(username, organization, datasetName)
        .then((result) => {
            result = JSON.parse(result.toString())
            res.json({
                result: result
            })
        });      
    } catch (error) {
        console.error(`Failed: ${error}`);
        return error
    }
}); 

router.get('/queryMetadataByOrganizationOwner',async (req, res) => {
    try{
        let tokenCheck = await tokenValidation.tokenValidation(req);
        console.log(tokenCheck);
        if (tokenCheck[0] === "CustomError") {
            return res.status(tokenCheck[1]).json(tokenCheck[2]);
        }
        
        let username = tokenCheck[0]
        let organization = tokenCheck[1]
        
        Metadata.queryMetadataByOrganizationOwner(username, organization)
        .then((result) => {
            console.log("The result is:")
            console.log(result)
            if (result.includes("Fail") || result.includes("Error")){
                res.status(500).send(result);
            }else{
                result = JSON.parse(result.toString())
                res.json({
                    result: result
                })
            }
        });      
    } catch (error) {
        console.error(`Failed: ${error}`);
        return error
    }
}); 

router.get('/queryMetadataByOrganizationOwnerAndDatasetName/:datasetName',async (req, res) => {
    try{
        let tokenCheck = await tokenValidation.tokenValidation(req);
        console.log(tokenCheck);
        if (tokenCheck[0] === "CustomError") {
            return res.status(tokenCheck[1]).json(tokenCheck[2]);
        }
        
        let username = tokenCheck[0]
        let organization = tokenCheck[1]
        let datasetName = req.params.datasetName;

        Metadata.queryMetadataByOrganizationOwnerAndDatasetName(username, organization, datasetName)
        .then((result) => {
            consol.log("The result is:")
            console.log(result)
            if (result.includes("Fail") || result.includes("Error")){
                res.status(500).send(result);
            }else{
                result = JSON.parse(result.toString())
                res.json({
                    result: result
                })
            }
        });      
    } catch (error) {
        console.error(`Failed: ${error}`);
        return error
    }
}); 

router.get('/querymetadatastruct',async (req, res) => { 
    try{
        let tokenCheck = await tokenValidation.tokenValidation(req);
        console.log(tokenCheck);
        if (tokenCheck[0] === "CustomError") {
            return res.status(tokenCheck[1]).json(tokenCheck[2]);
        }


        let username = tokenCheck[0]
        let organization = tokenCheck[1]  
        Metadata.querymetadatastruct(username, organization)
        .then((result) => {
            result = JSON.parse(result.toString())
            res.json({
                result: result
            })
         });      
    } catch (error) {
        console.error(`Failed: ${error}`);
        return error
    }
});  

router.get('/queryMetadataBy1CondOperator/:field/:operand/:value',async (req, res) => {
    try{
        let tokenCheck = await tokenValidation.tokenValidation(req);
        console.log(tokenCheck);
        if (tokenCheck[0] === "CustomError") {
            return res.status(tokenCheck[1]).json(tokenCheck[2]);
        }
        
        let username = tokenCheck[0]
        let organization = tokenCheck[1]
        let field = req.params.field;
        let operand = req.params.operand;
        let value = req.params.value;

        Metadata.queryMetadataBy1CondOperator(username, organization, field, operand, value)
        .then((result) => {
            result = JSON.parse(result.toString())
            res.json({
                result: result
            })
        });      
    } catch (error) {
        console.error(`Failed: ${error}`);
        return error
    }
}); 

router.get('/queryMetadataBy2CondOperators/:field/:operand1/:valueMin/:operand2/:valueMax',async (req, res) => {
    try{
        let tokenCheck = await tokenValidation.tokenValidation(req);
        console.log(tokenCheck);
        if (tokenCheck[0] === "CustomError") {
            return res.status(tokenCheck[1]).json(tokenCheck[2]);
        }
        
        let username = tokenCheck[0]
        let organization = tokenCheck[1]
        let field = req.params.field;
        let operand1 = req.params.operand1;
        let operand2 = req.params.operand2;
        let valueMin = req.params.valueMin;
        let valueMax = req.params.valueMax;

        Metadata.queryMetadataBy2CondOperators(username, organization, 
            field, operand1, operand2, valueMin, valueMax)
        .then((result) => {
            result = JSON.parse(result.toString())
            res.json({
                result: result
            })
        });      
    } catch (error) {
        console.error(`Failed: ${error}`);
        return error
    }
}); 


router.get('/queryMetadataByFieldAndValue/:field/:value',async (req, res) => {
    try{
        let tokenCheck = await tokenValidation.tokenValidation(req);
        console.log(tokenCheck);
        if (tokenCheck[0] === "CustomError") {
            return res.status(tokenCheck[1]).json(tokenCheck[2]);
        }
        
        let username = tokenCheck[0]
        let organization = tokenCheck[1]
        let field = req.params.field;
        let value = req.params.value;


        Metadata.queryMetadataByFieldAndValue(username, organization, 
            field, value)
        .then((result) => {
            result = JSON.parse(result.toString())
            res.json({
                result: result
            })
        });      
    } catch (error) {
        console.error(`Failed: ${error}`);
        return error
    }
}); 

router.get('/queryMetadataInArray/:field/:value',async (req, res) => {
    try{
        let tokenCheck = await tokenValidation.tokenValidation(req);
        console.log(tokenCheck);
        if (tokenCheck[0] === "CustomError") {
            return res.status(tokenCheck[1]).json(tokenCheck[2]);
        }
        
        let username = tokenCheck[0]
        let organization = tokenCheck[1]
        let field = req.params.field;
        let value = req.params.value;

        Metadata.queryMetadataInArray(username, organization, field, value)
        .then((result) => {
            result = JSON.parse(result.toString())
            res.json({
                result: result
            })
        });      
    } catch (error) {
        console.error(`Failed: ${error}`);
        return error
    }
}); 

router.get('/queryMetadataByFreeText/:field/:value',async (req, res) => {
    try{
        let tokenCheck = await tokenValidation.tokenValidation(req);
        console.log(tokenCheck);
        if (tokenCheck[0] === "CustomError") {
            return res.status(tokenCheck[1]).json(tokenCheck[2]);
        }
        
        let username = tokenCheck[0]
        let organization = tokenCheck[1]
        let field = req.params.field;
        let value = req.params.value;

        Metadata.queryMetadataByFreeText(username, organization, field, value)
        .then((result) => {
            result = JSON.parse(result.toString())
            res.json({
                result: result
            })
        });      
    } catch (error) {
        console.error(`Failed: ${error}`);
        return error
    }
});  

router.post('/queryMetadataCombination', validation.queryMetadataValidation(), async (req, res) => {
    console.log(req.body)
  try{
        let tokenCheck = await tokenValidation.tokenValidation(req);
        console.log(tokenCheck);
        if (tokenCheck[0] === "CustomError") {
            return res.status(tokenCheck[1]).json(tokenCheck[2]);
        }
        
        let username = tokenCheck[0]
        let organization = tokenCheck[1]

        Metadata.queryMetadataCombination(username, organization, req.body)
        .then((result) => {
            result = JSON.parse(result.toString())
            res.json({
                result: result
            })
        });      
    } catch (error) {
        console.error(`Failed: ${error}`);
        return error
    }
});  

router.get('/queryCustomLists',async (req, res) => {
  try{
        let tokenCheck = await tokenValidation.tokenValidation(req);
        console.log(tokenCheck);
        if (tokenCheck[0] === "CustomError") {
            return res.status(tokenCheck[1]).json(tokenCheck[2]);
        }

        let username = tokenCheck[0]
        let organization = tokenCheck[1]
    
        Metadata.queryCustomLists(username, organization)
        .then((result) => {
            result = JSON.parse(result.toString())
            res.json({
                result: result
            })
        });      
    } catch (error) {
        console.error(`Failed: ${error}`);
        return error
    }
}); 

router.get('/queryDataSourceMetadataByDataProvided/:value',async (req, res) => {
  try{
        let tokenCheck = await tokenValidation.tokenValidation(req);
        console.log(tokenCheck);
        if (tokenCheck[0] === "CustomError") {
            return res.status(tokenCheck[1]).json(tokenCheck[2]);
        }

        let username = tokenCheck[0]
        let organization = tokenCheck[1]
        let value = req.params.value;    
        Metadata.queryDataSourceMetadataByDataProvided(username, organization, value)
        .then((result) => {
            result = JSON.parse(result.toString())
            res.json({
                result: result
            })
        });      
    } catch (error) {
        console.error(`Failed: ${error}`);
        return error
    }
}); 

router.post('/uploadMetadata', validation.metadataValidation(),async (req, res) => {
    try{
        console.log(req.body)

        let tokenCheck = await tokenValidation.tokenValidation(req);
        console.log(tokenCheck);
        if (tokenCheck[0] === "CustomError") {
            return res.status(tokenCheck[1]).json(tokenCheck[2]);
        }
        
        let usernameOfProvider = tokenCheck[0]
        let organizationOfProvider = tokenCheck[1]        

        Metadata.uploadMetadata(usernameOfProvider, organizationOfProvider, req.body)
        .then((result) => {
            if (result=="Available username"){
                res.status(400).send("The owner's username does not exist");
            }else if (result=="email does not match to username"){
                res.status(403).send("Email does not match with the logged in user");
            }else if (result=="Not valid temporalCoverageStart format. YYYY-MM-DD"){
                res.status(400).send("Not valid temporalCoverageStart format. YYYY-MM-DD");
            }else if (result=="Not valid temporalCoverageEnd format. YYYY-MM-DD"){
                res.status(400).send("Not valid temporalCoverageEnd format. YYYY-MM-DD");
            }else if (result.includes("Fail") || result.includes("Error")){
                res.status(500).send(result);           
            }else{
                res.json({
                    response: result
                })
            }
        });      
    } catch (error) {
        console.error(`Failed: ${error}`);
        return error
    }
}); 
    

router.put('/updateMetadata', validation.metadataValidation(),async (req, res) => {
    try{
        console.log(req.body)

        let tokenCheck = await tokenValidation.tokenValidation(req);
        console.log(tokenCheck);
        if (tokenCheck[0] === "CustomError") {
            return res.status(tokenCheck[1]).json(tokenCheck[2]);
        }

        let usernameOfProvider = tokenCheck[0]
        let organizationOfProvider = tokenCheck[1]    
        
        Metadata.updateMetadata(usernameOfProvider, organizationOfProvider, req.body)
        .then((result) => {
            if (result=="Available username"){
                res.status(400).send("The owner's username does not exist");
            }else if (result=="email does not match to username"){
                res.status(403).send("Email does not match with the logged in user");
            }else if (result=="Not valid temporalCoverageStart format. YYYY-MM-DD"){
                res.status(400).send("Not valid temporalCoverageStart format. YYYY-MM-DD");
            }else if (result=="Not valid temporalCoverageEnd format. YYYY-MM-DD"){
                res.status(400).send("Not valid temporalCoverageEnd format. YYYY-MM-DD");
            }else if (result.includes("Fail") || result.includes("Error")){
                res.status(500).send(result);            
            }else{
                res.json({
                    response: result
                })
            }
        });      
    } catch (error) {
        console.error(`Failed: ${error}`);
        return error
    }
}); 

router.get('/getMetadataRole/:datasetName',async (req, res) => {
  try{
        let tokenCheck = await tokenValidation.tokenValidation(req);
        console.log(tokenCheck);
        if (tokenCheck[0] === "CustomError") {
            return res.status(tokenCheck[1]).json(tokenCheck[2]);
        }
        
        let username = tokenCheck[0]
        let organization = tokenCheck[1]    
        let datasetName = req.params.datasetName;

        Metadata.getMetadataRole(username, organization, datasetName)
        .then((result) => {
            res.json({
                result: result
            })
        });      
    } catch (error) {
        console.error(`Failed: ${error}`);
        return error
    }
}); 

const fetch = (...args) =>
	import('node-fetch').then(({default: fetch}) => fetch(...args));

// NOT token code for the following endpoint
router.post('/createDataSourceMetadata',async (req, res) => {
    console.log('The header is:')
    console.log(req.headers);
    const organization = 'EXT';

    console.log('The body is:')
    console.log(req.body);
    console.log('The creds are:')
    console.log(req.headers.si_account_username, req.headers.si_account_password)
    console.log('The creds found')
    const data = JSON.stringify({
        "username": req.headers.si_account_username,
        "password": req.headers.si_account_password,
        "organization":  organization
      });
      
    const config = {
        method: 'post',
        headers: { 
          'Content-Type': 'application/json'
        },
        body : data
    };
      
    const url ='https://iam.dataports.com.es:9443/login';

    try {
		let response = await fetch(url, config);
        console.log(response);
		response = await response.json();
        console.log(response);
		//res.status(200).json(response);
	} catch (err) {
		console.log(err);
		res.status(500).json({msg: `Internal Server Error.`});
	}


    let datasourceID = req.body.data[0].id;
    let dataSourceType = req.body.data[0].type;

    let dataModelsValue = '';
    let dataModelsType = '';
    let dataModelsMetadata = {};

    if (req.body.data[0].dataModels){
        dataModelsValue = req.body.data[0].dataModels.value;
        dataModelsType = req.body.data[0].dataModels.type;
        dataModelsMetadata = req.body.data[0].dataModels.metadata;
    }

    let dataProvidedType = '';
    let dataProvidedValue = '';
    let dataProvidedMetadata = {};

    if (req.body.data[0].dataProvided){
            dataProvidedType = req.body.data[0].dataProvided.type;
            dataProvidedValue = req.body.data[0].dataProvided.value;
            dataProvidedMetadata = req.body.data[0].dataProvided.metadata;           
    }
        
    let attributes = req.body.data[0].attributes;
    let service = req.body.data[0].service;
    let servicePath = req.body.data[0].servicePath;
    let mapping = req.body.data[0].mapping;
    let dataportsDataModelandFormat = req.body.data[0].isPartOfDataPortsModel;

    Metadata.createDataSourceMetadata( organization, req.headers.si_account_username, datasourceID, dataSourceType,
        dataModelsType, dataModelsValue, dataModelsMetadata, dataProvidedType, dataProvidedValue, dataProvidedMetadata,
        attributes, service, servicePath, mapping, dataportsDataModelandFormat)
    .then((response) => {
        if (response.includes("Fail") || response.includes("Error")){
            res.status(500).send(response);            
        }else{
            res.json({
                response: response
            })
        }
    });
});

router.get('/getDatasourceMetadataByDatasetName/:datasetName',async (req, res) => {
  try{
        let tokenCheck = await tokenValidation.tokenValidation(req);
        console.log(tokenCheck);
        if (tokenCheck[0] === "CustomError") {
            return res.status(tokenCheck[1]).json(tokenCheck[2]);
        }
        
        let username = tokenCheck[0]
        let organization = tokenCheck[1]    
        let datasetName = req.params.datasetName;

        Metadata.getDatasourceMetadataByDatasetName(username, organization, datasetName)
        .then((result) => {
            res.json({
                result: result
            })
        });      
    } catch (error) {
        console.error(`Failed: ${error}`);
        return error
    }
}); 

module.exports = router