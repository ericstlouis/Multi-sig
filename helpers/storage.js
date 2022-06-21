const fs = require('fs');
const path = require('path');

fs.readFile(path.join(__dirname, 'test.txt'), 'utf8', (err, data) => {
    if(err) throw err;
    console.log(data)
})

console.log("hey");

fs.writeFile(path.join(__dirname, 'test.txt'), 'hey bitch', (err) => {
    if(err) throw err
    console.log("write complete");

    fs.appendFile(path.join(__dirname, 'test.txt'), '\n\n\Test', (err) => {
      if (err) throw err;
      console.log('write complete');
    });

})


process.on('uncaughtException', err => {
    console.error(`There was an uncaught error: ${err}`);
    process.exit(1);


}  )