export class RyuutamaItemSheet extends ItemSheet {
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

    return context;
  }
}
