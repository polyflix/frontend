# Contributing to Polyflix front-end

To contribute to this project, you should be aware of the project folder architecture and some other rules that are in place.

## Folder architecture

The source code of the project is located in the `src/` folder.

**Every file containing code has to be put in the `src` folder. Reviewers will be very attentive to this during their merge reviews.**

- `animations/` : contains Framer Motion global animation variants.
- `components/` : contains all React components.
- `constants/` : contains every file declaring constants.
- `hooks/` : contains custom hooks.
- `models/` : contains models for mapping json objects to class instance.
- `pages/` : contains all React pages components.
- `redux/` : contains Redux files (stores, actions, reducers etc).
- `services/` : contains services which are responsible to interact with the backend.
- `styles/` : contains SCSS files for global styling.
- `types/` : contains Typescript types declaration.
- `utils/` : contains all utils (or helper).

## File naming convention

Each file must be suffixed by the name of what it contains.

For example, if you want to create a custom hook, you'll put the file into the `hooks` folder with the following name `useMyCustomHook.hook.ts`.

It is important because we can identify more easily files during debugging phases.
