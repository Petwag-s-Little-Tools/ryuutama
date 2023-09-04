export const preloadHandlerbarsTemplates = async function () {
  const partials = [
    "systems/ryuutama/templates/actor/parts/actor-edit.hbs",
    "systems/ryuutama/templates/actor/parts/actor-stats.hbs",
    "systems/ryuutama/templates/actor/parts/actor-items.hbs",
    "systems/ryuutama/templates/actor/parts/actor-magic.hbs",
    "systems/ryuutama/templates/actor/parts/actor-bio.hbs",
  ];

  const paths = {};

  partials.forEach((p) => {
    paths[p.replace(".hbs", ".html")] = p;
    paths[`ryuutama.${p.split("/").pop().replace(".hbs", "")}`] = p;
  });

  return loadTemplates(paths);
};
