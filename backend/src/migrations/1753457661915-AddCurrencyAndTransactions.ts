import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCurrencyAndTransactions1753457661915 implements MigrationInterface {
    name = 'AddCurrencyAndTransactions1753457661915'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`products_category_id_fk\` ON \`products\``);
        await queryRunner.query(`CREATE TABLE \`transaction_logs\` (\`log_id\` int NOT NULL AUTO_INCREMENT, \`user_id\` int NULL, \`action_type\` varchar(255) NOT NULL, \`table_name\` varchar(255) NOT NULL, \`record_id\` int NOT NULL, \`old_value\` text NULL, \`new_value\` text NULL, \`action_timestamp\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (\`log_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`currencies\` (\`currency_id\` int NOT NULL AUTO_INCREMENT, \`currency_code\` enum ('PHP', 'USD', 'KRW') NOT NULL, \`symbol\` enum ('₱', '$', '₩') NOT NULL, \`exchange_rate_to_usd\` decimal(10,4) NOT NULL, UNIQUE INDEX \`IDX_46b8e68b649433979094a8c50e\` (\`currency_code\`), PRIMARY KEY (\`currency_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`orders\` ADD \`currency_id\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`products\` ADD \`currency_id\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`transaction_logs\` ADD CONSTRAINT \`FK_e52f46b707af549df677670d419\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`user_id\`) ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`transaction_logs\` DROP FOREIGN KEY \`FK_e52f46b707af549df677670d419\``);
        await queryRunner.query(`ALTER TABLE \`products\` DROP COLUMN \`currency_id\``);
        await queryRunner.query(`ALTER TABLE \`orders\` DROP COLUMN \`currency_id\``);
        await queryRunner.query(`DROP INDEX \`IDX_46b8e68b649433979094a8c50e\` ON \`currencies\``);
        await queryRunner.query(`DROP TABLE \`currencies\``);
        await queryRunner.query(`DROP TABLE \`transaction_logs\``);
        await queryRunner.query(`CREATE INDEX \`products_category_id_fk\` ON \`products\` (\`category_id\`)`);
    }

}
