export class RyuutamaActiveEffect extends ActiveEffect {
  apply(actor, change) {
    console.log(actor, change);
    super.apply(actor, change);
  }
}
