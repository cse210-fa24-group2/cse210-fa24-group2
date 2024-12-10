#  single page dashboard ADR

## Context
Initially, the project proposal outlined a multi-page dashboard design with separate pages for career, projects, courses, and an overview. This approach aimed to organize information clearly and provide a modular user experience. 

During the first development sprint, we realized that implementing robust and distinct features for multiple pages would require significantly more time than anticipated. To address this challenge while ensuring timely delivery, we decided to adopt a single-page dashboard design, maintaining simplicity and focusing on core functionality. 

The single-page design was intended to include dynamic filtering capabilities, allowing users to view specific content related to career, projects, or courses. However, as the deadline approached, we assessed the time constraints and the complexity of implementing this feature. We chose to prioritize building functional individual components over dynamic filtering, leaving the latter as a future improvement.

## Decision Drivers
1. **Time Constraints**: Limited time required us to simplify the scope of the project to ensure delivery of a functional product.
2. **Development Efficiency**: Focusing on a single page reduced the complexity of managing navigation and state across multiple pages.
3. **User Experience**: Consolidating all information on one page simplifies navigation and ensures all essential content is accessible at a glance.
4. **Future Extensibility**: The single-page architecture lays the groundwork for adding dynamic filtering as part of future enhancements.

## Decision Outcome
We decided to:
1. Implement a single-page dashboard that consolidates all features and information.
2. Focus on the core components, such as task management, calendar integration, and data display, to ensure they are functional and user-friendly.
3. Defer the dynamic filtering feature to future iterations, ensuring the product remains functional and maintains a positive user experience.

### Consequences

#### Positive
- **Simplified Development**: Reduces complexity by avoiding multi-page navigation and state management.
- **Timely Delivery**: Ensures that the core functionality is completed and operational within the project timeline.
- **Unified User Experience**: All features are accessible in one place, eliminating the need to switch between pages.
- **Extensibility**: The architecture can be enhanced with dynamic filtering in the future without major redesigns.

#### Negative
- **Lack of Filtering**: Users cannot currently filter information based on categories like career, projects, and courses, which may slightly impact usability for some.
- **Potential Overload**: Displaying all information on one page could lead to a cluttered interface if not well-organized.

## Related Decisions
- **Dynamic Filtering as a Future Improvement**: The filtering functionality will be scoped for future development cycles when time constraints are less critical.
- **Component Focus**: Emphasis on creating independent and reusable components aligns with modularity principles.

## Implementation Plan
1. Develop a single-page layout with intuitive navigation and clearly separated sections for career, projects, courses, and overview.
2. Optimize the visual design to avoid clutter and ensure all content is readable and accessible.
3. Document plans for dynamic filtering as a future enhancement and identify potential implementation approaches for subsequent sprints.
