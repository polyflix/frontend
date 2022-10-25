const env = process.env

export default {
  user: {
    email: env.TEST_EMAIL || 'user@example',
    password: env.TEST_PASSWORD || 'password'
  },
  url : env.POLYFLIX_URL || 'https://qapolyflix.dopolytech.fr/'
}
