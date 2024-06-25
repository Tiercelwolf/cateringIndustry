var app = getApp(), util = require("../../utils/util.js");
Page({
  /**
   * 页面的初始数据
   */
  data: {
    name: '',
    storelist:[],
    mygd:1
  },
 
  formName: function (e) {
    this.data.name = e.detail.value
    var a = this
    var tmp = this.data.storelist.map(function (item) {
      if (item.name.indexOf(a.data.name) > -1) return item
    }).filter(function (item) {
      return item
    })
    this.setData({
      store_list: tmp
    })
  },

  searchstore:function(){
    var a = this;
    var tmp = this.data.storelist.map(function(item){
        if(item.name.indexOf(a.data.name) > -1) return item
    }).filter(function(item){
      return item
    })
    this.setData({
      store_list: tmp
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (t) {  
    
    app.setNavigationBarColor(this);
    console.log("=======切换分店t========",this)
    var that = this;
    console.log("-----------=========", that)

    app.util.request({
      url: "entry/wxapp/Switchingbranches",
    // wx.request({
    //   url: 'http://192.168.10.4:7300/mock/5b73e0340a8bfd0684ed71f0/example/storelist',  
    cachetime: "0",
    data: {
     
    },
    success:function(t){     
      console.log("======t.data=======",t)
      that.setData({
        store_list: t.data.storelist
      });
      that.data.storelist = t.data.storelist
    }
    }); 
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