function _defineProperty(t, e, a) {
  return e in t ? Object.defineProperty(t, e, {
    value: a,
    enumerable: !0,
    configurable: !0,
    writable: !0
  }) : t[e] = a, t;
}

var util = require("../../utils/util.js");

var app = getApp();
var num = 15 * 60
var strH = ''
var strM = ''
var strS = ''
var timer = ''

Page(_defineProperty({
  data: {
    timeText: '',  
    paypopup: '',
    color: "#34aaff",
    status: '',
    order_list: [],
    show_no_data_tip: !1,
    isloading: !0,
    hide: 1,
    qrcode: "",
    pagenum: 0,
    storelist: [],
    mygd: !1,
    jzgd: !0,
    jzwb: !1,
    items: [
      { name: 'caidan', value: '', }
    ],
    hidetop: !0,
    idx: 0
  },


  onReady: function () {
    this.paypopup = this.selectComponent("#paypopup");
  },
  zeroFill(str, n) {
    if (str.length < n) {
      str = '0' + str
    }
    return str
  },


  addDish: function (t) {
    var order_id = t.currentTarget.dataset.id,
      order_type = t.currentTarget.dataset.type;
    console.log("-----------订单ID--------", order_id)
    console.log("-----------订单类型 order_type--------", order_type)
    wx.navigateTo({
      url: '../seller/showGoods?order_id=' + order_id + "&order_type=" + order_type + "&preinfo=1"
    })
  },

  goTop: function (e) { 
    this.data.mygd = !1,
      this.data.jzgd = !0,
      this.data.pagenum = 0,
      this.reLoad()
  },

  selectitem: function (t) {
    var idx = t.currentTarget.dataset.index
    console.log("===idx  选择顶部  五个  下标===", idx)
    this.data.mygd = !1,
      this.data.jzgd = !0,
      this.data.pagenum = 0,
      this.data.status = idx,
      this.hidetop =  !0,
    this.reLoad();
  },

  onLoad: function (t) {
    var a = this;
    app.setNavigationBarColor(a);
    getApp().xtxx1 && app.pageOnLoad(a),
      this.data.status = t.status || 1;
      this.reLoad();
  },

  reLoad: function () {                                        
    var t, f,
      a = this,
      e = this.data.status || 1,
      o = wx.getStorageSync("users").id,
      tk_reason = wx.getStorageSync("tkReason");
    var d = this.data.order_type,
      n = this.data.pagenum;
    

    1 == e && (f = "1", e = "1", t = "1"),
      "2" == e && (f = "2", e = "2", t = ""),
      4 == e && (f = "3,4", e = "3", t = ""),
      "7" == e && (f = "6,7,8,9", e = "7", t = "4"),
      "11" == e && (f = "5,10,11", e = "11", t = "3"),
      console.log("-------------", e, t, o),
      console.log("11111111111111111111111111111111", this.data.status)
    app.util.request({
      url: "entry/wxapp/MyOrder",
      // wx.request({
      //   //url:'http://192.168.10.4:7300/mock/5b782535bfe92705006efea3/wxapp/Myorder/1',
      //   // url: 'http://192.168.10.4:7300/mock/5b782535bfe92705006efea3/wxapp/Myorder/' + e,
      //   url: 'http://192.168.10.4:7300/mock/5bc5de72363a0e050d79bce0/example/more/' + e,

      cachetime: "0",   
      data: {
        state: f,
        user_id: o,
        page: n,
        pagesize: 10
      },

      success: function (t) {
        (a.data.pagenum == 0 && t.data.length == 0) ? a.data.jzwb = !1 : a.data.jzwb=!0;
        a.data.pagenum > 0 ? a.data.hidetop=!1 : a.data.hidetop=!0
        console.log("分页返回的列表数据", t.data),

          t.data.length < 10 && a.setData({
            mygd: !0,
            jzwb: a.data.jzwb,
          }); 

        var order = ''
        e = function (t) {                                  
          for (var e = [], a = 0; a < t.length; a++)
          { -1 == e.indexOf(t[a]) && Object.keys(t[a]).length && e.push(t[a]);
            if(t[a].order.order_type == '1' || t[a].order.order_type == '2')  order=t[a];
          }
          return e;
        }((t.data));
        console.log("---order_list  e---", e)

        for (var i = 0; i < e.length; i++) {
          for (var j = i; j < e.length; j++) {
            if (new Date(e[i].order.jd_time).getTime() < new Date(e[j].order.jd_time).getTime()) {
              var temp = e[i];
              e[i] = e[j];
              e[j] = temp;
            }
          }
        }
        console.log("----订单按照时间  由大到小 --排序之后的数据------",e)
         
        a.setData({
          hidetop: a.data.hidetop,
          tk_reason: tk_reason,
          order_list: e,
          storelist: e,
          status: a.data.status,
          isloading: !1
        })
        console.log("=====this=====", e.length);
        
        if (a.data.status == 1 && order && (order.order.order_type == '1' || order.order.order_type == '2') && e.length > 0) {
          num = order.order.reseconds / 1

          if (timer) clearInterval(timer)
          timer = setInterval(function () {
            strM = a.zeroFill('' + parseInt(num / 60 % 24), 2)
            strS = a.zeroFill('' + parseInt(num % 60), 2)

            a.setData({
              timeText: strM + ':' + strS
            })
            if (num <= 0) {
              clearInterval(timer);
              a.cancelOrder(order.order.id, o)
              a.reLoad();
            }
            num--
          }, 1000)
        } else {
          clearInterval(timer)
        }
      }
    });

  },
  onReachBottom: function () {
    console.log("上拉加载", this.data.pagenum)
    !this.data.mygd && this.data.jzgd && (this.setData({
      jzgd: !1
    }), this.data.pagenum++ , this.reLoad());
  },
  onPullDownRefresh: function () {
    console.log('下拉加载', this.data.pagenum);
    (this.data.pagenum !== 0) && this.data.jzgd && (this.setData({
      jzgd: !1,
      mygd: !1
    }), this.data.pagenum = (this.data.pagenum > 0) ? (this.data.pagenum - 1) : 0, this.reLoad());
  },

  clearTimeInterval: function (that) {
    var timeText = that.data.timeText;
    clearInterval(timeText)
  },

  onUnload: function () {
    var that = this;
    clearInterval(that.data.timeText)
  },

  hxqh: function (t) {
    var e = this,
      c = wx.getStorageSync("users").id,
      a = t.currentTarget.dataset.id,
      o = t.currentTarget.dataset.sjid;
    console.log(a, o),
      wx.showLoading({
        title: "加载中",
        mask: !0
      }), app.util.request({
        url: "entry/wxapp/ZtCode",
        cachetime: "0",
        data: {
          store_id: o,
          order_id: a,
          user_id: c

        },
        success: function (t) {
          console.log(t.data), e.setData({
            hx_code: t.data,
            hide: 2
          });
        }
      });
  },

  transform: function (t) {
    var paymoney = t.currentTarget.dataset.money;
    var orderid = t.currentTarget.dataset.id;
    var index = t.currentTarget.dataset.index;
    var ordertype = t.currentTarget.dataset.ordertype;
    var a = this;    
    a.setData({     
      activeee: true,
      hidden: false,
      odpaymoney: paymoney,
      poporder_type: ordertype,
      poporderid: orderid,
    })
    this.paypopup = this.selectComponent("#paypopup");
    this.paypopup.showPaypopup();
    var userid = wx.getStorageSync("users").id;
    app.util.request({
      url: "entry/wxapp/wallectmoney",
      cachetime: "0",
      data: {
        user_id: userid
      },
      success: function (n) {
        a.setData({
          Wallectmoney: n.data.wallectmoney,
          idx: index
        })
        console.log("----------tttttttttttttttttt--------", n.data.wallectmoney);
      },
    })
  },
  transformhidden: function () {
    this.setData({
      activeee: false,
    })
    var page = this;
    setTimeout(function () {
      page.setData({
        hidden: true,
      })
    }, 500)
  },

  canceldd: function (t) {
    var e = t.currentTarget.dataset.id,
      userid = wx.getStorageSync("users").id;
    wx.showModal({
      title: "提示",
      content: "是否取消该订单？",
      cancelText: "否",
      confirmText: "是",
      success: function (t) {
        console.log("ttttttttttttttttttt", t)
        if (t.cancel) return !0;
        t.confirm && (wx.showLoading({
          title: "操作中"
        }),
          app.util.request({
            url: "entry/wxapp/CancelOrder",
            //   wx.request({
            // url: 'http://192.168.10.4:7300/mock/5bc5de72363a0e050d79bce0/example/cancel',//1                   
            cachetime: "0",
            data: {
              order_id: e,
              user_id: userid
            },
            success: function (t) {
              console.log("---------t.data--------", t.data),
                "1" == t.data ? (wx.showToast({
                  title: "取消成功",
                  icon: "success",
                  duration: 1e3
                }),
                  setTimeout(function () {
                    wx.redirectTo({
                      url: "order?status=7"
                    });
                  },
                    1e3)
                ) : wx.showToast({
                  title: "请重试",
                  icon: "loading",
                  duration: 1e3
                });
            }
          }))
      }

    })
  },

  cancelOrder: function (orderid, userid) {
    app.util.request({
      url: "entry/wxapp/CancelOrder",
      cachetime: "0",
      data: {
        order_id: orderid,
        user_id: userid
      },
      success: function (t) {
        console.log("超时取消订单")
      },
      fail: function (o) {
        console.log("超时取消订单失败")
      }
    })

  },

  orderRevoke: function (t) {
    var page = this;
    var e = t.currentTarget.dataset.id;
    console.log("=====删除按钮中e的值======", e), wx.showModal({
      title: "提示",
      content: "是否删除该订单？",
      cancelText: "否",
      confirmText: "是",
      success: function (t) {
        console.log("======删除按钮中t的值=======", t);
        if (t.cancel) return !0;
        t.confirm && (wx.showLoading({
          title: "操作中"
        }),
          console.log("======删除按钮中t的值======="),
          app.util.request({
            url: "entry/wxapp/DelOrder",
            //    wx.request({
            //  url: 'http://192.168.10.4:7300/mock/5b782535bfe92705006efea3/wxapp/delorder',//1
            cachetime: "0",
            data: {
              order_id: e
            },
            success: function (t) {
              console.log("=======删除按钮中t.data的值==========", t.data),
                "1" == t.data ? (wx.showToast({
                  title: "删除成功",
                  icon: "success",
                  duration: 1e3
                })
                ) : wx.showToast({
                  title: "请重试",
                  icon: "loading",
                  duration: 1e3
                });
              wx.hideLoading(
              )
              page.reLoad()
            }
          }));
      }
    });
  },

  tkjd: function (t) {
    console.log("====打印一下t是什么====",t)
    var c = t.currentTarget.dataset.id;
    console.log("=======", c)
    wx.setStorageSync("order_id", c);

   var lastrsn = t.currentTarget.dataset.lastrsn;
    wx.setStorageSync("lastrsn", lastrsn);

    wx.navigateTo({
      url: "tkjd?"
    });
  },

  txsj: function (t) {
    console.log("--------tell-------", t),
      console.log("提醒商家" + t.currentTarget.dataset.tel),
      wx.makePhoneCall({
        phoneNumber: t.currentTarget.dataset.tel
      });
  },

  sqtk: function (e) {
    var c = e.currentTarget.dataset.id;
    wx.setStorageSync("order_id", c);
    wx.navigateTo({
      url: "sqtk"
    });
  },

  orderQrcode: function (a) {
    var o = this,
      n = o.data.order_list,
      s = a.target.dataset.index;
    console.log("edwgdewuifhyd8isehfjbwedhdisnd" + s),
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
  }
}, "hide", function (t) {
  this.setData({
    hide: 1
  });
}));

