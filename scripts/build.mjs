import * as esbuild from "esbuild";

const result = await esbuild.build({
  entryPoints: ["modules/index.mjs"],
  bundle: true,
  outfile: "ryuutama.mjs",
});
console.log(result);
