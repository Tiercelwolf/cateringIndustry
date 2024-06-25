var app = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
  },

  // 匹配数量
  pipei: function () {
    for (var a of this.data.carinfo) {
      for (var b of this.data.lists) {
        if (a.id == b.id) {
          b.num = a.num
        }
      }
    }
    this.setData({
      lists: this.data.lists
    })
  },

  jia: function (e) {
    var user_id = wx.getStorageSync("users").id;
    var id = e.currentTarget.dataset.id;
    var carinfo = wx.getStorageSync("carinfo");
    console.log("id---------", id)

    var page = this;
    for (var item of this.data.lists) {
      if (item.id == id) {
        item.num = item.num + 1;
        this.setData({
          lists: this.data.lists
        })

        if (carinfo.length == 0) {
          console.log("第一次")
          item.num = 1;
          carinfo.push(item)
          this.setData({
            carinfo: carinfo
          })
          wx.setStorageSync("carinfo", page.data.carinfo)
          console.log("--购物车没有此件商品，点击加好存到本地的数据--", carinfo)
          //------111111111111111111111-------------------------------------------
          let newData = {
            carinfo: JSON.stringify(carinfo),
            user_id: user_id
          }
          console.log("--是对的吗  JSON.stringify(carinfo)--------------", JSON.stringify(carinfo))
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
              wx.showToast({
                title: '添加成功',
                icon: 'succes',
                duration: 1000,
                mask: true
              })
            }
          })
        //------111111111111111111111-------------------------------------------
        } else {
          var arr = [];
          for (var i of carinfo) {
            arr.push(i.id)
            console.log("-------arr 购物车内商品的id----", arr)
            if (item.id == i.id) {
              wx.showToast({
                title: '购物车已有此物',
                icon: 'succes',
                duration: 1000,
                mask: true
              })
            }
          }
          if (arr.indexOf(item.id) == -1) {
            console.log("判断")
            item.num = 1;
            carinfo.push(item)
            this.setData({
              carinfo: carinfo
            })
            wx.setStorageSync("carinfo", page.data.carinfo)
            console.log("~~~~~~~~~~~~",carinfo)
            //--------222222222222222222--------------------------------------
            let newData = {
              carinfo: JSON.stringify(carinfo),
              user_id: user_id
            }
            console.log("--是对的吗  JSON.stringify(carinfo)--------------", JSON.stringify(carinfo))
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
                wx.showToast({
                  title: '添加成功',
                  icon: 'succes',
                  duration: 1000,
                  mask: true
                })
              }
            })
             //-----222222222222-----------------------------------------
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

  formName: function (e) {
    this.setData({
      name: e.detail.value
    })
    console.log("---name----",e.detail.value)
    wx.setStorageSync("inputKeyword", e.detail.value)
  },

  search:function(e){
    var a = this;
    var inputKeyword = wx.getStorageSync("inputKeyword");
    app.util.request({
      url: "entry/wxapp/inputKeyword",
      data: {
        input: inputKeyword
      },
      success: function (t) {
        console.log("---搜索之后返回的数据---", t.data)
        a.setData({
          lists: t.data
        })
      },
      fail: function (t) {
        wx.showToast({
          title: '搜索失败，请重试！',
          duration: 2000
        })
      }
    })
  },
  /**
   * 搜索
   */
  formSubmit: function (e) {
    var a = this;
    var inputKeyword = wx.getStorageSync("inputKeyword");
    app.util.request({
      url: "entry/wxapp/inputKeyword",
      data: {
        input: inputKeyword
      },
      success:function(t){
        console.log("---搜索之后返回的数据---",t.data)
        a.setData({
          lists:t.data
        })
      },
      fail:function(t){
        wx.showToast({
          title: '搜索失败，请重试！',
          duration:2000
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.setNavigationBarColor(this);
    var o = this,
    carinfo = wx.getStorageSync("carinfo");
    console.log("----####---购物车缓存的数据---",carinfo)
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

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})