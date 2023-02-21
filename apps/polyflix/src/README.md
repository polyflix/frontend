# Source code file structure explanation

- [app](./app/): Contains the main application code.
- [assets](./assets/): Contains all the assets used in the application.
- [config](./config/): Contains the global configuration for the application such as routes and constants.
- [enviroments](./enviroments/): Contains the environment files and config for the application. (e.g. `environment.prod.ts`)
- [i18n](./i18n/): Contains the translation config files for the application. (translation files are in `../public/locales/`)
- [shared](./shared/): Contains all the shared code between our applications.
- [studio](./studio/): Contains the code for the Polyflix Studio dashboard.
- [styles](./styles/): Contains the global styles for the application. (SCSS ONLY)
- [theme](./theme/): Contains the MUI theme files for the application.

_[module](./module/): Should be removed. This is a leftover from the old structure._
