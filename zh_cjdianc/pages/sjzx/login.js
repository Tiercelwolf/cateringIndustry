var app = getApp();

Page({
    data: {
        disabled: !0,//true
        zh: "",
        mm: "",
        logintext: "登录",
        werchat: !1 //false
    },
    tel: function() {
        wx.makePhoneCall({
            phoneNumber: this.data.xtxx.tel
        });
    },
    onLoad: function(t) {
        app.setNavigationBarColor(this);
        var o = this;
        console.log(this), 
        app.util.request({
            url: "entry/wxapp/system",

        //  账号密码登录上面，“强三特色美食”
          // wx.request({                  
          //    url: 'http://192.168.10.4:7300/mock/5b782535bfe92705006efea3/wxapp/system',
            //url:'http://192.168.10.4:7300/mock/5b997ec11bb1360514d591e2/example/first',//自编测试，可删
            cachetime: "0",
            success: function(t) {
                console.log(t.data), o.setData({
                    xtxx: t.data
                });
            }
        });
    },
    name: function(t) {
        console.log(t), this.setData({
            name: t.detail.value
        });
    },
    password: function(t) {
        console.log(t), this.setData({
            password: t.detail.value
        });
    },
    sign: function(t) {
        console.log(this.data), wx.showLoading({
            title: "正在提交",
            mask: !0
        }), 
        // app.util.request({
        //     url: "entry/wxapp/StoreLogin",
            wx.request({
            url: 'http://192.168.10.4:7300/mock/5b782535bfe92705006efea3/wxapp/storelogin',
            cachetime: "0",
            data: {
                user: this.data.name,
                password: this.data.password
            },
            success: function(t) {
                console.log(t), null != t.data.storeid ? (wx.setStorageSync("sjdsjid", t.data.storeid), 
                //控制台输出t.data~是storeid:53
                wx.redirectTo({
                    url: "wmdd"
                })) : wx.showModal({
                    title: "提示",
                    content: t.data
                });
            }
        });
    },
    weixin: function(t) {
        var o = wx.getStorageSync("users").id;
        console.log(o), wx.showModal({
            title: "提示",
            content: "确定使用此微信号绑定的操作员身份登录吗？",
            success: function(t) {
                t.confirm ? (console.log("用户点击确定"), app.util.request({
                    //url: "entry/wxapp/StoreWxLogin",
                    cachetime: "0",
                    data: {
                        user_id: o
                    },
                    success: function(t) {
                        console.log(t), null != t.data.id ? (wx.setStorageSync("sjdsjid", t.data.id), wx.redirectTo({
                            url: "wmdd"
                        })) : wx.showModal({
                            title: "提示",
                            content: t.data
                        });
                    }
                })) : t.cancel && console.log("用户点击取消");
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