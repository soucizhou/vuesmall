# supermall

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Run your tests
```
npm run test
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

# vue学习防蘑菇街项目

## git

```
New repository
Add a license:MIT License
git clone https://github.com/soucizhou/vuesmall.git
git status
git add .
git commit -m '项目提交'
git push
///
git remote add origin https://github.com/soucizhou/vuesmall.git
* fatal:remote origin already exists
* git remote rm origin
git push -u origin master
```

## 划分目录

```
assets 资源
  css
  img
components 公共组件，能在几个组件中公用的，不放所有组件
  common 各种项目都能用的公共组件
  content 和当前业务相关的公共组件
views 组件，视图最大分类
router 路由
store vuex管理
network 网络相关封装
common 公共的js文件
  const.js 多个地方都用到的常量
  utils.js 公共方法
  mixin.js 混入
```

## css文件引入

```
normalize.css 在不同的浏览器css 标签长的不一样，to resets，初始化最终长的一样点
base.css padding，margin，fontsize等等初始化
App.vue引入base引入normalize
```

### base.css

```
:root -> 获取根元素html的伪元素
--color-text: #666; 定义变量
color: var(--color-text); 使用变量
```

## 配置路径别名和代码统一风格

```
../../就不用写了
新建vue.config.js 别名
内部已经配置过'@':'src'
.editorconfig 风格
```

##  tabbar

```
npm install vue-router --save

views放四个文件夹和对应的页面.vue

router文件夹index.js文件配置router
	
main.js那挂载

MainTabBar.vue 下导航组件 当前业务放components/content里面

TabBar.vue 下导航组件的定位，背景颜色，含插槽/放components/common

TabBarItem.vue 每个菜单的图标文字插槽，根据调用者传参切换颜色，根据	
$route.path改变当前地址
	div包slot插槽，在div里做判断
	
	<tab-bar-item path="/home" activeColor="blue">调用者为父
	
	props接收父传子的属性
		path 路径
		activeColor 颜色
		
<link rel="icon" href="<%= BASE_URL %>favicon.ico">当前文件所在的路径找图标 jsp语法
```

## 写首页导航封装

### 分析

```
导航分类，有标题带购物车数字，tab选项卡，左右图标，在components/common建组件，文件夹navbar，NavBar.vue组件，文件夹小写，组件大写
```

### NavBar.vue

必须有根，多个地方使用不能起id，样式class
用div的class包slot插槽flex布局，左中右，slot的name属性，记名插槽，调用者slot=name属性使用，没掉不显示
导航栏高度一般都是44px，tabbar 49px
left，right有设置宽度的话，center的flex:1就占据剩余宽度

```js
<div class="tab-bar">
    <div class="left"><slot name="left"></slot></div>
    <div class="center"><slot name="center"></slot></div>
    <div class="right"><slot name="right"></slot></div>
</div>

```

home.vue里导入注册使用

```js
<div id="home">
    <nav-bar class="home-nav">
        <div slot="center">购物街</div>
	</nav-bar>
</div>

import NavBar from "components/common/navbar/NavBar";
  export default {
    name: "Home",
    components: {
      NavBar
   }
}
```

## axios

```
npm install axios --save
request.js 返回的是Promise 用的时候函数直接.then
network下新建home.js专门为Home.vue接收请求拿到数据
```

### home.js

```
为了统一管理url
import {request} from "./request" 大括号是因为request只是export ，没有default
return 
```

## home.vue

```js
//引入NavBar.vue
//引入home.js
import { getHomeMultidata, getHomeGoods } from "network/home";

//组件完成之后发送请求，created()，home.js导出的是方法，getHomeMultidata加个小括号
created() {
    this.getHomeMultidata()
},

//data(){}用数组保存res请求结果 为什么不在created中直接用，因为函数中局部变量，临时变量，调完就销毁
data() {
    return {
      banners: [],
      recommends: []
    };
},

//顶部定住用position: fixed;，padding-top: 44px;
//import分类空行隔开
//组件吸顶法 position:sticky:top:44px
//created()中只放结果，不放逻辑代码
methods: {
    getHomeMultidata() {
      getHomeMultidata().then(res => {
        this.banners = res.data.banner.list;
        this.recommends = res.data.recommend.list;
      });
    }
}    
```

## 轮播图

复制swiper文件夹，index.js文件，
在home文件夹新建childrencomps，这里还放别的
新建HomeSwiper.vue为轮播，

```js
//导入
import { Swiper, SwiperItem } from "components/common/swiper";
//注册
components: {
  Swiper,
  SwiperItem
},

//props接收传过来的数据
props: {
    banners: {
      type: Array,
      default() {
        return [];
      }
    }
},

//swiper加v-if="banners.length"
//v-for循环swiper-item
//href src加冒号才能识别
    
<swiper v-if="banners.length">
      <swiper-item v-for="(item,index) in banners" :key="index">
        <a :href="item.link">
          <img :src="item.image" alt="" >
        </a>
      </swiper-item>
</swiper>

home.vue
//使用
<home-swiper :banners="banners"/>
//导入
import HomeSwiper from "./childrencomps/HomeSwiper";
//注册
components: {
    HomeSwiper
},
```

## RecommendView.vue

```js
//a链接包img和text，text用{{}}

//props接收传过来的数据
props: {
    recommends: {
      type: Array,
      defatule() {
        return [];
      }
    }
  },
      
//渲染数据，item.title用双大括号，:href，:src加冒号才能识别
<div class="recommend">
    <div v-for="(item,index) in recommends" :key="index" class="recommend-item">
      <a :href="item.link">
        <img :src="item.image" alt  />
        <div>{{item.title}}</div>
      </a>
    </div>
  </div>   

home.vue
//使用
<recommend-view :recommends="recommends" />
//导入
import RecommendView from "./childrencomps/RecommendView";
//注册
components: {
    RecommendView
},
```

##  TabControl.vue

```js
公共组件只适用当前项目 content文件夹中建
如果只是文字不一样就没有必要搞插槽slot

//props接收传过来的数据，
props:{
  titles:{
    type:Array,
	default() {
	  return []
	}
  }
},
//调用者那边    
<tab-control :titles="[ '精选', '精选' , '精选' ]"/>    

props接收传过来的titles数组有多少文字再渲染div v-for>span border-bottom
调用者:titles="[]"

//当前选中的为红色实现
data() {
  return {
   currentIndex:0 记录当前中
  }
}

//class加冒号
<div class="tabcontrol">
  <div v-for="(item, index) in titles" :key="index" 
  class="tab-control-item"
  :class="{active:index === currentIndex}"
  @click="itemClick(index)"
>
  <span>{{item}}</span>
  </div>
</div>

//点击
methods:{
    itemClick(index) {
        this.currentIndex = index
        this.$emit('tabClick',index)//发出去的方法和参数调用者这样@tabClick="tabClick"接收
    }
}
```

## 商品列表请求

先接收所有数据，点击哪个就渲染哪个，搞一个变量存储三个数据，点击什么取什么

```js
data() {
    return {
      goods: {
        pop: { page: 0, list: [] },
        new: { page: 0, list: [] },
        sell: { page: 0, list: [] }
      },
    };
```

默认请求第一页，上拉加载增加
home.js增加请求函数参数type,page
调用三次请求type变化，page动态=goods[type].page+1
怎么把一个数组放到另一个数组里
page先+1
数组.push(...数组)，数组解析，一个一个传进去，不是直接全部复制
请求后保存到list中，page+=1

```js
created() {
    //获取商品列表的数据
    this.getHomeGoods("pop")
    this.getHomeGoods("new")
    this.getHomeGoods("sell")
}

methods: {
   getHomeGoods(type) {
      //先定义好默认第一页
      const page = this.goods[type].page + 1;
      //拿到页和type请求数据
      getHomeGoods(type, page).then(res => {
        //存数据,数组解析，一个一个传进去，不是直接全部复制
        this.goods[type].list.push(...res.data.list)
        //页码增加
        this.goods[type].page += 1
      }) 
    } 
}
```

###  商品列表展示

```js
大组件包小组件v-for小组件
复用，公共组件只适用当前项目 content文件夹中建goods文件夹中大小组件
GoodsList.vue props goods array 
goodsListItem props goodsItem Object
  img p span
tabControl.vue往外面传数据，this.$emit('tabClick',index) 传的方法，和参数，发出的是tabClick， 外面属性就写@tabClick="tabClink",methods:中添加方法拿参数index
根据获取到的index更改GoodsList.vue传参
data中添加属性currentType：为当前goodslist传参
tabClink判断参数改变currentType的值
switch 如果最后没有default可以不加break
属性中尽量不要写长的代码，放到计算属性computed中，加return，加this  
```

GoodsList.vue里面遍历商品列表数据,数组里每个值的对象传给GoodsListItem.vue

```js
//暂时先渲染一种
<goods-list :goods="goods['pop'].list"/>
//接收调用者传过来的
props:{
    goods:{
      type:Array,
      default() {
        return []
      }
    }
},
//再把数据每一项传给子组件
<div class="goods">
    <goods-list-item v-for="(item,i) in goods" :key="i" :goods-item="item"/>
</div>

```

GoodsListItem.vue

```js
//接收调用者传过来的
props:{
    goodsItem:{
      type:Object,
      default() {
        return {}
      }
    }
},
 //渲染   
  <div class="goods-item" >
    <img :src="goodsItem.show.img" alt="" >
    <div class="goods-info">
      <p>{{goodsItem.title}}</p>
      <span class="price">{{goodsItem.price}}</span>
      <span class="collect">{{goodsItem.cfav}}</span>
    </div>
  </div>    
```

点击tabControl切换其他的数据

```js
//tabControl.vue中把记录的点击index发出去
methods:{
    //点击时记录当前选择，把当前选择的发出去
    itemClick(index) {
        this.currentIndex = index
        //切换数据要用
        this.$emit('tabClick',index)
    }
}

//Home.vue中接收方法
<tab-control :titles="[ '精选', '精选' , '精选' ]" @tabClick="tabClick"/>

//存个变量切换    
data() {
    return {
      currentType: "pop",
    };
  },   
//通过接收来的index改变变量的值      
methods: {
  tabClick(index) {
    switch (index) {
	  case 0:
	    this.currentType = "pop";
	    break;
	  case 1:
	    this.currentType = "new";
	    break;
	  case 2:
	    this.currentType = "sell";
	}
  }
}  

//通过计算属性动态传参给Goodslist
<goods-list :goods="showGoods"/>
    
computed: {
    showGoods() {
      return this.goods[this.currentType].list;
    }
},    
```

## Better-Scroll

``` 
当页面内容超过当前窗口会产生滚动条属于原生滚动，在移动端无滑动效果和明显卡顿
早期iscroll解决问题几年前过期

还有me-scroll
```

### Better-Scroll安装使用

```js
github找源码，左边tag/dist文件夹
npm install better-scroll --save,  save生产依赖
原生局部滚动，元素css属性height:100px，overflow-y:scroll;
import BScroll from 'better-scroll',如果哪天不能要那个了，最好其他地方封装再导出
li{fenleiliebiao$}*99
 <div class="wrapper">  wrapper里面只能放一个元素
     <ul>
     	li{fenleiliebiao$}*99
.wrapper{
    height: 150px;
	overflow: hidden; 不显示滚动条
created下不能拿元素，会为空    
mounted() {
    new BScroll('.wrapper'((或者填这个)),{  需要滚动的元素 
        
    })
}
js文件中使用，
const bscroll = new BScroll(document.querySelector('.wrapper'),{})
```

### better-Scroll监听实时滚动位置

```js
//probeType的值，0,1不侦测位置，2不包括惯性，3，全部侦测，click设置为true才能监听到点击事件仅限制div那些，不限制button,pullUpLoad上拉加载设置为true或者obj开启
const bscroll = new BScroll(document.querySelector('.wrapper'),{
    probeType:3，
    click:true,
    pullUpLoad:true
})
bscroll.on('scroll',(position) => { //侦测位置
    console.log(position)
})
bscroll.on('pullingUp',() => { //上拉加载加载到最底部时发送请求
    console.log('上拉加载')
    //请求，展示，后
    bocroll.finishPullUp()//继续加载
})
```

### better-Scroll封装

```js
封装到components的common里其他项目也用
哪个地方想滚动，往封装的组件里包起来就行
div包div包想要滚的内容slot，因为Scroll获取的元素中只能存在一个子元素
import导入，在mounted()中new BScroll，用data中的变量保存
在vue里面想明确的拿到某个元素的办法是通过给元素设置ref="ss"  this.$refs.ss获取这个属性 一般绑定给子组件 也可以在div等普通元素上绑定
vh叫viewport height视口高度

<template>
  <div ref="wrapper">
    <div>
      <slot></slot>
    </div>
  </div>
</template>

<script>
import BScroll from "better-scroll";

export default {
  name: "Scroll",
  data() {
    return {
      scroll: null//定义个变量scroll保存
    };
  },
  props: {
    //监听位置，0,1不侦测位置，2不包括惯性，3，全部侦测
    probeType: {
      type: Number,
      default: 0
    },
    //
    pullUpLoad: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    //滑动到指定位置
    scrollTo(x, y, time = 500) {
      this.scroll && this.scroll.scrollTo(x, y, time);
    },
    //标识一次上拉加载动作结束
    finishPullUp() {
      this.scroll.finishPullUp();
    },
    //重置刷新
    refresh() {
      this.scroll && this.scroll.refresh();
    }
  },
  //mounted:在模板渲染成html后调用，通常是初始化页面完成后，再对html的dom节点进行一些需要的操作
  mounted() {
    //启用滚动，监听位置，通过$refs获取，ref明确绑定
    this.scroll = new BScroll(this.$refs.wrapper, {
      //监听位置，0,1不侦测位置，2不包括惯性，3，全部侦测
      probeType: this.probeType,
      //click设置为true才能监听到点击事件仅限制div那些,不限制button
      click: true,
      //pullUpLoad上拉加载设置为true或者obj开启
      pullUpLoad: this.pullUpLoad
    });

    //侦测位置
    this.scroll.on("scroll", position => {
      //把位置的值发给调用者
      this.$emit("scroll", position);
    });
    //上拉加载加载到最底部时发送请求
    this.scroll.on("pullingUp", () => {
      //把到底部时的方法发出去
      this.$emit("pullingUp");
    });
  }
};
</script>

<style scoped>
</style>

```

### home.vue中使用better-scroll

```js
//导入，包裹，home 100vh视口高度
//上下高度锁死，中间通过定位距离上的高和下的高来计算
//给中间高度设为calc(100%-93px)也可以，上面加下面的高度，但得改为margintop
//overflow: hidden隐藏滚动条
import Scroll from "components/common/scroll/Scroll";
<scroll class="content">包裹的那堆</scroll>

//加这个才有滚动效果
 .content {
  overflow: hidden;
  position: absolute;
  top: 44px;
  bottom: 49px;
  left: 0;
  right: 0;
}     
```

### 添加回到顶部按钮

```js
先显示出来，再搞隐藏，其他地方也有封装到 content 和当前业务相关的公共组件
position:fixed定位到右下角，点击事件
this.scroll.scrollTo(0,0)回到顶部
要想监听组件的点击事件，需要加参数@click.native
给组件设置ref，this.$refs能访问到组件里的data
img src ~assets

<scroll ref="scroll">
<back-top @click.native="backClick" ></back-top>
methods: {
  backClick() {
      this.$refs.scroll.scrollTo(0,0,300)
  },
}      
```

### 顶部按钮显示隐藏

```js
实时监听，scroll组件获取props参数判断是否监听 :参数="3" props:{type:Number,default:1}
bscroll.on('scroll',(position) => { //侦测位置
    通过this.$emit('scroll',position)传出去
})
调用组件时写上@scroll="方法"
方法(position){判断y值>1000}
v-show="变量"
data中先存变量默认false
//传参给scroll启动监听，接收传过来的位置的值
<scroll :probe-type=3 @scroll="contentscroll">
 
 //用v-show显示隐藏   
<back-top v-show="topShow"></back-top>    
//存个变量
data() {
    return {
      topShow:false,//不显示top图标
    };
},    

//接收滚动位置信息
methods: {    
contentscroll(position) {
	this.topShow = -position.y>1000
}    
```

### 上拉加载

```js
通过props接收参数设置pullUpLoad:true
scroll.on('pullingUp',() => { //上拉加载加载到最底部时发送请求
    this.$emit('方法')传出去
    bocroll.finishPullUp()//继续加载
})
监听上拉
//传参给scroll组件启动上拉加载，接收上拉加载的方法
<scroll :pull-up-load="true" @pullingUp="loadMore">

//上拉加载
methods:{
  loadMore() {
    this.getHomeGoods(this.currentType)
  }
}    
//发送请求的地方再增加继续加载数据
getHomeGoods(type) {
        //上拉加载更多的继续加载
     this.$refs.scroll.finishPullUp()
   }) 
},
```

### 滚动bug

```js
scroll根据内容高度已算好，并不知道图片加载完整的高度
scroll.srcollerHeight的高度不正常，betterscroll中的content的子组件决定
监听每张图片是否加载完成，scroll.refresh()重新计算高度
@load="imageLoad"图片元素加这个vue监听
原生是img.onload=function() {}
vue实例可以作为事件总线，main.js中 Vue.prototype.$bus = new Vue() 原型中增加
this.$bus.$emit('imageLoad') 传
mounted()中调用 图片还没加载完就发送刷新会出bug
this.$but.$on('imageLoad', () => {
    this.$refs.scroll.refresh()
}) 收


//main.js
Vue.prototype.$bus = new Vue()

//GoodsListItem.vue

<img :src="goodsItem.show.img" alt="" @load="imageLoad">
methods:{
    //监听图片加载完成把方法发出去
  imageLoad() {
    this.$bus.$emit('itemImageLoad')
  }
}    
//Home.vue
mounted() {
    //接收列表的图片加载完成后刷新scroll计算高度
    this.$bus.$on('itemImageLoad', () => {
        this.$refs.scroll.refresh() 
    })
},
```

### refresh找不到的bug

```js
img@load $bus传过去后，因为是在created中获取，可能没渲染完为null值就通过$refs.scroll.refresh刷新就没找到
srcoll中通过this.scroll && this.scroll.方法保证不为空
```

### .scroll.refresh()调用次数过多问题

```js 
@change=""监听输入框value改变
防抖函数，没有防抖是.refresh()调用30次
将refresh函数传入到debounce函数中，生成一个新的函数
 this.$bus.$on('itemImageLoad', () => {
const refresh = debounce(func, delay){
  let timer = null
  return function (...args) { //...是说明可以传多个
  	if (timer) clearTimeout(timer)
  	timer = setTimeout(() => {
  	  func.apply(this, args)
  	}, delay)
  }
}
refresh传进去，不能加括号
第一次进函数，执行timer = ，它会延迟，之后因为每张图片加载$.bus调用频繁，延迟的过程中就没了，变成第二次进函数，又来到if(timer) 不为空，把第一次的延迟清空，执行timer = ，它会延迟，之后因为$.bus调用频繁，延迟的过程中就没了，变成第二次进函数，类推到30次时，，执行timer = ，它会延迟，$bus没调用了，就拿到传进去的func this.$refs.scroll.refresh执行函数，传了个this和args
 setTimeout中的this指向window或全局对象
 
//home.vue
 methods:{
      // 防抖函数
    debounce(func, delay) {
      let timer = null
      return function (...args) {
        if(timer) clearTimeout(timer)
        timer = setTimeout(() => {
          func.apply(this, args)
        }, delay)
      } 
    },
 }

mounted() {
  // this.$refs.scroll.refresh不能加括号，如果加了括号等于把返回值传给他
  const refresh = this.debounce(this.$refs.scroll.refresh,50)//this.debounce才能访问到方法
  //接收列表的图片加载完成后刷新scroll计算高度
  this.$bus.$on('itemImageLoad', () => {
    refresh()
  })
},
    
//防抖函数在其他地方也会用到，放到公共的js文件里common/utils.js
export function debounce(func, delay) {
  let timer = null
  return function (...args) {
    if(timer) clearTimeout(timer)
    timer = setTimeout(() => {
      func.apply(this, args)
    }, delay)
  } 
}    

//home.vue使用
import { debounce } from "common/utils"   
const refresh = debounce(this.$refs.scroll.refresh,50)     
```

### tabControl吸顶

```js
获取组件的offsetTop
tabOffsetTop保存值
组件里ref，mounted中$ref获取
所有的组件有一个属性$el,用于获取组件中的元素的
$el.offsetTop
轮播图的图@load="方法"，方法$emit('组件属性')
父组件@组件属性="方法"
方法里存offsetTop的值
load发了4次，太多，实际只需要获取一次的高度，不需要debounce
data() {
  return {
      isLoad:false
  }
}
方法里通过变量改变只拿一次
监听scroll传过来的position滚动和offsetTop对比
conentscroll(position)中监听
isTabFixed变量默认false
isTabFixed = position.y > offsetTop 大于吗，大于就变true
better-Scroll通过transform改变子元素位置，子元素tabControl fixed定位无效 
复制一份tab-control在nav-bar下，加class盖上轮播图，relative，z-index
is—show = position滚动和offsetTop对比结果
tabControl组件里的currentIndex记录着当前选的项是哪个
tabClick(index)监听点击事件里，通过this.$refs.tabControl1.currentIndex = index
this.$refs.tabControl2.currentIndex = index
这是获取子元素的data的方法

//HomeSwiper.vue
<img :src="item.image" alt="" @load="ImageLoad">
methods: {
    //监听图片加载完成发送方法给Home.vue
    ImageLoad() {
      //load发了4次，太多，实际只需要获取一次的高度
      if (!this.isLoad) {
        this.$emit('SwiperImageLoad')
        this.isLoad = true
      }
      
    }
  }

//Home.vue
//顶部的
  <tab-control
      :titles="[ '精选', '精选' , '精选' ]"
      @tabClick="tabClick"
      ref="tabControl1"
      v-show="isTabFixed"
      class="tabControlTop"
    />
//接收轮播图图片加载完成          
<home-swiper :banners="banners" @SwiperImageLoad="SwiperImageLoad"/>    
//下面的    
 <tab-control :titles="[ '精选', '精选' , '精选' ]" @tabClick="tabClick" ref="tabControl2"/>    
     
data() {
    return {
      isTabFixed:false,//不显示顶部的tabcontrol
      tabOffsetTop:0,//tabcontrol2的距离顶部的高度
    };
  },     
 
      
methods:{
    //接收滚动位置信息
    contentscroll(position) {
      this.topShow = -position.y>1000
      //到顶部后改成true显示顶部的tabcontrol  
      this.isTabFixed = -position.y > this.tabOffsetTop
    },
    
    
    //轮播图的图片加载完成后记录组件距离顶部的高度
    SwiperImageLoad() {
      this.tabOffsetTop = this.$refs.tabControl2.$el.offsetTop
    }
    
    
     tabClick(index) {
      //改变子元素的data的值
      this.$refs.tabControl1.currentIndex = index
      this.$refs.tabControl2.currentIndex = index
    },
}
```

### home离开时保留状态

<keep-alive>是Vue的内置组件，能在组件切换过程中将状态保留在内存中，防止重复渲染DOM。

- include: 字符串或正则表达式。只有匹配的组件会被缓存。
- exclude: 字符串或正则表达式。任何匹配的组件都不会被缓存。

```js

让组件不销毁
keep-alive包裹组件
destroyed() {
	console.log('看销毁')
}
离开时保存原来的位置，进来时再设置
activated() {
this.$refs.scroll.refresh()必带，会出问题
} 进来设置
deactivated() {} 出去记录

//app.vue
<keep-alive>
      <router-view />
</keep-alive>

//让Home保留原来的位置
//钩子的触发顺序created-> mounted-> activated，退出时触发deactivated。
//使用了keep-alive组件后才会有的，否则则不存在
home.vue
  activated() {
    //滚动到记录的位置
    this.$refs.scroll.scrollTo(0, this.saveY, 0)
    //重新计算位置
    this.$refs.scroll.refresh()
  },
  deactivated() {
    //记录位置
    this.saveY = this.$refs.scroll.scroll.y
  },
      
      
  //概率失效，降级版本
  npm install better-scroll@1.13.2 --save    
```

## 商品详情

### 跳转与传参

```js
点击商品获取id跳转到详情页
view中建立detail文件夹detail.vue
详情页也为路由
监听GoodsListItem的点击 this.$router.push
跳转需要传递参数id，根据id请求数据，动态路由传递id，方式1在路由里.push(/detail:iid), 方式2,push({path:'/路由',query:{name:'why',age:18})
detail.vue中拿id，data retun iid保存                         created中 this.$route.params.iid       

//router/index.js加路由带参数
const Detail = () => import('../views/detail/Detail')                         {
    path: '/detail/:iid',//参数要加冒号
    component: Detail
}

//GoodsListItem.vue点击添加路由传id
<div class="goods-item" @click="clickImage">
 methods:{
     this.router.push('/detail/' + this.goodsItem.iid)
 }   
```

### 导航栏封装

```js
detail.vue import navbar components navbar
详情页复杂，在detail中新建childComps/DetailNavBar
import navbar components navbar
navbar div slot name center div v-for titles
detail import detailnavbar
DetailNavBar 中 data return [四个导航]
div v-for {{item}}
class display flex ,flex 1
点击变色
(item,index) 
data currentIndex:0
:class = "{active:index === currentIndex}"
.active: red
@click="titleClick(index)"
titleClick(index) this.currentindex = index
div slot name left img back.svg @click backclick
this.router.go(-1)

//DetailNavBar.vue
<nav-bar>
    <div slot="left" class="back" @click="backClick">
        <img src="~assets/img/common/back.svg" alt />
            </div>
	<div slot="center" class="titles">
    <div 
		class="titles-item" 
		v-for="(item, index) in titles" :key="index"
		:class="{active : index === currentIndex}"
		@click="titleClick(index)"
	>
    {{item}}</div>
	</div>
</nav-bar>

//导入注册公共组件NavBar
import NavBar from "components/common/navbar/NavBar";
components: {
    NavBar
},

data() {
    //这里存放数据
    return {
        titles: ["商品", "参数", "评论", "推荐"],
        currentIndex:0//记录当前点击是哪个title
    };
},
 
methods: {
   //把点击的index传给保存的变量
  titleClick(index) {
     this.currentIndex = index
  },
  //返回页面
  backClick() {
     this.$router.go(-1)
  }
} 
```

### 拿数据

```js
详情页请求做封装，network detail.js
import request
export func getdetail(iid){return request url params idd }
detail.vue import created() 
data保存
{getdetail(this.idd).then(res => { console.log(res)}) }

//detail.js
import { request } from './request'

export function getDetail(iid){
  return request({
    url: '/detail',
    params: {//传参给后台
      iid
    }
  })
}

//Detail.vue
import { getDetail } from "network/detail";

data() {
    return {
      iid: null,//把iid存起来
    };
},
    
created() {
   //赋值iid
   this.iid = this.$route.params.iid;
   //请求拿到id后的数据
   // this.getdetail()
   this.getDetail();
}, 
        
methods: {
  //请求数据
  getDetail() {
  	getDetail(this.iid).then((res) => {
  	console.log(res)
  	})
  }
}    
```

### 详情轮播

```js
detail.vue data 中存topImages数组
建一个children中detailswiper组件
props：{
    swiperImage:{
        type:Array,
            default() {
                return []
            }
    }
}
接收传过来的图片数组
import {swiper, swpieritem} 
components注册
swiper swiperitem v-for 数组 img item
swiper 设置height，overflow hidden限制图片过大
点击商品跳转后发现轮播图数据未变
rouer-view被keep-alive了
exclude="Detail"排除,需要在组建中加name属性
swiper作为根，不套div
v-if="topImages.length"

Detail.vue
//把轮播图的地址传给子组件
<detail-swiper :swiper-images="topImages"/>
//导入注册轮播图
import DetailSwiper from "./childrenComps/DetailSwiper"    
components: {
    DetailSwiper
},
    
data() {
    return {
      topImages: [],//存轮播图的地址
    };
  },

      
  methods: {
    //请求数据
    getDetail() {
      getDetail(this.iid).then((res) => {
        const data = res.result;
        //保存轮播图的图片
        this.topImages = data.itemInfo.topImages;
      })
    }
  }    

DetailSwiper.vue
//导入注册公共的轮播图
import { Swiper, SwiperItem } from "components/common/swiper";
components: {
    Swiper,
    SwiperItem
},
    
//接收传过来的轮播图图片
props:{
    swiperImages:{
        type:Array,
            default() {
                return []
            }
    }
},    
    
//渲染轮播图，v-if判断长度
<swiper v-if="swiperImages.length" class="detail-swiper">
      <swiper-item v-for="(item,index) in swiperImages" :key="index">
        <a href="#">
          <img :src="item" alt="" >
        </a>
      </swiper-item>
</swiper>    
```

### 轮播图下面的数据展示

```js
封装独立组件
返回的数据太杂，需要先在首页把需要用到的数据抽离出去，传给组件，组件操作
data保存好杂乱的整合的数据{}
整合思路
network里面
export class GoodsInfo{}//es6定义class 
class Person {
    constructor(name, age) {//如果需要传参的话，定义类时添加构造器，传参
        this.name = name,
        this.age = age
    }
}
const p = new Person()
把服务器返回的数据先封装到一个类里面
导出一个class ，要求传一些参数iteminfo，constructor里面从参数里获取数据 this.title =itemifo.title
detail.vue 里导入 这个class
data中保存个变量为null
created 中new 这个类（res.result,,,）赋值给变量
detailBaseInfo.vue

//detail.js
//整合Goods数据，添加构造器，传参
export class Goods {
  constructor(itemInfo, columns, services) {
    this.title = itemInfo.title
    this.desc = itemInfo.desc
    this.newPrice = itemInfo.price
    this.oldPrice = itemInfo.oldPrice
    this.discount = itemInfo.discountDesc
    this.columns = columns
    this.services = services
    this.realPrice = itemInfo.lowNowPrice
  }
}

//Detail.vue
import { getDetail, Goods } from "network/detail";


data() {
    return {
      goods: {},//存轮播图下面的商铺数据
    };
  },
   
methods: {
    //请求数据
    getDetail() {
      getDetail(this.iid).then((res) => {
        const data = res.result;
        //通过new 构造函数传参整合轮播图下面的信息
        this.goods = new Goods(
          data.itemInfo,
          data.columns,
          data.shopInfo.services
        )
      })
    }
  }
//导入注册组件，传参给子组件
<detail-base-info :goods="goods" />
```

### 商家信息

```js
商家信息也得从复杂的数据中整合
data存起来，新建组件props传过去
//detail.js
export class Shop {
  constructor(shopInfo) {
    this.logo = shopInfo.shopLogo;
    this.name = shopInfo.name;
    this.fans = shopInfo.cFans;
    this.sells = shopInfo.cSells;
    this.score = shopInfo.score;
    this.goodsCount = shopInfo.cGoods
  }
}

//Detail.vue
data() {
    return {
      shop:{},//存店铺
    };
  },
      
methods: {
    //请求数据
    getDetail() {
      getDetail(this.iid).then((res) => {
        const data = res.result;
		//存店铺信息
        this.shop = new Shop(data.shopInfo)
      })
    }
  }
//导入注册
import DetailShopInfo from "./childrenComps/DetailShopInfo"
components: { DetailShopInfo },
//渲染传数据    
<detail-shop-info :shop="shop"/>  

//DetailShopInfo.vue
//过滤器    
filters: {
      sellCountFilter: function (value) {
        if (value < 10000) return value;
        //toFixed() 方法可把 Number 四舍五入为指定小数位数的数字。  
        return (value/10000).toFixed(1) + '万'
      }
}  
//使用
{{shop.sells | sellCountFilter}}
```

### 详情页加入滚动

```js
详情页下面不显示导航栏
因为导航栏被fix定位了会覆盖标准流的上面
详情页加class relative z-index bgc
import Scroll
Scroll包裹
scroll要加高度 先父元素加 100vh视口高度
Scroll组件加 calc(100% - 44px)减顶部，减号要加空格
顶部 relative z-index bgc

import Scroll from "components/common/scroll/Scroll";
components: {
    Scroll
},
<div class="detail">
    <detail-nav-bar class="detailnavbar" />
    <scroll class="content">
      <detail-swiper :swiper-images="topImages" />
      <detail-base-info :goods="goods" />
      <detail-shop-info :shop="shop" />
    </scroll>
</div>
    


.detail {
  position: relative;
  z-index: 9;
  background-color: #fff;
  height: 100vh;
}

.content {
  overflow: hidden;
  position: absolute;
  top: 44px;
  bottom: 0;
  left: 0;
  right: 0;
  //第二种方法
  /* height: calc(100% - 44px); */
}
.detailnavbar {
  /* 不要随便用fixed*/
  position:relative;
  z-index: 9;
  background: #fff;
}
```

### 商品详情数据展示

```js
获取到图片数据做展示
detail data中保存detailinfo对象

//detailgoodsInfo.vue
props: {
    detailInfo: {
        type: Object
    }
},
    data() {
        return {
            counter: 0,//记录图片@load的次数
            imagesLength: 0//记录传过来的数据里的图片的长度
        }
    },
    methods: {
	    imgLoad() {
        // 判断, 所有的图片都加载完了, 那么进行一次回调就可以了.
        //当图片的加载完的数量等于数据图片的长度时就发送    
        if (++this.counter === this.imagesLength) {
          this.$emit('imageLoad');
        }
	    }
    },
    //watch监听data里数据的变化    
    watch: {
        //定义方法监听长度
	    detailInfo() {
	      // 获取图片的个数
	    	this.imagesLength = this.detailInfo.detailImage[0].list.length
	    }
    }

imgLoad({}) 所有的图片都加载完了再进行一次 计数器，等于图片数据的长度时就发送
//Detail.vue
<scroll class="content" ref="scroll">
      <detail-goods-info :detailInfo="detailInfo" @imageLoad="imageLoad"/>
</scroll>
//接收DetailGoodsInfo图片加载完成后重新计算滚动的高度
methods: {
    imageLoad() {
      //获取子组件里的方法  
      this.$refs.scroll.refresh()
    }
}
```

## 商品参数

```js
//detail.js
export class GoodsParam {
  constructor(info, rule) {
    // 注: images可能没有值(某些商品有值, 某些没有值)
    this.image = info.images ? info.images[0] : '';
    this.infos = info.set;
    this.sizes = rule.tables;
  }
}

//Detail.vue
import { GoodsParam } from "network/detail";

data() {
    return {
      paramInfo:{},//商品参数
    };
},

methods: {
    //请求数据
    getDetail() {
      getDetail(this.iid).then(res => {
        const data = res.result;
        //商品参数
        this.paramInfo = new GoodsParam(
          data.itemParams.info,
          data.itemParams.rule
        );
      });
},    
    
 import DetailParamInfo from "./childrenComps/DetailParamInfo";
  components: {
    DetailParamInfo
  },  
 //渲染传参      
 <detail-param-info :paramInfo="paramInfo"/>    
     
```

### 评论信息

```js
data commentInfo
有时候没有评论就得先判断
if data.rate.cRate !==0 
commentInfo = data.rate.list[0]
新建DetailCommentInfo.vue
props接收参数commentInfo:{
    type:Object,
        default() {
            return {}
        }
}
Detail.vue中导入，注册
:commentInfo="commentInfo"

//Detail.vue

data() {
    return {
      commentInfo: {},//评论信息
    };
},
    
methods: {
    //请求数据
    getDetail() {
      getDetail(this.iid).then(res => {
        const data = res.result;
        //评论信息
        if (data.rate.cRate !== 0) {
          this.commentInfo = data.rate.list[0];
        }
      });
    },
        
import DetailCommentInfo from "./childrenComps/DetailCommentInfo";
components: {
    DetailCommentInfo
},    
    
<detail-comment-info :commentInfo="commentInfo" /> 

//DetailCommentInfo.vue  
//格式化日期    
import {formatDate} from 'common/utils';    
//过滤器    
filters: {
		  showDate: function (value) {
        let date = new Date(value*1000);
        return formatDate(date, 'yyyy-MM-dd')
      }
}  
//使用    
{{commentInfo.created | showDate}}    
```

### 推荐更多

```js
network添加新请求，
detail中添加方法，created中请求方法拿数据，存到data里
import goodslist ，:属性传值
GoodsListItem中增加计算属性拿图片

//detail.js
//推荐更多
export function getRecommend(){
  return request({
      url: '/recommend'
  })
}

//Detail.vue
import {getRecommend } from "network/detail";
//存图片数据
  data() {
    return {
      recommends:[],//推荐更多
    };
  },
created() {
    //推荐更多
    this.getRecommend()
  },      
 methods:{
        getRecommend() {
        	getRecommend().then(res => {//res不用括号括起来
        this.recommends = res.data.list;
    });
},    
} 
 
//导入注册
import GoodsList from "components/content/goods/GoodsList";
 components: { GoodsList },
 //渲染传参    
<goods-list :goods="recommends"/>    
 
//GoodsListItem.vue   
//因为图片地址后面的不一样    
<img :src="showImage" alt="" >    
computed:{
    //两组图片前面没找到就用后面的
    showImage() {
      return this.goodsItem.image || this.goodsItem.show.img
    }
},    
```

### goodslistitem中的$bus被复用

```js
详情页的推荐更多不应该向home发送$bus
方式1
if(this.$route.path.indexOf('/home')){
    this$bus.$emit('homeItemImgLoad')
}else if(this.$route.path.indexOf('./detail')) {
    this.$bus.$emit('detailItemImgLoad')
}
方式2，都发出this.$bus.$emit('itemImgLoad')
home.vue 离开的时候 deactivated(){
    this.$bus.$off('itemImgLoad',this.itemImgListener) //不能只传一个事件，相当于取消所有
}
要把this.$bus.$on取消掉 ，把这个抽出去
取消得传入对应的函数
data中存函数，itemImgListener：null
mounted() 
debouce
this.itemImgListener = () => {
    refresh()
}
this.$bus.$on('itemImgLoad',this.itemImgListener)
detail.vue里同样
但在destroyed()中取消

//Home.vue开关全局事件监听
import { debounce } from "common/utils"
data() {
    return {
      itemImgListener: null//.$bus.$off推荐更多传的函数
};
mounted() {
    //通过$refs获取滚动组件里的refresh方法传入防抖函数
    const refresh = debounce(this.$refs.scroll.refresh,50)
    //抽离方法给$bus.$off用
    this.itemImgListener = () => {
      refresh()
    }
    //接收列表的图片加载完成后刷新scroll计算高度
    this.$bus.$on('itemImageLoad', this.itemImgListener)
},
deactivated() {
    //取消全局事件监听GoodslistItem
    this.$bus.$off('itemImageLoad',this.itemImgListener)
},
//detail.vue里一样的
    

不同的组件里 mounted() 有相同的代码要用到混入，mixin
comment新建一个mixin.js
导入  debouce
搞一个对象
export const itemListenerMixin ={
    data也可以混入
    把mounted()中的代码都拿过来
}
detail中导入
加个属性
mixins：[导入]

//mixin.js
import { debounce } from "common/utils"

//搞一个对象存GoodsListItem的全局事件监听
export const itemListenerMixin = {
  data() {
    return {
      itemImgListener:null//.$bus.$off推荐更多传的函数
    };
  },
  mounted() {
    //通过$refs获取滚动组件里的refresh方法传入防抖函数
    const refresh = debounce(this.$refs.scroll.refresh,50)
    //抽离方法给$bus.$off用
    this.itemImgListener = () => {
      refresh()
    }
    //接收列表的图片加载完成后刷新scroll计算高度
    this.$bus.$on('itemImageLoad', this.itemImgListener)
  },
}

Home.vue&&Detail.vue
import { itemListenerMixin } from "common/mixin"
//混入
mixins:[itemListenerMixin],
```

### 详情页不能滚动的bug处理

```js
每刷新一张图片从新计算高度
detailGoodsinfo.vue @load="imageLoad"
fn this.$emit('imageLoad');
父组件 :imageLoad接收
fn this.$refs.scroll.refresh()
mixin.js中refresh变成data
detail中this.refresh()

//detailGoodsinfo.vue
<img v-for="(item, index) in detailInfo.detailImage[0].list" :key="index" :src="item" @load="imgLoad" alt="">
    
 methods: {
	    imgLoad() {
        // 判断, 所有的图片都加载完了, 那么进行一次回调就可以了.
        if (++this.counter === this.imagesLength) {
          this.$emit('imageLoad');
        }
	    }
    },
//mixin.js
data() {
    return {
      refresh: null//详情页不能滚动的bug处理把刷新计算高度放这里
    };
  },
  mounted() {
    //通过$refs获取滚动组件里的refresh方法传入防抖函数
    this.refresh = debounce(this.$refs.scroll.refresh,50)
    //抽离方法给$bus.$off用
    this.itemImgListener = () => {
      this.refresh()
    }
  },
```

### 联动效果，传属性的时候:comment-info要用-，不要用大写I

```js
点击商品，参数，评论，推荐滚动到相应的位置，
滚动到相应的位置，topbar亮色
tabbar监听点击事件，传给父组件
方法，this.$refs.scroll.scrollTo(0,Y值,延迟)
根据监听的index滚到相应的位置
三个组件添加ref，
data创建一个数组themeTopYs存放四个offsetTop
imageLoad() 中赋值
this.themeTopYs =[]
    this.themeTopYs.push(0)
    this.themeTopYs.push(this.$refs.组件.$el.offetTop)
加层防抖函数
data中存getThemeTopY
created中this.getThemeTopY = debouce(() => {
    中赋值
}，100)

scroll组件接收scroll发出的方法scroll，并传入probeType的值为启动
scroll有方法监控位置
ref拿到detailnavbar里的data数据
方法里判断
如果i小于长度减1并且滚动的位置大于当前组件top位置小于下一个top的位置，就是0，1，2，或者i等于长度减1，并且滚动位置大于最后一个组件的top位置
给ref拿到的数据赋值
加判断如果currentIndex不等于i时，就赋值i，就是说等于i的时候不赋值

方式2 ，多加一个假组件的值，最大值
滚动位置大于等于当前的值小于下一个组件值

//DetailNavBar.vue
methods: {
    //把点击的index传给保存的变量
    titleClick(index) {
    //把点击的标题传出去，搞联动
      this.$emit('titleClick', index)
    },
}

//Detail.vue
<detail-nav-bar class="detailnavbar" @titleClick="titleClick"/>
    
 data() {
    return {
      themeTopYs: [],//存每个子组件的offsetTop
      getThemeTop:null //获取每个子组件offsetTop的函数
    };
  },
  methods:{}  
//点击滚动到组件的offsetTop位置
    titleClick(index) {
      this.$refs.scroll.scrollTo(0, -this.themeTopYs[index], 200);
    }

//themeTopYs存每个组件的offsetTop
    titleClickY() {
      this.themeTopYs = [];
      this.themeTopYs.push(0);
      this.themeTopYs.push(this.$refs.param.$el.offsetTop);
      this.themeTopYs.push(this.$refs.comment.$el.offsetTop);
      this.themeTopYs.push(this.$refs.recommend.$el.offsetTop);
      this.themeTopYs.push(Number.MAX_SAFE_INTEGER);
    },
        
 created() {
 //每个组件的offsetTop的方法通过防抖变成新的函数    
    this.getThemeTop = debounce(() => {
      this.titleClickY();
    }, 100);
  },       
  
//接收DetailGoodsInfo图片加载完成后重新计算滚动的高度
    imageLoad() {
      //获取每个子组件的offsetTop
      this.getThemeTop();
    },      

        
//滚动到相应的位置标题变化
 //传3 启动，接收监听滚动       
 <scroll class="content" ref="scroll" :probeType="3" @scroll="contentScroll">    

data() {
    return {
      currentIndex: 0//存导航栏的标签位置
    };
  },    
      
 //监听滚动的位置，导航标签变颜色
    contentScroll(position) {
      const positionY = - position.y;
      let length = this.themeTopYs.length;
      for (let i = 0; i < length - 1; i++) {
        if (
          this.currentIndex !== i &&
          (positionY >= this.themeTopYs[i] &&
            positionY < this.themeTopYs[i + 1])
        ) {
          this.currentIndex = i;
          //把判断后的值赋值给子组件里的选中颜色
          this.$refs.navbar.currentIndex = this.currentIndex;
        }
      }
    }      
```

### 底部栏

```js
新建detailBottombar.vue
导入，注册

```

### backtop混入

```js
mixin中添加backtop
detail中导入backtop组件
渲染
mixins:[添加]
titieClickY的回调中添加mixin中的方法，要加上this和参数
methods中的方法中的方法不能合并，只能提取出来

mixin.js
import BackTop from 'components/content/backTop/BackTop';
//回到顶部
export const backTop = {
  components: {
    BackTop
  },  
  data() {
    return {
      topShow:false
    }
  },
  methods: {
    backClick() {
      this.$refs.scroll.scrollTo(0, 0, 300)
    },
    //methods中的方法中的方法不能合并，只能提取出来
    listenBackTop(position) {
      this.topShow = -position.y > 1000
    }
  },
}

//Detail.vue
<back-top @click.native="backClick" v-show="topShow" />
import {  backTop } from "common/mixin" 
mixins:[backTop],
 //监听滚动的位置，导航标签变颜色
    contentScroll(position) {
      const positionY = - position.y;
      this.listenBackTop(position)

    },    
```

### 商品加入购物车

```js
detailBottombar的购物车添加点击事件
$emit('方法')发送到调用者
调用者方法里监听点击
获取购物车需要展示的信息定义一个空对象，然后往里面添加
const product = {}
product.image = this.topImages[0];
product.title = this.goods.title;
product.desc = this.goods.desc;
product.price = this.goods.realPrice;
product.iid = this.iid;
将信息添加到购物车里
因为detail中点击加入购物车 与 购物车界面没有直接关系
通过Vuex存数据再购物车拿
//点击加入购物车
    addToCart() {
      //获取购物车需要展示的信息定义一个空对象，然后往里面添加
      const product = {};
      product.image = this.topImages[0];
      product.title = this.goods.title;
      product.desc = this.goods.desc;
      product.price = this.goods.realPrice;
      product.iid = this.iid;
      console.log(product)
    }
```

### Vuex加入购物车

```js
npm install vuex --save
store文件夹中添加index.js
import Vue from 'vue'
import Vuex 
Vue.use(Vuex)
const store = new Vuex.Store({
 state:{
  //定义一个变量存储添加来的商品，一个个push进来，都是对象
  //别的地方渲染数据为{{$store.state.cartList}}   
   cartList:[]
 },
 mutations:{
   //修改任何state中的东西都要通过mutations，添加商品,默认第一个参数state，额外参数载荷payload
   //别的地方调用就是this.$store.commit('addCart',product) product是上面的商品对象合集
   //判断新添加的商品payload有没有在数组里面，对比payload的id和cartList里的id,定义个旧的商品的变量，循环每个value值，如果两个id想等就说明新添加的是之前加过的  
   addCart(state,payload){
     let oldProduct = null
     for (let item of state.cartLsit) {
       if (item.iid == payload.iid) {
       	oldProduct = item //把商品对象赋值给旧等于两个变量指向同一个对象，其中一个变量改变对象，另外一个变量得到的对象也是改变的，item里有count了
       }
     }
     
     if(oldProduct) {
        //如果添加过一次了，拿到原来的对象，里面有count+1
       oldProduct.count += 1 
     } else {//为null的时候
       payload.count = 1 //第一次为null，在商品对象里面添加count属性，值为1
       state.cartList.push(payload)
     }  
       
     //方式2
       let oldProduct = state.cartList.find(item => item.iid === payload.iid)
       
       if(oldProduct) {
           oldProduct.count += 1 
       }else {
           payload.count = 1
           state.cartList.push(payload)
       }
   }  
 }
})
export default store

回到main.js中导入index.js
再到new Vue对象中添加导入的store

```

### vuex代码重构

```js
//mutations作用，修改state中状态
//mutations中的方法尽可能单一，有判断逻辑的时候放到Action里面
//调用时this.$store.dispatch('addCart',payload)
//mutations中的方法可以跟踪，action:中的不行

新建mutations.js和actions.js
export default{...}
在index.js中导入
直接写
mutations,
actions  
   state写成 
   const state = {...}
在添加到mutations,的上面
定义常量
新建一个mutainos-types.js
export const ADD_COUNTER = 'add_counter'
export const ADD_TO_CART = 'add_to_cart'
mutations.js和actions.js中导入
import {ADD_COUNTER,ADD_TO_CART} from './'
把方法名字替换成导入的
addCounter改成[ADD_COUNTER]
.commit('addCounter'改成ADD_COUNTER

        
//mutaitions-types.js
export const ADD_COUNTER = 'add_counter'
export const ADD_TO_CART = 'add_to_cart' 
        
//mutaitions.js
import { ADD_COUNTER, ADD_TO_CART } from './mutations-types'

某些情况下，一个模块中包含某个的功能，我们并不希望给这个功能命名，而且让导入者可以自己来命名
这个时候就可以使用export default
export default 函数
import 命名 from '位置'

export default {
  //常量使用[]，好处是定义常量的地方改了，其他地方就都改了
  [ADD_COUNTER](state, payload) {
    //如果已经有衣服数量加1
    payload.count += 1
  },
  [ADD_TO_CART](state, payload) {
    //如果没有衣服就添加到cartList存起来
    state.cartList.push(payload)
  }
}

//actions.js
import { ADD_COUNTER, ADD_TO_CART } from './mutations-types'

export default {
  //context上下文的使用
  addCart(context, payload) {
      //定义一个变量保存 添加来的商品是不是已经添加过了
      let oldProduct = context.state.cartList.find(item => item.iid === payload.iid)
      //如:点了一次addCart添加衣服对象，cartList为空，衣服对象的iid不等于cartList里的iid，oldProduct的值为空，下面的判断进入到else
      //else里面在衣服对象里添加一个count属性，值为1
      //把带有count的新衣服对象添加到cartList数组里

      //点第二次addCart添加衣服对象，cartList里有刚加的衣服了，带了count，上面的判断等于，oldProduct的值为刚加的衣服对象, 进入到if(oldProduct) 
      //衣服对象里的count += 1
      if (oldProduct) {
        // oldProduct.count += 1
        //调用mutaitions里的方法，好处是能在vue插件里监控
        context.commit(ADD_COUNTER, oldProduct)
      } else {
        payload.count = 1 //第一次为null，在商品对象里面添加count属性，值为1
        // context.state.cartList.push(payload)
        context.commit(ADD_TO_CART, payload)
      }
  }
}

//index.js
import mutations from './mutations'
import actions from './actions'

const store = new Vuex.Store({
  mutations,
  actions
```

### 购物车的导航栏

```js
Cart.vue
<nav-bar></nav-bar>
import NavBar
components:{NavBar}
NavBar中有插槽，搞个div slot="center" 购物车($store.state.cartList.length)
也可以计算属性
购物车({{cartLength}})
computed:{
    cartLength() {
        this.$store.state.cartList.length
    }
}
有时候，我们需要从store中获取一些state变异后的状态
也可以用getters
新建一个getters.js
export default {
    cartLength(state) {
        return state.cartList.length
    },
    cartList(state) {
        return state.cartList
    }
}
index.js中导入
购物车({{cartLength}})
computed:{
    cartLength() {
        this.$store.getters.cartLength
    }
}
//把getters中的方法转成cart.vue中的计算属性
购物车({{cartLength}})或者({{length}})
Cart.vue中 import { mapGetters } from 'vuex'
computed: {
    ...mapGetters(['cartLength', 'cartList'])
    //方法2，
    ...mapGetters({
        length:'cartLength',
        list:'cartList'
    })
}

//getters.js
export default {
  //购物车总数
  cartLength(state) {
    return state.cartList.length
  },
  cartList(state) {
    return state.carList
  }
}

//Cart.vue
import NavBar from 'components/common/navbar/NavBar'
components: { NavBar },
    
<nav-bar class="home-nav">
      <div slot="center">购物车({{length}})</div>
</nav-bar>   

//mapGetters解构
import { mapGetters } from 'vuex'
computed: {
    // cartLength() {
    //   return this.$store.getters.cartLength
    //   // return this.$store.state.cartList.length
    // }
    ...mapGetters({
      length: "cartLength",
      list: "cartList"
    })
}
```

### 购物车商品列表展示

```js
将vuex中的cartList遍历
cart文件夹中添加childComps,加个子组件CartList.vue 
Cart.vue中导入注册渲染
CartList.vue 
import { mapGetters } from 'vuex'
computed:{
    ...mapGetters(['cartList'])
}
import Scroll
components:{Scroll}
props接收cartlist
scroll包裹要渲染的数据
scroll要有层级关系(内部已封装)，要有高度100% overflow hidden,calc的前提是父元素得有确定高度100vh(视口高度) Cart.vue中添加
scroll的父元素高度calc(100% - 44px -49px)

每一个购物是一个组件
添加CartLitsItem.vue组件
props接收参数product:{type:Object,default() {}}
CartList中 V-for="(item, index)" in cartList :product="item"

因为scroll不知道添加了数据，以为高度还是零
在activated(){
    this.$refs.scroll.refresh()
}

//CartList.vue
<div class="cart_list">
    <scroll class="content" ref="scroll">
      <cart-list-item v-for="item in cartList" :key="item.iid" :itemInfo="item"/>
    </scroll>
  </div>
props: {
    cartList: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  activated() {
    this.$refs.scroll.refresh()
  } //如果页面有keep-alive缓存功能，这个函数会触发


```

### 购物车小按钮封装

```js
封装到content里   checkbutton
div img src
div  border-readius border 
添加
props：{
    isChecked:{
        type:Boolean,
        default:false
    }
}
div动态绑定:class="{check:isChecked}"
check border-color bgc
通过改变接收的属性判断是选中还是不选中的
有一个东西记录是选中还是不选中，对象模型中记录，cartlist[商品1，商品2]，在商品1，2中加入checked属性
vuex中的mutations中添加payload.checked = true
CartListItem 的 checkbutton 属性传值，:is-checked="itemInfo.checked"
组件点击时间，@click.native="checkClick"
checkClick() {
    this.itemInfo.checked = !this.itemInfo.checked
}
CartLitsItem.vue里导入这个按钮


//checkButton.vue
<div class="icon-selector" :class="{check:isChecked}"> 
        <img src="~/assets/img/cart/tick.svg" alt="">
</div>

props:{
      isChecked:{
        type:Boolean,
        default:false
    }
 },
 
//mutations.js
[ADD_TO_CART](state, payload) {
    //要写在push的前面，等于加了属性在加入到cartList，写在下面就等于没加上
    payload.checked = false
    //如果没有衣服就添加到cartList存起来
    state.cartList.push(payload)
}     
     
     
//CartListItem.vue
 <check-button :is-checked="itemInfo.checked" @click.native="checkedChange"></check-button>

methods: {
    checkedChange() {
      this.itemInfo.checked = !this.itemInfo.checked;
    }
  },
```

### 汇总的工具栏

```js
添加CartBottomBar.vue
Cart.vue中导入注册
import CheckButton

计算属性，合计
filter() 方法创建一个新的数组，新数组中的元素是通过检查指定数组中符合条件的所有元素。
注意： filter() 不会对空数组进行检测。
注意： filter() 不会改变原始数组。
reduce() 方法接收一个函数作为累加器，数组中的每个值（从左到右）开始缩减，最终计算为一个值。
reduce() 可以作为一个高阶函数，用于函数的 compose。
注意: reduce() 对于空数组是不会执行回调函数的。
array.reduce(function(total, currentValue, currentIndex, arr), 
initialValue)
total	必需。初始值, 或者计算结束后的返回值。
currentValue	必需。当前元素

totalPrice() {
    return '$' + this.$store.state.cartList.filter(item => {
        return item.checked
    }).reduce((preValue, item) => { 
        return preValue + item.price * item.count
    }, 0).toFixed(2) 0是可选。传递给函数的初始值
}

去计算
checkLength() {
    //返回checked的新数组的长度
    return this.$store.state.cartList.filter(item => item.checked).length
}

全选按钮
checkbutton里根据传进来的属性决定是否选中
:isChecked="isSelectAll"
所有的商品是不是都是checked = true，
在计算属性里判断
如果长度为零时返回false
//find查找到就停掉
return this.cartList.find(item => item.checked === false ) === undefined

cartbottombar click.native
方法里先通过数组的find方法遍历item.checked是否有!值
在判断如果没有非值的时候，forEach遍历数组把checked全部改为true
else改false

<div class="bottom-menu">
    <check-button class="select-all"  @click.native="checkBtnClick" :isChecked="isSelectAll"></check-button>
    <span>全选</span>
    <span class="total-price">合计:{{totalPrice}}</span>
    <span class="buy-product" @click="calcClick">去计算({{checkLength}})</span>
  </div>

import CheckButton from 'components/content/checkButton/CheckButton';
import { mapGetters } from 'vuex';

//购物车选中的合计，计算属性
//解构，同等于this.$store.getters.cartList
...mapGetters(['cartList']),
totalPrice(){
        //购物车里filter取出选中的item，再reduce汇总
        //reduce(初始值或计算结束后的返回值，当前值),0是可选。传递给函数的初始值
        //toFixed() 方法可把 Number 四舍五入为指定小数位数的数字。
        return '￥' + this.cartList.filter(item => {
          return item.checked
        }).reduce((preValue, item) => {
          return preValue + item.count * item.price
        }, 0).toFixed(2)
      },
          
//购物车选中的总数
 checkLength(){ 
          return this.cartList.filter(item => item.checked).length;
      },
 
//判断全选与非全选          
 isSelectAll () {
          //如果没有添加商品时为false
          if (this.cartList.length === 0) return false 
          // return this.cartList.find(item => item.checked === false ) === undefined
          //find没选中的，如果有就为ture，再取反，返回false，如果没有没选中的就为fasle，再去反，返回true
          return !this.cartList.find(item => !item.checked)
      }  


//点击效果传给CheckButton
@click.native="checkBtnClick"//.native监听组件点击

//点击全选是否
methods:{
      checkBtnClick() {
        //如果原来都是选中，点击一次，全部不选中
        //如果原来都是不选中（某些不选中），全部选中
        if(this.isSelectAll){
          this.cartList.forEach(item => item.checked = false)
        } else {
          this.cartList.forEach(item => item.checked = true)
        }
      },
```

### 添加购物车成功时弹窗Toast

```JS
Detail.vue里 addToCart this.$store.dispatch， dispatch可以返回一个Promise（）actions的方法把这个方法包装new Promise
return new Promise((resolve, reject) => {
    resolve('商品数量+1')
})
Detail.vue里的this.$store.dispatch再.then(res => {
    console.log(res)
})

如果不想this.$store.dispatch('addCart',product)
要写成this.addCart(product)
可以import { mapActions } from 'vuex'
methods:{
    ...mapActions(['addCart'])
}
```

### toast插件封装

```js
//居中效果
.toast{
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      padding:8px 10px;

      z-index: 999;

      color: #fff;
      background-color: rgba(0, 0, 0, .75);
  }


在components/common中添加 Toast.vue index.js

把Toast变成插件
index.js中
import Toast from './Toast'
const obj = {}

obj.install = function (Vue) {
    //1.创建组件构造器
    const toastConstrustor = Vue.extend(Toast);

    //2.new的方式, 根据组件构造器
    const toast = new toastConstrustor();

    //3.将组件对象，手动挂载到某一个元素上
    toast.$mount(document.createElement('div'));

    //4.toast.$el对应的就是div
    document.body.appendChild(toast.$el);

    Vue.prototype.$toast = toast;
}
export default obj

main.js中
import toast from 'components/common/toast'
//安装toast插件
Vue.use(toast)

//detail.vue

//点击加入购物车
    addToCart() {
      //导入解构后
      this.addCart(product).then(res => {
        this.$toast.show(res, 2000);
      })
 }


//toast.vue
<div class="toast" v-show="isShow">
      <div>
          {{message}}
      </div>
  </div>

data() { 
    return {
        message: '',
        isShow: false,
    }
  },
  methods: {
      show(message='默认文字', duration=2000){
          
          this.isShow = true;
          this.message = message;

          setTimeout(() => {
              this.isShow = false;
              this.message = '';
          }, duration);
      }
  }
```

# 分类页面

获取数据

network/category.js

```js
import axios from './axios'


export function getCategory() {
  return axios({
    url: '/category'
  })
}

export function getSubcategory(maitKey) {
  return axios({
    url: '/subcategory',
    params: {
      maitKey
    }
  })
}

export function getCategoryDetail(miniWallkey, type) {
  return axios({
    url: '/subcategory/detail',
    params: {
      miniWallkey,
      type
    }
  })
}

```

NavBar导入注册

```js
<div id="category">
    <nav-bar class="nav-bar"><div slot="center">商品分类</div></nav-bar>
  </div>

import NavBar from "components/common/navbar/NavBar";
components:{
      NavBar
},
    
  #category {
    height: 100vh;
  }

  .nav-bar {
    background-color: var(--color-tint);
    font-weight: 700;
    color: #fff;
  }
```

## content部位

```js
<div class="content">
      
</div>

  .content {
    position: absolute;
    left: 0;
    right: 0;
    top: 44px;
    bottom: 49px;

    display: flex;
  }
```

### 左边分类组件TabMenu

```js
  <scroll id="tab-menu">
    <div class="menu-list">
      <div class="menu-list-item"
           :class="{active: index===currentIndex}"
           v-for="(item, index) in categories"
           :key="index"
           @click="itemClick(index)">
        {{item.title}}
      </div>
    </div>
  </scroll>

props: {
		  categories: Array
    },
    data() {
		  return {
		    currentIndex: 0
      }
    },
    methods: {
		  itemClick(index) {
        this.currentIndex = index
        this.$emit('selectItem', index)
      }
    }

//点击切换四步
1.v-for="(item, index) in categories"
           :key="index"
2.@click="itemClick(index)"
3.
data() {
		  return {
		    currentIndex: 0
      }
},
itemClick(index) {
        //点击切换选中class
        this.currentIndex = index
}
4.:class="{active: index===currentIndex}

Category.vue

<tab-menu :categories="categories"/>
    
data() {
      return {
        categories: []//分类名字
      }
    },
    created() {
      this._getCategory()
    },
    methods:{
      _getCategory() {
        getCategory().then(res => {
          // console.log(res)
          //获取分类的list
          this.categories = res.data.category.list

        })
      }
    }
```

### 右上TabContentCategory

获取数据传给子组件

```js

<scroll class="tab-content">
      <tab-content :categoriesProduct="categoriesProduct"></tab-content>
      </scroll>

import TabContent from './childComps/TabContent';
import Scroll from 'components/common/scroll/Scroll';

import TabContent from './childComps/TabContent';

data() {
      return {
        categoriesProduct: [],//子分类的list
        currentIndex: -1
      }
},
_getCategory() {
        getCategory().then(res => {
          // 请求第一个分类的数据
          this._getSubcategory(0)
        })
      },
_getSubcategory(index){
        //把选中的index存起来
        this.currentIndex = index;
        //根据选中的index拿到每个子分类的maitKey
        const maitKey = this.categories[index].maitKey;
      //通过maitKey拿到res数据
      getSubcategory(maitKey).then(res => {
        console.log(res)  
        this.categoriesProduct = res.data.list;
})
//根据tabmenu点击传过来的index改变请求的数据
    selectItem(index) {
        this._getSubcategory(index)
      }
    }


 //TabContent.vue
 导入   
import GridView from 'components/common/grid/GridView';  
通过传过来的参数，渲染img和titile
    
//GridView.vue
接收参数通过dom改样式
//生命周期 - 挂载完成（可以访问DOM元素）
    mounted: function () {
		  setTimeout(this._autoLayout, 20)
    },
    updated: function () {//生命周期 - 更新之后
      this._autoLayout()
},
```

右下角TabControl

```js
tabControlMixin混入
//mixin.js
import {POP, NEW, SELL, BACKTOP_DISTANCE} from "./const";
export const tabControlMixin = {
  data: function () {
    return {
      currentType: POP
    }
  },
  methods: {
    tabClick(index) {
      switch (index) {
        case 0:
          this.currentType = POP
          break
        case 1:
          this.currentType = NEW
          break
        case 2:
          this.currentType = SELL
          break
      }
    }
  }
}
//Category.vue
import { POP, SELL, NEW } from "common/const";
import { tabControlMixin } from "common/mixin";
mixins:[tabControlMixin],
import TabControl from "components/content/tabControl/TabControl";

<tab-control :titles="['综合', '新品', '销量']"
                     @tabClick="tabClick"></tab-control>    
```

右下TabContentDetail

定义对象存数据

```js
 data() {
    return {
      categoryData: {//商品详情
      },
      currentIndex: -1
    };
  },

 在获取左边分类list数据时初始化商品详情
//初始化分类商品详情
        for (let i = 0; i < this.categories.length; i++) {
          this.categoryData[i] = {
            subcategories: {},//存储点击左边分类后的数据
            categoryDetail: {//存储点击tabcontrol后的数据
              'pop': [],
              'new': [],
              'sell': []
            }
          }
        }

在获取右上角数据的时候
//商品详情项对应左边分类对应的数据初始化
 this.categoryData[index].subcategories = res.data
 this.categoryData = {...this.categoryData}

//tabcontentdetail数据
    _getCategoryDetail(type) {
      // 获取请求的miniWallkey ，categories分类list有miniWallkey
      const miniWallkey = this.categories[this.currentIndex].miniWallkey;
      //发送请求,传入miniWallkey和type
      getCategoryDetail(miniWallkey, type).then(res => {
        // 将获取的数据保存下来
 //把根据categories分类list里的miniWallkey拿到的数据传给商品详情里的点击项的type分类里       this.categoryData[this.currentIndex].categoryDetail[type] = res
        this.categoryData = {...this.categoryData}
      })
    },
 
//把左边点击和tabcontrol点击后的数据传给子组件      
computed:{
    showCategoryDetail() {
        if (this.currentIndex === -1) return []
		    return this.categoryData[this.currentIndex].categoryDetail[this.currentType]
      }
  }, 
      
      
```

# 个人中心



### 解决移动端300ms延迟

```js
npm i fastclick -s
main.js中
import FastClick from 'fastclick'
FastClick.attach(document.body)
```

### lazyload

```js
npm i vue-lazyload -s
import VueLazyLoad from 'vue-lazyload'
Vue.use(VueLazyLoad)
:src="showImage"改为v-lazy="showImage"
Vue.use(VueLazyLoad,{
    loading:require('assets/img/xx.png')
})
```

### px2vw-css

```js
适配缩放
所有的单位都改成vw
用插件完成
webpack打包的时候就全部变成vw单位了
npm install postcss-px-to-viewport --save-dev
修改postcss.config.js配置

//postcss.config.js
module.exports = {
  plugins: {
    autoprefixer: {
    },
    "postcss-px-to-viewport":{
      
      viewportWidth: 375, //视窗的宽度，对应的是我们设计稿的宽度
      viewportHeight: 667, //视窗的高度, 对应的是设计稿的高度
      unitPrecision: 5, //指定'px'转换为视窗单位值的小数位数
      viewportUnit: 'vw', //指定需要转换成的视窗单位
      //selectorBlackList: ['ignore','tab-bar','tab-bar-item'],//指定不需要转换的类
      minPixelValue: 1, //小于或等于'1px'不转换为视窗单位
      mediaQuery: false, //允许在媒体查询中转换'px'
      //exclude: [/TabBar/] //[]内为JS正则表达式

      // viewportWidth: 768, //视窗的宽度，对应的是我们设计稿的宽度
      // viewportHeight: 1024, //视窗的高度, 对应的是设计稿的高度
      // unitPrecision: 5, //指定'px'转换为视窗单位值的小数位数
      // viewportUnit: 'vw', //指定需要转换成的视窗单位
      // selectorBlackList: ['ignore','tab-bar','tab-bar-item'],//指定不需要转换的类
      // minPixelValue: 1, //小于或等于'1px'不转换为视窗单位
      // mediaQuery: false, //允许在媒体查询中转换'px'
      // exclude: [/TabBar/] //[]内为JS正则表达式

    }
  }
}
```





















