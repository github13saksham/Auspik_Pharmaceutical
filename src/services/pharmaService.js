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

import seededProducts from './seededProducts.json';

// Seed Data with all uploaded authentic product images (80 items)
const seedProducts = seededProducts;

const seedSettings = {
  companyName: 'Auspik Pharmaceuticals Pvt. Ltd.',
  tagline: 'Wellness the Auspicious way.',
  phone: '9671240000, 8222844644, 8053022283',
  email: 'auspikpharma@gmail.com',
  address: '167-B sector 3 industrial area karnal haryana 132001',
  certifications: 'Dedicated to High Quality Medicines'
};

// Initialize LocalStorage Data if Empty or if dummy data detected
export const initLocalData = (forceReset = false) => {
  if (typeof window === 'undefined') return;
  const currentProds = localStorage.getItem('products');
  const catalogVersion = localStorage.getItem('catalog_version');
  const CURRENT_VERSION = 'v2_real_pharma_catalog';
  const hasOutdatedData = !currentProds || 
    currentProds.includes('Auspik Formulation #') || 
    currentProds.includes('NeuroXel-500') || 
    currentProds.includes('CardioStat-40') || 
    catalogVersion !== CURRENT_VERSION;
  
  if (forceReset || hasOutdatedData) {
    localStorage.setItem('products', JSON.stringify(seedProducts));
    localStorage.setItem('catalog_version', CURRENT_VERSION);
  }
  if (!localStorage.getItem('inquiries')) {
    localStorage.setItem('inquiries', JSON.stringify([]));
  }
  if (!localStorage.getItem('settings')) {
    localStorage.setItem('settings', JSON.stringify(seedSettings));
  }
};

if (typeof window !== 'undefined') {
  initLocalData();
}

// Utility to delay for simulating network
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// --- PRODUCTS ---
export const getProducts = async () => {
  if (useLocalStorage) {
    await delay(200);
    initLocalData();
    return JSON.parse(localStorage.getItem('products')) || seedProducts;
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
    const docs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    // If DB currently contains only the old 12 dummy products, update it to real products
    const hasDummyInDB = docs.some(p => p.name === 'NeuroXel-500' || p.name === 'CardioStat-40');
    if (hasDummyInDB) {
      const productsRef = collection(db, "products");
      for (const prod of seedProducts) {
        await setDoc(doc(productsRef, prod.id), prod);
      }
      return seedProducts;
    }
    return docs;
  } catch (error) {
    console.error("Error fetching products from DB, falling back to local:", error);
    initLocalData();
    return JSON.parse(localStorage.getItem('products')) || seedProducts;
  }
};

export const addProduct = async (productData) => {
  const newId = Date.now().toString();
  const product = { ...productData, id: newId };
  
  if (useLocalStorage) {
    await delay(200);
    const products = JSON.parse(localStorage.getItem('products')) || [];
    products.unshift(product);
    localStorage.setItem('products', JSON.stringify(products));
    return product;
  }
  
  try {
    await setDoc(doc(collection(db, "products"), newId), product);
  } catch (e) {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    products.unshift(product);
    localStorage.setItem('products', JSON.stringify(products));
  }
  return product;
};

export const deleteProduct = async (productId) => {
  if (useLocalStorage) {
    await delay(200);
    const products = (JSON.parse(localStorage.getItem('products')) || []).filter(p => p.id !== productId);
    localStorage.setItem('products', JSON.stringify(products));
    return true;
  }
  try {
    const { deleteDoc } = await import('firebase/firestore');
    await deleteDoc(doc(db, "products", productId));
  } catch (e) {
    const products = (JSON.parse(localStorage.getItem('products')) || []).filter(p => p.id !== productId);
    localStorage.setItem('products', JSON.stringify(products));
  }
  return true;
};

export const resetProductsToRealSeed = async () => {
  if (useLocalStorage) {
    localStorage.setItem('products', JSON.stringify(seedProducts));
    return seedProducts;
  }
  try {
    const productsRef = collection(db, "products");
    for (const prod of seedProducts) {
      await setDoc(doc(productsRef, prod.id), prod);
    }
  } catch (e) {
    localStorage.setItem('products', JSON.stringify(seedProducts));
  }
  return seedProducts;
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
