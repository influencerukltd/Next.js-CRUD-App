import { execSync } from 'child_process';

console.log('Running Prisma db push to create the users table...');

try {
  // Generate Prisma client first
  execSync('npx prisma generate', { stdio: 'inherit' });
  
  // Push schema changes to the database
  execSync('npx prisma db push', { stdio: 'inherit' });
  
  console.log('Successfully created users table!');
} catch (error) {
  console.error('Error running Prisma db push:', error.message);
  process.exit(1);
}
