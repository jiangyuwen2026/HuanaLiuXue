import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getSchools, getCountries } from '../utils/api';

function Schools() {
  const [schools, setSchools] = useState([]);
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ country: '', page: 1 });
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 12 });

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const res = await getCountries();
        if (res.success) setCountries(res.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchCountries();
  }, []);

  useEffect(() => {
    const fetchSchools = async () => {
      setLoading(true);
      try {
        const res = await getSchools({ country: filters.country, page: filters.page, limit: 12 });
        if (res.success) {
          setSchools(res.data.list);
          setPagination({ total: res.data.total, page: res.data.page, limit: res.data.limit });
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchSchools();
  }, [filters]);

  const handleFilterChange = (country) => {
    setFilters({ country, page: 1 });
  };

  const getCountryFlag = (country) => {
    const flags = {
      '香港': '🇭🇰', '澳门': '🇲🇴', '中国': '🇨🇳', '英国': '🇬🇧',
      '美国': '🇺🇸', '澳大利亚': '🇦🇺', '加拿大': '🇨🇦', '新加坡': '🇸🇬'
    };
    return flags[country] || '🌏';
  };

  const stats = [
    { value: '100+', label: '合作院校', desc: '全球顶尖学府' },
    { value: 'TOP50', label: '名校覆盖', desc: '世界排名前列' },
    { value: '98%', label: '录取成功率', desc: '专业服务保障' }
  ];

  const featuredCountries = [
    { name: '香港', flag: '🇭🇰', count: '8所', desc: '亚洲教育中心' },
    { name: '英国', flag: '🇬🇧', count: '30+所', desc: 'G5精英大学' },
    { name: '美国', flag: '🇺🇸', count: '40+所', desc: '常春藤盟校' },
    { name: '新加坡', flag: '🇸🇬', count: '3所', desc: '亚洲顶尖学府' }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-indigo-900 via-blue-800 to-cyan-900 py-20 lg:py-28 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>
        
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl -translate-x-1/3 translate-y-1/3" />
        
        <div className="relative container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-flex items-center px-4 py-1.5 bg-white/10 backdrop-blur-sm text-white/90 text-sm font-medium rounded-full mb-6 border border-white/20">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              全球顶尖学府
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              探索您的<span className="text-cyan-300">梦想院校</span>
            </h1>
            <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed">
              汇集全球顶尖高校信息，为您的留学之路提供全面指引
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 -mt-12 relative z-10 mb-16">
        <div className="bg-white rounded-2xl shadow-card p-6">
          <div className="grid grid-cols-3 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-1">{stat.value}</div>
                <div className="text-gray-900 font-medium">{stat.label}</div>
                <div className="text-gray-500 text-sm">{stat.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Countries */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="inline-block px-4 py-1.5 bg-amber-50 text-amber-700 text-sm font-medium rounded-full mb-4">
              热门留学目的地
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              选择您的留学目的地
            </h2>
            <p className="text-gray-600 text-lg">
              覆盖全球主流留学国家，深度了解各校录取偏好
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {featuredCountries.map((country, index) => (
              <div 
                key={index}
                onClick={() => handleFilterChange(country.name)}
                className={`group bg-slate-50 rounded-2xl p-6 text-center hover:bg-blue-50 transition-all cursor-pointer border-2 ${
                  filters.country === country.name ? 'border-blue-500 bg-blue-50' : 'border-transparent'
                }`}
              >
                <div className="text-5xl mb-3 group-hover:scale-110 transition-transform">{country.flag}</div>
                <h3 className="font-bold text-gray-900 mb-1">{country.name}</h3>
                <p className="text-blue-600 font-medium text-sm mb-1">{country.count}</p>
                <p className="text-gray-500 text-xs">{country.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-8 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-card p-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
              </div>
              <span className="font-semibold text-gray-800 text-lg">地区筛选</span>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => handleFilterChange('')}
                className={`px-6 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  filters.country === '' 
                    ? 'bg-blue-600 text-white shadow-lg' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                全部地区
              </button>
              {countries.map(country => (
                <button
                  key={country}
                  onClick={() => handleFilterChange(country)}
                  className={`px-6 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center ${
                    filters.country === country 
                      ? 'bg-blue-600 text-white shadow-lg' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <span className="mr-2 text-lg">{getCountryFlag(country)}</span>
                  {country}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* School List */}
      <section className="py-12 bg-slate-50">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600" />
            </div>
          ) : schools.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">暂无数据</h3>
              <p className="text-gray-500">该地区暂无院校信息</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {schools.map((school) => (
                  <Link
                    key={school.id}
                    to={`/schools/${school.id}`}
                    className="group bg-white rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-500 overflow-hidden border border-gray-100"
                  >
                    <div className="relative h-56 overflow-hidden">
                      {school.banner ? (
                        <>
                          <img 
                            src={school.banner} 
                            alt={`${school.name_cn}校园`}
                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                            onError={(e) => {
                              e.target.src = 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=800&q=80';
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300" />
                        </>
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300 flex items-center justify-center">
                          <span className="text-6xl">🎓</span>
                        </div>
                      )}
                      
                      <div className="absolute top-4 left-4">
                        <span className="flex items-center bg-white/95 backdrop-blur-sm text-gray-800 text-sm font-semibold px-3 py-1.5 rounded-lg shadow-md">
                          <span className="mr-1.5 text-lg">{getCountryFlag(school.country)}</span>
                          {school.country}
                        </span>
                      </div>
                      
                      {school.rank && (
                        <div className="absolute top-4 right-4">
                          <span className="bg-gradient-to-r from-amber-400 to-amber-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-md">
                            QS #{school.rank}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <div className="p-5">
                      <div className="flex items-center gap-3 mb-3">
                        {school.logo ? (
                          <img 
                            src={school.logo} 
                            alt={`${school.name_cn} Logo`}
                            className="w-10 h-10 object-contain bg-white rounded-lg border border-gray-100 p-1"
                          />
                        ) : (
                          <span className="text-2xl">{getCountryFlag(school.country)}</span>
                        )}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                            {school.name_cn}
                          </h3>
                          <p className="text-gray-500 text-sm truncate">{school.name_en}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center text-gray-600">
                          <svg className="w-4 h-4 mr-1 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          {school.city || school.country}
                        </div>
                        {school.tuition && (
                          <span className="text-blue-600 font-semibold">{school.tuition}</span>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              
              {/* Pagination */}
              {pagination.total > pagination.limit && (
                <div className="flex justify-center mt-12">
                  <div className="flex items-center gap-3 bg-white rounded-xl shadow-sm p-2">
                    <button
                      disabled={pagination.page === 1}
                      onClick={() => setFilters({ ...filters, page: pagination.page - 1 })}
                      className="px-5 py-2.5 rounded-lg font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 flex items-center"
                    >
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                      上一页
                    </button>
                    <span className="px-4 py-2 text-gray-700 font-medium">
                      <span className="text-blue-600">{pagination.page}</span>
                      <span className="mx-2 text-gray-400">/</span>
                      <span>{Math.ceil(pagination.total / pagination.limit)}</span>
                    </span>
                    <button
                      disabled={pagination.page >= Math.ceil(pagination.total / pagination.limit)}
                      onClick={() => setFilters({ ...filters, page: pagination.page + 1 })}
                      className="px-5 py-2.5 rounded-lg font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 flex items-center"
                    >
                      下一页
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-indigo-900 via-blue-800 to-cyan-900 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              没有找到心仪的院校？
            </h2>
            <p className="text-lg text-blue-100 mb-10">
              联系我们的顾问团队，获取更多院校推荐和申请建议
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center bg-white text-blue-700 hover:bg-blue-50 px-8 py-4 rounded-xl font-semibold transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1"
            >
              免费咨询
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Schools;
