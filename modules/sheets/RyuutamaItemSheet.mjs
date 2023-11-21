import { ryuutama } from "../config.mjs";

export class RyuutamaItemSheet extends ItemSheet {
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ["ryuutama", "sheet", "item"],
      width: 600,
      height: 400,
      dragDrop: [{ dragSelector: null, dropSelector: null }],
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

    return foundry.utils.mergeObject(context, {
      labels: this.getLabels(itemData),
      effects: context.item.getEmbeddedCollection("ActiveEffect"),
    });
  }

  getLabels(itemData) {
    switch (this.item.type) {
      case "spell":
        return {
          disableDurationField: this.isDurationFieldDisabled(
            itemData.system.durationUnit
          ),
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
    if (!this.isEditable) return;

    switch (this.type) {
      case "skill":
        html.find(".roll-add").click(this.onRollAdd.bind(this));
        html.find(".roll").change(this.onRollUpdateRoll.bind(this));
        html.find(".roll-delete").click(this.onRollDelete.bind(this));
        break;
      case "characterType":
        html.find(".ability-add").click(this.onCharacterTypeAdd.bind(this));
        html
          .find(".ability")
          .change(this.onCharacterTypeUpdateAbility.bind(this));
        html
          .find(".ability-delete")
          .click(this.onCharacterTypeDelete.bind(this));
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

    if (actor === "characterClass") return this._onDropOnCharacterClass(data);

    return;
  }

  async _onDropOnCharacterClass(data) {
    if (!this.item.isOwner) return;

    const item = await Item.implementation.fromDropData(data);

    if (item.type !== "skill") return;

    const itemData = item.toObject();
  }

  onEffectControl(event) {
    const owner = this.item;
    const a = event.currentTarget;
    const li = a.closest("li");
    const effect = li?.dataset.effectId
      ? owner.effects.get(li.dataset.effectId)
      : null;
    switch (a.dataset.action) {
      case "create":
        if (this.item.isEmbedded) {
          return ui.notifications.error(
            "Managing embedded Documents which are not direct descendants of a primary Document is un-supported at this time."
          );
        }
        const a = owner.createEmbeddedDocuments("ActiveEffect", [
          {
            label: "New Effect",
            icon: "icons/svg/aura.svg",
            origin: owner.uuid,
            disabled: true,
          },
        ]);
        a.then((effect) => {
          console.log(effect);
        });
        return a;
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
    if (idx === undefined) return;

    this.item.deleteRollFromSkill(idx);
  }

  onRollUpdateRoll(event) {
    event.preventDefault();
    const target = event.currentTarget;

    const idx = target.closest("li")?.dataset.idx;
    if (idx === undefined) return;

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
    if (idx === undefined) return;

    this.item.deleteAbilityFromCharacterType(idx);
  }

  onCharacterTypeUpdateAbility(event) {
    event.preventDefault();
    const target = event.currentTarget;

    const idx = target.closest("li")?.dataset.idx;
    if (idx === undefined) return;

    const field = target.dataset.field;

    this.item.updateAbilityOfCharacterType(field, idx, target.value);
  }
}
