# Polyflix

This repository is a monorepo powered by [Turbo](https://turbo.build/repo) which contains all our front-end applications and packages. We use the [pnpm](https://pnpm.io/fr/installation) as our package manager.

## Requirements

**Please install `pnpm`. Other package manager will not work with the current tools.**

- [pnpm](https://pnpm.io/fr/installation)

## Technologies

- [ViteJS](https://vitejs.dev/)
- [React](https://reactjs.org/)
- [Redux](https://redux.js.org/)
- [RTK Query](https://redux-toolkit.js.org/tutorials/rtk-query)
- [Material UI](https://mui.com/)

## IDE configuration

In order to maintain consistent coding styles across various editors and IDEs install the EditorConfig plugin on your IDE

https://editorconfig.org/#download

According to code policies you might need additional library:

- Prettier
- Eslint

You might lint and format code before pushing it!

## Development

To start front-end applications, you will generally require an up and running backend to integrate your feature or to deal with real use cases. We are doing our best effort to have an easy-to-use development environment, but this is still in reflexion on our side.

To fix issues or update packages, we recently integrated a new developer experience feature: the mock server. By default, it is **enabled**. If you wish to disable it to use a real Polyflix API, please set the `mocked` attribute to `false` in the `apps/polyflix/src/environments/environment.ts`.

### Getting started

Clone the repository:

```bash
git clone git@github.com:polyflix/frontend.git
```

Install dependencies :

```bash
pnpm install
```

Run the app :

```bash
pnpm start
```

Your app should now be accessible at http://localhost:3000.

```bash
pnpm build
```

## Contributing

For contributing to this project, please take note of this [document](CONTRIBUTING.md).
