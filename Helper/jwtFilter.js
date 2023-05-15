'use strict';

const jwt = require('jsonwebtoken');
const config  = require('../config/default.json');

function getToken(req){
    var token = null;
    var authHeader = req.headers["authorization"]
    if (authHeader != null)
        token = authHeader.split(" ")[1]

    if (token == null) {
        return null
    }

    if (authHeader.split(" ")[0] != "Bearer") {
        return null;
    }
    return token
}

function getIssuer(token){
    var payload=jwt.decode(token);
    return payload.iss;
}

function getPublicKey(issuer){    
    for (var i=0;i<config.trusted.length;i++){
        if(issuer == config.trusted[i].issuser){
            return config.trusted[i].pubKey
        }
    }
    
    return null;

}

//Express Filter Builder pattern
function jwtFilter(options){
    return function(req, res, next){
        var token = getToken(req);
    
        if(token == null){
            req["imJwt"]={found:false};
            next();
            return;
        }
        var issuer = getIssuer(token); 
        var pubKey= getPublicKey(issuer);
        if(pubKey == null){
            req["imJwt"]={found:false,
                issuer:issuer};
            next();
            return;
        }

        var payload=null;

        try {
            payload= jwt.verify(token, pubKey, {issuer: issuer, algorithms: ['RS256']})
        } catch (error) {
            console.error(error.message);
            console.error("all: "+error)
            res.status(403).send("Token invalid");
            return;
        }

        req["imJwt"]={found:true,
            token:token,
            payload:payload,
            issuer:issuer,
            userName:payload.DPuser,
            organization:payload.DPorg
        };
        next();
    }
}


exports.jwtFilter = jwtFilter;
