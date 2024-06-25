var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    pagenum: 0,
    pinglun: [],
    tabs: ["商品详情"],
    activeIndex: 0,
    // orderIndex:'',
    tjnum : 1,
    isloading: !0,
  },
   
  //加入购物车-----------------------------------------------------------
  jiacar: function (e) {
    var carinfo = wx.getStorageSync("carinfo") || [];
    var tuijian = wx.getStorageSync("tuijian");//推荐 index 中的数据
    var classIndexInfo = wx.getStorageSync("classIndexInfo");//分类 showGoods 中的数据
    var user_id = wx.getStorageSync("users").id;
    console.log("-----tuijian 推荐商品 describe.js -----",tuijian)
    console.log("-----classIndexInfo 分类商品 describe.js -----", classIndexInfo)
    this.setData({
      carinfo: carinfo
    })
    var id = wx.getStorageSync("tjspid");
    console.log("id----推荐的商品", id)
    var page = this;
    var distinguish = page.data.distinguish;
    if (distinguish == 1 || distinguish == "1"){
      for (var item of tuijian) {
        if (item.id == id) {
          item.num = item.num + 1;
          if (this.data.carinfo.length == 0) {
            console.log("第一次")
            console.log("-------this.data.tjnum-----------", this.data.tjnum)
            item.num = this.data.tjnum;//----推荐的数量
            // item.isselect = 1;
            this.data.carinfo.push(item)
            wx.setStorageSync("carinfo", page.data.carinfo)
            console.log("--第一次里面--this.data.carinfo--购物车--", this.data.carinfo)
          } else {
            var arr = [];
            for (var i of this.data.carinfo) {
              arr.push(i.id)
              console.log(arr)
              if (item.id == i.id) {
                console.log("循环")
                i.num = i.num + this.data.tjnum;
                // item.isselect = 1;
                wx.setStorageSync("carinfo", page.data.carinfo)
                console.log("--循环---第二次----", this.data.carinfo)
              }
            }
            if (arr.indexOf(item.id) == -1) {
              console.log("判断")
              item.num = this.data.tjnum;
              // item.isselect = 1;
              this.data.carinfo.push(item)
              wx.setStorageSync("carinfo", page.data.carinfo)
              console.log("--判断 第二次--------", this.data.carinfo)
            }
          }
        }
      }
    } else if (distinguish == 2 || distinguish == "2"){
      for (var item of classIndexInfo) {
        if (item.id == id) {
          item.num = item.num + 1;
          if (this.data.carinfo.length == 0) {
            console.log("第一次")
            console.log("-------this.data.tjnum-----------", this.data.tjnum)
            item.num = this.data.tjnum;//----推荐的数量
            // item.isselect = 1;
            this.data.carinfo.push(item)
            wx.setStorageSync("carinfo", page.data.carinfo)
            console.log("--第一次里面--this.data.carinfo--购物车--", this.data.carinfo)
          } else {
            var arr = [];
            for (var i of this.data.carinfo) {
              arr.push(i.id)
              console.log(arr)
              if (item.id == i.id) {
                console.log("循环")
                i.num = i.num + this.data.tjnum;
                // item.isselect = 1;
                wx.setStorageSync("carinfo", page.data.carinfo)
                console.log("--循环---第二次----", this.data.carinfo)
              }
            }
            if (arr.indexOf(item.id) == -1) {
              console.log("判断")
              item.num = this.data.tjnum;
              // item.isselect = 1;
              this.data.carinfo.push(item)
              wx.setStorageSync("carinfo", page.data.carinfo)
              console.log("--判断 第二次--------", this.data.carinfo)
            }
          }
        }
      }
    }else{
      console.log("数据获取错误！")
      wx.showModal({
        title: '提示',
        content: '数据获取错误！',
      })
    }
   
    this.setData({
      tjnum: 1,
      active: !this.data.active,
      canvas: !this.data.canvas
    })
   
    var carinfo = wx.getStorageSync("carinfo") || [];
    let newData = {
      carinfo: JSON.stringify(carinfo),
      user_id: user_id
    }
    console.log("--  JSON.stringify(carinfo)--- 商品详情 descrice.js --------", JSON.stringify(carinfo))
    app.util.request({
      url: 'entry/wxapp/shoppingCart',
      cachetime: "0",
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
      },
      method: 'POST',
      data: newData,
      success: function (t) {
        console.log("----我想看看这个t，存入购物车接口成功返回数据-----", t)
        wx.showToast({
          title: '加入购物车成功',
          duration: 2000,//提示的延迟时间，单位毫秒，默认：1500 
          success: function () {
            wx.navigateTo({
              url: 'car',
            })
          },
        })
      }
    })
  },

//立即购买-----------------------------------------------------------
  gobuy: function () {
    var user_id = wx.getStorageSync("users").id;
    var id = wx.getStorageSync("choose_id");
    console.log("-----立即购买商品的id-----", id)
    wx.redirectTo({
      url: '../takeout/takeoutform?orderIndex=' + this.data.orderIndex
    })
    console.log("发送  立即购买  数据  成功！")
  },

  gocar:function(){
    wx.navigateTo({
      url: 'car',
    })
  },

  tabClick: function (t) {
    this.setData({
      activeIndex: t.currentTarget.id
    });
  },

  preimg:function(e){
    var index = e.currentTarget.dataset.index;
    var imgArr = this.data.info.banner;
    wx.previewImage({
      current: imgArr[index],     //当前图片地址
      urls: imgArr,               //所有要预览的图片的地址集合 数组形式
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("-----onload 获取 预约标识-----",options.preinfo) //获取预约标识
    this.setData({
      preinfo: options.preinfo,
    })
    console.log("onload携带的id",options.id)//商品的id

    console.log("---获取distinguish的值  1是从首页 index 进来的  2是从商品列表 showGoods 进来的",options.distinguish)
    this.data.distinguish = options.distinguish;

    wx.setStorageSync("tjspid", options.id)

    app.setNavigationBarColor(this);
    var tuijian = wx.getStorageSync("tuijian"),
    c = wx.getStorageSync("users").id;
    console.log("----tuijian缓存的内容---",tuijian)
    for(var item of tuijian){
      console.log("----item.id--",item.id)
    }

    let isadd = wx.getStorageSync("isadd") || [];
    var page = this;
    let n = this,
    p = this.data.pagenum;
    app.util.request({
        url: "entry/wxapp/detail",
    // wx.request({
      // url: 'http://192.168.10.4:7300/mock/5b99d46d1bb1360514d591f4/example/xiangq',
      // url:'http://192.168.10.4:7300/mock/5bc5de72363a0e050d79bce0/example/isClick',
    data:{
      id: options.id, //商品的id
      userid:c,
   
    },
      success:function(res){
        console.log("-----res 返回成功之后的数据-----",res.data)
        console.log("-----detail 返回成功之后的数据-----",JSON.stringify(res));
        page.setData({
          info : res.data,
          goodsid: options.id,
          isClick:res.data.isClick,
          isloading: !1
        })
        console.log("--请求成功的数据--", res.data)

        var jsonObject = res.data;
        jsonObject.num = 1;//对象jsonObject中,添加属性num
        console.log("--------新的json-------送往提交订单页面---", jsonObject)

        var newgobuy = [];
        newgobuy.push(jsonObject);
        console.log("----转化为数组之后的数据----",newgobuy)

        for(var item of newgobuy){
          delete item.banner;
          delete item.detailImg;
          delete item.isClick;
          delete item.sjname;
          delete item.miaoshu;
          delete item.numnumber;
        }
        console.log("---删除之后的数据--newgobuy----",newgobuy)

        wx.setStorageSync("selectGoods", newgobuy)
      }
    })
  },

// 收藏
  haveSave:function(t){
    var a = this,
        c = wx.getStorageSync("users").id,
        clickId= t.currentTarget.dataset.goodsid,
        d = t.currentTarget.dataset.isclick
    console.log("=====this.data.isClick=====", d)
    if (d == 2){
     
      app.util.request({
         url: 'entry/wxapp/Collection',
        //  wx.request({
        //    url: 'http://192.168.10.4:7300/mock/5bc5de72363a0e050d79bce0/example/Collection',
           data: {
             user_id: c,
             goods_id: clickId,      
           },
             success: function (e) {
               "1" == e.data ? (wx.showToast({
                 title: '已收藏', 
               }),
               a.setData({
                 isClick: 1 
               })
               ) : wx.showToast({
                 title: "请重试",
                 icon: "loading",
                 duration: 1e3
               });
               }
         })
      console.log("=====已收藏this.data.isClick=====", d)
          
    } else if (d == 1){
      console.log("========收藏=========",d)
      app.util.request({
         url:'entry/wxapp/Cancelcollection',
      // wx.request({
      //   url: 'http://192.168.10.4:7300/mock/5bc5de72363a0e050d79bce0/example/Cancelcollection',
        data: {
           user_id: c,
           goods_id: clickId,
        },
           success:function(e){
             "1" == e.data ? (wx.showToast({
               title: '已取消',
             }),
             a.setData({
               isClick:2
             })
               
             ) : wx.showToast({
               title: "请重试",
               icon: "loading",
               duration: 1e3
             });
          }
      })
      console.log("========取消收藏=========", d)
        }else{
      console.log("数据错误")
        }
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
    console.log("上拉加载", this.data.pagenum);
    !this.data.mygd && this.data.jzgd && (this.setData({//mygd是false jzgd是true
      jzgd: !1 //false
    }), this.onLoad());
  },

  //分享
  onShareAppMessage: function () {
    return {
      title: '自定义分享标题',
      desc: '自定义分享描述',
      path: '/zh_cjdianc/pages/seller/describe'
    }
  }
})