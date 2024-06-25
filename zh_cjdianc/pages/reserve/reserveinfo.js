var qqmapsdk, 
app = getApp(), 
util = require("../../utils/util.js"), 
QQMapWX = require("../../utils/qqmap-wx-jssdk.js");

Page({
    data: {
        color: "#34aaff"
    },
    onLoad: function(t) {
        app.setNavigationBarColor(this), 
        console.log("=========t是什么================",t);
        var o = this;
        app.util.request({
          url: "entry/wxapp/makeOrderInfo",
          // wx.request({
            // url: 'http://192.168.10.4:7300/mock/5b782535bfe92705006efea3/wxapp/orderinfo' ,
            // url:"http://192.168.10.4:7300/mock/5bc5de72363a0e050d79bce0/example/appointment",
            cachetime: "0",
            data: {
                order_id: t.oid
            },
            success: function(t) {
                console.log("======t.data是什么=======",t.data), 
                o.setData({
                    odinfo: t.data
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
                    title: "已复制"
                });
            }
        });
    },
    location: function() {
        var t = this.data.odinfo.store.coordinates.split(","), o = this.data.odinfo.store;
        console.log(t), wx.openLocation({
            latitude: parseFloat(t[0]),
            longitude: parseFloat(t[1]),
            address: o.address,
            name: o.name
        });
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    onShareAppMessage: function() {}
});