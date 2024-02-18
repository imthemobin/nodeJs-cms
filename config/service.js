module.exports = {
  recaptcha: {
    site_key: process.env.RECAPTCHA_SITEKEY,
    secret_key: process.env.RECAPTCHA_SECRETKEY,
    option: { hl: "fa" },
  },
};
