/*globals
process
console
require
*/

import "colors";
import program from "commander";
import fs from "fs";

import { library, scene, button } from "./templates";

const { exec } = require("child_process");

const path = process.cwd();
const folder = "scenes";

program
  .version("0.1.0")
  .option("--save-dev", "Save as dev dependency")
  .parse(process.argv);

const compile = (template, properties) => {
  var returnValue = "";

  var templateFragments = template.split("{{");

  returnValue += templateFragments[0];

  for (var i = 1; i < templateFragments.length; i++) {
    var fragmentSections = templateFragments[i].split("}}", 2);
    returnValue += properties[fragmentSections[0]];
    returnValue += fragmentSections[1];
  }

  return returnValue;
};

const createBoilerplate = ({ saveDev, withCra }) => {
  console.log("\n");
  console.log("🌄", " ", `react-scenes setup started on ${path}`.rainbow);

  // init cra
  if (withCra) {
    console.log(
      "✅",
      " ",
      "create-react-app installation has been started.".blue
    );

    // npx create-react-app my-app

    console.log(" ", "✅", " ", "create-react-app has been installed.".yellow);
  } else {
    // create parent folder
    exec("mkdir scenes", (err, stdout, stderr) => {
      console.log("✅", " ", `${folder} folder has been created\n`.blue);

      // generate library.js
      fs.writeFileSync(
        path + `/${folder}/library.js`,
        compile(library, { title: "🌄 My Scenes" })
      );
      console.log(" ", "✅", " ", "library has been generated".yellow);

      // generate scene.js
      fs.writeFileSync(path + `/${folder}/scene.js`, compile(scene, {}));
      console.log(" ", "✅", " ", "button scene has been generated".yellow);

      // generate button.js
      fs.writeFileSync(path + `/${folder}/button.js`, compile(button, {}));
      console.log(" ", "✅", " ", "button component has been generated".yellow);
    });

    // install and save react-scenes
    // exec(
    //   `npm install react-scenes ${saveDev ? "--save-dev" : "--save"}`,
    //   (err, stdout, stderr) => {
    //     if (saveDev) {
    //       console.log("✅", " ", "react-scenes saved as dev dependency".green);
    //     } else {
    //       console.log("✅", " ", "react-scenes saved as dependency".green);
    //     }
    //   }
    // );
  }
};

createBoilerplate(program);
