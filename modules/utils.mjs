export const preloadHandlerbarsTemplates = async function () {
  const partials = ["systems/ryuutama/templates/actor/parts/actor-edit.hbs"];

  const paths = {};

  partials.forEach((p) => {
    paths[p.replace(".hbs", ".html")] = p;
    paths[`ryuutama.${p.split("/").pop().replace(".hbs", "")}`] = p;
  });

  return loadTemplates(paths);
};
