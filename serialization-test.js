/**
 * Tests whether the supplied file contains
 * a valid serialization of a JSON object. 
 * 
*/
const fs = require('fs');
const args = process.argv;

if (args.length !== 3) {
    console.log("Usage: node serialization-test.js [filename]");
} else {
    const filename = args[2];
    
    let content = '';
    try {
        content = fs.readFileSync(filename);  
    } catch(e) {
        console.log(`Error: file ${filename} not found`);
    }

    let parsedRule = '';
    try {
        parsedRule = JSON.parse(content);
    } catch (e) {}
       
    let result = 'invalid';
    if (parsedRule && typeof parsedRule === 'object') {
        result = 'valid';  
    }
    console.log(`${filename} is: ${result}`);
}