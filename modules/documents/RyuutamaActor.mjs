export class RyuutamaActor extends Actor {
  /** @override */
  prepareData() {
    console.log("ryuutama | RyuutamaActor.prepareData()");
    super.prepareData();
  }

  prepareDerivedData() {
    const actorData = this;
    console.log("ryuutama |", actorData);
    const systemData = actorData.system;
    const flags = actorData.flags.ryuutama || {};

    switch (actorData.type) {
      case "character":
        this._prepareCharacterData(actorData);
        break;
      default:
        break;
    }
  }

  _prepareCharacterData(actorData) {}
}
