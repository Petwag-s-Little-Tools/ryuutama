export class RyuutamaItemSheet extends ItemSheet {
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ["ryuutama", "sheet", "item"],
      width: 600,
      height: 400,
    });
  }

  get template() {
    return `systems/ryuutama/templates/item/${this.item.type}-sheet.hbs`;
  }

  getData() {
    const context = super.getData();

    const itemData = context.item;

    context.config = CONFIG.ryuutama;
    context.system = itemData.system;

    // TODO: check what are the flags
    context.flags = itemData.flags;

    return foundry.utils.mergeObject(context, {
      labels: this._getLabels(itemData),
    });
  }

  _getLabels(itemData) {
    switch (this.item.type) {
      case "spell":
        return {
          disableDurationField: this._disableDurationField(
            itemData.system.durationUnit
          ),
        };
      default:
        return {};
    }
  }

  _disableDurationField(durationUnit) {
    if (!durationUnit) {
      return !CONFIG.ryuutama.durationUnits["none"].hasNumericValue;
    }

    return !CONFIG.ryuutama.durationUnits[durationUnit].hasNumericValue;
  }
}
