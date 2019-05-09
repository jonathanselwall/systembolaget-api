const fs = require('fs');
const xml2js = require('xml2js');
const util = require('util');

util.inspect.defaultOptions.depth = null;

const parser = new xml2js.Parser();
const inputFilename = 'systemet.xml'
const outputFilename = 'systemet.json'

function convertXmlToJson(inputName, outputName) {
  return new Promise( (resolve, reject) => {
    fs.readFile(__dirname + '/' + inputName, (err, data) => {
      parser.parseString(data, (err, result) => {
        fs.writeFile(__dirname + '/' + outputName, JSON.stringify(result, null, 2), err => {
          if(err) return console.error('Error writing file', err)
          console.log(`Successfully wrote ${outputFilename}`)
          resolve()
        })
      })
    })
  })
}

convertXmlToJson(inputFilename, outputFilename);
    