

 var app = getApp(),
   count = 0,
     imgArray = [],
siteinfo = require("../../../siteinfo.js");

Page({
  data: {
    images:[],
    sctp: !1,
    array: ['付款金额错误', '未到店消费', '付错商家', '商家不接待', '消费不满意', '其他'],
    objectArray: [
      {
        id: 0,
        name: '付款金额错误'
      },
      {
        id: 1,
        name: '未到店消费'
      },
      {
        id: 2,
        name: '付错商家'
      },
      {
        id: 3,
        name: '商家不接待'
      },
       {
        id: 4,
         name: '消费不满意'
      },
       {
        id: 5,
         name: '其他'
      }
    ],
    index: 0,
  },

  bindPickerChange(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },

  sctp: function () {
    console.log("=======this.setData=======", this)
    this.setData({
      sctp: !0
    });
  },

  chooseImage: function (t) {
    var o = this,
      e = this.data.images,
      a = e.length;
    console.log("========e是什么==========", this.data),
      wx.chooseImage({
        count: 3 - a,
        success: function (t) {
          e = e.concat(t.tempFilePaths),
            o.setData({
              images: e
            }), console.log(e);
        }
      });
  },

  deleteImage: function (t) {
    var o = t.currentTarget.dataset.index,
      e = this.data.images;
    console.log(o),
      e.splice(o, 1),
      this.setData({
        images: e
      }), console.log(e);
  },

  optionTap(e) {
    let Index = e.currentTarget.dataset.index;
    this.setData({
      index: Index,
      show: !this.data.show
    });
  },

  onLoad: function(t){
    app.setNavigationBarColor(this);
    var a = this,
    o = wx.getStorageSync("users").id,
    c = wx.getStorageSync("order_id");

    app.util.request({
      url:'entry/wxapp/applyrefund',    
    // wx.request({
    //   url: 'http://192.168.10.4:7300/mock/5bc5de72363a0e050d79bce0/example/Application',
      cachetime: "0",
      data:{
        user_id: o,
        order_id: c
      },
      success: function (t) {
         a.setData({
           prefundamount: t.data.mrefundamount,
           pbuytime: t.data.mbuytime,
           pordernumber: t.data.mordernumber,
        });
      }   
    })
  },

  refundinstruct:function(t) {
   this.setData({
      tknr: t.detail.value
    });
    console.log("-----t退款内容", t)
  },

  phone:function(t){
     this.setData({
       phone: t.detail.value
     });
    console.log("-----t手机号", t)
  },

  submission: function (t) {
    var a = wx.getStorageSync("users").id,
      b = this.data.prefundamount,
      c = this.data.pbuytime,
      d = wx.getStorageSync("order_id"),
      e = this.data.array[this.data.index],
      f = this.data.tknr,
      g = this.data.images,
      h = this.data.phone;
    wx.setStorageSync("tkReason", e);
    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;

        console.log("--------sqtk中t.data------",this);

        if(console.log("--------abcdefgh---------------",a,b,c,d,e,f,h), 0 ==e) wx.showModal({
          title: '提示',
          content: '请选择退款原因',
        }); 
        else if (null == f || "" == f) wx.showModal({
          title: '提示',
          content: '请输入退款内容',
        }); 
        else if (null == h || 0 == h ){
          wx.showModal({
            title: '提示',
            content: '请输入手机号',
          })
        }else if (h.length != 11){
          wx.showModal({
            title: '提示',
            content: '手机号长度有误！',
          })
            return false;
        } else if (!myreg.test(h)) {
          wx.showModal({
            title: '提示',
            content: '手机号有误！',
          })
            return false;
          }
          else{
          var s = function(){
            console.log("请求接口", imgArray, imgArray.toString()),
            app.util.request({
              url:'entry/wxapp/Appsubmission',
              // wx.request({
              // url: 'http://192.168.10.4:7300/mock/5bc5de72363a0e050d79bce0/example/appsubmission', //1
              cachetime: "0",
              data:{
                userid: a,
                mrefundamount: b,
                mbuytime: c,
                order_id: d,
                tk_reason: e,
                tknr: f,
                images: g.toString(),
                phone: h,
              },
              success:function(t){
                "1" == t.data && (wx.showModal({
                  title: "提示",
                  content: "提交成功"
                }), setTimeout(function () {
                  wx.reLaunch({
                    url: "order?status=11"
                  });
                  })),
                  console.log("Appsubmission", t.data);
                  
              }
              })
           
          };
          wx.showLoading({
            title: "正在提交",
            mask: !0
          });
          0 == g.length ? s() : function t(a) {
            var d = a.g ? a.g : 0, 
            c = a.success ? a.success : 0, 
            f = a.fail ? a.fail : 0;
            wx.uploadFile({
              url: a.url,
              filePath: a.path[d],
              name: "upfile",
              formData: null,
              success: function (t) {
                "" != t.data ? (console.log(t), 
                c++ , 
                imgArray.push(t.data), 
                console.log(g), 
                console.log("图片数组", imgArray)) : wx.showToast({
                  icon: "loading",
                  title: "请重试"
                });
              },
              fail: function (t) {
                f++ , console.log("fail:" + d + "fail:" + f);
              },
              complete: function () {
                console.log(g), ++d == a.path.length ? (wx.hideToast(), console.log("执行完毕"), s(),
                  console.log("成功：" + d + " 失败：" + f)) : (console.log(d), a.g = d, a.success = d,
                    a.fail = f, t(a));
              }
            });
            }({
              url: siteinfo.siteroot + "?g=" + siteinfo.uniacid + "&c=entry&a=wxapp&do=upload&m=zh_cjdianc",
              path: g
            });
        }


       

  },


})