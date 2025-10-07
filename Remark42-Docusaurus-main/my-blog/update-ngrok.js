#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

/**
 * Script to update ngrok URL across all Remark42 configuration files
 * Usage: node update-ngrok.js <new-ngrok-url>
 */

function updateNgrokUrl(newUrl) {
  if (!newUrl) {
    console.error('❌ Please provide a new ngrok URL');
    console.log('Usage: node update-ngrok.js https://your-new-url.ngrok-free.app');
    process.exit(1);
  }

  // Validate URL format
  if (!newUrl.match(/^https:\/\/[a-f0-9]+\.ngrok-free\.app$/)) {
    console.error('❌ Invalid ngrok URL format. Expected: https://xxxxx.ngrok-free.app');
    process.exit(1);
  }

  console.log(`🔄 Updating ngrok URL to: ${newUrl}`);

  const files = [
    {
      path: '.env',
      replacements: [
        {
          search: /REMARK42_HOST=https:\/\/[a-f0-9]+\.ngrok-free\.app/,
          replace: `REMARK42_HOST=${newUrl}`
        }
      ]
    },
    {
      path: 'docker-compose.yml',
      replacements: [
        {
          search: /REMARK_URL=https:\/\/[a-f0-9]+\.ngrok-free\.app/,
          replace: `REMARK_URL=${newUrl}`
        },
        {
          search: /ALLOWED_HOSTS=localhost,127\.0\.0\.1,[a-f0-9]+\.ngrok-free\.app/,
          replace: `ALLOWED_HOSTS=localhost,127.0.0.1,${newUrl.replace('https://', '')}`
        }
      ]
    },
    {
      path: 'src/clientModules/remark42-csp.js',
      replacements: [
        {
          search: /window\.remark_config\?\.host \|\| 'https:\/\/[a-f0-9]+\.ngrok-free\.app'/,
          replace: `window.remark_config?.host || '${newUrl}'`
        }
      ]
    }
  ];

  // Update files
  files.forEach(file => {
    const filePath = path.join(__dirname, file.path);
    
    if (!fs.existsSync(filePath)) {
      console.warn(`⚠️  File not found: ${file.path}`);
      return;
    }

    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    file.replacements.forEach(replacement => {
      if (replacement.search.test(content)) {
        content = content.replace(replacement.search, replacement.replace);
        modified = true;
      }
    });

    if (modified) {
      fs.writeFileSync(filePath, content);
      console.log(`✅ Updated ${file.path}`);
    } else {
      console.log(`⏭️  No changes needed in ${file.path}`);
    }
  });

  // Restart Docker containers
  console.log('🐳 Restarting Docker containers...');
  try {
    execSync('docker compose down', { stdio: 'inherit' });
    console.log('🗑️  Clearing old Remark42 data...');
    execSync('rm -rf remark42-data', { stdio: 'inherit' });
    execSync('docker compose up -d', { stdio: 'inherit' });
    console.log('✅ Docker containers restarted with fresh data');
  } catch (error) {
    console.error('❌ Error restarting Docker:', error.message);
  }

  console.log('\n🎉 Update complete!');
  console.log('📝 Next steps:');
  console.log('   1. Restart your Docusaurus dev server');
  console.log('   2. Hard refresh your browser (Ctrl+F5)');
  console.log('   3. Visit a blog post to test the Remark42 widget');
}

// Get URL from command line arguments
const newUrl = process.argv[2];
updateNgrokUrl(newUrl);