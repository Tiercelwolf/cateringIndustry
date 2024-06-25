var app = getApp();

Page({
    data: {
      open: false,
      show1: false,
      isloading: !0,
    },

    qsy: function(t) {
      var id = t.currentTarget.dataset.id,
        full = t.currentTarget.dataset.full,
        reduce = t.currentTarget.dataset.reduce;
      console.log("---id---", id)

      if (this.data.use_type === "undefined" || typeof (this.data.use_type) === "undefined" || this.data.use_type === "") {
        wx.redirectTo({
          url: '/zh_cjdianc/pages/seller/showGoods?hyid=' + id + "&coupon_full=" + full + "&hboupon_reduce=" + reduce
        });
      } else {
        wx.redirectTo({
          url: '/zh_cjdianc/pages/takeout/takeoutform?hyid=' + id + "&coupon_full=" + full + "&hbcoupon_reduce=" + reduce + "&orderType_index=" + this.data.orderType_index
        })
      }       
    },

  kindToggle: function (t) {
    console.log("======t是什么=====", t)
    var id = t.currentTarget.dataset.id;
    var that = this;
    var temBasic = this.data.show1 ? !this.data.show1 : !this.data.show1;
    this.data.show1 = temBasic
    this.setData({
      open: id,
      show: !temBasic
    })
  },
  
    onLoad: function(t) {
      console.log("--红包--onload--获取到的 订单类型-",t.orderType_index)
      console.log("--- use_type==1 --标识，页面跳转至提交订单页面-",t.use_type)
      this.data.use_type = t.use_type;
      this.data.orderType_index = t.orderType_index;

        app.setNavigationBarColor(this), console.log(this);
        var o = this, a = wx.getStorageSync("users").id;
        app.util.request({
           url: "entry/wxapp/MyCoupons",
            //  wx.request({
            // url: 'http://192.168.10.4:7300/mock/5b782535bfe92705006efea3/wxapp/Mycoupons',
            // url:'http://192.168.10.4:7300/mock/5b997ec11bb1360514d591e2/example/ooo',//自编测试，可删
            cachetime: "0",
            data: {
                user_id: a  //id=8242,所以想要获取的是“平步青云”
            },

            success: function(t) {
                console.log(t.data);
                for (var a = [], e = [], n = 0; n < t.data.length; n++) 
                4 == t.data[n].type && e.push(t.data[n]);
                console.log("---hb--a--a--a---优惠券--",a, "--hb--e---e---e--红包--",e)
                o.setData({
                    ptarr: a,
                    sjarr: e,
                  isloading: !1,
                });
            }
        });
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {}
});