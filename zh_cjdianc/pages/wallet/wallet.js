var app = getApp();

Page({
    data: {},
    onLoad: function(t) {
        wx.hideShareMenu({}), this.setData({
            system: getApp().xtxx
        }), app.setNavigationBarColor(this);
        var n = this, a = wx.getStorageSync("users").id;
        app.util.request({
            url: "entry/wxapp/UserInfo",
        // wx.request({
        //   url: 'http://192.168.10.4:7300/mock/5b782535bfe92705006efea3/wxapp/UserInfo',
            cachetime: "0",
            data: {
                user_id: a
            },
            success: function(t) {
                console.log(t), n.setData({
                    wallet: t.data.wallet
                });
            }
        });
    },
    cash: function(t) {
        wx.navigateTo({
            url: "walletadd"
        });
    },
    tradeinfo: function(t) {
        wx.navigateTo({
            url: "walletmx"
        });
    },
    onReady: function() {},
    onShow: function() {
        this.onLoad();
    },
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    onShareAppMessage: function() {}
});