var app = getApp();

Page({
    data: {
      ischeck: false,
      items: [
        { index: 0 }
      ],
      czhd: [],
      activeIndex: 0,
      czmoney: 0
    },
    lookck: function() {
        wx.navigateTo({
          url: "czxy"
        });
    },

    tabClick1: function(e) {
        this.setData({
            activeIndex: -1,
            czmoney: 0
        });
    },

    bindinput: function(e) {
        var t;
        console.log(e.detail.value), t = "" != e.detail.value ? e.detail.value : 0, this.setData({//t不等于""时，：左边数据的赋值给t
          czmoney: parseFloat(t).toFixed(2)//字符串转化为浮点数
        });
    },

  
    jsmj: function(e, t) {
        for (var a, o = 0; o < t.length; o++) if (Number(e) >= Number(t[o].full)) {
            a = o;
            break;
        }
        return a;
    },

    
    // radio按钮
    click: function (e) {
      var click = this;
      var index = e.currentTarget.dataset.index;
      for (var item of click.data.items) {
        console.log("--121--", index)
        item.index = index && (
          item.checked = !item.checked,
          console.log("==232==", item.checked),
          this.setData({
            ischeck: item.checked
          }),
          console.log("==232==", this.data.ischeck, "==================================================")
        )
      }
      click.setData({
        items: click.data.items
      })
    },
  
    
    tjddformSubmit: function(e) {
      console.log(this.data.ischeck, 11111111111)
      if (this.data.ischeck == false) {
        wx.showModal({
          title: '提示',
          content: '请阅读并同意《充值服务协议》',
          success: function (t) {
            t.confirm ? (
              console.log("用户点击确定")
            ) : t.cancel && console.log("用户点击取消");
          }
        })
      } else {
        var page = this;
        var t = e.detail.formId;
        console.log("form发生了submit事件，携带数据为：", e.detail, e.detail.formId);
        var a = this.data.userinfo.openid,
          o = this.data.czmoney,
          i = this.data.userinfo.id;
        if (
          Number(o) <= 0) wx.showModal({
          title: "提示",
          content: "充值金额不能小于0"
        }); else {
             wx.showLoading({
              title: "加载中",
              mask: !0
            }), app.util.request({////////////////////////////////////////////////////////////////////////////////////获取订单号
              url: "entry/wxapp/AddCzorder",//原本是被注释，必须打开才能执行到pay
              cachetime: "0",
              data: {
                user_id: i,
                money: o,  //页面输入的数字，充值的钱
              },
              success: function (e) {
                console.log(e, "1111111111111111111111111111111111111111111");
                var t = e.data,
                  user_id = this.data.user_id;
                app.util.request({/////////////////////////////////////////////////////////////////////////////////获取生产参数
                  url: "entry/wxapp/pay",
                  // wx.request({
                  //   url: 'http://192.168.10.4:7300/mock/5b782535bfe92705006efea3/wxapp/pay',
                  cachetime: "0",
                  data: {
                    openid: a,
                    money: o,
                    order_id: t,
                    type: 2,
                    user_id: user_id
                  },
                  success: function (e) {
                    console.log(e, "222222222222222222222222222222222222");
                    var aorder = this;
                    console.log("===============", t, "==================")
                    console.log(e),
                      wx.requestPayment({//wx.requestPayment微信发起支付
                        timeStamp: e.data.timeStamp,//当前的时间
                        nonceStr: e.data.nonceStr,//随机字符串，长度为32个字符以下
                        package: e.data.package,//数据包：统一下单接口返回的 prepay_id 参数值，提交格式如：prepay_id=***
                        signType: e.data.signType,//签名算法
                        paySign: e.data.paySign,//签名
                        success: function (e) {
                          var id = page.data.userinfo.id,
                            order_id = aorder.data.order_id;
                          console.log(e);
                          app.util.request({
                            url: 'entry/wxapp/paystate',
                            data: {
                              status: 1,
                              user_id: id,
                              order_id: order_id
                            },
                            success: function (t) {
                              console.log("发送 支付成功 成功")
                            }
                          })
                        },
                        fail: function (e) {
                          var id = page.data.userinfo.id,
                            order_id = aorder.data.order_id;
                          app.util.request({
                            url: "entry/wxapp/paystate",
                            cachetime: "0",
                            data: {
                              status: 2,
                              user_id: id,
                              order_id: order_id
                            },
                            success: function (t) {
                              console.log("发送 支付失败 成功")
                            }
                          });
                        },
                        complete: function (e) {
                          console.log(e),
                            "requestPayment:fail cancel" == e.errMsg && wx.showToast({//wx.showToast显示消息提示框
                              title: "取消支付",
                            }),
                            "requestPayment:ok" == e.errMsg && (wx.showModal({//wx.showModal显示模态对话框
                              title: "提示",
                              content: "支付成功",
                              showCancel: !1
                            }),
                              setTimeout(function () {
                                wx.navigateBack({});
                              }, 1e3));
                        }
                      });
                  }
                });
              },
            });
        }
      }
    },
    onLoad: function(e) {
        app.setNavigationBarColor(this);
        var t = this, a = wx.getStorageSync("users").id;//a = wx.getStorageSync("users").id得到本地缓存，获取当前用户id,将id赋值给a
        app.util.request({
           url: "entry/wxapp/UserInfo",
        // wx.request({//充值中心 当前余额模块
            // url: 'http://192.168.10.4:7300/mock/5b782535bfe92705006efea3/wxapp/UserInfo',
        //  url: "http://192.168.10.4:7300/mock/5b997ec11bb1360514d591e2/example/first",//自编测试，可删
            cachetime: "0",
            data: {
                user_id: a
            },
            success: function(e) {
                console.log(e), t.setData({
                    wallet: e.data.wallet,
                    userinfo: e.data
                });
            }
        })
       
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {}
});