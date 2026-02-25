import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';

// --- Home Page (Products List) ---
const Home = ({ products, search, activeCat, setActiveCat, addToCart }) => {
  const filtered = products.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) && 
    (activeCat === "All" || p.category === activeCat)
  );

  return (
    <div className="home-container">
      <div className="filter-container">
        {["All", "Indoor", "Outdoor", "Medicinal"].map(cat => (
          <button key={cat} className={`filter-btn ${activeCat === cat ? 'active' : ''}`} onClick={() => setActiveCat(cat)}>{cat}</button>
        ))}
      </div>
      <div className="product-grid">
        {filtered.map(product => (
          <div key={product._id} className="card">
            <img src={product.image} alt={product.name} className="product-image" />
            <h3>{product.name}</h3>
            <p className="price">₹{product.price}</p>
            <button className="add-btn" onClick={() => addToCart(product)}>Add to Cart</button>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- Main App Component ---
function App() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [activeCat, setActiveCat] = useState("All");
  const [cartItems, setCartItems] = useState([]);
  const [showPayment, setShowPayment] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({ name: '', address: '', phone: '' });
  const [trackingId, setTrackingId] = useState(""); 
  const [orderStatus, setOrderStatus] = useState("");
  const [wishlist, setWishlist] = useState([]); 
   
  useEffect(() => {
    fetch('http://localhost:5000/api/products')
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.log(err));
  }, []);

  const addToCart = (product) => {
    setCartItems([...cartItems, product]);
  };

  const totalPrice = cartItems.reduce((total, item) => total + item.price, 0);

  return (
    <Router>
      <div className="container">
        {/* Navigation Bar */}
        <nav className="navbar">
  <Link to="/" className="logo-link"><h2>🌿 PlantStore</h2></Link>
  <input type="text" placeholder="Search..." className="search-bar" onChange={(e) => setSearch(e.target.value)} />
  <div className="nav-links">
    <Link to="/track" className="track-link" style={{marginRight: '15px'}}>Track Order 🚚</Link>
    <Link to="/cart" className="cart-link">Cart ({cartItems.length}) 🛒</Link>
  </div>
</nav>

        <Routes>
          {/* 1. HOME ROUTE (Products Inga thaan irukku) */}
          <Route path="/" element={
            <Home products={products} search={search} activeCat={activeCat} setActiveCat={setActiveCat} addToCart={addToCart} />
          } />

          {/* 2. CART ROUTE (Payment and Form Inga thaan irukku) */}
          <Route path="/cart" element={
            <div className="page-content">
              <h1>Shopping Cart 🛒</h1>
              {cartItems.length === 0 ? (
                <div style={{textAlign:'center'}}>
                  <p>Cart kaaliya irukku!</p>
                  <Link to="/" className="back-link">Shopping poga click pannunga</Link>
                </div>
              ) : (
                <div className="cart-container">
                  {cartItems.map((item, index) => (
                    <div key={index} className="cart-item-row" style={{borderBottom:'1px solid #ddd', padding:'10px'}}>
                      <span>{item.name} - <b>₹{item.price}</b></span>
                    </div>
                  ))}
                  <h3>Total: ₹{totalPrice}</h3>
                  <button className="checkout-btn" onClick={() => setShowPayment(true)}>Buy Now</button>
                </div>
              )}

              {/* PAYMENT & DELIVERY FORM POPUP */}
              {showPayment && (
                <div className="payment-overlay">
                  <div className="payment-modal">
                    <h2>Delivery Details 🚚</h2>
                    <div style={{ textAlign: 'left', marginBottom: '15px' }}>
                      <input type="text" placeholder="Name" className="info-input" onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})} />
                      <input type="text" placeholder="Address" className="info-input" onChange={(e) => setCustomerInfo({...customerInfo, address: e.target.value})} />
                      <input type="text" placeholder="Phone" className="info-input" onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})} />
                    </div>
                    <hr />
                    <h3>Payment</h3>
                    <p><input type="radio" name="p" defaultChecked /> UPI / Cash on Delivery</p>
                    <button className="pay-now-btn" onClick={() => {
                      if(customerInfo.name && customerInfo.address && customerInfo.phone) {
                        alert(`Order Placed! 🎉\nName: ${customerInfo.name}\nAddress: ${customerInfo.address}`);
                        setCartItems([]);
                        setShowPayment(false);
                      } else {
                        alert("Details-ah fill pannunga!");
                      }
                    }}>Complete Order</button>
                    <button className="pay-now-btn" onClick={() => {
  // Check if all details are filled
  if(customerInfo.name && customerInfo.address && customerInfo.phone) {
    
    // 1. Pudhu Tracking ID create panrom
    const id = "PLANT" + Math.floor(Math.random() * 10000);
    setTrackingId(id);
    setOrderStatus("Processing 📦"); // Status-ah set panrom

    // 2. Alert-la antha ID-ah kaaturoom
    alert(`Order Placed! 🎉\nYour Tracking ID: ${id}\nName: ${customerInfo.name}`);
    
    // 3. Cart-ah empty panrom, popup-ah close panrom
    setCartItems([]);
    setShowPayment(false);
  } else {
    alert("Dayavu seidhu details-ah fill pannunga!");
  }
}}>
  Complete Order & Generate Tracking ID

                    </button>
                  </div>
                </div>
              )}
            </div>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;