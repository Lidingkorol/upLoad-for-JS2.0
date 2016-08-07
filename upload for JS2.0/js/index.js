/*网页upload组件
*本插件用于上传数据，兼容IE6以上版本以及谷歌，火狐浏览器
*参数介绍：
* address：  服务器地址
* method：    传输方式(GET POST)
* num:      每次传输文件最大个数（IE9以下无效）
* size:     单个文件容量最大值（单位：M）

*/




//定义工具函数
var Class = {
    create: function () {
        return function () {
            this.init.apply(this,arguments); //这个语句的作用是，每次插件初始化的时候，都会运行一次插件原型链上面的init方法
        }
    }
}
//继承属性
var Extend = function(destination, source) {
	for (var property in source) {
		destination[property] = source[property];
		//括号里面是变量，点后面是字符串
	}
}


var upLoad=Class.create();
upLoad.prototype={
	init:function(options){
		this.setOption(options);
		this.address=this.options.address;
		this.method=this.options.method;
		this.num=this.options.num;
		this.size=this.options.size;
		this.multiple=this.options.multiple;
		this.success=this.options.success;
		this.target=this.options.target;
		this.error=this.options.error;
		this.set();
		this.sendData();
		this.checkFile();
		
	},
	setOption:function(options){
		this.options={
			/*
			 * 此处增加一个参数，点击按钮上传
			 */
			target:null,  
			address:null,
			method:null,
			num:'1',
			size:null,
			OK:null,
			multiple:null,
			success:null,
			error:null
		};
		Extend(this.options, options || {}); //空对象指防止options不存在时候函数报错
	},
	//设置属性
	set:function(){
		var that=this;
    	this.iframe=document.createElement('iframe');
    	this.formBox=document.createElement('form');
    	this.fileBox=document.createElement('input');
    	this.buttonBox=document.createElement('input');
    	this.output=document.createElement('div');
    	this.iframe.id='sendIframe';
    	/*
    	 * iframe和form需隐藏
    	 */
    	this.iframe.style.display='none';
    	this.formBox.style.display='none';
    	this.formBox.id='formBox';
    	this.fileBox.id='fileBox';
    	this.buttonBox.id='buttonBox';
    	this.output.id='output';
    	this.fileBox.name='filebox';
    	this.fileBox.type='file';
    	this.fileBox.multiple=this.multiple;
    	this.buttonBox.type='button';
    	this.buttonBox.value='确认';
    	this.formBox.enctype='multipart/form-data';
    	document.body.appendChild(this.formBox);
    	document.body.appendChild(this.iframe);
    	document.body.appendChild(this.output);
    	this.formBox.appendChild(this.fileBox);
    	this.formBox.appendChild(this.buttonBox);
    	this.OK=false;
    	this.Data=null;
    	this.backData=null;
    	/*
    	 * 添加点击事件
    	 */
		this.target.onclick=function(){
			that.fileBox.click();
		}
	},
	//文件筛选
	checkFile:function(){
		var that=this; 
		this.OK=false;
		this.output.innerHTML="";
		this.fileBox.onchange=function()
		{	
			var fileName;
			var fileDoc;
			var objFileSize;
			var m=0;
			//兼容IE7,8,9
			if(document.all && !window.atob)
			{	
				fileDoc=that.fileBox;
				fileName=that.fileBox.value;
				that.num=1;
				var filePath = that.fileBox.value;            
   		 		var fileSystem = new ActiveXObject("Scripting.FileSystemObject");     
  		 		var file = fileSystem.GetFile (filePath);               
   				objFileSize = file.Size;    
			}
			else
			{	
				fileDoc=that.fileBox.files[m];
				objFileSize=that.fileBox.files[m].size;
				if(fileDoc)
				{
					fileName=fileDoc.name;
				}
				//文件个数
				if(that.fileBox.files.length>that.num)
				{
					that.output.innerHTML="文件个数必须小于"+that.num+"个";
					return;
				}
			}
			//是否有文件被添加进去
			if(that.fileBox.value=='')
			{
				that.output.innerHTML="请添加文件";
				return;
			}
			
			//验证文件格式是否为图片及图片大小是否符合要求
			for(;m<that.num;m++)
			{
				if(fileDoc)
				{
					var checkFormat=['img','jpeg','jpg','png'];
					if(fileName.length>1&&fileName)
					{
						var suffixeNumber=fileName.lastIndexOf('.');
						var suffixe= fileName.substring(suffixeNumber + 1);
						var check=false;
						//检测所选文件是否为图片格式
						for(var i=0;i<checkFormat.length;i++)
						{
							if(suffixe.toLowerCase()==checkFormat[i])
							{
								check=true;
							}	
						}
						if(check==false)
						{
							that.output.innerHTML=fileName+"文件不是图片格式";
							return;
						}
						//检测文件大小
						var FileSize=that.size*1024*1024;
						if(FileSize<objFileSize)
						{	
							that.output.innerHTML='单个文件必须小于'+that.size+'M'
							return;
						}
					}
				}
				else
				{
					that.OK=true;
					that.sendData();
					return;
				}
			}
			that.OK=true;
			that.sendData();
			
		}	
	},
	sendData:function(){
		/*
		 * 此处请完善IE9上传问题
		 */
		var that =this;
		if(!this.address||!this.method)
		{
			this.output.innerHTML='服务器URL地址或method未设置';
			return;
		}
		//IE7，8，9
		if(document.all && !window.atob)
		{	
			if(this.OK=true)
			{
				this.formBox.target=this.iframe.name;
				this.formBox.method=this.method;
				this.formBox.action=this.address;
				this.iframe.style.display='block';
				this.formBox.submit();	
				this.iframe.onchange=function(){
					this.Data=this.iframe.contentDocument.body.innerHTML;
					this.handleData(this.Data);
				}
			}
		}
		//其他浏览器及IE10以上
		else
		{	
			if(this.OK==true)
			{	
				var oData=new FormData(this.formBox);
				var oReq=new XMLHttpRequest();
				oReq.open(this.method,this.address,'true');
				oReq.onreadystatechange=function(){
					//此处有修改
					//不能只判断oReq.status，否则这个handleData会运行两次 详见onreadystatechange
					if(oReq.status==200&&oReq.readyState==4)
					{
						that.Data=oReq.responseText;
						that.handleData(that.Data);
					}
					else
					{
						that.Data='Error'+oReq.status;
						that.handleData(that.Data);
					}
				};
				oReq.send(oData);
			}
		}
	},
	handleData:function(backData)
	{	
		/*
		 * 获取返回值后判断是否成功
		 * 成功执行success
		 * 失败执行error
		 */
		var that=this;
		var data = backData.replace(/<script[^>]*>[\s\S]*?<\/script>/ig, ''); 
		data = JSON.parse(data);
		if(data.s==10006){
			that.success(data);
		}else{
			that.error();	
		}
	}
}


