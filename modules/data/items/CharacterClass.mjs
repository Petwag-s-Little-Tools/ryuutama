export class CharacterClass extends foundry.abstract.DataModel {
  static defineSchema() {
    const fields = foundry.data.fields;

    return {
      description: new fields.HTMLField(),
      skills: new fields.ArrayField(
        new fields.StringField({
          required: true,
        })
      ),
    };
  }
}
