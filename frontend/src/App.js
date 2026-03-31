import React, { useEffect, useState } from "react";
import "@/App.css";
import axios from "axios";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { 
  Menu, 
  X, 
  Phone, 
  Mail, 
  MapPin, 
  TrendingUp, 
  Calculator, 
  Briefcase, 
  FileText, 
  PiggyBank,
  ArrowRight,
  Clock,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Logo component
const Logo = () => (
  <img 
    src="https://customer-assets.emergentagent.com/job_70c5e674-0507-43de-b39d-b6c0f0b963d9/artifacts/nrcv03h6_logo.png" 
    alt="Unovia Consulting"
    className="h-12 w-auto"
    data-testid="logo"
  />
);

// Navigation Component
const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: "#about", label: "About" },
    { href: "#services", label: "Services" },
    { href: "#team", label: "Team" },
    { href: "#insights", label: "Insights" },
    { href: "#contact", label: "Contact" },
  ];

  return (
    <nav 
      data-testid="navigation"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'nav-glass shadow-sm' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <a href="#" className="flex-shrink-0" data-testid="nav-logo">
            <Logo />
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                data-testid={`nav-${link.label.toLowerCase()}`}
                className="text-[#0B1B3D] font-medium text-sm tracking-wide hover:text-[#1A2C5B] transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Button 
              data-testid="nav-cta-button"
              className="bg-[#0B1B3D] text-[#FAF9F6] px-6 py-2 rounded-none hover:bg-[#1A2C5B] transition-all"
              onClick={() => document.getElementById('contact').scrollIntoView({ behavior: 'smooth' })}
            >
              Consult With Us
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            data-testid="mobile-menu-button"
            className="md:hidden p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-[#FAF9F6] border-t border-[#E2E8F0] mobile-menu-enter">
            <div className="py-4 space-y-2">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  data-testid={`mobile-nav-${link.label.toLowerCase()}`}
                  className="block px-4 py-3 text-[#0B1B3D] font-medium hover:bg-[#F3F0EA] transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <div className="px-4 pt-2">
                <Button 
                  className="w-full bg-[#0B1B3D] text-[#FAF9F6] rounded-none"
                  onClick={() => {
                    document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
                    setIsMobileMenuOpen(false);
                  }}
                >
                  Consult With Us
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

// Hero Section
const HeroSection = () => {
  return (
    <section 
      data-testid="hero-section"
      className="section-primary min-h-screen flex items-center pt-20"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-8 animate-fade-in-up">
            <p className="text-sm uppercase tracking-[0.2em] text-[#C5A880] font-medium">
              Wealth Management & Tax Consulting
            </p>
            <h1 className="font-heading text-5xl sm:text-6xl lg:text-7xl tracking-tight leading-none text-[#0B1B3D] font-medium">
              Preserving Wealth,<br />
              <span className="text-[#1A2C5B]">Optimizing Tax.</span>
            </h1>
            <p className="text-lg text-[#4A5568] leading-relaxed max-w-lg pl-0 md:pl-8 border-l-0 md:border-l-2 border-[#C5A880]">
              Established in Kolkata by a team of CAs and MBAs with over 10 years of domain expertise. 
              We provide comprehensive financial solutions tailored to your unique needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button 
                data-testid="hero-cta-primary"
                className="bg-[#0B1B3D] text-[#FAF9F6] px-8 py-6 rounded-none text-base hover:bg-[#1A2C5B] transition-all group"
                onClick={() => document.getElementById('contact').scrollIntoView({ behavior: 'smooth' })}
              >
                Schedule a Consultation
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                data-testid="hero-cta-secondary"
                variant="outline"
                className="border-[#0B1B3D] text-[#0B1B3D] px-8 py-6 rounded-none text-base hover:bg-[#0B1B3D] hover:text-[#FAF9F6] transition-all"
                onClick={() => document.getElementById('services').scrollIntoView({ behavior: 'smooth' })}
              >
                Explore Services
              </Button>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative animate-fade-in animation-delay-200">
            <div className="aspect-[4/5] overflow-hidden image-frame">
              <img 
                src="https://images.unsplash.com/photo-1555238920-7a6bea18473b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzMzl8MHwxfHNlYXJjaHwyfHxtb2Rlcm4lMjBnbGFzcyUyMGFyY2hpdGVjdHVyZSUyMHNreXNjcmFwZXJ8ZW58MHx8fHwxNzc0OTc5MTU3fDA&ixlib=rb-4.1.0&q=85"
                alt="Modern Architecture"
                className="w-full h-full object-cover"
                data-testid="hero-image"
              />
            </div>
            {/* Floating accent */}
            <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-[#C5A880] opacity-20"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

// About Section
const AboutSection = () => {
  return (
    <section 
      id="about" 
      data-testid="about-section"
      className="section-secondary py-24 md:py-32 relative overflow-hidden"
    >
      {/* Large background number */}
      <div className="absolute top-0 right-0 large-number text-[#0B1B3D] select-none pointer-events-none">
        10+
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
          {/* Image */}
          <div className="relative animate-fade-in-up">
            <div className="overflow-hidden image-frame border border-[#E2E8F0]">
              <img 
                src="https://images.pexels.com/photos/8729937/pexels-photo-8729937.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
                alt="Professional Team"
                className="w-full h-auto object-cover"
                data-testid="about-image"
              />
            </div>
            {/* Offset shadow element */}
            <div className="absolute -bottom-4 -right-4 w-full h-full bg-[#0B1B3D] opacity-5 -z-10"></div>
          </div>

          {/* Content */}
          <div className="space-y-6 animate-fade-in-up animation-delay-200">
            <p className="text-sm uppercase tracking-[0.2em] text-[#C5A880] font-medium">
              About Unovia
            </p>
            <h2 className="font-heading text-4xl sm:text-5xl tracking-tight leading-tight text-[#0B1B3D] font-medium">
              A Decade of Excellence in Financial Advisory
            </h2>
            <p className="text-[#4A5568] leading-relaxed">
              Unovia Consulting was established in 2025 in Kolkata, West Bengal, bringing together a 
              distinguished team of Chartered Accountants and MBA professionals. With combined domain 
              expertise spanning over 10 years, we offer unparalleled wealth management and tax 
              consulting services.
            </p>
            <p className="text-[#4A5568] leading-relaxed">
              Our philosophy centers on building lasting relationships with our clients, understanding 
              their unique financial goals, and crafting personalized strategies that stand the test 
              of time.
            </p>
            
            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-8 border-t border-[#E2E8F0]">
              <div data-testid="stat-years">
                <p className="font-heading text-4xl text-[#0B1B3D] font-medium">10+</p>
                <p className="text-sm text-[#718096] mt-1">Years Expertise</p>
              </div>
              <div data-testid="stat-team">
                <p className="font-heading text-4xl text-[#0B1B3D] font-medium">CA</p>
                <p className="text-sm text-[#718096] mt-1">& MBA Team</p>
              </div>
              <div data-testid="stat-location">
                <p className="font-heading text-4xl text-[#0B1B3D] font-medium">2025</p>
                <p className="text-sm text-[#718096] mt-1">Established</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Services Section
const ServicesSection = () => {
  const services = [
    {
      icon: TrendingUp,
      title: "Wealth Management",
      description: "Strategic portfolio management and investment advisory services to grow and protect your wealth across market cycles."
    },
    {
      icon: Calculator,
      title: "Tax Consulting & Planning",
      description: "Comprehensive tax planning strategies to optimize your tax liability while ensuring full compliance with regulations."
    },
    {
      icon: Briefcase,
      title: "Financial Advisory",
      description: "Holistic financial guidance covering retirement planning, estate planning, and long-term wealth creation strategies."
    },
    {
      icon: FileText,
      title: "GST & Compliance",
      description: "End-to-end GST compliance services including registration, filing, audits, and advisory on complex GST matters."
    },
    {
      icon: PiggyBank,
      title: "Investment Planning",
      description: "Tailored investment strategies across asset classes to achieve your financial goals with optimal risk-adjusted returns."
    },
    {
      icon: ArrowRight,
      title: "Get Started",
      description: "Ready to take control of your financial future? Schedule a consultation with our expert team today.",
      isCta: true
    }
  ];

  return (
    <section 
      id="services" 
      data-testid="services-section"
      className="section-primary py-24 md:py-32"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in-up">
          <p className="text-sm uppercase tracking-[0.2em] text-[#C5A880] font-medium mb-4">
            Our Services
          </p>
          <h2 className="font-heading text-4xl sm:text-5xl tracking-tight leading-tight text-[#0B1B3D] font-medium">
            Comprehensive Financial Solutions
          </h2>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 border-t border-l border-[#0B1B3D]/10">
          {services.map((service, index) => (
            <div 
              key={index}
              data-testid={`service-${index}`}
              className={`service-card p-8 md:p-10 ${
                service.isCta ? 'bg-[#0B1B3D] text-[#FAF9F6]' : ''
              }`}
            >
              <service.icon 
                className={`h-8 w-8 mb-6 ${
                  service.isCta ? 'text-[#C5A880]' : 'text-[#0B1B3D]'
                }`} 
              />
              <h3 className={`font-heading text-2xl font-medium mb-4 ${
                service.isCta ? 'text-[#FAF9F6]' : 'text-[#0B1B3D]'
              }`}>
                {service.title}
              </h3>
              <p className={`leading-relaxed ${
                service.isCta ? 'text-[#FAF9F6]/80' : 'text-[#4A5568]'
              }`}>
                {service.description}
              </p>
              {service.isCta && (
                <Button 
                  data-testid="services-cta-button"
                  className="mt-6 bg-[#C5A880] text-[#0B1B3D] rounded-none hover:bg-[#D4B896] transition-all"
                  onClick={() => document.getElementById('contact').scrollIntoView({ behavior: 'smooth' })}
                >
                  Contact Us
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Team Section
const TeamSection = () => {
  return (
    <section 
      id="team" 
      data-testid="team-section"
      className="section-secondary py-24 md:py-32"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in-up">
          <p className="text-sm uppercase tracking-[0.2em] text-[#C5A880] font-medium mb-4">
            Our Team
          </p>
          <h2 className="font-heading text-4xl sm:text-5xl tracking-tight leading-tight text-[#0B1B3D] font-medium">
            Expert Leadership
          </h2>
        </div>

        {/* Team Image with overlapping text */}
        <div className="relative">
          <div className="overflow-hidden image-frame">
            <img 
              src="https://images.pexels.com/photos/7413935/pexels-photo-7413935.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
              alt="Team Meeting"
              className="w-full h-[400px] md:h-[500px] object-cover"
              data-testid="team-image"
            />
          </div>

          {/* Overlapping cards */}
          <div className="md:absolute md:bottom-0 md:left-0 md:right-0 md:transform md:translate-y-1/2">
            <div className="grid md:grid-cols-3 gap-6 mt-6 md:mt-0 px-0 md:px-12">
              {/* Card 1 */}
              <div 
                data-testid="team-card-ca"
                className="bg-[#FAF9F6] p-6 shadow-lg border border-[#E2E8F0]"
              >
                <h3 className="font-heading text-2xl text-[#0B1B3D] font-medium mb-2">
                  Chartered Accountants
                </h3>
                <p className="text-[#4A5568] text-sm leading-relaxed">
                  Expert CAs with deep knowledge in taxation, auditing, and financial compliance across industries.
                </p>
              </div>

              {/* Card 2 */}
              <div 
                data-testid="team-card-mba"
                className="bg-[#0B1B3D] p-6 shadow-lg"
              >
                <h3 className="font-heading text-2xl text-[#FAF9F6] font-medium mb-2">
                  MBA Professionals
                </h3>
                <p className="text-[#FAF9F6]/80 text-sm leading-relaxed">
                  Strategic thinkers with expertise in wealth management, investment analysis, and financial planning.
                </p>
              </div>

              {/* Card 3 */}
              <div 
                data-testid="team-card-kolkata"
                className="bg-[#FAF9F6] p-6 shadow-lg border border-[#E2E8F0]"
              >
                <h3 className="font-heading text-2xl text-[#0B1B3D] font-medium mb-2">
                  Kolkata Based
                </h3>
                <p className="text-[#4A5568] text-sm leading-relaxed">
                  Proudly serving clients from Kolkata, West Bengal with a deep understanding of local business landscape.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Spacer for overlapping cards on desktop */}
        <div className="hidden md:block h-32"></div>
      </div>
    </section>
  );
};

// Blog/Insights Section
const InsightsSection = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        // First try to seed blogs
        await axios.post(`${API}/blogs/seed`);
        // Then fetch them
        const response = await axios.get(`${API}/blogs`);
        setBlogs(response.data);
      } catch (error) {
        console.error('Error fetching blogs:', error);
        // Use fallback data
        setBlogs([
          {
            id: "1",
            title: "Navigating GST Changes in 2026",
            excerpt: "Understanding the latest amendments to GST regulations and how they impact your business compliance.",
            category: "GST & Compliance",
            date: "December 2025",
            read_time: "5 min read"
          },
          {
            id: "2",
            title: "Wealth Preservation for HNWIs",
            excerpt: "Strategic approaches to protecting and growing wealth for high net worth individuals.",
            category: "Wealth Management",
            date: "December 2025",
            read_time: "7 min read"
          },
          {
            id: "3",
            title: "Corporate Tax Planning Strategies",
            excerpt: "Essential tax planning techniques for corporations looking to optimize their tax liability.",
            category: "Tax Consulting",
            date: "November 2025",
            read_time: "6 min read"
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  return (
    <section 
      id="insights" 
      data-testid="insights-section"
      className="section-primary py-24 md:py-32"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-16">
          <div className="animate-fade-in-up">
            <p className="text-sm uppercase tracking-[0.2em] text-[#C5A880] font-medium mb-4">
              Insights
            </p>
            <h2 className="font-heading text-4xl sm:text-5xl tracking-tight leading-tight text-[#0B1B3D] font-medium">
              Latest from Our Experts
            </h2>
          </div>
          <Button 
            data-testid="view-all-insights"
            variant="outline"
            className="hidden md:flex border-[#0B1B3D] text-[#0B1B3D] rounded-none mt-6 md:mt-0 hover:bg-[#0B1B3D] hover:text-[#FAF9F6]"
          >
            View All Insights
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        {/* Blog Grid */}
        {loading ? (
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-[#E2E8F0] h-4 w-24 mb-4"></div>
                <div className="bg-[#E2E8F0] h-8 w-full mb-3"></div>
                <div className="bg-[#E2E8F0] h-16 w-full mb-4"></div>
                <div className="bg-[#E2E8F0] h-4 w-32"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {blogs.map((blog, index) => (
              <article 
                key={blog.id}
                data-testid={`blog-${index}`}
                className="blog-card border-t border-[#E2E8F0] pt-6 cursor-pointer"
              >
                <p className="text-sm text-[#C5A880] font-medium mb-3">
                  {blog.category}
                </p>
                <h3 className="font-heading text-2xl text-[#0B1B3D] font-medium mb-3 hover:text-[#1A2C5B] transition-colors">
                  {blog.title}
                </h3>
                <p className="text-[#4A5568] text-sm leading-relaxed mb-4">
                  {blog.excerpt}
                </p>
                <div className="flex items-center text-sm text-[#718096]">
                  <Clock className="h-4 w-4 mr-2" />
                  <span>{blog.read_time}</span>
                  <span className="mx-2">•</span>
                  <span>{blog.date}</span>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Mobile view all button */}
        <div className="md:hidden mt-8 text-center">
          <Button 
            variant="outline"
            className="border-[#0B1B3D] text-[#0B1B3D] rounded-none hover:bg-[#0B1B3D] hover:text-[#FAF9F6]"
          >
            View All Insights
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
};

// Contact Section
const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    service_interest: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.service_interest || !formData.message) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);
    try {
      await axios.post(`${API}/contact`, formData);
      toast.success('Thank you! We will get back to you soon.');
      setFormData({
        name: '',
        email: '',
        service_interest: '',
        message: ''
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section 
      id="contact" 
      data-testid="contact-section"
      className="section-navy py-24 md:py-32"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid md:grid-cols-2 gap-16 md:gap-24">
          {/* Contact Info */}
          <div className="text-[#FAF9F6]">
            <p className="text-sm uppercase tracking-[0.2em] text-[#C5A880] font-medium mb-4">
              Get in Touch
            </p>
            <h2 className="font-heading text-4xl sm:text-5xl tracking-tight leading-tight font-medium mb-8">
              Let's Discuss Your Financial Goals
            </h2>
            <p className="text-[#FAF9F6]/80 leading-relaxed mb-12">
              Ready to take the next step in your financial journey? Our team of experts is here 
              to help you navigate complex financial decisions with confidence.
            </p>

            {/* Contact Details */}
            <div className="space-y-6">
              <a 
                href="mailto:Connect@unovia.in"
                data-testid="contact-email"
                className="flex items-center text-[#FAF9F6] hover:text-[#C5A880] transition-colors"
              >
                <Mail className="h-5 w-5 mr-4 text-[#C5A880]" />
                <span>Connect@unovia.in</span>
              </a>
              <a 
                href="tel:+917278671467"
                data-testid="contact-phone"
                className="flex items-center text-[#FAF9F6] hover:text-[#C5A880] transition-colors"
              >
                <Phone className="h-5 w-5 mr-4 text-[#C5A880]" />
                <span>+91 72786 71467</span>
              </a>
              <div 
                data-testid="contact-address"
                className="flex items-start text-[#FAF9F6]"
              >
                <MapPin className="h-5 w-5 mr-4 mt-1 text-[#C5A880]" />
                <span>Kolkata, West Bengal, India</span>
              </div>
            </div>

            {/* Kolkata Image */}
            <div className="mt-12 overflow-hidden opacity-50">
              <img 
                src="https://images.unsplash.com/photo-1648964562779-36b7231fa44e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzV8MHwxfHNlYXJjaHw0fHxrb2xrYXRhJTIwY2l0eXNjYXBlJTIwc3VucmlzZSUyMHNreWxpbmV8ZW58MHx8fHwxNzc0OTc5MTI3fDA&ixlib=rb-4.1.0&q=85"
                alt="Kolkata Skyline"
                className="w-full h-32 object-cover"
                data-testid="footer-image"
              />
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <form onSubmit={handleSubmit} className="space-y-6" data-testid="contact-form">
              <div>
                <label className="block text-[#FAF9F6]/60 text-sm mb-2">Your Name</label>
                <Input 
                  data-testid="input-name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="John Doe"
                  className="w-full bg-transparent border-0 border-b border-[#FAF9F6]/30 rounded-none text-[#FAF9F6] placeholder:text-[#FAF9F6]/40 focus:border-[#C5A880] focus-visible:ring-0 focus-visible:ring-offset-0 px-0"
                />
              </div>

              <div>
                <label className="block text-[#FAF9F6]/60 text-sm mb-2">Email Address</label>
                <Input 
                  data-testid="input-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="john@example.com"
                  className="w-full bg-transparent border-0 border-b border-[#FAF9F6]/30 rounded-none text-[#FAF9F6] placeholder:text-[#FAF9F6]/40 focus:border-[#C5A880] focus-visible:ring-0 focus-visible:ring-offset-0 px-0"
                />
              </div>

              <div>
                <label className="block text-[#FAF9F6]/60 text-sm mb-2">Service Interest</label>
                <Select 
                  value={formData.service_interest} 
                  onValueChange={(value) => setFormData({...formData, service_interest: value})}
                >
                  <SelectTrigger 
                    data-testid="select-service"
                    className="w-full bg-transparent border-0 border-b border-[#FAF9F6]/30 rounded-none text-[#FAF9F6] focus:ring-0 focus:ring-offset-0 px-0 [&>span]:text-left"
                  >
                    <SelectValue placeholder="Select a service" className="text-[#FAF9F6]/40" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1A2C5B] border-[#FAF9F6]/20">
                    <SelectItem value="wealth-management" className="text-[#FAF9F6] focus:bg-[#0B1B3D] focus:text-[#FAF9F6]">Wealth Management</SelectItem>
                    <SelectItem value="tax-consulting" className="text-[#FAF9F6] focus:bg-[#0B1B3D] focus:text-[#FAF9F6]">Tax Consulting & Planning</SelectItem>
                    <SelectItem value="financial-advisory" className="text-[#FAF9F6] focus:bg-[#0B1B3D] focus:text-[#FAF9F6]">Financial Advisory</SelectItem>
                    <SelectItem value="gst-compliance" className="text-[#FAF9F6] focus:bg-[#0B1B3D] focus:text-[#FAF9F6]">GST & Compliance</SelectItem>
                    <SelectItem value="investment-planning" className="text-[#FAF9F6] focus:bg-[#0B1B3D] focus:text-[#FAF9F6]">Investment Planning</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-[#FAF9F6]/60 text-sm mb-2">Your Message</label>
                <Textarea 
                  data-testid="input-message"
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  placeholder="Tell us about your financial goals..."
                  rows={4}
                  className="w-full bg-transparent border-0 border-b border-[#FAF9F6]/30 rounded-none text-[#FAF9F6] placeholder:text-[#FAF9F6]/40 focus:border-[#C5A880] focus-visible:ring-0 focus-visible:ring-offset-0 px-0 resize-none"
                />
              </div>

              <Button 
                data-testid="submit-button"
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#C5A880] text-[#0B1B3D] rounded-none py-6 text-base font-medium hover:bg-[#D4B896] transition-all disabled:opacity-50"
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </Button>
            </form>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-24 pt-8 border-t border-[#FAF9F6]/10">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center mb-4 md:mb-0">
              <Logo />
            </div>
            <p className="text-[#FAF9F6]/50 text-sm" data-testid="copyright">
              © 2025 Unovia Consulting. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

// Main App Component
function App() {
  return (
    <div className="App">
      <Toaster position="top-right" richColors />
      <Navigation />
      <main>
        <HeroSection />
        <AboutSection />
        <ServicesSection />
        <TeamSection />
        <InsightsSection />
        <ContactSection />
      </main>
    </div>
  );
}

export default App;
