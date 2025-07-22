'use client';
import React, { useContext, useState } from 'react';
import AuthContext from '@/components/context/AuthContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AddAddressModal from '@/components/Modal/AddAddressModal';

export default function AddressesPage() {
  const { user, logout } = useContext(AuthContext);
  const router = useRouter();
  const [showAddModal, setShowAddModal] = useState(false);

  const [addresses, setAddresses] = useState([
    {
      id: 1,
      name: 'Rishi Gupta',
      type: 'OFFICE',
      address: 'New Siddharth Medical Agency, Near Peter England Showroom, Mehdawal Road, Khalilabad Bus Stand',
      city: 'Khalilabad - 272175',
      state: 'Uttar Pradesh',
      mobile: '8052702309',
      isDefault: true
    },
    {
      id: 2,
      name: 'Shashikant Gupta',
      type: 'HOME',
      address: 'Room Number 206, 2nd Floor., N...',
      city: 'Sector 49',
      state: 'Gurgaon - 122018',
      mobile: '',
      isDefault: false
    }
  ]);

  const handleAddAddress = (newAddress) => {
    const address = {
      id: addresses.length + 1,
      name: newAddress.name,
      type: newAddress.addressType === 'home' ? 'HOME' : 'OFFICE',
      address: newAddress.address,
      city: `${newAddress.locality} - ${newAddress.pincode}`,
      state: newAddress.state,
      mobile: newAddress.mobile,
      isDefault: newAddress.makeDefault || addresses.length === 0
    };
    
    // If this is set as default, remove default from others
    if (address.isDefault) {
      setAddresses(prev => prev.map(addr => ({ ...addr, isDefault: false })));
    }
    
    setAddresses(prev => [...prev, address]);
  };

  return (
    <>
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-8">
            {/* Back Button */}
            <div className="mb-4">
              <Link href="/profile/ProfilePage" className="btn btn-outline-secondary btn-sm">
                <i className="fas fa-arrow-left me-2"></i>Back to Profile
              </Link>
            </div>

            {/* Main Content */}
            <div className="bg-white rounded-3 shadow-sm border">
              {/* Header */}
              <div className="px-4 py-3 border-bottom d-flex justify-content-between align-items-center">
                <h5 className="mb-0 fw-bold" style={{ fontSize: '18px', color: '#282c3f' }}>
                  Saved Addresses
                </h5>
                <button 
                  className="btn btn-outline-primary btn-sm px-3"
                  onClick={() => setShowAddModal(true)}
                  style={{ 
                    fontSize: '12px',
                    fontWeight: '600',
                    letterSpacing: '0.5px',
                    color: '#526cfd',
                    borderColor: '#526cfd'
                  }}
                >
                  + ADD NEW ADDRESS
                </button>
              </div>

              {/* Addresses Content */}
              <div className="px-4 py-4">
                {/* Default Address Section */}
                <div className="mb-4">
                  <h6 className="mb-3 fw-bold" style={{ fontSize: '14px', color: '#282c3f' }}>
                    DEFAULT ADDRESS
                  </h6>
                  
                  {addresses.filter(addr => addr.isDefault).map((address) => (
                    <div key={address.id} className="border rounded-3 p-3 mb-3" style={{ borderColor: '#f5f5f6' }}>
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <div className="d-flex align-items-center">
                          <h6 className="mb-0 me-3" style={{ fontSize: '14px', color: '#282c3f', fontWeight: '600' }}>
                            {address.name}
                          </h6>
                          <span 
                            className="badge px-2 py-1"
                            style={{ 
                              backgroundColor: '#f5f5f6',
                              color: '#696b79',
                              fontSize: '11px',
                              fontWeight: '500',
                              letterSpacing: '0.5px'
                            }}
                          >
                            {address.type}
                          </span>
                        </div>
                      </div>
                      
                      <div className="mb-3">
                        <p className="mb-1" style={{ fontSize: '14px', color: '#696b79', lineHeight: '1.5' }}>
                          {address.address}
                        </p>
                        <p className="mb-1" style={{ fontSize: '14px', color: '#696b79', lineHeight: '1.5' }}>
                          {address.city}
                        </p>
                        <p className="mb-0" style={{ fontSize: '14px', color: '#696b79', lineHeight: '1.5' }}>
                          {address.state}
                        </p>
                      </div>
                      
                      {address.mobile && (
                        <div className="mb-3">
                          <p className="mb-0" style={{ fontSize: '14px', color: '#696b79' }}>
                            Mobile: {address.mobile}
                          </p>
                        </div>
                      )}
                      
                      <div className="d-flex gap-3">
                        <button 
                          className="btn btn-link p-0 text-decoration-none"
                          style={{ 
                            fontSize: '14px',
                            color: '#526cfd',
                            fontWeight: '500'
                          }}
                        >
                          EDIT
                        </button>
                        <button 
                          className="btn btn-link p-0 text-decoration-none"
                          style={{ 
                            fontSize: '14px',
                            color: '#526cfd',
                            fontWeight: '500'
                          }}
                        >
                          REMOVE
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Other Addresses Section */}
                <div className="mb-4">
                  <h6 className="mb-3 fw-bold" style={{ fontSize: '14px', color: '#282c3f' }}>
                    OTHER ADDRESSES
                  </h6>
                  
                  {addresses.filter(addr => !addr.isDefault).map((address) => (
                    <div key={address.id} className="border rounded-3 p-3 mb-3" style={{ borderColor: '#f5f5f6' }}>
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <div className="d-flex align-items-center">
                          <h6 className="mb-0 me-3" style={{ fontSize: '14px', color: '#282c3f', fontWeight: '600' }}>
                            {address.name}
                          </h6>
                          <span 
                            className="badge px-2 py-1"
                            style={{ 
                              backgroundColor: '#f5f5f6',
                              color: '#696b79',
                              fontSize: '11px',
                              fontWeight: '500',
                              letterSpacing: '0.5px'
                            }}
                          >
                            {address.type}
                          </span>
                        </div>
                      </div>
                      
                      <div className="mb-3">
                        <p className="mb-1" style={{ fontSize: '14px', color: '#696b79', lineHeight: '1.5' }}>
                          {address.address}
                        </p>
                        <p className="mb-1" style={{ fontSize: '14px', color: '#696b79', lineHeight: '1.5' }}>
                          {address.city}
                        </p>
                        <p className="mb-0" style={{ fontSize: '14px', color: '#696b79', lineHeight: '1.5' }}>
                          {address.state}
                        </p>
                      </div>
                      
                      {address.mobile && (
                        <div className="mb-3">
                          <p className="mb-0" style={{ fontSize: '14px', color: '#696b79' }}>
                            Mobile: {address.mobile}
                          </p>
                        </div>
                      )}
                      
                      <div className="d-flex gap-3">
                        <button 
                          className="btn btn-link p-0 text-decoration-none"
                          style={{ 
                            fontSize: '14px',
                            color: '#526cfd',
                            fontWeight: '500'
                          }}
                        >
                          EDIT
                        </button>
                        <button 
                          className="btn btn-link p-0 text-decoration-none"
                          style={{ 
                            fontSize: '14px',
                            color: '#526cfd',
                            fontWeight: '500'
                          }}
                        >
                          REMOVE
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .btn-link:hover {
          text-decoration: none !important;
          opacity: 0.8;
        }
        
        .badge {
          border-radius: 4px;
        }
        
        @media (max-width: 767.98px) {
          .container {
            padding-left: 15px;
            padding-right: 15px;
          }
          
          .px-4 {
            padding-left: 20px !important;
            padding-right: 20px !important;
          }
          
          .d-flex.justify-content-between {
            flex-direction: column;
            align-items: flex-start !important;
          }
          
          .d-flex.justify-content-between .btn {
            margin-top: 15px;
            align-self: flex-end;
          }
          
          .d-flex.gap-3 {
            gap: 20px !important;
          }
        }
        
        @media (min-width: 768px) {
          .border.rounded-3 {
            transition: box-shadow 0.2s ease;
          }
          
          .border.rounded-3:hover {
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          }
        }
      `}</style>
    </>
  );
}
