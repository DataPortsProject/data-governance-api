'use strict';

const getDateTime = async function(){
    try {

      Date.prototype.today = function () { 
        return this.getUTCFullYear() +"/"+(((this.getUTCMonth()+1) < 10)?"0":"") + (this.getUTCMonth()+1) +"/"+ ((this.getUTCDate() < 10)?"0":"") + this.getUTCDate();
      }
      // For the time now
      Date.prototype.timeNow = function () {
         return ((this.getUTCHours() < 10)?"0":"") + this.getUTCHours() +":"+ ((this.getUTCMinutes() < 10)?"0":"") + this.getUTCMinutes() +":"+ ((this.getUTCSeconds() < 10)?"0":"") + this.getUTCSeconds();
      }
    
      let newDate = new Date();
      return (newDate.today() + " " + newDate.timeNow() + " " + "UTC");
  
    } catch (error) {
      console.error(`Fail to get datetime`);
      return ('Fail to get datetime');
  }
  
}

exports.getDateTime = getDateTime;

