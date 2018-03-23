"use strict";

require("colors");

var _commander = require("commander");

var _commander2 = _interopRequireDefault(_commander);

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*globals
process
console
require
__dirname
*/

var library = _fs2.default.readFileSync(__dirname + "/templates/library.js", "utf8");
var scene = _fs2.default.readFileSync(__dirname + "/templates/scene.js", "utf8");
var button = _fs2.default.readFileSync(__dirname + "/templates/button.js", "utf8");

var _require = require("child_process"),
    exec = _require.exec;

var execPath = process.cwd();
var defaultFolder = ".scenes";

_commander2.default.version("0.1.0").option("--save-dev", "Saves react-scenes as devDependencies (works only with --bare)").option("--bare", "Generates only template files").option("-l, --library-name [value]", "Library Name").option("-f, --folder-name [value]", "Folder Name").parse(process.argv);

var slugify = function slugify(text) {
  return text.toString().toLowerCase().replace(/\s+/g, "-").replace(/[^\w\-]+/g, "").replace(/\-\-+/g, "-").replace(/^-+/, "").replace(/-+$/, "");
};

var ensureDirectoryExistence = function ensureDirectoryExistence(filePath) {
  var dirname = _path2.default.dirname(filePath);
  if (_fs2.default.existsSync(dirname)) {
    return true;
  }
  ensureDirectoryExistence(dirname);
  _fs2.default.mkdirSync(dirname);
};

var compile = function compile(template, properties) {
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

var createBoilerplate = function createBoilerplate(_ref) {
  var saveDev = _ref.saveDev,
      bare = _ref.bare,
      libraryName = _ref.libraryName,
      folderName = _ref.folderName;

  var orgFolder = folderName || defaultFolder;
  var folder = slugify(orgFolder.replace(".", "")) + "-temp";

  console.log("\n🌄 ", ("react-scenes setup started on " + execPath + "...\n").rainbow);

  if (!bare) {
    console.log("OK".green, "create-react-app installation has been started...".yellow);
    exec("npx create-react-app " + folder, function (err, stdout, stderr) {
      console.log("OK".green, "create-react-app has been installed.\n".yellow);
      // console.log(stdout, stderr, err);

      // add .scenes/node_modules to .gitignore
      var gitignore = void 0;
      try {
        gitignore = _fs2.default.readFileSync(execPath + "/.gitignore");
      } catch (e) {}
      if (gitignore) {
        _fs2.default.writeFileSync(execPath + "/.gitignore", gitignore + "\n\n/.scenes/node_modules/");
        console.log(" OK".green, ".gitignore udpated.".yellow);
      }

      // npm install react-scenes under .scenes
      exec("npm install react-scenes --save --prefix ./" + folder, function (err, stdout, stderr) {
        console.log(" OK".green, "react-scenes".green.bold, "saved as dependency to cra.".green);
        // console.log(stdout, stderr);

        // npm install styled-components under .scenes
        exec("npm install styled-components --save --prefix ./" + folder, function (err, stdout, stderr) {
          console.log(" OK".green, "styled-components".green.bold, "saved as dependency to cra.\n".green);

          // console.log(stdout, stderr);

          // clean up files
          exec("rm -rf ./" + folder + "/src/App.css");
          exec("rm -rf ./" + folder + "/src/logo.svg");
          exec("rm -rf ./" + folder + "/public/favicon.ico");
          exec("rm -rf ./" + folder + "/README.md");
          exec("rm -rf ./" + folder + "/etc");

          // generate library as App.js
          var libName = libraryName || "🌄 My Scenes";

          _fs2.default.writeFileSync(execPath + "/" + folder + "/src/App.js", compile(library, { title: libName }));
          console.log(" OK".green, "library named".yellow, ("\"" + libName + "\"").bold.yellow, "has been generated.".yellow);

          // generate scene.js
          ensureDirectoryExistence(execPath + "/" + folder + "/src/scenes/button.js");
          _fs2.default.writeFileSync(execPath + "/" + folder + "/src/scenes/button.js", compile(scene, {}));
          console.log(" OK".green, "demo button scene has been generated.".yellow);

          // generate button.js
          ensureDirectoryExistence(execPath + "/" + folder + "/src/components/button.js");
          _fs2.default.writeFileSync(execPath + "/" + folder + "/src/components/button.js", compile(button, {}));
          console.log(" OK".green, "demo button component has been generated.\n".yellow);

          exec("mv " + execPath + "/" + folder + " " + execPath + "/" + orgFolder);

          // template files
          console.log("Thank you \uD83D\uDC4D");
          console.log("let's start by \"cd " + orgFolder + " && yarn\" or \"cd " + orgFolder + " && npm install\".");
          console.log("then \"yarn start\" or \"npm run start\".\n");
        });
      });
    });
  } else {
    // create parent folder
    exec("mkdir " + orgFolder, function (err, stdout, stderr) {
      console.log("OK".green, (orgFolder + " folder has been created").yellow);

      // generate library.js
      var libName = libraryName || "🌄 My Scenes";

      _fs2.default.writeFileSync(execPath + "/" + orgFolder + "/library.js", compile(library, { title: libName }));
      console.log(" OK".green, "library named".yellow, ("\"" + libName + "\"").bold.yellow, "has been generated.".yellow);

      // generate scene.js
      ensureDirectoryExistence(execPath + "/" + orgFolder + "/scenes/button.js");
      _fs2.default.writeFileSync(execPath + "/" + orgFolder + "/scenes/button.js", compile(scene, {}));
      console.log(" OK".green, "demo button scene has been generated.".yellow);

      // generate button.js
      ensureDirectoryExistence(execPath + "/" + orgFolder + "/components/button.js");
      _fs2.default.writeFileSync(execPath + "/" + orgFolder + "/components/button.js", compile(button, {}));
      console.log(" OK".green, "demo button component has been generated.".yellow);
    });

    // install and save react-scenes
    exec("npm install react-scenes " + (saveDev ? "--save-dev" : "--save"), function (err, stdout, stderr) {
      if (saveDev) {
        console.log(" OK ".green, "react-scenes saved as dev dependency.\n".green);
      } else {
        console.log(" OK".green, "react-scenes".green.bold, "saved as dependency.\n".green);
      }

      console.log("👍 ", "don't forget to direct a route to " + execPath + "/.scenes/library.js \n");
    });
  }
};

createBoilerplate(_commander2.default);
