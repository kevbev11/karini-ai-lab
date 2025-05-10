'use client';

import { useEffect, useState } from 'react';
import axios from "axios";

export default function HomePage() {
  const [items, setItems] = useState<any[]>([]);
  const [searchInput, setSearchInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<any[]>([]);

  const [response, setResponse] = useState<string>("");
  const [value, setValue] = useState<string>("");
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setValue(e.target.value);


  const handleSubmit = async () => {
    try {
      const res = await axios.post("/api/chat", { question: value });
      setResponse(res.data.reply);
    } catch (err: any) {
      console.error("Chat error:", err);
      if (err.response?.data?.error) {
        setResponse("❌ " + err.response.data.error);
      } else {
        setResponse("Something went wrong with the AI response.");
      }
    }
  };

  useEffect(() => {
    fetch('/api/items')
      .then(res => res.json())
      .then(data => {
        console.log('Fetched data:', data);
        const filtered = data.filter(
          (item: any) =>
            item["Title"] &&
            item["Variant SKU"] &&
            item["Variant Price"] &&
            item["Image Src"]
        );
        setItems(filtered);
      });
  }, []);

  const displayedItems = items.filter((item) => 
    item["Title"]?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item["Variant SKU"]?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    ///////////////////////////////////
    // TOP BAR
    ///////////////////////////////////
    <div
      style={{
        backgroundColor: '#f5f5f5',
        minHeight: '100vh',
        padding: '40px'
      }}
    >
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          backgroundColor: '#fff',
          padding: '16px 40px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '20px',
        }}
      >
        <h1 style={{ margin: 0, fontSize: '1.5rem', color: "#000000" }}>Karini AI</h1>
        <button
          onClick={async () => {
            try {
              const res = await fetch('/api/cart');
              const text = await res.text();
              console.log('📦 Raw cart response:', text);
          
              const data = JSON.parse(text);
              if (!Array.isArray(data)) {
                console.error('Cart data is not an array:', data);
                alert('Server error: Invalid response.');
                return;
              }
          
              setCartItems(data);
              setCartOpen(true);
            } catch (err) {
              console.error('Failed to fetch cart:', err);
              alert('Failed to load cart.');
            }
          }}
          style={{
            marginTop: '0px',
            padding: '10px 16px',
            backgroundColor: '#4b3f72',
            color: '#ffffff',
            border: 'none',
            fontSize: '1rem',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'background-color 0.2s ease',
          }}
        >
          View Cart
        </button>
        <input
          type="text"
          placeholder="What are you looking for?"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              setSearchTerm(searchInput);
            }
          }}
          style={{
            width: '300px',
            padding: '10px 14px',
            fontSize: '1rem',
            border: '1px solid #ccc',
            color: '#000000'
          }}
        />
      </div>
      
      {/*DISPLAYING DATA*/}
      <div
        style={{
          marginTop: '60px',
          marginLeft: '20px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, 260px)',
          gap: '20px',
        }}
      >
        {items.length === 0
          ? Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                style={{
                  backgroundColor: '#eee',
                  height: '320px',
                  animation: 'pulse 1.2s infinite',
                }}
              />
            ))
          : displayedItems.map((item, idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: '#fff',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  padding: '16px',
                  textAlign: 'left',
                }}
              >
                {/*DISPLAYING IMAGE*/}
                <img
                  src={item["Image Src"]}
                  alt={item.Title}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/no-image.png';
                  }}
                  style={{
                    width: '100%',
                    height: 'auto',
                  }}
                />

                {/*DISPLAYING PRICE*/}
                <div style={{ fontSize: '2rem', color: '#4b3f72', marginTop: '12px' }}>
                  ${item["Variant Price"]}
                </div>

                {/*DISPLAYING NAME*/}
                <div style={{ fontWeight: 'bold', fontSize: '1.1rem', color: '#000000' }}>
                  {item.Title}
                </div>

                {/*DISPLAYING SKU*/}
                <div style={{ fontSize: '0.9rem', color: '#888' }}>
                  SKU: {item["Variant SKU"]}
                </div>

                {/*ADD TO CART BUTTON*/}
                <button
                  style={{
                    marginTop: '12px',
                    padding: '8px 13px',
                    backgroundColor: '#4b3f72',
                    color: '#ffffff',
                    border: 'none',
                    fontSize: '0.8rem',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s ease',
                  }}
                  onMouseOver={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#3a2d5b';
                  }}
                  onMouseOut={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#4b3f72';
                  }}
                  onClick={async () => {
                    const res = await fetch('/api/cart', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({
                        title: item.Title,
                        sku: item["Variant SKU"],
                        price: item["Variant Price"],
                        image: item["Image Src"]
                      }),
                    });
                  
                    const data = await res.json();
                    console.log('Response status:', res.status);
                    console.log('Response body:', data);
                  
                    if (res.ok) alert("Added to cart!");
                    else alert("Failed to add to cart: " + (data.error || JSON.stringify(data)));
                  }}
                >
                  Add to Cart
                </button>
              </div>
            ))}
      </div>
      {cartOpen && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 2000
        }}>
          <div style={{
            backgroundColor: '#fff',
            padding: '24px',
            width: '90%',
            maxWidth: '500px',
            maxHeight: '80vh',
            overflowY: 'auto',
            boxShadow: '0 8px 24px rgba(0,0,0,0.2)'
          }}>
            <h2 style={{ marginTop: 0, color: "#000000", fontSize: '2rem', fontWeight: 'bold' }}>Your Cart</h2>

            {cartItems.length === 0 ? (
              <p style = {{color: '#000000',}}>Your cart is empty.</p>
            ) : (
              cartItems.map((item, idx) => (
                <div key={idx} style={{ marginBottom: '16px', borderBottom: '1px solid #ccc', paddingBottom: '8px', color: "#000000" }}>
                  <strong>{item.title}</strong><br />
                  <span>SKU: {item.sku}</span><br />
                  <span>${item.price}</span><br />
                  
                  {/*REMOVE FROM CART BUTTON*/}
                  <button
                    style={{
                      marginTop: '6px',
                      padding: '8px 13px',
                      backgroundColor: '#4b3f72',
                      color: '#ffffff',
                      border: 'none',
                      fontSize: '0.8rem',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s ease',
                    }}
                    onMouseOver={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#3a2d5b';
                    }}
                    onMouseOut={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#4b3f72';
                    }}
                    onClick={async () => {
                      const res = await fetch('/api/cart', {
                        method: 'DELETE',
                        headers: {
                          'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ id: item._id })
                      });
                    
                      const data = await res.json();
                      console.log('Response status:', res.status);
                      console.log('Response body:', data);
                    
                      if (res.ok) {
                        alert("Removed from cart!");
                        const refreshed = await fetch('/api/cart');
                        const updated = await refreshed.json();
                        setCartItems(updated);
                      }
                      else alert("Failed to remove from cart: " + (data.error || JSON.stringify(data)));
                    }}
                  >
                    Remove
                  </button>
                </div>
              ))
            )}

            <button onClick={() => setCartOpen(false)} style={{
              marginTop: '16px',
              backgroundColor: '#e74c3c',
              color: '#fff',
              border: 'none',
              padding: '10px 16px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}>
              Close
            </button>
          </div>
        </div>
      )}

      {/* 🔧 CHATBOT WIDGET - bottom right */}
      <div style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        width: '300px',
        backgroundColor: '#fff',
        padding: '20px',
        borderRadius: '12px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
        zIndex: 9999,
        color: '#000000'
      }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', margin: '0 0 10px' }}>Hi! What can I help you with?</h3>
        <input
          type="text"
          placeholder="e.g. Find SKU 12345"
          value={value}
          onChange={onChange}
          style={{
            width: '100%',
            padding: '10px',
            fontSize: '0.95rem',
            border: '1px solid #ccc',
            borderRadius: '6px',
            color: '#000000',
          }}
        />
        <button
          onClick={handleSubmit}
          style={{
            marginTop: '10px',
            width: '100%',
            padding: '8px',
            backgroundColor: '#4b3f72',
            color: '#ffffff',
            border: 'none',
            borderRadius: '6px',
            fontSize: '0.9rem',
            fontWeight: 'bold',
            cursor: 'pointer',
          }}
        >
          Ask AI
        </button>
        <div style={{ marginTop: '10px', fontSize: '0.9rem' }}>
          {response}
        </div>
      </div>
    </div>
  );
}
