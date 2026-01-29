import { useEffect, useState, useRef } from "react";
import { getVideos, getServices, submitContactForm } from "../api/api";
import VideoModal from "../components/VideoModal";
import { 
  MessageCircle, 
  Mail, 
  Phone, 
  PlayCircle,
  ChevronDown,
  Star
} from "lucide-react";
import * as lucideIcons from "lucide-react";

export default function Home() {
  const [videos, setVideos] = useState([]);
  const [services, setServices] = useState([]);
  const [activeVideo, setActiveVideo] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedVideoType, setSelectedVideoType] = useState(null);
  const [servicesMenuOpen, setServicesMenuOpen] = useState(false);
  const [selectedServices, setSelectedServices] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    business_name: "",
    insta_id: "",
    city: "",
    email: "",
    message: "",
    services: []
  });
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });
  const servicesMenuRef = useRef(null);

  // Site settings (can be fetched from API later)
  const siteSettings = {
    hero_title: null,
    hero_subtitle: null,
    whatsapp_number: "919548190688",
    contact_email: "alluremarketing24@gmail.com",
    contact_phone: "+919548190688"
  };

  useEffect(() => {
    getVideos().then(setVideos);
    getServices().then(setServices);
  }, []);

  // Extract unique video types from videos
  const videoTypes = Array.from(
    new Map(
      videos
        .filter(v => v.video_types)
        .map(v => [v.video_types.id, v.video_types])
    ).values()
  );

  // Filter videos by type
  const filteredVideos = selectedVideoType
    ? videos.filter(v => v.video_types?.id === selectedVideoType)
    : videos;

  // Handle service selection
  const handleServiceToggle = (serviceId) => {
    setSelectedServices(prev => 
      prev.includes(serviceId)
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const submitData = {
      ...formData,
      services: selectedServices
    };

    try {
      const result = await submitContactForm(submitData);
      showToast("Message sent successfully!", "success");
      // Reset form
      setFormData({
        name: "",
        contact: "",
        business_name: "",
        insta_id: "",
        city: "",
        email: "",
        message: "",
        services: []
      });
      setSelectedServices([]);
    } catch (error) {
      showToast("Failed to send message. Please try again.", "error");
    }
  };

  // Show toast notification
  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: "", type: "success" });
    }, 3000);
  };

  // Close services menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (servicesMenuRef.current && !servicesMenuRef.current.contains(event.target)) {
        setServicesMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Get icon component
  const getIconComponent = (iconName) => {
    const IconComponent = lucideIcons[iconName];
    return IconComponent || lucideIcons.Star;
  };

  return (
    <>
      {/* Hidden video element for local thumbnail generation */}
      <video className="video-thumbnail-generator hidden" id="thumbnailGenerator" muted></video>
      <canvas className="video-thumbnail-generator hidden" id="thumbnailCanvas"></canvas>

      {/* Fixed Navigation */}
      <nav className="fixed top-0 w-full z-50 glass-effect">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
          {/* Enhanced Logo */}
          <div className="flex items-center space-x-3">
            <div className="logo-container">
              <img src="/logo.jpeg" alt="Allure Marketing Logo" />
            </div>
            <div>
              <div className="text-xl font-bold gradient-text">ALLURE</div>
              <div className="text-xs text-gray-400 -mt-1">MARKETING</div>
            </div>
          </div>

          {/* Desktop Menu */}
          <ul className="hidden md:flex space-x-8">
            <li><a href="#hero" className="text-white hover:text-yellow-400 transition-colors">Home</a></li>
            <li><a href="#review" className="text-white hover:text-yellow-400 transition-colors">Experience</a></li>
            <li><a href="#services" className="text-white hover:text-yellow-400 transition-colors">Services</a></li>
            <li><a href="#portfolio" className="text-white hover:text-yellow-400 transition-colors">Portfolio</a></li>
            <li><a href="#contact" className="text-white hover:text-yellow-400 transition-colors">Contact</a></li>
          </ul>

          {/* Fixed Mobile Menu Button */}
          <div 
            className={`md:hidden hamburger ${mobileMenuOpen ? 'active' : ''}`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>

        {/* Fixed Mobile Menu */}
        <div 
          className={`mobile-menu fixed top-0 left-0 w-full h-screen md:hidden z-40 ${mobileMenuOpen ? 'active' : ''}`}
          onClick={() => setMobileMenuOpen(false)}
        >
            <div className="flex flex-col items-center justify-center h-full space-y-8">
              <a href="#hero" className="text-white hover:text-yellow-400 transition-colors text-3xl font-light">Home</a>
              <a href="#review" className="text-white hover:text-yellow-400 transition-colors text-3xl font-light">Experience</a>
              <a href="#services" className="text-white hover:text-yellow-400 transition-colors text-3xl font-light">Services</a>
              <a href="#portfolio" className="text-white hover:text-yellow-400 transition-colors text-3xl font-light">Portfolio</a>
              <a href="#contact" className="text-white hover:text-yellow-400 transition-colors text-3xl font-light">Contact</a>
            </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="hero" className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20">
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-600/10 to-yellow-400/10"></div>
        <div className="text-center z-10 px-4 sm:px-6 max-w-6xl mx-auto">
          <div className="floating">
            <h1 className="hero-title text-4xl sm:text-5xl md:text-7xl font-bold mb-6">
              {siteSettings.hero_title ? (
                <span dangerouslySetInnerHTML={{ __html: siteSettings.hero_title }} />
              ) : (
                <>
                  Allure <span className="gradient-text">Marketing</span><br className="hidden sm:block" />
                  That <span className="gradient-text">Elevates</span>
                </>
              )}
            </h1>
          </div>
          <p className="text-lg sm:text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
            {siteSettings.hero_subtitle || 
              "ELEVATE YOUR BRAND WITH STUNNING DIGITAL SOLUTIONS. Allure Marketing crafts premium content, high-ROI Meta ads, and strategic influencer campaigns to drive real growth."}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a href="#contact">
              <button className="w-full sm:w-auto px-8 py-4 gold-gradient rounded-full text-black font-semibold hover-glow">
                Start Your Project
              </button>
            </a>
            <a href="#portfolio">
              <button className="w-full sm:w-auto px-8 py-4 glass-effect rounded-full text-white font-semibold hover-glow">
                View Our Work
              </button>
            </a>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-4 sm:left-10 w-16 sm:w-20 h-16 sm:h-20 gold-gradient rounded-full opacity-20 floating"></div>
        <div className="absolute bottom-20 right-4 sm:right-10 w-24 sm:w-32 h-24 sm:h-32 gold-gradient rounded-full opacity-20 floating" style={{ animationDelay: '-3s' }}></div>
      </section>

      {/* Enhanced Services Section */}
<section id="services" className="py-16 sm:py-20 px-4 sm:px-6">
  <div className="max-w-7xl mx-auto">
    <div className="text-center mb-12 sm:mb-16">
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold gradient-text mb-4">Our Services</h2>
      <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto">
        Comprehensive branding solutions that elevate your business to extraordinary heights
      </p>
    </div>

    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
      {services.map(service => {
        // service_icons is an ARRAY with one object
        const icon = service.service_icons?.[0]; // Get first element from array
        
        // Get the icon component dynamically
        let IconComponent = null;
        if (icon?.is_lucide && icon?.icon_class) {
          // Convert icon_class to PascalCase
          const iconName = icon.icon_class
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join('');
          
          IconComponent = lucideIcons[iconName];
        }
        
        // Extract key points from description
        const extractKeyPoints = (description) => {
          if (!description) return [];
          const includesMatch = description.match(/Includes (.+)\./);
          if (includesMatch) {
            return includesMatch[1].split(', ').map(point => point.trim()).filter(Boolean);
          }
          return [];
        };
        
        const keyPoints = service.key_points || extractKeyPoints(service.description);
        const mainDescription = service.description?.split('Includes')[0]?.trim() || service.description;
        
        return (
          <div key={service.id} className="service-card p-6 sm:p-8 rounded-2xl">
            <div className="service-icon w-16 h-16 rounded-full flex items-center justify-center mb-6">
              {IconComponent ? (
                <IconComponent className="w-8 h-8" />
              ) : icon?.icon_image ? (
                <img src={icon.icon_image} alt={icon.name} className="w-8 h-8" />
              ) : (
                <Star className="w-8 h-8" />
              )}
            </div>
            <h3 className="text-xl sm:text-2xl font-bold mb-4">{service.name}</h3>
            <p className="text-gray-400 mb-6 text-sm sm:text-base">{mainDescription}</p>
            {keyPoints && keyPoints.length > 0 && (
              <ul className="text-xs sm:text-sm text-gray-300 space-y-3">
                {keyPoints.map((point, i) => (
                  <li key={i} className="flex items-center">
                    <span className="w-2 h-2 gold-gradient rounded-full mr-3"></span>
                    {point}
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
      })}
    </div>
  </div>
</section>

      {/* Professional Portfolio Section */}
      <section id="portfolio" className="py-16 sm:py-20 px-4 sm:px-6 bg-gradient-to-b from-transparent to-gray-900/20">
        <div className="max-w-7xl mx-auto">
          {/* Title */}
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold gradient-text mb-4">
              Featured Reels & Content
            </h2>
            <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto">
              Explore our portfolio of viral reels, social media content, and brand storytelling
            </p>
          </div>

          {/* Category Filter */}
          {videoTypes.length > 0 && (
            <div className="flex justify-center gap-4 mb-8 flex-wrap">
              <button
                className={`filter-btn px-4 py-2 rounded-full border transition-all ${
                  selectedVideoType === null
                    ? 'bg-yellow-500/20 border-yellow-500 text-yellow-400'
                    : 'border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/20'
                }`}
                onClick={() => setSelectedVideoType(null)}
              >
                All
              </button>
              {videoTypes.map(videoType => (
                <button
                  key={videoType.id}
                  className={`filter-btn px-4 py-2 rounded-full border transition-all ${
                    selectedVideoType === videoType.id
                      ? 'bg-yellow-500/20 border-yellow-500 text-yellow-400'
                      : 'border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/20'
                  }`}
                  onClick={() => setSelectedVideoType(videoType.id)}
                >
                  {videoType.name}
                </button>
              ))}
            </div>
          )}

          {/* Portfolio Grid */}
          <div className="portfolio-grid" id="video-grid">
            {filteredVideos.length > 0 ? (
              filteredVideos.map(video => (
                <div
                  key={video.id}
                  className="reel-container"
                  data-video-src={video.video_url}
                  onClick={() => setActiveVideo(video)}
                >
                  {video.thumbnail_url ? (
                    <img
                      src={video.thumbnail_url}
                      alt={video.video_name}
                      className="reel-thumbnail"
                    />
                  ) : (
                    <div className="reel-thumbnail bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                      <PlayCircle className="w-16 h-16 text-yellow-500" />
                    </div>
                  )}
                  <div className="reel-overlay">
                    <div className="reel-play-button"></div>
                    <div className="mt-auto">
                      <h3 className="text-lg font-bold text-white mb-2">
                        {video.video_name}
                      </h3>
                      <p className="text-sm text-gray-300 mb-4">
                        {video.video_description?.substring(0, 100)}
                        {video.video_description?.length > 100 ? '...' : ''}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-400 col-span-full">No featured videos available yet.</p>
            )}
          </div>
        </div>
      </section>

      {/* Your Experience, Our Pride Section */}
      <section id="review" className="py-16 sm:py-20 px-4 sm:px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Side - Text Content */}
            <div className="lg:pr-8">
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
                Your <span className="gradient-text">Experience</span>,<br />
                Our <span className="gradient-text">Pride</span>
              </h2>
              <p className="text-lg sm:text-xl text-gray-300 mb-8 leading-relaxed">
                Hear from our growing base of clients who have trusted Allure Marketing to fuel their startup growth.
              </p>
            </div>

            {/* Right Side - Moving Testimonials */}
            <div className="testimonials-container">
              {/* First Row - Moving Left */}
              <div className="testimonial-row testimonial-row-left">
                <div className="testimonial-track testimonial-row-left">
                  {/* Testimonial Cards */}
                  {[
                    { initials: "RJ", name: "Ritika Jain", role: "E-commerce Owner", text: "Allure's branding helped us set a professional tone for our business and attract new customers.", gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" },
                    { initials: "AK", name: "Aniket Khurana", role: "Freelancer", text: "Their Google Ads campaigns helped me target the right audience and scale my freelance business.", gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)" },
                    { initials: "MP", name: "Maya Patel", role: "Boutique Owner", text: "They built a beautiful website for our boutique. Our online orders increased significantly!", gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)" }
                  ].map((testimonial, idx) => (
                    <div key={`left-${idx}`} className="testimonial-card-new glass-effect">
                      <div className="testimonial-header">
                        <div className="testimonial-avatar" style={{ background: testimonial.gradient }}>
                          {testimonial.initials}
                        </div>
                        <div>
                          <h4 className="testimonial-name">{testimonial.name}</h4>
                          <p className="testimonial-role">{testimonial.role}</p>
                        </div>
                      </div>
                      <p className="testimonial-text">{testimonial.text}</p>
                    </div>
                  ))}
                  {/* Duplicates for seamless loop */}
                  {[
                    { initials: "RJ", name: "Ritika Jain", role: "E-commerce Owner", text: "Allure's branding helped us set a professional tone for our business and attract new customers.", gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" },
                    { initials: "AK", name: "Aniket Khurana", role: "Freelancer", text: "Their Google Ads campaigns helped me target the right audience and scale my freelance business.", gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)" },
                    { initials: "MP", name: "Maya Patel", role: "Boutique Owner", text: "They built a beautiful website for our boutique. Our online orders increased significantly!", gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)" }
                  ].map((testimonial, idx) => (
                    <div key={`left-dup-${idx}`} className="testimonial-card-new glass-effect">
                      <div className="testimonial-header">
                        <div className="testimonial-avatar" style={{ background: testimonial.gradient }}>
                          {testimonial.initials}
                        </div>
                        <div>
                          <h4 className="testimonial-name">{testimonial.name}</h4>
                          <p className="testimonial-role">{testimonial.role}</p>
                        </div>
                      </div>
                      <p className="testimonial-text">{testimonial.text}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Second Row - Moving Right */}
              <div className="testimonial-row testimonial-row-right">
                <div className="testimonial-track testimonial-row-right">
                  {[
                    { initials: "VT", name: "Vikram Thakur", role: "Tech Entrepreneur", text: "Their website development and branding gave my startup the edge it needed to stand out in the market.", gradient: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)" },
                    { initials: "NS", name: "Neha Sharma", role: "Content Creator", text: "The team worked on my social media campaigns, and I saw a huge engagement boost.", gradient: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)" },
                    { initials: "RB", name: "Rohan Bansal", role: "Real Estate Agent", text: "I highly recommend Allure for new businesses. Their strategies helped increase my local reach.", gradient: "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)" }
                  ].map((testimonial, idx) => (
                    <div key={`right-${idx}`} className="testimonial-card-new glass-effect">
                      <div className="testimonial-header">
                        <div className="testimonial-avatar" style={{ background: testimonial.gradient }}>
                          {testimonial.initials}
                        </div>
                        <div>
                          <h4 className="testimonial-name">{testimonial.name}</h4>
                          <p className="testimonial-role">{testimonial.role}</p>
                        </div>
                      </div>
                      <p className="testimonial-text">{testimonial.text}</p>
                    </div>
                  ))}
                  {/* Duplicates for seamless loop */}
                  {[
                    { initials: "VT", name: "Vikram Thakur", role: "Tech Entrepreneur", text: "Their website development and branding gave my startup the edge it needed to stand out in the market.", gradient: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)" },
                    { initials: "NS", name: "Neha Sharma", role: "Content Creator", text: "The team worked on my social media campaigns, and I saw a huge engagement boost.", gradient: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)" },
                    { initials: "RB", name: "Rohan Bansal", role: "Real Estate Agent", text: "I highly recommend Allure for new businesses. Their strategies helped increase my local reach.", gradient: "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)" }
                  ].map((testimonial, idx) => (
                    <div key={`right-dup-${idx}`} className="testimonial-card-new glass-effect">
                      <div className="testimonial-header">
                        <div className="testimonial-avatar" style={{ background: testimonial.gradient }}>
                          {testimonial.initials}
                        </div>
                        <div>
                          <h4 className="testimonial-name">{testimonial.name}</h4>
                          <p className="testimonial-role">{testimonial.role}</p>
                        </div>
                      </div>
                      <p className="testimonial-text">{testimonial.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Contact Section */}
      <section id="contact" className="py-16 sm:py-20 px-4 sm:px-6 bg-gradient-to-b from-transparent to-gray-900/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="section-title text-3xl sm:text-4xl md:text-5xl font-bold gradient-text mb-4">Let's Elevate</h2>
            <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto">
              Ready to elevate your brand to luxury status? Let's connect and build something extraordinary together.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Contact Form */}
            <div className="glass-effect p-6 sm:p-8 rounded-2xl">
              <h3 className="text-xl sm:text-2xl font-bold mb-6">Get Started Today</h3>
              
              <form id="contactForm" className="contact-form space-y-4" onSubmit={handleSubmit}>
                <div className="grid sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full bg-gray-800 border border-gray-700 text-gray-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    required
                  />
                  <input
                    type="tel"
                    name="contact"
                    placeholder="Contact"
                    value={formData.contact}
                    onChange={handleInputChange}
                    className="w-full bg-gray-800 border border-gray-700 text-gray-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    required
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="business_name"
                    placeholder="Business Name"
                    value={formData.business_name}
                    onChange={handleInputChange}
                    className="w-full bg-gray-800 border border-gray-700 text-gray-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                  <input
                    type="text"
                    name="insta_id"
                    placeholder="Instagram ID"
                    value={formData.insta_id}
                    onChange={handleInputChange}
                    className="w-full bg-gray-800 border border-gray-700 text-gray-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="city"
                    placeholder="City"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full bg-gray-800 border border-gray-700 text-gray-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                  <div className="relative" ref={servicesMenuRef}>
                    <button
                      type="button"
                      onClick={() => setServicesMenuOpen(!servicesMenuOpen)}
                      className="w-full bg-gray-800 border border-gray-700 text-gray-200 rounded-lg px-4 py-3 text-left focus:ring-2 focus:ring-blue-500 focus:outline-none flex items-center justify-between"
                    >
                      <span>
                        {selectedServices.length > 0
                          ? `${selectedServices.length} service${selectedServices.length > 1 ? 's' : ''} selected`
                          : 'Select services'}
                      </span>
                      <ChevronDown className={`w-4 h-4 ml-2 text-gray-400 transition-transform ${servicesMenuOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {servicesMenuOpen && (
                      <div className="z-50 absolute w-full bg-black border border-gray-700 rounded-lg shadow-lg mt-2 max-h-64 overflow-y-auto">
                        <ul className="p-3 space-y-2 text-sm text-gray-200">
                          {services.map(service => (
                            <li key={service.id}>
                              <label className="flex items-center cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={selectedServices.includes(service.id)}
                                  onChange={() => handleServiceToggle(service.id)}
                                  className="w-4 h-4 text-blue-600 bg-gray-900 border-gray-600 rounded focus:ring-2 focus:ring-blue-500"
                                />
                                <span className="ml-2">{service.name}</span>
                              </label>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <p className="text-xs text-gray-400 mt-1">Select one or more options</p>
                  </div>
                </div>

                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full bg-gray-800 border border-gray-700 text-gray-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                />

                <textarea
                  name="message"
                  placeholder="Message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows="4"
                  className="w-full bg-gray-800 border border-gray-700 text-gray-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                ></textarea>

                <button
                  type="submit"
                  className="w-full gold-gradient text-black font-semibold py-3 px-6 rounded-lg hover-glow transition-all duration-300"
                >
                  Send Message
                </button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="space-y-8">
              {/* Contact CTA Box */}
              <div className="glass-effect p-6 sm:p-8 rounded-2xl flex flex-col justify-center items-center text-center">
                <h3 className="text-xl sm:text-2xl font-bold mb-4">Start Your Project Instantly</h3>
                <p className="text-gray-400 mb-6">
                  Ready to elevate your brand? Fill out the form and let's build something extraordinary together.
                </p>
                <a
                  href="#contact"
                  className="flex items-center gap-2 gold-gradient text-black font-semibold text-lg px-6 py-4 rounded-lg hover-glow transition-all duration-300"
                >
                  <MessageCircle className="w-5 h-5" />
                  Contact Us
                </a>
              </div>

              {/* Contact & Social */}
              <div className="glass-effect p-6 sm:p-8 rounded-2xl">
                <h3 className="text-xl sm:text-2xl font-bold mb-6">Get In Touch</h3>
                <div className="space-y-6">
                  <div className="flex items-start">
                    <Mail className="w-6 h-6 mr-4 mt-1 text-white" />
                    <div>
                      <h4 className="font-bold mb-1">Email</h4>
                      <p className="text-gray-400">{siteSettings.contact_email}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Phone className="w-6 h-6 mr-4 mt-1 text-white" />
                    <div>
                      <h4 className="font-bold mb-1">Phone</h4>
                      <p className="text-gray-400 text-sm">
                        {siteSettings.contact_phone} (WhatsApp)
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 sm:py-12 px-4 sm:px-6 bg-black/50 mt-16 sm:mt-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="logo-container">
                  <img src="/logo.jpeg" alt="Allure Marketing Logo" />
                </div>
                <div>
                  <div className="text-lg font-bold gradient-text">ALLURE</div>
                  <div className="text-xs text-gray-400 -mt-1">MARKETING</div>
                </div>
              </div>
              <p className="text-gray-400 text-sm">
                Allure Marketing crafts premium content, high-ROI Meta ads, and strategic influencer campaigns to drive real growth.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Services</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#services" className="hover:text-yellow-400 transition-colors">Website Development</a></li>
                <li><a href="#services" className="hover:text-yellow-400 transition-colors">Google Ads Marketing</a></li>
                <li><a href="#services" className="hover:text-yellow-400 transition-colors">Content Creation</a></li>
                <li><a href="#services" className="hover:text-yellow-400 transition-colors">Branding</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#review" className="hover:text-yellow-400 transition-colors">About Us</a></li>
                <li><a href="#portfolio" className="hover:text-yellow-400 transition-colors">Our Work</a></li>
                <li><a href="#review" className="hover:text-yellow-400 transition-colors">Experience</a></li>
                <li><a href="#contact" className="hover:text-yellow-400 transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-sm text-gray-500">© 2025 Allure Marketing.</p>
          </div>
        </div>
      </footer>

      {/* Video Modal */}
      {activeVideo && (
        <VideoModal video={activeVideo} onClose={() => setActiveVideo(null)} />
      )}

      {/* Toast Notification */}
      {toast.show && (
        <div
          className={`fixed top-6 left-4 z-50 text-white px-6 py-4 rounded-lg shadow-xl transform transition-all duration-500 ease-in-out translate-x-0 opacity-100 ${
            toast.type === 'success' 
              ? 'bg-green-600 border-green-400' 
              : 'bg-red-600 border-red-400'
          } border`}
        >
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              {toast.type === 'success' ? (
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              ) : (
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              )}
            </svg>
            <span className="font-medium">{toast.message}</span>
          </div>
        </div>
      )}
    </>
  );
}