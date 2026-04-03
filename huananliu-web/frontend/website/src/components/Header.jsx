import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useSiteConfig } from '../hooks/useSiteConfig';

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { config } = useSiteConfig();
  
  const navItems = [
    { path: '/about', label: '关于我们' },
    { path: '/consultants', label: '顾问团队' },
    { path: '/cases', label: '成功案例' },
    { path: '/news', label: '留学资讯' },
    { path: '/schools', label: '院校库' },
    { path: '/contact', label: '在线咨询' },
  ];
  
  const servicesItems = [
    { path: '/apply', label: '留学申请', icon: '🎓' },
    { path: '/english-training', label: '英语培训', icon: '📚' },
    { path: '/competition', label: '竞赛规划', icon: '🏆' },
    { path: '/research', label: '科研提升', icon: '🔬' },
  ];

  // Track scroll position
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  const isActive = (path) => location.pathname === path;

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-soft' 
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-18 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center group">
            <div className="relative w-10 h-10 lg:w-12 lg:h-12 rounded-xl overflow-hidden shadow-lg group-hover:shadow-glow transition-shadow duration-300 bg-white">
              <img 
                src={config.logo || '/images/logo.png'} 
                alt={config.site_name || '华南留学'} 
                className="w-full h-full object-contain p-1"
                onError={(e) => {
                  // 如果图片加载失败，显示备用文字LOGO
                  e.target.style.display = 'none';
                  e.target.parentElement.innerHTML = '<span class="flex items-center justify-center w-full h-full bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 text-white font-bold text-xl lg:text-2xl">华</span>';
                }}
              />
            </div>
            <div className="ml-3">
              <span className={`block text-lg lg:text-xl font-bold transition-colors duration-300 ${
                scrolled ? 'text-gray-800' : 'text-gray-800 lg:text-white'
              }`}>
                {config.site_name || '华南留学'}
              </span>
              <span className={`hidden lg:block text-xs transition-colors duration-300 ${
                scrolled ? 'text-gray-500' : 'text-white/70'
              }`}>
                {config.site_slogan || 'South China Study Abroad'}
              </span>
            </div>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {/* 关于我们 */}
            <Link
              to="/about"
              className={`relative px-4 py-2 font-medium text-sm transition-all duration-300 rounded-lg ${
                isActive('/about')
                  ? 'text-primary-600 bg-primary-50'
                  : scrolled
                    ? 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'
                    : 'text-white/90 hover:text-white hover:bg-white/10'
              }`}
            >
              关于我们
            </Link>
            
            {/* 产品和服务下拉菜单 */}
            <div 
              className="relative"
              onMouseEnter={() => setServicesOpen(true)}
              onMouseLeave={() => setServicesOpen(false)}
            >
              <button className={`flex items-center px-4 py-2 font-medium text-sm transition-all duration-300 rounded-lg ${
                servicesItems.some(item => isActive(item.path))
                  ? 'text-primary-600 bg-primary-50'
                  : scrolled
                    ? 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'
                    : 'text-white/90 hover:text-white hover:bg-white/10'
              }`}>
                产品和服务
                <svg className={`w-4 h-4 ml-1.5 transition-transform duration-300 ${servicesOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {servicesOpen && (
                <div className="absolute left-0 top-full pt-2 animate-slide-down">
                  <div className="bg-white rounded-xl shadow-card-hover border border-gray-100 py-2 min-w-[200px] overflow-hidden">
                    {servicesItems.map((item, index) => (
                      <Link
                        key={index}
                        to={item.path}
                        className={`flex items-center px-4 py-3 transition-all duration-200 ${
                          isActive(item.path)
                            ? 'text-primary-600 bg-primary-50'
                            : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'
                        }`}
                      >
                        <span className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mr-3 text-lg">
                          {item.icon}
                        </span>
                        <span className="font-medium text-sm">{item.label}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* 其他导航项 */}
            {navItems.filter(item => item.path !== '/about' && item.path !== '/contact').map(item => (
              <Link
                key={item.path}
                to={item.path}
                className={`relative px-4 py-2 font-medium text-sm transition-all duration-300 rounded-lg ${
                  isActive(item.path)
                    ? 'text-primary-600 bg-primary-50'
                    : scrolled
                      ? 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'
                      : 'text-white/90 hover:text-white hover:bg-white/10'
                }`}
              >
                {item.label}
                {isActive(item.path) && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary-600 rounded-full" />
                )}
              </Link>
            ))}
          </nav>
          
          {/* Contact & CTA */}
          <div className="hidden lg:flex items-center space-x-4">
            <a 
              href="tel:400-888-8888" 
              className={`flex items-center font-medium text-sm transition-colors duration-300 ${
                scrolled ? 'text-gray-600 hover:text-primary-600' : 'text-white/90 hover:text-white'
              }`}
            >
              <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              400-888-8888
            </a>
            <Link
              to="/appointment"
              className={`font-medium text-sm px-5 py-2.5 rounded-xl transition-all duration-300 transform hover:-translate-y-0.5 ${
                isActive('/appointment')
                  ? 'bg-gradient-to-r from-accent-500 to-accent-600 text-white shadow-lg shadow-accent-500/30'
                  : scrolled
                    ? 'text-accent-600 bg-accent-50 hover:bg-accent-100 border border-accent-200'
                    : 'text-white bg-accent-500/90 hover:bg-accent-500 backdrop-blur-sm shadow-lg shadow-accent-500/20'
              }`}
            >
              预约到访
            </Link>
            <Link
              to="/contact"
              className="bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white px-5 py-2.5 rounded-xl font-medium text-sm shadow-lg shadow-primary-500/30 hover:shadow-primary-500/50 transition-all duration-300 transform hover:-translate-y-0.5"
            >
              免费咨询
            </Link>
          </div>
          
          {/* Mobile Menu Button */}
          <button
            className={`lg:hidden p-2 rounded-lg transition-colors ${
              scrolled ? 'text-gray-700 hover:bg-gray-100' : 'text-gray-800 lg:text-white hover:bg-white/10'
            }`}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <div className="w-6 h-6 relative">
              <span className={`absolute left-0 block w-6 h-0.5 bg-current transform transition-all duration-300 ${menuOpen ? 'top-3 rotate-45' : 'top-1'}`} />
              <span className={`absolute left-0 top-3 block w-6 h-0.5 bg-current transition-all duration-300 ${menuOpen ? 'opacity-0' : 'opacity-100'}`} />
              <span className={`absolute left-0 block w-6 h-0.5 bg-current transform transition-all duration-300 ${menuOpen ? 'top-3 -rotate-45' : 'top-5'}`} />
            </div>
          </button>
        </div>
        
        {/* Mobile Navigation */}
        <div className={`lg:hidden overflow-hidden transition-all duration-300 ${menuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}`}>
          <nav className="py-4 border-t border-gray-100">
            <div className="space-y-1">
              {navItems.map(item => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`block px-4 py-3 rounded-lg font-medium transition-colors ${
                    isActive(item.path)
                      ? 'text-primary-600 bg-primary-50'
                      : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              
              <div className="px-4 py-3">
                <div className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">产品和服务</div>
                <div className="space-y-1">
                  {servicesItems.map((item, index) => (
                    <Link
                      key={index}
                      to={item.path}
                      className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                        isActive(item.path)
                          ? 'text-primary-600 bg-primary-50'
                          : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'
                      }`}
                    >
                      <span className="mr-2">{item.icon}</span>
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-100 px-4">
              <a href="tel:400-888-8888" className="flex items-center justify-center text-gray-600 mb-3">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                400-888-8888
              </a>
              <Link
                to="/contact"
                className="block w-full text-center bg-gradient-to-r from-primary-600 to-primary-700 text-white px-6 py-3 rounded-xl font-medium"
              >
                免费咨询
              </Link>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Header;
