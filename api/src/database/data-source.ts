import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Service } from 'shared-types';

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [Service],
  migrations: [__dirname + '/migrations/*.ts'],
});
