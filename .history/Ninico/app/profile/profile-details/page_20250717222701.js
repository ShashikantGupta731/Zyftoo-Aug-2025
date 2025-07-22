'use client';
import React, { useContext, useState } from 'react';
import AuthContext from '@/components/context/AuthContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header1 from '@/components/layout/header/Header1';

export default function ProfileDetailsPage() {
  const { user, logout } = useContext(AuthContext);
  const router = useRouter();

  const profileData = {
    fullName: 'Shashikant Gupta',
    mobile: '7317314242',
    email: 'shashikantgupta001@gmail.com',
    gender: 'MALE',
    dateOfBirth: '- not added -',
    location: '- not added -',
    alternateMobile: '- not added -',
    hintName: '- not added -'
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
              <div className="px-4 py-4 border-bottom">
                <h5 className="mb-0 fw-bold" style={{ fontSize: '20px', color: '#282c3f' }}>
                  Profile Details
                </h5>
              </div>

              {/* Profile Details Content */}
              <div className="px-4 py-4">
                {/* Full Name */}
                <div className="row mb-4">
                  <div className="col-md-4 col-sm-12">
                    <label className="form-label text-muted mb-0" style={{ fontSize: '14px', fontWeight: '400' }}>
                      Full Name
                    </label>
                  </div>
                  <div className="col-md-8 col-sm-12">
                    <p className="mb-0" style={{ fontSize: '14px', color: '#282c3f', fontWeight: '400' }}>
                      {profileData.fullName}
                    </p>
                  </div>
                </div>

                {/* Mobile Number */}
                <div className="row mb-4">
                  <div className="col-md-4 col-sm-12">
                    <label className="form-label text-muted mb-0" style={{ fontSize: '14px', fontWeight: '400' }}>
                      Mobile Number
                    </label>
                  </div>
                  <div className="col-md-8 col-sm-12">
                    <p className="mb-0" style={{ fontSize: '14px', color: '#282c3f', fontWeight: '400' }}>
                      {profileData.mobile}
                    </p>
                  </div>
                </div>

                {/* Email ID */}
                <div className="row mb-4">
                  <div className="col-md-4 col-sm-12">
                    <label className="form-label text-muted mb-0" style={{ fontSize: '14px', fontWeight: '400' }}>
                      Email ID
                    </label>
                  </div>
                  <div className="col-md-8 col-sm-12">
                    <p className="mb-0" style={{ fontSize: '14px', color: '#282c3f', fontWeight: '400' }}>
                      {profileData.email}
                    </p>
                  </div>
                </div>

                {/* Gender */}
                <div className="row mb-4">
                  <div className="col-md-4 col-sm-12">
                    <label className="form-label text-muted mb-0" style={{ fontSize: '14px', fontWeight: '400' }}>
                      Gender
                    </label>
                  </div>
                  <div className="col-md-8 col-sm-12">
                    <p className="mb-0" style={{ fontSize: '14px', color: '#282c3f', fontWeight: '400' }}>
                      {profileData.gender}
                    </p>
                  </div>
                </div>

                {/* Date of Birth */}
                <div className="row mb-4">
                  <div className="col-md-4 col-sm-12">
                    <label className="form-label text-muted mb-0" style={{ fontSize: '14px', fontWeight: '400' }}>
                      Date of Birth
                    </label>
                  </div>
                  <div className="col-md-8 col-sm-12">
                    <p className="mb-0 text-muted" style={{ fontSize: '14px', fontWeight: '400' }}>
                      {profileData.dateOfBirth}
                    </p>
                  </div>
                </div>

                {/* Location */}
                <div className="row mb-4">
                  <div className="col-md-4 col-sm-12">
                    <label className="form-label text-muted mb-0" style={{ fontSize: '14px', fontWeight: '400' }}>
                      Location
                    </label>
                  </div>
                  <div className="col-md-8 col-sm-12">
                    <p className="mb-0 text-muted" style={{ fontSize: '14px', fontWeight: '400' }}>
                      {profileData.location}
                    </p>
                  </div>
                </div>

                {/* Alternate Mobile */}
                <div className="row mb-4">
                  <div className="col-md-4 col-sm-12">
                    <label className="form-label text-muted mb-0" style={{ fontSize: '14px', fontWeight: '400' }}>
                      Alternate Mobile
                    </label>
                  </div>
                  <div className="col-md-8 col-sm-12">
                    <p className="mb-0 text-muted" style={{ fontSize: '14px', fontWeight: '400' }}>
                      {profileData.alternateMobile}
                    </p>
                  </div>
                </div>

                {/* Hint Name */}
                <div className="row mb-5">
                  <div className="col-md-4 col-sm-12">
                    <label className="form-label text-muted mb-0" style={{ fontSize: '14px', fontWeight: '400' }}>
                      Hint Name
                    </label>
                  </div>
                  <div className="col-md-8 col-sm-12">
                    <p className="mb-0 text-muted" style={{ fontSize: '14px', fontWeight: '400' }}>
                      {profileData.hintName}
                    </p>
                  </div>
                </div>

                {/* Edit Button */}
                <div className="pt-3">
                  <Link
                    href="/profile/edit-profile"
                    className="btn w-100 text-white fw-semibold text-uppercase text-decoration-none"
                    style={{ 
                      backgroundColor: '#ff3f6c',
                      borderColor: '#ff3f6c',
                      fontSize: '14px',
                      padding: '15px',
                      borderRadius: '4px',
                      letterSpacing: '1px'
                    }}
                    onMouseOver={(e) => e.target.style.backgroundColor = '#e8295c'}
                    onMouseOut={(e) => e.target.style.backgroundColor = '#ff3f6c'}
                  >
                    EDIT
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .row.mb-4 {
          padding-bottom: 15px;
          border-bottom: 1px solid #f5f5f6;
        }
        
        .row.mb-4:last-of-type {
          border-bottom: none;
          padding-bottom: 0;
        }
        
        .row.mb-5 {
          padding-bottom: 15px;
          border-bottom: 1px solid #f5f5f6;
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
          
          .row.mb-4 .col-md-4,
          .row.mb-5 .col-md-4 {
            margin-bottom: 8px;
          }
          
          .row.mb-4 .col-md-8,
          .row.mb-5 .col-md-8 {
            margin-bottom: 0;
          }
        }
        
        @media (min-width: 768px) {
          .row.mb-4,
          .row.mb-5 {
            align-items: center;
          }
        }
        
        .btn:hover {
          text-decoration: none !important;
        }
      `}</style>
    </>
  );
}
