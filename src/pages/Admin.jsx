import { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  MessageSquare, 
  Settings, 
  LogOut, 
  Check, 
  Clock, 
  Plus, 
  Trash2, 
  RefreshCw,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight
} from 'lucide-react';
import companyLogo from '../assets/Project_images/Pharma_Company_logo.jpeg';
import { 
  getProducts, 
  addProduct, 
  deleteProduct, 
  resetProductsToRealSeed, 
  getInquiries, 
  updateInquiryStatus, 
  getSettings, 
  updateSettings 
} from '../services/pharmaService';
import { ADMIN_EMAIL, auth } from '../firebase';
import { signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth';
import './Admin.css';

export default function Admin() {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Auth State - Single Unified Login
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [email, setEmail] = useState(ADMIN_EMAIL);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState('');

  // Data State
  const [products, setProducts] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [settings, setSettingsData] = useState({});
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    genericName: '',
    category: 'Tablets',
    dosageForm: 'Tablet',
    indications: '',
    image: ''
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

  const handleAddProductSubmit = async (e) => {
    e.preventDefault();
    if (!newProduct.name) return;
    await addProduct(newProduct);
    const updated = await getProducts();
    setProducts(updated);
    setShowAddModal(false);
    setNewProduct({ name: '', genericName: '', category: 'Tablets', dosageForm: 'Tablet', indications: '', image: '' });
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
                  placeholder="admin@auspikpharma.com"
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
          <h2>Ausptik Admin</h2>
        </div>
        <nav className="admin-nav">
          <button className={`admin-nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
            <LayoutDashboard size={20} /> Dashboard
          </button>
          <button className={`admin-nav-item ${activeTab === 'products' ? 'active' : ''}`} onClick={() => setActiveTab('products')}>
            <Package size={20} /> Products
          </button>
          <button className={`admin-nav-item ${activeTab === 'inquiries' ? 'active' : ''}`} onClick={() => setActiveTab('inquiries')}>
            <MessageSquare size={20} /> Inquiries
            {inquiries.filter(i => i.status === 'New').length > 0 && 
              <span className="badge-count">{inquiries.filter(i => i.status === 'New').length}</span>
            }
          </button>
          <button className={`admin-nav-item ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')}>
            <Settings size={20} /> Settings
          </button>
        </nav>
        <div className="admin-footer">
          <button onClick={handleLogout} className="btn btn-secondary w-full" style={{ padding: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}><LogOut size={16} /> Exit Admin</button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        
        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="animate-fade-in">
            <h2 className="mb-4">Dashboard Overview</h2>
            <div className="grid-3">
              <div className="stat-card">
                <div className="stat-icon bg-primary"><Package size={24} color="white" /></div>
                <div className="stat-info">
                  <h3>Total Products</h3>
                  <p>{products.length}</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon bg-warning"><MessageSquare size={24} color="white" /></div>
                <div className="stat-info">
                  <h3>New Inquiries</h3>
                  <p>{inquiries.filter(i => i.status === 'New').length}</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon bg-success"><Check size={24} color="white" /></div>
                <div className="stat-info">
                  <h3>Resolved</h3>
                  <p>{inquiries.filter(i => i.status === 'Completed').length}</p>
                </div>
              </div>
            </div>
            
            <h3 className="mt-4 mb-2">Recent Inquiries</h3>
            <div className="admin-card">
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
            </div>
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
                  onClick={() => setShowAddModal(true)}
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
                    <h3 style={{ margin: 0 }}>Add New Pharmaceutical Product</h3>
                    <button className="btn-icon" onClick={() => setShowAddModal(false)} style={{ fontSize: '1.25rem' }}>✕</button>
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
                        <label className="form-label">Therapeutic Category</label>
                        <select 
                          className="form-control"
                          value={newProduct.category}
                          onChange={e => setNewProduct({...newProduct, category: e.target.value})}
                        >
                          <option value="Tablets">Tablets</option>
                          <option value="Capsules">Capsules</option>
                          <option value="Liquids Orals">Liquids Orals</option>
                          <option value="Eye Drops">Eye Drops</option>
                          <option value="Powders">Powders</option>
                          <option value="Herbals">Herbals</option>
                        </select>
                      </div>
                      <div className="form-group mb-3">
                        <label className="form-label">Dosage Form</label>
                        <select 
                          className="form-control"
                          value={newProduct.dosageForm}
                          onChange={e => setNewProduct({...newProduct, dosageForm: e.target.value})}
                        >
                          <option value="Tablet">Tablet</option>
                          <option value="Capsule">Capsule</option>
                          <option value="Syrup (Oral Liquid)">Syrup (Oral Liquid)</option>
                          <option value="Eye Drops">Eye Drops</option>
                          <option value="Dry Powder">Dry Powder</option>
                          <option value="Herbal Formulation">Herbal Formulation</option>
                        </select>
                      </div>
                    </div>
                    <div className="form-group mb-3">
                      <label className="form-label">Image Path / URL (Optional)</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        placeholder="/product_images/... or external link"
                        value={newProduct.image}
                        onChange={e => setNewProduct({...newProduct, image: e.target.value})}
                      />
                      <small className="text-muted text-sm">Leave empty to use default pack shot</small>
                    </div>
                    <div className="form-group mb-3">
                      <label className="form-label">Indications / Therapeutic Notes</label>
                      <textarea 
                        rows="3" 
                        className="form-control"
                        placeholder="Clinical use, packaging details, storage instructions..."
                        value={newProduct.indications}
                        onChange={e => setNewProduct({...newProduct, indications: e.target.value})}
                      ></textarea>
                    </div>
                    <div className="flex justify-end gap-2 mt-4">
                      <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>Cancel</button>
                      <button type="submit" className="btn btn-primary">Save Product</button>
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
                          <button 
                            className="btn-icon" 
                            onClick={() => handleDeleteProduct(prod.id)}
                            title="Delete Formulation"
                            style={{ color: '#EF4444' }}
                          >
                            <Trash2 size={16} />
                          </button>
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
