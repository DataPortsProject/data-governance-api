'use strict';

class CustomError extends Error {
	constructor ( message, status ) {
	  super()
	  this.name = 'CustomError'
	  this.message = message
	  if ( status ) this.status = status
	}
}
module.exports = CustomError;
