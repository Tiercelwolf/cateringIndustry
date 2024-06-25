var app = getApp(), util = require("../../utils/util.js");

Page({
  data: {
    tjnum: 1,
    accountNumber: 'TP-LINK_1C8F',//Wi-Fi 的SSID，即账号
    ydmoney1: 50,
    ydmoney2: 100,
    bssid: 'TP-LINK_1C8F',//Wi-Fi 的ISSID
    password: '51737230',//Wi-Fi 的密码,
    index: 0,
    navbar: [],
    selectedindex: 0,
    isytpj: !1,
    pagenum: 1,
    storelist: [],
    bfstorelist: [],
    mygd: !1,
    jzgd: !0,
    singlestore: getApp().siteInfo.singlestore,
    bjyylb: "laba",
  },
  commentPicView: function (t) {
    console.log(t);
    var a = this.data.storelist, e = [], s = t.currentTarget.dataset.index, o = t.currentTarget.dataset.picindex, i = t.currentTarget.dataset.id;
    if (console.log(s, o, i), i == a[s].id) {
      var n = a[s].img;
      for (var r in n) e.push(this.data.url + n[r]);
      wx.previewImage({
        current: this.data.url + n[o],
        urls: e
      });
    }
  },

  changemd: function () {
    wx.navigateTo({
      url: 'switchstores',
    })
  },

  sy: function () {
    wx.navigateTo({
      url: "fukuan?storeid=" + this.data.store_info.id
    });
  },
  takeout: function () {
    wx.navigateTo({

      url: "/zh_cjdianc/pages/takeout/takeoutindex?storeid=" + this.data.store_info.id
    });
    console.log("打印id", this.data.store_info.id)
  },
  plan: function () {
    wx.navigateTo({
      url: "/zh_cjdianc/pages/reserve/reserve?storeid=" + this.data.store_info.id
    });
  },
  qsy: function (t) {
    console.log(t.currentTarget.dataset.type), "2" != t.currentTarget.dataset.type && wx.navigateTo({
      url: "/zh_cjdianc/pages/takeout/takeoutindex?storeid=" + this.data.store_info.id
    });
  },

  about: function () {
    wx.navigateTo({
      url: "../information"
    })
  },

  // 优惠券，转至领券中心
  clickyhq: function () {
    wx.navigateTo({
      url: '/zh_cjdianc/pages/my/voucherCenter',
    })
  },


  //------wifi------------------------------------------
  connectWifi: function () {
    var that = this;
    //检测手机型号
    wx.getSystemInfo({
      success: function (res) {
        var system = '';
        if (res.platform == 'android') system = parseInt(res.system.substr(8));
        if (res.platform == 'ios') system = parseInt(res.system.substr(4));
        if (res.platform == 'android' && system < 6) {
          wx.showToast({
            title: '手机版本不支持',
          })
          return
        }
        if (res.platform == 'ios' && system < 11.2) {
          wx.showToast({
            title: '手机版本不支持',
          })
          return
        }
        wx.showModal({
          title: '请打开你的wifi',
          content: '并且需在本门店连接店内wifi',
          success: function (res) {
            if (res.confirm) {
              //2.初始化 Wi-Fi 模块
              that.startWifi();
            }
            if (res.cancel) {
              wx.showToast({
                title: '请同意',
              })
            }
          }
        })
      }
    })
  },

  //初始化 Wi-Fi 模块
  startWifi: function () {
    var that = this
    wx.startWifi({
      success: function () {
        //请求成功连接Wifi
        that.Connected();
      },
      fail: function (res) {
        wx.showToast({
          title: '接口调用失败',
        });
      }
    })
  },

  Connected: function () {
    var that = this
    wx.connectWifi({
      SSID: that.data.accountNumber,
      BSSID: that.data.bssid,
      password: that.data.password,
      success: function (res) {
        wx.showToast({
          title: 'wifi连接成功',
        })
      },
      fail: function (res) {
        wx.showToast({
          title: '请打开你的wifi',
        })
      }
    })
  },


  //这是查看定位
  location: function () {
    app.setNavigationBarColor(this);
    console.log("=====this======", this)
    wx.openLocation({
      latitude: parseFloat(this.data.locationRes.latitude),
      longitude: parseFloat(this.data.locationRes.longitude)
    });
  },

  // 这是拨打电话
  phone: function () {
    var a = this;
    console.log("-----t是什么------", a);
    wx.makePhoneCall({
      phoneNumber: a.data.store_info.tel, //仅为示例，并非真实的电话号码,
    })
  },

  //点餐 这是扫码
  scan: function () {
    var saoma = this;
    var user_id = wx.getStorageSync("users").id;
    console.log("-----用户的id---", user_id)
    wx.scanCode({//调起扫码界面，扫码成功后返回相应结果
      success: function (t) {
        console.log("---点餐 扫码成功结果----", t);
        var a = "/" + t.path;

        var smurl = t.path;
        var n = smurl.split("?");
        console.log("-------分割之后--------------", n)
        var first = n[0],
          second = n[1];
        console.log("---第一个---", first, "---第二个---", second)

        var tableid = second;
        wx.setStorageSync("tableid", tableid)

        app.util.request({
          url: "wxapp/entry/sweepCode",
          data: {
            user_id: user_id,
            tableid: second
          },
          success: function (t) {//获取订单id、餐桌号
            console.log("扫码成功接口，返回数据 -----桌号----", t.data.table_num)
            console.log("扫码成功接口，返回数据 -----订单id----", t.data.order_id)
            wx.setStorageSync("table_num", t.data.table_num)
            wx.setStorageSync("order_id", t.data.order_id)
            saoma.setData({
              table_num: t //桌子编号
            })

            if (!(t.data.order_id === "undefined" || typeof (t.data.order_id) === "undefined" || t.data.order_id === "")) {
              wx.navigateTo({
                url: "showGoods?orderIndex=1" + "&preinfo=1" + "&pppreinfo=2"
              });
            } else {
              wx.showModal({
                title: '提示',
                content: '此桌号已被预订，请更换',
              })
            }

          }
        })

      },
      fail: function (t) {
        console.log("扫码fail");
      }
    });
  },

  //外卖  跳转至商品分类
  go: function () {
    wx.navigateTo({
      url: 'showGoods?"&pppreinfo=2',
    })
  },

  //  评论
  gopl: function () {
    wx.navigateTo({
      url: 'pl',
    })
  },

  //展示加入购物车/立即购买
  canvas: function (e) {
    let id = e.currentTarget.dataset.id;
    wx.setStorageSync("choose_id", id)

    for (let item of this.data.tuijian) {
      if (item.id == id) {
        this.setData({
          carrr: item,
          tjid: id
        })

        console.log("carrr----item--商品数据-----", item)

        wx.setStorageSync("carrr", item)
      }
    }
    this.setData({
      active: !this.data.active,
      canvas: !this.data.canvas
    })
    this.tjjia();
    this.tjjian();
  },
  // 再次点击
  again: function () {
    var page = this;
    this.setData({
      active: !this.data.active,
    })
    setTimeout(
      function () {
        page.setData({
          canvas: !page.data.canvas
        })
      }, 500
    )
    this.setData({
      tjnum: 1
    })
  },

  //立即购买的数量  减  
  tjjian: function () {
    if (this.data.tjnum <= 1) {
      wx.showToast({
        title: '数量不能小于1',
      })
    } else {
      this.setData({
        tjnum: this.data.tjnum - 1
      })
      wx.setStorageSync("tjnum", this.data.tjnum)

      var tjnum = wx.getStorageSync("tjnum");
      console.log("---存到本地  购买数量   减---", tjnum)
    }
  },

  //立即购买的数量  加
  tjjia: function () {
    this.setData({
      tjnum: this.data.tjnum + 1
    })
    wx.setStorageSync("tjnum", this.data.tjnum)

    var tjnum = wx.getStorageSync("tjnum");
    console.log("---存到本地   购买数量   加---", tjnum)
  },

  //加入购物车-----------------------------------------------------------
  jiacar: function (e) {
    var user_id = wx.getStorageSync("users").id;
    var carinfo = wx.getStorageSync("carinfo") || [];
    this.setData({
      carinfo: carinfo
    })
    var id = this.data.tjid;
    console.log("-----id----推荐的商品", id)
    var page = this;
    for (var item of this.data.tuijian) {

      if (item.id == id) {
        item.num = item.num + 1;

        if (this.data.carinfo.length == 0) {
          console.log("第一次")
          console.log("-------this.data.tjnum-----------", this.data.tjnum)
          item.num = this.data.tjnum;//----推荐的数量
          item.isselect = 1;
          this.data.carinfo.push(item)

          wx.setStorageSync("carinfo", page.data.carinfo)
          console.log("--第一次里面--this.data.carinfo--购物车--", this.data.carinfo)
        } else {
          var arr = [];
          for (var i of this.data.carinfo) {
            arr.push(i.id)
            console.log(arr)
            if (item.id == i.id) {
              console.log("循环")
              i.num = i.num + this.data.tjnum;
              item.isselect = 1;
              wx.setStorageSync("carinfo", page.data.carinfo)
              console.log("--循环---第二次----", this.data.carinfo)
            }
          }
          if (arr.indexOf(item.id) == -1) {
            console.log("判断")
            item.num = this.data.tjnum;
            item.isselect = 1;
            this.data.carinfo.push(item)
            wx.setStorageSync("carinfo", page.data.carinfo)
            console.log("----判断----第二次----", this.data.carinfo)
          }
        }
      }
    }
    this.setData({
      tjnum: 1,
      active: !this.data.active,
      canvas: !this.data.canvas
    })

    var carinfo = wx.getStorageSync("carinfo") || [];
    let newData = {
      carinfo: JSON.stringify(carinfo),
      user_id: user_id
    }
    console.log("--  JSON.stringify(carinfo)--------------", JSON.stringify(carinfo))
    app.util.request({
      url: 'entry/wxapp/shoppingCart',
      cachetime: "0",
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
      },
      method: 'POST',
      data: newData,
      success: function (t) {
        console.log("----我想看看这个t，存入购物车接口成功返回数据-----", t)
        wx.showToast({
          title: '加入购物车成功',
          duration: 2000,//提示的延迟时间，单位毫秒，默认：1500 
          success: function () {
            wx.navigateTo({
              url: 'car',
            })
          },
        })
      }
    })
  },

  //立即购买-----------------------------------------------------------
  gobuy: function () {
    this.tjjia();
    this.tjjian();
    var user_id = wx.getStorageSync("users").id;
    
     var a = this;
    console.log("-----立即购买商品的id-----", a)

    var id = wx.getStorageSync("choose_id");
    console.log("-----立即购买商品的id-----", id)
    var carrr = wx.getStorageSync("carrr");
    console.log("---carrr---准备送往提交订单页面的数据1-(对象)--", carrr)

    var tjnum = wx.getStorageSync("tjnum");
    console.log("---获取到的tjnum----", tjnum)

    var jsonObject = carrr;
    jsonObject.num = tjnum;//对象jsonObject中,添加属性num
    console.log("---新的json-------送往提交订单页面---", jsonObject)

    var arrCarrr = [];
    arrCarrr.push(jsonObject)
    console.log("--carrr---转化为数组---", arrCarrr)

    wx.setStorageSync("selectGoods", arrCarrr)

    wx.navigateTo({
      url: '../takeout/takeoutform'
    })
    console.log("发送  立即购买  数据  成功！")

  },

  //去预定
  gopre: function () {
    var page = this;
    wx.navigateTo({
      url: 'preinfo?preinfo=1'
    })
  },

  //去描述商品
  godescribe: function (e) {
    var id = e.currentTarget.dataset.id;
    console.log("---点击id--", id)
    wx.navigateTo({
      url: 'describe?id=' + id + '&distinguish=1'
    })
  },

  //页面加载时的操作
  onLoad: function (t) {
    app.setNavigationBarColor(this);
    app.siteInfo.uniacid = t.shopid || app.siteInfo.uniacid
    var page = this;
    //推荐商品请求
    app.util.request({
      url: "entry/wxapp/tuijian",
      // wx.request({
      //   url: 'http://192.168.10.4:7300/mock/5b99d46d1bb1360514d591f4/example/tuijian',
      success: function (res) {
        page.setData({
          tuijian: res.data
        })
        console.log("~~~~~推荐的商品~~~~~", res.data)
        wx.setStorageSync("tuijian", res.data)
      }
    })

    var ydmoney1 = this.data.ydmoney1,
      ydmoney2 = this.data.ydmoney2;

    page.setData({
      ydmoney1: ydmoney1,
      ydmoney2: ydmoney2
    })

    wx.setStorageSync("ydmoney1", ydmoney1)

    ///////轮播，商家信息，扫码，外卖点餐，店内评论
    app.util.request({
      url: "entry/wxapp/oneTwo",
      // wx.request({
      // //   url: 'http://192.168.10.4:7300/mock/5b99d46d1bb1360514d591f4/example/onetwo',
      //   url: 'http://192.168.10.4:7300/mock/5bc5de72363a0e050d79bce0/example/homepage',
      success: function (t) {
        page.setData({
          oneTwo: t.data
        })
      }
    })
    // 餐厅环境
    app.util.request({
      url: "entry/wxapp/cantin",
      // wx.request({
      // //   url: 'http://192.168.10.4:7300/mock/5b99d46d1bb1360514d591f4/example/cantin',
      //   url: 'http://192.168.10.4:7300/mock/5bc5de72363a0e050d79bce0/example/Restaurant',
      success: function (t) {
        page.setData({
          cantin: t.data
        })
      }
    })

    // 优惠券
    // app.util.request({
    // url:"entry/wxapp/coupon",
    wx.request({
      url: 'http://192.168.10.4:7300/mock/5bc5de72363a0e050d79bce0/example/coupon',
      success: function (t) {
        page.setData({
          coupon: t.data
        })
      }
    })
    // 这是获取定位
    wx.getLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度
      success: function (res) {
        page.setData({
          locationRes: res
        })
        console.log("这是定位");
        console.log("=================", page.data.locationRes);
      }
    })
    // 这是我自己写的

    console.log("当前页面路径" + this.route)
    console.log("当前页面路径" + this.__route__)
    //把this赋值给变量e
    var e = this;
    // 执行app实例的设置导航栏颜色方法

    app.setNavigationBarColor(page);
    // 解码t.scene赋值给变量a
    var a = decodeURIComponent(t.scene);
    console.log("scene", a), 
    "undefined" != a && (getApp().sjid = a), 
    null != t.sjid && (console.log("转发获取到的sjid:", t.sjid),
      getApp().sjid = t.sjid), 
      console.log(t, getApp().sjid),
      app.getUserInfo(function (t) {
        console.log(t)
        //设置数据
      }),

      page.setData({

        params: {
          store_id: getApp().sjid,
          type: "全部",
          img: ""
        }
        // 调用this的获取商店清单
      }),


      page.refresh(getApp().sjid),
      app.util.request({ //getApp()获取全局参数，全局参数定义在app()内
        url: "entry/wxapp/system",
        // wx.request({
        //     //底部栏
        //    url: "http://192.168.10.4:7300/mock/5b782535bfe92705006efea3/wxapp/system",
        // url:"http://192.168.10.4:7300/mock/5b997cf21bb1360514d591d9/example/first",

        // url:"http://192.168.10.4:7300/mock/5b9d79d01bb1360514d591fd/example/followYou",
        cachetime: "0",
        success: function (t) {
          console.log(t);
          var a = t.data;
          getApp().xtxx1 = a, 

          app.pageOnLoad(page),
            page.setData({
              xtxx: a,
            });
        }
      })
  },

  jumps: function (t) {
    var a = t.currentTarget.dataset.id, 
    e = t.currentTarget.dataset.name, 
    s = t.currentTarget.dataset.appid, 
    o = t.currentTarget.dataset.src, 
    i = t.currentTarget.dataset.wb_src, 
    n = t.currentTarget.dataset.type;
    // 页面跳转到
    console.log(a, e, s, o, i, n), 
    1 == n ? (console.log(o), 
    wx.navigateTo({
      url: "fukuan"
    })) : 2 == n ? (wx.setStorageSync("vr", i), 
    wx.navigateTo({
      url: "../car/car"
    })) : 3 == n && wx.navigateToMiniProgram({
      appId: s
    });
  },

  refresh: function (t) {
    var d = this, 
    l = util.formatTime(new Date()).slice(11, 16);
    //中间内容
    app.util.request({
      // wx.request({
      //   url: "http://192.168.10.4:7300/mock/5b782535bfe92705006efea3/wxapp/StoreInfo",
      url: "entry/wxapp/StoreInfo",
      cachetime: "0",
      data: {
        store_id: t
      },
      success: function (t) {
        "" != t.data.store.store_mp3 && "1" == t.data.store.is_mp3 && (wx.playBackgroundAudio({
          dataUrl: t.data.store.store_mp3
        }), 
        wx.getBackgroundAudioPlayerState({
          success: function (t) {
            console.log(t);
            t.status, 
            t.dataUrl, 
            t.currentPosition, 
            t.duration, 
            t.downloadPercent;
          },
          fail: function (t) {
            console.log(t);
          },
          complete: function (t) {
            console.log(t);
          }
        })),
          d.setData({
            store_info: t.data.store,
            storeset: t.data.storeset
          })
      }
    })
  },
})
