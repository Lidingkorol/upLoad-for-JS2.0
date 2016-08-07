# upLoad-for-JS2.1组件
======
upLoad组件支持IE8以上及firefox，chrome浏览器
>功能： 1丶图片上传
2丶可设定上传图片大小丶张数
插件使用操作如下：
--------
####一丶首先将index.js添加至html页面中
~~~
		<script src="js/index.js"></script>	  
~~~
####二丶然后在html页面 body标签中添加如下模块
~~~
		<input type="button" id="uploadFile" value="点我上传" > 
~~~

####三丶最后在html页面设置相关参数 
~~~
	var uploadData=new upLoad({
		target:document.getElementById('uploadFile'),
		address:'http://upfile.233.com/ajaxupload',
		method:'post',
		num:'3',
		size:'2',
		multiple:'multiple',
		success:function(data){
			alert(data);
		},
		error:function(data){
			alert('服务器错误，请重试');
		}
	}) 
~~~
####参数介绍
* address：  服务器地址
* method：    传输方式(GET POST)
* num:      每次传输文件最大个数（IE9以下无效）
* size:     单个文件容量最大值（单位：M）
* multiple	文件是否支持多选（multiple：是；''：否）
* success	获取到返回数据后执行的函数
* error		未获取到返回数据执行的函数


#以上是readme所有内容
