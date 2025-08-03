#!/usr/bin/env node

/**
 * Authentication Flow Testing Script
 *
 * This script helps test the authentication endpoints directly
 * Run with: node test-auth-flow.js
 */

import https from 'https';
import http from 'http';

// Configuration
const AUTH_SERVICE_URL = 'http://localhost:3001';
const FRONTEND_URL = 'http://localhost:3000';

// Test data
const testUsers = {
  household: {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@test.com',
    phone: '+2348012345678',
    password: 'TestPass123!',
    role: 'household'
  },
  supplier: {
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@test.com',
    phone: '+2347012345678',
    password: 'TestPass123!',
    role: 'supplier',
    businessName: 'Test Gas Supply Co.'
  }
};

// Helper function to make HTTP requests
function makeRequest(url, options, data = null) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    
    const req = protocol.request(url, options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const response = {
            status: res.statusCode,
            headers: res.headers,
            data: body ? JSON.parse(body) : null
          };
          resolve(response);
        } catch (error) {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            data: body
          });
        }
      });
    });

    req.on('error', reject);

    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

// Test functions
async function testRegistration(userType) {
  console.log(`\n🧪 Testing ${userType} registration...`);
  
  const userData = testUsers[userType];
  
  try {
    const response = await makeRequest(`${AUTH_SERVICE_URL}/api/v1/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    }, userData);

    if (response.status === 201) {
      console.log(`✅ ${userType} registration successful`);
      console.log(`   User ID: ${response.data.user?.id}`);
      console.log(`   Email: ${response.data.user?.email}`);
      console.log(`   Role: ${response.data.user?.role}`);
      return response.data;
    } else {
      console.log(`❌ ${userType} registration failed`);
      console.log(`   Status: ${response.status}`);
      console.log(`   Error: ${response.data?.message || 'Unknown error'}`);
      return null;
    }
  } catch (error) {
    console.log(`❌ ${userType} registration error: ${error.message}`);
    return null;
  }
}

async function testLogin(userType) {
  console.log(`\n🧪 Testing ${userType} login...`);
  
  const userData = testUsers[userType];
  
  try {
    // Test login with email
    const emailLoginResponse = await makeRequest(`${AUTH_SERVICE_URL}/api/v1/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    }, {
      identifier: userData.email,
      password: userData.password
    });

    if (emailLoginResponse.status === 200) {
      console.log(`✅ ${userType} email login successful`);
      console.log(`   Access Token: ${emailLoginResponse.data.tokens?.accessToken?.substring(0, 20)}...`);
      console.log(`   Refresh Token: ${emailLoginResponse.data.tokens?.refreshToken?.substring(0, 20)}...`);
    } else {
      console.log(`❌ ${userType} email login failed`);
      console.log(`   Status: ${emailLoginResponse.status}`);
      console.log(`   Error: ${emailLoginResponse.data?.message || 'Unknown error'}`);
    }

    // Test login with phone
    const phoneLoginResponse = await makeRequest(`${AUTH_SERVICE_URL}/api/v1/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    }, {
      identifier: userData.phone,
      password: userData.password
    });

    if (phoneLoginResponse.status === 200) {
      console.log(`✅ ${userType} phone login successful`);
      return phoneLoginResponse.data;
    } else {
      console.log(`❌ ${userType} phone login failed`);
      console.log(`   Status: ${phoneLoginResponse.status}`);
      console.log(`   Error: ${phoneLoginResponse.data?.message || 'Unknown error'}`);
    }

    return emailLoginResponse.status === 200 ? emailLoginResponse.data : null;
  } catch (error) {
    console.log(`❌ ${userType} login error: ${error.message}`);
    return null;
  }
}

async function testInvalidLogin() {
  console.log(`\n🧪 Testing invalid login...`);
  
  try {
    const response = await makeRequest(`${AUTH_SERVICE_URL}/api/v1/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    }, {
      identifier: 'invalid@test.com',
      password: 'wrongpassword'
    });

    if (response.status === 401) {
      console.log(`✅ Invalid login correctly rejected`);
      console.log(`   Status: ${response.status}`);
      console.log(`   Message: ${response.data?.message}`);
    } else {
      console.log(`❌ Invalid login should have been rejected`);
      console.log(`   Status: ${response.status}`);
    }
  } catch (error) {
    console.log(`❌ Invalid login test error: ${error.message}`);
  }
}

async function testTokenRefresh(refreshToken) {
  console.log(`\n🧪 Testing token refresh...`);
  
  try {
    const response = await makeRequest(`${AUTH_SERVICE_URL}/api/v1/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    }, {
      refreshToken: refreshToken
    });

    if (response.status === 200) {
      console.log(`✅ Token refresh successful`);
      console.log(`   New Access Token: ${response.data.tokens?.accessToken?.substring(0, 20)}...`);
      return response.data;
    } else {
      console.log(`❌ Token refresh failed`);
      console.log(`   Status: ${response.status}`);
      console.log(`   Error: ${response.data?.message || 'Unknown error'}`);
    }
  } catch (error) {
    console.log(`❌ Token refresh error: ${error.message}`);
  }
}

async function testLogout(accessToken) {
  console.log(`\n🧪 Testing logout...`);
  
  try {
    const response = await makeRequest(`${AUTH_SERVICE_URL}/api/v1/auth/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      }
    });

    if (response.status === 200) {
      console.log(`✅ Logout successful`);
      console.log(`   Message: ${response.data?.message}`);
    } else {
      console.log(`❌ Logout failed`);
      console.log(`   Status: ${response.status}`);
      console.log(`   Error: ${response.data?.message || 'Unknown error'}`);
    }
  } catch (error) {
    console.log(`❌ Logout error: ${error.message}`);
  }
}

// Main test runner
async function runTests() {
  console.log('🚀 Starting Authentication Flow Tests...');
  console.log(`📡 Auth Service: ${AUTH_SERVICE_URL}`);
  console.log(`🌐 Frontend: ${FRONTEND_URL}`);
  
  // Test registration for different user types
  const householdUser = await testRegistration('household');
  const supplierUser = await testRegistration('supplier');
  
  // Test login for registered users
  let loginData = null;
  if (householdUser) {
    loginData = await testLogin('household');
  }
  
  if (supplierUser) {
    await testLogin('supplier');
  }
  
  // Test invalid login
  await testInvalidLogin();
  
  // Test token refresh if we have tokens
  if (loginData?.tokens?.refreshToken) {
    await testTokenRefresh(loginData.tokens.refreshToken);
  }
  
  // Test logout if we have access token
  if (loginData?.tokens?.accessToken) {
    await testLogout(loginData.tokens.accessToken);
  }
  
  console.log('\n✅ Authentication flow tests completed!');
  console.log('\n📋 Next Steps:');
  console.log('1. Open browser and navigate to http://localhost:3000');
  console.log('2. Test the frontend registration and login flows');
  console.log('3. Verify protected routes and redirects');
  console.log('4. Test profile and address management');
  console.log('\n📖 See AUTHENTICATION_TESTING_GUIDE.md for detailed testing instructions');
}

// Run tests if script is executed directly
runTests().catch(console.error);
