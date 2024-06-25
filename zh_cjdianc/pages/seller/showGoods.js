var util = require('../../utils/util.js');
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    selectIndex : 0,
    table_num:"",
    orderIndex:'',
    isloading: !0,
    fullredus:[],
    isRefresh: false,
  },

  //返回上级页面
  back : function(){
    wx.navigateBack({
    })
  },

  detail: function(e){
    var id = e.currentTarget.dataset.id;
    console.log("---点击的商品id---",id) 
    wx.navigateTo({
      url: 'describe?id=' + id + '&distinguish=2' + '&preinfo=' + this.data.preinfo
    })
    // distinguish标识数据是从index或者showGoods过来的；preinfo标识预约 预约订单；
  },
 
  //搜索商品
  search: function(){
    wx.navigateTo({
      url: 'search',
    })
  },
  
  // 购物车小图标移动
  move: function (e) {
    var touchs = e.touches[0];
    var clientX = touchs.clientX;
    var clientY = touchs.clientY;
    if (clientX < 18) return;
    if (clientY < 18) return;
    if (clientY > this.data.screenHeight - 18) return;
    if (clientX > this.data.screenWidth - 18) return;
    this.setData({
      moveTop: clientY - 18,
      moveLeft: clientX - 18
    })
  },
  // 匹配数量
  pipei : function(){
    if(!this.data.goods) return;
    var goods = this.data.goods[this.data.selectIndex].goods;
    for (var b of goods){
      b.num = 0;
      for (var a of this.data.carinfo){
        if(a.id==b.id){
          b.num = a.num;
          break
        }
      }
    }
    this.setData({
      goods : this.data.goods
    })
  },
  // 匹配价格
  pipeiprice: function () {
    if (!this.data.goods) return;
    for (var a of this.data.carinfo) {
      for (var b of this.data.goods[this.data.selectIndex].goods) {
        if (a.id == b.id) {
          a.price = b.price
          break
        }
      }
    }
    this.setData({
     carinfo : this.data.carinfo
    })
    wx.setStorageSync("carinfo", this.data.carinfo) //存数据，缓存
  },

  // 选择分类
  selectMenu : function(e){
    var page = this;
    var s = this.data.goods;
    var selectIndex = e.currentTarget.dataset.index;
    page.data.selectIndex = e.currentTarget.dataset.index;
    console.log("商品分类的下标-----",selectIndex)
    if (!page.data.goods[selectIndex].goods){
      var t = s[selectIndex].id;
     app.util.request({
       url: "entry/wxapp/classIndexInfo",
      // wx.request({
      // //   url: 'http://192.168.10.4:7300/mock/5bcbb5bb363a0e050d79bd11/example/goodsinfo' + selectIndex,
      //   // url:'http://192.168.10.4:7300/mock/5b99d46d1bb1360514d591f4/example/goodsinfo1',  //香卤牛肉，香奈木瓜
      //   url: 'http://192.168.10.4:7300/mock/5b997ec11bb1360514d591e2/example/test/classIndexInfo/' + t,
        data:{
          type_id: t
        },
        success: function (t) {
          console.log("-----t.data-",t.data)
          wx.setStorageSync("classIndexInfo", t.data)
          s[selectIndex].goods = t.data;
          for (var item of t.data) {
            item.num = 0;
            item.isselect = 1;
          }
          page.setData({
            goods : s,
            selectIndex: selectIndex
          })
          page.pipei();
          page.pipeiprice();
        }
      })
    }else{
      console.log("已有数据")
      page.setData({
        selectIndex: selectIndex
      })
      this.pipei();
      this.pipeiprice();
    }  
  },
  //加
  jia : function(e){
    var user_id = wx.getStorageSync("users").id;
    var id = e.currentTarget.dataset.id;
    var selectIndex = this.data.selectIndex;
    var page = this;
    for (var item of this.data.goods[selectIndex].goods){
      if(item.id == id){
        item.num = item.num + 1;
        this.setData({
          goods: this.data.goods
        })
        if (this.data.carinfo.length == 0){
          console.log("第一次")
          item.num = 1;
          this.data.carinfo.push(item)
          this.setData({
            carinfo: this.data.carinfo
          })
          wx.setStorageSync("carinfo", page.data.carinfo)
          console.log("---showGoods--jia---carinfo---1-",this.data.carinfo)

          //--------------------------------jia ---1111111111111-------------------
          let newData = {
            carinfo: JSON.stringify(page.data.carinfo),
            user_id: user_id
          }
          console.log("--是对的吗  JSON.stringify(carinfo)--------------", JSON.stringify(page.data.carinfo))
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
        //--------------------------------jia ---1111111111111-------------------
        }else{
          var arr = [];
          for (var i of this.data.carinfo) {
            
            arr.push(i.id)
            console.log(arr)
            if (item.id == i.id) {
              console.log("循环")
              i.num = i.num + 1;
              wx.setStorageSync("carinfo", page.data.carinfo)
              console.log("---showGoods--jia---carinfo---2-",this.data.carinfo)
              
              //----------------------------jia 22222222---------------------
              let newData = {
                carinfo: JSON.stringify(page.data.carinfo),
                user_id: user_id
              }
              console.log("--是对的吗  JSON.stringify(carinfo)--------------", JSON.stringify(page.data.carinfo))
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
              //----------------------------jia 22222222---------------------
            }
          } 
          if (arr.indexOf(item.id)==-1) {
            console.log("判断")
            item.num = 1;
            this.data.carinfo.push(item)
            this.setData({
              carinfo: this.data.carinfo
            })
            wx.setStorageSync("carinfo", page.data.carinfo)
            console.log("---showGoods--jia---carinfo---3-",this.data.carinfo)

            //----------------------------jia 33333333333333333333333---------------------
            let newData = {
              carinfo: JSON.stringify(page.data.carinfo),
              user_id: user_id
            }
            console.log("--是对的吗  JSON.stringify(carinfo)--------------", JSON.stringify(page.data.carinfo))
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
            //-------------------jia 33333333333333----------------------------------
          }
        }
      }
    }
  },
  //减
  jian: function (e) {
    var user_id = wx.getStorageSync("users").id;
    var id = e.currentTarget.dataset.id;
    var selectIndex = this.data.selectIndex;
    var page = this;
    for (var item of this.data.goods[selectIndex].goods) {
      if (item.id == id) {
        if (item.num > 0){
          item.num = item.num - 1;
          this.setData({
            goods: this.data.goods
          })
          for (var i of this.data.carinfo) {
            if (item.id == i.id) {
              console.log("循环")
              i.num = i.num - 1;
              wx.setStorageSync("carinfo", page.data.carinfo)
              // jian-----------111111111-----------------------------
              let newData = {
                carinfo: JSON.stringify(page.data.carinfo),
                user_id: user_id
              }
              console.log("--是对的吗  JSON.stringify(carinfo)--------------", JSON.stringify(page.data.carinfo))
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
              // jian-----------111111111-----------------------------
              if (i.num == 0){
                var index;
                var newData;
                for (var j of page.data.carinfo) {
                  j.id == id && (
                    index = page.data.carinfo.indexOf(j),
                    page.data.carinfo.splice(index, 1),
                    wx.setStorageSync("carinfo", page.data.carinfo),
                    page.setData({
                      carinfo: page.data.carinfo
                    }),

                    // jian-----------222222-----------------------------
                  newData = {
                    carinfo: JSON.stringify(page.data.carinfo),
                    user_id: user_id
                  },
                    console.log("--是对的吗  JSON.stringify(carinfo)--------------", JSON.stringify(page.data.carinfo)),
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
              // jian-----------222222-----------------------------
                  )
                }
              }
            }
          }
        }else{
          var index;
          var newData;
          for (var j of page.data.carinfo) {
            j.id == id && (
              index = page.data.carinfo.indexOf(j),
              page.data.carinfo.splice(index, 1),
              wx.setStorageSync("carinfo", page.data.carinfo),
              page.setData({
                carinfo: page.data.carinfo
              }),
              // jian-----------3333333-----------------------------
              newData = {
                carinfo: JSON.stringify(page.data.carinfo),
                user_id: user_id
              },
              console.log("--是对的吗  JSON.stringify(carinfo)--------------", JSON.stringify(page.data.carinfo)),
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
              // jian----------3333333333-----------------------------
            )
          }
        }    
      }
    }
  },
  goCar : function(n){
    var page = this;
    var carinfo = wx.getStorageSync("carinfo");
    var user_id = wx.getStorageSync("users").id;
    console.log("---carinfo---数据之购物车",carinfo)
    console.log("---user_id---用户id", user_id)
    let newData = {
      carinfo : JSON.stringify(carinfo),
      user_id : user_id
    }
    console.log("--是对的吗  JSON.stringify(carinfo)--------------", JSON.stringify(carinfo))
    app.util.request({
      url:'entry/wxapp/shoppingCart',
      cachetime: "0",
      header: { 
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
      },
      method: 'POST',
      data: newData,
      success: function(t){
        console.log("----我想看看这个t，购物车接口成功返回数据-----",t)
        console.log("----page.data.preinfo----", page.data.preinfo)
        wx.navigateTo({
          url: 'car?orderIndex=' + page.data.orderIndex + "&order_id=" + page.data.order_id + "&order_type=" + page.data.order_type + "&pppreinfo=" + page.data.pppreinfo
          // pppreinfo标识扫码点餐时，不显示结算
        })
        
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (res) {
    console.log("----加载中的 showGoods 中 onload   res.preinfo---", res.preinfo)
    console.log("----加载中的 showGoods 中 onload   res.pppreinfo---", res.pppreinfo)
    console.log("----加载中的 showGoods 中 onload   res.orderIndex---",res.orderIndex)
    console.log("----加载中的 showGoods 中 onload   res.order_id---", res.order_id)
    console.log("----加载中的 showGoods 中 onload   res.order_type---", res.order_type)
    this.data.orderIndex = res.orderIndex;
    this.data.order_id = res.order_id;
    this.data.order_type = res.order_type;
    this.data.preinfo = res.preinfo;//预约标识 预约订单,扫码，加菜的标识
    this.data.pppreinfo = res.pppreinfo;
    app.setNavigationBarColor(this);
    var page = this;
    this.setData({
      state: res.state
    }) 

    // 获取系统信息
    wx.getSystemInfo({
      success: function (res) {
        page.setData({
          screenHeight: res.windowHeight,
          screenWidth: res.windowWidth,
        });
        page.setData({
          moveLeft: page.data.screenWidth - 60,
          moveTop: page.data.screenHeight - 100,
          
        });
      }
    })
    this.reLoad();
  },

  reLoad: function () { 
    var page = this;
    var user_id = wx.getStorageSync("users").id;
    //  这是菜单分类请求(原位置 onshow中)-----------
    console.log("+++++++++打印这个t++____________",page)
    app.util.request({
      url: "entry/wxapp/Fullreduct",
      // wx.request({
      //   url: 'http://192.168.10.4:7300/mock/5bc5de72363a0e050d79bce0/example/Fullreduct',
      success: function (t) {
        console.log("===========打印一下t是什么------------", t)  
        var fullredus = t.data; 
        console.log("+++++++++打印这个t++____________", fullredus)
        var obj = t.data;
        obj.sort(util.sortOut('full'));//排序,由小到大    
        page.setData({
          fullredus: fullredus
        })  
        console.log("+++++++++打印这个fullredus++____________", fullredus)      
      }      
    })

    app.util.request({
      url: "entry/wxapp/class",
      // wx.request({
      //   // url: 'http://192.168.10.4:7300/mock/5b99d46d1bb1360514d591f4/example/class',
      //   url:'http://192.168.10.4:7300/mock/5b997ec11bb1360514d591e2/example/test/class',
      data: {
        store_id: getApp().sjid
      },
      success: function (t) {
        console.log("---商品分类数据---", t.data)

        var obj = t.data;
        obj.sort(util.sortOut('sequ'));//排序,由小到大
        console.log("------------------------------",obj)
        var goods = t.data;
        app.util.request({
          url: "entry/wxapp/classIndexInfo",
          //  wx.request({
          //   //  url: 'http://192.168.10.4:7300/mock/5b99d46d1bb1360514d591f4/example/goodsinfo3',
          //    url:'http://192.168.10.4:7300/mock/5b997ec11bb1360514d591e2/example/test/classIndexInfo',
          data: {
            type_id: goods[0].id,
          },
          success: function (t) {
            console.log("-----商品分类详情------", t.data)
            wx.setStorageSync("classIndexInfo", t.data)
            goods[0].goods = t.data;
            for (var item of t.data) {
              item.num = 0;
              item.isselect = 0
            }
            console.log("----我想看看积分的数据----", t.data)
            page.setData({
              goods: goods,

              selectIndex: page.data.selectIndex,
              isloading: !1
            })
            page.pipei();
            page.pipeiprice();
          }
        })

      }
    })    
    //  这是菜单分类请求(原位置 onshow中)------------
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
    var page = this;
     // 当前时间戳  秒
    var timestamp = Math.round(new Date()/1000); 
    // var expiration = timestamp + 3600;//120秒 

    var carinfo = wx.getStorageSync("carinfo");
    var expiration = wx.getStorageSync("carinfo_expiration");
    var user_id = wx.getStorageSync("users").id;
    console.log("---onShow中 本地 carinfo----", carinfo)
    console.log("---onShow中 本地 上 timestamp--当前时间--", timestamp)
    console.log("---onShow中 本地 上 expiration--缓存时间--", expiration)
    if(timestamp > expiration){
      wx.removeStorageSync("carinfo_expiration");
    }

    if (carinfo && expiration > timestamp) {
      console.log("缓存时间有效")
      // 本地获取
      console.log("----onload中carinfo----", carinfo)
      page.data.carinfo = carinfo
      page.pipei()
      page.pipeiprice();
        this.setData({
          carinfo: carinfo
        })
    } else { 
      console.log("缓存时间已过期")
      wx.removeStorageSync("carinfo")
      this.setData({
        carinfo: []
      })
      console.log("---缓存过期---", carinfo)
      app.util.request({
        url: 'entry/wxapp/myShoppingCart',
        // wx.request({
        //   url:'http://192.168.10.4:7300/mock/5b997ec11bb1360514d591e2/example/yz2/myShoppingCart',
        cachetime: '0',
        data: {
          user_id: user_id
        },
        success: function (t) {
          console.log("-- onshow  showGoods.js  -购物车信息--t.data-", t.data)
          wx.setStorageSync("carinfo", t.data);
          var carinfo = wx.getStorageSync("carinfo");
          page.data.carinfo = carinfo
          page.pipei()
          page.pipeiprice();
          page.setData({
            carinfo: carinfo
          })
        }
      })
    }

    //导航
     app.util.request({
        url: "entry/wxapp/nav",
    // wx.request({
    //   url: 'http://192.168.10.4:7300/mock/5b99d46d1bb1360514d591f4/example/navs',
      success: function (res) {
        page.setData({
          arr: res.data
        })
      }
    })   
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})