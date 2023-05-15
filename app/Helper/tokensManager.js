'use strict';
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const dataPortsIssuer = "DataPorts";

let refreshTokens = []
const ACCESS_TOKEN_SECRET = "the token secret key" // maybe we can have this stored in the blockchain
const REFRESH_TOKEN_SECRET = "the refresh token secret key" // maybe we can have this stored in the blockchain

const generateAccessToken = async function(username) {
    var random16Array = new Uint8Array(16);
    crypto.getRandomValues(random16Array);
    var b64 = Buffer.from(random16Array).toString('base64');

    return jwt.sign({"plaintext": username}, ACCESS_TOKEN_SECRET, {expiresIn: "60m", notBefore: 120, issuer: dataPortsIssuer, jwtid: b64, subject: username})
};

const generateRefreshToken = async function(username) {
    var random16Array = new Uint8Array(16);
    crypto.getRandomValues(random16Array);
    var b64 = Buffer.from(random16Array).toString('base64');

    const refreshToken = jwt.sign({"plaintext": username}, REFRESH_TOKEN_SECRET, {expiresIn: "80m", notBefore: 120, issuer: dataPortsIssuer, jwtid: b64, subject: username})
    refreshTokens.push(refreshToken)
    return refreshToken
};

const existsRefreshToken = async function(token) {
    if (!refreshTokens.includes(token))
        return false
    return true
};

const isValidToken = async function(token, username) {
    try {
        jwt.verify(token, ACCESS_TOKEN_SECRET, {issuer: dataPortsIssuer, subject: username})
        return true
    } catch (error) {
        console.error(error.message);
    }
    return false
}

const isValidRefreshToken = async function(token, username) {
    try {
        jwt.verify(token, REFRESH_TOKEN_SECRET, {issuer: dataPortsIssuer, subject: username})
        return true
    } catch (error) {
        console.error(error.message);
    }
    return false
}

const removeRefreshToken = async function(token) {
    if (refreshTokens.includes(token))
        refreshTokens = refreshTokens.filter( (c) => c != token)
};

exports.generateAccessToken = generateAccessToken;
exports.generateRefreshToken = generateRefreshToken;
exports.existsRefreshToken = existsRefreshToken;
exports.removeRefreshToken = removeRefreshToken;
exports.isValidToken = isValidToken;
exports.isValidRefreshToken = isValidRefreshToken;