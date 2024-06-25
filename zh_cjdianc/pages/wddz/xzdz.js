// 引入腾讯地图SDK核心类
var qqmapsdk, app = getApp(), 
QQMapWX = require("../../utils/qqmap-wx-jssdk.js");
//require(path)引用公共模块，公共代码抽离成为一个单独的 js 文件，作为一个模块,引入后就可以调用方法来实现修改数据格式。

Page({
    data: {
        address_list: null,
      isloading: !0
       
    },
    onLoad: function(e) {
        app.setNavigationBarColor(this);
        var t = this;
        app.util.request({
            url: "entry/wxapp/system",
        // wx.request({
        // url: 'http://192.168.10.4:7300/mock/5b782535bfe92705006efea3/wxapp/system',

          //url:'http://192.168.10.4:7300/mock/5b997ec11bb1360514d591e2/example/dizhi',//自编测试，可删
          cachetime: "0",
            success: function(e) {
                console.log(e), 
                t.setData({
                    System: e.data,
                  isloading: !1
                }), 
                 // 实例化腾讯地图API核心类
                qqmapsdk = new QQMapWX({//腾讯地图
                     key: e.data.map_key //密匙，"map_key": "QYXBZ-7EVLG-ZP6QT-IAJ25-J7Z2J-62BVJ",
                });
            }
        });
    },
    onReady: function() {},
    onShow: function() {
        wx.showNavigationBarLoading();
        var a = this, 
        e = wx.getStorageSync("users").id;//wx.getStorageSync("users").id为8242
      //获取收货地址
        app.util.request({
        url: "entry/wxapp/MyAddress",
            // wx.request({
              //url: 'http://192.168.10.4:7300/mock/5b782535bfe92705006efea3/wxapp/myaddresss',//传过来is_default等于1
              //url:'http://192.168.10.4:7300/mock/5b997ec11bb1360514d591e2/example/chooseAddress',
                // url: 'http://192.168.10.4:7300/mock/5b997ec11bb1360514d591e2/example/testdizhi',
            cachetime: "0",
            data: {
                user_id: e //8242
            },
            success: function(e) {
                console.log(e);
                for (var t = 0; t < e.data.length; t++) e.data[t].address = e.data[t].area + e.data[t].address;
                //join()所有元素放入字符串，数组变成字符串
                a.setData({
                    address_list: e.data
                });
            }
        });
    },

    //编辑地址
    bianji: function(e) { 
       var t = e.currentTarget.dataset.bjid; 
       //currentTarget 当前组件的一些属性值集合  事件属性返回其监听器触发事件的节点，即当前处理该事件的元素、文档或窗口。
         console.log(t),
         wx.navigateTo({
            url: "bjdz?bjid=" + t, //546
            success: function(e) {
              console.log("-----返回成功  e -------",e)
            },
            fail: function(e) {},
           complete: function (e) {},//	接口调用结束的回调函数（调用成功、失败都会执行）  
           
        });
    },

    //删除地址
    shanchu: function(e) {
        console.log(e.currentTarget.dataset.scid);
        var t = e.currentTarget.dataset.scid, // t = 546
        a = this;
        wx.showModal({
            title: "提示",
            content: "确定要删除该地址吗？",
            confirmText: "确定",
            cancelText: "取消",
            success: function(e) { //三元运算符
              console.log(e), 
                //控制台打印得到 e.confirm 为true
                e.confirm ? (
                  app.util.request({
                    url: "entry/wxapp/DelAdd",
                    // wx.request({
                    // url: 'http://192.168.10.4:7300/mock/5b782535bfe92705006efea3/wxapp/deladd',//1
                    cachetime: "0",
                    data: {
                        id: t  // t = 546
                    },
                    header: {
                        "content-type": "application/json" //默认值
                    },
                    success: function(e) {
                      //&&，true执行&&前，false执行&&后
                        console.log(e), "1" == e.data && (a.onShow(), wx.showToast({//wx.showToast显示消息提示框
                            title: "删除成功",
                            icon: "success"
                        }));
                    }
                }), console.log("用户点击确定")) : console.log("用户点击取消");
            }
        });
    },

    //设置为默认地址
    radioChange: function(e) {
        wx.getStorageSync("mydata").id;
        var a = this, u = wx.getStorageSync("users").id;//u=8242
        console.log("radio发生change事件，携带value值为：", e.currentTarget.dataset.id);
        var t = e.currentTarget.dataset.id;//t=14
        app.util.request({
            url: "entry/wxapp/AddDefault",
            // wx.request({
            //   url: 'http://192.168.10.4:7300/mock/5b782535bfe92705006efea3/wxapp/adddefault',//2
            cachetime: "0",
            data: {
                id: t,
                user_id:u
            },
            success: function(e) {
                if (console.log(e), "1" == e.data) {
                    a.onShow(), wx.showToast({
                        title: "修改成功1",
                        icon: "success",
                        duration: 1e3 //提示的延长时间
                    });
                    var t = getCurrentPages();
                    if (console.log(t), 1 < t.length && "zh_cjdianc/pages/takeout/takeoutform" == t[t.length - 2].route) t[t.length - 2].countpsf();                 
                    setTimeout(function() {
                        wx.navigateBack({
                           //wx.navigateBack关闭当前页面，返回上一页面或多级页面。可通过 getCurrentPages() 获取当前的页面栈，决定需要返回几层
                           delta: 1 //返回的页面数，如果 delta 大于现有页面数，则返回到首页。
                        });
                    }, 1e3);
                }
                
                
                //执行2==e.date
                if ("2" == e.data) {
                  a.onShow(), wx.showToast({
                    title: "修改成功",
                    icon: "success",
                    duration: 1e3 //提示的延长时间
                  });
                    t = getCurrentPages();
                    if (console.log(t), 1 < t.length && "zh_cjdianc/pages/takeout/takeoutform" == t[t.length - 2].route) t[t.length - 2].countpsf();
                    setTimeout(function() {

                    }, 1e3);
                }
            },
            fail: function(e) {},
            complete: function (e) { }//	接口调用结束的回调函数（调用成功、失败都会执行）
        });
    },


    //添加地址
    tianjia: function (e) {
      var t = e.currentTarget.dataset.tjid;
      //currentTarget 当前组件的一些属性值集合  事件属性返回其监听器触发事件的节点，即当前处理该事件的元素、文档或窗口。
      console.log(t),//控制台打印出来t=546
        wx.navigateTo({
          url: "tjdz?tjid=" + t, //546
          success: function (e) {},
          fail: function (e) {},
          complete: function (e) {}//接口调用结束的回调函数（调用成功、失败都会执行）
        });
    },

    //微信添加
    getWechatAddress: function(e) {
        var n = wx.getStorageSync("users").id, 
        s = this;
        wx.chooseAddress({//调起用户编辑收货地址原生界面，并在编辑完成后返回用户选择的地址。
            
            success: function(o) {
                console.log("加油啊，zjp"+o), "chooseAddress:ok" == o.errMsg && (wx.showLoading(), qqmapsdk.geocoder({
                    address: o.provinceName + o.cityName + o.countyName + o.detailInfo,
                    
                    success: function(e) {
                
                        if (console.log(e), "0" == e.status) {
                            var t = e.result.location.lat, a = e.result.location.lng;
                            app.util.request({
                                url: "entry/wxapp/AddAddress",
                              // wx.request({
                              //   url: 'http://192.168.10.4:7300/mock/5b782535bfe92705006efea3/wxapp/addaddress',//1
                            
                                cachetime: "0",
                                data: {
                                    address: o.detailInfo,
                                    area: o.provinceName + "," + o.cityName + "," + o.countyName,
                                    user_name: o.userName,
                                    user_id: n,
                                    tel: o.telNumber,
                                    sex: "1",
                                    lat: t,
                                    lng: a
                                },
                                success: function(e) {
                                    if (console.log(e.data), "1" == e.data) {
                                        wx.showToast({
                                            title: "保存成功",
                                            duration: 1e3
                                        });
                                        var t = getCurrentPages();
                                        if (console.log(t), 1 < t.length && "zh_cjdianc/pages/takeout/takeoutform" == t[t.length - 2].route) t[t.length - 2].countpsf();
                                        setTimeout(function() {
                                            
                                        }, 1e3), s.onShow();
                                    }
                                }
                            });
                        }
                    },
                    fail: function(e) {
                        console.log(e);
                    },
                    complete: function (e) {//	接口调用结束的回调函数（调用成功、失败都会执行）
                        console.log(e);
                    }
                }));
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
                                        e.authSetting["scope.address"] && s.getWechatAddress();
                                    },
                                    fail: function(e) {}
                                });
                            }
                        });
                    }
                });
            }
        });
    }
});