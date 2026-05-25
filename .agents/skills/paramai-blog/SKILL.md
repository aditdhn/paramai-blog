```markdown
# paramai-blog Development Patterns

> Auto-generated skill from repository analysis

## Overview
This skill teaches you the core development patterns and conventions used in the `paramai-blog` TypeScript codebase. While no specific framework is detected, the repository follows clear conventions for file naming, imports, exports, and testing. This guide will help you contribute code that aligns with the project's established style and workflows.

## Coding Conventions

### File Naming
- Use **kebab-case** for all file names.
  - **Example:**  
    `blog-post-list.ts`  
    `user-profile.test.ts`

### Import Style
- Use **relative imports** for referencing modules within the project.
  - **Example:**
    ```typescript
    import { getPost } from './utils/get-post';
    ```

### Export Style
- Use **named exports** for all modules.
  - **Example:**
    ```typescript
    // In blog-utils.ts
    export function formatDate(date: Date): string { ... }

    // In another file
    import { formatDate } from './blog-utils';
    ```

### Commit Patterns
- Commit messages are **freeform** with no strict prefix, averaging 68 characters.

## Workflows

_No automated workflows detected in the repository._

## Testing Patterns

- **Test File Naming:**  
  Test files use the pattern `*.test.*`.
  - **Example:**  
    `blog-post.test.ts`
- **Testing Framework:**  
  The specific testing framework is unknown, but standard TypeScript test conventions apply.
- **Test Example:**
  ```typescript
  // blog-post.test.ts
  import { getPost } from './get-post';

  describe('getPost', () => {
    it('returns the correct post by ID', () => {
      // test implementation
    });
  });
  ```

## Commands
| Command | Purpose |
|---------|---------|
| /new-file | Create a new module using kebab-case and named exports |
| /add-test | Add a new test file using the *.test.* pattern |
| /import-module | Import a module using relative import style |
| /export-named | Export functions or variables using named exports |
```
