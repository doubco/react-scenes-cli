/*globals
process
console
require
*/

import "colors";
import program from "commander";

program
  .version("0.1.0")
  .option("--bare", "Bare")
  .parse(process.argv);

const createBoilerplate = ({ bare }) => {
  if (bare) {
    console.log("Bare Installation".rainbow);
  } else {
    console.log("Normal Installation".rainbow);
  }
};

createBoilerplate(program);
