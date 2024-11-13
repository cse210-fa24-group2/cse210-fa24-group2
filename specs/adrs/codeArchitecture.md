# Code Architecture Alignment Doc

To ensure that our code looks like it was written by one person, we shall do our best to follow these practices:

---

## JavaScript

### Naming Conventions
- **Descriptive Names**: Use descriptive names for variables and functions.
- **camelCase**: Use camelCase for names (e.g., `firstVar`).
- **Function Names**: Function names should be verbs that describe their action (e.g., `findAuthor` or `runMotor`).
- **Variable Names**: Variable names should be nouns and start with a letter.
- **Abbreviations**: Keep names short and avoid abbreviations unless they’re obvious (e.g., `id` for identifier).

### Code Structure and Syntax
- **Use Shorthands**: Use shorthand where possible, but ensure clarity (e.g., `if (value)` instead of `if (value == true)`).
- **Variable Declaration**: Use `let` and `const` for declaring variables. Avoid `var`.
  - You can declare `let` without a value, but `const` requires a value.
- **Iterators**: Use `for...of` instead of `for` loops.
  - **Example**:
    ```javascript
    for (const city of cities) {
      ...
    }
    ```
- **Modularization**: Break down code into helper functions for common tasks.

### Commenting and Documentation
- **Concise Comments**: Comment code sparingly, focusing on functions, classes, objects, and interfaces.
- **JSDoc Example**:
    ```javascript
    /**
     * This function finds the author of a book.
     * @param {string} title - The title of the book
     */
    function findAuthor(title) { ... }
    ```
    <br/>

---

## HTML

### Syntax and Structure
- **Document Type**: Always declare document type as the first line:
  ```html
  <!DOCTYPE html>
- **Lowercase Names**: Use lowercase element and attribute names (e.g., use `<body>`, not `<BODY>`).
- **Close Elements**: We should close all html elements. For example:
     ```html
     <section>
		<p>some text… </p>
	 </section>
     
     rather than
  
	 <section>
		<p>some text…
	 </section>
     ```
     <br/>
- **Quote Attributes**: We should always quote attributes (e.g., do `<table class = “striped”>`, not `<table class=striped>`).
- **Spacing**: Do not put spaces around equal signs (e.g., do `x=y`, not `x = y`).

### Accessibility and Readability
- **Images**: Specify the alt, width and height for images
- **Keep Things Concise**: Avoid long code lines 

---

## Python

### Naming Conventions
- **camelCase**: Use camelCase for variable and function names (same as with Javascript)

### Code Structure and Syntax
- **Imports on Top**: All imports should be noted on the top of a file and on separate lines. For example, do:
  ```javascript
	Import os
	Import sys
    
    //And not:  
	Import os, sys
    
    //But you can do:
	From … import firstThing, secondThing
    ```
  <br/>
- **Alignment**: Wrapped elements should align either vertically or by using a hanging indent
- **Concise Code**: Keep lines short (no longer than 72 characters)
- **Spacing**: Avoid extraneous white space. For example, do: `spam(ham[1], {eggs: 2})` and not: `spam( ham[ 1 ], { eggs: 2 } )`.

### Commenting and Documentation
- **Descriptive Comments**: Have comments for functions that describe purpose, parameters and return type.
- **Inline Comments**: Use inline comments sparingly.
- **pep8 style**: When in doubt, check out the pep8 style guide [here](https://peps.python.org/pep-0008/)

---

## General Coding Documentation Best Practices
- **Use Clear and Consistent Comments**
    - Write comments that explain why the code is doing something, not just what it’s doing
    - Keep comments concise but informative, ensuring they add value rather than cluttering code
    - Use consistent terminology and formatting across your documentation for readability
- **Document Functionality at Different Levels**
    - File-Level Documentation: Describe the file’s overall purpose, any dependencies, and important classes or functions it contains
    - Class-Level Documentation: Explain what the class does, its intended use cases, and any major components (properties, methods)
    - Function-Level Documentation: Document each function’s purpose, input parameters, return types, and any side effects. If the function is complex, briefly explain its logic
- **Adopt a Standard Format for Function Documentation((
    - Use a format like docstrings (Python) or JSDoc (JavaScript) to provide structured details for each function
- **Provide Context with Inline Comments**
    - Use inline comments for complex logic, like nested loops, intricate algorithms, or when calling specific APIs
    - Avoid overusing inline comments for obvious code; focus instead on sections that need additional clarity
- **Version History and Author Information**
    - If possible, include versioning and modification history at the top of the file or within the class documentation
    - Also include author tags in comments, especially for critical sections of code, to facilitate follow-up
- **Example Usage and Edge Cases**
    - Include examples within function or class documentation for complex methods (show sample inputs and expected outputs)
    - Document any known edge cases or limitations to help other developers understand how the code should (or shouldn’t) be used
- **Update Documentation Regularly**
    - Make it a habit to update documentation whenever code changes
    - Consider documentation as part of code review, ensuring accuracy and relevance

---

## Error Handling Best Practices
- **Define Clear Error Messages**
    - Use error messages that are informative and guide the developer (or user) on how to address the issue
    - Include context in error messages where possible (e.g., "Error: Invalid user ID 'abc123' - ID must be a number")
- **Use Try-Catch (or Equivalent) Blocks Wisely**
    - Wrap only the code that’s likely to throw an error within try-catch blocks, rather than surrounding large sections of code
    - Aim for specific exception handling rather than generic catch (Exception e) blocks


