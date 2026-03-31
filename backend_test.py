import requests
import sys
from datetime import datetime
import json

class UnoviaAPITester:
    def __init__(self, base_url="https://advisor-portal-239.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.tests_run = 0
        self.tests_passed = 0
        self.failed_tests = []

    def run_test(self, name, method, endpoint, expected_status, data=None):
        """Run a single API test"""
        url = f"{self.api_url}/{endpoint}"
        headers = {'Content-Type': 'application/json'}

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=10)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    response_data = response.json()
                    print(f"Response: {json.dumps(response_data, indent=2)[:200]}...")
                except:
                    print(f"Response: {response.text[:200]}...")
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                print(f"Response: {response.text[:200]}...")
                self.failed_tests.append({
                    "test": name,
                    "expected": expected_status,
                    "actual": response.status_code,
                    "endpoint": endpoint
                })

            return success, response.json() if success and response.text else {}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            self.failed_tests.append({
                "test": name,
                "error": str(e),
                "endpoint": endpoint
            })
            return False, {}

    def test_root_endpoint(self):
        """Test root API endpoint"""
        return self.run_test("Root API", "GET", "", 200)

    def test_seed_blogs(self):
        """Test blog seeding"""
        return self.run_test("Seed Blogs", "POST", "blogs/seed", 200)

    def test_get_blogs(self):
        """Test getting blog posts"""
        return self.run_test("Get Blogs", "GET", "blogs", 200)

    def test_create_contact(self):
        """Test contact form submission"""
        test_data = {
            "name": "Test User",
            "email": "test@example.com",
            "service_interest": "wealth-management",
            "message": "This is a test inquiry for Unovia Consulting services."
        }
        return self.run_test("Create Contact Inquiry", "POST", "contact", 200, test_data)

    def test_get_contacts(self):
        """Test getting contact inquiries"""
        return self.run_test("Get Contact Inquiries", "GET", "contact", 200)

    def test_create_blog(self):
        """Test creating a blog post"""
        test_blog = {
            "title": "Test Blog Post",
            "excerpt": "This is a test blog post excerpt",
            "category": "Test Category",
            "date": "January 2026",
            "read_time": "3 min read"
        }
        return self.run_test("Create Blog Post", "POST", "blogs", 200, test_blog)

def main():
    print("🚀 Starting Unovia Consulting API Tests")
    print("=" * 50)
    
    tester = UnoviaAPITester()
    
    # Test sequence
    print("\n📋 Running Backend API Tests...")
    
    # Test root endpoint
    tester.test_root_endpoint()
    
    # Test blog endpoints
    tester.test_seed_blogs()
    tester.test_get_blogs()
    tester.test_create_blog()
    
    # Test contact endpoints
    tester.test_create_contact()
    tester.test_get_contacts()
    
    # Print final results
    print("\n" + "=" * 50)
    print(f"📊 Test Results: {tester.tests_passed}/{tester.tests_run} passed")
    
    if tester.failed_tests:
        print("\n❌ Failed Tests:")
        for failed in tester.failed_tests:
            error_msg = failed.get('error', f"Expected {failed.get('expected')}, got {failed.get('actual')}")
            print(f"  - {failed['test']}: {error_msg}")
    
    success_rate = (tester.tests_passed / tester.tests_run) * 100 if tester.tests_run > 0 else 0
    print(f"Success Rate: {success_rate:.1f}%")
    
    return 0 if tester.tests_passed == tester.tests_run else 1

if __name__ == "__main__":
    sys.exit(main())