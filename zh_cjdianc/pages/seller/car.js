var app = getApp();

Page({
  /**--
   * 页面的初始数据
   */
  data: {
    activeIndex: 1, //2配送、1自提
    allisselect:0 ,
    orderIndex:''
  },

  // 结算
  goodsjs : function(){ 
    var user_id = wx.getStorageSync("users").id,
    carinfo = wx.getStorageSync("carinfo"),//获取购物车内所有商品信息
    selectGoods = wx.getStorageSync("selectGoods");//选中的商品
    console.log("-----已经勾选准备结算的商品-------",selectGoods)
        wx.navigateTo({
          url: '../takeout/takeoutform?orderIndex=' + this.data.orderIndex + "&order_id=" + this.data.order_id + "&order_type=" + this.data.order_type
        })
  },
  
  // 自提
  activeIndex1 : function(){
    this.setData({
      activeIndex: 1,
      sfjs : 1
    })
  },

  // 配送
  activeIndex2: function () {
    if(this.data.zj - 10 >= 0){  
      this.setData({
        activeIndex: 2,
        sfjs: 1 //true
      })
    } else {
      var cha = 10 - this.data.zj
      cha = cha.toFixed(2)
      this.setData({
        activeIndex: 2,
        sfjs: 0,
        cha: cha
      })
    }
  },
  
  // 删除单个商品
  cha : function(e){
    var page = this;
    var timestamp = Math.round(new Date()/1000);
    var expiration = timestamp + 3600;//120秒

    wx.showModal({
      title: '删除',
      content: '确定删除此件商品',
      success: function(res){
        if(res.confirm){
          var index;
          var id = e.currentTarget.dataset.id;
          console.log("cha---car.js中---删除--", page.data.carinfo)
          for (var item of page.data.carinfo) {
            item.id == id && (
              index = page.data.carinfo.indexOf(item),
              page.data.carinfo.splice(index, 1),

              wx.setStorageSync("carinfo_expiration", expiration),
              wx.setStorageSync("carinfo", page.data.carinfo),
              
              page.setData({
                carinfo: page.data.carinfo
              }),
              page.js(),
              page.activeIndex2()
            )
          }
          wx.showToast({
            title: '删除成功',
            duration : 2000,
            success:function(t){
              console.log("-----删除菜单之后的操作，向后台发送购物新车请求-----")
              var carinfo = wx.getStorageSync("carinfo");
              var user_id = wx.getStorageSync("users").id;
              console.log("---carinfo-cha---   删除成功  --数据之购物车", carinfo)
              console.log("---user_id---用户id", user_id)

              let newData = {
                carinfo: JSON.stringify(carinfo),
                user_id: user_id
              }
              console.log("--是对的吗，--------------", JSON.stringify(carinfo))
              app.util.request({
                url: 'entry/wxapp/shoppingCart',
                cachetime: "0",
                header: {
                  'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
                },
                method: 'POST',
                data: newData,
                success: function (t) {
                  console.log("----我想看看这个t，购物车接口成功返回数据-----", t)
                  console.log(1)
                }
              })
            }
          })
        }else if(res.cancel){
          wx.showToast({
            title: '取消删除',
            duration: 2000
          })
        }
      }
    }) 
  },

  // 部分删除
  deletion: function (e) {
    console.log("------------部分删除操作--------")
    var index;
    var user_id = wx.getStorageSync("users").id;
    console.log("----删除之前的操作---购物车---勾选删除---",this.data.carinfo)
    console.log("this.data.carinfo.length-------------",this.data.carinfo.length);
    for (let i = this.data.carinfo.length - 1; i >= 0; i--) {
      console.log('==========out====', i);
      console.log("--------------9999999999999------",this.data.carinfo[i]);
      if (this.data.carinfo[i].isselect == true) {
        console.log('-----int---', i);
        this.data.carinfo.splice(i, 1)
        this.js(),
        this.activeIndex2()    
      }
    }
    wx.setStorageSync("carinfo", this.data.carinfo),
    console.log("-- for 循环之外 carinfo-勾选删除之后的购物车 deletion ---", this.data.carinfo)
    let newData = {
      carinfo: JSON.stringify(this.data.carinfo),
      user_id: user_id
    }
    app.util.request({
      url: 'entry/wxapp/shoppingCart',
      cachetime: "0",
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
      },
      method: 'POST',
      data: newData,
      success: function (t) {
        console.log("----我想看看这个t，删除之后发送到后台的数据-----", t)
        console.log(1)
        wx.showToast({
          title: '删除成功',
          icon: 'success',
          duration: 1000
        })
        setTimeout(function () {
          wx.hideToast()
        }, 2000)
      }
    })

    this.setData({
      carinfo: this.data.carinfo
    })  
  },

 

  // 对号处理函数
  selectmenu : function(e){
    var id = e.currentTarget.dataset.id;
    var temp = this.data.carinfo;
    for (var item of temp){
      item.id == id && (
        item.isselect = !item.isselect
      )
    }
    this.setData({
      carinfo: temp
    })
    this.pdqx()
    this.js()
    if (this.data.activeIndex == 2) {
      this.activeIndex2()
    }  
  },
  
  // 加
  jia : function(e){
    var id = e.currentTarget.dataset.id;
    var temp = this.data.carinfo;
    var timestamp = Math.round(new Date()/1000);
    var expiration = timestamp + 3600;

    for (var item of temp) {
      item.id == id && (
        item.num = item.num + 1
      )
    }
    this.setData({
      carinfo: temp
    })

    wx.setStorageSync("carinfo_expiration", expiration),
    wx.setStorageSync("carinfo", this.data.carinfo)
    console.log("---carinfo--jia--------数据之购物车", this.data.carinfo)
    var carinfo = wx.getStorageSync("carinfo");
    var user_id = wx.getStorageSync("users").id;
    console.log("-jia--carinfo---数据之购物车", carinfo)
    console.log("---user_id---用户id", user_id)
    let newData = {
      carinfo: JSON.stringify(carinfo),
      user_id: user_id
    }
    console.log("--是对的吗，--------------", JSON.stringify(carinfo))
    app.util.request({
      url: 'entry/wxapp/shoppingCart',
      cachetime: "0",
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
      },
      method: 'POST',
      data: newData,
      success: function (t) {
        console.log("----我想看看这个t，购物车接口成功返回数据-----", t)
      }
    })

    console.log(wx.getStorageSync("carinfo"))
    this.js()
    if (this.data.activeIndex == 2) {
      this.activeIndex2()
    }
  },
  // 减
  jian: function (e) {
    var id = e.currentTarget.dataset.id;
    var temp = this.data.carinfo;

    var timestamp = Math.round(new Date()/1000);
    var expiration = timestamp + 3600;//120秒
    console.log("--减 当前时间---", timestamp)
    console.log("--减 缓存时间---", expiration)
    for (var item of temp) {
      item.id == id &&(item.num>=2)&&(
        item.num = item.num - 1,
        (item.num == 1) && (
          wx.showModal({
            title: '提示',
            content: '商品数量不能小于1',
          })
        )
      )
    }
    this.setData({
      carinfo: temp
    })

    wx.setStorageSync("carinfo_expiration", expiration),
    wx.setStorageSync("carinfo", this.data.carinfo)
    console.log("---carinfo--jian--------数据之购物车", this.data.carinfo)

    var carinfo = wx.getStorageSync("carinfo");
    var user_id = wx.getStorageSync("users").id;
    console.log("-jian--carinfo---数据之购物车", carinfo)
    console.log("---user_id---用户id", user_id)

    let newData = {
      carinfo: JSON.stringify(carinfo),
      user_id: user_id
    }
    console.log("--是对的吗，--------------", JSON.stringify(carinfo))
    app.util.request({ 
      url: 'entry/wxapp/shoppingCart',
      cachetime: "0",
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
      },
      method: 'POST',
      data: newData,
      success: function (t) {
        console.log("----我想看看这个t，购物车接口成功返回数据-----", t)
        console.log(1)
      }
    })

    console.log(wx.getStorageSync("carinfo"))
    this.js()
    if (this.data.activeIndex == 2) {
      this.activeIndex2()
    }
  },
  // 主动全选按钮
  qx : function(){
    this.setData({
      allisselect: !this.data.allisselect
    })
    var temp = this.data.carinfo;
    if (this.data.allisselect==0){
      for (var item of temp) {
        item.isselect = 0
      }
      this.setData({
        carinfo: temp
      })  
    }
    if (this.data.allisselect == 1) {
      for (var item of temp) {
        item.isselect = 1
      }
      this.setData({
        carinfo: temp
      })
    }
    this.js()
    if (this.data.activeIndex == 2) {
      this.activeIndex2()
    }
  },

  // 判断是否全选处理函数
  pdqx : function(){
    var temp = this.data.carinfo;
    this.setData({
      allisselect: 1
    })
    for (var item of temp) {
      console.log("---选择去结算的商品数据---",item)
      item.isselect == 0 && (
        this.setData({
          allisselect : 0
        })
      )
      console.log("-----选择----item.isselect---选择【0:false】&选择【1:true】---",item.isselect)
    }
  },

  // 结算
  js: function () {
    var temp = [];
    var zj = 0;
    var arr = [];//定义一个空数组
    for (var item of this.data.carinfo) {
      item.isselect == 1 && (
        zj = item.price * item.num + zj
      )
      console.log("-----car.js 结算 ------js()中 item---", item)
      //新增代码
      if(item.isselect == 1){
        arr.push(item)  //push()增加元素，在原数组的末尾处增加一个元素，组成一个新数组
      }
      //新增代码
      console.log("arr---------",arr)
      wx.setStorageSync("selectGoods", arr)
    }

    zj = zj.toFixed(2);
    this.setData({
      zj: zj
    })

    // 新增代码
    wx.setStorageSync("zj", zj) 
    console.log("~~~~~~~~~~~~~~~~~选择结算的商品价格---zj----", zj)
    //新增代码
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("----加载中的 car 中 onload   options.orderIndex---", options.orderIndex)
    console.log("----加载中的 car 中 onload   options.order_id---", options.order_id)
    console.log("----加载中的 car 中 onload   options.order_type---", options.order_type)
    console.log("----加载中的 car 中 onload   options.pppreinfo---", options.pppreinfo)
    this.data.pppreinfo = options.pppreinfo;
    this.data.orderIndex = options.orderIndex;
    this.data.order_id = options.order_id;
    this.data.order_type = options.order_type;
  
    app.setNavigationBarColor(this);
    getApp().xtxx1 && app.pageOnLoad(this);
    var page = this;
    var carinfo = wx.getStorageSync("carinfo"),
        user_id = wx.getStorageSync("users").id;
    console.log("---car.js  onload --购物车所有商品信息--carinfo------",carinfo)
    this.setData({
      carinfo: carinfo,
      pppreinfo: this.data.pppreinfo
    })
    this.js();
    this.activeIndex2();
    
    app.util.request({
      url: 'entry/wxapp/myShoppingCart',
      // wx.request({
      //   url:'http://192.168.10.4:7300/mock/5b997ec11bb1360514d591e2/example/yz2/myShoppingCart',
      cachetime: '0',
      data: {
        user_id: user_id
      },
      success: function (t) {
        console.log("--  car.js  -购物车信息--t.data-", t.data)
        wx.setStorageSync("carinfo", t.data);
        var carinfo = wx.getStorageSync("carinfo");
        page.setData({
          carinfo: carinfo
        })
      }
    })

    if (!(page.data.order_id === "undefined" || typeof (page.data.order_id) === "undefined" || page.data.order_id === "")) {
      console.log("-------car   onload  order_id   不为  undefined-------")
      // 根据订单id,获取订单信息
      app.util.request({
        url: "entry/wxapp/getOrderInfo",
        // wx.request({
        //   url: 'http://192.168.10.4:7300/mock/5b997ec11bb1360514d591e2/example/getOrderInfo',
        data: {
          user_id: user_id,
          order_id: page.data.order_id
        },
        success: function (t) {
          console.log("----根据order_id 获取到的订单信息----",t)
          wx.setStorageSync("oldGoods", t.data.good)
        }
      })
    }else{
      var oldGoods = "";
      wx.setStorageSync("oldGoods", oldGoods)
      var a = wx.getStorageSync("oldGoods");
      console.log("-------------car了Kimi安的什么地欧诺公司-------",a)
    }
   
    //导航
     app.util.request({
        url: "entry/wxapp/nav",
    // wx.request({
    //   url: 'http://192.168.10.4:7300/mock/5b99d46d1bb1360514d591f4/example/navs',
      // url: 'http://192.168.10.4:7300/mock/5bc5de72363a0e050d79bce0/example/Bottomnavigation',   
      success: function (res) {
        page.setData({
          arr: res.data
        })
      }
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
    console.log(123)
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