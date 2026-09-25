import React, { useState, useEffect } from 'react';
import { supabase } from './supabase';
import { 
  LayoutGrid, 
  PackagePlus, 
  ShoppingCart, 
  Clock, 
  Plus, 
  Minus, 
  Trash2, 
  Edit3, 
  Search, 
  CheckCircle2, 
  LogOut, 
  Lock, 
  Store, 
  Phone, 
  Calendar, 
  Sparkles, 
  Tag, 
  Languages, 
  Percent, 
  Download, 
  Share2, 
  Receipt 
} from 'lucide-react';

const AUTH_USER = "naveenk";
const AUTH_PASS = "0901";
const SESSION_DURATION = 3 * 60 * 60 * 1000;

const translations = {
  en: {
    title: "Store Manager",
    subtitle: "Billing & Inventory",
    loginTitle: "Store Login",
    loginSub: "3 Hours Secure Session",
    username: "Username",
    password: "Password",
    loginBtn: "Login",
    loginErr: "Invalid Username or Password!",
    searchPlace: "Search products...",
    addToCart: "Add to Cart",
    inventoryTitle: "Add New Product",
    editProductTitle: "Edit Product",
    name: "Product Name",
    price: "Price (₹)",
    imgUrl: "Image URL",
    orUpload: "Or Upload Image",
    saveBtn: "Save Product",
    cancelBtn: "Cancel",
    currItems: "Current Items",
    cartTitle: "Billing Cart",
    cartEmpty: "Cart is empty. Add products from Dashboard.",
    browseItems: "Browse Products",
    origPrice: "Price/Unit:",
    discountVal: "Discount (₹):",
    subtotal: "Subtotal:",
    orderDiscount: "Extra Order Discount (₹):",
    grandTotal: "Grand Total:",
    checkoutBtn: "Proceed to Checkout",
    historyTitle: "Order History",
    filterDate: "Filter by Date:",
    noOrders: "No orders found.",
    customerDetails: "Customer & Delivery Details",
    shopName: "Shop / Customer Name",
    phone: "Phone Number",
    deliveryDate: "Delivery Date",
    confirmOrder: "Confirm & Save Order",
    homeTab: "Home",
    itemsTab: "Inventory",
    cartTab: "Cart",
    historyTab: "History",
    orderPlaced: "Order Placed & Synced to Cloud! 🎉",
    itemUpdated: "Product updated successfully!",
    itemAdded: "New product saved to Cloud!",
    itemDeleted: "Product removed!",
    deleteConfirm: "Are you sure you want to delete this product?",
    printBill: "Download / Print PDF",
    whatsappBill: "Share to WhatsApp"
  },
  ta: {
    title: "ஸ்டோர் மேனேஜர்",
    subtitle: "பில்லிங் & ஸ்டாக்",
    loginTitle: "கடை லாகின்",
    loginSub: "3 மணி நேர செக்யூர் செஷன்",
    username: "பயனர் பெயர் (Username)",
    password: "கடவுச்சொல் (Password)",
    loginBtn: "லாகின் செய்க",
    loginErr: "தவறான Username அல்லது Password!",
    searchPlace: "பொருட்களைத் தேடுங்கள்...",
    addToCart: "+ Cart-ல் சேர்",
    inventoryTitle: "புதிய பொருள் சேர்க்க",
    editProductTitle: "பொருளைத் திருத்துக",
    name: "பொருளின் பெயர்",
    price: "விலை (₹)",
    imgUrl: "இமேஜ் URL",
    orUpload: "அல்லது கேலரியிலிருந்து Upload செய்க",
    saveBtn: "சேமிக்க",
    cancelBtn: "ரத்து",
    currItems: "தற்போதைய பொருட்கள்",
    cartTitle: "பில்லிங் கார்ட்",
    cartEmpty: "கார்ட்டில் பொருட்கள் எதுவும் இல்லை.",
    browseItems: "பொருட்களைத் தேர்ந்தெடுக்கவும்",
    origPrice: "ஒரு பொருள் விலை:",
    discountVal: "தள்ளுபடி (₹):",
    subtotal: "பொருட்கள் மொத்தம்:",
    orderDiscount: "கூடுதல் ஆர்டர் தள்ளுபடி (₹):",
    grandTotal: "இறுதித் தொகை:",
    checkoutBtn: "ஆர்டர் விவரங்கள் ➔",
    historyTitle: "ஆர்டர் ஹிஸ்டரி",
    filterDate: "தேதி வாரியாக:",
    noOrders: "ஆர்டர்கள் எதுவும் கிடைக்கவில்லை.",
    customerDetails: "வாடிக்கையாளர் & டெலிவரி விவரங்கள்",
    shopName: "கடை / வாடிக்கையாளர் பெயர்",
    phone: "தொலைபேசி எண்",
    deliveryDate: "டெலிவரி தேதி",
    confirmOrder: "ஆர்டர் செய்க",
    homeTab: "முகப்பு",
    itemsTab: "பொருட்கள்",
    cartTab: "கார்ட்",
    historyTab: "ஹிஸ்டரி",
    orderPlaced: "ஆர்டர் கிளவுடில் சேமிக்கப்பட்டது! 🎉",
    itemUpdated: "பொருள் மாற்றப்பட்டது!",
    itemAdded: "புதிய பொருள் கிளவுடில் சேர்க்கப்பட்டது!",
    itemDeleted: "பொருள் நீக்கப்பட்டது!",
    deleteConfirm: "இந்த பொருளை நீக்க விரும்புகிறீர்களா?",
    printBill: "PDF டவுன்லோட் / Print",
    whatsappBill: "வாட்ஸ்அப் பகிர்வு"
  }
};

export default function App() {
  const [lang, setLang] = useState('en');
  const t = translations[lang];

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginInput, setLoginInput] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');

  const [activeTab, setActiveTab] = useState('dashboard');
  const [inventory, setInventory] = useState([]);
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [notification, setNotification] = useState('');
  const [editingItem, setEditingItem] = useState(null);

  const [itemForm, setItemForm] = useState({ name: '', price: '', image: '' });
  const [orderForm, setOrderForm] = useState({ shopName: '', phone: '', deliveryDate: '', overallDiscount: 0 });

  // 1. Session Checker
  useEffect(() => {
    const checkSession = () => {
      const sessionStart = localStorage.getItem('shop_session_time');
      if (sessionStart) {
        const timePassed = Date.now() - Number(sessionStart);
        if (timePassed < SESSION_DURATION) {
          setIsAuthenticated(true);
        } else {
          handleLogout();
        }
      }
    };
    checkSession();
  }, []);

  // 2. Fetch Data from Supabase Database
  const fetchCloudData = async () => {
    try {
      const { data: prods } = await supabase.from('products').select('*').order('id', { ascending: false });
      if (prods) setInventory(prods);

      const { data: ords } = await supabase.from('orders').select('*').order('order_date', { ascending: false });
      if (ords) {
        const formattedOrders = ords.map(o => ({
          orderId: o.id,
          shopName: o.shop_name,
          phone: o.phone,
          deliveryDate: o.delivery_date,
          orderDate: o.order_date,
          subTotal: Number(o.sub_total),
          overallDiscount: Number(o.overall_discount),
          totalAmount: Number(o.total_amount),
          items: o.items || []
        }));
        setOrders(formattedOrders);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchCloudData();
    }
  }, [isAuthenticated]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (loginInput.username === AUTH_USER && loginInput.password === AUTH_PASS) {
      setIsAuthenticated(true);
      localStorage.setItem('shop_session_time', Date.now().toString());
      setLoginError('');
      setLoginInput({ username: '', password: '' });
    } else {
      setLoginError(t.loginErr);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('shop_session_time');
  };

  const showToast = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 3000);
  };

  const handleImageFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setItemForm({ ...itemForm, image: reader.result });
      reader.readAsDataURL(file);
    }
  };

  // Inventory Cloud Actions
  const handleSaveItem = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await supabase
          .from('products')
          .update({ name: itemForm.name, price: Number(itemForm.price), image: itemForm.image })
          .eq('id', editingItem.id);
        setEditingItem(null);
        showToast(t.itemUpdated);
      } else {
        await supabase
          .from('products')
          .insert([{ name: itemForm.name, price: Number(itemForm.price), image: itemForm.image }]);
        showToast(t.itemAdded);
      }
      setItemForm({ name: '', price: '', image: '' });
      fetchCloudData();
      setActiveTab('dashboard');
    } catch (err) {
      alert("Error saving item: " + err.message);
    }
  };

  const handleDeleteItem = async (id) => {
    if (window.confirm(t.deleteConfirm)) {
      await supabase.from('products').delete().eq('id', id);
      fetchCloudData();
      showToast(t.itemDeleted);
    }
  };

  // Cart Handlers
  const addToCart = (product) => {
    const exists = cart.find(i => i.id === product.id);
    if (exists) {
      setCart(cart.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i));
    } else {
      setCart([...cart, { ...product, qty: 1, discount: 0 }]);
    }
  };

  const updateQuantity = (id, change) => {
    setCart(cart.map(item => {
      if (item.id === id) {
        const nextQty = item.qty + change;
        return nextQty > 0 ? { ...item, qty: nextQty } : null;
      }
      return item;
    }).filter(Boolean));
  };

  const updateItemDiscount = (id, val) => {
    const discountVal = Math.max(0, Number(val) || 0);
    setCart(cart.map(item => item.id === id ? { ...item, discount: discountVal } : item));
  };

  const calculateItemTotal = (item) => {
    const rawTotal = item.price * item.qty;
    return Math.max(0, rawTotal - (Number(item.discount) || 0));
  };

  const subTotal = cart.reduce((sum, i) => sum + calculateItemTotal(i), 0);
  const finalPayable = Math.max(0, subTotal - Math.max(0, Number(orderForm.overallDiscount) || 0));
  const totalCartCount = cart.reduce((acc, c) => acc + c.qty, 0);

  // Save Order to Supabase Cloud
  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    const orderId = 'ORD#' + Math.floor(1000 + Math.random() * 9000);
    const orderData = {
      id: orderId,
      shop_name: orderForm.shopName,
      phone: orderForm.phone,
      delivery_date: orderForm.deliveryDate,
      order_date: new Date().toISOString().split('T')[0],
      sub_total: subTotal,
      overall_discount: Math.max(0, Number(orderForm.overallDiscount) || 0),
      total_amount: finalPayable,
      items: cart.map(it => ({
        id: it.id,
        name: it.name,
        unitPrice: it.price,
        qty: it.qty,
        discount: Number(it.discount) || 0,
        itemTotal: calculateItemTotal(it)
      }))
    };

    try {
      await supabase.from('orders').insert([orderData]);
      setCart([]);
      setIsOrderModalOpen(false);
      setOrderForm({ shopName: '', phone: '', deliveryDate: '', overallDiscount: 0 });
      showToast(t.orderPlaced);
      fetchCloudData();
      setActiveTab('history');
    } catch (err) {
      alert("Error placing order: " + err.message);
    }
  };

  // Print / Save Invoice as PDF
  const handlePrintPDF = (order) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>SAP Traders - ${order.orderId}</title>
        <style>
          * { box-sizing: border-box; }
          body { font-family: Arial, sans-serif; padding: 25px; color: #0f172a; max-width: 800px; margin: auto; }
          .header { text-align: center; border-bottom: 2px solid #e2e8f0; padding-bottom: 12px; margin-bottom: 20px; }
          .company-title { font-size: 26px; font-weight: bold; color: #dc2626; margin: 0; }
          .sub-title { font-size: 13px; font-weight: bold; color: #64748b; margin-top: 4px; text-transform: uppercase; }
          .meta-grid { display: flex; justify-content: space-between; margin-bottom: 20px; font-size: 13px; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 13px; }
          th { background: #dc2626; color: #fff; text-align: left; padding: 8px 10px; }
          td { padding: 8px 10px; border-bottom: 1px solid #e2e8f0; }
          tr:nth-child(even) { background: #f8fafc; }
          .text-right { text-align: right; }
          .text-center { text-align: center; }
          .summary-box { width: 260px; margin-left: auto; border: 1px solid #e2e8f0; border-radius: 6px; padding: 10px 14px; }
          .summary-row { display: flex; justify-content: space-between; font-size: 13px; padding: 3px 0; }
          .grand-total { font-size: 15px; font-weight: bold; color: #16a34a; border-top: 2px solid #e2e8f0; padding-top: 6px; margin-top: 4px; }
          .footer { text-align: center; margin-top: 35px; font-size: 12px; color: #94a3b8; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1 class="company-title">SAP TRADERS</h1>
          <p class="sub-title">Invoice Bill</p>
        </div>
        <div class="meta-grid">
          <div>
            <strong>Customer:</strong> ${order.shopName}<br/>
            <strong>Phone:</strong> ${order.phone}
          </div>
          <div class="text-right">
            <strong>Order ID:</strong> <span style="color:#dc2626;">${order.orderId}</span><br/>
            <strong>Date:</strong> ${order.orderDate}<br/>
            <strong>Delivery:</strong> ${order.deliveryDate || 'Immediate'}
          </div>
        </div>
        <table>
          <thead>
            <tr>
              <th style="width: 35px;">#</th>
              <th>Item Name</th>
              <th class="text-right">Price</th>
              <th class="text-center">Qty</th>
              <th class="text-right">Discount</th>
              <th class="text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            ${order.items.map((item, idx) => `
              <tr>
                <td class="text-center">${idx + 1}</td>
                <td><strong>${item.name}</strong></td>
                <td class="text-right">₹${item.unitPrice}</td>
                <td class="text-center">${item.qty}</td>
                <td class="text-right" style="color: #dc2626;">${item.discount > 0 ? `-₹${item.discount}` : '-'}</td>
                <td class="text-right"><strong>₹${item.itemTotal}</strong></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        <div class="summary-box">
          <div class="summary-row">
            <span>Subtotal:</span>
            <span>₹${order.subTotal || order.totalAmount}</span>
          </div>
          ${order.overallDiscount > 0 ? `
            <div class="summary-row" style="color: #dc2626;">
              <span>Extra Discount:</span>
              <span>-₹${order.overallDiscount}</span>
            </div>
          ` : ''}
          <div class="summary-row grand-total">
            <span>Grand Total:</span>
            <span>₹${order.totalAmount}</span>
          </div>
        </div>
        <div class="footer">Thank you for doing business with <strong>SAP Traders</strong>!</div>
        <script>
          window.onload = function() { setTimeout(function() { window.print(); }, 300); };
        </script>
      </body>
      </html>
    `;
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  // WhatsApp formatted message & bill sender
  const handleWhatsAppShare = (order) => {
    let cleanPhone = (order.phone || '').replace(/[^0-9]/g, '');
    if (cleanPhone.length === 10) cleanPhone = '91' + cleanPhone;

    let itemsText = order.items.map((it, idx) => {
      const disc = it.discount > 0 ? ` [Disc: -₹${it.discount}]` : '';
      return `${idx + 1}. *${it.name}* (₹${it.unitPrice} x ${it.qty})${disc} = *₹${it.itemTotal}*`;
    }).join('\n');

    let message = `🏢 *SAP TRADERS - INVOICE BILL*\n` +
      `--------------------------------\n` +
      `🆔 *Order ID:* ${order.orderId}\n` +
      `🏬 *Shop:* ${order.shopName}\n` +
      `📅 *Date:* ${order.orderDate}\n` +
      `🚚 *Delivery Date:* ${order.deliveryDate || 'N/A'}\n` +
      `--------------------------------\n` +
      `*ORDERED ITEMS:*\n${itemsText}\n` +
      `--------------------------------\n` +
      `*Subtotal:* ₹${order.subTotal || order.totalAmount}\n` +
      (order.overallDiscount > 0 ? `*Extra Discount:* -₹${order.overallDiscount}\n` : '') +
      `*💰 GRAND TOTAL: ₹${order.totalAmount}*\n` +
      `--------------------------------\n` +
      `_Thank you for your business!_`;

    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  // ================= LOGIN SCREEN =================
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 font-sans">
        <div className="w-full max-w-sm bg-slate-900 rounded-3xl p-6 border border-slate-800 shadow-2xl">
          <div className="flex justify-end mb-2">
            <button 
              onClick={() => setLang(lang === 'en' ? 'ta' : 'en')}
              className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-800 text-red-400 border border-slate-700 flex items-center gap-1 hover:bg-slate-700"
            >
              <Languages size={13} /> {lang === 'en' ? 'தமிழ்' : 'English'}
            </button>
          </div>

          <div className="text-center mb-5">
            <div className="w-12 h-12 bg-gradient-to-tr from-red-600 to-rose-600 rounded-2xl mx-auto flex items-center justify-center shadow-lg shadow-red-600/30 mb-2">
              <Lock className="text-white" size={22} />
            </div>
            <h2 className="text-xl font-bold tracking-tight text-white">{t.loginTitle}</h2>
            <p className="text-slate-400 text-xs mt-0.5">{t.loginSub}</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-3.5">
            <div>
              <label className="text-xs text-slate-300 font-medium">{t.username}</label>
              <input 
                type="text" 
                required 
                value={loginInput.username} 
                onChange={e => setLoginInput({ ...loginInput, username: e.target.value })}
                className="w-full mt-1 px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500" 
                placeholder="admin"
              />
            </div>
            <div>
              <label className="text-xs text-slate-300 font-medium">{t.password}</label>
              <input 
                type="password" 
                required 
                value={loginInput.password} 
                onChange={e => setLoginInput({ ...loginInput, password: e.target.value })}
                className="w-full mt-1 px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500" 
                placeholder="1234"
              />
            </div>

            {loginError && <p className="text-red-400 text-xs font-semibold text-center">{loginError}</p>}

            <button type="submit" className="w-full py-3 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-red-600/30 transition transform active:scale-95">
              {t.loginBtn}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ================= MAIN APPLICATION VIEW =================
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between select-none font-sans">
      
      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-slate-900/95 backdrop-blur-md border-b border-slate-800/80 shadow-md shadow-red-950/20">
        <div className="max-w-6xl mx-auto px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-red-600 to-rose-600 flex items-center justify-center shadow-md shadow-red-600/30">
              <Sparkles size={15} className="text-white" />
            </div>
            <div>
              <h1 className="text-sm font-extrabold tracking-tight text-white uppercase antialiased leading-none">SAP TRADERS</h1>
              <p className="text-[10px] font-medium text-red-400 tracking-wider mt-0.5">{t.subtitle}</p>
            </div>
          </div>

          <nav className="hidden md:flex items-center space-x-1">
            <button onClick={() => setActiveTab('dashboard')} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${activeTab === 'dashboard' ? 'bg-red-600/15 text-red-400 border border-red-500/30' : 'text-slate-400 hover:text-white'}`}>{t.homeTab}</button>
            <button onClick={() => setActiveTab('inventory')} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${activeTab === 'inventory' ? 'bg-red-600/15 text-red-400 border border-red-500/30' : 'text-slate-400 hover:text-white'}`}>{t.itemsTab}</button>
            <button onClick={() => setActiveTab('cart')} className={`px-3 py-1.5 rounded-lg text-xs font-bold relative transition ${activeTab === 'cart' ? 'bg-red-600/15 text-red-400 border border-red-500/30' : 'text-slate-400 hover:text-white'}`}>
              {t.cartTab} {totalCartCount > 0 && <span className="ml-1 px-1.5 py-0.2 bg-red-600 text-white rounded-full text-[10px]">{totalCartCount}</span>}
            </button>
            <button onClick={() => setActiveTab('history')} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${activeTab === 'history' ? 'bg-red-600/15 text-red-400 border border-red-500/30' : 'text-slate-400 hover:text-white'}`}>{t.historyTab}</button>
          </nav>

          <div className="flex items-center space-x-2">
            <button 
              onClick={() => setLang(lang === 'en' ? 'ta' : 'en')}
              className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-slate-800 text-red-400 border border-slate-700 hover:bg-slate-700 hover:border-red-500/50 transition flex items-center gap-1"
            >
              <Languages size={12} /> {lang === 'en' ? 'தமிழ்' : 'EN'}
            </button>
            <button onClick={handleLogout} className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-red-400 hover:bg-red-950/40 border border-slate-700 transition">
              <LogOut size={14} />
            </button>
          </div>
        </div>
      </header>

      {notification && (
        <div className="fixed top-14 inset-x-4 max-w-sm mx-auto bg-emerald-500 text-slate-950 px-3.5 py-2 rounded-xl shadow-xl flex items-center space-x-2 z-50 animate-bounce">
          <CheckCircle2 size={16} />
          <span className="text-xs font-bold">{notification}</span>
        </div>
      )}

      <main className="max-w-6xl w-full mx-auto px-4 py-4 pb-20 md:pb-8 flex-1">
        
        {/* DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="space-y-4">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-2.5 text-slate-400" size={15} />
              <input 
                type="text" 
                placeholder={t.searchPlace} 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {inventory
                .filter(i => i.name.toLowerCase().includes(searchTerm.toLowerCase()))
                .map(item => {
                  const cartItem = cart.find(c => c.id === item.id);
                  return (
                    <div key={item.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-2.5 flex flex-col justify-between hover:border-slate-700 transition relative">
                      <div className="relative h-28 w-full rounded-xl overflow-hidden bg-slate-800">
                        <img src={item.image || 'https://placehold.co/200x200?text=No+Img'} alt={item.name} className="w-full h-full object-cover" />
                        <div className="absolute top-1 right-1 bg-slate-950/80 backdrop-blur-sm px-2 py-0.5 rounded-md text-[10px] font-bold text-red-400">
                          ₹{item.price}
                        </div>
                      </div>

                      <div className="mt-2 flex-1 flex flex-col justify-between">
                        <h4 className="text-xs font-semibold text-slate-200 line-clamp-1">{item.name}</h4>
                        
                        {cartItem ? (
                          <div className="flex items-center justify-between mt-2 bg-slate-800 rounded-xl p-1 border border-slate-700">
                            <button onClick={() => updateQuantity(item.id, -1)} className="p-1 rounded-lg bg-slate-700 text-white active:scale-90"><Minus size={11} /></button>
                            <span className="text-xs font-bold text-red-400">{cartItem.qty}</span>
                            <button onClick={() => updateQuantity(item.id, 1)} className="p-1 rounded-lg bg-slate-700 text-white active:scale-90"><Plus size={11} /></button>
                          </div>
                        ) : (
                          <button 
                            onClick={() => addToCart(item)} 
                            className="mt-2 w-full py-1.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-bold text-[10px] rounded-xl shadow-md shadow-red-600/20 transition active:scale-95"
                          >
                            {t.addToCart}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* INVENTORY */}
        {activeTab === 'inventory' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm h-fit">
              <h3 className="text-xs font-bold text-white flex items-center gap-1.5 mb-3">
                <PackagePlus size={15} className="text-red-400" />
                {editingItem ? t.editProductTitle : t.inventoryTitle}
              </h3>
              <form onSubmit={handleSaveItem} className="space-y-3">
                <div>
                  <label className="text-[10px] text-slate-400">{t.name}</label>
                  <input 
                    type="text" 
                    required 
                    value={itemForm.name} 
                    onChange={e => setItemForm({ ...itemForm, name: e.target.value })}
                    className="w-full mt-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-red-500" 
                    placeholder="Ex: Pattai Packets" 
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400">{t.price}</label>
                  <input 
                    type="number" 
                    required 
                    value={itemForm.price} 
                    onChange={e => setItemForm({ ...itemForm, price: e.target.value })}
                    className="w-full mt-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-red-500" 
                    placeholder="Ex: 400" 
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400">{t.imgUrl}</label>
                  <input 
                    type="text" 
                    value={itemForm.image} 
                    onChange={e => setItemForm({ ...itemForm, image: e.target.value })}
                    className="w-full mt-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-red-500" 
                    placeholder="https://..." 
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400">{t.orUpload}</label>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageFile}
                    className="w-full mt-1 text-[10px] text-slate-400 file:mr-2 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:bg-slate-800 file:text-slate-300" 
                  />
                </div>
                
                <div className="flex gap-2 pt-1">
                  <button type="submit" className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs shadow-md shadow-red-600/30 transition">
                    {editingItem ? t.saveBtn : `+ ${t.saveBtn}`}
                  </button>
                  {editingItem && (
                    <button type="button" onClick={() => { setEditingItem(null); setItemForm({ name: '', price: '', image: '' }); }} className="px-3 bg-slate-800 text-slate-300 rounded-xl text-xs">
                      {t.cancelBtn}
                    </button>
                  )}
                </div>
              </form>
            </div>

            <div className="md:col-span-2 space-y-2">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t.currItems} ({inventory.length})</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {inventory.map(item => (
                  <div key={item.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-2.5 flex items-center justify-between">
                    <div className="flex items-center space-x-2.5">
                      <img src={item.image || 'https://placehold.co/100x100?text=No+Img'} alt="" className="w-11 h-11 rounded-xl object-cover bg-slate-800 border border-slate-700" />
                      <div>
                        <h4 className="text-xs font-bold text-white truncate max-w-[140px]">{item.name}</h4>
                        <p className="text-xs font-semibold text-red-400">₹{item.price}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <button onClick={() => { setEditingItem(item); setItemForm(item); }} className="p-2 bg-slate-800 text-slate-300 hover:text-red-400 rounded-xl">
                        <Edit3 size={13} />
                      </button>
                      <button onClick={() => handleDeleteItem(item.id)} className="p-2 bg-slate-800 text-slate-300 hover:text-rose-500 rounded-xl">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* CART */}
        {activeTab === 'cart' && (
          <div className="max-w-xl mx-auto space-y-4">
            {cart.length > 0 && (
              <div className="bg-gradient-to-r from-slate-900 to-red-950/40 border border-red-500/30 rounded-2xl p-3.5 flex items-center justify-between shadow-lg">
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase tracking-wider font-semibold">Total Items: {totalCartCount}</span>
                  <h3 className="text-xs font-bold text-white mt-0.5">{t.grandTotal}</h3>
                </div>
                <span className="text-lg font-black text-emerald-400">₹{subTotal}</span>
              </div>
            )}

            <h2 className="text-xs font-bold text-white flex items-center gap-1.5">
              <ShoppingCart size={15} className="text-red-400" /> {t.cartTitle}
            </h2>

            {cart.length === 0 ? (
              <div className="text-center py-14 bg-slate-900/50 border border-dashed border-slate-800 rounded-3xl">
                <ShoppingCart size={32} className="mx-auto text-slate-600 mb-2" />
                <p className="text-xs text-slate-400">{t.cartEmpty}</p>
                <button onClick={() => setActiveTab('dashboard')} className="mt-3 px-3.5 py-2 bg-slate-800 text-red-400 text-xs font-semibold rounded-xl">{t.browseItems}</button>
              </div>
            ) : (
              <div className="space-y-2.5">
                {cart.map(item => {
                  const itemNetTotal = calculateItemTotal(item);
                  return (
                    <div key={item.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 space-y-2.5">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-xs font-bold text-white">{item.name}</h4>
                          <span className="text-[10px] text-slate-400">
                            {t.origPrice} ₹{item.price} × {item.qty} = <span className="text-slate-300">₹{item.price * item.qty}</span>
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-bold text-emerald-400">₹{itemNetTotal}</span>
                          {item.discount > 0 && (
                            <span className="text-[9px] text-red-400 block font-medium">Disc: -₹{item.discount}</span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                        <div className="flex items-center gap-1.5">
                          <Tag size={11} className="text-red-400" />
                          <span className="text-[10px] text-slate-400">{t.discountVal}</span>
                          <input 
                            type="number" 
                            min="0"
                            placeholder="0"
                            value={item.discount || ''} 
                            onChange={e => updateItemDiscount(item.id, e.target.value)}
                            className="w-16 px-2 py-0.5 bg-slate-950 border border-red-500/50 rounded-lg text-xs font-bold text-red-400 text-center focus:outline-none focus:border-red-500"
                          />
                        </div>

                        <div className="flex items-center space-x-1.5 bg-slate-800 rounded-xl p-0.5 border border-slate-700">
                          <button onClick={() => updateQuantity(item.id, -1)} className="p-1 rounded-lg bg-slate-700 text-white"><Minus size={10} /></button>
                          <span className="text-xs font-bold px-1.5">{item.qty}</span>
                          <button onClick={() => updateQuantity(item.id, 1)} className="p-1 rounded-lg bg-slate-700 text-white"><Plus size={10} /></button>
                        </div>
                      </div>
                    </div>
                  );
                })}

                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 space-y-1.5">
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>{t.subtotal}</span>
                    <span className="font-semibold text-slate-200">₹{subTotal}</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-white border-t border-slate-800 pt-1.5">
                    <span>{t.grandTotal}</span>
                    <span className="text-emerald-400">₹{subTotal}</span>
                  </div>
                </div>

                <button 
                  onClick={() => setIsOrderModalOpen(true)}
                  className="w-full py-3.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-bold rounded-2xl shadow-lg shadow-red-600/30 text-xs tracking-wide transition active:scale-95"
                >
                  {t.checkoutBtn}
                </button>
              </div>
            )}
          </div>
        )}

        {/* ORDER HISTORY */}
        {activeTab === 'history' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-slate-900 border border-slate-800 p-3.5 rounded-2xl">
              <h2 className="text-xs font-bold text-white flex items-center gap-1.5">
                <Clock size={14} className="text-red-400" /> {t.historyTitle}
              </h2>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-slate-400">{t.filterDate}</span>
                <input 
                  type="date" 
                  value={filterDate} 
                  onChange={e => setFilterDate(e.target.value)}
                  className="bg-slate-950 border border-slate-800 text-[11px] text-slate-300 px-2 py-1 rounded-lg focus:outline-none focus:border-red-500"
                />
                {filterDate && <button onClick={() => setFilterDate('')} className="text-[10px] text-red-400 underline">Clear</button>}
              </div>
            </div>

            {orders.filter(o => !filterDate || o.orderDate === filterDate).length === 0 ? (
              <div className="text-center py-14 bg-slate-900/40 border border-slate-800 rounded-2xl">
                <p className="text-xs text-slate-500">{t.noOrders}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {orders.filter(o => !filterDate || o.orderDate === filterDate).map(order => (
                  <div key={order.orderId} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3 shadow-lg">
                    
                    <div className="flex justify-between items-start border-b border-slate-800/80 pb-3">
                      <div>
                        <span className="text-[9px] font-extrabold text-red-400 bg-red-500/10 px-2 py-0.5 rounded-md border border-red-500/20">{order.orderId}</span>
                        <h4 className="text-xs font-bold text-white mt-1.5 flex items-center gap-1">
                          <Store size={12} className="text-slate-400" /> {order.shopName}
                        </h4>
                        <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                          <Phone size={11} /> {order.phone}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-slate-500 block">{order.orderDate}</span>
                        <div className="mt-1 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-lg">
                          <span className="text-[9px] text-slate-400 block leading-none">{t.grandTotal}</span>
                          <span className="text-sm font-black text-emerald-400">₹{order.totalAmount}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 block mt-1 flex items-center justify-end gap-1">
                          <Calendar size={10} /> {order.deliveryDate}
                        </span>
                      </div>
                    </div>

                    <div className="bg-slate-950/80 rounded-xl p-2.5 border border-slate-800/60 overflow-x-auto">
                      <table className="w-full text-left text-[11px]">
                        <thead>
                          <tr className="text-slate-500 border-b border-slate-800/80 pb-1 text-[10px]">
                            <th className="py-1">Item</th>
                            <th className="text-center py-1">Unit × Qty</th>
                            <th className="text-center py-1">Disc</th>
                            <th className="text-right py-1">Total</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/40">
                          {order.items.map((it, idx) => (
                            <tr key={idx} className="text-slate-300">
                              <td className="py-1.5 font-semibold text-white">{it.name}</td>
                              <td className="text-center py-1.5 text-slate-400">₹{it.unitPrice} × {it.qty}</td>
                              <td className="text-center py-1.5 text-red-400 font-medium">{it.discount > 0 ? `-₹${it.discount}` : '-'}</td>
                              <td className="text-right py-1.5 font-bold text-slate-200">₹{it.itemTotal}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>

                      <div className="border-t border-slate-800/80 mt-2.5 pt-2 space-y-1 text-xs">
                        <div className="flex justify-between text-slate-400">
                          <span>{t.subtotal}</span>
                          <span className="font-semibold text-slate-200">₹{order.subTotal || order.totalAmount}</span>
                        </div>
                        {order.overallDiscount > 0 && (
                          <div className="flex justify-between text-red-400">
                            <span>{t.orderDiscount}</span>
                            <span className="font-semibold">-₹{order.overallDiscount}</span>
                          </div>
                        )}
                        <div className="flex justify-between font-bold text-emerald-400 text-sm border-t border-slate-800/40 pt-1">
                          <span>{t.grandTotal}</span>
                          <span>₹{order.totalAmount}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <button 
                        onClick={() => handlePrintPDF(order)}
                        className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 border border-slate-700 transition"
                      >
                        <Download size={14} className="text-red-400" />
                        {t.printBill}
                      </button>

                      <button 
                        onClick={() => handleWhatsAppShare(order)}
                        className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-emerald-900/20 transition"
                      >
                        <Share2 size={14} />
                        {t.whatsappBill}
                      </button>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* POPUP MODAL */}
      {isOrderModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 w-full max-w-sm space-y-3.5 shadow-2xl">
            <h3 className="text-xs font-bold text-white text-center uppercase tracking-wider flex items-center justify-center gap-1.5">
              <Receipt size={14} className="text-red-400" /> {t.customerDetails}
            </h3>
            <form onSubmit={handlePlaceOrder} className="space-y-2.5">
              <div>
                <label className="text-[10px] text-slate-400">{t.shopName}</label>
                <input 
                  type="text" 
                  required 
                  value={orderForm.shopName} 
                  onChange={e => setOrderForm({ ...orderForm, shopName: e.target.value })}
                  placeholder="Ex: Murugan Stores" 
                  className="w-full mt-0.5 px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-red-500" 
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400">{t.phone}</label>
                <input 
                  type="tel" 
                  required 
                  value={orderForm.phone} 
                  onChange={e => setOrderForm({ ...orderForm, phone: e.target.value })}
                  placeholder="Ex: 9876543210" 
                  className="w-full mt-0.5 px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-red-500" 
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400">{t.deliveryDate}</label>
                <input 
                  type="date" 
                  required 
                  min={new Date().toISOString().split('T')[0]}
                  value={orderForm.deliveryDate} 
                  onChange={e => setOrderForm({ ...orderForm, deliveryDate: e.target.value })}
                  className="w-full mt-0.5 px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-red-500" 
                />
              </div>

              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <div className="flex justify-between items-center mb-1">
                  <label className="text-[10px] text-slate-300 font-semibold flex items-center gap-1">
                    <Percent size={11} className="text-red-400" /> {t.orderDiscount}
                  </label>
                  <input 
                    type="number" 
                    min="0"
                    value={orderForm.overallDiscount || ''} 
                    onChange={e => setOrderForm({ ...orderForm, overallDiscount: e.target.value })}
                    placeholder="0"
                    className="w-20 px-2 py-1 bg-slate-900 border border-slate-700 rounded-lg text-xs font-bold text-red-400 text-center focus:outline-none focus:border-red-500" 
                  />
                </div>
                <div className="flex justify-between items-center text-xs font-bold text-white border-t border-slate-800 pt-1.5 mt-1">
                  <span>{t.grandTotal}</span>
                  <span className="text-emerald-400 text-sm">₹{finalPayable}</span>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setIsOrderModalOpen(false)} className="flex-1 py-2.5 bg-slate-800 text-slate-300 text-xs font-bold rounded-xl">{t.cancelBtn}</button>
                <button type="submit" className="flex-1 py-2.5 bg-gradient-to-r from-red-600 to-rose-600 text-white text-xs font-bold rounded-xl shadow-md shadow-red-600/30">{t.confirmOrder}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Mobile Navigation */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 bg-slate-900/95 backdrop-blur-lg border-t border-slate-800 px-3 py-1.5 flex justify-around items-center z-40">
        <button onClick={() => setActiveTab('dashboard')} className={`flex flex-col items-center py-1 px-2.5 rounded-xl transition ${activeTab === 'dashboard' ? 'text-red-400 font-bold' : 'text-slate-400'}`}>
          <LayoutGrid size={16} /><span className="text-[9px] mt-0.5">{t.homeTab}</span>
        </button>
        <button onClick={() => setActiveTab('inventory')} className={`flex flex-col items-center py-1 px-2.5 rounded-xl transition ${activeTab === 'inventory' ? 'text-red-400 font-bold' : 'text-slate-400'}`}>
          <PackagePlus size={16} /><span className="text-[9px] mt-0.5">{t.itemsTab}</span>
        </button>
        <button onClick={() => setActiveTab('cart')} className={`flex flex-col items-center py-1 px-2.5 rounded-xl relative transition ${activeTab === 'cart' ? 'text-red-400 font-bold' : 'text-slate-400'}`}>
          <ShoppingCart size={16} />
          {totalCartCount > 0 && <span className="absolute top-0 right-1 w-3.5 h-3.5 bg-red-600 text-white rounded-full text-[8px] font-bold flex items-center justify-center">{totalCartCount}</span>}
          <span className="text-[9px] mt-0.5">{t.cartTab}</span>
        </button>
        <button onClick={() => setActiveTab('history')} className={`flex flex-col items-center py-1 px-2.5 rounded-xl transition ${activeTab === 'history' ? 'text-red-400 font-bold' : 'text-slate-400'}`}>
          <Clock size={16} /><span className="text-[9px] mt-0.5">{t.historyTab}</span>
        </button>
      </nav>
    </div>
  );
}