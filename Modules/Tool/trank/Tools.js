/**
 * @fileoverview 这个文件是工具类以及相关方法（API），Tools模块
 * <font color=red>与所有模块没有依赖关系，在BCore.js模块后加载即可</font>
 * @author weidong.nie shichao.zhang
 * @version 0.1
 */
;(function(window){
	/**
	 * Tools 工具库
	 * @class
	 * @constructor
	 * @namespace Tools命名空间
	 * @constructor
	 * @name Tools
	 * @memberOf BCore.tools
	 */
	var Tools = function(){
	
	};
	
	Tools.prototype = {
		/**
		 * @name Tools.$
		 * @memberOf BCore.tools
		 * @function 查找标签
		 * @param {string} ElementId 标签id
		 * @example
		 * //引入tools类
		 * var Tools = BCore.tools.Tools;
		 * var div1 = Tools.$("bfd_div");
		 * div1.innerText = "hello!";
		 */
		$:function(){
			for(var i = 0;i<arguments.length;i++){
				var ele = argument[i]
				if(typeof arguments[0] == 'string'){
					ele = document.getElementById(arguments[0]);
				}
				if(arguments.length == 1){
					return ele;
				}else{
					return 'not support';
				}
			}
		},
		
		/**
		 * @name Tools.jsonp
		 * @memberOf BCore.tools
		 * @function jsonp
		 * @param {String} url 要请求的URL
		 * @param {Boolean} _static 请求不加随机数
		 * @example
		 * //引入tools类
		 * var Tools = BCore.tools.Tools;
		 * var Tools.jsonp("http://127.0.0.1/api.php?parm1=1&parm2=2&callback=mycallback");
		 * function mycallback(data){
		 * 	console.log(data);
		 * }
		 */
		jsonp:function ( /**String*/url, _static) {
			
			//修改HTTPS模式url
			var _href = window.location.href;
			if(_href.indexOf("https://")==0){
				url = url.replace("http://","https://");
			}

			if(!_static){
				//URL中增加时间戳，避免缓存
				if(url.indexOf("?") ===-1 ){
					url+="?random="+(new Date()).getTime();
				}else{
					url+="&random="+(new Date()).getTime();
				}
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
			
		},
		/**
		 * @name Tools.getChildByClass
		 * @memberOf BCore.tools
		 * @function getChildByClass
		 * @argument {DOM} target 要查找的DOM标签
		 * @argument {String} name 标签Class属性名·
		 * @example
		 * //引入tools类
		 * var Tools = BCore.tools.Tools;
		 * var mydiv = Tools.getChildByClass(document.getElementById("test"),"cname");//在ID为test的标签中查找class=cname的标签
		 */
		getChildByClass:function(target, value){
			var result = new Array();
			for (var i = 0; i < target.childNodes.length; i++) {
				var myelement = target.childNodes.item(i);
				//如果该节点有属性
				if (myelement.nodeType == 1) {//1为dom
					if (myelement.className == value) {
						result.push(myelement);
					}
				}
				
				//如果有子节点 则查询子节点
				if(myelement.hasChildNodes()) {
					var tmp = this.getChildByClass(myelement,value);
					if (tmp.length != 0) {
						result = result.concat(tmp);
					}
				}
			}
			
			return result;
		},
		/**
		 * @name Tools.getCookie
		 * @memberOf BCore.tools
		 * @function getCookie
		 * @param {string} name cookie名
		 * @example
		 * //引入tools类 
		 * var Tools = BCore.tools.Tools;
		 * var coo = Tools.getCookie("session_id");
		 */
		getCookie : function(name){
			return this.cookie(name);
		},
		/**
		 * @name Tools.cookie
		 * @memberOf BCore.tools
		 * @function cookie
		 * @param {string} name cookie名
		 * @example
		 * //引入tools类 
		 * var Tools = BCore.tools.Tools;
		 * var coo = Tools.cookie("session_id");
		 */
		cookie:function(name){
			var value = undefined;
			if(arguments.length>=2){
				value = arguments[1];
			}
			
			var exdate=new Date();
			exdate.setDate(exdate.getDate()+1);//默认为1天过期时间
			exp = exdate;
			if(arguments.length>=3){
				var exdate=new Date();
				exdate.setDate(exdate.getDate()+parseInt(arguments[2]));
				
				exp = exdate;
			}
			
			if(typeof(value)=="undefined"){		
				//alert("设置");
				if(name){
					var arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
					if (arr != null){
						return decodeURI(arr[2]);
					}
					return null;
				}else{
					return document.cookie;
				}
			}else{//设置
				
				if(value!==null){//设置
				
					document.cookie = name+'='+value+';expires='+exp+';path=/;';
				}else{//删除
					//暂时为实现
					document.cookie = name+'=;expires=-1;path=/;';
				}
			}
		},
		/**
		 * @name Tools.setCookie
		 * @memberOf BCore.tools
		 * @function setCookie
		 * @param {string} Cookie name 
		 * @param {string} Cookie value 
		 * @param {string}or{number} time 过期时间
		 * @param {boolean} bool 过期时间是否为毫秒
		 * @param {boolean} sub 是否为当前域名存储  0为取顶级域名
		 * @example
		 * //引入tools类
		 * var Tools = BCore.tools.Tools;
		 * Tools.setCookie('BFDcartItems','http://xxx.xxx.x|1',1)  //1天后过期
		 * Tools.setCookie('BFDcartItems','http://xxx.xxx.x|1',24*60*60*1000,true)  //1天后过期
		 */
		setCookie:function(cname,cval,time,bool,sub){
			var exdate=new Date();
			var _domain = "";
			if(bool) exdate.setTime(exdate.getTime()+Number(time));
			else exdate.setDate(exdate.getDate()+Number(time));
			if(!sub) _domain = "domain="+this.getTopDomain()+";";
			document.cookie=cname+'='+encodeURI(cval)+";expires="+exdate.toUTCString()+';path=/;'+_domain;
		},
		/**
		 * 用户获取域名的根域
		 * @name Tools.getRootDomain
		 * @memberOf BCore.tools
		 * @function
		 * @param {string} str 要处理的域名，例如:www.baifendian.com
		 * @return {String} 根域名 例如:.baifendian.com
		 * @example
		 * //引入tools类
		 * var Tools = BCore.tools.Tools;
		 * Tools.getRootDomain('www.baifendian.com');
		 */
		getRootDomain:function (str){
			//去掉结尾的/
			str = str.replace(/\/$/ig,"");
			//去掉http://
			str = str.replace(/^(http|ftp|https|ssh):\/\//ig,"");
			//替换掉域名结尾
			str = str.replace(/(.com|.info|.net|.net.cn|.org|.me|.mobi|.us|.biz|.xxx|.ca|.mx|.tv|.ws|.com.ag|.net.ag|.org.ag|.ag|.am|.asia|.at|.be|.com.br|.net.br|.com.bz|.net.bz|.bz|.cc|.com.co|.net.co|.com.co|.co|.de|.com.es|.nom.es|.org.es|.es|.eu|.fm|.fr|.gs|.co.in|.firm.in|.gen.in|.ind.in|.net.in|.org.in|.in|.it|.jobs|.jp|.ms|.com.mx|.nl|.nu|.co.nz|.net.nz|.org.nz|.se|.tc|.tk|.com.tw|.idv.tw|.org.tw|.tw|.co.uk|.me.uk|.org.uk|.vg|.com.cn|.gov|.gov.cn|.cn|.ha.cn)$/ig,"%divide%$1");
			
			var tail = str.split("%divide%")[1];
			if(typeof(tail)==="undefined")tail="";
			str = str.split("%divide%")[0];
			
			var strarr = str.split(".");
			
			return "."+strarr[strarr.length-1]+tail;
		},
		/**
		 * 获取浏览器中的域名
		 * @name Tools.getDomain
		 * @memberOf BCore.tools
		 * @function
		 * @return {String} 根域名 例如:www.baifendian.com
		 * @example
		 * //引入tools类
		 * var Tools = BCore.tools.Tools;
		 * Tools.getDomain();//www.baifendian.com
		 */
		getDomain:function (){
			var _url = window.location.href;
			//去掉http://
			_url = _url.replace(/^(http|ftp|https|ssh):\/\//ig,"");
			
			_url = _url.split("/")[0];
			//去掉端口号
			_url = _url.replace(/\:\d+$/ig,"");
			
			return _url;
		},
		/**
		 * 获取浏览器中的域名的顶级域名
		 * @name Tools.getTopDomain
		 * @memberOf BCore.tools
		 * @function
		 * @return {String} 根域名 例如:.baifendian.com
		 * @example
		 * //引入tools类
		 * var Tools = BCore.tools.Tools;
		 * Tools.getTopDomain();//www.baifendian.com
		 */
		getTopDomain : function(){
			var a = (location.hostname + "/").match(/[\w-]+\.(com|info|net|org|me|mobi|us|biz|xxx|ca|mx|tv|ws|am|asia|at|be|bz|cc|co|de|nom|es|eu|fm|fr|gs|firm|gen|ind|in|it|jobs|jp|ms|nl|nu|se|tc|tk|idv|tw|vg|gov|cn|ha)(\.(cn|hk|jp|tw|kr|mo|uk|ag|es|co|nz|in|br|bz|mx))*\//ig);
			if (a) {
				if (0 < a.length)
					return a[0].substr(0, a[0].length - 1)
			} else
				return document.domain;
				//return !1
			//return this.getRootDomain(this.getDomain());
		},
		/**
		 * @name Tools.childElements
		 * @memberOf BCore.tools
		 * @function 获取元素的所有子元素
		 * @author xiuming.wang
		 * @param {nodeObject} nodeObject
		 * @example
		 * //引入tools类
		 * var Tools = BCore.tools.Tools;
		 * Tools.childElements(document.getElementById('xid'))
		 */
		childElements:function(elem){	
			var n = elem.firstChild;
			var r = [];
			if ( n && n.nodeType === 1) {
				r.push( n );
			}
			for ( ; n; n = n.nextSibling ) {
				if ( n.nodeType === 1) {
					r.push( n );
				}
			}
			return r;
		},
		
		/**
		 * @name Tools.siblings
		 * @memberOf BCore.tools
		 * @function get siblings Array
		 * @param {nodeObject} nodeObject.nextSibling
		 * @example
		 * //引入tools类
		 * var Tools = BCore.tools.Tools;
		 * Tools.siblings(document.getElementById('xid'))
		 */
		siblings:function(elem){	
			var n = elem.parentNode.firstChild;
			var r = [];
			for ( ; n; n = n.nextSibling ) {
				if ( n.nodeType === 1 && n !== elem ) {
					r.push( n );
				}
			}
			return r;
		},
		/**
		 * @name Tools.prevAll
		 * @memberOf BCore.tools
		 * @function get prevAll Array
		 * @param {nodeObject} nodeObject.previousSibling
		 * @example
		 * //引入tools类
		 * var Tools = BCore.tools.Tools;
		 * Tools.prevAll(document.getElementById('xid'))
		 */
		prevAll: function(elem) {
			var matched = [],
				cur = elem.previousSibling;

			while ( cur && cur.nodeType !== 9 && cur.nodeType !== 1 ) {
				matched.push( cur );
				cur = cur.previousSibling;
			}
			return matched;
		},
		/**
		 * 获取同级之前的相同元素
		 * @name Tools.preSameTagAll
		 * @memberOf BCore.tools
		 * @function preSameTagAll
		 * @param {nodeObject} elem nodeObject.previousSibling
		 * @author tenglong.jiang on 2012-2-21
		 * @example
		 * //引入tools类
		 * var Tools = BCore.tools.Tools;
		 * Tools.preSameTagAll(document.getElementById('xid'))
		 */
		preSameTagAll : function(elem) {
			var matched = [],
			cur = elem.previousSibling;
			
			while (cur) {
				if(cur.nodeType == 1 && cur.nodeName == elem.nodeName) 
					matched.push( cur );
				
				cur = cur.previousSibling;
				
			}
			return matched;
		},
		/**
		 * 获取同级相同元素
		 * @name Tools.preSameTagsAll
		 * @memberOf BCore.tools
		 * @function preSameTagsAll
		 * @param {nodeObject} elem nodeObject.nextSibling
		 * @param {String} div span
		 * @author tenglong.jiang on 2012-3-4
		 * @example
		 * //引入tools类
		 * var Tools = BCore.tools.Tools;
		 * Tools.preSameTagsAll(document.getElementById('xid'))
		 */
		preSameTagsAll:function(elem, name) {
			var matched = [];
			cur = elem;
			var i=0;
			while (cur) {
				if(cur.nodeType == 1 && cur.nodeName.toLowerCase() == name) {
					i++;
					matched.push( cur );
				}
				cur = cur.nextSibling;				
			}
			return matched;
		},
		/**
		 * 将复杂的字符串转换成Number
		 * @name Tools.toNumber
		 * @memberOf BCore.tools
		 * @function toNumber
		 * @param {string} str 需要转化的字符串
		 * @argument {string} 'http://' or 'https://'
		 * @example
		 * //引入tools类
		 * var Tools = BCore.tools.Tools;
		 * var price = Tools.toNumber("$120.00 ');
		 */
		toNumber:function (str){
			if(!str) return 0;
			str = str.toString();
			str = str.replace(/<(S*?)[^>]*>.*?|<.*?\/>/ig,'');
			str = str.replace(/[^\d\.]/gi,'');
			return parseFloat(str);
		},
		/**
		 * @name Tools.fillPath
		 * @memberOf BCore.tools
		 * @function fillPath
		 * @param {string} URL String
		 * @argument {string} 'http://' or 'https://'
		 * @example
		 * //引入tools类
		 * var Tools = BCore.tools.Tools;
		 * var coo = Tools.fillPath("http://xxx.xxx.x",'http://');
		 */
		fillPath:function(u,hType){
			if(/^(https|http|ftp|sftp|ssh)/.test(u))return u;
			var _host = location.host,
				_href = location.href,
				_href = _href.replace(/^(http:\/\/|https:\/\/)/,''),
				type  = hType||'http://';
			
			if(u.indexOf('/')===0){
				var bb =type+_host+u;
				return bb;
			}else if(u.indexOf('./')===0){
				u = u.replace(/^.\//,'');
				var b=_href.split('/');
				var ho=b[0];
				b.pop();b.shift();
				var bb=type+ho+'/'+b.join('/')+'/'+u;
				return bb;
			}else if(u.indexOf('../')===0){
				while(u.indexOf("../")===0){
					u = u.replace(/^..\//,'');
				}
				var b=_href.split('/');
				var ho=b[0];
				b.pop();b.shift();
				var bb=type+ho+'/'+b.join('/')+'/'+u;
				return bb;
			}else{
				var b=_href.split('/');
				var ho=b[0];
				var bb=type+ho+'/'+u;
				return bb;
			}
		},
		/**
		 * @name Tools.trim
		 * @memberOf BCore.tools
		 * @function 去掉字符串的前后空白字符
		 * @param {string} str 文字
		 * @example
		 * //引入tools类
		 * var Tools = BCore.tools.Tools;
		 * var str = Tools.trim(" balabala.  ");
		 * alert(str) //输出"balabala."
		 */
		trim:function(){
			if(arguments[0] && typeof arguments[0] == "string"){
				return arguments[0].replace(/(^\s*)|(\s*$)/g,'');
			}else{
				return null;
			}
		},
		/**
		 * @name Tools.ltrim
		 * @memberOf BCore.tools
		 * @function 去掉字符串的左边空白字符
		 * @param {string} str 文字
		 * @example
		 * //引入tools类
		 * var Tools = BCore.tools.Tools;
		 * var str = Tools.ltrim(" balabala.  ");
		 * alert(str) //输出"balabala.  "
		 */
		ltrim:function(){
			if(arguments[0] && typeof arguments[0] == "string"){
				return arguments[0].replace(/(^\s*)/g,'');
			}else{
				return null;
			}
		},
		/**
		 * @name Tools.rtrim
		 * @memberOf BCore.tools
		 * @function 去掉字符串的右边空白字符
		 * @param {string} str 文字
		 * @example
		 * //引入tools类
		 * var Tools = BCore.tools.Tools;
		 * var str = Tools.rtrim(" balabala.  ");
		 * alert(str) //输出" balabala."
		 */
		rtrim:function(){
			if(arguments[0] && typeof arguments[0] == "string"){
				return arguments[0].replace(/(\s*$)/g,'');
			}else{
				return null;
			}
		},
		/**
		 * @name Tools.show
		 * @memberOf BCore.tools
		 * @function 让元素显示
		 * @param {string} Element id 
		 * @argument {string} str 显示形式
		 * @example
		 * //引入tools类
		 * var Tools = BCore.tools.Tools;
		 * var str = Tools.show('id','block');
		 */
		show:function(node,value){
			if(!(node = $(node))){return false;}
			node.style.display = value || '';
		},
		/**
		 * @name Tools.hide
		 * @memberOf BCore.tools
		 * @function 让元素隐藏
		 * @param {string} Element id 
		 * @example
		 * //引入tools类
		 * var Tools = BCore.tools.Tools;
		 * var str = Tools.hide('id');
		 */
		hide:function(node){
			if(!(node = $(node))){return false;}
			node.style.display = 'none';
		},
		/**
		 * @name Tools.toggle
		 * @memberOf BCore.tools
		 * @function 使元素改变显示状态
		 * @param {string} Element id
		 * @example
		 * //引入tools类
		 * var Tools = BCore.tools.Tools;
		 * var str = Tools.toggle('id');
		 */
		toggle:function(node){
			if(!(node = $(node))){return false;}
			if(node.style.display != 'none'){
				node.style.display = 'none'
			}else{
				node.style.display = value || '';
			}
		},
		/**
		 * @name Tools.bind
		 * @memberOf BCore.tools
		 * @function 为元素bind事件
		 * @param {HTMLElement} Element
		 * @param {string} Event type 
		 * @param {function} Callback 
		 * @example
		 * //引入tools类
		 * var Tools = BCore.tools.Tools;
		 * var str = Tools.bind(document.getElementById("myid"),'click',function(){...});
		 */
		bind:function(node, type, listener){
			if(node.addEventListener){
				node.addEventListener(type,listener,false);
				return true;
			}else if(node.attachEvent){
				node.attachEvent('on' + type,listener);
				return true;
			}
			return false;
		},
		/**
		 * @name Tools.rmbind
		 * @memberOf BCore.tools
		 * @function 为元素bind事件
		 * @param {HTMLElement} Element
		 * @param {string} Event type 
		 * @param {function} handle 
		 * @example
		 * //引入tools类
		 * var Tools = BCore.tools.Tools;
		 * var str = Tools.rmbind(document.getElementById("myid"),'click',function(){...});
		 */
		rmbind:function(element, type, handle){
			if (element.removeEventListener) {
				element.removeEventListener(type, handle, false);
			} else if (element.detachEvent) { //for ie
				element.detachEvent("on" + type, function () {
					handle.call(element);
				});
			} else {
				element["on" + type] = null;
			}
		},
		/**
		 * @name Tools.removeRepeatArr
		 * @memberOf BCore.tools
		 * @function 
		 * @param {array} arr 
		 * @author hongmei.qi
		 * @example
		 * //引入tools类
		 * var Tools = BCore.tools.Tools;
		 * var str = Tools.removeRepeatArr(['服装','男装','']);
		 */
		removeRepeatArr:function(arr){
			var obj = {};
			var arrNew = [];
			for(var i=0; i<arr.length; i++){
				if(!obj[arr[i]]){
					if(arr[i]!=''){
						arrNew.push(arr[i]);
					}
					obj[arr[i]]=1;
				}
			}
			return arrNew
		},
		/**
		 * @name Tools.mergeRepeat
		 * @memberOf BCore.tools
		 * @function 
		 * @param {array} arr 
		 * @author hongmei.qi
		 * @example
		 * //引入tools类
		 * var Tools = BCore.tools.Tools;
		 * var str = Tools.mergeRepeat([['23',1,34.5],['23',2,35]]);
		 */
		mergeRepeat:function(arr){
			var new_arr = [];
			var len = arr.length;
			for (var i = 0; i < len; i++) {
				for (var j = i + 1; j < len; j++) {
					if (arr[i][0] === arr[j][0]) {
						var amount1 = parseInt(arr[i][2]);
						var price1 = parseFloat(arr[i][1]);
						var amount2 = parseInt(arr[j][2]);
						var price2 = parseFloat(arr[j][1]);
						var new_price = ((amount1 * price1 + amount2 * price2) / (amount1 + amount2)).toFixed(2);
						var new_amount = amount1 + amount2;
						arr[j] = [arr[j][0], new_price, new_amount];
						j = ++i;
					}
				}
				new_arr.push(arr[i]);
			}
			return new_arr;
		},
		/**
		 * @name Tools.getReqId
		 * @memberOf BCore.tools
		 * @function 
		 * @param {string} url 
		 * @author hongmei.qi
		 * @example
		 * //引入tools类
		 * var Tools = BCore.tools.Tools;
		 * var str = Tools.getReqId('http://www.baifendian.com?req_id=0213123wrwer324');
		 */
		getReqId:function(url){
			var str = "req_id=";
			var idx = url.indexOf(str);
			var ReqId = url.slice(idx + str.length);
			var re = /[a-zA-Z0-9]+/;
			return ReqId.match(re);
		},
		/**
		 * @name Tools.isFromRecommend
		 * @memberOf BCore.tools
		 * @function 
		 * @param {string} url 
		 * @author hongmei.qi
		 * @example
		 * //引入tools类
		 * var Tools = BCore.tools.Tools;
		 * var str = Tools.isFromRecommend('http://www.baifendian.com?req_id=0213123wrwer324');
		 */
		isFromRecommend:function(url){
			if(url.indexOf("req_id=") == -1){
				return false;
			}else{
				return true;
			}
		},
		/**
		 * @name Tools.getByteLen
		 * @memberOf BCore.tools
		 * @function 为元素bind事件
		 * @param {string} str 
		 * @param {string} len 
		 * @author hongmei.qi
		 * @example
		 * //引入tools类
		 * var Tools = BCore.tools.Tools;
		 * var str = Tools.getByteLen('测试长度','10');
		 */
		getByteLen:function(str, len){
			if(!str) return '';
			var returnValue = '';
			var byteValLen = 0; 
			for (var i = 0; i < str.length; i++) { 
				if(str.charAt(i).match(/[^\x00-\xff]/ig) != null){
					byteValLen += 2;
				}else{
					byteValLen += 1;
				}
				returnValue += str.charAt(i);
				if(byteValLen > len) {
					break;
				}
			}
			return returnValue; 
		},
		/**
		 * 根据特殊的元素路径，获取页面元素。
		 * @name Tools.getNodeByBFDPath
		 * @memberOf BCore.tools
		 * @function getNodeByBFDPath
		 * @param {string} elem path
		 * @author tenglong.jiang on 2012-3-14
		 * @example
		 * //引入tools类
		 * var Tools = BCore.tools.Tools;
		 * Tools.getNodeByBFDPath('html@@@0@0/body@@@2@0/div@@block@0@0/div@@flowBox@3@0')
		 */
		getElByBFDPath : function (s) {
			if(s == "" || typeof s!="string") return null;
			var arr = s.split("/");
			var el;
			for(var i=1; i<arr.length; i++) {		
				if((i+1) < arr.length) {
					if(i == 1)
						el = document.getElementsByTagName("body")[0];
					/**
					 * @private
					 */
					el = function(parent, node) {
						if(!parent) return;
						narr = node.split("@");
						if(narr[4] != "") {
							var n = Tools.prototype.preSameTagsAll(parent.firstChild, narr[0]);
							return n[narr[4]];
						} else
							return;	
					}(el, arr[i+1]);
				}
			}
			return el;
		},
		/**
		 * 去掉无效图片的数据，filterData内部引用该函数
		 * @name Tools.getSource
		 * @memberOf BCore.tools
		 * @function getSource
		 * @param {array} data
		 * @author tenglong.jiang on 2012-5-4
		 * @example
		 * //引入tools类
		 */
		getSource : function(data) {
			var xmlHttp;
			for(var i=0;i<data.length;i++) {
				var url = data[i].img;
				//没有图片直接过滤掉
				if(!url) {
					data.splice(i,1);    
					i--;
					continue;
				}
				//创建XMLHttpRequest对象
				if (window.XMLHttpRequest) {
				   xmlHttp = new XMLHttpRequest();
				} else {
				   xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
				}
				xmlHttp.open("GET", url, false);//同步
				xmlHttp.send(null);		
				var result = xmlHttp.status;
				//图片not find直接过滤掉
				if(result==404) {
					data.splice(i,1);    
					i--; 
				}
				xmlHttp = null; 		
			}
		},
		/**
		 * 根据过滤条件去重
		 * @name Tools.filterData
		 * @memberOf BCore.tools
		 * @function filterData
		 * @param {array} data
		 * @param {array} filter condition
		 * @author tenglong.jiang on 2012-4-12
		 * @example
		 * //引入tools类
		 * var Tools = BCore.tools.Tools;
		 * Tools.filterData([{"name":"多彩人生多彩裤","price":99},{"name":"多彩人生多彩裤","price":99}],["name", "price"])
		 */
		filterData : function(data, filter) {
			if ((data instanceof Array) && (filter instanceof Array)) {
				for(var i=0; i<data.length; i++) {
					for(var j=i+1; j<data.length; j++) {
						var flag = false;
						for(var k=0; k<filter.length; k++) {
							var f = filter[k];
							if(data[i][f] === undefined || data[i][f] !== data[j][f]) {
								flag = false;
								break;						
							} 
							flag = true;
						}
						if(flag) {
							data.splice(j,1);    
							j--; 
						}							
					}					
				}
				this.getSource(data);
			}
		},
		/**
		 * 获取页面节点路径
		 * @name Tools.getPath
		 * @memberOf BCore.tools
		 * @function getPath
		 * @param {String} ele  页面元素
		 * @param {String} tag  以什么符号分割
		 * @author shichao.zhang on 2012-9-20
		 * @example
		 * //引入tools类
		 * var Tools = BCore.tools.Tools;
		 * dom = document.getElementById("testdom");
		 * Tools.getPath(dom)   html#body#div#div#li
		 */
		getPath:function(ele,tag){
			if(!tag) tag = "@";
			if(ele.nodeName == "HTML") return ele.nodeName;
			else return this.getPath(ele.parentNode,tag) + tag + ele.nodeName;
		},
		/**
		 * 判断对象是否为空
		 * @name Tools.IsEmpty
		 * @memberOf BCore.tools
		 * @function IsEmpty
		 * @param {Object} o  任意元素
		 * @example
		 * //引入tools类
		 * var Tools = BCore.tools.Tools;
		 * Tools.IsEmpty("")
		 */
		IsEmpty : function(o){
			return ((undefined == o) || ("-" == o) || ("" == o));
		},
		/**
		 * 生成HASH值
		 * @name Tools.Hash
		 * @memberOf BCore.tools
		 * @function Hash
		 * @param {String} str  要HASH的字符串
		 * @example
		 * //引入tools类
		 * var Tools = BCore.tools.Tools;
		 * Tools.Hash("baifendian")
		 */
		Hash : function(str) {
			var hash = 1,
			charCode = 0,
			idx;
			if (!this.IsEmpty(str)) {
				hash = 0;
				for (idx = str["length"]-1;idx >= 0; idx--) {
					charCode = str.charCodeAt(idx);
					hash = (hash << 6 & 268435455) + charCode + (charCode << 14);
					charCode = hash & 266338304;
					hash = charCode != 0 ? hash^charCode >> 21 : hash;
				}
			}
			
			return hash;
		},
		/**
		 * 获取页面节点路径
		 * @name Tools.getPath
		 * @memberOf BCore.tools
		 * @function getPath
		 * @param {String} url  地址
		 * @param {String} id  唯一 ID
		 * @param {Function} callback  回调
		 * @author shichao.zhang on 2012-9-20
		 * @example
		 * //引入tools类
		 * var Tools = BCore.tools.Tools;
		 * Tools.loadScript(_std,"bfd_cache_id",function(){});
		 */
		loadScript : function (url,id,callback) {
			if(document.getElementById(id) != null) return;
			var _this = this;
			//setTimeout(function () {
				var script = document.createElement( 'script' );
				script.setAttribute( 'id', id);
				script.setAttribute( 'src', url );
				script.setAttribute( 'charset', "utf-8" );
				if (script.readyState) {
					_this.bind(script, "readystatechange", function () {
						if (script.readyState === "loaded" || script.readyState === "complete") {
							if (callback) {
								callback();
							}
							_this.rmbind(script, "readystatechange", arguments.callee);
						}
					});
				} else {
					_this.bind(script, "load", function () {
						if (callback) {
							callback();
						}
						_this.rmbind(script, "load", arguments.callee)
					});
				}
				var _head = document.getElementsByTagName("head")[0];
				_head.insertBefore(script,_head.lastChild);
				//document.getElementsByTagName("head")[0].appendChild(script);
			//}, 0);
		}
		
	};
	
	/**
	 * @class
	 * @name Repeat
	 * @memberOf BCore.tools
	 * @param {mix} arr 
	 * @author hongmei.qi
	 * @example
	 * //引入tools类
	 * var var rept = new BCore.tools.Repeat();
	 * var str = rept.dedup([{"iid":"1"...},{"iid":"2"...}]);
	 * var str = rept.dedup([1,2]);
	 */
	var Repeat = function (){
		this.obj = {};
		this.obj.o = {};
		this.obj.a = {};
	};
	
	/**
	 * @name Repeat#dedup
	 * @memberOf BCore.tools
	 * @function 
	 * @param {mix} arr 
	 * @author hongmei.qi
	 * @example
	 */
	Repeat.prototype.dedup = function (arr){
		var arrNew = [];
		if(arr[0].iid == undefined) {
			for (var i = 0; i < arr.length; i++) {
				if (!this.obj.a[arr[i]]) {
					arrNew.push(arr[i]);
					this.obj.a[arr[i]] = true;
				}
			}
		} else {
			for (var i = 0; i < arr.length; i++) {
				if (!this.obj.o[arr[i].iid]) {
					arrNew.push(arr[i]);
					this.obj.o[arr[i].iid] = true;
				}
			}
		}
		return arrNew;
	};
	
	
	/**
	 * localData 本地存储函数库
	 * @class
	 * @constructor
	 * @namespace 本地存储
	 * @name localData
	 * @memberOf BCore.tools.Tools
	 * @author shichao.zhang
	 * @example
	 * 
	 * var localdata = BCore.tools.Tools.localData;
	 * localdata.set("bfdid","bfd_gid");
	 * localdata.get("bfdid");    
	 * localdata.remove("bfdid");
	 */
	var localData = {
		/**
		 *  本地hostname
		 */
		hname : (function(){return Tools.prototype.getTopDomain()  ? Tools.prototype.getTopDomain() : 'localStatus';}),
		
		/**
		 *  判断是否支持HTML5
		 */
		isLocalStorage : function(){
			return window.localStorage ? true : false;
		},
		
		/**
		 *  数据存储对象
		 */
		dataDom : null,
		
		/**
		 * @name IE下初始化存储对象
		 * @memberOf localData
		 * @function initDom
		 * @example
		 * localData.initDom();
		 */
		initDom : function () {
			if (!this.dataDom) {
				try {
					this.dataDom = document.createElement('input');
					this.dataDom.type = 'hidden';
					this.dataDom.style.display = 'none';
					this.dataDom.addBehavior('#default#userData');
					var _body = document.body;
					_body.insertBefore(this.dataDom,_body.firstChild);
					//document.body.appendChild(this.dataDom);
					var exDate = new Date();
					exDate.setDate(exDate.getDate() + 365);
					this.dataDom.expires = exDate.toUTCString();
				} catch (ex) {
					return false;
				}
			}
			return true;
		},
		
		/**
		 * @name 本地存储赋值
		 * @memberOf localData
		 * @function set
		 * @example
		 * localData.set("bfdid","bfd_gid");
		 */
		set : function (key, value) {
			try{
				if (this.isLocalStorage()) {
					window.localStorage.setItem(key, value);
				} else {
					if (this.initDom()) {
						this.dataDom.load(this.hname());
						this.dataDom.setAttribute(key, value);
						this.dataDom.save(this.hname())
					}
				}
			}catch(e){}
		},
		
		/**
		 * @name 本地存储取值
		 * @memberOf localData
		 * @function get
		 * @example
		 * localData.get("bfdid");
		 */
		get : function (key) {
			try{
				if (this.isLocalStorage()) {
					return window.localStorage.getItem(key);
				} else {
					if (this.initDom()) {
						this.dataDom.load(this.hname());
						return this.dataDom.getAttribute(key);
					}
				}
			}catch(e){}
		},
		
		/**
		 * @name 本地存储删除
		 * @memberOf localData
		 * @function remove
		 * @example
		 * localData.remove("bfdid");
		 */
		remove : function (key) {
			try{
				if (this.isLocalStorage()) {
					localStorage.removeItem(key);
				} else {
					if (this.initDom()) {
						this.dataDom.load(this.hname());
						this.dataDom.removeAttribute(key);
						this.dataDom.save(this.hname())
					}
				}
			}catch(e){}
		}
	}
	
	/**
	 * @namespace 该命名空间下包含用于基础的输入相关类型
	 * @memberOf BCore
	 */
	BCore.tools = {};
	BCore.tools.Tools =  new Tools();
	BCore.tools.Repeat = Repeat;
	BCore.tools.Tools.localData = localData;
})(window);

(function(window){
	
	/**
	 * SubCookie cookie分割存储
	 * @class
	 * @constructor
	 * @namespace cookie分割存储
	 * @name SubCookie
	 * @author shichao.zhang
	 */
	var SubCookie = {
		getDomain : function () {
			return BCore.tools.Tools.getTopDomain();
			/*
			var a = (location.hostname + "/").match(/[\w-]+\.(com|info|net|org|me|mobi|us|biz|xxx|ca|mx|tv|ws|am|asia|at|be|bz|cc|co|de|nom|es|eu|fm|fr|gs|firm|gen|ind|in|it|jobs|jp|ms|nl|nu|se|tc|tk|idv|tw|vg|gov|cn|ha)(\.(cn|hk|jp|tw|kr|mo|uk|ag|es|co|nz|in|br|bz|mx))*\//ig);
			if (a) {
				if (0 < a.length)
					return a[0].substr(0, a[0].length - 1)
			} else
				return !1*/
		},
		/**
		 * 临时存储
		 * @name Tools.subCookieParts
		 * @memberOf BCore.tools
		 * @function
		 * @return {Object} {"bfd_session_id":"1322321.1223213.12321.3.213"}
		 */
		subCookieParts : {},
		/**
		 * 设置域名子cookie
		 * @name Tools.setCookiePart
		 * @memberOf BCore.tools
		 * @function
		 * @param {String} a key
		 * @param {String} c Value
		 * @example
		 * //引入tools类
		 * var Tools = BCore.tools.Tools;
		 * Tools.setCookiePart('bfd_session_id','2323232332323');
		 */
		setCookiePart : function (a, c) {
			if(!c) return;
			try{
				this.subCookieParts = this.getAllSubCookies();
				a = a.toString();
				c = c.toString();
				this.subCookieParts[encodeURIComponent(a)] = encodeURIComponent(c);
				this.setSubCookieValue();
			}catch(ex){}
		},
		/**
		 * 获取域名子cookie
		 * @name Tools.getCookiePart
		 * @memberOf BCore.tools
		 * @function
		 * @param {String} n key
		 * @example
		 * //引入tools类
		 * var Tools = BCore.tools.Tools;
		 * Tools.getCookiePart('bfd_session_id');   //2323232332323
		 */
		getCookiePart : function (n) {
			try{
				var a = "bfd_session_id=",
				c = document.cookie.indexOf(a),
				b = null,
				d = "";
				if (-1 < c) {
					b = document.cookie.indexOf(";", c);
					if (-1 == b)
						b = document.cookie.length;
					b = document.cookie.substring(c + a.length, b);
					if (0 < b.length) {
						a = b.split("&");
						c = 0;
						for (b = a.length; c < b; c++) {
							var e = a[c].split("=");
							if(decodeURIComponent(e[0]) == n){
								d = decodeURIComponent(e[1]);
								break;
							}
						}
						return d;
					}
				} else
					return null
			}catch(ex){
				return null;
			}
		},
		/**
		 * 获取域名所有子cookie
		 * @name Tools.getAllSubCookies
		 * @memberOf BCore.tools
		 * @function
		 * @return {Object}
		 * @example
		 * //引入tools类
		 * var Tools = BCore.tools.Tools;
		 * Tools.getAllSubCookies();   //2323232332323
		 */
		getAllSubCookies : function () {
			var a = "bfd_session_id=",
			c = document.cookie.indexOf(a),
			b = null,
			d = {};
			if (-1 < c) {
				b = document.cookie.indexOf(";", c);
				if (-1 == b)
					b = document.cookie.length;
				b = document.cookie.substring(c + a.length, b);
				if (0 < b.length) {
					a = b.split("&");
					c = 0;
					for (b = a.length; c < b; c++) {
						var e = a[c].split("=");
						d[decodeURIComponent(e[0])] =  decodeURIComponent(e[1]);
					}
				}
				return d
			} else
				return {};
		},
		/**
		 * 组合域名子cookie
		 * @name Tools.setSubCookieValue
		 * @memberOf BCore.tools
		 * @function
		 * @example
		 * //引入tools类
		 * var Tools = BCore.tools.Tools;
		 * Tools.setSubCookieValue();
		 */
		setSubCookieValue : function () {
			var a = "bfd_session_id=";
			var b = [];
			this.bfddate = new Date;
			this.now = parseInt(this.bfddate.getTime());
			this.bfddate.setTime(this.now + 60*60*1000);
			for(var i in this.subCookieParts)
			{
				if(i && typeof(this.subCookieParts[i]) != "function") b.push(i +"="+ this.subCookieParts[i]);
			}
			0 < b.length ? ( a += b.join("&"), a += "; expires=" + this.bfddate.toUTCString(), a += "; path=/; domain="+this.getDomain()+";") : a += "; expires=" + (new Date(0)).toUTCString();
			document.cookie = a;
			this.subCookieParts = {}
		}
	}
	
	window.BFDSubCookie = SubCookie;
})(window);