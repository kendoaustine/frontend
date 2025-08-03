/**
 * Browser Testing Helper Script
 * 
 * Open browser console and run these functions to test authentication flow
 * Usage: Copy and paste functions into browser console on http://localhost:3000
 */

// Test data
const testData = {
  household: {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@test.com',
    phone: '+2348012345678',
    password: 'TestPass123!',
    confirmPassword: 'TestPass123!',
    role: 'household'
  },
  supplier: {
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@test.com',
    phone: '+2347012345678',
    password: 'TestPass123!',
    confirmPassword: 'TestPass123!',
    role: 'supplier',
    businessName: 'Test Gas Supply Co.'
  }
};

// Helper functions
function fillForm(selector, data) {
  const form = document.querySelector(selector);
  if (!form) {
    console.error(`Form not found: ${selector}`);
    return false;
  }

  Object.keys(data).forEach(key => {
    const input = form.querySelector(`[name="${key}"], #${key}`);
    if (input) {
      if (input.type === 'radio' || input.type === 'checkbox') {
        input.checked = input.value === data[key];
      } else {
        input.value = data[key];
        // Trigger input event for Vue reactivity
        input.dispatchEvent(new Event('input', { bubbles: true }));
      }
    }
  });

  return true;
}

function submitForm(selector) {
  const form = document.querySelector(selector);
  if (!form) {
    console.error(`Form not found: ${selector}`);
    return false;
  }

  const submitButton = form.querySelector('button[type="submit"]');
  if (submitButton) {
    submitButton.click();
    return true;
  }

  console.error('Submit button not found');
  return false;
}

function waitForNavigation(expectedPath, timeout = 5000) {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    
    function checkPath() {
      if (window.location.pathname === expectedPath) {
        resolve(true);
      } else if (Date.now() - startTime > timeout) {
        reject(new Error(`Navigation timeout. Expected: ${expectedPath}, Current: ${window.location.pathname}`));
      } else {
        setTimeout(checkPath, 100);
      }
    }
    
    checkPath();
  });
}

function checkAuthState() {
  const userCookie = document.cookie
    .split('; ')
    .find(row => row.startsWith('user-data='));
  
  const tokenCookie = document.cookie
    .split('; ')
    .find(row => row.startsWith('auth-token='));

  console.log('🔍 Authentication State:');
  console.log('User Cookie:', userCookie ? '✅ Present' : '❌ Missing');
  console.log('Token Cookie:', tokenCookie ? '✅ Present' : '❌ Missing');
  
  if (userCookie) {
    try {
      const userData = JSON.parse(decodeURIComponent(userCookie.split('=')[1]));
      console.log('User Data:', userData);
    } catch (e) {
      console.log('User Data: Unable to parse');
    }
  }
}

// Test functions
async function testRegistration(userType = 'household') {
  console.log(`🧪 Testing ${userType} registration...`);
  
  // Navigate to register page
  window.location.href = '/register';
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Fill registration form
  const success = fillForm('form', testData[userType]);
  if (!success) {
    console.error('❌ Failed to fill registration form');
    return false;
  }
  
  console.log('✅ Registration form filled');
  
  // Submit form
  submitForm('form');
  
  try {
    // Wait for redirect to dashboard
    await waitForNavigation('/dashboard', 10000);
    console.log('✅ Registration successful - redirected to dashboard');
    checkAuthState();
    return true;
  } catch (error) {
    console.error('❌ Registration failed:', error.message);
    return false;
  }
}

async function testLogin(userType = 'household') {
  console.log(`🧪 Testing ${userType} login...`);
  
  // Navigate to login page
  window.location.href = '/login';
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Fill login form
  const loginData = {
    identifier: testData[userType].email,
    password: testData[userType].password
  };
  
  const success = fillForm('form', loginData);
  if (!success) {
    console.error('❌ Failed to fill login form');
    return false;
  }
  
  console.log('✅ Login form filled');
  
  // Submit form
  submitForm('form');
  
  try {
    // Wait for redirect to dashboard
    await waitForNavigation('/dashboard', 10000);
    console.log('✅ Login successful - redirected to dashboard');
    checkAuthState();
    return true;
  } catch (error) {
    console.error('❌ Login failed:', error.message);
    return false;
  }
}

async function testProtectedRoute() {
  console.log('🧪 Testing protected route access...');
  
  // Clear authentication
  document.cookie = 'user-data=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  document.cookie = 'auth-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  
  // Try to access protected route
  window.location.href = '/dashboard';
  
  try {
    // Should redirect to login
    await waitForNavigation('/login', 5000);
    console.log('✅ Protected route correctly redirected to login');
    return true;
  } catch (error) {
    console.error('❌ Protected route test failed:', error.message);
    return false;
  }
}

async function testLogout() {
  console.log('🧪 Testing logout...');
  
  // Find and click logout button
  const logoutButton = document.querySelector('[data-testid="logout-button"], button:contains("Logout"), a:contains("Logout")');
  
  if (!logoutButton) {
    console.error('❌ Logout button not found');
    return false;
  }
  
  logoutButton.click();
  
  try {
    // Should redirect to login
    await waitForNavigation('/login', 5000);
    console.log('✅ Logout successful - redirected to login');
    checkAuthState();
    return true;
  } catch (error) {
    console.error('❌ Logout test failed:', error.message);
    return false;
  }
}

// Complete test suite
async function runCompleteTest() {
  console.log('🚀 Starting complete authentication test suite...');
  
  try {
    // Test 1: Registration
    await testRegistration('household');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Test 2: Logout
    await testLogout();
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Test 3: Login
    await testLogin('household');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Test 4: Protected route (after logout)
    await testProtectedRoute();
    
    console.log('✅ Complete test suite finished!');
  } catch (error) {
    console.error('❌ Test suite failed:', error);
  }
}

// Export functions for manual testing
window.authTestHelper = {
  testRegistration,
  testLogin,
  testProtectedRoute,
  testLogout,
  runCompleteTest,
  checkAuthState,
  fillForm,
  submitForm,
  testData
};

console.log('🧪 Authentication Test Helper Loaded!');
console.log('Available functions:');
console.log('- authTestHelper.testRegistration("household")');
console.log('- authTestHelper.testLogin("household")');
console.log('- authTestHelper.testProtectedRoute()');
console.log('- authTestHelper.testLogout()');
console.log('- authTestHelper.runCompleteTest()');
console.log('- authTestHelper.checkAuthState()');
