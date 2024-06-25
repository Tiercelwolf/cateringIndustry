var app = getApp(), 
count = 0, 
imgArray = [], 
siteinfo = require("../../../siteinfo.js");

Page({
    data: {
    userStars: [
      '../../img/full-star.png',
      '../../img/no-star.png',
      '../../img/no-star.png',
      '../../img/no-star.png',
      '../../img/no-star.png'],
      wjxScore:1,
        key: 0,
        images:[],
        sctp: !1,
        src: ""
    }, 

  starTap: function (e) {
    var that = this;
    var index = e.currentTarget.dataset.index; 
    var tempUserStars = this.data.userStars;
    var len = tempUserStars.length;
    for (var i = 0; i < len; i++) {
      if (i <= index) {
        tempUserStars[i] = '../../img/full-star.png'
        that.setData({
          wjxScore: i + 1,
        })
      } else {
        tempUserStars[i] = '../../img/no-star.png'
      }
    }
    this.setData({
      userStars: tempUserStars
    })
  }, 
    
   

    onLoad: function(t) {
        app.setNavigationBarColor(this);
        var o = this, 
        e = wx.getStorageSync("users");
        console.log("------t-------e------",t, e), 
        o.setData({
            order_id: t.oid
        }), wx.showLoading({
            title: "正在加载",
            mask: !0
        }), 
        app.util.request({
            url: "entry/wxapp/OrderInfo",
          //   wx.request({
          // url: 'http://192.168.10.4:7300/mock/5b782535bfe92705006efea3/wxapp/orderinfo',
            data: {
                order_id: t.oid
            },
            success: function(t) {
               wx.hideLoading(),
                console.log(t), 
                o.setData({
                    good: t.data.good,
                    orderinfo: t.data
                });
            }
        });
    },

    contentInput: function(t) {
        this.setData({
            pjnr: t.detail.value
        });
      console.log("-----评价内容", t.detail.value);
      console.log("-----ttt----", t);
    },
 
  sctp: function () {
    console.log("=======this.setData=======",this.setData)
    this.setData({
      sctp: !0
    });
  },

    chooseImage: function(t) {
        var o = this, 
        e = this.data.images, 
        a = e.length;
        console.log("=====e是什么=========",this.data), 
        wx.chooseImage({
            count: 3 - a,
            sizeType: ['original', 'compressed'],  
            sourceType: ['album', 'camera'],
         success: function(t) {
             e = e.concat(t.tempFilePaths), 
             o.setData({
                 images: e
            }), console.log(e);
         }
       });
    },

    deleteImage: function(t) {
        var o = t.currentTarget.dataset.index, 
        e = this.data.images;
        console.log(o), 
        e.splice(o, 1), 
        this.setData({
            images: e
        }), console.log(e);
    },

  commentSubmit: function (t) {
    var o = wx.getStorageSync("users").id,
      e = this.data.orderinfo.store.id,
      a = this.data.order_id,
      n = this.data.pjnr,
      s = this.data.wjxScore,
      i = this.data.images;
      console.log("-------this.data----------",this.data);
    if (console.log("-----------评分-------",a, o, e, n, s, i, ), 0 == s) wx.showModal({
      title: "提示",
      content: "请选择评分"
    }); else if (null == n || "" == n) wx.showModal({
      title: "提示",
      content: "请输入评价内容"
    }); else {
      var c = function () {
        console.log("请求接口", imgArray, imgArray.toString()),
          app.util.request({
            url: "entry/wxapp/Assess",
            // wx.request({
            // url: 'http://192.168.10.4:7300/mock/5b782535bfe92705006efea3/wxapp/assess',
            cachetime: "0",
            data: {
              store_id: e,
              user_id: o,
              order_id: a,
              stars: s,
              content: n,
              img: i.toString(),              
            },
                      
            success: function (t) {
              "1" == t.data && (wx.showModal({
                title: "提示",
                content: "提交成功",
                cancelText: "取消",
                confirmText: "确定",
              }), setTimeout(function () {
                wx.reLaunch({
                  url: "order?status=7&&state=9"
                });
              },
               "2" ==t.data && (wx.showModal({
                 title: "提示",
                 content: "订单提交失败",
                 cancelText: "取消",
                 confirmText: "确定",
               })
               ))), 
              console.log("Assess", t.data);
            }
          });
      };
      wx.showLoading({
        title: "正在提交",
        mask: !0
      }), 
      0 == i.length ? c() : function t(o) {
        var e = o.i ? o.i : 0,         
        a = o.success ? o.success : 0,
         n = o.fail ? o.fail : 0;
        console.log("====oooooooo=====", e)
        wx.uploadFile({
          url: o.url, 
          filePath: o.path[e], 
          name: "upfile", 
          formData: null,  
          success: function (t) {
            "" != t.data ? (console.log("======t====",t), 
            a++ , 
            imgArray.push(t.data), 
            console.log("===e是什么======",e), 
            console.log("图片数组", imgArray)) : wx.showToast({
              icon: "loading",
              title: "请重试"
            });
          },
          fail: function (t) {
            n++ , console.log("fail:" + e + "fail:" + n);
          },
          complete: function () {
            console.log(e), ++e == o.path.length ? (wx.hideToast(), console.log("执行完毕"), c(),
              console.log("成功：" + a + " 失败：" + n)) : (console.log(e), o.i = e, o.success = a,
                o.fail = n, t(o));
          }
        });
      }({
        url: siteinfo.siteroot + "?i=" + siteinfo.uniacid + "&c=entry&a=wxapp&do=upload&m=zh_cjdianc",
        path: i
      });
    }
  },

    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {}
});