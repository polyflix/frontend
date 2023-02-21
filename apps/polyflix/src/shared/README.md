# What is the purpose of this directory?

This directory contains all the shared code between our whole application, for the moment we only share between the `app` and the `studio` but in the future we might share between other applications.

We could also move the shared code to be a dependency but for the moment we don't have enough shared code to do that.

This includes:

- `components` - All the shared components
- `layouts` - All the shared layouts
- `services` - All the shared services
- `types` - All the shared types

# How to use this directory

## Components

To use a shared component, you can import it from the `@components/` directory.

```tsx
import { Button } from '@components/Button.component'
```

## Layouts

To use a shared layout, you can import it from the `@layouts/` directory.

```tsx
import { MainLayout } from '@layouts/MainLayout.layout'
```

## Services

To use a shared service, you can import it from the `@services/` directory.

```tsx
import { useAuth } from '@services/auth.service'
```
