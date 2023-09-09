import { RyuutamaCombatantConfig } from "./RyuutamaCombatantConfig.mjs";

export class RyuutamaCombatTracker extends CombatTracker {
  _onConfigureCombatant(li) {
    const combatant = this.viewed.combatants.get(li.data("combatant-id"));
    new RyuutamaCombatantConfig(combatant, {
      top: Math.min(li[0].offsetTop, window.innerHeight - 350),
      left: window.innerWidth - 720,
      width: 400,
    }).render(true);
  }

  _onCombatantControl(event) {
    console.log("PROTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT");
    super._onCombatantControl(event);
  }

  _onCombatCreate(event) {
    console.log("PROTT");
    super._onCombatCreate(event);
  }
}
