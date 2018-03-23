/*globals
process
console
require
*/

import "colors";
import program from "commander";
import fs from "fs";
import path from "path";

import { library, scene, button } from "./templates";

const { exec } = require("child_process");

const execPath = process.cwd();
const defaultFolder = ".scenes";

program
  .version("0.1.0")
  .option(
    "--save-dev",
    "Saves react-scenes as devDependencies (works only with --bare)"
  )
  .option("--bare", "Generates only template files")
  .option("-l, --library-name [value]", "Library Name")
  .option("-f, --folder-name [value]", "Folder Name")
  .parse(process.argv);

const ensureDirectoryExistence = filePath => {
  var dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) {
    return true;
  }
  ensureDirectoryExistence(dirname);
  fs.mkdirSync(dirname);
};

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

const createBoilerplate = ({ saveDev, bare, libraryName, folderName }) => {
  let folder = folderName || defaultFolder;

  console.log(
    "\n🌄 ",
    `react-scenes setup started on ${execPath}...\n`.rainbow
  );

  if (!bare) {
    console.log(
      "OK".green,
      "create-react-app installation has been started...".yellow
    );
    exec(`npx create-react-app ${folder}`, (err, stdout, stderr) => {
      console.log("OK".green, "create-react-app has been installed.\n".yellow);

      // add .scenes/node_modules to .gitignore
      let gitignore = fs.readFileSync(`${execPath}/.gitignore`);
      if (gitignore) {
        fs.writeFileSync(
          `${execPath}/.gitignore`,
          `${gitignore}\n\n/.scenes/node_modules/`
        );
        console.log(" OK".green, ".gitignore udpated.".yellow);
      }

      // npm install react-scenes under .scenes
      exec(
        `npm install react-scenes --save --prefix ./${folder}`,
        (err, stdout, stderr) => {
          console.log(
            " OK".green,
            "react-scenes".green.bold,
            "saved as dependency to cra.".green
          );
          // console.log(stdout, stderr);

          // npm install styled-components under .scenes
          exec(
            `npm install styled-components --save --prefix ./${folder}`,
            (err, stdout, stderr) => {
              console.log(
                " OK".green,
                "styled-components".green.bold,
                "saved as dependency to cra.\n".green
              );

              // console.log(stdout, stderr);

              // clean up files
              exec(`rm -rf ./${folder}/src/App.css`);
              exec(`rm -rf ./${folder}/src/logo.svg`);
              exec(`rm -rf ./${folder}/public/favicon.ico`);
              exec(`rm -rf ./${folder}/README.md`);
              exec(`rm -rf ./${folder}/etc`);

              // generate library as App.js
              let libName = libraryName || "🌄 My Scenes";

              fs.writeFileSync(
                `${execPath}/${folder}/src/App.js`,
                compile(library, { title: libName })
              );
              console.log(
                " OK".green,
                "library named".yellow,
                `"${libName}"`.bold.yellow,
                "has been generated.".yellow
              );

              // generate scene.js
              ensureDirectoryExistence(
                `${execPath}/${folder}/src/scenes/button.js`
              );
              fs.writeFileSync(
                `${execPath}/${folder}/src/scenes/button.js`,
                compile(scene, {})
              );
              console.log(
                " OK".green,
                "demo button scene has been generated.".yellow
              );

              // generate button.js
              ensureDirectoryExistence(
                `${execPath}/${folder}/src/components/button.js`
              );
              fs.writeFileSync(
                `${execPath}/${folder}/src/components/button.js`,
                compile(button, {})
              );
              console.log(
                " OK".green,
                "demo button component has been generated.\n".yellow
              );

              // template files
              console.log(`Thank you 👍`);
              console.log(
                `let's start by "cd ${folder} && yarn" or "cd ${folder} && npm install".`
              );
              console.log(`then "yarn start" or "npm run start".\n`);
            }
          );
        }
      );
    });
  } else {
    // create parent folder
    exec(`mkdir ${folder}`, (err, stdout, stderr) => {
      console.log("OK".green, `${folder} folder has been created`.yellow);

      // generate library.js
      let libName = libraryName || "🌄 My Scenes";

      fs.writeFileSync(
        `${execPath}/${folder}/library.js`,
        compile(library, { title: libName })
      );
      console.log(
        " OK".green,
        "library named".yellow,
        `"${libName}"`.bold.yellow,
        "has been generated.".yellow
      );

      // generate scene.js
      fs.writeFileSync(
        `${execPath}/${folder}/scenes/button.js`,
        compile(scene, {})
      );
      console.log(" OK".green, "demo button scene has been generated.".yellow);

      // generate button.js
      fs.writeFileSync(
        `${execPath}/${folder}/components/button.js`,
        compile(button, {})
      );
      console.log(
        " OK".green,
        "demo button component has been generated.".yellow
      );
    });

    // install and save react-scenes
    exec(
      `npm install react-scenes ${saveDev ? "--save-dev" : "--save"}`,
      (err, stdout, stderr) => {
        if (saveDev) {
          console.log(
            " OK ".green,
            "react-scenes saved as dev dependency.\n".green
          );
        } else {
          console.log(
            " OK".green,
            "react-scenes".green.bold,
            "saved as dependency.\n".green
          );
        }

        console.log(
          "👍 ",
          `don't forget to direct a route to ${execPath}/.scenes/library.js \n`
        );
      }
    );
  }
};

createBoilerplate(program);
