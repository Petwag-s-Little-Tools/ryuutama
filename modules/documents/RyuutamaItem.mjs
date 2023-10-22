export class RyuutamaItem extends Item {
  equip(enabled) {
    const owner = this.owner;

    if (owner === null) return;

    this.update({ "system.active": enabled });
  }

  use() {
    switch (this.type) {
      case "skill":
        return this.useSkill();
      default:
        throw new Error(`No use function for this type: ${this.type}`);
    }
  }

  async useSkill() {
    const { statA, statB } = this.system.statUsed;

    if (statA === undefined || statA === "") return;

    return await this.actor.roll(statA, statB, this.name);
  }
}
