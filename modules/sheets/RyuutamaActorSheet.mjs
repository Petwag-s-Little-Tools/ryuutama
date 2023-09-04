export class RyuutamaActorSheet extends ActorSheet {
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ["ryuutama", "sheet", "actor"],
      template: "systems/ryuutama/templates/actor/actor-sheet.hbs",
      width: 600,
      height: 600,
      tabs: [
        {
          navSelector: ".sheet-tabs",
          contentSelector: ".sheet-body",
          initial: "stats",
        },
      ],
    });
  }

  get template() {
    return `systems/ryuutama/templates/actor/actor-${this.actor.type}-sheet.hbs`;
  }

  getData() {
    const context = super.getData();

    const itemData = this.actor;

    context.config = CONFIG.ryuutama;
    context.system = itemData.system;
    context.spells = this._getSpells(itemData.items);
    context.skills = this._getSkills(itemData.items);
    context.maxHp = this._getMaxHp(itemData.system);
    context.maxMp = this._getMaxMp(itemData.system);

    console.log(context.system);
    return context;
  }

  activateListeners(html) {
    super.activateListeners(html);

    if (this.actor.isOwner) {
      html.find(".condition-roll").click(this._onConditionRoll.bind(this));
    }
  }

  // Data Getter
  _getSpells(items) {
    return items.filter((item) => item.type === "spell");
  }

  _getSkills(items) {
    return items.filter((item) => item.type === "skill");
  }

  _getMaxHp(system) {
    return system.stats.str.die * 2;
  }

  _getMaxMp(system) {
    return system.stats.spi.die * 2;
  }

  // Event Handlers
  _onConditionRoll() {
    this.actor.rollCondition();
  }
}
