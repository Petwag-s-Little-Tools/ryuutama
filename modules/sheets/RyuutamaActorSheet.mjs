import { ryuutama } from "../config.mjs";

export class RyuutamaActorSheet extends ActorSheet {
  // TODO: deal with damage roll + damage reducing HP
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

    context.config = CONFIG.ryuutama;
    context.rollableClass = this.isEditable ? "rollable" : "";

    this.stats;

    context.system = this.system;
    context.spells = this.spells;
    context.skills = this.skills;
    context.items = this.items;
    context.stats = this.stats;

    context.maxHp = this.maxHp;
    context.maxMp = this.maxMp;
    return context;
  }

  /** @override */
  async _onDropItemCreate(itemData) {
    // TODO: Make Item type Character Type Magic/Warrior/...
    // TODO: Make Item type Class
    // TODO: Make level an item? Or make XP an item?
    // TODO: Deal with level and xp in actor
    console.log(itemData);
    itemData = itemData instanceof Array ? itemData : [itemData];
    return this.actor.createEmbeddedDocuments("Item", itemData);
  }

  // Data Getter
  get system() {
    return this.actor.system;
  }

  get spells() {
    const items = this.actor.items;
    const spells = items.filter((item) => item.type === "spell");
    return spells;
  }

  get items() {
    const items = this.actor.items;
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

  get skills() {
    const items = this.actor.items;
    const skills = items.filter((item) => item.type === "skill");
    return skills;
  }

  get maxHp() {
    return this.system.stats.str.die * 2;
  }

  get maxMp() {
    return this.system.stats.spi.die * 2;
  }

  get stats() {
    const system = this.system;

    // TODO: Add cache and flag for refresh when change happens
    const stats = {};
    Object.entries(system.stats).forEach(([key, data]) => {
      const conditions = ryuutama.stats[key].statuses;

      const conditionModifier = conditions.reduce((accumulator, condition) => {
        return accumulator + system.statuses[condition];
      }, 0);

      const modifier = data.mod + data.condition - conditionModifier;

      stats[key] = {
        die: this.modifyDice(data.die, modifier),
      };
    });

    return stats;
  }

  /**
   * EVENTS
   **/
  activateListeners(html) {
    super.activateListeners(html);

    if (this.actor.isOwner) {
      html.find(".condition-roll").click(this.onConditionRoll.bind(this));
      html.find(".stat-item").click(this.onStatSelect.bind(this));
      html.find(".stats-roll").click(this.onStatRoll.bind(this));
      html.find(".equip-toggle").click(this.onEquipItem.bind(this));

      // Skills
      html.find(".rollable .item-image").click(this.onItemUse.bind(this));
      html.find(".item-delete").click(this.onItemDelete.bind(this));
      html.find(".item-edit").click(this.onItemEdit.bind(this));
    }
  }

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
    await this.actor.rollAction();
  }

  async onEquipItem(event) {
    const itemId = event.currentTarget.closest(".item").dataset.itemId;
    const item = this.actor.items.get(itemId);

    if (item === undefined) return;

    const effects = this.actor.getEmbeddedCollection("ActiveEffect");
    const effect = effects.filter((effect) =>
      effect.origin.endsWith(itemId)
    )[0];

    if (effect === undefined) return;

    const newStatus = !item.system.active;

    await effect.update({ disabled: !newStatus });

    return item.equip(newStatus);
  }

  async onItemUse(event) {
    const item = this.getItem(event);

    if (item === undefined) return;

    return await item.use();
  }

  onItemDelete(event) {
    const item = this.getItem(event);

    if (item === undefined) return;

    return item.deleteDialog();
  }

  onItemEdit(event) {
    const item = this.getItem(event);

    if (item === undefined) return;

    return item.sheet.render(true);
  }

  getItem(event) {
    const itemId = event.currentTarget.closest(".item").dataset.itemId;
    return this.actor.items.get(itemId);
  }

  /**
   * HELPERS
   **/
  modifyDice(die, modifier) {
    if (modifier === 0) return die;

    const dice = ryuutama.dice;

    let jumps = modifier;
    let currentDie = die;

    while (true) {
      if (jumps === 0) {
        break;
      } else if (jumps < 0) {
        currentDie = dice[currentDie].previous;
        jumps += 1;
      } else if (jumps > 0) {
        currentDie = dice[currentDie].next;
        jumps -= 1;
      }
    }

    return currentDie;
  }
}
