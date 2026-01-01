#!/usr/bin/env node

/**
 * Build verification script
 * Checks for common build issues before deployment
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying build configuration...\n');

const issues = [];

// Check for route conflicts
const appDir = path.join(process.cwd(), 'app');
if (fs.existsSync(appDir)) {
  const rootPage = path.join(appDir, 'page.tsx');
  const customerPage = path.join(appDir, '(customer)', 'page.tsx');
  const customerHomePage = path.join(appDir, '(customer)', 'home', 'page.tsx');
  
  // Check for old route conflict (should not exist anymore)
  if (fs.existsSync(rootPage) && fs.existsSync(customerPage)) {
    issues.push({
      type: 'error',
      message: 'Route conflict detected: Both app/page.tsx and app/(customer)/page.tsx exist. This will cause build errors.',
      suggestion: 'Move app/(customer)/page.tsx to app/(customer)/home/page.tsx to resolve the conflict.'
    });
  }
  
  // Verify new structure is correct
  if (fs.existsSync(rootPage) && !fs.existsSync(customerHomePage) && !fs.existsSync(customerPage)) {
    issues.push({
      type: 'warning',
      message: 'Customer home page not found. Expected at app/(customer)/home/page.tsx',
      suggestion: 'Create app/(customer)/home/page.tsx if you need a customer home page.'
    });
  }
}

// Check Next.js config
const nextConfigPath = path.join(process.cwd(), 'next.config.js');
if (!fs.existsSync(nextConfigPath)) {
  issues.push({
    type: 'error',
    message: 'next.config.js not found',
    suggestion: 'Create a next.config.js file'
  });
}

// Report issues
if (issues.length > 0) {
  console.log('⚠️  Issues found:\n');
  issues.forEach((issue, index) => {
    console.log(`${index + 1}. [${issue.type.toUpperCase()}] ${issue.message}`);
    if (issue.suggestion) {
      console.log(`   💡 ${issue.suggestion}\n`);
    }
  });
  
  const errors = issues.filter(i => i.type === 'error');
  if (errors.length > 0) {
    console.log('❌ Build verification failed. Please fix the errors above.');
    process.exit(1);
  } else {
    console.log('✅ Build verification completed with warnings.');
  }
} else {
  console.log('✅ Build verification passed!');
}

process.exit(0);

