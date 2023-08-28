import { RyuutamaActorSheet } from "./sheets/RyuutamaActorSheet.mjs";
import { RyuutamaItemSheet } from "./sheets/RyuutamaItemSheet.mjs";

import { ryuutama } from "./config.mjs";

import { RyuutamaActor } from "./documents/RyuutamaActor.mjs";

Hooks.once("init", () => {
  console.log("ryuutama | Starting Ryuutama System");

  // Make config available
  CONFIG.ryuutama = ryuutama;

  // Not sure what is this for
  game.ryuutama = {
    RyuutamaActor,
  };

  CONFIG.Actor.documentClass = RyuutamaActor;

  // Register Actor sheets
  Actors.unregisterSheet("core", ActorSheet);
  Actors.registerSheet("character", RyuutamaActorSheet, { makeDefault: true });

  // Register Item sheets
  Items.unregisterSheet("core", ItemSheet);
  Items.registerSheet("item", RyuutamaItemSheet, { makeDefault: true });
});
