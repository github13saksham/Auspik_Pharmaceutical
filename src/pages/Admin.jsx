import { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  MessageSquare, 
  Settings, 
  LogOut, 
  Plus, 
  Trash2, 
  RefreshCw,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Upload,
  Edit2,
  Activity,
  Users,
  Globe,
  TrendingUp,
  Radio
} from 'lucide-react';
import companyLogo from '../assets/Project_images/Pharma_Company_logo.jpeg';
import { 
  getProducts, 
  addProduct, 
  updateProduct,
  deleteProduct, 
  resetProductsToRealSeed, 
  getInquiries, 
  updateInquiryStatus, 
  getSettings, 
  updateSettings 
} from '../services/pharmaService';
import { ADMIN_EMAIL, auth } from '../firebase';
import { signInWithEmailAndPassword, onAuthStateChanged, signOut, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { subscribeToAnalytics } from '../services/analyticsService';
import './Admin.css';

const initialAnalyticsTime = Date.now();

export default function Admin() {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Auth State - Single Unified Login
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState('');

  // Data State
  const [products, setProducts] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [settings, setSettingsData] = useState({});
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState({ activeSessions: [], pageViews: [] });
  const [analyticsError, setAnalyticsError] = useState('');
  const [analyticsNow, setAnalyticsNow] = useState(initialAnalyticsTime);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [newProduct, setNewProduct] = useState({
    name: '',
    genericName: '',
    category: 'Tablets',
    dosageForm: 'Film Coated Tablet',
    packaging: '',
    indications: '',
    description: '',
    image: '',
    featured: false
  });

  // Load Data & Auth
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      // Security Check: If a user logs in but isn't the specific admin email, sign them back out.
      if (currentUser && currentUser.email?.toLowerCase() !== ADMIN_EMAIL) {
        signOut(auth);
        setAuthError('Access Denied: You are not authorized as an admin.');
        setUser(null);
      } else {
        setUser(currentUser);
      }
      setAuthLoading(false);
    });

    const loadData = async () => {
      const p = await getProducts();
      const i = await getInquiries();
      const s = await getSettings();
      setProducts(p);
      setInquiries(i.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)));
      setSettingsData(s);
      setLoading(false);
    };
    loadData();
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return undefined;
    return subscribeToAnalytics(setAnalytics, (error) => {
      console.error('Unable to subscribe to website analytics:', error);
      setAnalyticsError('Live analytics are unavailable. Check your Firestore rules and connection.');
    });
  }, [user]);

  useEffect(() => {
    if (!user) return undefined;
    const intervalId = window.setInterval(() => setAnalyticsNow(Date.now()), 10000);
    return () => window.clearInterval(intervalId);
  }, [user]);

  const activeSessions = analytics.activeSessions.filter((session) => {
    const lastSeen = session.lastSeen?.toDate?.().getTime();
    return lastSeen && analyticsNow - lastSeen <= 90000;
  }).sort((a, b) => b.lastSeen.toMillis() - a.lastSeen.toMillis());
  const recentPageViews = analytics.pageViews
    .map((view) => ({ ...view, viewedAt: view.createdAt?.toDate?.() }))
    .filter((view) => view.viewedAt && analyticsNow - view.viewedAt.getTime() <= 24 * 60 * 60 * 1000);
  const pageViewBuckets = Array.from({ length: 12 }, (_, index) => {
    return recentPageViews.filter((view) => {
      const age = analyticsNow - view.viewedAt.getTime();
      return age >= (11 - index) * 2 * 60 * 60 * 1000
        && age < (12 - index) * 2 * 60 * 60 * 1000;
    }).length;
  });
  const chartMax = Math.max(...pageViewBuckets, 1);
  const chartPoints = pageViewBuckets
    .map((count, index) => `${(index / (pageViewBuckets.length - 1)) * 100},${100 - (count / chartMax) * 88}`)
    .join(' ');
  const popularPages = Object.entries(recentPageViews.reduce((counts, view) => {
    counts[view.path] = (counts[view.path] || 0) + 1;
    return counts;
  }, {})).sort((a, b) => b[1] - a[1]).slice(0, 5);

  const [imageUploadLoading, setImageUploadLoading] = useState(false);
  const [imageUploadError, setImageUploadError] = useState('');

  // Handle local image file upload and optimize/convert to high quality data URL
  const handleImageFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setImageUploadError('Please select a valid image file (PNG, JPG, JPEG, WEBP).');
      return;
    }

    // Limit raw file selection to 10MB
    if (file.size > 10 * 1024 * 1024) {
      setImageUploadError('Selected image is too large. Please select an image under 10MB.');
      return;
    }

    setImageUploadLoading(true);
    setImageUploadError('');

    const reader = new FileReader();
    reader.onerror = () => {
      setImageUploadError('Failed to read image file.');
      setImageUploadLoading(false);
    };

    reader.onload = (event) => {
      const img = new Image();
      img.onerror = () => {
        setImageUploadError('Could not process image.');
        setImageUploadLoading(false);
      };

      img.onload = () => {
        // Automatically optimize/resize image to standard web resolution if needed
        const maxDim = 1200;
        let width = img.width;
        let height = img.height;

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to web-optimized JPEG data URL
        const optimizedDataUrl = canvas.toDataURL('image/jpeg', 0.88);
        setNewProduct(prev => ({ ...prev, image: optimizedDataUrl }));
        setImageUploadLoading(false);
      };

      img.src = event.target.result;
    };

    reader.readAsDataURL(file);
  };

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setNewProduct({
      name: '',
      genericName: '',
      category: 'Tablets',
      dosageForm: 'Film Coated Tablet',
      packaging: '',
      indications: '',
      description: '',
      image: '',
      featured: false
    });
    setImageUploadError('');
    setShowAddModal(true);
  };

  const handleOpenEditModal = (prod) => {
    setEditingProduct(prod);
    setNewProduct({
      name: prod.name || '',
      genericName: prod.genericName || '',
      category: prod.category || 'Tablets',
      dosageForm: prod.dosageForm || 'Film Coated Tablet',
      packaging: prod.packaging || '',
      indications: prod.indications || '',
      description: prod.description || '',
      image: prod.image || '',
      featured: Boolean(prod.featured)
    });
    setImageUploadError('');
    setShowAddModal(true);
  };

  const handleAddProductSubmit = async (e) => {
    e.preventDefault();
    if (!newProduct.name) return;
    const prodToSave = {
      ...newProduct,
      image: newProduct.image?.trim() || '/product_images/WhatsApp Image 2026-09-28 at 11.50.14 AM.jpeg',
      packaging: newProduct.packaging?.trim() || '10 x 10 Pack',
      description: newProduct.description?.trim() || newProduct.indications || newProduct.genericName
    };

    if (editingProduct) {
      await updateProduct(editingProduct.id, prodToSave);
    } else {
      await addProduct(prodToSave);
    }

    const updated = await getProducts();
    setProducts(updated);
    setShowAddModal(false);
    setEditingProduct(null);
    setNewProduct({
      name: '',
      genericName: '',
      category: 'Tablets',
      dosageForm: 'Film Coated Tablet',
      packaging: '',
      indications: '',
      description: '',
      image: '',
      featured: false
    });
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this formulation?')) {
      await deleteProduct(id);
      const updated = await getProducts();
      setProducts(updated);
    }
  };

  const handleReSeedData = async () => {
    if (window.confirm('Sync and overwrite all products in Firebase Firestore with the verified 40 medicine formulations?')) {
      try {
        const updated = await resetProductsToRealSeed();
        setProducts(updated);
        alert(`Successfully synced ${updated.length} verified products into Firebase Firestore!`);
      } catch (err) {
        console.error("Failed to seed Firebase:", err);
        alert("Seeding failed: " + (err.message || err));
      }
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    await updateInquiryStatus(id, newStatus);
    const updated = await getInquiries();
    setInquiries(updated.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)));
  };

  const handleSettingsSave = async (e) => {
    e.preventDefault();
    await updateSettings(settings);
    alert('Settings updated successfully!');
  };

    const handleGoogleLogin = async () => {
    setAuthError('');
    setIsSubmitting(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      if (result.user.email?.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
        await signOut(auth);
        setAuthError(`Access Denied: Only ${ADMIN_EMAIL} is authorized.`);
      }
    } catch (error) {
      console.error('Google sign in error:', error);
      if (error.code !== 'auth/popup-closed-by-user') {
        setAuthError('Google sign in failed. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError('');
    setIsSubmitting(true);

    if (email.trim().toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
      setAuthError(`Access Denied: Only ${ADMIN_EMAIL} is authorized.`);
      setIsSubmitting(false);
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
    } catch (error) {
      console.error('Login error:', error);
      if (error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        setAuthError('Incorrect password. Please verify and try again.');
      } else if (error.code === 'auth/user-not-found') {
        setAuthError('Account not found for this email address.');
      } else if (error.code === 'auth/too-many-requests') {
        setAuthError('Too many failed attempts. Please try again shortly.');
      } else {
        setAuthError('Unable to sign in. Please verify your credentials.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    window.location.href = '/';
  };

  if (authLoading || loading) {
    return (
      <div className="admin-auth-screen">
        <div className="spinner" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="admin-auth-screen">
        <div className="admin-auth-card">
          <div className="admin-auth-header">
            <img src={companyLogo} alt="Auspik Pharmaceuticals" className="admin-auth-logo" />
            <h1 className="admin-auth-title">Admin Console</h1>
            <p className="admin-auth-desc">Enter your credentials to access the management portal</p>
          </div>

          {authError && (
            <div className="admin-auth-alert" role="alert">
              <span className="admin-auth-alert-dot" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="admin-auth-form">
            <div className="admin-auth-field">
              <label htmlFor="admin-email" className="admin-auth-label">Authorized Email</label>
              <div className="admin-auth-input-wrap">
                <Mail size={18} className="admin-auth-input-icon" />
                <input
                  id="admin-email"
                  type="email"
                  required
                  autoComplete="username"
                  className="admin-auth-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                />
              </div>
            </div>

            <div className="admin-auth-field">
              <label htmlFor="admin-password" className="admin-auth-label">Password</label>
              <div className="admin-auth-input-wrap">
                <Lock size={18} className="admin-auth-input-icon" />
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  className="admin-auth-input with-toggle"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="admin-auth-pwd-toggle"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="admin-auth-submit-btn"
            >
              {isSubmitting ? (
                <>
                  <span className="admin-auth-spinner" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Console</span>
                  <ArrowRight size={17} />
                </>
              )}
            </button>
          </form>
          <div className="admin-auth-divider">
            <span>or</span>
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={isSubmitting}
            className="admin-auth-google-btn"
          >
            <svg className="admin-auth-google-icon" viewBox="0 0 24 24" width="18" height="18">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            <span>Sign in with Google</span>
          </button>

          <div className="admin-auth-footer">
            <span>Auspik Pharmaceuticals Pvt. Ltd. • Secure Management Portal</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-logo">
          <div className="admin-brand-mark">A</div>
          <div className="admin-brand-copy">
            <strong>Auspik</strong>
            <span>ADMIN PORTAL</span>
          </div>
        </div>
        <nav className="admin-nav">
          <button className={`admin-nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
            <LayoutDashboard size={19} /><span>Overview</span>
          </button>
          <button className={`admin-nav-item ${activeTab === 'analytics' ? 'active' : ''}`} onClick={() => setActiveTab('analytics')}>
            <Activity size={19} /><span>Analytics</span><span className="nav-live-dot" />
          </button>
          <button className={`admin-nav-item ${activeTab === 'products' ? 'active' : ''}`} onClick={() => setActiveTab('products')}>
            <Package size={19} /><span>Products</span>
          </button>
          <button className={`admin-nav-item ${activeTab === 'inquiries' ? 'active' : ''}`} onClick={() => setActiveTab('inquiries')}>
            <MessageSquare size={19} /><span>Inquiries</span>
            {inquiries.filter(i => i.status === 'New').length > 0 && 
              <span className="badge-count">{inquiries.filter(i => i.status === 'New').length}</span>
            }
          </button>
          <button className={`admin-nav-item ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')}>
            <Settings size={19} /><span>Settings</span>
          </button>
        </nav>
        <div className="admin-sidebar-status">
          <span className="status-indicator" />
          <span>Consent-based analytics</span>
        </div>
        <div className="admin-footer">
          <div className="admin-profile">
            <div className="admin-avatar">{user.email?.charAt(0).toUpperCase()}</div>
            <div className="admin-profile-copy"><strong>Administrator</strong><span>{user.email}</span></div>
            <button onClick={handleLogout} className="admin-logout" aria-label="Sign out"><LogOut size={17} /></button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        
        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="animate-fade-in">
            <header className="admin-page-header">
              <div>
                <span className="admin-eyebrow">AUSPIK / OVERVIEW</span>
                <h1>Good to see you</h1>
                <p>Your website activity and operations at a glance.</p>
              </div>
              <div className="admin-live-status"><span className="status-indicator" /> Live updates</div>
            </header>

            {analyticsError && <div className="analytics-error" role="alert">{analyticsError}</div>}

            <div className="admin-stat-grid">
              <div className="stat-card">
                <div className="stat-icon stat-icon-blue"><Package size={21} /></div>
                <div className="stat-info">
                  <h3>Total products</h3>
                  <p>{products.length}</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon stat-icon-amber"><MessageSquare size={21} /></div>
                <div className="stat-info">
                  <h3>New inquiries</h3>
                  <p>{inquiries.filter(i => i.status === 'New').length}</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon stat-icon-green"><Eye size={21} /></div>
                <div className="stat-info">
                  <h3>Page views · 24h</h3>
                  <p>{recentPageViews.length}</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon stat-icon-purple"><Users size={21} /></div>
                <div className="stat-info">
                  <h3>Visitors online</h3>
                  <p>{activeSessions.length}</p>
                </div>
              </div>
            </div>

            <div className="admin-dashboard-grid">
              <section className="admin-card analytics-chart-card">
                <div className="admin-card-heading">
                  <div><h2>Website traffic</h2><p>Page views over the last 24 hours</p></div>
                  <span className="live-tag"><span className="status-indicator" /> LIVE</span>
                </div>
                <div className="chart-summary"><strong>{recentPageViews.length}</strong><span>views tracked in the last 24 hours</span></div>
                <div className="traffic-chart" role="img" aria-label={`Website page views over the past 24 hours. ${recentPageViews.length} total views.`}>
                  <div className="chart-y-labels"><span>{chartMax}</span><span>{Math.ceil(chartMax / 2)}</span><span>0</span></div>
                  <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
                    <line x1="0" y1="12" x2="100" y2="12" />
                    <line x1="0" y1="56" x2="100" y2="56" />
                    <line x1="0" y1="99" x2="100" y2="99" />
                    <polygon className="chart-area" points={`0,100 ${chartPoints} 100,100`} />
                    <polyline className="chart-line" points={chartPoints} />
                  </svg>
                </div>
                <div className="chart-x-labels"><span>24 hours ago</span><span>12 hours ago</span><span>Now</span></div>
                <p className="analytics-sample-note">Showing up to the latest 500 page-view events.</p>
              </section>

              <section className="admin-card live-visitors-card">
                <div className="admin-card-heading">
                  <div><h2>Live visitors</h2><p>Active in the last 90 seconds</p></div>
                  <span className="visitor-count">{activeSessions.length}</span>
                </div>
                {activeSessions.length ? (
                  <ul className="visitor-list">
                    {activeSessions.slice(0, 6).map((session) => (
                      <li key={session.id}>
                        <span className="visitor-dot" />
                        <span className="visitor-path">{session.path}</span>
                        <span className="visitor-time">{Math.max(0, Math.floor((analyticsNow - session.lastSeen.toMillis()) / 1000))}s ago</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="empty-analytics"><Radio size={22} /><span>No active visitors right now</span></div>
                )}
                <div className="privacy-note"><Globe size={14} /> Anonymous activity only — no personal data collected</div>
              </section>
            </div>

            <section className="admin-card recent-inquiries-card">
              <div className="admin-card-heading">
                <div><h2>Recent inquiries</h2><p>The latest messages from your website</p></div>
                <button className="admin-text-link" onClick={() => setActiveTab('inquiries')}>View all <ArrowRight size={15} /></button>
              </div>
              <div className="table-responsive">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Product/Type</th>
                      <th>Status</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inquiries.slice(0, 5).map(inq => (
                      <tr key={inq.id}>
                        <td><strong>{inq.name}</strong></td>
                        <td>{inq.product || inq.type}</td>
                        <td><span className={`status-badge status-${inq.status.toLowerCase()}`}>{inq.status}</span></td>
                        <td>{new Date(inq.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="animate-fade-in">
            <header className="admin-page-header">
              <div>
                <span className="admin-eyebrow">AUSPIK / INSIGHTS</span>
                <h1>Website analytics</h1>
                <p>Live visitor activity and recent page traffic.</p>
              </div>
              <div className="admin-live-status"><span className="status-indicator" /> Updating in real time</div>
            </header>
            {analyticsError && <div className="analytics-error" role="alert">{analyticsError}</div>}
            <div className="admin-stat-grid analytics-stat-grid">
              <div className="stat-card">
                <div className="stat-icon stat-icon-blue"><Eye size={21} /></div>
                <div className="stat-info"><h3>Page views · 24h</h3><p>{recentPageViews.length}</p></div>
              </div>
              <div className="stat-card">
                <div className="stat-icon stat-icon-purple"><Users size={21} /></div>
                <div className="stat-info"><h3>Active visitors</h3><p>{activeSessions.length}</p></div>
              </div>
              <div className="stat-card">
                <div className="stat-icon stat-icon-green"><Globe size={21} /></div>
                <div className="stat-info"><h3>Pages visited · 24h</h3><p>{new Set(recentPageViews.map((view) => view.path)).size}</p></div>
              </div>
            </div>
            <div className="admin-dashboard-grid analytics-detail-grid">
              <section className="admin-card analytics-chart-card">
                <div className="admin-card-heading">
                  <div><h2>Traffic activity</h2><p>Page views grouped into two-hour intervals</p></div>
                  <span className="live-tag"><span className="status-indicator" /> LIVE</span>
                </div>
                <div className="chart-summary"><strong>{recentPageViews.length}</strong><span>views tracked in the last 24 hours</span></div>
                <div className="traffic-chart large" role="img" aria-label={`Website page views over the past 24 hours. ${recentPageViews.length} total views.`}>
                  <div className="chart-y-labels"><span>{chartMax}</span><span>{Math.ceil(chartMax / 2)}</span><span>0</span></div>
                  <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
                    <line x1="0" y1="12" x2="100" y2="12" />
                    <line x1="0" y1="56" x2="100" y2="56" />
                    <line x1="0" y1="99" x2="100" y2="99" />
                    <polygon className="chart-area" points={`0,100 ${chartPoints} 100,100`} />
                    <polyline className="chart-line" points={chartPoints} />
                  </svg>
                </div>
                <div className="chart-x-labels"><span>24 hours ago</span><span>12 hours ago</span><span>Now</span></div>
                <p className="analytics-sample-note">Showing up to the latest 500 page-view events.</p>
              </section>
              <section className="admin-card">
                <div className="admin-card-heading"><div><h2>Most visited pages</h2><p>Based on the latest tracked page views</p></div><TrendingUp size={19} /></div>
                {popularPages.length ? (
                  <ul className="popular-page-list">
                    {popularPages.map(([path, count]) => (
                      <li key={path}><span>{path}</span><strong>{count}<small> views</small></strong></li>
                    ))}
                  </ul>
                ) : <div className="empty-analytics"><Activity size={22} /><span>Page view data will appear here</span></div>}
              </section>
            </div>
            <section className="admin-card live-session-table">
              <div className="admin-card-heading"><div><h2>Visitors online now</h2><p>Anonymous sessions active within the last 90 seconds</p></div><span className="visitor-count">{activeSessions.length}</span></div>
              {activeSessions.length ? (
                <div className="table-responsive">
                  <table className="admin-table">
                    <thead><tr><th>Page</th><th>Activity</th></tr></thead>
                    <tbody>{activeSessions.map((session) => (
                      <tr key={session.id}>
                        <td><span className="visitor-dot table-visitor-dot" />{session.path}</td>
                        <td>Last seen {Math.max(0, Math.floor((analyticsNow - session.lastSeen.toMillis()) / 1000))} seconds ago</td>
                      </tr>
                    ))}</tbody>
                  </table>
                </div>
              ) : <div className="empty-analytics"><Radio size={22} /><span>No active visitors at the moment</span></div>}
              <div className="privacy-note"><Globe size={14} /> Visitor counts are approximate and use anonymous session IDs.</div>
            </section>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div className="animate-fade-in">
            <div className="flex justify-between items-center mb-4" style={{ flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h2>Manage Formulations ({products.length})</h2>
                <p className="text-muted text-sm">Real-time database records seeded from verified product photography</p>
              </div>
              <div className="flex gap-2">
                <button 
                  className="btn btn-secondary flex items-center gap-1"
                  onClick={handleReSeedData}
                  title="Re-seed all 40 verified medicine formulations into Firebase Firestore"
                >
                  <RefreshCw size={16} />
                  <span>Sync 40 Products to Firebase</span>
                </button>
                <button 
                  className="btn btn-primary flex items-center gap-1"
                  onClick={handleOpenAddModal}
                >
                  <Plus size={16} />
                  <span>Add New Product</span>
                </button>
              </div>
            </div>

            {/* Add Product Modal */}
            {showAddModal && (
              <div className="admin-modal-overlay" style={{
                position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                background: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(4px)',
                zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem'
              }}>
                <div className="admin-card" style={{ maxWidth: '540px', width: '100%', maxHeight: '90vh', overflowY: 'auto' }}>
                  <div className="flex justify-between items-center mb-3">
                    <h3 style={{ margin: 0 }}>
                      {editingProduct ? 'Edit Pharmaceutical Product' : 'Add New Pharmaceutical Product'}
                    </h3>
                    <button className="btn-icon" onClick={() => { setShowAddModal(false); setEditingProduct(null); }} style={{ fontSize: '1.25rem' }}>✕</button>
                  </div>
                  <form onSubmit={handleAddProductSubmit}>
                    <div className="form-group mb-3">
                      <label className="form-label">Brand / Product Name *</label>
                      <input 
                        type="text" 
                        required 
                        className="form-control" 
                        placeholder="e.g. Auspik Paracetamol 650mg"
                        value={newProduct.name}
                        onChange={e => setNewProduct({...newProduct, name: e.target.value})}
                      />
                    </div>
                    <div className="form-group mb-3">
                      <label className="form-label">Generic / Active Composition *</label>
                      <input 
                        type="text" 
                        required 
                        className="form-control" 
                        placeholder="e.g. Paracetamol IP 650mg"
                        value={newProduct.genericName}
                        onChange={e => setNewProduct({...newProduct, genericName: e.target.value})}
                      />
                    </div>
                    <div className="form-row-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div className="form-group mb-3">
                        <label className="form-label">Therapeutic Category *</label>
                        <select 
                          className="form-control"
                          value={newProduct.category}
                          onChange={e => setNewProduct({...newProduct, category: e.target.value})}
                        >
                          <option value="Tablets">Tablets</option>
                          <option value="Capsules">Capsules</option>
                          <option value="Syrups">Syrups</option>
                          <option value="Oral Liquids">Oral Liquids</option>
                          <option value="Nutraceuticals">Nutraceuticals</option>
                          <option value="Food Supplements">Food Supplements</option>
                          <option value="Injectables">Injectables</option>
                          <option value="Sterile Pharmaceutical Preparations">Sterile Pharmaceutical Preparations</option>
                          <option value="Ophthalmic Preparations (Eye Drops & Eye Ointments)">Ophthalmic Preparations (Eye Drops & Eye Ointments)</option>
                          <option value="Vitamins & Minerals">Vitamins & Minerals</option>
                          <option value="Ointments & Topicals">Ointments & Topicals</option>
                          <option value="Medical Devices">Medical Devices</option>
                        </select>
                      </div>
                      <div className="form-group mb-3">
                        <label className="form-label">Dosage Form *</label>
                        <select 
                          className="form-control"
                          value={newProduct.dosageForm}
                          onChange={e => setNewProduct({...newProduct, dosageForm: e.target.value})}
                        >
                          <option value="Film Coated Tablet">Film Coated Tablet</option>
                          <option value="Uncoated Tablet">Uncoated Tablet</option>
                          <option value="Enteric Coated Tablet">Enteric Coated Tablet</option>
                          <option value="Sustained Release Tablet">Sustained Release Tablet</option>
                          <option value="Hard Gelatin Capsule">Hard Gelatin Capsule</option>
                          <option value="Softgel Capsule">Softgel Capsule</option>
                          <option value="Syrup">Syrup</option>
                          <option value="Suspension">Suspension</option>
                          <option value="Oral Solution (Nano Shot)">Oral Solution (Nano Shot)</option>
                          <option value="Eye Drops">Eye Drops</option>
                          <option value="Eye Ointment">Eye Ointment</option>
                          <option value="Injectable">Injectable</option>
                          <option value="Gel">Gel</option>
                          <option value="Cream">Cream</option>
                          <option value="Ointment">Ointment</option>
                          <option value="Ayurvedic Liver Tonic">Ayurvedic Liver Tonic</option>
                          <option value="Dry Syrup / Powder">Dry Syrup / Powder</option>
                        </select>
                      </div>
                    </div>
                    <div className="form-row-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div className="form-group mb-3">
                        <label className="form-label">Packaging Specification *</label>
                        <input 
                          type="text" 
                          required
                          className="form-control" 
                          placeholder="e.g. 10 x 10 Tablets / 200 ml Bottle"
                          value={newProduct.packaging}
                          onChange={e => setNewProduct({...newProduct, packaging: e.target.value})}
                        />
                      </div>
                      <div className="form-group mb-3">
                        <label className="form-label">Featured Product</label>
                        <select
                          className="form-control"
                          value={newProduct.featured ? 'yes' : 'no'}
                          onChange={e => setNewProduct({...newProduct, featured: e.target.value === 'yes'})}
                        >
                          <option value="no">Standard Catalog Item</option>
                          <option value="yes">★ Featured on Home & Highlights</option>
                        </select>
                      </div>
                    </div>
                    <div className="form-group mb-3">
                      <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>Product Pack Shot / Image</span>
                        {newProduct.image && (
                          <button
                            type="button"
                            className="text-xs text-red-600 hover:underline"
                            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                            onClick={() => setNewProduct(prev => ({ ...prev, image: '' }))}
                          >
                            Remove Image
                          </button>
                        )}
                      </label>
                      
                      {/* Image Upload Box */}
                      <div 
                        style={{
                          border: '2px dashed #CBD5E1',
                          borderRadius: '10px',
                          padding: '1.25rem',
                          textAlign: 'center',
                          backgroundColor: '#F8FAFC',
                          position: 'relative',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          marginBottom: '0.75rem'
                        }}
                        onClick={() => document.getElementById('admin-product-file-input')?.click()}
                      >
                        <input 
                          type="file" 
                          id="admin-product-file-input"
                          accept="image/*"
                          style={{ display: 'none' }}
                          onChange={handleImageFileChange}
                        />

                        {imageUploadLoading ? (
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', color: '#0284C7' }}>
                            <RefreshCw size={24} className="animate-spin" />
                            <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>Optimizing & uploading image...</span>
                          </div>
                        ) : newProduct.image ? (
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
                            <img 
                              src={newProduct.image} 
                              alt="Preview" 
                              style={{ 
                                width: '72px', 
                                height: '72px', 
                                objectFit: 'cover', 
                                borderRadius: '8px', 
                                border: '1px solid #E2E8F0',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.06)' 
                              }} 
                            />
                            <div style={{ textAlign: 'left' }}>
                              <span style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#16A34A' }}>
                                ✓ Image ready
                              </span>
                              <span style={{ display: 'block', fontSize: '0.75rem', color: '#64748B' }}>
                                Click to replace with another photo
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.35rem' }}>
                            <div style={{
                              width: '40px',
                              height: '40px',
                              borderRadius: '50%',
                              backgroundColor: '#E0F2FE',
                              color: '#0284C7',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              marginBottom: '0.25rem'
                            }}>
                              <Upload size={20} />
                            </div>
                            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#1E293B' }}>
                              Click to upload product image
                            </span>
                            <span style={{ fontSize: '0.75rem', color: '#64748B' }}>
                              Supports PNG, JPG, JPEG, WEBP (auto-optimized for web)
                            </span>
                          </div>
                        )}
                      </div>

                      {imageUploadError && (
                        <p style={{ color: '#EF4444', fontSize: '0.8rem', marginTop: '-0.25rem', marginBottom: '0.5rem' }}>
                          {imageUploadError}
                        </p>
                      )}

                      {/* Fallback URL input option */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontSize: '0.75rem', color: '#94A3B8', whiteSpace: 'nowrap' }}>Or use image URL:</span>
                        <input 
                          type="text" 
                          className="form-control" 
                          style={{ fontSize: '0.8rem', padding: '0.35rem 0.6rem' }}
                          placeholder="/product_images/... or https://..."
                          value={newProduct.image?.startsWith('data:') ? '' : (newProduct.image || '')}
                          onChange={e => setNewProduct({...newProduct, image: e.target.value})}
                        />
                      </div>
                      <small className="text-muted text-sm" style={{ display: 'block', marginTop: '0.25rem' }}>
                        If left blank, the standard Auspik pack packaging shot is automatically used.
                      </small>
                    </div>
                    <div className="form-group mb-3">
                      <label className="form-label">Therapeutic Indications *</label>
                      <textarea 
                        rows="2" 
                        required
                        className="form-control"
                        placeholder="e.g. Relief of smooth muscle spasm, spasmodic dysmenorrhea, abdominal pain..."
                        value={newProduct.indications}
                        onChange={e => setNewProduct({...newProduct, indications: e.target.value})}
                      ></textarea>
                    </div>
                    <div className="form-group mb-3">
                      <label className="form-label">Detailed Formulation Description</label>
                      <textarea 
                        rows="3" 
                        className="form-control"
                        placeholder="e.g. Synergistic antispasmodic and analgesic formulation containing active ingredients..."
                        value={newProduct.description}
                        onChange={e => setNewProduct({...newProduct, description: e.target.value})}
                      ></textarea>
                    </div>
                    <div className="flex justify-end gap-2 mt-4">
                      <button type="button" className="btn btn-secondary" onClick={() => { setShowAddModal(false); setEditingProduct(null); }}>Cancel</button>
                      <button type="submit" className="btn btn-primary">
                        {editingProduct ? 'Save Changes' : 'Save Product'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            <div className="admin-card">
              <div className="table-responsive">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Image</th>
                      <th>Name & Generic</th>
                      <th>Category</th>
                      <th>Form</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map(prod => (
                      <tr key={prod.id}>
                        <td>
                          <img 
                            src={prod.image || '/product_images/WhatsApp Image 2026-09-28 at 11.50.14 AM.jpeg'} 
                            alt={prod.name} 
                            className="table-img" 
                            style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '8px' }}
                          />
                        </td>
                        <td>
                          <strong>{prod.name}</strong><br/>
                          <span className="text-muted text-sm">{prod.genericName}</span>
                        </td>
                        <td><span className="badge-sm bg-light">{prod.category}</span></td>
                        <td>{prod.dosageForm}</td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            <button 
                              className="btn-icon" 
                              onClick={() => handleOpenEditModal(prod)}
                              title="Edit Formulation"
                              style={{ color: '#0284C7' }}
                            >
                              <Edit2 size={16} />
                            </button>
                            <button 
                              className="btn-icon" 
                              onClick={() => handleDeleteProduct(prod.id)}
                              title="Delete Formulation"
                              style={{ color: '#EF4444' }}
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Inquiries Tab */}
        {activeTab === 'inquiries' && (
          <div className="animate-fade-in">
            <h2 className="mb-4">Customer Inquiries</h2>
            <div className="admin-card">
              <div className="table-responsive">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Contact Info</th>
                      <th>Inquiry Details</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inquiries.map(inq => (
                      <tr key={inq.id}>
                        <td>
                          <strong>{inq.name}</strong><br/>
                          <a href={`mailto:${inq.email}`} className="text-primary">{inq.email}</a><br/>
                          <span className="text-muted text-sm">{inq.phone}</span>
                        </td>
                        <td>
                          <span className="badge-sm bg-light">{inq.type}</span>
                          {inq.product && <span className="badge-sm bg-primary ml-1 text-white">{inq.product}</span>}
                          <p className="text-sm mt-1 mb-0 line-clamp-2">{inq.message}</p>
                        </td>
                        <td>{new Date(inq.createdAt).toLocaleString()}</td>
                        <td>
                          <select 
                            className={`status-select status-${inq.status.toLowerCase()}`}
                            value={inq.status}
                            onChange={(e) => handleStatusChange(inq.id, e.target.value)}
                          >
                            <option value="New">New</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                          </select>
                        </td>
                        <td>
                          <button className="btn-icon">View</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="animate-fade-in">
            <h2 className="mb-4">Global Settings</h2>
            <div className="admin-card max-w-lg">
              <form onSubmit={handleSettingsSave}>
                <div className="form-group">
                  <label className="form-label">Company Name</label>
                  <input type="text" className="form-control" value={settings.companyName || ''} onChange={e => setSettingsData({...settings, companyName: e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="form-label">Hero Tagline</label>
                  <input type="text" className="form-control" value={settings.tagline || ''} onChange={e => setSettingsData({...settings, tagline: e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="form-label">Contact Phone</label>
                  <input type="text" className="form-control" value={settings.phone || ''} onChange={e => setSettingsData({...settings, phone: e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="form-label">Contact Email</label>
                  <input type="email" className="form-control" value={settings.email || ''} onChange={e => setSettingsData({...settings, email: e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="form-label">Corporate Address</label>
                  <textarea className="form-control" rows="3" value={settings.address || ''} onChange={e => setSettingsData({...settings, address: e.target.value})}></textarea>
                </div>
                <div className="form-group">
                  <label className="form-label">Certifications Text</label>
                  <input type="text" className="form-control" value={settings.certifications || ''} onChange={e => setSettingsData({...settings, certifications: e.target.value})} />
                </div>
                
                <button type="submit" className="btn btn-primary">Save Settings</button>
              </form>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
