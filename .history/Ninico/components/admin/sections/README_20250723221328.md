# Category Section Configuration Components

This directory contains modular React components for the Category Section Configuration feature in the admin panel.

## Component Structure

### 🏗️ Main Modal Component
- **CategoryConfigModal.js** - Main modal wrapper that orchestrates all other components

### ⚙️ Settings Components
- **CategorySettings.js** - Basic settings (enable/disable, max categories, layout options)
- **CategorySelectionSummary.js** - Displays selection counts and validation status

### 📊 Display Components
- **CurrentSelections.js** - Shows currently selected categories and subcategories with images
- **CategorySelector.js** - Main category selection interface coordinator

### 🗂️ Selection Interface Components
- **MainCategoriesList.js** - Left panel showing main categories with selection checkboxes
- **SubcategoriesList.js** - Right panel showing subcategories for selected main category

## Features

### ✨ Key Capabilities
- **Modular Architecture** - Each component has a single responsibility
- **SVG Image Fallbacks** - Uses embedded SVG data URLs to prevent 404 errors
- **Real-time Validation** - Shows selection limits and requirements
- **Bulk Actions** - Select all, clear all functionality
- **Visual Feedback** - Selected items are highlighted and badged
- **Responsive Design** - Works on desktop and mobile devices

### 🎯 Business Rules
- **Main Categories**: Minimum 1, Maximum 10
- **Subcategories**: Maximum 10 per main category
- **Image Handling**: Automatic fallback to SVG data URLs

## Props Structure

### CategoryConfigModal Props
```javascript
{
  showModal: boolean,
  onClose: function,
  categoryConfig: object,
  setCategoryConfig: function,
  availableCategories: array,
  subcategories: array,
  selectedMainCategory: string,
  setSelectedMainCategory: function,
  getCurrentCounts: function,
  handleCategoryToggle: function,
  handleMaxCategoriesChange: function,
  saveCategoryConfig: function,
  loading: boolean,
  error: string,
  setError: function
}
```

## Image Fallback Logic

The components use embedded SVG data URLs for image fallbacks:

### Category Icon (Folder Design)
```javascript
const defaultCategoryIcon = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzYiIGhlaWdodD0iMzYiIHZpZXdCb3g9IjAgMCAzNiAzNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjM2IiBoZWlnaHQ9IjM2IiBmaWxsPSIjZjhmOWZhIiByeD0iNiIvPgo8Zm9sZGVyIGZpbGw9IiM5NjliYTYiLz4KPHN2ZyB4PSI2IiB5PSI4IiB3aWR0aD0iMjQiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyNCAyMCIgZmlsbD0ibm9uZSI+CjxwYXRoIGQ9Ik0yIDJoOGwyIDJoMTB2MTJIMlYyeiIgZmlsbD0iIzk2OWJhNiIvPgo8L3N2Zz4KPC9zdmc+'
```

### Subcategory Icon (Circle Design)
```javascript
const defaultSubcategoryIcon = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzYiIGhlaWdodD0iMzYiIHZpZXdCb3g9IjAgMCAzNiAzNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjM2IiBoZWlnaHQ9IjM2IiBmaWxsPSIjZjhmOWZhIiByeD0iNiIvPgo8Y2lyY2xlIGN4PSIxOCIgY3k9IjE4IiByPSI4IiBmaWxsPSIjZGVlMmU2Ii8+CjxjaXJjbGUgY3g9IjE4IiBjeT0iMTgiIHI9IjMiIGZpbGw9IiM5NjliYTYiLz4KPC9zdmc+'
```

## Usage Example

```javascript
import CategoryConfigModal from './sections/CategoryConfigModal'

// In your component
const renderCategoryConfigModal = () => {
  return (
    <CategoryConfigModal
      showModal={showCategoryConfig}
      onClose={() => setShowCategoryConfig(false)}
      categoryConfig={categoryConfig}
      setCategoryConfig={setCategoryConfig}
      availableCategories={availableCategories}
      subcategories={subcategories}
      selectedMainCategory={selectedMainCategory}
      setSelectedMainCategory={setSelectedMainCategory}
      getCurrentCounts={getCurrentCounts}
      handleCategoryToggle={handleCategoryToggle}
      handleMaxCategoriesChange={handleMaxCategoriesChange}
      saveCategoryConfig={saveCategoryConfig}
      loading={loading}
      error={error}
      setError={setError}
    />
  )
}
```

## File Structure
```
admin/sections/
├── index.js                      # Export all components
├── README.md                     # This documentation
├── CategoryConfigModal.js        # Main modal wrapper
├── CategorySettings.js           # Basic settings panel
├── CategorySelectionSummary.js   # Selection counts display
├── CurrentSelections.js          # Selected items display
├── CategorySelector.js           # Selection interface coordinator
├── MainCategoriesList.js         # Main categories list
└── SubcategoriesList.js          # Subcategories list
```

## Benefits of Modular Structure

1. **Maintainability** - Each component has a clear, single responsibility
2. **Reusability** - Components can be reused in other parts of the admin panel
3. **Testability** - Each component can be unit tested independently
4. **Performance** - Smaller components render more efficiently
5. **Developer Experience** - Easier to locate and modify specific functionality
6. **Code Organization** - Logical separation of concerns
