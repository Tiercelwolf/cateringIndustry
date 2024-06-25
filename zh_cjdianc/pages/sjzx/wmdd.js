var app = getApp();

Page({
    data: {
        selectedindex: 0,
        topnav: [ {
            img: "../../img/sj-djdh.png",
            img2: "../../img/sj-djd.png",
            name: "待接单",
        }, {
            img: "../../img/sj-dsdh.png",
            img2: "../../img/sj-dsd.png",
            name: "待送达",
        }, {
            img: "../../img/sj-dzth.png",
            img2: "../../img/sj-dzt.png",
            name: "待自提",
        }, {
            img: "../../img/sj-ywch.png",
            img2: "../../img/sj-ywc (1).png",
            name: "已完成",              
        }, {
            img: "../../img/sj-shtkh.png",
            img2: "../../img/sj-shtk.png",
            name: "售后/退款",
        } ],
        open: !1, //false
        pagenum: 0,
        order_list: [],
        storelist: [],
        mygd: !1, //false
        jzgd: !0  //true
    },
    maketel: function(t) {
        var e = t.currentTarget.dataset.tel;
        wx.makePhoneCall({
            phoneNumber: e
        });
    },
    location: function(t) {
        var e = t.currentTarget.dataset.lat, a = t.currentTarget.dataset.lng, o = t.currentTarget.dataset.address;
        console.log(e, a), wx.openLocation({
            latitude: parseFloat(e),
            longitude: parseFloat(a),
            address: o,
            name: "位置"
        });
    },

    selectednavbar: function(t) {
        console.log("-----顶部selectednavbar------",t)
        this.setData({
            pagenum: 0,
            order_list: [],
            storelist: [],
            mygd: !1,
            jzgd: !0,
            selectedindex: t.currentTarget.dataset.index,
            status: Number(t.currentTarget.dataset.index) + 1
        }), this.reLoad();
    },

    doreload: function(t) {
        console.log(t), this.setData({
            pagenum: 0,
            order_list: [],
            storelist: [],
            mygd: !1,
            jzgd: !0,
            selectedindex: t - 1,
            status: t
        }), this.reLoad(); 
    },
    
    kindToggle: function(t) {
        var e = t.currentTarget.id, 
        a = this.data.order_list;
        console.log(e);
        for (var o = 0, n = a.length; o < n; ++o) a[o].open = o == e && !a[o].open;
        this.setData({
            order_list: a
        });
    },

    reLoad: function() {
      console.log("this.data.status-----reload",this.data.status)
        var t, 
        a = this,
        e = this.data.status || 1,  //status顶部五个状态
        o = wx.getStorageSync("sjdsjid"), 
        n = this.data.pagenum, 
        s = "";
        1 == e && (t = "2"), //待接单
        2 == e && (t = "3,4", s = "1"), //待送达
        3 == e && (t = "3,4", s = "2"), //待自提
        4 == e && (t = "6,7,9"), //已完成
        5 == e && (t = "5,8,10,11"), //售后/退款
        console.log("~~~~这些都是什么值~~~~~~~",e, t, s, o, n);
    
       app.util.request({
            url: "entry/wxapp/StoreWmOrder",
            // wx.request({
            // url: 'http://192.168.10.4:7300/mock/5b782535bfe92705006efea3/wxapp/storewmorder/' + t + '/' + s,  
          // url: "http://192.168.10.4:7300/mock/5b997ec11bb1360514d591e2/example/storewmorder/" + t + "/" + s,//自编测试
            //“待接单、待送达、待自提、已完成、售后/退款 ”下面 与 “加载中或加载完毕”上面 的东西
            //控制台打印t为2，s为undefined 
             
            cachetime: "0",
            data: {
                state: t,
                // zt: s,
                order_type:s,//1外卖 2自提
                store_id: o,
                page: n,
                pagesize: 10,     
            },    
            success: function(t) {
              // 分页功能
              console.log("分页返回的列表数据", t.data, "???"), t.data.length < 10 ? a.setData({
                    mygd: !0,//true
                    jzgd: !0,       
                }) : a.setData({
                    jzgd: !0,  //原：!0
                    pagenum: a.data.pagenum + 1
                });
              // 分页功能连接上一页
              console.log("---------------e    d.data.storeList--------------------", a.data.storelist)
                var e = a.data.storelist; 
                e = function(t) {
                    for (var e = [], a = 0; a < t.length; a++) -1 == e.indexOf(t[a]) && e.push(t[a]);
                    return e;
                }(e = e.concat(t.data))
 
             // 根据下单时间  由大到小  排序
              for (var i = 0; i < e.length; i++) {
                for (var j = i; j < e.length; j++) {
                  if (new Date(e[i].order.time).getTime() < new Date(e[j].order.time).getTime()) {
                    var temp = e[i];
                    e[i] = e[j];
                    e[j] = temp;
                  }
                }
              }
              console.log("排序之后的数据------", e)

                a.setData({
                    order_list: e,
                    storelist: e,  
                }), console.log("--- 商家入口  菜单 -- order_list  e---",e);
            }
        }); 
    },
    onLoad: function(t) {
      console.log("-----status=4-----",t.status)
      this.data.status = Number(t.status);
      console.log("--------------------this.data.status---------------", this.data.status)

        var e = this, a = wx.getStorageSync("sjdsjid");
        console.log(a), this.reLoad(), app.setNavigationBarColor(this), app.sjdpageOnLoad(this), 
        app.util.request({
           url: "entry/wxapp/system",
          // wx.request({
          //   url: 'http://192.168.10.4:7300/mock/5b782535bfe92705006efea3/wxapp/system',
            cachetime: "0",
            success: function(t) {
                console.log(t.data), wx.setStorageSync("system", t.data), wx.setNavigationBarTitle({
                  title: t.data.wm_name   //获取到wm_name为菜单
                }), e.setData({
                    xtxx: t.data
                });
            }
        });

        if(e.data.status == 4){
          e.doreload(4)
        }
    
     },

  // 扫码核销
    smhx: function(t) {
        var a = wx.getStorageSync("sjdsjid");
        console.log("----扫码核销   a--商家的id--",a)
        wx.scanCode({
            success: function(t) {
              console.log("-----t 二维码里的内容----",t);
              console.log("-------t.path--地址路径--", t.path);
              var xqurl = t.path;
              var n = xqurl.split("?");
              console.log("-------分割之后--------------",n)
              var first = n[0],
              second = n[1];
              console.log("---第一个---", first,"---第二个---",second)
            
            wx.redirectTo({
                url: "/" + first + "?oid=" + second
              });
            },
            fail: function(t) {
                console.log("扫码fail");
            }
        });
    },

    // 点击接单
    djjd: function(t) {
        var e = this, 
        a = t.currentTarget.dataset.id,
        b = t.currentTarget.dataset.yo;
        console.log(a), 
        wx.showModal({
            title: "提示",
            content: "是否确认接单？",
            cancelText: "否",
            confirmText: "是",
            success: function(t) {
                if (t.cancel) return !0;
                t.confirm && (wx.showLoading({
                    title: "操作中",
                    mask: !0
                }), 
                app.util.request({
                   url: "entry/wxapp/JdOrder",
                  //  wx.request({
                  // url: 'http://192.168.10.4:7300/mock/5b782535bfe92705006efea3/wxapp/jdorder', //1
                    cachetime: "0",
                    data: {
                      order_id: a,
                      yo: b  
                    },
                    success: function(t) {
                        console.log("---点击接单返回的数据-----",t.data), 

                        "1" == t.data.getDate ? (wx.showToast({
                            title: "接单成功",
                            icon: "success",
                            duration: 1e3
                        }), setTimeout(function() {
                          console.log("---@@@@@@@@@@@----e.doreload-----上-------",)
                            if (t.data.order_type == 1) {//order_type == 1外卖
                              e.doreload(2);
                            } else if (t.data.order_type == 2) {//order_type == 2自提
                              e.doreload(3);
                            } else {//order_type == 3到店消费   4预约到店
                              e.doreload(4);
                            }
                          console.log("-----@@@@@@@@@@--e.doreload-----下-------", )
                        }, 1e3)) : wx.showToast({
                            title: "请重试",
                            icon: "loading",
                            duration: 1e3
                        });
                    }
                }));
            }
        });
    },
    // 拒绝接单
    jjjd: function(t) {
        var e = this, a = t.currentTarget.dataset.id,
          b = t.currentTarget.dataset.yo;
        console.log(a), wx.showModal({
            title: "提示",
            content: "是否拒绝接单？",
            cancelText: "否",
            confirmText: "是",
            success: function(t) {
                if (t.cancel) return !0;
                t.confirm && (wx.showLoading({
                    title: "操作中",
                    mask: !0
                }), 
                app.util.request({
                   url: "entry/wxapp/JjOrder",
                  //  wx.request({
                  // url: 'http://192.168.10.4:7300/mock/5b782535bfe92705006efea3/wxapp/jjorder', //1
                    cachetime: "0",
                    data: {
                        order_id: a,
                        yo:b
                    },
                    success: function(t) {
                        console.log(t.data), "1" == t.data ? (wx.showToast({
                            title: "操作成功",
                            icon: "success",
                            duration: 1e3
                        }), setTimeout(function() {
                            e.doreload(5);
                        }, 1e3)) : wx.showToast({
                            title: "请重试",
                            icon: "loading",
                            duration: 1e3
                        });
                    }
                }));
            }
        });
    },

    // 完成订单
    wcps: function(t) {
        var e = this, a = t.currentTarget.dataset.id,
          c = t.currentTarget.dataset.yo;
        console.log(a), wx.showModal({
            title: "提示",
            content: "确认完成此订单？",
            cancelText: "否",
            confirmText: "是",
            success: function(t) {
                if (t.cancel) return !0;
                t.confirm && (wx.showLoading({
                    title: "操作中",
                    mask: !0
                }), 
                app.util.request({
                    url: "entry/wxapp/OkOrder",
                  //   wx.request({
                  // url: 'http://192.168.10.4:7300/mock/5b782535bfe92705006efea3/wxapp/okorder', //1
                    cachetime: "0",
                    data: {
                      order_id: a,
                      yo: c
                    },
                    success: function(t) {
                        console.log(t.data), "1" == t.data ? (wx.showToast({
                            title: "操作成功",
                            icon: "success",
                            duration: 1e3
                        }), setTimeout(function() {
                            e.doreload(4);
                        }, 1e3)) : wx.showToast({
                            title: "请重试",
                            icon: "loading",
                            duration: 1e3
                        });
                    }
                }));
            }
        });
    },

    // 拒绝退款
    jjtk: function(t) {
        var e = this, a = t.currentTarget.dataset.id;
        console.log(a), wx.showModal({
            title: "提示",
            content: "是否拒绝退款？",
            cancelText: "否",
            confirmText: "是",
            success: function(t) {
                if (t.cancel) return !0;
                t.confirm && (wx.showLoading({
                    title: "操作中",
                    mask: !0
                }), 
                app.util.request({
                   url: "entry/wxapp/JjTk",
                    cachetime: "0",
                    data: {
                        order_id: a
                    },
                    success: function(t) {
                        console.log(t.data), "1" == t.data ? (wx.showToast({
                            title: "操作成功",
                            icon: "success",
                            duration: 1e3
                        }), setTimeout(function() {
                            e.doreload(5);
                        }, 1e3)) : wx.showToast({
                            title: "请重试",
                            icon: "loading",
                            duration: 1e3
                        });
                    }
                }));
            }
        });
    },

    // 通过退款
    tgtk: function(t) {
        var e = this, a = t.currentTarget.dataset.id;
        console.log(a), wx.showModal({
            title: "提示",
            content: "是否通过退款？",
            cancelText: "否",
            confirmText: "是",
            success: function(t) {
                if (t.cancel) return !0;
                t.confirm && (wx.showLoading({
                    title: "操作中",
                    mask: !0
                }),
                 app.util.request({
                    url: "entry/wxapp/TkTg",
                    cachetime: "0",
                    data: {
                        order_id: a
                    },
                    success: function(t) {
                        console.log(t.data), "1" == t.data ? (wx.showToast({
                            title: "操作成功",
                            icon: "success",
                            duration: 1e3
                        }), setTimeout(function() {
                            e.doreload(5);
                        }, 1e3)) : wx.showToast({
                            title: "请重试",
                            icon: "loading",
                            duration: 1e3
                        });
                    }
                }));
            }
        });
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {
        console.log("上拉加载", this.data.pagenum);
      !this.data.mygd && this.data.jzgd && (this.setData({//mygd是false  jzgd是true
            jzgd: !1 //false
        }), this.reLoad());
    }
});