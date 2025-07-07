import { AppDataSource } from '../api/src/database/data-source';

async function run() {
  try {
    await AppDataSource.initialize();
    await AppDataSource.runMigrations();
    console.log('Migrations executed successfully');
  } catch (err) {
    console.error('Error running migrations', err);
    process.exit(1);
  } finally {
    await AppDataSource.destroy();
  }
}

run();
