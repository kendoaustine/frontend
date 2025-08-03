# 🧪 **AUTHENTICATION FLOW END-TO-END TESTING GUIDE**

## 📋 **TESTING CHECKLIST**

### **Phase 1: Registration Flow Testing**

#### **✅ Test Case 1.1: Valid Registration**
**Objective**: Verify successful user registration with all user roles

**Test Data**:
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "phone": "+2348012345678",
  "password": "SecurePass123!",
  "role": "household"
}
```

**Steps**:
1. Navigate to `/register`
2. Fill in all required fields
3. Select user role (household/hospital/artisan/supplier/delivery_driver)
4. Submit form
5. Verify success message and redirect to dashboard

**Expected Results**:
- ✅ Form validation passes
- ✅ Backend returns 201 Created
- ✅ User data stored in cookies
- ✅ Automatic redirect to `/dashboard`
- ✅ Success toast notification

#### **✅ Test Case 1.2: Phone Number Auto-Formatting**
**Test Data**: Try different phone formats
- Input: `08012345678` → Expected: `+2348012345678`
- Input: `2348012345678` → Expected: `+2348012345678`
- Input: `+2348012345678` → Expected: `+2348012345678`

#### **✅ Test Case 1.3: Validation Errors**
**Test Invalid Data**:
- Invalid email: `invalid-email`
- Weak password: `weak`
- Invalid phone: `123456`
- Missing required fields

**Expected**: Field-specific error messages

#### **✅ Test Case 1.4: Supplier Registration**
**Additional Fields**:
```json
{
  "role": "supplier",
  "businessName": "Lagos Gas Supply Co."
}
```

### **Phase 2: Login Flow Testing**

#### **✅ Test Case 2.1: Valid Login (Email)**
**Test Data**:
```json
{
  "identifier": "john.doe@example.com",
  "password": "SecurePass123!"
}
```

**Steps**:
1. Navigate to `/login`
2. Enter email and password
3. Submit form
4. Verify success and redirect

**Expected Results**:
- ✅ Backend returns 200 OK
- ✅ User data and tokens stored
- ✅ Success toast: "Login successful! Redirecting..."
- ✅ Redirect to `/dashboard`

#### **✅ Test Case 2.2: Valid Login (Phone)**
**Test Data**:
```json
{
  "identifier": "+2348012345678",
  "password": "SecurePass123!"
}
```

#### **✅ Test Case 2.3: Invalid Credentials**
**Test Data**:
```json
{
  "identifier": "john.doe@example.com",
  "password": "wrongpassword"
}
```

**Expected**: Error message "Invalid credentials"

#### **✅ Test Case 2.4: Redirect After Login**
**Steps**:
1. Navigate to `/login?redirect=/profile`
2. Login successfully
3. Verify redirect to `/profile`

### **Phase 3: Authentication State Testing**

#### **✅ Test Case 3.1: Protected Route Access**
**Steps**:
1. Logout (clear cookies)
2. Try to access `/dashboard`
3. Verify redirect to `/login`

#### **✅ Test Case 3.2: Already Authenticated**
**Steps**:
1. Login successfully
2. Try to access `/login` or `/register`
3. Verify redirect to `/dashboard`

#### **✅ Test Case 3.3: Token Persistence**
**Steps**:
1. Login successfully
2. Refresh the page
3. Verify user remains authenticated

### **Phase 4: Profile Management Testing**

#### **✅ Test Case 4.1: Profile Loading**
**Steps**:
1. Login and navigate to `/profile`
2. Verify profile data loads correctly
3. Check all form fields are populated

#### **✅ Test Case 4.2: Profile Update**
**Test Data**:
```json
{
  "firstName": "Jane",
  "lastName": "Smith",
  "email": "jane.smith@example.com",
  "phone": "+2347012345678"
}
```

**Steps**:
1. Update profile information
2. Submit form
3. Verify success message
4. Refresh and verify changes persist

#### **✅ Test Case 4.3: Email Verification**
**Steps**:
1. Click "Send Verification Email"
2. Verify success message
3. Check backend logs for email sending

#### **✅ Test Case 4.4: Phone Verification**
**Steps**:
1. Click "Send Verification SMS"
2. Verify success message
3. Check backend logs for SMS sending

### **Phase 5: Address Management Testing**

#### **✅ Test Case 5.1: Address Loading**
**Steps**:
1. Navigate to `/addresses`
2. Verify addresses load (or fallback to mock data)

#### **✅ Test Case 5.2: Set Default Address**
**Steps**:
1. Click "Set as Default" on an address
2. Verify success message
3. Verify address marked as default

#### **✅ Test Case 5.3: Delete Address**
**Steps**:
1. Click "Delete" on an address
2. Confirm deletion
3. Verify address removed from list

### **Phase 6: Logout Testing**

#### **✅ Test Case 6.1: Logout**
**Steps**:
1. Click logout button
2. Verify redirect to login page
3. Verify cookies cleared
4. Try accessing protected route

### **Phase 7: Error Handling Testing**

#### **✅ Test Case 7.1: Network Errors**
**Steps**:
1. Disconnect from internet
2. Try to login
3. Verify graceful error handling

#### **✅ Test Case 7.2: Backend Errors**
**Steps**:
1. Stop backend service
2. Try authentication actions
3. Verify fallback to mock data where appropriate

## 🚀 **STEP-BY-STEP TESTING INSTRUCTIONS**

### **Prerequisites**
1. **Backend Services Running**:
   ```bash
   cd backend
   docker-compose up -d
   ```

2. **Frontend Development Server**:
   ```bash
   cd frontend
   npm run dev
   ```

3. **Verify Services**:
   - Backend: http://localhost:3001/health
   - Frontend: http://localhost:3000
   - Auth Service: http://localhost:3001/api/v1/auth/health

### **Quick API Testing**
```bash
# Run automated backend tests
cd frontend
node test-auth-flow.js
```

### **Manual Frontend Testing**

### **Manual Testing Checklist**
- [ ] Registration with all user roles
- [ ] Phone number auto-formatting
- [ ] Login with email and phone
- [ ] Protected route access
- [ ] Profile management
- [ ] Address management
- [ ] Logout functionality
- [ ] Error handling

## 📊 **TESTING RESULTS TEMPLATE**

### **Test Results Summary**
| Test Case | Status | Notes |
|-----------|--------|-------|
| Registration (Household) | ✅/❌ | |
| Registration (Supplier) | ✅/❌ | |
| Login (Email) | ✅/❌ | |
| Login (Phone) | ✅/❌ | |
| Protected Routes | ✅/❌ | |
| Profile Update | ✅/❌ | |
| Address Management | ✅/❌ | |
| Logout | ✅/❌ | |

### **Issues Found**
1. **Issue**: Description
   **Status**: Fixed/Pending
   **Priority**: High/Medium/Low

2. **Issue**: Description
   **Status**: Fixed/Pending
   **Priority**: High/Medium/Low

## 🔧 **DEBUGGING TIPS**

### **Browser Developer Tools**
1. **Network Tab**: Monitor API requests/responses
2. **Application Tab**: Check cookies and localStorage
3. **Console**: Look for JavaScript errors

### **Backend Logs**
```bash
# Monitor auth service logs
docker logs -f gasconnect-auth

# Monitor all services
docker-compose logs -f
```

### **Common Issues & Solutions**
1. **CORS Errors**: Check backend CORS configuration
2. **Token Issues**: Verify token storage in cookies
3. **Redirect Issues**: Check authentication middleware
4. **Validation Errors**: Verify request payload format
