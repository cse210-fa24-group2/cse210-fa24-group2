# Design System

Check out these [wireframes](https://balsamiq.cloud/su6lo52/pimeyek) to get a general idea of our layout.

Please update this as needed – if something looks wrong in practice and must be changed, change this so that we can all be on the same page.

# 1\. Foundations

## 1.1. Color Palette

### Light Mode

* **Primary Colors**:  
  * **Primary Background (\#F7FAFC)**: Light gray-blue for general backgrounds.  
  * **Primary Text (\#1A202C)**: Dark navy for readability against light backgrounds.  
* **Secondary Colors**:  
  * **Secondary Background (\#E2E8F0)**: Light gray for borders, inactive elements, and cards.  
  * **Success (\#38A169)**: Medium green for success notifications and completion indicators. Use for things like task completion.  
  * **Error (\#E53E3E)**: Dark red for error messages, warnings, and delete actions. User for things like tasks late.  
* **Buttons**:  
  * **Button Background (\#2B6CB0)**: A vibrant blue for buttons and primary interactions.  
  * **Button Task (\#F7FAFC)**: Light gray-blue for readability against button background.  
  * **Hover State (\#2C5282):** A slightly darker blue when hovering on the button.  
  * **Focus States**: Use an **outline (\#3182CE)** around the element to aid navigation, especially for keyboard users.  
* **Color Coding for Dashboard Page**  
  * Only use these on main dashboard page to distinguish between internships, courses, and projects  
  * **Internship Text (\#047555):** Emerald green for text relating to internships  
  * **Internship Accent (\#10B981)**: Light green if accent needed for internships  
  * **Course Text (\#1E40AF)**: Deep blue for text relating to courses  
  * **Course Accent (\#3B82F6)**: Soft blue if accent needed for courses  
  * **Project Text (\#AA3E06):** Dark orange for text relating to projects  
  * **Project Accent (\#FBA183)**: Bright orange if accent needed for projects  
* **Contrast Ratios**:  
  * Text on Primary Background: At least 7:1.  
  * Primary Action and Secondary Elements: At least 4.5:1.  
  * If unsure, test to make sure ratios meet accessibility standards [here](https://color.adobe.com/create/color-contrast-analyzer).

### Dark Mode

* **Primary Colors**:  
  * **Primary Background (\#1A202C)**: Dark navy for the main background.  
  * **Primary Text (\#F7FAFC)**: Light gray-blue for readability against the dark background.  
* **Secondary Colors**:  
  * **Secondary Background (\#2D3748)**: Medium-dark gray for cards, borders, and inactive elements.  
  * **Success (\#48BB78)**: Lighter green that remains vibrant against a dark background.  
  * **Error (\#FC8181)**: Light red for error states, retaining visibility without overwhelming the dark mode aesthetic.  
* **Buttons**:  
  * **Button Background (\#63B3ED)**: Light blue for key buttons and interactions, ensuring visibility.  
  * **Button Text (\#1A202C)**: Dark navy for readability.  
  * **Hover State (\#4A9AD4):** A slightly lighter blue when hovering on the button.  
  * **Focus States**: Use an **outline (\#63B3ED)** to indicate focus and keyboard navigation clearly.  
* **Color Coding for Dashboard Page**  
  * Only use these on main dashboard page to distinguish between internships, courses, and projects  
  * **Internship Text (\#22C55E):** Bright green for text relating to internships  
  * **Internship Accent (\#065F46)**: Dark green if accent needed for internships  
  * **Course Text (\#0EA8F0)**: Bright cyan for text relating to courses  
  * **Course Accent (\#075985)**: Deep blue if accent needed for courses  
  * **Project Text (\#FBA183):** Bright orange for text relating to projects  
  * **Project Accent (\#EA580C)**: Dark orange if accent needed for projects  
* **Contrast Ratios**:  
  * Text on Primary Background: At least 7:1.  
  * Primary Action and Secondary Elements: At least 4.5:1.  
  * If unsure, test to make sure ratios meet accessibility standards [here](https://color.adobe.com/create/color-contrast-analyzer).

## 1.2. Typography

* **Primary Font**: Roboto – clean, modern, and widely supported. Fallback is sans-serif to ensure compatibility.  
* **Sizing**:

| Text Style | Font Size | Font Weight | Usage |
| :---- | :---- | :---- | :---- |
| H1 | 2.25rem | 700 (Bold) | Main dashboard title |
| H2 | 1.875rem | 600 (Semi-bold) | Section titles |
| H3 | 1.5rem | 500 (Medium) | Subsection titles |
| Body Text | 1rem | 400 | Descriptions/content |
| Small Text | 0.875rem | 400 | Secondary info/labels |

## 1.3. Spacing and Sizing

### Padding and Margin

* **Section Padding**:  
  * Apply `3rem` padding on the outer edges of each section to ensure comfortable spacing for the content within, creating a balanced layout that adjusts with the overall screen size.  
* **Internal Padding for Components**:  
  * Use `1.5rem` padding within cards, containers, and component groups. This amount of internal padding keeps content visually separated and legible across various display sizes.

### Component Spacing

* **Vertical Spacing**: Use multiples of the base unit for vertical spacing between elements:  
  * **1rem** between closely related components (e.g., items within a card).  
  * **1.5rem** between grouped components (e.g., cards within a section).  
  * **3rem** between larger sections (e.g., Course Tracker and Internship Tracker).  
* **Horizontal Spacing**: Apply `1rem` for margins between components within the same row, ensuring adequate spacing that scales naturally.

### Button Sizing

* **Button Height and Padding**:  
  * Standard button height is `2.5rem` with `0.75rem` padding on each side.  
  * To maintain ease of interaction on different devices, use padding proportional to the base spacing unit (`0.75rem` to `1rem`) depending on button prominence (primary vs. secondary).

### Card and Container Sizing

* **Cards**: Responsive width with padding that scales based on rem units:  
  * Default width fills available container space (e.g., 100% in mobile views) while leaving internal padding of `1.5rem` for consistent spacing of content within each card.  
* **Containers**: To keep content readable on large screens, limit container width to `75rem`, centered within the viewport, while smaller screens will scale naturally with rem-based padding.

### Consistent Vertical Rhythm

* Establish a vertical rhythm using multiples of the base unit to maintain visual consistency across the layout:  
  * **Small element spacing**: `1rem`  
  * **Moderate spacing**: `1.5rem`  
  * **Large spacing for separation**: `3rem`

## 1.4. Icons and Illustrations

* **Icon Library**: [Use Material Icons](https://fonts.google.com/icons) for consistency with common design principles.  
* **Illustrations**: Optional, but subtle line illustrations can be added to personalize sections (e.g., a stack of books for Course Tracker).  
* **Usage**: Always use icons with text labels for clarity.  
* **Section Clarity**  
  * **Courses**: Use [**School Material Icon**](https://fonts.google.com/icons?selected=Material+Symbols+Outlined:school:FILL@0;wght@400;GRAD@0;opsz@24&icon.query=grad&icon.size=24&icon.color=%235f6368) for course-related items.  
  * **Internships**: Use [**Work Material Icon**](https://fonts.google.com/icons?selected=Material+Symbols+Outlined:work:FILL@0;wght@400;GRAD@0;opsz@24&icon.query=job&icon.size=24&icon.color=%235f6368) for career-related items.  
  * **Projects**: Use [**Emoji Objects Material Icon**](https://fonts.google.com/icons?selected=Material+Symbols+Outlined:emoji_objects:FILL@0;wght@400;GRAD@0;opsz@24&icon.query=light&icon.size=24&icon.color=%235f6368) for project-based tasks.

## 1.5. Accessibility

* **Contrast Ratio**: Follow WCAG 2.1 AA standards (4.5:1 for text and interactive elements).  
* **Keyboard Navigation**: Ensure all interactive components are keyboard accessible.  
* **Focus State**: Use a high-contrast outline for focused elements.

# 2\. Components

## 2.1. Navigation

* **Top**:  
  * Main sections (Dashboard, Course Tracker, Internship Tracker, Project Manager).  
  * Each section includes an icon and label, with the active section highlighted.  
  * **Height**: `4rem` – provides enough space for icons and links while keeping a compact header.  
  * **Padding**: `1rem` on all sides, keeping elements centered within the bar.  
  * **Icon Size**: `1.5rem` for quick recognition of actions.

## 2.2. Buttons

* **Primary Button**:   
  * Height: `2.5rem` with `1rem` horizontal padding.  
  * Font Size: `1rem` with font weight `600` for visibility.  
* **Secondary Button**:   
  * Height: `2.5rem` with `0.75rem` horizontal padding.  
  * Font Size: `1rem`, but with font weight `500` for a slightly lower visual priority.  
* **Icon Button**:   
  * Size: `2rem` (width and height) – circular, ideal for small interactive icons.  
  * Icon Size: `1.25rem` within the button for recognizability without taking excessive space.  
* **Button States**:  
  * Default, Hover, Active, Disabled with specific color variations.

## 2.3. Cards

* **Design**: Rounded corners, subtle shadow.  
* **Usage**: Code snippets, course titles/info, project titles/info  
* **Information Layout**: Title, description, and status are primary; additional metadata (e.g., course level, company) as secondary.  
* **Card Container**:  
  * Width: flexible to container, max-width of `20rem` to `24rem` depending on the layout.  
  * Padding: `1.5rem` on all sides to ensure breathing space around content.  
* **Card Header**:  
  * Header Padding: `0.75rem` bottom padding to create separation from the body content.  
* **Card Body**:  
  * Internal Spacing: `1rem` vertical spacing between items within the card for clear information hierarchy.

### 2.4. Forms

* **Input Fields**:  
  * Height: `2.5rem` with `0.75rem` padding on each side.  
  * Border Radius: `0.25rem` for a subtle rounded look.  
  * Labels above inputs for help.  
* **Validation**:  
  * Inline error messaging with a red border for invalid fields.  
  * Success indicator (green checkmark) for validated fields.  
* **Dropdowns**:  
  * Rounded corners, searchable, with auto-suggest feature for long lists.  
  * Height: `2.5rem` with `1rem` internal padding for selections.

## 2.5. Tables

* **Layout:** Zebra striping with alternating row colors (primary and secondary colors)  
* **Table Container:**  
  * **Width:** full container width but limited by padding (`2rem` on each side).  
* **Table Headers:**  
  * **Padding:** `0.75rem` vertically and `1rem` horizontally for comfortable click areas.  
* **Table Rows:**  
  * **Row Height:** `2.5rem` with padding of `0.5rem` for adequate spacing between rows.  
* **Column Headers**: Bold and slightly larger than row text.  
* **Sorting and Filtering**: Dropdown filter options and sortable columns.  
* **Expandable Rows**: For additional information without overcrowding.