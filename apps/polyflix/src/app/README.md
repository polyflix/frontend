# What is the purpose of this directory?

This directory contains all the code specific to the Polyflix application. (excluding studio)

This includes:

- `pages` - All the pages of the application
- `styles` - All the styles for the application

# How to use this directory

## Pages

To use a page, you can import it from the `@pages/` directory.

```tsx
import { Home } from '@pages/Home.page'
```

## Styles

To use a style, you can import it from the `@styles/` directory.

```tsx
import { HomeStyle } from '@styles/Home.styles'
```

_Consider using the shared folder to define components or things that could be reuse in the future to avoid duplicating and promote improvments._
