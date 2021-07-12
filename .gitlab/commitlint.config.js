module.exports = {
    extends: ['@commitlint/config-conventional'],
    rules: {
        "scope-empty": [1, "never"],
        "type-enum": [2, "always", [
            'build',
            'chore',
            'ci',
            'docs',
            'feat',
            'fix',
            'perf',
            'refactor',
            'revert',
            'style',
            'test',
            'i18n'
        ]
        ]

    }
};
