
var qqmapsdk, app = getApp(), util = require("../../utils/util.js"), QQMapWX = require("../../utils/qqmap-wx-jssdk.js");

Page({
    data: {
     color: "#B22222",
      exchange_goods:!0,
      hb_active: !0,
      yhq_active: !0
    },
    
    onLoad: function(t) {
        app.setNavigationBarColor(this), 
        console.log(t);
        var o = this;
         app.util.request({
         url: "entry/wxapp/OrderInfo",
            //  wx.request({
            //  url:'http://192.168.10.4:7300/mock/5bc5de72363a0e050d79bce0/example/ddxq',
              //  url:'http://192.168.10.4:7300/mock/5bc5de72363a0e050d79bce0/example/ddfk',
            cachetime: "0",
            data: {
                order_id: t.oid
            },
            success: function(t) {
                console.log(t.data), 
                o.setData({
                    odinfo: t.data,
                    exchange_goods:0
                });
            }
        });
    },

    maketel: function(t) {
        var o = t.currentTarget.dataset.tel;
        wx.makePhoneCall({
            phoneNumber: o
        });
    },

    copyText: function(t) {
        var o = t.currentTarget.dataset.text;
        wx.setClipboardData({
            data: o,
            success: function() {
                wx.showToast({
                    title: "订单号码已复制"
                });
            }
        });
    },

    location: function() {
        var t = this.data.odinfo.store.coordinates.split(","), 
        o = this.data.odinfo.store;
        console.log(t), 
        wx.openLocation({
            latitude: parseFloat(t[0]),
            longitude: parseFloat(t[1]),
            address: o.address,
            name: o.name
        });
    },
    
  lxqs:function(t){
    var o = t.currentTarget.dataset.tel;
    console.log(o), wx.showModal({
      title: "13547845216",
      cancelText: "取消",
      confirmText: "继续呼叫",
    });
  },

  payment:function(){
    wx.navigateTo({
      url: 'fk?',
    })
  },

  })
 

