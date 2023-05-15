const fs = require('fs').promises;

const readFile = async function(filePath) {
  try {
    const data = await fs.readFile(__dirname + '/' + filePath);
    console.log(JSON.parse(data));
    return (JSON.parse(data));
  } catch (error) {
    console.error(`Got an error trying to read the file: ${error.message}`);
    return error
  }
}

exports.readFile = readFile;