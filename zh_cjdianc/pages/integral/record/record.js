var app = getApp();

Page({
  data: {
    pagenum: 0,
    score: []
  },
  onLoad: function (n) {
    wx.hideShareMenu({}), //wx.hideShareMenu隐藏转发按钮
      app.setNavigationBarColor(this);
    var o = this,
      t = wx.getStorageSync("users").id,
      p = this.data.pagenum;
    wx.getStorageSync("url");
    app.util.request({
      url: "entry/wxapp/Dhmx",
      // wx.request({
      //  url: 'http://192.168.10.4:7300/mock/5b782535bfe92705006efea3/wxapp/dhmx',
      cachetime: "0",
      data: {
        user_id: t,
        page: p,
        pagesize: 10,
      },
      success: function (n) {
        console.log("分页返回的列表数据", n.data),
          n.data.length < 10 ? o.setData({
            mygd: !0,//true
            jzgd: !0,
          }) : o.setData({
            jzgd: !0,  //原：!0
            pagenum: o.data.pagenum + 1,
          });
        var e = o.data.score;
        console.log("---################---------", o.data.score)
        e = function (t) {
          for (var e = [], a = 0; a < t.length; a++) -1 == e.indexOf(t[a]) && e.push(t[a]);
          return e;
        }(e = e.concat(n.data)),
          o.setData({
            score: e
          }), console.log("-------什么鬼-------", e);
        // var time = n.data.time;
        // var time;
        // var score = wx.getStorageSync('score');
        // for(var index in n.data){
        //   // time: n.data[index].time
        //   console.log("-----------===========$$$$$$$",index)
        //   for (var i = 0; i < score.length; i++){
        //     time = score[i].time;
        //     console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%",time)
        //   }
        // }
        // console.log("------------=============@@@@@@@@@@@@@", n.data[index].time),


        // console.log("------------",n), 
        // o.setData({
        //     score: n.data,
        //     // time: n.data.time,
        // });
      }
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