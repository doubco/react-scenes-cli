/*globals
process
console
require
*/

import "colors";
import program from "commander";

const { exec } = require("child_process");

program
  .version("0.1.0")
  .option("--bare", "Bare")
  .parse(process.argv);

const createBoilerplate = ({ bare, dev }) => {
  if (bare) {
    console.log("Bare Installation Started...".rainbow);
  } else {
    console.log("Normal Installation Started...".rainbow);
  }

  // create folder
  exec("mkdir .scenes", (err, stdout, stderr) => {
    console.log(stdout, stderr);
    console.log(".scenes folder has been created".yellow);
  });

  // install and save react-scenes
  exec(
    `npm install react-scenes ${dev ? "--save-dev" : "--save"}`,
    (err, stdout, stderr) => {
      console.log(stdout, stderr);
      console.log(".scenes folder has been created".yellow);
    }
  );

  if (!bare) {
    // install cra
    // cleanup cra
    // inject start script to package.json
  }

  // add templates
};

createBoilerplate(program);
