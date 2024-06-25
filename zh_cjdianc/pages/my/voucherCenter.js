var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    open: false,
    show1: false,
    isloading: !0,

  },

  receive:function(t){
    var o = this;
    var user_id = wx.getStorageSync("users").id;
    var id = t.currentTarget.dataset.id,
        type = t.currentTarget.dataset.type;

    app.util.request({
      url:'entry/exapp/isReceive',
      data:{
        id:id,
        user_id:user_id
      },
      success:function(t){
        console.log("----领取成功----",)
        1 == t.data ?(
          wx.showToast({
            title: '领取成功'
          }),
          o.reload()
        ) 
         : wx.showToast({
          title: '领取失败'
        })
      }
    })
  },

  kindToggle: function (t) {
    console.log("======t是什么=====",t)
    var id = t.currentTarget.dataset.id;
    var that = this;
    var temBasic = this.data.show1 ? !this.data.show1 : !this.data.show1;
    this.data.show1 = temBasic
    this.setData({
      open: id,
      show: !temBasic
    })
  },

  toUse:function(t){
    var id = t.currentTarget.dataset.id,
      type = t.currentTarget.dataset.type;
    wx.navigateTo({
      url: '../seller/showGoods?coupons_id=' + id + "&coupons_type=" + type,
    })
  },

  reload:function(){
    var o = this;
    var user_id = wx.getStorageSync("users").id;
    app.util.request({
      url: "entry/exapp/getCoupons",//获取店铺内所有优惠券
      // wx.request({
      //   url: 'http://192.168.10.4:7300/mock/5b782535bfe92705006efea3/wxapp/Mycoupons',
      data: {
        user_id: user_id
      },
      success: function (t) {
        console.log("-----返回成功-----", t)
        console.log(t.data)
        o.setData({
          ptarr: t.data
        });
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.setNavigationBarColor(this);
    var o= this;
    var user_id = wx.getStorageSync("users").id;
    app.util.request({
      url:"entry/exapp/getCoupons",//获取店铺内所有优惠券
    // wx.request({
    //   url: 'http://192.168.10.4:7300/mock/5b782535bfe92705006efea3/wxapp/Mycoupons',
      data:{
        user_id:user_id
      },
      success:function(t){
        console.log("-----返回成功-----",t)
        console.log(t.data)
          o.setData({
            ptarr: t.data,
            isloading: !1
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
  onShow: function (options) {
    
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