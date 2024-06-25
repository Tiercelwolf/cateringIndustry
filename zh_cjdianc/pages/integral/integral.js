var fakeData = require('../commons/monrydata.js');
var app = getApp();

Page({
    data: {
        slide: [ {
            logo: "http://opocfatra.bkt.clouddn.com/images/0/2017/10/tdJ70qw1fEfjfVJfFDD09570eqF28d.jpg"
        }, {
            logo: "http://opocfatra.bkt.clouddn.com/images/0/2017/10/k5JQwpBfpb0u8sNNy5l5bhlnrhl33W.jpg"
        }, {
            logo: "http://opocfatra.bkt.clouddn.com/images/0/2017/10/zUeEednDedmUkIUumN9XI6IXU91eko.jpg"
        } ],
        fenlei: [],
      scrollLeftValue: 0,
      isPickerShow: false,
        commodity: [],
    },
    
    //轮播功能暂时不实现--------------------------------------------------------------
    //轮播图片
    jumps: function(t) {
        var e = t.currentTarget.dataset.id, 
        a = t.currentTarget.dataset.name, 
        o = t.currentTarget.dataset.appid, 
        n = t.currentTarget.dataset.src, 
        r = t.currentTarget.dataset.wb_src, 
        c = t.currentTarget.dataset.type;
        console.log(e, a, o, n, r, c), 
        1 == c ? (console.log(n), wx.navigateTo({  //type为0，1 == c 为 false，所以执行冒号后面的表达式，也就是“2==c...”
            url: n
        })) : 2 == c ? (wx.setStorageSync("vr", r), wx.navigateTo({
            url: "../car/car"
          })) : 3 == c && wx.navigateToMiniProgram({  //wx.navigateToMiniProgram打开另一个小程序
            appId: o
        });
    },
    //轮播功能暂时不实现--------------------------------------------------------------

  autoScrollTopNav: function (idx) {
    if (idx <= 2) {
      this.data.scrollLeftValue = 0;
    } else {
      this.data.scrollLeftValue = (idx - 2) * 60;
    }
    this.setData({
      scrollLeftValue: this.data.scrollLeftValue
    })
  },

    onLoad: function(t) {
        app.setNavigationBarColor(this), wx.hideShareMenu({});
        var o = this;
        this.reLoad(),

        //轮播功能暂时不实现--------------------------------------------------------------
        //  app.util.request({
        //     url: "entry/wxapp/ad",
            wx.request({
            url: 'http://192.168.10.4:7300/mock/5b782535bfe92705006efea3/wxapp/ad',//页面未显示，轮播图片   

          // url:"http://192.168.10.4:7300/mock/5b997ec11bb1360514d591e2/example/followMe",//自编测试，可删
          // url: 'http://192.168.10.4:7300/mock/5b997ec11bb1360514d591e2/example/image',//自编测试，可删
            cachetime: "0",
            success: function(t) {
                console.log(t);
                for (var e = [], a = 0; a < t.data.length; a++) "6" == t.data[a].type && e.push(t.data[a]);
                console.log(e), o.setData({
                    lblist: e
                });
            }
        }), 
          //轮播功能暂时不实现--------------------------------------------------------------

        app.util.request({
            url: "entry/wxapp/Jftype",
          // wx.request({
          // url: 'http://192.168.10.4:7300/mock/5b782535bfe92705006efea3/wxapp/Jftype',
            cachetime: "0",
            success: function(t) {
                console.log("ttttttttttttttt",t), 
                o.setData({
                  fenlei: t.data  //商品分类：饮料、零食、玩具、优惠券、菜品、电器
                });
            }
        }), 
        app.util.request({
            url: "entry/wxapp/JfGoods",
        //  wx.request({
        //     url: 'http://192.168.10.4:7300/mock/5b782535bfe92705006efea3/wxapp/JfGoods',
            cachetime: "0",
            success: function(t) {
                console.log("uuuuuuuuuuuu",t), 
                o.setData({
                    commodity: t.data  //大家都在兑 -- 兑换的商品：布娃娃......
                });
            }
        });
    },
    reLoad: function() {
        var e = this, 
        t = wx.getStorageSync("users").id;
        app.util.request({
           url: "entry/wxapp/UserInfo",
        // wx.request({
        //   url: 'http://192.168.10.4:7300/mock/5b782535bfe92705006efea3/wxapp/UserInfo',
            cachetime: "0",
            data: {
                user_id: t
            },
            success: function(t) {
                console.log("=========",t.data), 
                e.setData({
                    integral: t.data.total_score  //获取积分，在“积分”后面
                });
            }
        });
    },
    
    interinfo: function(t) {
        console.log(t.currentTarget.id), 
        wx.navigateTo({
            url: "integralinfo/integralinfo?id=" + t.currentTarget.id
        });
    },

    cxfl: function(t) {
      console.log("=====t.currentTarget.id======",t.currentTarget.id)
      console.log("=====t.currentTarget.id======", t)
        var e = this;
        app.util.request({
            url: "entry/wxapp/JftypeGoods",
      // wx.request({
      //   url: 'http://192.168.10.4:7300/mock/5b782535bfe92705006efea3/wxapp/JftypeGoods',//狗币 
            cachetime: "0",
            data: {
                type_id: t.currentTarget.id
            },
            success: function(t) {
                console.log("tttttttttttt",t), 
                e.setData({
                    commodity: t.data
                });
            }
        });
    },
    onReady: function() {},
    onShow: function() {
        this.reLoad();
    },
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {
        this.onLoad(), wx.stopPullDownRefresh();
    },
    onReachBottom: function() {},
    onShareAppMessage: function() {}
});