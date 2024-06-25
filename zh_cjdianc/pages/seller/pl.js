// zh_cjdianc/pages/seller/pl.js
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
       pagenum: 0,
       pinglun:[],
       plimages:[],
       mygd: !1

  },
 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (t) {
    app.setNavigationBarColor(this);
    // var n=this,
    // e=wx.getStorageInfoSync("user").id;
    let isadd = wx.getStorageSync("isadd")||[];
    // console.log("111111111111155-----------------------------" ,isadd)
    let n = this,
    p = this.data.pagenum;
     app.util.request({
        url: "entry/wxapp/pl",
    // wx.request({
      // url: 'http://192.168.10.4:7300/mock/5b99d46d1bb1360514d591f4/example/pl',
      //  url:'http://192.168.10.4:7300/mock/5bc5de72363a0e050d79bce0/example/comment',
      cachetime: "0",
      data: {
        id:isadd,
        page: p,
        pagesize: 10
      },
      success: function(t){
        /////////////////////////////////////////////////
        console.log("11111111111111111411111111",isadd)
        t.data.length < 10 ? n.setData({
          mygd: !0,//true
          jzgd: !0,
        }) : n.setData({
          jzgd: !0, //原：!0
          // mygd:!0,
          pagenum: n.data.pagenum + 1
        });
        var e = n.data.pinglun;
        console.log("???????????????????//////////--------", n.data.pinglun)
        e = function (t) {                              //e.indexOf(t[a])没有就是-1
          for (var e = [], a = 0; a < t.length; a++) -1 == e.indexOf(t[a]) && e.push(t[a]);
          return e;
        }(e = e.concat(t.data)),
          n.setData({
            pinglun: e,            
          }), 
          console.log("--------8888888888-----", e);
      }
    })
        for (let item of t.data) {
          if (isadd.length == 0){
            item.isadd = 0;
          }else{
            for (let temp of isadd) {
              item.isadd = 0;
            }
            for (let temp of isadd) {
              if (item.id == temp) {
                item.isadd = 1;
              } 
            }
          }
        }
        console.log(t.data)
    /////////////////////////////////////////////////
        n.setData({
          pinglun : t.data,
          isadd : isadd
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
  onPullDownRefresh: function () {},
  onReachBottom: function () {
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log("上拉加载", this.data.pagenum);
    !this.data.mygd && this.data.jzgd && (this.setData({//mygd是false jzgd是true
      jzgd: !1 //false
    }), this.onLoad());
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})