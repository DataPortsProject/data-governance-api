'use strict';
//DataSharingSC
let DataSharing = require('./../app/DataSharing/dataSharingApi.js');
//Validation
let validation = require('./../app/Validation/validator.js');
//Token validation
let tokenValidation = require('./../app/Helper/validateTokens.js');

const express = require('express');
const router = express.Router();

router.use((req, res, next) => {
    const timestamp = new Date().toLocaleString();
    console.log(`[${timestamp}] Request received: ${req.method} ${req.url}`);
    next();
  })

//Semantic Interoperability Endpoint
router.get('/getPermissionsByDataSourceID',async (req, res) => {
    try{   
        let tokenCheck = await tokenValidation.tokenValidation(req);
        console.log(tokenCheck);
        if (tokenCheck[0] === "CustomError") {
            return res.status(tokenCheck[1]).json(tokenCheck[2]);
        }
        let username = tokenCheck[0]
        let organization = tokenCheck[1]

        let dataSourceID = req.query.dataSourceID;
        DataSharing.getPermissionsByDataSourceID(username, organization, dataSourceID)
        .then((result) => {
            console.log('The response is: %s', result)
            if (result.includes("Fail") || result.includes("Error")){
                res.status(500).send(result);     
            }
            else{
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

//AMTE Integration Endpoint
router.get('/getDataSourceIDsForGrantedUser',async (req, res) => {
    try{    
        let tokenCheck = await tokenValidation.tokenValidation(req);
        console.log(tokenCheck);
        if (tokenCheck[0] === "CustomError") {
            return res.status(tokenCheck[1]).json(tokenCheck[2]);
        }
        let username = tokenCheck[0]
        let organization = tokenCheck[1]
        
        DataSharing.getDataSourceIDsForGrantedUser(username, organization)
        .then((result) => {
            console.log('The response is: %s', result)
            if (result.includes("Fail") || result.includes("Error")){
                res.status(500).send(result);     
            }
            else{
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

router.post('/requestAccess', validation.accessRequest() ,async (req, res) => {
    console.log(req.body)
    try{    
        let tokenCheck = await tokenValidation.tokenValidation(req);
        console.log(tokenCheck);
        if (tokenCheck[0] === "CustomError") {
            return res.status(tokenCheck[1]).json(tokenCheck[2]);
        }
        let username = tokenCheck[0]
        let organization = tokenCheck[1]
        let datasetname = req.body.datasetname;
        let permission = req.body.permission;
        let customAccessRights = req.body.customAccessRights;

        DataSharing.requestAccess(username, organization, datasetname, permission, customAccessRights)
        .then((result) => {
            console.log(result)
            if (result.includes("Fail") || result.includes("Error")){
                res.status(500).send(result);          
            }else if (result.includes("Wrong custom access rights")){
                res.status(500).send(result);          
            }
            else{
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

router.post('/requestAccessByOrg', validation.accessRequest(), async (req, res) => {
    console.log(req.body)
    try{    
        let tokenCheck = await tokenValidation.tokenValidation(req);
        console.log(tokenCheck);
        if (tokenCheck[0] === "CustomError") {
            return res.status(tokenCheck[1]).json(tokenCheck[2]);
        }
        let username = tokenCheck[0]
        let organization = tokenCheck[1]
        let datasetname = req.body.datasetname;
        let permission = req.body.permission;
        let customAccessRights = req.body.customAccessRights;

        DataSharing.requestAccessByOrg(username, organization, datasetname, permission, customAccessRights)
        .then((result) => {
            console.log(result)
            if (result.includes("Fail") || result.includes("Error")){
                res.status(500).send(result);            
            }
            else{
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

router.delete('/deleteRequest/:requestID', validation.deleteRequestID(),async (req, res) => {
    console.log(req.body)
    try{    
        let tokenCheck = await tokenValidation.tokenValidation(req);
        console.log(tokenCheck);
        if (tokenCheck[0] === "CustomError") {
            return res.status(tokenCheck[1]).json(tokenCheck[2]);
        }
        let username = tokenCheck[0]
        let organization = tokenCheck[1]
        let requestID = req.params.requestID;

        DataSharing.deleteRequest(username, organization, requestID)
        .then((result) => {
            console.log(result)
            if (result.includes("Fail") || result.includes("Error")){
                res.status(500).send(result);        
            }
            else{
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

router.delete('/deleteRequestOrgs/:requestID',  validation.deleteRequestID(), async (req, res) => {
    console.log(req.body)
    try{    
        let tokenCheck = await tokenValidation.tokenValidation(req);
        console.log(tokenCheck);
        if (tokenCheck[0] === "CustomError") {
            return res.status(tokenCheck[1]).json(tokenCheck[2]);
        }
        let username = tokenCheck[0]
        let organization = tokenCheck[1]
        let requestID = req.params.requestID;

        DataSharing.deleteRequestOrgs(username, organization, requestID)
        .then((result) => {
            console.log(result)
            if (result.includes("Fail") || result.includes("Error")){
                res.status(500).send(result);          
            }
            else{
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

router.post('/revokeAccess', validation.revokeAccess(),async (req, res) => {
    console.log(req.body)
    try{    
        let tokenCheck = await tokenValidation.tokenValidation(req);
        console.log(tokenCheck);
        if (tokenCheck[0] === "CustomError") {
            return res.status(tokenCheck[1]).json(tokenCheck[2]);
        }
        let username = tokenCheck[0]
        let organization = tokenCheck[1]
        let datasetname = req.body.datasetname;
        let permission = req.body.permission;
        let usernameOfConsumer = req.body.usernameOfConsumer;
        let customAccessRights = req.body.customAccessRights;

        DataSharing.revokeAccess(username, organization, datasetname, permission, usernameOfConsumer, customAccessRights)
        .then((result) => {
            console.log(result)
            if (result.includes("Fail") || result.includes("Error")){
                res.status(500).send(result);           
            }
            else{
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

router.post('/revokeAccessOrg', validation.revokeAccessOrg(),async (req, res) => {
    console.log(req.body)
    try{    
        let tokenCheck = await tokenValidation.tokenValidation(req);
        console.log(tokenCheck);
        if (tokenCheck[0] === "CustomError") {
            return res.status(tokenCheck[1]).json(tokenCheck[2]);
        }
        let username = tokenCheck[0]
        let organization = tokenCheck[1]
        let datasetname = req.body.datasetname;
        let permission = req.body.permission;
        let authOrganization = req.body.authOrganization;
        let customAccessRights = req.body.customAccessRights;

        DataSharing.revokeAccessOrg(username, organization, datasetname, permission, authOrganization, customAccessRights)
        .then((result) => {
            console.log(result)
            if (result.includes("Fail") || result.includes("Error")){
                res.status(500).send(result);          
            }
            else{
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

router.post('/authorizeUser', validation.requestID(),async (req, res) => {
    console.log(req.body)
    try{    
        let tokenCheck = await tokenValidation.tokenValidation(req);
        console.log(tokenCheck);
        if (tokenCheck[0] === "CustomError") {
            return res.status(tokenCheck[1]).json(tokenCheck[2]);
        }
        let username = tokenCheck[0]
        let organization = tokenCheck[1]
        let requestID = req.body.requestID;
        
        DataSharing.authorizeUser(username, organization, requestID)
        .then((result) => {
            console.log(result)
            if (result.includes("Fail") || result.includes("Error")){
                res.status(500).send(result);         
            }
            else{
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

router.post('/authorizeOrgs', validation.requestID(),async (req, res) => {
    console.log(req.body)
    try{    
        let tokenCheck = await tokenValidation.tokenValidation(req);
        console.log(tokenCheck);
        if (tokenCheck[0] === "CustomError") {
            return res.status(tokenCheck[1]).json(tokenCheck[2]);
        }
        let username = tokenCheck[0]
        let organization = tokenCheck[1]
        let requestID = req.body.requestID;

        DataSharing.authorizeOrgs(username, organization, requestID)
        .then((result) => {
            console.log(result)
            if (result.includes("Fail") || result.includes("Error")){
                res.status(500).send(result);    
            }
            else{
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

router.get('/queryDatasetPermissionByAuthorizedUsers', async (req, res) => {
    try{    
        let tokenCheck = await tokenValidation.tokenValidation(req);
        console.log(tokenCheck);
        if (tokenCheck[0] === "CustomError") {
            return res.status(tokenCheck[1]).json(tokenCheck[2]);
        }
        let username = tokenCheck[0]
        let organization = tokenCheck[1]
        DataSharing.queryDatasetPermissionByAuthorizedUsers(username, organization)
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

router.get('/queryDatasetPermissionByProvider', async (req, res) => {
    try{    
        let tokenCheck = await tokenValidation.tokenValidation(req);
        console.log(tokenCheck);
        if (tokenCheck[0] === "CustomError") {
            return res.status(tokenCheck[1]).json(tokenCheck[2]);
        }
        let username = tokenCheck[0]
        let organization = tokenCheck[1]
        DataSharing.queryDatasetPermissionByProvider(username, organization)
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

router.get('/queryAllAccessRequestsProvider', async (req, res) => {
    try{    
        let tokenCheck = await tokenValidation.tokenValidation(req);
        console.log(tokenCheck);
        if (tokenCheck[0] === "CustomError") {
            return res.status(tokenCheck[1]).json(tokenCheck[2]);
        }
        let username = tokenCheck[0]
        let organization = tokenCheck[1]
        DataSharing.queryAllAccessRequestsProvider(username, organization)
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

router.get('/queryAllAccessRequestsByOrgConsumer', async (req, res) => {
    try{    
        let tokenCheck = await tokenValidation.tokenValidation(req);
        console.log(tokenCheck);
        if (tokenCheck[0] === "CustomError") {
            return res.status(tokenCheck[1]).json(tokenCheck[2]);
        }
        let username = tokenCheck[0]
        let organization = tokenCheck[1]
        DataSharing.queryAllAccessRequestsByOrgConsumer(username, organization)
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

router.get('/queryAllAccessRequestsConsumer', async (req, res) => {
    try{    
        let tokenCheck = await tokenValidation.tokenValidation(req);
        console.log(tokenCheck);
        if (tokenCheck[0] === "CustomError") {
            return res.status(tokenCheck[1]).json(tokenCheck[2]);
        }
        let username = tokenCheck[0]
        let organization = tokenCheck[1]
        DataSharing.queryAllAccessRequestsConsumer(username, organization)
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

router.get('/queryDatasetPermissionForOrgUserByOrgAdmin', async (req, res) => {
    try{    
        let tokenCheck = await tokenValidation.tokenValidation(req);
        console.log(tokenCheck);
        if (tokenCheck[0] === "CustomError") {
            return res.status(tokenCheck[1]).json(tokenCheck[2]);
        }
        let username = tokenCheck[0]
        let organization = tokenCheck[1]
        DataSharing.queryDatasetPermissionForOrgUserByOrgAdmin (username, organization)
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

router.get('/querySpecificDatasetPermissionByProvider/:datasetname', async (req, res) => {
    try{    
        let tokenCheck = await tokenValidation.tokenValidation(req);
        console.log(tokenCheck);
        if (tokenCheck[0] === "CustomError") {
            return res.status(tokenCheck[1]).json(tokenCheck[2]);
        }
        let username = tokenCheck[0]
        let organization = tokenCheck[1]
        let datasetname = req.params.datasetname;
        DataSharing.querySpecificDatasetPermissionByProvider(username, organization, datasetname)
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

router.get('/queryAccessRequestsProviderByName/:datasetname', async (req, res) => {
    try{    
        let tokenCheck = await tokenValidation.tokenValidation(req);
        console.log(tokenCheck);
        if (tokenCheck[0] === "CustomError") {
            return res.status(tokenCheck[1]).json(tokenCheck[2]);
        }
        let username = tokenCheck[0]
        let organization = tokenCheck[1]
        let datasetname = req.params.datasetname;
        DataSharing.queryAccessRequestsProviderByName(username, organization, datasetname)
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

router.get('/queryDatasetLimitByName/:datasetname', async (req, res) => {
    try{    
        let tokenCheck = await tokenValidation.tokenValidation(req);
        console.log(tokenCheck);
        if (tokenCheck[0] === "CustomError") {
            return res.status(tokenCheck[1]).json(tokenCheck[2]);
        }
        let username = tokenCheck[0]
        let organization = tokenCheck[1]
        let datasetname = req.params.datasetname;
        DataSharing.queryDatasetLimitByName(username, organization, datasetname)
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

router.get('/queryPublicDatasetsByProvider', async (req, res) => {
    try{    
        let tokenCheck = await tokenValidation.tokenValidation(req);
        console.log(tokenCheck);
        if (tokenCheck[0] === "CustomError") {
            return res.status(tokenCheck[1]).json(tokenCheck[2]);
        }
        let username = tokenCheck[0]
        let organization = tokenCheck[1]
        DataSharing.queryPublicDatasetsByProvider(username, organization)
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

router.get('/queryPublicDatasets', async (req, res) => {
    try{    
        let tokenCheck = await tokenValidation.tokenValidation(req);
        console.log(tokenCheck);
        if (tokenCheck[0] === "CustomError") {
            return res.status(tokenCheck[1]).json(tokenCheck[2]);
        }
        let username = tokenCheck[0]
        let organization = tokenCheck[1]
        DataSharing.queryPublicDatasets(username, organization)
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

router.get('/queryPublicDatasetsByDatasetName/:datasetname', async (req, res) => {
    try{    
        let tokenCheck = await tokenValidation.tokenValidation(req);
        console.log(tokenCheck);
        if (tokenCheck[0] === "CustomError") {
            return res.status(tokenCheck[1]).json(tokenCheck[2]);
        }
        let username = tokenCheck[0]
        let organization = tokenCheck[1]
        let datasetname = req.params.datasetname;
        DataSharing.queryPublicDatasetsByDatasetName(username, organization, datasetname)
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

router.post('/revokedatasetPublic', validation.accessPublic(),async (req, res) => {
    console.log(req.body)
    try{    
        let tokenCheck = await tokenValidation.tokenValidation(req);
        console.log(tokenCheck);
        if (tokenCheck[0] === "CustomError") {
            return res.status(tokenCheck[1]).json(tokenCheck[2]);
        }
        let username = tokenCheck[0]
        let organization = tokenCheck[1]
        let datasetname = req.body.datasetname;
        let permission = req.body.permission;
        let customAccessRights = req.body.customAccessRights;
        DataSharing.revokeDatasetPublic(username, organization, datasetname, permission, customAccessRights)
        .then((result) => {
            console.log(result)
            if (result.includes("Fail") || result.includes("Error")){
                res.status(500).send(result);           
            }
            else{
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

router.post('/setDatasetPublic', validation.accessPublic(),async (req, res) => {
    console.log(req.body)
    try{    
        let tokenCheck = await tokenValidation.tokenValidation(req);
        console.log(tokenCheck);
        if (tokenCheck[0] === "CustomError") {
            return res.status(tokenCheck[1]).json(tokenCheck[2]);
        }
        let username = tokenCheck[0]
        let organization = tokenCheck[1]
        let datasetname = req.body.datasetname;
        let permission = req.body.permission;
        let customAccessRights = req.body.customAccessRights;

        DataSharing.setDatasetPublic(username, organization, datasetname, permission, customAccessRights)
        .then((result) => {
            console.log(result)
            if (result.includes("Fail") || result.includes("Error")){
                res.status(500).send(result);         
            }
            else{
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

router.get('/queryAllAccessRequestsByOrgProvider', async (req, res) => {
    try{    
        let tokenCheck = await tokenValidation.tokenValidation(req);
        console.log(tokenCheck);
        if (tokenCheck[0] === "CustomError") {
            return res.status(tokenCheck[1]).json(tokenCheck[2]);
        }
        let username = tokenCheck[0]
        let organization = tokenCheck[1]
        DataSharing.queryAllAccessRequestsByOrgProvider(username, organization)
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

router.get('/queryAllAccessByOrgProvider', async (req, res) => {
    try{    
        let tokenCheck = await tokenValidation.tokenValidation(req);
        console.log(tokenCheck);
        if (tokenCheck[0] === "CustomError") {
            return res.status(tokenCheck[1]).json(tokenCheck[2]);
        }
        let username = tokenCheck[0]
        let organization = tokenCheck[1]
        DataSharing.queryAllAccessByOrgProvider(username, organization)
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

router.get('/queryAllAccessByOrgConsumer', async (req, res) => {
    try{    
        let tokenCheck = await tokenValidation.tokenValidation(req);
        console.log(tokenCheck);
        if (tokenCheck[0] === "CustomError") {
            return res.status(tokenCheck[1]).json(tokenCheck[2]);
        }
        let username = tokenCheck[0]
        let organization = tokenCheck[1]    
        DataSharing.queryAllAccessByOrgConsumer(username, organization)
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

router.get('/queryAccessRequestsOrgConsumerByDatasetName/:datasetName', async (req, res) => {
    try{    
        let tokenCheck = await tokenValidation.tokenValidation(req);
        console.log(tokenCheck);
        if (tokenCheck[0] === "CustomError") {
            return res.status(tokenCheck[1]).json(tokenCheck[2]);
        }
        let username = tokenCheck[0]
        let organization = tokenCheck[1]
        let datasetName = req.params.datasetName;

        DataSharing.queryAccessRequestsOrgConsumerByDatasetName(username, organization, datasetName)
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

router.get('/queryAccessRequestsOrgProviderByDatasetName/:datasetName', async (req, res) => {
    try{    
        let tokenCheck = await tokenValidation.tokenValidation(req);
        console.log(tokenCheck);
        if (tokenCheck[0] === "CustomError") {
            return res.status(tokenCheck[1]).json(tokenCheck[2]);
        }
        let username = tokenCheck[0]
        let organization = tokenCheck[1]
        let datasetName = req.params.datasetName;

        DataSharing.queryAccessRequestsOrgProviderByDatasetName(username, organization, datasetName)
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

router.get('/queryAccessOrgConsumerByDatasetName/:datasetName', async (req, res) => {
    try{    
        let tokenCheck = await tokenValidation.tokenValidation(req);
        console.log(tokenCheck);
        if (tokenCheck[0] === "CustomError") {
            return res.status(tokenCheck[1]).json(tokenCheck[2]);
        }
        let username = tokenCheck[0]
        let organization = tokenCheck[1]
        let datasetName = req.params.datasetName;

        DataSharing.queryAccessOrgConsumerByDatasetName(username, organization, datasetName)
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

router.get('/queryAccessOrgProviderByDatasetName/:datasetName', async (req, res) => {
    try{    
        let tokenCheck = await tokenValidation.tokenValidation(req);
        console.log(tokenCheck);
        if (tokenCheck[0] === "CustomError") {
            return res.status(tokenCheck[1]).json(tokenCheck[2]);
        }
        let username = tokenCheck[0]
        let organization = tokenCheck[1]
        let datasetName = req.params.datasetName;

        DataSharing.queryAccessOrgProviderByDatasetName(username, organization, datasetName)
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

router.get('/getPermissionsByOwnerAndDataset/:datasetName', async (req, res) => {
    try{    
        let tokenCheck = await tokenValidation.tokenValidation(req);
        console.log(tokenCheck);
        if (tokenCheck[0] === "CustomError") {
            return res.status(tokenCheck[1]).json(tokenCheck[2]);
        }
        let username = tokenCheck[0]
        let organization = tokenCheck[1]
        let datasetName = req.params.datasetName;

        DataSharing.getPermissionsByOwnerAndDataset(username, organization, datasetName)
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

router.get('/queryAllRevokeAccessByOrgConsumer', async (req, res) => {
    try{    
        let tokenCheck = await tokenValidation.tokenValidation(req);
        console.log(tokenCheck);
        if (tokenCheck[0] === "CustomError") {
            return res.status(tokenCheck[1]).json(tokenCheck[2]);
        }
        let username = tokenCheck[0]
        let organization = tokenCheck[1]

        DataSharing.queryAllAccessRevokeByOrgConsumer(username, organization)
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

router.get('/queryAccessRevokeOrgConsumerByDatasetName/:datasetName', async (req, res) => {
    try{    
        let tokenCheck = await tokenValidation.tokenValidation(req);
        console.log(tokenCheck);
        if (tokenCheck[0] === "CustomError") {
            return res.status(tokenCheck[1]).json(tokenCheck[2]);
        }
        let username = tokenCheck[0]
        let organization = tokenCheck[1]
        let datasetName = req.params.datasetName;

        DataSharing.queryAccessRevokeOrgConsumerByDatasetName(username, organization, datasetName)
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

router.get('/queryAllRevokeAccessByOrgProvider', async (req, res) => {
    try{    
        let tokenCheck = await tokenValidation.tokenValidation(req);
        console.log(tokenCheck);
        if (tokenCheck[0] === "CustomError") {
            return res.status(tokenCheck[1]).json(tokenCheck[2]);
        }
        let username = tokenCheck[0]
        let organization = tokenCheck[1]
        DataSharing.queryAllRevokeAccessByOrgProvider(username, organization)
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

router.get('/queryAccessRevokeOrgProviderByDatasetName/:datasetName', async (req, res) => {
    try{    
        let tokenCheck = await tokenValidation.tokenValidation(req);
        console.log(tokenCheck);
        if (tokenCheck[0] === "CustomError") {
            return res.status(tokenCheck[1]).json(tokenCheck[2]);
        }
        let username = tokenCheck[0]
        let organization = tokenCheck[1]
        let datasetName = req.params.datasetName;

        DataSharing.queryAccessRevokeOrgProviderByDatasetName(username, organization, datasetName)
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

router.post('/requestRevokeAccessByOrg', validation.revokeAccessRequest(),async (req, res) => {
    console.log(req.body)
    try{    
        let tokenCheck = await tokenValidation.tokenValidation(req);
        console.log(tokenCheck);
        if (tokenCheck[0] === "CustomError") {
            return res.status(tokenCheck[1]).json(tokenCheck[2]);
        }
        let username = tokenCheck[0]
        let organization = tokenCheck[1]
        let datasetName = req.body.datasetName;
        let permission = req.body.permission;
        let customAccessRights = req.body.customAccessRights;

        DataSharing.requestRevokeAccessByOrg(username, organization, datasetName, permission, customAccessRights)
        .then((result) => {
            console.log(result)
            if (result.includes("Fail") || result.includes("Error")){
                res.status(500).send(result);              
            }
            else{
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

router.post('/revokeAccessByOrgFromRequest', validation.requestID(),async (req, res) => {
    console.log(req.body)
    try{    
        let tokenCheck = await tokenValidation.tokenValidation(req);
        console.log(tokenCheck);
        if (tokenCheck[0] === "CustomError") {
            return res.status(tokenCheck[1]).json(tokenCheck[2]);
        }
        let username = tokenCheck[0]
        let organization = tokenCheck[1]
        let requestID = req.body.requestID;
        DataSharing.revokeAccessByOrgFromRequest(username, organization, requestID)
        .then((result) => {
            console.log(result)
            if (result.includes("Fail") || result.includes("Error")){
                res.status(500).send(result);         
            }
            else{
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

router.post('/requestRevokeAccessByUser', validation.revokeAccessRequest(),async (req, res) => {
    console.log(req.body)
    try{    
        let tokenCheck = await tokenValidation.tokenValidation(req);
        console.log(tokenCheck);
        if (tokenCheck[0] === "CustomError") {
            return res.status(tokenCheck[1]).json(tokenCheck[2]);
        }
        let username = tokenCheck[0]
        let organization = tokenCheck[1]
        let datasetName = req.body.datasetName;
        let permission = req.body.permission;
        let customAccessRights = req.body.customAccessRights;

        DataSharing.requestRevokeAccessByUser(username, organization, datasetName, permission, customAccessRights)
        .then((result) => {
            console.log(result)
            if (result.includes("Fail") || result.includes("Error")){
                res.status(500).send(result);            
            }
            else{
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

router.post('/revokeAccessByUserFromRequest', validation.requestID(),async (req, res) => {
    console.log(req.body)
    try{    
        let tokenCheck = await tokenValidation.tokenValidation(req);
        console.log(tokenCheck);
        if (tokenCheck[0] === "CustomError") {
            return res.status(tokenCheck[1]).json(tokenCheck[2]);
        }
        let username = tokenCheck[0]
        let organization = tokenCheck[1]
        let requestID = req.body.requestID;

        DataSharing.revokeAccessByUserFromRequest(username, organization, requestID)
        .then((result) => {
            console.log(result)
            if (result.includes("Fail") || result.includes("Error")){
                res.status(500).send(result);              
            }
            else{
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

router.get('/queryAllRevokeAccessByUserProvider', async (req, res) => {
    try{    
        let tokenCheck = await tokenValidation.tokenValidation(req);
        console.log(tokenCheck);
        if (tokenCheck[0] === "CustomError") {
            return res.status(tokenCheck[1]).json(tokenCheck[2]);
        }
        let username = tokenCheck[0]
        let organization = tokenCheck[1]
    
        DataSharing.queryAllRevokeAccessByUserProvider(username, organization)
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

router.get('/queryAccessRevokeUserProviderByDatasetName/:datasetName', async (req, res) => {
    try{    
        let tokenCheck = await tokenValidation.tokenValidation(req);
        console.log(tokenCheck);
        if (tokenCheck[0] === "CustomError") {
            return res.status(tokenCheck[1]).json(tokenCheck[2]);
        }
        let username = tokenCheck[0]
        let organization = tokenCheck[1]
        let datasetName = req.params.datasetName;

        DataSharing.queryAccessRevokeUserProviderByDatasetName(username, organization, datasetName)
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

router.get('/queryAllRevokeAccessByUserConsumer', async (req, res) => {
    try{    
        let tokenCheck = await tokenValidation.tokenValidation(req);
        console.log(tokenCheck);
        if (tokenCheck[0] === "CustomError") {
            return res.status(tokenCheck[1]).json(tokenCheck[2]);
        }
        let username = tokenCheck[0]
        let organization = tokenCheck[1]

        DataSharing.queryAllAccessRevokeByUserConsumer(username, organization)
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

router.get('/queryAccessRevokeUserConsumerByDatasetName/:datasetName', async (req, res) => {
    try{    
        let tokenCheck = await tokenValidation.tokenValidation(req);
        console.log(tokenCheck);
        if (tokenCheck[0] === "CustomError") {
            return res.status(tokenCheck[1]).json(tokenCheck[2]);
        }
        let username = tokenCheck[0]
        let organization = tokenCheck[1]
        let datasetName = req.params.datasetName;

        DataSharing.queryAccessRevokeUserConsumerByDatasetName(username, organization, datasetName)
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

module.exports = router