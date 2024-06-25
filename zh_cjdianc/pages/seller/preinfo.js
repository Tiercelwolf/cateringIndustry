var app = getApp(), util = require("../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    date : "",
    time : "12:00",
    array: ["1人", "2人", "3人", "4人", "5人", "6人", "7人", "8人", "9人", "10人", "10人以上"],
    index: 1,
    jarray: ["大厅散座", "包间", "大厅散座+包间"],
    jindex: 1,
    selectone: 1,
    sex: 1,
    items: [{
      name: "先生",
      value: 1,
      checked: !0
    }, {
      name: "女士",
      value: 2,
    }],
    only: false,
  },

  //座位选择事件
  bindzuoweiChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      jindex: e.detail.value
    })
  },

  //日期选择事件
  bindDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date: e.detail.value
    })
  },

  //事件选择事件
  bindTimeChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      time: e.detail.value
    })
  },

  //人数选择事件
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },

  //性别选择事件
  radioChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      sex: e.detail.value
    })
  },

  //转到菜单选择
  goshowGoods: function () {
    wx.navigateTo({
      url: 'showGoods?state=1' + '&preinfo=' + this.data.preinfo + "&pppreinfo=1"
    })
  },

  //联系人
  lxr: function (e) {
    this.setData({
      lxr: e.detail.value
    })
  },

  // 电话号码
  iphone: function (e) {
    this.setData({
      iphone: e.detail.value
    })
  },

  //备注
  beizhu: function (e) {
    this.setData({
      beizhu: e.detail.value
    })
  },

  //立即预约按钮事件
  formSubmit: function () {
    var e = this,
      a = wx.getStorageSync("users").id;//用户id
      // carinfo = wx.getStorageSync("carinfo");//在购物车里获取信息
      // carinfo = e.data.carinfo;
      if(e.data.only == false){
        var carinfo = [];
      }else{
        var carinfo = wx.getStorageSync("carinfo");
      }
    console.log("----------预约的积分 000000====---------", e.data.getIntegral)
    let newData = {
      user_id: a,
      zuowei: e.data.jindex,//选择座位
      preprice: e.data.preprice,//座位预定费用（定金）
      data: e.data.date,//选择日期
      time: e.data.time,//选择时间-----------`
      people: e.data.index,//选择人数
      lxr: e.data.lxr,//联系人姓名
      sex: e.data.sex,//性别
      iphone: e.data.iphone,//联系号码
      carinfo: JSON.stringify(carinfo),
      price: e.data.price,//商品的总价
      beizhu: e.data.beizhu,//备注
      getIntegral: e.data.getIntegral
    }

    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    if (e.data.jindex == "" || e.data.jindex == null) wx.showModal({
      title: '提示',
      content: '请选择座位',
    });
    else if (e.data.date == "" || e.data.date == null) wx.showModal({
      title: '提示',
      content: '请选择日期',
    });
    else if (e.data.time == "" || e.data.time == null) wx.showModal({
      title: '提示',
      content: '请选择到店时间',
    });
    else if (e.data.index == "" || e.data.index == null) wx.showModal({
      title: '提示',
      content: '请选择人数',
    });
    else if (e.data.lxr == "" || e.data.lxr == null) wx.showModal({
      title: '提示',
      content: '请选择联系人',
    });
    else if (e.data.iphone == 0 || e.data.iphone == null) wx.showModal({
      title: '提示',
      content: '请输入电话号码',
    });
    else if (e.data.iphone.length != 11) {
      wx.showModal({
        title: '提示',
        content: '电话号码长度有误',
      })
      return false;
    }
    else if (!myreg.test(e.data.iphone)) {
      wx.showModal({
        title: '提示',
        content: '电话号码格式有误',
      })
      return false;
    }
    else {
      app.util.request({
        url: "entry/wxapp/reservation",//预约订座的接口
        header: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
        },
        method: 'POST',
        cachetime: "0",
        data: newData,
        success: function (e) {
          console.log("--------------------", e.data);
          wx.redirectTo({
            url: '../reserve/order?state=1'
          })
        }
      })
    }
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (res) {
    console.log("----预约订单的标识----", res.preinfo)
    this.data.preinfo = res.preinfo;

    app.setNavigationBarColor(this);
    // this.select1();
    
    let carinfo = wx.getStorageSync("carinfo");
    this.data.carinfo = carinfo;
    let price = 0;
    var o = util.formatTime(new Date()).substring(0, 10).replace(/\//g, "-");
    var z = Date.parse(new Date());
    //返回当前时间毫秒数
    for (let item of carinfo) {
      price = price + item.price * item.num
    }
    var getIntegral = price * 0.1;
    getIntegral = getIntegral.toFixed(2)
    this.data.getIntegral = parseInt(getIntegral);
    console.log("----------预约的积分  转化为int  积分", this.data.getIntegral)
    console.log("--------------------carinfo----------------------------", carinfo)
    let ydmoney1 = wx.getStorageSync("ydmoney1");
    console.log("-------ydmoney1---------", ydmoney1)
    this.setData({
      date: o,
      preindex: res.selectpre,
      preprice: ydmoney1,
      // carinfo: carinfo,
      carinfo: this.data.carinfo,
      price: price,
      getIntegral: this.data.getIntegral
    })
  },

  select1: function () {
    this.setData({
      selectone: 1,
      carinfo: []
    })
  },
  select2: function () {
    this.data.only = true;
    this.setData({
      selectone: 2
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
    let carinfo = wx.getStorageSync("carinfo");
    let price = 0;
    for (let item of carinfo) {
      price = price + item.price * item.num
    }

    var getIntegral = price * 0.1;
    getIntegral = getIntegral.toFixed(2)
    this.data.getIntegral = parseInt(getIntegral);
    console.log("----------预约的积分  转化为int  积分", this.data.getIntegral)

    this.setData({
      carinfo: carinfo,
      price: price,
      getIntegral: this.data.getIntegral
    })
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
