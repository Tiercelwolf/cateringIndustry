var app = getApp();

Page({
  data: {
    color: "#34aaff",
    status: 1,
    order_list: [],
    show_no_data_tip: !1,
    hide: 1,
    qrcode: "",
    pagenum: 1,
    storelist: [],
    isloading: !0,
    mygd: !1,//!1是false
    jzgd: !0
  },

  selectitem: function (t) {
    var idx = t.currentTarget.dataset.index
    console.log("======", idx)
    this.data.mygd = !1,//flase 一开始不会显示暂无订单这个页面
    this.data.jzgd = !0,
    this.data.pagenum = 0,
    this.data.status = idx,
    this.hidetop = !0,
    this.reLoad();
  },

  onLoad: function (t) {
    console.log("睡吧", t)
    app.setNavigationBarColor(this);
    var a = this;
    app.util.request({
      url: "entry/wxapp/system",
      // wx.request({
      //   url: 'http://192.168.10.4:7300/mock/5b782535bfe92705006efea3/wxapp/system',
      cachetime: "0",
      success: function (t) {
        console.log(t);
        var e = t.data;
        "2" == e.model && (getApp().sjid = e.default_store),
          "4" == e.model && (getApp().sjid = e.default_store),
          "" == t.data.dc_name && (t.data.dc_name = "店内"),
          "" == t.data.wm_name && (t.data.wm_name = "外卖"),
          "" == t.data.yd_name && (t.data.yd_name = "预定"),
          a.setData({
            System: t.data,
          isloading: !1
          });
      }
    });

    console.log(t), this.setData({
      status: t.status
    }),
      this.reLoad();//this.reLoad()刷新当前页面，重新上一次请求
  },

  selectitem: function (t) {
    var idx = t.currentTarget.dataset.index
    console.log("======", idx)
    this.setData({
      status: idx
    }), this.reLoad();
  },
  
  reLoad: function () {
    var t,
      a = this,
      e = this.data.status || 1,
      o = wx.getStorageSync("users").id,
      n = this.data.pagenum;
      1 == e && (t = "2"), //已拒绝
      2 == e && (t = "6"), //已通过
      3 == e && (t = "8"),//已拒绝 
      console.log(t, o, n),
      app.util.request({
        url: "entry/wxapp/MyYyOrder",
        // wx.request({
        // url: 'http://192.168.10.4:7300/mock/5b782535bfe92705006efea3/wxapp/MyYyorder/' + t, //控制台输出t = 2
        // url: 'http://192.168.10.4:7300/mock/5b782535bfe92705006efea3/wxapp/MyYyorder/3',
        //t = 3
        cachetime: "0",
        data: {
          state: t,
          user_id: o,
          page: n,
          pagesize: 10
        },
        success: function (t) {
          console.log("分页返回的列表数据", t.data ,"???"), t.data.length < 10 ? a.setData({
            mygd: !0,//非0是true
            jzgd: !0
          }) : a.setData({
            jzgd: !0,
            pagenum: a.data.pagenum + 1
          });
          console.log("---------------e    d.data.storeList--------------------",a.data.storelist)
          var e = a.data.storelist;
          e = function (t) {
            for (var e = [], a = 0; a < t.length; a++) -1 == e.indexOf(t[a]) && e.push(t[a]);
            return e;
          }(e = e.concat(t.data))
          
          // 根据下单时间  由大到小  排序
          for (var i = 0; i < e.length; i++) {
            for (var j = i; j < e.length; j++) {
              if (new Date(e[i].order.time).getTime() < new Date(e[j].order.time).getTime()) {
                var temp = e[i];
                e[i] = e[j];
                e[j] = temp;
              }
            }
          }
          console.log("---  我的预约  订单  排序之后的数据------", e)

          a.setData({
            order_list: e,
            storelist: e
          }), 
          console.log("---我的预约--order_list  e---",e);//利用控制台输出得到e为2
        }
      });
  },
  onReachBottom: function () {
    console.log("上拉加载", this.data.pagenum);
    !this.data.mygd && this.data.jzgd && (this.setData({
      jzgd: !1
    }), this.reLoad());
  },
  orderPay: function (t) {
    var e = getApp().getOpenId,
      a = wx.getStorageSync("users").id,
      o = t.currentTarget.dataset.id,
      n = t.currentTarget.dataset.money,
      s = t.currentTarget.dataset.type;
    console.log(e, a, o, n, s),
      "5" == s ? wx.showModal({
        title: "提示",
        content: "您的支付方式为餐后支付，请到收银台付款"
      }) : (wx.showLoading({
        title: "正在提交",
        mask: !0
      }),

        app.util.request({
          url: "entry/wxapp/pay",
          // wx.request({
          //   url: 'http://192.168.10.4:7300/mock/5b782535bfe92705006efea3/wxapp/pay',
          cachetime: "0",
          data: {
            openid: e,
            money: n,
            order_id: o
          },
          success: function (t) {
            console.log(t),
              wx.hideLoading(),
              wx.requestPayment({
                timeStamp: t.data.timeStamp,
                nonceStr: t.data.nonceStr,
                package: t.data.package,
                signType: t.data.signType,
                paySign: t.data.paySign,
                success: function (t) {
                  console.log(t.data);
                },
                complete: function (t) {
                  console.log(t), "requestPayment:fail cancel" == t.errMsg && wx.showToast({
                    title: "取消支付",
                    icon: "loading",
                    duration: 1e3
                  }), "requestPayment:ok" == t.errMsg && (wx.showToast({
                    title: "支付成功",
                    duration: 1e3
                  }), 1 == s && setTimeout(function () {
                    wx.redirectTo({//关闭当前页面，跳转到另一个页面
                      url: "order?status=2"
                    });
                  }, 1e3), 2 == s && setTimeout(function () {
                    wx.redirectTo({
                      url: "order?status=4"
                    });
                  }, 1e3));
                }
              });
          }
        }));
  },
  canceldd: function (t) {
    var e = t.currentTarget.dataset.id;
    console.log(e), wx.showModal({
      title: "提示",
      content: "是否取消该订单？",
      cancelText: "否",
      confirmText: "是",
      success: function (t) {
        if (t.cancel) return !0;
        t.confirm && (wx.showLoading({
          title: "操作中"
        }), app.util.request({
          // url: "entry/wxapp/CancelOrder",
          cachetime: "0",
          data: {
            order_id: e
          },
          success: function (t) {
            console.log(t.data), "1" == t.data ? (wx.showToast({
              title: "取消成功",
              icon: "success",
              duration: 1e3
            }), setTimeout(function () {
              wx.redirectTo({
                url: "order?status=5"
              });
            }, 1e3)) : wx.showToast({
              title: "请重试",
              icon: "loading",
              duration: 1e3
            });
          }
        }));
      }
    });
  },

  //删除（此功能暂时不适用，删除订单会引发歧义）
  orderRevoke: function (t) {
    var e = t.currentTarget.dataset.id;
    console.log(e), wx.showModal({
      title: "提示",
      content: "是否删除该订单？",
      cancelText: "否",
      confirmText: "是",
      success: function (t) {
        if (t.cancel) return !0;
        t.confirm && (wx.showLoading({
          title: "操作中"
        }),
          app.util.request({
            url: "entry/wxapp/DelOrder",
            //  wx.request({
            // url: 'http://192.168.10.4:7300/mock/5b782535bfe92705006efea3/wxapp/delorder', //数据为1
            data: {
              order_id: e
            },
            success: function (t) {
              console.log(t.data), "1" == t.data ? (wx.showToast({
                title: "删除成功",
                icon: "success",
                duration: 1e3
              }), setTimeout(function () {
                wx.redirectTo({
                  url: "order?status=3"
                });
              }, 1e3)) : wx.showToast({
                title: "请重试",
                icon: "loading",
                duration: 1e3
              });
            }
          }));
      }
    });
  },

  //提醒商家
  txsj: function (t) {
    console.log("提醒商家" + t.currentTarget.dataset.tel), wx.makePhoneCall({//拨打电话
      phoneNumber: t.currentTarget.dataset.tel
    });
  },


  //无用代码-------------------------
  sqtk: function (e) {
    console.log("申请退款" + e.currentTarget.dataset.id), wx.showModal({
      title: "提示",
      content: "申请退款么",
      success: function (t) {
        if (t.cancel) return !0;
        t.confirm && (wx.showLoading({
          title: "操作中"
        }), app.util.request({
          //url: "entry/wxapp/TkOrder",
          cachetime: "0",
          data: {
            order_id: e.currentTarget.dataset.id
          },
          success: function (t) {
            console.log(t.data), "1" == t.data ? (wx.showToast({
              title: "申请成功",
              icon: "success",
              duration: 1e3
            }), setTimeout(function () {
              wx.redirectTo({
                url: "order?status=5"
              });
            }, 1e3)) : wx.showToast({
              title: "请重试",
              icon: "loading",
              duration: 1e3
            });
          }
        }));
      }
    });
  },
  //无用代码---------------------------
  qrsh: function (t) {
    var e = t.currentTarget.dataset.id;
    console.log(e), wx.showModal({
      title: "提示",
      content: "是否确认已收到货？",
      cancelText: "否",
      confirmText: "是",
      success: function (t) {
        if (t.cancel) return !0;
        t.confirm && (wx.showLoading({
          title: "操作中"
        }), app.util.request({
          //url: "entry/wxapp/OkOrder",
          cachetime: "0",
          data: {
            order_id: e
          },
          success: function (t) {
            console.log(t.data), "1" == t.data ? (wx.showToast({
              title: "收货成功",
              icon: "success",
              duration: 1e3
            }), setTimeout(function () {
              wx.redirectTo({
                url: "order?status=4"
              });
            }, 1e3)) : wx.showToast({
              title: "请重试",
              icon: "loading",
              duration: 1e3
            });
          }
        }));
      }
    });
  },
  //无用代码---------------------------

  //-无用代码-----------------------------------------------
  orderQrcode: function (a) {
    var o = this, n = o.data.order_list, s = a.target.dataset.index;
    wx.showLoading({
      title: "正在加载",
      mask: !0
    }), o.data.order_list[s].offline_qrcode ? (o.setData({
      hide: 0,
      qrcode: o.data.order_list[s].offline_qrcode
    }), wx.hideLoading()) : e.request({
      url: t.order.get_qrcode,
      data: {
        order_no: n[s].order_no
      },
      success: function (t) {
        0 == t.code ? o.setData({
          hide: 0,
          qrcode: t.data.url
        }) : wx.showModal({
          title: "提示",
          content: t.msg
        });
      },
      complete: function () {
        wx.hideLoading();
      }
    });

  },

  hide: function (t) {
    this.setData({
      hide: 1
    });
  }
});
