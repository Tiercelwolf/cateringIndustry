var app = getApp();

Page({
  data: {
    pagenum: 0,
    score: [],
    isloading: !0
  },
  onLoad: function (t) {
    wx.hideShareMenu({}),
      app.setNavigationBarColor(this);
    var n = this,
      e = wx.getStorageSync("users").id,
      p = this.data.pagenum;
    console.log(e),
      app.util.request({
        url: "entry/wxapp/Jfmx",
        // wx.request({
        // url: 'http://192.168.10.4:7300/mock/5b782535bfe92705006efea3/wxapp/Jfmx',
        // url:'http://192.168.10.4:7300/mock/5b997ec11bb1360514d591e2/example/text',//自编测试，可删
        cachetime: "0",
        data: {
          user_id: e,
          page: p,
          pagesize: 10
        },
        success: function (t) {
          console.log("分页返回的列表数据", t.data),
            t.data.length < 10 ? n.setData({
              mygd: !0,//true
              jzgd: !0,
            }) : n.setData({
              jzgd: !0,  //原：!0
              pagenum: n.data.pagenum + 1
            });
          var e = n.data.score;
          console.log("???????????????????//////////--------", n.data.score)
          e = function (t) {
            for (var e = [], a = 0; a < t.length; a++) -1 == e.indexOf(t[a]) && e.push(t[a]);
            return e;
          }(e = e.concat(t.data)),
            n.setData({
              score: e,
            }), console.log("--------8888888888-----", e);
        }
      }),
      app.util.request({
        url: "entry/wxapp/UserInfo",
        // wx.request({
        //   url: 'http://192.168.10.4:7300/mock/5b782535bfe92705006efea3/wxapp/UserInfo',
        cachetime: "0",
        data: {
          user_id: e
        },
        success: function (t) {
          console.log(t),
            n.setData({
              integral: t.data.total_score,
              isloading: !1
            });
        }
      });
  },
  tzjfsc: function () {
    wx.navigateTo({
      url: "integral"
    });
  },
  onReady: function () { },
  onShow: function () { },
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
