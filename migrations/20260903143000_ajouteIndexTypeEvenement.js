exports.up = (knex) => {
  return knex.schema
    .withSchema("journal_msc")
    .alterTable("evenements", (table) => {
      table.index("type", "evenements_type_idx");
    });
};

exports.down = (knex) => {
  return knex.schema
    .withSchema("journal_msc")
    .alterTable("evenements", (table) => {
      table.dropIndex("type", "evenements_type_idx");
    });
};
