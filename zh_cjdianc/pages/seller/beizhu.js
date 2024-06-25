// zh_cjdianc/pages/seller/beizhu.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    noteMaxLen : 50,
    currentNoteLen : 0
  },
  // 按钮
  push: function(e){
    var arr = [];
    for(let item of this.data.option){
      item.select == true && (
        arr.push(item.name)
      )
    }
    console.log(e.detail.value)
    arr.push(e.detail.value.area)
    
    wx.setStorageSync("beizhu",arr)
    wx.navigateBack({
    })
    
    
  },
  // 选择
  option :function(e){
    var id = e.currentTarget.dataset.id;
    console.log(this.data.option)
    for(let item of this.data.option){
      item.id == id && (
        item.select = !item.select
      )
    }
    this.setData({
      option: this.data.option
    })
  },
  // 输入
  input : function(e){
    var value = e.detail.value,
      len = parseInt(value.length);
    let that = this;
    this.setData({
      currentNoteLen: len,
      value: value
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    var page = this;
    wx.request({
      url: 'http://192.168.10.4:7300/mock/5bcbb5bb363a0e050d79bd11/example/beizhu',
      success: function(res){
        var getBeizhu = wx.getStorageSync("beizhu")||[]
        var initValue = getBeizhu.pop()
        for (let item of getBeizhu){
          for(let temp of res.data){
            item == temp.name && (
              temp.select = true
            )
          }
        }
        page.setData({
          option : res.data,
          initValue: initValue
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