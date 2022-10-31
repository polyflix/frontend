const env = process.env

export default {
  user: {
    admin_email: env.TEST_ADMIN_EMAIL ?? 'admin@localhost',
    admin_password: env.TEST_ADMIN_EMAIL ?? 'password',
    contributor_email: env.TEST_CONTRIBUTOR_EMAIL || 'user@example',
    contributor_password: env.TEST_CONTRIBUTOR_PASSWORD || 'password',
    member_email: env.TEST_MEMBER_EMAIL || 'user@example',
    member_password: env.TEST_MEMBER_PASSWORD || 'password',

  },
  url : env.POLYFLIX_URL || 'https://qapolyflix.dopolytech.fr/'
}
