export class RyuutamaActorSheet extends ActorSheet {
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ["ryuutama", "sheet", "actor"],
      template: "systems/ryuutama/templates/actor/actor-sheet.hbs",
      width: 600,
      height: 800,
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
    context.items = this.getItems(itemData.items);

    console.log(context.items);

    context.maxHp = this.getMaxHp(itemData.system);
    context.maxMp = this.getMaxMp(itemData.system);
    return context;
  }

  activateListeners(html) {
    super.activateListeners(html);

    if (this.actor.isOwner) {
      html.find(".condition-roll").click(this.onConditionRoll.bind(this));
      html.find(".stat-item").click(this.onStatSelect.bind(this));
      html.find(".stats-roll").click(this.onStatRoll.bind(this));
      html.find(".equip-toggle").click(this.onEquipItem.bind(this));
    }
  }

  // Data Getter
  getSpells(items) {
    return items.filter((item) => item.type === "spell");
  }

  getItems(items) {
    const itemMap = new Map();

    items.forEach((item) => {
      if (item.type !== "item") return;

      const key = item.system.itemType;

      if (!itemMap.has(key)) {
        itemMap.set(key, []);
      }

      itemMap.get(key).push(item);
    });

    return Object.fromEntries(itemMap);
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
  async onConditionRoll() {
    await this.actor.rollCondition();
  }

  onStatSelect(event) {
    const dataStat = event.currentTarget.attributes["data-stat"];

    if (!dataStat || !dataStat.value) return;

    const stat = dataStat.value;

    this.actor.selectStat(stat);
  }

  async onStatRoll() {
    await this.actor.roll();
  }

  async onEquipItem(event) {
    const itemID = event.currentTarget.closest(".item").dataset.itemId;
    const item = this.actor.items.get(itemID);
    const effects = this.actor.getEmbeddedCollection("ActiveEffect");
    const effect = effects.filter((effect) =>
      effect.origin.endsWith(itemID)
    )[0];

    if (effect === undefined) return;

    const newStatus = !item.system.active;

    await effect.update({ disabled: !newStatus });

    return item.equip(newStatus);
  }
}
