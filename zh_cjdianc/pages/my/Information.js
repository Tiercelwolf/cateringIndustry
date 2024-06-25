var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    date:"1990-01-01"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.setNavigationBarColor(this);
    var a = this,
    n = wx.getStorageSync("users").id;
    app.util.request({
      url: "entry/wxapp/UserInfo",
      data:{
        user_id: n
      },
    // wx.request({
    //   url: 'http://192.168.10.4:7300/mock/5b997ec11bb1360514d591e2/example/update/userInfo',
      success: function (t) {
        // 手机号码加密   
        // var tel = t.data.user_tel,
        // tele = tel.substr(0, 3) + '****' + tel.substr(7);
        a.setData({
          userInfo: t.data,
        })
      }
    })
  },

  // 日期
  bindDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date: e.detail.value
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