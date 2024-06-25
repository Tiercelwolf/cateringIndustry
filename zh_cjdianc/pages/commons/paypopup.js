
var app = getApp();
Component({
  properties: {

    color: {
      type: String,
      value: ''
    },

    timeText: {
      type: String,
      value: ''
    },

    paymoney: {
      type: Number,
      value: ''
    },

    Wallectmoney: {
      type: Number,
      value: ''
    },

    orderid: {
      type: Number,
      value: ''
    },

    money: {
      type: Number,
      value: ''
    },

    order_type: {
      type: String,
      value: ''
    }

  },

  data: {
    sqw: 1,
    hidden: true,
  },

  methods: {

    hidePaypopup() {
      this.setData({
        hidden: true
      })
    },

    showPaypopup() {
      this.setData({
        hidden: false,
      })
    },

    sqwselect1: function () {
      this.setData({
        sqw: 1
      })
      console.log("------现在是微信支付------")
    },

    sqwselect2: function () {
      this.setData({
        sqw: 2
      })
      console.log("----现在是钱包支付------")
    },
    hide: function () {
      this.setData({
        hide: 1
      })
    },

    recharge: function () {
      wx.navigateTo({
        url: '../wallet/walletadd',
      })
    },

    deletee: function (t) {
      var page = this;
      setTimeout(function () {
        page.setData({
          hidden: true
        })
      }, 500)
    },

    confirmpay: function (t) {
      var e = getApp().getOpenId,
        page = this,
        a = wx.getStorageSync("users").id,
        o = t.currentTarget.dataset.id,
        n = t.currentTarget.dataset.money,
        s = t.currentTarget.dataset.type;

      page.hidePaypopup();
      page.setData({
        ordertype: page.data.order_type
      }),

  // 钱包支付
  (2 == s || "2" == s) && (

        app.util.request({
          url: "entry/wxapp/wallectmoney",
          cachetime: "0",
          data: {
            user_id: a
          },
          success: function (i) {
            console.log("----------tttttttttttttttttt--------", i.data.wallectmoney);
            page.data.wallectmoney = i.data.wallectmoney;

            (page.data.wallectmoney > n) ? (
              wx.showModal({
                title: '提示',
                content: '请确认使用钱包支付！',
                success: function (res) {
                  if (res.confirm) {
                    app.util.request({
                      url: "entry/wxapp/sucwallectpay",
                      cachetime: "0",
                      data: {
                        status: 1,
                        user_id: a,
                        pay_type: 3,
                        order_id: o,
                        money: n
                      },
                      success: function () {
                        wx.showToast({
                          title: '支付成功！',
                          icon: 'success',
                        })
                        wx.redirectTo({
                          url: 'order?status=2',
                        })
                      },

                      fail: function () {
                        wx.showModal({
                          title: '提示',
                          content: '钱包 支付失败',

                        })
                      }
                    })
                  } else if (res.cancel) {
                    console.log('用户点击取消')
                  }
                }
              })
            ) : (
                wx.showModal({
                  title: '提示',
                  content: '钱包金额不足，支付失败，请充值！',

                })
              )
          }
        })     
  ),

// 微信支付
        (1 == s || "1" == s) && app.util.request({
          url: "entry/wxapp/payment",
          // wx.request({
          //   // url: 'http://192.168.10.4:7300/mock/5b782535bfe92705006efea3/wxapp/pay',
          //   url: 'http://192.168.10.4:7300/mock/5bc5de72363a0e050d79bce0/example/orderpay',
          cachetime: "0",
          data: {
            openid: e,
            money: n,
            order_id: o
          },
          success: function (t) {
            console.log(t),
              wx.requestPayment({
                timeStamp: t.data.timeStamp,
                nonceStr: t.data.nonceStr,
                package: t.data.package,
                signType: t.data.signType,
                paySign: t.data.paySign,
                success: function (t) {
                  console.log("=========ttttt==========", t);
                  app.util.request({
                    url: 'entry/wxapp/successpay',
                    cachetime: "0",
                    data: {
                      status: 1,
                      user_id: a,
                      pay_type: 1,
                      order_id: o
                    },
                    success: function (t) {
                      console.log("微信 支付成功");
                    },

                    complete: function (t) {
                      console.log("______complete执行了没？？？__________", t),
                        "request:fail cancel" == t.errMsg && wx.showToast({
                          title: "取消支付",
                          icon: "loading",
                          duration: 1e3
                        }),
                        "request:ok" == t.errMsg && (wx.showToast({
                          title: "支付成功",
                          duration: 1e3
                        }),
                          "1" == s && setTimeout(function () {
                            console.log("--------  1==s  ---------")
                            wx.redirectTo({
                              url: 'order?status=2',
                            })
                          }, 1e3));
                    }

                  })
                },

                fail: function (t) {
                  console.log("微信 支付失败")
                },
              })

          },

        })

    },

  }
})

