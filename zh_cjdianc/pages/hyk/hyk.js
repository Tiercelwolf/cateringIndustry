var app = getApp(), util = require("../../utils/util.js");

Page({
    data: {
        Coupons: [ {
            reduce: "5",
            state: "1"
        }, {
            reduce: "8.8",
            state: "2"
        }, {
            reduce: "5",
            state: "1"
        }, {
            reduce: "8.8",
            state: "2"
        }, {
            reduce: "5",
            state: "1"
        } ],
        fwxy: !0,
        xymc: "会员特权说明",
        xynr: ""
    },
    lookck: function() {
        wx.navigateTo({
            url: "../car/xydtl?title=会员特权说明"
        });
    },

    rankrule: function () {
      wx.navigateTo({
        url: "rankrule",
      })
    },

    onLoad: function(t) {
        app.setNavigationBarColor(this);
        var r = this,
        e = wx.getStorageSync("users").id;
    },
    onReady: function() {},
    onShow: function() {
        var e = this, 
        t = wx.getStorageSync("users").id, 
        a = util.formatTime(new Date()).substring(0, 10).replace(/\//g, "-");
        console.log(a.toString()), 
        app.util.request({
          url: "entry/wxapp/UserInfo",//本路径，("" == t.data.dq_time || t.data.dq_time < a.toString()) 这两个条件都为假，所以显示
          // wx.request({
            // url: 'http://192.168.10.4:7300/mock/5b782535bfe92705006efea3/wxapp/UserInfo',
            // url: "http://192.168.10.4:7300/mock/5b997ec11bb1360514d591e2/example/usergold",//自编测试
            cachetime: "0",
            data: {
                user_id: t
            },
            success: function(t) {
                console.log(t), ("" == t.data.dq_time || t.data.dq_time < a.toString()) && (t.data.ishy = 2), 
                //ishy在UserInfo没有，t.data.ishy 在 t.data 中新增加一个属性ishy
                e.setData({
                    userInfo: t.data,
                    lxr: t.data.user_name,
                    tel: t.data.user_tel,
                    integral: t.data.total_score
                });
        
                // 会员
                var gol = 1000, pla = 2000, dia = 3000;
                var member;
                console.log("------------------------")
                console.log("----用户的积分----",e.data.integral)
                console.log("---what is this?---",gol - e.data.integral)
                if (e.data.integral >= dia) {
                  e.setData({
                    output: "恭喜您成为金卡会员",
                    member: "金卡"
                  })
                } else if (e.data.integral >= pla && e.data.integral < dia) {
                  e.setData({
                    output: "再获得" + parseFloat(dia - e.data.integral) + "积分升级为金卡会员",
                    member: "银卡"
                  })
                } else if (e.data.integral >= gol && e.data.integral < pla) {
                  e.setData({
                    output: "再获得" + parseFloat(pla - e.data.integral) + "积分升级为银卡会员",
                    member: "铜卡"
                  })
                } else {
                  e.setData({
                    output: "再获得" + parseFloat(gol - e.data.integral) + "积分升级为铜卡会员",
                    member: "普通"
                  })
                };

            }
        });
},
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {}
});