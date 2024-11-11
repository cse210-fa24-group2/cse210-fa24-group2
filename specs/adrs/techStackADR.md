# Choice of Tech Stack for Frontend and Backend Development

## Context and Problem Statement
In developing our dashboard for computer science students to manage their busy schedules, we needed to select appropriate technologies for both the frontend and backend. The decision revolved around whether to use basic web technologies or adopt frameworks and libraries that might introduce complexity beyond the scope of our project. We had to choose between:

- **Frontend**: Using plain HTML, CSS, and JavaScript versus employing frontend frameworks or libraries like React, Angular, Vue.js.
- **Backend**: Choosing between Flask and other Python web frameworks like Django of FastApi, as well as selecting the right database solution—PostgreSQL or alternatives like SQLite or Firebase.

Our task was to choose technologies that would support speedy development, ease interaction with the necessary APIs (Google Calendar and OAuth), and fit the scope of our project.

## Decision Drivers
- **Simplicity and Ease of Learning**: Choosing technology with which the group is familiar.
- **Development Speed**: Need to develop the project efficiently within a limited timeframe.
- **Project Scope**: Small-scale project that doesn't require complex architectures.
- **Integration Capabilities**: Necessity to integrate seamlessly with Google OAuth and Google Calendar APIs.
- **Avoiding Unnecessary Complexity**: Minimizing dependencies and avoiding over-engineering.

## Considered Options

### Frontend Options
1. **HTML, CSS, and JavaScript**: Building the frontend using standard web technologies without additional frameworks or libraries.
2. **Frontend Frameworks/Libraries**: Utilizing React, Angular, or Vue.js to build a more dynamic frontend.

### Backend Framework Options
1. **Flask**: A lightweight Python web framework that is easy to learn and flexible.
2. **Django**: A more extensive Python web framework with built-in features and conventions.

### Database Options
1. **PostgreSQL**: A powerful relational database.
2. **SQLite**: A lightweight, file-based relational database.
3. **Firebase**: A cloud-based NoSQL database.

### Deployment Options
1. **Render**: A cloud platform for hosting web applications and services.
2. **Heroku**: A platform-as-a-service (PaaS) for deploying web applications.
3. **AWS (Amazon Web Services)**: A comprehensive cloud platform offering a wide range of services.
4. **Self-Hosting**: Deploying the application on our own servers or infrastructure.

## Decision Outcome
**Chosen Options**:

- **Frontend**: HTML, CSS, and JavaScript (No Frameworks)
- **Backend Framework**: Flask
- **Database**: PostgreSQL
- **Deployment**: Render
- **APIs**: Integration with Google OAuth and Google Calendar

## Consequences

### Good
- **Simplifies Development**: Familiar technologies allow the team to focus on important functionalities.
- **Lowers the Learning Curve**: No need to learn new frameworks, speeding up development.
- **Lightweight**: Suitable for a small-scale project without unnecessary overhead.
- **Seamless Integration**: Flask and standard web technologies integrate well with required APIs.
- **Robust Database Management**: PostgreSQL provides scalability and reliability.
- **Easy of Deployment**: Render simplifies the deployment process with minimal configuration.
- **Cost-Effective Deployment**: Render offers a free tier suitable for small projects.

### Bad
- **Manual Implementation**: May require more effort to code functionalities that frameworks provide out of the box.
- **Configuration Effort**: Flask requires manual setup of components like authentication and database integration.
- **Limited Advanced Features**: Lacks the efficiencies and components offered by modern frontend frameworks.
- **Vendor Dependence**: Relying on a specific deployment platform may limit flexibility in the future.

## Pros and Cons of the Options

### Frontend Options

#### Option 1: HTML, CSS, and JavaScript (Chosen)
**Good**:
- **Simplicity**: Straightforward development without additional layers of abstraction.
- **Control**: Full control over the codebase.
- **Familiarity**: Utillizes existing knowledge within the team.
- **Performance**: No overhead from frameworks may leading to faster load times.

**Bad**:
- **Development Time**: Might take longer to implement features that frameworks offer readily.
- **Consistency**: Without a framework, maintaining consistent styling and components can be challenging.
- **Scalability**: As the application grows, managing code complexity may become difficult.

#### Option 2: Frontend Frameworks/Libraries
**Good**:
- **Efficiency**: Frameworks like React, Angular, or Vue.js provide tools and components that speed up development.
- **Best Practices**: Encourage organized and maintainable code structures.
- **Community**: Large ecosystems with plugins and extensions.

**Bad**:
- **Learning Required**: Requires time to learn and adapt to the framework's paradigms.
- **Not suitable for Small Projects**: Introduces unnecessary complexity for a simple application.
- **Dependencies**: Additional dependencies may lead to potential security vulnerabilities.

### Backend Framework Options

#### Option 1: Flask (Chosen)
**Good**:
- **Lightweight and Flexible**: Minimalistic framework allowing for customization.
- **Easy to Learn**: Simpler to learn compared to larger frameworks.
- **Customizable**: Enables inclusion of only necessary components.
- **Ease of Integration**: Works well with SQLAlchemy and integrates smoothly with required APIs.
- **Familiarity**: Aligns with the team's Python experience.

**Bad**:
- **Manual Configuration**: Requires setting up components like authentication and database integration manually.
- **Limited Built-in Features**: Fewer functionalities compared to Django.

#### Option 2: Django
**Good**:
- **Features**: Comes with built-in admin interface, authentication system, and ORM.
- **Rapid Development**: Facilitates quick setup of common web application components.
- **Predefined Settings**: Encourages best practices and a standard project structure.

**Bad**:
- **Heavy**: More complex and may be excessive for the project's scope.
- **Learning Required**: Requires time to learn its conventions and configurations.
- **Less Flexible**: More rigid structure may limit customization.

### Database Options

#### Option 1: PostgreSQL (Chosen)
**Good**:
- **Robust and Scalable**: Handles concurrent connections efficiently, suitable for production environments.
- **Features**: Supports complex queries and transactions.
- **Integration with SQLAlchemy**: Simplifies database operations using Python objects.
- **Data Integrity**: Strong support for data types and constraints.

**Bad**:
- **Complexity**: Requires configuration and management of a database server.
- **Resource Intensive**: May consume more resources compared to lightweight databases.

#### Option 2: SQLite
**Good**:
- **Simplicity**: Easy to set up, no server required.
- **Lightweight**: Ideal for development and small applications.
- **File-Based**: Stores data in a single file, simplifying backups.

**Bad**:
- **Concurrency Limitations**: Not suitable for applications with multiple concurrent users.
- **Scalability**: Performance degrades with large datasets.
- **Limited Features**: Lacks some advanced features of full-fledged databases.

#### Option 3: Firebase
**Good**:
- **Backend-as-a-Service**: Reduces the need to manage server infrastructure.
- **Real-Time Data**: Simplifies real-time updates if needed.
- **Scalability**: Automatically handles scaling.

**Bad**:
- **Integration Challenges**: Less straightforward integration with Flask.
- **NoSQL Data Modeling**: Requires adapting to a different paradigm, which may not fit project needs.
- **Dependence**: Reliance on a third-party service with potential cost implications.

### Deployment Options

#### Option 1: Render (Chosen)
**Good**:
- **Ease of Use**: Simple deployment process with minimal configuration.
- **Supports Our Tech Stack**: Compatible with Flask, PostgreSQL, and allows environment variable configuration.
- **Managed PostgreSQL Databases**: Provides managed databases, reducing setup and maintenance efforts.
- **Cost-Effective**: Offers a free tier suitable for small projects.
- **Automatic Deployments**: Supports continuous deployment from Git repositories.
- **SSL and Custom Domains**: Provides HTTPS out of the box and supports custom domain names.

**Bad**:
- **Vendor Dependence**: Migrating to another platform may require adjustments.
- **Limited Customization**: Less control over infrastructure compared to services like AWS.

#### Option 2: Heroku
**Good**:
- **Ease of Use**: Similar simplicity in deployment.
- **Established Platform**: Well-known with extensive documentation.

**Bad**:
- **Idle Timeout**: Free tier applications may go to sleep after inactivity, causing initial load delays.
- **Limited Free Tier Resources**: More restrictive limits compared to Render.
- **Pricing**: Paid tiers can become expensive for scaling.

#### Option 3: AWS (Amazon Web Services)
**Good**:
- **Comprehensive Services**: Offers extensive services for scalability and customization.
- **Flexibility**: High degree of control over infrastructure.

**Bad**:
- **Complexity**: Requires learning with a multitude of services to configure.
- **Cost**: Can be more expensive, with complex pricing models.
- **Not suitable for Small Projects**: The breadth of services may be unnecessary for our needs.

#### Option 4: Self-Hosting
**Good**:
- **Full Control**: Complete control over the server environment.
- **Cost Savings**: Potentially lower costs if using existing infrastructure.

**Bad**:
- **Maintenance Overhead**: Responsible for all server maintenance, security updates, and uptime.
- **Scalability Issues**: Limited by our own infrastructure capabilities.
- **Security Risks**: Increased responsibility for securing the server and application.

## Decision Outcome
By choosing:

- **Frontend**: HTML, CSS, and JavaScript without additional frameworks.
- **Backend Framework**: Flask, for its simplicity and flexibility.
- **Database**: PostgreSQL for robust data management.
- **Deployment Platform**: Render, for easy deployment and management.

We align our tech stack with the project's requirements, scopa and the team's capabilities. This tech stack and deployment choice enable us to develop a functional, user-friendly dashboard.