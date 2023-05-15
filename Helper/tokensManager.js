'use strict';
const jwt = require('jsonwebtoken');
// const crypto = require('crypto');
const dataPortsIssuer = "DataPorts_DataGovernance";

var refreshTokens = []
const ACCESS_TOKEN_SECRET = "f7a9ba668fe711ecb9090242ac120002" // maybe we can have this stored in the blockchain
const REFRESH_TOKEN_SECRET = "18c3555e8fe811ecb9090242ac120002" // maybe we can have this stored in the blockchain

const generateAccessToken = async function(username, organization) {
    var random16Array = new Uint8Array(16);
    var b64 = Buffer.from(random16Array).toString('base64');

    return jwt.sign({"username": username, "organization": organization}, ACCESS_TOKEN_SECRET, {expiresIn: "60m", notBefore: 0, issuer: dataPortsIssuer, jwtid: b64, subject: username})
};

const generateRefreshToken = async function(username, organization) {
    var random16Array = new Uint8Array(16);
    var b64 = Buffer.from(random16Array).toString('base64');

    const refreshToken = jwt.sign({"username": username, "organization": organization}, REFRESH_TOKEN_SECRET, {expiresIn: "80m", notBefore: 0, issuer: dataPortsIssuer, jwtid: b64, subject: username})
    refreshTokens.push(refreshToken)
    console.log(refreshTokens);
    return refreshToken
};

const existsRefreshToken = async function(token) {
    if (!refreshTokens.includes(token))
        return false
    return true
};

const isValidToken = async function(token) {
    try {
        let output = jwt.verify(token, ACCESS_TOKEN_SECRET, {issuer: dataPortsIssuer})
        return output;
    } catch (error) {
        console.error(error.message);
        return false;
    }
}

const isValidRefreshToken = async function(token) {
    try {
        let output = jwt.verify(token, REFRESH_TOKEN_SECRET, {issuer: dataPortsIssuer})
        return output;
    } catch (error) {
        console.error(error.message);
        return false;
    }
}

const removeRefreshToken = async function(token) {
    console.log(refreshTokens);
    if (refreshTokens.includes(token))
        refreshTokens = refreshTokens.filter( (c) => c != token)
    console.log(refreshTokens);
};

exports.generateAccessToken = generateAccessToken;
exports.generateRefreshToken = generateRefreshToken;
exports.existsRefreshToken = existsRefreshToken;
exports.removeRefreshToken = removeRefreshToken;
exports.isValidToken = isValidToken;
exports.isValidRefreshToken = isValidRefreshToken;
