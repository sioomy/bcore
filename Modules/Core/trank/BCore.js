/** 
 * @fileoverview 这个文件是BCore的核心文件，提供BCore的代码风格以及通信相关的方法
 * @author xiuming.wang
 * @version 1.0 
 */

(function( window ){
	
	
	/**
	 * BCore 核心库，用于开辟一个程序入口
	 * @class
	 * @namespace BCore命名空间
	 * @constructor
	 * @name BCore
	 * @param {function} parm 页面加载成功后的回调函数
	 * @param {function} conf 模块配置参数
	 * @example
	 * // BCore配置  用于暂停IFRAME BAE 以及设置BAE cookie存储域名路径
	 * // 客户无需求 无需设置 如过使用 在 new bcore之前使用（仅一次）
	 * //var BCORE_CHECK_CONFIG = { //客户无需求 无需设置
	 * //	BAE : {
	 * //		stop : true,		//设置后BAE程序加载不自动执行 默认自动执行 （需要跟推荐引擎组咨询是否可以）
	 * //		subCookie : true	//cookie存入二级域名开启 默认存根域名
	 * //	},
	 * // 	CHECK : {
	 * //		stop_frame : false   //设置后停止speed.html加载模块（iframe）
	 * // 	}
	 * //}
	 *
	 * new $Core(function(){
	 *     //引入相关库
	 *     var Request = $Core.Request;
	 *     this.options.uid	= "bfd_test_user";        //设置这个页面的用户名信息
	 *     var req = new Request("http://www.baifendian.com/api.php");
	 *     req.name = "xxx";
	 *     req.age = 20;
	 *     this.send(req,function(json){
	 *         alert(json);
	 *     });
	 * };
	 */
	function BCore( parm ){
		
		//初始化
		this.instance_id = this["static"]["index"];
		this.pool = [];
		this["static"]["index"]++;
		//this.readyFun = [];
		BCore.instances[this.instance_id] = this;
		
		if ( typeof( parm ) === "function" ) {
			this.ready = parm;
			if(this["static"].pageReady)
				this.readyHook();
			else
				DOMContentLoaded(this);
		}
		//else
		//{
			//this.constorHook();
		//}
		/*
		if(typeof( conf ) === "object")
		{
			for(var i in conf)
			{
				//第二次设置无效
				if(!BCore.prototype.__configs[i]) BCore.prototype.__configs[i] = conf[i];
			}
			//立即执行
			this.constorHook();
		}
		*/
	}
	
	
	/**
	 * 记录实例编号
	 * @type Number
	 * @private
	 */
	BCore.prototype.instance_id = null;
	
	/**
	 * instance实例列表
	 * @type Array
	 * @static
	 * @private
	 */
	BCore.instances = [];
	
	/**
	 * 回调函数列表
	 * @private
	 */
	BCore.prototype.callbacks = [];
	
	/**
	 * BCore静态属性，只可以实例内部调用！
	 * @static	仅供实例调用
	 * @type Object
	 * @example
	 * this.static["id"]++;
	 */
	BCore.prototype["static"] = {
		"index"	:0,			//自动增长ID
		"pageReady":false,		//页面是否加载完成
		"req_over" : false  	//ds请求完成  5秒后超时结束
	};
	
	/**
	 * 全局参数
	 * @static	仅供实例调用,这里面的参数会作为全剧参数被传递
	 * @type Object
	 * @example
	 * this.options.cid = "customer_id";//设置百分点账户
	 * this.options.uid = "test_user";  //设置网站的当前用户
	 */
	BCore.prototype.options = {
	};
	
	/**
	 * 全局参数
	 * @static	仅供模块初始化配置
	 * @type Object
	 * @private
	 * @example
	 * this.__configs.bae.sessionTimeout = "200";//设置bae模块过期时间
	 * this.__configs.bae.topDomain = true;  //获取顶级域名
	 * 
	
	BCore.prototype.__configs = {};
	 */
	BCore.prototype.readyFun = [];
	
	/**
	 * 回调函数
	 * @private
	 * @return void
	 */
	BCore.prototype.ready = function ( ) {}
	
	/**
	 * 页面加载完成钩子
	 * @private
	 */
	BCore.prototype.readyHook = function ( ) {
		this.ready();
	}
	
	
	/**
	 * 立即执行函数 可供客户使用
	 * @return void
	 * @example
	 * this.constFun(function(){
	 *		console.log("curstomer function is over" + new Date().getTime());
	 * });
	 * or:
	 * var bcore = new BCore();
	 * bcore.constFun(function(){
	 *		console.log("curstomer function is over" + new Date().getTime());
	 * });
	 */
	BCore.prototype.constFun = function ( constructFun ) {
		if ( typeof( constructFun ) === "function" ) constructFun();
	}
	
	/**
	 * 页面初始化立即执行钩子
	 * @private 
	BCore.prototype.constorHook = function ( ) {
		this.constFun();
		for (var i = 0; i < this.readyFun.length; i++) {
			this.readyFun[i]();
		}
		BCore.prototype.readyFun = [];
	}
	*/

	/**
	 * 是否完成调用
	 * @private
	 */
	BCore.prototype.isLoaded = false;
	
	/**
	 * 过滤器
	 * @private
	 */
	var readyFilter = function (_core) {
		
		if(_core.isLoaded){
			return;
		}
		//_core.constorHook();
		_core.isLoaded = true;
		_core["static"].pageReady = true;
		_core.readyHook();
	}
	
	
	/**
	 * 页面加载完成执行
	 * @private
	 */
	var DOMContentLoaded = function ( _core ) {
		
		var _this = _core;
	
	
		//如果页面已经准备好则立即执行
		//if ( document.readyState === "complete" || document.readyState === "interactive" ) {
		//if ( document.readyState === "complete" || (document.getElementsByTagName && document.getElementById && document.body)) {
		if ( document.readyState === "complete" ) {
			return setTimeout( function(){readyFilter(_this);}, 0 );
		}
	
		// Mozilla, Opera and webkit
		if ( document.addEventListener ) {
			document.addEventListener( "DOMContentLoaded", function() {	
				document.removeEventListener( "DOMContentLoaded", arguments.callee, false );
				(function(){  
					if ( !document.body ) {
						return setTimeout( arguments.callee, 1  );
					}
					setTimeout( function(){readyFilter(_this);}, 0 );
				})(); 
			}, false );

			// 补漏
			window.addEventListener( "load", function(){
				document.removeEventListener( "load", arguments.callee, false );
				setTimeout( function(){readyFilter(_this);}, 0 );
			}, false );

		//IE
		} else if ( document.attachEvent ) {
			//如果页面已经准备好则立即执行
			
			document.attachEvent( "onreadystatechange", function() {
				// 监听完成
				if ( document.readyState === "complete" ) {
					document.detachEvent( "onreadystatechange", arguments.callee );
					setTimeout( function(){readyFilter(_this);}, 0 );
				}
			} );

			// 补漏
			window.attachEvent( "onload", function(){
				document.detachEvent( "onload", arguments.callee );
				setTimeout( function(){readyFilter(_this);}, 0 );
			});

			// IE, 不在iframe中
			var toplevel = false;

			try {
				toplevel = window.frameElement == null;
			} catch(e) {}

			if ( document.documentElement.doScroll && toplevel ) {  

				(function(){  
					try{  
						document.documentElement.doScroll('left');  
					}catch(e){  
						return setTimeout( arguments.callee, 1 );
					}  
					setTimeout( function(){readyFilter(_this);}, 0 );
				})();  

			}  
		}

	}
	
	/**
	 * JSONP方法
	 * @param {String} url 要请求的URL
	 * @private
	 */
	BCore.prototype.jsonp = function ( /**String*/url ) {
		//修改HTTPS模式url
		var _href = window.location.href;
		if(_href.indexOf("https://")==0){
			url = url.replace("http://","https://");
		}

		//URL中增加时间戳，避免缓存
		if(url.indexOf("?") ===-1 ){
			url+="?random="+(new Date()).getTime();
		}else{
			url+="&random="+(new Date()).getTime();
		}
		
		// 动态添加JS脚本，是JSONP技术的核心
		var script = document.createElement( 'script' );
		script.setAttribute( 'src', url );
		script.setAttribute( 'charset', "utf-8" );
	
		// 执行脚本，这个脚本实际上是百分点推荐引擎返回的一个回调函数，回调函数名
		// 已经由url中的callback参数指定，回调函数的参数则是此次请求返回的JSON数据结果
		//document.getElementsByTagName( 'head' )[ 0 ].appendChild( script );
		var _head = document.getElementsByTagName("head")[0];
		_head.insertBefore(script,_head.lastChild);
		
	}
	
	/**
	 * 发送请求，参见BCore的范例
	 * @param {Request} req 请求
	 * @param {function} cb 回调函数(可省略)
	 */
	BCore.prototype.send = function (req,cb,_this){
		//监听gid是否存在
		var _this = _this || this;
		//console.log(_this["static"].req_over);
		if(!_this["static"].req_over) {  //ds 加载完毕 或者5秒后超时
			return setTimeout(function(){
				BCore.prototype.send(req,cb,_this);
			},1);
		}
		else if(!_this.options.gid) _this.options.gid = BFDSubCookie.getCookiePart("bfd_g") || "";
		//监听gid是否存在 结束 新开进程执行jsonp请求
		//setTimeout(function(){
		var cblen = _this.callbacks.length;
		//接到参数时，发普通请求
		if(typeof(cb)==="undefined"){
			/**
			 * @private
			 */
			cb = function(json){};
		}
		if(!req instanceof BCore.Request)return;
		
		//添加构造函数
		_this.callbacks.push(function(json){
			cb(json);
			//释放内存
			_this.callbacks[cblen] = null;
			cb = null;
		});
		
		var _query = [
			req.query(), 
			(function(){
				var querys = [];
				
				for(var key in _this.options){
					if(typeof _this.options[key] !== "string")continue;
					if(typeof req[key] == "undefined") querys.push(key+"="+BCore.Request.prototype.combineStr(_this.options[key]));
				}
				return querys.join("&");
			})(),
			"callback=BCore.instances["+_this.instance_id+"].callbacks["+(cblen)+"]"
		];
		
		_this.jsonp( req.getUrl() +(req.getUrl().indexOf("?")===-1?"?":"&")+_query.join("&") );
		//},100);
	}
	
	/**
	 * 派生出一个新的BCore子类，并且包含BCore的所有静态属性
	 * 派生出的子类包含_super实例属性，指向父类
	 * @param constructer 构造子类的构造函数(可以省略)
	 * @return BCoreChild BCore子类
	 * @example
	 * $Core = BCore = new BCore().extend(function(parm,conf){
	 *	    this._super.call(this,parm,conf);
	 *	},BCore);
	 */
	BCore.prototype.extend = function (constructer,core){
		var NBCore = function (/**function*/ parm ,conf){
			BCore.call(this,parm,conf);
		}
		if(typeof(constructer)!="undefined")NBCore = constructer;
		
		NBCore.prototype = this;
		NBCore.prototype._super = BCore;
		
		for(var key in core){
			if(key=="prototype")continue;
			NBCore[key] = core[key];
		}
		
		return NBCore;
	}

	
	/**
	 * @class 请求类，BCore会自动将非function类型的Request属性当做GET参数传递。"__"开头的变量为私有变量,不会被传递
	 * @constructor
	 * @memberOf BCore
	 * @param {String} url 请求地址，字符串类型
	 */
	BCore.Request = function (url){
		if(typeof(url)!=="undefined"){
			this.getUrl = function(){
				return url;
			}
		}
	}
	BCore.Request .prototype.getUrl = function(){
		return "";//用于测试
	}
	BCore.Request .prototype.query = function(){
		var query_array = new Array();
		//实例属性
		for (var key in this) {
			if ( typeof this[ key ] !== "function"&&key.indexOf("__")!==0) {
				query_array.push((new Array(key, "=", this.combineStr(this[key])  )).join(""));
			}
		}
		return query_array.join( "&" );
	}
	
	/**
	 * 将多个字符串用connector连接起来，与Array.join的唯一区别在于连接之前会做URI转换
	 * @param {Array|number|String} str_arr 字符串数组(若字符串则只做trim)
	 * @param {String} connector 字符串连接符号，默认值是 "|"
	 * @return {String} 将str_arr数组中的所有字符串经过URI编码，用connector连接后的字符串
	 */
	BCore.Request.prototype.combineStr = function(str_arr, connector) {
		
		if(typeof(str_arr)=="undefined")return "undefined";
		if(str_arr==null)return "null";
		
		function trim(str){
			//str = str.replace(new RegExp("\"","g"),"&quot;");
			str = str.replace(new RegExp("^\\s*","g"),"");
			str = str.replace(new RegExp("\\s*$","g"),"");
			return str;
		}
		
		if (connector === undefined || connector === null) {
			connector = "|";
		}
		
		var result = "";
		
		switch ( Object.prototype.toString.apply( str_arr ) ){
			case "[object Boolean]":
				if(str_arr){
					result = "true";
				}else{
					result = "false";
				}
				break;
			case "[object Number]":
				result = str_arr;
				break;
			case "[object String]":
				str_arr = trim( str_arr );
				result = encodeURIComponent( str_arr );
				break;
			case "[object Array]":
				var arr = new Array();
				for (var i = 0; i < str_arr.length; ++i ) {
					if( typeof(str_arr[ i ]) === "object" )continue;
					arr.push( this.combineStr( str_arr[ i ] ) );
				}
				result = arr.join( connector );
				break;
			case "[object Object]":
				var arr = new Array();
				for (var key in str_arr){
					if( typeof(str_arr[ key ]) === "function" )continue;
					if( typeof(str_arr[ key ]) === "object" )continue;
					arr.push( this.combineStr( key ) + ":" + this.combineStr( str_arr[ key ] ) );
				}
				result = arr.join( connector );
				break;
			default:
				break;
		}
		
		return result;
	};
	
	window.BCore = window.$Core = BCore;
})( window );