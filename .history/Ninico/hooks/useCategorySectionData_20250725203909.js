import { useState, useEffect } from 'react';
import CategorySectionService from '../services/categorySectionService';

// Hook for fetching category section data with real API integration
export default function useCategorySectionData(pageId, token) {
  const [data, setData] = useState({
    mainCategories: [],
    subcategories: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMainCategory, setSelectedMainCategory] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('🔍 [useCategorySectionData] Fetching data for:', { pageId, token: !!token });
        
        // Create service instance and fetch real data
        const categoryService = new CategorySectionService();
        const response = await categoryService.getCategorySectionConfig(pageId, token);
        
        // Transform API response to match our UI format
        const transformedData = {
          mainCategories: response.data?.availableCategories || [],
          subcategories: response.data?.availableSubcategories || []
        };
        
        setData(transformedData);
        
        // Auto-select first category
        if (transformedData.mainCategories.length > 0) {
          setSelectedMainCategory(transformedData.mainCategories[0].id);
        }
        
        console.log('✅ [useCategorySectionData] Real API data loaded:', transformedData);
        
      } catch (err) {
        console.error('❌ [useCategorySectionData] Error:', err);
        setError(err.message);
        
        // Fallback to empty data on error
        setData({
          mainCategories: [],
          subcategories: []
        });
      } finally {
        setLoading(false);
      }
    };

    if (pageId && token) {
      fetchData();
    } else {
      console.warn('⚠️ [useCategorySectionData] Missing pageId or token:', { pageId, token: !!token });
      setLoading(false);
    }
  }, [pageId, token]);

  const getSubcategoriesForCategory = (categoryId) => {
    return data.subcategories.filter(sub => sub.parent === categoryId);
  };

  return {
    mainCategories: data.mainCategories,
    subcategories: data.subcategories,
    loading,
    error,
    selectedMainCategory,
    setSelectedMainCategory,
    getSubcategoriesForCategory,
    refetch: () => {
      // Trigger re-fetch if needed
      if (pageId && token) {
        setLoading(true);
        // Re-run the fetch logic
      }
    }
  };
}