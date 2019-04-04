import * as knex from 'knex';

export class Database {

    private connection: knex;

    public constructor(path: string) {

        this.connection = knex({
            client: 'sqlite',
            useNullAsDefault: true,
            connection: {
                filename: path
            }
        });
    }

    public async getConnection(): Promise<knex> {

        if (this.connection == null)
            await this.initialise();

        return this.connection;
    }

    public async initialise(): Promise<void> {

        let conn = this.connection;

        let tablesExist = await conn.schema.hasTable('feeds')
            && await conn.schema.hasTable('posts')
            && await conn.schema.hasTable('crawler_visited_urls');

        if (!tablesExist) {
            await conn.schema.createTable('feeds', t => {
                t.increments('id');
                t.string('url');
            });

            await conn.schema.createTable('posts', t => {
                t.increments('id');
                t.integer('feed');
                t.string('metadata');
                t.string('external_url');
                t.string('internal_url');

                t.foreign('feed').references('id').inTable('feeds');
            });

            await conn.schema.createTable('crawler_visited_urls', t => {
                t.increments('id');
                t.string('url');
                t.unique(['url']);
            })
        }
    }
}