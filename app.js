var _App;

function _defineProperty(o, e, a) {
    return e in o ? Object.defineProperty(o, e, {
        value: a,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : o[e] = a, o;
}

App((_defineProperty(_App = {
    onLaunch: function() {},
    onShow: function() {
        console.log(getCurrentPages());
    },
    onHide: function() {
        console.log(getCurrentPages());
    },
    onError: function(o) {
        console.log(o);
    },
    util: require("we7/resource/js/util.js"),

    
    //头部
    setNavigationBarColor: function(e) {
        var o = this.globalData.color;   //globalData可以随时在页面中读取和存储数据
        console.log(o, e), o && wx.setNavigationBarColor({
          frontColor: "#ffffff", //标题字体颜色（宁夏强三特色美食、订单列表、个人中心等等）前景颜色：包括按钮、标题、状态栏的颜色
          backgroundColor: o    //头部、按钮、标题、状态栏背景颜色
        }), e.setData({
            color: o
        });
        var a = this;
        o || 
        a.util.request({
            url: "entry/wxapp/system",
          // wx.request({
            // url: 'http://192.168.10.4:7300/mock/5b782535bfe92705006efea3/wxapp/system',
            // url:'http://192.168.10.4:7300/mock/5b997ec11bb1360514d591e2/example/Bodycolor',
          // url: 'http://192.168.10.4:7300/mock/5bc5de72363a0e050d79bce0/example/headcolor',
          // url:'http://192.168.10.4:7300/mock/5bc5de72363a0e050d79bce0/example/headcolor1',

            success: function(o) {
                console.log(o), 
                getApp().xtxx = o.data, 
                a.globalData.color = o.data.color, 
                a.setNavigationBarColor(e);
            }
        });
    },
    pageOnLoad: function(n) {
        var t = this;
        function l(o) {
        //console.log("我想看0" + o.constructor.name);//constructor构造器
          console.log( o);
            var e = !1, 
            a = n.route || n.__route__ || null;
            for (var t in o.navs) o.navs[t].url === "/" + a ? e = o.navs[t].active = !0 : o.navs[t].active = !1;
            e && n.setData({
                _navbar: o
            });
        }
        console.log("----setPageNavbar----"), 
        console.log(n);

        // t.util.request({
        //   url: "entry/wxapp/background_image",
          wx.request({
            url: 'http://192.168.10.4:7300/mock/5b997ec11bb1360514d591e2/example/background_image',
          success: function(t){
            console.log("-------t----背景图片---",t)
            wx.setStorageSync("backimage", t.data.background_image)
          }
        });
        var image = wx.getStorageSync("backimage");

        var i = {
            // background_image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABAQMAAAAl21bKAAAAA1BMVEX///+nxBvIAAAACklEQVQI12NgAAAAAgAB4iG8MwAAAABJRU5ErkJggg==",
          // background_image: "http://img.juimg.com/tuku/yulantu/140904/330712-140Z421535761.jpg",
            background_image: image,
            border_color: "rgba(0,0,0,.1)"
      }, o = t.globalData.navbar;//globalData全局数据
      //console.log('开始'),
      console.log(o),
      //console.log('结束'),
      o && l(o),   o || wx.request
      // t.util.request({
      //   url: "entry/wxapp/nav",
        wx.request({
        //   url: 'http://192.168.10.4:7300/mock/5b782535bfe92705006efea3/wxapp/nav',   
          url:'http://192.168.10.4:7300/mock/5bc5de72363a0e050d79bce0/example/Bottomnavigation',         
            success: function(o) {
                var e = getApp().xtxx1;
              //console.log("1234567" + e.model)
              
                if (console.log(o, e), 0 == o.data.length) {
                    if ("1" == e.model) var a = [ {
                        logo: "/zh_cjdianc/img/tabindexf.png",
                        logo2: "/zh_cjdianc/img/tabindex.png",
                        title: "首页",
                        title_color: "#34aaff",
                        title_color2: "#888",
                        url: "/zh_cjdianc/pages/index/index"
                    }, {
                        logo: "/zh_cjdianc/img/tabddf.png",
                        logo2: "/zh_cjdianc/img/tabdd.png",
                        title: "订单",
                        title_color: "#34aaff",
                        title_color2: "#888",
                        url: "/zh_cjdianc/pages/wddd/order"
                    }, {
                        logo: "/zh_cjdianc/img/tabmyf.png",
                        logo2: "/zh_cjdianc/img/tabmy.png",
                        title: "我的",
                        title_color: "#34aaff",
                        title_color2: "#888",
                        url: "/zh_cjdianc/pages/my/index"
                    } ];
                    if ("2" == e.model) a = [ {
                        logo: "/zh_cjdianc/img/tabindexf.png",
                        logo2: "/zh_cjdianc/img/tabindex.png",
                        title: "首页",
                        title_color: "#34aaff",
                        title_color2: "#888",
                        url: "/zh_cjdianc/pages/seller/index"
                    }, {
                        logo: "/zh_cjdianc/img/tabddf.png",
                        logo2: "/zh_cjdianc/img/tabdd.png",
                        title: "订单",
                        title_color: "#34aaff",
                        title_color2: "#888",
                        url: "/zh_cjdianc/pages/wddd/order"
                    }, {
                        logo: "/zh_cjdianc/img/tabmyf.png",
                        logo2: "/zh_cjdianc/img/tabmy.png",
                        title: "我的",
                        title_color: "#34aaff",
                        title_color2: "#888",
                        url: "/zh_cjdianc/pages/my/index"
                    } ];
                    if ("4" == e.model) a = [ {
                        logo: "/zh_cjdianc/img/tabindexf.png",
                        logo2: "/zh_cjdianc/img/tabindex.png",
                        title: "首页",
                        title_color: "#34aaff",
                        title_color2: "#888",
                        url: "/zh_cjdianc/pages/seller/indextakeout"
                    }, {
                        logo: "/zh_cjdianc/img/tabddf.png",
                        logo2: "/zh_cjdianc/img/tabdd.png",
                        title: "订单",
                        title_color: "#34aaff",
                        title_color2: "#888",
                        url: "/zh_cjdianc/pages/wddd/order"
                    }, {
                        logo: "/zh_cjdianc/img/tabmyf.png",
                        logo2: "/zh_cjdianc/img/tabmy.png",
                        title: "我的",
                        title_color: "#34aaff",
                        title_color2: "#888",
                        url: "/zh_cjdianc/pages/my/index"
                    } ];
                    i.navs = a, l(i), t.globalData.navbar = i;
                } else i.navs = o.data, l(i), t.globalData.navbar = i;
            }
        });
    },
    title: function(o) {
        if ("" == o) return !0;
        wx.showModal({
            title: "",
            content: o
        });
    },
    getUserInfo: function(e) {
        var a = this,
        o = this.globalData.userInfo;
        console.log("*&*&*&*&*&*&*&*&*&*&",e)
        console.log(o), o ? "function" == typeof e && (e(o),console.log("？？？？？？？？执行没？？？？？？？？？")) : wx.login({
//通过wx.login()来获取code，如果成功获取，那么返回code，然后调用wx.request()向服务端发起一个请求，即向登录api接口发送code，换取openid和session_key
            success: function(o) {
                wx.showLoading({
                    title: "正在登录",
                    mask: !0
                }), console.log(o.code), 
                a.util.request({
                   url: "entry/wxapp/Openid",
                  // wx.request({
                  // url: 'http://192.168.10.4:7300/mock/5b782535bfe92705006efea3/wxapp/openid', 
                    cachetime: "0",
                    data: {
                        code: o.code
                    },
                    header: {
                        "content-type": "application/json"
                    },
                    dataType: "json",
                    success: function(o) {
                        console.log("openid信息-----------------------------", o.data), getApp().getOpenId = o.data.openid, getApp().getSK = o.data.session_key, 
                        a.util.request({
                           url: "entry/wxapp/login",
                        // wx.request({
                        //   url: 'http://192.168.10.4:7300/mock/5b782535bfe92705006efea3/wxapp/login',
                            cachetime: "0",
                            data: {
                                openid: o.data.openid
                            },
                            header: {
                                "content-type": "application/json"
                            },
                            dataType: "json",
                            success: function(o) {
                                console.log("用户信息", o), getApp().getuniacid = o.data.uniacid, wx.setStorageSync("users", o.data), 
                                a.globalData.userInfo = o.data, "function" == typeof e && e(a.globalData.userInfo);
                            }
                        });
                    },
                    fail: function(o) {},
                    complete: function(o) {}
                });
            }
        });
    },
    sjdpageOnLoad: function(n) {
        var e = this;
        function a(o) {
            console.log(o);
            var e = !1, a = n.route || n.__route__ || null;
            for (var t in o.navs) o.navs[t].url === "/" + a ? e = o.navs[t].active = !0 : o.navs[t].active = !1;
            e && n.setData({
                _navbar: o
            });
        }
        console.log("----setPageNavbar----"), console.log(n);
        var t = {
            background_image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABAQMAAAAl21bKAAAAA1BMVEX///+nxBvIAAAACklEQVQI12NgAAAAAgAB4iG8MwAAAABJRU5ErkJggg==",
            border_color: "rgba(0,0,0,.1)"
        }, o = e.globalData.sjdnavbar;
        console.log(o), o && a(o), o || 
        //e.util.request({
            //url: "entry/wxapp/nav",
            wx.request({
              url: 'http://192.168.10.4:7300/mock/5b782535bfe92705006efea3/wxapp/nav',
            success: function(o) {
                console.log(o);
                t.navs = [{
                    logo: "/zh_cjdianc/img/tabindexf.png",
                    logo2: "/zh_cjdianc/img/tabindex.png",
                    title: "外卖订单",
                    title_color: "#34aaff",
                    title_color2: "#888",
                    url: "/zh_cjdianc/pages/sjzx/wmdd"
                }, {
                    logo: "/zh_cjdianc/img/tabddf.png",
                    logo2: "/zh_cjdianc/img/tabdd.png",
                    title: "数据统计",
                    title_color: "#34aaff",
                    title_color2: "#888",
                    url: "/zh_cjdianc/pages/sjzx/sjtj"
                }], a(t), e.globalData.sjdnavbar = t;
            }
        });
    },
    convertHtmlToText: function(o) {
        var e = "" + o;
        return e = (e = e.replace(/<p.*?>/gi, "\r\n")).replace(/<\/p>/gi, "\r\n", "  *  ");
    }
}, "util", require("we7/resource/js/util.js")), _defineProperty(_App, "tabBar", {
    color: "#123",
    selectedColor: "#1ba9ba",
    borderStyle: "#1ba9ba",
    backgroundColor: "#fff",
    list: [ {
        pagePath: "/we7/pages/index/index",
        iconPath: "/we7/resource/icon/home.png",
        selectedIconPath: "/we7/resource/icon/homeselect.png",
        text: "首页"
    }, {
        pagePath: "/we7/pages/user/index/index",
        iconPath: "/we7/resource/icon/user.png",
        selectedIconPath: "/we7/resource/icon/userselect.png",
        text: "微擎我的"
    } ]
}), _defineProperty(_App, "globalData", {
    userInfo: null
}), _defineProperty(_App, "siteInfo", require("siteinfo.js")), _App));