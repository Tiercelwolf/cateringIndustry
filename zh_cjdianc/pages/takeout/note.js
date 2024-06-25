var app = getApp();

Page({
    data: {
        bzarr: [ {
            id: 0,
            name: "不要辣",
            checked: !1
        }, {
            id:1,
            name: "少点辣",
            checked: !1
        }, {
            id: 2,
            name: "不要葱",
            checked: !1
        }, {
            id: 3,
            name: "多点葱",
            checked: !1
        }, {
            id: 4,
            name: "多点醋",
            checked: !1
        } ],
        // selectedindex: 0,
        color: "#34aaff",
        bznr: ""
    },
    selected: function(e) {
        var n = e.currentTarget.dataset.index, 
            t = this.data.bzarr;
        console.log("---选择的数组的id---",n)
        for (var item of t){
          item.id == n &&(
            item.checked = !item.checked
          )
        }
        wx.setStorageSync("nindex", n) 

        this.setData({
            bzarr: t
        });
    },
    bznr: function(e) {
      console.log("--e.detail.value---",e.detail.value), 
        this.setData({
            bznr: e.detail.value
        });
      var t = e.detail.value;
      console.log("-----text文本框中输入的内容----", t)
      wx.setStorageSync("text", t)
    },
    submitbz: function() {
        // for (var e = this.data.bzarr, n = [], t = this.data.bznr, a = 0; a < e.length; a++) 
        var t = wx.getStorageSync("text");
        for (var e = this.data.bzarr, n = [], a = 0; a < e.length; a++) 
          e[a].checked && n.push(e[a].name);

        if ("" == t && 0 == n.length) 
          return wx.showModal({
              title: "提示",
              content: "请选择标签或者输入备注后提交！"
          }), !1;
        console.log("--文本框--",t, "--文本框+选择--",n.toString() + t), 
        wx.setStorageSync("text", t),
        wx.setStorageSync("select",n.toString() ),
        wx.setStorageSync("note", n.toString() + ";" + t)

        var not = wx.getStorageSync("note");
        console.log("--not   存进去的是什么-------", not)
        wx.navigateBack({});
    },
    onLoad: function(e) {
      app.setNavigationBarColor(this);
      var note_text = wx.getStorageSync("text"),//文本框
          note_select = wx.getStorageSync("select"),//选择的类型 
          note_Info = wx.getStorageSync("note");
      console.log("------note_text 文本框------", note_text)
      console.log("------note_select 选择框-----", note_select)
      console.log("---note 所有的备注信息---", note_Info)

      var now = note_select;
      var arr = now.split(",");//分割成字符串数组
      console.log("~~~~arr~~~`", arr)  
      console.log("~~~~arr~~~`", this.data.bzarr)
   
    
      // for (var item of arr){
      //     console.log("---我要看看arr-选择的类型--",arr)  
      //   // var obj = {
      //   //   name: item  
      //   // }
      //   // console.log("对象----",obj)
      //   for (var temp of this.data.bzarr) {
      //     console.log("----temp----", temp)
      //   }
      // } 

      // var arrvalue;
      // var arrvalues;
      // for(var i = 0; i < arr.length; i++){
      //   arrvalue = arr[i];
      //   for(var j = 0; j < this.data.bzarr.length; j++){
      //     arrvalues = this.data.bzarr[j];
      //     if(){

      //     }
      //   }
      // }
      
      for (var item of arr) {
        console.log("```选择的口味``", item)
        for (var temp of this.data.bzarr) {
          console.log("===所有的口味===", temp.name)
          item == temp.name && (temp.checked = true)
        }
      }


      this.setData({
        note_text: note_text,
        note_select: note_select,
        note_Info: note_Info,
        bzarr : this.data.bzarr
      }) 
    },

  // submitbz: function () {
  //   for (var e = this.data.bzarr, n = [], t = this.data.bznr, a = 0; a < e.length; a++)
  //     e[a].checked && n.push(e[a].name);

  //   if ("" == t && 0 == n.length)
  //     return wx.showModal({
  //       title: "提示",
  //       content: "请选择标签或者输入备注后提交！"
  //     }), !1;
  //   console.log("--文本框--", t, "--文本框+选择--", n.toString() + t),
  //     wx.setStorageSync("text", t),
  //     wx.setStorageSync("select", n.toString()),
  //     console.log("---select---", n.toString())
  //   wx.setStorageSync("note", n.toString() + t),
  //     wx.navigateBack({});
  // },
  // onLoad: function (e) {
  //   app.setNavigationBarColor(this);
  //   var note_text = wx.getStorageSync("text"),//文本框
  //     note_select = wx.getStorageSync("select"),//选择的类型 
  //     note_Info = wx.getStorageSync("note");
  //   console.log("------note_text 文本框------", note_text)
  //   console.log("------note_select 选择框-----", note_select)
  //   console.log("---note 所有的备注信息---", note_Info)

  //   var now = note_select;
  //   var arr = now.split(",");//分割成字符串数组
  //   console.log("~~~~arr~~~`", arr)


  //   for (let item of arr) {
  //     console.log("---我要看看arr-选择的类型--", arr)
  //     // if(arr.indexOf(note_select) != -1){
  //     //   console.log("!!!!----存在---")
  //     //   console.log("!!!!-----",arr.indexOf(note_select))
  //     //   // item.checked = true
  //     // }
  //     for (var temp of this.data.bzarr) {
  //       console.log("----temp----", temp)
  //     }
  //   }



  //   // var select = wx.getStorageSync("nindex")
  //   // console.log("---------————————————", select)

  //   this.setData({
  //     note_text: note_text,
  //     note_select: note_select,
  //     note_Info: note_Info,
  //   })

  // },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    onShareAppMessage: function() {}
});