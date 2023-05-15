'use strict';
//LoggerSC
let Logger = require('./../app/Logger/loggerApi.js');

//Validation
let tokenValidation = require('./../app/Helper/validateTokens.js');

const express = require('express');
const router = express.Router();

router.use((req, res, next) => {
    const timestamp = new Date().toLocaleString();
    console.log(`[${timestamp}] Request received: ${req.method} ${req.url}`);
    next();
  })

router.get('/queryLoggerMetadata',async (req, res) => {
    try{
        let tokenCheck = await tokenValidation.tokenValidation(req);
        console.log(tokenCheck);
        if (tokenCheck[0] === "CustomError") {
            return res.status(tokenCheck[1]).json(tokenCheck[2]);
        }
        
        let username = tokenCheck[0]
        let organization = tokenCheck[1]

        Logger.queryLoggerMetadata(username, organization)
        .then((result) => {
            result = JSON.parse(result.toString())
            res.status(200).json({
                result: result
            })
         });      
    } catch (error) {
        console.error(`Failed: ${error}`);
        return error
    }
});  

router.get('/queryAccessRequestsProvider',async (req, res) => {
    try{
        let tokenCheck = await tokenValidation.tokenValidation(req);
        console.log(tokenCheck);
        if (tokenCheck[0] === "CustomError") {
            return res.status(tokenCheck[1]).json(tokenCheck[2]);
        }
        
        let username = tokenCheck[0]
        let organization = tokenCheck[1]

        Logger.queryAccessRequestsProvider(username, organization)
        .then((result) => {
            result = JSON.parse(result.toString())
            res.status(200).json({
                result: result
            })
         });      
    } catch (error) {
        console.error(`Failed: ${error}`);
        return error
    }
});  

router.get('/queryAccessRequestsProviderByDataset/:datasetName',async (req, res) => {
    try{
        let tokenCheck = await tokenValidation.tokenValidation(req);
        console.log(tokenCheck);
        if (tokenCheck[0] === "CustomError") {
            return res.status(tokenCheck[1]).json(tokenCheck[2]);
        }
        
        let username = tokenCheck[0]
        let organization = tokenCheck[1]
        let datasetName = req.params.datasetName;

        Logger.queryAccessRequestsProviderByDataset(username, organization, datasetName)
        .then((result) => {
            result = JSON.parse(result.toString())
            res.status(200).json({
                result: result
            })
         });      
    } catch (error) {
        console.error(`Failed: ${error}`);
        return error
    }
});  

router.get('/queryAccessRequestsConsumer',async (req, res) => {
    try{
        let tokenCheck = await tokenValidation.tokenValidation(req);
        console.log(tokenCheck);
        if (tokenCheck[0] === "CustomError") {
            return res.status(tokenCheck[1]).json(tokenCheck[2]);
        }
        
        let username = tokenCheck[0]
        let organization = tokenCheck[1]
        Logger.queryAccessRequestsConsumer(username, organization)
        .then((result) => {
            result = JSON.parse(result.toString())
            res.status(200).json({
                result: result
            })
         });      
    } catch (error) {
        console.error(`Failed: ${error}`);
        return error
    }
});  

router.get('/queryAccessRequestsConsumerByDataset/:datasetName',async (req, res) => {
    try{
        let tokenCheck = await tokenValidation.tokenValidation(req);
        console.log(tokenCheck);
        if (tokenCheck[0] === "CustomError") {
            return res.status(tokenCheck[1]).json(tokenCheck[2]);
        }
        
        let username = tokenCheck[0]
        let organization = tokenCheck[1]
        let datasetName = req.params.datasetName;
        Logger.queryAccessRequestsConsumerByDataset(username, organization, datasetName)
        .then((result) => {
            result = JSON.parse(result.toString())
            res.status(200).json({
                result: result
            })
         });      
    } catch (error) {
        console.error(`Failed: ${error}`);
        return error
    }
});  

router.get('/queryAccessRequestsOrgProvider',async (req, res) => {
    try{
        let tokenCheck = await tokenValidation.tokenValidation(req);
        console.log(tokenCheck);
        if (tokenCheck[0] === "CustomError") {
            return res.status(tokenCheck[1]).json(tokenCheck[2]);
        }
        
        let username = tokenCheck[0]
        let organization = tokenCheck[1]

        Logger.queryAccessRequestsOrgProvider(username, organization)
        .then((result) => {
            result = JSON.parse(result.toString())
            res.status(200).json({
                result: result
            })
         });      
    } catch (error) {
        console.error(`Failed: ${error}`);
        return error
    }
});  

router.get('/queryAccessRequestsOrgProviderByDataset/:datasetName',async (req, res) => {
    try{
        let tokenCheck = await tokenValidation.tokenValidation(req);
        console.log(tokenCheck);
        if (tokenCheck[0] === "CustomError") {
            return res.status(tokenCheck[1]).json(tokenCheck[2]);
        }
        
        let username = tokenCheck[0]
        let organization = tokenCheck[1]
        let datasetName = req.params.datasetName;
        Logger.queryAccessRequestsOrgProviderByDataset(username, organization, datasetName)
        .then((result) => {
            result = JSON.parse(result.toString())
            res.status(200).json({
                result: result
            })
         });      
    } catch (error) {
        console.error(`Failed: ${error}`);
        return error
    }
});  

router.get('/queryAccessRequestsOrgConsumer',async (req, res) => {
    try{
        let tokenCheck = await tokenValidation.tokenValidation(req);
        console.log(tokenCheck);
        if (tokenCheck[0] === "CustomError") {
            return res.status(tokenCheck[1]).json(tokenCheck[2]);
        }
        
        let username = tokenCheck[0]
        let organization = tokenCheck[1]    
        Logger.queryAccessRequestsOrgConsumer(username, organization)
        .then((result) => {
            result = JSON.parse(result.toString())
            res.status(200).json({
                result: result
            })
         });      
    } catch (error) {
        console.error(`Failed: ${error}`);
        return error
    }
});  

router.get('/queryAccessRequestsOrgConsumerByDataset/:datasetName',async (req, res) => {
    try{
        let tokenCheck = await tokenValidation.tokenValidation(req);
        console.log(tokenCheck);
        if (tokenCheck[0] === "CustomError") {
            return res.status(tokenCheck[1]).json(tokenCheck[2]);
        }
        
        let username = tokenCheck[0]
        let organization = tokenCheck[1]
        let datasetName = req.params.datasetName;
        Logger.queryAccessRequestsOrgConsumerByDataset(username, organization, datasetName)
        .then((result) => {
            result = JSON.parse(result.toString())
            res.status(200).json({
                result: result
            })
         });      
    } catch (error) {
        console.error(`Failed: ${error}`);
        return error
    }
});  

router.get('/queryRevokedAccessProvider',async (req, res) => {
    try{
        let tokenCheck = await tokenValidation.tokenValidation(req);
        console.log(tokenCheck);
        if (tokenCheck[0] === "CustomError") {
            return res.status(tokenCheck[1]).json(tokenCheck[2]);
        }
        
        let username = tokenCheck[0]
        let organization = tokenCheck[1]        
        Logger.queryRevokedAccessProvider(username, organization)
        .then((result) => {
            result = JSON.parse(result.toString())
            res.status(200).json({
                result: result
            })
         });      
    } catch (error) {
        console.error(`Failed: ${error}`);
        return error
    }
});  

router.get('/queryRevokedAccessProviderByDataset/:datasetName',async (req, res) => {
    try{
        let tokenCheck = await tokenValidation.tokenValidation(req);
        console.log(tokenCheck);
        if (tokenCheck[0] === "CustomError") {
            return res.status(tokenCheck[1]).json(tokenCheck[2]);
        }
        
        let username = tokenCheck[0]
        let organization = tokenCheck[1]
        let datasetName = req.params.datasetName;
        Logger.queryRevokedAccessProviderByDataset(username, organization, datasetName)
        .then((result) => {
            result = JSON.parse(result.toString())
            res.status(200).json({
                result: result
            })
         });      
    } catch (error) {
        console.error(`Failed: ${error}`);
        return error
    }
});  

router.get('/queryRevokedAccessConsumer',async (req, res) => {
    try{
        let tokenCheck = await tokenValidation.tokenValidation(req);
        console.log(tokenCheck);
        if (tokenCheck[0] === "CustomError") {
            return res.status(tokenCheck[1]).json(tokenCheck[2]);
        }
        
        let username = tokenCheck[0]
        let organization = tokenCheck[1]    
        Logger.queryRevokedAccessConsumer(username, organization)
        .then((result) => {
            result = JSON.parse(result.toString())
            res.status(200).json({
                result: result
            })
         });      
    } catch (error) {
        console.error(`Failed: ${error}`);
        return error
    }
});  

router.get('/queryRevokedAccessConsumerByDataset/:datasetName',async (req, res) => {
    try{
        let tokenCheck = await tokenValidation.tokenValidation(req);
        console.log(tokenCheck);
        if (tokenCheck[0] === "CustomError") {
            return res.status(tokenCheck[1]).json(tokenCheck[2]);
        }
        
        let username = tokenCheck[0]
        let organization = tokenCheck[1]
        let datasetName = req.params.datasetName;
        Logger.queryRevokedAccessConsumerByDataset(username, organization, datasetName)
        .then((result) => {
            result = JSON.parse(result.toString())
            res.status(200).json({
                result: result
            })
         });      
    } catch (error) {
        console.error(`Failed: ${error}`);
        return error
    }
});  

router.get('/queryRevokedAccessOrgProvider',async (req, res) => {
    try{
        let tokenCheck = await tokenValidation.tokenValidation(req);
        console.log(tokenCheck);
        if (tokenCheck[0] === "CustomError") {
            return res.status(tokenCheck[1]).json(tokenCheck[2]);
        }
        
        let username = tokenCheck[0]
        let organization = tokenCheck[1]
        Logger.queryRevokedAccessOrgProvider(username, organization)
        .then((result) => {
            result = JSON.parse(result.toString())
            res.status(200).json({
                result: result
            })
         });      
    } catch (error) {
        console.error(`Failed: ${error}`);
        return error
    }
});  

router.get('/queryRevokedAccessOrgProviderByDataset/:datasetName',async (req, res) => {
    try{
        let tokenCheck = await tokenValidation.tokenValidation(req);
        console.log(tokenCheck);
        if (tokenCheck[0] === "CustomError") {
            return res.status(tokenCheck[1]).json(tokenCheck[2]);
        }
        
        let username = tokenCheck[0]
        let organization = tokenCheck[1]
        let datasetName = req.params.datasetName;
        Logger.queryRevokedAccessOrgProviderByDataset(username, organization, datasetName)
        .then((result) => {
            result = JSON.parse(result.toString())
            res.status(200).json({
                result: result
            })
         });      
    } catch (error) {
        console.error(`Failed: ${error}`);
        return error
    }
});  

router.get('/queryRevokedAccessOrgConsumer',async (req, res) => {
    try{
        let tokenCheck = await tokenValidation.tokenValidation(req);
        console.log(tokenCheck);
        if (tokenCheck[0] === "CustomError") {
            return res.status(tokenCheck[1]).json(tokenCheck[2]);
        }
        
        let username = tokenCheck[0]
        let organization = tokenCheck[1]
        Logger.queryRevokedAccessOrgConsumer(username, organization)
        .then((result) => {
            result = JSON.parse(result.toString())
            res.status(200).json({
                result: result
            })
         });      
    } catch (error) {
        console.error(`Failed: ${error}`);
        return error
    }
});  

router.get('/queryRevokedAccessOrgConsumerByDataset/:datasetName',async (req, res) => {
    try{
        let tokenCheck = await tokenValidation.tokenValidation(req);
        console.log(tokenCheck);
        if (tokenCheck[0] === "CustomError") {
            return res.status(tokenCheck[1]).json(tokenCheck[2]);
        }
        
        let username = tokenCheck[0]
        let organization = tokenCheck[1]
        let datasetName = req.params.datasetName;    
        Logger.queryRevokedAccessOrgConsumerByDataset(username, organization, datasetName)
        .then((result) => {
            result = JSON.parse(result.toString())
            res.status(200).json({
                result: result
            })
         });      
    } catch (error) {
        console.error(`Failed: ${error}`);
        return error
    }
});  

//Public Access
router.get('/queryLoggerRevokedAccessPublicProvider',async (req, res) => {
    try{
        let tokenCheck = await tokenValidation.tokenValidation(req);
        console.log(tokenCheck);
        if (tokenCheck[0] === "CustomError") {
            return res.status(tokenCheck[1]).json(tokenCheck[2]);
        }
        
        let username = tokenCheck[0]
        let organization = tokenCheck[1]
        Logger.queryLoggerRevokedAccessPublicProvider(username, organization)
        .then((result) => {
            result = JSON.parse(result.toString())
            res.status(200).json({
                result: result
            })
         });      
    } catch (error) {
        console.error(`Failed: ${error}`);
        return error
    }
});  

router.get('/queryLoggerRevokedAccessPublicProviderByDatasetName/:datasetName',async (req, res) => {
    try{
        let tokenCheck = await tokenValidation.tokenValidation(req);
        console.log(tokenCheck);
        if (tokenCheck[0] === "CustomError") {
            return res.status(tokenCheck[1]).json(tokenCheck[2]);
        }
        
        let username = tokenCheck[0]
        let organization = tokenCheck[1]
        let datasetName = req.params.datasetName;
        Logger.queryLoggerRevokedAccessPublicProvider(username, organization, datasetName) 
        .then((result) => {
            result = JSON.parse(result.toString())
            res.status(200).json({
                result: result
            })
         });      
    } catch (error) {
        console.error(`Failed: ${error}`);
        return error
    }
});  

router.get('/queryLoggerAllRevokedAccessPublic',async (req, res) => {
    try{
        let tokenCheck = await tokenValidation.tokenValidation(req);
        console.log(tokenCheck);
        if (tokenCheck[0] === "CustomError") {
            return res.status(tokenCheck[1]).json(tokenCheck[2]);
        }
        
        let username = tokenCheck[0]
        let organization = tokenCheck[1]
        Logger.queryLoggerAllRevokedAccessPublic(username, organization)
        .then((result) => {
            result = JSON.parse(result.toString())
            res.status(200).json({
                result: result
            })
         });      
    } catch (error) {
        console.error(`Failed: ${error}`);
        return error
    }
});  

router.get('/queryLoggerAllRevokedAccessPublicByDatasetName/:datasetName',async (req, res) => {
    try{
        let tokenCheck = await tokenValidation.tokenValidation(req);
        console.log(tokenCheck);
        if (tokenCheck[0] === "CustomError") {
            return res.status(tokenCheck[1]).json(tokenCheck[2]);
        }
        
        let username = tokenCheck[0]
        let organization = tokenCheck[1]
        let datasetName = req.params.datasetName;    
        Logger.queryLoggerAllRevokedAccessPublicByDatasetName(username, organization, datasetName)
        .then((result) => {
            result = JSON.parse(result.toString())
            res.status(200).json({
                result: result
            })
         });      
    } catch (error) {
        console.error(`Failed: ${error}`);
        return error
    }
});  

router.get('/queryLoggerAllAccessPublic',async (req, res) => {
    try{
        let tokenCheck = await tokenValidation.tokenValidation(req);
        console.log(tokenCheck);
        if (tokenCheck[0] === "CustomError") {
            return res.status(tokenCheck[1]).json(tokenCheck[2]);
        }
        
        let username = tokenCheck[0]
        let organization = tokenCheck[1]
        Logger.queryLoggerAllAccessPublic(username, organization)
        .then((result) => {
            result = JSON.parse(result.toString())
            res.status(200).json({
                result: result
            })
         });      
    } catch (error) {
        console.error(`Failed: ${error}`);
        return error
    }
});  

router.get('/queryLoggerAllAccessPublicByDatasetName/:datasetName',async (req, res) => {
    try{
        let tokenCheck = await tokenValidation.tokenValidation(req);
        console.log(tokenCheck);
        if (tokenCheck[0] === "CustomError") {
            return res.status(tokenCheck[1]).json(tokenCheck[2]);
        }
        
        let username = tokenCheck[0]
        let organization = tokenCheck[1]
        let datasetName = req.params.datasetName;    
        Logger.queryLoggerAllAccessPublicByDatasetName(username, organization, datasetName)
        .then((result) => {
            result = JSON.parse(result.toString())
            res.status(200).json({
                result: result
            })
         });      
    } catch (error) {
        console.error(`Failed: ${error}`);
        return error
    }
});  

router.get('/queryLoggerAllAccessPublicProvider',async (req, res) => {
    try{
        let tokenCheck = await tokenValidation.tokenValidation(req);
        console.log(tokenCheck);
        if (tokenCheck[0] === "CustomError") {
            return res.status(tokenCheck[1]).json(tokenCheck[2]);
        }
        
        let username = tokenCheck[0]
        let organization = tokenCheck[1]
        Logger.queryLoggerAllAccessPublicProvider(username, organization)
        .then((result) => {
            result = JSON.parse(result.toString())
            res.status(200).json({
                result: result
            })
         });      
    } catch (error) {
        console.error(`Failed: ${error}`);
        return error
    }
});  

router.get('/queryLoggerAllDatasourceMetadata',async (req, res) => {
    try{
        let tokenCheck = await tokenValidation.tokenValidation(req);
        console.log(tokenCheck);
        if (tokenCheck[0] === "CustomError") {
            return res.status(tokenCheck[1]).json(tokenCheck[2]);
        }
        
        let username = tokenCheck[0]
        let organization = tokenCheck[1]                
        Logger.queryLoggerAllDatasourceMetadata(username, organization)
        .then((result) => {
            result = JSON.parse(result.toString())
            res.status(200).json({
                result: result
            })
         });      
    } catch (error) {
        console.error(`Failed: ${error}`);
        return error
    }
});  

router.get('/queryLoggerDatasourceMetadataByName',async (req, res) => {
    try{
        let tokenCheck = await tokenValidation.tokenValidation(req);
        console.log(tokenCheck);
        if (tokenCheck[0] === "CustomError") {
            return res.status(tokenCheck[1]).json(tokenCheck[2]);
        }
        
        let username = tokenCheck[0]
        let organization = tokenCheck[1]
        let datasetName = req.params.datasetName;    
        Logger.queryLoggerDatasourceMetadataByName(username, organization, datasetName)
        .then((result) => {
            result = JSON.parse(result.toString())
            res.status(200).json({
                result: result
            })
         });      
    } catch (error) {
        console.error(`Failed: ${error}`);
        return error
    }
});  

module.exports = router