export class SkillField extends foundry.data.fields.ObjectField {
  /**
   * Get the BaseAdvancement definition for the specified advancement type.
   * @param {string} type                    The Advancement type.
   * @returns {typeof BaseAdvancement|null}  The BaseAdvancement class, or null.
   */
  getModelForType(type) {
    return CONFIG.DND5E.advancementTypes[type] ?? null;
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
  _cleanType(value, options) {
    if (!(typeof value === "object")) value = {};

    const cls = this.getModelForType(value.type);
    if (cls) return cls.cleanData(value, options);
    return value;
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
  initialize(value, model, options = {}) {
    const cls = this.getModelForType(value.type);
    if (cls) return new cls(value, { parent: model, ...options });
    return foundry.utils.deepClone(value);
  }
}
