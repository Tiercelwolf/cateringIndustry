var qqmapsdk, app = getApp(), util = require("../../utils/util.js"), QQMapWX = require("../../utils/qqmap-wx-jssdk.js");

Page({
    data: {
      color: "#34aaff",
    },

    //确认提货
    qrth:function(t){
      var e = this;
      var oid = wx.getStorageSync("oid");
      console.log("------orderid------",oid)
      wx.showModal({
        title: "提示",
        content: "是否确认提货？",
        cancelText: "否",
        confirmText: "是",
        success: function (t) {
          if (t.cancel) return !0;
          t.confirm && (wx.showLoading({
            title: "操作中",
            mask: !0
          }),
            app.util.request({
              url: "entry/wxapp/thOrder",
              cachetime: "0",
              data: {
                order_id: oid
              },
              success: function (t) {
                console.log(t.data), 
                "1" == t.data ? (wx.showToast({
                  title: "提货成功",
                  icon: "success",
                  duration: 1e3
                }), setTimeout(function () {
                  wx.redirectTo({
                    url: "wmdd?status=4"
                  })
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

    onLoad: function(t) {
      app.setNavigationBarColor(this), 
      console.log("------t-------",t);
      var oid = t.oid;
      wx.setStorageSync("oid", oid)
      var a = this;
      app.util.request({
        url: "entry/wxapp/OrderInfo",
        // wx.request({
        //   url: 'http://192.168.10.4:7300/mock/5b782535bfe92705006efea3/wxapp/orderinfo',
        cachetime: "0",
        data: {
          order_id: t.oid
        },
        success: function(t) {
          console.log("--核销成功的数据--", t.data)
          a.setData({
            odinfo : t.data
          });
        }
      });
    },
    
    maketel: function(t) {
        var a = t.currentTarget.dataset.tel;
        wx.makePhoneCall({
            phoneNumber: a
        });
    },

    //复制订单编号
    copyText: function(t) {
        var a = t.currentTarget.dataset.text;
        wx.setClipboardData({
            data: a,
            success: function() {
                wx.showToast({
                    title: "已复制"
                });
            }
        });
    },
    location: function(t) {
        var a = t.currentTarget.dataset.lat, 
        e = t.currentTarget.dataset.lng, 
        o = t.currentTarget.dataset.address;
        console.log(a, e), 
        wx.openLocation({
            latitude: parseFloat(a),
            longitude: parseFloat(e),
            address: o,
            name: "位置"
        });
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {}
});