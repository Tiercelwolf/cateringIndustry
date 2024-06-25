var fakeData = require('../commons/monrydata.js');
var app = getApp();

Page({
  data: {
    score: [],
    categories: [
      {
        id: 1,
        name: '全部'
      },
      {
        id: 2,
        name: '充值'
      },
      {
        id: 3,
        name: '支付成功'
      },
      // {
      //   id: 4,
      //   name: '积分兑换'
      // },
      {
        id: 4,
        name: '商家退款'
      }
    ],
    currentTab: 0,
    index: 0,
    scrollLeftValue: 0,
    isPickerShow: false
  },

  reLoad: function (n) {
    var a,
      t = this,
      o = wx.getStorageSync("users").id,
      e = this.data.status || 1;
      1 == e && (a = "1"), //全部
      2 == e && (a = "2"), //充值
      3 == e && (a = "3"), //支付成功
      4 == e && (a = "4"), //积分兑换
      5 == e && (a = "5"), //商家退款
      app.util.request({
        url: "entry/wxapp/Qbmx",
        // wx.request({
        // // url: 'http://192.168.10.4:7300/mock/5b782535bfe92705006efea3/wxapp/Qbmx',
        // url: 'http://192.168.10.4:7300/mock/5b997ec11bb1360514d591e2/example/jymx',
        cachetime: "0",
        data: {
          user_id: o,
          mx_type: a,
        },
        success: function (n) {
          console.log("分页返回的列表数据", n.data)
          var e = [];
          e = function (t) {
           for (var e = [], a = 0; a < t.length; a++) -1 == e.indexOf(t[a]) && e.push(t[a]);
            return e;
          }(e = e.concat(n.data)),
            t.setData({
              score: n.data,
              mygd: !0,
              status: 1
            }),

            t.data.scorelist = e, 
            console.log("-------交易明细  e-------", e);
        }
      });

      t.setData({
        mygd: !1,//false
      })
    
  },

  tzjfsc: function () {
    wx.redirectTo({
      url: "../integral/integral"
    });
  },

  details: function (t) {
    var id = t.currentTarget.dataset.id;

    wx.navigateTo({
      url: "details?id=" + id
    })
  },

  navbarTap: function (e) {
    //将顶部导航栏自动移动到合适的位置
    var idx = e.currentTarget.dataset.idx;
    this.autoScrollTopNav(idx);
    var tmp = this.data.scorelist.map(function (item) {
      if ((item.mx_type == (idx + 1) || (idx == 0))) return item
    }).filter(function (item) {
      return item
    })
    this.setData({
      score: tmp,
      currentTab: idx
    })
  },

  /**
   * 页面左右滑动事件 - 构造滑动动画，若当前页面无数据，自动加载，需要完善加载函数
   */
  swiperChange: function (e) {
    var idx = e.detail.current;
    this.autoScrollTopNav(idx);

    var tmp = this.data.scorelist.map(function (item) {
      if ((item.mx_type == (idx + 1) || (idx == 0))) return item
    }).filter(function (item) {
      return item
    })
    this.setData({
      currentTab: e.detail.current,
      score: tmp
    })
  },


  /**
   * 用于自动调整顶部类别滑动栏滑动距离，使滑动到用户可接受的合适位置，但自适应上还未考虑太周到
   * @param {number} idx - The index of currentTap.
   */
  autoScrollTopNav: function (idx) {
    this.data.scrollLeftValue = 0;
    this.setData({
      scrollLeftValue: this.data.scrollLeftValue
    })
  },


  onLoad: function (n) {
    wx.hideShareMenu({}),
      app.setNavigationBarColor(this);
    this.reLoad();
    var a = this;
    let scrollHeight = wx.getSystemInfoSync().windowHeight;
    console.log("-------------scrollHeight---------------", scrollHeight)
    a.setData({
      scrollHeight: scrollHeight
    });


  },

  onReady: function () { },
  onShow: function () { },
  onHide: function () { },
  onUnload: function () { },
  onShareAppMessage: function () { }
});