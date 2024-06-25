var qqmapsdk, app = getApp(),
  util = require("../../utils/util.js"),
  QQMapWX = require("../../utils/qqmap-wx-jssdk.js");

Page({
  data: {
    ischeck: false,
    items: [
      { index: 0 }
    ],
    exchange_goods: !0,
    pay_type: '',
    yhq_active: !0,
    hb_active:!0,
    yhqcoupon_reduce:0,
    hbcoupon_reduce:0,
    mj_reduce:0,
    isloading: !0,
    table_num: "",
    timetime: util.formatTime(new Date()).substring(11, 16),
    oldGoods: [],
    share_modal_active: !1,//false
    navbar: [],
    fwxy: !0,
    xymc: "到店自取服务协议",
    xynr: "",
    selectedindex: 0,
    color: "#019fff",
    checked: !0,
    cart_list: [],
    wmindex: 0,
    cjindex: 0,
    cjarray: ["1份", "2份", "3份", "4份", "5份", "6份", "7份", "8份", "9份", "10份", "10份以上"],
    mdoaltoggle: !0,
    total: 0,
    showModal: !1,
    zffs: 1,
    zfz: !1,
    btntype: "btn_ok1",
    yhqkdje: 0,
    coupon_reduce: 0,
    hbkdje: 0,
    // 订单类型
    array: ['外卖', '自提'],
    objectArray: [
      {
        id: 0,
        name: '外卖'
      },
      {
        id: 1,
        name: '自提'
      },
    ],
    index: 0,
  },

  // radio按钮
  click: function (e) {
    var click = this;
    var index = e.currentTarget.dataset.index;
    for (var item of click.data.items) {
      console.log("--121--", index)
      item.index = index && (
        item.checked = !item.checked,
        console.log("==232==", item.checked),
        this.setData({
          ischeck: item.checked
        }),
        console.log("==isclick的值  判断是否使用积分支付部分钱==", this.data.ischeck)
      )
    }
    click.setData({
      items: click.data.items
    })

    if(click.data.ischeck){
      if (click.data.totPrice  > 100 && click.data.total_score > 100) {
        click.data.totPrice = click.data.totPrice - 10;
        console.log("-----/使用积分之后的钱 0-------", click.data.totPrice)
        click.setData({
          used_total_score: 100,
          totalPrice: click.data.totPrice
        })
      } else if (click.data.totPrice > 200 && click.data.total_score > 200) {
        click.data.totPrice = click.data.totPrice - 20;
        click.setData({
          used_total_score: 200,
          totalPrice: click.data.totPrice
        })
      } else if (click.data.totPrice > 300 && click.data.total_score > 300) {
        click.data.totPrice = click.data.totPrice - 30;
        click.setData({
          used_total_score: 300,
          totalPrice: click.data.totPrice
        })
      } else {
        console.log("条件不足，不能使用积分")
      }
    }
  },

  // 订单类型
  bindChange: function (e) {
    console.log('picker发送选择改变，携带值为---index的值---', e.detail.value)
    this.setData({
      index: e.detail.value
    })
    this.data.index = Number(e.detail.value);
    console.log("bindChange ------- this.data.index", this.data.index)
// wx.setStorageSync("chooseIndex", this.data.index)
    // 配送费
    var psf = wx.getStorageSync("psf");
    console.log("00000----", psf)

    // 总价
    if (this.data.index === 1) {
      this.data.totPrice = this.data.totPrice - parseFloat(psf);
      // this.data.totPrice = totPrice;
      console.log("--bindChange 订单类型 --自提订单----加上 包装费之后----不需要配送费---", this.data.totPrice)
      this.setData({
        totalPrice: this.data.totPrice,
      })
    } else if(this.data.index === 0){
      this.data.totPrice = this.data.totPrice + parseFloat(psf);
      // this.data.totPrice = totPrice;
      console.log("-------加上 包装费之后-------", this.data.totPrice)
      this.setData({
        totalPrice: this.data.totPrice,
      })
    }


    // 总价
    // if (this.data.index === 1) {
    //   var totPrice = parseFloat(this.data.zj) + parseFloat(this.data.pack_money);
    //   this.data.totPrice = totPrice;
    //   console.log("--bindChange 订单类型 --自提订单----加上 包装费之后----不需要配送费---", totPrice)
    //   this.setData({
    //     totalPrice: totPrice,
    //   })
    // } else {
    //   var totPrice = parseFloat(this.data.zj) + parseFloat(this.data.pack_money) + parseFloat(psf);
    //   this.data.totPrice = totPrice;
    //   console.log("-------加上 包装费之后-------", totPrice)
    //   this.setData({
    //     totalPrice: totPrice,
    //   })
    // }

  },

  // 优惠券
  showcart: function () {
    var orderType_index = this.data.index;
    console.log("---优惠券--提交订单 的 订单类型--orderType_index-----", orderType_index)
    wx.redirectTo({
      url: '../my/myyhq?use_type=1' + "&orderType_index=" + orderType_index
    })
  },

  closecart: function () {
    this.setData({
      share_modal_active: !1
    });
  },

  // 红包
  hbshowcart: function () {
    var orderType_index = this.data.index;
    console.log("---红包--提交订单 的 订单类型--orderType_index-----", orderType_index)
    wx.redirectTo({
      url: '../my/myhb?use_type=1' + "&orderType_index=" + orderType_index
    })
  },

  hbclosecart: function () {
    this.setData({
      hbshare_modal_active: !1
    });
  },

  openxy: function () {
    this.setData({
      fwxy: !1
    });
  },

  look: function () {
    var page = this;
    wx.navigateTo({
      url: "zqxy"
    });
  },
  queren: function () {
    this.setData({
      fwxy: !0
    });
  },

  bindPickerChange: function (t) {
    console.log("picker发送选择改变，携带值为", t.detail.value),
      this.setData({
        wmindex: t.detail.value
      });
  },

  bindcjPickerChange: function (t) {
    console.log("picker发送选择改变，携带值为", t.detail.value), this.setData({
      cjindex: t.detail.value
    });
  },

  checkboxChange: function (t) {
    this.setData({
      checked: !this.data.checked
    });
  },

  // 到店自提
  ckwz: function (t) {
    console.log(t.currentTarget.dataset.jwd);
    var e = t.currentTarget.dataset.jwd.split(",");
    console.log(e);
    wx.openLocation({
      latitude: Number(e[0]),
      longitude: Number(e[1]),
      name: this.data.store.name,
      address: this.data.store.address
    });
    console.log("  ------------------111111111111", this.data.store.address)
    var storeaddress = this.data.store.address;
    wx.setStorageSync("storeaddress", storeaddress)
    console.log("_____+++++++++++````````storeaddress``````````++++++++++____", storeaddress)
  },


  //---------------------------------------------------------------
  distance: function (t, e, a) {
    console.log("---------t--------distance----距离----",t)
    var dis = t.split(",");
    console.log("----分离成数组-",dis)
    var lat = dis[0],
      lng = dis[1];

    var s;
    qqmapsdk.calculateDistance({
      mode: "driving",
      from: {
        // latitude: t.lat,
        // longitude: t.lng
        latitude: lat,
        longitude: lng
      },
      to: [{
        latitude: e.lat,
        longitude: e.lng
      }],
      success: function (t) {
        console.log(t), 0 == t.status && (s = Math.round(t.result.elements[0].distance),
          a(s));
      },
      fail: function (t) {
        console.log(t), 373 == t.status && (s = 15e3, a(s));
      },
      complete: function (t) {
        console.log(t);
      }
    });
  },
  KeyName: function (t) {
    this.setData({
      name: t.detail.value
    });
  },
  KeyMobile: function (t) {
    this.setData({
      mobile: t.detail.value
    });
  },

  // 提交订单
  tjddformSubmit: function (t) {
    var index = this.data.index,
      timetime = this.data.timetime,
      mjcoupon_id = this.data.mjcoupon_id,
      user_id = wx.getStorageSync("users").id,
      carinfo = wx.getStorageSync("carinfo"),//获取购物车内所有商品信息
      newselectGoods = wx.getStorageSync("selectGoods"),//选中的商品
      totalPrice = this.data.totPrice,
      note = wx.getStorageSync("note"),
      address = wx.getStorageSync("address"),
      storeaddress = wx.getStorageSync("storeaddress");
    console.log("----提交订单时间-----@@@@@------timetime----", timetime)

    console.log("carinfo 提交订单前 购物车内所有数据", carinfo)
    console.log("carinfo 提交订单前 购物车内 准备购买的数据", newselectGoods)

    console.log("----提交订单 前  满减的id----", mjcoupon_id)
    // 已经选中的商品中isselect的删除操作【数组】
    for (var item of newselectGoods) {
      delete item.isselect;
      console.log("--选中的商品 newselectGoods---isselect----删除了没----", item.isselect)
    }

    // 地址中的删除操作【对象】
    delete address.user_id;
    delete address.id;
    delete address.is_default;
    console.log("index~~~~~~~~~~~~~~~~~~~~~~index", index)
    console.log("-----已经勾选准备结算的商品-------", newselectGoods)
    console.log("----实付款 最终价格----", totalPrice)
    console.log("----收货地址 外卖-----", address)

    var table_num = wx.getStorageSync("table_num");
    console.log("---takeoutform  tjddformSubmit中---table_num--桌子的编号--", table_num)

    var tableid = wx.getStorageSync("tableid");
    console.log("---takeoutform  tjddformSubmit中---tableid--桌子id--", tableid)

    var codeOrder_id = wx.getStorageSync("order_id");
    console.log("---takeoutform  tjddformSubmit中---order_id--扫码之后生成 空订单 的订单编号--", codeOrder_id)

    // 判断是外卖还是自提  -----  扫码点餐
    if (index == 0) {//--------------------------------------------------------外卖
      var e = wx.getStorageSync("address");
      if (JSON.stringify(e) == "{}") {
        return wx.showModal({
          title: "提示",
          content: "请选择收货地址"
        }), !1;
      } else {
        if (this.data.order_id === "undefined" || typeof (this.data.order_id) === "undefined") {// !undefined 为true；!!undefined为false


// 增加判断，是否为积分兑换，如果是积分兑换，包装费所有的东西都是0
            let newData = {
              user_id: user_id,
              selectGoods: JSON.stringify(newselectGoods),
              address: JSON.stringify(address),
              finalPrice: totalPrice,
              timetime: timetime.toString(),//送达时间
              note: note,
              index: index,//订单类型
              getIntegral: this.data.getIntegral,//获得积分
              deliveryfee: this.data.psf,//配送费
              pack_money: this.data.pack_money,
              hyid: this.data.hyid,
              mjcoupon_id: this.data.mjcoupon_id,
              pay_type: this.data.pay_type,
              integral_money: this.data.integral_money //兑换物品所需的积分
            }
          
          app.util.request({
            url: 'entry/wxapp/generateOrder',
            header: {
              'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
            },
            method: 'POST',
            cachetime: "0",
            data: newData,
            success: function (t) {
              "1" == t.data ?( 
                this.data.pay_type == 4 ? (
                  wx.reLaunch({
                  url: '../wddd/order?status=2'
                }) 
                ):(
                   wx.reLaunch({
                    url: '../wddd/order'
                  },
                      console.log("订单生成成功！！！！！！！！！！！！------------"),
                      console.log("！！！！！！！！--使用优惠券之后  优惠券的id---------", this.data.hyid),
                      !(this.data.hyid === "undefined" || typeof (this.data.hyid) === "undefined" || this.data.hyid === "") ? (
                        // 使用优惠券或者红包，向后台发送使用数据
                        app.util.request({
                          url: 'entry/wxapp/usedCoupon',
                          data: {
                            hyid: this.data.hyid,
                            user_id: user_id
                          },
                          success: function (t) {
                            console.log("---已经使用优惠券或者红包，向后台发送数据成功，等待后台清空已使用过的优惠券或者红包----")
                          }
                        })
                      ) : (console.log("------提交订单 时 没有使用优惠券或者红包-----"))
                  )
                )    
              )
                 : (
                  wx.showModal({
                    title: '提示',
                    content: '外卖订单生成失败\r\n您可能有待付款订单\r\n请前往“订单”处理',
                    success(res) {
                      if (res.confirm) {
                        console.log('用户点击确定')
                      } else if (res.cancel) {
                        console.log('用户点击取消')
                      }
                    }
                  }, wx.navigateBack({
                       delta: 1 //回退到上一级页面
                     })
                  )   
                )
            },
            fail: function () {
              console.log("外卖提交订单失败")
              wx.showModal({
                title: '提示',
                content: '外卖订单提交失败',
              })
            }
          })
        } else {  //执行增加订单接口
          var newGoods = wx.getStorageSync("selectGoods");
          console.log("------index==0-----newGoods---", newGoods)
          for (var item of newGoods) {
            delete item.isselect;
            //对象jsonObject中,添加属性newOld
            var jsonObject = item;
            jsonObject.newOld = 2;
            console.log("--外卖--新的-----", item)
            console.log("----", newGoods)
          }

          // 增加菜单接口
          let newData = {
            user_id: user_id,
            order_id: this.data.order_id,
            selectGoods: JSON.stringify(newGoods),
            addPrice: totalPrice,
            note: note,
            getIntegral: this.data.getIntegral,
            hyid: this.data.hyid,
            mjcoupon_id: this.data.mjcoupon_id
          }

          app.util.request({
            url: "entry/wxapp/addDishs",
            // wx.request({
            //   url: 'http://192.168.10.4:7300/mock/5b997ec11bb1360514d591e2/example/addDishs',
            method: 'POST',
            cachetime: "0",
            data: newData,
            success: function (t) {
              console.log("--外卖--新增菜单成功---", t)
              "1" == t.data ?
                wx.reLaunch({
                  url: '../wddd/order'
                },
                  !(this.data.hyid === "undefined" || typeof (this.data.hyid) === "undefined" || this.data.hyid === "") ? (   
                    // 使用优惠券或者红包，向后台发送使用数据
                    app.util.request({
                      url: 'entry/wxapp/usedCoupon',
                      data: {
                        hyid: this.data.hyid,
                        user_id: user_id
                      },
                      success: function (t) {
                        console.log("---已经使用优惠券或者红包，向后台发送数据成功，等待后台清空已使用过的优惠券或者红包----")
                      }
                    })
                  ) : (console.log("------提交订单 时 没有使用优惠券或者红包-----"))  
                ) : (
                  wx.showModal({
                    title: '提示',
                    content: '外卖新增订单生成失败',
                    success(res) {
                      if (res.confirm) {
                        console.log('用户点击确定')
                      } else if (res.cancel) {
                        console.log('用户点击取消')
                      }
                    }
                  }, wx.navigateBack({
                    delta: 1 //回退到上一级页面
                  })
                  )
                )
            },
            fail: function () {
              console.log("外卖提交订单  第二次  提交失败")
              wx.showModal({
                title: '提示',
                content: '2外卖订单提交失败',
              })
            }
          })
        }
      }
    } else if (index == 1) {//---------------------------------------------------------自提 

      var abc = this,
        date = abc.data.date,
        time = abc.data.time,
        mobile = abc.data.mobile,
        name = abc.data.name,
        checked = abc.data.checked,
        totalTime = date.concat(" ", time);
      console.log("/-------自提-------!!!!1----------", totalTime)

      var obj = {
        address: storeaddress,
        user_name: name,
        tel: mobile
      }
      console.log("---转成对象了吗---", obj)

      if ("" == !!name || "" == !!mobile) {//判断是否填写收货人和联系电话
        return wx.showModal({
          title: "提示",
          content: "到店自提必须填写收货人和联系电话！"
        }), !1;
      } else if (!checked) {//判断时候勾选服务协议
        return wx.showModal({
          title: "提示",
          content: "请阅读并同意《到店自取服务协议》"
        }), !1;
      } else {
        if (abc.data.order_id === "undefined" || typeof (abc.data.order_id) === "undefined") {// !undefined 为true；!!undefined为false
          let newData = {
            user_id: user_id,
            selectGoods: JSON.stringify(newselectGoods),
            address: JSON.stringify(obj),//自取地址
            finalPrice: totalPrice,
            timetime: totalTime.toString(),//时间
            note: note,
            index: index,//订单类型   
            getIntegral: abc.data.getIntegral,
            deliveryfee: abc.data.psf,//配送费  自提为0  abc
            pack_money: abc.data.pack_money,//abc
            hyid: abc.data.hyid,
            mjcoupon_id: abc.data.mjcoupon_id,
            pay_type: abc.data.pay_type,
            integral_money: abc.data.integral_money
          }
          app.util.request({
            url: 'entry/wxapp/generateOrder',
            header: {
              'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
            },
            method: 'POST',
            cachetime: "0",
            data: newData,
            success: function (t) {
              "1" == t.data ?(
                abc.data.pay_type == 4 ? (
                   wx.reLaunch({
                    url: '../wddd/order?status=2'
                  })
                ):(
                  wx.reLaunch({
                    url: '../wddd/order'
                  },
                    !(abc.data.hyid === "undefined" || typeof (abc.data.hyid) === "undefined" || abc.data.hyid === "") ? (
                      // 使用优惠券或者红包，向后台发送使用数据
                      app.util.request({
                        url: 'entry/wxapp/usedCoupon',
                        data: {
                          hyid: abc.data.hyid,
                          user_id: user_id
                        },
                        success: function (t) {
                          console.log("---已经使用优惠券或者红包，向后台发送数据成功，等待后台清空已使用过的优惠券或者红包----")
                        }
                      })
                    ) : (console.log("------提交订单 时 没有使用优惠券或者红包-----"))
                  )
                )
                )
                  : (
                  wx.showModal({
                    title: '提示',
                    content: '自提订单生成失败\r\n您可能有待付款订单\r\n请前往“订单”处理',
                    success(res) {
                      if (res.confirm) {
                        console.log('用户点击确定')
                      } else if (res.cancel) {
                        console.log('用户点击取消')
                      }
                    }
                  }, wx.navigateBack({
                    delta: 1 //回退到上一级页面
                     })
                  )
                )
            },
            fail: function () {
              console.log("自提提交订单失败")
              wx.showModal({
                title: '提示',
                content: '自提订单提交失败',
              })
            }
          })
        } else {  //执行增加订单接口
          var newGoods = wx.getStorageSync("selectGoods");
          console.log("------index==0-----newGoods---", newGoods)
          for (var item of newGoods) {
            delete item.isselect;
            //对象jsonObject中,添加属性newOld
            var jsonObject = item;
            jsonObject.newOld = 2;
            console.log("--自提--新的-----", item)
            console.log("--", newGoods)
          }

          //  增加菜单接口
          let newData = {
            user_id: user_id,
            order_id: abc.data.order_id,
            selectGoods: JSON.stringify(newGoods),
            addPrice: totalPrice,
            note: note,
            getIntegral: abc.data.getIntegral,
            hyid: abc.data.hyid,
            mjcoupon_id: abc.data.mjcoupon_id
          }
          app.util.request({
            url: "entry/wxapp/addDishs",
            // wx.request({
            //   url: 'http://192.168.10.4:7300/mock/5b997ec11bb1360514d591e2/example/addDishs',
            method: 'POST',
            cachetime: "0",
            data: newData,
            success: function (t) {
              console.log("--自提--新增菜单成功---", t)
              "1" == t.data ?
                wx.reLaunch({
                  url: '../wddd/order'
                },

                  !(abc.data.id === "undefined" || typeof (abc.data.id) === "undefined" || abc.data.id === "") ? (
                    // 使用优惠券或者红包，向后台发送使用数据
                    app.util.request({
                      url: 'entry/wxapp/usedCoupon',
                      data: {
                        hyid: abc.data.hyid,
                        user_id: user_id
                      },
                      success: function (t) {
                        console.log("---已经使用优惠券或者红包，向后台发送数据成功，等待后台清空已使用过的优惠券或者红包----")
                      }
                    })
                  ) : (console.log("------提交订单 时 没有使用优惠券或者红包-----"))
          
                ) : (
                  wx.showModal({
                    title: '提示',
                    content: '自提加菜订单生成失败',
                    success(res) {
                      if (res.confirm) {
                        console.log('用户点击确定')
                      } else if (res.cancel) {
                        console.log('用户点击取消')
                      }
                    }
                  },
                    wx.navigateBack({
                      delta: 1 //回退到上一级页面
                    })
                  )
                )
            },
            fail: function () {
              console.log("自提提交订单  第二次  提交失败")
              wx.showModal({
                title: '提示',
                content: '2自提订单提交失败',
              })
            }
          })
        }
      }
    } else if (index == 3) {
      // 扫码点餐  
      console.log("-----takeoutform   扫码点餐    点餐   打印成功了没-----")
      //传送订单id、餐桌号、商品信息

      if (this.data.order_id !== codeOrder_id) {// !undefined 为true；!!undefined为false
        let newData = {
          user_id: user_id,
          selectGoods: JSON.stringify(newselectGoods),
          tableid: tableid,
          orderid: codeOrder_id,
          finalPrice: totalPrice,
          note: note,
          getIntegral: this.data.getIntegral,
          hyid: this.data.hyid,
          mjcoupon_id: this.data.mjcoupon_id
        }
        app.util.request({//修改更新订单
          url: 'entry/wxapp/UpdateGenerateOrder',
          header: {
            'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
          },
          method: 'POST',
          cachetime: "0",
          data: newData,
          success: function (t) {
            "1" == t.data ?
              wx.reLaunch({
                url: '../wddd/order'
              },

                !(this.data.hyid === "undefined" || typeof (this.data.hyid) === "undefined" || this.data.hyid === "") ? (
                  // 使用优惠券或者红包，向后台发送使用数据
                  app.util.request({
                    url: 'entry/wxapp/usedCoupon',
                    data: {
                      hyid: this.data.hyid,
                      user_id: user_id
                    },
                    success: function (t) {
                      console.log("---已经使用优惠券或者红包，向后台发送数据成功，等待后台清空已使用过的优惠券或者红包----")
                    }
                  })
                ) : (console.log("------提交订单 时 没有使用优惠券或者红包-----"))


              ) : (
                wx.showModal({
                  title: '提示',
                  content: '扫码点餐订单提交失败',
                  success(res) {
                    if (res.confirm) {
                      console.log('用户点击确定')
                    } else if (res.cancel) {
                      console.log('用户点击取消')
                    }
                  }
                },
                  wx.navigateBack({
                    delta: 1 //回退到上一级页面
                  })
                )
              )
          },
          fail: function () {
            console.log("扫码点餐 提交订单失败")
            wx.showModal({
              title: '提示',
              content: '扫码点餐订单提交失败',
            })
          }
        })
      } else {  //执行增加订单接口
        var newGoods = wx.getStorageSync("selectGoods");
        console.log("------index==0-----newGoods---", newGoods)
        for (var item of newGoods) {
          delete item.isselect;
          //对象jsonObject中,添加属性newOld
          var jsonObject = item;
          jsonObject.newOld = 2;
          console.log("--扫码--新的-----", item)
          console.log("--", newGoods)
        }

        // 增加菜单接口
        let newData = {
          user_id: user_id,
          order_id: this.data.order_id,
          selectGoods: JSON.stringify(newGoods),
          addPrice: totalPrice,
          note: note,
          getIntegral: this.data.getIntegral,
          hyid: this.data.hyid,
          mjcoupon_id: this.data.mjcoupon_id
        }
        app.util.request({
          url: "entry/wxapp/addDishs",
          // wx.request({
          //   url: 'http://192.168.10.4:7300/mock/5b997ec11bb1360514d591e2/example/addDishs',
          method: 'POST',
          cachetime: "0",
          data: newData,
          success: function (t) {
            console.log("--扫码--新增菜单成功---", t)
            "1" == t.data ?
              wx.reLaunch({
                url: '../wddd/order'
              },

                !(this.data.hyid === "undefined" || typeof (this.data.hyid) === "undefined" || this.data.hyid === "") ? (
                  // 使用优惠券或者红包，向后台发送使用数据
                  app.util.request({
                    url: 'entry/wxapp/usedCoupon',
                    data: {
                      hyid: this.data.hyid,
                      user_id: user_id
                    },
                    success: function (t) {
                      console.log("---已经使用优惠券或者红包，向后台发送数据成功，等待后台清空已使用过的优惠券或者红包----")
                    }
                  })
                ) : (console.log("------提交订单 时 没有使用优惠券或者红包-----"))

              ) : (
                wx.showModal({
                  title: '提示',
                  content: '2扫码订单提交失败',
                  success(res) {
                    if (res.confirm) {
                      console.log('用户点击确定')
                    } else if (res.cancel) {
                      console.log('用户点击取消')
                    }
                  }
                },
                  wx.navigateBack({
                    delta: 1 //回退到上一级页面
                  })
                )
              )
          },
          fail: function () {
            console.log("扫码点餐提交订单  第二次  提交失败")
            wx.showModal({
              title: '提示',
              content: '2扫码订单提交失败',
            })
          }
        })
      }
    } else if(index == 4){
      //--------------------------------------------------------------------------------------预约加菜
      if (this.data.order_id !== "undefined" || typeof (this.data.order_id) !== "undefined") {// !undefined 为true；!!undefined为false
        //执行增加订单接口
        var newGoods = wx.getStorageSync("selectGoods");
        console.log("------index==0-----newGoods---", newGoods)
        for (var item of newGoods) {
          delete item.isselect;
          //对象jsonObject中,添加属性newOld
          var jsonObject = item;
          jsonObject.newOld = 2;
          console.log("--外卖--新的-----", item)
          console.log("----", newGoods)
        }

        // 增加菜单接口
        let newData = {
          user_id: user_id,
          order_id: this.data.order_id,
          selectGoods: JSON.stringify(newGoods),
          addPrice: totalPrice,
          note: note,
          getIntegral: this.data.getIntegral,
          hyid: this.data.hyid,
          mjcoupon_id: this.data.mjcoupon_id
        }

        app.util.request({
          url: "entry/wxapp/addDishs",
          // wx.request({
          //   url: 'http://192.168.10.4:7300/mock/5b997ec11bb1360514d591e2/example/addDishs',
          method: 'POST',
          cachetime: "0",
          data: newData,
          success: function (t) {
            console.log("--预约--新增菜单成功---", t)
            "1" == t.data ?
              wx.reLaunch({
                url: '../wddd/order'
              },
                !(this.data.hyid === "undefined" || typeof (this.data.hyid) === "undefined" || this.data.hyid === "") ? (
                  // 使用优惠券或者红包，向后台发送使用数据
                  app.util.request({
                    url: 'entry/wxapp/usedCoupon',
                    data: {
                      hyid: this.data.hyid,
                      user_id: user_id
                    },
                    success: function (t) {
                      console.log("---已经使用优惠券或者红包，向后台发送数据成功，等待后台清空已使用过的优惠券或者红包----")
                    }
                  })
                ) : (console.log("------提交订单 时 没有使用优惠券或者红包-----"))
              ) : (
                wx.showModal({
                  title: '提示',
                  content: '预约新增订单生成失败',
                  success(res) {
                    if (res.confirm) {
                      console.log('用户点击确定')
                    } else if (res.cancel) {
                      console.log('用户点击取消')
                    }
                  }
                }, wx.navigateBack({
                  delta: 1 //回退到上一级页面
                })
                )
              )
          },
          fail: function () {
            console.log("预约提交订单  第二次  提交失败")
            wx.showModal({
              title: '提示',
              content: '2预约订单提交失败',
            })
          }
        })
      } 
  
      //--------------------------------------------------------------------------------------预约加菜
    }else {
      console.log("数据错误")
    }
  },


  //------------------------------------------------------------------------------
  bindDateChange: function (t) {
    console.log("date 发生 change 事件，携带值为", t.detail.value, this.data.datestart), this.setData({
      date: t.detail.value
    }),
      t.detail.value == this.data.datestart ? (console.log("日期没有修改"), this.setData({
        timestart: util.formatTime(new Date()).substring(11, 16)
      })) : (console.log("修改了日期"),
        this.setData({
          timestart: "00:01"
        }));
  },
  bindTimeChange: function (t) {
    console.log("time 发生 change 事件，携带值为", t.detail.value),
      this.setData({
        time: t.detail.value
      });
  },
  radioChange: function (t) {
    this.setData({
      radioChange: t.detail.value
    }), console.log("radio发生change事件，携带value值为：", t.detail.value);
  },

  hbradioChange: function (t) {
    this.setData({
      hbradioChange: t.detail.value
    }), console.log("radio发生change事件，携带value值为：", t.detail.value);
  },

  // 优惠券
  xzq: function (t) {
    if (console.log(t.currentTarget.dataset, this.data.gwcinfo.money, this.data.CouponSet.yhq_set),
      Number(t.currentTarget.dataset.full) > this.data.gwcinfo.money) return wx.showModal({
        title: "提示",
        content: "您的消费金额不满足此优惠券条件"
      }), !1;
    "1" == this.data.CouponSet.yhq_set ? this.setData({
      activeradio: t.currentTarget.dataset.rdid,
      yhqkdje: t.currentTarget.dataset.kdje
    }) : this.setData({
      activeradio: t.currentTarget.dataset.rdid,
      yhqkdje: t.currentTarget.dataset.kdje,
      hbactiveradio: "",
      hbkdje: 0
    }), this.gettotalprice();
  },

  // 红包
  xzhb: function (t) {
    if (console.log(t.currentTarget.dataset, this.data.gwcinfo.money, this.data.CouponSet.yhq_set),
      Number(t.currentTarget.dataset.full) > this.data.gwcinfo.money) return wx.showModal({
        title: "提示",
        content: "您的消费金额不满足此红包条件"
      }), !1;
    "1" == this.data.CouponSet.yhq_set ? this.setData({
      hbshare_modal_active: !1,
      hbactiveradio: t.currentTarget.dataset.rdid,
      hbkdje: t.currentTarget.dataset.kdje
    }) : (wx.showModal({
      title: "提示",
      content: "优惠券与红包不可同时享用"
    }), this.setData({
      hbshare_modal_active: !1,
      hbactiveradio: t.currentTarget.dataset.rdid,
      hbkdje: t.currentTarget.dataset.kdje,
      activeradio: "",
      yhqkdje: 0
    })), this.gettotalprice();
  },

  //onload------------------------------------------
  onLoad: function (t) {
    console.log("--takeoutform 中 积分兑换的数据 实物 类型为2--",t.thingType)
    console.log("---takeoutform 中 积分兑换的数据 实物id---",t.id)
    console.log("----加载中的 takeouform 中 onload   t.orderIndex---", t.orderIndex)
    console.log("----加载中的 takeouform 中 onload   t.order_id---", t.order_id)
    console.log("----加载中的 takeouform 中 onload   t.order_type---", t.order_type)
    console.log("----加载中的 takeouform 中 onload   t.uscoupid- hyid--", t.hyid)
    console.log("----加载中的 takeouform 中 onload   t.coupon_full---", t.coupon_full)
    console.log("----加载中的 takeouform 中 onload   t.yhqcoupon_reduce---", t.yhqcoupon_reduce)
    console.log("----加载中的 takeouform 中 onload   t.hbcoupon_reduce---", t.hbcoupon_reduce)
    console.log("----加载中的 takeouform 中 onload   t.orderType_index---", t.orderType_index)

    this.data.orderIndex = t.orderIndex;
    this.data.order_id = t.order_id;
    this.data.order_type = t.order_type;
    console.log("----this.data.orderIndex----", this.data.orderIndex)

    this.data.hyid = t.hyid;
    this.data.coupon_full = t.coupon_full;
    this.data.yhqcoupon_reduce = t.yhqcoupon_reduce;
    this.data.hbcoupon_reduce = t.hbcoupon_reduce;
    console.log("--优惠券--coupon_reduce----", this.data.yhqcoupon_reduce)
    console.log("--红包--coupon_reduce----", this.data.hbcoupon_reduce)

    this.data.thingType = t.thingType;
    this.data.exchange_goodsID = t.id;

    // 解决自提时，选择使用优惠券或红包之后，订单类型变成外卖问题
    if (!(t.orderType_index === "undefined" || typeof (t.orderType_index) === "undefined" || t.orderType_index === "")) {
      this.data.index = t.orderType_index;
    }
    console.log("----orderType_index--从红包优惠券页面获取到的 订单类型--", this.data.index)

    if (!(this.data.index === "undefined" || typeof (this.data.index) === "undefined" || this.data.index === "")) {
      this.setData({
        index: this.data.index
      })
    }

    app.setNavigationBarColor(this),
      console.log(t);
    var user_id = wx.getStorageSync("users").id;

    var table_num = wx.getStorageSync("table_num");
    console.log("---takeoutform  onload中---table_num--桌子的编号--", table_num)

    var codeOrder_id = wx.getStorageSync("order_id");
    console.log("---takeoutform  onload中---order_id--扫码之后生成 空订单 的订单编号--", codeOrder_id)

    if (this.data.orderIndex === "1") {
      console.log("----桌子的编号不为空之后   设置index为3----")
      this.setData({
        index: 3
      })
    }

    if (this.data.order_type === "1") {
      console.log("--------加菜 菜单的订单类型1外卖 设置index为0------")
      this.setData({
        index: 0,
        jiacai: 1
      })
    } else if (this.data.order_type === "2") {
      console.log("--------加菜 菜单的订单类型2自提 设置index为1------")
      this.setData({
        index: 1,
        jiacai: 2
      })
    } else if (this.data.order_type === "3") {
      console.log("--------加菜 菜单的订单类型3在店消费 设置index为3------")
      this.setData({
        index: 3
      })
    } else if (this.data.order_type === "4") {
      console.log("--------加菜 菜单的订单类型4预约 设置index为4------")
      this.setData({
        index: 4
      })
    } else {
      console.log("--数据错误 或者 用户进行扫码点餐----")
    }
    var tableid = wx.getStorageSync("tableid");
    console.log("---takeoutform  onload中---tableid--桌子id--", tableid)

    this.setData({
      table_num: table_num
    })

    var oldGoods = wx.getStorageSync("oldGoods");
    var newselectGoods = wx.getStorageSync("selectGoods");
    console.log("------index==0-----newGoods---", newselectGoods)
    for (var item of newselectGoods) {
      delete item.isselect;
      //对象jsonObject中,添加属性oneTwo
      var jsonObject = item;
      jsonObject.oneTwo = 2;
      console.log("----新的-----", item)
      console.log("--", newselectGoods)
    }

    if (oldGoods == "") {
      var selectGoods = wx.getStorageSync("selectGoods");
      console.log("----selectGoods----", selectGoods.length)
      console.log("---老订单为空的时候---selectGoods----", selectGoods)

      var pack_money = 0;
      for (var item of selectGoods) {
        pack_money = item.pack_money + pack_money;
        console.log("---pack_money--包装费-", pack_money)
      }
      pack_money = pack_money.toFixed(2);
      this.data.pack_money = pack_money;
    } else {
      console.log("------index-----oldGoods---", oldGoods)
      for (var item of oldGoods) {
        //对象jsonObject中,添加属性oneTwo
        var jsonObject = item;
        jsonObject.oneTwo = 1;
        console.log("----新的--oneTwo = 1---", item)
        console.log("--", oldGoods)
      }

      var selectGoods = oldGoods;
      selectGoods = selectGoods.concat(newselectGoods);
      console.log("------------新老菜单合并之后得数组------------", selectGoods)

      //包装费
      var pack_money = 0;
      for (var item of selectGoods) {
        pack_money = item.pack_money + pack_money;
        console.log("---pack_money--包装费-", pack_money)
      }
      pack_money = pack_money.toFixed(2);
      this.data.pack_money = pack_money;
    }

    var zj = 0;
    for (var item of selectGoods) {
      zj = item.price * item.num + zj
      console.log("--总价 总价 总总价---", zj)
    }
    zj = zj.toFixed(2);
    this.data.zj = zj;

    // 配送费
    var psf = wx.getStorageSync("psf");
    console.log("00000----", psf)


    // 总价
    // var chooseIndex = wx.getStorageSync("chooseIndex");
    // console.log("---总价-判断是外卖还是自提---或是扫码--- chooseIndex --", chooseIndex)
    if (this.data.index === 1) {
      var totPrice = parseFloat(zj) + parseFloat(pack_money);
      this.data.totPrice = totPrice;
      console.log("---自提订单----加上 包装费之后----不需要配送费---", totPrice)
    } else {
      var totPrice = parseFloat(zj) + parseFloat(pack_money) + parseFloat(psf);
      this.data.totPrice = totPrice;
      console.log("-------加上 包装费之后-------", totPrice)
    }


    //判断是否使用优惠券
    if (!(this.data.coupon_full === "undefined" || typeof (this.data.coupon_full) === "undefined" || this.data.coupon_full === "")) {
      //使用优惠券/红包
      if (this.data.coupon_full <= totPrice) {
        wx.showToast({
          title: '已选择'
        })

        if (!(this.data.yhqcoupon_reduce === "undefined" || typeof (this.data.yhqcoupon_reduce) === "undefined" || this.data.yhqcoupon_reduce === "")) {
          totPrice = totPrice - this.data.yhqcoupon_reduce;
          this.data.totPrice = totPrice;
          console.log("---totPrice-  使用之后的价格  优惠券----", totPrice)
        } else {
          totPrice = totPrice - this.data.hbcoupon_reduce;
          this.data.totPrice = totPrice;
          console.log("---totPrice-  使用之后的价格  红包----", totPrice)
        }

        this.setData({
          totalPrice: totPrice,
          yhqcoupon_reduce: this.data.yhqcoupon_reduce,
          hbcoupon_reduce: this.data.hbcoupon_reduce,
        })
      } else {
        wx.showModal({
          title: '提示',
          content: '菜单金额不足以使用此优惠',
        })
      }
    }

    console.log("----选中------", newselectGoods)
    console.log("~~~~~~~~~~~~~总价~~~~~~~~~~~~~~~~", totalPrice)

    //  获得的积分
    var totalPrice = totPrice;
    if (totalPrice > 10) {
      var getIntegral = totalPrice * 0.1;
      getIntegral = getIntegral.toFixed(2)

      this.data.getIntegral = parseInt(getIntegral);
      console.log("转化为int  积分", this.data.getIntegral)
    }

    var e = util.formatTime(new Date()),
      a = util.formatTime(new Date()).substring(0, 10).replace(/\//g, "-"),
      s = util.formatTime(new Date()).substring(11, 16);
    console.log("当前时间e: ", e, "  当前日期: ", a.toString(), " 当前时间:", s.toString());

    var o = new Date(),
      i = o.getTime(),
      n = 2 * (24 - new Date(i).getHours());
    console.log(n, " 中国标准时间(年月日时分秒)：", new Date(i), " 时：", new Date(i).getHours(), " 分：", new Date(i).getMinutes());

    for (var d = [s.toString()], r = 1; r < n; r++) {//var d = [ "尽快送达" ]
      i = o.getTime() + 18e5 * r;
      var l = new Date(i).getMinutes();
      l < 10 && (l = "0" + l);
      var c = new Date(i).getHours() + ":" + l;
      d.push(c);
    }
    console.log("picker送达时间~所有有时间数据~~~~~~~~~~~", d)

    var arrTime = d;
    arrTime.shift();//删去数组中第一个元素，并返回第一个元素的值
    console.log("~~~~~~picker送达时间~~~~删去第一个元素~~~~~~~~~~~", arrTime)

    this.setData({
      datestart: a,
      timestart: s,
      date: a,
      time: s,
      wmtimearray: arrTime
    });

    var timetime = arrTime[this.data.wmindex];
    console.log("===onload==选择的送达时间=timetime=====###############=====", timetime)
    this.data.timetime = timetime;

    var u = this,
      h = t.storeid,
      g = wx.getStorageSync("users").id;

    app.util.request({
      url: "entry/wxapp/UserInfo",
      // wx.request({
      //   url: 'http://192.168.10.4:7300/mock/5b782535bfe92705006efea3/wxapp/UserInfo',
      cachetime: "0",
      data: {
        user_id: g
      },
      success: function (t) {
        var e = util.formatTime(new Date()).substring(0, 10).replace(/\//g, "-");
        console.log(t, e.toString()), "" != t.data.dq_time && t.data.dq_time >= e.toString() && (t.data.ishy = 1),
          u.setData({
            userInfo: t.data
          });

          u.data.total_score = t.data.total_score;
          console.log("^^^^^^ 用户的积分 我的积分 ^^^^^^",u.data.total_score)
      }
    }),

      app.util.request({
        url: "entry/wxapp/MyCoupons",
        // wx.request({
        // url: 'http://192.168.10.4:7300/mock/5b782535bfe92705006efea3/wxapp/Mycoupons',
        cachetime: "0",
        data: {
          store_id: h,
          user_id: g
        },
        success: function (t) {
          console.log("-----我的优惠券   takeoutform  -----", t.data);
          for (var e = [], a = [], m = [], s = 0; s < t.data.length; s++)
            1 == t.data[s].type && e.push(t.data[s]),
              2 == t.data[s].type && m.push(t.data[s]),
              4 == t.data[s].type && a.push(t.data[s]);
          var mj_coupon = m;
          console.log("--- mj_coupon 优惠券---", mj_coupon)
          u.setData({
            Coupons: e, //优惠券
            hbarr: a,   //红包
          });

         //满减券--------------------------------
         for (var mj of mj_coupon) {
          //根据满减条件的金额由大到小排序，for循环先循环的是金额最大的那个
          var obj = mj_coupon;
          obj.sort(util.sortOutBIG('reduce'));//排序，由大到小
          console.log("-----------obj 由大到小排序之后-----",obj)
          for (var mj of obj) {
            console.log("-------满减券---item  mj----", mj)

            console.log("-------满减   前--- totPrice----", totPrice)
            console.log("-------满减   条件  full ----", mj.full)
            console.log("-------满减   金额   reduce----", mj.reduce)
            if (totPrice > mj.full) {
              totPrice = totPrice - mj.reduce;
              console.log("-mj 满减的id--id: ",mj.id)
              u.data.mjcoupon_id = mj.id;//满减的id
              u.setData({
                mj_reduce: mj.reduce,
                yhq_active: !1,
                hb_active: !1
              })

              // 积分支付部分 钱
                if (totPrice > 100 && u.data.total_score > 100) {
                  if (u.data.ischeck){
                    totPrice = totPrice - 10;
                    u.data.totPrice = totPrice;
                    console.log("-----/使用积分之后的钱 0-------", u.data.totPrice)
                    u.setData({
                      used_total_score: 100,
                    })
                  }  
                  u.setData({
                    used_total_score: 100
                  })
                } else if (totPrice > 200 && u.data.total_score > 200) {
                  u.setData({
                    used_total_score: 200
                  })
                  if (u.data.ischeck){
                    totPrice = totPrice - 20;
                    u.data.totPrice = totPrice;
                  }
                } else if (totPrice > 300 && u.data.total_score > 300) {
                  u.setData({
                    used_total_score: 300
                  })
                  if (u.data.ischeck){
                    totPrice = totPrice - 30;
                    u.data.totPrice = totPrice;
                  }
                } else {
                  console.log("条件不足，不能使用积分")
                }
              u.data.totPrice = totPrice;
              console.log("***************---条件成立之后--满减后--金额--totPrice----", totPrice)
              break;
            }
           } 
           break;
        }
        }
      })

    // if (u.data.index === 1) {
    //   var totPrice = parseFloat(zj) + parseFloat(pack_money);
    //   u.data.totPrice = totPrice;
    //   console.log("---自提订单----加上 包装费之后----不需要配送费---", totPrice)
    // } else {
    //   var totPrice = parseFloat(zj) + parseFloat(pack_money) + parseFloat(psf);
    //   u.data.totPrice = totPrice;
    //   console.log("-------加上 包装费之后-------", totPrice)
    // }

// 判断是否是积分兑换商品------------------------------------------------
    if (u.data.thingType == 2 || u.data.thingType == "2") {
      u.data.pay_type = 4;
      app.util.request({
        url: "entry/wxapp/JfGoodsInfo",
        //  wx.request({
        //    url: 'http://192.168.10.4:7300/mock/5b782535bfe92705006efea3/wxapp/jfgoodsinfo',

        cachetime: "0",
        data: {
          id: u.data.exchange_goodsID
        },
        success: function (t) {
          console.log("商品信息--兑换商品的信息 --  t  ---", t.data),
            console.log("商品信息  兑换商品的类型---type---", t.data[0].type)
          var arr = t.data;
          for(var i of arr){
            delete i.number;
            delete i.process_details;
            delete i.attention_details;
            delete i.hb_money;
            delete i.goods_details;
            delete i.type;
            console.log("删除之后的数据   兑换物品 -------", arr)

            var jsonObject = arr[0];
            jsonObject.num = 1;
            console.log("删除之后的数据   兑换物品 增加数量-------", jsonObject)
          }
          var yiyi = [];
          yiyi.push(jsonObject);
          console.log("----------转化为数组之后的数据  yiyi---------",yiyi)
          wx.setStorageSync("selectGoods", yiyi)

          var psf = wx.getStorageSync("psf");
          var totPrice = 0;
          for(var item of yiyi){
            totPrice = totPrice + item.num * item.price + item.pack_money + psf
          }

          u.setData({
            cart_list: t.data,
            exchange_goods: 0,
            totalPrice: t.data[0].price,
            integral_money: t.data[0].integral_money,
            pagepage: 1,
            isloading: !1,
            pack_money: pack_money,
            getIntegral: u.data.getIntegral,
            totalPrice: totPrice,
            pay_type:4
          })

          u.data.integral_money = t.data[0].integral_money;
        }
      })
    }

    qqmapsdk = new QQMapWX({
      key: getApp().xtxx.map_key
    }),

      u.setData({
        xtxx: getApp().xtxx
      }),

      app.util.request({
        url: "entry/wxapp/StoreInfo",
        //   wx.request({
        // url: 'http://192.168.10.4:7300/mock/5b782535bfe92705006efea3/wxapp/StoreInfo',
        cachetime: "0",
        data: {
          store_id: h,
          type: 2
        },
        success: function (t) {
          console.log("----StoreInfo----", t.data);
          for (var item of t.data.psf) {
            this.data.psf = item.money;
          }
          console.log("----this.data.psf----", this.data.psf);
          wx.setStorageSync("psf", this.data.psf);
          u.setData({
            psf: this.data.psf
          });

          var e = t.data,
            a = t.data.store.coordinates.split(","),
            s = {
              lng: Number(a[1]),
              lat: Number(a[0])
            };
          console.log(s),
            u.setData({
              psfarr: t.data.psf,
              reduction: t.data.reduction,
              store: t.data.store,
              storeset: t.data.storeset,              
            }),
            console.log("--t.data.store--", t.data.store)
          console.log("----t.data.store.address----", t.data.store.address)
          wx.setStorageSync("storeaddress", t.data.store.address)
          u.countMj();
          u.countpsf();
          if(u.data.thingType != 2 && u.data.thingType != "2"){
            u.setData({
              cart_list: selectGoods,//购物车信息
              totalPrice: totPrice,
              pack_money: pack_money,
              getIntegral: u.data.getIntegral,
              pagepage: 1,
              isloading: !1
            });
          }  
        }
      });

  },

  //---------------------------------------------------------------gettotalprice此函数页面未使用到
  gettotalprice: function () {
    console.log("---this.data.gwcprice---", this.data.gwcprice)
    var t,
      e = this.data.gwcprice,
      a = this.data.gwcinfo.box_money,
      s = this.data.psf,
      o = this.data.mjmoney,
      i = this.data.xyhmoney,
      n = this.data.yhqkdje,
      d = this.data.hbkdje;
    t = 1 == this.data.userInfo.ishy ? parseFloat((Number(e) * (1 - Number(getApp().xtxx.hy_discount) / 100)).toFixed(2)) : 0;
    var r = (Number(o) + Number(i) + t + Number(n) + Number(d)).toFixed(2),
      l = (Number(e) + Number(s) - r).toFixed(2);
    l < 0 && (l = 0),
      console.log("gwcprice", e, "psf", s, "mjmoney", o, "xyhmoney", i, "totalyh", r, "finalPrice", l, "yhqkdje", n, "hbkdje", d, "zkmoney", t),
      this.setData({
        totalyh: r,
        finalPrice: l,
        zkmoney: t,
        isloading: !1
      });
    console.log("---------finalPrice实付款------------", l)
    wx.setStorageSync("finalPrice", l);//实付款
    var finalPrice = wx.getStorageSync("finalPrice")
    console.log("~~~~~~~实付款金额~~~~~~~~", finalPrice)
  },
  //---------------------------------------------------------------gettotalprice此函数未使用到

  //---------------------------------------------------------------jsmj此函数在页面中未使用到，conntMJ()方法中用到
  jsmj: function (t, e) {
    for (var a, s = 0; s < e.length; s++) if (Number(t) >= Number(e[s].full)) {
      a = s;
      break;
    }
    return a;
  },

  //---------------------------------------------------------------countMj此函数页面中未使用到，onload()中使用到
  countMj: function () {
    var t = this.data.gwcprice,
      e = this.data.reduction.reverse(),
      a = this.jsmj(t, e),
      s = this.data.isnewuser;
    console.log(t, e, a, s);
    var o = 0;
    0 < e.length && null != a && "2" == s && (o = e[a].reduction), this.setData({
      reduction: e,
      mjindex: a,
      mjmoney: o
    });
  },

  //---------------------------------------------------------------countpsf此函数在页面中未使用到，别处调用
  countpsf: function () {
    var s = this,
      t = wx.getStorageSync("users").id,
      // a = s.data.sjstart,
      a = this.data.store.coordinates,
      o = 1e3 * Number(this.data.storeset.ps_jl),
      i = this.data.psfarr;
      console.log("countpsf---this.data.psfarr----i--", i),
      console.log("---s.data-",s.data)
    console.log("---this.data-", this.data.store.coordinates)
      // 默认地址
      app.util.request({
        url: "entry/wxapp/MyDefaultAddress",
        //   wx.request({
        // url: 'http://192.168.10.4:7300/mock/5b782535bfe92705006efea3/wxapp/mydefaultaddress',
        cachetime: "0",
        data: {
          user_id: t
        },
        success: function (t) {
          if (console.log(t.data), t.data) {
            var e = {
              lng: t.data.lng,
              lat: t.data.lat
            };
            console.log("--------a-------",a,"-------e------" ,e,"----o 配送距离---", o),
              s.setData({
                address: t.data,
                mobile: t.data.tel,
                name: t.data.user_name
              });

            var address = t.data;
            console.log("---外卖收货地址---", address)
            wx.setStorageSync("address", address)

            s.distance(a, e, function (t) {
              console.log("~~~~~~~~~~s.distance~~~~~~~~~~~~")
              o < t ? (s.setData({
                dzisnormall: !1
              })
              ) : s.setData({
                dzisnormall: !0
              });

              var e = (t / 1e3).toFixed(2);
              console.log("---t---", t, "---0---", o, "---e---", e);
              for (var a = i.length - 1; 0 <= a; a--)
                if (console.log(a), Number(e) >= Number(i[a].end) || Number(e) >= Number(i[a].start) && Number(e) < Number(i[a].end)) {
                  console.log("a-----配送费的长度减一--------", a, "-----i[a].money----配送费", i[a].money),
                    s.setData({
                      psf: i[a].money,
                      psfbf: i[a].money
                    }),
                    s.gettotalprice();
                  break;
                }
            });
          } 
            else t.data ? s.setData({
            psf: 0,
            psfbf: 0
          }) : s.setData({
            psf: i[0].money,
            psfbf: i[0].money
          }), s.gettotalprice();
        }
      });
    this.onShow();
  },

  onReady: function () { },
  onShow: function () {
    var t = wx.getStorageSync("note");
    console.log(t),
      this.setData({
        note: t
      });
    console.log("~~~~~~~~备注的信息:~~~~~~", t)
  },
  onHide: function () { },
  onUnload: function () { },
  onPullDownRefresh: function () { },
  onReachBottom: function () { }
});
