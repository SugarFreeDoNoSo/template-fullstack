import { AppDataSource } from '../api/src/database/data-source';
import { Service, ServiceStatus } from 'shared-types';

async function seed() {
  await AppDataSource.initialize();
  const repo = AppDataSource.getRepository(Service);

  if ((await repo.count()) === 0) {
    const demo = repo.create({
      customerName: 'Demo Customer',
      serviceType: 'Demo Service',
      scheduledAt: new Date(),
      price: 0,
      status: ServiceStatus.PENDING,
    });
    await repo.save(demo);
    console.log('Seed data inserted');
  } else {
    console.log('Database already seeded');
  }

  await AppDataSource.destroy();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
