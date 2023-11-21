export class Spell extends foundry.abstract.DataModel {
  static defineSchema() {
    const fields = foundry.data.fields;

    return {
      description: new fields.HTMLField(),
      magicType: new fields.StringField({
        required: true,
        initial: "",
      }),
      spellType: new fields.StringField({
        required: true,
        initial: "",
      }),
      manaCost: new fields.NumberField({
        required: true,
        initial: 0,
      }),
      duration: new fields.NumberField({
        required: true,
        initial: 0,
      }),
      durationUnit: new fields.StringField({
        required: true,
        initial: "",
      }),
      target: new fields.StringField({
        required: true,
        initial: "",
      }),
      range: new fields.StringField({
        required: true,
        initial: "",
      }),
      rolls: new fields.ArrayField(
        new fields.SchemaField({
          statA: new fields.StringField({
            initial: "none",
          }),
          statB: new fields.StringField({
            initial: "none",
          }),
          description: new fields.StringField({
            initial: game.i18n.localize("ryuutama.standard"),
          }),
        })
      ),
      spellLevel: new fields.StringField({
        required: true,
        initial: "",
      }),
    };
  }
}
