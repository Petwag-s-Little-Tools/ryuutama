export class RyuutamaItem extends Item {
  equip(enabled) {
    const owner = this.owner;

    if (owner === null) return;

    this.update({ "system.active": enabled });
  }
}
