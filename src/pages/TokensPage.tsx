import { useState, useEffect } from 'react';
import { Header } from '../components/Header';
import { BottomNavigation } from '../components/BottomNavigation';
import { ShaderBackground } from '../components/ShaderBackground';
import { ParticleOverlay } from '../components/ParticleOverlay';
import { ArrowLeft, QrCode, CheckCircle, Clock, AlertCircle, Loader } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import apiService from '../services/api';

interface Token {
  id: number;
  token_code: string;
  user: string;
  gym: number;
  gym_name: string;
  gym_address: string;
  status: 'active' | 'used' | 'expired';
  is_valid: boolean;
  issued_at: string;
  valid_until: string;
  used_at: string | null;
  qr_code: string;
}

type FilterType = 'all' | 'active' | 'used' | 'expired';

export function TokensPage() {
  const navigate = useNavigate();
  const [tokens, setTokens] = useState<Token[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [selectedTokenQR, setSelectedTokenQR] = useState<string | null>(null);

  useEffect(() => {
    document.title = 'FITOPIA | توکن‌های من';
    loadTokens();
  }, []);

  const loadTokens = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.get<Token[]>('/tokens/my/');
      console.log('📤 Tokens loaded:', data);
      setTokens(data || []);
    } catch (err: any) {
      console.error('❌ Error loading tokens:', err);
      setError(err.message || 'خطا در بارگذاری توکن‌ها');
    } finally {
      setLoading(false);
    }
  };

  const getFilteredTokens = () => {
    if (activeFilter === 'all') return tokens;
    return tokens.filter(token => token.status === activeFilter);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'used':
        return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
      case 'expired':
        return 'bg-red-500/10 text-red-400 border-red-500/20';
      default:
        return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return 'فعال';
      case 'used':
        return 'استفاده‌شده';
      case 'expired':
        return 'منقضی‌شده';
      default:
        return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4" />;
      case 'used':
        return <Clock className="w-4 h-4" />;
      case 'expired':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fa-IR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const filteredTokens = getFilteredTokens();

  const stats = {
    total: tokens.length,
    active: tokens.filter(t => t.status === 'active').length,
    used: tokens.filter(t => t.status === 'used').length,
    expired: tokens.filter(t => t.status === 'expired').length,
  };

  if (loading) {
    return (
      <>
        <ShaderBackground />
        <ParticleOverlay />
        <Header />
        <main className="relative z-10 pt-24 pb-32 px-4 max-w-5xl mx-auto h-screen flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader className="w-8 h-8 animate-spin text-primary" />
            <p className="text-on-surface-variant">درحال بارگذاری توکن‌ها...</p>
          </div>
        </main>
        <BottomNavigation />
      </>
    );
  }

  return (
    <>
      <ShaderBackground />
      <ParticleOverlay />
      <Header />

      <main className="relative z-10 pt-24 pb-32 px-4 max-w-5xl mx-auto">
        {/* Header */}
        <header className="flex items-center gap-3 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="p-1.5 hover:bg-white/10 rounded-lg transition-colors active:scale-95"
            title="برگشت"
          >
            <ArrowLeft className="w-5 h-5 text-on-surface" />
          </button>
          <h1 className="text-2xl font-bold text-white">توکن‌های من</h1>
        </header>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-3">
            <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0" />
            <p className="text-red-300 text-sm">{error}</p>
            <button
              onClick={loadTokens}
              className="ml-auto px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg text-sm font-medium transition-colors"
            >
              تلاش مجدد
            </button>
          </div>
        )}

        {/* Stats Pills */}
        <section className="mb-8">
          <div className="flex flex-wrap gap-3">
            <div className="glass-panel rounded-full px-5 py-2 flex items-center gap-2 border-primary/20">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-sm text-on-surface">کل توکن‌ها: {stats.total}</span>
            </div>
            <div className="glass-panel rounded-full px-5 py-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500" />
              <span className="text-sm text-on-surface-variant">فعال: {stats.active}</span>
            </div>
            <div className="glass-panel rounded-full px-5 py-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-slate-500" />
              <span className="text-sm text-on-surface-variant">استفاده‌شده: {stats.used}</span>
            </div>
            <div className="glass-panel rounded-full px-5 py-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500" />
              <span className="text-sm text-on-surface-variant">منقضی: {stats.expired}</span>
            </div>
          </div>
        </section>

        {/* Filter Tabs */}
        <nav className="mb-8 overflow-x-auto hide-scrollbar">
          <div className="flex items-center gap-4 border-b border-white/5 pb-2">
            {(['all', 'active', 'used', 'expired'] as FilterType[]).map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`text-sm font-medium whitespace-nowrap px-2 pb-2 transition-colors relative ${
                  activeFilter === filter
                    ? 'text-primary'
                    : 'text-on-surface-variant hover:text-primary'
                }`}
              >
                {filter === 'all' && 'همه'}
                {filter === 'active' && 'فعال'}
                {filter === 'used' && 'استفاده‌شده'}
                {filter === 'expired' && 'منقضی‌شده'}
                {activeFilter === filter && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent" />
                )}
              </button>
            ))}
          </div>
        </nav>

        {/* Token List */}
        {filteredTokens.length === 0 ? (
          <div className="glass-panel rounded-2xl p-12 text-center">
            <QrCode className="w-12 h-12 text-on-surface-variant/50 mx-auto mb-4" />
            <p className="text-on-surface-variant">توکنی برای این فیلتر یافت نشد</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTokens.map((token) => (
              <div
                key={token.id}
                className="glass-panel rounded-xl overflow-hidden transition-all duration-300 hover:scale-105 hover:border-primary/30 border border-white/10"
              >
                {/* Token Header with Status */}
                <div className="p-5 border-b border-white/5">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-white mb-1">{token.gym_name}</h3>
                      <p className="text-xs text-on-surface-variant flex items-center gap-1">
                        <span>📍</span> {token.gym_address}
                      </p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 border ${getStatusColor(token.status)}`}>
                      {getStatusIcon(token.status)}
                      {getStatusLabel(token.status)}
                    </div>
                  </div>

                  {/* Token Code */}
                  <div className="glass-panel bg-white/5 rounded-lg p-3 mb-4">
                    <p className="text-xs text-on-surface-variant mb-1">کد توکن</p>
                    <p className="text-sm font-mono text-primary break-all">{token.token_code}</p>
                  </div>
                </div>

                {/* Token Details */}
                <div className="p-5 space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-on-surface-variant">📅 صادر شده:</span>
                    <span className="text-white">{formatDate(token.issued_at)}</span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-on-surface-variant">⏰ انقضا:</span>
                    <span className={token.status === 'expired' ? 'text-red-400' : 'text-white'}>
                      {formatDate(token.valid_until)}
                    </span>
                  </div>

                  {token.used_at && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-on-surface-variant">✓ استفاده‌شده:</span>
                      <span className="text-white">{formatDate(token.used_at)}</span>
                    </div>
                  )}

                  {/* Action Button */}
                  {token.status === 'active' && token.is_valid ? (
                    <button
                      onClick={() => setSelectedTokenQR(token.qr_code)}
                      className="w-full mt-4 bg-gradient-to-r from-primary to-yellow-500 text-on-primary-container font-bold py-3 rounded-lg flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-primary/30 transition-all"
                    >
                      <QrCode className="w-5 h-5" />
                      نمایش کد ورود
                    </button>
                  ) : (
                    <button
                      disabled
                      className="w-full mt-4 bg-surface-container text-on-surface-variant font-bold py-3 rounded-lg opacity-50 cursor-not-allowed"
                    >
                      قابل استفاده نیست
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {tokens.length === 0 && !loading && (
          <div className="glass-panel rounded-2xl p-12 text-center mt-8">
            <QrCode className="w-16 h-16 text-on-surface-variant/30 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">هنوز توکنی ندارید</h3>
            <p className="text-on-surface-variant mb-6">برای شروع، یک اشتراک خریداری کنید</p>
            <button
              onClick={() => navigate('/subscriptions')}
              className="px-6 py-3 bg-primary text-on-primary rounded-lg font-bold hover:opacity-90 transition-opacity"
            >
              مشاهده اشتراک‌ها
            </button>
          </div>
        )}
      </main>

      {/* QR Code Modal */}
      {selectedTokenQR && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel rounded-2xl p-8 max-w-md w-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">کد دخول</h2>
              <button
                onClick={() => setSelectedTokenQR(null)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                ✕
              </button>
            </div>

            {/* QR Code Display */}
            <div className="bg-white p-4 rounded-lg mb-6">
              <img src={selectedTokenQR} alt="QR Code" className="w-full" />
            </div>

            {/* Instructions */}
            <div className="bg-primary/10 border border-primary/30 rounded-lg p-4 mb-6 text-center">
              <p className="text-sm text-on-surface">
                🔍 این کد را برای ورود به باشگاه نشان دهید
              </p>
            </div>

            <button
              onClick={() => setSelectedTokenQR(null)}
              className="w-full py-3 bg-surface-container hover:bg-surface-container/80 text-on-surface rounded-lg font-bold transition-colors"
            >
              بستن
            </button>
          </div>
        </div>
      )}

      <BottomNavigation />
    </>
  );
}
