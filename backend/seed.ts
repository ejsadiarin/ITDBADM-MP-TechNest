import 'dotenv/config';
import dataSource from './src/config/database';
import { runSeed } from './src/database/seeds/initial.seed';

async function seed() {
  await dataSource.initialize();
  await runSeed(dataSource);
  await dataSource.destroy();
}

seed().then(() => {
  console.log('Seeding finished.');
  process.exit(0);
}).catch(error => {
  console.error('Seeding failed:', error);
  process.exit(1);
});
