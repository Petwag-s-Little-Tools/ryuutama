(() => {
  // modules/config.mjs
  var ryuutama = {};
  ryuutama.magicTypes = {
    none: "ryuutama.magicTypes.none",
    incantation: "ryuutama.magicTypes.incantation",
    spring: "ryuutama.magicTypes.spring",
    summer: "ryuutama.magicTypes.summer",
    autumn: "ryuutama.magicTypes.autumn",
    winter: "ryuutama.magicTypes.winter"
  };
  ryuutama.spellTypes = {
    none: "ryuutama.spellTypes.none",
    normal: "ryuutama.spellTypes.normal",
    ritual: "ryuutama.spellTypes.ritual"
  };
  ryuutama.durationUnits = {
    none: {
      value: "ryuutama.durationUnits.none",
      hasNumericValue: false
    },
    round: {
      value: "ryuutama.durationUnits.round",
      hasNumericValue: true
    },
    minute: {
      value: "ryuutama.durationUnits.minute",
      hasNumericValue: true
    },
    hour: {
      value: "ryuutama.durationUnits.hour",
      hasNumericValue: true
    },
    day: {
      value: "ryuutama.durationUnits.day",
      hasNumericValue: true
    },
    permanent: {
      value: "ryuutama.durationUnits.permanent",
      hasNumericValue: false
    },
    instant: {
      value: "ryuutama.durationUnits.instant",
      hasNumericValue: false
    },
    untilCured: {
      value: "ryuutama.durationUnits.untilCured",
      hasNumericValue: false
    },
    flightDuration: {
      value: "ryuutama.durationUnits.flightDuration",
      hasNumericValue: false
    },
    ritualLength: {
      value: "ryuutama.durationUnits.ritualLength",
      hasNumericValue: false
    },
    overnight: {
      value: "ryuutama.durationUnits.overnight",
      hasNumericValue: false
    },
    unknown: {
      value: "ryuutama.durationUnits.unknown",
      hasNumericValue: false
    }
  };
  ryuutama.spellLevels = {
    none: "ryuutama.spellLevels.none",
    low: "ryuutama.spellLevels.low",
    mid: "ryuutama.spellLevels.mid",
    high: "ryuutama.spellLevels.high"
  };
  ryuutama.itemTypes = {
    armor: "ryuutama.itemTypes.armor",
    gear: "ryuutama.itemTypes.gear",
    shield: "ryuutama.itemTypes.shield",
    weapon: "ryuutama.itemTypes.weapon",
    other: "ryuutama.itemTypes.other"
  };
  ryuutama.dice = {
    0: {
      value: "ryuutama.dice.d0",
      next: 4,
      previous: 0
    },
    4: {
      value: "ryuutama.dice.d4",
      next: 6,
      previous: 4
    },
    6: {
      value: "ryuutama.dice.d6",
      next: 8,
      previous: 4
    },
    8: {
      value: "ryuutama.dice.d8",
      next: 10,
      previous: 6
    },
    10: {
      value: "ryuutama.dice.d10",
      next: 12,
      previous: 8
    },
    12: {
      value: "ryuutama.dice.d12",
      next: 20,
      previous: 10
    },
    20: {
      value: "ryuutama.dice.d20",
      next: 20,
      previous: 12
    }
  };
  ryuutama.stats = {
    none: {},
    dex: {
      statuses: ["injury", "sickness", "shock"]
    },
    str: {
      statuses: ["poison", "sickness", "shock"]
    },
    int: {
      statuses: ["muddled", "sickness", "shock"]
    },
    spi: {
      statuses: ["exhaustion", "sickness", "shock"]
    }
  };
  ryuutama.levels = [
    { untilXp: 99, level: 1, bonuses: [] },
    {
      untilXp: 599,
      level: 2,
      bonuses: ["Stat increase", "Feint and Search Combat Actions"]
    },
    { untilXp: 1199, level: 3, bonuses: ["Terrain/Weather Specialty"] },
    {
      untilXp: 1999,
      level: 4,
      bonuses: ["Stat increase", " Status Effect Immunity"]
    },
    { untilXp: 2999, level: 5, bonuses: ["Extra Class"] },
    { untilXp: 4199, level: 6, bonuses: ["Stat increase", "Extra Type"] },
    { untilXp: 5799, level: 7, bonuses: ["Terrain/Weather Specialty"] },
    { untilXp: 7499, level: 8, bonuses: ["Stat increase"] },
    { untilXp: 9999, level: 9, bonuses: ["Favor of the Seasonal Dragons"] },
    {
      untilXp: 1e4,
      level: 10,
      bonuses: ["Stat Increase", "Embark on Legendary Journey"]
    }
  ];

  // modules/utils.mjs
  var isNull = function(value) {
    if (value === "none")
      return true;
    if (value === void 0)
      return true;
    if (value === null)
      return true;
    if (value === "")
      return true;
    return false;
  };
  var preloadHandlerbarsTemplates = async function() {
    const generalTemplates = [
      "systems/ryuutama/templates/parts/active-effects.hbs"
    ];
    const actorTemplates = [
      "systems/ryuutama/templates/actor/parts/actor-edit.hbs",
      "systems/ryuutama/templates/actor/parts/actor-stats.hbs",
      "systems/ryuutama/templates/actor/parts/actor-items.hbs",
      "systems/ryuutama/templates/actor/parts/actor-magic.hbs",
      "systems/ryuutama/templates/actor/parts/actor-bio.hbs",
      "systems/ryuutama/templates/actor/parts/actor-section-skills.hbs",
      "systems/ryuutama/templates/actor/parts/actor-section-items.hbs"
    ];
    const itemTemplates = Array.from(Object.keys(ryuutama.itemTypes)).map(
      (type) => {
        return `systems/ryuutama/templates/item/parts/item-${type}.hbs`;
      }
    );
    const partials = [...actorTemplates, ...itemTemplates, ...generalTemplates];
    const paths = {};
    partials.forEach((p) => {
      paths[p.replace(".hbs", ".html")] = p;
      paths[`ryuutama.${p.split("/").pop().replace(".hbs", "")}`] = p;
    });
    return loadTemplates(paths);
  };
  var registerHandleBarsHelpers = function() {
    Handlebars.registerHelper("ifIn", function(list, value, options) {
      if (list.includes(value))
        return options.fn(this);
    });
    Handlebars.registerHelper("isEqual", function(valueA, valueB, options) {
      if (valueA === valueB) {
        return options.fn(this);
      } else {
        return options.inverse(this);
      }
    });
  };

  // modules/dice/ActionRoll.mjs
  var ActionRoll = class extends Roll {
    _isFumble = void 0;
    _isCritical = void 0;
    get template() {
      return `systems/ryuutama/templates/dialog/action-roll.hbs`;
    }
    get concentration() {
      return this.options.concentration ?? "";
    }
    get isFumble() {
      if (this._isFumble === void 0) {
        this._isFumble = !this.terms.some((term) => {
          return term instanceof Die && term.total !== 1;
        });
      }
      return this._isFumble;
    }
    get isCritical() {
      if (this._isCritical === void 0) {
        this._isCritical = !this.terms.some((term) => {
          return term instanceof Die && term.total !== term.faces;
        });
      }
      return this._isCritical;
    }
    constructor(formula, data, options) {
      super(formula, data, options);
    }
    async getTooltip() {
      const parts = this.dice.map((d) => d.getTooltipData());
      const overridenParts = parts.map((p) => {
        const rolls = p.rolls.map((r) => {
          const splittedClassed = r.classes.split(" ");
          if (!splittedClassed.includes("max") && r.result === "6") {
            splittedClassed.push("max");
          }
          return {
            ...r,
            classes: splittedClassed.join(" ")
          };
        });
        return {
          ...p,
          rolls
        };
      });
      return renderTemplate(this.constructor.TOOLTIP_TEMPLATE, {
        parts: overridenParts
      });
    }
    configureModifiers(concentration = "") {
      this._formula = this.constructor.getFormula(this.terms);
      this.options = {
        ...this.options,
        concentration
      };
      this._isFumble = void 0;
    }
    async configureDialog(title, concentrationFumble, concentrationMp) {
      const concentration = concentrationFumble || concentrationMp;
      const dualConcentration = concentrationFumble && concentrationMp;
      const content = await renderTemplate(this.template, {
        formula: `${this.formula} + @bonus`,
        concentration,
        concentrationFumble,
        concentrationMp,
        dualConcentration
      });
      return new Promise((resolve) => {
        new Dialog({
          title,
          content,
          buttons: {
            roll: {
              label: game.i18n.localize("ryuutama.roll"),
              callback: (html) => resolve(this.onRollSubmit(html))
            }
          },
          default: "roll",
          close: () => resolve(null)
        }).render(true);
      });
    }
    onRollSubmit(html) {
      const form = html[0].querySelector("form");
      const concentration = form.concentration?.value;
      let concentrationBonus = "";
      if (concentration === "fumble" || concentration === "mp")
        concentrationBonus = "1";
      if (concentration === "dual")
        concentrationBonus = "2";
      if (concentrationBonus !== "") {
        const bonus = new Roll(concentrationBonus, this.data);
        if (!(bonus.terms[0] instanceof OperatorTerm))
          this.terms.push(new OperatorTerm({ operator: "+" }));
        this.terms = this.terms.concat(bonus.terms);
      }
      if (!isNull(form.bonus.value)) {
        const bonus = new Roll(form.bonus.value, this.data);
        if (!(bonus.terms[0] instanceof OperatorTerm))
          this.terms.push(new OperatorTerm({ operator: "+" }));
        this.terms = this.terms.concat(bonus.terms);
      }
      this.configureModifiers(concentration);
      return this;
    }
  };

  // modules/services/LevelManager.mjs
  var LevelManager = class _LevelManager {
    static get levelMax() {
      return ryuutama.levels[ryuutama.levels.length - 1].level;
    }
    /**
     *
     * @param {RyuutamaActor} actor
     * @param {number} xpBonus
     * @returns {Promise<{level: number, xp: number}>}
     */
    static async checkLevel(actor, xpBonus) {
      const newXp = Math.max(actor.xp + xpBonus, 0);
      const newLevel = _LevelManager.getLevel(newXp);
      if (newLevel > actor.level) {
        await _LevelManager.levelUp(actor.level, newLevel);
      } else if (newLevel < actor.level) {
        await _LevelManager.levelDown(actor.level, newLevel);
      }
      actor.update({
        "system.xp": newXp,
        "system.level": newLevel
      });
      return { level: newLevel, xp: newXp };
    }
    /**
     *
     * @param {number} xp
     * @returns {number}
     */
    static getLevel(xp) {
      const levels = ryuutama.levels;
      for (const level of levels) {
        if (xp <= level.untilXp)
          return level.level;
      }
      return _LevelManager.levelMax;
    }
    /**
     *
     * @param {RyuutamaActor} actor
     * @returns
     */
    static async levelUp(initialLevel, targetLevel) {
      let level = initialLevel;
      while (level < targetLevel) {
        const title = `level up ${level} -> ${level + 1}`;
        const content = ryuutama.levels[level].bonuses.map(
          (bonus) => `<p>${bonus}</p>`
        );
        await new Promise((resolve) => {
          new Dialog({
            title,
            content,
            buttons: {
              accept: {
                label: game.i18n.localize("ryuutama.accept"),
                callback: (html) => resolve("youyou")
              }
            },
            default: "accept",
            close: () => resolve(null)
          }).render(true);
        });
        level++;
      }
    }
    /**
     *
     * @param {RyuutamaActor} actor
     * @returns
     */
    static async levelDown(initialLevel, targetLevel) {
      let level = initialLevel;
      while (level > targetLevel) {
        const title = `level down ${level} -> ${level - 1}`;
        const content = ryuutama.levels[level - 1].bonuses.map(
          (bonus) => `<p>${bonus}</p>`
        );
        await new Promise((resolve) => {
          new Dialog({
            title,
            content,
            buttons: {
              accept: {
                label: game.i18n.localize("ryuutama.accept"),
                callback: (html) => resolve("youyou")
              }
            },
            default: "accept",
            close: () => resolve(null)
          }).render(true);
        });
        level--;
      }
    }
  };

  // modules/documents/RyuutamaActor.mjs
  var RyuutamaActor = class extends Actor {
    /** @override */
    prepareData() {
      super.prepareData();
    }
    prepareDerivedData() {
      super.prepareDerivedData();
    }
    prepareEmbeddedDocuments() {
      super.prepareEmbeddedDocuments();
    }
    /*****************************
     * GETTER
     *****************************/
    get stats() {
      const system = this.system;
      const stats = {};
      Object.entries(system.stats).forEach(([key, data]) => {
        const statusEffects = ryuutama.stats[key].statuses;
        const statusEffectsModifier = statusEffects.reduce(
          (accumulator, statusEffect) => {
            return accumulator + system.statuses[statusEffect];
          },
          0
        );
        const modifier = data.mod + data.condition - statusEffectsModifier;
        stats[key] = {
          die: data.die,
          actual: this.modifyDice(data.die, modifier)
        };
      });
      return stats;
    }
    get xp() {
      return this.system.xp;
    }
    get mp() {
      return this.system.mp.current;
    }
    get level() {
      return this.system.level;
    }
    /*****************************
     * ACTIONS
     *****************************/
    selectStat(stat) {
      let selectedStat = this.system.selectedStat;
      if (selectedStat.includes(stat)) {
        selectedStat = selectedStat.filter((s) => s !== stat);
      } else {
        if (selectedStat.length >= 2) {
          selectedStat.shift();
        }
        selectedStat.push(stat);
      }
      this.update({ "system.selectedStat": selectedStat });
    }
    async rollCondition() {
      const roll = await this.roll(
        "str",
        "spi",
        "Condition for the day",
        false,
        false
      );
      const title = "Choose caracter loss for the day";
      const content = await renderTemplate(
        `systems/ryuutama/templates/dialog/condition-fumble.hbs`,
        {
          stats: this.stats
        }
      );
      Array.from(Object.keys(this.stats)).forEach((stat) => {
        const key = `system.stats.${stat}.mod`;
        this.update({ [key]: 0 });
      });
      if (roll.isFumble) {
        await new Promise((resolve) => {
          new Dialog({
            title,
            content,
            buttons: {
              accept: {
                label: game.i18n.localize("ryuutama.accept")
              }
            },
            default: "accept",
            close: (html) => resolve(this.onConditionMalusChoosen(html))
          }).render(true);
        });
      }
      this.update({ "system.condition": roll.total });
    }
    onConditionMalusChoosen(html) {
      const form = html[0].querySelector("form");
      const selectedStat = form.stat.value;
      if (selectedStat === "") {
        const array = Array.from(Object.keys(this.stats));
        const randomElement = array[Math.floor(Math.random() * array.length)];
        const key = `system.stats.${randomElement}.mod`;
        this.update({ [key]: this.system.stats[randomElement].mod - 1 });
      } else {
        const key = `system.stats.${selectedStat}.mod`;
        this.update({ [key]: this.system.stats[selectedStat].mod - 1 });
      }
    }
    async rollAction() {
      const selectedStat = this.system.selectedStat;
      if (selectedStat.length <= 0)
        return;
      const statA = selectedStat[0];
      const statB = selectedStat[1];
      return await this.roll(
        statA ?? statB,
        statB ?? statA,
        `roll for ${selectedStat}`
      );
    }
    /**
     * @param {string} statA
     * @param {string | undefined} statB
     * @param {string} title
     */
    async roll(statA, statB, title, fumblullable = true, concentrable = true) {
      if (isNull(statA) && isNull(statB))
        return;
      const stats = this.stats;
      let rolls = [];
      [statA, statB].forEach((stat) => {
        const die = isNull(stat) ? void 0 : stats[stat]?.actual;
        if (die !== void 0)
          rolls.push(`1d${die}`);
      });
      if (rolls.length === 0)
        return;
      const roll = new ActionRoll(rolls.join(" + "));
      const { fumble, mp } = this.system;
      const concentrationFumble = concentrable && fumble > 0;
      const concentrationMp = concentrable && mp.current > 0;
      const configured = await roll.configureDialog(
        title,
        concentrationFumble,
        concentrationMp
      );
      if (configured === null)
        return null;
      await configured.evaluate({ async: true });
      if (configured.concentration === "fumble") {
        this.incrementFumble(-1);
      } else if (configured.concentration === "mp") {
        this.useHalfMp();
      } else if (configured.concentration === "dual") {
        this.incrementFumble(-1);
        this.useHalfMp();
      }
      await configured.toMessage({ flavor: title });
      if (configured.isCritical) {
        const html = await renderTemplate(
          "systems/ryuutama/templates/chat/critical-success.hbs"
        );
        const chatData = {
          user: game.user.id,
          content: html
        };
        await ChatMessage.create(chatData);
      } else if (fumblullable && configured.isFumble) {
        Hooks.callAll("onFumble");
      }
      return configured;
    }
    /*****************************
     * SETUP
     *****************************/
    static async onFumble() {
      game.actors.forEach((actor) => {
        actor.incrementFumble(1);
      });
    }
    /*****************************
     * HELPERS
     *****************************/
    /**
     * Update the fumble value of a user by the increment value
     * It can be a positive or negative value
     * @param {number} increment
     */
    incrementFumble(increment) {
      const fumble = this.system.fumble;
      this.update({ "system.fumble": fumble + increment });
    }
    /**
     * Update the current Mp value of a user by the increment value
     * It can be a positive or negative value
     * @param {number} increment
     */
    incrementMp(increment) {
      const mp = Math.max(this.mp + increment, 0);
      this.update({ "system.mp.current": mp });
    }
    /**
     * Update the xp value of a user by the increment value
     * It can be a positive or negative value
     * @param {number} increment
     */
    async incrementXP(increment) {
      await LevelManager.checkLevel(this, increment);
    }
    /**
     * Use half of the remaining Mp of the actor rounded up
     */
    useHalfMp() {
      const halfMp = Math.round(this.system.mp.current / 2);
      this.incrementMp(-halfMp);
    }
    modifyDice(die, modifier) {
      if (modifier === 0)
        return die;
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
  };

  // modules/services/Items/DisplayManager/displayItem.mjs
  var displayItem = async (item) => {
    return await displayInChat(item);
  };
  var displayInChat = async (item, setup = {}) => {
    const token = item.actor.token;
    const templateData = {
      actor: item.actor,
      item,
      tokenId: token?.uuid || null,
      system: item.system,
      setup
    };
    const html = await renderTemplate(
      "systems/ryuutama/templates/chat/item-card.hbs",
      templateData
    );
    const chatData = {
      user: game.user.id,
      type: CONST.CHAT_MESSAGE_TYPES.OTHER,
      content: html,
      flavor: item.system.flavor,
      speaker: ChatMessage.getSpeaker({ actor: item.actor, token }),
      flags: { "core.canPopout": true }
    };
    ChatMessage.applyRollMode(chatData, game.settings.get("core", "rollMode"));
    const card = await ChatMessage.create(chatData);
    return card;
  };

  // modules/services/Items/DisplayManager/displaySkill.mjs
  var displaySkill = async (item) => {
    return await displayInChat2(item);
  };
  var displayInChat2 = async (item, setup = {}) => {
    const token = item.actor.token;
    const templateData = {
      actor: item.actor,
      item,
      tokenId: token?.uuid || null,
      system: item.system,
      setup
    };
    const html = await renderTemplate(
      "systems/ryuutama/templates/chat/skill-card.hbs",
      templateData
    );
    const chatData = {
      user: game.user.id,
      type: CONST.CHAT_MESSAGE_TYPES.OTHER,
      content: html,
      flavor: item.system.flavor,
      speaker: ChatMessage.getSpeaker({ actor: item.actor, token }),
      flags: { "core.canPopout": true }
    };
    ChatMessage.applyRollMode(chatData, game.settings.get("core", "rollMode"));
    const card = await ChatMessage.create(chatData);
    return card;
  };

  // modules/services/Items/DisplayManager/displaySpell.mjs
  var displaySpell = async (item) => {
    return await displayInChat3(item);
  };
  var displayInChat3 = async (item, setup = {}) => {
    const token = item.actor.token;
    const templateData = {
      actor: item.actor,
      canCast: item.actor.mp >= item.system.manaCost,
      item,
      tokenId: token?.uuid || null,
      system: item.system,
      setup
    };
    const html = await renderTemplate(
      "systems/ryuutama/templates/chat/spell-card.hbs",
      templateData
    );
    const chatData = {
      user: game.user.id,
      type: CONST.CHAT_MESSAGE_TYPES.OTHER,
      content: html,
      flavor: "spell",
      speaker: ChatMessage.getSpeaker({ actor: item.actor, token }),
      flags: { "core.canPopout": true }
    };
    ChatMessage.applyRollMode(chatData, game.settings.get("core", "rollMode"));
    const card = await ChatMessage.create(chatData);
    return card;
  };

  // modules/services/Items/DisplayManager/index.mjs
  var DisplayManager = class _DisplayManager {
    /**
     * Class in charge of item usage from actor
     * to choose how to display in chat
     * @param {RyuutamaItem} item
     */
    constructor(item) {
      this._item = item;
      this._displayItem = _DisplayManager.getDisplayFunction(item.type);
    }
    get item() {
      return this._item;
    }
    async display() {
      return await this._displayItem(this._item);
    }
    /**
     * Get the item use function depending on the type of the item
     * @param {string} type
     */
    static getDisplayFunction(type) {
      switch (type) {
        case "skill":
          return displaySkill;
        case "spell":
          return displaySpell;
        case "item":
          return displayItem;
        default:
          return () => {
            throw new Error(`No use function for this type: ${type}`);
          };
      }
    }
  };

  // modules/documents/RyuutamaItem.mjs
  var RyuutamaItem = class extends Item {
    constructor(...args) {
      super(...args);
      this.itemDisplayManager = new DisplayManager(this);
    }
    equip(enabled) {
      const owner = this.actor;
      if (owner === null)
        return;
      this.update({ "system.active": enabled });
    }
    async use() {
      this.itemDisplayManager.display();
    }
    /*****************************
     * GETTER
     *****************************/
    get rolls() {
      if (this.type !== "skill") {
        throw new Error(`can't access rolls on ${this.type} type of item`);
      }
      return this.system.rolls;
    }
    get abilities() {
      if (this.type !== "characterType") {
        throw new Error(`can't access abilities on ${this.type} type of item`);
      }
      return this.system.abilities;
    }
    /*****************************
     * TYPE SPECIFIC ACTIONS
     *****************************/
    /** SKILL */
    addRollToSkill() {
      const rolls = this.rolls;
      rolls.push({ statA: "none", statB: "none" });
      this.update({ "system.rolls": rolls });
    }
    deleteRollFromSkill(idx) {
      const rolls = this.rolls;
      rolls.splice(idx, 1);
      this.update({ "system.rolls": rolls });
    }
    /**
     *
     * @param {string} field
     * @param {number} idx
     * @param {string} statValue
     * @returns
     */
    updateRollOfSkill(field, idx, statValue) {
      const rolls = this.rolls;
      const roll = rolls[idx];
      if (roll === void 0)
        return;
      roll[field] = statValue;
      this.update({ "system.rolls": rolls });
    }
    /** CHARACTERTYPE */
    addAbilityToCharacterType() {
      const abilities = this.abilities;
      abilities.push({ name: "", effect: "" });
      this.update({ "system.abilities": abilities });
    }
    deleteAbilityFromCharacterType(idx) {
      const abilities = this.abilities;
      abilities.splice(idx, 1);
      this.update({ "system.abilities": abilities });
    }
    /**
     *
     * @param {string} field
     * @param {number} idx
     * @param {string} statValue
     * @returns
     */
    updateAbilityOfCharacterType(field, idx, value) {
      const abilities = this.abilities;
      const ability = abilities[idx];
      if (ability === void 0)
        return;
      ability[field] = value;
      this.update({ "system.abilities": abilities });
      console.log(this.abilities);
    }
  };

  // modules/services/Items/Listeners/SkillListener.mjs
  var SkillListener = class {
    /**
     *
     * @param {RyuutamaItem} item
     * @param {Record<string, any>} dataset
     */
    static async use(item, dataset) {
      const action = dataset.action;
      switch (action) {
        case "roll":
          const { idx } = dataset;
          return await this.roll(item, idx);
        default:
          break;
      }
    }
    /**
     *
     * @param {RyuutamaItem} item
     * @param {number | undefined} idx
     * @returns
     */
    static async roll(item, idx) {
      const roll = item.rolls[idx];
      if (roll === void 0)
        return;
      const { statA, statB } = roll;
      return await item.actor.roll(statA, statB, item.name);
    }
  };

  // modules/services/Items/Listeners/SpellListener.mjs
  var SpellListener = class {
    /**
     *
     * @param {RyuutamaItem} item
     * @param {Record<string, any>} dataset
     */
    static async use(item, dataset) {
      const action = dataset.action;
      switch (action) {
        case "cast":
          return await this.cast(item);
        default:
          break;
      }
    }
    static async cast(item) {
      const cost = item.system.manaCost;
      const currentMp = item.actor.mp;
      if (cost > currentMp) {
        console.log("not enough mana");
      } else {
        item.actor.incrementMp(-cost);
      }
    }
  };

  // modules/services/Items/Listeners/index.mjs
  var activateItemsListeners = async (html) => {
    html.on("click", ".card-buttons button", (event) => onChatCardAction(event));
  };
  var onChatCardAction = async (event) => {
    const button = event.currentTarget;
    button.disabled = true;
    await getAction(button);
    button.disabled = false;
  };
  var getAction = async (button) => {
    const card = button.closest(".chat-card");
    const actor = await getActorFromChatCard(card);
    if (!actor)
      return;
    if (!(game.user.isGM || actor.isOwner))
      return;
    const item = getItemFromChatCard(actor, card);
    if (!item)
      return;
    const dataset = button?.dataset;
    if (dataset === void 0)
      return;
    const type = item.type;
    switch (type) {
      case "skill":
        return await SkillListener.use(item, dataset);
      case "spell":
        return await SpellListener.use(item, dataset);
      default:
        return;
    }
  };
  var getActorFromChatCard = async (card) => {
    let actor;
    if (card.dataset.tokenId) {
      const token = await fromUuid(card.dataset.tokenId);
      if (!token)
        return null;
      actor = token.actor;
    } else {
      const actorId = card.dataset.actorId;
      actor = game.actors.get(actorId) || null;
    }
    return actor;
  };
  var getItemFromChatCard = (actor, card) => {
    return actor.items.get(card.dataset.itemId);
  };

  // modules/combat/RyuutamaCombat.mjs
  var RyuutamaCombat = class extends Combat {
    /**
     * @override
     */
    _sortCombatants(a, b) {
      const initA = Number.isNumeric(a.initiative) ? a.initiative : -Infinity;
      const initB = Number.isNumeric(b.initiative) ? b.initiative : -Infinity;
      let initDifference = initB - initA;
      if (initDifference !== 0)
        return initDifference;
      const typeA = a.actor.data.type;
      const typeB = b.actor.data.type;
      if (typeA === typeB)
        return a.tokenId - b.tokenId;
      if (typeA === "character")
        return -1;
      if (typeB === "character")
        return 1;
    }
    _onCreate(data, options, userId) {
      super._onCreate(data, options, userId);
    }
  };

  // modules/combat/RyuutamaCombatantConfig.mjs
  var RyuutamaCombatantConfig = class extends CombatantConfig {
  };

  // modules/combat/RyuutamaCombatTracker.mjs
  var RyuutamaCombatTracker = class extends CombatTracker {
    _onConfigureCombatant(li) {
      const combatant = this.viewed.combatants.get(li.data("combatant-id"));
      new RyuutamaCombatantConfig(combatant, {
        top: Math.min(li[0].offsetTop, window.innerHeight - 350),
        left: window.innerWidth - 720,
        width: 400
      }).render(true);
    }
    _onCombatantControl(event) {
      super._onCombatantControl(event);
    }
    _onCombatCreate(event) {
      super._onCombatCreate(event);
    }
  };

  // modules/combat/RyuutamaCombatant.mjs
  var RyuutamaCombatant = class extends Combatant {
    _onCreate(data, options, userID) {
      super._onCreate(data, options, userID);
    }
  };

  // modules/data/items/CharacterClass.mjs
  var CharacterClass = class extends foundry.abstract.DataModel {
    static defineSchema() {
      const fields = foundry.data.fields;
      return {
        description: new fields.HTMLField(),
        skills: new fields.ArrayField(
          new fields.StringField({
            required: true
          })
        )
      };
    }
  };

  // modules/data/items/CharacterType.mjs
  var CharacterType = class extends foundry.abstract.DataModel {
    static defineSchema() {
      const fields = foundry.data.fields;
      return {
        description: new fields.HTMLField(),
        abilities: new fields.ArrayField(
          new fields.SchemaField({
            name: new fields.StringField(),
            effect: new fields.StringField()
          })
        )
      };
    }
  };

  // modules/data/items/Item.mjs
  var Item2 = class extends foundry.abstract.DataModel {
    static defineSchema() {
      const fields = foundry.data.fields;
      return {
        description: new fields.HTMLField(),
        prize: new fields.NumberField({
          required: true,
          initial: 0
        }),
        size: new fields.NumberField({
          required: true,
          initial: 0
        }),
        itemType: new fields.StringField({
          required: true,
          initial: "gear"
        }),
        active: new fields.BooleanField({
          required: true,
          initial: false
        }),
        weapon: new fields.SchemaField({
          equip: new fields.StringField({
            required: true,
            initial: ""
          }),
          accuracy: new fields.StringField({
            required: true,
            initial: ""
          }),
          damage: new fields.StringField({
            required: true,
            initial: ""
          })
        }),
        armor: new fields.SchemaField({
          equip: new fields.StringField({
            required: true,
            initial: ""
          }),
          defense: new fields.NumberField({
            required: true,
            initial: 0
          }),
          penalty: new fields.NumberField({
            required: true,
            initial: 0
          })
        }),
        shield: new fields.SchemaField({
          dodge: new fields.StringField({
            required: true,
            initial: ""
          })
        }),
        gear: new fields.SchemaField({
          type: new fields.StringField({
            required: true,
            initial: ""
          }),
          bonus: new fields.StringField({
            required: true,
            initial: ""
          })
        }),
        other: new fields.SchemaField({
          type: new fields.StringField({
            required: true,
            initial: ""
          }),
          values: new fields.ObjectField({
            required: true,
            initial: {}
          })
        })
      };
    }
  };

  // modules/data/items/Skill.mjs
  var Skill = class extends foundry.abstract.DataModel {
    static defineSchema() {
      const fields = foundry.data.fields;
      return {
        description: new fields.HTMLField(),
        skillEffect: new fields.HTMLField(),
        rolls: new fields.ArrayField(
          new fields.SchemaField({
            statA: new fields.StringField({
              initial: "none"
            }),
            statB: new fields.StringField({
              initial: "none"
            }),
            description: new fields.StringField({
              initial: game.i18n.localize("ryuutama.standard")
            })
          })
        ),
        targetNumber: new fields.StringField({
          required: true,
          initial: ""
        }),
        usableCircumstances: new fields.StringField({
          required: true,
          initial: ""
        })
      };
    }
  };

  // modules/data/items/Spell.mjs
  var Spell = class extends foundry.abstract.DataModel {
    static defineSchema() {
      const fields = foundry.data.fields;
      return {
        description: new fields.HTMLField(),
        magicType: new fields.StringField({
          required: true,
          initial: ""
        }),
        spellType: new fields.StringField({
          required: true,
          initial: ""
        }),
        manaCost: new fields.NumberField({
          required: true,
          initial: 0
        }),
        duration: new fields.NumberField({
          required: true,
          initial: 0
        }),
        durationUnit: new fields.StringField({
          required: true,
          initial: ""
        }),
        target: new fields.StringField({
          required: true,
          initial: ""
        }),
        range: new fields.StringField({
          required: true,
          initial: ""
        }),
        rolls: new fields.ArrayField(
          new fields.SchemaField({
            statA: new fields.StringField({
              initial: "none"
            }),
            statB: new fields.StringField({
              initial: "none"
            }),
            description: new fields.StringField({
              initial: game.i18n.localize("ryuutama.standard")
            })
          })
        ),
        spellLevel: new fields.StringField({
          required: true,
          initial: ""
        })
      };
    }
  };

  // modules/data/items/Xp.mjs
  var Xp = class extends foundry.abstract.DataModel {
    static defineSchema() {
      const fields = foundry.data.fields;
      return {
        amount: new fields.NumberField({
          initial: 0
        })
      };
    }
  };

  // modules/data/index.mjs
  var itemConfig = {
    characterClass: CharacterClass,
    characterType: CharacterType,
    item: Item2,
    skill: Skill,
    spell: Spell,
    xp: Xp
  };

  // modules/documents/RyuutamaActiveEffect.mjs
  var RyuutamaActiveEffect = class extends ActiveEffect {
    apply(actor, change) {
      console.log(actor, change);
      super.apply(actor, change);
    }
  };

  // modules/sheets/RyuutamaActorSheet.mjs
  var RyuutamaActorSheet = class extends ActorSheet {
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
            initial: "stats"
          }
        ]
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
      const itemMap = /* @__PURE__ */ new Map();
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
          if (xpAmount !== 0)
            await this.actor.incrementXP(xpAmount);
          break;
        case "characterClass":
          const characterClasses = this.actor.itemTypes["characterClass"];
          console.log({ characterClasses });
          if (characterClasses.length >= 1) {
            break;
          }
        case "characterType":
          const characterTypes = this.actor.itemTypes["characterType"];
          if (characterTypes.length >= 2) {
            break;
          }
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
      if (!dataStat || !dataStat.value)
        return;
      const stat = dataStat.value;
      this.actor.selectStat(stat);
    }
    async onStatRoll() {
      await this.actor.rollAction();
    }
    async onEquipItem(event) {
      const itemId = event.currentTarget.closest(".item").dataset.itemId;
      const item = this.actor.items.get(itemId);
      if (item === void 0)
        return;
      const effects = this.actor.getEmbeddedCollection("ActiveEffect");
      const effect = effects.filter(
        (effect2) => effect2.origin.endsWith(itemId)
      )[0];
      if (effect === void 0)
        return;
      const newStatus = !item.system.active;
      await effect.update({ disabled: !newStatus });
      return item.equip(newStatus);
    }
    async onItemUse(event) {
      const item = this.getItem(event);
      if (item === void 0)
        return;
      return await item.use();
    }
    onItemDelete(event) {
      const item = this.getItem(event);
      if (item === void 0)
        return;
      return item.deleteDialog();
    }
    onItemEdit(event) {
      const item = this.getItem(event);
      if (item === void 0)
        return;
      return item.sheet.render(true);
    }
    getItem(event) {
      const itemId = event.currentTarget.closest(".item").dataset.itemId;
      return this.actor.items.get(itemId);
    }
  };

  // modules/sheets/RyuutamaItemSheet.mjs
  var RyuutamaItemSheet = class extends ItemSheet {
    static get defaultOptions() {
      return mergeObject(super.defaultOptions, {
        classes: ["ryuutama", "sheet", "item"],
        width: 600,
        height: 400,
        dragDrop: [{ dragSelector: null, dropSelector: null }]
      });
    }
    /*****************************
     * DATA
     *****************************/
    getData() {
      const context = super.getData();
      const itemData = context.item;
      context.config = ryuutama;
      context.system = itemData.system;
      context.flags = itemData.flags;
      console.log(context);
      return foundry.utils.mergeObject(context, {
        labels: this.getLabels(itemData),
        effects: context.item.getEmbeddedCollection("ActiveEffect")
      });
    }
    getLabels(itemData) {
      switch (this.item.type) {
        case "spell":
          return {
            disableDurationField: this.isDurationFieldDisabled(
              itemData.system.durationUnit
            )
          };
        default:
          return {};
      }
    }
    isDurationFieldDisabled(durationUnit) {
      if (!durationUnit) {
        return !ryuutama.durationUnits["none"].hasNumericValue;
      }
      return !ryuutama.durationUnits[durationUnit].hasNumericValue;
    }
    /*****************************
     * GETTER
     *****************************/
    get template() {
      return `systems/ryuutama/templates/item/${this.item.type}-sheet.hbs`;
    }
    get type() {
      return this.item.type;
    }
    /*****************************
     * SETUP
     *****************************/
    activateListeners(html) {
      super.activateListeners(html);
      if (!this.isEditable)
        return;
      switch (this.type) {
        case "skill":
          html.find(".roll-add").click(this.onRollAdd.bind(this));
          html.find(".roll").change(this.onRollUpdateRoll.bind(this));
          html.find(".roll-delete").click(this.onRollDelete.bind(this));
          break;
        case "characterType":
          html.find(".ability-add").click(this.onCharacterTypeAdd.bind(this));
          html.find(".ability").change(this.onCharacterTypeUpdateAbility.bind(this));
          html.find(".ability-delete").click(this.onCharacterTypeDelete.bind(this));
        default:
          html.find(".effect-control").click(this.onEffectControl.bind(this));
          html.find(".test").change(this.onTestChange.bind(this));
          break;
      }
    }
    /*****************************
     * ACTIONS
     *****************************/
    /** @inheritdoc */
    async _onDrop(event) {
      const data = TextEditor.getDragEventData(event);
      const actor = this.item.type;
      if (actor === "characterClass")
        return this._onDropOnCharacterClass(data);
      return;
    }
    async _onDropOnCharacterClass(data) {
      if (!this.item.isOwner)
        return;
      const item = await Item.implementation.fromDropData(data);
      if (item.type !== "skill")
        return;
      const itemData = item.toObject();
      console.log(this.item);
      return this.item.createEmbeddedDocuments("Item", [itemData]);
    }
    onEffectControl(event) {
      const owner = this.item;
      const a = event.currentTarget;
      const li = a.closest("li");
      const effect = li?.dataset.effectId ? owner.effects.get(li.dataset.effectId) : null;
      switch (a.dataset.action) {
        case "create":
          if (this.item.isEmbedded) {
            return ui.notifications.error(
              "Managing embedded Documents which are not direct descendants of a primary Document is un-supported at this time."
            );
          }
          const a2 = owner.createEmbeddedDocuments("ActiveEffect", [
            {
              label: "New Effect",
              icon: "icons/svg/aura.svg",
              origin: owner.uuid,
              disabled: true
            }
          ]);
          a2.then((effect2) => {
            console.log(effect2);
          });
          return a2;
        case "edit":
          return effect.sheet.render(true);
        case "delete":
          return effect.delete();
      }
    }
    onTestChange(event) {
      console.log(event);
    }
    /*****************************
     * TYPE SPECIFIC ACTIONS
     *****************************/
    /** SKILL */
    onRollAdd(event) {
      this.item.addRollToSkill();
    }
    onRollDelete(event) {
      event.preventDefault();
      const target = event.currentTarget;
      const idx = target.closest("li")?.dataset.idx;
      if (idx === void 0)
        return;
      this.item.deleteRollFromSkill(idx);
    }
    onRollUpdateRoll(event) {
      event.preventDefault();
      const target = event.currentTarget;
      const idx = target.closest("li")?.dataset.idx;
      if (idx === void 0)
        return;
      const field = target.dataset.field;
      this.item.updateRollOfSkill(field, idx, target.value);
    }
    /** CHARACTERTYPE */
    onCharacterTypeAdd(event) {
      this.item.addAbilityToCharacterType();
    }
    onCharacterTypeDelete(event) {
      event.preventDefault();
      const target = event.currentTarget;
      const idx = target.closest("li")?.dataset.idx;
      if (idx === void 0)
        return;
      this.item.deleteAbilityFromCharacterType(idx);
    }
    onCharacterTypeUpdateAbility(event) {
      event.preventDefault();
      const target = event.currentTarget;
      const idx = target.closest("li")?.dataset.idx;
      if (idx === void 0)
        return;
      const field = target.dataset.field;
      this.item.updateAbilityOfCharacterType(field, idx, target.value);
    }
  };

  // modules/setup/configureGame.mjs
  var configureActor = (config, actors) => {
    config.Actor.documentClass = RyuutamaActor;
    config.Actor.dataModels = {};
    actors.unregisterSheet("core", ActorSheet);
    actors.registerSheet("character", RyuutamaActorSheet, { makeDefault: true });
  };
  var configureItem = (config, items) => {
    config.Item.documentClass = RyuutamaItem;
    config.Item.dataModels = itemConfig;
    items.unregisterSheet("core", ItemSheet);
    items.registerSheet("item", RyuutamaItemSheet, { makeDefault: true });
  };
  var configureCombat = (config) => {
    config.Combat.documentClass = RyuutamaCombat;
    config.ui.combat = RyuutamaCombatTracker;
    config.Combatant.documentClass = RyuutamaCombatant;
    config.Combatant.sheetClass = RyuutamaCombatantConfig;
    config.Combat.initiative.formula = "1d@stats.dex.die + 1d@stats.int.die";
  };
  var configureActiveEffect = (config) => {
    config.ActiveEffect.documentClass = RyuutamaActiveEffect;
  };
  var configureDiceAndRoll = (config) => {
    config.Dice.ActionRoll = ActionRoll;
    config.Dice.rolls.push(ActionRoll);
  };
  var configureGame = (config, actors, items) => {
    configureActor(config, actors);
    configureItem(config, items);
    configureCombat(config);
    configureActiveEffect(config);
    configureDiceAndRoll(config);
  };

  // modules/index.mjs
  Hooks.once("init", () => {
    if (game.release.generation < 11) {
      throw new Error("The system does not support version previous to 11");
    }
    console.log("ryuutama | Starting Ryuutama System");
    console.log({ CONFIG, Actors, Items });
    configureGame(CONFIG, Actors, Items);
    preloadHandlerbarsTemplates();
    registerHandleBarsHelpers();
  });
  Hooks.on("renderChatLog", (app, html, data) => activateItemsListeners(html));
  Hooks.on("renderChatPopout", (app, html, data) => activateItemsListeners(html));
  Hooks.on("onFumble", (app, html, data) => {
    RyuutamaActor.onFumble();
  });
})();
