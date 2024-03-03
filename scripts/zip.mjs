import { compilePack } from "@foundryvtt/foundryvtt-cli";
import AdmZip from "adm-zip";
import p from "../package.json" assert { type: "json" };

const zip = new AdmZip();

const files = [
  "./ryuutama.mjs",
  "./ryuutama.css",
  "./ryuutama.css.map",
  "system.json",
  "template.json",
];

files.forEach((file) => {
  zip.addLocalFile(file);
});

const folders = ["./lang", "./static", "./templates"];

folders.forEach((folder) => {
  zip.addLocalFolder(folder, folder);
});

const packs = ["skills", "spells"];

packs.forEach((pack) => {
  compilePack(`./packs/${pack}`, `./tmpPacks/${pack}`);
});
zip.addLocalFolder("./tmpPacks", "./packs");

zip.writeZip(`./ryuutama-release-${p.version}.zip`);
