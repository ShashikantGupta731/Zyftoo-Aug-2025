import { useState, useEffect } from 'react';

// For now, let's create a simple hook that returns mock data to test the UI
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
        
        // For now, let's use mock data to test the UI
        // TODO: Replace with actual API call once backend is ready
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
        
        const mockData = {
          mainCategories: [
            {
              id: '687fbada33f196eb765aecd2',
              name: 'Fashion & Clothing',
              description: 'Trendy clothing and fashion accessories for all occasions',
              image: null
            },
            {
              id: '687fbada33f196eb765aecd3',
              name: 'Electronics',
              description: 'Latest gadgets and electronic devices',
              image: null
            },
            {
              id: '687fbada33f196eb765aecd4', 
              name: 'Home & Living',
              description: 'Home decor, furniture, and living essentials',
              image: null
            }
          ],
          subcategories: [
            {
              id: 'sub1',
              name: 'Men\'s Clothing',
              description: 'Shirts, pants, suits, and men\'s fashion wear',
              parent: '687fbada33f196eb765aecd2',
              parentName: 'Fashion & Clothing',
              image: null
            },
            {
              id: 'sub2', 
              name: 'Women\'s Clothing',
              description: 'Dresses, tops, skirts, and women\'s fashion wear',
              parent: '687fbada33f196eb765aecd2',
              parentName: 'Fashion & Clothing',
              image: null
            },
            {
              id: 'sub3',
              name: 'Smartphones',
              description: 'Latest smartphones and mobile devices',
              parent: '687fbada33f196eb765aecd3',
              parentName: 'Electronics',
              image: null
            }
          ]
        };
        
        setData(mockData);
        
        // Auto-select first category
        if (mockData.mainCategories.length > 0) {
          setSelectedMainCategory(mockData.mainCategories[0].id);
        }
        
        console.log('✅ [useCategorySectionData] Mock data loaded:', mockData);
        
      } catch (err) {
        console.error('❌ [useCategorySectionData] Error:', err);
        setError(err.message);
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