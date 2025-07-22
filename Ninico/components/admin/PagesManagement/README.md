# PagesManagement Component Structure

This directory contains the refactored PagesManagement component broken down into smaller, more maintainable components.

## File Structure

```
PagesManagement/
├── index.js                    # Main PagesManagement component (orchestrator)
├── PageSelector.js             # Page selection UI
├── SectionsList.js             # List of sections for selected page
├── CategoryConfigModal.js      # Main modal for category configuration
├── CategoryConfigHeader.js     # Modal header component
├── CategoryConfigSettings.js   # Basic settings and validation summary
├── CategoryConfigFooter.js     # Modal footer with save/cancel buttons
├── CategorySelection.js        # Category and subcategory selection interface
├── MainCategoriesList.js       # Left panel - main categories list
├── SubcategoriesList.js        # Right panel - subcategories list
├── QuickActions.js             # Quick action buttons (select all, clear all)
└── hooks/
    └── useCategoryHelpers.js   # Custom hook for category logic
```

## Component Responsibilities

### Main Components
- **index.js**: Main orchestrator component that manages state and data loading
- **PageSelector.js**: Handles page selection (Home/Corporate)
- **SectionsList.js**: Displays sections for the selected page with toggle controls

### Category Configuration Modal Components
- **CategoryConfigModal.js**: Main modal container that orchestrates category configuration
- **CategoryConfigHeader.js**: Simple header with title and close button
- **CategoryConfigSettings.js**: Basic settings, validation summary, and configuration options
- **CategoryConfigFooter.js**: Save and cancel buttons with loading states
- **CategorySelection.js**: Main category/subcategory selection interface

### Category Selection Sub-components
- **MainCategoriesList.js**: Left panel showing main categories with selection checkboxes
- **SubcategoriesList.js**: Right panel showing subcategories for selected main category
- **QuickActions.js**: Utility buttons for bulk operations (select all, clear all)

### Custom Hooks
- **useCategoryHelpers.js**: Encapsulates all category-related logic including:
  - Count calculations and validation
  - Data transformation for save operations
  - Category toggle handling
  - Helper functions

## Benefits of This Structure

1. **Maintainability**: Each component has a single responsibility
2. **Reusability**: Components can be reused in other parts of the application
3. **Testability**: Smaller components are easier to unit test
4. **Performance**: Better tree shaking and code splitting opportunities
5. **Developer Experience**: Easier to locate and modify specific functionality
6. **State Management**: Cleaner separation of concerns with custom hooks

## Usage

The main component is exported from `index.js`, so you can import it the same way:

```javascript
import PagesManagement from '@/components/admin/PagesManagement'
```

All the internal component splitting is transparent to the parent components.

## State Flow

1. **Main Component** (`index.js`) manages global state and API calls
2. **Category Modal** receives state as props and handles category-specific operations
3. **Custom Hook** (`useCategoryHelpers.js`) provides business logic and validation
4. **Sub-components** receive specific props they need and emit events back up

The UI and functionality remain exactly the same as the original monolithic component.
