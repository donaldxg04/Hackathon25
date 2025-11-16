import { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';

const UNLOCK_NETWORTH = 150000;

const PropertiesVehiclesModal = ({ onClose }) => {
  const { gameState, formatCurrency, buyProperty, buyVehicle, sellProperty, sellVehicle } = useGame();
  const [activeTab, setActiveTab] = useState('buy'); // 'buy', 'manage'
  const [selectedCategory, setSelectedCategory] = useState('house'); // 'house', 'car'
  const [message, setMessage] = useState({ text: '', type: '' });

  const netWorth = gameState.finance.netWorth;
  const isUnlocked = netWorth >= UNLOCK_NETWORTH;

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const houses = [
    {
      id: 'starter_home',
      name: 'Starter Home',
      price: 200000,
      location: 'Suburban Area',
      bedrooms: 2,
      bathrooms: 1,
      sqft: 1200,
      monthlyMortgage: 1200,
      description: 'A modest starter home perfect for first-time buyers.'
    },
    {
      id: 'family_home',
      name: 'Family Home',
      price: 350000,
      location: 'Nice Neighborhood',
      bedrooms: 3,
      bathrooms: 2,
      sqft: 2000,
      monthlyMortgage: 2100,
      description: 'Spacious home ideal for growing families.'
    },
    {
      id: 'luxury_home',
      name: 'Luxury Home',
      price: 750000,
      location: 'Upscale District',
      bedrooms: 4,
      bathrooms: 3,
      sqft: 3500,
      monthlyMortgage: 4500,
      description: 'Premium property with high-end amenities.'
    }
  ];

  const cars = [
    {
      id: 'economy_car',
      name: 'Economy Car',
      price: 15000,
      make: 'Reliable Motors',
      model: 'Econo',
      year: 2009,
      monthlyPayment: 250,
      description: 'Fuel-efficient and affordable transportation.'
    },
    {
      id: 'mid_size_car',
      name: 'Mid-Size Sedan',
      price: 28000,
      make: 'Comfort Auto',
      model: 'Comfort',
      year: 2009,
      monthlyPayment: 450,
      description: 'Comfortable and reliable for daily commuting.'
    },
    {
      id: 'luxury_car',
      name: 'Luxury Vehicle',
      price: 55000,
      make: 'Premium Motors',
      model: 'Elite',
      year: 2009,
      monthlyPayment: 850,
      description: 'High-end vehicle with premium features.'
    }
  ];

  const handleBuy = (item) => {
    if (selectedCategory === 'house') {
      const result = buyProperty(item);
      setMessage({ text: result.message, type: result.success ? 'success' : 'error' });
    } else {
      const result = buyVehicle(item);
      setMessage({ text: result.message, type: result.success ? 'success' : 'error' });
    }
    setTimeout(() => setMessage({ text: '', type: '' }), 3000);
  };

  const handleSell = (itemId, category) => {
    if (category === 'house') {
      const result = sellProperty(itemId);
      setMessage({ text: result.message, type: result.success ? 'success' : 'error' });
    } else {
      const result = sellVehicle(itemId);
      setMessage({ text: result.message, type: result.success ? 'success' : 'error' });
    }
    setTimeout(() => setMessage({ text: '', type: '' }), 3000);
  };

  if (!isUnlocked) {
    return (
      <div className="modal active">
        <div className="modal-backdrop" onClick={onClose}></div>
        <div className="modal-content">
          <div className="modal-header">
            <h2>Properties & Vehicles</h2>
            <button className="modal-close" onClick={onClose}>&times;</button>
          </div>
          <div className="modal-body locked-modal">
            <div className="locked-content">
              <div className="lock-icon">🔒</div>
              <h3>Locked</h3>
              <p>This feature is locked until you reach a net worth of {formatCurrency(UNLOCK_NETWORTH)}.</p>
              <p className="current-networth">
                Current Net Worth: <span className={netWorth >= UNLOCK_NETWORTH ? 'positive' : 'negative'}>
                  {formatCurrency(netWorth)}
                </span>
              </p>
              <p className="remaining-amount">
                {netWorth < UNLOCK_NETWORTH ? (
                  <>You need {formatCurrency(UNLOCK_NETWORTH - netWorth)} more to unlock this feature.</>
                ) : (
                  <>Congratulations! This feature is now unlocked.</>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const ownedProperties = gameState.properties || [];
  const ownedVehicles = gameState.vehicles || [];

  return (
    <div className="modal active">
      <div className="modal-backdrop" onClick={onClose}></div>
      <div className="modal-content modal-large">
        <div className="modal-header">
          <h2>Properties & Vehicles</h2>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>
        <div className="modal-body properties-vehicles-modal">
          {/* Tabs */}
          <div className="pv-tabs">
            <button
              className={`pv-tab ${activeTab === 'buy' ? 'active' : ''}`}
              onClick={() => setActiveTab('buy')}
            >
              Buy
            </button>
            <button
              className={`pv-tab ${activeTab === 'manage' ? 'active' : ''}`}
              onClick={() => setActiveTab('manage')}
            >
              Manage ({ownedProperties.length + ownedVehicles.length})
            </button>
          </div>

          {/* Category Selector */}
          <div className="pv-category-selector">
            <button
              className={`pv-category-btn ${selectedCategory === 'house' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('house')}
            >
              🏠 Houses
            </button>
            <button
              className={`pv-category-btn ${selectedCategory === 'car' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('car')}
            >
              🚗 Vehicles
            </button>
          </div>

          {message.text && (
            <div className={`pv-message ${message.type}`}>{message.text}</div>
          )}

          {/* Buy Tab */}
          {activeTab === 'buy' && (
            <div className="pv-content">
              <h3>Available {selectedCategory === 'house' ? 'Properties' : 'Vehicles'}</h3>
              <div className="pv-list">
                {(selectedCategory === 'house' ? houses : cars).map((item) => {
                  const canAfford = gameState.finance.assetAllocation.checking >= item.price;
                  const alreadyOwned = selectedCategory === 'house'
                    ? ownedProperties.some(p => p.id === item.id)
                    : ownedVehicles.some(v => v.id === item.id);

                  return (
                    <div key={item.id} className={`pv-item ${!canAfford ? 'unaffordable' : ''}`}>
                      <div className="pv-item-content">
                        <div className="pv-item-info">
                          <h4>{item.name}</h4>
                          {selectedCategory === 'house' ? (
                            <div className="pv-item-details">
                              <span>📍 {item.location}</span>
                              <span>🛏️ {item.bedrooms} bed</span>
                              <span>🚿 {item.bathrooms} bath</span>
                              <span>📐 {item.sqft.toLocaleString()} sqft</span>
                              <span>💰 Monthly: {formatCurrency(item.monthlyMortgage)}</span>
                            </div>
                          ) : (
                            <div className="pv-item-details">
                              <span>🚗 {item.make} {item.model}</span>
                              <span>📅 {item.year}</span>
                              <span>💰 Monthly: {formatCurrency(item.monthlyPayment)}</span>
                            </div>
                          )}
                          <p className="pv-item-description">{item.description}</p>
                        </div>
                        <div className="pv-item-actions">
                          <div className="pv-item-price">
                            {formatCurrency(item.price)}
                          </div>
                          {alreadyOwned ? (
                            <button className="btn-pv-owned" disabled>Already Owned</button>
                          ) : (
                            <button
                              className={`btn-pv-buy ${!canAfford ? 'disabled' : ''}`}
                              onClick={() => handleBuy(item)}
                              disabled={!canAfford}
                            >
                              {canAfford ? 'Buy Now' : 'Insufficient Funds'}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Manage Tab */}
          {activeTab === 'manage' && (
            <div className="pv-content">
              <h3>Your {selectedCategory === 'house' ? 'Properties' : 'Vehicles'}</h3>
              {((selectedCategory === 'house' ? ownedProperties : ownedVehicles).length === 0) ? (
                <div className="pv-empty">
                  <p>You don't own any {selectedCategory === 'house' ? 'properties' : 'vehicles'} yet.</p>
                  <p>Switch to the "Buy" tab to make a purchase.</p>
                </div>
              ) : (
                <div className="pv-list">
                  {(selectedCategory === 'house' ? ownedProperties : ownedVehicles).map((item) => {
                    const originalItem = selectedCategory === 'house'
                      ? houses.find(h => h.id === item.id)
                      : cars.find(c => c.id === item.id);

                    return (
                      <div key={item.id} className="pv-item">
                        <div className="pv-item-content">
                          <div className="pv-item-info">
                            <h4>{originalItem?.name || item.name}</h4>
                            {selectedCategory === 'house' ? (
                              <div className="pv-item-details">
                                <span>📍 {originalItem?.location || item.location}</span>
                                <span>🛏️ {originalItem?.bedrooms || item.bedrooms} bed</span>
                                <span>🚿 {originalItem?.bathrooms || item.bathrooms} bath</span>
                                <span>📐 {originalItem?.sqft?.toLocaleString() || item.sqft?.toLocaleString()} sqft</span>
                                <span>💰 Monthly: {formatCurrency(originalItem?.monthlyMortgage || item.monthlyMortgage)}</span>
                              </div>
                            ) : (
                              <div className="pv-item-details">
                                <span>🚗 {originalItem?.make || item.make} {originalItem?.model || item.model}</span>
                                <span>📅 {originalItem?.year || item.year}</span>
                                <span>💰 Monthly: {formatCurrency(originalItem?.monthlyPayment || item.monthlyPayment)}</span>
                              </div>
                            )}
                            <p className="pv-item-description">{originalItem?.description || item.description}</p>
                          </div>
                          <div className="pv-item-actions">
                            <div className="pv-item-value">
                              Current Value: {formatCurrency(item.currentValue || item.price * 0.9)}
                            </div>
                            <button
                              className="btn-pv-sell"
                              onClick={() => handleSell(item.id, selectedCategory)}
                            >
                              Sell
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertiesVehiclesModal;

