import { RyuutamaActorSheet } from "./sheets/RyuutamaActorSheet.mjs";

import { RyuutamaActor } from "./documents/RyuutamaActor.mjs";

Hooks.once("init", () => {
  console.log("ryuutama | Starting Ryuutama System");

  game.ryuutama = {
    RyuutamaActor,
  };

  CONFIG.Actor.documentClass = RyuutamaActor;

  Actors.unregisterSheet("core", ActorSheet);
  Actors.registerSheet("character", RyuutamaActorSheet, { makeDefault: true });
});
