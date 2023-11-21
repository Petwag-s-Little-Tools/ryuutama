export class CharacterType extends foundry.abstract.DataModel {
  static defineSchema() {
    const fields = foundry.data.fields;

    return {
      description: new fields.HTMLField(),
      abilities: new fields.ArrayField(
        new fields.SchemaField({
          name: new fields.StringField(),
          effect: new fields.StringField(),
        })
      ),
    };
  }
}
