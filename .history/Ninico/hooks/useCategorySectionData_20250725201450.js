/**
 * Custom hook for category section data fetching and management
 */

import { useState, useEffect } from 'react';
import categorySectionService from '@/services/categorySectionService';

export default function useCategorySectionData(pageId, token) {
  const [data, setData] = useState({
    mainCategories: [],
    subcategories: [],
    sectionConfig: null
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMainCategory, setSelectedMainCategory] = useState(null);

  useEffect(() => {
    if (!pageId || !token) {
      console.log(`⚠️ [useCategorySectionData] Missing required params - pageId: ${!!pageId}, token: ${!!token}`);
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        console.log(`🔄 [useCategorySectionData] Starting data fetch for page: ${pageId}`);
        setLoading(true);
        setError(null);

        const response = await categorySectionService.getCategorySectionConfig(pageId, token);
        
        if (response.success) {
          const { categoriesData, sectionConfig } = response.data;
          
          console.log(`✅ [useCategorySectionData] Data fetched successfully:`, {
            mainCategories: categoriesData.mainCategories?.length || 0,
            subcategories: categoriesData.subcategories?.length || 0,
            sectionEnabled: sectionConfig?.enabled
          });
          
          setData({
            mainCategories: categoriesData.mainCategories || [],
            subcategories: categoriesData.subcategories || [],
            sectionConfig
          });

          // Auto-select first main category if available
          if (categoriesData.mainCategories?.length > 0) {
            setSelectedMainCategory(categoriesData.mainCategories[0].id);
            console.log(`🎯 [useCategorySectionData] Auto-selected first category: ${categoriesData.mainCategories[0].name}`);
          }
        } else {
          console.error(`❌ [useCategorySectionData] API returned unsuccessful response:`, response);
          throw new Error(response.message || 'Failed to fetch data');
        }
      } catch (err) {
        console.error(`❌ [useCategorySectionData] Error during fetch:`, err);
        setError(err.message);
        
        // Set empty data on error
        setData({
          mainCategories: [],
          subcategories: [],
          sectionConfig: null
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [pageId, token]);

  // Get subcategories for selected main category
  const getSubcategoriesForCategory = (categoryId) => {
    if (!categoryId) {
      console.log(`⚠️ [useCategorySectionData] No categoryId provided for subcategory lookup`);
      return [];
    }
    
    const subcategories = data.subcategories.filter(sub => sub.parent === categoryId);
    console.log(`🔍 [useCategorySectionData] Found ${subcategories.length} subcategories for category: ${categoryId}`);
    return subcategories;
  };

  // Refresh data function
  const refetch = async () => {
    if (!pageId || !token) {
      console.log(`⚠️ [useCategorySectionData] Cannot refetch - missing pageId or token`);
      return;
    }

    try {
      console.log(`🔄 [useCategorySectionData] Manual refetch triggered`);
      setLoading(true);
      setError(null);
      
      const response = await categorySectionService.getCategorySectionConfig(pageId, token);
      
      if (response.success) {
        const { categoriesData, sectionConfig } = response.data;
        
        setData({
          mainCategories: categoriesData.mainCategories || [],
          subcategories: categoriesData.subcategories || [],
          sectionConfig
        });

        console.log(`✅ [useCategorySectionData] Refetch successful`);
      } else {
        throw new Error(response.message || 'Failed to refetch data');
      }
    } catch (err) {
      console.error(`❌ [useCategorySectionData] Error during refetch:`, err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    ...data,
    loading,
    error,
    selectedMainCategory,
    setSelectedMainCategory,
    getSubcategoriesForCategory,
    refetch
  };
}
