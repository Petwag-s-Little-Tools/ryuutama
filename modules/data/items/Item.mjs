export class Item extends foundry.abstract.DataModel {
  static defineSchema() {
    const fields = foundry.data.fields;

    return {
      description: new fields.HTMLField(),
      prize: new fields.NumberField({
        required: true,
        initial: 0,
      }),
      size: new fields.NumberField({
        required: true,
        initial: 0,
      }),
      itemType: new fields.StringField({
        required: true,
        initial: "gear",
      }),
      active: new fields.BooleanField({
        required: true,
        initial: false,
      }),
      weapon: new fields.SchemaField({
        equip: new fields.StringField({
          required: true,
          initial: "",
        }),
        accuracy: new fields.StringField({
          required: true,
          initial: "",
        }),
        damage: new fields.StringField({
          required: true,
          initial: "",
        }),
      }),
      armor: new fields.SchemaField({
        equip: new fields.StringField({
          required: true,
          initial: "",
        }),
        defense: new fields.NumberField({
          required: true,
          initial: 0,
        }),
        penalty: new fields.NumberField({
          required: true,
          initial: 0,
        }),
      }),
      shield: new fields.SchemaField({
        dodge: new fields.StringField({
          required: true,
          initial: "",
        }),
      }),
      gear: new fields.SchemaField({
        type: new fields.StringField({
          required: true,
          initial: "",
        }),
        bonus: new fields.StringField({
          required: true,
          initial: "",
        }),
      }),
      other: new fields.SchemaField({
        type: new fields.StringField({
          required: true,
          initial: "",
        }),
        values: new fields.ObjectField({
          required: true,
          initial: {},
        }),
      }),
    };
  }
}
