var app = getApp();

Page({
  data: {
    pagenum: 0,
    collections: []
  },

  // 匹配数量
  pipei: function () {
    for (var a of this.data.carinfo) {
      for (var b of this.data.collections) {
        if (a.id == b.id) {
          b.num = a.num
        }
      }
    }
    this.setData({
      collections: this.data.collections
    })
  },

  //加
  // 如果购物车内有此件商品，则提示用户“购物车内已有此菜品”，
  jia: function (e) {
    var carinfo = wx.getStorageSync("carinfo");
    console.log("-----jia  点击加号 购物车里面有信息吗-------", carinfo)

    var id = e.currentTarget.dataset.id;
    console.log("-----商品id-----",id)

    var carinfo = wx.getStorageSync("carinfo");
    var page = this;
    for (var item of this.data.collections) {     
      if (item.id == id) {
        item.num = item.num + 1;
        this.setData({
          collections: this.data.collections
        })

        if (carinfo.length == 0) {
          console.log("购物车为空   第一次")
          item.num = 1;
          carinfo.push(item)
          console.log("----------提示--已加入购物车--------")
          wx.showToast({
            title: '已加入购物车',
            duration: 2e3
          })
          setTimeout(function () {
            wx.hideToast()
          }, 2000)
          this.setData({
            carinfo: carinfo
          })
          wx.setStorageSync("carinfo", page.data.carinfo)
          console.log("--购物车没有此件商品，点击加好存到本地的数据--",carinfo)
        } else {
          console.log("购物车不为空   不确定是不是第一次")
          var arr = [];
          for (var i of carinfo) {
            arr.push(i.id)
            console.log("-------arr 购物车内商品的id----",arr)
            console.log("----item.id 点击加号的商品id----",item.id)
            if (item.id == i.id) {
            console.log("----item.id == id 成立----")
              wx.showModal({
                title: '提示',
                content: '购物车内已有此商品',
                success: function (res) {
                  if (res.confirm) {
                    console.log('用户点击确定')
                  } else {
                    console.log('用户点击取消')
                  }
                }
              })
            }
          }
        
          if (arr.indexOf(item.id) == -1) {
            console.log("判断选中的商品id是否存在于arr中")
            item.num = 1;//存在数量为1
            console.log("----------提示--已加入购物车--------")
            wx.showToast({
              title: '已加入购物车',
              duration: 3e3
            })
            setTimeout(function () {
              wx.hideToast()
            }, 2000)
            carinfo.push(item)
            this.setData({
              carinfo: carinfo
            })
            wx.setStorageSync("carinfo", page.data.carinfo)
            console.log("-----最后的一个判断哦----",carinfo)
          }
        }
      }
    }
  },

  goCar: function (n) {
    var carinfo = wx.getStorageSync("carinfo");
    var user_id = wx.getStorageSync("users").id;
    console.log("---carinfo---数据之购物车", carinfo)
    console.log("---user_id---用户id", user_id)
  
    let newData = {
      carinfo: JSON.stringify(carinfo),
      user_id: user_id
    }
    console.log("--是对的吗，--------------", JSON.stringify(carinfo))
    app.util.request({
      url: 'entry/wxapp/shoppingCart',
      cachetime: "0",
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
      },
      method: 'POST',
      data: newData,
      success: function (t) {
        console.log("----我想看看这个t，购物车接口成功返回数据-----", t)
        wx.navigateTo({
          url: '../seller/car',
        })
        console.log(1)
      }
    })
  },
  

  //购物车小图标移动
  move: function (e) {
    // console.log(e);
    var touchs = e.touches[0];
    var clientX = touchs.clientX;
    var clientY = touchs.clientY;
    if (clientX < 18) return;
    if (clientY < 18) return;
    if (clientY > this.data.screenHeight - 18) return;
    if (clientX > this.data.screenWidth - 18) return;
    this.setData({
      moveTop: clientY - 18,
      moveLeft: clientX - 18
    })
  },

  onLoad: function (n) {
    app.setNavigationBarColor(this);
    var o = this,
    t = wx.getStorageSync("users").id,
    p = this.data.pagenum,
    carinfo = wx.getStorageSync("carinfo");
    console.log("collcetions中 onload内 carinfo 购物车缓存数据",carinfo)
    app.util.request({
      url:'wxapp/entry/collections',
    // wx.request({
    //   url:'http://192.168.10.4:7300/mock/5b997ec11bb1360514d591e2/example/update/collections',
      cachetime: "0",
      data: {
        user_id: t,
        page: p,
        pagesize: 10,
      },
      success: function (n) {
        for (var item of n.data) {
          item.num = 0
        }
        console.log("分页返回的列表数据", n.data),
          n.data.length < 10 ? o.setData({
            mygd: !0,//true
            jzgd: !0,
          }) : o.setData({
            jzgd: !0,  //原：!0
            pagenum: o.data.pagenum + 1,
          });
          var e = o.data.collections;
        console.log("------------o.data.collections)---------", o.data.collections)
          e = function (t) {
            for (var e = [], a = 0; a < t.length; a++) -1 == e.indexOf(t[a]) && e.push(t[a]);
            return e;
          }(e = e.concat(n.data)),

          o.setData({
            collections: e
          }), console.log("-------e是什么呢-------", e);
      } 
    });
   

    // 获取系统信息
    wx.getSystemInfo({
      success: function (res) {
        o.setData({
          screenHeight: res.windowHeight,
          screenWidth: res.windowWidth,
        });
        o.setData({
          moveLeft: o.data.screenWidth - 60,
          moveTop: o.data.screenHeight - 100,
        });
      }
    })
  },
  onReady: function () { },
  onShow: function () { 
  
  },
  onHide: function () { },
  onUnload: function () { },
  onPullDownRefresh: function () { },
  onReachBottom: function () {
    console.log("上拉加载", this.data.pagenum);
    !this.data.mygd && this.data.jzgd && (this.setData({//mygd是false  jzgd是true
      jzgd: !1 //false
    }), this.onLoad());
  },
  onShareAppMessage: function () { }
});