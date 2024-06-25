var app = getApp();

Page({
    data: {
        jrdd: "0",
        jrcj: "0"
    },
    onLoad: function(t) {
        var a = this, o = wx.getStorageSync("sjdsjid");
        console.log(o, wx.getStorageSync("system")), this.setData({
            wm_name: wx.getStorageSync("system").wm_name || "外卖"
        }), app.setNavigationBarColor(this), app.sjdpageOnLoad(this), 
        app.util.request({
            url: "entry/wxapp/StoreStatistics",
            // wx.request({
            // url: 'http://192.168.10.4:7300/mock/5b782535bfe92705006efea3/wxapp/StoreStatistics',
            cachetime: "0",
            data: {
                store_id: o
            },
            success: function(t) {
                console.log(t.data), a.setData({
                    wmdd: t.data
                });
            }
        });
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {}
});