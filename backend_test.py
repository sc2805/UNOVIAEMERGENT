#!/usr/bin/env python3

import requests
import sys
import json
from datetime import datetime

class UnoviaAPITester:
    def __init__(self, base_url="https://advisor-portal-239.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.session = requests.Session()
        self.tests_run = 0
        self.tests_passed = 0
        self.admin_token = None

    def log_test(self, name, success, details=""):
        """Log test results"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
            print(f"✅ {name} - PASSED")
        else:
            print(f"❌ {name} - FAILED: {details}")
        
        if details:
            print(f"   Details: {details}")

    def test_root_endpoint(self):
        """Test root API endpoint"""
        try:
            response = self.session.get(f"{self.api_url}/")
            success = response.status_code == 200
            details = f"Status: {response.status_code}"
            if success:
                data = response.json()
                details += f", Message: {data.get('message', 'N/A')}"
            self.log_test("Root API Endpoint", success, details)
            return success
        except Exception as e:
            self.log_test("Root API Endpoint", False, str(e))
            return False

    def test_admin_login(self):
        """Test admin login functionality"""
        try:
            login_data = {
                "email": "connect@unovia.in",
                "password": "Unovia@2805"
            }
            response = self.session.post(f"{self.api_url}/auth/login", json=login_data)
            success = response.status_code == 200
            
            if success:
                data = response.json()
                details = f"Status: {response.status_code}, User: {data.get('email')}, Role: {data.get('role')}"
                # Store cookies for subsequent requests
                self.session.cookies.update(response.cookies)
            else:
                details = f"Status: {response.status_code}, Response: {response.text}"
            
            self.log_test("Admin Login", success, details)
            return success
        except Exception as e:
            self.log_test("Admin Login", False, str(e))
            return False

    def test_auth_me(self):
        """Test getting current user info"""
        try:
            response = self.session.get(f"{self.api_url}/auth/me")
            success = response.status_code == 200
            
            if success:
                data = response.json()
                details = f"Status: {response.status_code}, User: {data.get('email')}"
            else:
                details = f"Status: {response.status_code}, Response: {response.text}"
            
            self.log_test("Auth Me Endpoint", success, details)
            return success
        except Exception as e:
            self.log_test("Auth Me Endpoint", False, str(e))
            return False

    def test_contact_form(self):
        """Test contact form submission"""
        try:
            contact_data = {
                "name": "Test User",
                "email": "test@example.com",
                "service_interest": "wealth-management",
                "message": "This is a test inquiry for API testing."
            }
            response = self.session.post(f"{self.api_url}/contact", json=contact_data)
            success = response.status_code == 200
            
            if success:
                data = response.json()
                details = f"Status: {response.status_code}, Inquiry ID: {data.get('id')}"
            else:
                details = f"Status: {response.status_code}, Response: {response.text}"
            
            self.log_test("Contact Form Submission", success, details)
            return success
        except Exception as e:
            self.log_test("Contact Form Submission", False, str(e))
            return False

    def test_blog_seeding(self):
        """Test blog seeding endpoint"""
        try:
            response = self.session.post(f"{self.api_url}/blogs/seed")
            success = response.status_code == 200
            
            if success:
                data = response.json()
                details = f"Status: {response.status_code}, Message: {data.get('message')}"
            else:
                details = f"Status: {response.status_code}, Response: {response.text}"
            
            self.log_test("Blog Seeding", success, details)
            return success
        except Exception as e:
            self.log_test("Blog Seeding", False, str(e))
            return False

    def test_public_blogs(self):
        """Test public blogs endpoint"""
        try:
            response = self.session.get(f"{self.api_url}/blogs")
            success = response.status_code == 200
            
            if success:
                data = response.json()
                details = f"Status: {response.status_code}, Blog count: {len(data)}"
            else:
                details = f"Status: {response.status_code}, Response: {response.text}"
            
            self.log_test("Public Blogs Endpoint", success, details)
            return success
        except Exception as e:
            self.log_test("Public Blogs Endpoint", False, str(e))
            return False

    def test_admin_stats(self):
        """Test admin stats endpoint"""
        try:
            response = self.session.get(f"{self.api_url}/admin/stats")
            success = response.status_code == 200
            
            if success:
                data = response.json()
                details = f"Status: {response.status_code}, Stats: {data}"
            else:
                details = f"Status: {response.status_code}, Response: {response.text}"
            
            self.log_test("Admin Stats", success, details)
            return success
        except Exception as e:
            self.log_test("Admin Stats", False, str(e))
            return False

    def test_admin_inquiries(self):
        """Test admin inquiries endpoint"""
        try:
            response = self.session.get(f"{self.api_url}/admin/inquiries")
            success = response.status_code == 200
            
            if success:
                data = response.json()
                details = f"Status: {response.status_code}, Inquiries count: {len(data)}"
            else:
                details = f"Status: {response.status_code}, Response: {response.text}"
            
            self.log_test("Admin Inquiries", success, details)
            return success
        except Exception as e:
            self.log_test("Admin Inquiries", False, str(e))
            return False

    def test_admin_blogs(self):
        """Test admin blogs endpoint"""
        try:
            response = self.session.get(f"{self.api_url}/admin/blogs")
            success = response.status_code == 200
            
            if success:
                data = response.json()
                details = f"Status: {response.status_code}, Blogs count: {len(data)}"
            else:
                details = f"Status: {response.status_code}, Response: {response.text}"
            
            self.log_test("Admin Blogs", success, details)
            return success
        except Exception as e:
            self.log_test("Admin Blogs", False, str(e))
            return False

    def test_create_blog(self):
        """Test creating a new blog post"""
        try:
            blog_data = {
                "title": "Test Blog Post",
                "excerpt": "This is a test blog post created during API testing.",
                "content": "Full content of the test blog post with detailed information.",
                "category": "Tax Consulting",
                "tags": ["test", "api", "automation"],
                "date": "January 2026",
                "read_time": "3 min read",
                "published": True
            }
            response = self.session.post(f"{self.api_url}/admin/blogs", json=blog_data)
            success = response.status_code == 200
            
            if success:
                data = response.json()
                details = f"Status: {response.status_code}, Blog ID: {data.get('id')}"
                self.test_blog_id = data.get('id')  # Store for update/delete tests
            else:
                details = f"Status: {response.status_code}, Response: {response.text}"
            
            self.log_test("Create Blog Post", success, details)
            return success
        except Exception as e:
            self.log_test("Create Blog Post", False, str(e))
            return False

    def test_update_blog(self):
        """Test updating a blog post"""
        if not hasattr(self, 'test_blog_id'):
            self.log_test("Update Blog Post", False, "No blog ID available from create test")
            return False
        
        try:
            update_data = {
                "title": "Updated Test Blog Post",
                "excerpt": "This blog post has been updated during testing."
            }
            response = self.session.patch(f"{self.api_url}/admin/blogs/{self.test_blog_id}", json=update_data)
            success = response.status_code == 200
            
            if success:
                data = response.json()
                details = f"Status: {response.status_code}, Updated title: {data.get('title')}"
            else:
                details = f"Status: {response.status_code}, Response: {response.text}"
            
            self.log_test("Update Blog Post", success, details)
            return success
        except Exception as e:
            self.log_test("Update Blog Post", False, str(e))
            return False

    def test_delete_blog(self):
        """Test deleting a blog post"""
        if not hasattr(self, 'test_blog_id'):
            self.log_test("Delete Blog Post", False, "No blog ID available from create test")
            return False
        
        try:
            response = self.session.delete(f"{self.api_url}/admin/blogs/{self.test_blog_id}")
            success = response.status_code == 200
            
            if success:
                data = response.json()
                details = f"Status: {response.status_code}, Message: {data.get('message')}"
            else:
                details = f"Status: {response.status_code}, Response: {response.text}"
            
            self.log_test("Delete Blog Post", success, details)
            return success
        except Exception as e:
            self.log_test("Delete Blog Post", False, str(e))
            return False

    def test_logout(self):
        """Test admin logout"""
        try:
            response = self.session.post(f"{self.api_url}/auth/logout")
            success = response.status_code == 200
            
            if success:
                data = response.json()
                details = f"Status: {response.status_code}, Message: {data.get('message')}"
            else:
                details = f"Status: {response.status_code}, Response: {response.text}"
            
            self.log_test("Admin Logout", success, details)
            return success
        except Exception as e:
            self.log_test("Admin Logout", False, str(e))
            return False

    def run_all_tests(self):
        """Run all API tests"""
        print("🚀 Starting Unovia Consulting API Tests")
        print("=" * 50)
        
        # Test basic endpoints
        self.test_root_endpoint()
        self.test_contact_form()
        self.test_blog_seeding()
        self.test_public_blogs()
        
        # Test authentication
        if self.test_admin_login():
            self.test_auth_me()
            
            # Test admin endpoints
            self.test_admin_stats()
            self.test_admin_inquiries()
            self.test_admin_blogs()
            
            # Test blog CRUD operations
            if self.test_create_blog():
                self.test_update_blog()
                self.test_delete_blog()
            
            # Test logout
            self.test_logout()
        
        # Print summary
        print("\n" + "=" * 50)
        print(f"📊 Test Summary: {self.tests_passed}/{self.tests_run} tests passed")
        
        if self.tests_passed == self.tests_run:
            print("🎉 All tests passed!")
            return 0
        else:
            print(f"⚠️  {self.tests_run - self.tests_passed} tests failed")
            return 1

def main():
    tester = UnoviaAPITester()
    return tester.run_all_tests()

if __name__ == "__main__":
    sys.exit(main())