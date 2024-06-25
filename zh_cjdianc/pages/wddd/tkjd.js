
var app = getApp();
Page({
  data: {

  },

  onLoad: function (t) {
    app.setNavigationBarColor(this);
    var a = this,
        o = wx.getStorageSync("users").id,
        d = this.data.status,
        c = wx.getStorageSync("order_id"),
        lastrsn = wx.getStorageSync("lastrsn");

        console.log("======tkjdonload()========",o,d,c,lastrsn,a);
        if(d == 3){
         a.setData({
           hidden:false
         })
        }
    if (lastrsn == 2) {
      a.setData({
        hidden: false
      })
    }
                    
    app.util.request({
      url:"entry/wxapp/Refschedule",   
    // wx.request({
    //   url: 'http://192.168.10.4:7300/mock/5bc5de72363a0e050d79bce0/example/Refundprogress',
      cachetime: "0",
      data:{
         user_id: o,
         order_id: c,
      },
      success: function(t){
        a.setData({       
          Refundamount: t.data.Refundamount,
          status:t.data.status,
          Timesubmission: t.data.Timesubmission,
          Completiontime: t.data.Completiontime,     
          lastrsn: lastrsn
        });

      }
    })
    
  },



})