var qqmapsdk, app = getApp(), QQMapWX = require("../../utils/qqmap-wx-jssdk.js");

Page({
    data: {
        name: "",
        mobile: "",
        detail: "",
        region: [],
        items: [ {
            name: "先生",
            value: 1,
            checked: !0  //true
        }, {
            name: "女士",
            value: 2
        } ]
    },
    onLoad: function(t) {
        app.setNavigationBarColor(this); 
      var a = this;
        app.util.request({
        url: "entry/wxapp/system",
        // wx.request({
        //     url: 'http://192.168.10.4:7300/mock/5b782535bfe92705006efea3/wxapp/system',        
            cachetime: "0",
            success: function(e) {
              console.log(e.data.map_key),
                a.setData({
                    System: e.data,
                    bjid: t.bjid
                }),                  
                qqmapsdk = new QQMapWX({
                    key: e.data.map_key
                  }), 
                console.log("编辑id：", t.bjid),  
                app.util.request({
                url : "entry/wxapp/MyAddressInfo",
                  // wx.request({
                  // url: 'http://192.168.10.4:7300/mock/5b782535bfe92705006efea3/wxapp/myaddresss',                
                    cachetime: "0",
                    data: {
                        id: t.bjid
                    },
                    success: function (e) {
                      console.log("编辑的id", t.bjid),
                      console.log(e.data)
                      a.setData({
                        name: e.data.user_name,
                        mobile: e.data.tel,
                        detail: e.data.address,
                        region: e.data.area
                      });
                      console.log("--------------------第一步结束---------------------")
                    },
                })
            }
        });
    },
    bindRegionChange: function(e) {
        console.log("picker发送选择改变，携带值为", e.detail.value), this.setData({
            region: e.detail.value
        });
    },
    dingwei: function(e) {
        console.log(e);
        var a = this;
        wx.chooseLocation({
            success: function(e) {
                console.log(e);
                var t = e.address.indexOf("区");
                console.log(e.address.substring(t + 1) + e.name), a.setData({
                    detail: e.address.substring(t + 1) + e.name
                });
            },
            fail: function() {
                wx.getSetting({
                    success: function(e) {
                        console.log(e), e.authSetting["scope.address"] ? console.log("取消") : wx.showModal({
                            title: "提示",
                            content: "您拒绝了获取收货地址授权，部分功能无法使用,点击确定重新获取授权。",
                            showCancel: !1,
                            success: function(e) {
                                e.confirm && wx.openSetting({
                                    success: function(e) {
                                        e.authSetting["scope.address"] && a.dingwei();
                                    },
                                    fail: function(e) {}
                                });
                            }
                        });
                    }
                });
            }
        });
    },
    formSubmit: function(e) {
        console.log("form发生了submit事件，携带数据为：", e.detail.value);
        var o = wx.getStorageSync("users").id, 
        s = e.detail.value.name, 
        n = e.detail.value.radiogroup, 
        i = e.detail.value.mobile, 
        l = this.data.region.toString(), 
        c = e.detail.value.detail, 
        d = this.data.bjid, 
          t = this.data.region + c;
        console.log("============ooooooooooo",o, s, i, l, c, d, t,n);
        var a = "", u = !0;
        "" == s ? a = "请填写收货人！" : "" == i ? a = "请填写手机号！" : /^0?(13[0-9]|15[012356789]|17[013678]|18[0-9]|14[57])[0-9]{8}$/.test(i) && 11 == i.length ? "" == l ? a = "请选择所在地区！" : "" == c ? a = "请填写详细地址！" : (u = !1, 
        wx.showLoading({
            title: "保存中...",
            mask: !0
        }), 
        qqmapsdk.geocoder({
            address: t,
            success: function(e) {
                if (console.log(e), "0" == e.status) {
                    var t = e.result.location.lat, a = e.result.location.lng;
                    null == d ? app.util.request({
                        url: "entry/wxapp/AddAddress", //手动添加
                        cachetime: "0",
                        data: {
                            address: c,
                            area: l,
                            user_name: s,
                            user_id: o,
                            tel: i,
                            sex: n,
                            lat: t,
                            lng: a
                        },
                       
                        success: function(e) {
                            if (console.log(e.data), "1" == e.data) {
                                wx.showToast({
                                    title: "保存成功1（手动）", //手动添加
                                    duration: 1e3  //持续时间：1秒钟
                                });
                                var t = getCurrentPages();
                                if (console.log(t), 1 < t.length && "zh_cjdianc/pages/takeout/takeoutform" == t[t.length - 3].route) t[t.length - 3].countpsf();
                                setTimeout(function() {
                                    wx.navigateBack({
                                        delta: 1 //返回的页面数
                                    });
                                }, 1e3);
                            }
                        }
                       
                    }) : app.util.request({
                        url: "entry/wxapp/UpdAddress",  //编辑
                        cachetime: "0",
                        data: {
                            address: c,
                            area: l,
                            user_name: s,
                            id: d,
                            tel: i,
                            sex: n,
                            lat: t,
                            lng: a
                        },
                        success: function(e) {
                            console.log(e.data), "1" == e.data && (wx.showToast({
                                title: "保存成功2（编辑）",
                                duration: 1e3
                            }), setTimeout(function() {
                                wx.navigateBack({
                                    delta: 1
                                });
                            }, 1e3));
                        }
                         
                    }); console.log(n)
                } else wx.showModal({
                    title: "提示",
                    content: "网络错误！"
                });
            },
            fail: function(e) {
                console.log(e);
            },
            complete: function(e) {
                console.log(e);
            }
        })) : a = "手机号错误！", 1 == u && wx.showModal({
            title: "提示",
            content: a
        });
    },
    onReady: function() {},
    onShow: function() {}
});