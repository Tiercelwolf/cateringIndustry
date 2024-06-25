var a = getApp(), 
util = require("../../utils/util.js");
//require(path)引用公共模块，公共代码抽离成为一个单独的 js 文件，作为一个模块,引入后就可以调用方法来实现修改数据格式。

Page({
    data: {
        carte: [ {
            img1: "../../img/personal/kefu.png",
            name: "客服与投诉",
            img2: "",
            margin: "margin_top",
            border: "border_bottom",
            bindtap: "customer"
        }, {
            img1: "../../img/personal/bangzhu.png",
            name: "帮助中心",
            img2: "",
            border: "border_bottom",
            bindtap: "help"
        } ],
        top: "-420"
    },
    wddd: function() {
        wx.navigateTo({
            url: "../wddd/order"
        });
    },
    wddz: function() {
        wx.navigateTo({
            url: "../wddz/xzdz"
        });
    },
    wdyy: function() {
        wx.navigateTo({
            url: "../reserve/order"
        });
    },

    wdhb:function(){
      wx.navigateTo({
        url: 'myhb',
      })
    },

    wdyhq: function () {
      wx.navigateTo({
        url: "myyhq"
      });
    },
    help: function() {
        wx.navigateTo({
            url: "bzzx"
        });
    },
    seller: function() {
        wx.navigateTo({
            url: "../sjzx/login"
        });
    },
    
    tzhy: function() {
        wx.navigateTo({
          url: "Information"
        });
    },
    supermember: function () {
      wx.navigateTo({
        url: "../hyk/hyk"
      })
    },
    mycollection: function () {
      wx.navigateTo({
        url: "../mycollection/collection",
      })
    },
    feedback: function () {
      wx.navigateTo({
        url: "../myfeedback/feedback",
      })
    },

    bindGetUserInfo: function(t) {
        console.log(t), "getUserInfo:ok" == t.detail.errMsg && (this.setData({
            hydl: !1
        }), this.changeData());
    },

    changeData: function() {
        var n = this;
        wx.getSetting({ //获取用户当前设置
            success: function(t) {
              //控制台打印,scope.userInfo:true
              console.log(t.authSetting), t.authSetting["scope.userInfo"] ? wx.getUserInfo({//无须用户授权的情况下，批量获取用户信息。该接口只在开放数据域下可用
                    //接口调用成功的回调函数
                    success: function(t) {  
                        console.log(t),
                        a.util.request({
                        url: "entry/wxapp/login",
                          //用户登录信息
                          // wx.request({
                          // url: 'http://192.168.10.4:7300/mock/5b782535bfe92705006efea3/wxapp/login', 
                          //url:'http://192.168.10.4:7300/mock/5b997ec11bb1360514d591e2/example/login1',//自编测试，平步青云 头像
                            cachetime: "0",
                            data: {//前台送给上面URL的数据
                                openid: getApp().getOpenId,
                                img: t.userInfo.avatarUrl,
                                name: t.userInfo.nickName
                            },
                            header: {
                                "content-type": "application/json"
                            },
                            /**返回数据格式 */
                            dataType: "json", 
                            /**接口调用成功的回调函数 */
                            success: function(t) {
                              console.log("用户信息",t);
                              console.log("我想看看这个openId==============",getApp().getOpenId);
                            }
                        });
                        var e = t.userInfo;
                        console.log(e), n.setData({
                            avatarUrl: e.avatarUrl,
                            nickName: e.nickName /**wx.getUserInfo接口 */
                        });
                    }
                }) : (console.log("未授权过"), n.setData({
                    hydl: !0 //非0为真
                }));
            }
        });
    },

    //onLoad-页面加载(一个生命周期函数)
    onLoad: function(t) {
        a.setNavigationBarColor(this), //a.setNavigationBarColor(this)当前导航栏颜色
        a.pageOnLoad(this),//pageonlad就是页面下面到的导航栏
        this.changeData();//执行page的changeData()函数
        var n = this, //this赋值给n,n就是page实例
        e = wx.getStorageSync("users").id;//wx.getStorageSync存储、调取数据,得到本地缓存，将id赋值给e
        console.log(e),//控制台输出e，e=id,输出的id是8242// 
 
        a.util.request({   
        url: "entry/wxapp/MyCoupons",
        // wx.request({
        //   url: 'http://192.168.10.4:7300/mock/5b782535bfe92705006efea3/wxapp/Mycoupons',//商家优惠   “优惠”数据
          // url:'http://192.168.10.4:7300/mock/5b997ec11bb1360514d591e2/example/ooo',//自编测试，可删
           
            cachetime: "0",
            data: {//送给后台的数据
               user_id: e
            },
            //接口调用成功的回调函数
            success: function(t) {
                console.log(t.data), 
                n.setData({
                    yhnum: t.data.length,//后台返回过来的
                });
            }
        }),
        
        a.util.request({
        url: "entry/wxapp/system",
        // wx.request({
        //   url: 'http://192.168.10.4:7300/mock/5b782535bfe92705006efea3/wxapp/system',//宁夏强三特色美食，sjzx/login.js中
            
            cachetime: "0",
            success: function(t) {
                console.log(t), n.setData({
                    system: t.data  //此数据在页面中未使用
                });
            }
        }), 
        wx.getSystemInfo({//wx.getSystemInfo同步执行
            success: function(t) {
                console.log(t.model), console.log(t.pixelRatio), console.log(t.windowWidth), console.log(t.windowHeight), 
                console.log(t.language), console.log(t.version), console.log(t.platform), "android" != t.platform && n.setData({
                  //platform客户端平台
                    top: "-330"
                });
            }
        });
    },
  
    wallet: function(t) {
        wx.navigateTo({  //保留当前页面，跳转到wallet.wxml
            url: "../wallet/wallet"
        });
    },
    set_up: function(t) {
        wx.navigateTo({
            url: "set_up"
        });
    },
    receive: function(t) {
        wx.navigateTo({
            url: "receive"
        });
    },
    integral: function(t) {
        wx.navigateTo({
            url: "../integral/myintegral"
        });
    },
    sign_in: function(t) {
        wx.navigateTo({
            url: "rankings"
        });
    },
    onReady: function() {},
    onShow: function() {
       
      var e = this,
      t = wx.getStorageSync("users").id,
      n = util.formatTime(new Date()).substring(0, 10).replace(/\//g, "-");
      console.log(n.toString()),//打印当前时间：年-月-日
        
      a.util.request({
       url: "entry/wxapp/UserInfo",
      //  wx.request({
          // url: 'http://192.168.10.4:7300/mock/5b782535bfe92705006efea3/wxapp/UserInfo',//“钱包、积分”数据
          // url: 'http://192.168.10.4:7300/mock/5b997ec11bb1360514d591e2/example/tel',  //自编测试，可删  加密电话
            cachetime: "0",
            data: {
                user_id: t,//控制台打印 t=8242
            },
            success: function(t) {
              console.log(t), 
              // ("" != t.data.dq_time || t.data.dq_time >= n.toString()) && (t.data.ishy = 1); /**= 赋值 */
                e.setData({
                  userInfo: t.data
                });
            }
        });
     
    },
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {}
});