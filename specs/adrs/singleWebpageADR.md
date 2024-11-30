# **Decision to Use a Single Page for the Computer Science Student Dashboard**

## **Context and Problem Statement**

In the initial planning phase, we designed the Computer Science Student Dashboard as a multi-page application with four pages: an overview page, a course page, a career page, and a project page. Each page was intended to organize and display distinct sets of student information. However, due to time constraints and the complexity of implementing a fully functional multi-page application within the project timeline, we needed to decide whether to retain the original multi-page design or pivot to a single-page application (SPA) with dynamic filtering functionality.

The SPA approach will allow users to access all information on one page while using navigation buttons to filter and display specific content (e.g., only course-related information). This decision affects user experience, development effort, and maintainability.

## **Decision Drivers**

* **Time Constraints**: The need to deliver a functional and complete application within the project timeline.  
* **Development Complexity**: Reducing the complexity of managing state and navigation across multiple pages.  
* **User Experience**: Maintaining an intuitive and seamless interface for students to access relevant information.  
* **Maintainability**: Simplifying the codebase to make future updates and maintenance easier.

## **Considered Options**

1. **Multi-Page Application (Original Plan)**: Retain the original design with four distinct pages for different categories of information.  
2. **Single-Page Application with Filtering (Chosen Option)**: Combine all content into a single page, using navigation buttons to dynamically filter and display relevant sections.

## **Decision Outcome**

**Chosen option:** **Option 2 \- Single-Page Application with Filtering**  
We decided to adopt the SPA approach with filtering because it aligns better with our project constraints and priorities. This design reduces development effort while maintaining a clear and user-friendly interface. By centralizing all functionality into a single page, we can avoid the overhead of managing multiple pages and ensure timely delivery of the application.

### **Consequences**

* **Good:**  
  * Reduced development time by avoiding the need to implement and test navigation and state management for multiple pages.  
  * Simplified codebase, making future updates and debugging more manageable.  
  * Consistent user experience with dynamic filtering to access relevant content seamlessly.  
* **Bad:**  
  * Potential for a more cluttered interface if not carefully designed.  
  * Larger initial page load time due to all content being included upfront.  
  * Requires careful testing to ensure filtering functionality is intuitive and responsive.

## **Pros and Cons of the Options**

### **Option 1: Multi-Page Application**

* **Good:** Clean separation of information into distinct pages.  
* **Good:** Faster individual page loads since only relevant content is loaded per page.  
* **Bad:** Higher development complexity due to managing navigation, state persistence, and inter-page interactions.  
* **Bad:** Increased development time, risking project delays.

### **Option 2: Single-Page Application with Filtering (Chosen)**

* **Good:** Faster development cycle by consolidating all content into one page.  
* **Good:** Simplified architecture with no need to manage inter-page state.  
* **Good:** Provides a unified experience where all information is accessible within the same context.  
* **Bad:** Larger initial page load time, potentially impacting performance on slower devices.  
* **Bad:** Risk of user confusion if the filtering mechanism is not intuitive or well-executed.

Adopting the SPA approach with filtering allows us to balance the project constraints with the need to deliver a functional, maintainable, and user-friendly application. This decision prioritizes timely completion while preserving a good user experience.