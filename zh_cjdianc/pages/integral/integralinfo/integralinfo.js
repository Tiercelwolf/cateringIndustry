var app = getApp();

Page({
  data: {
    bomb: !0,//非0为true
    kpgg: !0,
    ssq: "",
    xxdz: "",
    djdh: !1,//!1为false,1为true
    qddh: !1
  },
  onLoad: function (t) {
    console.log("====t.id==商品的id==",t)
    var c = t.id;

    app.setNavigationBarColor(this),
      wx.hideShareMenu({});
    var e = wx.getStorageSync("users").id,
      a = this;
    app.util.request({
      url: "entry/wxapp/JfGoodsInfo",
      //  wx.request({
      //    url: 'http://192.168.10.4:7300/mock/5b782535bfe92705006efea3/wxapp/jfgoodsinfo',
      //  url:'http://192.168.10.4:7300/mock/5b997ec11bb1360514d591e2/example/cccccc', //测试type=2，邮寄
      cachetime: "0",
      data: {
        id: t.id
      },
      success: function (t) {
        console.log("商品信息--兑换商品的信息 --  t  ---",t), 
        console.log("商品信息  兑换商品的类型---type---",t.data[0].type)        
        a.setData({
          spinfo: t.data[0]
        }), wx.setNavigationBarTitle({  //wx.setNavigationBarTitle动态设置当前页面的标题
          title: t.data[0].name//获取到名字为“布娃娃”
        });
      }
    }),

      //未使用到此段代码--------------------------------
      app.util.request({
        url: "entry/wxapp/UserInfo",
        // wx.request({
        // url: 'http://192.168.10.4:7300/mock/5b782535bfe92705006efea3/wxapp/UserInfo',
        cachetime: "0",
        data: {
          user_id: e
        },
        success: function (t) {
          console.log(t), a.setData({
            integral: t.data.total_score
          });
        }
      }),

      //默认地址-------------------------------
      app.util.request({
        url: "entry/wxapp/MyDefaultAddress",
        // wx.request({
        //   url: 'http://192.168.10.4:7300/mock/5b782535bfe92705006efea3/wxapp/mydefaultaddress',
        cachetime: "0",
        data: {
          user_id: e
        },
        success: function (t) {
          console.log(t.data), t.data && a.setData({
            myaddress: t.data
          });
        }
      });
  },

  duihuan: function (t) {
    var type = t.currentTarget.dataset.type,//商品类型
      id = t.currentTarget.dataset.id;//商品id
    console.log("---- thing type 虚物 实物 类型 ----", type)

    //判断是否为虚物、实物
    if ("1" == type) {
      this.setData({
        bomb: !1
      });
    } else if ("2" == type) {
      wx.redirectTo({
        url: '/zh_cjdianc/pages/takeout/takeoutform?thingType=2' + '&id=' + id
      })
    } else {
      console.log("数据错误")
    }
  },
  cancel: function () {
    this.setData({                                           
      bomb: !0
    });
  },

  caomfirm: function () {
    var t = wx.getStorageSync("users").id,
      e = this.data.myaddress,
      a = this,
      o = a.data.spinfo.id,
      s = a.data.spinfo.money,
      n = a.data.spinfo.hb_money,
      i = Number(a.data.integral),
      d = a.data.spinfo.name,
      l = a.data.spinfo.img;

    if ("1" == a.data.spinfo.type) {
      // 虚物
      a.setData({
        bomb: !0//true
      });
      if (Number(s) > i) {
        wx.showModal({
          title: '虚物提示',
          content: '虚物您的积分不足以兑换此物品',
        })
      } else {
        a.setData({
          djdh: !0 //true
        });
        app.util.request({
          url: "entry/wxapp/Exchange",
          // wx.request({
          // url: 'http://192.168.10.4:7300/mock/5b782535bfe92705006efea3/wxapp/exchange',//1
          cachetime: "0",
          data: {
            user_id: t,
            good_id: o,
          },
          success: function (t) {
            console.log(t),
              1 == t.data
                ?
                (wx.showToast({
                  title: "虚物兑换成功"
                }),
                  setTimeout(function () {
                    wx.navigateBack({});
                  }, 1e3))
                :
                (wx.showToast({
                  title: "虚物请重试！",
                  icon: "loading"
                }), a.setData({
                  djdh: !1//false
                }));
          }
        })
      }

    } else if ("2" == a.data.spinfo.type) {
      // 实物
      var c = e.user_name, u = e.tel, r = e.area + e.address;
      a.setData({
        bomb: !0//true
      });
      if (Number(s) > i) {
        wx.showModal({
          title: '实物提示',
          content: '实物您的积分不足以兑换此物品',
        })
      } else {
        a.setData({
          djdh: !0 //true
        });
        if (JSON.stringify(e) == "{}") {
          wx.showModal({
            title: "实物提示",
            content: "实物请前往个人中心选择（或填写）默认收货地址",
            success: function (t) {
              t.confirm ? (console.log("用户点击确定"),
                wx.navigateTo({
                  url: "../../wddz/xzdz"
                })) : t.cancel && console.log("用户点击取消");
            }
          });
        } else {
          wx.showLoading({
            title: "实物提交中",
            mask: !0
          }),
            app.util.request({
              url: "entry/wxapp/Exchange",
              //wx.request({
              // url: 'http://192.168.10.4:7300/mock/5b782535bfe92705006efea3/wxapp/exchange',//1
              cachetime: "0",
              data: {
                user_id: t,
                good_id: o,
                user_name: c,
                user_tel: u,
                address: r,
              },
              success: function (t) {
                console.log("---$$$$$---", t),
                  1 == t.data ? (wx.showToast({
                    title: "实物兑换成功"
                  }), setTimeout(function () {
                    
                  }, 1e3)) : (wx.showToast({
                    title: "实物请重试！",
                    icon: "loading"
                  }), a.setData({
                    qddh: !1
                  }));
              }
            });
        }
      }

    } else {
      console.log("后台传出数据type错误！")
    }
  },
  ycgg: function () {
    this.setData({
      kpgg: !0
    });
  },
  dingwei: function (t) {
    console.log(t);
    var a = this;
    wx.chooseLocation({
      success: function (t) {
        console.log(t);
        var e = t.address.indexOf("区");
        console.log(t.address.substring(0, e + 1)), a.setData({
          location: t.latitude + "," + t.longitude,
          ssq: t.address.substring(0, e + 1),
          xxdz: t.address.substring(e + 1) + t.name
        });
      }
    });
  },
  formSubmit: function (t) {
    console.log("form发生了submit事件，携带数据为：", t.detail.value);
    var e = this,
      a = wx.getStorageSync("users").id,
      o = e.data.spinfo.id,
      s = e.data.spinfo.money,
      n = e.data.spinfo.name,
      i = e.data.spinfo.img,
      d = t.detail.value.lxr,
      l = t.detail.value.tel,
      c = (e.data.ssq,
        e.data.ssq + t.detail.value.grxxdz);
    console.log(a, o, s, d, l, c, n, i);
    var u = "", r = !0;
    "" == d ? u = "请填写联系人！" : "" == l ? u = "请填写联系电话！" : /^0?(13[0-9]|15[012356789]|17[013678]|18[0-9]|14[57])[0-9]{8}$/.test(l) && 11 == l.length ? "" == c ? u = "请选择位置！" : (r = !1,
      e.setData({
        qddh: !0
      }),
      app.util.request({
        url: "entry/wxapp/Exchange",
        //   wx.request({
        // url: 'http://192.168.10.4:7300/mock/5b782535bfe92705006efea3/wxapp/exchange',//1
        cachetime: "0",
        data: {
          user_id: a,
          good_id: o,
          integral: s,
          user_name: d,
          user_tel: l,
          address: c,
          type: 2,
          good_name: n,
          good_img: i
        },
        success: function (t) {
          console.log(t), 1 == t.data ? (wx.showToast({
            title: "兑换成功"
          }), setTimeout(function () {
            wx.navigateBack({});
          }, 1e3)) : (wx.showToast({
            title: "请重试！",
            icon: "loading"
          }), e.setData({
            qddh: !1
          }));
        }
      })) : u = "手机号错误", 1 == r && wx.showModal({
        title: "提示",
        content: u
      });
  },
  onReady: function () { },
  onShow: function () {
    var e = wx.getStorageSync("users").id,
      a = this;
    //默认地址-------------------------------
    app.util.request({
      url: "entry/wxapp/MyDefaultAddress",
      // wx.request({
      //   url: 'http://192.168.10.4:7300/mock/5b782535bfe92705006efea3/wxapp/mydefaultaddress',
      cachetime: "0",
      data: {
        user_id: e
      },
      success: function (t) {
        console.log("----------默认地址---2------------", t.data),
          t.data && a.setData({
            myaddress: t.data
          });
      }
    });
  },
  onHide: function () { },
  onUnload: function () { },
  onPullDownRefresh: function () { },
  onReachBottom: function () { },
  onShareAppMessage: function () { }
});
