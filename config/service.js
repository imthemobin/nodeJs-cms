module.exports = {
  recaptcha: {
    site_key: process.env.RECAPTCHA_SITEKEY,
    secret_key: process.env.RECAPTCHA_SECRETKEY,
    option: { hl: "fa" },
  },
  google: {
    client_key: process.env.GOOGLE_CLIENTKEY,
    secret_key: process.env.GOOGLE_SECRETKEY,
    callback_url: process.env.CALLBACK_URL,
  },
};
