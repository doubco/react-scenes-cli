/*globals
__dirname
*/

import fs from "fs";

export const library = fs.readFileSync(__dirname + "/library.js", "utf8");
export const scene = fs.readFileSync(__dirname + "/scene.js", "utf8");
export const button = fs.readFileSync(__dirname + "/button.js", "utf8");
