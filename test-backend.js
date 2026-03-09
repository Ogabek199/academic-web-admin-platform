
import { getAllPublicProfiles, getStatistics } from './lib/backend/db/index.js';

async function test() {
  try {
    console.log('Testing profiles...');
    const profiles = getAllPublicProfiles();
    console.log('Profiles count:', profiles.length);
    
    console.log('Testing statistics...');
    const stats = getStatistics();
    console.log('Stats:', JSON.stringify(stats, null, 2));
    
    process.exit(0);
  } catch (error) {
    console.error('Test failed:', error);
    process.exit(1);
  }
}

test();
