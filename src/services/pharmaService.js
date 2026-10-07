import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, addDoc, doc, updateDoc, getDoc, setDoc } from 'firebase/firestore';

// Firebase configuration (using process.env for Vite)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

let db = null;
let useLocalStorage = false;

try {
  if (firebaseConfig.apiKey) {
    const app = initializeApp(firebaseConfig);
    db = getFirestore(app);
  } else {
    useLocalStorage = true;
    console.warn("Firebase credentials missing. Falling back to localStorage.");
  }
} catch (error) {
  useLocalStorage = true;
  console.warn("Firebase initialization failed. Falling back to localStorage.", error);
}

// Seed Data
const seedProducts = [
  { id: '1', name: 'NeuroXel-500', genericName: 'Citicoline Sodium 500mg', category: 'Neurology', dosageForm: 'Tablet', indications: 'Stroke, Head Trauma, Cognitive Dysfunction', image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ad?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
  { id: '2', name: 'CardioStat-40', genericName: 'Atorvastatin 40mg', category: 'Cardiology', dosageForm: 'Tablet', indications: 'Hypercholesterolemia, Cardiovascular Risk Reduction', image: 'https://images.unsplash.com/photo-1550572017-edb79904990c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
  { id: '3', name: 'GastroSoothe', genericName: 'Pantoprazole 40mg', category: 'Gastroenterology', dosageForm: 'Capsule', indications: 'GERD, Peptic Ulcer Disease', image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ad?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
  { id: '4', name: 'CeftiMax-1g', genericName: 'Ceftriaxone Injection 1g', category: 'Injectables', dosageForm: 'Injection (Vial)', indications: 'Severe bacterial infections', image: 'https://images.unsplash.com/photo-1628771065518-0d82f1938462?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
  { id: '5', name: 'DermaGlow Plus', genericName: 'Clindamycin + Nicotinamide', category: 'Dermatology', dosageForm: 'Gel', indications: 'Acne Vulgaris', image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
  { id: '6', name: 'NutriVit Gold', genericName: 'Multivitamins + Minerals + Antioxidants', category: 'Nutraceuticals', dosageForm: 'Softgel', indications: 'Nutritional deficiency, Immunity booster', image: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
  { id: '7', name: 'Diabetin-M', genericName: 'Metformin Hydrochloride 500mg SR', category: 'Endocrinology', dosageForm: 'Tablet', indications: 'Type 2 Diabetes Mellitus', image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ad?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
  { id: '8', name: 'BoneCal-D3', genericName: 'Calcium Carbonate + Vitamin D3', category: 'Orthopedics', dosageForm: 'Tablet', indications: 'Osteoporosis, Calcium deficiency', image: 'https://images.unsplash.com/photo-1550572017-edb79904990c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
  { id: '9', name: 'RespiraClear', genericName: 'Levosalbutamol + Ipratropium', category: 'Pulmonology', dosageForm: 'Respul', indications: 'COPD, Asthma', image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ad?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
  { id: '10', name: 'IronMax-XT', genericName: 'Ferrous Ascorbate + Folic Acid', category: 'Gynecology', dosageForm: 'Syrup', indications: 'Iron Deficiency Anemia', image: 'https://images.unsplash.com/photo-1628771065518-0d82f1938462?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
  { id: '11', name: 'HepatoShield', genericName: 'Silymarin + L-Ornithine L-Aspartate', category: 'Hepatology', dosageForm: 'Tablet', indications: 'Liver Disorders, Fatty Liver', image: 'https://images.unsplash.com/photo-1550572017-edb79904990c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
  { id: '12', name: 'PainRelief-SP', genericName: 'Aceclofenac + Paracetamol + Serratiopeptidase', category: 'Orthopedics', dosageForm: 'Tablet', indications: 'Pain and Inflammation', image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ad?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' }
];

const seedSettings = {
  companyName: 'Auspik Pharmaceuticals Pvt. Ltd.',
  tagline: 'Wellness the Auspicious way.',
  phone: '9671240000, 8222844644, 8053022283',
  email: 'auspikpharma@gmail.com',
  address: '167-B sector 3 industrial area karnal haryana 132001',
  certifications: 'WHO-GMP & ISO 9001:2015 Certified'
};

// Initialize LocalStorage Data if Empty
const initLocalData = () => {
  if (!localStorage.getItem('products')) {
    localStorage.setItem('products', JSON.stringify(seedProducts));
  }
  if (!localStorage.getItem('inquiries')) {
    localStorage.setItem('inquiries', JSON.stringify([]));
  }
  if (!localStorage.getItem('settings')) {
    localStorage.setItem('settings', JSON.stringify(seedSettings));
  }
};

if (useLocalStorage) {
  initLocalData();
}

// Utility to delay for simulating network
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// --- PRODUCTS ---
export const getProducts = async () => {
  if (useLocalStorage) {
    await delay(300);
    return JSON.parse(localStorage.getItem('products'));
  }
  try {
    const querySnapshot = await getDocs(collection(db, "products"));
    if (querySnapshot.empty) {
      // Seed DB if empty
      const productsRef = collection(db, "products");
      for (const prod of seedProducts) {
        await setDoc(doc(productsRef, prod.id), prod);
      }
      return seedProducts;
    }
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching products from DB, falling back to local:", error);
    initLocalData();
    return JSON.parse(localStorage.getItem('products'));
  }
};

export const addProduct = async (productData) => {
  const newId = Date.now().toString();
  const product = { ...productData, id: newId };
  
  if (useLocalStorage) {
    await delay(300);
    const products = JSON.parse(localStorage.getItem('products'));
    products.push(product);
    localStorage.setItem('products', JSON.stringify(products));
    return product;
  }
  
  await setDoc(doc(collection(db, "products"), newId), product);
  return product;
};

// --- INQUIRIES ---
export const getInquiries = async () => {
  if (useLocalStorage) {
    await delay(300);
    return JSON.parse(localStorage.getItem('inquiries'));
  }
  const querySnapshot = await getDocs(collection(db, "inquiries"));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const addInquiry = async (inquiryData) => {
  const inquiry = {
    ...inquiryData,
    id: Date.now().toString(),
    status: 'New',
    createdAt: new Date().toISOString()
  };
  
  if (useLocalStorage) {
    await delay(300);
    const inquiries = JSON.parse(localStorage.getItem('inquiries'));
    inquiries.push(inquiry);
    localStorage.setItem('inquiries', JSON.stringify(inquiries));
    return inquiry;
  }
  
  await setDoc(doc(collection(db, "inquiries"), inquiry.id), inquiry);
  return inquiry;
};

export const updateInquiryStatus = async (id, status) => {
  if (useLocalStorage) {
    await delay(200);
    const inquiries = JSON.parse(localStorage.getItem('inquiries'));
    const index = inquiries.findIndex(i => i.id === id);
    if (index !== -1) {
      inquiries[index].status = status;
      localStorage.setItem('inquiries', JSON.stringify(inquiries));
    }
    return;
  }
  
  const inquiryRef = doc(db, "inquiries", id);
  await updateDoc(inquiryRef, { status });
};

// --- SETTINGS ---
export const getSettings = async () => {
  if (useLocalStorage) {
    await delay(300);
    return JSON.parse(localStorage.getItem('settings'));
  }
  try {
    const docSnap = await getDoc(doc(db, "config", "settings"));
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      await setDoc(doc(db, "config", "settings"), seedSettings);
      return seedSettings;
    }
  } catch(error) {
    return seedSettings;
  }
};

export const updateSettings = async (newSettings) => {
  if (useLocalStorage) {
    await delay(300);
    localStorage.setItem('settings', JSON.stringify(newSettings));
    return newSettings;
  }
  
  await setDoc(doc(db, "config", "settings"), newSettings);
  return newSettings;
};
