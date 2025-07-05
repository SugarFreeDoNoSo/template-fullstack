import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateServicesTable20250702 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'services',
        columns: [
          { name: 'id', type: 'serial', isPrimary: true },
          { name: 'customer_name', type: 'varchar', length: '255' },
          { name: 'service_type', type: 'varchar', length: '255' },
          { name: 'scheduled_at', type: 'timestamp' },
          { name: 'price', type: 'decimal', precision: 10, scale: 2 },
          {
            name: 'status',
            type: 'varchar',
            length: '255',
            default: "'pending'",
          },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('services');
  }
}
