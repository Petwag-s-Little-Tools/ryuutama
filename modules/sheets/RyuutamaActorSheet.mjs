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
    context.spells = this.getSpells(itemData.items);
    context.skills = this.getSkills(itemData.items);
    context.maxHp = this.getMaxHp(itemData.system);
    context.maxMp = this.getMaxMp(itemData.system);
    context.selectedStat = itemData.selectedStat;

    console.log(itemData.selectedStat);
    return context;
  }

  activateListeners(html) {
    super.activateListeners(html);

    if (this.actor.isOwner) {
      html.find(".condition-roll").click(this.onConditionRoll.bind(this));
      html.find(".stat-item").click(this.onStatSelect.bind(this));
    }
  }

  // Data Getter
  getSpells(items) {
    return items.filter((item) => item.type === "spell");
  }

  getSkills(items) {
    return items.filter((item) => item.type === "skill");
  }

  getMaxHp(system) {
    return system.stats.str.die * 2;
  }

  getMaxMp(system) {
    return system.stats.spi.die * 2;
  }

  // Event Handlers
  onConditionRoll() {
    this.actor.rollCondition();
  }

  onStatSelect(event) {
    const dataStat = event.currentTarget.attributes["data-stat"];

    if (!dataStat || !dataStat.value) return;

    const stat = dataStat.value;

    this.actor.selectStat(stat);
  }
}
