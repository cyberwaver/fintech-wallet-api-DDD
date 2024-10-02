import { Migrator } from '@mikro-orm/migrations';
import { defineConfig } from '@mikro-orm/postgresql';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import { SeedManager } from '@mikro-orm/seeder';

export default defineConfig({
  dbName: process.env.MIKRO_ORM_ACCESS_DB,
  user: process.env.MIKRO_ORM_ACCESS_DB_USER,
  password: process.env.MIKRO_ORM_ACCESS_DB_PASSWORD,
  entities: ['./dist/modules/access/infrastructure/persistence/mikro-orm/entities/*.js'],
  entitiesTs: ['./src/modules/access/infrastructure/persistence/mikro-orm/entities/*.ts'],
  metadataProvider: TsMorphMetadataProvider,
  debug: true,
  extensions: [SeedManager, Migrator],
  migrations: {
    tableName: 'mikro_orm_migrations',
    path: './src/modules/access/infrastructure/persistence/mikro-orm/migrations',
    glob: '!(*.d).{js,ts}',
    // transactional: true,
    // disableForeignKeys: true,
    // allOrNothing: true,
    // emit: 'ts',
  },
});
