To record test interactively use 
```bash
npx playwright codegen https://qapolyflix.dopolytech.fr/
```

To run test use 
```bash
TEST_ADMIN_EMAIL=x \
TEST_ADMIN_PASSWORD=x \
TEST_CONTRIBUTOR_EMAIL=x \
TEST_CONTRIBUTOR_PASSWORD=x \
TEST_MEMBER_EMAIL=x \
TEST_MEMBER_PASSWORD=x \
POLYFLIX_URL="https://qapolyflix.dopolytech.fr/" \
npm run test:e2e

npm run test:e2e:debug # to run in debug mode
```

