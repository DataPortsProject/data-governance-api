'use strict';
//Register&LoginSC
let Login = require('./../app/Login/loginApi.js');
let Register = require('./../app/Register/registerApi.js');
let tokenValidation = require('./../app/Helper/validateTokens.js');

//Validation
let validation = require('./../app/Validation/validator.js');

const express = require('express');
const router = express.Router();

router.use((req, res, next) => {
    const timestamp = new Date().toLocaleString();
    console.log(`[${timestamp}] Request received: ${req.method} ${req.url}`);
    next();
  })
  
router.get('/prelogin', (req,res) => {
  Login.writeOrgsLocal()
  .then((result) => {
      result = JSON.parse(result.toString())

      res.json({
          result: result,
      })
  });
});

router.put('/updatePassword', validation.updatePasswordValidation(),async (req, res) => {
  try{
    console.log(req.body)

    let tokenCheck = await tokenValidation.tokenValidation(req);
    console.log(tokenCheck);
    if (tokenCheck[0] === "CustomError") {
        return res.status(tokenCheck[1]).json(tokenCheck[2]);
    }
    let username = tokenCheck[0]
    let organization = tokenCheck[1]

    let previouspassword = req.body.previouspassword;
    let newpassword = req.body.newpassword;

    Login.updatePassword(username, organization, previouspassword, newpassword)    
    .then((result) => {
        console.log(result)
        if (result.includes("Fail") || result.includes("Error")){
            res.status(500).send(result);             
        }
        else{
            res.status(200).json({
                response: result
            })
        }
    });
    } catch (error) {
        console.error(`Failed: ${error}`);
        return error
    }
});

router.get('/getActiveAccounts',async (req, res) => {
    try{
        let tokenCheck = await tokenValidation.tokenValidation(req);
        console.log(tokenCheck);
        if (tokenCheck[0] === "CustomError") {
            return res.status(tokenCheck[1]).json(tokenCheck[2]);
        }
        let username = tokenCheck[0]
        let organization = tokenCheck[1]

        Register.getActiveAccounts(username, organization)
        .then((result) => {
            console.log('The response is: %s', result)
            if (result.includes("Fail") || result.includes("Error")){
                res.status(500).send(result);
            }                 
            else{
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


//Register&LoginAPI
router.get('/getInactiveAccounts',async (req, res) => {
    try{
        let tokenCheck = await tokenValidation.tokenValidation(req);
        console.log(tokenCheck);
        if (tokenCheck[0] === "CustomError") {
            return res.status(tokenCheck[1]).json(tokenCheck[2]);
        }
        let username = tokenCheck[0]
        let organization = tokenCheck[1]

        Register.getInactiveAccounts(username, organization)
        .then((result) => {
            console.log('The response is: %s', result)
            if (result.includes("Fail") || result.includes("Error")){
                res.status(500).send(result);             
            }
            else{
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

router.get('/getActiveAccountsByOrg',async (req, res) => {
    try{
        let tokenCheck = await tokenValidation.tokenValidation(req);
        console.log(tokenCheck);
        if (tokenCheck[0] === "CustomError") {
            return res.status(tokenCheck[1]).json(tokenCheck[2]);
        }
        let username = tokenCheck[0]
        let organization = tokenCheck[1]

        Register.getActiveAccountsByOrg(username, organization)
        .then((result) => {
            console.log('The response is: %s', result)
            if (result.includes("Fail") || result.includes("Error")){
                res.status(500).send(result);          
            }
            else{
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

router.get('/getInactiveAccountsByOrg',async (req, res) => {
    try{
        let tokenCheck = await tokenValidation.tokenValidation(req);
        console.log(tokenCheck);
        if (tokenCheck[0] === "CustomError") {
            return res.status(tokenCheck[1]).json(tokenCheck[2]);
        }
        let username = tokenCheck[0]
        let organization = tokenCheck[1]
        Register.getInactiveAccountsByOrg(username, organization)
        .then((result) => {
            console.log('The response is: %s', result)
            if (result.includes("Fail") || result.includes("Error")){
                res.status(500).send(result);       
            }
            else{
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

router.post('/deactivateAccount', validation.deactivateAccountValidation(),async (req, res) => {
    try{
        console.log(req.body)

        let tokenCheck = await tokenValidation.tokenValidation(req);
        console.log(tokenCheck);
        if (tokenCheck[0] === "CustomError") {
            return res.status(tokenCheck[1]).json(tokenCheck[2]);
        }
        let admin = tokenCheck[0]
        let adminOrganization = tokenCheck[1]

        let username = req.body.username;

        Register.deactivateAccount(admin, adminOrganization, username)
        .then((result) => {
            console.log("The result is %s", result);
            if (result=="Available username"){
                res.status(400).send("User not found");
            }
            else if (result=="User creds not found"){
                res.status(400).send("User creds not found");
            }
            else if (result.includes("Fail") || result.includes("Error")){
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

router.post('/resetPassword', async (req, res) => {
    try{
        console.log(req.body)
        let tokenCheck = await tokenValidation.tokenValidation(req);
        console.log(tokenCheck);
        if (tokenCheck[0] === "CustomError") {
            return res.status(tokenCheck[1]).json(tokenCheck[2]);
        }
        let admin  = tokenCheck[0]
        let adminOrganization = tokenCheck[1]

        let username = req.body.username;

        Register.resetPassword(admin, adminOrganization, username, password)
        .then((response) => {
            res.json({
                response: response
            })
        });
    } catch (error) {
        console.error(`Failed: ${error}`);
        return error
    }
});

router.post('/activateAccount', validation.activateAccountValidation(),async (req, res) => {
    try{
        console.log(req.body)
        let tokenCheck = await tokenValidation.tokenValidation(req);
        console.log(tokenCheck);
        if (tokenCheck[0] === "CustomError") {
            return res.status(tokenCheck[1]).json(tokenCheck[2]);
        }
        let admin = tokenCheck[0]
        let adminOrganization = tokenCheck[1]

        Register.generatePassword()
        .then((password) => {
            Register.activateAccount(admin, adminOrganization, password, req.body)
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
        });
    } catch (error) {
        console.error(`Failed: ${error}`);
        return error
    }
});

router.post('/registerOrg', validation.registerOrgValidation(), async (req, res) => {
    try{
        console.log(req.body)
        let tokenCheck = await tokenValidation.tokenValidation(req);
        console.log(tokenCheck);
        if (tokenCheck[0] === "CustomError") {
            return res.status(tokenCheck[1]).json(tokenCheck[2]);
        }
        let username = tokenCheck[0]
        let organization = tokenCheck[1] 

        Register.generatePassword()
        .then((password) => {
            Register.registrationOrg(username, organization, password, req.body)
            .then((result) => {
                console.log(result)
                if (result=="Unavailable email"){
                    res.status(400).send("Unavailable email");
                }else if(result=="Unavailable username"){
                    res.status(400).send("Unavailable username");
                }else if (result.includes("Fail") || result.includes("Error")){
                    res.status(500).send(result);              
                }
                else{
                    res.json({
                        response: result
                    })

                }
            });
        });
    } catch (error) {
        console.error(`Failed: ${error}`);
        return error
    }
});

router.post('/registerUser', validation.registerUserValidation(), async (req, res) => {
    try{
        console.log(req.body)
        let tokenCheck = await tokenValidation.tokenValidation(req);
        console.log(tokenCheck);
        if (tokenCheck[0] === "CustomError") {
            return res.status(tokenCheck[1]).json(tokenCheck[2]);
        }
        let username = tokenCheck[0]
        let organization = tokenCheck[1]

        Register.generatePassword()
        .then((password) => {

            if (organization!== req.body.userorganization){
                res.status(401).send("The admins can register users only for their organization");
                return
            }

            if ((req.body.isExternalUser === "false" && req.body.externalOrg !== " " ) || (req.body.isExternalUser === "true" && req.body.externalOrg === " " )){
                console.log("The external user attributes are")
                console.log(req.body.isExternalUser, req.body.externalOrg)
                res.status(400).send('For an external user the external Org cannot be empty && for an internal should be empty');
                return
            }

            Register.registerUser(username, organization, password, req.body)
            .then((result) => {
                console.log(result)
                if (result=="Unavailable email"){
                    res.status(400).send("Unavailable email");
                }else if(result=="Unavailable username"){
                    res.status(400).send("Unavailable username");
                }else if (result.includes("Fail") || result.includes("Error")){
                    res.status(500).send(result);          
                }
                else{
                    res.json({
                        response: result
                    })
                }
            });
        });
    } catch (error) {
        console.error(`Failed: ${error}`);
        return error
    }
});

router.get('/queryOrgsByRange',async (req, res) => {
    try{
        let tokenCheck = await tokenValidation.tokenValidation(req);
        console.log(tokenCheck);
        if (tokenCheck[0] === "CustomError") {
            return res.status(tokenCheck[1]).json(tokenCheck[2]);
        }
        let username = tokenCheck[0]
        let organization = tokenCheck[1]

        Register.GetOrgByRange(organization, username)
        .then((result) => {
            console.log('The response is: %s', result)
            if (result.includes("Fail") || result.includes("Error")){
                res.status(500).send(result);         
            }
            else{
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

router.get('/queryUsersByRange',async (req, res) => {
    try{    
        let tokenCheck = await tokenValidation.tokenValidation(req);
        console.log(tokenCheck);
        if (tokenCheck[0] === "CustomError") {
            return res.status(tokenCheck[1]).json(tokenCheck[2]);
        }
        let username = tokenCheck[0]
        let organization = tokenCheck[1]

        Register.GetUserByRange(organization, username)
        .then((result) => {
            console.log('The response is: %s', result)
            if (result.includes("Fail") || result.includes("Error")){
                res.status(500).send(result);           
            }
            else{
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

router.get('/queryUsersPerOrg',async (req, res) => {
    try{
        let tokenCheck = await tokenValidation.tokenValidation(req);
        console.log(tokenCheck);
        if (tokenCheck[0] === "CustomError") {
            return res.status(tokenCheck[1]).json(tokenCheck[2]);
        }
        let username = tokenCheck[0]
        let organization = tokenCheck[1]
        Register.QueryUsersPerOrg(organization, username)
        .then((result) => {
            console.log('The response is: %s', result)
            if (result.includes("Fail") || result.includes("Error")){
                res.status(500).send(result);           
            }
            else{
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

router.get('/queryUsersPerExternalOrg',async (req, res) => {
    try{
        let tokenCheck = await tokenValidation.tokenValidation(req);
        console.log(tokenCheck);
        if (tokenCheck[0] === "CustomError") {
            return res.status(tokenCheck[1]).json(tokenCheck[2]);
        }
        let username = tokenCheck[0]
        let organization = tokenCheck[1]
        Register.QueryUsersPerExternalOrg(organization, username)
        .then((result) => {
            console.log('The response is: %s', result)
            if (result.includes("Fail") || result.includes("Error")){
                res.status(500).send(result);             
            }
            else{
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

router.get('/getOrgsByManagerAdmin',async (req, res) => {
    try{
        let tokenCheck = await tokenValidation.tokenValidation(req);
        console.log(tokenCheck);
        if (tokenCheck[0] === "CustomError") {
            return res.status(tokenCheck[1]).json(tokenCheck[2]);
        }
        let username = tokenCheck[0]
        let organization = tokenCheck[1]
        Register.GetOrgsByManagerAdmin(organization, username)
        .then((result) => {
            console.log('The response is: %s', result)
            //let filteredResult = result.filter( el => el.Key !== "DataPorts" ); 
            if (result.includes("Fail") || result.includes("Error")){
                res.status(500).send(result);            
            }
            else{                    
                result = JSON.parse(result.toString())
                let filteredResult = result.filter( el => el.Key !== "DataPorts" ); 
                if (filteredResult){
                    res.json({
                        result: filteredResult
                    })
                }else{
                    res.json({
                        result: result
                    })
                    }
            }
        });
    } catch (error) {
        console.error(`Failed: ${error}`);
        return error
    }
});

router.get('/getInternalOrgByName',async (req, res) => {
    try{
        let tokenCheck = await tokenValidation.tokenValidation(req);
        console.log(tokenCheck);
        if (tokenCheck[0] === "CustomError") {
            return res.status(tokenCheck[1]).json(tokenCheck[2]);
        }
        let username = tokenCheck[0]
        let organization = tokenCheck[1]
        Register.GetInternalOrgByName(organization, username)
        .then((result) => {
            console.log('The response is: %s', result)
            if (result.includes("Fail") || result.includes("Error")){
                res.status(500).send(result);         
            }
            else{
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

router.get('/getExtOrgs',async (req, res) => {
    try{
        let tokenCheck = await tokenValidation.tokenValidation(req);
        console.log(tokenCheck);
        if (tokenCheck[0] === "CustomError") {
            return res.status(tokenCheck[1]).json(tokenCheck[2]);
        }
        let username = tokenCheck[0]
        let organization = tokenCheck[1]
        Register.GetExtOrgs(organization, username)
        .then((result) => {
            console.log('The response is: %s', result)
            if (result.includes("Fail") || result.includes("Error")){
                res.status(500).send(result);          
            }
            else{
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

router.get('/returnLoggedInUser',async (req, res) => {
    try{    
        let tokenCheck = await tokenValidation.tokenValidation(req);
        console.log(tokenCheck);
        if (tokenCheck[0] === "CustomError") {
            return res.status(tokenCheck[1]).json(tokenCheck[2]);
        }
        let username = tokenCheck[0]
        let organization = tokenCheck[1]
        Register.ReturnLoggedInUser(organization, username)
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

router.get('/GetUserInfo',async (req, res) => {
    try{    
        let tokenCheck = await tokenValidation.tokenValidation(req);
        console.log(tokenCheck);
        if (tokenCheck[0] === "CustomError") {
            return res.status(tokenCheck[1]).json(tokenCheck[2]);
        }
        let username = tokenCheck[0]
        let organization = tokenCheck[1]
        Register.GetUserInfo(organization, username)
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

router.put('/updateOrgInfo', validation.updateOrgValidation(),async (req, res) => {
    try{
        console.log(req.body)

        let tokenCheck = await tokenValidation.tokenValidation(req);
        console.log(tokenCheck);
        if (tokenCheck[0] === "CustomError") {
            return res.status(tokenCheck[1]).json(tokenCheck[2]);
        }
        let username = tokenCheck[0]
        let organization = tokenCheck[1] 
   
        Register.updateOrgInfo(username, organization, req.body)
        .then((result) => {
            console.log('The response is: %s',result)
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

router.put('/updateUserInfo', validation.updateUserInfoValidation(),async (req, res) => {
    try{
        console.log(req.body)
        let tokenCheck = await tokenValidation.tokenValidation(req);
        console.log(tokenCheck);
        if (tokenCheck[0] === "CustomError") {
            return res.status(tokenCheck[1]).json(tokenCheck[2]);
        }
        let username = tokenCheck[0]
        let organization = tokenCheck[1]
        let name= req.body.name;
        let surname = req.body.surname;
        let email = req.body.email;  
        let password = req.body.password;

        Register.updateUserInfo(username, organization, name, surname, email, password)
        .then((result) => {
            if (result=="Unavailable email"){
                res.status(400).send("Unavailable email");
            }else if (result.includes("Fail") || result.includes("Error")){
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

module.exports = router