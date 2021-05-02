const CracoAlias = require('craco-alias')

module.exports = {
    plugins: [
        {
            plugin: CracoAlias,
            options: {
                source: "tsconfig",
                baseUrl: "./src",
                tsConfigPath: "./tsconfig.paths.json"
            }
        }
    ],
    babel: {
        plugins: [
            "babel-plugin-transform-typescript-metadata",
            ["@babel/plugin-proposal-decorators", { "legacy": true }],
            ["@babel/plugin-proposal-class-properties", { "loose": true }],
        ],
    },
    style: {
        postcss: {
            plugins: [
                require('tailwindcss'),
                require('autoprefixer'),
            ],
        },
    },
}