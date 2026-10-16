import { useState, useEffect } from 'react';
import { LayoutDashboard, Package, MessageSquare, Settings, LogOut, Check, Clock, Plus, Trash2, RefreshCw } from 'lucide-react';
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
import { auth } from '../firebase';
import { signInWithEmailAndPassword, onAuthStateChanged, signOut, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import './Admin.css';

export default function Admin() {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Auth State
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
      if (currentUser && currentUser.email !== 'auspikbackend@gmail.com') {
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
    if (window.confirm('Reset all formulations to the 80 uploaded images?')) {
      const updated = await resetProductsToRealSeed();
      setProducts(updated);
      alert('Formulations successfully updated with authentic images!');
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
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      // Strict Check
      if (result.user.email !== 'auspikbackend@gmail.com') {
        await signOut(auth);
        setAuthError('Access Denied: Only auspikbackend@gmail.com is allowed.');
      }
    } catch (error) {
      setAuthError('Google sign in failed. Please try again.');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError('');
    if (email !== 'auspikbackend@gmail.com') {
      setAuthError('Access Denied: Only auspikbackend@gmail.com is allowed.');
      return;
    }
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      setAuthError('Invalid email or password.');
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    window.location.href = '/';
  };

  if (authLoading || loading) {
    return <div className="admin-layout flex justify-center items-center" style={{minHeight: '100vh'}}><div className="spinner"></div></div>;
  }

  if (!user) {
    return (
      <div className="admin-layout flex justify-center items-center" style={{minHeight: '100vh', background: '#f8fafc', padding: '20px', display: 'flex'}}>
        <div className="admin-card max-w-md w-full" style={{padding: '2.5rem', margin: 'auto', display: 'block', maxWidth: '400px'}}>
          <h2 className="text-center mb-4" style={{textAlign: 'center', marginBottom: '1.5rem'}}>Admin Login</h2>
          
          <button 
            type="button" 
            onClick={handleGoogleLogin} 
            className="btn btn-secondary w-full" 
            style={{width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '1.5rem', backgroundColor: 'white', color: '#333', border: '1px solid #ccc'}}
          >
            <svg width="18" height="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.7 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>
            Sign in with Google
          </button>

          <div style={{display: 'flex', alignItems: 'center', margin: '1.5rem 0'}}>
            <div style={{flex: 1, height: '1px', background: '#e2e8f0'}}></div>
            <span style={{padding: '0 10px', color: '#64748b', fontSize: '0.85rem'}}>OR EMAIL</span>
            <div style={{flex: 1, height: '1px', background: '#e2e8f0'}}></div>
          </div>

          {authError && <div style={{color: 'red', marginBottom: '1rem', textAlign: 'center'}}>{authError}</div>}
          <form onSubmit={handleLogin}>
            <div className="form-group" style={{marginBottom: '1rem'}}>
              <label className="form-label" style={{display: 'block', marginBottom: '0.5rem'}}>Email</label>
              <input type="email" required className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} style={{width: '100%'}} />
            </div>
            <div className="form-group" style={{marginBottom: '1.5rem'}}>
              <label className="form-label" style={{display: 'block', marginBottom: '0.5rem'}}>Password</label>
              <input type="password" required className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} style={{width: '100%'}} />
            </div>
            <button type="submit" className="btn btn-primary w-full" style={{width: '100%', display: 'block'}}>Log In</button>
          </form>
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
                  title="Re-seed all 80 uploaded formulations"
                >
                  <RefreshCw size={16} />
                  <span>Sync 80 Real Products</span>
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
