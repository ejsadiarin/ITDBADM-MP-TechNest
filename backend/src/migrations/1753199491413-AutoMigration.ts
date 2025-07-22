import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoMigration1753199491413 implements MigrationInterface {
    name = 'AutoMigration1753199491413'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`products\` DROP FOREIGN KEY \`products_category_id_fk\``);
        await queryRunner.query(`ALTER TABLE \`orders\` DROP FOREIGN KEY \`orders_user_id_fk\``);
        await queryRunner.query(`ALTER TABLE \`order_items\` DROP FOREIGN KEY \`order_items_order_id_fk\``);
        await queryRunner.query(`ALTER TABLE \`order_items\` DROP FOREIGN KEY \`order_items_product_id_fk\``);
        await queryRunner.query(`ALTER TABLE \`inventory\` DROP FOREIGN KEY \`inventory_product_id_fk\``);
        await queryRunner.query(`DROP INDEX \`email\` ON \`users\``);
        await queryRunner.query(`DROP INDEX \`username\` ON \`users\``);
        await queryRunner.query(`DROP INDEX \`product_id\` ON \`inventory\``);
        await queryRunner.query(`DROP INDEX \`name\` ON \`categories\``);
        await queryRunner.query(`CREATE TABLE \`cart\` (\`cart_id\` int NOT NULL AUTO_INCREMENT, \`user_id\` int NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_f091e86a234693a49084b4c2c8\` (\`user_id\`), UNIQUE INDEX \`REL_f091e86a234693a49084b4c2c8\` (\`user_id\`), PRIMARY KEY (\`cart_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`cart_items\` (\`cart_item_id\` int NOT NULL AUTO_INCREMENT, \`cart_id\` int NOT NULL, \`product_id\` int NOT NULL, \`quantity\` int NOT NULL, \`added_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (\`cart_item_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`audit_logs\` (\`log_id\` int NOT NULL AUTO_INCREMENT, \`user_id\` int NULL, \`action_type\` varchar(255) NOT NULL, \`table_name\` varchar(255) NOT NULL, \`record_id\` int NOT NULL, \`old_value\` text NULL, \`new_value\` text NULL, \`action_timestamp\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (\`log_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD UNIQUE INDEX \`IDX_fe0bb3f6520ee0469504521e71\` (\`username\`)`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD UNIQUE INDEX \`IDX_97672ac88f789774dd47f7c8be\` (\`email\`)`);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`phone_number\``);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`phone_number\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`role\` \`role\` enum ('customer', 'admin', 'staff') NOT NULL DEFAULT 'customer'`);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`created_at\``);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`updated_at\``);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`products\` DROP COLUMN \`created_at\``);
        await queryRunner.query(`ALTER TABLE \`products\` ADD \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`products\` DROP COLUMN \`updated_at\``);
        await queryRunner.query(`ALTER TABLE \`products\` ADD \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`orders\` DROP COLUMN \`order_date\``);
        await queryRunner.query(`ALTER TABLE \`orders\` ADD \`order_date\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`inventory\` ADD UNIQUE INDEX \`IDX_732fdb1f76432d65d2c136340d\` (\`product_id\`)`);
        await queryRunner.query(`ALTER TABLE \`inventory\` DROP COLUMN \`last_updated\``);
        await queryRunner.query(`ALTER TABLE \`inventory\` ADD \`last_updated\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`categories\` ADD UNIQUE INDEX \`IDX_8b0be371d28245da6e4f4b6187\` (\`name\`)`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`REL_732fdb1f76432d65d2c136340d\` ON \`inventory\` (\`product_id\`)`);
        await queryRunner.query(`ALTER TABLE \`orders\` ADD CONSTRAINT \`FK_a922b820eeef29ac1c6800e826a\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`user_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`order_items\` ADD CONSTRAINT \`FK_145532db85752b29c57d2b7b1f1\` FOREIGN KEY (\`order_id\`) REFERENCES \`orders\`(\`order_id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`order_items\` ADD CONSTRAINT \`FK_9263386c35b6b242540f9493b00\` FOREIGN KEY (\`product_id\`) REFERENCES \`products\`(\`product_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`inventory\` ADD CONSTRAINT \`FK_732fdb1f76432d65d2c136340dc\` FOREIGN KEY (\`product_id\`) REFERENCES \`products\`(\`product_id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`cart\` ADD CONSTRAINT \`FK_f091e86a234693a49084b4c2c86\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`user_id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`cart_items\` ADD CONSTRAINT \`FK_6385a745d9e12a89b859bb25623\` FOREIGN KEY (\`cart_id\`) REFERENCES \`cart\`(\`cart_id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`cart_items\` ADD CONSTRAINT \`FK_30e89257a105eab7648a35c7fce\` FOREIGN KEY (\`product_id\`) REFERENCES \`products\`(\`product_id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`audit_logs\` ADD CONSTRAINT \`FK_bd2726fd31b35443f2245b93ba0\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`user_id\`) ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`audit_logs\` DROP FOREIGN KEY \`FK_bd2726fd31b35443f2245b93ba0\``);
        await queryRunner.query(`ALTER TABLE \`cart_items\` DROP FOREIGN KEY \`FK_30e89257a105eab7648a35c7fce\``);
        await queryRunner.query(`ALTER TABLE \`cart_items\` DROP FOREIGN KEY \`FK_6385a745d9e12a89b859bb25623\``);
        await queryRunner.query(`ALTER TABLE \`cart\` DROP FOREIGN KEY \`FK_f091e86a234693a49084b4c2c86\``);
        await queryRunner.query(`ALTER TABLE \`inventory\` DROP FOREIGN KEY \`FK_732fdb1f76432d65d2c136340dc\``);
        await queryRunner.query(`ALTER TABLE \`order_items\` DROP FOREIGN KEY \`FK_9263386c35b6b242540f9493b00\``);
        await queryRunner.query(`ALTER TABLE \`order_items\` DROP FOREIGN KEY \`FK_145532db85752b29c57d2b7b1f1\``);
        await queryRunner.query(`ALTER TABLE \`orders\` DROP FOREIGN KEY \`FK_a922b820eeef29ac1c6800e826a\``);
        await queryRunner.query(`DROP INDEX \`REL_732fdb1f76432d65d2c136340d\` ON \`inventory\``);
        await queryRunner.query(`ALTER TABLE \`categories\` DROP INDEX \`IDX_8b0be371d28245da6e4f4b6187\``);
        await queryRunner.query(`ALTER TABLE \`inventory\` DROP COLUMN \`last_updated\``);
        await queryRunner.query(`ALTER TABLE \`inventory\` ADD \`last_updated\` timestamp(0) NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE \`inventory\` DROP INDEX \`IDX_732fdb1f76432d65d2c136340d\``);
        await queryRunner.query(`ALTER TABLE \`orders\` DROP COLUMN \`order_date\``);
        await queryRunner.query(`ALTER TABLE \`orders\` ADD \`order_date\` timestamp(0) NULL DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE \`products\` DROP COLUMN \`updated_at\``);
        await queryRunner.query(`ALTER TABLE \`products\` ADD \`updated_at\` timestamp(0) NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE \`products\` DROP COLUMN \`created_at\``);
        await queryRunner.query(`ALTER TABLE \`products\` ADD \`created_at\` timestamp(0) NULL DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`updated_at\``);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`updated_at\` timestamp(0) NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`created_at\``);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`created_at\` timestamp(0) NULL DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`role\` \`role\` enum ('customer', 'admin') NOT NULL DEFAULT 'customer'`);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`phone_number\``);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`phone_number\` varchar(20) NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` DROP INDEX \`IDX_97672ac88f789774dd47f7c8be\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP INDEX \`IDX_fe0bb3f6520ee0469504521e71\``);
        await queryRunner.query(`DROP TABLE \`audit_logs\``);
        await queryRunner.query(`DROP TABLE \`cart_items\``);
        await queryRunner.query(`DROP INDEX \`REL_f091e86a234693a49084b4c2c8\` ON \`cart\``);
        await queryRunner.query(`DROP INDEX \`IDX_f091e86a234693a49084b4c2c8\` ON \`cart\``);
        await queryRunner.query(`DROP TABLE \`cart\``);
        await queryRunner.query(`CREATE UNIQUE INDEX \`name\` ON \`categories\` (\`name\`)`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`product_id\` ON \`inventory\` (\`product_id\`)`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`username\` ON \`users\` (\`username\`)`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`email\` ON \`users\` (\`email\`)`);
        await queryRunner.query(`ALTER TABLE \`inventory\` ADD CONSTRAINT \`inventory_product_id_fk\` FOREIGN KEY (\`product_id\`) REFERENCES \`products\`(\`product_id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`order_items\` ADD CONSTRAINT \`order_items_product_id_fk\` FOREIGN KEY (\`product_id\`) REFERENCES \`products\`(\`product_id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`order_items\` ADD CONSTRAINT \`order_items_order_id_fk\` FOREIGN KEY (\`order_id\`) REFERENCES \`orders\`(\`order_id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`orders\` ADD CONSTRAINT \`orders_user_id_fk\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`user_id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`products\` ADD CONSTRAINT \`products_category_id_fk\` FOREIGN KEY (\`category_id\`) REFERENCES \`categories\`(\`category_id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
