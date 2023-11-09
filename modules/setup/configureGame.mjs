import { RyuutamaCombat } from "../combat/RyuutamaCombat.mjs";
import { RyuutamaCombatTracker } from "../combat/RyuutamaCombatTracker.mjs";
import { RyuutamaCombatant } from "../combat/RyuutamaCombatant.mjs";
import { RyuutamaCombatantConfig } from "../combat/RyuutamaCombatantConfig.mjs";
import { itemConfig } from "../data/index.mjs";
import { ActionRoll } from "../dice/ActionRoll.mjs";
import { RyuutamaActiveEffect } from "../documents/RyuutamaActiveEffect.mjs";
import { RyuutamaActor } from "../documents/RyuutamaActor.mjs";
import { RyuutamaItem } from "../documents/RyuutamaItem.mjs";
import { RyuutamaActorSheet } from "../sheets/RyuutamaActorSheet.mjs";
import { RyuutamaItemSheet } from "../sheets/RyuutamaItemSheet.mjs";

const configureActor = (config, actors) => {
  config.Actor.documentClass = RyuutamaActor;
  config.Actor.dataModels = {};

  // Register Actor sheets
  actors.unregisterSheet("core", ActorSheet);
  actors.registerSheet("character", RyuutamaActorSheet, { makeDefault: true });
};

const configureItem = (config, items) => {
  config.Item.documentClass = RyuutamaItem;
  config.Item.dataModels = itemConfig;

  // Register Item sheets
  items.unregisterSheet("core", ItemSheet);
  items.registerSheet("item", RyuutamaItemSheet, { makeDefault: true });
};

const configureCombat = (config) => {
  config.Combat.documentClass = RyuutamaCombat;
  config.ui.combat = RyuutamaCombatTracker;
  config.Combatant.documentClass = RyuutamaCombatant;
  config.Combatant.sheetClass = RyuutamaCombatantConfig;
  config.Combat.initiative.formula = "1d@stats.dex.die + 1d@stats.int.die";
};

const configureActiveEffect = (config) => {
  // config.ActiveEffect.sheetClass = RyuutamaActiveEffectConfig; // To modify the ActiveEffect sheet
  config.ActiveEffect.documentClass = RyuutamaActiveEffect;
};

const configureDiceAndRoll = (config) => {
  config.Dice.ActionRoll = ActionRoll;
  config.Dice.rolls.push(ActionRoll);
};

export const configureGame = (config, actors, items) => {
  configureActor(config, actors);
  configureItem(config, items);
  configureCombat(config);
  configureActiveEffect(config);
  configureDiceAndRoll(config);
};
