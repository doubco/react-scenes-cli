/*globals
process
console
require
__dirname
*/

import "colors";
import program from "commander";
import fs from "fs";
import path from "path";

const library = fs.readFileSync(`${__dirname}/templates/library.js`, "utf8");
const scene = fs.readFileSync(`${__dirname}/templates/scene.js`, "utf8");
const button = fs.readFileSync(`${__dirname}/templates/button.js`, "utf8");

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

const slugify = text => {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
};

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
  let orgFolder = folderName || defaultFolder;
  let folder = `${slugify(orgFolder.replace(".", ""))}-temp`;

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
      // console.log(stdout, stderr, err);

      // add .scenes/node_modules to .gitignore
      let gitignore;
      try {
        gitignore = fs.readFileSync(`${execPath}/.gitignore`);
      } catch (e) {}
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

              exec(`mv ${execPath}/${folder} ${execPath}/${orgFolder}`);

              // template files
              console.log(`Thank you 👍`);
              console.log(
                `let's start by "cd ${orgFolder} && yarn" or "cd ${orgFolder} && npm install".`
              );
              console.log(`then "yarn start" or "npm run start".\n`);
            }
          );
        }
      );
    });
  } else {
    // create parent folder
    exec(`mkdir ${orgFolder}`, (err, stdout, stderr) => {
      console.log("OK".green, `${orgFolder} folder has been created`.yellow);

      // generate library.js
      let libName = libraryName || "🌄 My Scenes";

      fs.writeFileSync(
        `${execPath}/${orgFolder}/library.js`,
        compile(library, { title: libName })
      );
      console.log(
        " OK".green,
        "library named".yellow,
        `"${libName}"`.bold.yellow,
        "has been generated.".yellow
      );

      // generate scene.js
      ensureDirectoryExistence(`${execPath}/${orgFolder}/scenes/button.js`);
      fs.writeFileSync(
        `${execPath}/${orgFolder}/scenes/button.js`,
        compile(scene, {})
      );
      console.log(" OK".green, "demo button scene has been generated.".yellow);

      // generate button.js
      ensureDirectoryExistence(`${execPath}/${orgFolder}/components/button.js`);
      fs.writeFileSync(
        `${execPath}/${orgFolder}/components/button.js`,
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
