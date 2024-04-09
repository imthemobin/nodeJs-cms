const controller = require("app/http/controllers/controller");
const Payment = require("app/models/payment");
const User = require("app/models/user");
const request = require("request-promise");
const bcrypt = require("bcrypt");

class userController extends controller {
  async index(req, res, next) {
    try {
      res.render("home/panel/index", { title: "پنل کاربری" });
    } catch (error) {
      next(error);
    }
  }

  async history(req, res, next) {
    try {
      let page = req.query.page || 1;

      let payments = await Payment.paginate(
        { user: req.user },
        { page, sort: { createdAt: -1 }, populate: "course" }
      );

      res.render("home/panel/history", {
        title: "پرداختی ها",
        payments: payments,
      });
    } catch (error) {
      next(error);
    }
  }

  async vip(req, res, next) {
    try {
      res.render("home/panel/vip");
    } catch (error) {
      next(error);
    }
  }

  async payment(req, res, next) {
    try {
      let plan = req.body.plan,
        price = 0;

      switch (plan) {
        case "12":
          price = 90000;
          break;
        case "3":
          price = 30000;
          break;

        default:
          price = 10000;
          break;
      }

      // buy proccess
      let params = {
        merchant_id: "f83cc956-f59f-11e6-889a-005056a205be",
        amount: price,
        callback_url: "http://localhost:3000/user/panel/vip/payment/check",
        description: "بابت افزایش اعتبار ویژه",
        email: req.user.email,
      };
      let options = this.getUrlOption(
        "https://api.zarinpal.com/pg/v4/payment/request.json",
        params
      );

      request(options)
        .then(async (data) => {
          let payment = new Payment({
            user: req.user._id,
            vip: true,
            ressNumber: data.data.authority,
            price: price,
          });

          await payment.save();

          res.redirect(
            `https://www.zarinpal.com/pg/StartPay/${data.data.authority}`
          );
        })
        .catch((err) => res.json(err.message));
    } catch (error) {
      next(error);
    }
  }

  async paymentCheck(req, res, next) {
    try {
      let payment = await Payment.findOne({ ressNumber: req.query.Authority });

      if (!payment.vip) {
        return this.alertAndBack(req, res, {
          title: "دقت کنید",
          message: "عملیان پرداخت شما مربوط به افزایش اعتبار عضویت ویژه نیست",
          type: "error",
        });
      }
      // ******test for payment is work*******
      payment.payment = true;

            let time = 0,
              type = "";

            switch (payment.price) {
              case 10000:
                time = 1;
                type = "month";
                break;
              case 30000:
                time = 3;
                type = "3month";
                break;
              case 90000:
                time = 12;
                type = "12month";
                break;
            }

            if (time == 0) {
              this.alert(req, {
                title: "دقت کنید",
                message: "عملیات مورد نظر با موفقیت انجام نشد",
                type: "error",
                button: "بسیار خوب",
              });
              return res.redirect("/user/panel/vip");
            }

            let vipTime = req.user.isVip()
              ? new Date(req.user.vipTime)
              : new Date();

            vipTime.setMonth(vipTime.getMonth() + time);

            req.user.vipTime = vipTime;
            req.user.vipType = type;

            await req.user.save();

            await payment.save();

            this.alert(req, {
              title: "با تشکر",
              message: "عملیات مورد نظر با موفقیت انجام شد",
              type: "success",
              button: "بسیار خوب",
            });

            res.redirect("/user/panel/vip");
      // ******test for payment is work*******

      let params = {
        merchant_id: "f83cc956-f59f-11e6-889a-005056a205be",
        amount: payment.price,
        authority: req.query.Authority,
      };

      let options = this.getUrlOption(
        "https://api.zarinpal.com/pg/v4/payment/verify.json",
        params
      );

      request(options)
        .then(async (data) => {
          if (data.Status == 100) {
            payment.payment = true;

            let time = 0,
              type = "";

            switch (payment.price) {
              case 10000:
                time = 1;
                type = "month";
                break;
              case 30000:
                time = 3;
                type = "3month";
                break;
              case 90000:
                time = 12;
                type = "12month";
                break;
            }

            if (time == 0) {
              this.alert(req, {
                title: "دقت کنید",
                message: "عملیات مورد نظر با موفقیت انجام نشد",
                type: "error",
                button: "بسیار خوب",
              });
              return res.redirect("/user/panel/vip");
            }

            let vipTime = req.user.isVip()
              ? new Date(req.user.vipTime)
              : new Date();

            vipTime.setMonth(vipTime.getMonth() + time);

            req.user.vipTime = vipTime;
            req.user.vipType = type;

            await req.user.save();

            await payment.save();

            this.alert(req, {
              title: "با تشکر",
              message: "عملیات مورد نظر با موفقیت انجام شد",
              type: "success",
              button: "بسیار خوب",
            });

            res.redirect("/user/panel/vip");
          } else {
            this.alertAndBack(req, res, {
              title: "دقت کنید",
              message: "پرداخت شما با موفقیت انجام نشد",
              type: "error",
            });
          }
        })
        .catch((err) => {
          next(err);
        });
    } catch (error) {
      next(error);
    }
  }

  getUrlOption(url, params) {
    return {
      method: "POST",
      uri: url,
      headers: {
        "cache-control": "no-cache",
        "content-type": "application/json",
      },
      body: params,
      json: true,
    };
  }

  async update(req, res, next) {
    try {
      let result = await this.validationData(req);

      if (!result) {
        return this.back(req, res);
      }

      //update user
      let user = await User.findByIdAndUpdate(req.params.id, {
        $set: {
          name: req.body.newName,
          email: req.body.newEmail,
          password: bcrypt.hashSync(req.body.newPassword, 10),
        },
      });

      //redirect back
      return res.redirect("/user/panel");
    } catch (error) {
      console.log(error)
      next(error);
    }
  }
}

module.exports = new userController();
