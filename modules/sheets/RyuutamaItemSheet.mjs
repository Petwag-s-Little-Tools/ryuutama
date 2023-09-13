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
      labels: this.getLabels(itemData),
      effects: context.item.getEmbeddedCollection("ActiveEffect"),
    });
  }

  activateListeners(html) {
    super.activateListeners(html);
    if (this.isEditable) {
      html.find(".effect-control").click(this.onEffectControl.bind(this));
    }
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
      return !CONFIG.ryuutama.durationUnits["none"].hasNumericValue;
    }

    return !CONFIG.ryuutama.durationUnits[durationUnit].hasNumericValue;
  }

  onEffectControl(event) {
    event.preventDefault();
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
        return owner.createEmbeddedDocuments("ActiveEffect", [
          {
            label: "New Effect",
            icon: "icons/svg/aura.svg",
            origin: owner.uuid,
            disabled: true,
          },
        ]);
      case "edit":
        return effect.sheet.render(true);
      case "delete":
        return effect.delete();
    }
  }
}
