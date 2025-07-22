"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { giftPageCategories } from "@/data/giftPageCategories";

export default function GiftCategories() {

  const [activeCategory, setActiveCategory] = useState(null);
  const [activeSubcategory, setActiveSubcategory] = useState(null);


  const handleMouseEnterCategory = (id) => {
    setActiveCategory(id);
    setActiveSubcategory(null);
  };

  const handleMouseLeaveCategory = () => {
    setActiveCategory(null);
    setActiveSubcategory(null);
  };

  const handleMouseEnterSubcategory = (name) => {
    setActiveSubcategory(name);
  };

  return (
    <>
      <div className="gift-nav-container">
        <div className="gift-category-bar">
          {giftPageCategories.map((category) => (
            <div
              key={category.id}
              className="gift-category-item"
              onMouseEnter={() => handleMouseEnterCategory(category.id)}
              onMouseLeave={handleMouseLeaveCategory}
            >
              <div className="gift-icon-title">
                <img
                  src={category.icon}
                  alt={category.name}
                  className="gift-icon"
                />
                <span className="gift-title">{category.name}</span>
              </div>

              {activeCategory === category.id && (
                <div className="gift-subcategories">
                  {category.subcategories.map((sub, index) => (
                    <div
                      key={index}
                      className="gift-subcategory-item"
                      onMouseEnter={() => handleMouseEnterSubcategory(sub.name)}
                      onMouseLeave={() => setActiveSubcategory(null)}
                    >
                      <Link href="/shop">
                        <span className="gift-subcategory-text">
                          {sub.name}
                          {sub.children && <span className="gift-arrow">›</span>}
                        </span>
                      </Link>

                      {sub.children && activeSubcategory === sub.name && (
                        <div className="gift-sub-subcategories">
                          {sub.children.map((child, idx) => (
                            <Link key={idx} href="/shop">
                              <span className="gift-sub-subcategory-text">
                                {child}
                              </span>
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .gift-nav-container {
          display: flex;
          align-items: center;
          background: white;
          height: 80px;
          border-top: 1px solid #ddd;
          border-bottom: 1px solid #ddd;
          padding: 0 2px;
          background-color: #f0d9b3;
          flex-wrap: wrap;
        }

        .gift-category-bar {
          display: flex;
          flex: 1;
          justify-content: flex-end;
          align-items: center;
          margin-right: 15%;
          height: 60px;
          padding: 0 10px;
          gap: 40px;
          flex-wrap: wrap;
        }

        .gift-category-item {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          margin-right: 10px;
          height: 100%;
          padding: 0 5px;
          cursor: pointer;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          min-width: 60px;
        }

        .gift-category-item:hover {
          transform: scale(1.08);
          z-index: 2;
        }

        .gift-icon-title {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
        }

        .gift-icon {
          width: 40px;
          height: 40px;
          object-fit: contain;
        }

        .gift-title {
          font-size: 11px;
          font-weight: 500;
          white-space: nowrap;
          color: #333;
          text-align: center;
          line-height: 1.1;
        }

        .gift-subcategories {
          position: absolute;
          top: 80px;
          left: 0;
          background-color: white;
          padding: 10px 15px;
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
          min-width: 200px;
          display: flex;
          flex-direction: column;
          z-index: 1000;
        }

        .gift-subcategory-item {
          position: relative;
          padding: 6px 10px;
          white-space: nowrap;
        }

        .gift-subcategory-text {
          font-size: 13px;
          color: #222;
          display: inline-flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
        }

        .gift-arrow {
          margin-left: 6px;
          font-weight: bold;
        }

        .gift-sub-subcategories {
          position: absolute;
          top: 0;
          left: 100%;
          background-color: #fff;
          box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.12);
          padding: 8px 12px;
          display: flex;
          flex-direction: column;
        }

        .gift-sub-subcategory-text {
          padding: 4px 0;
          font-size: 13px;
          color: #333;
        }

        @media (max-width: 1024px) {
          .gift-category-bar {
            gap: 20px;
            justify-content: center;
            margin-right: 0;
            padding: 10px 0;
          }

          .gift-title {
            font-size: 10px;
          }

          .gift-icon {
            width: 30px;
            height: 30px;
          }

          .gift-subcategories {
            top: 60px;
          }
        }

        @media (max-width: 600px) {
          .gift-nav-container {
            flex-direction: column;
            height: auto;
            padding: 10px;
          }

          .gift-category-bar {
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
            padding: 10px 0;
          }

          .gift-category-item {
            flex-direction: row;
            gap: 8px;
            padding: 6px;
          }

          .gift-icon-title {
            flex-direction: row;
          }

          .gift-title {
            font-size: 12px;
          }
        }
      `}</style>
    </>
  );
}
