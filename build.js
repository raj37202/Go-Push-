const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('--- Build Environment Info ---');
console.log('__dirname:', __dirname);
console.log('Initial process.cwd():', JSON.stringify(process.cwd()));

// Normalize process working directory to the directory of build.js
if (__dirname) {
  try {
    process.chdir(__dirname);
    console.log('Normalized directory to __dirname. New process.cwd():', JSON.stringify(process.cwd()));
  } catch (err) {
    console.error('Failed process.chdir(__dirname):', err.message);
  }
}

const cwd = process.cwd();
console.log('fs.existsSync("./package.json"):', fs.existsSync('./package.json'));
console.log('fs.existsSync("./next.config.ts"):', fs.existsSync('./next.config.ts'));

const isRootContext = cwd === '/' || cwd === '' || !cwd || (
  fs.existsSync('/package.json') && 
  fs.existsSync('/next.config.ts') && 
  fs.existsSync('/app')
);

console.log('Resolved isRootContext:', isRootContext);

if (isRootContext) {
  console.log('Detected root directory build context. Executing Cloud Run Webpack path resolution workaround...');
  const buildDir = '/tmp/app-build';
  
  // Clean previous build dir if exists
  if (fs.existsSync(buildDir)) {
    try {
      fs.rmSync(buildDir, { recursive: true, force: true });
    } catch (e) {
      console.warn('Failed to clean buildDir:', e.message);
    }
  }
  
  fs.mkdirSync(buildDir, { recursive: true });
  
  // Folders and files to copy
  const targets = [
    'app',
    'components',
    'lib',
    'hooks',
    'assets',
    'package.json',
    'tsconfig.json',
    'next.config.ts',
    'postcss.config.mjs',
    'eslint.config.mjs',
    '.eslintrc.json',
    'metadata.json',
    '.env.example'
  ];
  
  for (const target of targets) {
    if (fs.existsSync(target)) {
      console.log(`Copying ${target} to ${buildDir}...`);
      try {
        execSync(`cp -R ${target} ${path.join(buildDir, target)}`);
      } catch (cpError) {
        console.error(`Error copying ${target}:`, cpError.message);
      }
    }
  }
  
  // Create node_modules symlink
  console.log('Creating node_modules symlink...');
  const localNodeModules = path.join(cwd || '/', 'node_modules');
  const targetNodeModules = path.join(buildDir, 'node_modules');
  try {
    if (fs.existsSync(localNodeModules)) {
      fs.symlinkSync(localNodeModules, targetNodeModules);
    } else if (fs.existsSync('/node_modules')) {
      fs.symlinkSync('/node_modules', targetNodeModules);
    }
  } catch (symlinkErr) {
    console.error('Symlink creation error:', symlinkErr.message);
  }
  
  // Run next build inside the temporary build directory
  console.log('Executing next build inside temporary folder...');
  try {
    execSync('npx next build', {
      cwd: buildDir,
      stdio: 'inherit',
      env: {
        ...process.env,
        NODE_ENV: 'production'
      }
    });
  } catch (buildError) {
    console.error('Next build failed inside temporary directory:', buildError.message);
    process.exit(1);
  }
  
  // Copy back the built items (.next)
  console.log('Copying build outputs back to project root...');
  const compiledNextDir = path.join(buildDir, '.next');
  if (fs.existsSync(compiledNextDir)) {
    if (fs.existsSync('.next')) {
      try {
        fs.rmSync('.next', { recursive: true, force: true });
      } catch (rmErr) {
        console.warn('Failed to remove local .next:', rmErr.message);
      }
    }
    try {
      execSync(`cp -R ${compiledNextDir} .next`);
    } catch (cpBackError) {
      console.error('Failed to copy .next output back:', cpBackError.message);
      process.exit(1);
    }
  }
  console.log('Cloud Run build workaround completed successfully!');
} else {
  console.log('Standard directory context detected. Cleaning local .next directory...');
  const localNextDir = path.join(__dirname, '.next');
  if (fs.existsSync(localNextDir)) {
    try {
      fs.rmSync(localNextDir, { recursive: true, force: true });
      console.log('Cleaned stale .next directory prior to build.');
    } catch (cleanError) {
      console.warn('Failed to clean stale .next directory:', cleanError.message);
    }
  }

  console.log('Standard directory context detected. Executing next build normally with explicit cwd...');
  try {
    execSync('next build', {
      cwd: __dirname,
      stdio: 'inherit',
      env: {
        ...process.env,
        NODE_ENV: 'production'
      }
    });
  } catch (buildError) {
    console.error('Next build failed:', buildError.message);
    process.exit(1);
  }
}
