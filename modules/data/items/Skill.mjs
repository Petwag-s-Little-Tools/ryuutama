export class Skill extends foundry.abstract.DataModel {
  static defineSchema() {
    const fields = foundry.data.fields;

    return {
      description: new fields.HTMLField(),
      skillEffect: new fields.HTMLField(),
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
      statUsed: new fields.SchemaField({
        statA: new fields.StringField({
          required: true,
          initial: "none",
        }),
        statB: new fields.StringField({
          required: true,
          initial: "none",
        }),
        alternative: new fields.StringField({
          required: true,
          initial: "none",
        }),
      }),
      targetNumber: new fields.StringField({
        required: true,
        initial: "",
      }),
      usableCircumstances: new fields.StringField({
        required: true,
        initial: "",
      }),
    };
  }
}
