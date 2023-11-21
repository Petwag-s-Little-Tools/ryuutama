export class Xp extends foundry.abstract.DataModel {
  static defineSchema() {
    const fields = foundry.data.fields;

    return {
      amount: new fields.NumberField({
        initial: 0,
      }),
    };
  }
}
