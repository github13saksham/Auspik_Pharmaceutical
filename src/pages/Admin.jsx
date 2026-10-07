import { useState, useEffect } from 'react';
import { LayoutDashboard, Package, MessageSquare, Settings, LogOut, Check, Clock } from 'lucide-react';
import { getProducts, addProduct, getInquiries, updateInquiryStatus, getSettings, updateSettings } from '../services/pharmaService';
import './Admin.css';

export default function Admin() {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Data State
  const [products, setProducts] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [settings, setSettingsData] = useState({});
  const [loading, setLoading] = useState(true);

  // Load Data
  useEffect(() => {
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
  }, []);

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

  if (loading) {
    return <div className="admin-layout flex justify-center items-center" style={{minHeight: '100vh'}}><div className="spinner"></div></div>;
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
          <a href="/" className="btn btn-secondary w-full" style={{ padding: '0.5rem' }}><LogOut size={16} /> Exit Admin</a>
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
            <div className="flex justify-between items-center mb-4">
              <h2>Manage Products</h2>
              <button className="btn btn-primary">+ Add Product</button>
            </div>
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
                        <td><img src={prod.image} alt={prod.name} className="table-img" /></td>
                        <td>
                          <strong>{prod.name}</strong><br/>
                          <span className="text-muted text-sm">{prod.genericName}</span>
                        </td>
                        <td>{prod.category}</td>
                        <td>{prod.dosageForm}</td>
                        <td>
                          <button className="btn-icon">Edit</button>
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
