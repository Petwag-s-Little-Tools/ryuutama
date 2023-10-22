import { ryuutama } from "./config.mjs";

export const preloadHandlerbarsTemplates = async function () {
  const generalTemplates = [
    "systems/ryuutama/templates/parts/active-effects.hbs",
  ];

  const actorTemplates = [
    "systems/ryuutama/templates/actor/parts/actor-edit.hbs",
    "systems/ryuutama/templates/actor/parts/actor-stats.hbs",
    "systems/ryuutama/templates/actor/parts/actor-items.hbs",
    "systems/ryuutama/templates/actor/parts/actor-magic.hbs",
    "systems/ryuutama/templates/actor/parts/actor-bio.hbs",
    "systems/ryuutama/templates/actor/parts/actor-section-skills.hbs",
    "systems/ryuutama/templates/actor/parts/actor-section-items.hbs",
  ];

  const itemTemplates = Array.from(Object.keys(ryuutama.itemTypes)).map(
    (type) => {
      return `systems/ryuutama/templates/item/parts/item-${type}.hbs`;
    }
  );

  const partials = [...actorTemplates, ...itemTemplates, ...generalTemplates];

  const paths = {};

  partials.forEach((p) => {
    paths[p.replace(".hbs", ".html")] = p;
    paths[`ryuutama.${p.split("/").pop().replace(".hbs", "")}`] = p;
  });

  return loadTemplates(paths);
};
