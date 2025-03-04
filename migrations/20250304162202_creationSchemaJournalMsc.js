exports.up = knex => {
    return knex.schema.raw('CREATE SCHEMA journal_msc')
};

exports.down = knex => {
    return knex.schema.dropSchema('journal_msc', true)
};
