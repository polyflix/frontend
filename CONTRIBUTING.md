# Contributing to Polyflix front-end

To contribute to this project, you should be aware of the project folder architecture and some other rules that are in place.

## Folder architecture

The source code of the project is located in the `src/` folder.

**Every file containing code has to be put in the `src` folder. Reviewers will be very attentive to this during their merge reviews.**

- `public/`: Static files

  - `locales/` : Translations files

- `src/`: Code sources files

  - `assets/` : Utilities files and contents
  - `environments/` : Environment constants
  - `i18n/` : i18n configurations files
  - `modules/` :

    - `core/` : Global and reusable code base
    - `[scope]/`: Source code for the scoped element
      - `components/`: ressources reusable components
      - `constants/`: useful reusable constants
      - `contexts/`: react context providers
      - `helpers/`: global reusable code simplifier
      - `hooks/`: react customs hooks
      - `layout/`: page structure templates
      - `models/`: interface models
      - `pages/`: element pages
      - `reducers/`: redux reducers and slices
      - `services/`: element services
      - `styles/`: custom styles files for scoped element
      - `types/`: element type for Typescript
      - `utils/`: utilities ressouces

  - `styles/` : Custom css files
  - `theme/` :Material UI theme configurations and properties

## File naming convention

Each file must be suffixed by the name of what it contains.

For example, if you want to create a custom hook, you'll put the file into the `hooks` folder with the following name `useMyCustomHook.hook.ts`.

It is important because we can identify more easily files during debugging phases.

Components and pages should follow `CamelCase`
