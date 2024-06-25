var dsq, dsq1, a = getApp();

Page({
    data: {
        second: 3
    },
    onLoad: function(e) {
        var o = this;
        console.log(e);
        var n = decodeURIComponent(e.scene);//获取生成二维码时传入的scene
        if (console.log("scene", n), "undefined" != n) var t = n;
        if (null != e.userid) {
            console.log("转发获取到的userid:", e.userid);
            t = e.userid;
        }
        
        a.getUserInfo(function(e) {
          console.log("我是登录的界面-----------"),
            console.log(e), 
            console.log(t)
        }), a.setNavigationBarColor(this), 
        a.util.request({
            url: "entry/wxapp/system",
          // wx.request({
          //   url: 'http://192.168.10.4:7300/mock/5b782535bfe92705006efea3/wxapp/system',
            cachetime: "0",
            success: function(e) {
                console.log(e);
              // var n = Number(e.data.countdown);//Number(e.data.countdown)字符串5转化为数字5
                 var n = 5;
                dsq = setInterval(function() {//间隔执行的定时器
                    n--, o.setData({
                        second: n
                    });
                }, 1e3), //间隔1秒执行“,”前面的函数
                
                dsq1 = setTimeout(function() {//超时执行的定时器，只能执行一次
                    clearInterval(dsq), o.tggg();
                }, 1e3 * n);//执行了1e3 * n秒，清空定时器
                var t = e.data;
                o.setData({
                    xtxx: t,
                    // second: e.data.countdown
                  second:5
                }), getApp().xtxx1 = t, 
                // wx.setNavigationBarTitle({
                //     title: e.data.url_name
                // }), 
                a.util.request({
                    url: "entry/wxapp/ad",
                  // wx.request({
                  // url: 'http://192.168.10.4:7300/mock/5b782535bfe92705006efea3/wxapp/ad',
                    cachetime: "0",
                    data: {
                        type: "2"
                    },
                    success: function(e) {
                        console.log(e), 0 == e.data.length && (clearInterval(dsq), clearTimeout(dsq1), setTimeout                             (function() {
                            "1" == t.model && wx.reLaunch({
                                url: "/zh_cjdianc/pages/index/index"
                            }), "2" == t.model && (getApp().sjid = t.default_store, wx.reLaunch({
                                url: "/zh_cjdianc/pages/seller/index"
                            })), "3" == t.model && wx.reLaunch({
                                url: "/zh_cjdianc/pages/Liar/Liar"
                            }), "4" == t.model && (getApp().sjid = t.default_store, wx.reLaunch({
                                url: "/zh_cjdianc/pages/seller/indextakeout"
                            }));
                        }, 1e3)), o.setData({
                            kpggimg: e.data
                        });
                    }
                });
            }
        });
    },
    tggg: function() {
        clearInterval(dsq), clearTimeout(dsq1);
        wx.reLaunch({
          url: '/zh_cjdianc/pages/seller/index',
        })
        // var e = this.data.xtxx;
        // console.log(e), "1" == e.model && wx.reLaunch({
        //     url: "/zh_cjdianc/pages/index/index"
        // }), "2" == e.model && (getApp().sjid = e.default_store, wx.reLaunch({
        //     url: "/zh_cjdianc/pages/seller/index"
        // })), "3" == e.model && wx.reLaunch({
        //     url: "/zh_cjdianc/pages/Liar/Liar"
        // }), "4" == e.model && (getApp().sjid = e.default_store, wx.reLaunch({
        //     url: "/zh_cjdianc/pages/seller/indextakeout"
        // }));
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    onShareAppMessage: function() {}
});