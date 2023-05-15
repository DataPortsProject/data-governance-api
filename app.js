'use strict';
const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const cors = require('cors');
const { validationResult } = require('express-validator');
//Swagger
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require('./swagger.json');
//Register&LoginSC
let Login = require('./app/Login/loginApi.js');

//Validation
let validation = require('./app/Validation/validator.js');
// Token management
let TokensManager = require('./Helper/tokensManager.js');
//Jwt filter
let jwtFilter = require('./Helper/jwtFilter.js');

// Initialize Express app
const app = express();
// Use helmet middleware for various security headers
app.use(helmet());
app.use(cors());
app.use(express.json()) 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(jwtFilter.jwtFilter());

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per window
  });
app.use(limiter);

// Use morgan middleware for logging incoming requests
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });
app.use(morgan('combined', { stream: accessLogStream }));

const registerloginRoutes = require ('./routes/registerloginRoutes.js');
const metadataRoutes = require ('./routes/metadataRoutes.js');
const loggerRoutes = require ('./routes/loggerRoutes.js');
const dataSharingRoutes = require ('./routes/dataSharingRoutes.js');

app.use('/', registerloginRoutes,  dataSharingRoutes, metadataRoutes, loggerRoutes)

//Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: "Dataports:Data Governance"
}));

//Jwt filter
app.get('/health', (req,res) => {
    console.log(req.imJwt);
    res.status(200).send("System OK\n"+JSON.stringify(req.imJwt));
});

app.post('/login', validation.loginValidation(),(req, res) => {
    console.log(req.body)

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    let username = req.body.username;
    let password = req.body.password;
    let organization = req.body.organization;
    
    let promiseLogin = Login.login(username, password, organization) 
    let promiseAccessToken = TokensManager.generateAccessToken(username, organization);
    let promiseRefreshToken = TokensManager.generateRefreshToken(username, organization);
    Promise.all([promiseLogin, promiseAccessToken, promiseRefreshToken]).then((values) => {
        if (values[0]==='wrong credentials'){
            values[0] = values[0].toString()
            res.status(401).send('wrong credentials');
        }
        else{
            let result = JSON.parse(values[0].toString());
            result.accessToken = values[1];
            result.refreshToken = values[2];
            return res.json({
                result: result
            }) 
        }
    });  
});

app.post('/refreshTokens', (req, res) => {
    let token = null;
    let authHeader = req.headers["authorization"];
    if (authHeader != null)
        token = authHeader.split(" ")[1];

    if (token == null) {
        res.status(401).send("Token not present");
        return;
    }

    if (authHeader.split(" ")[0] != "Bearer") {
        res.status(401).send("Bearer not present")
        return
    }
    
    let promiseIsValidRefreshToken = TokensManager.isValidRefreshToken(token);
    promiseIsValidRefreshToken.then((response) => {
        if (response == false){
            res.status(403).send("Token invalid");
            return;
        }
        else{
            //remove the old refreshToken from the refreshTokens list
            TokensManager.removeRefreshToken(token);

            //generate new accessToken and refreshTokens
            let promiseAccessToken = TokensManager.generateAccessToken(response.username, response.organization); 
            let promiseRefreshToken = TokensManager.generateRefreshToken(response.username, response.organization); 
            Promise.all([promiseAccessToken, promiseRefreshToken]).then((values) => {
                res.json({
                    accessToken: values[0],
                    refreshToken: values[1]
                })
            });

        }
    });  
});

const port = 9999;
app.listen(port, () => {
    console.log(`Server is up on port ${port}`)
})

