import { RyuutamaActorSheet } from "./modules/sheets/RyuutamaActorSheet.mjs";
import { RyuutamaItemSheet } from "./modules/sheets/RyuutamaItemSheet.mjs";

import { ryuutama } from "./modules/config.mjs";

import { RyuutamaActor } from "./modules/documents/RyuutamaActor.mjs";
import { RyuutamaItem } from "./modules/documents/RyuutamaItem.mjs";

import { RyuutamaCombat } from "./modules/combat/RyuutamaCombat.mjs";
import { RyuutamaCombatTracker } from "./modules/combat/RyuutamaCombatTracker.mjs";
import { RyuutamaCombatant } from "./modules/combat/RyuutamaCombatant.mjs";
import { RyuutamaCombatantConfig } from "./modules/combat/RyuutamaCombatantConfig.mjs";
import { preloadHandlerbarsTemplates } from "./modules/utils.mjs";

import { RyuutamaActiveEffect } from "./modules/documents/RyuutamaActiveEffect.mjs";

Hooks.once("init", () => {
  console.log("ryuutama | Starting Ryuutama System");

  // Make config available
  CONFIG.ryuutama = ryuutama;

  // Not sure what is this for
  game.ryuutama = {
    RyuutamaActor,
    RyuutamaItem,
  };

  CONFIG.Actor.documentClass = RyuutamaActor;
  CONFIG.Item.documentClass = RyuutamaItem;

  // Active Effects
  // CONFIG.ActiveEffect.sheetClass = RyuutamaActiveEffectConfig; // To modify the ActiveEffect sheet
  CONFIG.ActiveEffect.documentClass = RyuutamaActiveEffect;

  // Combat
  CONFIG.Combat.documentClass = RyuutamaCombat;
  CONFIG.ui.combat = RyuutamaCombatTracker;
  CONFIG.Combatant.documentClass = RyuutamaCombatant;
  CONFIG.Combatant.sheetClass = RyuutamaCombatantConfig;
  CONFIG.Combat.initiative.formula = "1d@stats.dex.die + 1d@stats.int.die";

  // Register Actor sheets
  Actors.unregisterSheet("core", ActorSheet);
  Actors.registerSheet("character", RyuutamaActorSheet, { makeDefault: true });

  // Register Item sheets
  Items.unregisterSheet("core", ItemSheet);
  Items.registerSheet("item", RyuutamaItemSheet, { makeDefault: true });

  // Preload Handlebars templates
  preloadHandlerbarsTemplates();

  // Handerbars helpers
  Handlebars.registerHelper("ifIn", function (list, value, options) {
    if (list.includes(value)) return options.fn(this);
  });
});
