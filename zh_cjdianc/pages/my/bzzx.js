var app = getApp();

Page({
    data: {
        list: []
    },
    kindToggle: function(t) {
        var e = t.currentTarget.id, n = this.data.list;
        console.log(e);
        for (var a = 0, o = n.length; a < o; ++a) n[a].open = a == e && !n[a].open;
        this.setData({
            list: n
        });
    },
    onLoad: function(t) {
        app.setNavigationBarColor(this);
        var e = this;
        console.log(this), 
        app.util.request({
           url: "entry/wxapp/GetHelp",
          //  wx.request({
          // url: 'http://192.168.10.4:7300/mock/5b782535bfe92705006efea3/wxapp/bzzx', //显示“[]”无数据
            cachetime: "0",
            success: function(t) {
                console.log(t.data), 
                e.setData({
                    list: t.data
                });
            }
        }), 
        app.util.request({
            url: "entry/wxapp/system",
          // wx.request({
          //   url: 'http://192.168.10.4:7300/mock/5b782535bfe92705006efea3/wxapp/system',
            cachetime: "0",
            success: function(t) {
                console.log(t.data), e.setData({
                    tel: t.data.tel
                });
            }
        });
    },

  order:function(){
    wx.navigateTo({
      url: '/zh_cjdianc/pages/my/problemdetails',
    })
  },

    tel: function() {
        wx.makePhoneCall({
            phoneNumber: this.data.tel
        });
    },
    tzxq: function(t) {
        console.log(t.currentTarget.dataset.answer), wx.setStorageSync("answer", t.currentTarget.dataset.answer), 
        wx.navigateTo({
            url: "kfzx"
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