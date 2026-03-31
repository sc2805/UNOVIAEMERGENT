import React, { useState, useEffect, createContext, useContext } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  LogOut, 
  Mail, 
  Phone, 
  Calendar, 
  FileText, 
  Users, 
  BarChart3,
  MoreVertical,
  Pencil,
  Trash2,
  Eye,
  Plus,
  ArrowLeft,
  Check,
  Clock,
  X as XIcon,
  Tag
} from "lucide-react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Auth Context
const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

// Auth Provider
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await axios.get(`${API}/auth/me`, { withCredentials: true });
      setUser(response.data);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const response = await axios.post(
      `${API}/auth/login`, 
      { email, password }, 
      { withCredentials: true }
    );
    setUser(response.data);
    return response.data;
  };

  const logout = async () => {
    await axios.post(`${API}/auth/logout`, {}, { withCredentials: true });
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

// Login Component
export const AdminLogin = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await login(email, password);
      toast.success("Welcome back!");
      if (onLogin) onLogin();
    } catch (err) {
      const detail = err.response?.data?.detail;
      setError(typeof detail === "string" ? detail : "Invalid credentials");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img 
            src="https://customer-assets.emergentagent.com/job_70c5e674-0507-43de-b39d-b6c0f0b963d9/artifacts/nrcv03h6_logo.png" 
            alt="Unovia"
            className="h-16 mx-auto mb-4"
          />
          <h1 className="font-heading text-3xl text-[#0B1B3D] font-medium">Admin Portal</h1>
          <p className="text-[#718096] mt-2">Sign in to manage your dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-8 shadow-lg border border-[#E2E8F0]" data-testid="admin-login-form">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#0B1B3D] mb-2">Email</label>
              <Input
                data-testid="admin-email-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@unovia.in"
                className="w-full"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#0B1B3D] mb-2">Password</label>
              <Input
                data-testid="admin-password-input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full"
                required
              />
            </div>

            <Button
              data-testid="admin-login-button"
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#0B1B3D] text-[#FAF9F6] py-6 rounded-none hover:bg-[#1A2C5B]"
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </div>
        </form>

        <p className="text-center mt-6 text-sm text-[#718096]">
          <a href="/" className="text-[#0B1B3D] hover:underline">← Back to Website</a>
        </p>
      </div>
    </div>
  );
};

// Admin Dashboard Component
export const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("inquiries");
  const [stats, setStats] = useState(null);
  const [inquiries, setInquiries] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [isEditingBlog, setIsEditingBlog] = useState(false);
  const [isCreatingBlog, setIsCreatingBlog] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, inquiriesRes, blogsRes] = await Promise.all([
        axios.get(`${API}/admin/stats`, { withCredentials: true }),
        axios.get(`${API}/admin/inquiries`, { withCredentials: true }),
        axios.get(`${API}/admin/blogs`, { withCredentials: true })
      ]);
      setStats(statsRes.data);
      setInquiries(inquiriesRes.data);
      setBlogs(blogsRes.data);
    } catch (error) {
      toast.error("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out successfully");
  };

  const updateInquiryStatus = async (id, status) => {
    try {
      await axios.patch(`${API}/admin/inquiries/${id}`, { status }, { withCredentials: true });
      setInquiries(inquiries.map(i => i.id === id ? { ...i, status } : i));
      toast.success("Status updated");
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const deleteInquiry = async (id) => {
    try {
      await axios.delete(`${API}/admin/inquiries/${id}`, { withCredentials: true });
      setInquiries(inquiries.filter(i => i.id !== id));
      toast.success("Inquiry deleted");
    } catch (error) {
      toast.error("Failed to delete inquiry");
    }
  };

  const deleteBlog = async (id) => {
    try {
      await axios.delete(`${API}/admin/blogs/${id}`, { withCredentials: true });
      setBlogs(blogs.filter(b => b.id !== id));
      toast.success("Blog post deleted");
    } catch (error) {
      toast.error("Failed to delete blog post");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "new": return "bg-blue-100 text-blue-800";
      case "contacted": return "bg-yellow-100 text-yellow-800";
      case "converted": return "bg-green-100 text-green-800";
      case "closed": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const serviceLabels = {
    "wealth-management": "Wealth Management",
    "tax-consulting": "Tax Consulting & Planning",
    "financial-advisory": "Financial Advisory",
    "gst-compliance": "GST & Compliance",
    "investment-planning": "Investment Planning"
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center">
        <div className="text-[#0B1B3D]">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F3F0EA]" data-testid="admin-dashboard">
      {/* Header */}
      <header className="bg-[#0B1B3D] text-[#FAF9F6] px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <img 
              src="https://customer-assets.emergentagent.com/job_70c5e674-0507-43de-b39d-b6c0f0b963d9/artifacts/nrcv03h6_logo.png" 
              alt="Unovia"
              className="h-10 invert"
            />
            <span className="text-lg font-medium">Admin Dashboard</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-[#FAF9F6]/70">{user?.email}</span>
            <Button 
              data-testid="logout-button"
              variant="ghost" 
              size="sm" 
              onClick={handleLogout}
              className="text-[#FAF9F6] hover:bg-[#1A2C5B]"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white p-6 shadow-sm border border-[#E2E8F0]" data-testid="stat-total-inquiries">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#718096]">Total Inquiries</p>
                  <p className="text-3xl font-heading font-medium text-[#0B1B3D]">{stats.total_inquiries}</p>
                </div>
                <Users className="h-8 w-8 text-[#C5A880]" />
              </div>
            </div>
            <div className="bg-white p-6 shadow-sm border border-[#E2E8F0]" data-testid="stat-new-inquiries">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#718096]">New Inquiries</p>
                  <p className="text-3xl font-heading font-medium text-[#0B1B3D]">{stats.new_inquiries}</p>
                </div>
                <Mail className="h-8 w-8 text-blue-500" />
              </div>
            </div>
            <div className="bg-white p-6 shadow-sm border border-[#E2E8F0]" data-testid="stat-total-blogs">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#718096]">Total Blogs</p>
                  <p className="text-3xl font-heading font-medium text-[#0B1B3D]">{stats.total_blogs}</p>
                </div>
                <FileText className="h-8 w-8 text-[#C5A880]" />
              </div>
            </div>
            <div className="bg-white p-6 shadow-sm border border-[#E2E8F0]" data-testid="stat-published-blogs">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#718096]">Published</p>
                  <p className="text-3xl font-heading font-medium text-[#0B1B3D]">{stats.published_blogs}</p>
                </div>
                <BarChart3 className="h-8 w-8 text-green-500" />
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex space-x-4 mb-6">
          <Button
            data-testid="tab-inquiries"
            variant={activeTab === "inquiries" ? "default" : "outline"}
            onClick={() => setActiveTab("inquiries")}
            className={activeTab === "inquiries" ? "bg-[#0B1B3D]" : ""}
          >
            <Mail className="h-4 w-4 mr-2" />
            Inquiries
          </Button>
          <Button
            data-testid="tab-blogs"
            variant={activeTab === "blogs" ? "default" : "outline"}
            onClick={() => setActiveTab("blogs")}
            className={activeTab === "blogs" ? "bg-[#0B1B3D]" : ""}
          >
            <FileText className="h-4 w-4 mr-2" />
            Blog Posts
          </Button>
        </div>

        {/* Content */}
        {activeTab === "inquiries" && (
          <div className="bg-white shadow-sm border border-[#E2E8F0]">
            <div className="p-4 border-b border-[#E2E8F0]">
              <h2 className="font-heading text-xl text-[#0B1B3D] font-medium">Contact Inquiries</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full" data-testid="inquiries-table">
                <thead className="bg-[#F3F0EA]">
                  <tr>
                    <th className="text-left p-4 text-sm font-medium text-[#0B1B3D]">Name</th>
                    <th className="text-left p-4 text-sm font-medium text-[#0B1B3D]">Email</th>
                    <th className="text-left p-4 text-sm font-medium text-[#0B1B3D]">Service</th>
                    <th className="text-left p-4 text-sm font-medium text-[#0B1B3D]">Status</th>
                    <th className="text-left p-4 text-sm font-medium text-[#0B1B3D]">Date</th>
                    <th className="text-right p-4 text-sm font-medium text-[#0B1B3D]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {inquiries.map((inquiry) => (
                    <tr key={inquiry.id} className="border-b border-[#E2E8F0] hover:bg-[#FAF9F6]">
                      <td className="p-4 text-[#0B1B3D]">{inquiry.name}</td>
                      <td className="p-4 text-[#4A5568]">{inquiry.email}</td>
                      <td className="p-4 text-[#4A5568]">{serviceLabels[inquiry.service_interest] || inquiry.service_interest}</td>
                      <td className="p-4">
                        <Badge className={getStatusColor(inquiry.status || "new")}>
                          {inquiry.status || "new"}
                        </Badge>
                      </td>
                      <td className="p-4 text-[#718096] text-sm">
                        {new Date(inquiry.timestamp).toLocaleDateString()}
                      </td>
                      <td className="p-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setSelectedInquiry(inquiry)}>
                              <Eye className="h-4 w-4 mr-2" /> View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => updateInquiryStatus(inquiry.id, "contacted")}>
                              <Phone className="h-4 w-4 mr-2" /> Mark Contacted
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => updateInquiryStatus(inquiry.id, "converted")}>
                              <Check className="h-4 w-4 mr-2" /> Mark Converted
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => updateInquiryStatus(inquiry.id, "closed")}>
                              <XIcon className="h-4 w-4 mr-2" /> Mark Closed
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => deleteInquiry(inquiry.id)}
                              className="text-red-600"
                            >
                              <Trash2 className="h-4 w-4 mr-2" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                  {inquiries.length === 0 && (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-[#718096]">
                        No inquiries yet
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "blogs" && (
          <div className="bg-white shadow-sm border border-[#E2E8F0]">
            <div className="p-4 border-b border-[#E2E8F0] flex items-center justify-between">
              <h2 className="font-heading text-xl text-[#0B1B3D] font-medium">Blog Posts</h2>
              <Button 
                data-testid="create-blog-button"
                onClick={() => setIsCreatingBlog(true)}
                className="bg-[#0B1B3D]"
              >
                <Plus className="h-4 w-4 mr-2" /> New Post
              </Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full" data-testid="blogs-table">
                <thead className="bg-[#F3F0EA]">
                  <tr>
                    <th className="text-left p-4 text-sm font-medium text-[#0B1B3D]">Title</th>
                    <th className="text-left p-4 text-sm font-medium text-[#0B1B3D]">Category</th>
                    <th className="text-left p-4 text-sm font-medium text-[#0B1B3D]">Tags</th>
                    <th className="text-left p-4 text-sm font-medium text-[#0B1B3D]">Status</th>
                    <th className="text-left p-4 text-sm font-medium text-[#0B1B3D]">Date</th>
                    <th className="text-right p-4 text-sm font-medium text-[#0B1B3D]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {blogs.map((blog) => (
                    <tr key={blog.id} className="border-b border-[#E2E8F0] hover:bg-[#FAF9F6]">
                      <td className="p-4 text-[#0B1B3D] font-medium">{blog.title}</td>
                      <td className="p-4 text-[#4A5568]">{blog.category}</td>
                      <td className="p-4">
                        <div className="flex flex-wrap gap-1">
                          {(blog.tags || []).slice(0, 2).map((tag, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge className={blog.published ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                          {blog.published ? "Published" : "Draft"}
                        </Badge>
                      </td>
                      <td className="p-4 text-[#718096] text-sm">{blog.date}</td>
                      <td className="p-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => { setSelectedBlog(blog); setIsEditingBlog(true); }}>
                              <Pencil className="h-4 w-4 mr-2" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => deleteBlog(blog.id)}
                              className="text-red-600"
                            >
                              <Trash2 className="h-4 w-4 mr-2" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                  {blogs.length === 0 && (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-[#718096]">
                        No blog posts yet
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Inquiry Detail Modal */}
      <Dialog open={!!selectedInquiry} onOpenChange={() => setSelectedInquiry(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-heading text-2xl">Inquiry Details</DialogTitle>
          </DialogHeader>
          {selectedInquiry && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-[#718096]">Name</p>
                  <p className="font-medium text-[#0B1B3D]">{selectedInquiry.name}</p>
                </div>
                <div>
                  <p className="text-sm text-[#718096]">Email</p>
                  <p className="font-medium text-[#0B1B3D]">{selectedInquiry.email}</p>
                </div>
                <div>
                  <p className="text-sm text-[#718096]">Service Interest</p>
                  <p className="font-medium text-[#0B1B3D]">
                    {serviceLabels[selectedInquiry.service_interest] || selectedInquiry.service_interest}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-[#718096]">Status</p>
                  <Badge className={getStatusColor(selectedInquiry.status || "new")}>
                    {selectedInquiry.status || "new"}
                  </Badge>
                </div>
              </div>
              <div>
                <p className="text-sm text-[#718096] mb-2">Message</p>
                <p className="text-[#0B1B3D] bg-[#F3F0EA] p-4 rounded">{selectedInquiry.message}</p>
              </div>
              <div className="flex items-center text-sm text-[#718096]">
                <Calendar className="h-4 w-4 mr-2" />
                {new Date(selectedInquiry.timestamp).toLocaleString()}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Blog Edit/Create Modal */}
      <BlogModal 
        isOpen={isEditingBlog || isCreatingBlog}
        onClose={() => { setIsEditingBlog(false); setIsCreatingBlog(false); setSelectedBlog(null); }}
        blog={selectedBlog}
        onSave={(savedBlog) => {
          if (selectedBlog) {
            setBlogs(blogs.map(b => b.id === savedBlog.id ? savedBlog : b));
          } else {
            setBlogs([savedBlog, ...blogs]);
          }
          setIsEditingBlog(false);
          setIsCreatingBlog(false);
          setSelectedBlog(null);
        }}
      />
    </div>
  );
};

// Blog Modal Component
const BlogModal = ({ isOpen, onClose, blog, onSave }) => {
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    category: "",
    tags: [],
    featured_image: "",
    date: "",
    read_time: "",
    published: true
  });
  const [tagInput, setTagInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (blog) {
      setFormData({
        title: blog.title || "",
        excerpt: blog.excerpt || "",
        content: blog.content || "",
        category: blog.category || "",
        tags: blog.tags || [],
        featured_image: blog.featured_image || "",
        date: blog.date || "",
        read_time: blog.read_time || "",
        published: blog.published ?? true
      });
    } else {
      setFormData({
        title: "",
        excerpt: "",
        content: "",
        category: "",
        tags: [],
        featured_image: "",
        date: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
        read_time: "5 min read",
        published: true
      });
    }
  }, [blog, isOpen]);

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({ ...formData, tags: [...formData.tags, tagInput.trim()] });
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData({ ...formData, tags: formData.tags.filter(t => t !== tagToRemove) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let response;
      if (blog) {
        response = await axios.patch(
          `${API}/admin/blogs/${blog.id}`,
          formData,
          { withCredentials: true }
        );
      } else {
        response = await axios.post(
          `${API}/admin/blogs`,
          formData,
          { withCredentials: true }
        );
      }
      toast.success(blog ? "Blog updated" : "Blog created");
      onSave(response.data);
    } catch (error) {
      toast.error("Failed to save blog post");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-heading text-2xl">
            {blog ? "Edit Blog Post" : "Create Blog Post"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4" data-testid="blog-form">
          <div>
            <label className="block text-sm font-medium text-[#0B1B3D] mb-2">Title</label>
            <Input
              data-testid="blog-title-input"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Blog post title"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#0B1B3D] mb-2">Excerpt</label>
            <Textarea
              data-testid="blog-excerpt-input"
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              placeholder="Brief description..."
              rows={2}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#0B1B3D] mb-2">Content</label>
            <Textarea
              data-testid="blog-content-input"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Full blog content..."
              rows={6}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#0B1B3D] mb-2">Category</label>
              <Select 
                value={formData.category} 
                onValueChange={(v) => setFormData({ ...formData, category: v })}
              >
                <SelectTrigger data-testid="blog-category-select">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Wealth Management">Wealth Management</SelectItem>
                  <SelectItem value="Tax Consulting">Tax Consulting</SelectItem>
                  <SelectItem value="Financial Advisory">Financial Advisory</SelectItem>
                  <SelectItem value="GST & Compliance">GST & Compliance</SelectItem>
                  <SelectItem value="Investment Planning">Investment Planning</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#0B1B3D] mb-2">Read Time</label>
              <Input
                data-testid="blog-readtime-input"
                value={formData.read_time}
                onChange={(e) => setFormData({ ...formData, read_time: e.target.value })}
                placeholder="5 min read"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#0B1B3D] mb-2">Tags</label>
            <div className="flex gap-2 mb-2 flex-wrap">
              {formData.tags.map((tag, idx) => (
                <Badge key={idx} variant="secondary" className="flex items-center gap-1">
                  {tag}
                  <XIcon className="h-3 w-3 cursor-pointer" onClick={() => removeTag(tag)} />
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="Add a tag"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              />
              <Button type="button" variant="outline" onClick={addTag}>
                <Tag className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#0B1B3D] mb-2">Featured Image URL</label>
            <Input
              data-testid="blog-image-input"
              value={formData.featured_image || ""}
              onChange={(e) => setFormData({ ...formData, featured_image: e.target.value })}
              placeholder="https://..."
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="published"
              checked={formData.published}
              onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
              className="rounded"
            />
            <label htmlFor="published" className="text-sm text-[#0B1B3D]">Published</label>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              data-testid="blog-submit-button"
              type="submit" 
              disabled={isSubmitting}
              className="bg-[#0B1B3D]"
            >
              {isSubmitting ? "Saving..." : (blog ? "Update" : "Create")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AdminDashboard;
