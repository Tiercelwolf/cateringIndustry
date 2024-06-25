var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("---id---",options.id)
    this.data.id = options.id;

    app.setNavigationBarColor(this);
    var a = this,
    o = wx.getStorageSync("users").id;
    app.util.request({
      url:"entry/wxapp/jymxDetails",
    // wx.request({
    //   url:"http://192.168.10.4:7300/mock/5b997ec11bb1360514d591e2/example/update/details",
      data:{
        id: this.data.id
      },
      success:function(t){ 
        console.log("---------------------",t.data),
        a.setData({
          time: t.data.time,
          money:t.data.money,
          type:t.data.type,
          order_type:t.data.order_type,
          order_num: t.data.order_num
        })
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