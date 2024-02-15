import * as esbuild from "esbuild";

const ctx = await esbuild.context({
  entryPoints: ["modules/index.mjs"],
  bundle: true,
  outfile: "ryuutama.mjs",
});

ctx.watch();
