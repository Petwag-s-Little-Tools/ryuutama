import AdmZip from "adm-zip";

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

zip.writeZip("./release.zip");
