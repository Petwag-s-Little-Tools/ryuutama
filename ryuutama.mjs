import { RyuutamaActorSheet } from "./modules/sheets/RyuutamaActorSheet.mjs";
import { RyuutamaItemSheet } from "./modules/sheets/RyuutamaItemSheet.mjs";

import { ryuutama } from "./modules/config.mjs";

import { RyuutamaActor } from "./modules/documents/RyuutamaActor.mjs";
import { RyuutamaItem } from "./modules/documents/RyuutamaItem.mjs";

import { RyuutamaCombat } from "./modules/combat/RyuutamaCombat.mjs";
import { RyuutamaCombatTracker } from "./modules/combat/RyuutamaCombatTracker.mjs";
import { RyuutamaCombatant } from "./modules/combat/RyuutamaCombatant.mjs";
import { RyuutamaCombatantConfig } from "./modules/combat/RyuutamaCombatantConfig.mjs";
import {
  preloadHandlerbarsTemplates,
  registerHandleBarsHelpers,
} from "./modules/utils.mjs";

import { ActionRoll } from "./modules/dice/ActionRoll.mjs";
import { RyuutamaActiveEffect } from "./modules/documents/RyuutamaActiveEffect.mjs";

Hooks.once("init", () => {
  console.log("ryuutama | Starting Ryuutama System");

  // CONFIG.debug.hooks = true;

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

  // Dices & Rolls
  CONFIG.Dice.ActionRoll = ActionRoll;
  CONFIG.Dice.rolls.push(ActionRoll);

  // Register Actor sheets
  Actors.unregisterSheet("core", ActorSheet);
  Actors.registerSheet("character", RyuutamaActorSheet, { makeDefault: true });

  // Register Item sheets
  Items.unregisterSheet("core", ItemSheet);
  Items.registerSheet("item", RyuutamaItemSheet, { makeDefault: true });

  // Preload Handlebars templates
  preloadHandlerbarsTemplates();

  // Handerbars helpers
  registerHandleBarsHelpers();
});

// Other Hooks
Hooks.on("renderChatLog", (app, html, data) =>
  RyuutamaItem.chatListeners(html)
);
Hooks.on("renderChatPopout", (app, html, data) =>
  RyuutamaItem.chatListeners(html)
);
Hooks.on("onFumble", (app, html, data) => {
  RyuutamaActor.onFumble();
});
