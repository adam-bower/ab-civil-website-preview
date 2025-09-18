# AB Civil Website Styling Plan

## Current State
- **Status**: Wireframe design complete (black borders, white backgrounds)
- **Content**: All pages and content implemented
- **Structure**: React components with React Router
- **Ready for**: Production styling phase

## Chosen Approach: Tailwind CSS

### Why Tailwind CSS?
1. **Rapid transformation** - Add classes to existing components without restructuring
2. **Self-contained styling** - Perfect for iframe embeds in Wix
3. **Consistent design system** - Built-in spacing, colors, and responsive utilities
4. **No CSS conflicts** - Important when embedding in another site
5. **Industry standard** - Most popular for new projects in 2024

## Implementation Phases

### Phase 1: Setup Tailwind (Day 1)
- [ ] Install Tailwind CSS and dependencies
- [ ] Configure `tailwind.config.js` with custom theme
- [ ] Create AB Civil brand colors palette
- [ ] Set up base styles (typography, spacing)
- [ ] Remove old CSS files (Semantic.css, PlainText.css)

### Phase 2: Core Components (Day 2-3)
- [ ] Style header/navigation with dropdown menus
- [ ] Convert hero sections to modern gradient design
- [ ] Style service cards with hover effects
- [ ] Update footer with proper spacing and layout
- [ ] Create reusable button components

### Phase 3: Forms & Interactive Elements (Day 4)
- [ ] Style ClientIntake form with validation states
- [ ] Style ServiceRequest form
- [ ] Ensure forms work standalone for Wix embedding
- [ ] Add loading states and error handling UI
- [ ] Create consistent input field styling

### Phase 4: Page-Specific Styling (Day 5)
- [ ] Services page with professional card layouts
- [ ] About page with team member grid
- [ ] Free Resources page with CTAs
- [ ] Pricing calculator with clean UI
- [ ] GetStarted page styling

### Phase 5: Polish & Responsive (Day 6)
- [ ] Mobile responsive adjustments
- [ ] Add subtle animations (fade-ins, hover transitions)
- [ ] Performance optimization
- [ ] Cross-browser testing
- [ ] Test all embeddable components in iframes

## Design System

### Color Palette
```css
/* Primary Colors */
--primary-blue: #2563eb     /* Main brand color */
--primary-dark: #1e40af     /* Hover states */
--primary-light: #3b82f6    /* Accents */

/* Grays */
--gray-900: #111827         /* Text */
--gray-700: #374151         /* Secondary text */
--gray-500: #6b7280         /* Muted text */
--gray-300: #d1d5db         /* Borders */
--gray-100: #f3f4f6         /* Backgrounds */

/* Semantic Colors */
--success: #10b981          /* Success states */
--warning: #f59e0b          /* Warnings */
--error: #ef4444            /* Errors */
```

### Typography
- **Headings**: Inter or system fonts
- **Body**: System fonts for fast loading
- **Sizes**: Using Tailwind's type scale (text-xs to text-6xl)

### Spacing Scale
- Use Tailwind's default spacing scale (0.25rem increments)
- Consistent padding: p-4, p-6, p-8 for sections
- Consistent margins: space-y-4, space-y-6 between elements

### Component Patterns

#### Buttons
```jsx
// Primary Button
className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"

// Secondary Button
className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"

// Ghost Button
className="px-6 py-3 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
```

#### Cards
```jsx
className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow"
```

#### Form Inputs
```jsx
className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
```

## Responsive Breakpoints
- Mobile First approach
- `sm:` 640px - Tablets
- `md:` 768px - Small laptops
- `lg:` 1024px - Desktops
- `xl:` 1280px - Large screens

## Animation Guidelines
- Keep animations subtle and professional
- Use `transition-all duration-200` for hover effects
- Implement `animate-fadeIn` for page loads
- Avoid excessive motion for accessibility

## Performance Considerations
1. **Purge unused CSS** - Tailwind's purge feature for production
2. **Lazy load images** - Especially team photos
3. **Optimize fonts** - Use system fonts or subset web fonts
4. **Code splitting** - For form components that embed separately

## Testing Checklist
- [ ] Test all forms in isolation
- [ ] Test embedding in Wix iframe
- [ ] Mobile responsiveness (iPhone, Android)
- [ ] Cross-browser (Chrome, Firefox, Safari, Edge)
- [ ] Accessibility (keyboard navigation, screen readers)
- [ ] Dark mode considerations (if implementing)

## File Structure After Styling
```
src/
├── components/
│   ├── ui/              # New: Reusable UI components
│   │   ├── Button.jsx
│   │   ├── Card.jsx
│   │   └── Input.jsx
│   ├── layout/          # New: Layout components
│   │   ├── Header.jsx
│   │   └── Footer.jsx
│   └── pages/           # Existing page components
├── styles/
│   └── globals.css      # Tailwind imports and custom CSS
└── tailwind.config.js   # Tailwind configuration
```

## Notes for Implementation
1. **Start with one component** - Transform Header first as proof of concept
2. **Create design tokens early** - Establish colors/spacing in config
3. **Build component library** - Create reusable UI components
4. **Document as you go** - Add comments for complex Tailwind combinations
5. **Get feedback often** - Test with stakeholders after each phase

## Resources
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Tailwind UI Components](https://tailwindui.com/components) (for inspiration)
- [HeadlessUI](https://headlessui.com/) (for accessible components)
- [Heroicons](https://heroicons.com/) (for consistent icons)

---
*Created: 2025-09-17*
*Status: Planning Phase*
*Next Step: Await approval to begin Phase 1*