'use strict';
// Token management
const TokensManager = require('./../../Helper/tokensManager.js');;
const { validationResult } = require('express-validator');
const CustomError = require('./../../errorHandler/error-code');

const tokenValidation = async function(req) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          throw new CustomError( JSON.stringify(errors.array()), 400);
        }
      
        let token = null;
        let authHeader = req.headers["authorization"]
        if (authHeader != null)
            token = authHeader.split(" ")[1]
      
        if (token == null) {

            throw new CustomError('Token not present', 401);
        }
      
        if (authHeader.split(" ")[0] != "Bearer") {

            throw new CustomError('Bearer not present', 401);
        }
        let promiseIsValidToken = await TokensManager.isValidToken(token);
        if (promiseIsValidToken){
            console.log("Data Governance token found!");
            return [promiseIsValidToken.username, promiseIsValidToken.organization]
        }
        else if(req.imJwt.found){
            //console.log(req.imJwt);
            console.log("IM token found!");
            return [req.imJwt.userName, req.imJwt.organization]
        }else{

            throw new CustomError('Token invalid', 403);
        }    
    } catch (error) {

        console.error(error.name);
        console.error(error.status); 
        console.error(error.message);

        return [error.name, error.status, error.message];
    }
}

exports.tokenValidation = tokenValidation;