# Architecture Decision Record (ADR)

## Context and Problem Statement

At the start of our project, we faced a decision on which new (Greenfield) project to develop. Out of several options, we ultimately chose to create a dashboard tailored for computer science students. This decision aims to help students effectively manage multiple tasks related to academics, internship applications, and personal projects.

## Decision Drivers

1. **User Needs**: Computer science students require a centralized platform to manage courses, internship applications, and personal projects to improve efficiency and organization.
2. **Market Gap**: While existing tools (like Notion, ClickUp, Asana) provide task management functions, they lack a comprehensive solution specifically designed for computer science students.
3. **Technical Challenges**: Developing an integrated dashboard requires merging multiple features, such as calendar, task tracking, and project management, presenting a challenge for our team’s technical skills.

## Considered Options

1. **Develop Other Greenfield Projects**: Explore alternative projects, such as new applications or tools in other domains.
2. **Develop a Computer Science Student Dashboard**: Focus on creating an integrated management platform specifically for computer science students.

## Decision Outcome

We chose **Option 2**: developing a dashboard for computer science students. This decision was based on the following reasons:

- **Meeting Specific User Needs**: Through research and user stories, we identified the challenges faced by computer science students in managing their academics and career planning. Developing a dedicated dashboard directly addresses these needs.
- **Filling a Market Gap**: Current tools lack a comprehensive solution specifically designed for computer science students. Our project can fill this gap with customized features.
- **Technical Feasibility**: Our team possesses the necessary technical skills and is confident in integrating various features.

## Consequences

- **Positive Impacts**:
  - **Improved User Satisfaction**: Provides a tool that specifically meets the unique needs of computer science students.
  - **Enhanced Market Competitiveness**: Fills a market gap and offers a differentiated product.

- **Negative Impacts**:
  - **Increased Development Complexity**: Integrating various features may extend the development timeline.
  - **Higher Resource Requirements**: Requires additional time and personnel.

## Pros and Cons of Options

1. **Develop Other Greenfield Projects**
   - **Pros**:
     - **Diversity**: Allows exploring projects in different fields.
   - **Cons**:
     - **Uncertainty**: May not meet the specific needs of a targeted user group.
     - **Competitive Market**: Other fields may have established solutions.

2. **Develop a Computer Science Student Dashboard**
   - **Pros**:
     - **Meets Specific Needs**: Directly addresses the needs of computer science students.
     - **Market Gap**: Few specialized competing products.
   - **Cons**:
     - **Development Complexity**: Integrating multiple features increases the challenge.
     - **Resource Demand**: Requires more time and personnel.

## Related Research

In our research, we referred to the design and implementation of academic progress dashboards. For instance, the learning progress dashboard developed by Graz University of Technology for computer science students provides insights into academic performance and course progression, supporting students in managing their studies. [source1](https://link.springer.com/chapter/10.1007/978-3-030-81222-5_19)

Additionally, we analyzed the user journey of students in academic and career planning, identifying key needs in course management, internship tracking, and personal project management. These insights guided the design and prioritization of our project features.

We found that Notion templates like "Developer OS," designed for developers and students, integrate task management, project tracking, and resource organization. However, they lack specialized features needed by computer science students, such as internship tracking and course planning. Users often need to manually adapt these templates to fit academic needs, resulting in a fragmented experience. This is exactly the gap my project aims to fill. [source2](https://www.notion.so/templates/developer-os)

Wrike is a project management tool that provides team dashboards for task scheduling, progress tracking, and collaboration, making it suitable for managing complex workflows. While its features can be adapted for individual task management, it lacks customization for academic planning or internship tracking—key needs for computer science students. Students might use Wrike to organize courses and internships as separate projects, assigning deadlines, tracking progress, and even sharing updates with peers. However, since Wrike is primarily designed for general project management, it lacks the flexibility to meet students' specific academic requirements. This gap underscores the need for a more personalized dashboard tailored to the unique academic and career demands of computer science students. [source3](https://www.wrike.com/templates/software-template/)

## Conclusion

The decision to develop a computer science student dashboard was based on a comprehensive assessment of user needs, market opportunities, and technical feasibility. Despite challenges in development complexity and resource requirements, we believe this project will deliver significant value to our target users and establish a unique position in the market.
