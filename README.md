# Polyflix - Front

This repository contains the source code of the Polyflix front-end.

The application runs in production at : [https://polyflix.dopolytech.fr/](https://polyflix.dopolytech.fr/)

## Technologies

- [ViteJS](https://vitejs.dev/)
- [React](https://reactjs.org/)
- [Redux](https://redux.js.org/)
- [RTK Query](https://redux-toolkit.js.org/tutorials/rtk-query)
- [Material UI](https://mui.com/)

## IDE configuration

In order to maintain consistent coding styles across various editors and IDEs install the EditorConfig plugin on your IDE

https://editorconfig.org/#download

According to code policies you might need additionnal library:

- Prettier
- Eslint

You might lint and format code before pushing it!

## Development

### Get started

In order to run the app locally, you must have a [back-end](https://gitlab.polytech.umontpellier.fr/polyflix-do/back-end) up and running. See the README for instructions.  
(Take care being up-to-date)

Clone the repository:

```bash
git clone git@gitlab.polytech.umontpellier.fr:polyflix-do/front-end.git
```

Install dependencies :

```bash
npm i
```

Run the app :

```bash
npm start
```

Your app should now be accessible at http://localhost:3000.

### More Commands

Fix code format and lint:

```bash
npm run fix
```

Test code:

```bash
npm run test:e2e
```

Build code with production environment

```bash
npm run build
```

## Contributing

For contributing to this project, please take note of this [document](CONTRIBUTING.md).
