import { ryuutama } from "../config.mjs";

export class RyuutamaActorSheet extends ActorSheet {
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ["ryuutama", "sheet", "actor"],
      template: "systems/ryuutama/templates/actor/actor-sheet.hbs",
      width: 600,
      height: 1050,
      tabs: [
        {
          navSelector: ".sheet-tabs",
          contentSelector: ".sheet-body",
          initial: "stats",
        },
      ],
    });
  }

  /*****************************
   * DATA
   *****************************/
  getData() {
    const context = super.getData();

    context.config = ryuutama;
    context.rollableClass = this.isEditable ? "rollable" : "";

    this.stats;

    context.system = this.system;
    context.stats = this.stats;

    context.spells = this.spells;
    context.skills = this.skills;
    context.items = this.items;
    context.characterTypes = this.characterTypes;
    context.characterClasses = this.characterClasses;

    context.maxHp = this.maxHp;
    context.maxMp = this.maxMp;
    return context;
  }

  /*****************************
   * GETTER
   *****************************/
  get template() {
    return `systems/ryuutama/templates/actor/actor-${this.actor.type}-sheet.hbs`;
  }

  get system() {
    return this.actor.system;
  }

  get spells() {
    return this.actor.itemTypes["spell"];
  }

  get characterTypes() {
    return this.actor.itemTypes["characterType"];
  }

  get characterClasses() {
    return this.actor.itemTypes["characterClass"];
  }

  get items() {
    const items = this.actor.itemTypes["item"];
    const itemMap = new Map();

    items.forEach((item) => {
      const key = item.system.itemType;

      if (!itemMap.has(key)) {
        itemMap.set(key, []);
      }

      itemMap.get(key).push(item);
    });

    return Object.fromEntries(itemMap);
  }

  get skills() {
    return this.actor.itemTypes["skill"];
  }

  get stats() {
    return this.actor.stats;
  }

  /**
   * @returns {number}
   */
  get maxHp() {
    return this.stats.str.die * 2;
  }

  /**
   * @returns {number}
   */
  get maxMp() {
    return this.stats.spi.die * 2;
  }

  /*****************************
   * SETUP
   *****************************/
  activateListeners(html) {
    super.activateListeners(html);

    if (this.actor.isOwner) {
      html.find(".condition-roll").click(this.onConditionRoll.bind(this));
      html.find(".stat-item").click(this.onStatSelect.bind(this));
      html.find(".stats-roll").click(this.onStatRoll.bind(this));
      html.find(".equip-toggle").click(this.onEquipItem.bind(this));

      const deleteLabel = game.i18n.localize("ryuutama.effectDelete");
      // Header
      const editMenu = [
        {
          icon: `<i class="fas fa-trash" title="${deleteLabel}"></i>`,
          name: "",
          callback: (t) => {
            this._deleteOwnedItemById(t.data("item-id"));
          },
        },
      ];

      new ContextMenu(html, ".class-delete", editMenu);
      new ContextMenu(html, ".type-delete", editMenu);

      // Skills
      html.find(".rollable .item-image").click(this.onItemUse.bind(this));
      html.find(".item-delete").click(this.onItemDelete.bind(this));
      html.find(".item-edit").click(this.onItemEdit.bind(this));
    }
  }

  /*****************************
   * ACTIONS
   *****************************/
  /** @override */
  async _onDropItemCreate(itemData) {
    switch (itemData.type) {
      case "xp":
        const xpAmount = itemData.system.amount;
        if (xpAmount !== 0) await this.actor.incrementXP(xpAmount);
        break;
      case "characterClass":
        const characterClasses = this.actor.itemTypes["characterClass"];
        if (characterClasses.length >= 2) {
          break;
        }
        const classes = itemData instanceof Array ? itemData : [itemData];
        return this.actor.createEmbeddedDocuments("Item", classes);
      case "characterType":
        const characterTypes = this.actor.itemTypes["characterType"];
        if (characterTypes.length >= 2) {
          break;
        }
        const types = itemData instanceof Array ? itemData : [itemData];
        return this.actor.createEmbeddedDocuments("Item", types);
      default:
        const items = itemData instanceof Array ? itemData : [itemData];
        return this.actor.createEmbeddedDocuments("Item", items);
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

  async _deleteOwnedItemById(_itemId) {
    const item = this.actor.items.get(_itemId);
    await item.deleteDialog();
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
}
