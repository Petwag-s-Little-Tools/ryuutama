export class RyuutamaActorSheet extends ActorSheet {
  get template() {
    return `systems/ryuutama/templates/actor/actor-${this.actor.type}-sheet.hbs`;
  }
}
