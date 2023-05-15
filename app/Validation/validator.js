'use strict';

const { body, param } = require('express-validator');

module.exports = {
    loginValidation: function (){
        return [
            body('username')
                .isLength({ min: 1 })
                .withMessage('username must be at least 1 char long')
                .exists()
                .withMessage('username is required')
                .trim()
                .matches(/^[A-Za-z0-9 .!-_ @]+$/)
                .withMessage('username must be alphanumeric only')
                .escape(),
            body('password')
                .isLength({ min: 5 })
                .withMessage('password must be at least 5 chars long')
                .isLength({ max: 30 })
                .withMessage('password must be at max 30 chars long')
                .matches(/\d/)
                .withMessage('password must contain a number')
                .exists()
                .withMessage('password is required'),
            body('organization')
                .exists()
                .withMessage('organization is required')  
                .isLength({ min: 1 })
                .withMessage('organization must be at least 1 char long')
        ];    
    },
    registerOrgValidation: function (){
        return [
            body('title')
                .exists()
                .withMessage('organization is required')  
                .isLength({ min: 1 })
                .withMessage('organization must be at least 1 char long'),
            body('role')
                .isIn(['Research', 'Telecommunications', 'Port Authority', 'Trucking Company', 'Shipping Agent'])
                .withMessage('The org role is equal to Research or Telecommunications or Port Authority or Trucking Company or Shipping Agent'),
            body('vat_number')
                .isLength({ min: 1 })
                .withMessage('vat_number must be at least 1 char long')
                .exists()
                .withMessage('vat_number is required')
                .trim()
                .matches(/^[A-Za-z0-9 .!-_ @]+$/)
                .withMessage('vat_number must be alphanumeric only')
                .escape(),
            body('newUsersusername')
                .isLength({ min: 1 })
                .withMessage('username must be at least 1 char long')
                .exists()
                .withMessage('username is required')
                .trim()
                .matches(/^[A-Za-z0-9 .!-_ @]+$/)
                .withMessage('username must be alphanumeric only')
                .escape(),
            body('email').isEmail().normalizeEmail().withMessage('Invalid Email').exists(),
            body('name')
                .isLength({ min: 1 })
                .withMessage('name must be at least 1 chars long')
                .exists()
                .withMessage('name is required')
                .trim()
                .matches(/^[a-zA-Z]+$/)
                .withMessage('name must contains letters only')
                .escape(),
            body('surname')
                .isLength({ min: 1 })
                .withMessage('surname must be at least 1 char long')
                .exists()
                .withMessage('surname is required')
                .trim()
                .matches(/^[a-zA-Z]+$/)
                .withMessage('surname must contains letters only')
                .escape(),
            body('isExternalUser')
                .isIn(['true', 'false'])
                .withMessage('The isExternalUser field is true for the external users or fasle for the internal users'),
            body('isExternalOrg')
                .isIn(['true', 'false'])
                .withMessage('The isExternalOrg field is true for the external orgs or fasle for the internal orgs'), 
        ];
    
    },
    updateOrgValidation: function (){
        return [
            body('title')
                .exists()
                .withMessage('organization is required')  
                .isLength({ min: 1 })
                .withMessage('organization must be at least 1 char long'),
            body('role')
                .isIn(['Shipping Agent', 'Research', 'Telecommunications', 'Port Authority', 'Trucking Company'])
                .withMessage('The org role is equal to Shipping Agent or Research or Telecommunications or Port Authority or Trucking Company'),
            body('vat_number')
                .isLength({ min: 1 })
                .withMessage('vat_number must be at least 1 char long')
                .exists()
                .withMessage('vat_number is required')
                .trim()
                .matches(/^[A-Za-z0-9 .!-_ @]+$/)
                .withMessage('vat_number must be alphanumeric only')
                .escape(),           
        ];
    
    },
    registerUserValidation: function (){
        return [
            body('newUsersusername')
                .isLength({ min: 1 })
                .withMessage('username must be at least 1 char long')
                .exists()
                .withMessage('username is required')
                .trim()
                .matches(/^[A-Za-z0-9 .!-_ @]+$/)
                .withMessage('username must be alphanumeric only')
                .escape(),
            body('userorganization')
                .exists()
                .withMessage('organization is required')  
                .isLength({ min: 1 })
                .withMessage('organization must be at least 1 chars long'),
            body('email').isEmail().normalizeEmail().withMessage('Invalid Email').exists(),
            body('name')
                .isLength({ min: 1 })
                .withMessage('name must be at least 1 chars long')
                .exists()
                .withMessage('name is required')
                .trim()
                .matches(/^[a-zA-Z]+$/)
                .withMessage('name must contains letters only')
                .escape(),
            body('surname')
                .isLength({ min: 1 })
                .withMessage('surname must be at least 1 chars long')
                .exists()
                .withMessage('surname is required')
                .trim()
                .matches(/^[a-zA-Z]+$/)
                .withMessage('surname must contains letters only')
                .escape(),
            body('usertype')
                .isIn(['admin', 'user'])
                .withMessage('usertype is equal to admin or user'),
            body('isExternalUser')
                .isIn(['true', 'false'])
                .withMessage('The isExternalUser field is true for the external users or fasle for the internal users'),
               
        ];
    
    },
    updatePasswordValidation: function (){
        return [
            body('previouspassword')
                .isLength({ min: 5 })
                .withMessage('previouspassword must be at least 5 chars long')
                .isLength({ max: 30 })
                .withMessage('previouspassword must be at max 30 chars long')
                .matches(/\d/)
                .withMessage('previouspassword must contain a number')
                .exists()
                .withMessage('password is required'),
            body('newpassword')
                .isLength({ min: 5 })
                .withMessage('newpassword must be at least 5 chars long')
                .isLength({ max: 30 })
                .withMessage('newpassword must be at max 30 chars long')
                .matches(/\d/)
                .withMessage('newpassword must contain a number')
                .exists()
                .withMessage('newpassword is required'),
        ];

    },
    updateUserInfoValidation: function (){
        return [
            body('name')
                .isLength({ min: 1 })
                .withMessage('name must be at least 1 char long')
                .exists()
                .withMessage('name is required')
                .trim()
                .matches(/^[a-zA-Z]+$/)
                .withMessage('name must contains letters only')
                .escape(),
            body('surname')
                .isLength({ min: 1 })
                .withMessage('surname must be at least 1 char long')
                .exists()
                .withMessage('surname is required')
                .trim()
                .matches(/^[a-zA-Z]+$/)
                .withMessage('surname must contains letters only')
                .escape(),
            body('email').isEmail().normalizeEmail().withMessage('Invalid Email').exists(),
            body('password')
            .isLength({ min: 5 })
            .withMessage('password must be at least 5 chars long')
            .isLength({ max: 30 })
            .withMessage('password must be at max 30 chars long')
            .matches(/\d/)
            .withMessage('password must contain a number')
            .exists()
            .withMessage('password is required'),
        ];

    },
    deactivateAccountValidation: function (){
        return [
            body('username')
                .isLength({ min: 1 })
                .withMessage('username must be at least 1 char long')
                .exists()
                .withMessage('username is required')
                .trim()
                .matches(/^[A-Za-z0-9 .!-_ @]+$/)
                .withMessage('username must be alphanumeric only')
                .escape(),
        ];

    },
    activateAccountValidation: function (){
        return [
            body('username')
                .isLength({ min: 1 })
                .withMessage('username must be at least 1 char long')
                .exists()
                .withMessage('username is required')
                .trim()
                .matches(/^[A-Za-z0-9 .!-_ @]+$/)
                .withMessage('username must be alphanumeric only')
                .escape(),
            body('name')
                .isLength({ min: 1 })
                .withMessage('name must be at least 1 char long')
                .exists()
                .withMessage('name is required')
                .trim()
                .matches(/^[a-zA-Z]+$/)
                .withMessage('name must contains letters only')
                .escape(),
            body('surname')
                .isLength({ min: 1 })
                .withMessage('surname must be at least 1 char long')
                .exists()
                .withMessage('surname is required')
                .trim()
                .matches(/^[a-zA-Z]+$/)
                .withMessage('surname must contains letters only')
                .escape(),
            body('email').isEmail().normalizeEmail().withMessage('Invalid Email').exists(),
            body('organization')
                .exists()
                .withMessage('organization is required')  
                .isLength({ min: 1 })
                .withMessage('organization must be at least 1 char long'),
            body('usertype')
                .isIn(['admin', 'user'])
                .withMessage('usertype is equal to admin or user'),
            body('isExternalUser')
                .isIn(['true', 'false'])
                .withMessage('The isExternalUser field is true for the external users or fasle for the internal users'),
        ];

    },
    metadataValidation: function (){
        return [
            body('emailOfProvider').isEmail().normalizeEmail().withMessage('Invalid Email').exists(),
            body('orgOfOwner')
                .exists()
                .withMessage('organization is required')  
                .isLength({ min: 1 })
                .withMessage('organization must be at least 1 char long'),
            body('blockchain')
                .isIn(['on-chain', 'off-chain'])
                .withMessage('Accepted values: on-chain/off-chain'),
            body('accessRights')
                .isIn(['read', 'read,modify', 'read,modify,persist'])
                .withMessage('The access rights are escalated.Accepted values: 1)Read access: read, 2)Modify access: read,modify, 3) Persist access: read,modify,persist'),
            body('language')
                .isIn(['en', 'fr', 'de', 'el', 'it', 'es'])
                .withMessage('Accepted languages: en/fr/de/el/it/es'),
            body('distribution')
                .isIn(['Image', 'Video', 'CSV-Excel', 'Doc', 'Other'])
                .withMessage('Accepted distributions: Image/Video/CSV-Excel/Doc/Other'),
            body('industryDomain')
                .isIn(['Research', 'Telecommunications', 'Port Authority', 'Trucking Company', 'Shipping Agent'])
                .withMessage('Accepted industryDomains: Research/Telecommunications/Port Authority/Trucking Company/Shipping Agent'),
            body('datasetName')
                .exists()
                .withMessage('datasetName is required')  
                .isLength({ min: 1 })
                .withMessage('organization must be at least 1 char long'),
            body('hasAgent')
                .isIn(['true', 'false'])
                .withMessage('The hasAgent field is true or fasle'),
        ];
    },
    queryMetadataValidation: function (){
        return [
            body('accessRights')
                .isIn(['read', 'modify', 'persist', ' '])
                .withMessage('The access rights are escalated.Accepted values: read/modify/persist or empty'),
            body('language')
                .isIn(['en', 'fr', 'de', 'el', 'it', 'es', ' '])
                .withMessage('Accepted languages: en/fr/de/el/it/es or empty'),
            body('distribution')
                .isIn(['Image', 'Video', 'CSV-Excel', 'Doc', 'Other', ' '])
                .withMessage('Accepted distributions: Image/Video/CSV-Excel/Doc/Other or empty'),
            body('industryDomain')
                .isIn(['Research', 'Telecommunications', 'Port Authority', 'Trucking Company', 'Shipping Agent', ' '])
                .withMessage('Accepted industryDomains: Research/Telecommunications/Port Authority/Trucking Company/Shipping Agent or empty'),
            body('hasAgent')
                .isIn(['true', 'false', ' '])
                .withMessage('The hasAgent field is true/fasle or empty'),
            body('operandDataVelocityMin')
                .isIn(['$gt', '$gte', ' '])
                .withMessage('The operandDataVelocityMin field is $gt/$gte or empty'),
            body('operandDataVelocityMax')
                .isIn(['$lt', '$lte', ' '])
                .withMessage('The operandDataVelocityMax field is $lt/$lte or empty'),
            body('operandTmcE')
                .isIn(['$gt', '$gte', ' '])
                .withMessage('The operandTmcE field is $gt/$gte or empty'),
            body('operandTmcS')
                .isIn(['$lt', '$lte', ' '])
                .withMessage('The operandTmcS field is $lt/$lte or empty'),
            body('operandDataVolumeMin')
                .isIn(['$gt', '$gte', ' '])
                .withMessage('The operandDataVolumeMin field is $gt/$gte or empty'),
            body('operandDataVolumeMax')
                .isIn(['$lt', '$lte', ' '])
                .withMessage('The operandDataVolumeMax field is $lt/$lte or empty'),
            body('operandVersionMin')
                .isIn(['$gt', '$gte', ' '])
                .withMessage('The operandVersionMin field is $gt/$gte or empty'),
            body('operandVersionMax')
                .isIn(['$lt', '$lte', ' '])
                .withMessage('The operandVersionMax field is $lt/$lte or empty'),
        ];
    },
    accessRequest: function (){
        return [
            body('datasetname')
                .exists()
                .withMessage('datasetname is required'), 
            body('permission')
                .isIn(['read', 'modify', 'persist', '', ' '])
                .withMessage('Accepted access rights: 1)read 2)modify 3)persist'),
        ];
    },
    accessPublic: function (){
        return [
            body('datasetname')
                .exists()
                .withMessage('datasetname is required'), 
            body('permission')
                .isIn(['read', 'modify', 'persist', ' ', ''])
                .withMessage('Accepted access rights: 1)read 2)modify 3)persist or empty'),
        ];
    },
    deleteRequestID: function (){
        return [
            param('requestID')
                .exists()
                .withMessage('requestID is required')
                .isLength({ min: 6 })
                .withMessage('requestID must be at least 6 chars long'), 
        ];

    },
    requestID: function (){
        return [
            body('requestID')
                .exists()
                .withMessage('requestID is required')
                .isLength({ min: 6 })
                .withMessage('requestID must be at least 6 chars long'), 
        ];

    },
    revokeAccess: function (){
        return [
            body('datasetname')
                .exists()
                .withMessage('datasetname is required'), 
            body('permission')
                .isIn(['read', 'modify', 'persist', ' ', ''])
                .withMessage('Accepted access rights: 1)read 2)modify 3)persist or empty'),
            body('usernameOfConsumer')
                .isLength({ min: 1 })
                .withMessage('username must be at least 1 chars long')
                .exists()
                .withMessage('username is required')
                .trim()
                .matches(/^[A-Za-z0-9 .!-_ @]+$/)
                .withMessage('username must be alphanumeric only')
                .escape(),
        ];
    },
    revokeAccessOrg: function (){
        return [
            body('datasetname')
                .exists()
                .withMessage('datasetname is required'), 
            body('permission')
                .isIn(['read', 'modify', 'persist', ' ', ''])
                .withMessage('Accepted access rights: 1)read 2)modify 3)persist or empty'),
            body('authOrganization')
                .exists()
                .withMessage('organization is required')  
                .isLength({ min: 1 })
                .withMessage('organization must be at least 1 char long'),
        ];
    },
    revokeAccessRequest: function (){
        return [
            body('datasetName')
                .exists()
                .withMessage('datasetName is required'), 
            body('permission')
                .isIn(['read', 'modify', 'persist', ' ', ''])
                .withMessage('Accepted access rights: 1)read 2)modify 3)persist or empty'),
        ];
    },
}
