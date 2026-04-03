import { Link } from 'react-router-dom';
import { useSiteConfig } from '../hooks/useSiteConfig';

function Footer() {
  const currentYear = new Date().getFullYear();
  const { config } = useSiteConfig();
  
  const quickLinks = [
    { path: '/schools', label: '院校库' },
    { path: '/consultants', label: '顾问团队' },
    { path: '/cases', label: '成功案例' },
    { path: '/news', label: '留学资讯' },
    { path: '/about', label: '关于我们' },
  ];
  
  const services = [
    { path: '/apply', label: '留学申请' },
    { path: '/english-training', label: '英语培训' },
    { path: '/competition', label: '竞赛规划' },
    { path: '/research', label: '科研提升' },
  ];
  
  const contactInfo = [
    { icon: 'location', text: config.address_full || '广州市天河区珠江新城华夏路30号' },
    { icon: 'phone', text: config.phone || '400-888-8888' },
    { icon: 'email', text: config.email || 'info@huananliu.com' },
    { icon: 'time', text: config.business_hours || '周一至周日 9:00-21:00' },
  ];

  const socialLinks = [
    { name: '微信公众号', type: 'wechat' },
    { name: '微博', type: 'weibo' },
    { name: '抖音', type: 'douyin' },
    { name: '小红书', type: 'xiaohongshu' },
  ];

  const getIcon = (type) => {
    switch (type) {
      case 'location':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        );
      case 'phone':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
        );
      case 'email':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        );
      case 'time':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <footer className="bg-slate-900 text-slate-300 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>
      
      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pt-16">
          {/* Brand Column */}
          <div className="lg:col-span-4">
            <Link to="/" className="flex items-center group mb-6">
              <div className="relative w-12 h-12 rounded-xl overflow-hidden shadow-lg group-hover:shadow-glow transition-shadow bg-white">
                <img 
                  src={config.footer_logo || config.logo || '/images/logo.png'} 
                  alt={config.site_name || '华南留学'} 
                  className="w-full h-full object-contain p-1"
                  onError={(e) => {
                    // 如果图片加载失败，显示备用文字LOGO
                    e.target.style.display = 'none';
                    e.target.parentElement.innerHTML = '<span class="flex items-center justify-center w-full h-full bg-gradient-to-br from-primary-500 to-primary-700 text-white font-bold text-2xl">华</span>';
                  }}
                />
              </div>
              <div className="ml-3">
                <span className="block text-xl font-bold text-white">{config.site_name || '华南留学'}</span>
                <span className="text-xs text-slate-400">{config.site_slogan || 'South China Study Abroad'}</span>
              </div>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed mb-6 max-w-sm">
              您值得信赖的国际教育伙伴。我们帮助学生实现世界顶尖名校梦想，提供专业的留学申请、语言培训和背景提升服务。
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-3">
              {socialLinks.map((social, index) => (
                <a 
                  key={index}
                  href="#" 
                  className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center text-slate-400 hover:text-white hover:bg-primary-600 transition-all duration-300 hover:scale-110"
                  title={social.name}
                >
                  {social.type === 'wechat' && (
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178A1.17 1.17 0 0 1 4.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178 1.17 1.17 0 0 1-1.162-1.178c0-.651.52-1.18 1.162-1.18z"/>
                      <path d="M23.636 14.939c0-3.34-3.186-6.054-7.116-6.054-3.93 0-7.116 2.714-7.116 6.054 0 3.341 3.186 6.054 7.116 6.054.769 0 1.508-.096 2.193-.272a.635.635 0 0 1 .528.073l1.553.908a.267.267 0 0 0 .136.044.241.241 0 0 0 .24-.241c0-.06-.023-.117-.039-.174l-.318-1.207a.48.48 0 0 1 .173-.54c1.56-1.15 2.65-2.84 2.65-4.645zm-9.27-1.415a.9.9 0 0 1 0-1.8.9.9 0 0 1 0 1.8zm4.308 0a.9.9 0 0 1 0-1.8.9.9 0 0 1 0 1.8z"/>
                    </svg>
                  )}
                  {social.type === 'weibo' && (
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M10.098 20.323c-3.977.391-7.414-1.406-7.672-4.02-.259-2.609 2.759-5.047 6.74-5.441 3.979-.394 7.413 1.404 7.671 4.018.259 2.6-2.759 5.049-6.739 5.443zM9.05 17.219c-.384.616-1.208.884-1.829.602-.612-.279-.793-.991-.406-1.593.379-.595 1.176-.861 1.793-.601.622.263.82.972.442 1.592zm1.27-1.627c-.141.237-.449.353-.689.253-.236-.09-.313-.361-.177-.586.138-.227.436-.346.672-.24.239.09.315.36.194.573zm.176-2.719c-1.893-.493-4.033.45-4.857 2.118-.836 1.704-.026 3.591 1.886 4.21 1.983.64 4.318-.341 5.132-2.179.8-1.793-.201-3.642-2.161-4.149zm7.563-1.224c-.346-.105-.579-.18-.401-.649.386-1.031.426-1.922.003-2.555-.793-1.17-2.966-1.109-5.419-.033 0 0-.777.34-.578-.275.383-1.217.326-2.234-.271-2.822-1.355-1.334-4.963-.045-8.061 2.876-2.324 2.19-3.675 4.513-3.675 6.505 0 3.81 4.896 6.13 9.685 6.13 6.275 0 10.447-3.647 10.447-6.543 0-1.752-1.475-2.745-2.73-3.134z"/>
                      <path d="M19.087 5.808c-1.07-1.188-2.652-1.867-4.457-1.867-.463 0-.918.045-1.356.132l-.233.048.06.229c.185.693.266 1.334.241 1.909l-.009.192.176.104c.446.265.834.587 1.153.959l.139.164.195.045c.473.108.967.163 1.469.163 1.228 0 2.376-.349 3.236-.975l.175-.124-.169-.139z"/>
                    </svg>
                  )}
                  {social.type === 'douyin' && (
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-2.26.02-4.52.02-6.78z"/>
                    </svg>
                  )}
                  {social.type === 'xiaohongshu' && (
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 14.8c-.48.66-1.23 1.09-2.04 1.16-.65.05-1.31-.11-1.88-.47-.45-.28-.83-.68-1.1-1.16-.27.48-.65.88-1.1 1.16-.57.36-1.23.52-1.88.47-.81-.07-1.56-.5-2.04-1.16-.55-.76-.75-1.73-.55-2.68.2-.95.74-1.79 1.5-2.35l3.07-2.19 3.07 2.19c.76.56 1.3 1.4 1.5 2.35.2.95 0 1.92-.55 2.68z"/>
                    </svg>
                  )}
                </a>
              ))}
            </div>
          </div>
          
          {/* Quick Links */}
          <div className="lg:col-span-2">
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-5">快速链接</h3>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link 
                    to={link.path} 
                    className="text-slate-400 hover:text-white transition-colors duration-200 text-sm flex items-center group"
                  >
                    <span className="w-1.5 h-1.5 bg-slate-600 rounded-full mr-2 group-hover:bg-primary-500 transition-colors" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Services */}
          <div className="lg:col-span-2">
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-5">服务项目</h3>
            <ul className="space-y-3">
              {services.map((service, index) => (
                <li key={index}>
                  <Link 
                    to={service.path} 
                    className="text-slate-400 hover:text-white transition-colors duration-200 text-sm flex items-center group"
                  >
                    <span className="w-1.5 h-1.5 bg-slate-600 rounded-full mr-2 group-hover:bg-primary-500 transition-colors" />
                    {service.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Contact */}
          <div className="lg:col-span-4">
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-5">联系我们</h3>
            <ul className="space-y-4">
              {contactInfo.map((item, index) => (
                <li key={index} className="flex items-start text-slate-400 text-sm">
                  <span className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center mr-3 flex-shrink-0 text-primary-400">
                    {getIcon(item.icon)}
                  </span>
                  <span className="pt-1.5">{item.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="border-t border-slate-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-slate-500 text-sm mb-4 md:mb-0">
              &copy; {currentYear} {config.site_name || '华南留学'}. 保留所有权利. 
              <span className="mx-2">|</span>
              <Link to="/privacy" className="hover:text-slate-300 transition-colors">隐私政策</Link>
              <span className="mx-2">|</span>
              <Link to="/terms" className="hover:text-slate-300 transition-colors">服务条款</Link>
            </div>
            <div className="flex items-center text-slate-500 text-sm">
              <span className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
                系统运行正常
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
