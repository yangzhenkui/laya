var window = window || global;
var document = document || (window.document = {});
/***********************************/
/*http://www.layabox.com 2016/11/25*/
/***********************************/
var Laya=window.Laya=(function(window,document){
	var Laya={
		__internals:[],
		__packages:{},
		__classmap:{'Object':Object,'Function':Function,'Array':Array,'String':String},
		__sysClass:{'object':'Object','array':'Array','string':'String','dictionary':'Dictionary'},
		__propun:{writable: true,enumerable: false,configurable: true},
		__presubstr:String.prototype.substr,
		__substr:function(ofs,sz){return arguments.length==1?Laya.__presubstr.call(this,ofs):Laya.__presubstr.call(this,ofs,sz>0?sz:(this.length+sz));},
		__init:function(_classs){_classs.forEach(function(o){o.__init$ && o.__init$();});},
		__isClass:function(o){return o && (o.__isclass || o==Object || o==String || o==Array);},
		__newvec:function(sz,value){
			var d=[];
			d.length=sz;
			for(var i=0;i<sz;i++) d[i]=value;
			return d;
		},
		__extend:function(d,b){
			for (var p in b){
				if (!b.hasOwnProperty(p)) continue;
				var gs=Object.getOwnPropertyDescriptor(b, p);
				var g = gs.get, s = gs.set; 
				if ( g || s ) {
					if ( g && s)
						Object.defineProperty(d,p,gs);
					else{
						g && Object.defineProperty(d, p, g);
						s && Object.defineProperty(d, p, s);
					}
				}
				else d[p] = b[p];
			}
			function __() { Laya.un(this,'constructor',d); }__.prototype=b.prototype;d.prototype=new __();Laya.un(d.prototype,'__imps',Laya.__copy({},b.prototype.__imps));
		},
		__copy:function(dec,src){
			if(!src) return null;
			dec=dec||{};
			for(var i in src) dec[i]=src[i];
			return dec;
		},
		__package:function(name,o){
			if(Laya.__packages[name]) return;
			Laya.__packages[name]=true;
			var p=window,strs=name.split('.');
			if(strs.length>1){
				for(var i=0,sz=strs.length-1;i<sz;i++){
					var c=p[strs[i]];
					p=c?c:(p[strs[i]]={});
				}
			}
			p[strs[strs.length-1]] || (p[strs[strs.length-1]]=o||{});
		},
		__hasOwnProperty:function(name,o){
			o=o ||this;
		    function classHas(name,o){
				if(Object.hasOwnProperty.call(o.prototype,name)) return true;
				var s=o.prototype.__super;
				return s==null?null:classHas(name,s);
			}
			return (Object.hasOwnProperty.call(o,name)) || classHas(name,o.__class);
		},
		__typeof:function(o,value){
			if(!o || !value) return false;
			if(value===String) return (typeof o==='string');
			if(value===Number) return (typeof o==='number');
			if(value.__interface__) value=value.__interface__;
			else if(typeof value!='string')  return (o instanceof value);
			return (o.__imps && o.__imps[value]) || (o.__class==value);
		},
		__as:function(value,type){
			return (this.__typeof(value,type))?value:null;
		},		
		interface:function(name,_super){
			Laya.__package(name,{});
			var ins=Laya.__internals;
			var a=ins[name]=ins[name] || {self:name};
			if(_super)
			{
				var supers=_super.split(',');
				a.extend=[];
				for(var i=0;i<supers.length;i++){
					var name=supers[i];
					ins[name]=ins[name] || {self:name};
					a.extend.push(ins[name]);
				}
			}
			var o=window,words=name.split('.');
			for(var i=0;i<words.length-1;i++) o=o[words[i]];o[words[words.length-1]]={__interface__:name};
		},
		class:function(o,fullName,_super,miniName){
			_super && Laya.__extend(o,_super);
			if(fullName){
				Laya.__package(fullName,o);
				Laya.__classmap[fullName]=o;
				if(fullName.indexOf('.')>0){
					if(fullName.indexOf('laya.')==0){
						var paths=fullName.split('.');
						miniName=miniName || paths[paths.length-1];
						if(Laya[miniName]) console.log("Warning!,this class["+miniName+"] already exist:",Laya[miniName]);
						Laya[miniName]=o;
					}
				}
				else {
					if(fullName=="Main")
						window.Main=o;
					else{
						if(Laya[fullName]){
							console.log("Error!,this class["+fullName+"] already exist:",Laya[fullName]);
						}
						Laya[fullName]=o;
					}
				}
			}
			var un=Laya.un,p=o.prototype;
			un(p,'hasOwnProperty',Laya.__hasOwnProperty);
			un(p,'__class',o);
			un(p,'__super',_super);
			un(p,'__className',fullName);
			un(o,'__super',_super);
			un(o,'__className',fullName);
			un(o,'__isclass',true);
			un(o,'super',function(o){this.__super.call(o);});
		},
		imps:function(dec,src){
			if(!src) return null;
			var d=dec.__imps|| Laya.un(dec,'__imps',{});
			function __(name){
				var c,exs;
				if(! (c=Laya.__internals[name]) ) return;
				d[name]=true;
				if(!(exs=c.extend)) return;
				for(var i=0;i<exs.length;i++){
					__(exs[i].self);
				}
			}
			for(var i in src) __(i);
		},
		getset:function(isStatic,o,name,getfn,setfn){
			if(!isStatic){
				getfn && Laya.un(o,'_$get_'+name,getfn);
				setfn && Laya.un(o,'_$set_'+name,setfn);
			}
			else{
				getfn && (o['_$GET_'+name]=getfn);
				setfn && (o['_$SET_'+name]=setfn);
			}
			if(getfn && setfn) 
				Object.defineProperty(o,name,{get:getfn,set:setfn,enumerable:false});
			else{
				getfn && Object.defineProperty(o,name,{get:getfn,enumerable:false});
				setfn && Object.defineProperty(o,name,{set:setfn,enumerable:false});
			}
		},
		static:function(_class,def){
				for(var i=0,sz=def.length;i<sz;i+=2){
					if(def[i]=='length') 
						_class.length=def[i+1].call(_class);
					else{
						function tmp(){
							var name=def[i];
							var getfn=def[i+1];
							Object.defineProperty(_class,name,{
								get:function(){delete this[name];return this[name]=getfn.call(this);},
								set:function(v){delete this[name];this[name]=v;},enumerable: true,configurable: true});
						}
						tmp();
					}
				}
		},		
		un:function(obj,name,value){
			value || (value=obj[name]);
			Laya.__propun.value=value;
			Object.defineProperty(obj, name, Laya.__propun);
			return value;
		},
		uns:function(obj,names){
			names.forEach(function(o){Laya.un(obj,o)});
		}
	};

	window.console=window.console || ({log:function(){}});
	window.trace=window.console.log;
	Error.prototype.throwError=function(){throw arguments;};
	String.prototype.substr=Laya.__substr;
	Object.defineProperty(Array.prototype,'fixed',{enumerable: false});

	return Laya;
})(window,document);

(function(window,document,Laya){
	var __un=Laya.un,__uns=Laya.uns,__static=Laya.static,__class=Laya.class,__getset=Laya.getset,__newvec=Laya.__newvec;

})(window,document,Laya);


(function(window,document,Laya){
	var __un=Laya.un,__uns=Laya.uns,__static=Laya.static,__class=Laya.class,__getset=Laya.getset,__newvec=Laya.__newvec;
	Laya.interface('laya.runtime.IMarket');
	Laya.interface('laya.filters.IFilter');
	Laya.interface('laya.display.ILayout');
	Laya.interface('laya.resource.IDispose');
	Laya.interface('laya.runtime.IPlatform');
	Laya.interface('laya.resource.IDestroy');
	Laya.interface('laya.runtime.IConchNode');
	Laya.interface('laya.filters.IFilterAction');
	Laya.interface('laya.runtime.ICPlatformClass');
	Laya.interface('laya.resource.ICreateResource');
	Laya.interface('laya.runtime.IPlatformClass','laya.runtime.IPlatform');
	/**
	*@private
	*/
	//class laya.utils.RunDriver
	var RunDriver=(function(){
		function RunDriver(){};
		__class(RunDriver,'laya.utils.RunDriver');
		RunDriver.FILTER_ACTIONS=[];
		RunDriver.pixelRatio=-1;
		RunDriver._charSizeTestDiv=null
		RunDriver.now=function(){
			return /*__JS__ */Date.now();
		}

		RunDriver.getWindow=function(){
			return /*__JS__ */window;
		}

		RunDriver.newWebGLContext=function(canvas,webGLName){
			return canvas.getContext(webGLName,{stencil:true,alpha:Config.isAlpha,antialias:Config.isAntialias,premultipliedAlpha:Config.premultipliedAlpha});
		}

		RunDriver.getPixelRatio=function(){
			if (RunDriver.pixelRatio < 0){
				var ctx=Browser.context;
				var backingStore=ctx.backingStorePixelRatio || ctx.webkitBackingStorePixelRatio || ctx.mozBackingStorePixelRatio || ctx.msBackingStorePixelRatio || ctx.oBackingStorePixelRatio || ctx.backingStorePixelRatio || 1;
				RunDriver.pixelRatio=(Browser.window.devicePixelRatio || 1)/ backingStore;
			}
			return RunDriver.pixelRatio;
		}

		RunDriver.getIncludeStr=function(name){
			return null;
		}

		RunDriver.createShaderCondition=function(conditionScript){
			var fn="(function() {return "+conditionScript+";})";
			return Browser.window.eval(fn);
		}

		RunDriver.measureText=function(txt,font){
			if (Render.isConchApp){
				var ctx=/*__JS__ */ConchTextCanvas;
				ctx.font=font;
				return ctx.measureText(txt);
			}
			if (RunDriver._charSizeTestDiv==null){
				RunDriver._charSizeTestDiv=Browser.createElement('div');
				RunDriver._charSizeTestDiv.style.cssText="z-index:10000000;padding:0px;position: absolute;left:0px;visibility:hidden;top:0px;background:white";
				Browser.container.appendChild(RunDriver._charSizeTestDiv);
			}
			RunDriver._charSizeTestDiv.style.font=font;
			RunDriver._charSizeTestDiv.innerText=txt==" " ? "i" :txt;
			return {width:RunDriver._charSizeTestDiv.offsetWidth,height:RunDriver._charSizeTestDiv.offsetHeight};
		}

		RunDriver.beginFlush=function(){
		};

		RunDriver.endFinish=function(){
		};

		RunDriver.addToAtlas=null
		RunDriver.flashFlushImage=function(atlasWebGLCanvas){
		};

		RunDriver.drawToCanvas=function(sprite,_renderType,canvasWidth,canvasHeight,offsetX,offsetY){
			var canvas=HTMLCanvas.create("2D");
			var context=new RenderContext(canvasWidth,canvasHeight,canvas);
			RenderSprite.renders[_renderType]._fun(sprite,context,offsetX,offsetY);
			return canvas;
		}

		RunDriver.createParticleTemplate2D=null
		RunDriver.createGLTextur=null;
		RunDriver.createWebGLContext2D=null;
		RunDriver.changeWebGLSize=function(w,h){
		};

		RunDriver.createRenderSprite=function(type,next){
			return new RenderSprite(type,next);
		}

		RunDriver.createFilterAction=function(type){
			return new ColorFilterAction();
		}

		RunDriver.createGraphics=function(){
			return new Graphics();
		}

		RunDriver.clear=function(value){
			Render._context.ctx.clear();
		}

		RunDriver.clearAtlas=function(value){
		};

		RunDriver.addTextureToAtlas=function(value){
		};

		RunDriver.getTexturePixels=function(value,x,y,width,height){
			return null;
		}

		RunDriver.skinAniSprite=function(){
			return null;
		}

		return RunDriver;
	})()


	/**
	*<code>Laya</code> ????????????????????????????????????
	*/
	//class Laya
	var ___Laya=(function(){
		//function Laya(){};
		/**
		*????????????????????????????????????????????????
		*/
		__getset(1,Laya,'alertGlobalError',null,function(value){
			var erralert=0;
			if (value){
				Browser.window.onerror=function (msg,url,line,column,detail){
					if (erralert++< 5 && detail)
						alert("?????????????????????????????????????????????\n"+msg+"\n"+detail.stack);
				}
				}else {
				Browser.window.onerror=null;
			}
		});

		Laya.init=function(width,height,__plugins){
			var plugins=[];for(var i=2,sz=arguments.length;i<sz;i++)plugins.push(arguments[i]);
			if (Laya._isinit)return;
			Laya._isinit=true;
			Browser.__init__();
			Context.__init__();
			Graphics.__init__();
			Laya.timer=new Timer();
			Laya.loader=new LoaderManager();
			for (var i=0,n=plugins.length;i < n;i++){
				if (plugins[i].enable)plugins[i].enable();
			}
			Font.__init__();
			Style.__init__();
			ResourceManager.__init__();
			CacheManger.beginCheck();
			Laya.stageBox=Laya.stage=new Stage();
			Laya.stage.model&&Laya.stage.model.setRootNode();
			var location=Browser.window.location;
			var pathName=location.pathname;
			pathName=pathName.charAt(2)==':' ? pathName.substring(1):pathName;
			URL.rootPath=URL.basePath=URL.getPath(location.protocol=="file:" ? pathName :location.protocol+"//"+location.host+location.pathname);
			Laya.render=new Render(0,0);
			Laya.stage.size(width,height);
			RenderSprite.__init__();
			KeyBoardManager.__init__();
			MouseManager.instance.__init__(Laya.stage,Render.canvas);
			Input.__init__();
			SoundManager.autoStopMusic=true;
			LocalStorage.__init__();
			return Render.canvas;
		}

		Laya.stage=null;
		Laya.timer=null;
		Laya.loader=null;
		Laya.render=null
		Laya.version="1.5.5";
		Laya.stageBox=null
		Laya._isinit=false;
		__static(Laya,
		['conchMarket',function(){return this.conchMarket=/*__JS__ */window.conch?conchMarket:null;},'PlatformClass',function(){return this.PlatformClass=/*__JS__ */window.PlatformClass;}
		]);
		return Laya;
	})()


	/**
	*Config ?????????????????????????????????
	*/
	//class Config
	var Config=(function(){
		function Config(){};
		__class(Config,'Config');
		Config.WebGLTextCacheCount=500;
		Config.atlasEnable=false;
		Config.showCanvasMark=false;
		Config.CPUMemoryLimit=120 *1024 *1024;
		Config.GPUMemoryLimit=160 *1024 *1024;
		Config.animationInterval=50;
		Config.isAntialias=false;
		Config.isAlpha=false;
		Config.premultipliedAlpha=false;
		return Config;
	})()


	/**
	*<code>EventDispatcher</code> ?????????????????????????????????????????????
	*/
	//class laya.events.EventDispatcher
	var EventDispatcher=(function(){
		var EventHandler;
		function EventDispatcher(){
			this._events=null;
		}

		__class(EventDispatcher,'laya.events.EventDispatcher');
		var __proto=EventDispatcher.prototype;
		/**
		*?????? EventDispatcher ????????????????????????????????????????????????????????????
		*@param type ??????????????????
		*@return ??????????????????????????????????????????????????? true?????????????????? false???
		*/
		__proto.hasListener=function(type){
			var listener=this._events && this._events[type];
			return !!listener;
		}

		/**
		*???????????????
		*@param type ???????????????
		*@param data ???????????????
		*<b>?????????</b>????????????????????????????????? p1,p2,p3,...??????????????????????????????[p1,p2,p3,...] ????????????????????????????????? p ?????????????????????????????????????????????[p]???????????????????????? p ??????????????????????????? p???
		*@return ??????????????????????????????????????????????????????????????? true??????????????? false???
		*/
		__proto.event=function(type,data){
			if (!this._events || !this._events[type])return false;
			var listeners=this._events[type];
			if (listeners.run){
				if (listeners.once)delete this._events[type];
				data !=null ? listeners.runWith(data):listeners.run();
				}else {
				for (var i=0,n=listeners.length;i < n;i++){
					var listener=listeners[i];
					if (listener){
						(data !=null)? listener.runWith(data):listener.run();
					}
					if (!listener || listener.once){
						listeners.splice(i,1);
						i--;
						n--;
					}
				}
				if (listeners.length===0)delete this._events[type];
			}
			return true;
		}

		/**
		*?????? EventDispatcher ?????????????????????????????????????????????????????????????????????????????????????????????
		*@param type ??????????????????
		*@param caller ?????????????????????????????????
		*@param listener ?????????????????????
		*@param args ????????????????????????????????????
		*@return ??? EventDispatcher ?????????
		*/
		__proto.on=function(type,caller,listener,args){
			return this._createListener(type,caller,listener,args,false);
		}

		/**
		*?????? EventDispatcher ??????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????
		*@param type ??????????????????
		*@param caller ?????????????????????????????????
		*@param listener ?????????????????????
		*@param args ????????????????????????????????????
		*@return ??? EventDispatcher ?????????
		*/
		__proto.once=function(type,caller,listener,args){
			return this._createListener(type,caller,listener,args,true);
		}

		/**@private */
		__proto._createListener=function(type,caller,listener,args,once,offBefore){
			(offBefore===void 0)&& (offBefore=true);
			offBefore && this.off(type,caller,listener,once);
			var handler=EventHandler.create(caller || this,listener,args,once);
			this._events || (this._events={});
			var events=this._events;
			if (!events[type])events[type]=handler;
			else {
				if (!events[type].run)events[type].push(handler);
				else events[type]=[events[type],handler];
			}
			return this;
		}

		/**
		*??? EventDispatcher ???????????????????????????
		*@param type ??????????????????
		*@param caller ?????????????????????????????????
		*@param listener ?????????????????????
		*@param onceOnly ???????????? true ,?????????????????? once ???????????????????????????
		*@return ??? EventDispatcher ?????????
		*/
		__proto.off=function(type,caller,listener,onceOnly){
			(onceOnly===void 0)&& (onceOnly=false);
			if (!this._events || !this._events[type])return this;
			var listeners=this._events[type];
			if (listener !=null){
				if (listeners.run){
					if ((!caller || listeners.caller===caller)&& listeners.method===listener && (!onceOnly || listeners.once)){
						delete this._events[type];
						listeners.recover();
					}
					}else {
					var count=0;
					for (var i=0,n=listeners.length;i < n;i++){
						var item=listeners[i];
						if (item && (!caller || item.caller===caller)&& item.method===listener && (!onceOnly || item.once)){
							count++;
							listeners[i]=null;
							item.recover();
						}
					}
					if (count===n)delete this._events[type];
				}
			}
			return this;
		}

		/**
		*??? EventDispatcher ??????????????????????????????????????????????????????
		*@param type ??????????????????????????? null????????????????????????????????????????????????
		*@return ??? EventDispatcher ?????????
		*/
		__proto.offAll=function(type){
			var events=this._events;
			if (!events)return this;
			if (type){
				this._recoverHandlers(events[type]);
				delete events[type];
				}else {
				for (var name in events){
					this._recoverHandlers(events[name]);
				}
				this._events=null;
			}
			return this;
		}

		__proto._recoverHandlers=function(arr){
			if (!arr)return;
			if (arr.run){
				arr.recover();
				}else {
				for (var i=arr.length-1;i >-1;i--){
					if (arr[i]){
						arr[i].recover();
						arr[i]=null;
					}
				}
			}
		}

		/**
		*????????????????????????????????????????????????
		*@param type ??????????????????
		*@return ????????????????????????????????? true;??????????????? false???
		*/
		__proto.isMouseEvent=function(type){
			return EventDispatcher.MOUSE_EVENTS[type];
		}

		EventDispatcher.MOUSE_EVENTS={"rightmousedown":true,"rightmouseup":true,"rightclick":true,"mousedown":true,"mouseup":true,"mousemove":true,"mouseover":true,"mouseout":true,"click":true,"doubleclick":true};
		EventDispatcher.__init$=function(){
			/**@private */
			//class EventHandler extends laya.utils.Handler
			EventHandler=(function(_super){
				function EventHandler(caller,method,args,once){
					EventHandler.__super.call(this,caller,method,args,once);
				}
				__class(EventHandler,'',_super);
				var __proto=EventHandler.prototype;
				__proto.recover=function(){
					if (this._id > 0){
						this._id=0;
						EventHandler._pool.push(this.clear());
					}
				}
				EventHandler.create=function(caller,method,args,once){
					(once===void 0)&& (once=true);
					if (EventHandler._pool.length)return EventHandler._pool.pop().setTo(caller,method,args,once);
					return new EventHandler(caller,method,args,once);
				}
				EventHandler._pool=[];
				return EventHandler;
			})(Handler)
		}

		return EventDispatcher;
	})()


	/**
	*<p><code>Handler</code> ????????????????????????</p>
	*<p>???????????? Handler.create()??????????????????????????????????????????????????????</p>
	*<p><b>?????????</b>????????????????????????????????????????????????????????????????????????????????????????????????????????????</p>
	*/
	//class laya.utils.Handler
	var Handler=(function(){
		function Handler(caller,method,args,once){
			//this.caller=null;
			//this.method=null;
			//this.args=null;
			this.once=false;
			this._id=0;
			(once===void 0)&& (once=false);
			this.setTo(caller,method,args,once);
		}

		__class(Handler,'laya.utils.Handler');
		var __proto=Handler.prototype;
		/**
		*????????????????????????????????????
		*@param caller ?????????(this)???
		*@param method ???????????????
		*@param args ??????????????????
		*@param once ?????????????????????????????????true??????????????????recover()???????????????
		*@return ?????? handler ?????????
		*/
		__proto.setTo=function(caller,method,args,once){
			this._id=Handler._gid++;
			this.caller=caller;
			this.method=method;
			this.args=args;
			this.once=once;
			return this;
		}

		/**
		*??????????????????
		*/
		__proto.run=function(){
			if (this.method==null)return null;
			var id=this._id;
			var result=this.method.apply(this.caller,this.args);
			this._id===id && this.once && this.recover();
			return result;
		}

		/**
		*???????????????????????????????????????
		*@param data ????????????????????????????????????????????????Array(????????????)???
		*/
		__proto.runWith=function(data){
			if (this.method==null)return null;
			var id=this._id;
			if (data==null)
				var result=this.method.apply(this.caller,this.args);
			else if (!this.args && !data.unshift)result=this.method.call(this.caller,data);
			else if (this.args)result=this.method.apply(this.caller,this.args.concat(data));
			else result=this.method.apply(this.caller,data);
			this._id===id && this.once && this.recover();
			return result;
		}

		/**
		*?????????????????????
		*/
		__proto.clear=function(){
			this.caller=null;
			this.method=null;
			this.args=null;
			return this;
		}

		/**
		*?????????????????? Handler ???????????????
		*/
		__proto.recover=function(){
			if (this._id > 0){
				this._id=0;
				Handler._pool.push(this.clear());
			}
		}

		Handler.create=function(caller,method,args,once){
			(once===void 0)&& (once=true);
			if (Handler._pool.length)return Handler._pool.pop().setTo(caller,method,args,once);
			return new Handler(caller,method,args,once);
		}

		Handler._pool=[];
		Handler._gid=1;
		return Handler;
	})()


	/**
	*<code>BitmapFont</code> ??????????????????????????????????????????????????????
	*/
	//class laya.display.BitmapFont
	var BitmapFont=(function(){
		function BitmapFont(){
			this.fontSize=12;
			this.autoScaleSize=false;
			this._texture=null;
			this._fontCharDic={};
			this._complete=null;
			this._path=null;
			this._maxHeight=0;
			this._maxWidth=0;
			this._spaceWidth=10;
			this._leftPadding=0;
			this._rightPadding=0;
			this._letterSpacing=0;
		}

		__class(BitmapFont,'laya.display.BitmapFont');
		var __proto=BitmapFont.prototype;
		/**
		*??????????????????????????????????????????????????????????????????
		*@param path ??????????????????????????????
		*@param complete ??????????????????????????????????????????????????????????????????????????????
		*/
		__proto.loadFont=function(path,complete){
			this._path=path;
			this._complete=complete;
			Laya.loader.load([{url:this._path,type:/*laya.net.Loader.XML*/"xml"},{url:this._path.replace(".fnt",".png"),type:/*laya.net.Loader.IMAGE*/"image"}],Handler.create(this,this.onLoaded));
		}

		__proto.onLoaded=function(){
			this.parseFont(Loader.getRes(this._path),Loader.getRes(this._path.replace(".fnt",".png")));
			this._complete && this._complete.run();
		}

		/**
		*?????????????????????
		*@param xml ????????????XML???
		*@param texture ??????????????????
		*/
		__proto.parseFont=function(xml,texture){
			if (xml==null || texture==null)return;
			this._texture=texture;
			var tX=0;
			var tScale=1;
			var tInfo=xml.getElementsByTagName("info");
			this.fontSize=parseInt(tInfo[0].attributes["size"].nodeValue);
			var tPadding=tInfo[0].attributes["padding"].nodeValue;
			var tPaddingArray=tPadding.split(",");
			var tUpPadding=parseInt(tPaddingArray[0]);
			var tDownPadding=parseInt(tPaddingArray[2]);
			this._leftPadding=parseInt(tPaddingArray[3]);
			this._rightPadding=parseInt(tPaddingArray[1]);
			var chars=xml.getElementsByTagName("char");
			var i=0;
			for (i=0;i < chars.length;i++){
				var tAttribute=chars[i].attributes;
				var tId=parseInt(tAttribute["id"].nodeValue);
				var xOffset=parseInt(tAttribute["xoffset"].nodeValue)/ tScale;
				var yOffset=parseInt(tAttribute["yoffset"].nodeValue)/ tScale;
				var xAdvance=parseInt(tAttribute["xadvance"].nodeValue)/ tScale;
				var region=new Rectangle();
				region.x=parseInt(tAttribute["x"].nodeValue);
				region.y=parseInt(tAttribute["y"].nodeValue);
				region.width=parseInt(tAttribute["width"].nodeValue);
				region.height=parseInt(tAttribute["height"].nodeValue);
				var tTexture=Texture.create(texture,region.x,region.y,region.width,region.height,xOffset,yOffset);
				this._maxHeight=Math.max(this._maxHeight,tUpPadding+tDownPadding+tTexture.height);
				this._maxWidth=Math.max(this._maxWidth,tTexture.width);
				this._fontCharDic[tId]=tTexture;
			}
			if (this.getCharTexture(" "))this.setSpaceWidth(this.getCharWidth(" "));
		}

		/**
		*??????????????????????????????????????????
		*@param char ?????????
		*@return ??????????????????????????????
		*/
		__proto.getCharTexture=function(char){
			return this._fontCharDic[char.charCodeAt(0)];
		}

		/**
		*???????????????????????????Text.unregisterBitmapFont ????????????????????????
		*/
		__proto.destroy=function(){
			var tTexture=null;
			for (var p in this._fontCharDic){
				tTexture=this._fontCharDic[p];
				if (tTexture)tTexture.destroy();
				delete this._fontCharDic[p];
			}
			this._texture.destroy();
		}

		/**
		*????????????????????????????????????????????????????????????????????????????????????
		*@param spaceWidth ???????????????????????????
		*/
		__proto.setSpaceWidth=function(spaceWidth){
			this._spaceWidth=spaceWidth;
		}

		/**
		*??????????????????????????????
		*@param char ?????????
		*@return ?????????
		*/
		__proto.getCharWidth=function(char){
			if (char==" ")return this._spaceWidth+this._letterSpacing;
			var tTexture=this.getCharTexture(char)
			if (tTexture)return tTexture.width+tTexture.offsetX *2+this._letterSpacing;
			return 0;
		}

		/**
		*????????????????????????????????????
		*@param text ???????????????
		*@return ?????????
		*/
		__proto.getTextWidth=function(text){
			var tWidth=0;
			for (var i=0,n=text.length;i < n;i++){
				tWidth+=this.getCharWidth(text.charAt(i));
			}
			return tWidth;
		}

		/**
		*???????????????????????????
		*/
		__proto.getMaxWidth=function(){
			return this._maxWidth+this._letterSpacing;
		}

		/**
		*???????????????????????????
		*/
		__proto.getMaxHeight=function(){
			return this._maxHeight;
		}

		/**
		*@private
		*??????????????????????????????????????????????????????
		*/
		__proto.drawText=function(text,sprite,drawX,drawY,align,width){
			var tWidth=0;
			var tTexture;
			for (var i=0,n=text.length;i < n;i++){
				tWidth+=this.getCharWidth(text.charAt(i));
			};
			var dx=this._leftPadding;
			align==="center" && (dx=(width-tWidth)/ 2);
			align==="right" && (dx=(width-tWidth)-this._rightPadding);
			var tX=0;
			for (i=0,n=text.length;i < n;i++){
				tTexture=this.getCharTexture(text.charAt(i));
				if (tTexture)sprite.graphics.drawTexture(tTexture,drawX+tX+dx,drawY,tTexture.width,tTexture.height);
				tX+=this.getCharWidth(text.charAt(i));
			}
		}

		/**
		*??????????????????????????????????????????????????????
		*/
		/**
		*??????????????????????????????????????????????????????
		*/
		__getset(0,__proto,'letterSpacing',function(){
			return this._letterSpacing;
			},function(value){
			this._letterSpacing=value;
		});

		return BitmapFont;
	})()


	/**
	*@private
	*<code>Style</code> ??????????????????????????????
	*/
	//class laya.display.css.Style
	var Style=(function(){
		function Style(){
			this.alpha=1;
			this.visible=true;
			this.scrollRect=null;
			this.blendMode=null;
			this._type=0;
			this._tf=Style._TF_EMPTY;
		}

		__class(Style,'laya.display.css.Style');
		var __proto=Style.prototype;
		__proto.getTransform=function(){
			return this._tf;
		}

		__proto.setTransform=function(value){
			this._tf=value==='none' || !value ? Style._TF_EMPTY :value;
		}

		__proto.setTranslateX=function(value){
			this._tf===Style._TF_EMPTY && (this._tf=new TransformInfo());
			this._tf.translateX=value;
		}

		__proto.setTranslateY=function(value){
			this._tf===Style._TF_EMPTY && (this._tf=new TransformInfo());
			this._tf.translateY=value;
		}

		__proto.setScaleX=function(value){
			this._tf===Style._TF_EMPTY && (this._tf=new TransformInfo());
			this._tf.scaleX=value;
		}

		__proto.setScaleY=function(value){
			this._tf===Style._TF_EMPTY && (this._tf=new TransformInfo());
			this._tf.scaleY=value;
		}

		__proto.setRotate=function(value){
			this._tf===Style._TF_EMPTY && (this._tf=new TransformInfo());
			this._tf.rotate=value;
		}

		__proto.setSkewX=function(value){
			this._tf===Style._TF_EMPTY && (this._tf=new TransformInfo());
			this._tf.skewX=value;
		}

		__proto.setSkewY=function(value){
			this._tf===Style._TF_EMPTY && (this._tf=new TransformInfo());
			this._tf.skewY=value;
		}

		/**??????????????????*/
		__proto.destroy=function(){
			this.scrollRect=null;
		}

		/**@private */
		__proto.render=function(sprite,context,x,y){}
		/**@private */
		__proto.getCSSStyle=function(){
			return CSSStyle.EMPTY;
		}

		/**@private */
		__proto._enableLayout=function(){
			return false;
		}

		/**X ???????????????*/
		__getset(0,__proto,'scaleX',function(){
			return this._tf.scaleX;
			},function(value){
			this.setScaleX(value);
		});

		/**??????????????? 2D ??? 3D ???????????????????????????????????????????????????????????????????????????????????????*/
		__getset(0,__proto,'transform',function(){
			return this.getTransform();
			},function(value){
			this.setTransform(value);
		});

		/**???????????????????????? X ????????????*/
		__getset(0,__proto,'translateX',function(){
			return this._tf.translateX;
			},function(value){
			this.setTranslateX(value);
		});

		/**???????????????????????? Y ????????????*/
		__getset(0,__proto,'translateY',function(){
			return this._tf.translateY;
			},function(value){
			this.setTranslateY(value);
		});

		/**Y ???????????????*/
		__getset(0,__proto,'scaleY',function(){
			return this._tf.scaleY;
			},function(value){
			this.setScaleY(value);
		});

		/**??????????????????????????????????????????*/
		__getset(0,__proto,'block',function(){
			return (this._type & 0x1)!=0;
		});

		/**???????????? Y ?????? 2D ???????????????*/
		__getset(0,__proto,'skewY',function(){
			return this._tf.skewY;
			},function(value){
			this.setSkewY(value);
		});

		/**?????????????????????*/
		__getset(0,__proto,'rotate',function(){
			return this._tf.rotate;
			},function(value){
			this.setRotate(value);
		});

		/**???????????? X ?????? 2D ???????????????*/
		__getset(0,__proto,'skewX',function(){
			return this._tf.skewX;
			},function(value){
			this.setSkewX(value);
		});

		/**??????????????????????????????*/
		__getset(0,__proto,'paddingLeft',function(){
			return 0;
		});

		/**??????????????????????????????*/
		__getset(0,__proto,'paddingTop',function(){
			return 0;
		});

		/**????????????????????????*/
		__getset(0,__proto,'absolute',function(){
			return true;
		});

		Style.__init__=function(){
			Style._TF_EMPTY=new TransformInfo();
			Style.EMPTY=new Style();
		}

		Style.EMPTY=null
		Style._TF_EMPTY=null
		return Style;
	})()


	/**
	*@private
	*<code>Font</code> ??????????????????????????????
	*/
	//class laya.display.css.Font
	var Font=(function(){
		function Font(src){
			this._type=0;
			this._weight=0;
			this._decoration=null;
			this._text=null;
			this.indent=0;
			this._color=Color.create(Font.defaultColor);
			this.family=Font.defaultFamily;
			this.stroke=Font._STROKE;
			this.size=Font.defaultSize;
			src && src!==Font.EMPTY && src.copyTo(this);
		}

		__class(Font,'laya.display.css.Font');
		var __proto=Font.prototype;
		/**
		*????????????????????????
		*/
		__proto.set=function(value){
			this._text=null;
			var strs=value.split(' ');
			for (var i=0,n=strs.length;i < n;i++){
				var str=strs[i];
				switch (str){
					case 'italic':
						this.italic=true;
						continue ;
					case 'bold':
						this.bold=true;
						continue ;
					}
				if (str.indexOf('px')> 0){
					this.size=parseInt(str);
					this.family=strs[i+1];
					i++;
					continue ;
				}
			}
		}

		/**
		*??????????????????????????????
		*@return ????????????????????????
		*/
		__proto.toString=function(){
			this._text=""
			this.italic && (this._text+="italic ");
			this.bold && (this._text+="bold ");
			return this._text+=this.size+"px "+this.family;
		}

		/**
		*??????????????????????????????????????? <code>Font</code> ?????????
		*@param dec ?????? Font ?????????
		*/
		__proto.copyTo=function(dec){
			dec._type=this._type;
			dec._text=this._text;
			dec._weight=this._weight;
			dec._color=this._color;
			dec.family=this.family;
			dec.stroke=this.stroke !=Font._STROKE ? this.stroke.slice():Font._STROKE;
			dec.indent=this.indent;
			dec.size=this.size;
		}

		/**
		*??????????????????????????????
		*/
		__getset(0,__proto,'password',function(){
			return (this._type & 0x400)!==0;
			},function(value){
			value ? (this._type |=0x400):(this._type &=~0x400);
		});

		/**
		*????????????????????????
		*/
		__getset(0,__proto,'color',function(){
			return this._color.strColor;
			},function(value){
			this._color=Color.create(value);
		});

		/**
		*????????????????????????
		*/
		__getset(0,__proto,'italic',function(){
			return (this._type & 0x200)!==0;
			},function(value){
			value ? (this._type |=0x200):(this._type &=~0x200);
		});

		/**
		*????????????????????????
		*/
		__getset(0,__proto,'bold',function(){
			return (this._type & 0x800)!==0;
			},function(value){
			value ? (this._type |=0x800):(this._type &=~0x800);
		});

		/**
		*??????????????????
		*/
		__getset(0,__proto,'weight',function(){
			return ""+this._weight;
			},function(value){
			var weight=0;
			switch (value){
				case 'normal':
					break ;
				case 'bold':
					this.bold=true;
					weight=700;
					break ;
				case 'bolder':
					weight=800;
					break ;
				case 'lighter':
					weight=100;
					break ;
				default :
					weight=parseInt(value);
				}
			this._weight=weight;
			this._text=null;
		});

		/**
		*?????????????????????????????????
		*/
		__getset(0,__proto,'decoration',function(){
			return this._decoration ? this._decoration.value :"none";
			},function(value){
			var strs=value.split(' ');
			this._decoration || (this._decoration={});
			switch (strs[0]){
				case '_':
					this._decoration.type='underline'
					break ;
				case '-':
					this._decoration.type='line-through'
					break ;
				case 'overline':
					this._decoration.type='overline'
					break ;
				default :
					this._decoration.type=strs[0];
				}
			strs[1] && (this._decoration.color=Color.create(strs));
			this._decoration.value=value;
		});

		Font.__init__=function(){
			Font.EMPTY=new Font(null);
		}

		Font.EMPTY=null
		Font.defaultColor="#000000";
		Font.defaultSize=12;
		Font.defaultFamily="Arial";
		Font.defaultFont="12px Arial";
		Font._STROKE=[0,"#000000"];
		Font._ITALIC=0x200;
		Font._PASSWORD=0x400;
		Font._BOLD=0x800;
		return Font;
	})()


	/**
	*@private
	*/
	//class laya.display.css.TransformInfo
	var TransformInfo=(function(){
		function TransformInfo(){
			this.translateX=0;
			this.translateY=0;
			this.scaleX=1;
			this.scaleY=1;
			this.rotate=0;
			this.skewX=0;
			this.skewY=0;
		}

		__class(TransformInfo,'laya.display.css.TransformInfo');
		return TransformInfo;
	})()


	/**
	*<code>Graphics</code> ????????????????????????????????????
	*@see laya.display.Sprite#graphics
	*/
	//class laya.display.Graphics
	var Graphics=(function(){
		function Graphics(){
			//this._sp=null;
			this._one=null;
			this._cmds=null;
			//this._temp=null;
			//this._bounds=null;
			//this._rstBoundPoints=null;
			//this._vectorgraphArray=null;
			this._render=this._renderEmpty;
			this._render=this._renderEmpty;
			if (Render.isConchNode){
				/*__JS__ */this._nativeObj=new _conchGraphics();;
				/*__JS__ */this.id=this._nativeObj.conchID;;
			}
		}

		__class(Graphics,'laya.display.Graphics');
		var __proto=Graphics.prototype;
		/**
		*<p>??????????????????</p>
		*/
		__proto.destroy=function(){
			this.clear();
			this._temp=null;
			this._bounds=null;
			this._rstBoundPoints=null;
			this._sp && (this._sp._renderType=0);
			this._sp=null;
		}

		/**
		*<p>?????????????????????</p>
		*/
		__proto.clear=function(){
			this._one=null;
			this._render=this._renderEmpty;
			this._cmds=null;
			this._temp && (this._temp.length=0);
			this._sp && (this._sp._renderType &=~ /*laya.renders.RenderSprite.IMAGE*/0x01);
			this._sp && (this._sp._renderType &=~ /*laya.renders.RenderSprite.GRAPHICS*/0x100);
			this._repaint();
			if (this._vectorgraphArray){
				for (var i=0,n=this._vectorgraphArray.length;i < n;i++){
					VectorGraphManager.getInstance().deleteShape(this._vectorgraphArray[i]);
				}
				this._vectorgraphArray.length=0;
			}
		}

		/**
		*@private
		*??????????????????
		*/
		__proto._repaint=function(){
			this._temp && (this._temp.length=0);
			this._sp && this._sp.repaint();
		}

		/**@private */
		__proto._isOnlyOne=function(){
			return !this._cmds || this._cmds.length===0;
		}

		/**
		*?????????????????????????????????(????????????????????????)???
		*@return ???????????????????????? ?????? Rectangle ?????????
		*/
		__proto.getBounds=function(){
			if (!this._bounds || !this._temp || this._temp.length < 1){
				this._bounds=Rectangle._getWrapRec(this.getBoundPoints(),this._bounds)
			}
			return this._bounds;
		}

		/**
		*@private
		*?????????????????????
		*/
		__proto.getBoundPoints=function(){
			if (!this._temp || this._temp.length < 1)
				this._temp=this._getCmdPoints();
			return this._rstBoundPoints=Utils.copyArray(this._rstBoundPoints,this._temp);
		}

		__proto._addCmd=function(a){
			this._cmds=this._cmds || [];
			a.callee=a.shift();
			this._cmds.push(a);
		}

		__proto._getCmdPoints=function(){
			var context=Render._context;
			var cmds=this._cmds;
			var rst;
			rst=this._temp || (this._temp=[]);
			rst.length=0;
			if (!cmds && this._one !=null){
				Graphics._tempCmds.length=0;
				Graphics._tempCmds.push(this._one);
				cmds=Graphics._tempCmds;
			}
			if (!cmds)
				return rst;
			var matrixs;
			matrixs=Graphics._tempMatrixArrays;
			matrixs.length=0;
			var tMatrix=Graphics._initMatrix;
			tMatrix.identity();
			var tempMatrix=Graphics._tempMatrix;
			var cmd;
			for (var i=0,n=cmds.length;i < n;i++){
				cmd=cmds[i];
				switch (cmd.callee){
					case context.save:
					case 7:
						matrixs.push(tMatrix);
						tMatrix=tMatrix.clone();
						break ;
					case context.restore:
					case 8:
						tMatrix=matrixs.pop();
						break ;
					case context._scale:
					case 5:
						tempMatrix.identity();
						tempMatrix.translate(-cmd[2],-cmd[3]);
						tempMatrix.scale(cmd[0],cmd[1]);
						tempMatrix.translate(cmd[2],cmd[3]);
						this._switchMatrix(tMatrix,tempMatrix);
						break ;
					case context._rotate:
					case 3:
						tempMatrix.identity();
						tempMatrix.translate(-cmd[1],-cmd[2]);
						tempMatrix.rotate(cmd[0]);
						tempMatrix.translate(cmd[1],cmd[2]);
						this._switchMatrix(tMatrix,tempMatrix);
						break ;
					case context._translate:
					case 6:
						tempMatrix.identity();
						tempMatrix.translate(cmd[0],cmd[1]);
						this._switchMatrix(tMatrix,tempMatrix);
						break ;
					case context._transform:
					case 4:
						tempMatrix.identity();
						tempMatrix.translate(-cmd[1],-cmd[2]);
						tempMatrix.concat(cmd[0]);
						tempMatrix.translate(cmd[1],cmd[2]);
						this._switchMatrix(tMatrix,tempMatrix);
						break ;
					case 16:
					case 24:
						Graphics._addPointArrToRst(rst,Rectangle._getBoundPointS(cmd[0],cmd[1],cmd[2],cmd[3]),tMatrix);
						break ;
					case 17:
						tMatrix.copyTo(tempMatrix);
						tempMatrix.concat(cmd[4]);
						Graphics._addPointArrToRst(rst,Rectangle._getBoundPointS(cmd[0],cmd[1],cmd[2],cmd[3]),tempMatrix);
						break ;
					case context._drawTexture:
					case context._fillTexture:
						if (cmd[3] && cmd[4]){
							Graphics._addPointArrToRst(rst,Rectangle._getBoundPointS(cmd[1],cmd[2],cmd[3],cmd[4]),tMatrix);
							}else {
							var tex=cmd[0];
							Graphics._addPointArrToRst(rst,Rectangle._getBoundPointS(cmd[1],cmd[2],tex.width,tex.height),tMatrix);
						}
						break ;
					case context._drawTextureWithTransform:;
						var drawMatrix;
						if (cmd[5]){
							tMatrix.copyTo(tempMatrix);
							tempMatrix.concat(cmd[5]);
							drawMatrix=tempMatrix;
							}else{
							drawMatrix=tMatrix;
						}
						if (cmd[3] && cmd[4]){
							Graphics._addPointArrToRst(rst,Rectangle._getBoundPointS(cmd[1],cmd[2],cmd[3],cmd[4]),drawMatrix);
							}else {
							tex=cmd[0];
							Graphics._addPointArrToRst(rst,Rectangle._getBoundPointS(cmd[1],cmd[2],tex.width,tex.height),drawMatrix);
						}
						break ;
					case context._drawRect:
					case 13:
						Graphics._addPointArrToRst(rst,Rectangle._getBoundPointS(cmd[0],cmd[1],cmd[2],cmd[3]),tMatrix);
						break ;
					case context._drawCircle:
					case context._fillCircle:
					case 14:
						Graphics._addPointArrToRst(rst,Rectangle._getBoundPointS(cmd[0]-cmd[2],cmd[1]-cmd[2],cmd[2]+cmd[2],cmd[2]+cmd[2]),tMatrix);
						break ;
					case context._drawLine:
					case 20:
						Graphics._tempPoints.length=0;
						var lineWidth=NaN;
						lineWidth=cmd[5] *0.5;
						if (cmd[0]==cmd[2]){
							Graphics._tempPoints.push(cmd[0]+lineWidth,cmd[1],cmd[2]+lineWidth,cmd[3],cmd[0]-lineWidth,cmd[1],cmd[2]-lineWidth,cmd[3]);
							}else if (cmd[1]==cmd[3]){
							Graphics._tempPoints.push(cmd[0],cmd[1]+lineWidth,cmd[2],cmd[3]+lineWidth,cmd[0],cmd[1]-lineWidth,cmd[2],cmd[3]-lineWidth);
							}else {
							Graphics._tempPoints.push(cmd[0],cmd[1],cmd[2],cmd[3]);
						}
						Graphics._addPointArrToRst(rst,Graphics._tempPoints,tMatrix);
						break ;
					case context._drawCurves:
					case 22:
						Graphics._addPointArrToRst(rst,Bezier.I.getBezierPoints(cmd[2]),tMatrix,cmd[0],cmd[1]);
						break ;
					case context._drawPoly:
					case context._drawLines:
					case 18:
						Graphics._addPointArrToRst(rst,cmd[2],tMatrix,cmd[0],cmd[1]);
						break ;
					case context._drawPath:
					case 19:
						Graphics._addPointArrToRst(rst,this._getPathPoints(cmd[2]),tMatrix,cmd[0],cmd[1]);
						break ;
					case context._drawPie:
					case 15:
						Graphics._addPointArrToRst(rst,this._getPiePoints(cmd[0],cmd[1],cmd[2],cmd[3],cmd[4]),tMatrix);
						break ;
					}
			}
			if (rst.length > 200){
				rst=Utils.copyArray(rst,Rectangle._getWrapRec(rst)._getBoundPoints());
			}else if (rst.length > 8)
			rst=GrahamScan.scanPList(rst);
			return rst;
		}

		__proto._switchMatrix=function(tMatix,tempMatrix){
			tempMatrix.concat(tMatix);
			tempMatrix.copyTo(tMatix);
		}

		/**
		*???????????????
		*@param tex ?????????
		*@param x X ???????????????
		*@param y Y ???????????????
		*@param width ?????????
		*@param height ?????????
		*@param m ???????????????
		*/
		__proto.drawTexture=function(tex,x,y,width,height,m,alpha){
			(x===void 0)&& (x=0);
			(y===void 0)&& (y=0);
			(width===void 0)&& (width=0);
			(height===void 0)&& (height=0);
			(alpha===void 0)&& (alpha=1);
			if (!tex)return;
			if (!width)width=tex.sourceWidth;
			if (!height)height=tex.sourceHeight;
			width=width-tex.sourceWidth+tex.width;
			height=height-tex.sourceHeight+tex.height;
			if (tex.loaded && (width <=0 || height <=0))return;
			x+=tex.offsetX;
			y+=tex.offsetY;
			this._sp && (this._sp._renderType |=/*laya.renders.RenderSprite.GRAPHICS*/0x100);
			var args=[tex,x,y,width,height,m,alpha];
			args.callee=(m || alpha !=1)? Render._context._drawTextureWithTransform :Render._context._drawTexture;
			if (this._one==null && !m && alpha==1){
				this._one=args;
				this._render=this._renderOneImg;
				}else {
				this._saveToCmd(args.callee,args);
			}
			if (!tex.loaded){
				tex.once(/*laya.events.Event.LOADED*/"loaded",this,this._textureLoaded,[tex,args]);
			}
			this._repaint();
		}

		/**
		*@private ?????????????????????????????????
		*@param tex
		*/
		__proto.cleanByTexture=function(tex,x,y,width,height){
			(width===void 0)&& (width=0);
			(height===void 0)&& (height=0);
			if (!tex)return this.clear();
			if (this._one && this._render===this._renderOneImg){
				if (!width)width=tex.sourceWidth;
				if (!height)height=tex.sourceHeight;
				width=width-tex.sourceWidth+tex.width;
				height=height-tex.sourceHeight+tex.height;
				x+=tex.offsetX;
				y+=tex.offsetY;
				this._one[0]=tex;
				this._one[1]=x;
				this._one[2]=y;
				this._one[3]=width;
				this._one[4]=height;
				}else {
				this.clear();
				tex && this.drawTexture(tex,x,y,width,height);
			}
		}

		/**
		*???????????????????????????
		*@param tex ?????????
		*@param pos ????????????????????????
		*/
		__proto.drawTextures=function(tex,pos){
			if (!tex)return;
			this._saveToCmd(Render._context._drawTextures,[tex,pos]);
		}

		/**
		*???texture??????
		*@param tex ?????????
		*@param x X ???????????????
		*@param y Y ???????????????
		*@param width ?????????
		*@param height ?????????
		*@param type ???????????? repeat|repeat-x|repeat-y|no-repeat
		*@param offset ??????????????????
		*
		*/
		__proto.fillTexture=function(tex,x,y,width,height,type,offset){
			(width===void 0)&& (width=0);
			(height===void 0)&& (height=0);
			(type===void 0)&& (type="repeat");
			if (!tex)return;
			var args=[tex,x,y,width,height,type,offset||Point.EMPTY,{}];
			if (!tex.loaded){
				tex.once(/*laya.events.Event.LOADED*/"loaded",this,this._textureLoaded,[tex,args]);
			}
			this._saveToCmd(Render._context._fillTexture,args);
		}

		__proto._textureLoaded=function(tex,param){
			param[3]=param[3] || tex.width;
			param[4]=param[4] || tex.height;
			this._repaint();
		}

		/**
		*@private
		*?????????????????????
		*/
		__proto._saveToCmd=function(fun,args){
			this._sp && (this._sp._renderType |=/*laya.renders.RenderSprite.GRAPHICS*/0x100);
			if (this._one==null){
				this._one=args;
				this._render=this._renderOne;
				}else {
				this._sp && (this._sp._renderType &=~ /*laya.renders.RenderSprite.IMAGE*/0x01);
				this._render=this._renderAll;
				(this._cmds || (this._cmds=[])).length===0 && this._cmds.push(this._one);
				this._cmds.push(args);
			}
			args.callee=fun;
			this._temp && (this._temp.length=0);
			this._repaint();
			return args;
		}

		/**
		*????????????????????????????????????????????????????????????
		*@param x X ???????????????
		*@param y Y ???????????????
		*@param width ?????????
		*@param height ?????????
		*/
		__proto.clipRect=function(x,y,width,height){
			this._saveToCmd(Render._context._clipRect,[x,y,width,height]);
		}

		/**
		*???????????????????????????
		*@param text ??????????????????????????????
		*@param x ????????????????????? x ????????????????????????????????????
		*@param y ????????????????????? y ????????????????????????????????????
		*@param font ??????????????????????????????"20px Arial"???
		*@param color ???????????????????????????"#ff0000"???
		*@param textAlign ?????????????????????????????????"left"???"center"???"right"???
		*/
		__proto.fillText=function(text,x,y,font,color,textAlign){
			this._saveToCmd(Render._context._fillText,[text,x,y,font || Font.defaultFont,color,textAlign]);
		}

		/**
		*??????????????????????????????????????????????????????
		*@param text ??????????????????????????????
		*@param x ????????????????????? x ????????????????????????????????????
		*@param y ????????????????????? y ????????????????????????????????????
		*@param font ??????????????????????????????"20px Arial"???
		*@param fillColor ???????????????????????????"#ff0000"???
		*@param borderColor ???????????????????????????
		*@param lineWidth ?????????????????????
		*@param textAlign ?????????????????????????????????"left"???"center"???"right"???
		*/
		__proto.fillBorderText=function(text,x,y,font,fillColor,borderColor,lineWidth,textAlign){
			this._saveToCmd(Render._context._fillBorderText,[text,x,y,font || Font.defaultFont,fillColor,borderColor,lineWidth,textAlign]);
		}

		/**
		*??????????????????????????????????????????????????????????????????????????????
		*@param text ??????????????????????????????
		*@param x ????????????????????? x ????????????????????????????????????
		*@param y ????????????????????? y ????????????????????????????????????
		*@param font ??????????????????????????????"20px Arial"???
		*@param color ???????????????????????????"#ff0000"???
		*@param lineWidth ???????????????
		*@param textAlign ?????????????????????????????????"left"???"center"???"right"???
		*/
		__proto.strokeText=function(text,x,y,font,color,lineWidth,textAlign){
			this._saveToCmd(Render._context._strokeText,[text,x,y,font || Font.defaultFont,color,lineWidth,textAlign]);
		}

		/**
		*??????????????????
		*@param value ????????????
		*/
		__proto.alpha=function(value){
			this._saveToCmd(Render._context._alpha,[value]);
		}

		/**
		*????????????????????????????????????
		*@param mat ?????????
		*@param pivotX ??????????????????????????????
		*@param pivotY ??????????????????????????????
		*/
		__proto.transform=function(matrix,pivotX,pivotY){
			(pivotX===void 0)&& (pivotX=0);
			(pivotY===void 0)&& (pivotY=0);
			this._saveToCmd(Render._context._transform,[matrix,pivotX,pivotY]);
		}

		/**
		*?????????????????????(????????????transform???????????????)
		*@param angle ??????????????????????????????
		*@param pivotX ??????????????????????????????
		*@param pivotY ??????????????????????????????
		*/
		__proto.rotate=function(angle,pivotX,pivotY){
			(pivotX===void 0)&& (pivotX=0);
			(pivotY===void 0)&& (pivotY=0);
			this._saveToCmd(Render._context._rotate,[angle,pivotX,pivotY]);
		}

		/**
		*???????????????????????????????????????(????????????transform???????????????)
		*@param scaleX ????????????????????????
		*@param scaleY ????????????????????????
		*@param pivotX ??????????????????????????????
		*@param pivotY ??????????????????????????????
		*/
		__proto.scale=function(scaleX,scaleY,pivotX,pivotY){
			(pivotX===void 0)&& (pivotX=0);
			(pivotY===void 0)&& (pivotY=0);
			this._saveToCmd(Render._context._scale,[scaleX,scaleY,pivotX,pivotY]);
		}

		/**
		*???????????????????????? (0,0)?????????
		*@param x ????????????????????????x???????????????
		*@param y ????????????????????????y???????????????
		*/
		__proto.translate=function(x,y){
			this._saveToCmd(Render._context._translate,[x,y]);
		}

		/**
		*??????????????????????????????
		*/
		__proto.save=function(){
			this._saveToCmd(Render._context._save,[]);
		}

		/**
		*????????????????????????????????????????????????
		*/
		__proto.restore=function(){
			this._saveToCmd(Render._context._restore,[]);
		}

		/**
		*@private
		*?????????????????????
		*@param text ???????????????
		*@return ?????????????????????true???????????????flase???
		*/
		__proto.replaceText=function(text){
			this._repaint();
			var cmds=this._cmds;
			if (!cmds){
				if (this._one && this._isTextCmd(this._one.callee)){
					if (this._one[0].toUpperCase)this._one[0]=text;
					else this._one[0].setText(text);
					return true;
				}
				}else {
				for (var i=cmds.length-1;i >-1;i--){
					if (this._isTextCmd(cmds[i].callee)){
						if (cmds[i][0].toUpperCase)cmds[i][0]=text;
						else cmds[i][0].setText(text);
						return true;
					}
				}
			}
			return false;
		}

		/**@private */
		__proto._isTextCmd=function(fun){
			return fun===Render._context._fillText || fun===Render._context._fillBorderText || fun===Render._context._strokeText;
		}

		/**
		*@private
		*?????????????????????
		*@param color ?????????
		*/
		__proto.replaceTextColor=function(color){
			this._repaint();
			var cmds=this._cmds;
			if (!cmds){
				if (this._one && this._isTextCmd(this._one.callee)){
					this._one[4]=color;
					if (!this._one[0].toUpperCase)this._one[0].changed=true;
				}
				}else {
				for (var i=cmds.length-1;i >-1;i--){
					if (this._isTextCmd(cmds[i].callee)){
						cmds[i][4]=color;
						if (!cmds[i][0].toUpperCase)cmds[i][0].changed=true;
					}
				}
			}
		}

		/**
		*??????????????????????????????
		*@param url ???????????????
		*@param x ???????????????x?????????
		*@param y ???????????????y?????????
		*@param width ?????????????????????????????????0?????????????????????????????????
		*@param height ?????????????????????????????????0?????????????????????????????????
		*@param complete ?????????????????????
		*/
		__proto.loadImage=function(url,x,y,width,height,complete){
			var _$this=this;
			(x===void 0)&& (x=0);
			(y===void 0)&& (y=0);
			(width===void 0)&& (width=0);
			(height===void 0)&& (height=0);
			var tex=Loader.getRes(url);
			if (tex)onloaded(tex);
			else Laya.loader.load(url,Handler.create(null,onloaded),null,/*laya.net.Loader.IMAGE*/"image");
			function onloaded (tex){
				if (tex){
					_$this.drawTexture(tex,x,y,width,height);
					if (complete !=null)complete.call(_$this._sp,tex);
				}
			}
		}

		/**
		*@private
		*/
		__proto._renderEmpty=function(sprite,context,x,y){}
		/**
		*@private
		*/
		__proto._renderAll=function(sprite,context,x,y){
			var cmds=this._cmds,cmd;
			for (var i=0,n=cmds.length;i < n;i++){
				(cmd=cmds[i]).callee.call(context,x,y,cmd);
			}
		}

		/**
		*@private
		*/
		__proto._renderOne=function(sprite,context,x,y){
			this._one.callee.call(context,x,y,this._one);
		}

		/**
		*@private
		*/
		__proto._renderOneImg=function(sprite,context,x,y){
			this._one.callee.call(context,x,y,this._one);
			if (sprite._renderType!==2305){
				sprite._renderType |=/*laya.renders.RenderSprite.IMAGE*/0x01;
			}
		}

		/**
		*??????????????????
		*@param fromX X ??????????????????
		*@param fromY Y ??????????????????
		*@param toX X ??????????????????
		*@param toY Y ??????????????????
		*@param lineColor ?????????
		*@param lineWidth ???????????????
		*/
		__proto.drawLine=function(fromX,fromY,toX,toY,lineColor,lineWidth){
			(lineWidth===void 0)&& (lineWidth=1);
			var tId=0;
			if (Render.isWebGL){
				tId=VectorGraphManager.getInstance().getId();
				if (this._vectorgraphArray==null)this._vectorgraphArray=[];
				this._vectorgraphArray.push(tId);
			};
			var arr=[fromX+0.5,fromY+0.5,toX+0.5,toY+0.5,lineColor,lineWidth,tId];
			this._saveToCmd(Render._context._drawLine,arr);
		}

		/**
		*????????????????????????
		*@param x ??????????????? X ????????????
		*@param y ??????????????? Y ????????????
		*@param points ???????????????????????????:[x1,y1,x2,y2,x3,y3...]???
		*@param lineColor ???????????????????????????????????????????????????
		*@param lineWidth ???????????????
		*/
		__proto.drawLines=function(x,y,points,lineColor,lineWidth){
			(lineWidth===void 0)&& (lineWidth=1);
			var tId=0;
			if (Render.isWebGL){
				tId=VectorGraphManager.getInstance().getId();
				if (this._vectorgraphArray==null)this._vectorgraphArray=[];
				this._vectorgraphArray.push(tId);
			};
			var arr=[x+0.5,y+0.5,points,lineColor,lineWidth,tId];
			this._saveToCmd(Render._context._drawLines,arr);
		}

		/**
		*????????????????????????
		*@param x ??????????????? X ????????????
		*@param y ??????????????? Y ????????????
		*@param points ???????????????????????????[startx,starty,ctrx,ctry,startx,starty...]???
		*@param lineColor ???????????????????????????????????????????????????
		*@param lineWidth ???????????????
		*/
		__proto.drawCurves=function(x,y,points,lineColor,lineWidth){
			(lineWidth===void 0)&& (lineWidth=1);
			var arr=[x+0.5,y+0.5,points,lineColor,lineWidth];
			this._saveToCmd(Render._context._drawCurves,arr);
		}

		/**
		*???????????????
		*@param x ??????????????? X ????????????
		*@param y ??????????????? Y ????????????
		*@param width ???????????????
		*@param height ???????????????
		*@param fillColor ???????????????????????????????????????????????????
		*@param lineColor ???????????????????????????????????????????????????
		*@param lineWidth ???????????????
		*/
		__proto.drawRect=function(x,y,width,height,fillColor,lineColor,lineWidth){
			(lineWidth===void 0)&& (lineWidth=1);
			var offset=lineColor ? 0.5 :0;
			var arr=[x+offset,y+offset,width,height,fillColor,lineColor,lineWidth];
			this._saveToCmd(Render._context._drawRect,arr);
		}

		/**
		*???????????????
		*@param x ??????X ????????????
		*@param y ??????Y ????????????
		*@param radius ?????????
		*@param fillColor ???????????????????????????????????????????????????
		*@param lineColor ???????????????????????????????????????????????????
		*@param lineWidth ???????????????
		*/
		__proto.drawCircle=function(x,y,radius,fillColor,lineColor,lineWidth){
			(lineWidth===void 0)&& (lineWidth=1);
			var offset=lineColor ? 0.5 :0;
			var tId=0;
			if (Render.isWebGL){
				tId=VectorGraphManager.getInstance().getId();
				if (this._vectorgraphArray==null)this._vectorgraphArray=[];
				this._vectorgraphArray.push(tId);
			};
			var arr=[x+offset,y+offset,radius,fillColor,lineColor,lineWidth,tId];
			this._saveToCmd(Render._context._drawCircle,arr);
		}

		/**
		*???????????????
		*@param x ??????????????? X ????????????
		*@param y ??????????????? Y ????????????
		*@param radius ???????????????
		*@param startAngle ???????????????
		*@param endAngle ???????????????
		*@param fillColor ???????????????????????????????????????????????????
		*@param lineColor ???????????????????????????????????????????????????
		*@param lineWidth ???????????????
		*/
		__proto.drawPie=function(x,y,radius,startAngle,endAngle,fillColor,lineColor,lineWidth){
			(lineWidth===void 0)&& (lineWidth=1);
			var offset=lineColor ? 0.5 :0;
			var tId=0;
			if (Render.isWebGL){
				tId=VectorGraphManager.getInstance().getId();
				if (this._vectorgraphArray==null)this._vectorgraphArray=[];
				this._vectorgraphArray.push(tId);
			};
			var arr=[x+offset,y+offset,radius,startAngle,endAngle,fillColor,lineColor,lineWidth,tId];
			arr[3]=Utils.toRadian(startAngle);
			arr[4]=Utils.toRadian(endAngle);
			this._saveToCmd(Render._context._drawPie,arr);
		}

		__proto._getPiePoints=function(x,y,radius,startAngle,endAngle){
			var rst=Graphics._tempPoints;
			Graphics._tempPoints.length=0;
			rst.push(x,y);
			var dP=Math.PI / 10;
			var i=NaN;
			for (i=startAngle;i < endAngle;i+=dP){
				rst.push(x+radius *Math.cos(i),y+radius *Math.sin(i));
			}
			if (endAngle !=i){
				rst.push(x+radius *Math.cos(endAngle),y+radius *Math.sin(endAngle));
			}
			return rst;
		}

		/**
		*??????????????????
		*@param x ??????????????? X ????????????
		*@param y ??????????????? Y ????????????
		*@param points ????????????????????????
		*@param fillColor ???????????????????????????????????????????????????
		*@param lineColor ???????????????????????????????????????????????????
		*@param lineWidth ???????????????
		*/
		__proto.drawPoly=function(x,y,points,fillColor,lineColor,lineWidth){
			(lineWidth===void 0)&& (lineWidth=1);
			var offset=lineColor ? 0.5 :0;
			var tId=0;
			if (Render.isWebGL){
				tId=VectorGraphManager.getInstance().getId();
				if (this._vectorgraphArray==null)this._vectorgraphArray=[];
				this._vectorgraphArray.push(tId);
				var tIsConvexPolygon=false;
				if (points.length > 6){
					tIsConvexPolygon=false;
					}else {
					tIsConvexPolygon=true;
				}
			};
			var arr=[x+offset,y+offset,points,fillColor,lineColor,lineWidth,tId,tIsConvexPolygon];
			this._saveToCmd(Render._context._drawPoly,arr);
		}

		__proto._getPathPoints=function(paths){
			var i=0,len=0;
			var rst=Graphics._tempPoints;
			rst.length=0;
			len=paths.length;
			var tCMD;
			for (i=0;i < len;i++){
				tCMD=paths[i];
				if (tCMD.length > 1){
					rst.push(tCMD[1],tCMD[2]);
					if (tCMD.length > 3){
						rst.push(tCMD[3],tCMD[4]);
					}
				}
			}
			return rst;
		}

		/**
		*???????????????
		*@param x ??????????????? X ????????????
		*@param y ??????????????? Y ????????????
		*@param paths ??????????????????????????????????????????[["moveTo",x,y],["lineTo",x,y,x,y,x,y],["arcTo",x1,y1,x2,y2,r],["closePath"]]???
		*@param brush ?????????????????????????????????{fillStyle}???
		*@param pen ?????????????????????????????????{strokeStyle,lineWidth,lineJoin,lineCap,miterLimit}???
		*/
		__proto.drawPath=function(x,y,paths,brush,pen){
			var arr=[x+0.5,y+0.5,paths,brush,pen];
			this._saveToCmd(Render._context._drawPath,arr);
		}

		/**@private */
		/**
		*@private
		*????????????
		*/
		__getset(0,__proto,'cmds',function(){
			return this._cmds;
			},function(value){
			this._sp && (this._sp._renderType |=/*laya.renders.RenderSprite.GRAPHICS*/0x100);
			this._cmds=value;
			this._render=this._renderAll;
			this._repaint();
		});

		Graphics.__init__=function(){
			if (Render.isConchNode){
				var from=laya.display.Graphics.prototype;
				var to=/*__JS__ */ConchGraphics.prototype;
				var list=["clear","destroy","alpha","rotate","transform","scale","translate","save","restore","clipRect","blendMode","fillText","fillBorderText","_fands","drawRect","drawCircle","drawPie","drawPoly","drawPath","drawImageM","drawLine","drawLines","_drawPs","drawCurves","replaceText","replaceTextColor","_fillImage","fillTexture","setSkinMesh","drawParticle","drawImageS"];
				for (var i=0,len=list.length;i <=len;i++){
					var temp=list[i];
					from[temp]=to[temp];
				}
				from._saveToCmd=null;
				if (to.drawImageS){
					from.drawTextures=function (tex,pos){
						if (!tex)return;
						if (!(tex.loaded && tex.bitmap && tex.source)){
							return;
						};
						var uv=tex.uv,w=tex.bitmap.width,h=tex.bitmap.height;
						this.drawImageS(tex.bitmap.source,uv[0] *w,uv[1] *h,(uv[2]-uv[0])*w,(uv[5]-uv[3])*h,tex.offsetX,tex.offsetY,tex.width,tex.height,pos);
					}
				}
				from.drawTexture=function (tex,x,y,width,height,m){
					(x===void 0)&& (x=0);
					(y===void 0)&& (y=0);
					(width===void 0)&& (width=0);
					(height===void 0)&& (height=0);
					if (!tex)return;
					if (!(tex.loaded && tex.bitmap && tex.source)){
						return;
					}
					if (!width)width=tex.sourceWidth;
					if (!height)height=tex.sourceHeight;
					width=width-tex.sourceWidth+tex.width;
					height=height-tex.sourceHeight+tex.height;
					if (width <=0 || height <=0)return;
					x+=tex.offsetX;
					y+=tex.offsetY;
					var uv=tex.uv,w=tex.bitmap.width,h=tex.bitmap.height;
					this.drawImageM(tex.bitmap.source,uv[0] *w,uv[1] *h,(uv[2]-uv[0])*w,(uv[5]-uv[3])*h,x,y,width,height,m);
				}
				from.fillTexture=function (tex,x,y,width,height,type,offset){
					(width===void 0)&& (width=0);
					(height===void 0)&& (height=0);
					(type===void 0)&& (type="repeat");
					if (!tex)return;
					if (tex.loaded){
						var ctxi=Render._context.ctx;
						var w=tex.bitmap.width,h=tex.bitmap.height,uv=tex.uv;
						var pat;
						if (tex.uv !=Texture.DEF_UV){
							pat=ctxi.createPattern(tex.bitmap.source,type,uv[0] *w,uv[1] *h,(uv[2]-uv[0])*w,(uv[5]-uv[3])*h);
							}else {
							pat=ctxi.createPattern(tex.bitmap.source,type);
						};
						var sX=0,sY=0;
						if (offset){
							x+=offset.x % tex.width;
							y+=offset.y % tex.height;
							sX-=offset.x % tex.width;
							sY-=offset.y % tex.height;
						}
						this._fillImage(pat,x,y,sX,sY,width,height);
					}
				}
			}
		}

		Graphics._addPointArrToRst=function(rst,points,matrix,dx,dy){
			(dx===void 0)&& (dx=0);
			(dy===void 0)&& (dy=0);
			var i=0,len=0;
			len=points.length;
			for (i=0;i < len;i+=2){
				Graphics._addPointToRst(rst,points[i]+dx,points[i+1]+dy,matrix);
			}
		}

		Graphics._addPointToRst=function(rst,x,y,matrix){
			var _tempPoint=Point.TEMP;
			_tempPoint.setTo(x ? x :0,y ? y :0);
			matrix.transformPoint(_tempPoint);
			rst.push(_tempPoint.x,_tempPoint.y);
		}

		Graphics._tempPoints=[];
		Graphics._tempMatrixArrays=[];
		Graphics._tempCmds=[];
		__static(Graphics,
		['_tempMatrix',function(){return this._tempMatrix=new Matrix();},'_initMatrix',function(){return this._initMatrix=new Matrix();}
		]);
		return Graphics;
	})()


	/**
	*<code>Event</code> ???????????????????????????
	*/
	//class laya.events.Event
	var Event=(function(){
		function Event(){
			//this.type=null;
			//this.nativeEvent=null;
			//this.target=null;
			//this.currentTarget=null;
			//this._stoped=false;
			//this.touchId=0;
			//this.keyCode=0;
		}

		__class(Event,'laya.events.Event');
		var __proto=Event.prototype;
		/**
		*?????????????????????
		*@param type ???????????????
		*@param currentTarget ???????????????????????????
		*@param target ???????????????????????????
		*@return ???????????? Event ?????????
		*/
		__proto.setTo=function(type,currentTarget,target){
			this.type=type;
			this.currentTarget=currentTarget;
			this.target=target;
			return this;
		}

		/**
		*??????????????????????????????????????????????????????????????????????????????????????????
		*/
		__proto.stopPropagation=function(){
			this._stoped=true;
		}

		/**????????? Stage ?????? Y ?????????*/
		__getset(0,__proto,'stageY',function(){
			return Laya.stage.mouseY;
		});

		/**
		*????????????????????????????????????????????????????????????????????????????????????
		*/
		__getset(0,__proto,'charCode',function(){
			return this.nativeEvent.charCode;
		});

		/**
		*??????????????????
		*/
		__getset(0,__proto,'touches',function(){
			var arr=this.nativeEvent.touches;
			if (arr){
				var stage=Laya.stage;
				for (var i=0,n=arr.length;i < n;i++){
					var e=arr[i];
					var point=Point.TEMP;
					point.setTo(e.clientX,e.clientY);
					stage._canvasTransform.invertTransformPoint(point);
					stage.transform.invertTransformPoint(point);
					e.stageX=point.x;
					e.stageY=point.y;
				}
			}
			return arr;
		});

		/**
		*?????????????????????????????????????????????????????????????????????????????????????????????<br>
		*??????????????????????????????????????????????????? Shift ????????? Shift ????????? Shift ???????????? KeyLocation.LEFT?????? Shift ???????????? KeyLocation.RIGHT??????????????????????????????????????? (KeyLocation.STANDARD)??????????????? (KeyLocation.NUM_PAD)????????????????????????
		*/
		__getset(0,__proto,'keyLocation',function(){
			return this.nativeEvent.keyLocation;
		});

		/**
		*?????? Ctrl ???????????????????????? (true)????????????????????? (false)???
		*/
		__getset(0,__proto,'ctrlKey',function(){
			return this.nativeEvent.ctrlKey;
		});

		/**
		*?????? Alt ???????????????????????? (true)????????????????????? (false)???
		*/
		__getset(0,__proto,'altKey',function(){
			return this.nativeEvent.altKey;
		});

		/**
		*?????? Shift ???????????????????????? (true)????????????????????? (false)???
		*/
		__getset(0,__proto,'shiftKey',function(){
			return this.nativeEvent.shiftKey;
		});

		/**????????? Stage ?????? X ?????????*/
		__getset(0,__proto,'stageX',function(){
			return Laya.stage.mouseX;
		});

		Event.EMPTY=new Event();
		Event.MOUSE_DOWN="mousedown";
		Event.MOUSE_UP="mouseup";
		Event.CLICK="click";
		Event.RIGHT_MOUSE_DOWN="rightmousedown";
		Event.RIGHT_MOUSE_UP="rightmouseup";
		Event.RIGHT_CLICK="rightclick";
		Event.MOUSE_MOVE="mousemove";
		Event.MOUSE_OVER="mouseover";
		Event.MOUSE_OUT="mouseout";
		Event.MOUSE_WHEEL="mousewheel";
		Event.ROLL_OVER="mouseover";
		Event.ROLL_OUT="mouseout";
		Event.DOUBLE_CLICK="doubleclick";
		Event.CHANGE="change";
		Event.CHANGED="changed";
		Event.RESIZE="resize";
		Event.ADDED="added";
		Event.REMOVED="removed";
		Event.DISPLAY="display";
		Event.UNDISPLAY="undisplay";
		Event.ERROR="error";
		Event.COMPLETE="complete";
		Event.LOADED="loaded";
		Event.PROGRESS="progress";
		Event.INPUT="input";
		Event.RENDER="render";
		Event.OPEN="open";
		Event.MESSAGE="message";
		Event.CLOSE="close";
		Event.KEY_DOWN="keydown";
		Event.KEY_PRESS="keypress";
		Event.KEY_UP="keyup";
		Event.FRAME="enterframe";
		Event.DRAG_START="dragstart";
		Event.DRAG_MOVE="dragmove";
		Event.DRAG_END="dragend";
		Event.ENTER="enter";
		Event.SELECT="select";
		Event.BLUR="blur";
		Event.FOCUS="focus";
		Event.PLAYED="played";
		Event.PAUSED="paused";
		Event.STOPPED="stopped";
		Event.START="start";
		Event.END="end";
		Event.ENABLED_CHANGED="enabledchanged";
		Event.COMPONENT_ADDED="componentadded";
		Event.COMPONENT_REMOVED="componentremoved";
		Event.ACTIVE_CHANGED="activechanged";
		Event.LAYER_CHANGED="layerchanged";
		Event.HIERARCHY_LOADED="hierarchyloaded";
		Event.RECOVERING="recovering";
		Event.RECOVERED="recovered";
		Event.RELEASED="released";
		Event.LINK="link";
		Event.LABEL="label";
		Event.FULL_SCREEN_CHANGE="fullscreenchange";
		Event.DEVICE_LOST="devicelost";
		Event.MESH_CHANGED="meshchanged";
		Event.MATERIAL_CHANGED="materialchanged";
		Event.RENDERQUEUE_CHANGED="renderqueuechanged";
		Event.WORLDMATRIX_NEEDCHANGE="worldmatrixneedchanged";
		Event.ANIMATION_CHANGED="animationchanged";
		return Event;
	})()


	/**
	*<code>Keyboard</code> ?????????????????????????????????????????????????????????????????????????????????
	*/
	//class laya.events.Keyboard
	var Keyboard=(function(){
		function Keyboard(){};
		__class(Keyboard,'laya.events.Keyboard');
		Keyboard.NUMBER_0=48;
		Keyboard.NUMBER_1=49;
		Keyboard.NUMBER_2=50;
		Keyboard.NUMBER_3=51;
		Keyboard.NUMBER_4=52;
		Keyboard.NUMBER_5=53;
		Keyboard.NUMBER_6=54;
		Keyboard.NUMBER_7=55;
		Keyboard.NUMBER_8=56;
		Keyboard.NUMBER_9=57;
		Keyboard.A=65;
		Keyboard.B=66;
		Keyboard.C=67;
		Keyboard.D=68;
		Keyboard.E=69;
		Keyboard.F=70;
		Keyboard.G=71;
		Keyboard.H=72;
		Keyboard.I=73;
		Keyboard.J=74;
		Keyboard.K=75;
		Keyboard.L=76;
		Keyboard.M=77;
		Keyboard.N=78;
		Keyboard.O=79;
		Keyboard.P=80;
		Keyboard.Q=81;
		Keyboard.R=82;
		Keyboard.S=83;
		Keyboard.T=84;
		Keyboard.U=85;
		Keyboard.V=86;
		Keyboard.W=87;
		Keyboard.X=88;
		Keyboard.Y=89;
		Keyboard.Z=90;
		Keyboard.F1=112;
		Keyboard.F2=113;
		Keyboard.F3=114;
		Keyboard.F4=115;
		Keyboard.F5=116;
		Keyboard.F6=117;
		Keyboard.F7=118;
		Keyboard.F8=119;
		Keyboard.F9=120;
		Keyboard.F10=121;
		Keyboard.F11=122;
		Keyboard.F12=123;
		Keyboard.F13=124;
		Keyboard.F14=125;
		Keyboard.F15=126;
		Keyboard.NUMPAD=21;
		Keyboard.NUMPAD_0=96;
		Keyboard.NUMPAD_1=97;
		Keyboard.NUMPAD_2=98;
		Keyboard.NUMPAD_3=99;
		Keyboard.NUMPAD_4=100;
		Keyboard.NUMPAD_5=101;
		Keyboard.NUMPAD_6=102;
		Keyboard.NUMPAD_7=103;
		Keyboard.NUMPAD_8=104;
		Keyboard.NUMPAD_9=105;
		Keyboard.NUMPAD_ADD=107;
		Keyboard.NUMPAD_DECIMAL=110;
		Keyboard.NUMPAD_DIVIDE=111;
		Keyboard.NUMPAD_ENTER=108;
		Keyboard.NUMPAD_MULTIPLY=106;
		Keyboard.NUMPAD_SUBTRACT=109;
		Keyboard.SEMICOLON=186;
		Keyboard.EQUAL=187;
		Keyboard.COMMA=188;
		Keyboard.MINUS=189;
		Keyboard.PERIOD=190;
		Keyboard.SLASH=191;
		Keyboard.BACKQUOTE=192;
		Keyboard.LEFTBRACKET=219;
		Keyboard.BACKSLASH=220;
		Keyboard.RIGHTBRACKET=221;
		Keyboard.QUOTE=222;
		Keyboard.ALTERNATE=18;
		Keyboard.BACKSPACE=8;
		Keyboard.CAPS_LOCK=20;
		Keyboard.COMMAND=15;
		Keyboard.CONTROL=17;
		Keyboard.DELETE=46;
		Keyboard.ENTER=13;
		Keyboard.ESCAPE=27;
		Keyboard.PAGE_UP=33;
		Keyboard.PAGE_DOWN=34;
		Keyboard.END=35;
		Keyboard.HOME=36;
		Keyboard.LEFT=37;
		Keyboard.UP=38;
		Keyboard.RIGHT=39;
		Keyboard.DOWN=40;
		Keyboard.SHIFT=16;
		Keyboard.SPACE=32;
		Keyboard.TAB=9;
		Keyboard.INSERT=45;
		return Keyboard;
	})()


	/**
	*<p><code>KeyBoardManager</code> ???????????????????????????</p>
	*<p>???????????????????????????????????????????????????????????????
	*?????????????????? Stage.focus ??????????????? Stage ????????????????????????????????? Stage.focus ??????????????????????????????????????????
	*????????? Laya.stage ???????????????????????????????????????????????????????????????????????????????????????Stage.focus???????????????????????????????????????</p>
	*<p>???????????????????????? Laya.stage.focus=someNode ??????????????????focus?????????</p>
	*<p>??????????????????????????????????????? e.keyCode ?????????????????????????????????????????????????????????????????????</p>
	*/
	//class laya.events.KeyBoardManager
	var KeyBoardManager=(function(){
		function KeyBoardManager(){};
		__class(KeyBoardManager,'laya.events.KeyBoardManager');
		KeyBoardManager.__init__=function(){
			KeyBoardManager._addEvent("keydown");
			KeyBoardManager._addEvent("keypress");
			KeyBoardManager._addEvent("keyup");
		}

		KeyBoardManager._addEvent=function(type){
			Browser.document.addEventListener(type,function(e){
				laya.events.KeyBoardManager._dispatch(e,type);
			},true);
		}

		KeyBoardManager._dispatch=function(e,type){
			if (!KeyBoardManager.enabled)return;
			KeyBoardManager._event._stoped=false;
			KeyBoardManager._event.nativeEvent=e;
			KeyBoardManager._event.keyCode=e.keyCode || e.which || e.charCode;
			if (type==="keydown")KeyBoardManager._pressKeys[KeyBoardManager._event.keyCode]=true;
			else if (type==="keyup")KeyBoardManager._pressKeys[KeyBoardManager._event.keyCode]=null;
			var target=(Laya.stage.focus && (Laya.stage.focus.event !=null))? Laya.stage.focus :Laya.stage;
			var ct=target;
			while (ct){
				ct.event(type,KeyBoardManager._event.setTo(type,ct,target));
				ct=ct.parent;
			}
		}

		KeyBoardManager.hasKeyDown=function(key){
			return KeyBoardManager._pressKeys[key];
		}

		KeyBoardManager._pressKeys={};
		KeyBoardManager.enabled=true;
		__static(KeyBoardManager,
		['_event',function(){return this._event=new Event();}
		]);
		return KeyBoardManager;
	})()


	/**
	*<p><code>KeyLocation</code> ?????????????????????????????????????????????????????????????????????????????????</p>
	*<p><code>KeyLocation</code> ????????????????????????????????? <code>keyLocation </code>????????????</p>
	*/
	//class laya.events.KeyLocation
	var KeyLocation=(function(){
		function KeyLocation(){};
		__class(KeyLocation,'laya.events.KeyLocation');
		KeyLocation.STANDARD=0;
		KeyLocation.LEFT=1;
		KeyLocation.RIGHT=2;
		KeyLocation.NUM_PAD=3;
		return KeyLocation;
	})()


	/**
	*<code>MouseManager</code> ????????????????????????????????????
	*/
	//class laya.events.MouseManager
	var MouseManager=(function(){
		function MouseManager(){
			this.mouseX=0;
			this.mouseY=0;
			this.disableMouseEvent=false;
			this.mouseDownTime=0;
			this.mouseMoveAccuracy=2;
			this._stage=null;
			this._target=null;
			this._lastOvers=[];
			this._currOvers=[];
			this._lastClickTimer=0;
			this._lastMoveTimer=0;
			this._isDoubleClick=false;
			this._isLeftMouse=false;
			this._eventList=[];
			this._touchIDs={};
			this._id=1;
			this._event=new Event();
			this._matrix=new Matrix();
			this._point=new Point();
			this._rect=new Rectangle();
			this._prePoint=new Point();
		}

		__class(MouseManager,'laya.events.MouseManager');
		var __proto=MouseManager.prototype;
		/**
		*@private
		*????????????
		*/
		__proto.__init__=function(stage,canvas){
			var _$this=this;
			this._stage=stage;
			var _this=this;
			var list=this._eventList;
			canvas.oncontextmenu=function (e){
				if (MouseManager.enabled)return false;
			}
			canvas.addEventListener('mousedown',function(e){
				if (MouseManager.enabled){
					e.preventDefault();
					list.push(e);
					_this.mouseDownTime=Browser.now();
				}
			});
			canvas.addEventListener('mouseup',function(e){
				if (MouseManager.enabled){
					e.preventDefault();
					list.push(e);
					_this.mouseDownTime=-Browser.now();
				}
			},true);
			canvas.addEventListener('mousemove',function(e){
				if (MouseManager.enabled){
					e.preventDefault();
					var now=Browser.now();
					if (now-_this._lastMoveTimer < 10)return;
					_this._lastMoveTimer=now;
					list.push(e);
				}
			},true);
			canvas.addEventListener("mouseout",function(e){
				if (MouseManager.enabled)list.push(e);
			})
			canvas.addEventListener("mouseover",function(e){
				if (MouseManager.enabled)list.push(e);
			})
			canvas.addEventListener("touchstart",function(e){
				if (MouseManager.enabled){
					list.push(e);
					_$this.runEvent();
					if (!Input.isInputting)e.preventDefault();
					_this.mouseDownTime=Browser.now();
				}
			});
			canvas.addEventListener("touchend",function(e){
				if (MouseManager.enabled){
					if (!Input.isInputting)e.preventDefault();
					list.push(e);
					_this.mouseDownTime=-Browser.now();
				}
			},true);
			canvas.addEventListener("touchmove",function(e){
				if (MouseManager.enabled){
					e.preventDefault();
					list.push(e);
				}
			},true);
			canvas.addEventListener('mousewheel',function(e){
				if (MouseManager.enabled)list.push(e);
			});
			canvas.addEventListener('DOMMouseScroll',function(e){
				if (MouseManager.enabled)list.push(e);
			});
		}

		__proto.initEvent=function(e,nativeEvent){
			var _this=this;
			_this._event._stoped=false;
			_this._event.nativeEvent=nativeEvent || e;
			_this._target=null;
			this._point.setTo(e.clientX,e.clientY);
			this._stage._canvasTransform.invertTransformPoint(this._point);
			_this.mouseX=this._point.x;
			_this.mouseY=this._point.y;
			_this._event.touchId=e.identifier || 0;
		}

		__proto.checkMouseWheel=function(e){
			this._event.delta=e.wheelDelta ? e.wheelDelta *0.025 :-e.detail;
			for (var i=0,n=this._lastOvers.length;i < n;i++){
				var ele=this._lastOvers[i];
				ele.event(/*laya.events.Event.MOUSE_WHEEL*/"mousewheel",this._event.setTo(/*laya.events.Event.MOUSE_WHEEL*/"mousewheel",ele,this._target));
			}
			this._stage.event(/*laya.events.Event.MOUSE_WHEEL*/"mousewheel",this._event.setTo(/*laya.events.Event.MOUSE_WHEEL*/"mousewheel",this._stage,this._target));
		}

		__proto.checkMouseOut=function(){
			if (this.disableMouseEvent)return;
			for (var i=0,n=this._lastOvers.length;i < n;i++){
				var ele=this._lastOvers[i];
				if (!ele.destroyed && this._currOvers.indexOf(ele)< 0){
					ele._set$P("$_MOUSEOVER",false);
					ele.event(/*laya.events.Event.MOUSE_OUT*/"mouseout",this._event.setTo(/*laya.events.Event.MOUSE_OUT*/"mouseout",ele,this._target));
				}
			};
			var temp=this._lastOvers;
			this._lastOvers=this._currOvers;
			this._currOvers=temp;
			this._currOvers.length=0;
		}

		__proto.onMouseMove=function(ele){
			this.sendMouseMove(ele);
			this._event._stoped=false;
			this.sendMouseOver(this._target);
		}

		__proto.sendMouseMove=function(ele){
			ele.event(/*laya.events.Event.MOUSE_MOVE*/"mousemove",this._event.setTo(/*laya.events.Event.MOUSE_MOVE*/"mousemove",ele,this._target));
			!this._event._stoped && ele.parent && this.sendMouseMove(ele.parent);
		}

		__proto.sendMouseOver=function(ele){
			if (ele.parent || ele===this._stage){
				if (!ele._get$P("$_MOUSEOVER")){
					ele._set$P("$_MOUSEOVER",true);
					ele.event(/*laya.events.Event.MOUSE_OVER*/"mouseover",this._event.setTo(/*laya.events.Event.MOUSE_OVER*/"mouseover",ele,this._target));
				}
				this._currOvers.push(ele);
			}
			!this._event._stoped && ele.parent && this.sendMouseOver(ele.parent);
		}

		__proto.onMouseDown=function(ele){
			if (Input.isInputting && Laya.stage.focus && Laya.stage.focus["focus"] && !Laya.stage.focus.contains(this._target)){
				Laya.stage.focus["focus"]=false;
			}
			this._onMouseDown(ele);
		}

		__proto._onMouseDown=function(ele){
			if (this._isLeftMouse){
				ele._set$P("$_MOUSEDOWN",this._touchIDs[this._event.touchId]);
				ele.event(/*laya.events.Event.MOUSE_DOWN*/"mousedown",this._event.setTo(/*laya.events.Event.MOUSE_DOWN*/"mousedown",ele,this._target));
				}else {
				ele._set$P("$_RIGHTMOUSEDOWN",this._touchIDs[this._event.touchId]);
				ele.event(/*laya.events.Event.RIGHT_MOUSE_DOWN*/"rightmousedown",this._event.setTo(/*laya.events.Event.RIGHT_MOUSE_DOWN*/"rightmousedown",ele,this._target));
			}
			!this._event._stoped && ele.parent && this.onMouseDown(ele.parent);
		}

		__proto.onMouseUp=function(ele){
			var type=this._isLeftMouse ? /*laya.events.Event.MOUSE_UP*/"mouseup" :/*laya.events.Event.RIGHT_MOUSE_UP*/"rightmouseup";
			this.sendMouseUp(ele,type);
			this._event._stoped=false;
			this.sendClick(this._target,type);
		}

		__proto.sendMouseUp=function(ele,type){
			ele.event(type,this._event.setTo(type,ele,this._target));
			!this._event._stoped && ele.parent && this.sendMouseUp(ele.parent,type);
		}

		__proto.sendClick=function(ele,type){
			if (ele.destroyed)return;
			if (type===/*laya.events.Event.MOUSE_UP*/"mouseup" && ele._get$P("$_MOUSEDOWN")===this._touchIDs[this._event.touchId]){
				ele._set$P("$_MOUSEDOWN",-1);
				ele.event(/*laya.events.Event.CLICK*/"click",this._event.setTo(/*laya.events.Event.CLICK*/"click",ele,this._target));
				this._isDoubleClick && ele.event(/*laya.events.Event.DOUBLE_CLICK*/"doubleclick",this._event.setTo(/*laya.events.Event.DOUBLE_CLICK*/"doubleclick",ele,this._target));
				}else if (type===/*laya.events.Event.RIGHT_MOUSE_UP*/"rightmouseup" && ele._get$P("$_RIGHTMOUSEDOWN")===this._touchIDs[this._event.touchId]){
				ele._set$P("$_RIGHTMOUSEDOWN",-1);
				ele.event(/*laya.events.Event.RIGHT_CLICK*/"rightclick",this._event.setTo(/*laya.events.Event.RIGHT_CLICK*/"rightclick",ele,this._target));
			}
			!this._event._stoped && ele.parent && this.sendClick(ele.parent,type);
		}

		__proto.check=function(sp,mouseX,mouseY,callBack){
			var transform=sp.transform || this._matrix;
			var pivotX=sp.pivotX;
			var pivotY=sp.pivotY;
			if (pivotX===0 && pivotY===0){
				transform.setTranslate(sp.x,sp.y);
				}else {
				if (transform===this._matrix){
					transform.setTranslate(sp.x-pivotX,sp.y-pivotY);
					}else {
					var cos=transform.cos;
					var sin=transform.sin;
					transform.setTranslate(sp.x-(pivotX *cos-pivotY *sin)*sp.scaleX,sp.y-(pivotX *sin+pivotY *cos)*sp.scaleY);
				}
			}
			transform.invertTransformPoint(this._point.setTo(mouseX,mouseY));
			transform.setTranslate(0,0);
			mouseX=this._point.x;
			mouseY=this._point.y;
			var scrollRect=sp.scrollRect;
			if (scrollRect){
				this._rect.setTo(0,0,scrollRect.width,scrollRect.height);
				var isHit=this._rect.contains(mouseX,mouseY);
				if (!isHit)return false;
			}
			if (!this.disableMouseEvent){
				var flag=false;
				if (sp.hitTestPrior && !sp.mouseThrough && !this.hitTest(sp,mouseX,mouseY)){
					return false;
				}
				for (var i=sp._childs.length-1;i >-1;i--){
					var child=sp._childs[i];
					if (!child.destroyed && child.mouseEnabled && child.visible){
						flag=this.check(child,mouseX+(scrollRect ? scrollRect.x :0),mouseY+(scrollRect ? scrollRect.y :0),callBack);
						if (flag)return true;
					}
				}
			}
			isHit=this.hitTest(sp,mouseX,mouseY);
			if (isHit){
				this._target=sp;
				callBack.call(this,sp);
				}else if (callBack===this.onMouseUp && sp===this._stage){
				this._target=this._stage;
				callBack.call(this,this._target);
			}
			return isHit;
		}

		__proto.hitTest=function(sp,mouseX,mouseY){
			var isHit=false;
			if ((sp.hitArea instanceof laya.utils.HitArea )){
				return sp.hitArea.isHit(mouseX,mouseY);
			}
			if (sp.width > 0 && sp.height > 0 || sp.mouseThrough || sp.hitArea){
				var hitRect=this._rect;
				if (!sp.mouseThrough){
					if (sp.hitArea)hitRect=sp.hitArea;
					else hitRect.setTo(0,0,sp.width,sp.height);
					isHit=hitRect.contains(mouseX,mouseY);
					}else {
					isHit=sp.getGraphicBounds().contains(mouseX,mouseY);
				}
			}
			return isHit;
		}

		/**
		*?????????????????????
		*/
		__proto.runEvent=function(){
			var len=this._eventList.length;
			if (!len)return;
			var _this=this;
			var i=0;
			while (i < len){
				var evt=this._eventList[i];
				if (evt.type!=='mousemove')this._prePoint.x=this._prePoint.y=-1000000;
				switch (evt.type){
					case 'mousedown':
						this._touchIDs[0]=this._id++;
						if (!MouseManager._isTouchRespond){
							_this._isLeftMouse=evt.button===0;
							_this.initEvent(evt);
							_this.check(_this._stage,_this.mouseX,_this.mouseY,_this.onMouseDown);
						}else
						MouseManager._isTouchRespond=false;
						break ;
					case 'mouseup':
						_this._isLeftMouse=evt.button===0;
						var now=Browser.now();
						_this._isDoubleClick=(now-_this._lastClickTimer)< 300;
						_this._lastClickTimer=now;
						_this.initEvent(evt);
						_this.check(_this._stage,_this.mouseX,_this.mouseY,_this.onMouseUp);
						break ;
					case 'mousemove':
						if ((Math.abs(this._prePoint.x-evt.clientX)+Math.abs(this._prePoint.y-evt.clientY))>=this.mouseMoveAccuracy){
							this._prePoint.x=evt.clientX;
							this._prePoint.y=evt.clientY;
							_this.initEvent(evt);
							_this.check(_this._stage,_this.mouseX,_this.mouseY,_this.onMouseMove);
							_this.checkMouseOut();
						}
						break ;
					case "touchstart":
						MouseManager._isTouchRespond=true;
						_this._isLeftMouse=true;
						var touches=evt.changedTouches;
						for (var j=0,n=touches.length;j < n;j++){
							var touch=touches[j];
							if (this._id % 200===0)this._touchIDs={};
							this._touchIDs[touch.identifier]=this._id++;
							_this.initEvent(touch,evt);
							_this.check(_this._stage,_this.mouseX,_this.mouseY,_this.onMouseDown);
						}
						break ;
					case "touchend":
						MouseManager._isTouchRespond=true;
						_this._isLeftMouse=true;
						now=Browser.now();
						_this._isDoubleClick=(now-_this._lastClickTimer)< 300;
						_this._lastClickTimer=now;
						var touchends=evt.changedTouches;
						for (j=0,n=touchends.length;j < n;j++){
							_this.initEvent(touchends[j],evt);
							_this.check(_this._stage,_this.mouseX,_this.mouseY,_this.onMouseUp);
						}
						break ;
					case "touchmove":;
						var touchemoves=evt.changedTouches;
						for (j=0,n=touchemoves.length;j < n;j++){
							_this.initEvent(touchemoves[j],evt);
							_this.check(_this._stage,_this.mouseX,_this.mouseY,_this.onMouseMove);
						}
						_this.checkMouseOut();
						break ;
					case "wheel":
					case "mousewheel":
					case "DOMMouseScroll":
						_this.checkMouseWheel(evt);
						break ;
					case "mouseout":
						_this._stage.event(/*laya.events.Event.MOUSE_OUT*/"mouseout",_this._event.setTo(/*laya.events.Event.MOUSE_OUT*/"mouseout",_this._stage,_this._stage));
						break ;
					case "mouseover":
						_this._stage.event(/*laya.events.Event.MOUSE_OVER*/"mouseover",_this._event.setTo(/*laya.events.Event.MOUSE_OVER*/"mouseover",_this._stage,_this._stage));
						break ;
					}
				i++;
			}
			this._eventList.length=0;
		}

		MouseManager.enabled=true;
		MouseManager._isTouchRespond=false;
		__static(MouseManager,
		['instance',function(){return this.instance=new MouseManager();}
		]);
		return MouseManager;
	})()


	/**
	*<code>Filter</code> ??????????????????
	*/
	//class laya.filters.Filter
	var Filter=(function(){
		function Filter(){
			this._action=null;
		}

		__class(Filter,'laya.filters.Filter');
		var __proto=Filter.prototype;
		Laya.imps(__proto,{"laya.filters.IFilter":true})
		/**@private */
		__proto.callNative=function(sp){}
		/**@private ???????????????*/
		__getset(0,__proto,'type',function(){return-1});
		/**@private ???????????????*/
		__getset(0,__proto,'action',function(){return this._action });
		Filter.BLUR=0x10;
		Filter.COLOR=0x20;
		Filter.GLOW=0x08;
		Filter._filterStart=null
		Filter._filterEnd=null
		Filter._EndTarget=null
		Filter._recycleScope=null
		Filter._filter=null
		Filter._useSrc=null
		Filter._endSrc=null
		Filter._useOut=null
		Filter._endOut=null
		return Filter;
	})()


	/**
	*<code>ColorFilterAction</code> ?????????????????????????????????
	*/
	//class laya.filters.ColorFilterAction
	var ColorFilterAction=(function(){
		function ColorFilterAction(){
			this.data=null;
		}

		__class(ColorFilterAction,'laya.filters.ColorFilterAction');
		var __proto=ColorFilterAction.prototype;
		Laya.imps(__proto,{"laya.filters.IFilterAction":true})
		/**
		*???????????????????????????????????????
		*@param srcCanvas ???????????????????????????
		*@return ????????????????????????????????????
		*/
		__proto.apply=function(srcCanvas){
			var ctx=srcCanvas.ctx.ctx;
			var canvas=srcCanvas.ctx.ctx.canvas;
			if (canvas.width==0 || canvas.height==0)return canvas;
			var imgdata=ctx.getImageData(0,0,canvas.width,canvas.height);
			var data=imgdata.data;
			var nData;
			for (var i=0,n=data.length;i < n;i+=4){
				nData=this.getColor(data[i],data[i+1],data[i+2],data[i+3]);
				if (data[i+3]==0)continue ;
				data[i]=nData[0];
				data[i+1]=nData[1];
				data[i+2]=nData[2];
				data[i+3]=nData[3];
			}
			ctx.putImageData(imgdata,0,0);
			return srcCanvas;
		}

		__proto.getColor=function(red,green,blue,alpha){
			var rst=[];
			if (this.data._mat && this.data._alpha){
				var mat=this.data._mat;
				var tempAlpha=this.data._alpha;
				rst[0]=mat[0] *red+mat[1] *green+mat[2] *blue+mat[3] *alpha+tempAlpha[0];
				rst[1]=mat[4] *red+mat[5] *green+mat[6] *blue+mat[7] *alpha+tempAlpha[1];
				rst[2]=mat[8] *red+mat[9] *green+mat[10] *blue+mat[11] *alpha+tempAlpha[2];
				rst[3]=mat[12] *red+mat[13] *green+mat[14] *blue+mat[15] *alpha+tempAlpha[3];
			}
			return rst;
		}

		return ColorFilterAction;
	})()


	/**
	*@private
	*/
	//class laya.maths.Arith
	var Arith=(function(){
		function Arith(){};
		__class(Arith,'laya.maths.Arith');
		Arith.formatR=function(r){
			if (r > Math.PI)r-=Math.PI *2;
			if (r <-Math.PI)r+=Math.PI *2;
			return r;
		}

		Arith.isPOT=function(w,h){
			return (w > 0 && (w & (w-1))===0 && h > 0 && (h & (h-1))===0);
		}

		Arith.setMatToArray=function(mat,array){
			mat.a,mat.b,0,0,mat.c,mat.d,0,0,0,0,1,0,mat.tx+20,mat.ty+20,0,1
			array[0]=mat.a;
			array[1]=mat.b;
			array[4]=mat.c;
			array[5]=mat.d;
			array[12]=mat.tx;
			array[13]=mat.ty;
		}

		return Arith;
	})()


	/**
	*@private
	*????????????????????????????????????
	*/
	//class laya.maths.Bezier
	var Bezier=(function(){
		function Bezier(){
			this._controlPoints=[new Point(),new Point(),new Point()];
			this._calFun=this.getPoint2;
		}

		__class(Bezier,'laya.maths.Bezier');
		var __proto=Bezier.prototype;
		/**@private */
		__proto._switchPoint=function(x,y){
			var tPoint=this._controlPoints.shift();
			tPoint.setTo(x,y);
			this._controlPoints.push(tPoint);
		}

		/**
		*???????????????????????????
		*@param t
		*@param rst
		*
		*/
		__proto.getPoint2=function(t,rst){
			var p1=this._controlPoints[0];
			var p2=this._controlPoints[1];
			var p3=this._controlPoints[2];
			var lineX=Math.pow((1-t),2)*p1.x+2 *t *(1-t)*p2.x+Math.pow(t,2)*p3.x;
			var lineY=Math.pow((1-t),2)*p1.y+2 *t *(1-t)*p2.y+Math.pow(t,2)*p3.y;
			rst.push(lineX,lineY);
		}

		/**
		*????????????????????????
		*@param t
		*@param rst
		*
		*/
		__proto.getPoint3=function(t,rst){
			var p1=this._controlPoints[0];
			var p2=this._controlPoints[1];
			var p3=this._controlPoints[2];
			var p4=this._controlPoints[3];
			var lineX=Math.pow((1-t),3)*p1.x+3 *p2.x *t *(1-t)*(1-t)+3 *p3.x *t *t *(1-t)+p4.x *Math.pow(t,3);
			var lineY=Math.pow((1-t),3)*p1.y+3 *p2.y *t *(1-t)*(1-t)+3 *p3.y *t *t *(1-t)+p4.y *Math.pow(t,3);
			rst.push(lineX,lineY);
		}

		/**
		*????????????????????????
		*@param count
		*@param rst
		*
		*/
		__proto.insertPoints=function(count,rst){
			var i=NaN;
			count=count > 0 ? count :5;
			var dLen=NaN;
			dLen=1 / count;
			for (i=0;i <=1;i+=dLen){
				this._calFun(i,rst);
			}
		}

		/**
		*?????????????????????????????????
		*@param pList ?????????[x0,y0,x1,y1...]
		*@param inSertCount ???????????????????????????
		*@return
		*
		*/
		__proto.getBezierPoints=function(pList,inSertCount,count){
			(inSertCount===void 0)&& (inSertCount=5);
			(count===void 0)&& (count=2);
			var i=0,len=0;
			len=pList.length;
			if (len < (count+1)*2)return [];
			var rst;
			rst=[];
			switch (count){
				case 2:
					this._calFun=this.getPoint2;
					break ;
				case 3:
					this._calFun=this.getPoint3;
					break ;
				default :
					return [];
				}
			while(this._controlPoints.length<=count){
				this._controlPoints.push(new Point());
			}
			for (i=0;i < count *2;i+=2){
				this._switchPoint(pList[i],pList[i+1]);
			}
			for (i=count *2;i < len;i+=2){
				this._switchPoint(pList[i],pList[i+1]);
				if ((i / 2)% count==0)
					this.insertPoints(inSertCount,rst);
			}
			return rst;
		}

		__static(Bezier,
		['I',function(){return this.I=new Bezier();}
		]);
		return Bezier;
	})()


	/**
	*@private
	*???????????????
	*/
	//class laya.maths.GrahamScan
	var GrahamScan=(function(){
		function GrahamScan(){};
		__class(GrahamScan,'laya.maths.GrahamScan');
		GrahamScan.multiply=function(p1,p2,p0){
			return ((p1.x-p0.x)*(p2.y-p0.y)-(p2.x-p0.x)*(p1.y-p0.y));
		}

		GrahamScan.dis=function(p1,p2){
			return (p1.x-p2.x)*(p1.x-p2.x)+(p1.y-p2.y)*(p1.y-p2.y);
		}

		GrahamScan._getPoints=function(count,tempUse,rst){
			(tempUse===void 0)&& (tempUse=false);
			if (!GrahamScan._mPointList)GrahamScan._mPointList=[];
			while (GrahamScan._mPointList.length < count)GrahamScan._mPointList.push(new Point());
			if (!rst)rst=[];
			rst.length=0;
			if (tempUse){
				GrahamScan.getFrom(rst,GrahamScan._mPointList,count);
				}else {
				GrahamScan.getFromR(rst,GrahamScan._mPointList,count);
			}
			return rst;
		}

		GrahamScan.getFrom=function(rst,src,count){
			var i=0;
			for (i=0;i < count;i++){
				rst.push(src[i]);
			}
			return rst;
		}

		GrahamScan.getFromR=function(rst,src,count){
			var i=0;
			for (i=0;i < count;i++){
				rst.push(src.pop());
			}
			return rst;
		}

		GrahamScan.pListToPointList=function(pList,tempUse){
			(tempUse===void 0)&& (tempUse=false);
			var i=0,len=pList.length / 2,rst=GrahamScan._getPoints(len,tempUse,GrahamScan._tempPointList);
			for (i=0;i < len;i++){
				rst[i].setTo(pList[i+i],pList[i+i+1]);
			}
			return rst;
		}

		GrahamScan.pointListToPlist=function(pointList){
			var i=0,len=pointList.length,rst=GrahamScan._temPList,tPoint;
			rst.length=0;
			for (i=0;i < len;i++){
				tPoint=pointList[i];
				rst.push(tPoint.x,tPoint.y);
			}
			return rst;
		}

		GrahamScan.scanPList=function(pList){
			return Utils.copyArray(pList,GrahamScan.pointListToPlist(GrahamScan.scan(GrahamScan.pListToPointList(pList,true))));
		}

		GrahamScan.scan=function(PointSet){
			var i=0,j=0,k=0,top=2,tmp,n=PointSet.length,ch;
			var _tmpDic={};
			var key;
			ch=GrahamScan._temArr;
			ch.length=0;
			n=PointSet.length;
			for (i=n-1;i >=0;i--){
				tmp=PointSet[i];
				key=tmp.x+"_"+tmp.y;
				if (!_tmpDic.hasOwnProperty(key)){
					_tmpDic[key]=true;
					ch.push(tmp);
				}
			}
			n=ch.length;
			Utils.copyArray(PointSet,ch);
			for (i=1;i < n;i++)
			if ((PointSet[i].y < PointSet[k].y)|| ((PointSet[i].y==PointSet[k].y)&& (PointSet[i].x < PointSet[k].x)))
				k=i;
			tmp=PointSet[0];
			PointSet[0]=PointSet[k];
			PointSet[k]=tmp;
			for (i=1;i < n-1;i++){
				k=i;
				for (j=i+1;j < n;j++)
				if ((GrahamScan.multiply(PointSet[j],PointSet[k],PointSet[0])> 0)|| ((GrahamScan.multiply(PointSet[j],PointSet[k],PointSet[0])==0)&& (GrahamScan.dis(PointSet[0],PointSet[j])< GrahamScan.dis(PointSet[0],PointSet[k]))))
					k=j;
				tmp=PointSet[i];
				PointSet[i]=PointSet[k];
				PointSet[k]=tmp;
			}
			ch=GrahamScan._temArr;
			ch.length=0;
			if (PointSet.length < 3){
				return Utils.copyArray(ch,PointSet);
			}
			ch.push(PointSet[0],PointSet[1],PointSet[2]);
			for (i=3;i < n;i++){
				while (ch.length >=2 && GrahamScan.multiply(PointSet[i],ch[ch.length-1],ch[ch.length-2])>=0)ch.pop();
				PointSet[i] && ch.push(PointSet[i]);
			}
			return ch;
		}

		GrahamScan._mPointList=null
		GrahamScan._tempPointList=[];
		GrahamScan._temPList=[];
		GrahamScan._temArr=[];
		return GrahamScan;
	})()


	/**
	*@private
	*<code>MathUtil</code> ?????????????????????????????????
	*/
	//class laya.maths.MathUtil
	var MathUtil=(function(){
		function MathUtil(){};
		__class(MathUtil,'laya.maths.MathUtil');
		MathUtil.subtractVector3=function(l,r,o){
			o[0]=l[0]-r[0];
			o[1]=l[1]-r[1];
			o[2]=l[2]-r[2];
		}

		MathUtil.lerp=function(left,right,amount){
			return left *(1-amount)+right *amount;
		}

		MathUtil.scaleVector3=function(f,b,e){
			e[0]=f[0] *b;
			e[1]=f[1] *b;
			e[2]=f[2] *b;
		}

		MathUtil.lerpVector3=function(l,r,t,o){
			var ax=l[0],ay=l[1],az=l[2];
			o[0]=ax+t *(r[0]-ax);
			o[1]=ay+t *(r[1]-ay);
			o[2]=az+t *(r[2]-az);
		}

		MathUtil.lerpVector4=function(l,r,t,o){
			var ax=l[0],ay=l[1],az=l[2],aw=l[3];
			o[0]=ax+t *(r[0]-ax);
			o[1]=ay+t *(r[1]-ay);
			o[2]=az+t *(r[2]-az);
			o[3]=aw+t *(r[3]-aw);
		}

		MathUtil.slerpQuaternionArray=function(a,Offset1,b,Offset2,t,out,Offset3){
			var ax=a[Offset1+0],ay=a[Offset1+1],az=a[Offset1+2],aw=a[Offset1+3],bx=b[Offset2+0],by=b[Offset2+1],bz=b[Offset2+2],bw=b[Offset2+3];
			var omega,cosom,sinom,scale0,scale1;
			cosom=ax *bx+ay *by+az *bz+aw *bw;
			if (cosom < 0.0){
				cosom=-cosom;
				bx=-bx;
				by=-by;
				bz=-bz;
				bw=-bw;
			}
			if ((1.0-cosom)> 0.000001){
				omega=Math.acos(cosom);
				sinom=Math.sin(omega);
				scale0=Math.sin((1.0-t)*omega)/ sinom;
				scale1=Math.sin(t *omega)/ sinom;
				}else {
				scale0=1.0-t;
				scale1=t;
			}
			out[Offset3+0]=scale0 *ax+scale1 *bx;
			out[Offset3+1]=scale0 *ay+scale1 *by;
			out[Offset3+2]=scale0 *az+scale1 *bz;
			out[Offset3+3]=scale0 *aw+scale1 *bw;
			return out;
		}

		MathUtil.getRotation=function(x0,y0,x1,y1){
			return Math.atan2(y1-y0,x1-x0)/ Math.PI *180;
		}

		MathUtil.sortBigFirst=function(a,b){
			if (a==b)
				return 0;
			return b > a ? 1 :-1;
		}

		MathUtil.sortSmallFirst=function(a,b){
			if (a==b)
				return 0;
			return b > a ?-1 :1;
		}

		MathUtil.sortNumBigFirst=function(a,b){
			return parseFloat(b)-parseFloat(a);
		}

		MathUtil.sortNumSmallFirst=function(a,b){
			return parseFloat(a)-parseFloat(b);
		}

		MathUtil.sortByKey=function(key,bigFirst,forceNum){
			(bigFirst===void 0)&& (bigFirst=false);
			(forceNum===void 0)&& (forceNum=true);
			var _sortFun;
			if (bigFirst){
				_sortFun=forceNum ? MathUtil.sortNumBigFirst :MathUtil.sortBigFirst;
				}else {
				_sortFun=forceNum ? MathUtil.sortNumSmallFirst :MathUtil.sortSmallFirst;
			}
			return function (a,b){
				return _sortFun(a[key],b[key]);
			}
		}

		return MathUtil;
	})()


	/**
	*<code>Matrix</code> ?????????????????????????????????????????????????????????????????????????????????????????????????????????
	*/
	//class laya.maths.Matrix
	var Matrix=(function(){
		function Matrix(a,b,c,d,tx,ty){
			this.cos=1;
			this.sin=0;
			//this.a=NaN;
			//this.b=NaN;
			//this.c=NaN;
			//this.d=NaN;
			//this.tx=NaN;
			//this.ty=NaN;
			this.inPool=false;
			this.bTransform=false;
			(a===void 0)&& (a=1);
			(b===void 0)&& (b=0);
			(c===void 0)&& (c=0);
			(d===void 0)&& (d=1);
			(tx===void 0)&& (tx=0);
			(ty===void 0)&& (ty=0);
			this.a=a;
			this.b=b;
			this.c=c;
			this.d=d;
			this.tx=tx;
			this.ty=ty;
			this._checkTransform();
		}

		__class(Matrix,'laya.maths.Matrix');
		var __proto=Matrix.prototype;
		/**
		*???????????????????????????????????????
		*@return ?????????????????????
		*/
		__proto.identity=function(){
			this.a=this.d=1;
			this.b=this.tx=this.ty=this.c=0;
			this.bTransform=false;
			return this;
		}

		/**@private*/
		__proto._checkTransform=function(){
			return this.bTransform=(this.a!==1 || this.b!==0 || this.c!==0 || this.d!==1);
		}

		/**
		*????????? x ???y ??????????????????????????????
		*@param x ??? x ??????????????????????????????
		*@param y ??? y ??????????????????????????????
		*@return ??????????????????
		*/
		__proto.setTranslate=function(x,y){
			this.tx=x;
			this.ty=y;
			return this;
		}

		/**
		*??? x ??? y ????????????????????? x ??? y ???????????????
		*@param x ??? x ????????????????????????????????????????????????
		*@param y ??? y ????????????????????????????????????????????????
		*@return ??????????????????
		*/
		__proto.translate=function(x,y){
			this.tx+=x;
			this.ty+=y;
			return this;
		}

		/**
		*??????????????????????????????
		*@param x ????????? x ???????????????????????????
		*@param y ????????? y ???????????????????????????
		*/
		__proto.scale=function(x,y){
			this.a *=x;
			this.d *=y;
			this.c *=x;
			this.b *=y;
			this.tx *=x;
			this.ty *=y;
			this.bTransform=true;
		}

		/**
		*??? Matrix ???????????????????????????
		*@param angle ????????????????????????????????????
		*/
		__proto.rotate=function(angle){
			var cos=this.cos=Math.cos(angle);
			var sin=this.sin=Math.sin(angle);
			var a1=this.a;
			var c1=this.c;
			var tx1=this.tx;
			this.a=a1 *cos-this.b *sin;
			this.b=a1 *sin+this.b *cos;
			this.c=c1 *cos-this.d *sin;
			this.d=c1 *sin+this.d *cos;
			this.tx=tx1 *cos-this.ty *sin;
			this.ty=tx1 *sin+this.ty *cos;
			this.bTransform=true;
		}

		/**
		*??? Matrix ???????????????????????????
		*@param x ?????? X ?????? 2D ???????????????
		*@param y ?????? Y ?????? 2D ???????????????
		*@return ?????? Matrix ?????????
		*/
		__proto.skew=function(x,y){
			var tanX=Math.tan(x);
			var tanY=Math.tan(y);
			var a1=this.a;
			var b1=this.b;
			this.a+=tanY *this.c;
			this.b+=tanY *this.d;
			this.c+=tanX *a1;
			this.d+=tanX *b1;
			return this;
		}

		/**
		*???????????????????????????????????????????????????????????????
		*@param out ??????????????? Point ?????????
		*@return ??????out
		*/
		__proto.invertTransformPoint=function(out){
			var a1=this.a;
			var b1=this.b;
			var c1=this.c;
			var d1=this.d;
			var tx1=this.tx;
			var n=a1 *d1-b1 *c1;
			var a2=d1 / n;
			var b2=-b1 / n;
			var c2=-c1 / n;
			var d2=a1 / n;
			var tx2=(c1 *this.ty-d1 *tx1)/ n;
			var ty2=-(a1 *this.ty-b1 *tx1)/ n;
			return out.setTo(a2 *out.x+c2 *out.y+tx2,b2 *out.x+d2 *out.y+ty2);
		}

		/**
		*??? Matrix ????????????????????????????????????????????????
		*@param out ?????????????????????????????????
		*@return ??????out
		*/
		__proto.transformPoint=function(out){
			return out.setTo(this.a *out.x+this.c *out.y+this.tx,this.b *out.x+this.d *out.y+this.ty);
		}

		/**
		*@private
		*??? Matrix ????????????????????????????????????????????????
		*@param data ????????????
		*@param out ????????????????????????????????????
		*@return ??????out??????
		*/
		__proto.transformPointArray=function(data,out){
			var len=data.length;
			for (var i=0;i < len;i+=2){
				var x=data[i],y=data[i+1];
				out[i]=this.a *x+this.c *y+this.tx;
				out[i+1]=this.b *x+this.d *y+this.ty;
			}
			return out;
		}

		/**
		*@private
		*??? Matrix ??????????????????????????????????????????????????????
		*@param data ????????????
		*@param out ????????????????????????????????????
		*@return ??????out??????
		*/
		__proto.transformPointArrayScale=function(data,out){
			var len=data.length;
			for (var i=0;i < len;i+=2){
				var x=data[i],y=data[i+1];
				out[i]=this.a *x+this.c *y;
				out[i+1]=this.b *x+this.d *y;
			}
			return out;
		}

		/**
		*?????? X ???????????????
		*@return X ???????????????
		*/
		__proto.getScaleX=function(){
			return this.b===0 ? this.a :Math.sqrt(this.a *this.a+this.b *this.b);
		}

		/**
		*?????? Y ???????????????
		*@return Y ???????????????
		*/
		__proto.getScaleY=function(){
			return this.c===0 ? this.d :Math.sqrt(this.c *this.c+this.d *this.d);
		}

		/**
		*?????????????????????????????????
		*@return ?????????????????????
		*/
		__proto.invert=function(){
			var a1=this.a;
			var b1=this.b;
			var c1=this.c;
			var d1=this.d;
			var tx1=this.tx;
			var n=a1 *d1-b1 *c1;
			this.a=d1 / n;
			this.b=-b1 / n;
			this.c=-c1 / n;
			this.d=a1 / n;
			this.tx=(c1 *this.ty-d1 *tx1)/ n;
			this.ty=-(a1 *this.ty-b1 *tx1)/ n;
			return this;
		}

		/**
		*??? Matrix ??????????????????????????????
		*@param a ??????????????????????????????????????? x ??????????????????
		*@param b ??????????????????????????????????????? y ??????????????????
		*@param c ??????????????????????????????????????? x ??????????????????
		*@param d ??????????????????????????????????????? y ??????????????????
		*@param tx ??? x ??????????????????????????????
		*@param ty ??? y ??????????????????????????????
		*@return ?????????????????????
		*/
		__proto.setTo=function(a,b,c,d,tx,ty){
			this.a=a,this.b=b,this.c=c,this.d=d,this.tx=tx,this.ty=ty;
			return this;
		}

		/**
		*?????????????????????????????????????????????????????????????????????????????????????????????????????????
		*@param matrix ?????????????????????????????????
		*@return ???????????????
		*/
		__proto.concat=function(matrix){
			var a=this.a;
			var c=this.c;
			var tx=this.tx;
			this.a=a *matrix.a+this.b *matrix.c;
			this.b=a *matrix.b+this.b *matrix.d;
			this.c=c *matrix.a+this.d *matrix.c;
			this.d=c *matrix.b+this.d *matrix.d;
			this.tx=tx *matrix.a+this.ty *matrix.c+matrix.tx;
			this.ty=tx *matrix.b+this.ty *matrix.d+matrix.ty;
			return this;
		}

		/**
		*??????????????????????????????????????????
		*@param x ????????? x ???????????????????????????
		*@param y ????????? y ???????????????????????????
		*/
		__proto.scaleEx=function(x,y){
			var ba=this.a,bb=this.b,bc=this.c,bd=this.d;
			if (bb!==0 || bc!==0){
				this.a=x *ba;
				this.b=x *bb;
				this.c=y *bc;
				this.d=y *bd;
			}
			else{
				this.a=x *ba;
				this.b=0 *bd;
				this.c=0 *ba;
				this.d=y *bd;
			}
			this.bTransform=true;
		}

		/**
		*??? Matrix ???????????????????????????????????????
		*@param angle ????????????????????????????????????
		*/
		__proto.rotateEx=function(angle){
			var cos=Math.cos(angle);
			var sin=Math.sin(angle);
			var ba=this.a,bb=this.b,bc=this.c,bd=this.d;
			if (bb!==0 || bc!==0){
				this.a=cos *ba+sin *bc;
				this.b=cos *bb+sin *bd;
				this.c=-sin *ba+cos *bc;
				this.d=-sin *bb+cos *bd;
			}
			else{
				this.a=cos *ba;
				this.b=sin *bd;
				this.c=-sin *ba;
				this.d=cos *bd;
			}
			this.bTransform=true;
		}

		/**
		*?????????????????? Matrix ?????????????????????????????????????????????????????????????????????????????????
		*@return ?????? Matrix ?????????
		*/
		__proto.clone=function(){
			var no=Matrix._cache;
			var dec=!no._length ? (new Matrix()):no[--no._length];
			dec.a=this.a;
			dec.b=this.b;
			dec.c=this.c;
			dec.d=this.d;
			dec.tx=this.tx;
			dec.ty=this.ty;
			dec.bTransform=this.bTransform;
			return dec;
		}

		/**
		*????????? Matrix ???????????????????????????????????????????????? Matrix ????????????
		*@param dec ?????????????????????????????? Matrix ?????????
		*@return ?????????????????????????????? Matrix ?????????
		*/
		__proto.copyTo=function(dec){
			dec.a=this.a;
			dec.b=this.b;
			dec.c=this.c;
			dec.d=this.d;
			dec.tx=this.tx;
			dec.ty=this.ty;
			dec.bTransform=this.bTransform;
			return dec;
		}

		/**
		*??????????????? Matrix ???????????????????????????
		*@return ??????????????????????????? Matrix ?????????????????????a???b???c???d???tx ??? ty???
		*/
		__proto.toString=function(){
			return this.a+","+this.b+","+this.c+","+this.d+","+this.tx+","+this.ty;
		}

		/**
		*??????????????????
		*/
		__proto.destroy=function(){
			if (this.inPool)return;
			var cache=Matrix._cache;
			this.inPool=true;
			cache._length || (cache._length=0);
			cache[cache._length++]=this;
			this.a=this.d=1;
			this.b=this.c=this.tx=this.ty=0;
			this.bTransform=false;
		}

		Matrix.mul=function(m1,m2,out){
			var aa=m1.a,ab=m1.b,ac=m1.c,ad=m1.d,atx=m1.tx,aty=m1.ty;
			var ba=m2.a,bb=m2.b,bc=m2.c,bd=m2.d,btx=m2.tx,bty=m2.ty;
			if (bb!==0 || bc!==0){
				out.a=aa *ba+ab *bc;
				out.b=aa *bb+ab *bd;
				out.c=ac *ba+ad *bc;
				out.d=ac *bb+ad *bd;
				out.tx=ba *atx+bc *aty+btx;
				out.ty=bb *atx+bd *aty+bty;
				}else {
				out.a=aa *ba;
				out.b=ab *bd;
				out.c=ac *ba;
				out.d=ad *bd;
				out.tx=ba *atx+btx;
				out.ty=bd *aty+bty;
			}
			return out;
		}

		Matrix.mulPre=function(m1,ba,bb,bc,bd,btx,bty,out){
			var aa=m1.a,ab=m1.b,ac=m1.c,ad=m1.d,atx=m1.tx,aty=m1.ty;
			if (bb!==0 || bc!==0){
				out.a=aa *ba+ab *bc;
				out.b=aa *bb+ab *bd;
				out.c=ac *ba+ad *bc;
				out.d=ac *bb+ad *bd;
				out.tx=ba *atx+bc *aty+btx;
				out.ty=bb *atx+bd *aty+bty;
				}else {
				out.a=aa *ba;
				out.b=ab *bd;
				out.c=ac *ba;
				out.d=ad *bd;
				out.tx=ba *atx+btx;
				out.ty=bd *aty+bty;
			}
			return out;
		}

		Matrix.mulPos=function(m1,aa,ab,ac,ad,atx,aty,out){
			var ba=m1.a,bb=m1.b,bc=m1.c,bd=m1.d,btx=m1.tx,bty=m1.ty;
			if (bb!==0 || bc!==0){
				out.a=aa *ba+ab *bc;
				out.b=aa *bb+ab *bd;
				out.c=ac *ba+ad *bc;
				out.d=ac *bb+ad *bd;
				out.tx=ba *atx+bc *aty+btx;
				out.ty=bb *atx+bd *aty+bty;
				}else {
				out.a=aa *ba;
				out.b=ab *bd;
				out.c=ac *ba;
				out.d=ad *bd;
				out.tx=ba *atx+btx;
				out.ty=bd *aty+bty;
			}
			return out;
		}

		Matrix.preMul=function(parent,self,out){
			var pa=parent.a,pb=parent.b,pc=parent.c,pd=parent.d;
			var na=self.a,nb=self.b,nc=self.c,nd=self.d,ntx=self.tx,nty=self.ty;
			out.a=na *pa;
			out.b=out.c=0;
			out.d=nd *pd;
			out.tx=ntx *pa+parent.tx;
			out.ty=nty *pd+parent.ty;
			if (nb!==0 || nc!==0 || pb!==0 || pc!==0){
				out.a+=nb *pc;
				out.d+=nc *pb;
				out.b+=na *pb+nb *pd;
				out.c+=nc *pa+nd *pc;
				out.tx+=nty *pc;
				out.ty+=ntx *pb;
			}
			return out;
		}

		Matrix.preMulXY=function(parent,x,y,out){
			var pa=parent.a,pb=parent.b,pc=parent.c,pd=parent.d;
			out.a=pa;
			out.b=pb;
			out.c=pc;
			out.d=pd;
			out.tx=x *pa+parent.tx+y *pc;
			out.ty=y *pd+parent.ty+x *pb;
			return out;
		}

		Matrix.create=function(){
			var cache=Matrix._cache;
			var mat=!cache._length ? (new Matrix()):cache[--cache._length];
			mat.inPool=false;
			return mat;
		}

		Matrix.EMPTY=new Matrix();
		Matrix.TEMP=new Matrix();
		Matrix._cache=[];
		return Matrix;
	})()


	/**
	*<code>Point</code> ????????????????????????????????????????????????????????? x ??????????????????y ??????????????????
	*/
	//class laya.maths.Point
	var Point=(function(){
		function Point(x,y){
			//this.x=NaN;
			//this.y=NaN;
			(x===void 0)&& (x=0);
			(y===void 0)&& (y=0);
			this.x=x;
			this.y=y;
		}

		__class(Point,'laya.maths.Point');
		var __proto=Point.prototype;
		/**
		*??? <code>Point</code> ??????????????????????????????
		*@param x ???????????????
		*@param y ???????????????
		*@return ?????? Point ?????????
		*/
		__proto.setTo=function(x,y){
			this.x=x;
			this.y=y;
			return this;
		}

		/**
		*????????????????????????x???y????????????
		*@param x ???????????????
		*@param y ???????????????
		*@return ?????????????????????
		*/
		__proto.distance=function(x,y){
			return Math.sqrt((this.x-x)*(this.x-x)+(this.y-y)*(this.y-y));
		}

		/**???????????? x ??? y ???????????????????????????*/
		__proto.toString=function(){
			return this.x+","+this.y;
		}

		/**
		*???????????????
		*/
		__proto.normalize=function(){
			var d=Math.sqrt(this.x *this.x+this.y *this.y);
			if (d > 0){
				var id=1.0 / d;
				this.x *=id;
				this.y *=id;
			}
		}

		Point.TEMP=new Point();
		Point.EMPTY=new Point();
		return Point;
	})()


	/**
	*<code>Rectangle</code> ????????????????????????????????????????????? (x,y)????????????????????????????????????????????????
	*/
	//class laya.maths.Rectangle
	var Rectangle=(function(){
		function Rectangle(x,y,width,height){
			//this.x=NaN;
			//this.y=NaN;
			//this.width=NaN;
			//this.height=NaN;
			(x===void 0)&& (x=0);
			(y===void 0)&& (y=0);
			(width===void 0)&& (width=0);
			(height===void 0)&& (height=0);
			this.x=x;
			this.y=y;
			this.width=width;
			this.height=height;
		}

		__class(Rectangle,'laya.maths.Rectangle');
		var __proto=Rectangle.prototype;
		/**
		*??? Rectangle ??????????????????????????????
		*@param x x ?????????????????? X ????????????
		*@param y x ?????????????????? Y ????????????
		*@param width ??????????????????
		*@param height ???????????????
		*@return ????????????????????????????????????????????????
		*/
		__proto.setTo=function(x,y,width,height){
			this.x=x;
			this.y=y;
			this.width=width;
			this.height=height;
			return this;
		}

		/**
		*?????? source ??????????????????????????????????????????
		*@param sourceRect ??? Rectangle ?????????
		*@return ????????????????????????????????????????????????
		*/
		__proto.copyFrom=function(source){
			this.x=source.x;
			this.y=source.y;
			this.width=source.width;
			this.height=source.height;
			return this;
		}

		/**
		*????????????????????????????????????????????????
		*@param x ?????? X ?????????????????????????????????
		*@param y ?????? Y ?????????????????????????????????
		*@return ?????? Rectangle ???????????????????????????????????? true???????????? false???
		*/
		__proto.contains=function(x,y){
			if (this.width <=0 || this.height <=0)return false;
			if (x >=this.x && x < this.right){
				if (y >=this.y && y < this.bottom){
					return true;
				}
			}
			return false;
		}

		/**
		*??????????????????????????????????????????????????????
		*@param rect Rectangle ?????????
		*@return ????????????????????????????????????????????????????????? true ?????????????????? false???
		*/
		__proto.intersects=function(rect){
			return !(rect.x > (this.x+this.width)|| (rect.x+rect.width)< this.x || rect.y > (this.y+this.height)|| (rect.y+rect.height)< this.y);
		}

		/**
		*??????????????????????????????????????????????????????????????????????????????????????????????????????????????????
		*@param rect ???????????????????????????
		*@param out ????????????????????????????????????????????????????????????????????????????????????????????????
		*@return ????????????????????????????????????
		*/
		__proto.intersection=function(rect,out){
			if (!this.intersects(rect))return null;
			out || (out=new Rectangle());
			out.x=Math.max(this.x,rect.x);
			out.y=Math.max(this.y,rect.y);
			out.width=Math.min(this.right,rect.right)-out.x;
			out.height=Math.min(this.bottom,rect.bottom)-out.y;
			return out;
		}

		/**
		*?????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????? Rectangle ?????????
		*@param ?????????????????????
		*@param out ??????????????????????????????????????????????????????????????????????????????????????????????????????
		*@return ???????????????????????? Rectangle ?????? out ???
		*/
		__proto.union=function(source,out){
			out || (out=new Rectangle());
			this.clone(out);
			if (source.width <=0 || source.height <=0)return out;
			out.addPoint(source.x,source.y);
			out.addPoint(source.right,source.bottom);
			return this;
		}

		/**
		*???????????? Rectangle ???????????? x???y???width ??? height ????????????????????? Rectangle ???????????????????????????
		*@param out ????????????????????????????????????????????????????????????????????????????????????????????????
		*@return Rectangle ?????? out ?????? x???y???width ??? height ????????????????????? Rectangle ???????????????????????????
		*/
		__proto.clone=function(out){
			out || (out=new Rectangle());
			out.x=this.x;
			out.y=this.y;
			out.width=this.width;
			out.height=this.height;
			return out;
		}

		/**
		*?????? Rectangle ????????????????????? x ??????????????? y ???????????? width ????????? height ?????????????????????????????????
		*/
		__proto.toString=function(){
			return this.x+","+this.y+","+this.width+","+this.height;
		}

		/**
		*??????????????? Rectangle ?????????????????????????????? Rectangle ??????????????? x???y???width???height ?????????????????????
		*@param rect ???????????? Rectangle ?????????
		*@return ?????????????????????????????????????????? true ,???????????? false???
		*/
		__proto.equals=function(rect){
			if (!rect || rect.x!==this.x || rect.y!==this.y || rect.width!==this.width || rect.height!==this.height)return false;
			return true;
		}

		/**
		*???????????????????????????????????????
		*@param x ?????? X ?????????
		*@param y ?????? Y ?????????
		*@return ????????? Rectangle ?????????
		*/
		__proto.addPoint=function(x,y){
			this.x > x && (this.width+=this.x-x,this.x=x);
			this.y > y && (this.height+=this.y-y,this.y=y);
			if (this.width < x-this.x)this.width=x-this.x;
			if (this.height < y-this.y)this.height=y-this.y;
			return this;
		}

		/**
		*@private
		*??????????????????????????????????????????
		*@return ???????????????
		*/
		__proto._getBoundPoints=function(){
			var rst=Rectangle._temB;
			rst.length=0;
			if (this.width==0 || this.height==0)return rst;
			rst.push(this.x,this.y,this.x+this.width,this.y,this.x,this.y+this.height,this.x+this.width,this.y+this.height);
			return rst;
		}

		/**????????? Rectangle ?????????????????????*/
		__proto.isEmpty=function(){
			if (this.width <=0 || this.height <=0)return true;
			return false;
		}

		/**???????????????????????? x ??? width ???????????????*/
		__getset(0,__proto,'right',function(){
			return this.x+this.width;
		});

		/**????????????????????????y ??? height ???????????????*/
		__getset(0,__proto,'bottom',function(){
			return this.y+this.height;
		});

		Rectangle._getBoundPointS=function(x,y,width,height){
			var rst=Rectangle._temA;
			rst.length=0;
			if (width==0 || height==0)return rst;
			rst.push(x,y,x+width,y,x,y+height,x+width,y+height);
			return rst;
		}

		Rectangle._getWrapRec=function(pointList,rst){
			if (!pointList || pointList.length < 1)return rst ? rst.setTo(0,0,0,0):Rectangle.TEMP.setTo(0,0,0,0);
			rst=rst ? rst :new Rectangle();
			var i,len=pointList.length,minX,maxX,minY,maxY,tPoint=Point.TEMP;
			minX=minY=99999;
			maxX=maxY=-minX;
			for (i=0;i < len;i+=2){
				tPoint.x=pointList[i];
				tPoint.y=pointList[i+1];
				minX=minX < tPoint.x ? minX :tPoint.x;
				minY=minY < tPoint.y ? minY :tPoint.y;
				maxX=maxX > tPoint.x ? maxX :tPoint.x;
				maxY=maxY > tPoint.y ? maxY :tPoint.y;
			}
			return rst.setTo(minX,minY,maxX-minX,maxY-minY);
		}

		Rectangle.EMPTY=new Rectangle();
		Rectangle.TEMP=new Rectangle();
		Rectangle._temB=[];
		Rectangle._temA=[];
		return Rectangle;
	})()


	/**
	*<code>SoundManager</code> ???????????????????????????
	*/
	//class laya.media.SoundManager
	var SoundManager=(function(){
		function SoundManager(){};
		__class(SoundManager,'laya.media.SoundManager');
		/**
		*??????????????????????????????????????????????????????
		*@param v Boolean ??????
		*
		*/
		/**
		*??????????????????????????????????????????????????????
		*@return
		*/
		__getset(1,SoundManager,'autoStopMusic',function(){
			return SoundManager._autoStopMusic;
			},function(v){
			Laya.stage.off(/*laya.events.Event.BLUR*/"blur",null,SoundManager._stageOnBlur);
			Laya.stage.off(/*laya.events.Event.FOCUS*/"focus",null,SoundManager._stageOnFocus);
			SoundManager._autoStopMusic=v;
			if (v){
				Laya.stage.on(/*laya.events.Event.BLUR*/"blur",null,SoundManager._stageOnBlur);
				Laya.stage.on(/*laya.events.Event.FOCUS*/"focus",null,SoundManager._stageOnFocus);
			}
		});

		/**
		*?????????????????????
		*/
		__getset(1,SoundManager,'muted',function(){
			return SoundManager._muted;
			},function(value){
			if (value){
				SoundManager.stopAll();
			}
			SoundManager._muted=value;
		});

		/**????????????????????????????????????*/
		__getset(1,SoundManager,'musicMuted',function(){
			return SoundManager._musicMuted;
			},function(value){
			if (value){
				if (SoundManager._tMusic)
					SoundManager.stopSound(SoundManager._tMusic);
				SoundManager._musicMuted=value;
				}else {
				SoundManager._musicMuted=value;
				if (SoundManager._tMusic){
					SoundManager.playMusic(SoundManager._tMusic);
				}
			}
		});

		/**??????????????????????????????*/
		__getset(1,SoundManager,'soundMuted',function(){
			return SoundManager._soundMuted;
			},function(value){
			SoundManager._soundMuted=value;
		});

		SoundManager.addChannel=function(channel){
			if (SoundManager._channels.indexOf(channel)>=0)return;
			SoundManager._channels.push(channel);
		}

		SoundManager.removeChannel=function(channel){
			var i=0;
			for (i=SoundManager._channels.length-1;i >=0;i--){
				if (SoundManager._channels[i]==channel){
					SoundManager._channels.splice(i,1);
				}
			}
		}

		SoundManager._stageOnBlur=function(){
			if (SoundManager._musicChannel){
				if (!SoundManager._musicChannel.isStopped){
					SoundManager._blurPaused=true;
					SoundManager._musicLoops=SoundManager._musicChannel.loops;
					SoundManager._musicCompleteHandler=SoundManager._musicChannel.completeHandler;
					SoundManager._musicPosition=SoundManager._musicChannel.position;
					SoundManager._musicChannel.stop();
					Laya.stage.once(/*laya.events.Event.MOUSE_DOWN*/"mousedown",null,SoundManager._stageOnFocus);
				}
			}
		}

		SoundManager._stageOnFocus=function(){
			Laya.stage.off(/*laya.events.Event.MOUSE_DOWN*/"mousedown",null,SoundManager._stageOnFocus);
			if (SoundManager._blurPaused){
				SoundManager.playMusic(SoundManager._tMusic,SoundManager._musicLoops,SoundManager._musicCompleteHandler,SoundManager._musicPosition);
				SoundManager._blurPaused=false;
			}
		}

		SoundManager.playSound=function(url,loops,complete,soundClass,startTime){
			(loops===void 0)&& (loops=1);
			(startTime===void 0)&& (startTime=0);
			if (SoundManager._muted)
				return null;
			if (url==SoundManager._tMusic){
				if (SoundManager._musicMuted)return null;
				}else {
				if (SoundManager._soundMuted)return null;
			};
			var tSound=Laya.loader.getRes(url);
			if (!soundClass)soundClass=SoundManager._soundClass;
			if (!tSound){
				tSound=new soundClass();
				tSound.load(url);
				Loader.cacheRes(url,tSound);
			};
			var channel;
			channel=tSound.play(startTime,loops);
			channel.url=url;
			channel.volume=(url==SoundManager._tMusic)? SoundManager.musicVolume :SoundManager.soundVolume;
			channel.completeHandler=complete;
			return channel;
		}

		SoundManager.destroySound=function(url){
			var tSound=Laya.loader.getRes(url);
			if (tSound){
				Loader.clearRes(url);
				tSound.dispose();
			}
		}

		SoundManager.playMusic=function(url,loops,complete,startTime){
			(loops===void 0)&& (loops=0);
			(startTime===void 0)&& (startTime=0);
			SoundManager._tMusic=url;
			if (SoundManager._musicChannel)
				SoundManager._musicChannel.stop();
			return SoundManager._musicChannel=SoundManager.playSound(url,loops,complete,null,startTime);
		}

		SoundManager.stopSound=function(url){
			var i=0;
			var channel;
			for (i=SoundManager._channels.length-1;i >=0;i--){
				channel=SoundManager._channels[i];
				if (channel.url==url){
					channel.stop();
				}
			}
		}

		SoundManager.stopAll=function(){
			var i=0;
			var channel;
			for (i=SoundManager._channels.length-1;i >=0;i--){
				channel=SoundManager._channels[i];
				channel.stop();
			}
		}

		SoundManager.stopMusic=function(){
			if (SoundManager._musicChannel)
				SoundManager._musicChannel.stop();
		}

		SoundManager.setSoundVolume=function(volume,url){
			if (url){
				SoundManager._setVolume(url,volume);
				}else {
				SoundManager.soundVolume=volume;
			}
		}

		SoundManager.setMusicVolume=function(volume){
			SoundManager.musicVolume=volume;
			SoundManager._setVolume(SoundManager._tMusic,volume);
		}

		SoundManager._setVolume=function(url,volume){
			var i=0;
			var channel;
			for (i=SoundManager._channels.length-1;i >=0;i--){
				channel=SoundManager._channels[i];
				if (channel.url==url){
					channel.volume=volume;
				}
			}
		}

		SoundManager.musicVolume=1;
		SoundManager.soundVolume=1;
		SoundManager._muted=false;
		SoundManager._soundMuted=false;
		SoundManager._musicMuted=false;
		SoundManager._tMusic=null;
		SoundManager._musicChannel=null;
		SoundManager._channels=[];
		SoundManager._autoStopMusic=false;
		SoundManager._blurPaused=false;
		SoundManager._musicLoops=0;
		SoundManager._musicPosition=0;
		SoundManager._musicCompleteHandler=null;
		SoundManager._soundClass=null
		return SoundManager;
	})()


	/**
	*<p> <code>LocalStorage</code> ?????????????????????????????????????????????</p>
	*/
	//class laya.net.LocalStorage
	var LocalStorage=(function(){
		var Storage;
		function LocalStorage(){};
		__class(LocalStorage,'laya.net.LocalStorage');
		LocalStorage.__init__=function(){
			if (!LocalStorage._baseClass){
				LocalStorage._baseClass=Storage;
				Storage.init();
			}
			LocalStorage.items=LocalStorage._baseClass.items;
			LocalStorage.support=LocalStorage._baseClass.support;
		}

		LocalStorage.setItem=function(key,value){
			LocalStorage._baseClass.setItem(key,value);
		}

		LocalStorage.getItem=function(key){
			return LocalStorage._baseClass.getItem(key);
		}

		LocalStorage.setJSON=function(key,value){
			LocalStorage._baseClass.setJSON(key,value);
		}

		LocalStorage.getJSON=function(key){
			return LocalStorage._baseClass.getJSON(key);
		}

		LocalStorage.removeItem=function(key){
			LocalStorage._baseClass.removeItem(key);
		}

		LocalStorage.clear=function(){
			LocalStorage._baseClass.clear();
		}

		LocalStorage._baseClass=null
		LocalStorage.items=null
		LocalStorage.support=false;
		LocalStorage.__init$=function(){
			//class Storage
			Storage=(function(){
				function Storage(){};
				__class(Storage,'');
				Storage.init=function(){
					/*__JS__ */try{Storage.items=window.localStorage;Storage.setItem('laya','1');Storage.removeItem('laya');Storage.support=true;}catch(e){}if(!Storage.support)console.log('LocalStorage is not supprot or browser is private mode.');
				}
				Storage.setItem=function(key,value){
					try {
						Storage.support && Storage.items.setItem(key,value);
						}catch (e){
						console.log("set localStorage failed",e);
					}
				}
				Storage.getItem=function(key){
					return Storage.support ? Storage.items.getItem(key):null;
				}
				Storage.setJSON=function(key,value){
					try {
						Storage.support && Storage.items.setItem(key,JSON.stringify(value));
						}catch (e){
						console.log("set localStorage failed",e);
					}
				}
				Storage.getJSON=function(key){
					return JSON.parse(Storage.support ? Storage.items.getItem(key):null);
				}
				Storage.removeItem=function(key){
					Storage.support && Storage.items.removeItem(key);
				}
				Storage.clear=function(){
					Storage.support && Storage.items.clear();
				}
				Storage.items=null
				Storage.support=true;
				return Storage;
			})()
		}

		return LocalStorage;
	})()


	/**
	*<p> <code>URL</code> ??????????????????????????????</p>
	*/
	//class laya.net.URL
	var URL=(function(){
		function URL(url){
			this._url=null;
			this._path=null;
			this._url=URL.formatURL(url);
			this._path=URL.getPath(url);
		}

		__class(URL,'laya.net.URL');
		var __proto=URL.prototype;
		/**??????????????????*/
		__getset(0,__proto,'path',function(){
			return this._path;
		});

		/**????????????????????????*/
		__getset(0,__proto,'url',function(){
			return this._url;
		});

		URL.formatURL=function(url,base){
			if (URL.customFormat !=null)url=URL.customFormat(url,base);
			if (!url)return "null path";
			if (url.indexOf("data:image")===0)return url;
			if (Render.isConchApp==false){
				URL.version[url] && (url+="?v="+URL.version[url]);
			}
			if (url.charAt(0)=='~')return URL.rootPath+url.substring(1);
			if (URL.isAbsolute(url))return url;
			var retVal=(base || URL.basePath)+url;
			return URL.formatRelativePath(retVal);
		}

		URL.formatRelativePath=function(value){
			if (value.indexOf("../")>-1){
				var parts=value.split("/");
				for (var i=0,len=parts.length;i < len;i++){
					if (parts[i]=='..'){
						parts.splice(i-1,2);
						i-=2;
					}
				}
				return parts.join('/');
			}
			return value;
		}

		URL.isAbsolute=function(url){
			return url.indexOf(":")> 0 || url.charAt(0)=='/';
		}

		URL.getPath=function(url){
			var ofs=url.lastIndexOf('/');
			return ofs > 0 ? url.substr(0,ofs+1):"";
		}

		URL.getFileName=function(url){
			var ofs=url.lastIndexOf('/');
			return ofs > 0 ? url.substr(ofs+1):url;
		}

		URL.version={};
		URL.basePath="";
		URL.rootPath="";
		URL.customFormat=null
		return URL;
	})()


	/**
	*@private
	*<code>Render</code> ?????????????????????????????????????????????????????? Laya.render ?????????
	*/
	//class laya.renders.Render
	var Render=(function(){
		function Render(width,height){
			this._timeId=0;
			var style=Render._mainCanvas.source.style;
			style.position='absolute';
			style.top=style.left="0px";
			style.background="#000000";
			Render._mainCanvas.source.id=Render._mainCanvas.source.id || "layaCanvas";
			var isWebGl=laya.renders.Render.isWebGL;
			isWebGl && Render.WebGL.init(Render._mainCanvas,width,height);
			if (Render._mainCanvas.source.nodeName || laya.renders.Render.isConchApp){
				Browser.container.appendChild(Render._mainCanvas.source);
			}
			Render._context=new RenderContext(width,height,isWebGl ? null :Render._mainCanvas);
			Render._context.ctx.setIsMainContext();
			Browser.window.requestAnimationFrame(loop);
			function loop (){
				Laya.stage._loop();
				Browser.window.requestAnimationFrame(loop);
			}
			Laya.stage.on(/*laya.events.Event.BLUR*/"blur",this,this._onBlur);
			Laya.stage.on(/*laya.events.Event.FOCUS*/"focus",this,this._onFocus);
		}

		__class(Render,'laya.renders.Render');
		var __proto=Render.prototype;
		/**@private */
		__proto._onFocus=function(){
			Browser.window.clearInterval(this._timeId);
		}

		/**@private */
		__proto._onBlur=function(){
			this._timeId=Browser.window.setInterval(this._enterFrame,1000);
		}

		/**@private */
		__proto._enterFrame=function(e){
			Laya.stage._loop();
		}

		/**?????????????????? ??????*/
		__getset(1,Render,'isConchApp',function(){
			return /*__JS__ */(window.ConchRenderType & 0x04)==0x04;
		});

		/**???????????????????????????*/
		__getset(1,Render,'context',function(){
			return Render._context;
		});

		/**????????????????????????????????????????????? ????????????????????????????????? ?????????canvas?????? ???????????????isConchWebGL??????webGL??????*/
		__getset(1,Render,'isConchNode',function(){
			return /*__JS__ */(window.ConchRenderType & 5)==5;
			},function(b){
			if (b){
				/*__JS__ */window.ConchRenderType |=0x01;
				}else {
				/*__JS__ */window.ConchRenderType &=~ 0x01;
			}
		});

		/**?????????????????????????????????WebGL??????*/
		__getset(1,Render,'isConchWebGL',function(){
			return /*__JS__ */window.ConchRenderType==6;
			},function(b){
			if (b){
				Render.isConchNode=false;
				/*__JS__ */window.ConchRenderType |=0x02;
				}else {
				/*__JS__ */window.ConchRenderType &=~ 0x02;
			}
		});

		/**???????????????????????????????????? */
		__getset(1,Render,'canvas',function(){
			return Render._mainCanvas.source;
		});

		Render._context=null
		Render._mainCanvas=null
		Render.WebGL=null
		Render.NODE=0x01;
		Render.WEBGL=0x02;
		Render.CONCH=0x04;
		Render.isWebGL=false;
		Render.is3DMode=false;
		Render.optimizeTextureMemory=function(url,texture){
			return true;
		}

		Render.__init$=function(){
			/*__JS__ */window.ConchRenderType=window.ConchRenderType||1;;
			/*__JS__ */window.ConchRenderType|=(!window.conch?0:0x04);;;
		}

		return Render;
	})()


	/**
	*@private
	*????????????
	*/
	//class laya.renders.RenderContext
	var RenderContext=(function(){
		function RenderContext(width,height,canvas){
			this.x=0;
			this.y=0;
			//this.canvas=null;
			//this.ctx=null;
			this._drawTexture=function(x,y,args){
				if (args[0].loaded)this.ctx.drawTexture(args[0],args[1],args[2],args[3],args[4],x,y);
			}
			this._fillTexture=function(x,y,args){
				if (args[0].loaded)this.ctx.fillTexture(args[0],args[1]+x,args[2]+y,args[3],args[4],args[5],args[6],args[7]);
			}
			this._drawTextureWithTransform=function(x,y,args){
				if (args[0].loaded)this.ctx.drawTextureWithTransform(args[0],args[1],args[2],args[3],args[4],args[5],x,y,args[6]);
			}
			this._fillQuadrangle=function(x,y,args){
				this.ctx.fillQuadrangle(args[0],args[1],args[2],args[3],args[4]);
			}
			this._drawRect=function(x,y,args){
				var ctx=this.ctx;
				if (args[4] !=null){
					ctx.fillStyle=args[4];
					ctx.fillRect(x+args[0],y+args[1],args[2],args[3],null);
				}
				if (args[5] !=null){
					ctx.strokeStyle=args[5];
					ctx.lineWidth=args[6];
					ctx.strokeRect(x+args[0],y+args[1],args[2],args[3],args[6]);
				}
			}
			this._drawPie=function(x,y,args){
				var ctx=this.ctx;
				Render.isWebGL && ctx.setPathId(args[8]);
				ctx.beginPath();
				if (Render.isWebGL){
					ctx.movePath(args[0]+x,args[1]+y);
					ctx.moveTo(0,0);
					}else {
					ctx.moveTo(x+args[0],y+args[1]);
				}
				ctx.arc(x+args[0],y+args[1],args[2],args[3],args[4]);
				ctx.closePath();
				this._fillAndStroke(args[5],args[6],args[7],true);
			}
			this._clipRect=function(x,y,args){
				this.ctx.clipRect(x+args[0],y+args[1],args[2],args[3]);
			}
			this._fillRect=function(x,y,args){
				this.ctx.fillRect(x+args[0],y+args[1],args[2],args[3],args[4]);
			}
			this._drawCircle=function(x,y,args){
				var ctx=this.ctx;
				Render.isWebGL && ctx.setPathId(args[6]);
				Stat.drawCall++;
				ctx.beginPath();
				Render.isWebGL && ctx.movePath(args[0]+x,args[1]+y);
				ctx.arc(args[0]+x,args[1]+y,args[2],0,RenderContext.PI2);
				ctx.closePath();
				this._fillAndStroke(args[3],args[4],args[5],true);
			}
			this._fillCircle=function(x,y,args){
				Stat.drawCall++;
				var ctx=this.ctx;
				ctx.beginPath();
				ctx.fillStyle=args[3];
				ctx.arc(args[0]+x,args[1]+y,args[2],0,RenderContext.PI2);
				ctx.fill();
			}
			this._setShader=function(x,y,args){
				this.ctx.setShader(args[0]);
			}
			this._drawLine=function(x,y,args){
				var ctx=this.ctx;
				Render.isWebGL && ctx.setPathId(args[6]);
				ctx.beginPath();
				ctx.strokeStyle=args[4];
				ctx.lineWidth=args[5];
				if (Render.isWebGL){
					ctx.movePath(x,y);
					ctx.moveTo(args[0],args[1]);
					ctx.lineTo(args[2],args[3]);
					}else {
					ctx.moveTo(x+args[0],y+args[1]);
					ctx.lineTo(x+args[2],y+args[3]);
				}
				ctx.stroke();
			}
			this._drawLines=function(x,y,args){
				var ctx=this.ctx;
				Render.isWebGL && ctx.setPathId(args[5]);
				ctx.beginPath();
				x+=args[0],y+=args[1];
				Render.isWebGL && ctx.movePath(x,y);
				ctx.strokeStyle=args[3];
				ctx.lineWidth=args[4];
				var points=args[2];
				var i=2,n=points.length;
				if (Render.isWebGL){
					ctx.moveTo(points[0],points[1]);
					while (i < n){
						ctx.lineTo(points[i++],points[i++]);
					}
					}else {
					ctx.moveTo(x+points[0],y+points[1]);
					while (i < n){
						ctx.lineTo(x+points[i++],y+points[i++]);
					}
				}
				ctx.stroke();
			}
			this._drawLinesWebGL=function(x,y,args){
				this.ctx.drawLines(x+this.x+args[0],y+this.y+args[1],args[2],args[3],args[4]);
			}
			this._drawCurves=function(x,y,args){
				var ctx=this.ctx;
				Render.isWebGL && ctx.setPathId(-1);
				ctx.beginPath();
				ctx.strokeStyle=args[3];
				ctx.lineWidth=args[4];
				var points=args[2];
				x+=args[0],y+=args[1];
				ctx.moveTo(x+points[0],y+points[1]);
				var i=2,n=points.length;
				while (i < n){
					ctx.quadraticCurveTo(x+points[i++],y+points[i++],x+points[i++],y+points[i++]);
				}
				ctx.stroke();
			}
			this._draw=function(x,y,args){
				args[0].call(null,this,x,y);
			}
			this._transformByMatrix=function(x,y,args){
				this.ctx.transformByMatrix(args[0]);
			}
			this._setTransform=function(x,y,args){
				this.ctx.setTransform(args[0],args[1],args[2],args[3],args[4],args[5]);
			}
			this._setTransformByMatrix=function(x,y,args){
				this.ctx.setTransformByMatrix(args[0]);
			}
			this._save=function(x,y,args){
				this.ctx.save();
			}
			this._restore=function(x,y,args){
				this.ctx.restore();
			}
			this._translate=function(x,y,args){
				this.ctx.translate(args[0],args[1]);
			}
			this._transform=function(x,y,args){
				this.ctx.translate(args[1]+x,args[2]+y);
				var mat=args[0];
				this.ctx.transform(mat.a,mat.b,mat.c,mat.d,mat.tx,mat.ty);
				this.ctx.translate(-x-args[1],-y-args[2]);
			}
			this._rotate=function(x,y,args){
				this.ctx.translate(args[1]+x,args[2]+y);
				this.ctx.rotate(args[0]);
				this.ctx.translate(-x-args[1],-y-args[2]);
			}
			this._scale=function(x,y,args){
				this.ctx.translate(args[2]+x,args[3]+y);
				this.ctx.scale(args[0],args[1]);
				this.ctx.translate(-x-args[2],-y-args[3]);
			}
			this._alpha=function(x,y,args){
				this.ctx.globalAlpha *=args[0];
			}
			this._setAlpha=function(x,y,args){
				this.ctx.globalAlpha=args[0];
			}
			this._fillText=function(x,y,args){
				this.ctx.fillText(args[0],args[1]+x,args[2]+y,args[3],args[4],args[5]);
			}
			this._strokeText=function(x,y,args){
				this.ctx.strokeText(args[0],args[1]+x,args[2]+y,args[3],args[4],args[5],args[6]);
			}
			this._fillBorderText=function(x,y,args){
				this.ctx.fillBorderText(args[0],args[1]+x,args[2]+y,args[3],args[4],args[5],args[6],args[7]);
			}
			this._blendMode=function(x,y,args){
				this.ctx.globalCompositeOperation=args[0];
			}
			this._beginClip=function(x,y,args){
				this.ctx.beginClip && this.ctx.beginClip(x+args[0],y+args[1],args[2],args[3]);
			}
			this._setIBVB=function(x,y,args){
				this.ctx.setIBVB(args[0]+x,args[1]+y,args[2],args[3],args[4],args[5],args[6],args[7]);
			}
			this._fillTrangles=function(x,y,args){
				this.ctx.fillTrangles(args[0],args[1]+x,args[2]+y,args[3],args[4]);
			}
			this._drawPath=function(x,y,args){
				var ctx=this.ctx;
				Render.isWebGL && ctx.setPathId(-1);
				ctx.beginPath();
				x+=args[0],y+=args[1];
				var paths=args[2];
				for (var i=0,n=paths.length;i < n;i++){
					var path=paths[i];
					switch (path[0]){
						case "moveTo":
							ctx.moveTo(x+path[1],y+path[2]);
							break ;
						case "lineTo":
							ctx.lineTo(x+path[1],y+path[2]);
							break ;
						case "arcTo":
							ctx.arcTo(x+path[1],y+path[2],x+path[3],y+path[4],path[5]);
							break ;
						case "closePath":
							ctx.closePath();
							break ;
						}
				};
				var brush=args[3];
				if (brush !=null){
					ctx.fillStyle=brush.fillStyle;
					ctx.fill();
				};
				var pen=args[4];
				if (pen !=null){
					ctx.strokeStyle=pen.strokeStyle;
					ctx.lineWidth=pen.lineWidth || 1;
					ctx.lineJoin=pen.lineJoin;
					ctx.lineCap=pen.lineCap;
					ctx.miterLimit=pen.miterLimit;
					ctx.stroke();
				}
			}
			this.drawPoly=function(x,y,args){
				this.ctx.drawPoly(x+this.x+args[0],y+this.y+args[1],args[2],args[3],args[4],args[5],args[6]);
			}
			this._drawPoly=function(x,y,args){
				var ctx=this.ctx;
				var points=args[2];
				var i=2,n=points.length;
				if (Render.isWebGL){
					ctx.setPathId(args[6]);
					ctx.beginPath();
					x+=args[0],y+=args[1];
					ctx.movePath(x,y);
					ctx.moveTo(points[0],points[1]);
					while (i < n){
						ctx.lineTo(points[i++],points[i++]);
					}
					}else {
					ctx.beginPath();
					x+=args[0],y+=args[1];
					ctx.moveTo(x+points[0],y+points[1]);
					while (i < n){
						ctx.lineTo(x+points[i++],y+points[i++]);
					}
				}
				ctx.closePath();
				this._fillAndStroke(args[3],args[4],args[5],args[7]);
			}
			this._drawSkin=function(x,y,args){
				var tSprite=args[0];
				if (tSprite){
					var ctx=this.ctx;
					tSprite.render(ctx,x,y);
				}
			}
			this._drawParticle=function(x,y,args){
				this.ctx.drawParticle(x+this.x,y+this.y,args[0]);
			}
			if (canvas){
				this.ctx=canvas.getContext('2d');
				}else {
				canvas=HTMLCanvas.create("3D");
				this.ctx=RunDriver.createWebGLContext2D(canvas);
				canvas._setContext(this.ctx);
			}
			canvas.size(width,height);
			this.canvas=canvas;
		}

		__class(RenderContext,'laya.renders.RenderContext');
		var __proto=RenderContext.prototype;
		/**????????????????????????*/
		__proto.destroy=function(){
			if (this.canvas){
				this.canvas.destroy();
				this.canvas=null;
			}
			if (this.ctx){
				this.ctx.destroy();
				this.ctx=null;
			}
		}

		__proto.drawTexture=function(tex,x,y,width,height){
			if (tex.loaded)this.ctx.drawTexture(tex,x,y,width,height,this.x,this.y);
		}

		__proto._drawTextures=function(x,y,args){
			if (args[0].loaded)this.ctx.drawTextures(args[0],args[1],x+this.x,y+this.y);
		}

		__proto.drawTextureWithTransform=function(tex,x,y,width,height,m,alpha){
			if (tex.loaded)this.ctx.drawTextureWithTransform(tex,x,y,width,height,m,this.x,this.y,alpha);
		}

		__proto.fillQuadrangle=function(tex,x,y,point4,m){
			this.ctx.fillQuadrangle(tex,x,y,point4,m);
		}

		__proto.drawCanvas=function(canvas,x,y,width,height){
			this.ctx.drawCanvas(canvas,x+this.x,y+this.y,width,height);
		}

		__proto.drawRect=function(x,y,width,height,color,lineWidth){
			(lineWidth===void 0)&& (lineWidth=1);
			var ctx=this.ctx;
			ctx.strokeStyle=color;
			ctx.lineWidth=lineWidth;
			ctx.strokeRect(x+this.x,y+this.y,width,height,lineWidth);
		}

		__proto._fillAndStroke=function(fillColor,strokeColor,lineWidth,isConvexPolygon){
			(isConvexPolygon===void 0)&& (isConvexPolygon=false);
			var ctx=this.ctx;
			if (fillColor !=null){
				ctx.fillStyle=fillColor;
				if (Render.isWebGL){
					ctx.fill(isConvexPolygon);
					}else {
					ctx.fill();
				}
			}
			if (strokeColor !=null && lineWidth > 0){
				ctx.strokeStyle=strokeColor;
				ctx.lineWidth=lineWidth;
				ctx.stroke();
			}
		}

		//ctx.translate(-x-args[0],-y-args[1]);
		__proto.clipRect=function(x,y,width,height){
			this.ctx.clipRect(x+this.x,y+this.y,width,height);
		}

		__proto.fillRect=function(x,y,width,height,fillStyle){
			this.ctx.fillRect(x+this.x,y+this.y,width,height,fillStyle);
		}

		__proto.drawCircle=function(x,y,radius,color,lineWidth){
			(lineWidth===void 0)&& (lineWidth=1);
			Stat.drawCall++;
			var ctx=this.ctx;
			ctx.beginPath();
			ctx.strokeStyle=color;
			ctx.lineWidth=lineWidth;
			ctx.arc(x+this.x,y+this.y,radius,0,RenderContext.PI2);
			ctx.stroke();
		}

		__proto.fillCircle=function(x,y,radius,color){
			Stat.drawCall++;
			var ctx=this.ctx;
			ctx.beginPath();
			ctx.fillStyle=color;
			ctx.arc(x+this.x,y+this.y,radius,0,RenderContext.PI2);
			ctx.fill();
		}

		__proto.setShader=function(shader){
			this.ctx.setShader(shader);
		}

		__proto.drawLine=function(fromX,fromY,toX,toY,color,lineWidth){
			(lineWidth===void 0)&& (lineWidth=1);
			var ctx=this.ctx;
			ctx.beginPath();
			ctx.strokeStyle=color;
			ctx.lineWidth=lineWidth;
			ctx.moveTo(this.x+fromX,this.y+fromY);
			ctx.lineTo(this.x+toX,this.y+toY);
			ctx.stroke();
		}

		__proto.clear=function(){
			this.ctx.clear();
		}

		__proto.transformByMatrix=function(value){
			this.ctx.transformByMatrix(value);
		}

		__proto.setTransform=function(a,b,c,d,tx,ty){
			this.ctx.setTransform(a,b,c,d,tx,ty);
		}

		__proto.setTransformByMatrix=function(value){
			this.ctx.setTransformByMatrix(value);
		}

		__proto.save=function(){
			this.ctx.save();
		}

		__proto.restore=function(){
			this.ctx.restore();
		}

		__proto.translate=function(x,y){
			this.ctx.translate(x,y);
		}

		__proto.transform=function(a,b,c,d,tx,ty){
			this.ctx.transform(a,b,c,d,tx,ty);
		}

		__proto.rotate=function(angle){
			this.ctx.rotate(angle);
		}

		__proto.scale=function(scaleX,scaleY){
			this.ctx.scale(scaleX,scaleY);
		}

		__proto.alpha=function(value){
			this.ctx.globalAlpha *=value;
		}

		__proto.setAlpha=function(value){
			this.ctx.globalAlpha=value;
		}

		__proto.fillWords=function(words,x,y,font,color){
			this.ctx.fillWords(words,x,y,font,color);
		}

		__proto.fillText=function(text,x,y,font,color,textAlign){
			this.ctx.fillText(text,x+this.x,y+this.y,font,color,textAlign);
		}

		__proto.strokeText=function(text,x,y,font,color,lineWidth,textAlign){
			this.ctx.strokeText(text,x+this.x,y+this.y,font,color,lineWidth,textAlign);
		}

		__proto.blendMode=function(type){
			this.ctx.globalCompositeOperation=type;
		}

		__proto.flush=function(){
			this.ctx.flush && this.ctx.flush();
		}

		__proto.addRenderObject=function(o){
			this.ctx.addRenderObject(o);
		}

		__proto.beginClip=function(x,y,w,h){
			this.ctx.beginClip && this.ctx.beginClip(x,y,w,h);
		}

		__proto.endClip=function(){
			this.ctx.endClip && this.ctx.endClip();
		}

		__proto.fillTrangles=function(x,y,args){
			this.ctx.fillTrangles(args[0],args[1],args[2],args[3],args.length > 4 ? args[4] :null);
		}

		RenderContext.PI2=2 *Math.PI;
		return RenderContext;
	})()


	/**
	*@private
	*???????????????
	*/
	//class laya.renders.RenderSprite
	var RenderSprite=(function(){
		function RenderSprite(type,next){
			//this._next=null;
			//this._fun=null;
			this._next=next || RenderSprite.NORENDER;
			switch (type){
				case 0:
					this._fun=this._no;
					return;
				case 0x01:
					this._fun=this._image;
					return;
				case 0x02:
					this._fun=this._alpha;
					return;
				case 0x04:
					this._fun=this._transform;
					return;
				case 0x20:
					this._fun=this._blend;
					return;
				case 0x08:
					this._fun=this._canvas;
					return;
				case 0x40:
					this._fun=this._clip;
					return;
				case 0x80:
					this._fun=this._style;
					return;
				case 0x100:
					this._fun=this._graphics;
					return;
				case 0x800:
					this._fun=this._childs;
					return;
				case 0x200:
					this._fun=this._custom;
					return;
				case 0x01 | 0x100:
					this._fun=this._image2;
					return;
				case 0x01 | 0x04 | 0x100:
					this._fun=this._image2;
					return;
				case 0x10:
					this._fun=Filter._filter;
					return;
				case 0x11111:
					this._fun=RenderSprite._initRenderFun;
					return;
				}
			this.onCreate(type);
		}

		__class(RenderSprite,'laya.renders.RenderSprite');
		var __proto=RenderSprite.prototype;
		__proto.onCreate=function(type){}
		__proto._style=function(sprite,context,x,y){
			sprite._style.render(sprite,context,x,y);
			var next=this._next;
			next._fun.call(next,sprite,context,x,y);
		}

		__proto._no=function(sprite,context,x,y){}
		__proto._custom=function(sprite,context,x,y){
			sprite.customRender(context,x,y);
			var tf=sprite._style._tf;
			this._next._fun.call(this._next,sprite,context,x-tf.translateX,y-tf.translateY);
		}

		__proto._clip=function(sprite,context,x,y){
			var next=this._next;
			if (next==RenderSprite.NORENDER)return;
			var r=sprite._style.scrollRect;
			context.ctx.save();
			context.ctx.clipRect(x,y,r.width,r.height);
			next._fun.call(next,sprite,context,x-r.x,y-r.y);
			context.ctx.restore();
		}

		__proto._blend=function(sprite,context,x,y){
			var style=sprite._style;
			if (style.blendMode){
				context.ctx.globalCompositeOperation=style.blendMode;
			};
			var next=this._next;
			next._fun.call(next,sprite,context,x,y);
			var mask=sprite.mask;
			if (mask){
				context.ctx.globalCompositeOperation="destination-in";
				if (mask.numChildren > 0 || !mask.graphics._isOnlyOne()){
					mask.cacheAsBitmap=true;
				}
				mask.render(context,x,y);
			}
			context.ctx.globalCompositeOperation="source-over";
		}

		__proto._graphics=function(sprite,context,x,y){
			var tf=sprite._style._tf;
			sprite._graphics && sprite._graphics._render(sprite,context,x-tf.translateX,y-tf.translateY);
			var next=this._next;
			next._fun.call(next,sprite,context,x,y);
		}

		__proto._image=function(sprite,context,x,y){
			var style=sprite._style;
			context.ctx.drawTexture2(x,y,style._tf.translateX,style._tf.translateY,sprite.transform,style.alpha,style.blendMode,sprite._graphics._one);
		}

		__proto._image2=function(sprite,context,x,y){
			var tf=sprite._style._tf;
			context.ctx.drawTexture2(x,y,tf.translateX,tf.translateY,sprite.transform,1,null,sprite._graphics._one);
		}

		__proto._alpha=function(sprite,context,x,y){
			var style=sprite._style;
			var alpha;
			if ((alpha=style.alpha)> 0.01){
				var temp=context.ctx.globalAlpha;
				context.ctx.globalAlpha *=alpha;
				var next=this._next;
				next._fun.call(next,sprite,context,x,y);
				context.ctx.globalAlpha=temp;
			}
		}

		__proto._transform=function(sprite,context,x,y){
			var transform=sprite.transform,_next=this._next;
			if (transform && _next !=RenderSprite.NORENDER){
				context.save();
				context.transform(transform.a,transform.b,transform.c,transform.d,transform.tx+x,transform.ty+y);
				_next._fun.call(_next,sprite,context,0,0);
				context.restore();
			}else
			_next._fun.call(_next,sprite,context,x,y);
		}

		__proto._childs=function(sprite,context,x,y){
			var style=sprite._style;
			x+=-style._tf.translateX+style.paddingLeft;
			y+=-style._tf.translateY+style.paddingTop;
			if (style._calculation){
				var words=sprite._getWords();
				words && context.fillWords(words,x,y,(style).font,(style).color);
			};
			var childs=sprite._childs,n=childs.length,ele;
			if (!sprite.viewport || !sprite.optimizeScrollRect){
				for (var i=0;i < n;++i)
				(ele=(childs [i]))._style.visible && ele.render(context,x,y);
				}else {
				var rect=sprite.viewport;
				var left=rect.x;
				var top=rect.y;
				var right=rect.right;
				var bottom=rect.bottom;
				var _x=NaN,_y=NaN;
				for (i=0;i < n;++i){
					if ((ele=childs [i]).visible && ((_x=ele._x)< right && (_x+ele.width)> left && (_y=ele._y)< bottom && (_y+ele.height)> top)){
						ele.render(context,x,y);
					}
				}
			}
		}

		__proto._canvas=function(sprite,context,x,y){
			var _cacheCanvas=sprite._$P.cacheCanvas;
			var _next=this._next;
			if (!_cacheCanvas){
				_next._fun.call(_next,sprite,tx,x,y);
				return;
			};
			var tx=_cacheCanvas.ctx;
			var _repaint=sprite._needRepaint()|| (!tx);
			var canvas;
			var left;
			var top;
			var tRec;
			_cacheCanvas.type==='bitmap' ? (Stat.canvasBitmap++):(Stat.canvasNormal++);
			if (_repaint){
				if (!_cacheCanvas._cacheRec)
					_cacheCanvas._cacheRec=new Rectangle();
				var w,h;
				tRec=sprite.getSelfBounds();
				tRec.x-=sprite.pivotX;
				tRec.y-=sprite.pivotY;
				tRec.x-=10;
				tRec.y-=10;
				tRec.width+=20;
				tRec.height+=20;
				tRec.x=Math.floor(tRec.x+x)-x;
				tRec.y=Math.floor(tRec.y+y)-y;
				tRec.width=Math.floor(tRec.width);
				tRec.height=Math.floor(tRec.height);
				_cacheCanvas._cacheRec.copyFrom(tRec);
				tRec=_cacheCanvas._cacheRec;
				var scaleX=Render.isWebGL ? 1 :Browser.pixelRatio *Laya.stage.clientScaleX;
				var scaleY=Render.isWebGL ? 1 :Browser.pixelRatio *Laya.stage.clientScaleY;
				if (!Render.isWebGL){
					var chainScaleX=1;
					var chainScaleY=1;
					var tar;
					tar=sprite;
					while (tar && tar !=Laya.stage){
						chainScaleX *=tar.scaleX;
						chainScaleY *=tar.scaleY;
						tar=tar.parent;
					}
					if(Render.isWebGL){
						if (chainScaleX < 1)scaleX *=chainScaleX;
						if (chainScaleY < 1)scaleY *=chainScaleY;
						}else{
						if (chainScaleX > 1)scaleX *=chainScaleX;
						if (chainScaleY > 1)scaleY *=chainScaleY;
					}
				}
				w=tRec.width *scaleX;
				h=tRec.height *scaleY;
				left=tRec.x;
				top=tRec.y;
				if (Render.isWebGL && _cacheCanvas.type==='bitmap' && (w > 2048 || h > 2048)){
					console.log("cache bitmap size larger than 2048,cache ignored");
					if(_cacheCanvas.ctx){
						Pool.recover("RenderContext",_cacheCanvas.ctx);
						_cacheCanvas.ctx=null;
					}
					_next._fun.call(_next,sprite,context,x,y);
					return;
				}
				if (!tx){
					tx=_cacheCanvas.ctx=Pool.getItem("RenderContext")|| new RenderContext(w,h,HTMLCanvas.create(/*laya.resource.HTMLCanvas.TYPEAUTO*/"AUTO"));
					tx.ctx.sprite=sprite;
				}
				canvas=tx.canvas;
				if (_cacheCanvas.type==='bitmap')canvas.context.asBitmap=true;
				canvas.clear();
				(canvas.width !=w || canvas.height !=h)&& canvas.size(w,h);
				var t;
				if (scaleX !=1 || scaleY !=1){
					var ctx=(tx).ctx;
					ctx.save();
					ctx.scale(scaleX,scaleY);
					if (!Render.isConchWebGL && Render.isConchApp){
						t=sprite._$P.cf;
						t && ctx.setFilterMatrix && ctx.setFilterMatrix(t._mat,t._alpha);
					}
					_next._fun.call(_next,sprite,tx,-left,-top);
					ctx.restore();
					if (!Render.isConchApp || Render.isConchWebGL)sprite._applyFilters();
					}else {
					ctx=(tx).ctx;
					if (!Render.isConchWebGL && Render.isConchApp){
						t=sprite._$P.cf;
						t && ctx.setFilterMatrix && ctx.setFilterMatrix(t._mat,t._alpha);
					}
					_next._fun.call(_next,sprite,tx,-left,-top);
					if (!Render.isConchApp || Render.isConchWebGL)sprite._applyFilters();
				}
				if (sprite._$P.staticCache)_cacheCanvas.reCache=false;
				Stat.canvasReCache++;
				}else {
				tRec=_cacheCanvas._cacheRec;
				left=tRec.x;
				top=tRec.y;
				canvas=tx.canvas;
			}
			context.drawCanvas(canvas,x+left,y+top,tRec.width,tRec.height);
		}

		RenderSprite.__init__=function(){
			var i=0,len=0;
			var initRender;
			initRender=RunDriver.createRenderSprite(0x11111,null);
			len=RenderSprite.renders.length=0x800 *2;
			for (i=0;i < len;i++)
			RenderSprite.renders[i]=initRender;
			RenderSprite.renders[0]=RunDriver.createRenderSprite(0,null);
			function _initSame (value,o){
				var n=0;
				for (var i=0;i < value.length;i++){
					n |=value[i];
					RenderSprite.renders[n]=o;
				}
			}
			_initSame([0x01,0x100,0x04,0x02],new RenderSprite(0x01,null));
			RenderSprite.renders[0x01 | 0x100]=RunDriver.createRenderSprite(0x01 | 0x100,null);
			RenderSprite.renders[0x01 | 0x04 | 0x100]=new RenderSprite(0x01 | 0x04 | 0x100,null);
		}

		RenderSprite._initRenderFun=function(sprite,context,x,y){
			var type=sprite._renderType;
			var r=RenderSprite.renders[type]=RenderSprite._getTypeRender(type);
			r._fun(sprite,context,x,y);
		}

		RenderSprite._getTypeRender=function(type){
			var rst=null;
			var tType=0x800;
			while (tType > 1){
				if (tType & type)
					rst=RunDriver.createRenderSprite(tType,rst);
				tType=tType >> 1;
			}
			return rst;
		}

		RenderSprite.IMAGE=0x01;
		RenderSprite.ALPHA=0x02;
		RenderSprite.TRANSFORM=0x04;
		RenderSprite.CANVAS=0x08;
		RenderSprite.FILTERS=0x10;
		RenderSprite.BLEND=0x20;
		RenderSprite.CLIP=0x40;
		RenderSprite.STYLE=0x80;
		RenderSprite.GRAPHICS=0x100;
		RenderSprite.CUSTOM=0x200;
		RenderSprite.CHILDS=0x800;
		RenderSprite.INIT=0x11111;
		RenderSprite.renders=[];
		RenderSprite.NORENDER=new RenderSprite(0,null);
		return RenderSprite;
	})()


	/**
	*@private
	*Context?????????
	*/
	//class laya.resource.Context
	var Context=(function(){
		function Context(){
			//this._canvas=null;
			this._repaint=false;
		}

		__class(Context,'laya.resource.Context');
		var __proto=Context.prototype;
		__proto.setIsMainContext=function(){}
		__proto.drawTextures=function(tex,pos,tx,ty){
			Stat.drawCall+=pos.length / 2;
			var w=tex.bitmap.width;
			var h=tex.bitmap.height;
			for (var i=0,sz=pos.length;i < sz;i+=2){
				this.drawTexture(tex,pos[i],pos[i+1],w,h,tx,ty);
			}
		}

		/***@private */
		__proto.drawCanvas=function(canvas,x,y,width,height){
			Stat.drawCall++;
			this.drawImage(canvas.source,x,y,width,height);
		}

		/***@private */
		__proto.fillRect=function(x,y,width,height,style){
			Stat.drawCall++;
			style && (this.fillStyle=style);
			/*__JS__ */this.__fillRect(x,y,width,height);
		}

		/***@private */
		__proto.fillText=function(text,x,y,font,color,textAlign){
			Stat.drawCall++;
			if (arguments.length > 3 && font !=null){
				this.font=font;
				this.fillStyle=color;
				/*__JS__ */this.textAlign=textAlign;
				this.textBaseline="top";
			}
			/*__JS__ */this.__fillText(text,x,y);
		}

		/***@private */
		__proto.fillBorderText=function(text,x,y,font,fillColor,borderColor,lineWidth,textAlign){
			Stat.drawCall++;
			this.font=font;
			this.fillStyle=fillColor;
			this.textBaseline="top";
			/*__JS__ */this.strokeStyle=borderColor;
			/*__JS__ */this.lineWidth=lineWidth;
			/*__JS__ */this.textAlign=textAlign;
			/*__JS__ */this.__strokeText(text,x,y);
			/*__JS__ */this.__fillText(text,x,y);
		}

		/***@private */
		__proto.strokeText=function(text,x,y,font,color,lineWidth,textAlign){
			Stat.drawCall++;
			if (arguments.length > 3 && font !=null){
				this.font=font;
				/*__JS__ */this.strokeStyle=color;
				/*__JS__ */this.lineWidth=lineWidth;
				/*__JS__ */this.textAlign=textAlign;
				this.textBaseline="top";
			}
			/*__JS__ */this.__strokeText(text,x,y);
		}

		/***@private */
		__proto.transformByMatrix=function(value){
			this.transform(value.a,value.b,value.c,value.d,value.tx,value.ty);
		}

		/***@private */
		__proto.setTransformByMatrix=function(value){
			this.setTransform(value.a,value.b,value.c,value.d,value.tx,value.ty);
		}

		/***@private */
		__proto.clipRect=function(x,y,width,height){
			Stat.drawCall++;
			this.beginPath();
			this.rect(x,y,width,height);
			this.clip();
		}

		/***@private */
		__proto.drawTexture=function(tex,x,y,width,height,tx,ty){
			Stat.drawCall++;
			var uv=tex.uv,w=tex.bitmap.width,h=tex.bitmap.height;
			this.drawImage(tex.source,uv[0] *w,uv[1] *h,(uv[2]-uv[0])*w,(uv[5]-uv[3])*h,x+tx,y+ty,width,height);
		}

		/***@private */
		__proto.drawTextureWithTransform=function(tex,x,y,width,height,m,tx,ty,alpha){
			Stat.drawCall++;
			var uv=tex.uv,w=tex.bitmap.width,h=tex.bitmap.height;
			this.save();
			alpha !=1 && (this.globalAlpha *=alpha);
			if (m){
				this.transform(m.a,m.b,m.c,m.d,m.tx+tx,m.ty+ty);
				this.drawImage(tex.source,uv[0] *w,uv[1] *h,(uv[2]-uv[0])*w,(uv[5]-uv[3])*h,x ,y,width,height);
				}else {
				this.drawImage(tex.source,uv[0] *w,uv[1] *h,(uv[2]-uv[0])*w,(uv[5]-uv[3])*h,x+tx ,y+ty,width,height);
			}
			this.restore();
		}

		/***@private */
		__proto.drawTexture2=function(x,y,pivotX,pivotY,m,alpha,blendMode,args2){
			'use strict';
			var tex=args2[0];
			if (!(tex.loaded && tex.bitmap && tex.source)){
				return;
			}
			Stat.drawCall++;
			var alphaChanged=alpha!==1;
			if (alphaChanged){
				var temp=this.globalAlpha;
				this.globalAlpha *=alpha;
			};
			var uv=tex.uv,w=tex.bitmap.width,h=tex.bitmap.height;
			if (m){
				this.save();
				this.transform(m.a,m.b,m.c,m.d,m.tx+x,m.ty+y);
				this.drawImage(tex.source,uv[0] *w,uv[1] *h,(uv[2]-uv[0])*w,(uv[5]-uv[3])*h,args2[1]-pivotX ,args2[2]-pivotY,args2[3],args2[4]);
				this.restore();
				}else {
				this.drawImage(tex.source,uv[0] *w,uv[1] *h,(uv[2]-uv[0])*w,(uv[5]-uv[3])*h,args2[1]-pivotX+x ,args2[2]-pivotY+y,args2[3],args2[4]);
			}
			if (alphaChanged)this.globalAlpha=temp;
		}

		__proto.fillTexture=function(texture,x,y,width,height,type,offset,other){
			if (!other.pat){
				if (texture.uv !=Texture.DEF_UV){
					var canvas=new HTMLCanvas("2D");
					canvas.getContext('2d');
					canvas.size(texture.width,texture.height);
					canvas.context.drawTexture(texture,0,0,texture.width,texture.height,0,0);
					texture=new Texture(canvas);
				}
				other.pat=this.createPattern(texture.bitmap.source,type);
			};
			var oX=x,oY=y;
			var sX=0,sY=0;
			if (offset){
				oX+=offset.x % texture.width;
				oY+=offset.y % texture.height;
				sX-=offset.x % texture.width;
				sY-=offset.y % texture.height;
			}
			this.translate(oX,oY);
			this.fillRect(sX,sY,width,height,other.pat);
			this.translate(-oX,-oY);
		}

		/***@private */
		__proto.flush=function(){
			return 0;
		}

		/***@private */
		__proto.fillWords=function(words,x,y,font,color){
			font && (this.font=font);
			color && (this.fillStyle=color);
			var _this=this;
			this.textBaseline="top";
			/*__JS__ */this.textAlign='left';
			for (var i=0,n=words.length;i < n;i++){
				var a=words[i];
				/*__JS__ */this.__fillText(a.char,a.x+x,a.y+y);
			}
		}

		/***@private */
		__proto.destroy=function(){
			/*__JS__ */this.canvas.width=this.canvas.height=0;
		}

		/***@private */
		__proto.clear=function(){
			this.clearRect(0,0,this._canvas.width,this._canvas.height);
			this._repaint=false;
		}

		Context.__init__=function(to){
			var from=laya.resource.Context.prototype;
			to=to || /*__JS__ */CanvasRenderingContext2D.prototype;
			to.__fillText=to.fillText;
			to.__fillRect=to.fillRect;
			to.__strokeText=to.strokeText;
			var funs=['drawTextures','fillWords','setIsMainContext','fillRect','strokeText','fillTexture','fillText','transformByMatrix','setTransformByMatrix','clipRect','drawTexture','drawTexture2','drawTextureWithTransform','flush','clear','destroy','drawCanvas','fillBorderText'];
			funs.forEach(function(i){
				to[i]=from[i] || to[i];
			});
		}

		Context._default=new Context();
		return Context;
	})()


	/**
	*<code>ResourceManager</code> ??????????????????????????????????????????????????????????????????
	*/
	//class laya.resource.ResourceManager
	var ResourceManager=(function(){
		function ResourceManager(){
			this._id=0;
			this._name=null;
			this._resources=null;
			this._memorySize=0;
			this._garbageCollectionRate=NaN;
			this._isOverflow=false;
			this.autoRelease=false;
			this.autoReleaseMaxSize=0;
			this._id=++ResourceManager._uniqueIDCounter;
			this._name="Content Manager";
			ResourceManager._isResourceManagersSorted=false;
			this._memorySize=0;
			this._isOverflow=false;
			this.autoRelease=false;
			this.autoReleaseMaxSize=1024 *1024 *512;
			this._garbageCollectionRate=0.2;
			ResourceManager._resourceManagers.push(this);
			this._resources=[];
		}

		__class(ResourceManager,'laya.resource.ResourceManager');
		var __proto=ResourceManager.prototype;
		Laya.imps(__proto,{"laya.resource.IDispose":true})
		/**
		*??????????????????????????? Resource ?????????
		*@param ?????????
		*@return ?????? Resource ?????????
		*/
		__proto.getResourceByIndex=function(index){
			return this._resources[index];
		}

		/**
		*?????????????????????????????????????????????
		*@return ???????????????
		*/
		__proto.getResourcesLength=function(){
			return this._resources.length;
		}

		/**
		*?????????????????????
		*@param resource ????????????????????? Resource ?????????
		*@return ?????????????????????
		*/
		__proto.addResource=function(resource){
			if (resource.resourceManager)
				resource.resourceManager.removeResource(resource);
			var index=this._resources.indexOf(resource);
			if (index===-1){
				resource._resourceManager=this;
				this._resources.push(resource);
				this.addSize(resource.memorySize);
				return true;
			}
			return false;
		}

		/**
		*?????????????????????
		*@param resource ????????????????????? Resource ??????
		*@return ?????????????????????
		*/
		__proto.removeResource=function(resource){
			var index=this._resources.indexOf(resource);
			if (index!==-1){
				this._resources.splice(index,1);
				resource._resourceManager=null;
				this._memorySize-=resource.memorySize;
				return true;
			}
			return false;
		}

		/**
		*??????????????????????????????????????????
		*/
		__proto.unload=function(){
			var tempResources=this._resources.slice(0,this._resources.length);
			for (var i=0;i < tempResources.length;i++){
				var resource=tempResources[i];
				resource.dispose();
			}
			tempResources.length=0;
		}

		/**
		*?????????????????????
		*@param newName ?????????????????????????????????????????????-copy??????
		*/
		__proto.setUniqueName=function(newName){
			var isUnique=true;
			for (var i=0;i < ResourceManager._resourceManagers.length;i++){
				if (ResourceManager._resourceManagers[i]._name!==newName || ResourceManager._resourceManagers[i]===this)
					continue ;
				isUnique=false;
				return;
			}
			if (isUnique){
				if (this.name !=newName){
					this.name=newName;
					ResourceManager._isResourceManagersSorted=false;
				}
				}else{
				this.setUniqueName(newName.concat("-copy"));
			}
		}

		/**???????????????*/
		__proto.dispose=function(){
			if (this===ResourceManager._systemResourceManager)
				throw new Error("systemResourceManager??????????????????");
			ResourceManager._resourceManagers.splice(ResourceManager._resourceManagers.indexOf(this),1);
			ResourceManager._isResourceManagersSorted=false;
			var tempResources=this._resources.slice(0,this._resources.length);
			for (var i=0;i < tempResources.length;i++){
				var resource=tempResources[i];
				resource.resourceManager.removeResource(resource);
				resource.dispose();
			}
			tempResources.length=0;
		}

		/**
		*???????????????
		*@param add ??????????????????????????????
		*/
		__proto.addSize=function(add){
			if (add){
				if (this.autoRelease && add > 0)
					((this._memorySize+add)> this.autoReleaseMaxSize)&& (this.garbageCollection((1-this._garbageCollectionRate)*this.autoReleaseMaxSize));
				this._memorySize+=add;
			}
		}

		/**
		*???????????????
		*@param reserveSize ???????????????
		*/
		__proto.garbageCollection=function(reserveSize){
			var all=this._resources;
			all=all.slice();
			all.sort(function(a,b){
				if (!a || !b)
					throw new Error("a???b???????????????");
				if (a.released && b.released)
					return 0;
				else if (a.released)
				return 1;
				else if (b.released)
				return-1;
				return a.lastUseFrameCount-b.lastUseFrameCount;
			});
			var currentFrameCount=Stat.loopCount;
			for (var i=0,n=all.length;i < n;i++){
				var resou=all[i];
				if (currentFrameCount-resou.lastUseFrameCount > 1){
					resou.releaseResource();
					}else {
					if (this._memorySize >=reserveSize)
						this._isOverflow=true;
					return;
				}
				if (this._memorySize < reserveSize){
					this._isOverflow=false;
					return;
				}
			}
		}

		/**
		*???????????? ID ???
		*/
		__getset(0,__proto,'id',function(){
			return this._id;
		});

		/**
		*?????????
		*/
		__getset(0,__proto,'name',function(){
			return this._name;
			},function(value){
			if ((value || value!=="")&& this._name!==value){
				this._name=value;
				ResourceManager._isResourceManagersSorted=false;
			}
		});

		/**
		*??????????????????????????????????????????????????????????????????
		*/
		__getset(0,__proto,'memorySize',function(){
			return this._memorySize;
		});

		/**
		*????????????????????????
		*/
		__getset(1,ResourceManager,'systemResourceManager',function(){
			(ResourceManager._systemResourceManager===null)&& (ResourceManager._systemResourceManager=new ResourceManager(),ResourceManager._systemResourceManager._name="System Resource Manager");
			return ResourceManager._systemResourceManager;
		});

		/**
		*????????????????????????????????????
		*/
		__getset(1,ResourceManager,'sortedResourceManagersByName',function(){
			if (!ResourceManager._isResourceManagersSorted){
				ResourceManager._isResourceManagersSorted=true;
				ResourceManager._resourceManagers.sort(ResourceManager.compareResourceManagersByName);
			}
			return ResourceManager._resourceManagers;
		});

		ResourceManager.__init__=function(){
			ResourceManager.currentResourceManager=ResourceManager.systemResourceManager;
		}

		ResourceManager.getLoadedResourceManagerByIndex=function(index){
			return ResourceManager._resourceManagers[index];
		}

		ResourceManager.getLoadedResourceManagersCount=function(){
			return ResourceManager._resourceManagers.length;
		}

		ResourceManager.recreateContentManagers=function(force){
			(force===void 0)&& (force=false);
			var temp=ResourceManager.currentResourceManager;
			for (var i=0;i < ResourceManager._resourceManagers.length;i++){
				ResourceManager.currentResourceManager=ResourceManager._resourceManagers[i];
				for (var j=0;j < ResourceManager.currentResourceManager._resources.length;j++){
					ResourceManager.currentResourceManager._resources[j].releaseResource(force);
					ResourceManager.currentResourceManager._resources[j].activeResource(force);
				}
			}
			ResourceManager.currentResourceManager=temp;
		}

		ResourceManager.releaseContentManagers=function(force){
			(force===void 0)&& (force=false);
			var temp=ResourceManager.currentResourceManager;
			for (var i=0;i < ResourceManager._resourceManagers.length;i++){
				ResourceManager.currentResourceManager=ResourceManager._resourceManagers[i];
				for (var j=0;j < ResourceManager.currentResourceManager._resources.length;j++){
					var resource=ResourceManager.currentResourceManager._resources[j];
					(!resource.released)&& (resource.releaseResource(force));
				}
			}
			ResourceManager.currentResourceManager=temp;
		}

		ResourceManager.compareResourceManagersByName=function(left,right){
			if (left==right)
				return 0;
			var x=left._name;
			var y=right._name;
			if (x==null){
				if (y==null)
					return 0;
				else
				return-1;
				}else {
				if (y==null)
					return 1;
				else {
					var retval=x.localeCompare(y);
					if (retval !=0)
						return retval;
					else {
						right.setUniqueName(y);
						y=right._name;
						return x.localeCompare(y);
					}
				}
			}
		}

		ResourceManager._uniqueIDCounter=0;
		ResourceManager._systemResourceManager=null
		ResourceManager._isResourceManagersSorted=false;
		ResourceManager._resourceManagers=[];
		ResourceManager.currentResourceManager=null
		return ResourceManager;
	})()


	/**
	*@private
	*/
	//class laya.resource.WXCanvas
	var WXCanvas=(function(){
		function WXCanvas(id){
			this._ctx=null;
			this._id=null;
			this.style={};
			this._id=id;
		}

		__class(WXCanvas,'laya.resource.WXCanvas');
		var __proto=WXCanvas.prototype;
		__proto.getContext=function(){
			var wx=laya.resource.WXCanvas.wx;
			var ctx=wx.createContext();
			ctx.id=this._id;
			ctx.fillRect=function (x,y,w,h){
				this.rect(x,y,w,h);
				this.fill();
			}
			ctx.strokeRect=function (x,y,w,h){
				this.rect(x,y,w,h);
				this.stroke();
			}
			ctx.___drawImage=ctx.drawImage;
			ctx.drawImage=function (){
				var img=arguments[0].tempFilePath;
				if (img==null)return;
				switch(arguments.length){
					case 3:
						this.___drawImage(img,arguments[1],arguments[2],arguments[0].width,arguments[0].height);
						return;
					case 5:
						this.___drawImage(img,arguments[1],arguments[2],arguments[3],arguments[4]);
						return;
					case 9:
						this.___drawImage(img,arguments[5],arguments[6],arguments[7],arguments[8]);
						return;
					}
			}
			Object.defineProperty(ctx,"strokeStyle",{set:function (value){this.setStrokeStyle(value)},enumerable:false });
			Object.defineProperty(ctx,"fillStyle",{set:function (value){this.setFillStyle(value)},enumerable:false });
			Object.defineProperty(ctx,"fontSize",{set:function (value){this.setFontSize(value)},enumerable:false });
			Object.defineProperty(ctx,"lineWidth",{set:function (value){this.setLineWidth(value)},enumerable:false });
			Context.__init__(ctx);
			ctx.flush=function (){
				wx.drawCanvas({canvasId:this.id,actions:this.getActions()});
			}
			return ctx;
		}

		__proto.oncontextmenu=function(e){}
		__proto.addEventListener=function(){}
		__getset(0,__proto,'id',function(){
			return this._id;
			},function(value){
			this._id=value;
		});

		WXCanvas.wx=null;
		return WXCanvas;
	})()


	/**
	*@private
	*/
	//class laya.system.System
	var System=(function(){
		function System(){};
		__class(System,'laya.system.System');
		System.changeDefinition=function(name,classObj){
			Laya[name]=classObj;
			var str=name+"=classObj";
			/*__JS__ */eval(str);
		}

		System.__init__=function(){
			if (Render.isConchApp){
				/*__JS__ */conch.disableConchResManager();
				/*__JS__ */conch.disableConchAutoRestoreLostedDevice();
			}
		}

		return System;
	})()


	SoundManager;
	/**
	*<code>Browser</code> ???????????????????????????????????????????????? js ????????????????????????
	*/
	//class laya.utils.Browser
	var Browser=(function(){
		function Browser(){};
		__class(Browser,'laya.utils.Browser');
		/**??????????????????*/
		__getset(1,Browser,'pixelRatio',function(){
			Browser.__init__();
			return RunDriver.getPixelRatio();
		});

		/**????????????????????????*/
		__getset(1,Browser,'height',function(){
			Browser.__init__();
			return ((Laya.stage && Laya.stage.canvasRotation)? Browser.clientWidth :Browser.clientHeight)*Browser.pixelRatio;
		});

		/**????????????????????????*/
		__getset(1,Browser,'clientWidth',function(){
			Browser.__init__();
			return Browser.window.innerWidth || Browser.document.body.clientWidth;
		});

		/**??????????????? window ??????????????????*/
		__getset(1,Browser,'window',function(){
			Browser.__init__();
			return Browser._window;
		});

		/**????????????????????????*/
		__getset(1,Browser,'clientHeight',function(){
			Browser.__init__();
			return Browser.window.innerHeight || Browser.document.body.clientHeight || Browser.document.documentElement.clientHeight;
		});

		/**???????????????????????????*/
		__getset(1,Browser,'width',function(){
			Browser.__init__();
			return ((Laya.stage && Laya.stage.canvasRotation)? Browser.clientHeight :Browser.clientWidth)*Browser.pixelRatio;
		});

		/**????????????????????????????????????????????????????????????????????????*/
		__getset(1,Browser,'container',function(){
			Browser.__init__();
			if (!Browser._container){
				Browser._container=Browser.createElement("div");
				Browser._container.id="layaContainer";
				Browser.document.body.appendChild(Browser._container);
			}
			return Browser._container;
			},function(value){
			Browser._container=value;
		});

		/**??????????????? document ??????????????????*/
		__getset(1,Browser,'document',function(){
			Browser.__init__();
			return Browser._document;
		});

		Browser.__init__=function(){
			SoundManager;
			if (Browser._window)return;
			Browser._window=RunDriver.getWindow();
			Browser._document=Browser.window.document;
			Browser._window.addEventListener('message',function(e){
				laya.utils.Browser._onMessage(e);
			},false);
			/*__JS__ */Browser.document.__createElement=Browser.document.createElement;
			/*__JS__ */window.requestAnimationFrame=(function(){return window.requestAnimationFrame || window.webkitRequestAnimationFrame ||window.mozRequestAnimationFrame || window.oRequestAnimationFrame ||function (c){return window.setTimeout(c,1000 / 60);};})();
			/*__JS__ */var $BS=window.document.body.style;$BS.margin=0;$BS.overflow='hidden';;
			/*__JS__ */var metas=window.document.getElementsByTagName('meta');;
			/*__JS__ */var i=0,flag=false,content='width=device-width,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no';;
			/*__JS__ */while(i<metas.length){var meta=metas[i];if(meta.name=='viewport'){meta.content=content;flag=true;break;}i++;};
			/*__JS__ */if(!flag){meta=document.createElement('meta');meta.name='viewport',meta.content=content;document.getElementsByTagName('head')[0].appendChild(meta);};
			Browser.userAgent=/*[SAFE]*/ Browser.window.navigator.userAgent;
			Browser.u=/*[SAFE]*/ Browser.userAgent;
			Browser.onIOS=/*[SAFE]*/ !!Browser.u.match(/\(i[^;]+;(U;)? CPU.+Mac OS X/);
			Browser.onMobile=/*[SAFE]*/ Browser.u.indexOf("Mobile")>-1;
			Browser.onIPhone=/*[SAFE]*/ Browser.u.indexOf("iPhone")>-1;
			Browser.onIPad=/*[SAFE]*/ Browser.u.indexOf("iPad")>-1;
			Browser.onAndriod=/*[SAFE]*/ Browser.u.indexOf('Android')>-1 || Browser.u.indexOf('Adr')>-1;
			Browser.onWP=/*[SAFE]*/ Browser.u.indexOf("Windows Phone")>-1;
			Browser.onQQBrowser=/*[SAFE]*/ Browser.u.indexOf("QQBrowser")>-1;
			Browser.onMQQBrowser=/*[SAFE]*/ Browser.u.indexOf("MQQBrowser")>-1;
			Browser.onWeiXin=/*[SAFE]*/ Browser.u.indexOf('MicroMessenger')>-1;
			Browser.onPC=/*[SAFE]*/ !Browser.onMobile;
			Browser.onSafari=/*[SAFE]*/ !!Browser.u.match(/Version\/\d+\.\d\x20Mobile\/\S+\x20Safari/);
			Browser.httpProtocol=/*[SAFE]*/ Browser.window.location.protocol=="http:";
			Browser.webAudioEnabled=/*[SAFE]*/ Browser.window["AudioContext"] || Browser.window["webkitAudioContext"] || Browser.window["mozAudioContext"] ? true :false;
			Browser.soundType=/*[SAFE]*/ Browser.webAudioEnabled ? "WEBAUDIOSOUND" :"AUDIOSOUND";
			/*__JS__ */Sound=Browser.webAudioEnabled?WebAudioSound:AudioSound;;
			/*__JS__ */if (Browser.webAudioEnabled)WebAudioSound.initWebAudio();;
			/*__JS__ */Browser.enableTouch=(('ontouchstart' in window)|| window.DocumentTouch && document instanceof DocumentTouch);
			/*__JS__ */window.focus();
			/*__JS__ */SoundManager._soundClass=Sound;;
			var MainCanvas=null;
			if (Browser.window.MainCanvasID){
				var _wx=/*__JS__ */wx;
				if (_wx && !_wx.createContext)_wx=null;
				if ((WXCanvas.wx=_wx)!=null){
					MainCanvas=new WXCanvas(Browser.window.MainCanvasID);
					var from=Context.prototype;
					from.flush=null;
					Browser.window.Image=function (){
						this.setSrc=function (url){
							this.__src=url;
							var _this=this;
							this.success();
						}
						this.success=function (res){
							this.width=200;
							this.height=200;
							this.tempFilePath=res ? res.tempFilePath :this.__src;
							this.onload && this.onload();
						}
						this.getSrc=function (){
							return this.__src;
						}
						Object.defineProperty(this,"src",{get:this.getSrc,set:this.setSrc,enumerable:false });
					}
					}else {
					MainCanvas=Browser.document.getElementById(Browser.window.MainCanvasID);
				}
			}
			Render._mainCanvas=Render._mainCanvas || HTMLCanvas.create('2D',MainCanvas);
			if (Browser.canvas)return;
			Browser.canvas=HTMLCanvas.create('2D');
			Browser.context=Browser.canvas.getContext('2d');
		}

		Browser._onMessage=function(e){
			if (!e.data)return;
			if (e.data.name=="size"){
				Browser.window.innerWidth=e.data.width;
				Browser.window.innerHeight=e.data.height;
				Browser.window.__innerHeight=e.data.clientHeight;
				if (!Browser.document.createEvent){
					console.log("no document.createEvent");
					return;
				};
				var evt=Browser.document.createEvent("HTMLEvents");
				evt.initEvent("resize",false,false);
				Browser.window.dispatchEvent(evt);
				return;
			}
		}

		Browser.createElement=function(type){
			Browser.__init__();
			return Browser.document.__createElement(type);
		}

		Browser.getElementById=function(type){
			Browser.__init__();
			return Browser.document.getElementById(type);
		}

		Browser.removeElement=function(ele){
			if (ele && ele.parentNode)ele.parentNode.removeChild(ele);
		}

		Browser.now=function(){
			return RunDriver.now();
		}

		Browser._window=null
		Browser._document=null
		Browser._container=null
		Browser.userAgent=null
		Browser.u=null
		Browser.onIOS=false;
		Browser.onMobile=false;
		Browser.onIPhone=false;
		Browser.onIPad=false;
		Browser.onAndriod=false;
		Browser.onWP=false;
		Browser.onQQBrowser=false;
		Browser.onMQQBrowser=false;
		Browser.onSafari=false;
		Browser.onWeiXin=false;
		Browser.onPC=false;
		Browser.httpProtocol=false;
		Browser.webAudioEnabled=false;
		Browser.soundType=null
		Browser.enableTouch=false;
		Browser.canvas=null
		Browser.context=null
		Browser.__init$=function(){
			AudioSound;
			WebAudioSound;
		}

		return Browser;
	})()


	/**
	*
	*<code>Byte</code> ????????????????????????????????????????????????????????????????????????????????????
	*/
	//class laya.utils.Byte
	var Byte=(function(){
		function Byte(data){
			this._xd_=true;
			this._allocated_=8;
			//this._d_=null;
			//this._u8d_=null;
			this._pos_=0;
			this._length=0;
			if (data){
				this._u8d_=new Uint8Array(data);
				this._d_=new DataView(this._u8d_.buffer);
				this._length=this._d_.byteLength;
				}else {
				this.___resizeBuffer(this._allocated_);
			}
		}

		__class(Byte,'laya.utils.Byte');
		var __proto=Byte.prototype;
		/**@private */
		__proto.___resizeBuffer=function(len){
			try {
				var newByteView=new Uint8Array(len);
				if (this._u8d_ !=null){
					if (this._u8d_.length <=len)newByteView.set(this._u8d_);
					else newByteView.set(this._u8d_.subarray(0,len));
				}
				this._u8d_=newByteView;
				this._d_=new DataView(newByteView.buffer);
				}catch (err){
				throw "___resizeBuffer err:"+len;
			}
		}

		/**
		*?????????????????????
		*@return
		*/
		__proto.getString=function(){
			return this.rUTF(this.getUint16());
		}

		/**
		*??????????????????????????????????????????????????????????????? Float32Array ???????????????????????????
		*@param start ???????????????
		*@param len ??????????????????????????????
		*@return ????????? Float32Array ?????????
		*/
		__proto.getFloat32Array=function(start,len){
			var v=new Float32Array(this._d_.buffer.slice(start,start+len));
			this._pos_+=len;
			return v;
		}

		/**
		*??????????????????????????????????????????????????????????????? Uint8Array ???????????????????????????
		*@param start ???????????????
		*@param len ??????????????????????????????
		*@return ????????? Uint8Array ?????????
		*/
		__proto.getUint8Array=function(start,len){
			var v=new Uint8Array(this._d_.buffer.slice(start,start+len));
			this._pos_+=len;
			return v;
		}

		/**
		*??????????????????????????????????????????????????????????????? Int16Array ???????????????????????????
		*@param start ???????????????
		*@param len ??????????????????????????????
		*@return ????????? Uint8Array ?????????
		*/
		__proto.getInt16Array=function(start,len){
			var v=new Int16Array(this._d_.buffer.slice(start,start+len));
			this._pos_+=len;
			return v;
		}

		/**
		*??????????????????????????????????????? Float32 ??????
		*@return Float32 ??????
		*/
		__proto.getFloat32=function(){
			var v=this._d_.getFloat32(this._pos_,this._xd_);
			this._pos_+=4;
			return v;
		}

		__proto.getFloat64=function(){
			var v=this._d_.getFloat64(this._pos_,this._xd_);
			this._pos_+=8;
			return v;
		}

		/**
		*??????????????????????????????????????? Float32 ??????
		*@param value ??????????????? Float32 ??????
		*/
		__proto.writeFloat32=function(value){
			this.ensureWrite(this._pos_+4);
			this._d_.setFloat32(this._pos_,value,this._xd_);
			this._pos_+=4;
		}

		__proto.writeFloat64=function(value){
			this.ensureWrite(this._pos_+8);
			this._d_.setFloat64(this._pos_,value,this._xd_);
			this._pos_+=8;
		}

		/**
		*??????????????????????????????????????? Int32 ??????
		*@return Int32 ??????
		*/
		__proto.getInt32=function(){
			var float=this._d_.getInt32(this._pos_,this._xd_);
			this._pos_+=4;
			return float;
		}

		/**
		*??????????????????????????????????????? Uint32 ??????
		*@return Uint32 ??????
		*/
		__proto.getUint32=function(){
			var v=this._d_.getUint32(this._pos_,this._xd_);
			this._pos_+=4;
			return v;
		}

		/**
		*??????????????????????????????????????? Int32 ??????
		*@param value ??????????????? Int32 ??????
		*/
		__proto.writeInt32=function(value){
			this.ensureWrite(this._pos_+4);
			this._d_.setInt32(this._pos_,value,this._xd_);
			this._pos_+=4;
		}

		/**
		*??????????????????????????????????????? Uint32 ??????
		*@param value ??????????????? Uint32 ??????
		*/
		__proto.writeUint32=function(value){
			this.ensureWrite(this._pos_+4);
			this._d_.setUint32(this._pos_,value,this._xd_);
			this._pos_+=4;
		}

		/**
		*??????????????????????????????????????? Int16 ??????
		*@return Int16 ??????
		*/
		__proto.getInt16=function(){
			var us=this._d_.getInt16(this._pos_,this._xd_);
			this._pos_+=2;
			return us;
		}

		/**
		*??????????????????????????????????????? Uint16 ??????
		*@return Uint16 ??????
		*/
		__proto.getUint16=function(){
			var us=this._d_.getUint16(this._pos_,this._xd_);
			this._pos_+=2;
			return us;
		}

		/**
		*??????????????????????????????????????? Uint16 ??????
		*@param value ???????????????Uint16 ??????
		*/
		__proto.writeUint16=function(value){
			this.ensureWrite(this._pos_+2);
			this._d_.setUint16(this._pos_,value,this._xd_);
			this._pos_+=2;
		}

		/**
		*??????????????????????????????????????? Int16 ??????
		*@param value ??????????????? Int16 ??????
		*/
		__proto.writeInt16=function(value){
			this.ensureWrite(this._pos_+2);
			this._d_.setInt16(this._pos_,value,this._xd_);
			this._pos_+=2;
		}

		/**
		*??????????????????????????????????????? Uint8 ??????
		*@return Uint8 ??????
		*/
		__proto.getUint8=function(){
			return this._d_.getUint8(this._pos_++);
		}

		/**
		*??????????????????????????????????????? Uint8 ??????
		*@param value ??????????????? Uint8 ??????
		*/
		__proto.writeUint8=function(value){
			this.ensureWrite(this._pos_+1);
			this._d_.setUint8(this._pos_,value,this._xd_);
			this._pos_++;
		}

		/**
		*@private
		*???????????????????????? Uint8 ??????
		*@param pos ?????????????????????
		*@return Uint8 ??????
		*/
		__proto._getUInt8=function(pos){
			return this._d_.getUint8(pos);
		}

		/**
		*@private
		*???????????????????????? Uint16 ??????
		*@param pos ?????????????????????
		*@return Uint16 ??????
		*/
		__proto._getUint16=function(pos){
			return this._d_.getUint16(pos,this._xd_);
		}

		/**
		*@private
		*?????? getFloat32()??????6???????????????????????????????????? Matrix ?????????
		*@return Matrix ?????????
		*/
		__proto._getMatrix=function(){
			var rst=new Matrix(this.getFloat32(),this.getFloat32(),this.getFloat32(),this.getFloat32(),this.getFloat32(),this.getFloat32());
			return rst;
		}

		/**
		*@private
		*????????????????????? UTF ???????????????
		*@param len ????????????????????????
		*@return ?????????????????????
		*/
		__proto.rUTF=function(len){
			var v="",max=this._pos_+len,c=0,c2=0,c3=0,f=String.fromCharCode;
			var u=this._u8d_,i=0;
			while (this._pos_ < max){
				c=u[this._pos_++];
				if (c < 0x80){
					if (c !=0){
						v+=f(c);
					}
					}else if (c < 0xE0){
					v+=f(((c & 0x3F)<< 6)| (u[this._pos_++] & 0x7F));
					}else if (c < 0xF0){
					c2=u[this._pos_++];
					v+=f(((c & 0x1F)<< 12)| ((c2 & 0x7F)<< 6)| (u[this._pos_++] & 0x7F));
					}else {
					c2=u[this._pos_++];
					c3=u[this._pos_++];
					v+=f(((c & 0x0F)<< 18)| ((c2 & 0x7F)<< 12)| ((c3 << 6)& 0x7F)| (u[this._pos_++] & 0x7F));
				}
				i++;
			}
			return v;
		}

		/**
		*??????????????????
		*@param len
		*@return
		*/
		__proto.getCustomString=function(len){
			var v="",ulen=0,c=0,c2=0,f=String.fromCharCode;
			var u=this._u8d_,i=0;
			while (len > 0){
				c=u[this._pos_];
				if (c < 0x80){
					v+=f(c);
					this._pos_++;
					len--;
					}else {
					ulen=c-0x80;
					this._pos_++;
					len-=ulen;
					while (ulen > 0){
						c=u[this._pos_++];
						c2=u[this._pos_++];
						v+=f((c2 << 8)| c);
						ulen--;
					}
				}
			}
			return v;
		}

		/**
		*???????????????
		*/
		__proto.clear=function(){
			this._pos_=0;
			this.length=0;
		}

		/**
		*@private
		*?????????????????? ArrayBuffer ?????????
		*@return
		*/
		__proto.__getBuffer=function(){
			return this._d_.buffer;
		}

		/**
		*??????????????????????????????????????????????????? readUTFBytes ???????????????
		*@param value ????????????????????????
		*/
		__proto.writeUTFBytes=function(value){
			value=value+"";
			for (var i=0,sz=value.length;i < sz;i++){
				var c=value.charCodeAt(i);
				if (c <=0x7F){
					this.writeByte(c);
					}else if (c <=0x7FF){
					this.writeByte(0xC0 | (c >> 6));
					this.writeByte(0x80 | (c & 63));
					}else if (c <=0xFFFF){
					this.writeByte(0xE0 | (c >> 12));
					this.writeByte(0x80 | ((c >> 6)& 63));
					this.writeByte(0x80 | (c & 63));
					}else {
					this.writeByte(0xF0 | (c >> 18));
					this.writeByte(0x80 | ((c >> 12)& 63));
					this.writeByte(0x80 | ((c >> 6)& 63));
					this.writeByte(0x80 | (c & 63));
				}
			}
		}

		/**
		*??? UTF-8 ???????????????????????????
		*@param value ???????????????????????????
		*/
		__proto.writeUTFString=function(value){
			var tPos=0;
			tPos=this.pos;
			this.writeUint16(1);
			this.writeUTFBytes(value);
			var dPos=0;
			dPos=this.pos-tPos-2;
			this._d_.setUint16(tPos,dPos,this._xd_);
		}

		/**
		*@private
		*?????? UTF-8 ????????????
		*@return ?????????????????????
		*/
		__proto.readUTFString=function(){
			var tPos=0;
			tPos=this.pos;
			var len=0;
			len=this.getUint16();
			return this.readUTFBytes(len);
		}

		/**
		*?????? UTF-8 ????????????
		*@return ?????????????????????
		*/
		__proto.getUTFString=function(){
			return this.readUTFString();
		}

		/**
		*@private
		*???????????????????????? writeUTFBytes ???????????????????????????
		*@param len ?????????buffer??????,???????????????????????????????????????
		*@return ?????????????????????
		*/
		__proto.readUTFBytes=function(len){
			(len===void 0)&& (len=-1);
			if(len==0)return "";
			len=len > 0 ? len :this.bytesAvailable;
			return this.rUTF(len);
		}

		/**
		*???????????????????????? writeUTFBytes ???????????????????????????
		*@param len ?????????buffer??????,???????????????????????????????????????
		*@return ?????????????????????
		*/
		__proto.getUTFBytes=function(len){
			(len===void 0)&& (len=-1);
			return this.readUTFBytes(len);
		}

		/**
		*????????????????????????????????????
		*@param value
		*/
		__proto.writeByte=function(value){
			this.ensureWrite(this._pos_+1);
			this._d_.setInt8(this._pos_,value);
			this._pos_+=1;
		}

		/**
		*@private
		*?????????????????????????????????
		*/
		__proto.readByte=function(){
			return this._d_.getInt8(this._pos_++);
		}

		/**
		*?????????????????????????????????
		*/
		__proto.getByte=function(){
			return this.readByte();
		}

		/**
		*??????????????????????????????
		*@param lengthToEnsure ??????????????????
		*/
		__proto.ensureWrite=function(lengthToEnsure){
			if (this._length < lengthToEnsure)this._length=lengthToEnsure;
			if (this._allocated_ < lengthToEnsure)this.length=lengthToEnsure;
		}

		/**
		*??????????????? Arraybuffer ?????????
		*@param arraybuffer ??????????????? Arraybuffer ?????????
		*@param offset ?????????????????????????????????
		*@param length ??????????????????????????????
		*/
		__proto.writeArrayBuffer=function(arraybuffer,offset,length){
			(offset===void 0)&& (offset=0);
			(length===void 0)&& (length=0);
			if (offset < 0 || length < 0)throw "writeArrayBuffer error - Out of bounds";
			if (length==0)length=arraybuffer.byteLength-offset;
			this.ensureWrite(this._pos_+length);
			var uint8array=new Uint8Array(arraybuffer);
			this._u8d_.set(uint8array.subarray(offset,offset+length),this._pos_);
			this._pos_+=length;
		}

		/**
		*?????????????????? ArrayBuffer??????,????????????????????????????????? ???
		*/
		__getset(0,__proto,'buffer',function(){
			var rstBuffer=this._d_.buffer;
			if (rstBuffer.byteLength==this.length)return rstBuffer;
			return rstBuffer.slice(0,this.length);
		});

		/**
		*???????????????
		*/
		__getset(0,__proto,'endian',function(){
			return this._xd_ ? "littleEndian" :"bigEndian";
			},function(endianStr){
			this._xd_=(endianStr=="littleEndian");
		});

		/**
		*???????????????
		*/
		__getset(0,__proto,'length',function(){
			return this._length;
			},function(value){
			if (this._allocated_ < value)
				this.___resizeBuffer(this._allocated_=Math.floor(Math.max(value,this._allocated_ *2)));
			else if (this._allocated_ > value)
			this.___resizeBuffer(this._allocated_=value);
			this._length=value;
		});

		/**
		*???????????????????????????
		*/
		__getset(0,__proto,'pos',function(){
			return this._pos_;
			},function(value){
			this._pos_=value;
			this._d_.byteOffset=value;
		});

		/**
		*?????????????????????????????????????????????????????????????????????
		*/
		__getset(0,__proto,'bytesAvailable',function(){
			return this.length-this._pos_;
		});

		Byte.getSystemEndian=function(){
			if (!Byte._sysEndian){
				var buffer=new ArrayBuffer(2);
				new DataView(buffer).setInt16(0,256,true);
				Byte._sysEndian=(new Int16Array(buffer))[0]===256 ? /*CLASS CONST:laya.utils.Byte.LITTLE_ENDIAN*/"littleEndian" :/*CLASS CONST:laya.utils.Byte.BIG_ENDIAN*/"bigEndian";
			}
			return Byte._sysEndian;
		}

		Byte.BIG_ENDIAN="bigEndian";
		Byte.LITTLE_ENDIAN="littleEndian";
		Byte._sysEndian=null;
		return Byte;
	})()


	/**
	*???????????????????????????
	*/
	//class laya.utils.CacheManger
	var CacheManger=(function(){
		function CacheManger(){}
		__class(CacheManger,'laya.utils.CacheManger');
		CacheManger.regCacheByFunction=function(disposeFunction,getCacheListFunction){
			CacheManger.unRegCacheByFunction(disposeFunction,getCacheListFunction);
			var cache;
			cache={
				tryDispose:disposeFunction,
				getCacheList:getCacheListFunction
			};
			CacheManger._cacheList.push(cache);
		}

		CacheManger.unRegCacheByFunction=function(disposeFunction,getCacheListFunction){
			var i=0,len=0;
			len=CacheManger._cacheList.length;
			for (i=0;i < len;i++){
				if (CacheManger._cacheList[i].tryDispose==disposeFunction && CacheManger._cacheList[i].getCacheList==getCacheListFunction){
					CacheManger._cacheList.splice(i,1);
					return;
				}
			}
		}

		CacheManger.forceDispose=function(){
			var i=0,len=CacheManger._cacheList.length;
			for(i=0;i<len;i++){
				CacheManger._cacheList[i].tryDispose(true);
			}
		}

		CacheManger.beginCheck=function(waitTime){
			(waitTime===void 0)&& (waitTime=15000);
			Laya.timer.loop(waitTime,null,CacheManger._checkLoop);
		}

		CacheManger.stopCheck=function(){
			Laya.timer.clear(null,CacheManger._checkLoop);
		}

		CacheManger._checkLoop=function(){
			var cacheList=CacheManger._cacheList;
			if (cacheList.length < 1)return;
			var tTime=Browser.now();
			var count=0;
			var len=0;
			len=count=cacheList.length;
			while (count > 0){
				CacheManger._index++;
				CacheManger._index=CacheManger._index % len;
				cacheList[CacheManger._index].tryDispose(false);
				if (Browser.now()-tTime > CacheManger.loopTimeLimit)break ;
				count--;
			}
		}

		CacheManger.loopTimeLimit=2;
		CacheManger._cacheList=[];
		CacheManger._index=0;
		return CacheManger;
	})()


	/**
	*<code>ClassUtils</code> ????????????????????????
	*/
	//class laya.utils.ClassUtils
	var ClassUtils=(function(){
		function ClassUtils(){};
		__class(ClassUtils,'laya.utils.ClassUtils');
		ClassUtils.regClass=function(className,classDef){
			ClassUtils._classMap[className]=classDef;
		}

		ClassUtils.getRegClass=function(className){
			return ClassUtils._classMap[className];
		}

		ClassUtils.getInstance=function(className){
			var compClass=ClassUtils.getClass(className);
			if (compClass)
				return new compClass();
			else
			console.log("[error] Undefined class:",className);
			return null;
		}

		ClassUtils.createByJson=function(json,node,root,customHandler,instanceHandler){
			if ((typeof json=='string'))
				json=JSON.parse(json);
			var props=json.props;
			if (!node){
				node=instanceHandler ? instanceHandler.runWith(json):ClassUtils.getInstance(props.runtime || json.type);
				if (!node)
					return null;
			};
			var child=json.child;
			if (child){
				for (var i=0,n=child.length;i < n;i++){
					var data=child[i];
					if ((data.props.name==="render" || data.props.renderType==="render")&& node["_$set_itemRender"])
						node.itemRender=data;
					else {
						if (data.type=="Graphic"){
							ClassUtils.addGraphicsToSprite(data,node);
							}else if (ClassUtils.isDrawType(data.type)){
							ClassUtils.addGraphicToSprite(data,node,true);
							}else {
							var tChild=ClassUtils.createByJson(data,null,root,customHandler,instanceHandler)
							if (data.type=="Script"){
								tChild["owner"]=node;
								}else if (data.props.renderType=="mask"){
								node.mask=tChild;
								}else {
								node.addChild(tChild);
							}
						}
					}
				}
			}
			if (props){
				for (var prop in props){
					var value=props[prop];
					if (prop==="var" && root){
						root[value]=node;
						}else if ((value instanceof Array)&& (typeof (node[prop])=='function')){
						node[prop].apply(node,value);
						}else {
						node[prop]=value;
					}
				}
			}
			if (customHandler && json.customProps){
				customHandler.runWith([node,json]);
			}
			if (node["created"])
				node.created();
			return node;
		}

		ClassUtils.addGraphicsToSprite=function(graphicO,sprite){
			var graphics;
			graphics=graphicO.child;
			if (!graphics || graphics.length < 1)
				return;
			var g;
			g=ClassUtils._getGraphicsFromSprite(graphicO,sprite);
			var ox=0;
			var oy=0;
			if (graphicO.props){
				ox=ClassUtils._getObjVar(graphicO.props,"x",0);
				oy=ClassUtils._getObjVar(graphicO.props,"y",0);
			}
			if (ox !=0 && oy !=0){
				g.translate(ox,oy);
			};
			var i=0,len=0;
			len=graphics.length;
			for (i=0;i < len;i++){
				ClassUtils._addGraphicToGraphics(graphics[i],g);
			}
			if (ox !=0 && oy !=0){
				g.translate(-ox,-oy);
			}
		}

		ClassUtils.addGraphicToSprite=function(graphicO,sprite,isChild){
			(isChild===void 0)&& (isChild=false);
			var g;
			g=isChild ? ClassUtils._getGraphicsFromSprite(graphicO,sprite):sprite.graphics;
			ClassUtils._addGraphicToGraphics(graphicO,g);
		}

		ClassUtils._getGraphicsFromSprite=function(dataO,sprite){
			var g;
			if (!dataO || !dataO.props)
				return sprite.graphics;
			var propsName;
			propsName=dataO.props.renderType;
			switch (propsName){
				case "hit":
				case "unHit":;
					var hitArea;
					if (!sprite.hitArea){
						sprite.hitArea=new HitArea();
					}
					hitArea=sprite.hitArea;
					if (!hitArea[propsName]){
						hitArea[propsName]=new Graphics();
					}
					g=hitArea[propsName];
					break ;
				default :
				}
			if (!g)
				g=sprite.graphics;
			return g;
		}

		ClassUtils._getTransformData=function(propsO){
			var m;
			if (propsO.hasOwnProperty("pivotX")|| propsO.hasOwnProperty("pivotY")){
				m=m || new Matrix();
				m.translate(-ClassUtils._getObjVar(propsO,"pivotX",0),-ClassUtils._getObjVar(propsO,"pivotY",0));
			};
			var sx=ClassUtils._getObjVar(propsO,"scaleX",1),sy=ClassUtils._getObjVar(propsO,"scaleY",1);
			var rotate=ClassUtils._getObjVar(propsO,"rotation",0);
			var skewX=ClassUtils._getObjVar(propsO,"skewX",0);
			var skewY=ClassUtils._getObjVar(propsO,"skewY",0);
			if (sx !=1 || sy !=1 || rotate !=0){
				m=m || new Matrix();
				m.scale(sx,sy);
				m.rotate(rotate *0.0174532922222222);
			}
			return m;
		}

		ClassUtils._addGraphicToGraphics=function(graphicO,graphic){
			var propsO;
			propsO=graphicO.props;
			if (!propsO)
				return;
			var drawConfig;
			drawConfig=ClassUtils.DrawTypeDic[graphicO.type];
			if (!drawConfig)
				return;
			var g;
			g=graphic;
			var m;
			var params=ClassUtils._getParams(propsO,drawConfig[1],drawConfig[2],drawConfig[3]);
			m=ClassUtils._tM;
			if (m || ClassUtils._alpha !=1){
				g.save();
				if (m)
					g.transform(m);
				if (ClassUtils._alpha !=1)
					g.alpha(ClassUtils._alpha);
			}
			g[drawConfig[0]].apply(g,params);
			if (m || ClassUtils._alpha !=1){
				g.restore();
			}
		}

		ClassUtils._adptLineData=function(params){
			params[2]=parseFloat(params[0])+parseFloat(params[2]);
			params[3]=parseFloat(params[1])+parseFloat(params[3]);
			return params;
		}

		ClassUtils._adptTextureData=function(params){
			params[0]=Loader.getRes(params[0]);
			return params;
		}

		ClassUtils._adptLinesData=function(params){
			params[2]=ClassUtils._getPointListByStr(params[2]);
			return params;
		}

		ClassUtils.isDrawType=function(type){
			if (type=="Image")
				return false;
			return ClassUtils.DrawTypeDic.hasOwnProperty(type);
		}

		ClassUtils._getParams=function(obj,params,xPos,adptFun){
			(xPos===void 0)&& (xPos=0);
			var rst;
			rst=ClassUtils._temParam;
			rst.length=params.length;
			var i=0,len=0;
			len=params.length;
			for (i=0;i < len;i++){
				rst[i]=ClassUtils._getObjVar(obj,params[i][0],params[i][1]);
			}
			ClassUtils._alpha=ClassUtils._getObjVar(obj,"alpha",1);
			var m;
			m=ClassUtils._getTransformData(obj);
			if (m){
				if (!xPos)xPos=0;
				m.translate(rst[xPos],rst[xPos+1]);
				rst[xPos]=rst[xPos+1]=0;
				ClassUtils._tM=m;
				}else {
				ClassUtils._tM=null;
			}
			if (adptFun && ClassUtils[adptFun]){
				rst=ClassUtils[adptFun](rst);
			}
			return rst;
		}

		ClassUtils._getPointListByStr=function(str){
			var pointArr;
			pointArr=str.split(",");
			var i=0,len=0;
			len=pointArr.length;
			for (i=0;i < len;i++){
				pointArr[i]=parseFloat(pointArr[i]);
			}
			return pointArr;
		}

		ClassUtils._getObjVar=function(obj,key,noValue){
			if (obj.hasOwnProperty(key)){
				return obj[key];
			}
			return noValue;
		}

		ClassUtils._temParam=[];
		ClassUtils._classMap={'Sprite':'laya.display.Sprite','Text':'laya.display.Text','Animation':'laya.display.Animation','Skeleton':'laya.ani.bone.Skeleton','Particle2D':'laya.particle.Particle2D','div':'laya.html.dom.HTMLDivElement','p':'laya.html.dom.HTMLElement','img':'laya.html.dom.HTMLImageElement','span':'laya.html.dom.HTMLElement','br':'laya.html.dom.HTMLBrElement','style':'laya.html.dom.HTMLStyleElement','font':'laya.html.dom.HTMLElement','a':'laya.html.dom.HTMLElement','#text':'laya.html.dom.HTMLElement'};
		ClassUtils.getClass=function(className){
			var classObject=ClassUtils._classMap[className] || className;
			if ((typeof classObject=='string'))
				return Laya["__classmap"][classObject];
			return classObject;
		}

		ClassUtils._tM=null
		ClassUtils._alpha=NaN
		__static(ClassUtils,
		['DrawTypeDic',function(){return this.DrawTypeDic={"Rect":["drawRect",[["x",0],["y",0],["width",0],["height",0],["fillColor",null],["lineColor",null],["lineWidth",1]]],"Circle":["drawCircle",[["x",0],["y",0],["radius",0],["fillColor",null],["lineColor",null],["lineWidth",1]]],"Pie":["drawPie",[["x",0],["y",0],["radius",0],["startAngle",0],["endAngle",0],["fillColor",null],["lineColor",null],["lineWidth",1]]],"Image":["drawTexture",[["x",0],["y",0],["width",0],["height",0]]],"Texture":["drawTexture",[["skin",null],["x",0],["y",0],["width",0],["height",0]],1,"_adptTextureData"],"FillTexture":["fillTexture",[["skin",null],["x",0],["y",0],["width",0],["height",0],["repeat",null]],1,"_adptTextureData"],"FillText":["fillText",[["text",""],["x",0],["y",0],["font",null],["color",null],["textAlign",null]],1],"Line":["drawLine",[["x",0],["y",0],["toX",0],["toY",0],["lineColor",null],["lineWidth",0]],0,"_adptLineData"],"Lines":["drawLines",[["x",0],["y",0],["points",""],["lineColor",null],["lineWidth",0]],0,"_adptLinesData"],"Curves":["drawCurves",[["x",0],["y",0],["points",""],["lineColor",null],["lineWidth",0]],0,"_adptLinesData"],"Poly":["drawPoly",[["x",0],["y",0],["points",""],["fillColor",null],["lineColor",null],["lineWidth",1]],0,"_adptLinesData"]};}
		]);
		return ClassUtils;
	})()


	/**
	*<code>Color</code> ??????????????????????????????
	*/
	//class laya.utils.Color
	var Color=(function(){
		function Color(str){
			this._color=[];
			//this.strColor=null;
			//this.numColor=0;
			//this._drawStyle=null;
			if ((typeof str=='string')){
				this.strColor=str;
				if (str===null)str="#000000";
				str.charAt(0)=='#' && (str=str.substr(1));
				var color=this.numColor=parseInt(str,16);
				var flag=(str.length==8);
				if (flag){
					this._color=[parseInt(str.substr(0,2),16)/ 255,((0x00FF0000 & color)>> 16)/ 255,((0x0000FF00 & color)>> 8)/ 255,(0x000000FF & color)/ 255];
					return;
				}
				}else {
				color=this.numColor=str;
				this.strColor=Utils.toHexColor(color);
			}
			this._color=[((0xFF0000 & color)>> 16)/ 255,((0xFF00 & color)>> 8)/ 255,(0xFF & color)/ 255,1];
			(this._color).__id=++Color._COLODID;
		}

		__class(Color,'laya.utils.Color');
		Color._initDefault=function(){
			Color._DEFAULT={};
			for (var i in Color._COLOR_MAP)Color._SAVE[i]=Color._DEFAULT[i]=new Color(Color._COLOR_MAP[i]);
			return Color._DEFAULT;
		}

		Color._initSaveMap=function(){
			Color._SAVE_SIZE=0;
			Color._SAVE={};
			for (var i in Color._DEFAULT)Color._SAVE[i]=Color._DEFAULT[i];
		}

		Color.create=function(str){
			var color=Color._SAVE[str+""];
			if (color !=null)return color;
			(Color._SAVE_SIZE < 1000)|| Color._initSaveMap();
			return Color._SAVE[str+""]=new Color(str);
		}

		Color._SAVE={};
		Color._SAVE_SIZE=0;
		Color._COLOR_MAP={"white":'#FFFFFF',"red":'#FF0000',"green":'#00FF00',"blue":'#0000FF',"black":'#000000',"yellow":'#FFFF00','gray':'#AAAAAA'};
		Color._DEFAULT=Color._initDefault();
		Color._COLODID=1;
		return Color;
	})()


	/**
	*<code>Dictionary</code> ???????????????????????????????????????
	*/
	//class laya.utils.Dictionary
	var Dictionary=(function(){
		function Dictionary(){
			this._values=[];
			this._keys=[];
		}

		__class(Dictionary,'laya.utils.Dictionary');
		var __proto=Dictionary.prototype;
		/**
		*??????????????????????????????
		*@param key ?????????
		*@param value ??????
		*/
		__proto.set=function(key,value){
			var index=this.indexOf(key);
			if (index >=0){
				this._values[index]=value;
				return;
			}
			this._keys.push(key);
			this._values.push(value);
		}

		/**
		*????????????????????????????????????
		*@param key ???????????????
		*@return ???????????????
		*/
		__proto.indexOf=function(key){
			var index=this._keys.indexOf(key);
			if (index >=0)return index;
			key=((typeof key=='string'))? Number(key):(((typeof key=='number'))? key.toString():key);
			return this._keys.indexOf(key);
		}

		/**
		*???????????????????????????
		*@param key ???????????????
		*@return ?????????????????????
		*/
		__proto.get=function(key){
			var index=this.indexOf(key);
			return index < 0 ? null :this._values[index];
		}

		/**
		*???????????????????????????
		*@param key ???????????????
		*@return ?????????????????????
		*/
		__proto.remove=function(key){
			var index=this.indexOf(key);
			if (index >=0){
				this._keys.splice(index,1);
				this._values.splice(index,1);
				return true;
			}
			return false;
		}

		/**
		*????????????????????????????????????????????????
		*/
		__proto.clear=function(){
			this._values.length=0;
			this._keys.length=0;
		}

		/**
		*?????????????????????????????????
		*/
		__getset(0,__proto,'values',function(){
			return this._values;
		});

		/**
		*???????????????????????????????????????
		*/
		__getset(0,__proto,'keys',function(){
			return this._keys;
		});

		return Dictionary;
	})()


	/**
	*<code>Dragging</code> ???????????????????????????
	*/
	//class laya.utils.Dragging
	var Dragging=(function(){
		function Dragging(){
			//this.target=null;
			this.ratio=0.92;
			this.maxOffset=60;
			//this.area=null;
			//this.hasInertia=false;
			//this.elasticDistance=NaN;
			//this.elasticBackTime=NaN;
			//this.data=null;
			this._dragging=false;
			this._clickOnly=true;
			//this._elasticRateX=NaN;
			//this._elasticRateY=NaN;
			//this._lastX=NaN;
			//this._lastY=NaN;
			//this._offsetX=NaN;
			//this._offsetY=NaN;
			//this._offsets=null;
			//this._disableMouseEvent=false;
			//this._tween=null;
			//this._parent=null;
		}

		__class(Dragging,'laya.utils.Dragging');
		var __proto=Dragging.prototype;
		/**
		*???????????????
		*@param target ???????????? <code>Sprite</code> ?????????
		*@param area ???????????????
		*@param hasInertia ????????????????????????
		*@param elasticDistance ?????????????????????
		*@param elasticBackTime ??????????????????????????????????????????
		*@param data ?????????????????????
		*@param disableMouseEvent ???????????????????????????
		*@param ratio ??????????????????
		*/
		__proto.start=function(target,area,hasInertia,elasticDistance,elasticBackTime,data,disableMouseEvent,ratio){
			(ratio===void 0)&& (ratio=0.92);
			this.clearTimer();
			this.target=target;
			this.area=area;
			this.hasInertia=hasInertia;
			this.elasticDistance=area ? elasticDistance :0;
			this.elasticBackTime=elasticBackTime;
			this.data=data;
			this._disableMouseEvent=disableMouseEvent;
			this.ratio=ratio;
			if (target.globalScaleX !=1 || target.globalScaleY !=1){
				this._parent=target.parent;
				}else {
				this._parent=Laya.stage;
			}
			this._clickOnly=true;
			this._dragging=true;
			this._elasticRateX=this._elasticRateY=1;
			this._lastX=this._parent.mouseX;
			this._lastY=this._parent.mouseY;
			Laya.stage.on(/*laya.events.Event.MOUSE_UP*/"mouseup",this,this.onStageMouseUp);
			Laya.stage.on(/*laya.events.Event.MOUSE_OUT*/"mouseout",this,this.onStageMouseUp);
			Laya.timer.frameLoop(1,this,this.loop);
		}

		/**
		*??????????????????
		*/
		__proto.clearTimer=function(){
			Laya.timer.clear(this,this.loop);
			Laya.timer.clear(this,this.tweenMove);
			if (this._tween){
				this._tween.recover();
				this._tween=null;
			}
		}

		/**
		*???????????????
		*/
		__proto.stop=function(){
			if (this._dragging){
				MouseManager.instance.disableMouseEvent=false;
				Laya.stage.off(/*laya.events.Event.MOUSE_UP*/"mouseup",this,this.onStageMouseUp);
				Laya.stage.off(/*laya.events.Event.MOUSE_OUT*/"mouseout",this,this.onStageMouseUp);
				this._dragging=false;
				this.target && this.area && this.backToArea();
				this.clear();
			}
		}

		/**
		*??????????????????????????????
		*/
		__proto.loop=function(){
			var point=this._parent.getMousePoint();
			var mouseX=point.x;
			var mouseY=point.y;
			var offsetX=mouseX-this._lastX;
			var offsetY=mouseY-this._lastY;
			if (this._clickOnly){
				if (Math.abs(offsetX *Laya.stage._canvasTransform.getScaleX())> 1 || Math.abs(offsetY *Laya.stage._canvasTransform.getScaleY())> 1){
					this._clickOnly=false;
					this._offsets || (this._offsets=[]);
					this._offsets.length=0;
					this.target.event(/*laya.events.Event.DRAG_START*/"dragstart",this.data);
					MouseManager.instance.disableMouseEvent=this._disableMouseEvent;
					this.target._set$P("$_MOUSEDOWN",false);
				}else return;
				}else {
				this._offsets.push(offsetX,offsetY);
			}
			if (offsetX===0 && offsetY===0)return;
			this._lastX=mouseX;
			this._lastY=mouseY;
			this.target.x+=offsetX *this._elasticRateX;
			this.target.y+=offsetY *this._elasticRateY;
			this.area && this.checkArea();
			this.target.event(/*laya.events.Event.DRAG_MOVE*/"dragmove",this.data);
		}

		/**
		*?????????????????????
		*/
		__proto.checkArea=function(){
			if (this.elasticDistance <=0){
				this.backToArea();
				}else {
				if (this.target.x < this.area.x){
					var offsetX=this.area.x-this.target.x;
					}else if (this.target.x > this.area.x+this.area.width){
					offsetX=this.target.x-this.area.x-this.area.width;
					}else {
					offsetX=0;
				}
				this._elasticRateX=Math.max(0,1-(offsetX / this.elasticDistance));
				if (this.target.y < this.area.y){
					var offsetY=this.area.y-this.target.y;
					}else if (this.target.y > this.area.y+this.area.height){
					offsetY=this.target.y-this.area.y-this.area.height;
					}else {
					offsetY=0;
				}
				this._elasticRateY=Math.max(0,1-(offsetY / this.elasticDistance));
			}
		}

		/**
		*?????????????????????????????????
		*/
		__proto.backToArea=function(){
			this.target.x=Math.min(Math.max(this.target.x,this.area.x),this.area.x+this.area.width);
			this.target.y=Math.min(Math.max(this.target.y,this.area.y),this.area.y+this.area.height);
		}

		/**
		*????????????????????????????????????
		*@param e Event ?????????
		*/
		__proto.onStageMouseUp=function(e){
			MouseManager.instance.disableMouseEvent=false;
			Laya.stage.off(/*laya.events.Event.MOUSE_UP*/"mouseup",this,this.onStageMouseUp);
			Laya.stage.off(/*laya.events.Event.MOUSE_OUT*/"mouseout",this,this.onStageMouseUp);
			Laya.timer.clear(this,this.loop);
			if (this._clickOnly || !this.target)return;
			if (this.hasInertia){
				if (this._offsets.length < 1){
					this._offsets.push(this._parent.mouseX-this._lastX,this._parent.mouseY-this._lastY);
				}
				this._offsetX=this._offsetY=0;
				var len=this._offsets.length;
				var n=Math.min(len,6);
				var m=this._offsets.length-n;
				for (var i=len-1;i > m;i--){
					this._offsetY+=this._offsets[i--];
					this._offsetX+=this._offsets[i];
				}
				this._offsetX=this._offsetX / n *2;
				this._offsetY=this._offsetY / n *2;
				if (Math.abs(this._offsetX)> this.maxOffset)this._offsetX=this._offsetX > 0 ? this.maxOffset :-this.maxOffset;
				if (Math.abs(this._offsetY)> this.maxOffset)this._offsetY=this._offsetY > 0 ? this.maxOffset :-this.maxOffset;
				Laya.timer.frameLoop(1,this,this.tweenMove);
				}else if (this.elasticDistance > 0){
				this.checkElastic();
				}else {
				this.clear();
			}
		}

		/**
		*????????????????????????
		*/
		__proto.checkElastic=function(){
			var tx=NaN;
			var ty=NaN;
			if (this.target.x < this.area.x)tx=this.area.x;
			else if (this.target.x > this.area.x+this.area.width)tx=this.area.x+this.area.width;
			if (this.target.y < this.area.y)ty=this.area.y;
			else if (this.target.y > this.area.y+this.area.height)ty=this.area.y+this.area.height;
			if (!isNaN(tx)|| !isNaN(ty)){
				var obj={};
				if (!isNaN(tx))obj.x=tx;
				if (!isNaN(ty))obj.y=ty;
				this._tween=Tween.to(this.target,obj,this.elasticBackTime,Ease.sineOut,Handler.create(this,this.clear),0,false,false);
				}else {
				this.clear();
			}
		}

		/**
		*?????????
		*/
		__proto.tweenMove=function(){
			this._offsetX *=this.ratio *this._elasticRateX;
			this._offsetY *=this.ratio *this._elasticRateY;
			this.target.x+=this._offsetX;
			this.target.y+=this._offsetY;
			this.area && this.checkArea();
			this.target.event(/*laya.events.Event.DRAG_MOVE*/"dragmove",this.data);
			if ((Math.abs(this._offsetX)< 1 && Math.abs(this._offsetY)< 1)|| this._elasticRateX < 0.5 || this._elasticRateY < 0.5){
				Laya.timer.clear(this,this.tweenMove);
				if (this.elasticDistance > 0)this.checkElastic();
				else this.clear();
			}
		}

		/**
		*???????????????
		*/
		__proto.clear=function(){
			if (this.target){
				this.clearTimer();
				var sp=this.target;
				this.target=null;
				this._parent=null;
				sp.event(/*laya.events.Event.DRAG_END*/"dragend",this.data);
			}
		}

		return Dragging;
	})()


	/**
	*<code>Ease</code> ??????????????????????????????????????? <code>Tween</code> ????????????????????????
	*/
	//class laya.utils.Ease
	var Ease=(function(){
		function Ease(){};
		__class(Ease,'laya.utils.Ease');
		Ease.linearNone=function(t,b,c,d){
			return c *t / d+b;
		}

		Ease.linearIn=function(t,b,c,d){
			return c *t / d+b;
		}

		Ease.linearInOut=function(t,b,c,d){
			return c *t / d+b;
		}

		Ease.linearOut=function(t,b,c,d){
			return c *t / d+b;
		}

		Ease.bounceIn=function(t,b,c,d){
			return c-Ease.bounceOut(d-t,0,c,d)+b;
		}

		Ease.bounceInOut=function(t,b,c,d){
			if (t < d *0.5)return Ease.bounceIn(t *2,0,c,d)*.5+b;
			else return Ease.bounceOut(t *2-d,0,c,d)*.5+c *.5+b;
		}

		Ease.bounceOut=function(t,b,c,d){
			if ((t /=d)< (1 / 2.75))return c *(7.5625 *t *t)+b;
			else if (t < (2 / 2.75))return c *(7.5625 *(t-=(1.5 / 2.75))*t+.75)+b;
			else if (t < (2.5 / 2.75))return c *(7.5625 *(t-=(2.25 / 2.75))*t+.9375)+b;
			else return c *(7.5625 *(t-=(2.625 / 2.75))*t+.984375)+b;
		}

		Ease.backIn=function(t,b,c,d,s){
			(s===void 0)&& (s=1.70158);
			return c *(t /=d)*t *((s+1)*t-s)+b;
		}

		Ease.backInOut=function(t,b,c,d,s){
			(s===void 0)&& (s=1.70158);
			if ((t /=d *0.5)< 1)return c *0.5 *(t *t *(((s *=(1.525))+1)*t-s))+b;
			return c / 2 *((t-=2)*t *(((s *=(1.525))+1)*t+s)+2)+b;
		}

		Ease.backOut=function(t,b,c,d,s){
			(s===void 0)&& (s=1.70158);
			return c *((t=t / d-1)*t *((s+1)*t+s)+1)+b;
		}

		Ease.elasticIn=function(t,b,c,d,a,p){
			(a===void 0)&& (a=0);
			(p===void 0)&& (p=0);
			var s;
			if (t==0)return b;
			if ((t /=d)==1)return b+c;
			if (!p)p=d *.3;
			if (!a || (c > 0 && a < c)|| (c < 0 && a <-c)){
				a=c;
				s=p / 4;
			}else s=p / Ease.PI2 *Math.asin(c / a);
			return-(a *Math.pow(2,10 *(t-=1))*Math.sin((t *d-s)*Ease.PI2 / p))+b;
		}

		Ease.elasticInOut=function(t,b,c,d,a,p){
			(a===void 0)&& (a=0);
			(p===void 0)&& (p=0);
			var s;
			if (t==0)return b;
			if ((t /=d *0.5)==2)return b+c;
			if (!p)p=d *(.3 *1.5);
			if (!a || (c > 0 && a < c)|| (c < 0 && a <-c)){
				a=c;
				s=p / 4;
			}else s=p / Ease.PI2 *Math.asin(c / a);
			if (t < 1)return-.5 *(a *Math.pow(2,10 *(t-=1))*Math.sin((t *d-s)*Ease.PI2 / p))+b;
			return a *Math.pow(2,-10 *(t-=1))*Math.sin((t *d-s)*Ease.PI2 / p)*.5+c+b;
		}

		Ease.elasticOut=function(t,b,c,d,a,p){
			(a===void 0)&& (a=0);
			(p===void 0)&& (p=0);
			var s;
			if (t==0)return b;
			if ((t /=d)==1)return b+c;
			if (!p)p=d *.3;
			if (!a || (c > 0 && a < c)|| (c < 0 && a <-c)){
				a=c;
				s=p / 4;
			}else s=p / Ease.PI2 *Math.asin(c / a);
			return (a *Math.pow(2,-10 *t)*Math.sin((t *d-s)*Ease.PI2 / p)+c+b);
		}

		Ease.strongIn=function(t,b,c,d){
			return c *(t /=d)*t *t *t *t+b;
		}

		Ease.strongInOut=function(t,b,c,d){
			if ((t /=d *0.5)< 1)return c *0.5 *t *t *t *t *t+b;
			return c *0.5 *((t-=2)*t *t *t *t+2)+b;
		}

		Ease.strongOut=function(t,b,c,d){
			return c *((t=t / d-1)*t *t *t *t+1)+b;
		}

		Ease.sineInOut=function(t,b,c,d){
			return-c *0.5 *(Math.cos(Math.PI *t / d)-1)+b;
		}

		Ease.sineIn=function(t,b,c,d){
			return-c *Math.cos(t / d *Ease.HALF_PI)+c+b;
		}

		Ease.sineOut=function(t,b,c,d){
			return c *Math.sin(t / d *Ease.HALF_PI)+b;
		}

		Ease.quintIn=function(t,b,c,d){
			return c *(t /=d)*t *t *t *t+b;
		}

		Ease.quintInOut=function(t,b,c,d){
			if ((t /=d *0.5)< 1)return c *0.5 *t *t *t *t *t+b;
			return c *0.5 *((t-=2)*t *t *t *t+2)+b;
		}

		Ease.quintOut=function(t,b,c,d){
			return c *((t=t / d-1)*t *t *t *t+1)+b;
		}

		Ease.quartIn=function(t,b,c,d){
			return c *(t /=d)*t *t *t+b;
		}

		Ease.quartInOut=function(t,b,c,d){
			if ((t /=d *0.5)< 1)return c *0.5 *t *t *t *t+b;
			return-c *0.5 *((t-=2)*t *t *t-2)+b;
		}

		Ease.quartOut=function(t,b,c,d){
			return-c *((t=t / d-1)*t *t *t-1)+b;
		}

		Ease.cubicIn=function(t,b,c,d){
			return c *(t /=d)*t *t+b;
		}

		Ease.cubicInOut=function(t,b,c,d){
			if ((t /=d *0.5)< 1)return c *0.5 *t *t *t+b;
			return c *0.5 *((t-=2)*t *t+2)+b;
		}

		Ease.cubicOut=function(t,b,c,d){
			return c *((t=t / d-1)*t *t+1)+b;
		}

		Ease.quadIn=function(t,b,c,d){
			return c *(t /=d)*t+b;
		}

		Ease.quadInOut=function(t,b,c,d){
			if ((t /=d *0.5)< 1)return c *0.5 *t *t+b;
			return-c *0.5 *((--t)*(t-2)-1)+b;
		}

		Ease.quadOut=function(t,b,c,d){
			return-c *(t /=d)*(t-2)+b;
		}

		Ease.expoIn=function(t,b,c,d){
			return (t==0)? b :c *Math.pow(2,10 *(t / d-1))+b-c *0.001;
		}

		Ease.expoInOut=function(t,b,c,d){
			if (t==0)return b;
			if (t==d)return b+c;
			if ((t /=d *0.5)< 1)return c *0.5 *Math.pow(2,10 *(t-1))+b;
			return c *0.5 *(-Math.pow(2,-10 *--t)+2)+b;
		}

		Ease.expoOut=function(t,b,c,d){
			return (t==d)? b+c :c *(-Math.pow(2,-10 *t / d)+1)+b;
		}

		Ease.circIn=function(t,b,c,d){
			return-c *(Math.sqrt(1-(t /=d)*t)-1)+b;
		}

		Ease.circInOut=function(t,b,c,d){
			if ((t /=d *0.5)< 1)return-c *0.5 *(Math.sqrt(1-t *t)-1)+b;
			return c *0.5 *(Math.sqrt(1-(t-=2)*t)+1)+b;
		}

		Ease.circOut=function(t,b,c,d){
			return c *Math.sqrt(1-(t=t / d-1)*t)+b;
		}

		Ease.HALF_PI=Math.PI *0.5;
		Ease.PI2=Math.PI *2;
		return Ease;
	})()


	/**
	*?????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????
	*/
	//class laya.utils.HitArea
	var HitArea=(function(){
		function HitArea(){
			this._hit=null;
			this._unHit=null;
		}

		__class(HitArea,'laya.utils.HitArea');
		var __proto=HitArea.prototype;
		/**
		*?????????????????????
		*@param x x??????
		*@param y y??????
		*@return ???????????????
		*/
		__proto.isHit=function(x,y){
			if (!HitArea.isHitGraphic(x,y,this.hit))return false;
			return !HitArea.isHitGraphic(x,y,this.unHit);
		}

		/**
		*????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????
		*/
		__getset(0,__proto,'hit',function(){
			if (!this._hit)this._hit=new Graphics();
			return this._hit;
			},function(value){
			this._hit=value;
		});

		/**
		*??????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????
		*/
		__getset(0,__proto,'unHit',function(){
			if (!this._unHit)this._unHit=new Graphics();
			return this._unHit;
			},function(value){
			this._unHit=value;
		});

		HitArea.isHitGraphic=function(x,y,graphic){
			if (!graphic)return false;
			var cmds;
			cmds=graphic.cmds;
			if (!cmds && graphic._one){
				cmds=HitArea._cmds;
				cmds.length=1;
				cmds[0]=graphic._one;
			}
			if (!cmds)return false;
			var i=0,len=0;
			len=cmds.length;
			var cmd;
			for (i=0;i < len;i++){
				cmd=cmds[i];
				if (!cmd)continue ;
				var context=Render._context;
				switch (cmd.callee){
					case context._translate:
					case 6:
						x-=cmd[0];
						y-=cmd[1];
					default :
					}
				if (HitArea.isHitCmd(x,y,cmd))return true;
			}
			return false;
		}

		HitArea.isHitCmd=function(x,y,cmd){
			if (!cmd)return false;
			var context=Render._context;
			var rst=false;
			switch (cmd["callee"]){
				case context._drawRect:
				case 13:
					HitArea._rec.setTo(cmd[0],cmd[1],cmd[2],cmd[3]);
					rst=HitArea._rec.contains(x,y);
					break ;
				case context._drawCircle:
				case context._fillCircle:
				case 14:;
					var d=NaN;
					x-=cmd[0];
					y-=cmd[1];
					d=x *x+y *y;
					rst=d < cmd[2] *cmd[2];
					break ;
				case context._drawPoly:
				case 18:
					x-=cmd[0];
					y-=cmd[1];
					rst=HitArea.ptInPolygon(x,y,cmd[2]);
					break ;
				default :
					break ;
				}
			return rst;
		}

		HitArea.ptInPolygon=function(x,y,areaPoints){
			var p;
			p=HitArea._ptPoint;
			p.setTo(x,y);
			var nCross=0;
			var p1x=NaN,p1y=NaN,p2x=NaN,p2y=NaN;
			var len=0;
			len=areaPoints.length;
			for (var i=0;i < len;i+=2){
				p1x=areaPoints[i];
				p1y=areaPoints[i+1];
				p2x=areaPoints[(i+2)% len];
				p2y=areaPoints[(i+3)% len];
				if (p1y==p2y)
					continue ;
				if (p.y < Math.min(p1y,p2y))
					continue ;
				if (p.y >=Math.max(p1y,p2y))
					continue ;
				var tx=(p.y-p1y)*(p2x-p1x)/ (p2y-p1y)+p1x;
				if (tx > p.x){
					nCross++;
				}
			}
			return (nCross % 2==1);
		}

		HitArea._cmds=[];
		__static(HitArea,
		['_rec',function(){return this._rec=new Rectangle();},'_ptPoint',function(){return this._ptPoint=new Point();}
		]);
		return HitArea;
	})()


	/**
	*<code>HTMLChar</code> ????????? HTML ????????????
	*/
	//class laya.utils.HTMLChar
	var HTMLChar=(function(){
		function HTMLChar(char,w,h,style){
			//this._sprite=null;
			//this._x=NaN;
			//this._y=NaN;
			//this._w=NaN;
			//this._h=NaN;
			//this.isWord=false;
			//this.char=null;
			//this.charNum=NaN;
			//this.style=null;
			this.char=char;
			this.charNum=char.charCodeAt(0);
			this._x=this._y=0;
			this.width=w;
			this.height=h;
			this.style=style;
			this.isWord=!HTMLChar._isWordRegExp.test(char);
		}

		__class(HTMLChar,'laya.utils.HTMLChar');
		var __proto=HTMLChar.prototype;
		Laya.imps(__proto,{"laya.display.ILayout":true})
		/**
		*??????????????????????????????????????? <code>Sprite</code> ???
		*@param sprite ???????????? <code>Sprite</code> ???
		*/
		__proto.setSprite=function(sprite){
			this._sprite=sprite;
		}

		/**
		*??????????????????????????????????????? <code>Sprite</code>???
		*@return
		*/
		__proto.getSprite=function(){
			return this._sprite;
		}

		/**@private */
		__proto._isChar=function(){
			return true;
		}

		/**@private */
		__proto._getCSSStyle=function(){
			return this.style;
		}

		/**
		*?????????
		*/
		__getset(0,__proto,'width',function(){
			return this._w;
			},function(value){
			this._w=value;
		});

		/**
		*?????????????????? X ???????????????
		*???????????????????????????????????????????????? Sprite ?????????????????? Sprite ??????????????? x ?????????
		*/
		__getset(0,__proto,'x',function(){
			return this._x;
			},function(value){
			if (this._sprite){
				this._sprite.x=value;
			}
			this._x=value;
		});

		/**
		*?????????????????? Y ???????????????
		*???????????????????????????????????????????????? Sprite ?????????????????? Sprite ??????????????? y ?????????
		*/
		__getset(0,__proto,'y',function(){
			return this._y;
			},function(value){
			if (this._sprite){
				this._sprite.y=value;
			}
			this._y=value;
		});

		/**
		*?????????
		*/
		__getset(0,__proto,'height',function(){
			return this._h;
			},function(value){
			this._h=value;
		});

		HTMLChar._isWordRegExp=new RegExp("[\\w\.]","");
		return HTMLChar;
	})()


	/**
	*<code>Log</code> ????????????????????????????????????????????????
	*/
	//class laya.utils.Log
	var Log=(function(){
		function Log(){};
		__class(Log,'laya.utils.Log');
		Log.enable=function(){
			if (!Log._logdiv){
				Log._logdiv=Browser.window.document.createElement('div');
				Browser.window.document.body.appendChild(Log._logdiv);
				Log._logdiv.style.cssText="pointer-events:none;border:white;overflow:hidden;z-index:1000000;background:rgba(100,100,100,0.6);color:white;position: absolute;left:0px;top:0px;width:50%;height:50%;";
			}
		}

		Log.toggle=function(){
			var style=Log._logdiv.style;
			if (style.width=="1px"){
				style.width=style.height="50%";
				}else {
				style.width=style.height="1px";
			}
		}

		Log.print=function(value){
			if (Log._logdiv){
				if (Log._count >=Log.maxCount)Log.clear();
				Log._count++;
				Log._logdiv.innerText+=value+"\n";
				Log._logdiv.scrollTop=Log._logdiv.scrollHeight;
			}
		}

		Log.clear=function(){
			Log._logdiv.innerText="";
			Log._count=0;
		}

		Log._logdiv=null
		Log._count=0;
		Log.maxCount=20;
		return Log;
	})()


	/**
	*<code>Mouse</code> ??????????????????????????????
	*/
	//class laya.utils.Mouse
	var Mouse=(function(){
		function Mouse(){}
		__class(Mouse,'laya.utils.Mouse');
		/**
		*??????????????????
		*@param cursorStr
		*??????auto move no-drop col-resize
		*all-scroll pointer not-allowed row-resize
		*crosshair progress e-resize ne-resize
		*default text n-resize nw-resize
		*help vertical-text s-resize se-resize
		*inherit wait w-resize sw-resize
		*
		*/
		__getset(1,Mouse,'cursor',function(){
			return Mouse._style.cursor;
			},function(cursorStr){
			Mouse._style.cursor=cursorStr;
		});

		Mouse.hide=function(){
			if (Mouse.cursor !="none"){
				Mouse._preCursor=Mouse.cursor;
				Mouse.cursor="none";
			}
		}

		Mouse.show=function(){
			if (Mouse.cursor=="none"){
				if (Mouse._preCursor){
					Mouse.cursor=Mouse._preCursor;
					}else{
					Mouse.cursor="auto";
				}
			}
		}

		Mouse._preCursor=null
		__static(Mouse,
		['_style',function(){return this._style=Browser.document.body.style;}
		]);
		return Mouse;
	})()


	/**
	*<code>Pool</code> ?????????????????????????????????????????????????????????
	*/
	//class laya.utils.Pool
	var Pool=(function(){
		function Pool(){};
		__class(Pool,'laya.utils.Pool');
		Pool.getPoolBySign=function(sign){
			return Pool._poolDic[sign] || (Pool._poolDic[sign]=[]);
		}

		Pool.clearBySign=function(sign){
			if (Pool._poolDic[sign])Pool._poolDic[sign].length=0;
		}

		Pool.recover=function(sign,item){
			if (item["__InPool"])return;
			item["__InPool"]=true;
			Pool.getPoolBySign(sign).push(item);
		}

		Pool.getItemByClass=function(sign,cls){
			var pool=Pool.getPoolBySign(sign);
			var rst=pool.length ? pool.pop():new cls();
			rst["__InPool"]=false;
			return rst;
		}

		Pool.getItemByCreateFun=function(sign,createFun){
			var pool=Pool.getPoolBySign(sign);
			var rst=pool.length ? pool.pop():createFun();
			rst["__InPool"]=false;
			return rst;
		}

		Pool.getItem=function(sign){
			var pool=Pool.getPoolBySign(sign);
			var rst=pool.length ? pool.pop():null;
			if (rst){
				rst["__InPool"]=false;
			}
			return rst;
		}

		Pool._poolDic={};
		Pool.InPoolSign="__InPool";
		return Pool;
	})()


	/**
	*????????????????????????????????????
	*/
	//class laya.utils.PoolCache
	var PoolCache=(function(){
		function PoolCache(){
			this.sign=null;
			this.maxCount=1000;
		}

		__class(PoolCache,'laya.utils.PoolCache');
		var __proto=PoolCache.prototype;
		/**
		*???????????????????????????
		*@return
		*
		*/
		__proto.getCacheList=function(){
			return Pool.getPoolBySign(this.sign);
		}

		/**
		*??????????????????
		*@param force ??????????????????
		*
		*/
		__proto.tryDispose=function(force){
			var list;
			list=Pool.getPoolBySign(this.sign);
			if (list.length > this.maxCount){
				list.splice(this.maxCount,list.length-this.maxCount);
			}
		}

		PoolCache.addPoolCacheManager=function(sign,maxCount){
			(maxCount===void 0)&& (maxCount=100);
			var cache;
			cache=new PoolCache();
			cache.sign=sign;
			cache.maxCount=maxCount;
			CacheManger.regCacheByFunction(Utils.bind(cache.tryDispose,cache),Utils.bind(cache.getCacheList,cache));
		}

		return PoolCache;
	})()


	/**
	*<code>Stat</code> ?????????????????????????????????
	*/
	//class laya.utils.Stat
	var Stat=(function(){
		function Stat(){};
		__class(Stat,'laya.utils.Stat');
		/**
		*??????????????????????????????????????????
		*/
		__getset(1,Stat,'onclick',null,function(fn){
			Stat._canvas.source.onclick=fn;
			Stat._canvas.source.style.pointerEvents='';
		});

		Stat.show=function(x,y){
			(x===void 0)&& (x=0);
			(y===void 0)&& (y=0);
			if (Render.isConchApp){
				/*__JS__ */conch.showFPS&&conch.showFPS(x,y);
				return;
			};
			var pixel=Browser.pixelRatio;
			Stat._width=pixel *120;
			Stat._vx=pixel *70;
			Stat._view[0]={title:"FPS(Canvas)",value:"_fpsStr",color:"yellow",units:"int"};
			Stat._view[1]={title:"Sprite",value:"spriteCount",color:"white",units:"int"};
			Stat._view[2]={title:"DrawCall",value:"drawCall",color:"white",units:"int"};
			Stat._view[3]={title:"CurMem",value:"currentMemorySize",color:"yellow",units:"M"};
			if (Render.isWebGL){
				Stat._view[4]={title:"Shader",value:"shaderCall",color:"white",units:"int"};
				if (!Render.is3DMode){
					Stat._view[0].title="FPS(WebGL)";
					Stat._view[5]={title:"Canvas",value:"_canvasStr",color:"white",units:"int"};
					}else {
					Stat._view[0].title="FPS(3D)";
					Stat._view[5]={title:"TriFaces",value:"trianglesFaces",color:"white",units:"int"};
				}
				}else {
				Stat._view[4]={title:"Canvas",value:"_canvasStr",color:"white",units:"int"};
			}
			Stat._fontSize=12 *pixel;
			for (var i=0;i < Stat._view.length;i++){
				Stat._view[i].x=4;
				Stat._view[i].y=i *Stat._fontSize+2 *pixel;
			}
			Stat._height=pixel *(Stat._view.length *12+3 *pixel);
			if (!Stat._canvas){
				Stat._canvas=new HTMLCanvas('2D');
				Stat._canvas.size(Stat._width,Stat._height);
				Stat._ctx=Stat._canvas.getContext('2d');
				Stat._ctx.textBaseline="top";
				Stat._ctx.font=Stat._fontSize+"px Sans-serif";
				Stat._canvas.source.style.cssText="pointer-events:none;background:rgba(150,150,150,0.8);z-index:100000;position: absolute;left:"+x+"px;top:"+y+"px;width:"+(Stat._width / pixel)+"px;height:"+(Stat._height / pixel)+"px;";
			}
			Stat._first=true;
			Stat.loop();
			Stat._first=false;
			Browser.container.appendChild(Stat._canvas.source);
			Stat.enable();
		}

		Stat.enable=function(){
			Laya.timer.frameLoop(1,Stat,Stat.loop);
		}

		Stat.hide=function(){
			Browser.removeElement(Stat._canvas.source);
			Laya.timer.clear(Stat,Stat.loop);
		}

		Stat.clear=function(){
			Stat.trianglesFaces=Stat.drawCall=Stat.shaderCall=Stat.spriteCount=Stat.canvasNormal=Stat.canvasBitmap=Stat.canvasReCache=0;
		}

		Stat.loop=function(){
			Stat._count++;
			var timer=Browser.now();
			if (timer-Stat._timer < 1000)return;
			var count=Stat._count;
			Stat.FPS=Math.round((count *1000)/ (timer-Stat._timer));
			if (Stat._canvas){
				Stat.trianglesFaces=Math.round(Stat.trianglesFaces / count);
				Stat.drawCall=Math.round(Stat.drawCall / count)-2;
				Stat.shaderCall=Math.round(Stat.shaderCall / count);
				Stat.spriteCount=Math.round(Stat.spriteCount / count)-1;
				Stat.canvasNormal=Math.round(Stat.canvasNormal / count);
				Stat.canvasBitmap=Math.round(Stat.canvasBitmap / count);
				Stat.canvasReCache=Math.ceil(Stat.canvasReCache / count);
				Stat._fpsStr=Stat.FPS+(Stat.renderSlow ? " slow" :"");
				Stat._canvasStr=Stat.canvasReCache+"/"+Stat.canvasNormal+"/"+Stat.canvasBitmap;
				Stat.currentMemorySize=ResourceManager.systemResourceManager.memorySize;
				var ctx=Stat._ctx;
				ctx.clearRect(Stat._first ? 0 :Stat._vx,0,Stat._width,Stat._height);
				for (var i=0;i < Stat._view.length;i++){
					var one=Stat._view[i];
					if (Stat._first){
						ctx.fillStyle="white";
						ctx.fillText(one.title,one.x,one.y,null,null,null);
					}
					ctx.fillStyle=one.color;
					var value=Stat[one.value];
					(one.units=="M")&& (value=Math.floor(value / (1024 *1024)*100)/ 100+" M");
					ctx.fillText(value+"",one.x+Stat._vx,one.y,null,null,null);
				}
				Stat.clear();
			}
			Stat._count=0;
			Stat._timer=timer;
		}

		Stat.loopCount=0;
		Stat.shaderCall=0;
		Stat.drawCall=0;
		Stat.trianglesFaces=0;
		Stat.spriteCount=0;
		Stat.FPS=0;
		Stat.canvasNormal=0;
		Stat.canvasBitmap=0;
		Stat.canvasReCache=0;
		Stat.renderSlow=false;
		Stat.currentMemorySize=0;
		Stat._fpsStr=null
		Stat._canvasStr=null
		Stat._canvas=null
		Stat._ctx=null
		Stat._timer=0;
		Stat._count=0;
		Stat._width=120;
		Stat._height=100;
		Stat._view=[];
		Stat._fontSize=12;
		Stat._first=false;
		Stat._vx=NaN
		return Stat;
	})()


	/**
	*<code>StringKey</code> ??????????????????????????????????????????
	*/
	//class laya.utils.StringKey
	var StringKey=(function(){
		function StringKey(){
			this._strs={};
			this._length=0;
		}

		__class(StringKey,'laya.utils.StringKey');
		var __proto=StringKey.prototype;
		/**
		*?????????????????????
		*@param str ??????????????????key ??????????????????????????????
		*@return ???????????????????????????
		*/
		__proto.add=function(str){
			var index=this._strs[str];
			if (index !=null)return index;
			return this._strs[str]=this._length++;
		}

		/**
		*????????????????????????????????????
		*@param str key ?????????
		*@return ???????????????????????????
		*/
		__proto.get=function(str){
			var index=this._strs[str];
			return index==null ?-1 :index;
		}

		return StringKey;
	})()


	/**
	*<code>Timer</code> ?????????????????????????????????????????????????????? Laya.timer ?????????
	*/
	//class laya.utils.Timer
	var Timer=(function(){
		var TimerHandler;
		function Timer(){
			this._delta=0;
			this.scale=1;
			this.currFrame=0;
			this._mid=1;
			this._map=[];
			this._laters=[];
			this._handlers=[];
			this._temp=[];
			this._count=0;
			this.currTimer=Browser.now();
			this._lastTimer=Browser.now();
			Laya.timer && Laya.timer.frameLoop(1,this,this._update);
		}

		__class(Timer,'laya.utils.Timer');
		var __proto=Timer.prototype;
		/**
		*@private
		*????????????????????????
		*/
		__proto._update=function(){
			if (this.scale <=0){
				this._lastTimer=Browser.now();
				return;
			};
			var frame=this.currFrame=this.currFrame+this.scale;
			var now=Browser.now();
			this._delta=(now-this._lastTimer)*this.scale;
			var timer=this.currTimer=this.currTimer+this._delta;
			this._lastTimer=now;
			var handlers=this._handlers;
			this._count=0;
			for (i=0,n=handlers.length;i < n;i++){
				handler=handlers[i];
				if (handler.method!==null){
					var t=handler.userFrame ? frame :timer;
					if (t >=handler.exeTime){
						if (handler.repeat){
							if (t > handler.exeTime){
								handler.exeTime+=handler.delay;
								handler.run(false);
								if (t > handler.exeTime){
									handler.exeTime+=Math.ceil((t-handler.exeTime)/ handler.delay)*handler.delay;
								}
							}
							}else {
							handler.run(true);
						}
					}
					}else {
					this._count++;
				}
			}
			if (this._count > 30 || frame % 200===0)this._clearHandlers();
			var laters=this._laters;
			for (var i=0,n=laters.length-1;i <=n;i++){
				var handler=laters[i];
				handler.method!==null && handler.run(false);
				this._recoverHandler(handler);
				i===n && (n=laters.length-1);
			}
			laters.length=0;
		}

		/**@private */
		__proto._clearHandlers=function(){
			var handlers=this._handlers;
			for (var i=0,n=handlers.length;i < n;i++){
				var handler=handlers[i];
				if (handler.method!==null)this._temp.push(handler);
				else this._recoverHandler(handler);
			}
			this._handlers=this._temp;
			this._temp=handlers;
			this._temp.length=0;
		}

		/**@private */
		__proto._recoverHandler=function(handler){
			this._map[handler.key]=null;
			handler.clear();
			Timer._pool.push(handler);
		}

		/**@private */
		__proto._create=function(useFrame,repeat,delay,caller,method,args,coverBefore){
			if (!delay){
				method.apply(caller,args);
				return;
			}
			if (coverBefore){
				var handler=this._getHandler(caller,method);
				if (handler){
					handler.repeat=repeat;
					handler.userFrame=useFrame;
					handler.delay=delay;
					handler.caller=caller;
					handler.method=method;
					handler.args=args;
					handler.exeTime=delay+(useFrame ? this.currFrame :this.currTimer);
					return;
				}
			}
			handler=Timer._pool.length > 0 ? Timer._pool.pop():new TimerHandler();
			handler.repeat=repeat;
			handler.userFrame=useFrame;
			handler.delay=delay;
			handler.caller=caller;
			handler.method=method;
			handler.args=args;
			handler.exeTime=delay+(useFrame ? this.currFrame :this.currTimer);
			this._indexHandler(handler);
			this._handlers.push(handler);
		}

		/**@private */
		__proto._indexHandler=function(handler){
			var caller=handler.caller;
			var method=handler.method;
			var cid=caller ? caller.$_GID || (caller.$_GID=Utils.getGID()):0;
			var mid=method.$_TID || (method.$_TID=(this._mid++)*100000);
			handler.key=cid+mid;
			this._map[handler.key]=handler;
		}

		/**
		*?????????????????????
		*@param delay ????????????(???????????????)???
		*@param caller ?????????(this)???
		*@param method ????????????????????????
		*@param args ???????????????
		*@param coverBefore ????????????????????????????????????????????? true ???
		*/
		__proto.once=function(delay,caller,method,args,coverBefore){
			(coverBefore===void 0)&& (coverBefore=true);
			this._create(false,false,delay,caller,method,args,coverBefore);
		}

		/**
		*?????????????????????
		*@param delay ????????????(????????????)???
		*@param caller ?????????(this)???
		*@param method ????????????????????????
		*@param args ???????????????
		*@param coverBefore ????????????????????????????????????????????? true ???
		*/
		__proto.loop=function(delay,caller,method,args,coverBefore){
			(coverBefore===void 0)&& (coverBefore=true);
			this._create(false,true,delay,caller,method,args,coverBefore);
		}

		/**
		*??????????????????(????????????)???
		*@param delay ????????????(????????????)???
		*@param caller ?????????(this)???
		*@param method ????????????????????????
		*@param args ???????????????
		*@param coverBefore ????????????????????????????????????????????? true ???
		*/
		__proto.frameOnce=function(delay,caller,method,args,coverBefore){
			(coverBefore===void 0)&& (coverBefore=true);
			this._create(true,false,delay,caller,method,args,coverBefore);
		}

		/**
		*??????????????????(????????????)???
		*@param delay ????????????(????????????)???
		*@param caller ?????????(this)???
		*@param method ????????????????????????
		*@param args ???????????????
		*@param coverBefore ????????????????????????????????????????????? true ???
		*/
		__proto.frameLoop=function(delay,caller,method,args,coverBefore){
			(coverBefore===void 0)&& (coverBefore=true);
			this._create(true,true,delay,caller,method,args,coverBefore);
		}

		/**?????????????????????*/
		__proto.toString=function(){
			return "callLater:"+this._laters.length+" handlers:"+this._handlers.length+" pool:"+Timer._pool.length;
		}

		/**
		*??????????????????
		*@param caller ?????????(this)???
		*@param method ????????????????????????
		*/
		__proto.clear=function(caller,method){
			var handler=this._getHandler(caller,method);
			if (handler){
				this._map[handler.key]=null;handler.key=0;
				handler.clear();
			}
		}

		/**
		*???????????????????????????????????????
		*@param caller ?????????(this)???
		*/
		__proto.clearAll=function(caller){
			for (var i=0,n=this._handlers.length;i < n;i++){
				var handler=this._handlers[i];
				if (handler.caller===caller){
					this._map[handler.key]=null;handler.key=0;
					handler.clear();
				}
			}
		}

		/**@private */
		__proto._getHandler=function(caller,method){
			var cid=caller ? caller.$_GID || (caller.$_GID=Utils.getGID()):0;
			var mid=method.$_TID || (method.$_TID=(this._mid++)*100000);
			return this._map[cid+mid];
		}

		/**
		*???????????????
		*@param caller ?????????(this)???
		*@param method ????????????????????????
		*@param args ???????????????
		*/
		__proto.callLater=function(caller,method,args){
			if (this._getHandler(caller,method)==null){
				if (Timer._pool.length)
					var handler=Timer._pool.pop();
				else handler=new TimerHandler();
				handler.caller=caller;
				handler.method=method;
				handler.args=args;
				this._indexHandler(handler);
				this._laters.push(handler);
			}
		}

		/**
		*???????????? callLater ???
		*@param caller ?????????(this)???
		*@param method ????????????????????????
		*/
		__proto.runCallLater=function(caller,method){
			var handler=this._getHandler(caller,method);
			if (handler && handler.method !=null){
				this._map[handler.key]=null;
				handler.run(true);
			}
		}

		/**
		*???????????????????????????,???????????????
		*/
		__getset(0,__proto,'delta',function(){
			return this._delta;
		});

		Timer._pool=[];
		Timer.__init$=function(){
			/**@private */
			//class TimerHandler
			TimerHandler=(function(){
				function TimerHandler(){
					this.key=0;
					this.repeat=false;
					this.delay=0;
					this.userFrame=false;
					this.exeTime=0;
					this.caller=null;
					this.method=null;
					this.args=null;
				}
				__class(TimerHandler,'');
				var __proto=TimerHandler.prototype;
				__proto.clear=function(){
					this.caller=null;
					this.method=null;
					this.args=null;
				}
				__proto.run=function(widthClear){
					var caller=this.caller;
					if (caller && caller.destroyed)return this.clear();
					var method=this.method;
					var args=this.args;
					widthClear && this.clear();
					if (method==null)return;
					args ? method.apply(caller,args):method.call(caller);
				}
				return TimerHandler;
			})()
		}

		return Timer;
	})()


	/**
	*<code>Tween</code> ???????????????????????????????????????????????????????????????
	*/
	//class laya.utils.Tween
	var Tween=(function(){
		function Tween(){
			//this._complete=null;
			//this._target=null;
			//this._ease=null;
			//this._props=null;
			//this._duration=0;
			//this._delay=0;
			//this._startTimer=0;
			//this._usedTimer=0;
			//this._usedPool=false;
			this.gid=0;
			//this.update=null;
		}

		__class(Tween,'laya.utils.Tween');
		var __proto=Tween.prototype;
		/**
		*???????????????props?????????????????????
		*@param target ????????????(??????????????????????????????)???
		*@param props ??????????????????????????????{x:100,y:20,ease:Ease.backOut,complete:Handler.create(this,onComplete),update:new Handler(this,onComplete)}???
		*@param duration ?????????????????????????????????
		*@param ease ???????????????????????????????????????
		*@param complete ?????????????????????
		*@param delay ?????????????????????
		*@param coverBefore ??????????????????????????????
		*@return ??????Tween?????????
		*/
		__proto.to=function(target,props,duration,ease,complete,delay,coverBefore){
			(delay===void 0)&& (delay=0);
			(coverBefore===void 0)&& (coverBefore=false);
			return this._create(target,props,duration,ease,complete,delay,coverBefore,true,false,true);
		}

		/**
		*???props?????????????????????????????????
		*@param target ????????????(??????????????????????????????)???
		*@param props ??????????????????????????????{x:100,y:20,ease:Ease.backOut,complete:Handler.create(this,onComplete),update:new Handler(this,onComplete)}???
		*@param duration ?????????????????????????????????
		*@param ease ???????????????????????????????????????
		*@param complete ?????????????????????
		*@param delay ?????????????????????
		*@param coverBefore ??????????????????????????????
		*@return ??????Tween?????????
		*/
		__proto.from=function(target,props,duration,ease,complete,delay,coverBefore){
			(delay===void 0)&& (delay=0);
			(coverBefore===void 0)&& (coverBefore=false);
			return this._create(target,props,duration,ease,complete,delay,coverBefore,false,false,true);
		}

		/**@private */
		__proto._create=function(target,props,duration,ease,complete,delay,coverBefore,isTo,usePool,runNow){
			if (!target)throw new Error("Tween:target is null");
			this._target=target;
			this._duration=duration;
			this._ease=ease || props.ease || Tween.easeNone;
			this._complete=complete || props.complete;
			this._delay=delay;
			this._props=[];
			this._usedTimer=0;
			this._startTimer=Browser.now();
			this._usedPool=usePool;
			this.update=props.update;
			var gid=(target.$_GID || (target.$_GID=Utils.getGID()));
			if (!Tween.tweenMap[gid]){
				Tween.tweenMap[gid]=[this];
				}else {
				if (coverBefore)Tween.clearTween(target);
				Tween.tweenMap[gid].push(this);
			}
			if (runNow){
				if (delay <=0)this.firstStart(target,props,isTo);
				else Laya.timer.once(delay,this,this.firstStart,[target,props,isTo]);
				}else {
				this._initProps(target,props,isTo);
			}
			return this;
		}

		__proto.firstStart=function(target,props,isTo){
			this._initProps(target,props,isTo);
			this._beginLoop();
		}

		__proto._initProps=function(target,props,isTo){
			for (var p in props){
				if ((typeof (target[p])=='number')){
					var start=isTo ? target[p] :props[p];
					var end=isTo ? props[p] :target[p];
					this._props.push([p,start,end-start]);
				}
			}
		}

		__proto._beginLoop=function(){
			Laya.timer.frameLoop(1,this,this._doEase);
		}

		/**????????????**/
		__proto._doEase=function(){
			this._updateEase(Browser.now());
		}

		/**@private */
		__proto._updateEase=function(time){
			var target=this._target;
			if (target.destroyed)return Tween.clearTween(target);
			var usedTimer=this._usedTimer=time-this._startTimer-this._delay;
			if (usedTimer < 0)return;
			if (usedTimer >=this._duration)return this.complete();
			var ratio=usedTimer > 0 ? this._ease(usedTimer,0,1,this._duration):0;
			var props=this._props;
			for (var i=0,n=props.length;i < n;i++){
				var prop=props[i];
				target[prop[0]]=prop[1]+(ratio *prop[2]);
			}
			if (this.update)this.update.run();
		}

		/**
		*?????????????????????????????????
		*/
		__proto.complete=function(){
			if (!this._target)return;
			var target=this._target;
			var props=this._props;
			var handler=this._complete;
			for (var i=0,n=props.length;i < n;i++){
				var prop=props[i];
				target[prop[0]]=prop[1]+prop[2];
			}
			if (this.update)this.update.run();
			this.clear();
			handler && handler.run();
		}

		/**
		*???????????????????????????resume???restart???????????????
		*/
		__proto.pause=function(){
			Laya.timer.clear(this,this._beginLoop);
			Laya.timer.clear(this,this._doEase);
		}

		/**
		*?????????????????????
		*@param startTime ???????????????
		*/
		__proto.setStartTime=function(startTime){
			this._startTimer=startTime;
		}

		/**
		*??????????????????????????????
		*/
		__proto.clear=function(){
			if (this._target){
				this._remove();
				this._clear();
			}
		}

		/**
		*@private
		*/
		__proto._clear=function(){
			this.pause();
			Laya.timer.clear(this,this.firstStart);
			this._complete=null;
			this._target=null;
			this._ease=null;
			this._props=null;
			if (this._usedPool){
				this.update=null;
				Pool.recover("tween",this);
			}
		}

		/**?????????????????????*/
		__proto.recover=function(){
			this._usedPool=true;
			this._clear();
		}

		__proto._remove=function(){
			var tweens=Tween.tweenMap[this._target.$_GID];
			if (tweens){
				for (var i=0,n=tweens.length;i < n;i++){
					if (tweens[i]===this){
						tweens.splice(i,1);
						break ;
					}
				}
			}
		}

		/**
		*??????????????????????????????
		*/
		__proto.restart=function(){
			this.pause();
			this._usedTimer=0;
			this._startTimer=Browser.now();
			var props=this._props;
			for (var i=0,n=props.length;i < n;i++){
				var prop=props[i];
				this._target[prop[0]]=prop[1];
			}
			Laya.timer.once(this._delay,this,this._beginLoop);
		}

		/**
		*????????????????????????
		*/
		__proto.resume=function(){
			if (this._usedTimer >=this._duration)return;
			this._startTimer=Browser.now()-this._usedTimer-this._delay;
			this._beginLoop();
		}

		/**????????????????????????**/
		__getset(0,__proto,'progress',null,function(v){
			var uTime=v *this._duration;
			this._startTimer=Browser.now()-this._delay-uTime;
		});

		Tween.to=function(target,props,duration,ease,complete,delay,coverBefore,autoRecover){
			(delay===void 0)&& (delay=0);
			(coverBefore===void 0)&& (coverBefore=false);
			(autoRecover===void 0)&& (autoRecover=true);
			return Pool.getItemByClass("tween",Tween)._create(target,props,duration,ease,complete,delay,coverBefore,true,autoRecover,true);
		}

		Tween.from=function(target,props,duration,ease,complete,delay,coverBefore,autoRecover){
			(delay===void 0)&& (delay=0);
			(coverBefore===void 0)&& (coverBefore=false);
			(autoRecover===void 0)&& (autoRecover=true);
			return Pool.getItemByClass("tween",Tween)._create(target,props,duration,ease,complete,delay,coverBefore,false,autoRecover,true);
		}

		Tween.clearAll=function(target){
			if (!target || !target.$_GID)return;
			var tweens=Tween.tweenMap[target.$_GID];
			if (tweens){
				for (var i=0,n=tweens.length;i < n;i++){
					tweens[i]._clear();
				}
				tweens.length=0;
			}
		}

		Tween.clear=function(tween){
			tween.clear();
		}

		Tween.clearTween=function(target){
			Tween.clearAll(target);
		}

		Tween.easeNone=function(t,b,c,d){
			return c *t / d+b;
		}

		Tween.tweenMap={};
		return Tween;
	})()


	/**
	*<code>Utils</code> ???????????????
	*/
	//class laya.utils.Utils
	var Utils=(function(){
		function Utils(){};
		__class(Utils,'laya.utils.Utils');
		Utils.toRadian=function(angle){
			return angle *Utils._pi2;
		}

		Utils.toAngle=function(radian){
			return radian *Utils._pi;
		}

		Utils.toHexColor=function(color){
			if (color < 0 || isNaN(color))return null;
			var str=color.toString(16);
			while (str.length < 6)str="0"+str;
			return "#"+str;
		}

		Utils.getGID=function(){
			return Utils._gid++;
		}

		Utils.concatArray=function(source,array){
			if (!array)return source;
			if (!source)return array;
			var i=0,len=array.length;
			for (i=0;i < len;i++){
				source.push(array[i]);
			}
			return source;
		}

		Utils.clearArray=function(array){
			if (!array)return array;
			array.length=0;
			return array;
		}

		Utils.copyArray=function(source,array){
			source || (source=[]);
			if (!array)return source;
			source.length=array.length;
			var i=0,len=array.length;
			for (i=0;i < len;i++){
				source[i]=array[i];
			}
			return source;
		}

		Utils.getGlobalRecByPoints=function(sprite,x0,y0,x1,y1){
			var newLTPoint;
			newLTPoint=new Point(x0,y0);
			newLTPoint=sprite.localToGlobal(newLTPoint);
			var newRBPoint;
			newRBPoint=new Point(x1,y1);
			newRBPoint=sprite.localToGlobal(newRBPoint);
			return Rectangle._getWrapRec([newLTPoint.x,newLTPoint.y,newRBPoint.x,newRBPoint.y]);
		}

		Utils.getGlobalPosAndScale=function(sprite){
			return Utils.getGlobalRecByPoints(sprite,0,0,1,1);
		}

		Utils.bind=function(fun,scope){
			var rst=fun;
			/*__JS__ */rst=fun.bind(scope);;
			return rst;
		}

		Utils.measureText=function(txt,font){
			return RunDriver.measureText(txt,font);
		}

		Utils.updateOrder=function(array){
			if (!array || array.length < 2)return false;
			var i=1,j=0,len=array.length,key=NaN,c;
			while (i < len){
				j=i;
				c=array[j];
				key=array[j]._zOrder;
				while (--j >-1){
					if (array[j]._zOrder > key)array[j+1]=array[j];
					else break ;
				}
				array[j+1]=c;
				i++;
			};
			var model=c.parent.model;
			if (model){
				if (model.updateZOrder){
					model.updateZOrder();
				}
				else{
					for (i=0;i < len;i++){
						model.removeChild(array[i].model);
					}
					for (i=0;i < len;i++){
						model.addChildAt(array[i].model,i);
					}
				}
			}
			return true;
		}

		Utils.transPointList=function(points,x,y){
			var i=0,len=points.length;
			for (i=0;i < len;i+=2){
				points[i]+=x;
				points[i+1]+=y;
			}
		}

		Utils.parseInt=function(str,radix){
			(radix===void 0)&& (radix=0);
			var result=Browser.window.parseInt(str,radix);
			if (isNaN(result))return 0;
			return result;
		}

		Utils.getFileExtension=function(path){
			Utils._extReg.lastIndex=path.lastIndexOf(".");
			var result=Utils._extReg.exec(path);
			if (result && result.length > 1){
				return result[1].toLowerCase();
			}
			return null;
		}

		Utils._gid=1;
		Utils._pi=180 / Math.PI;
		Utils._pi2=Math.PI / 180;
		Utils._extReg=/\.(\w+)\??/g;
		Utils.parseXMLFromString=function(value){
			var rst;
			value=value.replace(/>\s+</g,'><');
			/*__JS__ */rst=(new DOMParser()).parseFromString(value,'text/xml');
			if (rst.firstChild.textContent.indexOf("This page contains the following errors")>-1){
				throw new Error(rst.firstChild.firstChild.textContent);
			}
			return rst;
		}

		return Utils;
	})()


	/**
	*@private
	*/
	//class laya.utils.VectorGraphManager
	var VectorGraphManager=(function(){
		function VectorGraphManager(){
			this.useDic={};
			this.shapeDic={};
			this.shapeLineDic={};
			this._id=0;
			this._checkKey=false;
			this._freeIdArray=[];
			if (Render.isWebGL){
				CacheManger.regCacheByFunction(Utils.bind(this.startDispose,this),Utils.bind(this.getCacheList,this));
			}
		}

		__class(VectorGraphManager,'laya.utils.VectorGraphManager');
		var __proto=VectorGraphManager.prototype;
		/**
		*??????????????????ID
		*@return
		*/
		__proto.getId=function(){
			return this._id++;
		}

		/**
		*??????????????????????????????
		*@param id
		*@param shape
		*/
		__proto.addShape=function(id,shape){
			this.shapeDic[id]=shape;
			if (!this.useDic[id]){
				this.useDic[id]=true;
			}
		}

		/**
		*?????????????????????????????????
		*@param id
		*@param Line
		*/
		__proto.addLine=function(id,Line){
			this.shapeLineDic[id]=Line;
			if (!this.shapeLineDic[id]){
				this.shapeLineDic[id]=true;
			}
		}

		/**
		*????????????????????????????????????
		*@param id
		*/
		__proto.getShape=function(id){
			if (this._checkKey){
				if (this.useDic[id] !=null){
					this.useDic[id]=true;
				}
			}
		}

		/**
		*????????????????????????
		*@param id
		*/
		__proto.deleteShape=function(id){
			if (this.shapeDic[id]){
				this.shapeDic[id]=null;
				delete this.shapeDic[id];
			}
			if (this.shapeLineDic[id]){
				this.shapeLineDic[id]=null;
				delete this.shapeLineDic[id];
			}
			if (this.useDic[id] !=null){
				delete this.useDic[id];
			}
		}

		/**
		*??????????????????
		*@return
		*/
		__proto.getCacheList=function(){
			var str;
			var list=[];
			for (str in this.shapeDic){
				list.push(this.shapeDic[str]);
			}
			for (str in this.shapeLineDic){
				list.push(this.shapeLineDic[str]);
			}
			return list;
		}

		/**
		*?????????????????????????????????
		*/
		__proto.startDispose=function(key){
			var str;
			for (str in this.useDic){
				this.useDic[str]=false;
			}
			this._checkKey=true;
		}

		/**
		*????????????
		*/
		__proto.endDispose=function(){
			if (this._checkKey){
				var str;
				for (str in this.useDic){
					if (!this.useDic[str]){
						this.deleteShape(str);
					}
				}
				this._checkKey=false;
			}
		}

		VectorGraphManager.getInstance=function(){
			return VectorGraphManager.instance=VectorGraphManager.instance|| new VectorGraphManager();
		}

		VectorGraphManager.instance=null
		return VectorGraphManager;
	})()


	/**
	*@private
	*/
	//class laya.utils.WordText
	var WordText=(function(){
		function WordText(){
			this.id=NaN;
			this.save=[];
			this.toUpperCase=null;
			this.changed=false;
			this._text=null;
		}

		__class(WordText,'laya.utils.WordText');
		var __proto=WordText.prototype;
		__proto.setText=function(txt){
			this.changed=true;
			this._text=txt;
		}

		__proto.toString=function(){
			return this._text;
		}

		__proto.charCodeAt=function(i){
			return this._text ? this._text.charCodeAt(i):NaN;
		}

		__proto.charAt=function(i){
			return this._text ? this._text.charAt(i):null;
		}

		__getset(0,__proto,'length',function(){
			return this._text ? this._text.length :0;
		});

		return WordText;
	})()


	/**
	*<code>Node</code> ????????????????????????????????????????????????????????????
	*/
	//class laya.display.Node extends laya.events.EventDispatcher
	var Node=(function(_super){
		function Node(){
			this.name="";
			this.destroyed=false;
			this._displayedInStage=false;
			this._parent=null;
			this.model=null;
			Node.__super.call(this);
			this._childs=Node.ARRAY_EMPTY;
			this.timer=Laya.timer;
			this._$P=Node.PROP_EMPTY;
			this.model=Render.isConchNode ? /*__JS__ */new ConchNode():null;
		}

		__class(Node,'laya.display.Node',_super);
		var __proto=Node.prototype;
		/**
		*<p>??????????????????</p>
		*@param destroyChild ???????????????????????????????????????true,????????????????????????????????????????????????
		*/
		__proto.destroy=function(destroyChild){
			(destroyChild===void 0)&& (destroyChild=true);
			this.destroyed=true;
			this._parent && this._parent.removeChild(this);
			if (this._childs){
				if (destroyChild)this.destroyChildren();
				else this.removeChildren();
			}
			this._childs=null;
			this._$P=null;
			this.offAll();
		}

		/**
		*????????????????????????????????????????????????
		*/
		__proto.destroyChildren=function(){
			if (this._childs){
				for (var i=this._childs.length-1;i >-1;i--){
					this._childs[i].destroy(true);
				}
			}
		}

		/**
		*??????????????????
		*@param node ????????????
		*@return ?????????????????????
		*/
		__proto.addChild=function(node){
			if (this.destroyed || node===this)return node;
			if (node._parent===this){
				this._childs.splice(this.getChildIndex(node),1);
				this._childs.push(node);
				if (this.model){
					this.model.removeChild(node.model);
					this.model.addChildAt(node.model,this._childs.length-1);
				}
				this._childChanged();
				}else {
				node.parent && node.parent.removeChild(node);
				this._childs===Node.ARRAY_EMPTY && (this._childs=[]);
				this._childs.push(node);
				this.model && this.model.addChildAt(node.model,this._childs.length-1);
				node.parent=this;
				this._childChanged();
			}
			return node;
		}

		/**
		*?????????????????????
		*@param ...args ??????????????????
		*/
		__proto.addChildren=function(__args){
			var args=arguments;
			var i=0,n=args.length;
			while (i < n){
				this.addChild(args[i++]);
			}
		}

		/**
		*??????????????????????????????????????????
		*@param node ???????????????
		*@param index ???????????????
		*@return ????????????????????????
		*/
		__proto.addChildAt=function(node,index){
			if (this.destroyed || node===this)return node;
			if (index >=0 && index <=this._childs.length){
				if (node._parent===this){
					var oldIndex=this.getChildIndex(node);
					this._childs.splice(oldIndex,1);
					this._childs.splice(index,0,node);
					if (this.model){
						this.model.removeChild(node.model);
						this.model.addChildAt(node.model,index);
					}
					this._childChanged();
					}else {
					node.parent && node.parent.removeChild(node);
					this._childs===Node.ARRAY_EMPTY && (this._childs=[]);
					this._childs.splice(index,0,node);
					this.model && this.model.addChildAt(node.model,index);
					node.parent=this;
				}
				return node;
				}else {
				throw new Error("appendChildAt:The index is out of bounds");
			}
		}

		/**
		*?????????????????????????????????????????????????????????
		*@param node ????????????
		*@return ?????????????????????????????????
		*/
		__proto.getChildIndex=function(node){
			return this._childs.indexOf(node);
		}

		/**
		*???????????????????????????????????????????????????
		*@param name ?????????????????????
		*@return ???????????????
		*/
		__proto.getChildByName=function(name){
			var nodes=this._childs;
			for (var i=0,n=nodes.length;i < n;i++){
				var node=nodes[i];
				if (node.name===name)return node;
			}
			return null;
		}

		/**@private */
		__proto._get$P=function(key){
			return this._$P[key];
		}

		/**@private */
		__proto._set$P=function(key,value){
			if (!this.destroyed){
				this._$P===Node.PROP_EMPTY && (this._$P={});
				this._$P[key]=value;
			}
			return value;
		}

		/**
		*?????????????????????????????????????????????????????????
		*@param index ????????????
		*@return ?????????
		*/
		__proto.getChildAt=function(index){
			return this._childs[index];
		}

		/**
		*?????????????????????????????????
		*@param node ????????????
		*@param index ???????????????
		*@return ????????????????????????
		*/
		__proto.setChildIndex=function(node,index){
			var childs=this._childs;
			if (index < 0 || index >=childs.length){
				throw new Error("setChildIndex:The index is out of bounds.");
			};
			var oldIndex=this.getChildIndex(node);
			if (oldIndex < 0)throw new Error("setChildIndex:node is must child of this object.");
			childs.splice(oldIndex,1);
			childs.splice(index,0,node);
			if (this.model){
				this.model.removeChild(node.model);
				this.model.addChildAt(node.model,index);
			}
			this._childChanged();
			return node;
		}

		/**
		*@private
		*????????????????????????
		*@param child ????????????
		*/
		__proto._childChanged=function(child){}
		/**
		*??????????????????
		*@param node ?????????
		*@return ??????????????????
		*/
		__proto.removeChild=function(node){
			if (!this._childs)return node;
			var index=this._childs.indexOf(node);
			return this.removeChildAt(index);
		}

		/**
		*??????????????????????????????????????????????????????????????????
		*@return ??????????????? Node ????????????
		*/
		__proto.removeSelf=function(){
			this._parent && this._parent.removeChild(this);
			return this;
		}

		/**
		*??????????????????????????????????????????????????????????????????????????????????????????
		*@param name ???????????????
		*@return ????????????????????? Node ????????????
		*/
		__proto.removeChildByName=function(name){
			var node=this.getChildByName(name);
			node && this.removeChild(node);
			return node;
		}

		/**
		*???????????????????????????????????????????????????????????????
		*@param index ?????????????????????
		*@return ?????????????????????
		*/
		__proto.removeChildAt=function(index){
			var node=this.getChildAt(index);
			if (node){
				this._childs.splice(index,1);
				this.model && this.model.removeChild(node.model);
				node.parent=null;
			}
			return node;
		}

		/**
		*?????????????????????????????????????????????
		*@param beginIndex ???????????????
		*@param endIndex ???????????????
		*@return ?????????????????????
		*/
		__proto.removeChildren=function(beginIndex,endIndex){
			(beginIndex===void 0)&& (beginIndex=0);
			(endIndex===void 0)&& (endIndex=0x7fffffff);
			if (this._childs && this._childs.length > 0){
				var childs=this._childs;
				if (beginIndex===0 && endIndex >=n){
					var arr=childs;
					this._childs=Node.ARRAY_EMPTY;
					}else {
					arr=childs.splice(beginIndex,endIndex-beginIndex);
				}
				for (var i=0,n=arr.length;i < n;i++){
					arr[i].parent=null;
					this.model && this.model.removeChild(arr[i].model);
				}
			}
			return this;
		}

		/**
		*??????????????????
		*@internal ?????????????????????????????????????????????????????????????????????
		*@param newNode ????????????
		*@param oldNode ????????????
		*@return ??????????????????
		*/
		__proto.replaceChild=function(newNode,oldNode){
			var index=this._childs.indexOf(oldNode);
			if (index >-1){
				this._childs.splice(index,1,newNode);
				if (this.model){
					this.model.removeChild(oldNode.model);
					this.model.addChildAt(newNode.model,index);
				}
				oldNode.parent=null;
				newNode.parent=this;
				return newNode;
			}
			return null;
		}

		/**@private */
		__proto._setDisplay=function(value){
			if (this._displayedInStage!==value){
				this._displayedInStage=value;
				if (value)this.event(/*laya.events.Event.DISPLAY*/"display");
				else this.event(/*laya.events.Event.UNDISPLAY*/"undisplay");
			}
		}

		/**
		*@private
		*????????????????????????????????????(????????????????????????)???
		*@param node ?????????
		*@param display ???????????????
		*/
		__proto._displayChild=function(node,display){
			var childs=node._childs;
			if (childs){
				for (var i=childs.length-1;i >-1;i--){
					var child=childs[i];
					child._setDisplay(display);
					child._childs.length && this._displayChild(child,display);
				}
			}
			node._setDisplay(display);
		}

		/**
		*???????????????????????? <code>node</code> ?????????
		*@param node ??????????????? <code>Node</code>???
		*@return ?????????????????????????????????<code>node</code>?????????
		*/
		__proto.contains=function(node){
			if (node===this)return true;
			while (node){
				if (node.parent===this)return true;
				node=node.parent;
			}
			return false;
		}

		/**
		*??????????????????????????????
		*@param delay ????????????(????????????)???
		*@param caller ?????????(this)???
		*@param method ???????????????????????????
		*@param args ???????????????
		*@param coverBefore ?????????????????????????????????????????????true???
		*/
		__proto.timerLoop=function(delay,caller,method,args,coverBefore){
			(coverBefore===void 0)&& (coverBefore=true);
			this.timer._create(false,true,delay,caller,method,args,coverBefore);
		}

		/**
		*??????????????????????????????
		*@param delay ????????????(????????????)???
		*@param caller ?????????(this)???
		*@param method ???????????????????????????
		*@param args ???????????????
		*@param coverBefore ?????????????????????????????????????????????true???
		*/
		__proto.timerOnce=function(delay,caller,method,args,coverBefore){
			(coverBefore===void 0)&& (coverBefore=true);
			this.timer._create(false,false,delay,caller,method,args,coverBefore);
		}

		/**
		*???????????????????????????(????????????)???
		*@param delay ????????????(????????????)???
		*@param caller ?????????(this)???
		*@param method ???????????????????????????
		*@param args ???????????????
		*@param coverBefore ?????????????????????????????????????????????true???
		*/
		__proto.frameLoop=function(delay,caller,method,args,coverBefore){
			(coverBefore===void 0)&& (coverBefore=true);
			this.timer._create(true,true,delay,caller,method,args,coverBefore);
		}

		/**
		*???????????????????????????(????????????)???
		*@param delay ????????????(????????????)???
		*@param caller ?????????(this)
		*@param method ????????????????????????
		*@param args ????????????
		*@param coverBefore ?????????????????????????????????????????????true
		*/
		__proto.frameOnce=function(delay,caller,method,args,coverBefore){
			(coverBefore===void 0)&& (coverBefore=true);
			this.timer._create(true,false,delay,caller,method,args,coverBefore);
		}

		/**
		*??????????????????
		*@param caller ?????????(this)???
		*@param method ???????????????????????????
		*/
		__proto.clearTimer=function(caller,method){
			this.timer.clear(caller,method);
		}

		/**
		*??????????????????
		*/
		__getset(0,__proto,'numChildren',function(){
			return this._childs.length;
		});

		/**????????????*/
		__getset(0,__proto,'parent',function(){
			return this._parent;
			},function(value){
			if (this._parent!==value){
				if (value){
					this._parent=value;
					this.event(/*laya.events.Event.ADDED*/"added");
					value.displayedInStage && this._displayChild(this,true);
					value._childChanged(this);
					}else {
					this.event(/*laya.events.Event.REMOVED*/"removed");
					this._parent._childChanged();
					this._displayChild(this,false);
					this._parent=value;
				}
			}
		});

		/**????????????????????????????????????????????????????????????????????????*/
		__getset(0,__proto,'displayedInStage',function(){
			return this._displayedInStage;
		});

		Node.ARRAY_EMPTY=[];
		Node.PROP_EMPTY={};
		return Node;
	})(EventDispatcher)


	/**
	*@private
	*<code>CSSStyle</code> ????????????CSS??????????????????
	*/
	//class laya.display.css.CSSStyle extends laya.display.css.Style
	var CSSStyle=(function(_super){
		function CSSStyle(ower){
			this._bgground=null;
			this._border=null;
			//this._ower=null;
			this._rect=null;
			this.lineHeight=0;
			CSSStyle.__super.call(this);
			this._padding=CSSStyle._PADDING;
			this._spacing=CSSStyle._SPACING;
			this._aligns=CSSStyle._ALIGNS;
			this._font=Font.EMPTY;
			this._ower=ower;
		}

		__class(CSSStyle,'laya.display.css.CSSStyle',_super);
		var __proto=CSSStyle.prototype;
		/**@inheritDoc */
		__proto.destroy=function(){
			this._ower=null;
			this._font=null;
			this._rect=null;
		}

		/**
		*??????????????? CSSStyle ????????????
		*@param src ???????????? CSSStyle ?????????
		*/
		__proto.inherit=function(src){
			this._font=src._font;
			this._spacing=src._spacing===CSSStyle._SPACING ? CSSStyle._SPACING :src._spacing.slice();
			this.lineHeight=src.lineHeight;
		}

		/**@private */
		__proto._widthAuto=function(){
			return (this._type & 0x40000)!==0;
		}

		/**@inheritDoc */
		__proto.widthed=function(sprite){
			return (this._type & 0x8)!=0;
		}

		/**
		*@private
		*/
		__proto._calculation=function(type,value){
			if (value.indexOf('%')< 0)return false;
			var ower=this._ower;
			var parent=ower.parent;
			var rect=this._rect;
			function getValue (pw,w,nums){
				return (pw *nums[0]+w *nums[1]+nums[2]);
			}
			function onParentResize (type){
				var pw=parent.width,w=ower.width;
				rect.width && (ower.width=getValue(pw,w,rect.width));
				rect.height && (ower.height=getValue(pw,w,rect.height));
				rect.left && (ower.x=getValue(pw,w,rect.left));
				rect.top && (ower.y=getValue(pw,w,rect.top));
			}
			if (rect===null){
				parent._getCSSStyle()._type |=0x80000;
				parent.on(/*laya.events.Event.RESIZE*/"resize",this,onParentResize);
				this._rect=rect={input:{}};
			};
			var nums=value.split(' ');
			nums[0]=parseFloat(nums[0])/ 100;
			if (nums.length==1)
				nums[1]=nums[2]=0;
			else {
				nums[1]=parseFloat(nums[1])/ 100;
				nums[2]=parseFloat(nums[2]);
			}
			rect[type]=nums;
			rect.input[type]=value;
			onParentResize(type);
			return true;
		}

		/**
		*????????????????????????
		*@param sprite ???????????? Sprite???
		*@return ??????Boolean ??????????????????????????????
		*/
		__proto.heighted=function(sprite){
			return (this._type & 0x2000)!=0;
		}

		/**
		*???????????????
		*@param w ?????????
		*@param h ?????????
		*/
		__proto.size=function(w,h){
			var ower=this._ower;
			var resize=false;
			if (w!==-1 && w !=this._ower.width){
				this._type |=0x8;
				this._ower.width=w;
				resize=true;
			}
			if (h!==-1 && h !=this._ower.height){
				this._type |=0x2000;
				this._ower.height=h;
				resize=true;
			}
			if (resize){
				ower._layoutLater();
				(this._type & 0x80000)&& ower.event(/*laya.events.Event.RESIZE*/"resize",this);
			}
		}

		/**@private */
		__proto._getAlign=function(){
			return this._aligns[0];
		}

		/**@private */
		__proto._getValign=function(){
			return this._aligns[1];
		}

		/**@private */
		__proto._getCssFloat=function(){
			return (this._type & 0x8000)!=0 ? 0x8000 :0;
		}

		__proto._createFont=function(){
			return (this._type & 0x1000)? this._font :(this._type |=0x1000,this._font=new Font(this._font));
		}

		/**@inheritDoc */
		__proto.render=function(sprite,context,x,y){
			var w=sprite.width;
			var h=sprite.height;
			x-=sprite.pivotX;
			y-=sprite.pivotY;
			this._bgground && this._bgground.color !=null && context.ctx.fillRect(x,y,w,h,this._bgground.color);
			this._border && this._border.color && context.drawRect(x,y,w,h,this._border.color.strColor,this._border.size);
		}

		/**@inheritDoc */
		__proto.getCSSStyle=function(){
			return this;
		}

		/**
		*?????? CSS ??????????????????
		*@param text CSS??????????????????
		*/
		__proto.cssText=function(text){
			this.attrs(CSSStyle.parseOneCSS(text,';'));
		}

		/**
		*???????????????????????????????????????????????????????????????????????????
		*@param attrs ??????????????????????????????
		*/
		__proto.attrs=function(attrs){
			if (attrs){
				for (var i=0,n=attrs.length;i < n;i++){
					var attr=attrs[i];
					this[attr[0]]=attr[1];
				}
			}
		}

		/**@inheritDoc */
		__proto.setTransform=function(value){
			(value==='none')? (this._tf=Style._TF_EMPTY):this.attrs(CSSStyle.parseOneCSS(value,','));
		}

		/**
		*?????? X ??????Y ??????????????????
		*@param x X ???????????????
		*@param y Y ???????????????
		*/
		__proto.translate=function(x,y){
			this._tf===Style._TF_EMPTY && (this._tf=new TransformInfo());
			this._tf.translateX=x;
			this._tf.translateY=y;
		}

		/**
		*?????? ???????????????
		*@param x X ???????????????
		*@param y Y ???????????????
		*/
		__proto.scale=function(x,y){
			this._tf===Style._TF_EMPTY && (this._tf=new TransformInfo());
			this._tf.scaleX=x;
			this._tf.scaleY=y;
		}

		/**@private */
		__proto._enableLayout=function(){
			return (this._type & 0x2)===0 && (this._type & 0x4)===0;
		}

		/**
		*??????????????????????????????
		*/
		__getset(0,__proto,'block',_super.prototype._$get_block,function(value){
			value ? (this._type |=0x1):(this._type &=(~0x1));
		});

		/**
		*?????????????????????
		*/
		__getset(0,__proto,'valign',function(){
			return CSSStyle._valigndef[this._aligns[1]];
			},function(value){
			this._aligns===CSSStyle._ALIGNS && (this._aligns=[0,0,0]);
			this._aligns[1]=CSSStyle._valigndef[value];
		});

		/**
		*?????????
		*/
		__getset(0,__proto,'height',null,function(h){
			this._type |=0x2000;
			if ((typeof h=='string')){
				if (this._calculation("height",h))return;
				h=parseInt(h);
			}
			this.size(-1,h);
		});

		/**
		*?????????
		*/
		__getset(0,__proto,'width',null,function(w){
			this._type |=0x8;
			if ((typeof w=='string')){
				var offset=w.indexOf('auto');
				if (offset >=0){
					this._type |=0x40000;
					w=w.substr(0,offset);
				}
				if (this._calculation("width",w))return;
				w=parseInt(w);
			}
			this.size(w,-1);
		});

		/**
		*???????????????
		*/
		__getset(0,__proto,'fontWeight',function(){
			return this._font.weight;
			},function(value){
			this._createFont().weight=value;
		});

		/**
		*??????????????????
		*/
		__getset(0,__proto,'left',null,function(value){
			var ower=this._ower;
			if (((typeof value=='string'))){
				if (value==="center")
					value="50% -50% 0";
				else if (value==="right")
				value="100% -100% 0";
				if (this._calculation("left",value))return;
				value=parseInt(value);
			}
			ower.x=value;
		});

		__getset(0,__proto,'_translate',null,function(value){
			this.translate(value[0],value[1]);
		});

		/**@inheritDoc */
		__getset(0,__proto,'absolute',function(){
			return (this._type & 0x4)!==0;
		});

		/**
		*??????????????????
		*/
		__getset(0,__proto,'top',null,function(value){
			var ower=this._ower;
			if (((typeof value=='string'))){
				if (value==="middle")
					value="50% -50% 0";
				else if (value==="bottom")
				value="100% -100% 0";
				if (this._calculation("top",value))return;
				value=parseInt(value);
			}
			ower.y=value;
		});

		/**
		*?????????????????????
		*/
		__getset(0,__proto,'align',function(){
			return CSSStyle._aligndef[this._aligns[0]];
			},function(value){
			this._aligns===CSSStyle._ALIGNS && (this._aligns=[0,0,0]);
			this._aligns[0]=CSSStyle._aligndef[value];
		});

		/**
		*?????????????????????
		*/
		__getset(0,__proto,'bold',function(){
			return this._font.bold;
			},function(value){
			this._createFont().bold=value;
		});

		/**
		*???????????????
		*/
		__getset(0,__proto,'padding',function(){
			return this._padding;
			},function(value){
			this._padding=value;
		});

		/**
		*????????????
		*/
		__getset(0,__proto,'leading',function(){
			return this._spacing[1];
			},function(d){
			((typeof d=='string'))&& (d=parseInt(d+""));
			this._spacing===CSSStyle._SPACING && (this._spacing=[0,0]);
			this._spacing[1]=d;
		});

		/**
		*?????????????????????
		*/
		__getset(0,__proto,'lineElement',function(){
			return (this._type & 0x10000)!=0;
			},function(value){
			value ? (this._type |=0x10000):(this._type &=(~0x10000));
		});

		/**
		*???????????????
		*/
		__getset(0,__proto,'cssFloat',function(){
			return (this._type & 0x8000)!=0 ? "right" :"left";
			},function(value){
			this.lineElement=false;
			value==="right" ? (this._type |=0x8000):(this._type &=(~0x8000));
		});

		/**
		*???????????????????????????
		*/
		__getset(0,__proto,'textDecoration',function(){
			return this._font.decoration;
			},function(value){
			this._createFont().decoration=value;
		});

		/**
		*???????????????????????????????????????
		*/
		__getset(0,__proto,'whiteSpace',function(){
			return (this._type & 0x20000)? "nowrap" :"";
			},function(type){
			type==="nowrap" && (this._type |=0x20000);
			type==="none" && (this._type &=~0x20000);
		});

		__getset(0,__proto,'background',null,function(value){
			if (!value){
				this._bgground=null;
				return;
			}
			this._bgground || (this._bgground={});
			this._bgground.color=value;
			this._ower.model && this._ower.model.bgColor(value);
			this._type |=0x4000;
			this._ower._renderType |=/*laya.renders.RenderSprite.STYLE*/0x80;
		});

		/**
		*?????????????????????
		*/
		__getset(0,__proto,'wordWrap',function(){
			return (this._type & 0x20000)===0;
			},function(value){
			value ? (this._type &=~0x20000):(this._type |=0x20000);
		});

		/**
		*???????????????
		*/
		__getset(0,__proto,'color',function(){
			return this._font.color;
			},function(value){
			this._createFont().color=value;
		});

		/**
		*<p>????????????????????????????????????????????????</p>
		*???????????????????????? true???????????????????????????????????????????????????????????????????????????????????????????????????????????????????????? false??????????????????????????????????????????????????????
		*/
		__getset(0,__proto,'password',function(){
			return this._font.password;
			},function(value){
			this._createFont().password=value;
		});

		/**
		*???????????????
		*/
		__getset(0,__proto,'backgroundColor',function(){
			return this._bgground ? this._bgground.color :null;
			},function(value){
			if (value==='none')this._bgground=null;
			else (this._bgground || (this._bgground={}),this._bgground.color=value);
			this._ower.model && this._ower.model.bgColor(value);
			this._ower._renderType |=/*laya.renders.RenderSprite.STYLE*/0x80;
		});

		/**
		*???????????????
		*/
		__getset(0,__proto,'font',function(){
			return this._font.toString();
			},function(value){
			this._createFont().set(value);
		});

		/**
		*??????????????????
		*/
		__getset(0,__proto,'weight',null,function(value){
			this._createFont().weight=value;
		});

		/**
		*?????????
		*/
		__getset(0,__proto,'letterSpacing',function(){
			return this._spacing[0];
			},function(d){
			((typeof d=='string'))&& (d=parseInt(d+""));
			this._spacing===CSSStyle._SPACING && (this._spacing=[0,0]);
			this._spacing[0]=d;
		});

		/**
		*???????????????
		*/
		__getset(0,__proto,'fontSize',function(){
			return this._font.size;
			},function(value){
			this._createFont().size=value;
		});

		/**
		*????????????????????????
		*/
		__getset(0,__proto,'italic',function(){
			return this._font.italic;
			},function(value){
			this._createFont().italic=value;
		});

		/**
		*???????????????
		*/
		__getset(0,__proto,'fontFamily',function(){
			return this._font.family;
			},function(value){
			this._createFont().family=value;
		});

		/**
		*<p>???????????????????????????????????????</p>
		*?????????0?????????????????????
		*@default 0
		*/
		__getset(0,__proto,'stroke',function(){
			return this._font.stroke[0];
			},function(value){
			if (this._createFont().stroke===Font._STROKE)this._font.stroke=[0,"#000000"];
			this._font.stroke[0]=value;
		});

		/**
		*<p>????????????????????????????????????</p>
		*@default "#000000";
		*/
		__getset(0,__proto,'strokeColor',function(){
			return this._font.stroke[1];
			},function(value){
			if (this._createFont().stroke===Font._STROKE)this._font.stroke=[0,"#000000"];
			this._font.stroke[1]=value;
		});

		/**
		*?????????????????????border="5px solid red"
		*/
		__getset(0,__proto,'border',function(){
			return this._border ? this._border.value :"";
			},function(value){
			if (value=='none'){
				this._border=null;
				return;
			}
			this._border || (this._border={});
			this._border.value=value;
			var values=value.split(' ');
			this._border.color=Color.create(values[values.length-1]);
			if (values.length==1){
				this._border.size=1;
				this._border.type='solid';
				return;
			};
			var i=0;
			if (values[0].indexOf('px')> 0){
				this._border.size=parseInt(values[0]);
				i++;
			}else this._border.size=1;
			this._border.type=values[i];
			this._ower._renderType |=/*laya.renders.RenderSprite.STYLE*/0x80;
		});

		/**
		*??????????????????
		*/
		__getset(0,__proto,'borderColor',function(){
			return (this._border && this._border.color)? this._border.color.strColor :null;
			},function(value){
			if (!value){
				this._border=null;
				return;
			}
			this._border || (this._border={size:1,type:'solid'});
			this._border.color=(value==null)? null :Color.create(value);
			this._ower.model && this._ower.model.border(this._border.color.strColor);
			this._ower._renderType |=/*laya.renders.RenderSprite.STYLE*/0x80;
		});

		/**
		*????????????????????????
		*/
		__getset(0,__proto,'position',function(){
			return (this._type & 0x4)? "absolute" :"";
			},function(value){
			value=="absolute" ? (this._type |=0x4):(this._type &=~0x4);
		});

		/**
		*??????????????????????????????????????????
		*/
		__getset(0,__proto,'display',null,function(value){
			switch (value){
				case '':
					this._type &=~0x2;
					this.visible=true;
					break ;
				case 'none':
					this._type |=0x2;
					this.visible=false;
					this._ower._layoutLater();
					break ;
				}
		});

		/**@inheritDoc */
		__getset(0,__proto,'paddingLeft',function(){
			return this.padding[3];
		});

		/**@inheritDoc */
		__getset(0,__proto,'paddingTop',function(){
			return this.padding[0];
		});

		__getset(0,__proto,'_scale',null,function(value){
			this._ower.scale(value[0],value[1]);
		});

		__getset(0,__proto,'_rotate',null,function(value){
			this._ower.rotation=value;
		});

		CSSStyle.parseOneCSS=function(text,clipWord){
			var out=[];
			var attrs=text.split(clipWord);
			var valueArray;
			for (var i=0,n=attrs.length;i < n;i++){
				var attr=attrs[i];
				var ofs=attr.indexOf(':');
				var name=attr.substr(0,ofs).replace(/^\s+|\s+$/g,'');
				if (name.length==0)
					continue ;
				var value=attr.substr(ofs+1).replace(/^\s+|\s+$/g,'');
				var one=[name,value];
				switch (name){
					case 'italic':
					case 'bold':
						one[1]=value=="true";
						break ;
					case 'line-height':
						one[0]='lineHeight';
						one[1]=parseInt(value);
						break ;
					case 'font-size':
						one[0]='fontSize';
						one[1]=parseInt(value);
						break ;
					case 'padding':
						valueArray=value.split(' ');
						valueArray.length > 1 || (valueArray[1]=valueArray[2]=valueArray[3]=valueArray[0]);
						one[1]=[parseInt(valueArray[0]),parseInt(valueArray[1]),parseInt(valueArray[2]),parseInt(valueArray[3])];
						break ;
					case 'rotate':
						one[0]="_rotate";
						one[1]=parseFloat(value);
						break ;
					case 'scale':
						valueArray=value.split(' ');
						one[0]="_scale";
						one[1]=[parseFloat(valueArray[0]),parseFloat(valueArray[1])];
						break ;
					case 'translate':
						valueArray=value.split(' ');
						one[0]="_translate";
						one[1]=[parseInt(valueArray[0]),parseInt(valueArray[1])];
						break ;
					default :
						(one[0]=CSSStyle._CSSTOVALUE[name])|| (one[0]=name);
					}
				out.push(one);
			}
			return out;
		}

		CSSStyle.parseCSS=function(text,uri){
			var one;
			while ((one=CSSStyle._parseCSSRegExp.exec(text))!=null){
				CSSStyle.styleSheets[one[1]]=CSSStyle.parseOneCSS(one[2],';');
			}
		}

		CSSStyle.EMPTY=new CSSStyle(null);
		CSSStyle._CSSTOVALUE={'letter-spacing':'letterSpacing','line-spacing':'lineSpacing','white-space':'whiteSpace','line-height':'lineHeight','scale-x':'scaleX','scale-y':'scaleY','translate-x':'translateX','translate-y':'translateY','font-family':'fontFamily','font-weight':'fontWeight','vertical-align':'valign','text-decoration':'textDecoration','background-color':'backgroundColor','border-color':'borderColor','float':'cssFloat'};
		CSSStyle._parseCSSRegExp=new RegExp("([\.\#]\\w+)\\s*{([\\s\\S]*?)}","g");
		CSSStyle._aligndef={'left':0,'center':1,'right':2,0:'left',1:'center',2:'right'};
		CSSStyle._valigndef={'top':0,'middle':1,'bottom':2,0:'top',1:'middle',2:'bottom'};
		CSSStyle.styleSheets={};
		CSSStyle.ALIGN_CENTER=1;
		CSSStyle.ALIGN_RIGHT=2;
		CSSStyle.VALIGN_MIDDLE=1;
		CSSStyle.VALIGN_BOTTOM=2;
		CSSStyle._CSS_BLOCK=0x1;
		CSSStyle._DISPLAY_NONE=0x2;
		CSSStyle._ABSOLUTE=0x4;
		CSSStyle._WIDTH_SET=0x8;
		CSSStyle._PADDING=[0,0,0,0];
		CSSStyle._RECT=[-1,-1,-1,-1];
		CSSStyle._SPACING=[0,0];
		CSSStyle._ALIGNS=[0,0,0];
		CSSStyle.ADDLAYOUTED=0x200;
		CSSStyle._NEWFONT=0x1000;
		CSSStyle._HEIGHT_SET=0x2000;
		CSSStyle._BACKGROUND_SET=0x4000;
		CSSStyle._FLOAT_RIGHT=0x8000;
		CSSStyle._LINE_ELEMENT=0x10000;
		CSSStyle._NOWARP=0x20000;
		CSSStyle._WIDTHAUTO=0x40000;
		CSSStyle._LISTERRESZIE=0x80000;
		return CSSStyle;
	})(Style)


	/**
	*@private
	*??????Audio??????????????????
	*/
	//class laya.media.h5audio.AudioSound extends laya.events.EventDispatcher
	var AudioSound=(function(_super){
		function AudioSound(){
			this.url=null;
			this.audio=null;
			this.loaded=false;
			AudioSound.__super.call(this);
		}

		__class(AudioSound,'laya.media.h5audio.AudioSound',_super);
		var __proto=AudioSound.prototype;
		/**
		*????????????
		*
		*/
		__proto.dispose=function(){
			var ad=AudioSound._audioCache[this.url];
			if (ad){
				ad.src="";
				delete AudioSound._audioCache[this.url];
			}
		}

		/**
		*????????????
		*@param url
		*
		*/
		__proto.load=function(url){
			this.url=url;
			var ad=AudioSound._audioCache[url];
			if (ad && ad.readyState >=2){
				this.event(/*laya.events.Event.COMPLETE*/"complete");
				return;
			}
			if (!ad){
				ad=Browser.createElement("audio");
				ad.src=url;
				AudioSound._audioCache[url]=ad;
			}
			ad.addEventListener("canplaythrough",onLoaded);
			ad.addEventListener("error",onErr);
			var me=this;
			function onLoaded (){
				offs();
				me.loaded=true;
				me.event(/*laya.events.Event.COMPLETE*/"complete");
			}
			function onErr (){
				offs();
				me.event(/*laya.events.Event.ERROR*/"error");
			}
			function offs (){
				ad.removeEventListener("canplaythrough",onLoaded);
				ad.removeEventListener("error",onErr);
			}
			this.audio=ad;
			if (ad.load){
				ad.load();
				}else {
				onErr();
			}
		}

		/**
		*????????????
		*@param startTime ????????????
		*@param loops ????????????
		*@return
		*
		*/
		__proto.play=function(startTime,loops){
			(startTime===void 0)&& (startTime=0);
			(loops===void 0)&& (loops=0);
			if (!this.url)return null;
			var ad;
			ad=AudioSound._audioCache[this.url];
			if (!ad)return null;
			var tAd;
			tAd=Pool.getItem("audio:"+this.url);
			tAd=tAd?tAd:ad.cloneNode(true);
			var channel=new AudioSoundChannel(tAd);
			channel.url=this.url;
			channel.loops=loops;
			channel.startTime=startTime;
			channel.play();
			SoundManager.addChannel(channel);
			return channel;
		}

		/**
		*??????????????????
		*/
		__getset(0,__proto,'duration',function(){
			var ad;
			ad=AudioSound._audioCache[this.url];
			if (!ad)
				return 0;
			return ad.duration;
		});

		AudioSound._audioCache={};
		return AudioSound;
	})(EventDispatcher)


	/**
	*<code>SoundChannel</code> ?????????????????????????????????
	*/
	//class laya.media.SoundChannel extends laya.events.EventDispatcher
	var SoundChannel=(function(_super){
		function SoundChannel(){
			this.url=null;
			this.loops=0;
			this.startTime=NaN;
			this.isStopped=false;
			this.completeHandler=null;
			SoundChannel.__super.call(this);
		}

		__class(SoundChannel,'laya.media.SoundChannel',_super);
		var __proto=SoundChannel.prototype;
		/**
		*?????????
		*/
		__proto.play=function(){}
		/**
		*?????????
		*/
		__proto.stop=function(){}
		/**
		*private
		*/
		__proto.__runComplete=function(handler){
			if (handler){
				handler.run();
			}
		}

		/**
		*?????????
		*/
		__getset(0,__proto,'volume',function(){
			return 1;
			},function(v){
		});

		/**
		*???????????????????????????
		*/
		__getset(0,__proto,'position',function(){
			return 0;
		});

		/**
		*??????????????????
		*/
		__getset(0,__proto,'duration',function(){
			return 0;
		});

		return SoundChannel;
	})(EventDispatcher)


	/**
	*<code>Sound</code> ???????????????????????????????????????
	*/
	//class laya.media.Sound extends laya.events.EventDispatcher
	var Sound=(function(_super){
		function Sound(){Sound.__super.call(this);;
		};

		__class(Sound,'laya.media.Sound',_super);
		var __proto=Sound.prototype;
		/**
		*???????????????
		*@param url ?????????
		*
		*/
		__proto.load=function(url){}
		/**
		*???????????????
		*@param startTime ????????????,?????????
		*@param loops ????????????,0??????????????????
		*@return ?????? SoundChannel ?????????
		*
		*/
		__proto.play=function(startTime,loops){
			(startTime===void 0)&& (startTime=0);
			(loops===void 0)&& (loops=0);
			return null;
		}

		/**
		*?????????????????????
		*
		*/
		__proto.dispose=function(){}
		/**
		*??????????????????
		*/
		__getset(0,__proto,'duration',function(){
			return 0;
		});

		return Sound;
	})(EventDispatcher)


	/**
	*@private
	*web audio api??????????????????
	*/
	//class laya.media.webaudio.WebAudioSound extends laya.events.EventDispatcher
	var WebAudioSound=(function(_super){
		function WebAudioSound(){
			this.url=null;
			this.loaded=false;
			this.data=null;
			this.audioBuffer=null;
			this.__toPlays=null;
			WebAudioSound.__super.call(this);
		}

		__class(WebAudioSound,'laya.media.webaudio.WebAudioSound',_super);
		var __proto=WebAudioSound.prototype;
		/**
		*????????????
		*@param url
		*
		*/
		__proto.load=function(url){
			var me=this;
			this.url=url;
			this.audioBuffer=WebAudioSound._dataCache[url];
			if (this.audioBuffer){
				this._loaded(this.audioBuffer);
				return;
			}
			WebAudioSound.e.on("loaded:"+url,this,this._loaded);
			WebAudioSound.e.on("err:"+url,this,this._err);
			if (WebAudioSound.__loadingSound[url]){
				return;
			}
			WebAudioSound.__loadingSound[url]=true;
			var request=new Browser.window.XMLHttpRequest();
			request.open("GET",url,true);
			request.responseType="arraybuffer";
			request.onload=function (){
				me.data=request.response;
				WebAudioSound.buffs.push({"buffer":me.data,"url":me.url});
				WebAudioSound.decode();
			};
			request.onerror=function (e){
				me._err();
			}
			request.send();
		}

		__proto._err=function(){
			this._removeLoadEvents();
			WebAudioSound.__loadingSound[this.url]=false;
			this.event(/*laya.events.Event.ERROR*/"error");
		}

		__proto._loaded=function(audioBuffer){
			this._removeLoadEvents();
			this.audioBuffer=audioBuffer;
			WebAudioSound._dataCache[this.url]=this.audioBuffer;
			this.loaded=true;
			this.event(/*laya.events.Event.COMPLETE*/"complete");
		}

		__proto._removeLoadEvents=function(){
			WebAudioSound.e.off("loaded:"+this.url,this,this._loaded);
			WebAudioSound.e.off("err:"+this.url,this,this._err);
		}

		__proto.__playAfterLoaded=function(){
			if (!this.__toPlays)return;
			var i=0,len=0;
			var toPlays;
			toPlays=this.__toPlays;
			len=toPlays.length;
			var tParams;
			for (i=0;i < len;i++){
				tParams=toPlays[i];
				if(tParams[2]&&!(tParams [2]).isStopped){
					this.play(tParams[0],tParams[1],tParams[2]);
				}
			}
			this.__toPlays.length=0;
		}

		/**
		*????????????
		*@param startTime ????????????
		*@param loops ????????????
		*@return
		*
		*/
		__proto.play=function(startTime,loops,channel){
			(startTime===void 0)&& (startTime=0);
			(loops===void 0)&& (loops=0);
			channel=channel ? channel :new WebAudioSoundChannel();
			if (!this.audioBuffer){
				if (this.url){
					if (!this.__toPlays)this.__toPlays=[];
					this.__toPlays.push([startTime,loops,channel]);
					this.once(/*laya.events.Event.COMPLETE*/"complete",this,this.__playAfterLoaded);
					this.load(this.url);
				}
			}
			channel.url=this.url;
			channel.loops=loops;
			channel["audioBuffer"]=this.audioBuffer;
			channel.startTime=startTime;
			channel.play();
			SoundManager.addChannel(channel);
			return channel;
		}

		__proto.dispose=function(){
			delete WebAudioSound._dataCache[this.url];
			delete WebAudioSound.__loadingSound[this.url];
		}

		__getset(0,__proto,'duration',function(){
			if (this.audioBuffer){
				return this.audioBuffer.duration;
			}
			return 0;
		});

		WebAudioSound.decode=function(){
			if (WebAudioSound.buffs.length <=0 || WebAudioSound.isDecoding){
				return;
			}
			WebAudioSound.isDecoding=true;
			WebAudioSound.tInfo=WebAudioSound.buffs.shift();
			WebAudioSound.ctx.decodeAudioData(WebAudioSound.tInfo["buffer"],WebAudioSound._done,WebAudioSound._fail);
		}

		WebAudioSound._done=function(audioBuffer){
			WebAudioSound.e.event("loaded:"+WebAudioSound.tInfo.url,audioBuffer);
			WebAudioSound.isDecoding=false;
			WebAudioSound.decode();
		}

		WebAudioSound._fail=function(){
			WebAudioSound.e.event("err:"+WebAudioSound.tInfo.url,null);
			WebAudioSound.isDecoding=false;
			WebAudioSound.decode();
		}

		WebAudioSound._playEmptySound=function(){
			if (WebAudioSound.ctx==null){return;};
			var source=WebAudioSound.ctx.createBufferSource();
			source.buffer=WebAudioSound._miniBuffer;
			source.connect(WebAudioSound.ctx.destination);
			source.start(0,0,0);
		}

		WebAudioSound._unlock=function(){
			if (WebAudioSound._unlocked){return;}
				WebAudioSound._playEmptySound();
			if (WebAudioSound.ctx.state=="running"){
				Browser.document.removeEventListener("mousedown",WebAudioSound._unlock,true);
				Browser.document.removeEventListener("touchend",WebAudioSound._unlock,true);
				WebAudioSound._unlocked=true;
			}
		}

		WebAudioSound.initWebAudio=function(){
			if (WebAudioSound.ctx.state !="running"){
				WebAudioSound._unlock();
				Browser.document.addEventListener("mousedown",WebAudioSound._unlock,true);
				Browser.document.addEventListener("touchend",WebAudioSound._unlock,true);
			}
		}

		WebAudioSound._dataCache={};
		WebAudioSound.buffs=[];
		WebAudioSound.isDecoding=false;
		WebAudioSound._unlocked=false;
		WebAudioSound.tInfo=null
		WebAudioSound.__loadingSound={};
		__static(WebAudioSound,
		['window',function(){return this.window=Browser.window;},'webAudioEnabled',function(){return this.webAudioEnabled=WebAudioSound.window["AudioContext"] || WebAudioSound.window["webkitAudioContext"] || WebAudioSound.window["mozAudioContext"];},'ctx',function(){return this.ctx=WebAudioSound.webAudioEnabled ? new (WebAudioSound.window["AudioContext"] || WebAudioSound.window["webkitAudioContext"] || WebAudioSound.window["mozAudioContext"])():undefined;},'_miniBuffer',function(){return this._miniBuffer=WebAudioSound.ctx.createBuffer(1,1,22050);},'e',function(){return this.e=new EventDispatcher();}
		]);
		return WebAudioSound;
	})(EventDispatcher)


	/**
	*<code>HttpRequest</code> ?????? HTTP ????????????????????? XML ??????????????????
	*/
	//class laya.net.HttpRequest extends laya.events.EventDispatcher
	var HttpRequest=(function(_super){
		function HttpRequest(){
			this._responseType=null;
			this._data=null;
			HttpRequest.__super.call(this);
			this._http=new Browser.window.XMLHttpRequest();
		}

		__class(HttpRequest,'laya.net.HttpRequest',_super);
		var __proto=HttpRequest.prototype;
		/**
		*???????????????
		*@param url ??????????????????
		*@param data ???????????????????????????
		*@param method ??????????????????????????????get?????????post??????????????? ???get????????????
		*@param responseType ?????????????????????????????????"text"???"json"???"xml","arraybuffer"???
		*@param headers ????????????key value???????????????["Content-Type","application/json"]???
		*/
		__proto.send=function(url,data,method,responseType,headers){
			(method===void 0)&& (method="get");
			(responseType===void 0)&& (responseType="text");
			this._responseType=responseType;
			this._data=null;
			var _this=this;
			var http=this._http;
			http.open(method,url,true);
			if (headers){
				for (var i=0;i < headers.length;i++){
					http.setRequestHeader(headers[i++],headers[i]);
				}
				}else {
				if (!data || (typeof data=='string'))http.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
				else http.setRequestHeader("Content-Type","application/json");
			}
			http.responseType=responseType!=="arraybuffer" ? "text" :"arraybuffer";
			http.onerror=function (e){
				_this._onError(e);
			}
			http.onabort=function (e){
				_this._onAbort(e);
			}
			http.onprogress=function (e){
				_this._onProgress(e);
			}
			http.onload=function (e){
				_this._onLoad(e);
			}
			http.send(data);
		}

		/**
		*@private
		*????????????????????????????????????
		*@param e ???????????????
		*/
		__proto._onProgress=function(e){
			if (e && e.lengthComputable)this.event(/*laya.events.Event.PROGRESS*/"progress",e.loaded / e.total);
		}

		/**
		*@private
		*????????????????????????????????????
		*@param e ???????????????
		*/
		__proto._onAbort=function(e){
			this.error("Request was aborted by user");
		}

		/**
		*@private
		*????????????????????????????????????
		*@param e ???????????????
		*/
		__proto._onError=function(e){
			this.error("Request failed Status:"+this._http.status+" text:"+this._http.statusText);
		}

		/**
		*@private
		*??????????????????????????????????????????
		*@param e ???????????????
		*/
		__proto._onLoad=function(e){
			var http=this._http;
			var status=http.status!==undefined ? http.status :200;
			if (status===200 || status===204 || status===0){
				this.complete();
				}else {
				this.error("["+http.status+"]"+http.statusText+":"+http.responseURL);
			}
		}

		/**
		*@private
		*??????????????????????????????
		*@param message ???????????????
		*/
		__proto.error=function(message){
			this.clear();
			this.event(/*laya.events.Event.ERROR*/"error",message);
		}

		/**
		*@private
		*????????????????????????????????????
		*/
		__proto.complete=function(){
			this.clear();
			var flag=true;
			try {
				if (this._responseType==="json"){
					this._data=JSON.parse(this._http.responseText);
					}else if (this._responseType==="xml"){
					this._data=Utils.parseXMLFromString(this._http.responseText);
					}else {
					this._data=this._http.response || this._http.responseText;
				}
				}catch (e){
				flag=false;
				this.error(e.message);
			}
			flag && this.event(/*laya.events.Event.COMPLETE*/"complete",(this._data instanceof Array)? [this._data] :this._data);
		}

		/**
		*@private
		*?????????????????????
		*/
		__proto.clear=function(){
			var http=this._http;
			http.onerror=http.onabort=http.onprogress=http.onload=null;
		}

		/**??????????????????*/
		__getset(0,__proto,'url',function(){
			return this._http.responseURL;
		});

		/**??????XMLHttpRequest??????*/
		__getset(0,__proto,'http',function(){
			return this._http;
		});

		/**??????????????????*/
		__getset(0,__proto,'data',function(){
			return this._data;
		});

		return HttpRequest;
	})(EventDispatcher)


	/**
	*<code>Loader</code> ???????????????????????????JSON???XML?????????????????????????????????
	*/
	//class laya.net.Loader extends laya.events.EventDispatcher
	var Loader=(function(_super){
		function Loader(){
			this._data=null;
			this._url=null;
			this._type=null;
			this._cache=false;
			this._http=null;
			Loader.__super.call(this);
		}

		__class(Loader,'laya.net.Loader',_super);
		var __proto=Loader.prototype;
		/**
		*???????????????
		*@param url ??????
		*@param type ??????????????????null????????????????????????????????????????????????
		*@param cache ?????????????????????
		*@param group ?????????
		*@param ignoreCache ???????????????????????????????????????
		*/
		__proto.load=function(url,type,cache,group,ignoreCache){
			(cache===void 0)&& (cache=true);
			(ignoreCache===void 0)&& (ignoreCache=false);
			if (url.indexOf("data:image")===0)this._type="image";
			url=URL.formatURL(url);
			this._url=url;
			this._type=type || (type=this.getTypeFromUrl(url));
			this._cache=cache;
			this._data=null;
			if (!ignoreCache && Loader.loadedMap[url]){
				this._data=Loader.loadedMap[url];
				this.event(/*laya.events.Event.PROGRESS*/"progress",1);
				this.event(/*laya.events.Event.COMPLETE*/"complete",this._data);
				return;
			}
			if (group)Loader.setGroup(url,group);
			if (Loader.parserMap[type] !=null){
				if (((Loader.parserMap[type])instanceof laya.utils.Handler ))Loader.parserMap[type].runWith(this);
				else Loader.parserMap[type].call(null,this);
				return;
			}
			if (type==="image" || type==="htmlimage" || type==="nativeimage")return this._loadImage(url);
			if (type==="sound")return this._loadSound(url);
			if (!this._http){
				this._http=new HttpRequest();
				this._http.on(/*laya.events.Event.PROGRESS*/"progress",this,this.onProgress);
				this._http.on(/*laya.events.Event.ERROR*/"error",this,this.onError);
				this._http.on(/*laya.events.Event.COMPLETE*/"complete",this,this.onLoaded);
			};
			var contentType;
			switch (type){
				case "atlas":
					contentType="json";
					break ;
				case "font":
					contentType="xml";
					break ;
				default :
					contentType=type;
				}
			this._http.send(url,null,"get",contentType);
		}

		/**
		*??????????????????????????????????????????
		*@param url ???????????????
		*@return ???????????????
		*/
		__proto.getTypeFromUrl=function(url){
			var type=Utils.getFileExtension(url);
			if (type)return Loader.typeMap[type];
			console.log("Not recognize the resources suffix",url);
			return "text";
		}

		/**
		*@private
		*?????????????????????
		*@param url ???????????????
		*/
		__proto._loadImage=function(url){
			var _this=this;
			var image;
			function clear (){
				image.onload=null;
				image.onerror=null;
			};
			var onload=function (){
				clear();
				_this.onLoaded(image);
			};
			var onerror=function (){
				clear();
				_this.event(/*laya.events.Event.ERROR*/"error","Load image filed");
			}
			if (this._type==="nativeimage"){
				image=new Browser.window.Image();
				image.crossOrigin="";
				image.onload=onload;
				image.onerror=onerror;
				image.src=url;
				}else {
				new HTMLImage.create(url,{onload:onload,onerror:onerror,onCreate:function (img){
						image=img;
				}});
			}
		}

		/**
		*@private
		*?????????????????????
		*@param url ???????????????
		*/
		__proto._loadSound=function(url){
			var sound=(new SoundManager._soundClass());
			var _this=this;
			sound.on(/*laya.events.Event.COMPLETE*/"complete",this,soundOnload);
			sound.on(/*laya.events.Event.ERROR*/"error",this,soundOnErr);
			sound.load(url);
			function soundOnload (){
				clear();
				_this.onLoaded(sound);
			}
			function soundOnErr (){
				clear();
				_this.event(/*laya.events.Event.ERROR*/"error","Load sound filed");
			}
			function clear (){
				sound.offAll();
			}
		}

		/**@private */
		__proto.onProgress=function(value){
			if (this._type==="atlas")this.event(/*laya.events.Event.PROGRESS*/"progress",value *0.3);
			else this.event(/*laya.events.Event.PROGRESS*/"progress",value);
		}

		/**@private */
		__proto.onError=function(message){
			this.event(/*laya.events.Event.ERROR*/"error",message);
		}

		/**
		*????????????????????????????????????
		*@param data ?????????
		*/
		__proto.onLoaded=function(data){
			var type=this._type;
			if (type==="image"){
				var tex=new Texture(data);
				tex.url=this._url;
				this.complete(tex);
				}else if (type==="sound" || type==="htmlimage" || type==="nativeimage"){
				this.complete(data);
				}else if (type==="atlas"){
				if (!data.src){
					if (!this._data){
						this._data=data;
						if (data.meta && data.meta.image){
							var toloadPics=data.meta.image.split(",");
							var split=this._url.indexOf("/")>=0 ? "/" :"\\";
							var idx=this._url.lastIndexOf(split);
							var folderPath=idx >=0 ? this._url.substr(0,idx+1):"";
							idx=this._url.indexOf("?");
							var ver;
							ver=idx >=0 ? this._url.substr(idx):"";
							for (var i=0,len=toloadPics.length;i < len;i++){
								toloadPics[i]=folderPath+toloadPics[i]+ver;
							}
							}else {
							toloadPics=[this._url.replace(".json",".png")];
						}
						toloadPics.reverse();
						data.toLoads=toloadPics;
						data.pics=[];
					}
					this.event(/*laya.events.Event.PROGRESS*/"progress",0.3+1 / toloadPics.length *0.6);
					return this._loadImage(URL.formatURL(toloadPics.pop()));
					}else {
					this._data.pics.push(data);
					if (this._data.toLoads.length > 0){
						this.event(/*laya.events.Event.PROGRESS*/"progress",0.3+1 / this._data.toLoads.length *0.6);
						return this._loadImage(URL.formatURL(this._data.toLoads.pop()));
					};
					var frames=this._data.frames;
					var cleanUrl=this._url.split("?")[0];
					var directory=(this._data.meta && this._data.meta.prefix)? URL.basePath+this._data.meta.prefix :cleanUrl.substring(0,cleanUrl.lastIndexOf("."))+"/";
					var pics=this._data.pics;
					var map=Loader.atlasMap[this._url] || (Loader.atlasMap[this._url]=[]);
					map.dir=directory;
					for (var name in frames){
						var obj=frames[name];
						var tPic=pics[obj.frame.idx ? obj.frame.idx :0];
						var url=directory+name;
						Loader.cacheRes(url,Texture.create(tPic,obj.frame.x,obj.frame.y,obj.frame.w,obj.frame.h,obj.spriteSourceSize.x,obj.spriteSourceSize.y,obj.sourceSize.w,obj.sourceSize.h));
						Loader.loadedMap[url].url=url;
						map.push(url);
					}
					this.complete(this._data);
				}
				}else if (type=="font"){
				if (!data.src){
					this._data=data;
					this.event(/*laya.events.Event.PROGRESS*/"progress",0.5);
					return this._loadImage(URL.formatURL(this._url.replace(".fnt",".png")));
					}else {
					var bFont;
					bFont=new BitmapFont();
					bFont.parseFont(this._data,data);
					var tArr=this._url.split(".fnt")[0].split("/");
					var fontName=tArr[tArr.length-1];
					Text.registerBitmapFont(fontName,bFont);
					this._data=bFont;
					this.complete(this._data);
				}
				}else {
				this.complete(data);
			}
		}

		/**
		*???????????????
		*@param data ??????????????????
		*/
		__proto.complete=function(data){
			this._data=data;
			Loader._loaders.push(this);
			if (!Loader._isWorking)Loader.checkNext();
		}

		/**
		*?????????????????????????????????????????????????????? <code>Event.COMPLETE</code> ???
		*@param content ??????????????????
		*/
		__proto.endLoad=function(content){
			content && (this._data=content);
			if (this._cache)Loader.cacheRes(this._url,this._data);
			this.event(/*laya.events.Event.PROGRESS*/"progress",1);
			this.event(/*laya.events.Event.COMPLETE*/"complete",(this.data instanceof Array)? [this.data] :this.data);
		}

		/**???????????????*/
		__getset(0,__proto,'url',function(){
			return this._url;
		});

		/**??????????????????*/
		__getset(0,__proto,'data',function(){
			return this._data;
		});

		/**???????????????*/
		__getset(0,__proto,'cache',function(){
			return this._cache;
		});

		/**???????????????*/
		__getset(0,__proto,'type',function(){
			return this._type;
		});

		Loader.checkNext=function(){
			Loader._isWorking=true;
			var startTimer=Browser.now();
			var thisTimer=startTimer;
			while (Loader._startIndex < Loader._loaders.length){
				thisTimer=Browser.now();
				Loader._loaders[Loader._startIndex].endLoad();
				Loader._startIndex++;
				if (Browser.now()-startTimer > Loader.maxTimeOut){
					console.log("loader callback cost a long time:"+(Browser.now()-startTimer)+" url="+Loader._loaders[Loader._startIndex-1].url);
					Laya.timer.frameOnce(1,null,Loader.checkNext);
					return;
				}
			}
			Loader._loaders.length=0;
			Loader._startIndex=0;
			Loader._isWorking=false;
		}

		Loader.clearRes=function(url,forceDispose){
			(forceDispose===void 0)&& (forceDispose=false);
			url=URL.formatURL(url);
			var arr=Loader.atlasMap[url];
			if (arr){
				for (var i=0,n=arr.length;i < n;i++){
					var resUrl=arr[i];
					var tex=Loader.getRes(resUrl);
					if (tex)tex.destroy(forceDispose);
					delete Loader.loadedMap[resUrl];
				}
				arr.length=0;
				delete Loader.atlasMap[url];
				delete Loader.loadedMap[url];
				}else {
				var res=Loader.loadedMap[url];
				if (res){
					if ((res instanceof laya.resource.Texture )&& res.bitmap)(res).destroy(forceDispose);
					delete Loader.loadedMap[url];
				}
			}
		}

		Loader.getRes=function(url){
			return Loader.loadedMap[URL.formatURL(url)];
		}

		Loader.getAtlas=function(url){
			return Loader.atlasMap[URL.formatURL(url)];
		}

		Loader.cacheRes=function(url,data){
			url=URL.formatURL(url);
			if (Loader.loadedMap[url] !=null){
				console.log("Resources already exist,is repeated loading:",url);
				}else {
				Loader.loadedMap[url]=data;
			}
		}

		Loader.setGroup=function(url,group){
			if (!Loader.groupMap[group])Loader.groupMap[group]=[];
			Loader.groupMap[group].push(url);
		}

		Loader.clearResByGroup=function(group){
			if (!Loader.groupMap[group])return;
			var arr=Loader.groupMap[group],i=0,len=arr.length;
			for (i=0;i < len;i++){
				Loader.clearRes(arr[i]);
			}
			arr.length=0;
		}

		Loader.TEXT="text";
		Loader.JSON="json";
		Loader.XML="xml";
		Loader.BUFFER="arraybuffer";
		Loader.IMAGE="image";
		Loader.SOUND="sound";
		Loader.ATLAS="atlas";
		Loader.FONT="font";
		Loader.typeMap={"png":"image","jpg":"image","jpeg":"image","txt":"text","json":"json","xml":"xml","als":"atlas","mp3":"sound","ogg":"sound","wav":"sound","part":"json","fnt":"font"};
		Loader.parserMap={};
		Loader.loadedMap={};
		Loader.groupMap={};
		Loader.maxTimeOut=100;
		Loader.atlasMap={};
		Loader._loaders=[];
		Loader._isWorking=false;
		Loader._startIndex=0;
		return Loader;
	})(EventDispatcher)


	/**
	*<p><code>ColorFilter</code> ??????????????????</p>
	*/
	//class laya.filters.ColorFilter extends laya.filters.Filter
	var ColorFilter=(function(_super){
		function ColorFilter(mat){
			//this._mat=null;
			//this._alpha=null;
			ColorFilter.__super.call(this);
			if (!mat){
				mat=[0.3,0.59,0.11,0,0,0.3,0.59,0.11,0,0,0.3,0.59,0.11,0,0,0,0,0,1,0];
			}
			this._mat=new Float32Array(16);
			this._alpha=new Float32Array(4);
			var j=0;
			var z=0;
			for (var i=0;i < 20;i++){
				if (i % 5 !=4){
					this._mat[j++]=mat[i];
					}else {
					this._alpha[z++]=mat[i];
				}
			}
			this._action=RunDriver.createFilterAction(0x20);
			this._action.data=this;
		}

		__class(ColorFilter,'laya.filters.ColorFilter',_super);
		var __proto=ColorFilter.prototype;
		Laya.imps(__proto,{"laya.filters.IFilter":true})
		/**
		*@private ????????????
		*/
		__proto.callNative=function(sp){
			var t=sp._$P.cf=this;
			sp.model && sp.model.setFilterMatrix&&sp.model.setFilterMatrix(this._mat,this._alpha);
		}

		/**@private */
		__getset(0,__proto,'type',function(){
			return 0x20;
		});

		/**@private */
		__getset(0,__proto,'action',function(){
			return this._action;
		});

		__getset(1,ColorFilter,'DEFAULT',function(){
			if (!ColorFilter._DEFAULT){
				ColorFilter._DEFAULT=new ColorFilter([1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,1,0]);
			}
			return ColorFilter._DEFAULT;
		},laya.filters.Filter._$SET_DEFAULT);

		__getset(1,ColorFilter,'GRAY',function(){
			if (!ColorFilter._GRAY){
				ColorFilter._GRAY=new ColorFilter([0.3,0.59,0.11,0,0,0.3,0.59,0.11,0,0,0.3,0.59,0.11,0,0,0,0,0,1,0]);
			}
			return ColorFilter._GRAY;
		},laya.filters.Filter._$SET_GRAY);

		ColorFilter._DEFAULT=null
		ColorFilter._GRAY=null
		return ColorFilter;
	})(Filter)


	/**
	*<p> <code>LoaderManager</code> ?????????????????????????????????????????????</p>
	*<p>???????????????????????????????????????Laya.loader?????????</p>
	*?????????(??????5?????????)???5????????????(0?????????4??????,?????????1)
	*??????????????????????????????????????????????????????????????????(??????retryNum??????????????????)????????????????????????????????????complete??????????????????null
	*/
	//class laya.net.LoaderManager extends laya.events.EventDispatcher
	var LoaderManager=(function(_super){
		var ResInfo;
		function LoaderManager(){
			this.retryNum=1;
			this.maxLoader=5;
			this._loaders=[];
			this._loaderCount=0;
			this._resInfos=[];
			this._infoPool=[];
			this._maxPriority=5;
			this._failRes={};
			LoaderManager.__super.call(this);
			for (var i=0;i < this._maxPriority;i++)this._resInfos[i]=[];
		}

		__class(LoaderManager,'laya.net.LoaderManager',_super);
		var __proto=LoaderManager.prototype;
		/**
		*??????clas?????????????????????????????????????????????????????????????????????????????????????????????????????????onAsynLoaded???????????????????????????,?????????????????????????????????????????????"?"????????????
		*@param url ?????????????????????????????????[{url:xx,clas:xx,priority:xx},{url:xx,clas:xx,priority:xx}]
		*@param progress ???????????????????????????????????????????????????????????????(0-1)???
		*@param clas ?????????????????????Texture
		*@param type ????????????
		*@param priority ?????????
		*@param cache ????????????
		*@return ??????????????????
		*/
		__proto.create=function(url,complete,progress,clas,priority,cache){
			(priority===void 0)&& (priority=1);
			(cache===void 0)&& (cache=true);
			if ((url instanceof Array)){
				var items=url;
				var itemCount=items.length;
				var loadedCount=0;
				if (progress){
					var progress2=Handler.create(progress.caller,progress.method,progress.args,false);
				}
				for (var i=0;i < itemCount;i++){
					var item=items[i];
					if ((typeof item=='string'))item=items[i]={url:item};
					item.progress=0;
					var progressHandler=progress ? Handler.create(null,onProgress,[item],false):null;
					var completeHandler=(progress || complete)? Handler.create(null,onComplete,[item]):null;
					this._create(item.url,completeHandler,progressHandler,item.clas || clas,item.priority || priority,cache);
				}
				function onComplete (item,content){
					loadedCount++;
					item.progress=1;
					if (loadedCount===itemCount && complete){
						complete.run();
					}
				}
				function onProgress (item,value){
					item.progress=value;
					var num=0;
					for (var j=0;j < itemCount;j++){
						var item1=items[j];
						num+=item1.progress;
					};
					var v=num / itemCount;
					progress2.runWith(v);
				}
				return true;
			}else return this._create(url,complete,progress,clas,priority,cache);
		}

		__proto._create=function(url,complete,progress,clas,priority,cache){
			(priority===void 0)&& (priority=1);
			(cache===void 0)&& (cache=true);
			var item=this.getRes(url);
			if (!item){
				var extension=Utils.getFileExtension(url);
				var creatItem=LoaderManager.createMap[extension];
				if (!clas)clas=creatItem[0];
				var type=creatItem[1];
				if (clas===Texture)type="htmlimage";
				item=clas ? new clas():null;
				this.load(url,Handler.create(null,onLoaded),progress,type,priority,false,null,true);
				function onLoaded (data){
					item && item.onAsynLoaded.call(item,url,data);
					if (complete)complete.run();
				}
				if (cache)LoaderManager.cacheRes(url,item);
				}else {
				progress && progress.runWith(1);
				complete && complete.run();
			}
			return item;
		}

		/**
		*???????????????
		*@param url ?????????????????????????????????(???????????????["a.png","b.png"]???????????????[{url:"a.png",type:Loader.IMAGE,size:100,priority:1},{url:"b.json",type:Loader.JSON,size:50,priority:1}])???
		*@param complete ????????????????????????????????????????????? null ???
		*@param progress ???????????????????????????????????????????????????????????????(0-1)???
		*@param type ???????????????
		*@param priority ????????????0-4?????????????????????0???????????????????????????1???
		*@param cache ???????????????????????????
		*@param group ?????????
		*@param ignoreCache ???????????????????????????????????????
		*@return ??? LoaderManager ?????????
		*/
		__proto.load=function(url,complete,progress,type,priority,cache,group,ignoreCache){
			(priority===void 0)&& (priority=1);
			(cache===void 0)&& (cache=true);
			(ignoreCache===void 0)&& (ignoreCache=false);
			if ((url instanceof Array))return this._loadAssets(url,complete,progress,type,priority,cache,group);
			url=URL.formatURL(url);
			var content=Loader.getRes(url);
			if (content !=null){
				progress && progress.runWith(1);
				complete && complete.runWith(content);
				this._loaderCount || this.event(/*laya.events.Event.COMPLETE*/"complete");
				}else {
				var info=LoaderManager._resMap[url];
				if (!info){
					info=this._infoPool.length ? this._infoPool.pop():new ResInfo();
					info.url=url;
					info.type=type;
					info.cache=cache;
					info.group=group;
					info.ignoreCache=ignoreCache;
					complete && info.on(/*laya.events.Event.COMPLETE*/"complete",complete.caller,complete.method,complete.args);
					progress && info.on(/*laya.events.Event.PROGRESS*/"progress",progress.caller,progress.method,progress.args);
					LoaderManager._resMap[url]=info;
					priority=priority < this._maxPriority ? priority :this._maxPriority-1;
					this._resInfos[priority].push(info);
					this._next();
					}else {
					complete && info._createListener(/*laya.events.Event.COMPLETE*/"complete",complete.caller,complete.method,complete.args,false,false);
					progress && info._createListener(/*laya.events.Event.PROGRESS*/"progress",progress.caller,progress.method,progress.args,false,false);
				}
			}
			return this;
		}

		__proto._next=function(){
			if (this._loaderCount >=this.maxLoader)return;
			for (var i=0;i < this._maxPriority;i++){
				var infos=this._resInfos[i];
				if (infos.length > 0){
					var info=infos.shift();
					if (info)return this._doLoad(info);
				}
			}
			this._loaderCount || this.event(/*laya.events.Event.COMPLETE*/"complete");
		}

		__proto._doLoad=function(resInfo){
			this._loaderCount++;
			var loader=this._loaders.length ? this._loaders.pop():new Loader();
			loader.on(/*laya.events.Event.COMPLETE*/"complete",null,onLoaded);
			loader.on(/*laya.events.Event.PROGRESS*/"progress",null,function(num){
				resInfo.event(/*laya.events.Event.PROGRESS*/"progress",num);
			});
			loader.on(/*laya.events.Event.ERROR*/"error",null,function(msg){
				onLoaded(null);
			});
			var _this=this;
			function onLoaded (data){
				loader.offAll();
				loader._data=null;
				_this._loaders.push(loader);
				_this._endLoad(resInfo,(data instanceof Array)? [data] :data);
				_this._loaderCount--;
				_this._next();
			}
			loader.load(resInfo.url,resInfo.type,resInfo.cache,resInfo.group,resInfo.ignoreCache);
		}

		__proto._endLoad=function(resInfo,content){
			if (content===null){
				var errorCount=this._failRes[resInfo.url] || 0;
				if (errorCount < this.retryNum){
					console.log("[warn]Retry to load:",resInfo.url);
					this._failRes[resInfo.url]=errorCount+1;
					this._resInfos[this._maxPriority-1].push(resInfo);
					return;
					}else {
					console.log("[error]Failed to load:",resInfo.url);
					this.event(/*laya.events.Event.ERROR*/"error",resInfo.url);
				}
			}
			delete LoaderManager._resMap[resInfo.url];
			resInfo.event(/*laya.events.Event.COMPLETE*/"complete",content);
			resInfo.offAll();
			this._infoPool.push(resInfo);
		}

		/**
		*?????????????????????????????????
		*@param url ???????????????
		*@param forceDispose ???????????????????????????????????????????????????????????????????????????forceDispose=true????????????????????????????????????????????????Texture????????????false
		*/
		__proto.clearRes=function(url,forceDispose){
			(forceDispose===void 0)&& (forceDispose=false);
			Loader.clearRes(url,forceDispose);
		}

		/**
		*????????????????????????????????????
		*@param url ???????????????
		*@return ???????????????
		*/
		__proto.getRes=function(url){
			return Loader.getRes(url);
		}

		/**??????????????????????????????????????????????????????????????????????????????*/
		__proto.clearUnLoaded=function(){
			for (var i=0;i < this._maxPriority;i++){
				var infos=this._resInfos[i];
				for (var j=infos.length-1;j >-1;j--){
					var info=infos[j];
					if (info){
						info.offAll();
						this._infoPool.push(info);
					}
				}
				infos.length=0;
			}
			this._loaderCount=0;
			LoaderManager._resMap={};
		}

		/**
		*?????????????????????????????????????????????
		*@param urls ??????????????????
		*/
		__proto.cancelLoadByUrls=function(urls){
			if (!urls)return;
			for (var i=0,n=urls.length;i < n;i++){
				this.cancelLoadByUrl(urls[i]);
			}
		}

		/**
		*???????????????????????????????????????
		*@param url ????????????
		*/
		__proto.cancelLoadByUrl=function(url){
			url=URL.formatURL(url);
			for (var i=0;i < this._maxPriority;i++){
				var infos=this._resInfos[i];
				for (var j=infos.length-1;j >-1;j--){
					var info=infos[j];
					if (info && info.url===url){
						infos[j]=null;
						info.offAll();
						this._infoPool.push(info);
					}
				}
			}
			if (LoaderManager._resMap[url])delete LoaderManager._resMap[url];
		}

		/**
		*@private
		*??????????????????????????????
		*@param arr ?????????["a.png","b.png"]?????????[{url:"a.png",type:Loader.IMAGE,size:100,priority:1},{url:"b.json",type:Loader.JSON,size:50,priority:1}]*/
		__proto._loadAssets=function(arr,complete,progress,type,priority,cache,group){
			(priority===void 0)&& (priority=1);
			(cache===void 0)&& (cache=true);
			var itemCount=arr.length;
			var loadedCount=0;
			var totalSize=0;
			var items=[];
			var defaultType=type || /*laya.net.Loader.IMAGE*/"image";
			for (var i=0;i < itemCount;i++){
				var item=arr[i];
				if ((typeof item=='string'))item={url:item,type:defaultType,size:1,priority:priority};
				if (!item.size)item.size=1;
				item.progress=0;
				totalSize+=item.size;
				items.push(item);
				var progressHandler=progress ? Handler.create(null,loadProgress,[item],false):null;
				var completeHandler=(complete || progress)? Handler.create(null,loadComplete,[item]):null;
				this.load(item.url,completeHandler,progressHandler,item.type,item.priority || 1,cache,item.group || group);
			}
			function loadComplete (item,content){
				loadedCount++;
				item.progress=1;
				if (loadedCount===itemCount && complete){
					complete.run();
				}
			}
			function loadProgress (item,value){
				if (progress !=null){
					item.progress=value;
					var num=0;
					for (var j=0;j < items.length;j++){
						var item1=items[j];
						num+=item1.size *item1.progress;
					};
					var v=num / totalSize;
					progress.runWith(v);
				}
			}
			return this;
		}

		LoaderManager.cacheRes=function(url,data){
			Loader.cacheRes(url,data);
		}

		LoaderManager._resMap={};
		__static(LoaderManager,
		['createMap',function(){return this.createMap={atlas:[null,/*laya.net.Loader.ATLAS*/"atlas"]};}
		]);
		LoaderManager.__init$=function(){
			//class ResInfo extends laya.events.EventDispatcher
			ResInfo=(function(_super){
				function ResInfo(){
					this.url=null;
					this.type=null;
					this.cache=false;
					this.group=null;
					this.ignoreCache=false;
					ResInfo.__super.call(this);
				}
				__class(ResInfo,'',_super);
				return ResInfo;
			})(EventDispatcher)
		}

		return LoaderManager;
	})(EventDispatcher)


	/**
	*<code>Socket</code> ??????????????????????????????????????????????????????????????? Browser/Client Agent ????????????????????????????????????????????????
	*/
	//class laya.net.Socket extends laya.events.EventDispatcher
	var Socket=(function(_super){
		function Socket(host,port,byteClass){
			this._endian=null;
			this._stamp=NaN;
			this._socket=null;
			this._connected=false;
			this._addInputPosition=0;
			this._input=null;
			this._output=null;
			this.timeout=0;
			this.objectEncoding=0;
			this.disableInput=false;
			this._byteClass=null;
			(port===void 0)&& (port=0);
			Socket.__super.call(this);
			this._byteClass=byteClass;
			this._byteClass=this._byteClass ? this._byteClass :Byte;
			this.endian="bigEndian";
			this.timeout=20000;
			this._addInputPosition=0;
			if (host&&port > 0 && port < 65535)
				this.connect(host,port);
		}

		__class(Socket,'laya.net.Socket',_super);
		var __proto=Socket.prototype;
		/**
		*????????????????????????????????????
		*@param host ??????????????????
		*@param port ??????????????????
		*/
		__proto.connect=function(host,port){
			var url="ws://"+host+":"+port;
			this.connectByUrl(url);
		}

		/**
		*??????????????????url
		*@param url ????????????
		*/
		__proto.connectByUrl=function(url){
			var _$this=this;
			if (this._socket !=null)
				this.close();
			this._socket && this._cleanSocket();
			this._socket=new Browser.window.WebSocket(url);
			this._socket.binaryType="arraybuffer";
			this._output=new this._byteClass();
			this._output.endian=this.endian;
			this._input=new this._byteClass();
			this._input.endian=this.endian;
			this._addInputPosition=0;
			this._socket.onopen=function (e){
				_$this._onOpen(e);
			};
			this._socket.onmessage=function (msg){
				_$this._onMessage(msg);
			};
			this._socket.onclose=function (e){
				_$this._onClose(e);
			};
			this._socket.onerror=function (e){
				_$this._onError(e);
			};
		}

		__proto._cleanSocket=function(){
			try {
				this._socket.close();
			}catch (e){}
			this._connected=false;
			this._socket.onopen=null;
			this._socket.onmessage=null;
			this._socket.onclose=null;
			this._socket.onerror=null;
			this._socket=null;
		}

		/**
		*???????????????
		*/
		__proto.close=function(){
			if (this._socket !=null){
				this._cleanSocket();
			}
		}

		/**
		*@private
		*?????????????????? ???
		*/
		__proto._onOpen=function(e){
			this._connected=true;
			this.event(/*laya.events.Event.OPEN*/"open",e);
		}

		/**
		*@private
		*??????????????????????????????
		*@param msg ?????????
		*/
		__proto._onMessage=function(msg){
			if (!msg || !msg.data)return;
			var data=msg.data;
			if(this.disableInput&&data){
				this.event(/*laya.events.Event.MESSAGE*/"message",data);
				return;
			}
			if (this._input.length > 0 && this._input.bytesAvailable < 1){
				this._input.clear();
				this._addInputPosition=0;
			};
			var pre=this._input.pos;
			!this._addInputPosition && (this._addInputPosition=0);
			this._input.pos=this._addInputPosition;
			if (data){
				if ((typeof data=='string')){
					this._input.writeUTFBytes(data);
					}else {
					this._input.writeArrayBuffer(data);
				}
				this._addInputPosition=this._input.pos;
				this._input.pos=pre;
			}
			this.event(/*laya.events.Event.MESSAGE*/"message",data);
		}

		/**
		*@private
		*??????????????????????????????
		*/
		__proto._onClose=function(e){
			this._connected=false;
			this.event(/*laya.events.Event.CLOSE*/"close",e)
		}

		/**
		*@private
		*???????????????????????????
		*/
		__proto._onError=function(e){
			this.event(/*laya.events.Event.ERROR*/"error",e)
		}

		/**
		*???????????????????????????
		*@param data ?????????????????????????????????String??????ArrayBuffer???
		*/
		__proto.send=function(data){
			this._socket.send(data);
		}

		/**
		*??????????????????????????????????????????
		*/
		__proto.flush=function(){
			if (this._output && this._output.length > 0){
				var evt;
				try {
					this._socket && this._socket.send(this._output.__getBuffer().slice(0,this._output.length));
					}catch (e){
					evt=e;
				}
				this._output.endian=this.endian;
				this._output.clear();
				if(evt)this.event(/*laya.events.Event.ERROR*/"error",evt);
			}
		}

		/**
		*?????????????????????????????????
		*/
		__getset(0,__proto,'input',function(){
			return this._input;
		});

		/**
		*?????????????????????????????????????????????????????????
		*/
		__getset(0,__proto,'output',function(){
			return this._output;
		});

		/**
		*????????? Socket ??????????????????????????????
		*/
		__getset(0,__proto,'connected',function(){
			return this._connected;
		});

		/**
		*??????????????????????????????
		*/
		__getset(0,__proto,'endian',function(){
			return this._endian;
			},function(value){
			this._endian=value;
			if (this._input !=null)this._input.endian=value;
			if (this._output !=null)this._output.endian=value;
		});

		Socket.LITTLE_ENDIAN="littleEndian";
		Socket.BIG_ENDIAN="bigEndian";
		return Socket;
	})(EventDispatcher)


	/**
	*<code>Resource</code> ??????????????????
	*/
	//class laya.resource.Resource extends laya.events.EventDispatcher
	var Resource=(function(_super){
		function Resource(){
			this._id=0;
			this._lastUseFrameCount=0;
			this._memorySize=0;
			this._name=null;
			this._loaded=false;
			this._released=false;
			this._resourceManager=null;
			this.lock=false;
			Resource.__super.call(this);
			this._$1__id=++Resource._uniqueIDCounter;
			Resource._loadedResources.push(this);
			Resource._isLoadedResourcesSorted=false;
			this._released=true;
			this.lock=false;
			this._memorySize=0;
			this._lastUseFrameCount=-1;
			(ResourceManager.currentResourceManager)&& (ResourceManager.currentResourceManager.addResource(this));
		}

		__class(Resource,'laya.resource.Resource',_super);
		var __proto=Resource.prototype;
		Laya.imps(__proto,{"laya.resource.ICreateResource":true,"laya.resource.IDispose":true})
		/**?????????????????????override it???????????????memorySize???????????????startCreate()???compoleteCreate()?????????*/
		__proto.recreateResource=function(){
			this.startCreate();
			this.completeCreate();
		}

		/**???????????????override it,????????????memorySize?????????*/
		__proto.detoryResource=function(){}
		/**
		*????????????????????????????????????????????????????????????
		*@param force ?????????????????????
		*/
		__proto.activeResource=function(force){
			(force===void 0)&& (force=false);
			this._lastUseFrameCount=Stat.loopCount;
			if (this._released || force){
				this.recreateResource();
			}
		}

		/**
		*???????????????
		*@param force ?????????????????????
		*@return ?????????????????????
		*/
		__proto.releaseResource=function(force){
			(force===void 0)&& (force=false);
			if (!force && this.lock)
				return false;
			if (!this._released || force){
				this.detoryResource();
				this._released=true;
				this._lastUseFrameCount=-1;
				this.event(/*laya.events.Event.RELEASED*/"released",this);
				return true;
				}else {
				return false;
			}
		}

		/**
		*??????????????????,????????????????????????????????????-copy??????
		*@param newName ?????????
		*/
		__proto.setUniqueName=function(newName){
			var isUnique=true;
			for (var i=0;i < Resource._loadedResources.length;i++){
				if (Resource._loadedResources[i]._name!==newName || Resource._loadedResources[i]===this)
					continue ;
				isUnique=false;
				return;
			}
			if (isUnique){
				if (this.name !=newName){
					this.name=newName;
					Resource._isLoadedResourcesSorted=false;
				}
				}else{
				this.setUniqueName(newName.concat("-copy"));
			}
		}

		/**
		*@private
		*/
		__proto.onAsynLoaded=function(url,data){
			throw new Error("Resource: must override this function!");
		}

		/**
		*<p>?????????????????????</p>
		*<p><b>?????????</b>????????????????????????</p>
		*/
		__proto.dispose=function(){
			if (this._resourceManager!==null)
				throw new Error("?????????resourceManager??????????????????????????????");
			this.lock=false;
			this.releaseResource();
			var index=Resource._loadedResources.indexOf(this);
			if (index!==-1){
				Resource._loadedResources.splice(index,1);
				Resource._isLoadedResourcesSorted=false;
			}
		}

		/**?????????????????????*/
		__proto.startCreate=function(){
			this.event(/*laya.events.Event.RECOVERING*/"recovering",this);
		}

		/**?????????????????????*/
		__proto.completeCreate=function(){
			this._released=false;
			this.event(/*laya.events.Event.RECOVERED*/"recovered",this);
		}

		__getset(0,__proto,'loaded',function(){
			return this._loaded;
		});

		/**
		*??????????????????ID(???????????????????????????)???
		*/
		__getset(0,__proto,'id',function(){
			return this._$1__id;
		});

		/**
		*??????????????????
		*/
		__getset(0,__proto,'released',function(){
			return this._released;
		});

		/**
		*????????????
		*/
		/**
		*???????????????
		*/
		__getset(0,__proto,'name',function(){
			return this._name;
			},function(value){
			if ((value || value!=="")&& this.name!==value){
				this._name=value;
				Resource._isLoadedResourcesSorted=false;
			}
		});

		/**
		*???????????????????????????
		*/
		__getset(0,__proto,'lastUseFrameCount',function(){
			return this._lastUseFrameCount;
		});

		/**
		*??????????????????
		*/
		__getset(0,__proto,'resourceManager',function(){
			return this._resourceManager;
		});

		/**
		*?????????????????????
		*/
		__getset(0,__proto,'memorySize',function(){
			return this._memorySize;
			},function(value){
			var offsetValue=value-this._memorySize;
			this._memorySize=value;
			this.resourceManager && this.resourceManager.addSize(offsetValue);
		});

		/**
		*???????????????????????????????????????
		*/
		__getset(1,Resource,'sortedLoadedResourcesByName',function(){
			if (!Resource._isLoadedResourcesSorted){
				Resource._isLoadedResourcesSorted=true;
				Resource._loadedResources.sort(Resource.compareResourcesByName);
			}
			return Resource._loadedResources;
		},laya.events.EventDispatcher._$SET_sortedLoadedResourcesByName);

		Resource.getLoadedResourceByIndex=function(index){
			return Resource._loadedResources[index];
		}

		Resource.getLoadedResourcesCount=function(){
			return Resource._loadedResources.length;
		}

		Resource.compareResourcesByName=function(left,right){
			if (left===right)
				return 0;
			var x=left.name;
			var y=right.name;
			if (x===null){
				if (y===null)
					return 0;
				else
				return-1;
				}else {
				if (y==null)
					return 1;
				else {
					var retval=x.localeCompare(y);
					if (retval !=0)
						return retval;
					else {
						right.setUniqueName(y);
						y=right.name;
						return x.localeCompare(y);
					}
				}
			}
		}

		Resource._uniqueIDCounter=0;
		Resource._loadedResources=[];
		Resource._isLoadedResourcesSorted=false;
		return Resource;
	})(EventDispatcher)


	/**
	*<code>Texture</code> ???????????????????????????
	*/
	//class laya.resource.Texture extends laya.events.EventDispatcher
	var Texture=(function(_super){
		function Texture(bitmap,uv){
			//this.bitmap=null;
			//this.uv=null;
			this.offsetX=0;
			this.offsetY=0;
			this.sourceWidth=0;
			this.sourceHeight=0;
			//this._loaded=false;
			this._w=0;
			this._h=0;
			//this.$_GID=NaN;
			//this.url=null;
			this._uvID=0;
			Texture.__super.call(this);
			if (bitmap){
				bitmap.useNum++;
			}
			this.setTo(bitmap,uv);
		}

		__class(Texture,'laya.resource.Texture',_super);
		var __proto=Texture.prototype;
		/**
		*?????????????????????????????????UV???????????????
		*@param bitmap ????????????
		*@param uv UV????????????
		*/
		__proto.setTo=function(bitmap,uv){
			this.bitmap=bitmap;
			this.uv=uv || Texture.DEF_UV;
			if (bitmap){
				this._w=bitmap.width;
				this._h=bitmap.height;
				this.sourceWidth=this.sourceWidth || this._w;
				this.sourceHeight=this.sourceHeight || this._h
				this._loaded=this._w > 0;
				var _this=this;
				if (this._loaded){
					RunDriver.addToAtlas && RunDriver.addToAtlas(_this);
					}else {
					var bm=bitmap;
					if ((bm instanceof laya.resource.HTMLImage )&& bm.image)
						bm.image.addEventListener('load',function(e){
						RunDriver.addToAtlas && RunDriver.addToAtlas(_this);
					},false);
				}
			}
		}

		/**@private ???????????????*/
		__proto.active=function(){
			this.bitmap.activeResource();
		}

		/**
		*?????????????????????????????????????????????????????????
		*@param forceDispose true???????????????????????????false???????????????????????????
		*/
		__proto.destroy=function(forceDispose){
			(forceDispose===void 0)&& (forceDispose=false);
			if (this.bitmap && (this.bitmap).useNum > 0){
				if (forceDispose){
					this.bitmap.dispose();
					(this.bitmap).useNum=0;
					}else {
					(this.bitmap).useNum--;
					if ((this.bitmap).useNum==0){
						this.bitmap.dispose();
					}
				}
				this.bitmap=null;
				if (this.url && this===Laya.loader.getRes(this.url))Laya.loader.clearRes(this.url);
				this._loaded=false;
			}
		}

		/**
		*??????????????????????????????
		*@param url ???????????????
		*/
		__proto.load=function(url){
			var _$this=this;
			this._loaded=false;
			var fileBitmap=(this.bitmap || (this.bitmap=HTMLImage.create(URL.formatURL(url))));
			if (fileBitmap)fileBitmap.useNum++;
			var _this=this;
			fileBitmap.onload=function (){
				fileBitmap.onload=null;
				_this._loaded=true;
				_$this.sourceWidth=_$this._w=fileBitmap.width;
				_$this.sourceHeight=_$this._h=fileBitmap.height;
				_this.event(/*laya.events.Event.LOADED*/"loaded",this);
				(RunDriver.addToAtlas)&& (RunDriver.addToAtlas(_this));
			};
		}

		/**@private */
		__proto.addTextureToAtlas=function(e){
			RunDriver.addTextureToAtlas(this);
		}

		/**
		*??????Texture??????????????????????????????
		*@param x
		*@param y
		*@param width
		*@param height
		*@return ?????????????????????
		*/
		__proto.getPixels=function(x,y,width,height){
			if (Render.isWebGL){
				return RunDriver.getTexturePixels(this,x,y,width,height);
				}else {
				Browser.canvas.size(width,height);
				Browser.canvas.clear();
				Browser.context.drawTexture(this,-x,-y,this.width,this.height,0,0);
				var info=Browser.context.getImageData(0,0,width,height);
			}
			return info.data;
		}

		/**@private */
		__proto.onAsynLoaded=function(url,bitmap){
			if (bitmap)bitmap.useNum++;
			this.setTo(bitmap,this.uv);
		}

		/**????????????????????????*/
		__getset(0,__proto,'source',function(){
			this.bitmap.activeResource();
			return this.bitmap.source;
		});

		/**
		*??????????????????????????????????????????????????????????????????????????????????????????,??????????????????????????????????????????????????????????????????????????????????????????
		*/
		__getset(0,__proto,'loaded',function(){
			return this._loaded;
		});

		/**
		*??????????????????????????????
		*/
		__getset(0,__proto,'released',function(){
			return this.bitmap.released;
		});

		/**???????????????*/
		__getset(0,__proto,'width',function(){
			if (this._w)return this._w;
			return (this.uv && this.uv!==Texture.DEF_UV)? (this.uv[2]-this.uv[0])*this.bitmap.width :this.bitmap.width;
			},function(value){
			this._w=value;
			this.sourceWidth || (this.sourceWidth=value);
		});

		/**
		*??????????????????????????????????????????(????????????????????????????????????)
		*/
		/**
		*?????????????????????????????????????????????
		*/
		__getset(0,__proto,'repeat',function(){
			if (Render.isWebGL && this.bitmap){
				return this.bitmap.repeat;
			}
			return true;
			},function(value){
			if (value){
				if (Render.isWebGL && this.bitmap){
					this.bitmap.repeat=value;
					if (value){
						this.bitmap.enableMerageInAtlas=false;
					}
				}
			}
		});

		/**???????????????*/
		__getset(0,__proto,'height',function(){
			if (this._h)return this._h;
			return (this.uv && this.uv!==Texture.DEF_UV)? (this.uv[5]-this.uv[1])*this.bitmap.height :this.bitmap.height;
			},function(value){
			this._h=value;
			this.sourceHeight || (this.sourceHeight=value);
		});

		/**
		*??????????????????????????????????????????????????????????????????false??????,????????????????????????
		*/
		/**
		*?????????????????????????????????????????????
		*/
		__getset(0,__proto,'isLinearSampling',function(){
			return Render.isWebGL ? (this.bitmap.minFifter !=0x2600):true;
			},function(value){
			if (!value && Render.isWebGL){
				if (!value && (this.bitmap.minFifter==-1)&& (this.bitmap.magFifter==-1)){
					this.bitmap.minFifter=0x2600;
					this.bitmap.magFifter=0x2600;
					this.bitmap.enableMerageInAtlas=false;
				}
			}
		});

		Texture.moveUV=function(offsetX,offsetY,uv){
			for (var i=0;i < 8;i+=2){
				uv[i]+=offsetX;
				uv[i+1]+=offsetY;
			}
			return uv;
		}

		Texture.create=function(source,x,y,width,height,offsetX,offsetY,sourceWidth,sourceHeight){
			(offsetX===void 0)&& (offsetX=0);
			(offsetY===void 0)&& (offsetY=0);
			(sourceWidth===void 0)&& (sourceWidth=0);
			(sourceHeight===void 0)&& (sourceHeight=0);
			var btex=(source instanceof laya.resource.Texture );
			var uv=btex ? source.uv :Texture.DEF_UV;
			var bitmap=btex ? source.bitmap :source;
			var tex=new Texture(bitmap,null);
			tex.width=width;
			tex.height=height;
			tex.offsetX=offsetX;
			tex.offsetY=offsetY;
			tex.sourceWidth=sourceWidth || width;
			tex.sourceHeight=sourceHeight || height;
			var dwidth=1 / bitmap.width;
			var dheight=1 / bitmap.height;
			x *=dwidth;
			y *=dheight;
			width *=dwidth;
			height *=dheight;
			var u1=tex.uv[0],v1=tex.uv[1],u2=tex.uv[4],v2=tex.uv[5];
			var inAltasUVWidth=(u2-u1),inAltasUVHeight=(v2-v1);
			var oriUV=Texture.moveUV(uv[0],uv[1],[x,y,x+width,y,x+width,y+height,x,y+height]);
			tex.uv=[u1+oriUV[0] *inAltasUVWidth,v1+oriUV[1] *inAltasUVHeight,u2-(1-oriUV[2])*inAltasUVWidth,v1+oriUV[3] *inAltasUVHeight,u2-(1-oriUV[4])*inAltasUVWidth,v2-(1-oriUV[5])*inAltasUVHeight,u1+oriUV[6] *inAltasUVWidth,v2-(1-oriUV[7])*inAltasUVHeight];
			return tex;
		}

		Texture.createFromTexture=function(texture,x,y,width,height){
			var rect=Rectangle.TEMP.setTo(x-texture.offsetX,y-texture.offsetY,width,height);
			var result=rect.intersection(Texture._rect1.setTo(0,0,texture.width,texture.height),Texture._rect2);
			if (result)
				var tex=Texture.create(texture,result.x,result.y,result.width,result.height,result.x-rect.x,result.y-rect.y,width,height);
			else return null;
			tex.bitmap.useNum--;
			return tex;
		}

		Texture.DEF_UV=[0,0,1.0,0,1.0,1.0,0,1.0];
		Texture.INV_UV=[0,1,1.0,1,1.0,0.0,0,0.0];
		Texture._rect1=new Rectangle();
		Texture._rect2=new Rectangle();
		return Texture;
	})(EventDispatcher)


	/**
	*<code>TimeLine</code> ?????????????????????????????????????????????
	*/
	//class laya.utils.TimeLine extends laya.events.EventDispatcher
	var TimeLine=(function(_super){
		var tweenData;
		function TimeLine(){
			this._labelDic=null;
			this._tweenDic={};
			this._tweenDataList=[];
			this._endTweenDataList=null;
			this._currTime=0;
			this._lastTime=0;
			this._startTime=0;
			this._index=0;
			this._gidIndex=0;
			this._firstTweenDic={};
			this._startTimeSort=false;
			this._endTimeSort=false;
			this._loopKey=false;
			this.scale=1;
			this._frameRate=60;
			this._frameIndex=0;
			this._total=0;
			TimeLine.__super.call(this);
		}

		__class(TimeLine,'laya.utils.TimeLine',_super);
		var __proto=TimeLine.prototype;
		/**
		*??????????????????????????????????????????????????????
		*@param target ?????????????????????
		*@param props ???????????????????????????
		*@param duration ??????TWEEN????????????
		*@param ease ????????????
		*@param offset ?????????????????????????????????????????????????????????????????????
		*/
		__proto.to=function(target,props,duration,ease,offset){
			(offset===void 0)&& (offset=0);
			return this._create(target,props,duration,ease,offset,true);
		}

		/**
		*??? props ?????????????????????????????????
		*@param target target ????????????(??????????????????????????????)
		*@param props ????????????????????????
		*@param duration ??????TWEEN?????????
		*@param ease ????????????
		*@param offset ??????????????????????????????????????????????????????????????????
		*/
		__proto.from=function(target,props,duration,ease,offset){
			(offset===void 0)&& (offset=0);
			return this._create(target,props,duration,ease,offset,false);
		}

		/**@private */
		__proto._create=function(target,props,duration,ease,offset,isTo){
			var tTweenData=new tweenData();
			tTweenData.isTo=isTo;
			tTweenData.type=0;
			tTweenData.target=target;
			tTweenData.duration=duration;
			tTweenData.data=props;
			tTweenData.startTime=this._startTime+offset;
			tTweenData.endTime=tTweenData.startTime+tTweenData.duration;
			tTweenData.ease=ease;
			this._startTime=Math.max(tTweenData.endTime,this._startTime);
			this._tweenDataList.push(tTweenData);
			this._startTimeSort=true;
			this._endTimeSort=true;
			return this;
		}

		/**
		*???????????????????????????????????????
		*@param label ???????????????
		*@param offset ??????????????????????????????????????????(???????????????)???
		*/
		__proto.addLabel=function(label,offset){
			var tTweenData=new tweenData();
			tTweenData.type=1;
			tTweenData.data=label;
			tTweenData.endTime=tTweenData.startTime=this._startTime+offset;
			this._labelDic || (this._labelDic={});
			this._labelDic[label]=tTweenData;
			this._tweenDataList.push(tTweenData);
			return this;
		}

		/**
		*?????????????????????
		*@param label
		*/
		__proto.removeLabel=function(label){
			if (this._labelDic && this._labelDic[label]){
				var tTweenData=this._labelDic[label];
				if (tTweenData){
					var tIndex=this._tweenDataList.indexOf(tTweenData);
					if (tIndex >-1){
						this._tweenDataList.splice(tIndex,1);
					}
				}
				delete this._labelDic[label];
			}
		}

		/**
		*?????????????????????????????????????????????
		*@param time(???????????????)???
		*/
		__proto.gotoTime=function(time){
			if (this._tweenDataList==null || this._tweenDataList.length==0)return;
			var tTween;
			var tObject;
			for (var p in this._firstTweenDic){
				tObject=this._firstTweenDic[p];
				if (tObject){
					for (var tDataP in tObject){
						if (tObject.diyTarget.hasOwnProperty(tDataP)){
							tObject.diyTarget[tDataP]=tObject[tDataP];
						}
					}
				}
			}
			for (p in this._tweenDic){
				tTween=this._tweenDic[p];
				tTween.clear();
				delete this._tweenDic[p];
			}
			this._index=0;
			this._gidIndex=0;
			this._currTime=time;
			this._lastTime=Browser.now();
			var tTweenDataCopyList;
			if (this._endTweenDataList==null || this._endTimeSort){
				this._endTimeSort=false;
				this._endTweenDataList=tTweenDataCopyList=this._tweenDataList.concat();
				function Compare (paraA,paraB){
					if (paraA.endTime > paraB.endTime){
						return 1;
						}else if (paraA.endTime < paraB.endTime){
						return-1;
						}else {
						return 0;
					}
				}
				tTweenDataCopyList.sort(Compare);
				}else {
				tTweenDataCopyList=this._endTweenDataList
			};
			var tTweenData;
			for (var i=0,n=tTweenDataCopyList.length;i < n;i++){
				tTweenData=tTweenDataCopyList[i];
				if (tTweenData.type==0){
					if (time >=tTweenData.endTime){
						this._index=Math.max(this._index,i+1);
						var props=tTweenData.data;
						for (var tP in props){
							if (tTweenData.isTo){
								tTweenData.target[tP]=props[tP];
							}
						}
						}else {
						break ;
					}
				}
			}
			for (i=0,n=this._tweenDataList.length;i < n;i++){
				tTweenData=this._tweenDataList[i];
				if (tTweenData.type==0){
					if (time >=tTweenData.startTime && time < tTweenData.endTime){
						this._index=Math.max(this._index,i+1);
						this._gidIndex++;
						tTween=Pool.getItemByClass("tween",Tween);
						tTween._create(tTweenData.target,tTweenData.data,tTweenData.duration,tTweenData.ease,Handler.create(this,this._animComplete,[this._gidIndex]),0,false,tTweenData.isTo,true,false);
						tTween.setStartTime(this._currTime-(time-tTweenData.startTime));
						tTween._updateEase(this._currTime);
						tTween.gid=this._gidIndex;
						this._tweenDic[this._gidIndex]=tTween;
					}
				}
			}
		}

		/**
		*??????????????????????????????
		*@param Label ????????????
		*/
		__proto.gotoLabel=function(Label){
			if (this._labelDic==null)return;
			var tLabelData=this._labelDic[Label];
			if (tLabelData)this.gotoTime(tLabelData.startTime);
		}

		/**
		*?????????????????????
		*/
		__proto.pause=function(){
			Laya.timer.clear(this,this._update);
		}

		/**
		*??????????????????????????????
		*/
		__proto.resume=function(){
			this.play(this._currTime,this._loopKey);
		}

		/**
		*???????????????
		*@param timeOrLabel ???????????????????????????????????????
		*@param loop ?????????????????????
		*/
		__proto.play=function(timeOrLabel,loop){
			(timeOrLabel===void 0)&& (timeOrLabel=0);
			(loop===void 0)&& (loop=false);
			if (this._startTimeSort){
				this._startTimeSort=false;
				function Compare (paraA,paraB){
					if (paraA.startTime > paraB.startTime){
						return 1;
						}else if (paraA.startTime < paraB.startTime){
						return-1;
						}else {
						return 0;
					}
				}
				this._tweenDataList.sort(Compare);
				for (var i=0,n=this._tweenDataList.length;i < n;i++){
					var tTweenData=this._tweenDataList[i];
					if (tTweenData !=null && tTweenData.type==0){
						var tTarget=tTweenData.target;
						var gid=(tTarget.$_GID || (tTarget.$_GID=Utils.getGID()));
						var tSrcData=null;
						if (this._firstTweenDic[gid]==null){
							tSrcData={};
							tSrcData.diyTarget=tTarget;
							this._firstTweenDic[gid]=tSrcData;
							}else {
							tSrcData=this._firstTweenDic[gid];
						}
						for (var p in tTweenData.data){
							if (tSrcData[p]==null){
								tSrcData[p]=tTarget[p];
							}
						}
					}
				}
			}
			if ((typeof timeOrLabel=='string')){
				this.gotoLabel(timeOrLabel);
				}else {
				this.gotoTime(timeOrLabel);
			}
			this._loopKey=loop;
			this._lastTime=Browser.now();
			Laya.timer.frameLoop(1,this,this._update);
		}

		/**
		*?????????????????????
		*/
		__proto._update=function(){
			if (this._currTime >=this._startTime){
				if (this._loopKey){
					this._complete();
					this.gotoTime(0);
					}else {
					this._complete();
					this.pause();
					return;
				}
			};
			var tNow=Browser.now();
			var tFrameTime=tNow-this._lastTime;
			var tCurrTime=this._currTime+=tFrameTime *this.scale;
			this._lastTime=tNow;
			var tTween;
			if (this._tweenDataList.length !=0 && this._index < this._tweenDataList.length){
				var tTweenData=this._tweenDataList[this._index];
				if (tCurrTime >=tTweenData.startTime){
					this._index++;
					if (tTweenData.type==0){
						this._gidIndex++;
						tTween=Pool.getItemByClass("tween",Tween);
						tTween._create(tTweenData.target,tTweenData.data,tTweenData.duration,tTweenData.ease,new Handler(this,this._animComplete,[this._gidIndex]),0,false,tTweenData.isTo,true,false);
						tTween.setStartTime(tCurrTime);
						tTween.gid=this._gidIndex;
						this._tweenDic[this._gidIndex]=tTween;
						}else {
						this.event(/*laya.events.Event.LABEL*/"label",tTweenData.data);
					}
				}
			}
			for (var p in this._tweenDic){
				tTween=this._tweenDic[p];
				tTween._updateEase(tCurrTime);
			}
		}

		/**
		*????????????????????????????????????????????????????????????????????????????????????
		*@param index
		*/
		__proto._animComplete=function(index){
			var tTween=this._tweenDic[index];
			if (tTween)delete this._tweenDic[index];
		}

		/**@private */
		__proto._complete=function(){
			this.event(/*laya.events.Event.COMPLETE*/"complete");
		}

		/**
		*???????????????????????????????????????????????????
		*/
		__proto.reset=function(){
			var p;
			if (this._labelDic){
				for (p in this._labelDic){
					delete this._labelDic[p];
				}
			};
			var tTween;
			for (p in this._tweenDic){
				tTween=this._tweenDic[p];
				tTween.clear();
				delete this._tweenDic[p];
			}
			for (p in this._firstTweenDic){
				delete this._firstTweenDic[p];
			}
			this._endTweenDataList=null;
			this._tweenDataList.length=0;
			this._currTime=0;
			this._lastTime=0;
			this._startTime=0;
			this._index=0;
			this._gidIndex=0;
			this.scale=1;
			Laya.timer.clear(this,this._update);
		}

		/**
		*????????????????????????
		*/
		__proto.destroy=function(){
			this.reset();
			this._labelDic=null;
			this._tweenDic=null;
			this._tweenDataList=null;
			this._firstTweenDic=null;
		}

		/**
		*@private
		*???????????????
		*/
		/**
		*@private
		*???????????????
		*/
		__getset(0,__proto,'index',function(){
			return this._frameIndex;
			},function(value){
			this._frameIndex=value;
			this.gotoTime(this._frameIndex / this._frameRate *1000);
		});

		/**
		*??????????????????
		*/
		__getset(0,__proto,'total',function(){
			this._total=Math.floor(this._startTime / 1000 *this._frameRate);
			return this._total;
		});

		TimeLine.to=function(target,props,duration,ease,offset){
			(offset===void 0)&& (offset=0);
			return (new TimeLine()).to(target,props,duration,ease,offset);
		}

		TimeLine.from=function(target,props,duration,ease,offset){
			(offset===void 0)&& (offset=0);
			return (new TimeLine()).from(target,props,duration,ease,offset);
		}

		TimeLine.__init$=function(){
			//class tweenData
			tweenData=(function(){
				function tweenData(){
					this.type=0;
					this.isTo=true;
					this.startTime=NaN;
					this.endTime=NaN;
					this.target=null;
					this.duration=NaN;
					this.ease=null;
					this.data=null;
				}
				__class(tweenData,'');
				return tweenData;
			})()
		}

		return TimeLine;
	})(EventDispatcher)


	/**
	*<p> <code>Sprite</code> ?????????????????????????????????????????????????????????????????????????????????????????????????????????</p>
	*
	*@example ???????????????????????????????????? <code>Text</code> ?????????
	*<listing version="3.0">
	*package
	*{
		*import laya.display.Sprite;
		*import laya.events.Event;
		*
		*public class Sprite_Example
		*{
			*private var sprite:Sprite;
			*private var shape:Sprite
			*public function Sprite_Example()
			*{
				*Laya.init(640,800);//??????????????????????????????????????????
				*Laya.stage.bgColor="#efefef";//??????????????????????????????
				*onInit();
				*}
			*private function onInit():void
			*{
				*sprite=new Sprite();//???????????? Sprite ?????????????????? sprite ???
				*sprite.loadImage("resource/ui/bg.png");//????????????????????????
				*sprite.x=200;//?????? sprite ???????????????????????????????????????????????????
				*sprite.y=200;//?????? sprite ???????????????????????????????????????????????????
				*sprite.pivotX=0;//?????? sprite ???????????????????????????????????????
				*sprite.pivotY=0;//?????? sprite ???????????????????????????????????????
				*Laya.stage.addChild(sprite);//?????? sprite ??????????????????????????????
				*sprite.on(Event.CLICK,this,onClickSprite);//??? sprite ?????????????????????????????????
				*shape=new Sprite();//???????????? Sprite ?????????????????? sprite ???
				*shape.graphics.drawRect(0,0,100,100,"#ccff00","#ff0000",2);//???????????????????????????????????????
				*shape.x=400;//?????? shape ???????????????????????????????????????????????????
				*shape.y=200;//?????? shape ???????????????????????????????????????????????????
				*shape.width=100;//?????? shape ??????????????????
				*shape.height=100;//?????? shape ??????????????????
				*shape.pivotX=50;//?????? shape ???????????????????????????????????????
				*shape.pivotY=50;//?????? shape ???????????????????????????????????????
				*Laya.stage.addChild(shape);//?????? shape ??????????????????????????????
				*shape.on(Event.CLICK,this,onClickShape);//??? shape ?????????????????????????????????
				*}
			*private function onClickSprite():void
			*{
				*trace("?????? sprite ?????????");
				*sprite.rotation+=5;//?????? sprite ?????????
				*}
			*private function onClickShape():void
			*{
				*trace("?????? shape ?????????");
				*shape.rotation+=5;//?????? shape ?????????
				*}
			*}
		*}
	*</listing>
	*<listing version="3.0">
	*var sprite;
	*var shape;
	*Sprite_Example();
	*function Sprite_Example()
	*{
		*Laya.init(640,800);//??????????????????????????????????????????
		*Laya.stage.bgColor="#efefef";//??????????????????????????????
		*onInit();
		*}
	*function onInit()
	*{
		*sprite=new laya.display.Sprite();//???????????? Sprite ?????????????????? sprite ???
		*sprite.loadImage("resource/ui/bg.png");//????????????????????????
		*sprite.x=200;//?????? sprite ???????????????????????????????????????????????????
		*sprite.y=200;//?????? sprite ???????????????????????????????????????????????????
		*sprite.pivotX=0;//?????? sprite ???????????????????????????????????????
		*sprite.pivotY=0;//?????? sprite ???????????????????????????????????????
		*Laya.stage.addChild(sprite);//?????? sprite ??????????????????????????????
		*sprite.on(Event.CLICK,this,onClickSprite);//??? sprite ?????????????????????????????????
		*shape=new laya.display.Sprite();//???????????? Sprite ?????????????????? sprite ???
		*shape.graphics.drawRect(0,0,100,100,"#ccff00","#ff0000",2);//???????????????????????????????????????
		*shape.x=400;//?????? shape ???????????????????????????????????????????????????
		*shape.y=200;//?????? shape ???????????????????????????????????????????????????
		*shape.width=100;//?????? shape ??????????????????
		*shape.height=100;//?????? shape ??????????????????
		*shape.pivotX=50;//?????? shape ???????????????????????????????????????
		*shape.pivotY=50;//?????? shape ???????????????????????????????????????
		*Laya.stage.addChild(shape);//?????? shape ??????????????????????????????
		*shape.on(laya.events.Event.CLICK,this,onClickShape);//??? shape ?????????????????????????????????
		*}
	*function onClickSprite()
	*{
		*console.log("?????? sprite ?????????");
		*sprite.rotation+=5;//?????? sprite ?????????
		*}
	*function onClickShape()
	*{
		*console.log("?????? shape ?????????");
		*shape.rotation+=5;//?????? shape ?????????
		*}
	*</listing>
	*<listing version="3.0">
	*import Sprite=laya.display.Sprite;
	*class Sprite_Example {
		*private sprite:Sprite;
		*private shape:Sprite
		*public Sprite_Example(){
			*Laya.init(640,800);//??????????????????????????????????????????
			*Laya.stage.bgColor="#efefef";//??????????????????????????????
			*this.onInit();
			*}
		*private onInit():void {
			*this.sprite=new Sprite();//???????????? Sprite ?????????????????? sprite ???
			*this.sprite.loadImage("resource/ui/bg.png");//????????????????????????
			*this.sprite.x=200;//?????? sprite ???????????????????????????????????????????????????
			*this.sprite.y=200;//?????? sprite ???????????????????????????????????????????????????
			*this.sprite.pivotX=0;//?????? sprite ???????????????????????????????????????
			*this.sprite.pivotY=0;//?????? sprite ???????????????????????????????????????
			*Laya.stage.addChild(this.sprite);//?????? sprite ??????????????????????????????
			*this.sprite.on(laya.events.Event.CLICK,this,this.onClickSprite);//??? sprite ?????????????????????????????????
			*this.shape=new Sprite();//???????????? Sprite ?????????????????? sprite ???
			*this.shape.graphics.drawRect(0,0,100,100,"#ccff00","#ff0000",2);//???????????????????????????????????????
			*this.shape.x=400;//?????? shape ???????????????????????????????????????????????????
			*this.shape.y=200;//?????? shape ???????????????????????????????????????????????????
			*this.shape.width=100;//?????? shape ??????????????????
			*this.shape.height=100;//?????? shape ??????????????????
			*this.shape.pivotX=50;//?????? shape ???????????????????????????????????????
			*this.shape.pivotY=50;//?????? shape ???????????????????????????????????????
			*Laya.stage.addChild(this.shape);//?????? shape ??????????????????????????????
			*this.shape.on(laya.events.Event.CLICK,this,this.onClickShape);//??? shape ?????????????????????????????????
			*}
		*private onClickSprite():void {
			*console.log("?????? sprite ?????????");
			*this.sprite.rotation+=5;//?????? sprite ?????????
			*}
		*private onClickShape():void {
			*console.log("?????? shape ?????????");
			*this.shape.rotation+=5;//?????? shape ?????????
			*}
		*}
	*</listing>
	*/
	//class laya.display.Sprite extends laya.display.Node
	var Sprite=(function(_super){
		function Sprite(){
			this.mouseThrough=false;
			this._transform=null;
			this._tfChanged=false;
			this._x=0;
			this._y=0;
			this._width=0;
			this._height=0;
			this._repaint=1;
			this._changeType=0;
			this._mouseEnableState=0;
			this._zOrder=0;
			this._graphics=null;
			this._renderType=0;
			this.autoSize=false;
			this.hitTestPrior=false;
			this.viewport=null;
			this._optimizeScrollRect=false;
			this._texture=null;
			Sprite.__super.call(this);
			this._style=Style.EMPTY;
		}

		__class(Sprite,'laya.display.Sprite',_super);
		var __proto=Sprite.prototype;
		Laya.imps(__proto,{"laya.display.ILayout":true})
		/**@inheritDoc */
		__proto.destroy=function(destroyChild){
			(destroyChild===void 0)&& (destroyChild=true);
			_super.prototype.destroy.call(this,destroyChild);
			this._style && this._style.destroy();
			this._transform=null;
			this._style=null;
			this._graphics=null;
		}

		/**??????zOrder?????????????????????*/
		__proto.updateZOrder=function(){
			Utils.updateOrder(this._childs)&& this.repaint();
		}

		/**?????????cacheAs???staticCache=true??????????????????????????????????????????????????????*/
		__proto.reCache=function(){
			if (this._$P.cacheCanvas)this._$P.cacheCanvas.reCache=true;
		}

		/**
		*??????bounds??????????????????????????????????????????getBounds??????
		*@param bound bounds????????????
		*/
		__proto.setBounds=function(bound){
			this._set$P("uBounds",bound);
		}

		/**
		*????????????????????????????????????????????????????????????
		*<p><b>?????????</b>?????????????????????????????????</p>
		*@return ???????????????
		*/
		__proto.getBounds=function(){
			if (!this._$P.mBounds)this._set$P("mBounds",new Rectangle());
			return Rectangle._getWrapRec(this._boundPointsToParent(),this._$P.mBounds);
		}

		/**
		*?????????????????????????????????????????????????????????
		*<p><b>?????????</b>?????????????????????????????????</p>
		*@return ???????????????
		*/
		__proto.getSelfBounds=function(){
			if (!this._$P.mBounds)this._set$P("mBounds",new Rectangle());
			return Rectangle._getWrapRec(this._getBoundPointsM(false),this._$P.mBounds);
		}

		/**
		*@private
		*???????????????????????????????????????????????????????????????????????????
		*????????????????????????????????????????????????????????????????????????????????????????????????????????????
		*@param ifRotate ???????????????????????????????????????
		*@return ????????????????????????[x1,y1,x2,y2,x3,y3,...]???
		*/
		__proto._boundPointsToParent=function(ifRotate){
			(ifRotate===void 0)&& (ifRotate=false);
			var pX=0,pY=0;
			if (this._style){
				pX=this._style._tf.translateX;
				pY=this._style._tf.translateY;
				ifRotate=ifRotate || (this._style._tf.rotate!==0);
				if (this._style.scrollRect){
					pX+=this._style.scrollRect.x;
					pY+=this._style.scrollRect.y;
				}
			};
			var pList=this._getBoundPointsM(ifRotate);
			if (!pList || pList.length < 1)return pList;
			if (pList.length !=8){
				pList=ifRotate ? GrahamScan.scanPList(pList):Rectangle._getWrapRec(pList,Rectangle.TEMP)._getBoundPoints();
			}
			if (!this.transform){
				Utils.transPointList(pList,this.x-pX,this.y-pY);
				return pList;
			};
			var tPoint=Point.TEMP;
			var i=0,len=pList.length;
			for (i=0;i < len;i+=2){
				tPoint.x=pList[i];
				tPoint.y=pList[i+1];
				this.toParentPoint(tPoint);
				pList[i]=tPoint.x;
				pList[i+1]=tPoint.y;
			}
			return pList;
		}

		/**
		*???????????????????????????????????? <code>Graphics</code> ?????????????????????
		*@return ?????? Rectangle ??????????????????????????????????????????
		*/
		__proto.getGraphicBounds=function(){
			if (!this._graphics)return Rectangle.TEMP.setTo(0,0,0,0);
			return this._graphics.getBounds();
		}

		/**
		*@private
		*?????????????????????????????????????????????????????????
		*@param ifRotate ???????????????????????????????????????
		*@return ????????????????????????[x1,y1,x2,y2,x3,y3,...]???
		*/
		__proto._getBoundPointsM=function(ifRotate){
			(ifRotate===void 0)&& (ifRotate=false);
			if (this._$P.uBounds)return this._$P.uBounds._getBoundPoints();
			if (!this._$P.temBM)this._set$P("temBM",[]);
			if (this.scrollRect){
				var rst=Utils.clearArray(this._$P.temBM);
				var rec=Rectangle.TEMP;
				rec.copyFrom(this.scrollRect);
				Utils.concatArray(rst,rec._getBoundPoints());
				return rst;
			};
			var pList=this._graphics ? this._graphics.getBoundPoints():Utils.clearArray(this._$P.temBM);
			var child;
			var cList;
			var __childs;
			__childs=this._childs;
			for (var i=0,n=__childs.length;i < n;i++){
				child=__childs [i];
				if ((child instanceof laya.display.Sprite )&& child.visible==true){
					cList=child._boundPointsToParent(ifRotate);
					if (cList)
						pList=pList ? Utils.concatArray(pList,cList):cList;
				}
			}
			return pList;
		}

		/**
		*@private
		*???????????????
		*@return ?????? Style ???
		*/
		__proto.getStyle=function(){
			this._style===Style.EMPTY && (this._style=new Style());
			return this._style;
		}

		/**
		*@private
		*???????????????
		*@param value ?????????
		*/
		__proto.setStyle=function(value){
			this._style=value;
		}

		/**@private */
		__proto._adjustTransform=function(){
			'use strict';
			this._tfChanged=false;
			var style=this._style;
			var tf=style._tf;
			var sx=tf.scaleX,sy=tf.scaleY;
			var m;
			if (tf.rotate || sx!==1 || sy!==1 || tf.skewX || tf.skewY){
				m=this._transform || (this._transform=Matrix.create());
				m.bTransform=true;
				if (tf.rotate){
					var angle=tf.rotate *0.0174532922222222;
					var cos=m.cos=Math.cos(angle);
					var sin=m.sin=Math.sin(angle);
					m.a=sx *cos;
					m.b=sx *sin;
					m.c=-sy *sin;
					m.d=sy *cos;
					m.tx=m.ty=0;
					return m;
					}else {
					m.a=sx;
					m.d=sy;
					m.c=m.b=m.tx=m.ty=0;
					if (tf.skewX || tf.skewY){
						return m.skew(tf.skewX *0.0174532922222222,tf.skewY *0.0174532922222222);
					}
					return m;
				}
				}else {
				this._transform && this._transform.destroy();
				this._transform=null;
				this._renderType &=~ /*laya.renders.RenderSprite.TRANSFORM*/0x04;
			}
			return m;
		}

		/**
		*?????????????????????
		*@param x X ????????????
		*@param y Y ????????????
		*@return ?????????????????????
		*/
		__proto.pos=function(x,y){
			if (this._x!==x || this._y!==y){
				this.x=x;
				this.y=y;
			}
			return this;
		}

		/**
		*??????????????????
		*@param x X????????????
		*@param y Y????????????
		*@return ?????????????????????
		*/
		__proto.pivot=function(x,y){
			this.pivotX=x;
			this.pivotY=y;
			return this;
		}

		/**
		*???????????????
		*@param width ?????????
		*@param hegiht ?????????
		*@return ?????????????????????
		*/
		__proto.size=function(width,height){
			this.width=width;
			this.height=height;
			return this;
		}

		/**
		*???????????????
		*@param scaleX X??????????????????
		*@param scaleY Y??????????????????
		*@return ?????????????????????
		*/
		__proto.scale=function(scaleX,scaleY){
			this.scaleX=scaleX;
			this.scaleY=scaleY;
			return this;
		}

		/**
		*?????????????????????
		*@param skewX ?????????????????????
		*@param skewY ?????????????????????
		*@return ??????????????????
		*/
		__proto.skew=function(skewX,skewY){
			this.skewX=skewX;
			this.skewY=skewY;
			return this;
		}

		/**
		*??????????????????????????????
		*@param context ???????????????????????????
		*@param x X????????????
		*@param y Y????????????
		*/
		__proto.render=function(context,x,y){
			Stat.spriteCount++;
			RenderSprite.renders[this._renderType]._fun(this,context,x+this._x,y+this._y);
			this._repaint=0;
		}

		/**
		*?????? <code>Sprite</code> ??? <code>canvas</code> ??????
		*@param canvasWidth ???????????????
		*@param canvasHeight ???????????????
		*@param x ????????? X ???????????????
		*@param y ????????? Y ???????????????
		*@return HTMLCanvas ?????????
		*/
		__proto.drawToCanvas=function(canvasWidth,canvasHeight,offsetX,offsetY){
			return RunDriver.drawToCanvas(this,this._renderType,canvasWidth,canvasHeight,offsetX,offsetY);
		}

		/**
		*???????????????????????????????????????
		*<p><b>??????</b>???????????????????????????????????????????????????????????????????????????????????????</p>
		*@param context ???????????????????????????
		*@param x X????????????
		*@param y Y????????????
		*/
		__proto.customRender=function(context,x,y){
			this._renderType |=/*laya.renders.RenderSprite.CUSTOM*/0x200;
		}

		/**
		*@private
		*???????????????
		*/
		__proto._applyFilters=function(){
			if (Render.isWebGL)return;
			var _filters;
			_filters=this._$P.filters;
			if (!_filters || _filters.length < 1)return;
			for (var i=0,n=_filters.length;i < n;i++){
				_filters[i].action.apply(this._$P.cacheCanvas);
			}
		}

		/**
		*@private
		*????????????????????????????????????????????????
		*@return ?????? Boolean ??????????????????????????????????????????????????????
		*/
		__proto._isHaveGlowFilter=function(){
			var i=0,len=0;
			if (this.filters){
				for (i=0;i < this.filters.length;i++){
					if (this.filters[i].type==/*laya.filters.Filter.GLOW*/0x08){
						return true;
					}
				}
			}
			for (i=0,len=this._childs.length;i < len;i++){
				if (this._childs[i]._isHaveGlowFilter()){
					return true;
				}
			}
			return false;
		}

		/**
		*??????????????????????????????
		*@param point ??????????????????
		*@param createNewPoint ???????????????????????????????????????
		*@return ???????????????????????????
		*/
		__proto.localToGlobal=function(point,createNewPoint){
			(createNewPoint===void 0)&& (createNewPoint=false);
			if (!this._displayedInStage || !point)return point;
			if (createNewPoint===true){
				point=new Point(point.x,point.y);
			};
			var ele=this;
			while (ele){
				if (ele==Laya.stage)break ;
				point=ele.toParentPoint(point);
				ele=ele.parent;
			}
			return point;
		}

		/**
		*??????????????????????????????
		*@param point ??????????????????
		*@param createNewPoint ???????????????????????????????????????
		*@return ???????????????????????????
		*/
		__proto.globalToLocal=function(point,createNewPoint){
			(createNewPoint===void 0)&& (createNewPoint=false);
			if (!this._displayedInStage || !point)return point;
			if (createNewPoint===true){
				point=new Point(point.x,point.y);
			};
			var ele=this;
			var list=[];
			while (ele){
				if (ele==Laya.stage)break ;
				list.push(ele);
				ele=ele.parent;
			};
			var i=list.length-1;
			while (i >=0){
				ele=list[i];
				point=ele.fromParentPoint(point);
				i--;
			}
			return point;
		}

		/**
		*??????????????????????????????????????????????????????
		*@param point ??????????????????
		*@return ??????????????????
		*/
		__proto.toParentPoint=function(point){
			if (!point)return point;
			point.x-=this.pivotX;
			point.y-=this.pivotY;
			if (this.transform){
				this._transform.transformPoint(point);
			}
			point.x+=this._x;
			point.y+=this._y;
			var scroll=this._style.scrollRect;
			if (scroll){
				point.x-=scroll.x;
				point.y-=scroll.y;
			}
			return point;
		}

		/**
		*??????????????????????????????????????????????????????
		*@param point ?????????????????????
		*@return ??????????????????
		*/
		__proto.fromParentPoint=function(point){
			if (!point)return point;
			point.x-=this._x;
			point.y-=this._y;
			var scroll=this._style.scrollRect;
			if (scroll){
				point.x+=scroll.x;
				point.y+=scroll.y;
			}
			if (this.transform){
				this._transform.invertTransformPoint(point);
			}
			point.x+=this.pivotX;
			point.y+=this.pivotY;
			return point;
		}

		/**
		*?????? EventDispatcher ?????????????????????????????????????????????????????????????????????????????????????????????
		*??????????????????????????????????????????????????????????????????????????? mouseEnable ????????? true???
		*@param type ??????????????????
		*@param caller ?????????????????????????????????
		*@param listener ?????????????????????
		*@param args ????????????????????????????????????
		*@return ??? EventDispatcher ?????????
		*/
		__proto.on=function(type,caller,listener,args){
			if (this._mouseEnableState!==1 && this.isMouseEvent(type)){
				if (this._displayedInStage)this._$2__onDisplay();
				else laya.events.EventDispatcher.prototype.once.call(this,/*laya.events.Event.DISPLAY*/"display",this,this._$2__onDisplay);
			}
			return laya.events.EventDispatcher.prototype.on.call(this,type,caller,listener,args);
		}

		/**
		*?????? EventDispatcher ??????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????
		*??????????????????????????????????????????????????????????????????????????? mouseEnabled ????????? true(???????????????mouseEnabled=false???????????????????????????mouseEnabled??????)???
		*@param type ??????????????????
		*@param caller ?????????????????????????????????
		*@param listener ?????????????????????
		*@param args ????????????????????????????????????
		*@return ??? EventDispatcher ?????????
		*/
		__proto.once=function(type,caller,listener,args){
			if (this._mouseEnableState!==1 && this.isMouseEvent(type)){
				if (this._displayedInStage)this._$2__onDisplay();
				else laya.events.EventDispatcher.prototype.once.call(this,/*laya.events.Event.DISPLAY*/"display",this,this._$2__onDisplay);
			}
			return laya.events.EventDispatcher.prototype.once.call(this,type,caller,listener,args);
		}

		/**@private */
		__proto._$2__onDisplay=function(){
			if (this._mouseEnableState!==1){
				var ele=this;
				while (ele && ele._mouseEnableState!==1){
					ele.mouseEnabled=true;
					ele=ele.parent;
				}
			}
		}

		/**
		*?????????????????????????????????????????????Graphics.loadImage
		*@param url ???????????????
		*@param x ???????????????x??????
		*@param y ???????????????y??????
		*@param width ?????????????????????????????????0??????????????????????????????
		*@param height ?????????????????????????????????0??????????????????????????????
		*@param complete ??????????????????
		*@return ????????????????????????
		*/
		__proto.loadImage=function(url,x,y,width,height,complete){
			var _$this=this;
			(x===void 0)&& (x=0);
			(y===void 0)&& (y=0);
			(width===void 0)&& (width=0);
			(height===void 0)&& (height=0);
			function loaded (tex){
				if (!_$this.destroyed){
					_$this.size(x+(width || tex.width),y+(height || tex.height));
					_$this.repaint();
					complete && complete.runWith(tex);
				}
			}
			this.graphics.loadImage(url,x,y,width,height,loaded);
			return this;
		}

		/**cacheAs?????????????????????????????????????????????*/
		__proto.repaint=function(){
			this.model && this.model.repaint && this.model.repaint();
			(this._repaint===0)&& (this._repaint=1,this.parentRepaint());
			if (this._$P && this._$P.maskParent){
				this._$P.maskParent.repaint();
			}
		}

		/**
		*@private
		*???????????????????????????
		*@return ???????????????????????? true??????????????? false???
		*/
		__proto._needRepaint=function(){
			return (this._repaint!==0)&& this._$P.cacheCanvas && this._$P.cacheCanvas.reCache;
		}

		/**@inheritDoc */
		__proto._childChanged=function(child){
			if (this._childs.length)this._renderType |=/*laya.renders.RenderSprite.CHILDS*/0x800;
			else this._renderType &=~ /*laya.renders.RenderSprite.CHILDS*/0x800;
			if (child && (child).zOrder)Laya.timer.callLater(this,this.updateZOrder);
			this.repaint();
		}

		/**cacheAs?????????????????????????????????????????? */
		__proto.parentRepaint=function(){
			var p=this._parent;
			p && p._repaint===0 && (p._repaint=1,p.parentRepaint());
		}

		/**
		*????????????????????????
		*@param area ???????????????????????????????????????????????????????????????????????????????????????????????????
		*@param hasInertia ???????????????????????????????????????????????????false????????????
		*@param elasticDistance ??????????????????????????????0?????????????????????????????????0????????????
		*@param elasticBackTime ???????????????????????????????????????????????????300??????????????????
		*@param data ???????????????????????????????????????
		*@param disableMouseEvent ?????????????????????????????????????????????false????????????true???????????????
		*@param ratio ??????????????????
		*/
		__proto.startDrag=function(area,hasInertia,elasticDistance,elasticBackTime,data,disableMouseEvent,ratio){
			(hasInertia===void 0)&& (hasInertia=false);
			(elasticDistance===void 0)&& (elasticDistance=0);
			(elasticBackTime===void 0)&& (elasticBackTime=300);
			(disableMouseEvent===void 0)&& (disableMouseEvent=false);
			(ratio===void 0)&& (ratio=0.92);
			this._$P.dragging || (this._set$P("dragging",new Dragging()));
			this._$P.dragging.start(this,area,hasInertia,elasticDistance,elasticBackTime,data,disableMouseEvent,ratio);
		}

		/**????????????????????????*/
		__proto.stopDrag=function(){
			this._$P.dragging && this._$P.dragging.stop();
		}

		/**@private */
		__proto._setDisplay=function(value){
			if (!value && this._$P.cacheCanvas && this._$P.cacheCanvas.ctx){
				Pool.recover("RenderContext",this._$P.cacheCanvas.ctx);
				this._$P.cacheCanvas.ctx=null;
			}
			if (!value){
				var fc=this._$P._filterCache;
				if (fc){
					fc.destroy();
					fc.recycle();
					this._set$P('_filterCache',null);
				}
				this._$P._isHaveGlowFilter && this._set$P('_isHaveGlowFilter',false);
			}
			_super.prototype._setDisplay.call(this,value);
		}

		/**
		*???????????????????????????????????????
		*@param x ??????x?????????
		*@param y ??????y?????????
		*@return ???????????????????????????
		*/
		__proto.hitTestPoint=function(x,y){
			var point=this.globalToLocal(Point.TEMP.setTo(x,y));
			var rect=this._$P.hitArea ? this._$P.hitArea :Rectangle.EMPTY.setTo(0,0,this._width,this._height);
			return rect.contains(point.x,point.y);
		}

		/**???????????????????????????????????????????????????*/
		__proto.getMousePoint=function(){
			return this.globalToLocal(Point.TEMP.setTo(Laya.stage.mouseX,Laya.stage.mouseY));
		}

		/**@private */
		__proto._getWords=function(){
			return null;
		}

		/**@private */
		__proto._addChildsToLayout=function(out){
			var words=this._getWords();
			if (words==null && this._childs.length==0)return false;
			if (words){
				for (var i=0,n=words.length;i < n;i++){
					out.push(words[i]);
				}
			}
			this._childs.forEach(function(o,index,array){
				o._style._enableLayout()&& o._addToLayout(out);
			});
			return true;
		}

		/**@private */
		__proto._addToLayout=function(out){
			if (this._style.absolute)return;
			this._style.block ? out.push(this):(this._addChildsToLayout(out)&& (this.x=this.y=0));
		}

		/**@private */
		__proto._isChar=function(){
			return false;
		}

		/**@private */
		__proto._getCSSStyle=function(){
			return this._style.getCSSStyle();
		}

		/**
		*@private
		*????????????????????????????????????
		*@param name ????????????
		*@param value ????????????
		*/
		__proto._setAttributes=function(name,value){
			switch (name){
				case 'x':
					this.x=parseFloat(value);
					break ;
				case 'y':
					this.y=parseFloat(value);
					break ;
				case 'width':
					this.width=parseFloat(value);
					break ;
				case 'height':
					this.height=parseFloat(value);
					break ;
				default :
					this[name]=value;
				}
		}

		/**
		*@private
		*/
		__proto._layoutLater=function(){
			this.parent && (this.parent)._layoutLater();
		}

		/**
		*<p>???????????????????????? scrollRect ????????????????????????????????????</p>
		*<p>?????????false(?????????)???</p>
		*<p>?????????ture??????????????????????????????scrollRect ??????????????????????????????????????????????????????????????????????????????</p>
		*/
		__getset(0,__proto,'optimizeScrollRect',function(){
			return this._optimizeScrollRect;
			},function(b){
			if (this._optimizeScrollRect !=b){
				this._optimizeScrollRect=b;
				this.model && this.model.optimizeScrollRect(b);
			}
		});

		/**
		*??????????????????????????????????????????????????????????????????customRender????????????
		*/
		__getset(0,__proto,'customRenderEnable',null,function(b){
			if (b){
				this._renderType |=/*laya.renders.RenderSprite.CUSTOM*/0x200;
				if (Render.isConchNode){
					laya.display.Sprite.CustomList.push(this);
					var canvas=new HTMLCanvas("2d");
					canvas._setContext(/*__JS__ */new CanvasRenderingContext2D());
					/*__JS__ */this.customContext=new RenderContext(0,0,canvas);
					canvas.context.setCanvasType && canvas.context.setCanvasType(2);
					this.model.custom(canvas.context);
				}
			}
		});

		/**
		*?????????????????????????????????????????????????????????cacheAs???normal?????????
		*/
		__getset(0,__proto,'cacheAsBitmap',function(){
			return this.cacheAs!=="none";
			},function(value){
			this.cacheAs=value ? (this._$P["hasFilter"] ? "none" :"normal"):"none";
		});

		/**
		*<p>????????????????????????????????????????????????cacheAs?????????????????????????????????????????????????????????????????????????????????reCache?????????????????????</p>
		*????????????????????????????????????????????????????????????????????????????????????????????????"none"???"normal"???"bitmap"??????????????????
		*<li>?????????"none"????????????????????????</li>
		*<li>?????????"normal"??????canvas????????????????????????webgl??????????????????????????????</li>
		*<li>?????????"bitmap"??????canvas?????????????????????????????????webgl???????????????renderTarget?????????</li>
		*webgl???renderTarget?????????????????????2048?????????????????????????????????????????????????????????????????????????????????????????????drawcall????????????????????????
		*webgl???????????????????????????????????????????????????????????????????????????drawcall??????????????????
		*/
		__getset(0,__proto,'cacheAs',function(){
			return this._$P.cacheCanvas==null ? "none" :this._$P.cacheCanvas.type;
			},function(value){
			var cacheCanvas=this._$P.cacheCanvas;
			if (value===(cacheCanvas ? cacheCanvas.type :"none"))return;
			if (value!=="none"){
				cacheCanvas || (cacheCanvas=this._set$P("cacheCanvas",Pool.getItemByClass("cacheCanvas",Object)));
				cacheCanvas.type=value;
				cacheCanvas.reCache=true;
				this._renderType |=/*laya.renders.RenderSprite.CANVAS*/0x08;
				if (value=="bitmap")this.model && this.model.cacheAs(1);
				this._set$P("cacheForFilters",false);
				}else {
				if (this._$P["hasFilter"]){
					this._set$P("cacheForFilters",true);
					}else {
					if (cacheCanvas)Pool.recover("cacheCanvas",cacheCanvas);
					this._$P.cacheCanvas=null;
					this._renderType &=~ /*laya.renders.RenderSprite.CANVAS*/0x08;
					this.model && this.model.cacheAs(0);
				}
			}
			this.repaint();
		});

		/**z?????????????????????????????????????????????????????????????????????*/
		__getset(0,__proto,'zOrder',function(){
			return this._zOrder;
			},function(value){
			if (this._zOrder !=value){
				this._zOrder=value;
				this.model && this.model.setZOrder && this.model.setZOrder(value);
				this._parent && Laya.timer.callLater(this._parent,this.updateZOrder);
			}
		});

		/**???????????????????????????0???*/
		__getset(0,__proto,'rotation',function(){
			return this._style._tf.rotate;
			},function(value){
			var style=this.getStyle();
			if (style._tf.rotate!==value){
				this._changeType |=0x10;
				style.setRotate(value);
				this._tfChanged=true;
				this.model && this.model.rotate(value);
				this._renderType |=/*laya.renders.RenderSprite.TRANSFORM*/0x04;
				var p=this._parent;
				p && p._repaint===0 && (p._repaint=1,p.parentRepaint());
			}
		});

		/**
		*???????????????????????????????????????????????????
		*/
		__getset(0,__proto,'width',function(){
			if (!this.autoSize)return this._width;
			return this.getSelfBounds().width;
			},function(value){
			this._width!==value && (this._width=value,this.model && this.model.size(value,this._height),this.repaint());
		});

		/**???????????????????????????????????????????????????????????????*/
		__getset(0,__proto,'x',function(){
			return this._x;
			},function(value){
			if (this._x!==value){
				if (this.destroyed)return;
				this._x=value;
				this.model && this.model.pos(value,this._y);
				var p=this._parent;
				p && p._repaint===0 && (p._repaint=1,p.parentRepaint());
				this._$P.maskParent && this._$P.maskParent._repaint===0 && (this._$P.maskParent._repaint=1,this._$P.maskParent.parentRepaint());
			}
		});

		/**
		*????????????Y????????????
		*/
		__getset(0,__proto,'globalScaleY',function(){
			var scale=1;
			var ele=this;
			while (ele){
				if (ele===Laya.stage)break ;
				scale *=ele.scaleX;
				ele=ele.parent;
			}
			return scale;
		});

		/**?????????????????????????????????????????????HitArea?????????*/
		__getset(0,__proto,'hitArea',function(){
			return this._$P.hitArea;
			},function(value){
			this._set$P("hitArea",value);
		});

		/**??????cacheAs??????????????????????????????staticCache=true?????????????????????????????????????????????????????????????????????reCache?????????????????????*/
		__getset(0,__proto,'staticCache',function(){
			return this._$P.staticCache;
			},function(value){
			this._set$P("staticCache",value);
			if (!value && this._$P.cacheCanvas){
				this._$P.cacheCanvas.reCache=true;
			}
		});

		/**@private ??????graphics???????????????texture??????????????????graphics.clear();graphics.drawTexture()*/
		__getset(0,__proto,'texture',function(){
			return this._texture;
			},function(value){
			if (this._texture !=value){
				this._texture=value;
				this.graphics.cleanByTexture(value,0,0);
			}
		});

		/**???????????????????????????????????????????????????????????????*/
		__getset(0,__proto,'y',function(){
			return this._y;
			},function(value){
			if (this._y!==value){
				if (this.destroyed)return;
				this._y=value;
				this.model && this.model.pos(this._x,value);
				var p=this._parent;
				p && p._repaint===0 && (p._repaint=1,p.parentRepaint());
				this._$P.maskParent && this._$P.maskParent._repaint===0 && (this._$P.maskParent._repaint=1,this._$P.maskParent.parentRepaint());
			}
		});

		/**
		*???????????????????????????????????????????????????
		*/
		__getset(0,__proto,'height',function(){
			if (!this.autoSize)return this._height;
			return this.getSelfBounds().height;
			},function(value){
			this._height!==value && (this._height=value,this.model && this.model.size(this._width,value),this.repaint());
		});

		/**?????????????????????????????????*/
		__getset(0,__proto,'blendMode',function(){
			return this._style.blendMode;
			},function(value){
			this.getStyle().blendMode=value;
			this.model && this.model.blendMode(value);
			if (value && value !="source-over")this._renderType |=/*laya.renders.RenderSprite.BLEND*/0x20;
			else this._renderType &=~ /*laya.renders.RenderSprite.BLEND*/0x20;
			this.parentRepaint();
		});

		/**X???????????????????????????1???*/
		__getset(0,__proto,'scaleX',function(){
			return this._style._tf.scaleX;
			},function(value){
			var style=this.getStyle();
			if (style._tf.scaleX!==value){
				style.setScaleX(value);
				this._changeType |=0x10;
				this._tfChanged=true;
				this.model && this.model.scale(value,style._tf.scaleY);
				this._renderType |=/*laya.renders.RenderSprite.TRANSFORM*/0x04;
				var p=this._parent;
				p && p._repaint===0 && (p._repaint=1,p.parentRepaint());
			}
		});

		/**Y???????????????????????????1???*/
		__getset(0,__proto,'scaleY',function(){
			return this._style._tf.scaleY;
			},function(value){
			var style=this.getStyle();
			if (style._tf.scaleY!==value){
				style.setScaleY(value);
				this._changeType |=0x10;
				this._tfChanged=true;
				this.model && this.model.scale(style._tf.scaleX,value);
				this._renderType |=/*laya.renders.RenderSprite.TRANSFORM*/0x04;
				var p=this._parent;
				p && p._repaint===0 && (p._repaint=1,p.parentRepaint());
			}
		});

		/**????????? <code>stage</code> ????????????*/
		__getset(0,__proto,'stage',function(){
			return Laya.stage;
		});

		/**?????????????????????????????????0???*/
		__getset(0,__proto,'skewX',function(){
			return this._style._tf.skewX;
			},function(value){
			var style=this.getStyle();
			if (style._tf.skewX!==value){
				style.setSkewX(value);
				this._tfChanged=true;
				this._renderType |=/*laya.renders.RenderSprite.TRANSFORM*/0x04;
				var p=this._parent;
				p && p._repaint===0 && (p._repaint=1,p.parentRepaint());
			}
		});

		/**????????????????????????????????????*/
		__getset(0,__proto,'scrollRect',function(){
			return this._style.scrollRect;
			},function(value){
			this.getStyle().scrollRect=value;
			this.viewport=value;
			this.repaint();
			if (value){
				this._renderType |=/*laya.renders.RenderSprite.CLIP*/0x40;
				this.model && this.model.scrollRect(value.x,value.y,value.width,value.height);
				}else {
				this._renderType &=~ /*laya.renders.RenderSprite.CLIP*/0x40;
				this.model && this.model.removeType(/*laya.renders.RenderSprite.CLIP*/0x40);
			}
		});

		/**?????????????????????????????????0???*/
		__getset(0,__proto,'skewY',function(){
			return this._style._tf.skewY;
			},function(value){
			var style=this.getStyle();
			if (style._tf.skewY!==value){
				style.setSkewY(value);
				this._tfChanged=true;
				this.model && this.model.skew(style._tf.skewX,value);
				this._renderType |=/*laya.renders.RenderSprite.TRANSFORM*/0x04;
				var p=this._parent;
				p && p._repaint===0 && (p._repaint=1,p.parentRepaint());
			}
		});

		/**
		*????????????????????????
		*/
		__getset(0,__proto,'transform',function(){
			return this._tfChanged ? this._adjustTransform():this._transform;
			},function(value){
			this._tfChanged=false;
			this._transform=value;
			if (value){
				this._x=value.tx;
				this._y=value.ty;
				value.tx=value.ty=0;
				this.model && this.model.transform(value.a,value.b,value.c,value.d,this._x,this._y);
			}
			if (value)this._renderType |=/*laya.renders.RenderSprite.TRANSFORM*/0x04;
			else {
				this._renderType &=~ /*laya.renders.RenderSprite.TRANSFORM*/0x04;
				this.model && this.model.removeType(/*laya.renders.RenderSprite.TRANSFORM*/0x04);
			}
			this.parentRepaint();
		});

		/**X??? ????????????????????????????????????????????????0??????????????????????????????????????????????????????*/
		__getset(0,__proto,'pivotX',function(){
			return this._style._tf.translateX;
			},function(value){
			this.getStyle().setTranslateX(value);
			this._changeType |=0x10;
			this.model && this.model.pivot(value,this._style._tf.translateY);
			this.repaint();
		});

		/**Y??? ????????????????????????????????????????????????0??????????????????????????????????????????????????????*/
		__getset(0,__proto,'pivotY',function(){
			return this._style._tf.translateY;
			},function(value){
			this.getStyle().setTranslateY(value);
			this._changeType |=0x10;
			this.model && this.model.pivot(this._style._tf.translateX,value);
			this.repaint();
		});

		/**??????????????????0-1???????????????1?????????????????????*/
		__getset(0,__proto,'alpha',function(){
			return this._style.alpha;
			},function(value){
			if (this._style && this._style.alpha!==value){
				value=value < 0 ? 0 :(value > 1 ? 1 :value);
				this.getStyle().alpha=value;
				this.model && this.model.alpha(value);
				if (value!==1)this._renderType |=/*laya.renders.RenderSprite.ALPHA*/0x02;
				else this._renderType &=~ /*laya.renders.RenderSprite.ALPHA*/0x02;
				this.parentRepaint();
			}
		});

		/**??????????????????????????????true???*/
		__getset(0,__proto,'visible',function(){
			return this._style.visible;
			},function(value){
			if (this._style && this._style.visible!==value){
				this.getStyle().visible=value;
				this.model && this.model.visible(value);
				this.parentRepaint();
			}
		});

		/**???????????????*/
		__getset(0,__proto,'graphics',function(){
			return this._graphics || (this.graphics=RunDriver.createGraphics());
			},function(value){
			if (this._graphics)this._graphics._sp=null;
			this._graphics=value;
			if (value){
				this._renderType &=~ /*laya.renders.RenderSprite.IMAGE*/0x01;
				this._renderType |=/*laya.renders.RenderSprite.GRAPHICS*/0x100;
				value._sp=this;
				this.model && this.model.graphics(this._graphics);
				}else {
				this._renderType &=~ /*laya.renders.RenderSprite.GRAPHICS*/0x100;
				this._renderType &=~ /*laya.renders.RenderSprite.IMAGE*/0x01;
				this.model && this.model.removeType(/*laya.renders.RenderSprite.GRAPHICS*/0x100);
			}
			this.repaint();
		});

		/**???????????????*/
		__getset(0,__proto,'filters',function(){
			return this._$P.filters;
			},function(value){
			value && value.length===0 && (value=null);
			if (this._$P.filters==value)return;
			this._set$P("filters",value ? value.slice():null);
			if (Render.isConchApp){
				this.model && this.model.removeType(0x10);
				if (this._$P.filters && this._$P.filters.length==1){
					this._$P.filters[0].callNative(this);
				}
			}
			if (Render.isWebGL){
				if (value && value.length){
					this._renderType |=/*laya.renders.RenderSprite.FILTERS*/0x10;
					}else {
					this._renderType &=~ /*laya.renders.RenderSprite.FILTERS*/0x10;
				}
			}
			if (value && value.length > 0){
				if (!(Render.isWebGL && value.length==1 && (((value[0])instanceof laya.filters.ColorFilter )))){
					if (this.cacheAs !="bitmap"){
						if (!Render.isConchNode)this.cacheAs="bitmap";
						this._set$P("cacheForFilters",true);
					}
					this._set$P("hasFilter",true);
				}
				}else {
				this._set$P("hasFilter",false);
				if (this._$P["cacheForFilters"] && this.cacheAs=="bitmap"){
					this.cacheAs="none";
				}
			}
			this.repaint();
		});

		/**???????????????????????????????????????????????????????????????????????????????????????
		*???????????????????????????????????????????????????????????????????????????flash????????????*/
		__getset(0,__proto,'mask',function(){
			return this._$P._mask;
			},function(value){
			if (value && this.mask && this.mask._$P.maskParent)return;
			if (value){
				this.cacheAs="bitmap";
				this._set$P("_mask",value);
				value._set$P("maskParent",this);
				}else {
				this.cacheAs="none";
				this.mask && this.mask._set$P("maskParent",null);
				this._set$P("_mask",value);
			}
			this.model && this.model.mask(value ? value.model :null);
			this._renderType |=/*laya.renders.RenderSprite.BLEND*/0x20;
			this.parentRepaint();
		});

		/**
		*???????????????????????????
		*?????????false?????????????????????????????????????????????????????????????????????????????? mouseEnable ???????????? true?????????????????????????????????false????????????????????????
		**/
		__getset(0,__proto,'mouseEnabled',function(){
			return this._mouseEnableState > 1;
			},function(value){
			this._mouseEnableState=value ? 2 :1;
		});

		/**
		*????????????X????????????
		*/
		__getset(0,__proto,'globalScaleX',function(){
			var scale=1;
			var ele=this;
			while (ele){
				if (ele===Laya.stage)break ;
				scale *=ele.scaleX;
				ele=ele.parent;
			}
			return scale;
		});

		/**
		*?????????????????????????????? X ??????????????????
		*/
		__getset(0,__proto,'mouseX',function(){
			return this.getMousePoint().x;
		});

		/**
		*?????????????????????????????? Y ??????????????????
		*/
		__getset(0,__proto,'mouseY',function(){
			return this.getMousePoint().y;
		});

		Sprite.fromImage=function(url){
			return new Sprite().loadImage(url);
		}

		Sprite.CHG_VIEW=0x10;
		Sprite.CHG_SCALE=0x100;
		Sprite.CHG_TEXTURE=0x1000;
		Sprite.CustomList=[];
		return Sprite;
	})(Node)


	/**
	*@private
	*audio?????????????????????????????????
	*/
	//class laya.media.h5audio.AudioSoundChannel extends laya.media.SoundChannel
	var AudioSoundChannel=(function(_super){
		function AudioSoundChannel(audio){
			this._audio=null;
			this._onEnd=null;
			this._resumePlay=null;
			AudioSoundChannel.__super.call(this);
			this._onEnd=Utils.bind(this.__onEnd,this);
			this._resumePlay=Utils.bind(this.__resumePlay,this);
			audio.addEventListener("ended",this._onEnd);
			this._audio=audio;
		}

		__class(AudioSoundChannel,'laya.media.h5audio.AudioSoundChannel',_super);
		var __proto=AudioSoundChannel.prototype;
		__proto.__onEnd=function(){
			if (this.loops==1){
				if (this.completeHandler){
					Laya.timer.once(10,this,this.__runComplete,[this.completeHandler],false);
					this.completeHandler=null;
				}
				this.stop();
				this.event(/*laya.events.Event.COMPLETE*/"complete");
				return;
			}
			if (this.loops > 0){
				this.loops--;
			}
			this.play();
		}

		__proto.__resumePlay=function(){
			if(this._audio)this._audio.removeEventListener("canplay",this._resumePlay);
			try {
				this._audio.currentTime=this.startTime;
				Browser.container.appendChild(this._audio);
				this._audio.play();
				}catch (e){
				this.event(/*laya.events.Event.ERROR*/"error");
			}
		}

		/**
		*??????
		*/
		__proto.play=function(){
			try {
				this._audio.currentTime=this.startTime;
				}catch (e){
				this._audio.addEventListener("canplay",this._resumePlay);
				return;
			}
			Browser.container.appendChild(this._audio);
			if("play" in this._audio)
				this._audio.play();
		}

		/**
		*????????????
		*
		*/
		__proto.stop=function(){
			this.isStopped=true;
			SoundManager.removeChannel(this);
			this.completeHandler=null;
			if (!this._audio)
				return;
			if("pause" in this._audio)
				this._audio.pause();
			this._audio.removeEventListener("ended",this._onEnd);
			this._audio.removeEventListener("canplay",this._resumePlay);
			Pool.recover("audio:"+this.url,this._audio);
			Browser.removeElement(this._audio);
			this._audio=null;
		}

		/**
		*????????????????????????
		*@return
		*
		*/
		__getset(0,__proto,'position',function(){
			if (!this._audio)
				return 0;
			return this._audio.currentTime;
		});

		/**
		*??????????????????
		*/
		__getset(0,__proto,'duration',function(){
			if (!this._audio)
				return 0;
			return this._audio.duration;
		});

		/**
		*????????????
		*@param v
		*
		*/
		/**
		*????????????
		*@return
		*
		*/
		__getset(0,__proto,'volume',function(){
			if (!this._audio)return 1;
			return this._audio.volume;
			},function(v){
			if (!this._audio)return;
			this._audio.volume=v;
		});

		return AudioSoundChannel;
	})(SoundChannel)


	/**
	*@private
	*web audio api?????????????????????????????????
	*/
	//class laya.media.webaudio.WebAudioSoundChannel extends laya.media.SoundChannel
	var WebAudioSoundChannel=(function(_super){
		function WebAudioSoundChannel(){
			this.audioBuffer=null;
			this.gain=null;
			this.bufferSource=null;
			this._currentTime=0;
			this._volume=1;
			this._startTime=0;
			this._onPlayEnd=null;
			this.context=WebAudioSound.ctx;
			WebAudioSoundChannel.__super.call(this);
			this._onPlayEnd=Utils.bind(this.__onPlayEnd,this);
			if (this.context["createGain"]){
				this.gain=this.context["createGain"]();
				}else {
				this.gain=this.context["createGainNode"]();
			}
		}

		__class(WebAudioSoundChannel,'laya.media.webaudio.WebAudioSoundChannel',_super);
		var __proto=WebAudioSoundChannel.prototype;
		/**
		*????????????
		*/
		__proto.play=function(){
			this._clearBufferSource();
			if (!this.audioBuffer)return;
			var context=this.context;
			var gain=this.gain;
			var bufferSource=context.createBufferSource();
			this.bufferSource=bufferSource;
			bufferSource.buffer=this.audioBuffer;
			bufferSource.connect(gain);
			if (gain)
				gain.disconnect();
			gain.connect(context.destination);
			bufferSource.onended=this._onPlayEnd;
			this._startTime=Browser.now();
			this.gain.gain.value=this._volume;
			if (this.loops==0){
				bufferSource.loop=true;
			}
			bufferSource.start(0,this.startTime);
			this._currentTime=0;
		}

		__proto.__onPlayEnd=function(){
			if (this.loops==1){
				if (this.completeHandler){
					Laya.timer.once(10,this,this.__runComplete,[this.completeHandler],false);
					this.completeHandler=null;
				}
				this.stop();
				this.event(/*laya.events.Event.COMPLETE*/"complete");
				return;
			}
			if (this.loops > 0){
				this.loops--;
			}
			this.play();
		}

		__proto._clearBufferSource=function(){
			if (this.bufferSource){
				var sourceNode=this.bufferSource;
				if (sourceNode.stop){
					sourceNode.stop(0);
					}else {
					sourceNode.noteOff(0);
				}
				sourceNode.disconnect(0);
				sourceNode.onended=null;
				if (!WebAudioSoundChannel._tryCleanFailed)this._tryClearBuffer(sourceNode);
				this.bufferSource=null;
			}
		}

		__proto._tryClearBuffer=function(sourceNode){
			try {sourceNode.buffer=WebAudioSound._miniBuffer;}catch (e){WebAudioSoundChannel._tryCleanFailed=true;}
		}

		/**
		*????????????
		*/
		__proto.stop=function(){
			this._clearBufferSource();
			this.audioBuffer=null;
			if (this.gain)
				this.gain.disconnect();
			this.isStopped=true;
			SoundManager.removeChannel(this);
			this.completeHandler=null;
		}

		/**
		*????????????????????????
		*/
		__getset(0,__proto,'position',function(){
			if (this.bufferSource){
				return (Browser.now()-this._startTime)/ 1000+this.startTime;
			}
			return 0;
		});

		__getset(0,__proto,'duration',function(){
			if (this.audioBuffer){
				return this.audioBuffer.duration;
			}
			return 0;
		});

		/**
		*????????????
		*/
		/**
		*????????????
		*/
		__getset(0,__proto,'volume',function(){
			return this._volume;
			},function(v){
			if (this.isStopped){
				return;
			}
			this._volume=v;
			this.gain.gain.value=v;
		});

		WebAudioSoundChannel._tryCleanFailed=false;
		return WebAudioSoundChannel;
	})(SoundChannel)


	/**
	*@private
	*<code>Bitmap</code> ?????????????????????
	*/
	//class laya.resource.Bitmap extends laya.resource.Resource
	var Bitmap=(function(_super){
		function Bitmap(){
			//this._source=null;
			//this._w=NaN;
			//this._h=NaN;
			this.useNum=0;
			Bitmap.__super.call(this);
			this._w=0;
			this._h=0;
		}

		__class(Bitmap,'laya.resource.Bitmap',_super);
		var __proto=Bitmap.prototype;
		/**
		*?????????????????????
		*/
		__proto.dispose=function(){
			this._resourceManager.removeResource(this);
			_super.prototype.dispose.call(this);
		}

		/***
		*?????????
		*/
		__getset(0,__proto,'width',function(){
			return this._w;
		});

		/***
		*?????????
		*/
		__getset(0,__proto,'height',function(){
			return this._h;
		});

		/***
		*HTML Image ??? HTML Canvas ??? WebGL Texture ???
		*/
		__getset(0,__proto,'source',function(){
			return this._source;
		});

		return Bitmap;
	})(Resource)


	/**
	*?????????????????????
	*/
	//class laya.display.AnimationPlayerBase extends laya.display.Sprite
	var AnimationPlayerBase=(function(_super){
		function AnimationPlayerBase(){
			this.loop=false;
			this.wrapMode=0;
			this._index=0;
			this._count=0;
			this._isPlaying=false;
			this._labels=null;
			this._isReverse=false;
			this._frameRateChanged=false;
			this._controlNode=null;
			this._actionName=null;
			AnimationPlayerBase.__super.call(this);
			this._interval=Config.animationInterval;
		}

		__class(AnimationPlayerBase,'laya.display.AnimationPlayerBase',_super);
		var __proto=AnimationPlayerBase.prototype;
		/**
		*???????????????
		*@param start ??????????????????????????????label???
		*@param loop ???????????????
		*@param name ??????name??????(??????)???????????????????????????????????????????????????????????????????????????????????????
		*/
		__proto.play=function(start,loop,name){
			(start===void 0)&& (start=0);
			(loop===void 0)&& (loop=true);
			(name===void 0)&& (name="");
			this._isPlaying=true;
			this.index=((typeof start=='string'))? this._getFrameByLabel(start):start;
			this.loop=loop;
			this._actionName=name;
			this._isReverse=this.wrapMode==1;
			if (this.interval > 0){
				this.timerLoop(this.interval,this,this._frameLoop,null,true);
			}
		}

		/**@private */
		__proto._getFrameByLabel=function(label){
			var i=0;
			for (i=0;i < this._count;i++){
				if (this._labels[i]==label)return i;
			}
			return 0;
		}

		/**@private */
		__proto._frameLoop=function(){
			if (this._isReverse){
				this._index--;
				if (this._index < 0){
					if (this.loop){
						if (this.wrapMode==2){
							this._index=this._count > 0 ? 1 :0;
							this._isReverse=false;
							}else {
							this._index=this._count-1;
						}
						this.event(/*laya.events.Event.COMPLETE*/"complete");
						}else {
						this._index=0;
						this.stop();
						this.event(/*laya.events.Event.COMPLETE*/"complete");
						return;
					}
				}
				}else {
				this._index++;
				if (this._index >=this._count){
					if (this.loop){
						if (this.wrapMode==2){
							this._index=this._count-2 >=0 ? this._count-2 :0;
							this._isReverse=true;
							}else {
							this._index=0;
						}
						this.event(/*laya.events.Event.COMPLETE*/"complete");
						}else {
						this._index--;
						this.stop();
						this.event(/*laya.events.Event.COMPLETE*/"complete");
						return;
					}
				}
			}
			this.index=this._index;
		}

		/**@private */
		__proto._setControlNode=function(node){
			if (this._controlNode){
				this._controlNode.off(/*laya.events.Event.DISPLAY*/"display",this,this._$3__onDisplay);
				this._controlNode.off(/*laya.events.Event.UNDISPLAY*/"undisplay",this,this._$3__onDisplay);
			}
			this._controlNode=node;
			if (node && node !=this){
				node.on(/*laya.events.Event.DISPLAY*/"display",this,this._$3__onDisplay);
				node.on(/*laya.events.Event.UNDISPLAY*/"undisplay",this,this._$3__onDisplay);
			}
		}

		/**@private */
		__proto._setDisplay=function(value){
			_super.prototype._setDisplay.call(this,value);
			this._$3__onDisplay();
		}

		/**@private */
		__proto._$3__onDisplay=function(){
			if (this._isPlaying){
				if (this._controlNode.displayedInStage)this.play(this._index,this.loop,this._actionName);
				else this.clearTimer(this,this._frameLoop);
			}
		}

		/**
		*???????????????
		*/
		__proto.stop=function(){
			this._isPlaying=false;
			this.clearTimer(this,this._frameLoop);
		}

		/**
		*?????????????????????index?????????????????????index????????????label??????
		*@param label ????????????
		*@param index ????????????
		*/
		__proto.addLabel=function(label,index){
			if (!this._labels)this._labels={};
			this._labels[index]=label;
		}

		/**
		*??????????????????
		*@param label ?????????????????????label????????????????????????Label
		*/
		__proto.removeLabel=function(label){
			if (!label)this._labels=null;
			else if (this._labels){
				for (var name in this._labels){
					if (this._labels[name]===label){
						delete this._labels[name];
						break ;
					}
				}
			}
		}

		/**
		*????????????????????????
		*@param position ????????????label
		*/
		__proto.gotoAndStop=function(position){
			this.index=((typeof position=='string'))? this._getFrameByLabel(position):position;
			this.stop();
		}

		/**
		*@private
		*???????????????
		*@param value ?????????
		*
		*/
		__proto._displayToIndex=function(value){}
		/**??????????????????????????????*/
		__proto.clear=function(){
			this.stop();
			this._labels=null;
		}

		/**????????????(???????????????)???*/
		/**????????????(???????????????)???*/
		__getset(0,__proto,'interval',function(){
			return this._interval;
			},function(value){
			if (this._interval !=value){
				this._frameRateChanged=true;
				this._interval=value;
				if (this._isPlaying && value > 0){
					this.timerLoop(value,this,this._frameLoop,null,true);
				}
			}
		});

		/**
		*??????????????????
		*/
		__getset(0,__proto,'isPlaying',function(){
			return this._isPlaying;
		});

		/**?????????????????????*/
		__getset(0,__proto,'index',function(){
			return this._index;
			},function(value){
			this._index=value;
			this._displayToIndex(value);
			if (this._labels && this._labels[value])this.event(/*laya.events.Event.LABEL*/"label",this._labels[value]);
		});

		/**???????????????*/
		__getset(0,__proto,'count',function(){
			return this._count;
		});

		return AnimationPlayerBase;
	})(Sprite)


	/**
	*<p> <code>Text</code> ?????????????????????????????????????????????</p>
	*@example ???????????????????????????????????? <code>Text</code> ?????????
	*<listing version="3.0">
	*package
	*{
		*import laya.display.Text;
		*public class Text_Example
		*{
			*public function Text_Example()
			*{
				*Laya.init(640,800);//??????????????????????????????????????????
				*Laya.stage.bgColor="#efefef";//??????????????????????????????
				*onInit();
				*}
			*private function onInit():void
			*{
				*var text:Text=new Text();//???????????? Text ?????????????????? text ???
				*text.text="??????????????? Text ???????????????";
				*text.color="#008fff";//?????? text ??????????????????
				*text.font="Arial";//?????? text ??????????????????
				*text.bold=true;//?????? text ???????????????????????????
				*text.fontSize=30;//?????? text ??????????????????
				*text.wordWrap=true;//?????? text ????????????????????????
				*text.x=100;//?????? text ??????????????? x ????????????????????? text ????????????????????????
				*text.y=100;//?????? text ??????????????? y ????????????????????? text ????????????????????????
				*text.width=300;//?????? text ????????????
				*text.height=200;//?????? text ????????????
				*text.italic=true;//?????? text ???????????????????????????
				*text.borderColor="#fff000";//?????? text ????????????????????????
				*Laya.stage.addChild(text);//??? text ????????????????????????
				*}
			*}
		*}
	*</listing>
	*<listing version="3.0">
	*Text_Example();
	*function Text_Example()
	*{
		*Laya.init(640,800);//??????????????????????????????????????????
		*Laya.stage.bgColor="#efefef";//??????????????????????????????
		*onInit();
		*}
	*function onInit()
	*{
		*var text=new laya.display.Text();//???????????? Text ?????????????????? text ???
		*text.text="??????????????? Text ???????????????";
		*text.color="#008fff";//?????? text ??????????????????
		*text.font="Arial";//?????? text ??????????????????
		*text.bold=true;//?????? text ???????????????????????????
		*text.fontSize=30;//?????? text ??????????????????
		*text.wordWrap=true;//?????? text ????????????????????????
		*text.x=100;//?????? text ??????????????? x ????????????????????? text ????????????????????????
		*text.y=100;//?????? text ??????????????? y ????????????????????? text ????????????????????????
		*text.width=300;//?????? text ????????????
		*text.height=200;//?????? text ????????????
		*text.italic=true;//?????? text ???????????????????????????
		*text.borderColor="#fff000";//?????? text ????????????????????????
		*Laya.stage.addChild(text);//??? text ????????????????????????
		*}
	*</listing>
	*<listing version="3.0">
	*class Text_Example {
		*constructor(){
			*Laya.init(640,800);//??????????????????????????????????????????
			*Laya.stage.bgColor="#efefef";//??????????????????????????????
			*this.onInit();
			*}
		*private onInit():void {
			*var text:laya.display.Text=new laya.display.Text();//???????????? Text ?????????????????? text ???
			*text.text="??????????????? Text ???????????????";
			*text.color="#008fff";//?????? text ??????????????????
			*text.font="Arial";//?????? text ??????????????????
			*text.bold=true;//?????? text ???????????????????????????
			*text.fontSize=30;//?????? text ??????????????????
			*text.wordWrap=true;//?????? text ????????????????????????
			*text.x=100;//?????? text ??????????????? x ????????????????????? text ????????????????????????
			*text.y=100;//?????? text ??????????????? y ????????????????????? text ????????????????????????
			*text.width=300;//?????? text ????????????
			*text.height=200;//?????? text ????????????
			*text.italic=true;//?????? text ???????????????????????????
			*text.borderColor="#fff000";//?????? text ????????????????????????
			*Laya.stage.addChild(text);//??? text ????????????????????????
			*}
		*}
	*</listing>
	*/
	//class laya.display.Text extends laya.display.Sprite
	var Text=(function(_super){
		function Text(){
			this._clipPoint=null;
			this._currBitmapFont=null;
			this._text=null;
			this._isChanged=false;
			this._textWidth=0;
			this._textHeight=0;
			this._lines=[];
			this._lineWidths=[];
			this._startX=NaN;
			this._startY=NaN;
			this._lastVisibleLineIndex=-1;
			this._words=null;
			this._charSize={};
			this.underline=false;
			this._underlineColor=null;
			Text.__super.call(this);
			this.overflow=Text.VISIBLE;
			this._style=new CSSStyle(this);
			(this._style).wordWrap=false;
		}

		__class(Text,'laya.display.Text',_super);
		var __proto=Text.prototype;
		/**@inheritDoc */
		__proto.destroy=function(destroyChild){
			(destroyChild===void 0)&& (destroyChild=true);
			_super.prototype.destroy.call(this,destroyChild);
			this._lines=null;
			if (this._words){
				this._words.length=0;
				this._words=null;
			}
		}

		/**
		*@private
		*@inheritDoc
		*/
		__proto._getBoundPointsM=function(ifRotate){
			(ifRotate===void 0)&& (ifRotate=false);
			var rec=Rectangle.TEMP;
			rec.setTo(0,0,this.width,this.height);
			return rec._getBoundPoints();
		}

		/**
		*@inheritDoc
		*/
		__proto.getGraphicBounds=function(){
			var rec=Rectangle.TEMP;
			rec.setTo(0,0,this.width,this.height);
			return rec;
		}

		/**
		*@private
		*@inheritDoc
		*/
		__proto._getCSSStyle=function(){
			return this._style;
		}

		/**
		*<p>?????????????????????????????????????????????????????????????????????????????????????????????{i}?????????????????????</p>
		*<p>?????????
		*<li>???1???text ??????????????????????????????????????????????????????????????????????????????????????????My name????????????My name????????????????????????????????????</li>
		*<li>???2???text ???????????????????????????{0}????????????{1}???????????????arg1 ?????????100???arg2 ?????????200???
		*???????????????????????????????????????????????????????????????Congratulations on your winning {0}diamonds,{1}experience.??????
		*?????????????????????{0}???{1}??????????????????????????????0??????????????? arg1???arg2 ?????????
		*??????????????????????????????Congratulations on your winning 100 diamonds,200 experience.????????????????????????????????????
		*</li>
		*</p>
		*@param text ???????????????
		*@param ...args ?????????????????????
		*/
		__proto.lang=function(text,arg1,arg2,arg3,arg4,arg5,arg6,arg7,arg8,arg9,arg10){
			text=Text.langPacks && Text.langPacks[text] ? Text.langPacks[text] :text;
			if (arguments.length < 2){
				this._text=text;
				}else {
				for (var i=0,n=arguments.length;i < n;i++){
					text=text.replace("{"+i+"}",arguments[i+1]);
				}
				this._text=text;
			}
		}

		/**
		*???????????????
		*@param begin ???????????????????????????
		*@param visibleLineCount ??????????????????
		*/
		__proto.renderText=function(begin,visibleLineCount){
			var graphics=this.graphics;
			graphics.clear();
			var ctxFont=(this.italic ? "italic " :"")+(this.bold ? "bold " :"")+this.fontSize+"px "+this.font;
			Browser.context.font=ctxFont;
			var padding=this.padding;
			var startX=padding[3];
			var textAlgin="left";
			var lines=this._lines;
			var lineHeight=this.leading+this._charSize.height;
			var tCurrBitmapFont=this._currBitmapFont;
			if (tCurrBitmapFont){
				lineHeight=this.leading+tCurrBitmapFont.getMaxHeight();
			};
			var startY=padding[0];
			if ((!tCurrBitmapFont)&& this._width > 0 && this._textWidth <=this._width){
				if (this.align=="right"){
					textAlgin="right";
					startX=this._width-padding[1];
					}else if (this.align=="center"){
					textAlgin="center";
					startX=this._width *0.5+padding[3]-padding[1];
				}
			}
			if (this._height > 0){
				var tempVAlign=(this._textHeight > this._height)? "top" :this.valign;
				if (tempVAlign==="middle")
					startY=(this._height-visibleLineCount *lineHeight)*0.5+padding[0]-padding[2];
				else if (tempVAlign==="bottom")
				startY=this._height-visibleLineCount *lineHeight-padding[2];
			};
			var style=this._style;
			if (tCurrBitmapFont && tCurrBitmapFont.autoScaleSize){
				var bitmapScale=tCurrBitmapFont.fontSize / this.fontSize;
			}
			if (this._clipPoint){
				graphics.save();
				if (tCurrBitmapFont && tCurrBitmapFont.autoScaleSize){
					var tClipWidth=0;
					var tClipHeight=0;
					this._width ? tClipWidth=(this._width-padding[3]-padding[1]):tClipWidth=this._textWidth;
					this._height ? tClipHeight=(this._height-padding[0]-padding[2]):tClipHeight=this._textHeight;
					tClipWidth *=bitmapScale;
					tClipHeight *=bitmapScale;
					graphics.clipRect(padding[3],padding[0],tClipWidth,tClipHeight);
					}else {
					graphics.clipRect(padding[3],padding[0],this._width ? (this._width-padding[3]-padding[1]):this._textWidth,this._height ? (this._height-padding[0]-padding[2]):this._textHeight);
				}
			};
			var password=style.password;
			if (("prompt" in this)&& this['prompt']==this._text)
				password=false;
			var x=0,y=0;
			var end=Math.min(this._lines.length,visibleLineCount+begin)|| 1;
			for (var i=begin;i < end;i++){
				var word=lines[i];
				var _word;
				if (password){
					var len=word.length;
					word="";
					for (var j=len;j > 0;j--){
						word+="???";
					}
				}
				x=startX-(this._clipPoint ? this._clipPoint.x :0);
				y=startY+lineHeight *i-(this._clipPoint ? this._clipPoint.y :0);
				this.underline && this.drawUnderline(textAlgin,x,y,i);
				if (tCurrBitmapFont){
					var tWidth=this.width;
					if (tCurrBitmapFont.autoScaleSize){
						tWidth=this.width *bitmapScale;
					}
					tCurrBitmapFont.drawText(word,this,x,y,this.align,tWidth);
					}else {
					if (Render.isWebGL){
						this._words || (this._words=[]);
						_word=this._words.length > (i-begin)? this._words[i-begin] :new WordText();
						_word.setText(word);
						}else {
						_word=word;
					}
					style.stroke ? graphics.fillBorderText(_word,x,y,ctxFont,this.color,style.strokeColor,style.stroke,textAlgin):graphics.fillText(_word,x,y,ctxFont,this.color,textAlgin);
				}
			}
			if (tCurrBitmapFont && tCurrBitmapFont.autoScaleSize){
				var tScale=1 / bitmapScale;
				this.scale(tScale,tScale);
			}
			if (this._clipPoint)
				graphics.restore();
			this._startX=startX;
			this._startY=startY;
		}

		/**
		*???????????????
		*@param x ????????????
		*@param y ????????????
		*@param lineIndex ????????????
		*/
		__proto.drawUnderline=function(align,x,y,lineIndex){
			var lineWidth=this._lineWidths[lineIndex];
			switch (align){
				case 'center':
					x-=lineWidth / 2;
					break ;
				case 'right':
					x-=lineWidth;
					break ;
				case 'left':
				default :
					break ;
				}
			y+=this._charSize.height;
			this._graphics.drawLine(x,y,x+lineWidth,y,this.underlineColor || this.color,1);
		}

		/**
		*<p>???????????????</p>
		*<p>?????????????????????????????????????????????</p>
		*/
		__proto.typeset=function(){
			this._isChanged=false;
			if (!this._text){
				this._clipPoint=null;
				this._textWidth=this._textHeight=0;
				this.graphics.clear();
				return;
			}
			Browser.context.font=this._getCSSStyle().font;
			this._lines.length=0;
			this._lineWidths.length=0;
			this.parseLines(this._text);
			this.evalTextSize();
			if (this.checkEnabledViewportOrNot())
				this._clipPoint || (this._clipPoint=new Point(0,0));
			else
			this._clipPoint=null;
			var lineCount=this._lines.length;
			if (this.overflow !=Text.VISIBLE){
				var func=this.overflow==Text.HIDDEN ? Math.floor :Math.ceil;
				lineCount=Math.min(lineCount,func((this.height-this.padding[0]-this.padding[2])/ (this.leading+this._charSize.height)));
			};
			var startLine=this.scrollY / (this._charSize.height+this.leading)| 0;
			this.renderText(startLine,lineCount);
			this.repaint();
		}

		__proto.evalTextSize=function(){
			var nw=NaN,nh=NaN;
			nw=Math.max.apply(this,this._lineWidths);
			if (this._currBitmapFont)
				nh=this._lines.length *(this._currBitmapFont.getMaxHeight()+this.leading)+this.padding[0]+this.padding[2];
			else
			nh=this._lines.length *(this._charSize.height+this.leading)+this.padding[0]+this.padding[2];
			if (nw !=this._textWidth || nh !=this._textHeight){
				this._textWidth=nw;
				this._textHeight=nh;
				if(!this._width||!this._height)
					this.model&&this.model.size(this._width||this._textWidth,this._height||this._textHeight);
			}
		}

		__proto.checkEnabledViewportOrNot=function(){
			return this.overflow==Text.SCROLL && ((this._width > 0 && this._textWidth > this._width)|| (this._height > 0 && this._textHeight > this._height));
		}

		/**
		*??????????????????????????????????????????????????????????????????
		*<p>????????????????????????????????????????????????????????????????????????????????????????????????</p>
		*@param text ???????????????
		*/
		__proto.changeText=function(text){
			if (this._text!==text){
				this.lang(text+"");
				if (this._graphics && this._graphics.replaceText(this._text)){
					}else {
					this.typeset();
				}
			}
		}

		/**
		*@private
		*?????????????????????
		*/
		__proto.parseLines=function(text){
			var needWordWrapOrTruncate=this.wordWrap || this.overflow==Text.HIDDEN;
			if (needWordWrapOrTruncate){
				var wordWrapWidth=this.getWordWrapWidth();
			};
			var measureResult=Browser.context.measureText("???");
			this._charSize.width=measureResult.width;
			this._charSize.height=(measureResult.height || this.fontSize);
			var lines=text.replace(/\r\n/g,"\n").split("\n");
			for (var i=0,n=lines.length;i < n;i++){
				if (i < n-1)
					lines[i]+="\n";
				var line=lines[i];
				if (needWordWrapOrTruncate)
					this.parseLine(line,wordWrapWidth);
				else {
					this._lineWidths.push(this.getTextWidth(line));
					this._lines.push(line);
				}
			}
		}

		/**
		*@private
		*??????????????????
		*@param line ??????????????????
		*@param wordWrapWidth ????????????????????????
		*/
		__proto.parseLine=function(line,wordWrapWidth){
			var ctx=Browser.context;
			var lines=this._lines;
			var maybeIndex=0;
			var execResult;
			var charsWidth=NaN;
			var wordWidth=NaN;
			var startIndex=0;
			charsWidth=this.getTextWidth(line);
			if (charsWidth <=wordWrapWidth){
				lines.push(line);
				this._lineWidths.push(charsWidth);
				return;
			}
			charsWidth=this._currBitmapFont ? this._currBitmapFont.getMaxWidth():this._charSize.width;
			maybeIndex=Math.floor(wordWrapWidth / charsWidth);
			(maybeIndex==0)&& (maybeIndex=1);
			charsWidth=this.getTextWidth(line.substring(0,maybeIndex));
			wordWidth=charsWidth;
			for (var j=maybeIndex,m=line.length;j < m;j++){
				charsWidth=this.getTextWidth(line.charAt(j));
				wordWidth+=charsWidth;
				if (wordWidth > wordWrapWidth){
					if (this.wordWrap){
						var newLine=line.substring(startIndex,j);
						if (newLine.charCodeAt(newLine.length-1)< 255){
							execResult=/[^\x20-]+$/.exec(newLine);
							if (execResult){
								j=execResult.index+startIndex;
								if (execResult.index==0)
									j+=newLine.length;
								else
								newLine=line.substring(startIndex,j);
							}
						}
						lines.push(newLine);
						this._lineWidths.push(wordWidth-charsWidth);
						startIndex=j;
						if (j+maybeIndex < m){
							j+=maybeIndex;
							charsWidth=this.getTextWidth(line.substring(startIndex,j));
							wordWidth=charsWidth;
							j--;
							}else {
							lines.push(line.substring(startIndex,m));
							this._lineWidths.push(this.getTextWidth(lines[lines.length-1]));
							startIndex=-1;
							break ;
						}
						}else if (this.overflow==Text.HIDDEN){
						lines.push(line.substring(0,j));
						this._lineWidths.push(this.getTextWidth(lines[lines.length-1]));
						return;
					}
				}
			}
			if (this.wordWrap && startIndex !=-1){
				lines.push(line.substring(startIndex,m));
				this._lineWidths.push(this.getTextWidth(lines[lines.length-1]));
			}
		}

		__proto.getTextWidth=function(text){
			if (this._currBitmapFont)
				return this._currBitmapFont.getTextWidth(text);
			else
			return Browser.context.measureText(text).width;
		}

		/**
		*??????????????????????????????
		*/
		__proto.getWordWrapWidth=function(){
			var p=this.padding;
			var w=NaN;
			if (this._currBitmapFont && this._currBitmapFont.autoScaleSize)
				w=this._width *(this._currBitmapFont.fontSize / this.fontSize);
			else
			w=this._width;
			if (w <=0){
				w=this.wordWrap ? 100 :Browser.width;
			}
			w <=0 && (w=100);
			return w-p[3]-p[1];
		}

		/**
		*??????????????????????????????
		*@param charIndex ???????????????
		*@param out ?????????Point?????????
		*@return ??????Point???????????????
		*/
		__proto.getCharPoint=function(charIndex,out){
			this._isChanged && Laya.timer.runCallLater(this,this.typeset);
			var len=0,lines=this._lines,startIndex=0;
			for (var i=0,n=lines.length;i < n;i++){
				len+=lines[i].length;
				if (charIndex < len){
					var line=i;
					break ;
				}
				startIndex=len;
			};
			var ctxFont=(this.italic ? "italic " :"")+(this.bold ? "bold " :"")+this.fontSize+"px "+this.font;
			Browser.context.font=ctxFont;
			var width=this.getTextWidth(this._text.substring(startIndex,charIndex));
			var point=out || new Point();
			return point.setTo(this._startX+width-(this._clipPoint ? this._clipPoint.x :0),this._startY+line *(this._charSize.height+this.leading)-(this._clipPoint ? this._clipPoint.y :0));
		}

		/**
		*@inheritDoc
		*/
		__getset(0,__proto,'width',function(){
			if (this._width)
				return this._width;
			return this.textWidth+this.padding[1]+this.padding[3];
			},function(value){
			if (value !=this._width){
				_super.prototype._$set_width.call(this,value);
				this.isChanged=true;
			}
		});

		/**
		*?????????????????????????????????????????????
		*/
		__getset(0,__proto,'textWidth',function(){
			this._isChanged && Laya.timer.runCallLater(this,this.typeset);
			return this._textWidth;
		});

		/**
		*@inheritDoc
		*/
		__getset(0,__proto,'height',function(){
			if (this._height)return this._height;
			return this.textHeight+this.padding[0]+this.padding[2];
			},function(value){
			if (value !=this._height){
				_super.prototype._$set_height.call(this,value);
				this.isChanged=true;
			}
		});

		/**
		*?????????????????????????????????????????????
		*/
		__getset(0,__proto,'textHeight',function(){
			this._isChanged && Laya.timer.runCallLater(this,this.typeset);
			return this._textHeight;
		});

		/**
		*???????????????
		*<p>???????????????[?????????????????????????????????????????????]?????????????????????????????????</p>
		*/
		__getset(0,__proto,'padding',function(){
			return this._getCSSStyle().padding;
			},function(value){
			this._getCSSStyle().padding=value;
			this.isChanged=true;
		});

		/**
		*?????????????????????????????????
		*<p>???????????? false???????????????????????????????????????????????? true???????????????????????????</p>
		*/
		__getset(0,__proto,'bold',function(){
			return this._getCSSStyle().bold;
			},function(value){
			this._getCSSStyle().bold=value;
			this.isChanged=true;
		});

		/**?????????????????????????????????*/
		__getset(0,__proto,'text',function(){
			return this._text || "";
			},function(value){
			if (this._text!==value){
				this.lang(value+"");
				this.isChanged=true;
				this.event(/*laya.events.Event.CHANGE*/"change");
			}
		});

		/**
		*??????????????????????????????????????? <code>Text.defaultColor</code> ?????????????????????
		*<p>?????????????????????</p>
		*/
		__getset(0,__proto,'color',function(){
			return this._getCSSStyle().color;
			},function(value){
			if (this._getCSSStyle().color !=value){
				this._getCSSStyle().color=value;
				if (!this._isChanged && this._graphics){
					this._graphics.replaceTextColor(this.color)
					}else {
					this.isChanged=true;
				}
			}
		});

		/**
		*???????????????????????????????????????????????????
		*<p>???????????????"Arial"???????????????Text.defaultFont?????????????????????</p> *
		*@see laya.display.css.Font#defaultFamily
		*/
		__getset(0,__proto,'font',function(){
			return this._getCSSStyle().fontFamily;
			},function(value){
			if (this._currBitmapFont){
				this._currBitmapFont=null;
				this.scale(1,1);
			}
			if (Text._bitmapFonts && Text._bitmapFonts[value]){
				this._currBitmapFont=Text._bitmapFonts[value];
			}
			this._getCSSStyle().fontFamily=value;
			this.isChanged=true;
		});

		/**
		*??????????????????????????????????????????????????????
		*<p>?????????20????????????????????? <code>Text.defaultSize</code> ?????????????????????</p>
		*/
		__getset(0,__proto,'fontSize',function(){
			return this._getCSSStyle().fontSize;
			},function(value){
			this._getCSSStyle().fontSize=value;
			this.isChanged=true;
		});

		/**
		*??????????????????????????????????????????????????????
		*<p>???????????? false????????????????????????????????????????????? true????????????????????????</p>
		*/
		__getset(0,__proto,'italic',function(){
			return this._getCSSStyle().italic;
			},function(value){
			this._getCSSStyle().italic=value;
			this.isChanged=true;
		});

		/**
		*????????????????????????????????????
		*<p><b>?????????</b>
		*<li>"left"??? ?????????????????????</li>
		*<li>"center"??? ?????????????????????</li>
		*<li>"right"??? ?????????????????????</li>
		*</p>
		*/
		__getset(0,__proto,'align',function(){
			return this._getCSSStyle().align;
			},function(value){
			this._getCSSStyle().align=value;
			this.isChanged=true;
		});

		/**
		*????????????????????????????????????
		*<p><b>?????????</b>
		*<li>"top"??? ????????????????????????</li>
		*<li>"middle"??? ?????????????????????</li>
		*<li>"bottom"??? ????????????????????????</li>
		*</p>
		*/
		__getset(0,__proto,'valign',function(){
			return this._getCSSStyle().valign;
			},function(value){
			this._getCSSStyle().valign=value;
			this.isChanged=true;
		});

		/**
		*??????????????????????????????????????????false???
		*<p>?????????true?????????????????????????????????????????????</p>
		*/
		__getset(0,__proto,'wordWrap',function(){
			return this._getCSSStyle().wordWrap;
			},function(value){
			this._getCSSStyle().wordWrap=value;
			this.isChanged=true;
		});

		/**
		*??????????????????????????????????????????
		*/
		__getset(0,__proto,'leading',function(){
			return this._getCSSStyle().leading;
			},function(value){
			this._getCSSStyle().leading=value;
			this.isChanged=true;
		});

		/**
		*??????????????????????????????????????????
		*/
		__getset(0,__proto,'bgColor',function(){
			return this._getCSSStyle().backgroundColor;
			},function(value){
			this._getCSSStyle().backgroundColor=value;
			this.isChanged=true;
		});

		/**
		*????????????????????????????????????????????????
		*/
		__getset(0,__proto,'borderColor',function(){
			return this._getCSSStyle().borderColor;
			},function(value){
			this._getCSSStyle().borderColor=value;
			this.isChanged=true;
		});

		/**
		*<p>???????????????????????????????????????</p>
		*?????????0?????????????????????
		*/
		__getset(0,__proto,'stroke',function(){
			return this._getCSSStyle().stroke;
			},function(value){
			this._getCSSStyle().stroke=value;
			this.isChanged=true;
		});

		/**
		*<p>????????????????????????????????????</p>
		*???????????? "#000000"????????????;
		*/
		__getset(0,__proto,'strokeColor',function(){
			return this._getCSSStyle().strokeColor;
			},function(value){
			this._getCSSStyle().strokeColor=value;
			this.isChanged=true;
		});

		/**
		*???????????????????????????????????????????????????????????????true??????????????????
		*/
		__getset(0,__proto,'isChanged',null,function(value){
			if (this._isChanged!==value){
				this._isChanged=value;
				value && Laya.timer.callLater(this,this.typeset);
			}
		});

		/**
		*????????????????????????
		*<p>???????????????????????????????????????????????????????????????????????????????????????</p>
		*/
		/**
		*????????????????????????
		*/
		__getset(0,__proto,'scrollX',function(){
			if (!this._clipPoint)
				return 0;
			return this._clipPoint.x;
			},function(value){
			if (this.overflow !=Text.SCROLL || (this.textWidth < this._width || !this._clipPoint))
				return;
			value=value < this.padding[3] ? this.padding[3] :value;
			var maxScrollX=this._textWidth-this._width;
			value=value > maxScrollX ? maxScrollX :value;
			var visibleLineCount=this._height / (this._charSize.height+this.leading)| 0+1;
			this._clipPoint.x=value;
			this.renderText(this._lastVisibleLineIndex,visibleLineCount);
		});

		/**
		*????????????????????????px)??????????????????????????????????????????????????????????????????????????????????????????
		*/
		/**
		*????????????????????????
		*/
		__getset(0,__proto,'scrollY',function(){
			if (!this._clipPoint)
				return 0;
			return this._clipPoint.y;
			},function(value){
			if (this.overflow !=Text.SCROLL || (this.textHeight < this._height || !this._clipPoint))
				return;
			value=value < this.padding[0] ? this.padding[0] :value;
			var maxScrollY=this._textHeight-this._height;
			value=value > maxScrollY ? maxScrollY :value;
			var startLine=value / (this._charSize.height+this.leading)| 0;
			this._lastVisibleLineIndex=startLine;
			var visibleLineCount=(this._height / (this._charSize.height+this.leading)| 0)+1;
			this._clipPoint.y=value;
			this.renderText(startLine,visibleLineCount);
		});

		/**
		*?????????????????????????????????
		*/
		__getset(0,__proto,'maxScrollX',function(){
			return (this.textWidth < this._width)? 0 :this._textWidth-this._width;
		});

		/**
		*?????????????????????????????????
		*/
		__getset(0,__proto,'maxScrollY',function(){
			return (this.textHeight < this._height)? 0 :this._textHeight-this._height;
		});

		__getset(0,__proto,'lines',function(){
			return this._lines;
		});

		__getset(0,__proto,'underlineColor',function(){
			return this._underlineColor;
			},function(value){
			this._underlineColor=value;
			this._isChanged=true;
			this.typeset();
		});

		Text.registerBitmapFont=function(name,bitmapFont){
			Text._bitmapFonts || (Text._bitmapFonts={});
			Text._bitmapFonts[name]=bitmapFont;
		}

		Text.unregisterBitmapFont=function(name,destroy){
			(destroy===void 0)&& (destroy=true);
			if (Text._bitmapFonts && Text._bitmapFonts[name]){
				var tBitmapFont=Text._bitmapFonts[name];
				if (destroy){
					tBitmapFont.destroy();
				}
				delete Text._bitmapFonts[name];
			}
		}

		Text.langPacks=null
		Text.VISIBLE="visible";
		Text.SCROLL="scroll";
		Text.HIDDEN="hidden";
		Text._bitmapFonts=null
		return Text;
	})(Sprite)


	/**
	*<p> <code>Stage</code> ?????????????????????????????????</p>
	*???????????? Laya.stage ?????????
	*/
	//class laya.display.Stage extends laya.display.Sprite
	var Stage=(function(_super){
		function Stage(){
			this.focus=null;
			this.frameRate="fast";
			this.desginWidth=0;
			this.desginHeight=0;
			this.canvasRotation=false;
			this.canvasDegree=0;
			this.renderingEnabled=true;
			this._screenMode="none";
			this._scaleMode="noscale";
			this._alignV="top";
			this._alignH="left";
			this._bgColor="black";
			this._mouseMoveTime=0;
			this._renderCount=0;
			this._safariOffsetY=0;
			this._frameStartTime=NaN;
			this._previousOrientation=0;
			this._scenes=null;
			Stage.__super.call(this);
			this.offset=new Point();
			this._canvasTransform=new Matrix();
			var _$this=this;
			this.transform=Matrix.create();
			this._scenes=[];
			this.mouseEnabled=true;
			this.hitTestPrior=true;
			this.autoSize=false;
			this._displayedInStage=true;
			var _this=this;
			var window=Browser.window;
			window.addEventListener("focus",function(){
				_this.event(/*laya.events.Event.FOCUS*/"focus");
			});
			window.addEventListener("blur",function(){
				_this.event(/*laya.events.Event.BLUR*/"blur");
				if (_this._isInputting())Input["inputElement"].target.focus=false;
			});
			var hidden="hidden",state="visibilityState",visibilityChange="visibilitychange";
			var document=window.document;
			if (typeof document.hidden!=="undefined"){
				visibilityChange="visibilitychange";
				state="visibilityState";
				}else if (typeof document.mozHidden!=="undefined"){
				visibilityChange="mozvisibilitychange";
				state="mozVisibilityState";
				}else if (typeof document.msHidden!=="undefined"){
				visibilityChange="msvisibilitychange";
				state="msVisibilityState";
				}else if (typeof document.webkitHidden!=="undefined"){
				visibilityChange="webkitvisibilitychange";
				state="webkitVisibilityState";
			}
			window.document.addEventListener(visibilityChange,visibleChangeFun);
			function visibleChangeFun (){
				if (Browser.document[state]=="hidden"){
					_this.event(/*laya.events.Event.BLUR*/"blur");
					if (_this._isInputting())Input["inputElement"].target.focus=false;
					}else {
					_this.event(/*laya.events.Event.FOCUS*/"focus");
				}
			}
			window.addEventListener("resize",function(){
				var orientation=Browser.window.orientation;
				if (orientation !=null && orientation !=_$this._previousOrientation && _this._isInputting()){
					Input["inputElement"].target.focus=false;
				}
				_$this._previousOrientation=orientation;
				if (_this._isInputting())return;
				if (Browser.onSafari)
					_this._safariOffsetY=(Browser.window.__innerHeight || Browser.document.body.clientHeight || Browser.document.documentElement.clientHeight)-Browser.window.innerHeight;
				_this._resetCanvas();
			});
			window.addEventListener("orientationchange",function(e){
				_this._resetCanvas();
			});
			this.on(/*laya.events.Event.MOUSE_MOVE*/"mousemove",this,this._onmouseMove);
			if (Browser.onMobile)this.on(/*laya.events.Event.MOUSE_DOWN*/"mousedown",this,this._onmouseMove);
		}

		__class(Stage,'laya.display.Stage',_super);
		var __proto=Stage.prototype;
		/**
		*???????????????????????????????????????????????????????????????????????????
		*/
		__proto._isInputting=function(){
			return (Browser.onMobile && Input.isInputting);
		}

		/**@private */
		__proto._changeCanvasSize=function(){
			this.setScreenSize(Browser.clientWidth *Browser.pixelRatio,Browser.clientHeight *Browser.pixelRatio);
		}

		/**@private */
		__proto._resetCanvas=function(){
			var canvas=Render._mainCanvas;
			var canvasStyle=canvas.source.style;
			canvas.size(1,1);
			canvasStyle.transform=canvasStyle.webkitTransform=canvasStyle.msTransform=canvasStyle.mozTransform=canvasStyle.oTransform="";
			this.visible=false;
			Laya.timer.once(100,this,this._changeCanvasSize);
		}

		/**
		*???????????????????????????????????????????????????????????????
		*@param screenWidth ???????????????
		*@param screenHeight ???????????????
		*/
		__proto.setScreenSize=function(screenWidth,screenHeight){
			var rotation=false;
			if (this._screenMode!=="none"){
				var screenType=screenWidth / screenHeight < 1 ? "vertical" :"horizontal";
				rotation=screenType!==this._screenMode;
				if (rotation){
					var temp=screenHeight;
					screenHeight=screenWidth;
					screenWidth=temp;
				}
			}
			this.canvasRotation=rotation;
			var canvas=Render._mainCanvas;
			var canvasStyle=canvas.source.style;
			var mat=this._canvasTransform.identity();
			var scaleMode=this._scaleMode;
			var scaleX=screenWidth / this.desginWidth;
			var scaleY=screenHeight / this.desginHeight;
			var canvasWidth=this.desginWidth;
			var canvasHeight=this.desginHeight;
			var realWidth=screenWidth;
			var realHeight=screenHeight;
			var pixelRatio=Browser.pixelRatio;
			this._width=this.desginWidth;
			this._height=this.desginHeight;
			switch (scaleMode){
				case "noscale":
					scaleX=scaleY=1;
					realWidth=this.desginWidth;
					realHeight=this.desginHeight;
					break ;
				case "showall":
					scaleX=scaleY=Math.min(scaleX,scaleY);
					canvasWidth=realWidth=Math.round(this.desginWidth *scaleX);
					canvasHeight=realHeight=Math.round(this.desginHeight *scaleY);
					break ;
				case "noborder":
					scaleX=scaleY=Math.max(scaleX,scaleY);
					realWidth=Math.round(this.desginWidth *scaleX);
					realHeight=Math.round(this.desginHeight *scaleY);
					break ;
				case "full":
					scaleX=scaleY=1;
					this._width=canvasWidth=screenWidth;
					this._height=canvasHeight=screenHeight;
					break ;
				case "fixedwidth":
					scaleY=scaleX;
					this._height=screenHeight / scaleX;
					canvasHeight=Math.round(screenHeight / scaleX);
					break ;
				case "fixedheight":
					scaleX=scaleY;
					this._width=screenWidth / scaleY;
					canvasWidth=Math.round(screenWidth / scaleY);
					break ;
				}
			scaleX *=this.scaleX;
			scaleY *=this.scaleY;
			if (scaleX===1 && scaleY===1){
				this.transform.identity();
				}else {
				this.transform.a=this._formatData(scaleX / (realWidth / canvasWidth));
				this.transform.d=this._formatData(scaleY / (realHeight / canvasHeight));
				this.model && this.model.scale(this.transform.a,this.transform.d);
			}
			canvas.size(canvasWidth,canvasHeight);
			RunDriver.changeWebGLSize(canvasWidth,canvasHeight);
			mat.scale(realWidth / canvasWidth / pixelRatio,realHeight / canvasHeight / pixelRatio);
			if (this._alignH==="left")this.offset.x=0;
			else if (this._alignH==="right")this.offset.x=screenWidth-realWidth;
			else this.offset.x=(screenWidth-realWidth)*0.5 / pixelRatio;
			if (this._alignV==="top")this.offset.y=0;
			else if (this._alignV==="bottom")this.offset.y=screenHeight-realHeight;
			else this.offset.y=(screenHeight-realHeight)*0.5 / pixelRatio;
			this.offset.x=Math.round(this.offset.x);
			this.offset.y=Math.round(this.offset.y);
			mat.translate(this.offset.x,this.offset.y);
			if (this._safariOffsetY && parseInt(canvasStyle.top)===0)canvasStyle.top=this._safariOffsetY+"px";
			this.canvasDegree=0;
			if (rotation){
				if (this._screenMode==="horizontal"){
					mat.rotate(Math.PI / 2);
					mat.translate(screenHeight / pixelRatio,0);
					this.canvasDegree=90;
					}else {
					mat.rotate(-Math.PI / 2);
					mat.translate(0,screenWidth / pixelRatio);
					this.canvasDegree=-90;
				}
			}
			mat.a=this._formatData(mat.a);
			mat.d=this._formatData(mat.d);
			mat.tx=this._formatData(mat.tx);
			mat.ty=this._formatData(mat.ty);
			canvasStyle.transformOrigin=canvasStyle.webkitTransformOrigin=canvasStyle.msTransformOrigin=canvasStyle.mozTransformOrigin=canvasStyle.oTransformOrigin="0px 0px 0px";
			canvasStyle.transform=canvasStyle.webkitTransform=canvasStyle.msTransform=canvasStyle.mozTransform=canvasStyle.oTransform="matrix("+mat.toString()+")";
			mat.translate(parseInt(canvasStyle.left)|| 0,parseInt(canvasStyle.top)|| 0);
			this.visible=true;
			this._repaint=1;
			this.event(/*laya.events.Event.RESIZE*/"resize");
		}

		__proto._formatData=function(value){
			if (Math.abs(value)< 0.000001)return 0;
			if (Math.abs(1-value)< 0.001)return value > 0 ? 1 :-1;
			return value;
		}

		/**@inheritDoc */
		__proto.getMousePoint=function(){
			return Point.TEMP.setTo(this.mouseX,this.mouseY);
		}

		/**@inheritDoc */
		__proto.repaint=function(){
			this._repaint=1;
		}

		/**@inheritDoc */
		__proto.parentRepaint=function(){}
		/**@private */
		__proto._loop=function(){
			this.render(Render.context,0,0);
			return true;
		}

		/**@private */
		__proto._onmouseMove=function(e){
			this._mouseMoveTime=Browser.now();
		}

		/**??????????????????????????????????????????????????????????????????
		*????????????????????????????????????????????????????????????????????????????????????????????????????????????*/
		__proto.getTimeFromFrameStart=function(){
			return Browser.now()-this._frameStartTime;
		}

		/**@inheritDoc */
		__proto.render=function(context,x,y){
			if (this.frameRate==="sleep"){
				var now=Browser.now();
				if (now-this._frameStartTime >=1000)this._frameStartTime=now;
				else return;
			}
			this._renderCount++;
			Render.isFlash && this.repaint();
			if (!this.visible){
				if (this._renderCount % 5===0){
					Stat.loopCount++;
					MouseManager.instance.runEvent();
					Laya.timer._update();
				}
				return;
			}
			this._frameStartTime=Browser.now();
			var frameMode=this.frameRate==="mouse" ? (((this._frameStartTime-this._mouseMoveTime)< 2000)? "fast" :"slow"):this.frameRate;
			var isFastMode=(frameMode!=="slow");
			var isDoubleLoop=(this._renderCount % 2===0);
			Stat.renderSlow=!isFastMode;
			if (isFastMode || isDoubleLoop){
				Stat.loopCount++;
				MouseManager.instance.runEvent();
				Laya.timer._update();
				var i=0,n=0;
				for (i=0,n=this._scenes.length;i < n;i++){
					var scene=this._scenes[i];
					(scene)&& (scene._updateScene());
				}
				if (Render.isConchNode){
					var customList=Sprite.CustomList;
					for (i=0,n=customList.length;i < n;i++){
						var customItem=customList[i];
						customItem.customRender(customItem.customContext,0,0);
					}
					return;
				}
				if (Render.isWebGL && this.renderingEnabled){
					context.clear();
					_super.prototype.render.call(this,context,x,y);
				}
			}
			if (Render.isConchNode)return;
			if (this.renderingEnabled && (isFastMode || !isDoubleLoop)){
				if (Render.isWebGL){
					RunDriver.clear(this._bgColor);
					RunDriver.beginFlush();
					context.flush();
					RunDriver.endFinish();
					VectorGraphManager.instance && VectorGraphManager.getInstance().endDispose();
					}else {
					RunDriver.clear(this._bgColor);
					_super.prototype.render.call(this,context,x,y);
				}
			}
		}

		/**@private */
		__proto._requestFullscreen=function(){
			var element=Browser.document.documentElement;
			if (element.requestFullscreen){
				element.requestFullscreen();
				}else if (element.mozRequestFullScreen){
				element.mozRequestFullScreen();
				}else if (element.webkitRequestFullscreen){
				element.webkitRequestFullscreen();
				}else if (element.msRequestFullscreen){
				element.msRequestFullscreen();
			}
		}

		/**@private */
		__proto._fullScreenChanged=function(){
			Laya.stage.event(/*laya.events.Event.FULL_SCREEN_CHANGE*/"fullscreenchange");
		}

		/**????????????*/
		__proto.exitFullscreen=function(){
			var document=Browser.document;
			if (document.exitFullscreen){
				document.exitFullscreen();
				}else if (document.mozCancelFullScreen){
				document.mozCancelFullScreen();
				}else if (document.webkitExitFullscreen){
				document.webkitExitFullscreen();
			}
		}

		/**????????? Stage ?????? Y ????????????*/
		__getset(0,__proto,'mouseY',function(){
			return Math.round(MouseManager.instance.mouseY / this.clientScaleY);
		});

		/**???????????????????????????????????? Y ??????????????????*/
		__getset(0,__proto,'clientScaleY',function(){
			return this._transform ? this._transform.getScaleY():1;
		});

		__getset(0,__proto,'width',_super.prototype._$get_width,function(value){
			this.desginWidth=value;
			_super.prototype._$set_width.call(this,value);
			Laya.timer.callLater(this,this._changeCanvasSize);
		});

		/**
		*?????????????????????
		*<p><ul>???????????????
		*<li>"left" ??????????????????</li>
		*<li>"center" ??????????????????</li>
		*<li>"right" ??????????????????</li>
		*</ul></p>
		*????????????"left"???
		*/
		__getset(0,__proto,'alignH',function(){
			return this._alignH;
			},function(value){
			this._alignH=value;
			Laya.timer.callLater(this,this._changeCanvasSize);
		});

		__getset(0,__proto,'height',_super.prototype._$get_height,function(value){
			this.desginHeight=value;
			_super.prototype._$set_height.call(this,value);
			Laya.timer.callLater(this,this._changeCanvasSize);
		});

		/**
		*<p>???????????????</p>
		*<p><ul>???????????????
		*<li>"noscale" ???????????????</li>
		*<li>"exactfit" ???????????????????????????</li>
		*<li>"showall" ????????????????????????</li>
		*<li>"noborder" ????????????????????????</li>
		*<li>"full" ???????????????stage??????????????????????????????</li>
		*<li>"fixedwidth" ????????????????????????????????????????????????</li>
		*<li>"fixedheight" ????????????????????????????????????????????????</li>
		*</ul></p>
		*???????????? "noscale"???
		*/
		__getset(0,__proto,'scaleMode',function(){
			return this._scaleMode;
			},function(value){
			this._scaleMode=value;
			Laya.timer.callLater(this,this._changeCanvasSize);
		});

		/**
		*?????????????????????
		*<p><ul>???????????????
		*<li>"top" ?????????????????????</li>
		*<li>"middle" ??????????????????</li>
		*<li>"bottom" ?????????????????????</li>
		*</ul></p>
		*/
		__getset(0,__proto,'alignV',function(){
			return this._alignV;
			},function(value){
			this._alignV=value;
			Laya.timer.callLater(this,this._changeCanvasSize);
		});

		/**??????????????????????????????????????????null????????????*/
		__getset(0,__proto,'bgColor',function(){
			return this._bgColor;
			},function(value){
			this._bgColor=value;
			this.model && this.model.bgColor(value);
			if (value){
				Render.canvas.style.background=value;
				}else {
				Render.canvas.style.background="none";
			}
		});

		/**???????????????????????????????????? X ??????????????????*/
		__getset(0,__proto,'clientScaleX',function(){
			return this._transform ? this._transform.getScaleX():1;
		});

		/**????????? Stage ?????? X ????????????*/
		__getset(0,__proto,'mouseX',function(){
			return Math.round(MouseManager.instance.mouseX / this.clientScaleX);
		});

		/**
		*?????????????????????
		*<p><ul>???????????????
		*<li>"none" ??????????????????</li>
		*<li>"horizontal" ???????????????</li>
		*<li>"vertical" ???????????????</li>
		*</ul></p>
		*/
		__getset(0,__proto,'screenMode',function(){
			return this._screenMode;
			},function(value){
			this._screenMode=value;
		});

		__getset(0,__proto,'visible',_super.prototype._$get_visible,function(value){
			if (this.visible!==value){
				_super.prototype._$set_visible.call(this,value);
				var style=Render._mainCanvas.source.style;
				style.visibility=value ? "visible" :"hidden";
			}
		});

		/**????????????????????????????????????????????????*/
		__getset(0,__proto,'fullScreenEnabled',null,function(value){
			var document=Browser.document;
			var canvas=Render.canvas;
			if (value){
				canvas.addEventListener('mousedown',this._requestFullscreen);
				canvas.addEventListener('touchstart',this._requestFullscreen);
				document.addEventListener("fullscreenchange",this._fullScreenChanged);
				document.addEventListener("mozfullscreenchange",this._fullScreenChanged);
				document.addEventListener("webkitfullscreenchange",this._fullScreenChanged);
				document.addEventListener("msfullscreenchange",this._fullScreenChanged);
				}else {
				canvas.removeEventListener('mousedown',this._requestFullscreen);
				canvas.removeEventListener('touchstart',this._requestFullscreen);
				document.removeEventListener("fullscreenchange",this._fullScreenChanged);
				document.removeEventListener("mozfullscreenchange",this._fullScreenChanged);
				document.removeEventListener("webkitfullscreenchange",this._fullScreenChanged);
				document.removeEventListener("msfullscreenchange",this._fullScreenChanged);
			}
		});

		Stage.SCALE_NOSCALE="noscale";
		Stage.SCALE_EXACTFIT="exactfit";
		Stage.SCALE_SHOWALL="showall";
		Stage.SCALE_NOBORDER="noborder";
		Stage.SCALE_FULL="full";
		Stage.SCALE_FIXED_WIDTH="fixedwidth";
		Stage.SCALE_FIXED_HEIGHT="fixedheight";
		Stage.ALIGN_LEFT="left";
		Stage.ALIGN_RIGHT="right";
		Stage.ALIGN_CENTER="center";
		Stage.ALIGN_TOP="top";
		Stage.ALIGN_MIDDLE="middle";
		Stage.ALIGN_BOTTOM="bottom";
		Stage.SCREEN_NONE="none";
		Stage.SCREEN_HORIZONTAL="horizontal";
		Stage.SCREEN_VERTICAL="vertical";
		Stage.FRAME_FAST="fast";
		Stage.FRAME_SLOW="slow";
		Stage.FRAME_MOUSE="mouse";
		Stage.FRAME_SLEEP="sleep";
		return Stage;
	})(Sprite)


	//class laya.media.SoundNode extends laya.display.Sprite
	var SoundNode=(function(_super){
		function SoundNode(){
			this.url=null;
			this._channel=null;
			this._tar=null;
			this._playEvents=null;
			this._stopEvents=null;
			SoundNode.__super.call(this);
			this.visible=false;
			this.on(/*laya.events.Event.ADDED*/"added",this,this._onParentChange);
			this.on(/*laya.events.Event.REMOVED*/"removed",this,this._onParentChange);
		}

		__class(SoundNode,'laya.media.SoundNode',_super);
		var __proto=SoundNode.prototype;
		/**@private */
		__proto._onParentChange=function(){
			this.target=this.parent;
		}

		/**
		*??????
		*@param loops ????????????
		*@param complete ????????????
		*
		*/
		__proto.play=function(loops,complete){
			(loops===void 0)&& (loops=1);
			if (isNaN(loops)){
				loops=1;
			}
			if (!this.url)return;
			this.stop();
			this._channel=SoundManager.playSound(this.url,loops,complete);
		}

		/**
		*????????????
		*
		*/
		__proto.stop=function(){
			if (this._channel && !this._channel.isStopped){
				this._channel.stop();
			}
			this._channel=null;
		}

		/**@private */
		__proto._setPlayAction=function(tar,event,action,add){
			(add===void 0)&& (add=true);
			if (!this[action])return;
			if (!tar)return;
			if (add){
				tar.on(event,this,this[action]);
				}else {
				tar.off(event,this,this[action]);
			}
		}

		/**@private */
		__proto._setPlayActions=function(tar,events,action,add){
			(add===void 0)&& (add=true);
			if (!tar)return;
			if (!events)return;
			var eventArr=events.split(",");
			var i=0,len=0;
			len=eventArr.length;
			for (i=0;i < len;i++){
				this._setPlayAction(tar,eventArr[i],action,add);
			}
		}

		/**
		*???????????????????????????
		*@param events
		*
		*/
		__getset(0,__proto,'playEvent',null,function(events){
			this._playEvents=events;
			if (!events)return;
			if (this._tar){
				this._setPlayActions(this._tar,events,"play");
			}
		});

		/**
		*???????????????????????????
		*@param tar
		*
		*/
		__getset(0,__proto,'target',null,function(tar){
			if (this._tar){
				this._setPlayActions(this._tar,this._playEvents,"play",false);
				this._setPlayActions(this._tar,this._stopEvents,"stop",false);
			}
			this._tar=tar;
			if (this._tar){
				this._setPlayActions(this._tar,this._playEvents,"play",true);
				this._setPlayActions(this._tar,this._stopEvents,"stop",true);
			}
		});

		/**
		*???????????????????????????
		*@param events
		*
		*/
		__getset(0,__proto,'stopEvent',null,function(events){
			this._stopEvents=events;
			if (!events)return;
			if (this._tar){
				this._setPlayActions(this._tar,events,"stop");
			}
		});

		return SoundNode;
	})(Sprite)


	//class laya.scene.Scene2D extends laya.display.Sprite
	var Scene2D=(function(_super){
		function Scene2D(){
			Scene2D.__super.call(this);
			this.createChildren();
		}

		__class(Scene2D,'laya.scene.Scene2D',_super);
		var __proto=Scene2D.prototype;
		/**
		*<p>?????????????????????????????????</p>
		*@internal ???????????????????????????????????????????????????
		*/
		__proto.createChildren=function(){}
		__proto.createView=function(sceneData){
			ClassUtils.createByJson(sceneData,this,this);
		}

		return Scene2D;
	})(Sprite)


	/**
	*@private
	*<code>FileBitmap</code> ???????????????????????????
	*/
	//class laya.resource.FileBitmap extends laya.resource.Bitmap
	var FileBitmap=(function(_super){
		function FileBitmap(){
			this._src=null;
			this._onload=null;
			this._onerror=null;
			FileBitmap.__super.call(this);
		}

		__class(FileBitmap,'laya.resource.FileBitmap',_super);
		var __proto=FileBitmap.prototype;
		/**
		*?????????????????????
		*/
		__getset(0,__proto,'src',function(){
			return this._src;
			},function(value){
			this._src=value;
		});

		/**
		*???????????????????????????
		*/
		__getset(0,__proto,'onload',null,function(value){
		});

		/**
		*?????????????????????
		*/
		__getset(0,__proto,'onerror',null,function(value){
		});

		return FileBitmap;
	})(Bitmap)


	/**
	*<code>HTMLCanvas</code> ??? Html Canvas ???????????????????????? Canvas ????????????????????????????????????????????? new HTMLCanvas???
	*/
	//class laya.resource.HTMLCanvas extends laya.resource.Bitmap
	var HTMLCanvas=(function(_super){
		function HTMLCanvas(type,canvas){
			//this._ctx=null;
			this._is2D=false;
			HTMLCanvas.__super.call(this);
			var _$this=this;
			this._source=this;
			if (type==="2D" || (type==="AUTO" && !Render.isWebGL)){
				this._is2D=true;
				this._source=canvas || Browser.createElement("canvas");
				var o=this;
				o.getContext=function (contextID,other){
					if (_$this._ctx)return _$this._ctx;
					var ctx=_$this._ctx=_$this._source.getContext(contextID,other);
					if (ctx){
						ctx._canvas=o;
						if(!Render.isFlash)ctx.size=function (w,h){
						};
					}
					return ctx;
				}
			}
			else this._source={};
		}

		__class(HTMLCanvas,'laya.resource.HTMLCanvas',_super);
		var __proto=HTMLCanvas.prototype;
		/**
		*?????????????????????
		*/
		__proto.clear=function(){
			this._ctx && this._ctx.clear();
		}

		/**
		*?????????
		*/
		__proto.destroy=function(){
			this._ctx && this._ctx.destroy();
			this._ctx=null;
		}

		/**
		*?????????
		*/
		__proto.release=function(){}
		/**
		*@private
		*?????? Canvas ??????????????????
		*@param context Canvas ??????????????????
		*/
		__proto._setContext=function(context){
			this._ctx=context;
		}

		/**
		*?????? Canvas ??????????????????
		*@param contextID ?????????ID.
		*@param other
		*@return Canvas ??????????????? Context ?????????
		*/
		__proto.getContext=function(contextID,other){
			return this._ctx ? this._ctx :(this._ctx=HTMLCanvas._createContext(this));
		}

		/**
		*?????????????????????
		*@return ???????????????
		*/
		__proto.getMemSize=function(){
			return 0;
		}

		/**
		*???????????????
		*@param w ?????????
		*@param h ?????????
		*/
		__proto.size=function(w,h){
			if (this._w !=w || this._h !=h){
				this._w=w;
				this._h=h;
				this._ctx && this._ctx.size(w,h);
				this._source && (this._source.height=h,this._source.width=w);
			}
		}

		/**
		*Canvas ??????????????????
		*/
		__getset(0,__proto,'context',function(){
			return this._ctx;
		});

		/**
		*???????????? Bitmap ?????????
		*/
		__getset(0,__proto,'asBitmap',null,function(value){
		});

		HTMLCanvas.create=function(type,canvas){
			return new HTMLCanvas(type,canvas);
		}

		HTMLCanvas.TYPE2D="2D";
		HTMLCanvas.TYPE3D="3D";
		HTMLCanvas.TYPEAUTO="AUTO";
		HTMLCanvas._createContext=null
		return HTMLCanvas;
	})(Bitmap)


	/**
	*@private
	*/
	//class laya.resource.HTMLSubImage extends laya.resource.Bitmap
	var HTMLSubImage=(function(_super){
		//?????????????????????new HTMLSubImage
		function HTMLSubImage(canvas,offsetX,offsetY,width,height,atlasImage,src,allowMerageInAtlas){
			HTMLSubImage.__super.call(this);
			throw new Error("?????????new???");
		}

		__class(HTMLSubImage,'laya.resource.HTMLSubImage',_super);
		HTMLSubImage.create=function(canvas,offsetX,offsetY,width,height,atlasImage,src,allowMerageInAtlas){
			(allowMerageInAtlas===void 0)&& (allowMerageInAtlas=false);
			return new HTMLSubImage(canvas,offsetX,offsetY,width,height,atlasImage,src,allowMerageInAtlas);
		}

		return HTMLSubImage;
	})(Bitmap)


	/**
	*<p> <code>Animation</code> ??????????????????,???????????????????????????</p>
	*<p> <code>Animation</code> ???????????????????????????????????????????????????????????????????????????</p>
	*@example ???????????????????????????????????? <code>Text</code> ?????????
	*<listing version="3.0">
	*package
	*{
		*import laya.display.Animation;
		*import laya.net.Loader;
		*import laya.utils.Handler;
		*public class Animation_Example
		*{
			*public function Animation_Example()
			*{
				*Laya.init(640,800);//??????????????????????????????????????????
				*Laya.stage.bgColor="#efefef";//??????????????????????????????
				*init();//?????????
				*}
			*private function init():void
			*{
				*var animation:Animation=new Animation();//???????????? Animation ?????????????????? animation ???
				*animation.loadAtlas("resource/ani/fighter.json");//?????????????????????
				*animation.x=200;//?????? animation ??????????????? x ????????????????????? animation ????????????????????????
				*animation.y=200;//?????? animation ??????????????? x ????????????????????? animation ????????????????????????
				*animation.interval=50;//?????? animation ??????????????????????????????????????????????????????
				*animation.play();//???????????????
				*Laya.stage.addChild(animation);//??? animation ??????????????????????????????
				*}
			*}
		*}
	*</listing>
	*<listing version="3.0">
	*Animation_Example();
	*function Animation_Example(){
		*Laya.init(640,800);//??????????????????????????????????????????
		*Laya.stage.bgColor="#efefef";//??????????????????????????????
		*init();//?????????
		*}
	*function init()
	*{
		*var animation=new Laya.Animation();//???????????? Animation ?????????????????? animation ???
		*animation.loadAtlas("resource/ani/fighter.json");//?????????????????????
		*animation.x=200;//?????? animation ??????????????? x ????????????????????? animation ????????????????????????
		*animation.y=200;//?????? animation ??????????????? x ????????????????????? animation ????????????????????????
		*animation.interval=50;//?????? animation ??????????????????????????????????????????????????????
		*animation.play();//???????????????
		*Laya.stage.addChild(animation);//??? animation ??????????????????????????????
		*}
	*</listing>
	*<listing version="3.0">
	*import Animation=laya.display.Animation;
	*class Animation_Example {
		*constructor(){
			*Laya.init(640,800);//??????????????????????????????????????????
			*Laya.stage.bgColor="#efefef";//??????????????????????????????
			*this.init();
			*}
		*private init():void {
			*var animation:Animation=new Laya.Animation();//???????????? Animation ?????????????????? animation ???
			*animation.loadAtlas("resource/ani/fighter.json");//?????????????????????
			*animation.x=200;//?????? animation ??????????????? x ????????????????????? animation ????????????????????????
			*animation.y=200;//?????? animation ??????????????? x ????????????????????? animation ????????????????????????
			*animation.interval=50;//?????? animation ??????????????????????????????????????????????????????
			*animation.play();//???????????????
			*Laya.stage.addChild(animation);//??? animation ??????????????????????????????
			*}
		*}
	*new Animation_Example();
	*</listing>
	*/
	//class laya.display.Animation extends laya.display.AnimationPlayerBase
	var Animation=(function(_super){
		function Animation(){
			this._frames=null;
			this._url=null;
			Animation.__super.call(this);
			this._setControlNode(this);
		}

		__class(Animation,'laya.display.Animation',_super);
		var __proto=Animation.prototype;
		/**@inheritDoc */
		__proto.destroy=function(destroyChild){
			(destroyChild===void 0)&& (destroyChild=true);
			this.stop();
			laya.display.Sprite.prototype.destroy.call(this,destroyChild);
			this._frames=null;
			this._labels=null;
		}

		/**
		*???????????????
		*@param start ??????????????????????????????label???
		*@param loop ???????????????
		*@param name ??????name??????(??????)???????????????????????????????????????????????????????????????????????????????????????
		*/
		__proto.play=function(start,loop,name){
			(start===void 0)&& (start=0);
			(loop===void 0)&& (loop=true);
			(name===void 0)&& (name="");
			if (name)this._setFramesFromCache(name);
			this._isPlaying=true;
			this.index=((typeof start=='string'))? this._getFrameByLabel(start):start;
			this.loop=loop;
			this._actionName=name;
			this._isReverse=this.wrapMode==1;
			if (this._frames && this.interval > 0){
				this.timerLoop(this.interval,this,this._frameLoop,null,true);
			}
		}

		__proto._setFramesFromCache=function(name){
			if (this._url)name=this._url+"#"+name;
			if (name && Animation.framesMap[name]){
				this._frames=Animation.framesMap[name];
				this._count=this._frames.length;
				if (!this._frameRateChanged && Animation.framesMap[name+"$len"])this._interval=Animation.framesMap[name+"$len"];
				return true;
			}
			return false;
		}

		__proto._frameLoop=function(){
			if (this._style.visible && this._style.alpha > 0.01){
				_super.prototype._frameLoop.call(this);
			}
		}

		__proto._displayToIndex=function(value){
			if (this._frames)this.graphics=this._frames[value];
		}

		/**??????????????????????????????*/
		__proto.clear=function(){
			this.stop();
			this.graphics=null;
			this._frames=null;
			this._labels=null;
		}

		/**
		*????????????????????????????????????
		*@param urls ???????????????????????????[url1,url2,url3,...]???
		*@param cacheName ???????????????????????????????????????????????????play??????????????????????????????????????????????????????????????????
		*@return ?????????????????????
		*/
		__proto.loadImages=function(urls,cacheName){
			(cacheName===void 0)&& (cacheName="");
			this._url="";
			if (!this._setFramesFromCache(cacheName)){
				this.frames=Animation.framesMap[cacheName] ? Animation.framesMap[cacheName] :Animation.createFrames(urls,cacheName);
			}
			return this;
		}

		/**
		*??????????????????????????????
		*@param url ???????????????
		*@param loaded ??????????????????
		*@param cacheName ???????????????????????????????????????????????????play??????????????????????????????????????????????????????????????????
		*@return ?????????????????????
		*/
		__proto.loadAtlas=function(url,loaded,cacheName){
			(cacheName===void 0)&& (cacheName="");
			this._url="";
			var _this=this;
			if (!_this._setFramesFromCache(cacheName)){
				function onLoaded (loadUrl){
					if (url===loadUrl){
						_this.frames=Animation.framesMap[cacheName] ? Animation.framesMap[cacheName] :Animation.createFrames(url,cacheName);
						if (loaded)loaded.run();
					}
				}
				if (Loader.getAtlas(url))onLoaded(url);
				else Laya.loader.load(url,Handler.create(null,onLoaded,[url]),null,/*laya.net.Loader.ATLAS*/"atlas");
			}
			return this;
		}

		/**
		*????????????????????????IDE???????????????????????????????????????IDE???????????????
		*@param url ???????????????
		*@param loaded ??????????????????
		*@return ?????????????????????
		*/
		__proto.loadAnimation=function(url,loaded){
			this._url=url;
			var _this=this;
			if (!_this._setFramesFromCache("")){
				function onLoaded (loadUrl){
					if (url===loadUrl){
						if (!Animation.framesMap[url+"#"]){
							var aniData=_this._parseGraphicAnimation(Loader.getRes(url));
							if (!aniData)return;
							var obj=aniData.animationDic;
							var flag=true;
							for (var name in obj){
								var info=obj[name];
								if (info.frames.length){
									Animation.framesMap[url+"#"+name]=info.frames;
									Animation.framesMap[url+"#"+name+"$len"]=info.interval;
									}else {
									flag=false;
								}
							}
							if(!_this._frameRateChanged)_this._interval=aniData.animationList[0].interval;
							_this.frames=aniData.animationList[0].frames;
							if (flag){
								Animation.framesMap[url+"#$len"]=aniData.animationList[0].interval;
								Animation.framesMap[url+"#"]=_this.frames;
							}
							}else {
							if(!_this._frameRateChanged)_this._interval=Animation.framesMap[url+"#$len"];
							_this.frames=Animation.framesMap[url+"#"];
						}
						if (loaded)loaded.run();
					}
				}
				if (Loader.getRes(url))onLoaded(url);
				else Laya.loader.load(url,Handler.create(null,onLoaded,[url]),null,/*laya.net.Loader.JSON*/"json");
				Loader.clearRes(url);
			}
			return this;
		}

		/**@private */
		__proto._parseGraphicAnimation=function(animationData){
			return GraphicAnimation.parseAnimationData(animationData)
		}

		/**Graphics??????*/
		__getset(0,__proto,'frames',function(){
			return this._frames;
			},function(value){
			this._frames=value;
			if (value){
				this._count=value.length;
				if (this._isPlaying)this.play(this._index,this.loop,this._actionName);
				else this.index=this._index;
			}
		});

		/**??????????????????*/
		__getset(0,__proto,'autoPlay',null,function(value){
			if (value)this.play();
			else this.stop();
		});

		/**??????????????????????????????*/
		__getset(0,__proto,'source',null,function(value){
			if (value.indexOf(".ani")>-1)this.loadAnimation(value);
			else if (value.indexOf(".json")>-1 || value.indexOf("als")>-1)this.loadAtlas(value);
			else this.loadImages(value.split(","));
		});

		Animation.createFrames=function(url,name){
			var arr;
			if ((typeof url=='string')){
				var atlas=Loader.getAtlas(url);
				if (atlas && atlas.length){
					arr=[];
					for (var i=0,n=atlas.length;i < n;i++){
						var g=new Graphics();
						g.drawTexture(Loader.getRes(atlas[i]),0,0);
						arr.push(g);
					}
				}
				}else if ((url instanceof Array)){
				arr=[];
				for (i=0,n=url.length;i < n;i++){
					g=new Graphics();
					g.loadImage(url[i],0,0);
					arr.push(g);
				}
			}
			if (name)Animation.framesMap[name]=arr;
			return arr;
		}

		Animation.clearCache=function(key){
			var cache=Animation.framesMap;
			var val;
			var key2=key+"#";
			for (val in cache){
				if (val===key || val.indexOf(key2)==0){
					delete Animation.framesMap[val];
				}
			}
		}

		Animation.framesMap={};
		return Animation;
	})(AnimationPlayerBase)


	/**
	*????????????????????????
	*
	*/
	//class laya.display.FrameAnimation extends laya.display.AnimationPlayerBase
	var FrameAnimation=(function(_super){
		function FrameAnimation(){
			this._targetDic=null;
			this._animationData=null;
			FrameAnimation.__super.call(this);
			if(FrameAnimation._sortIndexFun==null){
				FrameAnimation._sortIndexFun=MathUtil.sortByKey("index",false,true);
			}
		}

		__class(FrameAnimation,'laya.display.FrameAnimation',_super);
		var __proto=FrameAnimation.prototype;
		/**
		*@private
		*?????????????????????
		*@param targetDic ?????????
		*@param animationData ????????????
		*
		*/
		__proto._setUp=function(targetDic,animationData){
			this._labels=null;
			this._targetDic=targetDic;
			this._animationData=animationData;
			this.interval=1000 / animationData.frameRate;
			if (animationData.parsed){
				this._count=animationData.count;
				}else{
				this._calculateDatas();
			}
			animationData.parsed=true;
			animationData.count=this._count;
		}

		/**@inheritDoc */
		__proto.clear=function(){
			_super.prototype.clear.call(this);
			this._targetDic=null;
			this._animationData=null;
		}

		/**@inheritDoc */
		__proto._displayToIndex=function(value){
			if(!this._animationData)return;
			if(value<0)value=0;
			if(value>this._count)value=this._count;
			var nodes=this._animationData.nodes,i=0,len=nodes.length;
			for(i=0;i<len;i++){
				this._displayNodeToFrame(nodes[i],value);
			}
		}

		/**
		*@private
		*????????????????????????????????????
		*@param node ??????ID
		*@param frame
		*@param targetDic ?????????
		*
		*/
		__proto._displayNodeToFrame=function(node,frame,targetDic){
			if(!targetDic)targetDic=this._targetDic;
			var target=targetDic[node.target];
			if(!target){
				return;
			};
			var frames=node.frames,key,propFrames,value;
			var keys=node.keys,i=0,len=keys.length;
			for(i=0;i<len;i++){
				key=keys[i];
				propFrames=frames[key];
				if(propFrames.length>frame){
					value=propFrames[frame];
					}else{
					value=propFrames[propFrames.length-1];
				}
				target[key]=value;
			}
		}

		/**
		*@private
		*???????????????
		*
		*/
		__proto._calculateDatas=function(){
			if(!this._animationData)return;
			var nodes=this._animationData.nodes,i=0,len=nodes.length,tNode;
			this._count=0;
			for(i=0;i<len;i++){
				tNode=nodes[i];
				this._calculateNodeKeyFrames(tNode);
			}
			this._count+=1;
		}

		/**
		*@private
		*??????????????????????????????
		*@param node
		*
		*/
		__proto._calculateNodeKeyFrames=function(node){
			var keyFrames=node.keyframes,key,tKeyFrames,target=node.target;
			if(!node.frames){
				node.frames={};
			}
			if(!node.keys){
				node.keys=[];
				}else{
				node.keys.length=0;
			}
			for(key in keyFrames){
				tKeyFrames=keyFrames[key];
				if(!node.frames[key]){
					node.frames[key]=[];
				}
				tKeyFrames.sort(FrameAnimation._sortIndexFun);
				node.keys.push(key);
				this._calculateNodePropFrames(tKeyFrames,node.frames[key],key,target);
			}
		}

		/**
		*@private
		*????????????????????????????????????
		*@param keyframes
		*@param frames
		*@param key
		*@param target
		*
		*/
		__proto._calculateNodePropFrames=function(keyframes,frames,key,target){
			var i=0,len=keyframes.length-1;
			frames.length=keyframes[len].index+1;
			for(i=0;i<len;i++){
				this._dealKeyFrame(keyframes[i]);
				this._calculateFrameValues(keyframes[i],keyframes[i+1],frames);
			}
			if(len==0){
				frames[0]=keyframes[0].value;
			}
			this._dealKeyFrame(keyframes[i]);
		}

		/**
		*@private
		*
		*/
		__proto._dealKeyFrame=function(keyFrame){
			if (keyFrame.label&&keyFrame.label !="")this.addLabel(keyFrame.label,keyFrame.index);
		}

		/**
		*@private
		*???????????????????????????????????????
		*@param startFrame
		*@param endFrame
		*@param result
		*
		*/
		__proto._calculateFrameValues=function(startFrame,endFrame,result){
			var i=0,easeFun;
			var start=startFrame.index,end=endFrame.index;
			var startValue=startFrame.value;
			var dValue=endFrame.value-startFrame.value;
			var dLen=end-start;
			if(end>this._count)this._count=end;
			if(startFrame.tween){
				easeFun=Ease[startFrame.tweenMethod];
				if(easeFun==null){
					easeFun=Ease.linearNone;
				}
				for(i=start;i<end;i++){
					result[i]=easeFun(i-start,startValue,dValue,dLen);
				}
				}else{
				for(i=start;i<end;i++){
					result[i]=startValue;
				}
			}
			result[endFrame.index]=endFrame.value;
		}

		FrameAnimation._sortIndexFun=null
		return FrameAnimation;
	})(AnimationPlayerBase)


	/**
	*<p><code>Input</code> ??????????????????????????????????????????????????????</p>
	*/
	//class laya.display.Input extends laya.display.Text
	var Input=(function(_super){
		function Input(){
			this._focus=false;
			this._multiline=false;
			this._editable=true;
			this._restrictPattern=null;
			this._type="text";
			this._prompt='';
			this._promptColor="#A9A9A9";
			this._originColor="#000000";
			this._content='';
			Input.__super.call(this);
			this._maxChars=1E5;
			this._width=100;
			this._height=20;
			this.multiline=false;
			this.overflow=Text.SCROLL;
			this.on(/*laya.events.Event.MOUSE_DOWN*/"mousedown",this,this._onMouseDown);
			this.on(/*laya.events.Event.UNDISPLAY*/"undisplay",this,this._onUnDisplay);
		}

		__class(Input,'laya.display.Input',_super);
		var __proto=Input.prototype;
		/**
		*????????????????????????????????????
		*@param startIndex ?????????????????????
		*@param endIndex ?????????????????????
		*/
		__proto.setSelection=function(startIndex,endIndex){
			laya.display.Input.inputElement.selectionStart=startIndex;
			laya.display.Input.inputElement.selectionEnd=endIndex;
		}

		/**@private */
		__proto._onUnDisplay=function(e){
			this.focus=false;
		}

		/**@private */
		__proto._onMouseDown=function(e){
			this.focus=true;
			Laya.stage.on(/*laya.events.Event.MOUSE_DOWN*/"mousedown",this,this._checkBlur);
		}

		/**@private */
		__proto._checkBlur=function(e){
			if (e.nativeEvent.target !=laya.display.Input.input && e.nativeEvent.target !=laya.display.Input.area && e.target !=this)
				this.focus=false;
		}

		/**@inheritDoc*/
		__proto.render=function(context,x,y){
			laya.display.Sprite.prototype.render.call(this,context,x,y);
		}

		/**
		*???????????????????????? Input ??????????????????????????????????????????????????????????????????
		*/
		__proto._syncInputTransform=function(){
			var style=this.nativeInput.style;
			var stage=Laya.stage;
			var rec;
			rec=Utils.getGlobalPosAndScale(this);
			var m=stage._canvasTransform.clone();
			var tm=m.clone();
			tm.rotate(-Math.PI / 180 *Laya.stage.canvasDegree);
			tm.scale(Laya.stage.clientScaleX,Laya.stage.clientScaleY);
			var perpendicular=(Laya.stage.canvasDegree % 180 !=0);
			var sx=perpendicular ? tm.d :tm.a;
			var sy=perpendicular ? tm.a :tm.d;
			tm.destroy();
			var tx=this.padding[3];
			var ty=this.padding[0];
			if (Laya.stage.canvasDegree==0){
				tx+=rec.x;
				ty+=rec.y;
				tx *=sx;
				ty *=sy;
				tx+=m.tx;
				ty+=m.ty;
				}else if (Laya.stage.canvasDegree==90){
				tx+=rec.y;
				ty+=rec.x;
				tx *=sx;
				ty *=sy;
				tx=m.tx-tx;
				ty+=m.ty;
				}else{
				tx+=rec.y;
				ty+=rec.x;
				tx *=sx;
				ty *=sy;
				tx+=m.tx;
				ty=m.ty-ty;
			};
			var quarter=0.785;
			var r=Math.atan2(rec.height,rec.width)-quarter;
			var sin=Math.sin(r),cos=Math.cos(r);
			var tsx=cos *rec.width+sin *rec.height;
			var tsy=cos *rec.height-sin *rec.width;
			sx *=(perpendicular ? tsy :tsx);
			sy *=(perpendicular ? tsx :tsy);
			m.tx=0;
			m.ty=0;
			r *=180 / 3.1415;
			Input.inputContainer.style.transform="scale("+sx+","+sy+") rotate("+(Laya.stage.canvasDegree+r)+"deg)";
			Input.inputContainer.style.webkitTransform="scale("+sx+","+sy+") rotate("+(Laya.stage.canvasDegree+r)+"deg)";
			Input.inputContainer.setPos(tx,ty);
			m.destroy();
			var inputWid=this._width-this.padding[1]-this.padding[3];
			var inputHei=this._height-this.padding[0]-this.padding[2];
			this.nativeInput.setSize(inputWid,inputHei);
			if (Render.isConchApp){
				this.nativeInput.setPos(tx,ty);
				this.nativeInput.setScale(sx,sy);
			}
		}

		/**?????????????????????*/
		__proto.select=function(){
			this.nativeInput.select();
		}

		/**@private ??????????????????textarea???input???*/
		__proto._setInputMethod=function(){
			Input.input.parentElement && (Input.inputContainer.removeChild(Input.input));
			Input.area.parentElement && (Input.inputContainer.removeChild(Input.area));
			Input.inputElement=(this._multiline ? Input.area :Input.input);
			Input.inputContainer.appendChild(Input.inputElement);
		}

		/**@private */
		__proto._focusIn=function(){
			laya.display.Input.isInputting=true;
			var input=this.nativeInput;
			this._focus=true;
			var cssStyle=input.style;
			cssStyle.whiteSpace=(this.wordWrap ? "pre-wrap" :"nowrap");
			this._setPromptColor();
			input.readOnly=!this._editable;
			input.maxLength=this._maxChars;
			var padding=this.padding;
			input.type=this._type;
			input.value=this._content;
			input.placeholder=this._prompt;
			Laya.stage.off(/*laya.events.Event.KEY_DOWN*/"keydown",this,this._onKeyDown);
			Laya.stage.on(/*laya.events.Event.KEY_DOWN*/"keydown",this,this._onKeyDown);
			Laya.stage.focus=this;
			this.event(/*laya.events.Event.FOCUS*/"focus");
			if (Browser.onPC)input.focus();
			var temp=this._text;
			this._text=null;
			this.typeset();
			input.setColor(this._originColor);
			input.setFontSize(this.fontSize);
			input.setFontFace(this.font);
			if (Render.isConchApp){
				input.setMultiAble && input.setMultiAble(this._multiline);
			}
			cssStyle.lineHeight=(this.leading+this.fontSize)+"px";
			cssStyle.fontStyle=(this.italic ? "italic" :"normal");
			cssStyle.fontWeight=(this.bold ? "bold" :"normal");
			cssStyle.textAlign=this.align;
			cssStyle.padding="0 0";
			this._syncInputTransform();
			if (!Render.isConchApp && Browser.onPC)
				Laya.timer.frameLoop(1,this,this._syncInputTransform);
		}

		// ??????DOM???????????????????????????
		__proto._setPromptColor=function(){
			Input.promptStyleDOM=Browser.getElementById("promptStyle");
			if (!Input.promptStyleDOM){
				Input.promptStyleDOM=Browser.createElement("style");
				Browser.document.head.appendChild(Input.promptStyleDOM);
			}
			Input.promptStyleDOM.innerText="input::-webkit-input-placeholder, textarea::-webkit-input-placeholder {"+"color:"+this._promptColor+"}"+"input:-moz-placeholder, textarea:-moz-placeholder {"+"color:"+this._promptColor+"}"+"input::-moz-placeholder, textarea::-moz-placeholder {"+"color:"+this._promptColor+"}"+"input:-ms-input-placeholder, textarea:-ms-input-placeholder {"+"color:"+this._promptColor+"}";
		}

		/**@private */
		__proto._focusOut=function(){
			laya.display.Input.isInputting=false;
			this._focus=false;
			this._text=null;
			this._content=this.nativeInput.value;
			if (!this._content){
				_super.prototype._$set_text.call(this,this._prompt);
				_super.prototype._$set_color.call(this,this._promptColor);
				}else {
				_super.prototype._$set_text.call(this,this._content);
				_super.prototype._$set_color.call(this,this._originColor);
			}
			Laya.stage.off(/*laya.events.Event.KEY_DOWN*/"keydown",this,this._onKeyDown);
			Laya.stage.focus=null;
			this.event(/*laya.events.Event.BLUR*/"blur");
			if (Render.isConchApp)this.nativeInput.blur();
			Browser.onPC && Laya.timer.clear(this,this._syncInputTransform);
			Laya.stage.off(/*laya.events.Event.MOUSE_DOWN*/"mousedown",this,this._checkBlur);
		}

		/**@private */
		__proto._onKeyDown=function(e){
			if (e.keyCode===13){
				if (Browser.onMobile && !this._multiline)
					this.focus=false;
				this.event(/*laya.events.Event.ENTER*/"enter");
			}
		}

		__proto.changeText=function(text){
			this._content=text;
			if (this._focus){
				this.nativeInput.value=text || '';
				this.event(/*laya.events.Event.CHANGE*/"change");
			}else
			_super.prototype.changeText.call(this,text);
		}

		/**@inheritDoc */
		__getset(0,__proto,'color',_super.prototype._$get_color,function(value){
			if (this._focus)
				this.nativeInput.setColor(value);
			_super.prototype._$set_color.call(this,this._content?value:this._promptColor);
			this._originColor=value;
		});

		//[Deprecated]
		__getset(0,__proto,'inputElementYAdjuster',function(){
			console.warn("deprecated: ?????????????????????????????????????????????????????????????????????????????????inputElementYAdjuster????????????");
			return 0;
			},function(value){
			console.warn("deprecated: ?????????????????????????????????????????????????????????????????????????????????inputElementYAdjuster????????????");
		});

		/**?????????????????????????????????*/
		__getset(0,__proto,'multiline',function(){
			return this._multiline;
			},function(value){
			this._multiline=value;
			this.valign=value ? "top" :"middle";
		});

		/**
		*??????????????????????????????10000???
		*??????????????????????????????????????????0?????????????????????????????????10000???
		*/
		__getset(0,__proto,'maxChars',function(){
			return this._maxChars;
			},function(value){
			if (value <=0)
				value=1E5;
			this._maxChars=value;
		});

		/**@inheritDoc */
		__getset(0,__proto,'text',function(){
			if (this._focus)
				return this.nativeInput.value;
			else
			return this._content || "";
			},function(value){
			_super.prototype._$set_color.call(this,this._originColor);
			value+='';
			if (this._focus){
				this.nativeInput.value=value || '';
				this.event(/*laya.events.Event.CHANGE*/"change");
				}else {
				if (!this._multiline)
					value=value.replace(/\r?\n/g,'');
				this._content=value;
				if (value)
					_super.prototype._$set_text.call(this,value);
				else {
					_super.prototype._$set_text.call(this,this._prompt);
					_super.prototype._$set_color.call(this,this.promptColor);
				}
			}
		});

		/**
		*????????????????????????????????????
		*/
		__getset(0,__proto,'nativeInput',function(){
			return this._multiline ? Input.area :Input.input;
		});

		/**
		*????????????????????????
		*/
		__getset(0,__proto,'prompt',function(){
			return this._prompt;
			},function(value){
			if (!this._text && value)
				_super.prototype._$set_color.call(this,this._promptColor);
			this.promptColor=this._promptColor;
			if (this._text)
				_super.prototype._$set_text.call(this,(this._text==this._prompt)?value:this._text);
			else
			_super.prototype._$set_text.call(this,value);
			this._prompt=value;
		});

		// ?????? ??????focus??????????????????????????????????????????????????????
		/**
		*???????????????????????????????????????
		*/
		__getset(0,__proto,'focus',function(){
			return this._focus;
			},function(value){
			var input=this.nativeInput;
			if (this._focus!==value){
				if (value){
					input.target && (input.target.focus=false);
					input.target=this;
					this._setInputMethod();
					this._focusIn();
					}else {
					input.target=null;
					this._focusOut();
					input.blur();
					if (Render.isConchApp){
						input.setPos(-10000,-10000);
					}else if (Input.inputContainer.contains(input))
					Input.inputContainer.removeChild(input);
				}
			}
		});

		/**????????????????????????*/
		__getset(0,__proto,'restrict',function(){
			if (this._restrictPattern){
				return this._restrictPattern.source;
			}
			return "";
			},function(pattern){
			if (pattern){
				pattern="[^"+pattern+"]";
				if (pattern.indexOf("^^")>-1)
					pattern=pattern.replace("^^","");
				this._restrictPattern=new RegExp(pattern,"g");
			}else
			this._restrictPattern=null;
		});

		/**
		*??????????????????
		*/
		__getset(0,__proto,'editable',function(){
			return this._editable;
			},function(value){
			this._editable=value;
		});

		/**
		*??????????????????????????????
		*/
		__getset(0,__proto,'promptColor',function(){
			return this._promptColor;
			},function(value){
			this._promptColor=value;
			if (!this._content)_super.prototype._$set_color.call(this,value);
		});

		/**
		*??????????????????Input?????????????????????
		*?????????????????????http://www.w3school.com.cn/html5/html_5_form_input_types.asp???
		*/
		__getset(0,__proto,'type',function(){
			return this._type;
			},function(value){
			if (value=="password")
				this._getCSSStyle().password=true;
			else
			this._getCSSStyle().password=false;
			this._type=value;
		});

		//[Deprecated]
		__getset(0,__proto,'inputElementXAdjuster',function(){
			console.warn("deprecated: ?????????????????????????????????????????????????????????????????????????????????inputElementXAdjuster????????????");
			return 0;
			},function(value){
			console.warn("deprecated: ?????????????????????????????????????????????????????????????????????????????????inputElementXAdjuster????????????");
		});

		//[Deprecated(replacement="Input.type")]
		__getset(0,__proto,'asPassword',function(){
			return this._getCSSStyle().password;
			},function(value){
			this._getCSSStyle().password=value;
			this._type=/*CLASS CONST:laya.display.Input.TYPE_PASSWORD*/"password";
			console.warn("deprecated: ??????type=\"password\"????????????asPassword, asPassword?????????????????????????????????");
			this.isChanged=true;
		});

		Input.__init__=function(){
			Input._createInputElement();
			if (Browser.onMobile)
				Render.canvas.addEventListener(Input.IOS_IFRAME ? "click" :"touchend",Input._popupInputMethod);
		}

		Input._popupInputMethod=function(e){
			if (!laya.display.Input.isInputting)return;
			var input=laya.display.Input.inputElement;
			input.focus();
		}

		Input._createInputElement=function(){
			Input._initInput(Input.area=Browser.createElement("textarea"));
			Input._initInput(Input.input=Browser.createElement("input"));
			Input.inputContainer=Browser.createElement("div");
			Input.inputContainer.style.position="absolute";
			Input.inputContainer.style.zIndex=1E5;
			Browser.container.appendChild(Input.inputContainer);
			Input.inputContainer.setPos=function (x,y){Input.inputContainer.style.left=x+'px';Input.inputContainer.style.top=y+'px';};
		}

		Input._initInput=function(input){
			var style=input.style;
			style.cssText="position:absolute;overflow:hidden;resize:none;transform-origin:0 0;-webkit-transform-origin:0 0;-moz-transform-origin:0 0;-o-transform-origin:0 0;";
			style.resize='none';
			style.backgroundColor='transparent';
			style.border='none';
			style.outline='none';
			style.zIndex=1;
			input.addEventListener('input',Input._processInputting);
			input.addEventListener('mousemove',Input._stopEvent);
			input.addEventListener('mousedown',Input._stopEvent);
			input.addEventListener('touchmove',Input._stopEvent);
			if(!Render.isConchApp){
				input.setColor=function (color){input.style.color=color;};
				input.setFontSize=function (fontSize){input.style.fontSize=fontSize+'px';};
				input.setSize=function (w,h){input.style.width=w+'px';input.style.height=h+'px';};
			}
			input.setFontFace=function (fontFace){input.style.fontFamily=fontFace;};
		}

		Input._processInputting=function(e){
			var input=laya.display.Input.inputElement.target;
			if (!input)return;
			var value=laya.display.Input.inputElement.value;
			if (input._restrictPattern){
				value=value.replace(/\u2006|\x27/g,"");
				if (input._restrictPattern.test(value)){
					value=value.replace(input._restrictPattern,"");
					laya.display.Input.inputElement.value=value;
				}
			}
			input._text=value;
			input.event(/*laya.events.Event.INPUT*/"input");
		}

		Input._stopEvent=function(e){
			if (e.type=='touchmove')
				e.preventDefault();
			e.stopPropagation && e.stopPropagation();
		}

		Input.TYPE_TEXT="text";
		Input.TYPE_PASSWORD="password";
		Input.TYPE_EMAIL="email";
		Input.TYPE_URL="url";
		Input.TYPE_NUMBER="number";
		Input.TYPE_RANGE="range";
		Input.TYPE_DATE="date";
		Input.TYPE_MONTH="month";
		Input.TYPE_WEEK="week";
		Input.TYPE_TIME="time";
		Input.TYPE_DATE_TIME="datetime";
		Input.TYPE_DATE_TIME_LOCAL="datetime-local";
		Input.TYPE_SEARCH="search";
		Input.input=null
		Input.area=null
		Input.inputElement=null
		Input.inputContainer=null
		Input.confirmButton=null
		Input.promptStyleDOM=null
		Input.inputHeight=45;
		Input.isInputting=false;
		__static(Input,
		['IOS_IFRAME',function(){return this.IOS_IFRAME=(Browser.onIOS && Browser.window.top !=Browser.window.self);}
		]);
		return Input;
	})(Text)


	/**
	*<code>HTMLImage</code> ???????????? HTML Image ?????????
	*@private
	*/
	//class laya.resource.HTMLImage extends laya.resource.FileBitmap
	var HTMLImage=(function(_super){
		function HTMLImage(src,def){
			this._recreateLock=false;
			this._needReleaseAgain=false;
			HTMLImage.__super.call(this);
			this._init_(src,def);
		}

		__class(HTMLImage,'laya.resource.HTMLImage',_super);
		var __proto=HTMLImage.prototype;
		__proto._init_=function(src,def){
			this._src=src;
			this._source=new Browser.window.Image();
			if (def){
				def.onload && (this.onload=def.onload);
				def.onerror && (this.onerror=def.onerror);
				def.onCreate && def.onCreate(this);
			}
			if (src.indexOf("data:image")!=0)this._source.crossOrigin="";
			(src)&& (this._source.src=src);
		}

		/**
		*@inheritDoc
		*/
		__proto.recreateResource=function(){
			var _$this=this;
			if (this._src==="")
				throw new Error("src no null???");
			this._needReleaseAgain=false;
			if (!this._source){
				this._recreateLock=true;
				this.startCreate();
				var _this=this;
				this._source=new Browser.window.Image();
				this._source.crossOrigin="";
				this._source.onload=function (){
					if (_this._needReleaseAgain){
						_this._needReleaseAgain=false;
						_this._source.onload=null;
						_this._source=null;
						return;
					}
					_this._source.onload=null;
					_this.memorySize=_$this._w *_$this._h *4;
					_this._recreateLock=false;
					_this.completeCreate();
				};
				this._source.src=this._src;
				}else {
				if (this._recreateLock)
					return;
				this.startCreate();
				this.memorySize=this._w *this._h *4;
				this._recreateLock=false;
				this.completeCreate();
			}
		}

		/**
		*@inheritDoc
		*/
		__proto.detoryResource=function(){
			if (this._recreateLock)
				this._needReleaseAgain=true;
			(this._source)&& (this._source=null,this.memorySize=0);
		}

		/***???????????????*/
		__proto.onresize=function(){
			this._w=this._source.width;
			this._h=this._source.height;
		}

		/**
		*@inheritDoc
		*/
		__getset(0,__proto,'onload',null,function(value){
			var _$this=this;
			this._onload=value;
			this._source && (this._source.onload=this._onload !=null ? (function(){
				_$this.onresize();
				_$this._onload();
			}):null);
		});

		/**
		*@inheritDoc
		*/
		__getset(0,__proto,'onerror',null,function(value){
			var _$this=this;
			this._onerror=value;
			this._source && (this._source.onerror=this._onerror !=null ? (function(){
				_$this._onerror()
			}):null);
		});

		HTMLImage.create=function(src,def){
			return new HTMLImage(src,def);
		}

		return HTMLImage;
	})(FileBitmap)


	/**
	*@private
	*/
	//class laya.display.GraphicAnimation extends laya.display.FrameAnimation
	var GraphicAnimation=(function(_super){
		function GraphicAnimation(){
			this.animationList=null;
			this.animationDic=null;
			this._nodeList=null;
			this._nodeDefaultProps=null;
			this._gList=null;
			this._nodeIDAniDic={};
			GraphicAnimation.__super.call(this);
		}

		__class(GraphicAnimation,'laya.display.GraphicAnimation',_super);
		var __proto=GraphicAnimation.prototype;
		/**
		*@private
		*/
		__proto._parseNodeList=function(uiView){
			if (!this._nodeList){
				this._nodeList=[];
			}
			this._nodeDefaultProps[uiView.compId]=uiView.props;
			if (uiView.compId)
				this._nodeList.push(uiView.compId);
			var childs=uiView.child;
			if (childs){
				var i=0,len=childs.length;
				for (i=0;i < len;i++){
					this._parseNodeList(childs[i]);
				}
			}
		}

		/**
		*@private
		*/
		__proto._calGraphicData=function(aniData){
			this._setUp(null,aniData);
			this._createGraphicData();
		}

		/**
		*@private
		*/
		__proto._createGraphicData=function(){
			var gList=[];
			var i=0,len=this.count;
			for (i=0;i < len;i++){
				gList.push(this._createFrameGraphic(i));
			}
			this._gList=gList;
		}

		/**
		*@private
		*/
		__proto._createFrameGraphic=function(frame){
			var g=new Graphics();
			var i=0,len=this._nodeList.length;
			var tNode=0;
			for (i=0;i < len;i++){
				tNode=this._nodeList[i];
				this._addNodeGraphic(tNode,g,frame);
			}
			return g;
		}

		/**
		*@private
		*/
		__proto._calculateNodeKeyFrames=function(node){
			_super.prototype._calculateNodeKeyFrames.call(this,node);
			this._nodeIDAniDic[node.target]=node;
		}

		/**
		*@private
		*/
		__proto.getNodeDataByID=function(nodeID){
			return this._nodeIDAniDic[nodeID];
		}

		/**
		*@private
		*/
		__proto._getParams=function(obj,params,frame,obj2){
			var rst=GraphicAnimation._temParam;
			rst.length=params.length;
			var i=0,len=params.length;
			for (i=0;i < len;i++){
				rst[i]=this._getObjVar(obj,params[i][0],frame,params[i][1],obj2);
			}
			return rst;
		}

		/**
		*@private
		*/
		__proto._getObjVar=function(obj,key,frame,noValue,obj2){
			if (obj.hasOwnProperty(key)){
				var vArr=obj[key];
				if (frame >=vArr.length)
					frame=vArr.length-1;
				return obj[key][frame];
			}
			if (obj2.hasOwnProperty(key)){
				return obj2[key];
			}
			return noValue;
		}

		/**
		*@private
		*/
		__proto._addNodeGraphic=function(nodeID,g,frame){
			var node=this.getNodeDataByID(nodeID);
			if (!node)
				return;
			var frameData=node.frames;
			var params=this._getParams(frameData,GraphicAnimation._drawTextureCmd,frame,this._nodeDefaultProps[nodeID]);
			var url=params[0];
			if (!url)return;
			params[0]=this._getTextureByUrl(url);
			if (!params[0]){
				console.log("lost:",url);
				throw new Error("texture not loaded:"+url);
				return;
			};
			var m;
			var px=params[5],py=params[6];
			if (px !=0 || py !=0){
				m=m || new Matrix();
				m.translate(-px,-py);
			};
			var sx=params[7],sy=params[8];
			var rotate=params[9];
			if (sx !=1 || sy !=1 || rotate !=0){
				m=m || new Matrix();
				m.scale(sx,sy);
				m.rotate(rotate *0.0174532922222222);
			}
			if (m){
				m.translate(params[1],params[2]);
				params[1]=params[2]=0;
			}
			g.drawTexture(params[0],params[1],params[2],params[3],params[4],m,params[10]);
		}

		/**
		*@private
		*/
		__proto._getTextureByUrl=function(url){
			return Loader.getRes(url);
		}

		/**
		*@private
		*/
		__proto.setAniData=function(uiView){
			if (uiView.animations){
				this._nodeDefaultProps={};
				if (this._nodeList)this._nodeList.length=0;
				this._parseNodeList(uiView);
				var aniDic={};
				var anilist=[];
				var animations=uiView.animations;
				var i=0,len=animations.length;
				var tAniO;
				for (i=0;i < len;i++){
					tAniO=animations[i];
					if (!tAniO)continue ;
					try{
						this._calGraphicData(tAniO);
						}catch (e){
						console.log("parse animation fail:"+tAniO.name+",empty animation created");
						this._gList=[];
					};
					var frameO={};
					frameO.interval=1000 / tAniO["frameRate"];
					frameO.frames=this._gList;
					anilist.push(frameO);
					aniDic[tAniO.name]=frameO;
				}
				this.animationList=anilist;
				this.animationDic=aniDic;
			}
			GraphicAnimation._temParam.length=0;
		}

		/**
		*@private
		*/
		__proto._clear=function(){
			this.animationList=null;
			this.animationDic=null;
			this._gList=null;
		}

		GraphicAnimation.parseAnimationData=function(aniData){
			if (!GraphicAnimation._I)
				GraphicAnimation._I=new GraphicAnimation();
			GraphicAnimation._I.setAniData(aniData);
			var rst;
			rst={};
			rst.animationList=GraphicAnimation._I.animationList;
			rst.animationDic=GraphicAnimation._I.animationDic;
			GraphicAnimation._I._clear();
			return rst;
		}

		GraphicAnimation._temParam=[];
		GraphicAnimation._I=null
		__static(GraphicAnimation,
		['_drawTextureCmd',function(){return this._drawTextureCmd=[["skin",null],["x",0],["y",0],["width",0],["height",0],["pivotX",0],["pivotY",0],["scaleX",1],["scaleY",1],["rotation",0],["alpha",1]];}
		]);
		return GraphicAnimation;
	})(FrameAnimation)


	Laya.__init([EventDispatcher,LoaderManager,Render,Browser,Timer,LocalStorage,TimeLine]);
})(window,document,Laya);

(function(window,document,Laya){
	var __un=Laya.un,__uns=Laya.uns,__static=Laya.static,__class=Laya.class,__getset=Laya.getset,__newvec=Laya.__newvec;

	var Arith=laya.maths.Arith,Bezier=laya.maths.Bezier,Bitmap=laya.resource.Bitmap,Browser=laya.utils.Browser;
	var Color=laya.utils.Color,ColorFilter=laya.filters.ColorFilter,Config=Laya.Config,Context=laya.resource.Context;
	var Event=laya.events.Event,Filter=laya.filters.Filter,Graphics=laya.display.Graphics,HTMLCanvas=laya.resource.HTMLCanvas;
	var HTMLChar=laya.utils.HTMLChar,HTMLImage=laya.resource.HTMLImage,Handler=laya.utils.Handler,Matrix=laya.maths.Matrix;
	var Point=laya.maths.Point,Rectangle=laya.maths.Rectangle,Render=laya.renders.Render,RenderContext=laya.renders.RenderContext;
	var RenderSprite=laya.renders.RenderSprite,Resource=laya.resource.Resource,ResourceManager=laya.resource.ResourceManager;
	var RunDriver=laya.utils.RunDriver,Sprite=laya.display.Sprite,Stat=laya.utils.Stat,StringKey=laya.utils.StringKey;
	var Style=laya.display.css.Style,System=laya.system.System,Texture=laya.resource.Texture,Utils=laya.utils.Utils;
	var VectorGraphManager=laya.utils.VectorGraphManager,WordText=laya.utils.WordText;
	Laya.interface('laya.webgl.shapes.IShape');
	Laya.interface('laya.webgl.submit.ISubmit');
	Laya.interface('laya.webgl.text.ICharSegment');
	Laya.interface('laya.webgl.canvas.save.ISaveData');
	Laya.interface('laya.webgl.resource.IMergeAtlasBitmap');
	Laya.interface('laya.filters.IFilterActionGL','laya.filters.IFilterAction');
	//class LayaMain
	var LayaMain=(function(){
		/*[COMPILER OPTIONS:normal]*/
		function LayaMain(){}
		__class(LayaMain,'LayaMain');
		return LayaMain;
	})()


	//class laya.filters.webgl.FilterActionGL
	var FilterActionGL=(function(){
		function FilterActionGL(){}
		__class(FilterActionGL,'laya.filters.webgl.FilterActionGL');
		var __proto=FilterActionGL.prototype;
		Laya.imps(__proto,{"laya.filters.IFilterActionGL":true})
		__proto.setValue=function(shader){}
		__proto.setValueMix=function(shader){}
		__proto.apply3d=function(scope,sprite,context,x,y){return null;}
		__proto.apply=function(srcCanvas){return null;}
		__getset(0,__proto,'typeMix',function(){
			return 0;
		});

		return FilterActionGL;
	})()


	//class laya.webgl.shader.ShaderValue
	var ShaderValue=(function(){
		function ShaderValue(){}
		__class(ShaderValue,'laya.webgl.shader.ShaderValue');
		return ShaderValue;
	})()


	//class laya.webgl.atlas.AtlasGrid
	var AtlasGrid=(function(){
		var TexRowInfo,TexMergeTexSize;
		function AtlasGrid(width,height,atlasID){
			this._atlasID=0;
			this._width=0;
			this._height=0;
			this._texCount=0;
			this._rowInfo=null;
			this._cells=null;
			this._failSize=new TexMergeTexSize();
			(width===void 0)&& (width=0);
			(height===void 0)&& (height=0);
			(atlasID===void 0)&& (atlasID=0);
			this._cells=null;
			this._rowInfo=null;
			this._init(width,height);
			this._atlasID=atlasID;
		}

		__class(AtlasGrid,'laya.webgl.atlas.AtlasGrid');
		var __proto=AtlasGrid.prototype;
		//------------------------------------------------------------------------------
		__proto.getAltasID=function(){
			return this._atlasID;
		}

		//------------------------------------------------------------------------------
		__proto.setAltasID=function(atlasID){
			if (atlasID >=0){
				this._atlasID=atlasID;
			}
		}

		//------------------------------------------------------------------
		__proto.addTex=function(type,width,height){
			var result=this._get(width,height);
			if (result.ret==false){
				return result;
			}
			this._fill(result.x,result.y,width,height,type);
			this._texCount++;
			return result;
		}

		//------------------------------------------------------------------------------
		__proto._release=function(){
			if (this._cells !=null){
				this._cells.length=0;
				this._cells=null;
			}
			if (this._rowInfo){
				this._rowInfo.length=0;
				this._rowInfo=null;
			}
		}

		//------------------------------------------------------------------------------
		__proto._init=function(width,height){
			this._width=width;
			this._height=height;
			this._release();
			if (this._width==0)return false;
			this._cells=new Uint8Array(this._width *this._height*3);
			this._rowInfo=__newvec(this._height);
			for (var i=0;i < this._height;i++){
				this._rowInfo[i]=new TexRowInfo();
			}
			this._clear();
			return true;
		}

		//------------------------------------------------------------------
		__proto._get=function(width,height){
			var pFillInfo=new MergeFillInfo();
			if (width >=this._failSize.width && height >=this._failSize.height){
				return pFillInfo;
			};
			var rx=-1;
			var ry=-1;
			var nWidth=this._width;
			var nHeight=this._height;
			var pCellBox=this._cells;
			for (var y=0;y < nHeight;y++){
				if (this._rowInfo[y].spaceCount < width)continue ;
				for (var x=0;x < nWidth;){
					var tm=(y *nWidth+x)*3;
					if (pCellBox[tm] !=0 || pCellBox[tm+1] < width || pCellBox[tm+2] < height){
						x+=pCellBox[tm+1];
						continue ;
					}
					rx=x;
					ry=y;
					for (var xx=0;xx < width;xx++){
						if (pCellBox[3*xx+tm+2] < height){
							rx=-1;
							break ;
						}
					}
					if (rx < 0){
						x+=pCellBox[tm+1];
						continue ;
					}
					pFillInfo.ret=true;
					pFillInfo.x=rx;
					pFillInfo.y=ry;
					return pFillInfo;
				}
			}
			return pFillInfo;
		}

		//------------------------------------------------------------------
		__proto._fill=function(x,y,w,h,type){
			var nWidth=this._width;
			var nHeghit=this._height;
			this._check((x+w)<=nWidth && (y+h)<=nHeghit);
			for (var yy=y;yy < (h+y);++yy){
				this._check(this._rowInfo[yy].spaceCount >=w);
				this._rowInfo[yy].spaceCount-=w;
				for (var xx=0;xx < w;xx++){
					var tm=(x+yy *nWidth+xx)*3;
					this._check(this._cells[tm]==0);
					this._cells[tm]=type;
					this._cells[tm+1]=w;
					this._cells[tm+2]=h;
				}
			}
			if (x > 0){
				for (yy=0;yy < h;++yy){
					var s=0;
					for (xx=x-1;xx >=0;--xx,++s){
						if (this._cells[((y+yy)*nWidth+xx)*3] !=0)break ;
					}
					for (xx=s;xx > 0;--xx){
						this._cells[((y+yy)*nWidth+x-xx)*3+1]=xx;
						this._check(xx > 0);
					}
				}
			}
			if (y > 0){
				for (xx=x;xx < (x+w);++xx){
					s=0;
					for (yy=y-1;yy >=0;--yy,s++){
						if (this._cells[(xx+yy *nWidth)*3] !=0)break ;
					}
					for (yy=s;yy > 0;--yy){
						this._cells[(xx+(y-yy)*nWidth)*3+2]=yy;
						this._check(yy > 0);
					}
				}
			}
		}

		__proto._check=function(ret){
			if (ret==false){
				console.log("xtexMerger ?????????");
			}
		}

		//------------------------------------------------------------------
		__proto._clear=function(){
			this._texCount=0;
			for (var y=0;y < this._height;y++){
				this._rowInfo[y].spaceCount=this._width;
			}
			for (var i=0;i < this._height;i++){
				for (var j=0;j < this._width;j++){
					var tm=(i *this._width+j)*3;
					this._cells[tm]=0;
					this._cells[tm+1]=this._width-j;
					this._cells[tm+2]=this._width-i;
				}
			}
			this._failSize.width=this._width+1;
			this._failSize.height=this._height+1;
		}

		AtlasGrid.__init$=function(){
			//------------------------------------------------------------------------------
			//class TexRowInfo
			TexRowInfo=(function(){
				function TexRowInfo(){
					this.spaceCount=0;
				}
				__class(TexRowInfo,'');
				return TexRowInfo;
			})()
			//------------------------------------------------------------------------------
			//class TexMergeTexSize
			TexMergeTexSize=(function(){
				function TexMergeTexSize(){
					this.width=0;
					this.height=0;
				}
				__class(TexMergeTexSize,'');
				return TexMergeTexSize;
			})()
		}

		return AtlasGrid;
	})()


	//class laya.webgl.atlas.AtlasResourceManager
	var AtlasResourceManager=(function(){
		function AtlasResourceManager(width,height,gridSize,maxTexNum){
			this._currentAtlasCount=0;
			this._maxAtlaserCount=0;
			this._width=0;
			this._height=0;
			this._gridSize=0;
			this._gridNumX=0;
			this._gridNumY=0;
			this._init=false;
			this._curAtlasIndex=0;
			this._setAtlasParam=false;
			this._atlaserArray=null;
			this._needGC=false;
			this._setAtlasParam=true;
			this._width=width;
			this._height=height;
			this._gridSize=gridSize;
			this._maxAtlaserCount=maxTexNum;
			this._gridNumX=width / gridSize;
			this._gridNumY=height / gridSize;
			this._curAtlasIndex=0;
			this._atlaserArray=[];
		}

		__class(AtlasResourceManager,'laya.webgl.atlas.AtlasResourceManager');
		var __proto=AtlasResourceManager.prototype;
		__proto.setAtlasParam=function(width,height,gridSize,maxTexNum){
			if (this._setAtlasParam==true){
				AtlasResourceManager._sid_=0;
				this._width=width;
				this._height=height;
				this._gridSize=gridSize;
				this._maxAtlaserCount=maxTexNum;
				this._gridNumX=width / gridSize;
				this._gridNumY=height / gridSize;
				this._curAtlasIndex=0;
				this.freeAll();
				return true;
				}else {
				console.log("????????????????????????????????????????????????????????????????????????");
				throw-1;
				return false;
			}
			return false;
		}

		//?????? ??????????????????
		__proto.pushData=function(texture){
			var tex=texture;
			this._setAtlasParam=false;
			var bFound=false;
			var nImageGridX=(Math.ceil((texture.bitmap.width+2)/ this._gridSize));
			var nImageGridY=(Math.ceil((texture.bitmap.height+2)/ this._gridSize));
			var bSuccess=false;
			for (var k=0;k < 2;k++){
				var maxAtlaserCount=this._maxAtlaserCount;
				for (var i=0;i < maxAtlaserCount;i++){
					var altasIndex=(this._curAtlasIndex+i)% maxAtlaserCount;
					(this._atlaserArray.length-1>=altasIndex)|| (this._atlaserArray.push(new Atlaser(this._gridNumX,this._gridNumY,this._width,this._height,AtlasResourceManager._sid_++)));
					var atlas=this._atlaserArray[altasIndex];
					var bitmap=texture.bitmap;
					var webGLImageIndex=atlas.inAtlasWebGLImagesKey.indexOf(bitmap);
					var offsetX=0,offsetY=0;
					if (webGLImageIndex==-1){
						var fillInfo=atlas.addTex(1,nImageGridX,nImageGridY);
						if (fillInfo.ret){
							offsetX=fillInfo.x *this._gridSize+1;
							offsetY=fillInfo.y *this._gridSize+1;
							bitmap.lock=true;
							atlas.addToAtlasTexture((bitmap),offsetX,offsetY);
							atlas.addToAtlas(texture,offsetX,offsetY);
							bSuccess=true;
							this._curAtlasIndex=altasIndex;
							break ;
						}
						}else {
						var offset=atlas.InAtlasWebGLImagesOffsetValue[webGLImageIndex];
						offsetX=offset[0];
						offsetY=offset[1];
						atlas.addToAtlas(texture,offsetX,offsetY);
						bSuccess=true;
						this._curAtlasIndex=altasIndex;
						break ;
					}
				}
				if (bSuccess)
					break ;
				this._atlaserArray.push(new Atlaser(this._gridNumX,this._gridNumY,this._width,this._height,AtlasResourceManager._sid_++));
				this._needGC=true;
				this.garbageCollection();
				this._curAtlasIndex=this._atlaserArray.length-1;
			}
			if (!bSuccess){
				console.log(">>>AtlasManager pushData error");
			}
			return bSuccess;
		}

		__proto.addToAtlas=function(tex){
			laya.webgl.atlas.AtlasResourceManager.instance.pushData(tex);
		}

		/**
		*??????????????????,?????????????????????
		*@return
		*/
		__proto.garbageCollection=function(){
			if (this._needGC===true){
				var n=this._atlaserArray.length-this._maxAtlaserCount;
				for (var i=0;i < n;i++)
				this._atlaserArray[i].dispose();
				this._atlaserArray.splice(0,n);
				this._needGC=false;
			}
			return true;
		}

		__proto.freeAll=function(){
			for (var i=0,n=this._atlaserArray.length;i < n;i++){
				this._atlaserArray[i].dispose();
			}
			this._atlaserArray.length=0;
			this._curAtlasIndex=0;
		}

		__proto.getAtlaserCount=function(){
			return this._atlaserArray.length;
		}

		__proto.getAtlaserByIndex=function(index){
			return this._atlaserArray[index];
		}

		__getset(1,AtlasResourceManager,'instance',function(){
			if (!AtlasResourceManager._Instance){
				AtlasResourceManager._Instance=new AtlasResourceManager(laya.webgl.atlas.AtlasResourceManager.atlasTextureWidth,laya.webgl.atlas.AtlasResourceManager.atlasTextureHeight,/*CLASS CONST:laya.webgl.atlas.AtlasResourceManager.gridSize*/16,laya.webgl.atlas.AtlasResourceManager.maxTextureCount);
			}
			return AtlasResourceManager._Instance;
		});

		__getset(1,AtlasResourceManager,'enabled',function(){
			return AtlasResourceManager._enabled;
		});

		__getset(1,AtlasResourceManager,'atlasLimitWidth',function(){
			return AtlasResourceManager._atlasLimitWidth;
			},function(value){
			AtlasResourceManager._atlasLimitWidth=value;
		});

		__getset(1,AtlasResourceManager,'atlasLimitHeight',function(){
			return AtlasResourceManager._atlasLimitHeight;
			},function(value){
			AtlasResourceManager._atlasLimitHeight=value;
		});

		AtlasResourceManager._enable=function(){
			AtlasResourceManager._enabled=true;
			Config.atlasEnable=true;
		}

		AtlasResourceManager._disable=function(){
			AtlasResourceManager._enabled=false;
			Config.atlasEnable=false;
		}

		AtlasResourceManager.__init__=function(){
			AtlasResourceManager.atlasTextureWidth=2048;
			AtlasResourceManager.atlasTextureHeight=2048;
			AtlasResourceManager.maxTextureCount=6;
			AtlasResourceManager.atlasLimitWidth=512;
			AtlasResourceManager.atlasLimitHeight=512;
		}

		AtlasResourceManager._enabled=false;
		AtlasResourceManager._atlasLimitWidth=0;
		AtlasResourceManager._atlasLimitHeight=0;
		AtlasResourceManager.gridSize=16;
		AtlasResourceManager.atlasTextureWidth=0;
		AtlasResourceManager.atlasTextureHeight=0;
		AtlasResourceManager.maxTextureCount=0;
		AtlasResourceManager._atlasRestore=0;
		AtlasResourceManager.BOARDER_TYPE_NO=0;
		AtlasResourceManager.BOARDER_TYPE_RIGHT=1;
		AtlasResourceManager.BOARDER_TYPE_LEFT=2;
		AtlasResourceManager.BOARDER_TYPE_BOTTOM=4;
		AtlasResourceManager.BOARDER_TYPE_TOP=8;
		AtlasResourceManager.BOARDER_TYPE_ALL=15;
		AtlasResourceManager._sid_=0;
		AtlasResourceManager._Instance=null;
		return AtlasResourceManager;
	})()


	//class laya.webgl.atlas.MergeFillInfo
	var MergeFillInfo=(function(){
		function MergeFillInfo(){
			this.x=0;
			this.y=0;
			this.ret=false;
			this.ret=false;
			this.x=0;
			this.y=0;
		}

		__class(MergeFillInfo,'laya.webgl.atlas.MergeFillInfo');
		return MergeFillInfo;
	})()


	;
	//class laya.webgl.canvas.BlendMode
	var BlendMode=(function(){
		function BlendMode(){};
		__class(BlendMode,'laya.webgl.canvas.BlendMode');
		BlendMode._init_=function(gl){
			BlendMode.fns=[BlendMode.BlendNormal,BlendMode.BlendAdd,BlendMode.BlendMultiply,BlendMode.BlendScreen,BlendMode.BlendOverlay,BlendMode.BlendLight,BlendMode.BlendMask,BlendMode.BlendDestinationOut];
			BlendMode.targetFns=[BlendMode.BlendNormalTarget,BlendMode.BlendAddTarget,BlendMode.BlendMultiplyTarget,BlendMode.BlendScreenTarget,BlendMode.BlendOverlayTarget,BlendMode.BlendLightTarget,BlendMode.BlendMask,BlendMode.BlendDestinationOut];
		}

		BlendMode.BlendNormal=function(gl){
			gl.blendFuncSeparate(/*laya.webgl.WebGLContext.SRC_ALPHA*/0x0302,/*laya.webgl.WebGLContext.ONE_MINUS_SRC_ALPHA*/0x0303,/*laya.webgl.WebGLContext.ONE*/1,/*laya.webgl.WebGLContext.ONE*/1);
		}

		BlendMode.BlendAdd=function(gl){
			gl.blendFunc(/*laya.webgl.WebGLContext.SRC_ALPHA*/0x0302,/*laya.webgl.WebGLContext.DST_ALPHA*/0x0304);
		}

		BlendMode.BlendMultiply=function(gl){
			gl.blendFunc(/*laya.webgl.WebGLContext.DST_COLOR*/0x0306,/*laya.webgl.WebGLContext.ONE_MINUS_SRC_ALPHA*/0x0303);
		}

		BlendMode.BlendScreen=function(gl){
			gl.blendFunc(/*laya.webgl.WebGLContext.SRC_ALPHA*/0x0302,/*laya.webgl.WebGLContext.ONE*/1);
		}

		BlendMode.BlendOverlay=function(gl){
			gl.blendFunc(/*laya.webgl.WebGLContext.ONE*/1,/*laya.webgl.WebGLContext.ONE_MINUS_SRC_COLOR*/0x0301);
		}

		BlendMode.BlendLight=function(gl){
			gl.blendFunc(/*laya.webgl.WebGLContext.SRC_ALPHA*/0x0302,/*laya.webgl.WebGLContext.ONE*/1);
		}

		BlendMode.BlendNormalTarget=function(gl){
			gl.blendFuncSeparate(/*laya.webgl.WebGLContext.SRC_ALPHA*/0x0302,/*laya.webgl.WebGLContext.ONE_MINUS_SRC_ALPHA*/0x0303,/*laya.webgl.WebGLContext.ONE*/1,/*laya.webgl.WebGLContext.ONE_MINUS_SRC_ALPHA*/0x0303);
		}

		BlendMode.BlendAddTarget=function(gl){
			gl.blendFunc(/*laya.webgl.WebGLContext.SRC_ALPHA*/0x0302,/*laya.webgl.WebGLContext.DST_ALPHA*/0x0304);
		}

		BlendMode.BlendMultiplyTarget=function(gl){
			gl.blendFunc(/*laya.webgl.WebGLContext.DST_COLOR*/0x0306,/*laya.webgl.WebGLContext.ONE_MINUS_SRC_ALPHA*/0x0303);
		}

		BlendMode.BlendScreenTarget=function(gl){
			gl.blendFunc(/*laya.webgl.WebGLContext.SRC_ALPHA*/0x0302,/*laya.webgl.WebGLContext.ONE*/1);
		}

		BlendMode.BlendOverlayTarget=function(gl){
			gl.blendFunc(/*laya.webgl.WebGLContext.ONE*/1,/*laya.webgl.WebGLContext.ONE_MINUS_SRC_COLOR*/0x0301);
		}

		BlendMode.BlendLightTarget=function(gl){
			gl.blendFunc(/*laya.webgl.WebGLContext.SRC_ALPHA*/0x0302,/*laya.webgl.WebGLContext.ONE*/1);
		}

		BlendMode.BlendMask=function(gl){
			gl.blendFunc(/*laya.webgl.WebGLContext.ZERO*/0,/*laya.webgl.WebGLContext.SRC_ALPHA*/0x0302);
		}

		BlendMode.BlendDestinationOut=function(gl){
			gl.blendFunc(/*laya.webgl.WebGLContext.ZERO*/0,/*laya.webgl.WebGLContext.ZERO*/0);
		}

		BlendMode.activeBlendFunction=null;
		BlendMode.NAMES=["normal","add","multiply","screen","overlay","light","mask","destination-out"];
		BlendMode.TOINT={"normal":0,"add":1,"multiply":2,"screen":3 ,"lighter":1,"overlay":4,"light":5,"mask":6,"destination-out":7};
		BlendMode.NORMAL="normal";
		BlendMode.ADD="add";
		BlendMode.MULTIPLY="multiply";
		BlendMode.SCREEN="screen";
		BlendMode.LIGHT="light";
		BlendMode.OVERLAY="overlay";
		BlendMode.DESTINATIONOUT="destination-out";
		BlendMode.fns=[];
		BlendMode.targetFns=[];
		return BlendMode;
	})()


	//class laya.webgl.canvas.DrawStyle
	var DrawStyle=(function(){
		function DrawStyle(value){
			this._color=Color.create("black");
			this.setValue(value);
		}

		__class(DrawStyle,'laya.webgl.canvas.DrawStyle');
		var __proto=DrawStyle.prototype;
		__proto.setValue=function(value){
			if (value){
				if ((typeof value=='string')){
					this._color=Color.create(value);
					return;
				}
				if ((value instanceof laya.utils.Color )){
					this._color=value;
					return;
				}
			}
		}

		__proto.reset=function(){
			this._color=Color.create("black");
		}

		__proto.equal=function(value){
			if ((typeof value=='string'))return this._color.strColor===value;
			if ((value instanceof laya.utils.Color ))return this._color.numColor===(value).numColor;
			return false;
		}

		__proto.toColorStr=function(){
			return this._color.strColor;
		}

		DrawStyle.create=function(value){
			if (value){
				var color;
				if ((typeof value=='string'))color=Color.create(value);
				else if ((value instanceof laya.utils.Color ))color=value;
				if (color){
					return color._drawStyle || (color._drawStyle=new DrawStyle(value));
				}
			}
			return null;
		}

		DrawStyle.DEFAULT=new DrawStyle("#000000");
		return DrawStyle;
	})()


	//class laya.webgl.canvas.Path
	var Path=(function(){
		function Path(){
			this._x=0;
			this._y=0;
			//this._rect=null;
			//this.ib=null;
			//this.vb=null;
			this.dirty=false;
			//this.geomatrys=null;
			//this._curGeomatry=null;
			this.offset=0;
			this.count=0;
			this.geoStart=0;
			this.tempArray=[];
			this.closePath=false;
			this.geomatrys=[];
			var gl=WebGL.mainContext;
			this.ib=IndexBuffer2D.create(/*laya.webgl.WebGLContext.DYNAMIC_DRAW*/0x88E8);
			this.vb=VertexBuffer2D.create(5);
		}

		__class(Path,'laya.webgl.canvas.Path');
		var __proto=Path.prototype;
		__proto.addPoint=function(pointX,pointY){
			this.tempArray.push(pointX,pointY);
		}

		__proto.getEndPointX=function(){
			return this.tempArray[this.tempArray.length-2];
		}

		__proto.getEndPointY=function(){
			return this.tempArray[this.tempArray.length-1];
		}

		__proto.polygon=function(x,y,points,color,borderWidth,borderColor){
			var geo;
			this.geomatrys.push(this._curGeomatry=geo=new Polygon(x,y,points,color,borderWidth,borderColor));
			if (!color)geo.fill=false;
			if (borderColor==undefined)geo.borderWidth=0;
			return geo;
		}

		__proto.setGeomtry=function(shape){
			this.geomatrys.push(this._curGeomatry=shape);
		}

		__proto.drawLine=function(x,y,points,width,color){
			var geo;
			if (this.closePath){
				this.geomatrys.push(this._curGeomatry=geo=new LoopLine(x,y,points,width,color));
				}else {
				this.geomatrys.push(this._curGeomatry=geo=new Line(x,y,points,width,color));
			}
			geo.fill=false;
			return geo;
		}

		__proto.update=function(){
			var si=this.ib.byteLength;
			var len=this.geomatrys.length;
			this.offset=si;
			for (var i=this.geoStart;i < len;i++){
				this.geomatrys[i].getData(this.ib,this.vb,this.vb.byteLength / 20);
			}
			this.geoStart=len;
			this.count=(this.ib.byteLength-si)/ CONST3D2D.BYTES_PIDX;
		}

		__proto.reset=function(){
			this.vb.clear();
			this.ib.clear();
			this.offset=this.count=this.geoStart=0;
			this.geomatrys.length=0;
		}

		return Path;
	})()


	//class laya.webgl.canvas.save.SaveBase
	var SaveBase=(function(){
		function SaveBase(){
			//this._valueName=null;
			//this._value=null;
			//this._dataObj=null;
			//this._newSubmit=false;
		}

		__class(SaveBase,'laya.webgl.canvas.save.SaveBase');
		var __proto=SaveBase.prototype;
		Laya.imps(__proto,{"laya.webgl.canvas.save.ISaveData":true})
		__proto.isSaveMark=function(){return false;}
		__proto.restore=function(context){
			this._dataObj[this._valueName]=this._value;
			SaveBase._cache[SaveBase._cache._length++]=this;
			this._newSubmit && (context._curSubmit=Submit.RENDERBASE,context._renderKey=0);
		}

		SaveBase._createArray=function(){
			var value=[];
			value._length=0;
			return value;
		}

		SaveBase._init=function(){
			var namemap=SaveBase._namemap={};
			namemap[0x1]="ALPHA";
			namemap[0x2]="fillStyle";
			namemap[0x8]="font";
			namemap[0x100]="lineWidth";
			namemap[0x200]="strokeStyle";
			namemap[0x2000]="_mergeID";
			namemap[0x400]=namemap[0x800]=namemap[0x1000]=[];
			namemap[0x4000]="textBaseline";
			namemap[0x8000]="textAlign";
			namemap[0x10000]="_nBlendType";
			namemap[0x80000]="shader";
			namemap[0x100000]="filters";
			return namemap;
		}

		SaveBase.save=function(context,type,dataObj,newSubmit){
			if ((context._saveMark._saveuse & type)!==type){
				context._saveMark._saveuse |=type;
				var cache=SaveBase._cache;
				var o=cache._length > 0 ? cache[--cache._length] :(new SaveBase());
				o._value=dataObj[o._valueName=SaveBase._namemap[type]];
				o._dataObj=dataObj;
				o._newSubmit=newSubmit;
				var _save=context._save;
				_save[_save._length++]=o;
			}
		}

		SaveBase._cache=laya.webgl.canvas.save.SaveBase._createArray();
		SaveBase._namemap=SaveBase._init();
		return SaveBase;
	})()


	//class laya.webgl.canvas.save.SaveClipRect
	var SaveClipRect=(function(){
		function SaveClipRect(){
			//this._clipSaveRect=null;
			//this._submitScissor=null;
			this._clipRect=new Rectangle();
		}

		__class(SaveClipRect,'laya.webgl.canvas.save.SaveClipRect');
		var __proto=SaveClipRect.prototype;
		Laya.imps(__proto,{"laya.webgl.canvas.save.ISaveData":true})
		__proto.isSaveMark=function(){return false;}
		__proto.restore=function(context){
			context._clipRect=this._clipSaveRect;
			SaveClipRect._cache[SaveClipRect._cache._length++]=this;
			this._submitScissor.submitLength=context._submits._length-this._submitScissor.submitIndex;
			context._curSubmit=Submit.RENDERBASE;
			context._renderKey=0;
		}

		SaveClipRect.save=function(context,submitScissor){
			if ((context._saveMark._saveuse & /*laya.webgl.canvas.save.SaveBase.TYPE_CLIPRECT*/0x20000)==/*laya.webgl.canvas.save.SaveBase.TYPE_CLIPRECT*/0x20000)return;
			context._saveMark._saveuse |=/*laya.webgl.canvas.save.SaveBase.TYPE_CLIPRECT*/0x20000;
			var cache=SaveClipRect._cache;
			var o=cache._length > 0 ? cache[--cache._length] :(new SaveClipRect());
			o._clipSaveRect=context._clipRect;
			context._clipRect=o._clipRect.copyFrom(context._clipRect);
			o._submitScissor=submitScissor;
			var _save=context._save;
			_save[_save._length++]=o;
		}

		SaveClipRect._cache=SaveBase._createArray();
		return SaveClipRect;
	})()


	//class laya.webgl.canvas.save.SaveMark
	var SaveMark=(function(){
		function SaveMark(){
			this._saveuse=0;
			//this._preSaveMark=null;
			;
		}

		__class(SaveMark,'laya.webgl.canvas.save.SaveMark');
		var __proto=SaveMark.prototype;
		Laya.imps(__proto,{"laya.webgl.canvas.save.ISaveData":true})
		__proto.isSaveMark=function(){
			return true;
		}

		__proto.restore=function(context){
			context._saveMark=this._preSaveMark;
			SaveMark._no[SaveMark._no._length++]=this;
		}

		SaveMark.Create=function(context){
			var no=SaveMark._no;
			var o=no._length > 0 ? no[--no._length] :(new SaveMark());
			o._saveuse=0;
			o._preSaveMark=context._saveMark;
			context._saveMark=o;
			return o;
		}

		SaveMark._no=SaveBase._createArray();
		return SaveMark;
	})()


	//class laya.webgl.canvas.save.SaveTransform
	var SaveTransform=(function(){
		function SaveTransform(){
			//this._savematrix=null;
			this._matrix=new Matrix();
		}

		__class(SaveTransform,'laya.webgl.canvas.save.SaveTransform');
		var __proto=SaveTransform.prototype;
		Laya.imps(__proto,{"laya.webgl.canvas.save.ISaveData":true})
		__proto.isSaveMark=function(){return false;}
		__proto.restore=function(context){
			context._curMat=this._savematrix;
			SaveTransform._no[SaveTransform._no._length++]=this;
		}

		SaveTransform.save=function(context){
			var _saveMark=context._saveMark;
			if ((_saveMark._saveuse & /*laya.webgl.canvas.save.SaveBase.TYPE_TRANSFORM*/0x800)===/*laya.webgl.canvas.save.SaveBase.TYPE_TRANSFORM*/0x800)return;
			_saveMark._saveuse |=/*laya.webgl.canvas.save.SaveBase.TYPE_TRANSFORM*/0x800;
			var no=SaveTransform._no;
			var o=no._length > 0 ? no[--no._length] :(new SaveTransform());
			o._savematrix=context._curMat;
			context._curMat=context._curMat.copyTo(o._matrix);
			var _save=context._save;
			_save[_save._length++]=o;
		}

		SaveTransform._no=SaveBase._createArray();
		return SaveTransform;
	})()


	//class laya.webgl.canvas.save.SaveTranslate
	var SaveTranslate=(function(){
		function SaveTranslate(){
			//this._x=NaN;
			//this._y=NaN;
		}

		__class(SaveTranslate,'laya.webgl.canvas.save.SaveTranslate');
		var __proto=SaveTranslate.prototype;
		Laya.imps(__proto,{"laya.webgl.canvas.save.ISaveData":true})
		__proto.isSaveMark=function(){return false;}
		__proto.restore=function(context){
			var mat=context._curMat;
			context._x=this._x;
			context._y=this._y;
			SaveTranslate._no[SaveTranslate._no._length++]=this;
		}

		SaveTranslate.save=function(context){
			var no=SaveTranslate._no;
			var o=no._length > 0 ? no[--no._length] :(new SaveTranslate());
			o._x=context._x;
			o._y=context._y;
			var _save=context._save;
			_save[_save._length++]=o;
		}

		SaveTranslate._no=SaveBase._createArray();
		return SaveTranslate;
	})()


	//class laya.webgl.resource.RenderTargetMAX
	var RenderTargetMAX=(function(){
		var OneTarget;
		function RenderTargetMAX(){
			this.targets=null;
			this.oneTargets=null;
			this.repaint=false;
			this._width=NaN;
			this._height=NaN;
			this._clipRect=new Rectangle();
		}

		__class(RenderTargetMAX,'laya.webgl.resource.RenderTargetMAX');
		var __proto=RenderTargetMAX.prototype;
		__proto.size=function(w,h){
			if (this._width===w && this._height===h)return;
			this.repaint=true;
			this._width=w;
			this._height=h;
			if (!this.oneTargets)
				this.oneTargets=new OneTarget(w,h);
			else
			this.oneTargets.target.size(w,h);
		}

		__proto._flushToTarget=function(context,target){
			var worldScissorTest=RenderState2D.worldScissorTest;
			var preworldClipRect=RenderState2D.worldClipRect;
			RenderState2D.worldClipRect=this._clipRect;
			this._clipRect.x=this._clipRect.y=0;
			this._clipRect.width=this._width;
			this._clipRect.height=this._height;
			RenderState2D.worldScissorTest=false;
			WebGL.mainContext.disable(/*laya.webgl.WebGLContext.SCISSOR_TEST*/0x0C11);
			var preAlpha=RenderState2D.worldAlpha;
			var preMatrix4=RenderState2D.worldMatrix4;
			var preMatrix=RenderState2D.worldMatrix;
			var preFilters=RenderState2D.worldFilters;
			var preShaderDefines=RenderState2D.worldShaderDefines;
			RenderState2D.worldMatrix=RenderTargetMAX._matrixDefault;
			RenderState2D.restoreTempArray();
			RenderState2D.worldMatrix4=RenderState2D.TEMPMAT4_ARRAY;
			RenderState2D.worldAlpha=1;
			RenderState2D.worldFilters=null;
			RenderState2D.worldShaderDefines=null;
			Shader.activeShader=null;
			target.start();
			Config.showCanvasMark ? target.clear(0,1,0,0.3):target.clear(0,0,0,0);
			context.flush();
			target.end();
			Shader.activeShader=null;
			RenderState2D.worldAlpha=preAlpha;
			RenderState2D.worldMatrix4=preMatrix4;
			RenderState2D.worldMatrix=preMatrix;
			RenderState2D.worldFilters=preFilters;
			RenderState2D.worldShaderDefines=preShaderDefines;
			RenderState2D.worldScissorTest=worldScissorTest
			if (worldScissorTest){
				var y=RenderState2D.height-preworldClipRect.y-preworldClipRect.height;
				WebGL.mainContext.scissor(preworldClipRect.x,y,preworldClipRect.width,preworldClipRect.height);
				WebGL.mainContext.enable(/*laya.webgl.WebGLContext.SCISSOR_TEST*/0x0C11);
			}
			RenderState2D.worldClipRect=preworldClipRect;
		}

		__proto.flush=function(context){
			if (this.repaint){
				this._flushToTarget(context,this.oneTargets.target);
				this.repaint=false;
			}
		}

		__proto.drawTo=function(context,x,y,width,height){
			context.drawTexture(this.oneTargets.target.getTexture(),x,y,width,height,0,0);
		}

		__proto.destroy=function(){
			if (this.oneTargets){
				this.oneTargets.target.destroy();
				this.oneTargets.target=null;
				this.oneTargets=null;
			}
		}

		__static(RenderTargetMAX,
		['_matrixDefault',function(){return this._matrixDefault=new Matrix();}
		]);
		RenderTargetMAX.__init$=function(){
			//class OneTarget
			OneTarget=(function(){
				function OneTarget(w,h){
					//this.x=NaN;
					//this.width=NaN;
					//this.height=NaN;
					//this.target=null;
					this.width=w;
					this.height=h;
					this.target=RenderTarget2D.create(w,h);
				}
				__class(OneTarget,'');
				return OneTarget;
			})()
		}

		return RenderTargetMAX;
	})()


	//class laya.webgl.shader.d2.Shader2D
	var Shader2D=(function(){
		function Shader2D(){
			this.ALPHA=1;
			//this.glTexture=null;
			//this.shader=null;
			//this.filters=null;
			this.shaderType=0;
			//this.colorAdd=null;
			//this.strokeStyle=null;
			//this.fillStyle=null;
			this.defines=new ShaderDefines2D();
		}

		__class(Shader2D,'laya.webgl.shader.d2.Shader2D');
		Shader2D.__init__=function(){
			Shader.addInclude("parts/ColorFilter_ps_uniform.glsl","uniform vec4 colorAlpha;\nuniform mat4 colorMat;"/*__INCLUDESTR__E:/trank/libs/LayaAir/publish/LayaAirPublish/branch/src/webGL/src/laya/webgl/shader/d2/files/parts/ColorFilter_ps_uniform.glsl*/);
			Shader.addInclude("parts/ColorFilter_ps_logic.glsl","gl_FragColor = gl_FragColor * colorMat + colorAlpha/255.0;"/*__INCLUDESTR__E:/trank/libs/LayaAir/publish/LayaAirPublish/branch/src/webGL/src/laya/webgl/shader/d2/files/parts/ColorFilter_ps_logic.glsl*/);
			Shader.addInclude("parts/GlowFilter_ps_uniform.glsl","uniform vec4 u_color;\nuniform float u_strength;\nuniform float u_blurX;\nuniform float u_blurY;\nuniform float u_offsetX;\nuniform float u_offsetY;\nuniform float u_textW;\nuniform float u_textH;"/*__INCLUDESTR__E:/trank/libs/LayaAir/publish/LayaAirPublish/branch/src/webGL/src/laya/webgl/shader/d2/files/parts/GlowFilter_ps_uniform.glsl*/);
			Shader.addInclude("parts/GlowFilter_ps_logic.glsl","const float c_IterationTime = 10.0;\nfloat floatIterationTotalTime = c_IterationTime * c_IterationTime;\nvec4 vec4Color = vec4(0.0,0.0,0.0,0.0);\nvec2 vec2FilterDir = vec2(-(u_offsetX)/u_textW,-(u_offsetY)/u_textH);\nvec2 vec2FilterOff = vec2(u_blurX/u_textW/c_IterationTime * 2.0,u_blurY/u_textH/c_IterationTime * 2.0);\nfloat maxNum = u_blurX * u_blurY;\nvec2 vec2Off = vec2(0.0,0.0);\nfloat floatOff = c_IterationTime/2.0;\nfor(float i = 0.0;i<=c_IterationTime; ++i){\n	for(float j = 0.0;j<=c_IterationTime; ++j){\n		vec2Off = vec2(vec2FilterOff.x * (i - floatOff),vec2FilterOff.y * (j - floatOff));\n		vec4Color += texture2D(texture, v_texcoord + vec2FilterDir + vec2Off)/floatIterationTotalTime;\n	}\n}\ngl_FragColor = vec4(u_color.rgb,vec4Color.a * u_strength);"/*__INCLUDESTR__E:/trank/libs/LayaAir/publish/LayaAirPublish/branch/src/webGL/src/laya/webgl/shader/d2/files/parts/GlowFilter_ps_logic.glsl*/);
			Shader.addInclude("parts/BlurFilter_ps_logic.glsl","gl_FragColor=vec4(0.0);\ngl_FragColor += texture2D(texture, vBlurTexCoords[ 0])*0.004431848411938341;\ngl_FragColor += texture2D(texture, vBlurTexCoords[ 1])*0.05399096651318985;\ngl_FragColor += texture2D(texture, vBlurTexCoords[ 2])*0.2419707245191454;\ngl_FragColor += texture2D(texture, v_texcoord        )*0.3989422804014327;\ngl_FragColor += texture2D(texture, vBlurTexCoords[ 3])*0.2419707245191454;\ngl_FragColor += texture2D(texture, vBlurTexCoords[ 4])*0.05399096651318985;\ngl_FragColor += texture2D(texture, vBlurTexCoords[ 5])*0.004431848411938341;"/*__INCLUDESTR__E:/trank/libs/LayaAir/publish/LayaAirPublish/branch/src/webGL/src/laya/webgl/shader/d2/files/parts/BlurFilter_ps_logic.glsl*/);
			Shader.addInclude("parts/BlurFilter_ps_uniform.glsl","varying vec2 vBlurTexCoords[6];"/*__INCLUDESTR__E:/trank/libs/LayaAir/publish/LayaAirPublish/branch/src/webGL/src/laya/webgl/shader/d2/files/parts/BlurFilter_ps_uniform.glsl*/);
			Shader.addInclude("parts/BlurFilter_vs_uniform.glsl","uniform float strength;\nvarying vec2 vBlurTexCoords[6];"/*__INCLUDESTR__E:/trank/libs/LayaAir/publish/LayaAirPublish/branch/src/webGL/src/laya/webgl/shader/d2/files/parts/BlurFilter_vs_uniform.glsl*/);
			Shader.addInclude("parts/BlurFilter_vs_logic.glsl","\nvBlurTexCoords[ 0] = v_texcoord + vec2(-0.012 * strength, 0.0);\nvBlurTexCoords[ 1] = v_texcoord + vec2(-0.008 * strength, 0.0);\nvBlurTexCoords[ 2] = v_texcoord + vec2(-0.004 * strength, 0.0);\nvBlurTexCoords[ 3] = v_texcoord + vec2( 0.004 * strength, 0.0);\nvBlurTexCoords[ 4] = v_texcoord + vec2( 0.008 * strength, 0.0);\nvBlurTexCoords[ 5] = v_texcoord + vec2( 0.012 * strength, 0.0);"/*__INCLUDESTR__E:/trank/libs/LayaAir/publish/LayaAirPublish/branch/src/webGL/src/laya/webgl/shader/d2/files/parts/BlurFilter_vs_logic.glsl*/);
			Shader.addInclude("parts/ColorAdd_ps_uniform.glsl","uniform vec4 colorAdd;\n"/*__INCLUDESTR__E:/trank/libs/LayaAir/publish/LayaAirPublish/branch/src/webGL/src/laya/webgl/shader/d2/files/parts/ColorAdd_ps_uniform.glsl*/);
			Shader.addInclude("parts/ColorAdd_ps_logic.glsl","gl_FragColor = vec4(colorAdd.rgb,colorAdd.a*gl_FragColor.a);"/*__INCLUDESTR__E:/trank/libs/LayaAir/publish/LayaAirPublish/branch/src/webGL/src/laya/webgl/shader/d2/files/parts/ColorAdd_ps_logic.glsl*/);
			var vs,ps;
			vs="attribute vec4 position;\nattribute vec2 texcoord;\nuniform vec2 size;\n\n#ifdef WORLDMAT\nuniform mat4 mmat;\n#endif\nvarying vec2 v_texcoord;\n\n#include?BLUR_FILTER  \"parts/BlurFilter_vs_uniform.glsl\";\nvoid main() {\n  #ifdef WORLDMAT\n  vec4 pos=mmat*position;\n  gl_Position =vec4((pos.x/size.x-0.5)*2.0,(0.5-pos.y/size.y)*2.0,pos.z,1.0);\n  #else\n  gl_Position =vec4((position.x/size.x-0.5)*2.0,(0.5-position.y/size.y)*2.0,position.z,1.0);\n  #endif\n  \n  v_texcoord = texcoord;\n  #include?BLUR_FILTER  \"parts/BlurFilter_vs_logic.glsl\";\n}"/*__INCLUDESTR__E:/trank/libs/LayaAir/publish/LayaAirPublish/branch/src/webGL/src/laya/webgl/shader/d2/files/texture.vs*/;
			ps="precision mediump float;\n//precision highp float;\nvarying vec2 v_texcoord;\nuniform sampler2D texture;\nuniform float alpha;\n#include?BLUR_FILTER  \"parts/BlurFilter_ps_uniform.glsl\";\n#include?COLOR_FILTER \"parts/ColorFilter_ps_uniform.glsl\";\n#include?GLOW_FILTER \"parts/GlowFilter_ps_uniform.glsl\";\n#include?COLOR_ADD \"parts/ColorAdd_ps_uniform.glsl\";\n\nvoid main() {\n   vec4 color= texture2D(texture, v_texcoord);\n   color.a*=alpha;\n   gl_FragColor=color;\n   #include?COLOR_ADD \"parts/ColorAdd_ps_logic.glsl\";   \n   #include?BLUR_FILTER  \"parts/BlurFilter_ps_logic.glsl\";\n   #include?COLOR_FILTER \"parts/ColorFilter_ps_logic.glsl\";\n   #include?GLOW_FILTER \"parts/GlowFilter_ps_logic.glsl\";\n}"/*__INCLUDESTR__E:/trank/libs/LayaAir/publish/LayaAirPublish/branch/src/webGL/src/laya/webgl/shader/d2/files/texture.ps*/;
			Shader.preCompile2D(0,/*laya.webgl.shader.d2.ShaderDefines2D.TEXTURE2D*/0x01,vs,ps,null);
			vs="attribute vec4 position;\nuniform vec2 size;\nuniform mat4 mmat;\nvoid main() {\n  vec4 pos=mmat*position;\n  gl_Position =vec4((pos.x/size.x-0.5)*2.0,(0.5-pos.y/size.y)*2.0,pos.z,1.0);\n}"/*__INCLUDESTR__E:/trank/libs/LayaAir/publish/LayaAirPublish/branch/src/webGL/src/laya/webgl/shader/d2/files/line.vs*/;
			ps="precision mediump float;\nuniform vec4 color;\nuniform float alpha;\n#include?COLOR_FILTER \"parts/ColorFilter_ps_uniform.glsl\";\nvoid main() {\n	vec4 a = vec4(color.r, color.g, color.b, color.a);\n	a.w = alpha;\n	gl_FragColor = a;\n	#include?COLOR_FILTER \"parts/ColorFilter_ps_logic.glsl\";\n}"/*__INCLUDESTR__E:/trank/libs/LayaAir/publish/LayaAirPublish/branch/src/webGL/src/laya/webgl/shader/d2/files/line.ps*/;
			Shader.preCompile2D(0,/*laya.webgl.shader.d2.ShaderDefines2D.COLOR2D*/0x02,vs,ps,null);
			vs="attribute vec4 position;\nattribute vec3 a_color;\nuniform mat4 mmat;\nuniform mat4 u_mmat2;\nuniform vec2 u_pos;\nuniform vec2 size;\nvarying vec3 color;\nvoid main(){\n  vec4 tPos = vec4(position.x + u_pos.x,position.y + u_pos.y,position.z,position.w);\n  vec4 pos=mmat*u_mmat2*tPos;\n  gl_Position =vec4((pos.x/size.x-0.5)*2.0,(0.5-pos.y/size.y)*2.0,pos.z,1.0);\n  color=a_color;\n}"/*__INCLUDESTR__E:/trank/libs/LayaAir/publish/LayaAirPublish/branch/src/webGL/src/laya/webgl/shader/d2/files/primitive.vs*/;
			ps="precision mediump float;\n//precision mediump float;\nvarying vec3 color;\nuniform float alpha;\nvoid main(){\n	//vec4 a=vec4(color.r, color.g, color.b, 1);\n	//a.a*=alpha;\n    gl_FragColor=vec4(color.r, color.g, color.b, alpha);\n}"/*__INCLUDESTR__E:/trank/libs/LayaAir/publish/LayaAirPublish/branch/src/webGL/src/laya/webgl/shader/d2/files/primitive.ps*/;
			Shader.preCompile2D(0,/*laya.webgl.shader.d2.ShaderDefines2D.PRIMITIVE*/0x04,vs,ps,null);
			vs="attribute vec4 position;\nattribute vec2 texcoord;\nuniform vec2 size;\n\n#ifdef WORLDMAT\nuniform mat4 mmat;\n#endif\nvarying vec2 v_texcoord;\n\n#include?BLUR_FILTER  \"parts/BlurFilter_vs_uniform.glsl\";\nvoid main() {\n  #ifdef WORLDMAT\n  vec4 pos=mmat*position;\n  gl_Position =vec4((pos.x/size.x-0.5)*2.0,(0.5-pos.y/size.y)*2.0,pos.z,1.0);\n  #else\n  gl_Position =vec4((position.x/size.x-0.5)*2.0,(0.5-position.y/size.y)*2.0,position.z,1.0);\n  #endif\n  \n  v_texcoord = texcoord;\n  #include?BLUR_FILTER  \"parts/BlurFilter_vs_logic.glsl\";\n}"/*__INCLUDESTR__E:/trank/libs/LayaAir/publish/LayaAirPublish/branch/src/webGL/src/laya/webgl/shader/d2/files/texture.vs*/;
			ps="precision mediump float;\n//precision highp float;\nvarying vec2 v_texcoord;\nuniform sampler2D texture;\nuniform float alpha;\nuniform vec4 u_TexRange;\nuniform vec2 u_offset;\n#include?BLUR_FILTER  \"parts/BlurFilter_ps_uniform.glsl\";\n#include?COLOR_FILTER \"parts/ColorFilter_ps_uniform.glsl\";\n#include?GLOW_FILTER \"parts/GlowFilter_ps_uniform.glsl\";\n#include?COLOR_ADD \"parts/ColorAdd_ps_uniform.glsl\";\n\nvoid main() {\n   vec2 newTexCoord;\n   newTexCoord.x = mod(u_offset.x + v_texcoord.x,u_TexRange.y) + u_TexRange.x;\n   newTexCoord.y = mod(u_offset.y + v_texcoord.y,u_TexRange.w) + u_TexRange.z;\n   vec4 color= texture2D(texture, newTexCoord);\n   color.a*=alpha;\n   gl_FragColor=color;\n   #include?COLOR_ADD \"parts/ColorAdd_ps_logic.glsl\";   \n   #include?BLUR_FILTER  \"parts/BlurFilter_ps_logic.glsl\";\n   #include?COLOR_FILTER \"parts/ColorFilter_ps_logic.glsl\";\n   #include?GLOW_FILTER \"parts/GlowFilter_ps_logic.glsl\";\n}"/*__INCLUDESTR__E:/trank/libs/LayaAir/publish/LayaAirPublish/branch/src/webGL/src/laya/webgl/shader/d2/files/fillTextureShader.ps*/;
			Shader.preCompile2D(0,/*laya.webgl.shader.d2.ShaderDefines2D.FILLTEXTURE*/0x100,vs,ps,null);
			vs="attribute vec2 position;\nattribute vec2 texcoord;\nattribute vec4 color;\nuniform vec2 size;\nuniform float offsetX;\nuniform float offsetY;\nuniform mat4 mmat;\nuniform mat4 u_mmat2;\nvarying vec2 v_texcoord;\nvarying vec4 v_color;\nvoid main() {\n  vec4 pos=mmat*u_mmat2*vec4(offsetX+position.x,offsetY+position.y,0,1 );\n  gl_Position = vec4((pos.x/size.x-0.5)*2.0,(0.5-pos.y/size.y)*2.0,pos.z,1.0);\n  v_color = color;\n  v_texcoord = texcoord;  \n}"/*__INCLUDESTR__E:/trank/libs/LayaAir/publish/LayaAirPublish/branch/src/webGL/src/laya/webgl/shader/d2/skinAnishader/skinShader.vs*/;
			ps="precision mediump float;\nvarying vec2 v_texcoord;\nvarying vec4 v_color;\nuniform sampler2D texture;\nuniform float alpha;\nvoid main() {\n	vec4 t_color = texture2D(texture, v_texcoord);\n	gl_FragColor = t_color.rgba * v_color;\n	gl_FragColor.a = gl_FragColor.a * alpha;\n}"/*__INCLUDESTR__E:/trank/libs/LayaAir/publish/LayaAirPublish/branch/src/webGL/src/laya/webgl/shader/d2/skinAnishader/skinShader.ps*/;
			Shader.preCompile2D(0,/*laya.webgl.shader.d2.ShaderDefines2D.SKINMESH*/0x200,vs,ps,null);
		}

		return Shader2D;
	})()


	//class laya.webgl.shader.ShaderDefines
	var ShaderDefines=(function(){
		function ShaderDefines(name2int,int2name,int2nameMap){
			this._value=0;
			//this._name2int=null;
			//this._int2name=null;
			//this._int2nameMap=null;
			this._name2int=name2int;
			this._int2name=int2name;
			this._int2nameMap=int2nameMap;
		}

		__class(ShaderDefines,'laya.webgl.shader.ShaderDefines');
		var __proto=ShaderDefines.prototype;
		__proto.add=function(value){
			if ((typeof value=='string'))value=this._name2int[value];
			this._value |=value;
			return this._value;
		}

		__proto.addInt=function(value){
			this._value |=value;
			return this._value;
		}

		__proto.remove=function(value){
			if ((typeof value=='string'))value=this._name2int[value];
			this._value &=(~value);
			return this._value;
		}

		__proto.isDefine=function(def){
			return (this._value & def)===def;
		}

		__proto.getValue=function(){
			return this._value;
		}

		__proto.setValue=function(value){
			this._value=value;
		}

		__proto.toNameDic=function(){
			var r=this._int2nameMap[this._value];
			return r ? r :ShaderDefines._toText(this._value,this._int2name,this._int2nameMap);
		}

		ShaderDefines._reg=function(name,value,_name2int,_int2name){
			_name2int[name]=value;
			_int2name[value]=name;
		}

		ShaderDefines._toText=function(value,_int2name,_int2nameMap){
			var r=_int2nameMap[value];
			if (r)return r;
			var o={};
			var d=1;
			for (var i=0;i < 32;i++){
				d=1 << i;
				if (d > value)break ;
				if (value & d){
					var name=_int2name[d];
					name && (o[name]="");
				}
			}
			_int2nameMap[value]=o;
			return o;
		}

		ShaderDefines._toInt=function(names,_name2int){
			var words=names.split('.');
			var num=0;
			for (var i=0,n=words.length;i < n;i++){
				var value=_name2int[words[i]];
				if (!value)throw new Error("Defines to int err:"+names+"/"+words[i]);
				num |=value;
			}
			return num;
		}

		return ShaderDefines;
	})()


	/**
	*???????????????????????????????????????
	*/
	//class laya.webgl.shader.d2.skinAnishader.SkinMesh
	var SkinMesh=(function(){
		function SkinMesh(){
			this.mVBBuffer=null;
			this.mIBBuffer=null;
			this.mVBData=null;
			this.mIBData=null;
			this.mEleNum=0;
			this.mTexture=null;
			this.transform=null;
			this._vs=null;
			this._ps=null;
			this._resultPs=null;
			this._start=-1;
			this._indexStart=-1;
			this._tempMatrix=new Matrix();
		}

		__class(SkinMesh,'laya.webgl.shader.d2.skinAnishader.SkinMesh');
		var __proto=SkinMesh.prototype;
		__proto.init=function(texture,vs,ps){
			if (vs){
				this._vs=vs;
				}else {
				this._vs=[];
				var tWidth=texture.width;
				var tHeight=texture.height;
				var tRed=1;
				var tGreed=1;
				var tBlue=1;
				var tAlpha=1;
				this._vs.push(0,0,0,0,tRed,tGreed,tBlue,tAlpha);
				this._vs.push(tWidth,0,1,0,tRed,tGreed,tBlue,tAlpha);
				this._vs.push(tWidth,tHeight,1,1,tRed,tGreed,tBlue,tAlpha);
				this._vs.push(0,tHeight,0,1,tRed,tGreed,tBlue,tAlpha);
			}
			if (ps){
				this._ps=ps;
				}else {
				this._ps=[];
				this._ps.push(0,1,3,3,1,2);
			}
			this.mVBData=new Float32Array(this._vs);
			this.mEleNum=this._ps.length;
			this.mTexture=texture;
		}

		__proto.getData=function(vb,ib,start){
			this.mVBBuffer=vb;
			this.mIBBuffer=ib;
			vb.append(this.mVBData);
			this._start=start;
			this._indexStart=ib.byteLength;
			if (this._resultPs==null)this._resultPs=[];
			this._resultPs.length=0;
			for (var i=0,n=this._ps.length;i < n;i++){
				this._resultPs.push(this._ps[i]+start);
			}
			this.mIBData=new Uint16Array(this._resultPs);
			ib.append(this.mIBData);
		}

		__proto.render=function(context,x,y){
			if (Render.isWebGL && this.mTexture){
				context._renderKey=0;
				context._shader2D.glTexture=null;
				SkinMeshBuffer.getInstance().addSkinMesh(this);
				var tempSubmit=Submit.createShape(context,this.mIBBuffer,this.mVBBuffer,this.mEleNum,this._indexStart,Value2D.create(/*laya.webgl.shader.d2.ShaderDefines2D.SKINMESH*/0x200,0));
				this.transform || (this.transform=Matrix.EMPTY);
				this.transform.translate(x,y);
				Matrix.mul(this.transform,context._curMat,this._tempMatrix);
				this.transform.translate(-x,-y);
				var tArray=RenderState2D.getMatrArray();
				RenderState2D.mat2MatArray(this._tempMatrix,tArray);
				var tShaderValue=tempSubmit.shaderValue;
				tShaderValue.textureHost=this.mTexture;
				tShaderValue.offsetX=0;
				tShaderValue.offsetY=0;
				tShaderValue.u_mmat2=tArray;
				tShaderValue.ALPHA=context._shader2D.ALPHA;
				context._submits[context._submits._length++]=tempSubmit;
			}
			else if (Render.isConchApp&&this.mTexture){
				this.transform || (this.transform=Matrix.EMPTY);
				context.setSkinMesh&&context.setSkinMesh(x,y,this._ps,this.mVBData,this.mEleNum,0,this.mTexture,this.transform);
			}
		}

		return SkinMesh;
	})()


	//class laya.webgl.shader.d2.skinAnishader.SkinMeshBuffer
	var SkinMeshBuffer=(function(){
		function SkinMeshBuffer(){
			this.ib=null;
			this.vb=null;
			var gl=WebGL.mainContext;
			this.ib=IndexBuffer2D.create(/*laya.webgl.WebGLContext.DYNAMIC_DRAW*/0x88E8);
			this.vb=VertexBuffer2D.create(8);
		}

		__class(SkinMeshBuffer,'laya.webgl.shader.d2.skinAnishader.SkinMeshBuffer');
		var __proto=SkinMeshBuffer.prototype;
		__proto.addSkinMesh=function(skinMesh){
			skinMesh.getData(this.vb,this.ib,this.vb.byteLength / 32);
		}

		__proto.reset=function(){
			this.vb.clear();
			this.ib.clear();
		}

		SkinMeshBuffer.getInstance=function(){
			return SkinMeshBuffer.instance=SkinMeshBuffer.instance|| new SkinMeshBuffer();
		}

		SkinMeshBuffer.instance=null
		return SkinMeshBuffer;
	})()


	//????????????????????????
	//class laya.webgl.shapes.BasePoly
	var BasePoly=(function(){
		function BasePoly(x,y,width,height,edges,color,borderWidth,borderColor,round){
			//this.x=NaN;
			//this.y=NaN;
			//this.r=NaN;
			//this.width=NaN;
			//this.height=NaN;
			//this.edges=NaN;
			this.r0=0
			//this.color=0;
			//this.borderColor=NaN;
			//this.borderWidth=NaN;
			//this.round=0;
			this.fill=true;
			this.r1=Math.PI / 2;
			(round===void 0)&& (round=0);
			this.x=x;
			this.y=y;
			this.width=width;
			this.height=height;
			this.edges=edges;
			this.color=color;
			this.borderWidth=borderWidth;
			this.borderColor=borderColor;
		}

		__class(BasePoly,'laya.webgl.shapes.BasePoly');
		var __proto=BasePoly.prototype;
		Laya.imps(__proto,{"laya.webgl.shapes.IShape":true})
		__proto.getData=function(ib,vb,start){}
		__proto.sector=function(outVert,outIndex,start){
			var x=this.x,y=this.y,edges=this.edges,seg=(this.r1-this.r0)/ edges;
			var w=this.width,h=this.height,color=this.color;
			var r=((color >> 16)& 0x0000ff)/ 255,g=((color >> 8)& 0xff)/ 255,b=(color & 0x0000ff)/ 255;
			outVert.push(x,y,r,g,b);
			for (var i=0;i < edges+1;i++){
				outVert.push(x+Math.sin(seg *i+this.r0)*w,y+Math.cos(seg *i+this.r0)*h);
				outVert.push(r,g,b);
			}
			for (i=0;i < edges;i++){
				outIndex.push(start,start+i+1,start+i+2);
			}
		}

		//????????????
		__proto.createLine2=function(p,indices,lineWidth,len,outVertex,indexCount){
			var points=p.concat();
			var result=outVertex;
			var color=this.borderColor;
			var r=((color >> 16)& 0x0000ff)/ 255,g=((color >> 8)& 0xff)/ 255,b=(color & 0x0000ff)/ 255;
			var length=points.length / 2;
			var iStart=len,w=lineWidth / 2;
			var px,py,p1x,p1y,p2x,p2y,p3x,p3y;
			var perpx,perpy,perp2x,perp2y,perp3x,perp3y;
			var a1,b1,c1,a2,b2,c2;
			var denom,pdist,dist;
			p1x=points[0];
			p1y=points[1];
			p2x=points[2];
			p2y=points[3];
			perpx=-(p1y-p2y);
			perpy=p1x-p2x;
			dist=Math.sqrt(perpx *perpx+perpy *perpy);
			perpx=perpx / dist *w;
			perpy=perpy / dist *w;
			result.push(p1x-perpx+this.x,p1y-perpy+this.y,r,g,b,p1x+perpx+this.x,p1y+perpy+this.y,r,g,b);
			for (var i=1;i < length-1;i++){
				p1x=points[(i-1)*2];
				p1y=points[(i-1)*2+1];
				p2x=points[(i)*2];
				p2y=points[(i)*2+1];
				p3x=points[(i+1)*2];
				p3y=points[(i+1)*2+1];
				perpx=-(p1y-p2y);
				perpy=p1x-p2x;
				dist=Math.sqrt(perpx *perpx+perpy *perpy);
				perpx=perpx / dist *w;
				perpy=perpy / dist *w;
				perp2x=-(p2y-p3y);
				perp2y=p2x-p3x;
				dist=Math.sqrt(perp2x *perp2x+perp2y *perp2y);
				perp2x=perp2x / dist *w;
				perp2y=perp2y / dist *w;
				a1=(-perpy+p1y)-(-perpy+p2y);
				b1=(-perpx+p2x)-(-perpx+p1x);
				c1=(-perpx+p1x)*(-perpy+p2y)-(-perpx+p2x)*(-perpy+p1y);
				a2=(-perp2y+p3y)-(-perp2y+p2y);
				b2=(-perp2x+p2x)-(-perp2x+p3x);
				c2=(-perp2x+p3x)*(-perp2y+p2y)-(-perp2x+p2x)*(-perp2y+p3y);
				denom=a1 *b2-a2 *b1;
				if (Math.abs(denom)< 0.1){
					denom+=10.1;
					result.push(p2x-perpx+this.x,p2y-perpy+this.y,r,g,b,p2x+perpx+this.x,p2y+perpy+this.y,r,g,b);
					continue ;
				}
				px=(b1 *c2-b2 *c1)/ denom;
				py=(a2 *c1-a1 *c2)/ denom;
				pdist=(px-p2x)*(px-p2x)+(py-p2y)+(py-p2y);
				result.push(px+this.x,py+this.y,r,g,b,p2x-(px-p2x)+this.x,p2y-(py-p2y)+this.y,r,g,b);
			}
			p1x=points[points.length-4];
			p1y=points[points.length-3];
			p2x=points[points.length-2];
			p2y=points[points.length-1];
			perpx=-(p1y-p2y);
			perpy=p1x-p2x;
			dist=Math.sqrt(perpx *perpx+perpy *perpy);
			perpx=perpx / dist *w;
			perpy=perpy / dist *w;
			result.push(p2x-perpx+this.x,p2y-perpy+this.y,r,g,b,p2x+perpx+this.x,p2y+perpy+this.y,r,g,b);
			var groupLen=indexCount;
			for (i=1;i < groupLen;i++){
				indices.push(iStart+(i-1)*2,iStart+(i-1)*2+1,iStart+i *2+1,iStart+i *2+1,iStart+i *2,iStart+(i-1)*2);
			}
			return result;
		}

		//???????????? ?????? ???????????????
		__proto.createLine=function(p,indices,lineWidth,len){
			var points=p.concat();
			var result=p;
			var color=this.borderColor;
			var r=((color >> 16)& 0x0000ff)/ 255,g=((color >> 8)& 0xff)/ 255,b=(color & 0x0000ff)/ 255;
			points.splice(0,5);
			var length=points.length / 5;
			var iStart=len,w=lineWidth / 2;
			var px,py,p1x,p1y,p2x,p2y,p3x,p3y;
			var perpx,perpy,perp2x,perp2y,perp3x,perp3y;
			var a1,b1,c1,a2,b2,c2;
			var denom,pdist,dist;
			p1x=points[0];
			p1y=points[1];
			p2x=points[5];
			p2y=points[6];
			perpx=-(p1y-p2y);
			perpy=p1x-p2x;
			dist=Math.sqrt(perpx *perpx+perpy *perpy);
			perpx=perpx / dist *w;
			perpy=perpy / dist *w;
			result.push(p1x-perpx,p1y-perpy,r,g,b,p1x+perpx,p1y+perpy,r,g,b);
			for (var i=1;i < length-1;i++){
				p1x=points[(i-1)*5];
				p1y=points[(i-1)*5+1];
				p2x=points[(i)*5];
				p2y=points[(i)*5+1];
				p3x=points[(i+1)*5];
				p3y=points[(i+1)*5+1];
				perpx=-(p1y-p2y);
				perpy=p1x-p2x;
				dist=Math.sqrt(perpx *perpx+perpy *perpy);
				perpx=perpx / dist *w;
				perpy=perpy / dist *w;
				perp2x=-(p2y-p3y);
				perp2y=p2x-p3x;
				dist=Math.sqrt(perp2x *perp2x+perp2y *perp2y);
				perp2x=perp2x / dist *w;
				perp2y=perp2y / dist *w;
				a1=(-perpy+p1y)-(-perpy+p2y);
				b1=(-perpx+p2x)-(-perpx+p1x);
				c1=(-perpx+p1x)*(-perpy+p2y)-(-perpx+p2x)*(-perpy+p1y);
				a2=(-perp2y+p3y)-(-perp2y+p2y);
				b2=(-perp2x+p2x)-(-perp2x+p3x);
				c2=(-perp2x+p3x)*(-perp2y+p2y)-(-perp2x+p2x)*(-perp2y+p3y);
				denom=a1 *b2-a2 *b1;
				if (Math.abs(denom)< 0.1){
					denom+=10.1;
					result.push(p2x-perpx,p2y-perpy,r,g,b,p2x+perpx,p2y+perpy,r,g,b);
					continue ;
				}
				px=(b1 *c2-b2 *c1)/ denom;
				py=(a2 *c1-a1 *c2)/ denom;
				pdist=(px-p2x)*(px-p2x)+(py-p2y)+(py-p2y);
				result.push(px,py,r,g,b,p2x-(px-p2x),p2y-(py-p2y),r,g,b);
			}
			p1x=points[points.length-10];
			p1y=points[points.length-9];
			p2x=points[points.length-5];
			p2y=points[points.length-4];
			perpx=-(p1y-p2y);
			perpy=p1x-p2x;
			dist=Math.sqrt(perpx *perpx+perpy *perpy);
			perpx=perpx / dist *w;
			perpy=perpy / dist *w;
			result.push(p2x-perpx,p2y-perpy,r,g,b,p2x+perpx,p2y+perpy,r,g,b);
			var groupLen=this.edges+1;
			for (i=1;i < groupLen;i++){
				indices.push(iStart+(i-1)*2,iStart+(i-1)*2+1,iStart+i *2+1,iStart+i *2+1,iStart+i *2,iStart+(i-1)*2);
			}
			return result;
		}

		//????????????
		__proto.createLoopLine=function(p,indices,lineWidth,len,outVertex,outIndex){
			var points=p.concat();
			var result=outVertex ? outVertex :p;
			var color=this.borderColor;
			var r=((color >> 16)& 0x0000ff)/ 255,g=((color >> 8)& 0xff)/ 255,b=(color & 0x0000ff)/ 255;
			points.splice(0,5);
			var firstPoint=[points[0],points[1]];
			var lastPoint=[points[points.length-5],points[points.length-4]];
			var midPointX=lastPoint[0]+(firstPoint[0]-lastPoint[0])*0.5;
			var midPointY=lastPoint[1]+(firstPoint[1]-lastPoint[1])*0.5;
			points.unshift(midPointX,midPointY,0,0,0);
			points.push(midPointX,midPointY,0,0,0);
			var length=points.length / 5;
			var iStart=len,w=lineWidth / 2;
			var px,py,p1x,p1y,p2x,p2y,p3x,p3y;
			var perpx,perpy,perp2x,perp2y,perp3x,perp3y;
			var a1,b1,c1,a2,b2,c2;
			var denom,pdist,dist;
			p1x=points[0];
			p1y=points[1];
			p2x=points[5];
			p2y=points[6];
			perpx=-(p1y-p2y);
			perpy=p1x-p2x;
			dist=Math.sqrt(perpx *perpx+perpy *perpy);
			perpx=perpx / dist *w;
			perpy=perpy / dist *w;
			result.push(p1x-perpx,p1y-perpy,r,g,b,p1x+perpx,p1y+perpy,r,g,b);
			for (var i=1;i < length-1;i++){
				p1x=points[(i-1)*5];
				p1y=points[(i-1)*5+1];
				p2x=points[(i)*5];
				p2y=points[(i)*5+1];
				p3x=points[(i+1)*5];
				p3y=points[(i+1)*5+1];
				perpx=-(p1y-p2y);
				perpy=p1x-p2x;
				dist=Math.sqrt(perpx *perpx+perpy *perpy);
				perpx=perpx / dist *w;
				perpy=perpy / dist *w;
				perp2x=-(p2y-p3y);
				perp2y=p2x-p3x;
				dist=Math.sqrt(perp2x *perp2x+perp2y *perp2y);
				perp2x=perp2x / dist *w;
				perp2y=perp2y / dist *w;
				a1=(-perpy+p1y)-(-perpy+p2y);
				b1=(-perpx+p2x)-(-perpx+p1x);
				c1=(-perpx+p1x)*(-perpy+p2y)-(-perpx+p2x)*(-perpy+p1y);
				a2=(-perp2y+p3y)-(-perp2y+p2y);
				b2=(-perp2x+p2x)-(-perp2x+p3x);
				c2=(-perp2x+p3x)*(-perp2y+p2y)-(-perp2x+p2x)*(-perp2y+p3y);
				denom=a1 *b2-a2 *b1;
				if (Math.abs(denom)< 0.1){
					denom+=10.1;
					result.push(p2x-perpx,p2y-perpy,r,g,b,p2x+perpx,p2y+perpy,r,g,b);
					continue ;
				}
				px=(b1 *c2-b2 *c1)/ denom;
				py=(a2 *c1-a1 *c2)/ denom;
				pdist=(px-p2x)*(px-p2x)+(py-p2y)+(py-p2y);
				result.push(px,py,r,g,b,p2x-(px-p2x),p2y-(py-p2y),r,g,b);
			}
			if (outIndex){
				indices=outIndex;
			};
			var groupLen=this.edges+1;
			for (i=1;i < groupLen;i++){
				indices.push(iStart+(i-1)*2,iStart+(i-1)*2+1,iStart+i *2+1,iStart+i *2+1,iStart+i *2,iStart+(i-1)*2);
			}
			indices.push(iStart+(i-1)*2,iStart+(i-1)*2+1,iStart+1,iStart+1,iStart,iStart+(i-1)*2);
			return result;
		}

		return BasePoly;
	})()


	//class laya.webgl.shapes.GeometryData
	var GeometryData=(function(){
		function GeometryData(lineWidth,lineColor,lineAlpha,fillColor,fillAlpha,fill,shape){
			//this.lineWidth=NaN;
			//this.lineColor=NaN;
			//this.lineAlpha=NaN;
			//this.fillColor=NaN;
			//this.fillAlpha=NaN;
			//this.shape=null;
			//this.fill=false;
			this.lineWidth=lineWidth;
			this.lineColor=lineColor;
			this.lineAlpha=lineAlpha;
			this.fillColor=fillColor;
			this.fillAlpha=fillAlpha;
			this.shape=shape;
			this.fill=fill;
		}

		__class(GeometryData,'laya.webgl.shapes.GeometryData');
		var __proto=GeometryData.prototype;
		__proto.clone=function(){
			return new GeometryData(this.lineWidth,this.lineColor,this.lineAlpha,this.fillColor,this.fillAlpha,this.fill,this.shape);
		}

		__proto.getIndexData=function(){
			return null;
		}

		__proto.getVertexData=function(){
			return null;
		}

		__proto.destroy=function(){
			this.shape=null;
		}

		return GeometryData;
	})()


	//class laya.webgl.shapes.Vertex
	var Vertex=(function(){
		function Vertex(p){
			//this.points=null;
			if((p instanceof Float32Array))
				this.points=p;
			else if((p instanceof Array)){
				var len=p.length;
				this.points=new Float32Array(p);
			}
		}

		__class(Vertex,'laya.webgl.shapes.Vertex');
		var __proto=Vertex.prototype;
		Laya.imps(__proto,{"laya.webgl.shapes.IShape":true})
		__proto.getData=function(ib,vb,start){}
		return Vertex;
	})()


	//class laya.webgl.submit.Submit
	var Submit=(function(){
		function Submit(renderType){
			//this._selfVb=null;
			//this._ib=null;
			//this._blendFn=null;
			//this._renderType=0;
			//this._vb=null;
			//this._startIdx=0;
			//this._numEle=0;
			//this.shaderValue=null;
			(renderType===void 0)&& (renderType=10000);
			this._renderType=renderType;
		}

		__class(Submit,'laya.webgl.submit.Submit');
		var __proto=Submit.prototype;
		Laya.imps(__proto,{"laya.webgl.submit.ISubmit":true})
		__proto.releaseRender=function(){
			var cache=Submit._cache;
			cache[cache._length++]=this;
			this.shaderValue.release();
			this._vb=null;
		}

		__proto.getRenderType=function(){
			return this._renderType;
		}

		__proto.renderSubmit=function(){
			if (this._numEle===0)return 1;
			var _tex=this.shaderValue.textureHost;
			if (_tex){
				var source=_tex.source;
				if (!_tex.bitmap || !source)
					return 1;
				this.shaderValue.texture=source;
			}
			this._vb.bind_upload(this._ib);
			var gl=WebGL.mainContext;
			this.shaderValue.upload();
			if (BlendMode.activeBlendFunction!==this._blendFn){
				gl.enable(/*laya.webgl.WebGLContext.BLEND*/0x0BE2);
				this._blendFn(gl);
				BlendMode.activeBlendFunction=this._blendFn;
			}
			Stat.drawCall++;
			Stat.trianglesFaces+=this._numEle / 3;
			gl.drawElements(/*laya.webgl.WebGLContext.TRIANGLES*/0x0004,this._numEle,/*laya.webgl.WebGLContext.UNSIGNED_SHORT*/0x1403,this._startIdx);
			return 1;
		}

		Submit.__init__=function(){
			var s=Submit.RENDERBASE=new Submit(-1);
			s.shaderValue=new Value2D(0,0);
			s.shaderValue.ALPHA=-1234;
		}

		Submit.create=function(context,ib,vb,pos,sv){
			var o=Submit._cache._length ? Submit._cache[--Submit._cache._length] :new Submit();
			if (vb==null){
				vb=o._selfVb || (o._selfVb=VertexBuffer2D.create(-1));
				vb.clear();
				pos=0;
			}
			o._ib=ib;
			o._vb=vb;
			o._startIdx=pos *CONST3D2D.BYTES_PIDX;
			o._numEle=0;
			var blendType=context._nBlendType;
			o._blendFn=context._targets ? BlendMode.targetFns[blendType] :BlendMode.fns[blendType];
			o.shaderValue=sv;
			o.shaderValue.setValue(context._shader2D);
			var filters=context._shader2D.filters;
			filters && o.shaderValue.setFilters(filters);
			return o;
		}

		Submit.createShape=function(ctx,ib,vb,numEle,offset,sv){
			var o=(!Submit._cache._length)? (new Submit()):Submit._cache[--Submit._cache._length];
			o._ib=ib;
			o._vb=vb;
			o._numEle=numEle;
			o._startIdx=offset;
			o.shaderValue=sv;
			o.shaderValue.setValue(ctx._shader2D);
			var blendType=ctx._nBlendType;
			o._blendFn=ctx._targets ? BlendMode.targetFns[blendType] :BlendMode.fns[blendType];
			return o;
		}

		Submit.TYPE_2D=10000;
		Submit.TYPE_CANVAS=10003;
		Submit.TYPE_CMDSETRT=10004;
		Submit.TYPE_CUSTOM=10005;
		Submit.TYPE_BLURRT=10006;
		Submit.TYPE_CMDDESTORYPRERT=10007;
		Submit.TYPE_DISABLESTENCIL=10008;
		Submit.TYPE_OTHERIBVB=10009;
		Submit.TYPE_PRIMITIVE=10010;
		Submit.TYPE_RT=10011;
		Submit.TYPE_BLUR_RT=10012;
		Submit.TYPE_TARGET=10013;
		Submit.TYPE_CHANGE_VALUE=10014;
		Submit.TYPE_SHAPE=10015;
		Submit.TYPE_TEXTURE=10016;
		Submit.RENDERBASE=null
		Submit._cache=(Submit._cache=[],Submit._cache._length=0,Submit._cache);
		return Submit;
	})()


	//class laya.webgl.submit.SubmitCMD
	var SubmitCMD=(function(){
		function SubmitCMD(){
			this.fun=null;
			this.args=null;
		}

		__class(SubmitCMD,'laya.webgl.submit.SubmitCMD');
		var __proto=SubmitCMD.prototype;
		Laya.imps(__proto,{"laya.webgl.submit.ISubmit":true})
		__proto.renderSubmit=function(){
			this.fun.apply(null,this.args);
			return 1;
		}

		__proto.getRenderType=function(){
			return 0;
		}

		__proto.releaseRender=function(){
			var cache=SubmitCMD._cache;
			cache[cache._length++]=this;
		}

		SubmitCMD.create=function(args,fun){
			var o=SubmitCMD._cache._length?SubmitCMD._cache[--SubmitCMD._cache._length]:new SubmitCMD();
			o.fun=fun;
			o.args=args;
			return o;
		}

		SubmitCMD._cache=(SubmitCMD._cache=[],SubmitCMD._cache._length=0,SubmitCMD._cache);
		return SubmitCMD;
	})()


	//class laya.webgl.submit.SubmitCMDScope
	var SubmitCMDScope=(function(){
		function SubmitCMDScope(){
			this.variables={};
		}

		__class(SubmitCMDScope,'laya.webgl.submit.SubmitCMDScope');
		var __proto=SubmitCMDScope.prototype;
		__proto.getValue=function(name){
			return this.variables[name];
		}

		__proto.addValue=function(name,value){
			return this.variables[name]=value;
		}

		__proto.setValue=function(name,value){
			if(this.variables.hasOwnProperty(name)){
				return this.variables[name]=value;
			}
			return null;
		}

		__proto.clear=function(){
			for(var key in this.variables){
				delete this.variables[key];
			}
		}

		__proto.recycle=function(){
			this.clear();
			SubmitCMDScope.POOL.push(this);
		}

		SubmitCMDScope.create=function(){
			var scope=SubmitCMDScope.POOL.pop();
			scope||(scope=new SubmitCMDScope());
			return scope;
		}

		SubmitCMDScope.POOL=[];
		return SubmitCMDScope;
	})()


	//class laya.webgl.submit.SubmitOtherIBVB
	var SubmitOtherIBVB=(function(){
		function SubmitOtherIBVB(){
			this.offset=0;
			//this._vb=null;
			//this._ib=null;
			//this._blendFn=null;
			//this._mat=null;
			//this._shader=null;
			//this._shaderValue=null;
			//this._numEle=0;
			this.startIndex=0;
			;
			this._mat=Matrix.create();
		}

		__class(SubmitOtherIBVB,'laya.webgl.submit.SubmitOtherIBVB');
		var __proto=SubmitOtherIBVB.prototype;
		Laya.imps(__proto,{"laya.webgl.submit.ISubmit":true})
		__proto.releaseRender=function(){
			var cache=SubmitOtherIBVB._cache;
			cache[cache._length++]=this;
		}

		__proto.getRenderType=function(){
			return /*laya.webgl.submit.Submit.TYPE_OTHERIBVB*/10009;
		}

		__proto.renderSubmit=function(){
			var _tex=this._shaderValue.textureHost;
			if (_tex){
				var source=_tex.source;
				if (!_tex.bitmap || !source)
					return 1;
				this._shaderValue.texture=source;
			}
			this._vb.bind_upload(this._ib);
			var w=RenderState2D.worldMatrix4;
			var wmat=Matrix.TEMP;
			Matrix.mulPre(this._mat,w[0],w[1],w[4],w[5],w[12],w[13],wmat);
			var tmp=RenderState2D.worldMatrix4=SubmitOtherIBVB.tempMatrix4;
			tmp[0]=wmat.a;
			tmp[1]=wmat.b;
			tmp[4]=wmat.c;
			tmp[5]=wmat.d;
			tmp[12]=wmat.tx;
			tmp[13]=wmat.ty;
			this._shader._offset=this.offset;
			this._shaderValue.refresh();
			this._shader.upload(this._shaderValue);
			this._shader._offset=0;
			var gl=WebGL.mainContext;
			if (BlendMode.activeBlendFunction!==this._blendFn){
				gl.enable(/*laya.webgl.WebGLContext.BLEND*/0x0BE2);
				this._blendFn(gl);
				BlendMode.activeBlendFunction=this._blendFn;
			}
			Stat.drawCall++;
			Stat.trianglesFaces+=this._numEle / 3;
			gl.drawElements(/*laya.webgl.WebGLContext.TRIANGLES*/0x0004,this._numEle,/*laya.webgl.WebGLContext.UNSIGNED_SHORT*/0x1403,this.startIndex);
			RenderState2D.worldMatrix4=w;
			Shader.activeShader=null;
			return 1;
		}

		SubmitOtherIBVB.create=function(context,vb,ib,numElement,shader,shaderValue,startIndex,offset,type){
			(type===void 0)&& (type=0);
			var o=(!SubmitOtherIBVB._cache._length)? (new SubmitOtherIBVB()):SubmitOtherIBVB._cache[--SubmitOtherIBVB._cache._length];
			o._ib=ib;
			o._vb=vb;
			o._numEle=numElement;
			o._shader=shader;
			o._shaderValue=shaderValue;
			var blendType=context._nBlendType;
			o._blendFn=context._targets ? BlendMode.targetFns[blendType] :BlendMode.fns[blendType];
			switch(type){
				case 0:
					o.offset=0;
					o.startIndex=offset / (CONST3D2D.BYTES_PE *vb.vertexStride)*1.5;
					o.startIndex *=CONST3D2D.BYTES_PIDX;
					break ;
				case 1:
					o.startIndex=startIndex;
					o.offset=offset;
					break ;
				}
			return o;
		}

		SubmitOtherIBVB._cache=(SubmitOtherIBVB._cache=[],SubmitOtherIBVB._cache._length=0,SubmitOtherIBVB._cache);
		SubmitOtherIBVB.tempMatrix4=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1,];
		return SubmitOtherIBVB;
	})()


	//class laya.webgl.submit.SubmitScissor
	var SubmitScissor=(function(){
		function SubmitScissor(){
			this.submitIndex=0;
			this.submitLength=0;
			this.context=null;
			this.clipRect=new Rectangle();
			this.screenRect=new Rectangle();
		}

		__class(SubmitScissor,'laya.webgl.submit.SubmitScissor');
		var __proto=SubmitScissor.prototype;
		Laya.imps(__proto,{"laya.webgl.submit.ISubmit":true})
		__proto._scissor=function(x,y,w,h){
			var m=RenderState2D.worldMatrix4;
			var a=m[0],d=m[5],tx=m[12],ty=m[13];
			x=x *a+tx;
			y=y *d+ty;
			w *=a;
			h *=d;
			if (w < 1 || h < 1){
				return false;
			};
			var r=x+w;
			var b=y+h;
			x < 0 && (x=0,w=r-x);
			y < 0 && (y=0,h=b-y);
			var screen=RenderState2D.worldClipRect;
			x=Math.max(x,screen.x);
			y=Math.max(y,screen.y);
			w=Math.min(r,screen.right)-x;
			h=Math.min(b,screen.bottom)-y;
			if (w < 1 || h < 1){
				return false;
			};
			var worldScissorTest=RenderState2D.worldScissorTest;
			this.screenRect.copyFrom(screen);
			screen.x=x;
			screen.y=y;
			screen.width=w;
			screen.height=h;
			RenderState2D.worldScissorTest=true;
			y=RenderState2D.height-y-h;
			WebGL.mainContext.scissor(x,y,w,h);
			WebGL.mainContext.enable(/*laya.webgl.WebGLContext.SCISSOR_TEST*/0x0C11);
			this.context.submitElement(this.submitIndex,this.submitIndex+this.submitLength);
			if (worldScissorTest){
				y=RenderState2D.height-this.screenRect.y-this.screenRect.height;
				WebGL.mainContext.scissor(this.screenRect.x,y,this.screenRect.width,this.screenRect.height);
				WebGL.mainContext.enable(/*laya.webgl.WebGLContext.SCISSOR_TEST*/0x0C11);
			}
			else{
				WebGL.mainContext.disable(/*laya.webgl.WebGLContext.SCISSOR_TEST*/0x0C11);
				RenderState2D.worldScissorTest=false;
			}
			screen.copyFrom(this.screenRect);
			return true;
		}

		__proto._scissorWithTagart=function(x,y,w,h){
			if (w < 1 || h < 1){
				return false;
			};
			var r=x+w;
			var b=y+h;
			x < 0 && (x=0,w=r-x);
			y < 0 && (y=0,h=b-y);
			var screen=RenderState2D.worldClipRect;
			x=Math.max(x,screen.x);
			y=Math.max(y,screen.y);
			w=Math.min(r,screen.right)-x;
			h=Math.min(b,screen.bottom)-y;
			if (w < 1 || h < 1){
				return false;
			};
			var worldScissorTest=RenderState2D.worldScissorTest;
			this.screenRect.copyFrom(screen);
			RenderState2D.worldScissorTest=true;
			screen.x=x;
			screen.y=y;
			screen.width=w;
			screen.height=h;
			y=RenderState2D.height-y-h;
			WebGL.mainContext.scissor(x,y,w,h);
			WebGL.mainContext.enable(/*laya.webgl.WebGLContext.SCISSOR_TEST*/0x0C11);
			this.context.submitElement(this.submitIndex,this.submitIndex+this.submitLength);
			if (worldScissorTest){
				y=RenderState2D.height-this.screenRect.y-this.screenRect.height;
				WebGL.mainContext.scissor(this.screenRect.x,y,this.screenRect.width,this.screenRect.height);
				WebGL.mainContext.enable(/*laya.webgl.WebGLContext.SCISSOR_TEST*/0x0C11);
			}
			else{
				WebGL.mainContext.disable(/*laya.webgl.WebGLContext.SCISSOR_TEST*/0x0C11);
				RenderState2D.worldScissorTest=false;
			}
			screen.copyFrom(this.screenRect);
			return true;
		}

		__proto.renderSubmit=function(){
			this.submitLength=Math.min(this.context._submits._length-1,this.submitLength);
			if (this.submitLength < 1 || this.clipRect.width < 1 || this.clipRect.height < 1)
				return this.submitLength+1;
			if (this.context._targets)
				this._scissorWithTagart(this.clipRect.x,this.clipRect.y,this.clipRect.width,this.clipRect.height);
			else this._scissor(this.clipRect.x,this.clipRect.y,this.clipRect.width,this.clipRect.height);
			return this.submitLength+1;
		}

		__proto.getRenderType=function(){
			return 0;
		}

		__proto.releaseRender=function(){
			var cache=SubmitScissor._cache;
			cache[cache._length++]=this;
			this.context=null;
		}

		SubmitScissor.create=function(context){
			var o=SubmitScissor._cache._length?SubmitScissor._cache[--SubmitScissor._cache._length]:new SubmitScissor();
			o.context=context;
			return o;
		}

		SubmitScissor._cache=(SubmitScissor._cache=[],SubmitScissor._cache._length=0,SubmitScissor._cache);
		return SubmitScissor;
	})()


	//class laya.webgl.submit.SubmitStencil
	var SubmitStencil=(function(){
		function SubmitStencil(){
			this.step=0;
			this.blendMode=null;
			this.level=0;
		}

		__class(SubmitStencil,'laya.webgl.submit.SubmitStencil');
		var __proto=SubmitStencil.prototype;
		Laya.imps(__proto,{"laya.webgl.submit.ISubmit":true})
		__proto.renderSubmit=function(){
			switch(this.step){
				case 1:
					this.do1();
					break ;
				case 2:
					this.do2();
					break ;
				case 3:
					this.do3();
					break ;
				case 4:
					this.do4();
					break ;
				case 5:
					this.do5();
					break ;
				case 6:
					this.do6();
					break ;
				}
			return 1;
		}

		__proto.getRenderType=function(){
			return 0;
		}

		__proto.releaseRender=function(){
			var cache=SubmitStencil._cache;
			cache[cache._length++]=this;
		}

		__proto.do1=function(){
			var gl=WebGL.mainContext;
			gl.enable(/*laya.webgl.WebGLContext.STENCIL_TEST*/0x0B90);
			gl.clear(/*laya.webgl.WebGLContext.STENCIL_BUFFER_BIT*/0x00000400);
			gl.colorMask(false,false,false,false);
			gl.stencilFunc(/*laya.webgl.WebGLContext.EQUAL*/0x0202,this.level,0xFF);
			gl.stencilOp(/*laya.webgl.WebGLContext.KEEP*/0x1E00,/*laya.webgl.WebGLContext.KEEP*/0x1E00,/*laya.webgl.WebGLContext.INCR*/0x1E02);
		}

		//gl.stencilOp(WebGLContext.KEEP,WebGLContext.KEEP,WebGLContext.INVERT);//??????????????????????????? ????????? ????????????0 ????????? 0xFF (?????????????????????????????????????????????)
		__proto.do2=function(){
			var gl=WebGL.mainContext;
			gl.stencilFunc(/*laya.webgl.WebGLContext.EQUAL*/0x0202,this.level+1,0xFF);
			gl.colorMask(true,true,true,true);
			gl.stencilOp(/*laya.webgl.WebGLContext.KEEP*/0x1E00,/*laya.webgl.WebGLContext.KEEP*/0x1E00,/*laya.webgl.WebGLContext.KEEP*/0x1E00);
		}

		__proto.do3=function(){
			var gl=WebGL.mainContext;
			gl.colorMask(true,true,true,true);
			gl.stencilOp(/*laya.webgl.WebGLContext.KEEP*/0x1E00,/*laya.webgl.WebGLContext.KEEP*/0x1E00,/*laya.webgl.WebGLContext.KEEP*/0x1E00);
			gl.clear(/*laya.webgl.WebGLContext.STENCIL_BUFFER_BIT*/0x00000400);
			gl.disable(/*laya.webgl.WebGLContext.STENCIL_TEST*/0x0B90);
		}

		__proto.do4=function(){
			var gl=WebGL.mainContext;
			gl.enable(/*laya.webgl.WebGLContext.STENCIL_TEST*/0x0B90);
			gl.clear(/*laya.webgl.WebGLContext.STENCIL_BUFFER_BIT*/0x00000400);
			gl.colorMask(false,false,false,false);
			gl.stencilFunc(/*laya.webgl.WebGLContext.ALWAYS*/0x0207,this.level,0xFF);
			gl.stencilOp(/*laya.webgl.WebGLContext.KEEP*/0x1E00,/*laya.webgl.WebGLContext.KEEP*/0x1E00,/*laya.webgl.WebGLContext.INVERT*/0x150A);
		}

		__proto.do5=function(){
			var gl=WebGL.mainContext;
			gl.stencilFunc(/*laya.webgl.WebGLContext.EQUAL*/0x0202,0xff,0xFF);
			gl.colorMask(true,true,true,true);
			gl.stencilOp(/*laya.webgl.WebGLContext.KEEP*/0x1E00,/*laya.webgl.WebGLContext.KEEP*/0x1E00,/*laya.webgl.WebGLContext.KEEP*/0x1E00);
		}

		__proto.do6=function(){
			var gl=WebGL.mainContext;
			BlendMode.targetFns[BlendMode.TOINT[this.blendMode]](gl);
		}

		SubmitStencil.create=function(step){
			var o=SubmitStencil._cache._length?SubmitStencil._cache[--SubmitStencil._cache._length]:new SubmitStencil();
			o.step=step;
			return o;
		}

		SubmitStencil._cache=(SubmitStencil._cache=[],SubmitStencil._cache._length=0,SubmitStencil._cache);
		return SubmitStencil;
	})()


	//class laya.webgl.submit.SubmitTarget
	var SubmitTarget=(function(){
		function SubmitTarget(){
			this._renderType=0;
			this._vb=null;
			this._ib=null;
			this._startIdx=0;
			this._numEle=0;
			this.shaderValue=null;
			this.blendType=0;
			this.proName=null;
			this.scope=null;
		}

		__class(SubmitTarget,'laya.webgl.submit.SubmitTarget');
		var __proto=SubmitTarget.prototype;
		Laya.imps(__proto,{"laya.webgl.submit.ISubmit":true})
		__proto.renderSubmit=function(){
			this._vb.bind_upload(this._ib);
			var target=this.scope.getValue(this.proName);
			if (target){
				this.shaderValue.texture=target.source;
				this.shaderValue.upload();
				this.blend();
				Stat.drawCall++;
				Stat.trianglesFaces+=this._numEle/3;
				WebGL.mainContext.drawElements(/*laya.webgl.WebGLContext.TRIANGLES*/0x0004,this._numEle,/*laya.webgl.WebGLContext.UNSIGNED_SHORT*/0x1403,this._startIdx);
			}
			return 1;
		}

		__proto.blend=function(){
			if (BlendMode.activeBlendFunction!==BlendMode.fns[this.blendType]){
				var gl=WebGL.mainContext;
				gl.enable(/*laya.webgl.WebGLContext.BLEND*/0x0BE2);
				BlendMode.fns[this.blendType](gl);
				BlendMode.activeBlendFunction=BlendMode.fns[this.blendType];
			}
		}

		__proto.getRenderType=function(){
			return 0;
		}

		__proto.releaseRender=function(){
			var cache=SubmitTarget._cache;
			cache[cache._length++]=this;
		}

		SubmitTarget.create=function(context,ib,vb,pos,sv,proName){
			var o=SubmitTarget._cache._length?SubmitTarget._cache[--SubmitTarget._cache._length]:new SubmitTarget();
			o._ib=ib;
			o._vb=vb;
			o.proName=proName;
			o._startIdx=pos *CONST3D2D.BYTES_PIDX;
			o._numEle=0;
			o.blendType=context._nBlendType;
			o.shaderValue=sv;
			o.shaderValue.setValue(context._shader2D);
			return o;
		}

		SubmitTarget._cache=(SubmitTarget._cache=[],SubmitTarget._cache._length=0,SubmitTarget._cache);
		return SubmitTarget;
	})()


	/**
	*...?????????????????????????????????????????????????????????
	*/
	//class laya.webgl.text.CharSegment
	var CharSegment=(function(){
		function CharSegment(){
			this._sourceStr=null;
		}

		__class(CharSegment,'laya.webgl.text.CharSegment');
		var __proto=CharSegment.prototype;
		Laya.imps(__proto,{"laya.webgl.text.ICharSegment":true})
		__proto.textToSpit=function(str){
			this._sourceStr=str;
		}

		__proto.getChar=function(i){
			return this._sourceStr.charAt(i);
		}

		__proto.getCharCode=function(i){
			return this._sourceStr.charCodeAt(i);
		}

		__proto.length=function(){
			return this._sourceStr.length;
		}

		return CharSegment;
	})()


	//class laya.webgl.text.DrawText
	var DrawText=(function(){
		var CharValue;
		function DrawText(){};
		__class(DrawText,'laya.webgl.text.DrawText');
		DrawText.__init__=function(){
			DrawText._charsTemp=new Array;
			DrawText._drawValue=new CharValue();
			DrawText._charSeg=new CharSegment();
		}

		DrawText.customCharSeg=function(charseg){
			DrawText._charSeg=charseg;
		}

		DrawText.getChar=function(char,id,drawValue){
			return DrawText._charsCache[id]=DrawTextChar.createOneChar(char,drawValue);
		}

		DrawText._drawSlow=function(save,ctx,txt,words,curMat,font,textAlign,fillColor,borderColor,lineWidth,x,y,sx,sy){
			var drawValue=DrawText._drawValue.value(font,fillColor,borderColor,lineWidth,sx,sy);
			var i=0,n=0;
			var chars=DrawText._charsTemp;
			var width=0,oneChar,htmlWord,id=NaN;
			if (words){
				chars.length=words.length;
				for (i=0,n=words.length;i < n;i++){
					htmlWord=words[i];
					id=htmlWord.charNum+drawValue.txtID;
					chars[i]=oneChar=DrawText._charsCache[id] || DrawText.getChar(htmlWord.char,id,drawValue);
					oneChar.active();
				}
				}else {
				if ((txt instanceof laya.utils.WordText ))
					DrawText._charSeg.textToSpit((txt).toString());
				else
				DrawText._charSeg.textToSpit(txt);
				var len=/*if err,please use iflash.method.xmlLength()*/DrawText._charSeg.length();
				chars.length=len;
				for (i=0,n=len;i < n;i++){
					id=DrawText._charSeg.getCharCode(i)+drawValue.txtID;
					chars[i]=oneChar=DrawText._charsCache[id] || DrawText.getChar(DrawText._charSeg.getChar(i),id,drawValue);
					oneChar.active();
					width+=oneChar.width;
				}
			};
			var dx=0;
			if (textAlign!==null && textAlign!=="left")
				dx=-(textAlign=="center" ? (width / 2):width);
			var uv,bdSz=NaN,texture,value,saveLength=0;
			if (words){
				for (i=0,n=chars.length;i < n;i++){
					oneChar=chars[i];
					if (!oneChar.isSpace){
						htmlWord=words[i];
						bdSz=oneChar.borderSize;
						texture=oneChar.texture;
						ctx._drawText(texture,x+dx+htmlWord.x *sx-bdSz,y+htmlWord.y *sy-bdSz,texture.width,texture.height,curMat,0,0,0,0);
					}
				}
				}else {
				for (i=0,n=chars.length;i < n;i++){
					oneChar=chars[i];
					if (!oneChar.isSpace){
						bdSz=oneChar.borderSize;
						texture=oneChar.texture;
						ctx._drawText(texture,x+dx-bdSz,y-bdSz,texture.width,texture.height,curMat,0,0,0,0);
						save && (value=save[saveLength++],value || (value=save[saveLength-1]=[]),value[0]=texture,value[1]=dx-bdSz,value[2]=-bdSz);
					}
					dx+=oneChar.width;
				}
				save && (save.length=saveLength);
			}
		}

		DrawText._drawFast=function(save,ctx,curMat,x,y){
			var texture,value;
			for (var i=0,n=save.length;i < n;i++){
				value=save[i];
				texture=value[0];
				texture.active();
				ctx._drawText(texture,x+value[1],y+value[2],texture.width,texture.height,curMat,0,0,0,0);
			}
		}

		DrawText.drawText=function(ctx,txt,words,curMat,font,textAlign,fillColor,borderColor,lineWidth,x,y){
			if ((txt && txt.length===0)|| (words && words.length===0))
				return;
			var sx=curMat.a,sy=curMat.d;
			(curMat.b!==0 || curMat.c!==0)&& (sx=sy=1);
			var scale=sx!==1 || sy!==1;
			if (scale && Laya.stage.transform){
				var t=Laya.stage.transform;
				scale=t.a===sx && t.d===sy;
			}else scale=false;
			if (scale){
				curMat=curMat.copyTo(WebGLContext2D._tmpMatrix);
				curMat.scale(1 / sx,1 / sy);
				curMat._checkTransform();
				x *=sx;
				y *=sy;
			}else sx=sy=1;
			if (words){
				DrawText._drawSlow(null,ctx,txt,words,curMat,font,textAlign,fillColor,borderColor,lineWidth,x,y,sx,sy);
				}else {
				if (txt.toUpperCase===null){
					var idNum=sx+sy *100000;
					var myCache=txt;
					if (!myCache.changed && myCache.id===idNum){
						DrawText._drawFast(myCache.save,ctx,curMat,x,y);
						}else {
						myCache.id=idNum;
						myCache.changed=false;
						DrawText._drawSlow(myCache.save,ctx,txt,words,curMat,font,textAlign,fillColor,borderColor,lineWidth,x,y,sx,sy);
					}
					return;
				};
				var id=txt+font.toString()+fillColor+borderColor+lineWidth+sx+sy+textAlign;
				var cache=DrawText._textsCache[id];
				if (cache){
					DrawText._drawFast(cache,ctx,curMat,x,y);
					}else {
					DrawText._textsCache.__length || (DrawText._textsCache.__length=0);
					if (DrawText._textsCache.__length > Config.WebGLTextCacheCount){
						DrawText._textsCache={};
						DrawText._textsCache.__length=0;
						DrawText._curPoolIndex=0;
					}
					DrawText._textCachesPool[DrawText._curPoolIndex] ? (cache=DrawText._textsCache[id]=DrawText._textCachesPool[DrawText._curPoolIndex],cache.length=0):(DrawText._textCachesPool[DrawText._curPoolIndex]=cache=DrawText._textsCache[id]=[]);
					DrawText._textsCache.__length++
					DrawText._curPoolIndex++;
					DrawText._drawSlow(cache,ctx,txt,words,curMat,font,textAlign,fillColor,borderColor,lineWidth,x,y,sx,sy);
				}
			}
		}

		DrawText._charsTemp=null
		DrawText._textCachesPool=[];
		DrawText._curPoolIndex=0;
		DrawText._charsCache={};
		DrawText._textsCache={};
		DrawText._drawValue=null
		DrawText.d=[];
		DrawText._charSeg=null;
		DrawText.__init$=function(){
			//class CharValue
			CharValue=(function(){
				function CharValue(){
					//this.txtID=NaN;
					//this.font=null;
					//this.fillColor=null;
					//this.borderColor=null;
					//this.lineWidth=0;
					//this.scaleX=NaN;
					//this.scaleY=NaN;
				}
				__class(CharValue,'');
				var __proto=CharValue.prototype;
				__proto.value=function(font,fillColor,borderColor,lineWidth,scaleX,scaleY){
					this.font=font;
					this.fillColor=fillColor;
					this.borderColor=borderColor;
					this.lineWidth=lineWidth;
					this.scaleX=scaleX;
					this.scaleY=scaleY;
					var key=font.toString()+scaleX+scaleY+lineWidth+fillColor+borderColor;
					this.txtID=CharValue._keymap[key];
					if (!this.txtID){
						this.txtID=(++CharValue._keymapCount)*0.0000001;
						CharValue._keymap[key]=this.txtID;
					}
					return this;
				}
				CharValue.clear=function(){
					CharValue._keymap={};
					CharValue._keymapCount=1;
				}
				CharValue._keymap={};
				CharValue._keymapCount=1;
				return CharValue;
			})()
		}

		return DrawText;
	})()


	//class laya.webgl.text.DrawTextChar
	var DrawTextChar=(function(){
		function DrawTextChar(content,drawValue){
			//this.xs=NaN;
			//this.ys=NaN;
			//this.width=0;
			//this.height=0;
			//this.char=null;
			//this.fillColor=null;
			//this.borderColor=null;
			//this.borderSize=0;
			//this.font=null;
			//this.fontSize=0;
			//this.texture=null;
			//this.lineWidth=0;
			//this.UV=null;
			//this.isSpace=false;
			this.char=content;
			this.isSpace=content===' ';
			this.xs=drawValue.scaleX;
			this.ys=drawValue.scaleY;
			this.font=drawValue.font.toString();
			this.fontSize=drawValue.font.size;
			this.fillColor=drawValue.fillColor;
			this.borderColor=drawValue.borderColor;
			this.lineWidth=drawValue.lineWidth;
			var bIsConchApp=Render.isConchApp;
			if (bIsConchApp){
				/*__JS__ */var pCanvas=ConchTextCanvas;
				/*__JS__ */pCanvas._source=ConchTextCanvas;
				/*__JS__ */pCanvas._source.canvas=ConchTextCanvas;
				/*__JS__ */this.texture=new Texture(new WebGLCharImage(pCanvas,this));
				}else {
				this.texture=new Texture(new WebGLCharImage(Browser.canvas.source,this));
			}
		}

		__class(DrawTextChar,'laya.webgl.text.DrawTextChar');
		var __proto=DrawTextChar.prototype;
		__proto.active=function(){
			this.texture.active();
		}

		DrawTextChar.createOneChar=function(content,drawValue){
			var char=new DrawTextChar(content,drawValue);
			return char;
		}

		return DrawTextChar;
	})()


	//class laya.webgl.text.FontInContext
	var FontInContext=(function(){
		function FontInContext(font){
			//this._text=null;
			//this._words=null;
			this._index=0;
			this._size=14;
			this._italic=-2;
			this.setFont(font || "14px Arial");
		}

		__class(FontInContext,'laya.webgl.text.FontInContext');
		var __proto=FontInContext.prototype;
		__proto.setFont=function(value){
			this._words=value.split(' ');
			for (var i=0,n=this._words.length;i < n;i++){
				if (this._words[i].indexOf('px')> 0){
					this._index=i;
					break ;
				}
			}
			this._size=parseInt(this._words[this._index]);
			this._text=null;
			this._italic=-2;
		}

		__proto.getItalic=function(){
			this._italic===-2 && (this._italic=this.hasType("italic"));
			return this._italic;
		}

		__proto.hasType=function(name){
			for (var i=0,n=this._words.length;i < n;i++)
			if (this._words[i]===name)return i;
			return-1;
		}

		__proto.removeType=function(name){
			for (var i=0,n=this._words.length;i < n;i++)
			if (this._words[i]===name){
				this._words.splice(i,1);
				if (this._index > i)this._index--;
				break ;
			}
			this._text=null;
			this._italic=-2;
		}

		__proto.copyTo=function(dec){
			dec._text=this._text;
			dec._size=this._size;
			dec._index=this._index;
			dec._words=this._words.slice();
			dec._italic=-2;
			return dec;
		}

		__proto.toString=function(){
			return this._text ? this._text :(this._text=this._words.join(' '));
		}

		__getset(0,__proto,'size',function(){
			return this._size;
			},function(value){
			this._size=value;
			this._words[this._index]=value+"px";
			this._text=null;
		});

		FontInContext.create=function(font){
			var r=FontInContext._cache[font];
			if (r)return r;
			r=FontInContext._cache[font]=new FontInContext(font);
			return r;
		}

		FontInContext.EMPTY=new FontInContext();
		FontInContext._cache={};
		return FontInContext;
	})()


	//class laya.webgl.utils.CONST3D2D
	var CONST3D2D=(function(){
		function CONST3D2D(){};
		__class(CONST3D2D,'laya.webgl.utils.CONST3D2D');
		CONST3D2D.defaultMatrix4=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1];
		CONST3D2D.defaultMinusYMatrix4=[1,0,0,0,0,-1,0,0,0,0,1,0,0,0,0,1];
		CONST3D2D.uniformMatrix3=[1,0,0,0,0,1,0,0,0,0,1,0];
		CONST3D2D._TMPARRAY=[];
		CONST3D2D._OFFSETX=0;
		CONST3D2D._OFFSETY=0;
		__static(CONST3D2D,
		['BYTES_PE',function(){return this.BYTES_PE=/*__JS__ */Float32Array.BYTES_PER_ELEMENT;},'BYTES_PIDX',function(){return this.BYTES_PIDX=/*__JS__ */Uint16Array.BYTES_PER_ELEMENT;}
		]);
		return CONST3D2D;
	})()


	//class laya.webgl.utils.GlUtils
	var GlUtils=(function(){
		function GlUtils(){};
		__class(GlUtils,'laya.webgl.utils.GlUtils');
		GlUtils.make2DProjection=function(width,height,depth){
			return [2.0 / width,0,0,0,0,-2.0 / height,0,0,0,0,2.0 / depth,0,-1,1,0,1,];
		}

		GlUtils.fillIBQuadrangle=function(buffer,count){
			if (count > 65535 / 4){
				throw Error("IBQuadrangle count:"+count+" must<:"+Math.floor(65535 / 4));
				return false;
			}
			count=Math.floor(count);
			buffer._resizeBuffer((count+1)*6 */*laya.webgl.utils.Buffer2D.SHORT*/2,false);
			buffer.byteLength=buffer.bufferLength;
			var bufferData=buffer.getUint16Array();
			var idx=0;
			for (var i=0;i < count;i++){
				bufferData[idx++]=i *4;
				bufferData[idx++]=i *4+2;
				bufferData[idx++]=i *4+1;
				bufferData[idx++]=i *4;
				bufferData[idx++]=i *4+3;
				bufferData[idx++]=i *4+2;
			}
			buffer.setNeedUpload();
			return true;
		}

		GlUtils.expandIBQuadrangle=function(buffer,count){
			buffer.bufferLength >=(count *6 */*laya.webgl.utils.Buffer2D.SHORT*/2)|| GlUtils.fillIBQuadrangle(buffer,count);
		}

		GlUtils.mathCeilPowerOfTwo=function(value){
			value--;
			value |=value >> 1;
			value |=value >> 2;
			value |=value >> 4;
			value |=value >> 8;
			value |=value >> 16;
			value++;
			return value;
		}

		GlUtils.fillQuadrangleImgVb=function(vb,x,y,point4,uv,m,_x,_y){
			'use strict';
			var vpos=(vb._byteLength >> 2)+/*laya.webgl.canvas.WebGLContext2D._RECTVBSIZE*/16;
			vb.byteLength=(vpos << 2);
			var vbdata=vb.getFloat32Array();
			vpos-=/*laya.webgl.canvas.WebGLContext2D._RECTVBSIZE*/16;
			vbdata[vpos+2]=uv[0];
			vbdata[vpos+3]=uv[1];
			vbdata[vpos+6]=uv[2];
			vbdata[vpos+7]=uv[3];
			vbdata[vpos+10]=uv[4];
			vbdata[vpos+11]=uv[5];
			vbdata[vpos+14]=uv[6];
			vbdata[vpos+15]=uv[7];
			var a=m.a,b=m.b,c=m.c,d=m.d;
			if (a!==1 || b!==0 || c!==0 || d!==1){
				m.bTransform=true;
				var tx=m.tx+_x,ty=m.ty+_y;
				vbdata[vpos]=(point4[0]+x)*a+(point4[1]+y)*c+tx;
				vbdata[vpos+1]=(point4[0]+x)*b+(point4[1]+y)*d+ty;
				vbdata[vpos+4]=(point4[2]+x)*a+(point4[3]+y)*c+tx;
				vbdata[vpos+5]=(point4[2]+x)*b+(point4[3]+y)*d+ty;
				vbdata[vpos+8]=(point4[4]+x)*a+(point4[5]+y)*c+tx;
				vbdata[vpos+9]=(point4[4]+x)*b+(point4[5]+y)*d+ty;
				vbdata[vpos+12]=(point4[6]+x)*a+(point4[7]+y)*c+tx;
				vbdata[vpos+13]=(point4[6]+x)*b+(point4[7]+y)*d+ty;
				}else {
				m.bTransform=false;
				x+=m.tx+_x;
				y+=m.ty+_y;
				vbdata[vpos]=x+point4[0];
				vbdata[vpos+1]=y+point4[1];
				vbdata[vpos+4]=x+point4[2];
				vbdata[vpos+5]=y+point4[3];
				vbdata[vpos+8]=x+point4[4];
				vbdata[vpos+9]=y+point4[5];
				vbdata[vpos+12]=x+point4[6];
				vbdata[vpos+13]=y+point4[7];
			}
			vb._upload=true;
			return true;
		}

		GlUtils.fillTranglesVB=function(vb,x,y,points,m,_x,_y){
			'use strict';
			var vpos=(vb._byteLength >> 2)+points.length;
			vb.byteLength=(vpos << 2);
			var vbdata=vb.getFloat32Array();
			vpos-=points.length;
			var len=points.length;
			var a=m.a,b=m.b,c=m.c,d=m.d;
			for (var i=0;i < len;i+=4){
				vbdata[vpos+i+2]=points[i+2];
				vbdata[vpos+i+3]=points[i+3];
				if (a!==1 || b!==0 || c!==0 || d!==1){
					m.bTransform=true;
					var tx=m.tx+_x,ty=m.ty+_y;
					vbdata[vpos+i]=(points[i]+x)*a+(points[i+1]+y)*c+tx;
					vbdata[vpos+i+1]=(points[i]+x)*b+(points[i+1]+y)*d+ty;
					}else {
					m.bTransform=false;
					x+=m.tx+_x;
					y+=m.ty+_y;
					vbdata[vpos+i]=x+points[i];
					vbdata[vpos+i+1]=y+points[i+1];
				}
			}
			vb._upload=true;
			return true;
		}

		GlUtils.copyPreImgVb=function(vb,dx,dy){
			var vpos=(vb._byteLength >> 2);
			vb.byteLength=((vpos+/*laya.webgl.canvas.WebGLContext2D._RECTVBSIZE*/16)<< 2);
			var vbdata=vb.getFloat32Array();
			for (var i=0,ci=vpos-16;i < 4;i++){
				vbdata[vpos]=vbdata[ci]+dx;++vpos;++ci;
				vbdata[vpos]=vbdata[ci]+dy;++vpos;++ci;
				vbdata[vpos]=vbdata[ci];++vpos;++ci;
				vbdata[vpos]=vbdata[ci];++vpos;++ci;
			}
			vb._upload=true;
		}

		GlUtils.fillRectImgVb=function(vb,clip,x,y,width,height,uv,m,_x,_y,dx,dy,round){
			(round===void 0)&& (round=false);
			'use strict';
			var mType=1;
			var toBx,toBy,toEx,toEy;
			var cBx,cBy,cEx,cEy;
			var w0,h0,tx,ty;
			var finalX,finalY,offsetX,offsetY;
			var a=m.a,b=m.b,c=m.c,d=m.d;
			var useClip=clip.width < /*laya.webgl.canvas.WebGLContext2D._MAXSIZE*/99999999;
			if (a!==1 || b!==0 || c!==0 || d!==1){
				m.bTransform=true;
				if (b===0 && c===0){
					mType=23;
					w0=width+x,h0=height+y;
					tx=m.tx+_x,ty=m.ty+_y;
					toBx=a *x+tx;
					toEx=a *w0+tx;
					toBy=d *y+ty;
					toEy=d *h0+ty;
				}
				}else {
				mType=23;
				m.bTransform=false;
				toBx=x+m.tx+_x;
				toEx=toBx+width;
				toBy=y+m.ty+_y;
				toEy=toBy+height;
			}
			if (useClip){
				cBx=clip.x,cBy=clip.y,cEx=clip.width+cBx,cEy=clip.height+cBy;
			}
			if (mType!==1 && (toBx >=cEx || toBy >=cEy || toEx <=cBx || toEy <=cBy))
				return false;
			var vpos=(vb._byteLength >> 2);
			vb.byteLength=((vpos+/*laya.webgl.canvas.WebGLContext2D._RECTVBSIZE*/16)<< 2);
			var vbdata=vb.getFloat32Array();
			vbdata[vpos+2]=uv[0];
			vbdata[vpos+3]=uv[1];
			vbdata[vpos+6]=uv[2];
			vbdata[vpos+7]=uv[3];
			vbdata[vpos+10]=uv[4];
			vbdata[vpos+11]=uv[5];
			vbdata[vpos+14]=uv[6];
			vbdata[vpos+15]=uv[7];
			switch (mType){
				case 1:
					tx=m.tx+_x,ty=m.ty+_y;
					w0=width+x,h0=height+y;
					var w1=x,h1=y;
					var aw1=a *w1,ch1=c *h1,dh1=d *h1,bw1=b *w1;
					var aw0=a *w0,ch0=c *h0,dh0=d *h0,bw0=b *w0;
					if (round){
						finalX=aw1+ch1+tx;
						offsetX=Math.round(finalX)-finalX;
						finalY=dh1+bw1+ty;
						offsetY=Math.round(finalY)-finalY;
						vbdata[vpos]=finalX+offsetX;
						vbdata[vpos+1]=finalY+offsetY;
						vbdata[vpos+4]=aw0+ch1+tx+offsetX;
						vbdata[vpos+5]=dh1+bw0+ty+offsetY;
						vbdata[vpos+8]=aw0+ch0+tx+offsetX;
						vbdata[vpos+9]=dh0+bw0+ty+offsetY;
						vbdata[vpos+12]=aw1+ch0+tx+offsetX;
						vbdata[vpos+13]=dh0+bw1+ty+offsetY;
						}else {
						vbdata[vpos]=aw1+ch1+tx;
						vbdata[vpos+1]=dh1+bw1+ty;
						vbdata[vpos+4]=aw0+ch1+tx;
						vbdata[vpos+5]=dh1+bw0+ty;
						vbdata[vpos+8]=aw0+ch0+tx;
						vbdata[vpos+9]=dh0+bw0+ty;
						vbdata[vpos+12]=aw1+ch0+tx;
						vbdata[vpos+13]=dh0+bw1+ty;
					}
					break ;
				case 23:
					if (round){
						finalX=toBx+dx;
						offsetX=Math.round(finalX)-finalX;
						finalY=toBy;
						offsetY=Math.round(finalY)-finalY;
						vbdata[vpos]=finalX+offsetX;
						vbdata[vpos+1]=finalY+offsetY;
						vbdata[vpos+4]=toEx+dx+offsetX;
						vbdata[vpos+5]=toBy+offsetY;
						vbdata[vpos+8]=toEx+offsetX;
						vbdata[vpos+9]=toEy+offsetY;
						vbdata[vpos+12]=toBx+offsetX;
						vbdata[vpos+13]=toEy+offsetY;
						}else {
						vbdata[vpos]=toBx+dx;
						vbdata[vpos+1]=toBy;
						vbdata[vpos+4]=toEx+dx;
						vbdata[vpos+5]=toBy;
						vbdata[vpos+8]=toEx;
						vbdata[vpos+9]=toEy;
						vbdata[vpos+12]=toBx;
						vbdata[vpos+13]=toEy;
					}
					break ;
				}
			vb._upload=true;
			return true;
		}

		GlUtils.fillLineVb=function(vb,clip,fx,fy,tx,ty,width,mat){
			'use strict';
			var linew=width *.5;
			var data=GlUtils._fillLineArray;
			var perpx=-(fy-ty),perpy=fx-tx;
			var dist=Math.sqrt(perpx *perpx+perpy *perpy);
			perpx /=dist,perpy /=dist,perpx *=linew,perpy *=linew;
			data[0]=fx-perpx,data[1]=fy-perpy,data[4]=fx+perpx,data[5]=fy+perpy,data[8]=tx+perpx,data[9]=ty+perpy,data[12]=tx-perpx,data[13]=ty-perpy;
			mat && mat.transformPointArray(data,data);
			var vpos=(vb._byteLength >> 2)+/*laya.webgl.canvas.WebGLContext2D._RECTVBSIZE*/16;
			vb.byteLength=(vpos << 2);
			vb.insertData(data,vpos-/*laya.webgl.canvas.WebGLContext2D._RECTVBSIZE*/16);
			return true;
		}

		GlUtils._fillLineArray=[[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]];
		return GlUtils;
	})()


	//class laya.webgl.utils.MatirxArray
	var MatirxArray=(function(){
		function MatirxArray(){};
		__class(MatirxArray,'laya.webgl.utils.MatirxArray');
		MatirxArray.ArrayMul=function(a,b,o){
			if (!a){
				MatirxArray.copyArray(b,o);
				return;
			}
			if (!b){
				MatirxArray.copyArray(a,o);
				return;
			};
			var ai0=NaN,ai1=NaN,ai2=NaN,ai3=NaN;
			for (var i=0;i < 4;i++){
				ai0=a[i];
				ai1=a[i+4];
				ai2=a[i+8];
				ai3=a[i+12];
				o[i]=ai0 *b[0]+ai1 *b[1]+ai2 *b[2]+ai3 *b[3];
				o[i+4]=ai0 *b[4]+ai1 *b[5]+ai2 *b[6]+ai3 *b[7];
				o[i+8]=ai0 *b[8]+ai1 *b[9]+ai2 *b[10]+ai3 *b[11];
				o[i+12]=ai0 *b[12]+ai1 *b[13]+ai2 *b[14]+ai3 *b[15];
			}
		}

		MatirxArray.copyArray=function(f,t){
			if (!f)return;
			if (!t)return;
			for (var i=0;i < f.length;i++){
				t[i]=f[i];
			}
		}

		return MatirxArray;
	})()


	//class laya.webgl.utils.RenderState2D
	var RenderState2D=(function(){
		function RenderState2D(){};
		__class(RenderState2D,'laya.webgl.utils.RenderState2D');
		RenderState2D.getMatrArray=function(){
			return [1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1];
		}

		RenderState2D.mat2MatArray=function(mat,matArray){
			var m=mat;
			var m4=matArray;
			m4[0]=m.a;
			m4[1]=m.b;
			m4[4]=m.c;
			m4[5]=m.d;
			m4[12]=m.tx;
			m4[13]=m.ty;
			return matArray;
		}

		RenderState2D.restoreTempArray=function(){
			RenderState2D.TEMPMAT4_ARRAY[0]=1;
			RenderState2D.TEMPMAT4_ARRAY[1]=0;
			RenderState2D.TEMPMAT4_ARRAY[4]=0;
			RenderState2D.TEMPMAT4_ARRAY[5]=1;
			RenderState2D.TEMPMAT4_ARRAY[12]=0;
			RenderState2D.TEMPMAT4_ARRAY[13]=0;
		}

		RenderState2D.clear=function(){
			RenderState2D.worldScissorTest=false;
			RenderState2D.worldShaderDefines=null;
			RenderState2D.worldFilters=null;
			RenderState2D.worldAlpha=1;
			RenderState2D.worldClipRect.x=RenderState2D.worldClipRect.y=0;
			RenderState2D.worldClipRect.width=RenderState2D.width;
			RenderState2D.worldClipRect.height=RenderState2D.height;
			RenderState2D.curRenderTarget=null;
		}

		RenderState2D._MAXSIZE=99999999;
		RenderState2D.TEMPMAT4_ARRAY=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1];
		RenderState2D.worldMatrix4=RenderState2D.TEMPMAT4_ARRAY;
		RenderState2D.worldAlpha=1.0;
		RenderState2D.worldScissorTest=false;
		RenderState2D.worldFilters=null
		RenderState2D.worldShaderDefines=null
		RenderState2D.worldClipRect=new Rectangle(0,0,99999999,99999999);
		RenderState2D.curRenderTarget=null
		RenderState2D.width=0;
		RenderState2D.height=0;
		__static(RenderState2D,
		['worldMatrix',function(){return this.worldMatrix=new Matrix();}
		]);
		return RenderState2D;
	})()


	//class laya.webgl.utils.ShaderCompile
	var ShaderCompile=(function(){
		var ShaderScriptBlock;
		function ShaderCompile(name,vs,ps,nameMap,includeFiles){
			//this._VS=null;
			//this._PS=null;
			//this._VSTXT=null;
			//this._PSTXT=null;
			//this._nameMap=null;
			this._VSTXT=vs;
			this._PSTXT=ps;
			function split (str){
				var words=str.split(' ');
				var out=[];
				for (var i=0;i < words.length;i++)
				words[i].length > 0 && out.push(words[i]);
				return out;
			}
			function c (script){
				var i=0,n=0,ofs=0,words,condition;
				var top=new ShaderScriptBlock(0,null,null,null);
				var parent=top;
				var lines=script.split('\n');
				for (i=0,n=lines.length;i < n;i++){
					var line=lines[i];
					if (line.indexOf("#ifdef")>=0){
						words=split(line);
						parent=new ShaderScriptBlock(1,words[1],"",parent);
						continue ;
					}
					if (line.indexOf("#else")>=0){
						condition=parent.condition;
						parent=new ShaderScriptBlock(2,null,"",parent.parent);
						parent.condition=condition;
						continue ;
					}
					if (line.indexOf("#endif")>=0){
						parent=parent.parent;
						continue ;
					}
					if (line.indexOf("#include")>=0){
						words=split(line);
						var fname=words[1];
						var chr=fname.charAt(0);
						if (chr==='"' || chr==="'"){
							fname=fname.substr(1,fname.length-2);
							ofs=fname.lastIndexOf(chr);
							if (ofs > 0)fname=fname.substr(0,ofs);
						}
						ofs=words[0].indexOf('?');
						var str=ofs > 0 ? words[0].substr(ofs+1):words[0];
						new ShaderScriptBlock(1,str,includeFiles[fname],parent);
						continue ;
					}
					if (parent.childs.length > 0 && parent.childs[parent.childs.length-1].type===0){
						parent.childs[parent.childs.length-1].text+="\n"+line;
					}else new ShaderScriptBlock(0,null,line,parent);
				}
				return top;
			}
			this._VS=c(vs);
			this._PS=c(ps);
			this._nameMap=nameMap;
		}

		__class(ShaderCompile,'laya.webgl.utils.ShaderCompile');
		var __proto=ShaderCompile.prototype;
		__proto.createShader=function(define,shaderName,createShader){
			var defMap={};
			var defineStr="";
			if (define){
				for (var i in define){
					defineStr+="#define "+i+"\n";
					defMap[i]=true;
				}
			};
			var vs=this._VS.toscript(defMap,[]);
			var ps=this._PS.toscript(defMap,[]);
			return (createShader || Shader.create)(defineStr+vs.join('\n'),defineStr+ps.join('\n'),shaderName,this._nameMap);
		}

		ShaderCompile.IFDEF_NO=0;
		ShaderCompile.IFDEF_YES=1;
		ShaderCompile.IFDEF_ELSE=2;
		ShaderCompile.__init$=function(){
			//class ShaderScriptBlock
			ShaderScriptBlock=(function(){
				function ShaderScriptBlock(type,condition,text,parent){
					//this.type=0;
					//this.condition=null;
					//this.text=null;
					//this.parent=null;
					this.childs=new Array;
					this.type=type;
					this.text=text;
					this.parent=parent;
					parent && parent.childs.push(this);
					if (!condition)return;
					var newcondition="";
					var preIsParam=false,isParam=false;
					for (var i=0,n=condition.length;i < n;i++){
						var c=condition.charAt(i);
						isParam="!&|() \t".indexOf(c)< 0;
						if (preIsParam !=isParam){
							isParam && (newcondition+="this.");
							preIsParam=isParam;
						}
						newcondition+=c;
					}
					this.condition=RunDriver.createShaderCondition(newcondition);
				}
				__class(ShaderScriptBlock,'');
				var __proto=ShaderScriptBlock.prototype;
				__proto.toscript=function(def,out){
					if (this.type===/*laya.webgl.utils.ShaderCompile.IFDEF_NO*/0){
						this.text && out.push(this.text);
					}
					if (this.childs.length < 1 && !this.text)return out;
					if (this.type!==/*laya.webgl.utils.ShaderCompile.IFDEF_NO*/0){
						var ifdef=!!this.condition.call(def);
						this.type===/*laya.webgl.utils.ShaderCompile.IFDEF_ELSE*/2 && (ifdef=!ifdef);
						if (!ifdef)return out;
						this.text && out.push(this.text);
					}
					this.childs.length > 0 && this.childs.forEach(function(o,index,arr){
						o.toscript(def,out)
					});
					return out;
				}
				return ShaderScriptBlock;
			})()
		}

		return ShaderCompile;
	})()


	/**
	*@private
	*<code>Shader3D</code> ??????????????????????????????shader???????????????????????????ShaderValue?????????for in??????????????????
	*/
	//class laya.webgl.utils.ValusArray
	var ValusArray=(function(){
		function ValusArray(){
			this._data=[];
			this._length=0;
			this._data._length=0;
		}

		__class(ValusArray,'laya.webgl.utils.ValusArray');
		var __proto=ValusArray.prototype;
		__proto.pushValue=function(name,value){
			this.setValue(this._length,name,value);
			this._length+=2;
		}

		__proto.setValue=function(index,name,value){
			this._data[index++]=name;
			this._data[index]=value;
		}

		__proto.pushArray=function(value){
			var data=this._data;
			var len=this._length;
			var inData=value._data;
			var dec;
			for (var i=0,n=value.length;i < n;i++,len++){
				data[len++]=inData[i++];
				data[len]=inData[i];
			}
			this._length=len;
		}

		__getset(0,__proto,'data',function(){
			return this._data;
		});

		__getset(0,__proto,'length',function(){
			return this._length;
			},function(value){
			this._length=value;
		});

		return ValusArray;
	})()


	/**
	*@private
	*/
	//class laya.webgl.WebGL
	var WebGL=(function(){
		function WebGL(){};
		__class(WebGL,'laya.webgl.WebGL');
		WebGL._float32ArraySlice=function(){
			var _this=/*__JS__ */this;
			var sz=_this.length;
			var dec=new Float32Array(_this.length);
			for (var i=0;i < sz;i++)dec[i]=_this[i];
			return dec;
		}

		WebGL._uint16ArraySlice=function(__arg){
			var arg=arguments;
			var _this=/*__JS__ */this;
			var sz=0;
			var dec;
			var i=0;
			if (arg.length===0){
				sz=_this.length;
				dec=new Uint16Array(sz);
				for (i=0;i < sz;i++)
				dec[i]=_this[i];
				}else if (arg.length===2){
				var start=arg[0];
				var end=arg[1];
				if (end > start){
					sz=end-start;
					dec=new Uint16Array(sz);
					for (i=start;i < end;i++)
					dec[i-start]=_this[i];
					}else {
					dec=new Uint16Array(0);
				}
			}
			return dec;
		}

		WebGL.expandContext=function(){
			var from=Context.prototype;
			var to=/*__JS__ */CanvasRenderingContext2D.prototype;
			to.fillTrangles=from.fillTrangles;
			Buffer2D.__int__(null);
			to.setIBVB=function (x,y,ib,vb,numElement,mat,shader,shaderValues,startIndex,offset){
				(startIndex===void 0)&& (startIndex=0);
				(offset===void 0)&& (offset=0);
				if (ib===null){
					this._ib=this._ib || IndexBuffer2D.QuadrangleIB;
					ib=this._ib;
					GlUtils.expandIBQuadrangle(ib,(vb.byteLength / (4 *16)+8));
				}
				this._setIBVB(x,y,ib,vb,numElement,mat,shader,shaderValues,startIndex,offset);
			};
			to.fillTrangles=function (tex,x,y,points,m){
				this._curMat=this._curMat || Matrix.create();
				this._vb=this._vb || VertexBuffer2D.create();
				if (!this._ib){
					this._ib=IndexBuffer2D.create();
					GlUtils.fillIBQuadrangle(this._ib,length / 4);
				};
				var vb=this._vb;
				var length=points.length >> 4;
				GlUtils.fillTranglesVB(vb,x,y,points,m || this._curMat,0,0);
				GlUtils.expandIBQuadrangle(this._ib,(vb.byteLength / (4 *16)+8));
				var shaderValues=new Value2D(0x01,0);
				shaderValues.textureHost=tex;
				var sd=new Shader2X("attribute vec2 position; attribute vec2 texcoord; uniform vec2 size; uniform mat4 mmat; varying vec2 v_texcoord; void main() { vec4 p=vec4(position.xy,0.0,1.0);vec4 pos=mmat*p; gl_Position =vec4((pos.x/size.x-0.5)*2.0,(0.5-pos.y/size.y)*2.0,pos.z,1.0); v_texcoord = texcoord; }","precision mediump float; varying vec2 v_texcoord; uniform sampler2D texture; void main() {vec4 color= texture2D(texture, v_texcoord); color.a*=1.0; gl_FragColor= color;}");
				/*__JS__ */vb._vertType=3;
				this._setIBVB(x,y,this._ib,vb,length *6,m,sd,shaderValues,0,0);
			}
		}

		WebGL.enable=function(){
			if (Render.isConchApp){
				if (!Render.isConchWebGL){
					RunDriver.skinAniSprite=function (){
						var tSkinSprite=new SkinMesh()
						return tSkinSprite;
					}
					WebGL.expandContext();
					return false;
				}
			}
			if (!WebGL.isWebGLSupported())return false;
			if (Render.isWebGL)return true;
			HTMLImage.create=function (src,def){
				return new WebGLImage(src,def);
			}
			Render.WebGL=WebGL;
			Render.isWebGL=true;
			DrawText.__init__();
			RunDriver.createRenderSprite=function (type,next){
				return new RenderSprite3D(type,next);
			}
			RunDriver.createWebGLContext2D=function (c){
				return new WebGLContext2D(c);
			}
			RunDriver.changeWebGLSize=function (width,height){
				laya.webgl.WebGL.onStageResize(width,height);
			}
			RunDriver.createGraphics=function (){
				return new GraphicsGL();
			};
			var action=RunDriver.createFilterAction;
			RunDriver.createFilterAction=action ? action :function (type){
				return new ColorFilterActionGL()
			}
			RunDriver.clear=function (color){
				RenderState2D.worldScissorTest && laya.webgl.WebGL.mainContext.disable(/*laya.webgl.WebGLContext.SCISSOR_TEST*/0x0C11);
				if (color==null){
					Render.context.ctx.clearBG(0,0,0,0);
					}else {
					var c=Color.create(color)._color;
					Render.context.ctx.clearBG(c[0],c[1],c[2],c[3]);
				}
				RenderState2D.clear();
			}
			RunDriver.addToAtlas=function (texture,force){
				(force===void 0)&& (force=false);
				var bitmap=texture.bitmap;
				if (!Render.optimizeTextureMemory(texture.url,texture)){
					(bitmap).enableMerageInAtlas=false;
					return;
				}
				if ((Laya.__typeof(bitmap,'laya.webgl.resource.IMergeAtlasBitmap'))&& ((bitmap).allowMerageInAtlas)){
					bitmap.on(/*laya.events.Event.RECOVERED*/"recovered",texture,texture.addTextureToAtlas);
				}
			}
			AtlasResourceManager._enable();
			RunDriver.beginFlush=function (){
				var atlasResourceManager=AtlasResourceManager.instance;
				var count=atlasResourceManager.getAtlaserCount();
				for (var i=0;i < count;i++){
					var atlerCanvas=atlasResourceManager.getAtlaserByIndex(i).texture;
					(atlerCanvas._flashCacheImageNeedFlush)&& (RunDriver.flashFlushImage(atlerCanvas));
				}
			}
			RunDriver.drawToCanvas=function (sprite,_renderType,canvasWidth,canvasHeight,offsetX,offsetY){
				var renderTarget=new RenderTarget2D(canvasWidth,canvasHeight,/*laya.webgl.WebGLContext.RGBA*/0x1908,/*laya.webgl.WebGLContext.UNSIGNED_BYTE*/0x1401,0,false);
				renderTarget.start();
				renderTarget.clear(1.0,0.0,0.0,1.0);
				sprite.render(Render.context,-offsetX,RenderState2D.height-canvasHeight-offsetY);
				Render.context.flush();
				renderTarget.end();
				var pixels=renderTarget.getData(0,0,renderTarget.width,renderTarget.height);
				renderTarget.dispose();
				return pixels;
			}
			RunDriver.createFilterAction=function (type){
				var action;
				switch (type){
					case /*laya.filters.Filter.COLOR*/0x20:
						action=new ColorFilterActionGL();
						break ;
					}
				return action;
			}
			RunDriver.addTextureToAtlas=function (texture){
				texture._uvID++;
				AtlasResourceManager._atlasRestore++;
				((texture.bitmap).enableMerageInAtlas)&& (AtlasResourceManager.instance.addToAtlas(texture));
			}
			RunDriver.getTexturePixels=function (value,x,y,width,height){
				(Render.context.ctx).clear();
				var tSprite=new Sprite();
				tSprite.graphics.drawTexture(value,-x,-y);
				var tRenderTarget=RenderTarget2D.create(width,height);
				tRenderTarget.start();
				tRenderTarget.clear(0,0,0,0);
				tSprite.render(Render.context,0,0);
				(Render.context.ctx).flush();
				tRenderTarget.end();
				var tUint8Array=tRenderTarget.getData(0,0,width,height);
				var tArray=[];
				var tIndex=0;
				for (var i=height-1;i >=0;i--){
					for (var j=0;j < width;j++){
						tIndex=(i *width+j)*4;
						tArray.push(tUint8Array[tIndex]);
						tArray.push(tUint8Array[tIndex+1]);
						tArray.push(tUint8Array[tIndex+2]);
						tArray.push(tUint8Array[tIndex+3]);
					}
				}
				return tArray;
			}
			RunDriver.skinAniSprite=function (){
				var tSkinSprite=new SkinMesh()
				return tSkinSprite;
			}
			Filter._filterStart=function (scope,sprite,context,x,y){
				var b=scope.getValue("bounds");
				var source=RenderTarget2D.create(b.width,b.height);
				source.start();
				source.clear(0,0,0,0);
				scope.addValue("src",source);
				scope.addValue("ScissorTest",RenderState2D.worldScissorTest);
				if (RenderState2D.worldScissorTest){
					var tClilpRect=new Rectangle();
					tClilpRect.copyFrom((context.ctx)._clipRect)
					scope.addValue("clipRect",tClilpRect);
					RenderState2D.worldScissorTest=false;
					laya.webgl.WebGL.mainContext.disable(/*laya.webgl.WebGLContext.SCISSOR_TEST*/0x0C11);
				}
			}
			Filter._filterEnd=function (scope,sprite,context,x,y){
				var b=scope.getValue("bounds");
				var source=scope.getValue("src");
				source.end();
				var out=RenderTarget2D.create(b.width,b.height);
				out.start();
				out.clear(0,0,0,0);
				scope.addValue("out",out);
				sprite._set$P('_filterCache',out);
				sprite._set$P('_isHaveGlowFilter',scope.getValue("_isHaveGlowFilter"));
			}
			Filter._EndTarget=function (scope,context){
				var source=scope.getValue("src");
				source.recycle();
				var out=scope.getValue("out");
				out.end();
				var b=scope.getValue("ScissorTest");
				if (b){
					RenderState2D.worldScissorTest=true;
					laya.webgl.WebGL.mainContext.enable(/*laya.webgl.WebGLContext.SCISSOR_TEST*/0x0C11);
					context.ctx.save();
					var tClipRect=scope.getValue("clipRect");
					(context.ctx).clipRect(tClipRect.x,tClipRect.y,tClipRect.width,tClipRect.height);
				}
			}
			Filter._useSrc=function (scope){
				var source=scope.getValue("out");
				source.end();
				source=scope.getValue("src");
				source.start();
				source.clear(0,0,0,0);
			}
			Filter._endSrc=function (scope){
				var source=scope.getValue("src");
				source.end();
			}
			Filter._useOut=function (scope){
				var source=scope.getValue("src");
				source.end();
				source=scope.getValue("out");
				source.start();
				source.clear(0,0,0,0);
			}
			Filter._endOut=function (scope){
				var source=scope.getValue("out");
				source.end();
			}
			Filter._recycleScope=function (scope){
				scope.recycle();
			}
			Filter._filter=function (sprite,context,x,y){
				var next=this._next;
				if (next){
					var filters=sprite.filters,len=filters.length;
					if (len==1 && (filters[0].type==/*laya.filters.Filter.COLOR*/0x20)){
						context.ctx.save();
						context.ctx.setFilters([filters[0]]);
						next._fun.call(next,sprite,context,x,y);
						context.ctx.restore();
						return;
					};
					var shaderValue;
					var b;
					var scope=SubmitCMDScope.create();
					var p=Point.TEMP;
					var tMatrix=context.ctx._getTransformMatrix();
					var mat=Matrix.create();
					tMatrix.copyTo(mat);
					var tPadding=0;
					var tHalfPadding=0;
					var tIsHaveGlowFilter=false;
					var out=sprite._$P._filterCache ? sprite._$P._filterCache :null;
					if (!out || sprite._repaint){
						tIsHaveGlowFilter=sprite._isHaveGlowFilter();
						scope.addValue("_isHaveGlowFilter",tIsHaveGlowFilter);
						if (tIsHaveGlowFilter){
							tPadding=50;
							tHalfPadding=25;
						}
						b=new Rectangle();
						b.copyFrom((sprite).getBounds());
						var tSX=b.x;
						var tSY=b.y;
						b.width+=tPadding;
						b.height+=tPadding;
						p.x=b.x *mat.a+b.y *mat.c;
						p.y=b.y *mat.d+b.x *mat.b;
						b.x=p.x;
						b.y=p.y;
						p.x=b.width *mat.a+b.height *mat.c;
						p.y=b.height *mat.d+b.width *mat.b;
						b.width=p.x;
						b.height=p.y;
						if (b.width <=0 || b.height <=0){
							return;
						}
						out && out.recycle();
						scope.addValue("bounds",b);
						var submit=SubmitCMD.create([scope,sprite,context,0,0],Filter._filterStart);
						context.addRenderObject(submit);
						(context.ctx)._renderKey=0;
						(context.ctx)._shader2D.glTexture=null;
						var tX=sprite.x-tSX+tHalfPadding;
						var tY=sprite.y-tSY+tHalfPadding;
						next._fun.call(next,sprite,context,tX,tY);
						submit=SubmitCMD.create([scope,sprite,context,0,0],Filter._filterEnd);
						context.addRenderObject(submit);
						for (var i=0;i < len;i++){
							if (i !=0){
								submit=SubmitCMD.create([scope],Filter._useSrc);
								context.addRenderObject(submit);
								shaderValue=Value2D.create(/*laya.webgl.shader.d2.ShaderDefines2D.TEXTURE2D*/0x01,0);
								Matrix.TEMP.identity();
								context.ctx.drawTarget(scope,0,0,b.width,b.height,Matrix.TEMP,"out",shaderValue,null,BlendMode.TOINT.overlay);
								submit=SubmitCMD.create([scope],Filter._useOut);
								context.addRenderObject(submit);
							};
							var fil=filters[i];
							fil.action.apply3d(scope,sprite,context,0,0);
						}
						submit=SubmitCMD.create([scope,context],Filter._EndTarget);
						context.addRenderObject(submit);
						}else {
						tIsHaveGlowFilter=sprite._$P._isHaveGlowFilter ? sprite._$P._isHaveGlowFilter :false;
						if (tIsHaveGlowFilter){
							tPadding=50;
							tHalfPadding=25;
						}
						b=sprite.getBounds();
						if (b.width <=0 || b.height <=0){
							return;
						}
						b.width+=tPadding;
						b.height+=tPadding;
						p.x=b.x *mat.a+b.y *mat.c;
						p.y=b.y *mat.d+b.x *mat.b;
						b.x=p.x;
						b.y=p.y;
						p.x=b.width *mat.a+b.height *mat.c;
						p.y=b.height *mat.d+b.width *mat.b;
						b.width=p.x;
						b.height=p.y;
						scope.addValue("out",out);
					}
					x=x-tHalfPadding-sprite.x;
					y=y-tHalfPadding-sprite.y;
					p.setTo(x,y);
					mat.transformPoint(p);
					x=p.x+b.x;
					y=p.y+b.y;
					shaderValue=Value2D.create(/*laya.webgl.shader.d2.ShaderDefines2D.TEXTURE2D*/0x01,0);
					Matrix.TEMP.identity();
					(context.ctx).drawTarget(scope,x,y,b.width,b.height,Matrix.TEMP,"out",shaderValue,null,BlendMode.TOINT.overlay);
					submit=SubmitCMD.create([scope],Filter._recycleScope);
					context.addRenderObject(submit);
					mat.destroy();
				}
			}
			Float32Array.prototype.slice || (Float32Array.prototype.slice=WebGL._float32ArraySlice);
			Uint16Array.prototype.slice || (Uint16Array.prototype.slice=WebGL._uint16ArraySlice);
			return true;
		}

		WebGL.isWebGLSupported=function(){
			var canvas=Browser.createElement('canvas');
			var gl;
			var names=["webgl","experimental-webgl","webkit-3d","moz-webgl"];
			for (var i=0;i < names.length;i++){
				try {
					gl=canvas.getContext(names[i]);
				}catch (e){}
				if (gl)return names[i];
			}
			return null;
		}

		WebGL.onStageResize=function(width,height){
			WebGL.mainContext.viewport(0,0,width,height);
			RenderState2D.width=width;
			RenderState2D.height=height;
		}

		WebGL.isExperimentalWebgl=function(){
			return WebGL._isExperimentalWebgl;
		}

		WebGL.addRenderFinish=function(){
			if (WebGL._isExperimentalWebgl || Render.isFlash){
				RunDriver.endFinish=function (){
					Render.context.ctx.finish();
				}
			}
		}

		WebGL.removeRenderFinish=function(){
			if (WebGL._isExperimentalWebgl){
				RunDriver.endFinish=function (){}
			}
		}

		WebGL.onInvalidGLRes=function(){
			AtlasResourceManager.instance.freeAll();
			ResourceManager.releaseContentManagers(true);
			WebGL.doNodeRepaint(Laya.stage);
			WebGL.mainContext.viewport(0,0,RenderState2D.width,RenderState2D.height);
			Laya.stage.event(/*laya.events.Event.DEVICE_LOST*/"devicelost");
		}

		WebGL.doNodeRepaint=function(sprite){
			(sprite.numChildren==0)&& (sprite.repaint());
			for (var i=0;i < sprite.numChildren;i++)
			WebGL.doNodeRepaint(sprite.getChildAt(i));
		}

		WebGL.init=function(canvas,width,height){
			WebGL.mainCanvas=canvas;
			HTMLCanvas._createContext=function (canvas){
				return new WebGLContext2D(canvas);
			};
			var webGLName=WebGL.isWebGLSupported();
			var gl=WebGL.mainContext=RunDriver.newWebGLContext(canvas,webGLName);
			WebGL._isExperimentalWebgl=(webGLName !="webgl" && (Browser.onWeiXin || Browser.onMQQBrowser));
			WebGL.frameShaderHighPrecision=false;
			try {
				var precisionFormat=laya.webgl.WebGL.mainContext.getShaderPrecisionFormat(/*laya.webgl.WebGLContext.FRAGMENT_SHADER*/0x8B30,/*laya.webgl.WebGLContext.HIGH_FLOAT*/0x8DF2);
				precisionFormat.precision ? WebGL.frameShaderHighPrecision=true :WebGL.frameShaderHighPrecision=false;
			}catch (e){}
			Browser.window.SetupWebglContext && Browser.window.SetupWebglContext(gl);
			WebGL.onStageResize(width,height);
			if (WebGL.mainContext==null)
				throw new Error("webGL getContext err!");
			System.__init__();
			AtlasResourceManager.__init__();
			ShaderDefines2D.__init__();
			Submit.__init__();
			WebGLContext2D.__init__();
			Value2D.__init__();
			Shader2D.__init__();
			Buffer2D.__int__(gl);
			BlendMode._init_(gl);
			if (Render.isConchApp){
				/*__JS__ */conch.setOnInvalidGLRes(WebGL.onInvalidGLRes);
			}
		}

		WebGL.mainCanvas=null
		WebGL.mainContext=null
		WebGL.antialias=true;
		WebGL.frameShaderHighPrecision=false;
		WebGL._bg_null=[0,0,0,0];
		WebGL._isExperimentalWebgl=false;
		return WebGL;
	})()


	//class laya.webgl.WebGLContext
	var WebGLContext=(function(){
		function WebGLContext(){};
		__class(WebGLContext,'laya.webgl.WebGLContext');
		WebGLContext.UseProgram=function(program){
			if (WebGLContext._useProgram===program)return false;
			WebGL.mainContext.useProgram(program);
			WebGLContext._useProgram=program;
			return true;
		}

		WebGLContext.setDepthTest=function(gl,value){
			value!==WebGLContext._depthTest && (WebGLContext._depthTest=value,value?gl.enable(/*CLASS CONST:laya.webgl.WebGLContext.DEPTH_TEST*/0x0B71):gl.disable(/*CLASS CONST:laya.webgl.WebGLContext.DEPTH_TEST*/0x0B71));
		}

		WebGLContext.setDepthMask=function(gl,value){
			value!==WebGLContext._depthMask && (WebGLContext._depthMask=value,gl.depthMask(value));
		}

		WebGLContext.setDepthFunc=function(gl,value){
			value!==WebGLContext._depthFunc && (WebGLContext._depthFunc=value,gl.depthFunc(value));
		}

		WebGLContext.setBlend=function(gl,value){
			value!==WebGLContext._blend && (WebGLContext._blend=value,value?gl.enable(/*CLASS CONST:laya.webgl.WebGLContext.BLEND*/0x0BE2):gl.disable(/*CLASS CONST:laya.webgl.WebGLContext.BLEND*/0x0BE2));
		}

		WebGLContext.setBlendFunc=function(gl,sFactor,dFactor){
			(sFactor!==WebGLContext._sFactor||dFactor!==WebGLContext._dFactor)&& (WebGLContext._sFactor=sFactor,WebGLContext._dFactor=dFactor,gl.blendFunc(sFactor,dFactor));
		}

		WebGLContext.setCullFace=function(gl,value){
			value!==WebGLContext._cullFace && (WebGLContext._cullFace=value,value?gl.enable(/*CLASS CONST:laya.webgl.WebGLContext.CULL_FACE*/0x0B44):gl.disable(/*CLASS CONST:laya.webgl.WebGLContext.CULL_FACE*/0x0B44));
		}

		WebGLContext.setFrontFaceCCW=function(gl,value){
			value!==WebGLContext._frontFace && (WebGLContext._frontFace=value,gl.frontFace(value));
		}

		WebGLContext.bindTexture=function(gl,target,texture){
			gl.bindTexture(target,texture);
			WebGLContext.curBindTexTarget=target;
			WebGLContext.curBindTexValue=texture;
		}

		WebGLContext._useProgram=null;
		WebGLContext._depthTest=true;
		WebGLContext._depthMask=1;
		WebGLContext._blend=false;
		WebGLContext._cullFace=false;
		WebGLContext.curBindTexTarget=null
		WebGLContext.curBindTexValue=null
		__static(WebGLContext,
		['_depthFunc',function(){return this._depthFunc=/*CLASS CONST:laya.webgl.WebGLContext.LESS*/0x0201;},'_sFactor',function(){return this._sFactor=/*CLASS CONST:laya.webgl.WebGLContext.ONE*/1;},'_dFactor',function(){return this._dFactor=/*CLASS CONST:laya.webgl.WebGLContext.ZERO*/0;},'_frontFace',function(){return this._frontFace=/*CLASS CONST:laya.webgl.WebGLContext.CCW*/0x0901;}
		]);
		WebGLContext.__init$=function(){
			;
		}

		return WebGLContext;
	})()


	//class laya.webgl.display.GraphicsGL extends laya.display.Graphics
	var GraphicsGL=(function(_super){
		function GraphicsGL(){
			GraphicsGL.__super.call(this);
		}

		__class(GraphicsGL,'laya.webgl.display.GraphicsGL',_super);
		var __proto=GraphicsGL.prototype;
		__proto.setShader=function(shader){
			this._saveToCmd(Render.context._setShader,[shader]);
		}

		__proto.setIBVB=function(x,y,ib,vb,numElement,shader){
			this._saveToCmd(Render.context._setIBVB,[x,y,ib,vb,numElement,shader]);
		}

		__proto.drawParticle=function(x,y,ps){
			var pt=RunDriver.createParticleTemplate2D(ps);
			pt.x=x;
			pt.y=y;
			this._saveToCmd(Render.context._drawParticle,[pt]);
		}

		return GraphicsGL;
	})(Graphics)


	//class laya.webgl.canvas.WebGLContext2D extends laya.resource.Context
	var WebGLContext2D=(function(_super){
		var ContextParams;
		function WebGLContext2D(c){
			this._x=0;
			this._y=0;
			this._id=++WebGLContext2D._COUNT;
			//this._other=null;
			this._path=null;
			//this._primitiveValue2D=null;
			this._drawCount=1;
			this._maxNumEle=0;
			this._clear=false;
			this._isMain=false;
			this._atlasResourceChange=0;
			this._submits=[];
			this._curSubmit=null;
			this._ib=null;
			this._vb=null;
			//this._curMat=null;
			this._nBlendType=0;
			//this._save=null;
			//this._targets=null;
			//this._renderKey=NaN;
			this._saveMark=null;
			//this.sprite=null;
			this.mId=-1;
			this.mHaveKey=false;
			this.mHaveLineKey=false;
			this.mX=0;
			this.mY=0;
			WebGLContext2D.__super.call(this);
			this._width=99999999;
			this._height=99999999;
			this._clipRect=WebGLContext2D.MAXCLIPRECT;
			this._shader2D=new Shader2D();
			this.mOutPoint
			this._canvas=c;
			this._curMat=Matrix.create();
			if (Render.isFlash){
				this._ib=IndexBuffer2D.create(/*laya.webgl.WebGLContext.STATIC_DRAW*/0x88E4);
				GlUtils.fillIBQuadrangle(this._ib,16);
			}
			else
			this._ib=IndexBuffer2D.QuadrangleIB;
			this._vb=VertexBuffer2D.create(-1);
			this._other=ContextParams.DEFAULT;
			this._save=[SaveMark.Create(this)];
			this._save.length=10;
			this.clear();
		}

		__class(WebGLContext2D,'laya.webgl.canvas.WebGLContext2D',_super);
		var __proto=WebGLContext2D.prototype;
		__proto.setIsMainContext=function(){
			this._isMain=true;
		}

		__proto.clearBG=function(r,g,b,a){
			var gl=WebGL.mainContext;
			gl.clearColor(r,g,b,a);
			gl.clear(/*laya.webgl.WebGLContext.COLOR_BUFFER_BIT*/0x00004000 | /*laya.webgl.WebGLContext.DEPTH_BUFFER_BIT*/0x00000100);
		}

		__proto._getSubmits=function(){
			return this._submits;
		}

		__proto.destroy=function(){
			this._curMat && this._curMat.destroy();
			this._targets && this._targets.destroy();
			this._vb && this._vb.releaseResource();
			this._ib && (this._ib !=IndexBuffer2D.QuadrangleIB)&& this._ib.releaseResource();
		}

		__proto.clear=function(){
			this._vb.clear();
			this._targets && (this._targets.repaint=true);
			this._other=ContextParams.DEFAULT;
			this._clear=true;
			this._repaint=false;
			this._drawCount=1;
			this._renderKey=0;
			this._other.lineWidth=this._shader2D.ALPHA=1.0;
			this._nBlendType=0;
			this._clipRect=WebGLContext2D.MAXCLIPRECT;
			this._curSubmit=Submit.RENDERBASE;
			this._shader2D.glTexture=null;
			this._shader2D.fillStyle=this._shader2D.strokeStyle=DrawStyle.DEFAULT;
			for (var i=0,n=this._submits._length;i < n;i++)
			this._submits[i].releaseRender();
			this._submits._length=0;
			this._curMat.identity();
			this._other.clear();
			this._saveMark=this._save[0];
			this._save._length=1;
		}

		__proto.size=function(w,h){
			this._width=w;
			this._height=h;
			this._targets && (this._targets.size(w,h));
		}

		__proto._getTransformMatrix=function(){
			return this._curMat;
		}

		__proto.translate=function(x,y){
			if (x!==0 || y!==0){
				SaveTranslate.save(this);
				if (this._curMat.bTransform){
					SaveTransform.save(this);
					this._curMat.transformPoint(Point.TEMP.setTo(x,y));
					x=Point.TEMP.x;
					y=Point.TEMP.y;
				}
				this._x+=x;
				this._y+=y;
			}
		}

		__proto.save=function(){
			this._save[this._save._length++]=SaveMark.Create(this);
		}

		__proto.restore=function(){
			var sz=this._save._length;
			if (sz < 1)
				return;
			for (var i=sz-1;i >=0;i--){
				var o=this._save[i];
				o.restore(this);
				if (o.isSaveMark()){
					this._save._length=i;
					return;
				}
			}
		}

		__proto.measureText=function(text){
			return RunDriver.measureText(text,this._other.font.toString());
		}

		__proto._fillText=function(txt,words,x,y,fontStr,color,textAlign){
			var shader=this._shader2D;
			var curShader=this._curSubmit.shaderValue;
			var font=fontStr ? FontInContext.create(fontStr):this._other.font;
			if (AtlasResourceManager.enabled){
				if (shader.ALPHA!==curShader.ALPHA)
					shader.glTexture=null;
				DrawText.drawText(this,txt,words,this._curMat,font,textAlign || this._other.textAlign,color,null,-1,x,y);
			}
			else{
				var preDef=this._shader2D.defines.getValue();
				var colorAdd=color ? Color.create(color)._color :shader.colorAdd;
				if (shader.ALPHA!==curShader.ALPHA || colorAdd!==shader.colorAdd || curShader.colorAdd!==shader.colorAdd){
					shader.glTexture=null;
					shader.colorAdd=colorAdd;
				}
				DrawText.drawText(this,txt,words,this._curMat,font,textAlign || this._other.textAlign,color,null,-1,x,y);
			}
		}

		//shader.defines.setValue(preDef);
		__proto.fillWords=function(words,x,y,fontStr,color){
			words.length > 0 && this._fillText(null,words,x,y,fontStr,color,null);
		}

		__proto.fillText=function(txt,x,y,fontStr,color,textAlign){
			txt.length > 0 && this._fillText(txt,null,x,y,fontStr,color,textAlign);
		}

		__proto.strokeText=function(txt,x,y,fontStr,color,lineWidth,textAlign){
			if (txt.length===0)
				return;
			var shader=this._shader2D;
			var curShader=this._curSubmit.shaderValue;
			var font=fontStr ? (WebGLContext2D._fontTemp.setFont(fontStr),WebGLContext2D._fontTemp):this._other.font;
			if (AtlasResourceManager.enabled){
				if (shader.ALPHA!==curShader.ALPHA){
					shader.glTexture=null;
				}
				DrawText.drawText(this,txt,null,this._curMat,font,textAlign || this._other.textAlign,null,color,lineWidth || 1,x,y);
			}
			else{
				var preDef=this._shader2D.defines.getValue();
				var colorAdd=color ? Color.create(color)._color :shader.colorAdd;
				if (shader.ALPHA!==curShader.ALPHA || colorAdd!==shader.colorAdd || curShader.colorAdd!==shader.colorAdd){
					shader.glTexture=null;
					shader.colorAdd=colorAdd;
				}
				DrawText.drawText(this,txt,null,this._curMat,font,textAlign || this._other.textAlign,null,color,lineWidth || 1,x,y);
			}
		}

		//shader.defines.setValue(preDef);
		__proto.fillBorderText=function(txt,x,y,fontStr,fillColor,borderColor,lineWidth,textAlign){
			if (txt.length===0)
				return;
			if (!AtlasResourceManager.enabled){
				this.strokeText(txt,x,y,fontStr,borderColor,lineWidth,textAlign);
				this.fillText(txt,x,y,fontStr,fillColor,textAlign);
				return;
			};
			var shader=this._shader2D;
			var curShader=this._curSubmit.shaderValue;
			if (shader.ALPHA!==curShader.ALPHA)
				shader.glTexture=null;
			var font=fontStr ? (WebGLContext2D._fontTemp.setFont(fontStr),WebGLContext2D._fontTemp):this._other.font;
			DrawText.drawText(this,txt,null,this._curMat,font,textAlign || this._other.textAlign,fillColor,borderColor,lineWidth || 1,x,y);
		}

		__proto.fillRect=function(x,y,width,height,fillStyle){
			var vb=this._vb;
			if (GlUtils.fillRectImgVb(vb,this._clipRect,x,y,width,height,Texture.DEF_UV,this._curMat,this._x,this._y,0,0)){
				this._renderKey=0;
				var pre=this._shader2D.fillStyle;
				fillStyle && (this._shader2D.fillStyle=DrawStyle.create(fillStyle));
				var shader=this._shader2D;
				var curShader=this._curSubmit.shaderValue;
				if (shader.fillStyle!==curShader.fillStyle || shader.ALPHA!==curShader.ALPHA){
					shader.glTexture=null;
					var submit=this._curSubmit=Submit.create(this,this._ib,vb,((vb._byteLength-16 */*laya.webgl.utils.Buffer2D.FLOAT32*/4)/ 32)*3,Value2D.create(/*laya.webgl.shader.d2.ShaderDefines2D.COLOR2D*/0x02,0));
					submit.shaderValue.color=shader.fillStyle._color._color;
					submit.shaderValue.ALPHA=shader.ALPHA;
					this._submits[this._submits._length++]=submit;
				}
				this._curSubmit._numEle+=6;
				this._shader2D.fillStyle=pre;
			}
		}

		__proto.fillTexture=function(texture,x,y,width,height,type,offset,other){
			var vb=this._vb;
			var w=texture.bitmap.width,h=texture.bitmap.height,uv=texture.uv;
			if (w!=other.w||h!=other.h){
				switch(type){
					case "repeat":
						other.width=width;
						other.height=height;
						break ;
					case "repeat-x":
						other.width=width;
						other.height=texture.height > height?height:texture.height;
						break ;
					case "repeat-y":
						other.width=texture.width > width?width:texture.width;
						other.height=height;
						break ;
					default :
						other.width=width;
						other.height=height;
						break ;
					}
				other.w=w;
				other.h=h;
				other.uv=[0,0,other.width / w,0,other.width / w,other.height / h,0,other.height / h];
			}
			if (GlUtils.fillRectImgVb(vb,this._clipRect,x,y,other.width,other.height,other.uv,this._curMat,this._x,this._y,0,0)){
				this._renderKey=0;
				var submit=this._curSubmit=Submit.create(this,this._ib,vb,((vb._byteLength-16 */*laya.webgl.utils.Buffer2D.FLOAT32*/4)/ 32)*3,Value2D.create(/*laya.webgl.shader.d2.ShaderDefines2D.FILLTEXTURE*/0x100,0));
				this._submits[this._submits._length++]=submit;
				var shaderValue=submit.shaderValue;
				shaderValue.textureHost=texture;
				var tTextureX=uv[0] *w;
				var tTextureY=uv[1] *h;
				var tTextureW=(uv[2]-uv[0])*w;
				var tTextureH=(uv[5]-uv[3])*h;
				var tx=-offset.x / w;
				var ty=-offset.y / h;
				shaderValue.u_TexRange[0]=tTextureX / w;
				shaderValue.u_TexRange[1]=tTextureW / w;
				shaderValue.u_TexRange[2]=tTextureY / h;
				shaderValue.u_TexRange[3]=tTextureH / h;
				shaderValue.u_offset[0]=tx;
				shaderValue.u_offset[1]=ty;
				submit._renderType=/*laya.webgl.submit.Submit.TYPE_TEXTURE*/10016;
				this._curSubmit._numEle+=6;
			}
		}

		__proto.setShader=function(shader){
			SaveBase.save(this,/*laya.webgl.canvas.save.SaveBase.TYPE_SHADER*/0x80000,this._shader2D,true);
			this._shader2D.shader=shader;
		}

		__proto.setFilters=function(value){
			SaveBase.save(this,/*laya.webgl.canvas.save.SaveBase.TYPE_FILTERS*/0x100000,this._shader2D,true);
			this._shader2D.filters=value;
			this._curSubmit=Submit.RENDERBASE;
			this._renderKey=0;
			this._drawCount++;
		}

		__proto.drawTexture=function(tex,x,y,width,height,tx,ty){
			this._drawTextureM(tex,x,y,width,height,tx,ty,null,1);
		}

		__proto.addTextureVb=function(invb,x,y){
			var finalVB=this._curSubmit._vb || this._vb;
			var vpos=(finalVB._byteLength >> 2);
			finalVB.byteLength=((vpos+/*CLASS CONST:laya.webgl.canvas.WebGLContext2D._RECTVBSIZE*/16)<< 2);
			var vbdata=finalVB.getFloat32Array();
			for (var i=0,ci=0;i < 16;i+=4){
				vbdata[vpos++]=invb[i]+x;
				vbdata[vpos++]=invb[i+1]+y;
				vbdata[vpos++]=invb[i+2];
				vbdata[vpos++]=invb[i+3];
			}
			this._curSubmit._numEle+=6;
			this._maxNumEle=Math.max(this._maxNumEle,this._curSubmit._numEle);
			finalVB._upload=true;
		}

		__proto.willDrawTexture=function(tex,alpha){
			if (!(tex.loaded && tex.bitmap && tex.source)){
				if (this.sprite){
					Laya.timer.callLater(this,this._repaintSprite);
				}
				return 0;
			};
			var webGLImg=tex.bitmap;
			var rid=webGLImg.id+this._shader2D.ALPHA*alpha+/*laya.webgl.submit.Submit.TYPE_TEXTURE*/10016;
			if (rid==this._renderKey)return rid;
			var shader=this._shader2D;
			var preAlpha=shader.ALPHA;
			var curShader=this._curSubmit.shaderValue;
			shader.ALPHA *=alpha;
			this._renderKey=rid;
			this._drawCount++;
			shader.glTexture=webGLImg;
			var vb=this._vb;
			var submit=null;
			var vbSize=(vb._byteLength / 32)*3;
			submit=SubmitTexture.create(this,this._ib,vb,vbSize,Value2D.create(/*laya.webgl.shader.d2.ShaderDefines2D.TEXTURE2D*/0x01,0));
			this._submits[this._submits._length++]=submit;
			submit.shaderValue.textureHost=tex;
			submit._renderType=/*laya.webgl.submit.Submit.TYPE_TEXTURE*/10016;
			submit._preIsSameTextureShader=this._curSubmit._renderType===/*laya.webgl.submit.Submit.TYPE_TEXTURE*/10016 && shader.ALPHA===curShader.ALPHA;
			this._curSubmit=submit;
			shader.ALPHA=preAlpha;
			return rid;
		}

		__proto.drawTextures=function(tex,pos,tx,ty){
			if (!(tex.loaded && tex.bitmap && tex.source)){
				this.sprite && Laya.timer.callLater(this,this._repaintSprite);
				return;
			};
			var pre=this._clipRect;
			this._clipRect=WebGLContext2D.MAXCLIPRECT;
			if (!this._drawTextureM(tex,pos[0],pos[1],tex.width,tex.height,tx,ty,null,1)){
				alert("drawTextures err");
				return;
			}
			this._clipRect=pre;
			Stat.drawCall+=pos.length / 2;
			if (pos.length < 4)
				return;
			var finalVB=this._curSubmit._vb || this._vb;
			var sx=this._curMat.a,sy=this._curMat.d;
			for (var i=2,sz=pos.length;i < sz;i+=2){
				GlUtils.copyPreImgVb(finalVB,(pos[i]-pos[i-2])*sx,(pos[i+1]-pos[i-1])*sy);
				this._curSubmit._numEle+=6;
			}
			this._maxNumEle=Math.max(this._maxNumEle,this._curSubmit._numEle);
		}

		__proto._drawTextureM=function(tex,x,y,width,height,tx,ty,m,alpha){
			if (!(tex.loaded && tex.bitmap && tex.source)){
				if (this.sprite){
					Laya.timer.callLater(this,this._repaintSprite);
				}
				return false;
			};
			var finalVB=this._curSubmit._vb || this._vb;
			var webGLImg=tex.bitmap;
			x+=tx;
			y+=ty;
			this._drawCount++;
			var rid=webGLImg.id+this._shader2D.ALPHA *alpha+/*laya.webgl.submit.Submit.TYPE_TEXTURE*/10016;
			if (rid!=this._renderKey){
				this._renderKey=rid;
				var curShader=this._curSubmit.shaderValue;
				var shader=this._shader2D;
				var alphaBack=shader.ALPHA;
				shader.ALPHA *=alpha;
				shader.glTexture=webGLImg;
				var vb=this._vb;
				var submit=null;
				var vbSize=(vb._byteLength / 32)*3;
				submit=SubmitTexture.create(this,this._ib,vb,vbSize,Value2D.create(/*laya.webgl.shader.d2.ShaderDefines2D.TEXTURE2D*/0x01,0));
				this._submits[this._submits._length++]=submit;
				submit.shaderValue.textureHost=tex;
				submit._renderType=/*laya.webgl.submit.Submit.TYPE_TEXTURE*/10016;
				submit._preIsSameTextureShader=this._curSubmit._renderType===/*laya.webgl.submit.Submit.TYPE_TEXTURE*/10016 && shader.ALPHA===curShader.ALPHA;
				this._curSubmit=submit;
				finalVB=this._curSubmit._vb || this._vb;
				shader.ALPHA=alphaBack;
			}
			if (GlUtils.fillRectImgVb(finalVB,this._clipRect,x,y,width || tex.width,height || tex.height,tex.uv,m || this._curMat,this._x,this._y,0,0)){
				if (AtlasResourceManager.enabled && !this._isMain)
					(this._curSubmit).addTexture(tex,(finalVB._byteLength >> 2)-/*CLASS CONST:laya.webgl.canvas.WebGLContext2D._RECTVBSIZE*/16);
				this._curSubmit._numEle+=6;
				this._maxNumEle=Math.max(this._maxNumEle,this._curSubmit._numEle);
				return true;
			}
			return false;
		}

		__proto._repaintSprite=function(){
			this.sprite.repaint();
		}

		//}
		__proto._drawText=function(tex,x,y,width,height,m,tx,ty,dx,dy){
			var webGLImg=tex.bitmap;
			this._drawCount++;
			var rid=webGLImg.id+this._shader2D.ALPHA+/*laya.webgl.submit.Submit.TYPE_TEXTURE*/10016;
			if (rid!=this._renderKey){
				this._renderKey=rid;
				var curShader=this._curSubmit.shaderValue;
				var shader=this._shader2D;
				shader.glTexture=webGLImg;
				var vb=this._vb;
				var submit=null;
				var submitID=NaN;
				var vbSize=(vb._byteLength / 32)*3;
				if (AtlasResourceManager.enabled){
					submit=SubmitTexture.create(this,this._ib,vb,vbSize,Value2D.create(/*laya.webgl.shader.d2.ShaderDefines2D.TEXTURE2D*/0x01,0));
				}
				else{
					submit=SubmitTexture.create(this,this._ib,vb,vbSize,TextSV.create());
				}
				submit._preIsSameTextureShader=this._curSubmit._renderType===/*laya.webgl.submit.Submit.TYPE_TEXTURE*/10016 && shader.ALPHA===curShader.ALPHA;
				this._submits[this._submits._length++]=submit;
				submit.shaderValue.textureHost=tex;
				submit._renderType=/*laya.webgl.submit.Submit.TYPE_TEXTURE*/10016;
				this._curSubmit=submit;
			}
			tex.active();
			var finalVB=this._curSubmit._vb || this._vb;
			if (GlUtils.fillRectImgVb(finalVB,this._clipRect,x+tx,y+ty,width || tex.width,height || tex.height,tex.uv,m || this._curMat,this._x,this._y,dx,dy,true)){
				if (AtlasResourceManager.enabled && !this._isMain){
					(this._curSubmit).addTexture(tex,(finalVB._byteLength >> 2)-/*CLASS CONST:laya.webgl.canvas.WebGLContext2D._RECTVBSIZE*/16);
				}
				this._curSubmit._numEle+=6;
				this._maxNumEle=Math.max(this._maxNumEle,this._curSubmit._numEle);
			}
		}

		__proto.drawTextureWithTransform=function(tex,x,y,width,height,transform,tx,ty,alpha){
			var curMat=this._curMat;
			(tx!==0 || ty!==0)&& (this._x=tx *curMat.a+ty *curMat.c,this._y=ty *curMat.d+tx *curMat.b);
			if (transform && curMat.bTransform){
				Matrix.mul(transform,curMat,WebGLContext2D._tmpMatrix);
				transform=WebGLContext2D._tmpMatrix;
				transform._checkTransform();
			}
			else{
				this._x+=curMat.tx;
				this._y+=curMat.ty;
			}
			this._drawTextureM(tex,x,y,width,height,0,0,transform,alpha);
			this._x=this._y=0;
		}

		__proto.fillQuadrangle=function(tex,x,y,point4,m){
			var submit=this._curSubmit;
			var vb=this._vb;
			var shader=this._shader2D;
			var curShader=submit.shaderValue;
			this._renderKey=0;
			if (tex.bitmap){
				var t_tex=tex.bitmap;
				if (shader.glTexture !=t_tex || shader.ALPHA!==curShader.ALPHA){
					shader.glTexture=t_tex;
					submit=this._curSubmit=Submit.create(this,this._ib,vb,((vb._byteLength)/ 32)*3,Value2D.create(/*laya.webgl.shader.d2.ShaderDefines2D.TEXTURE2D*/0x01,0));
					submit.shaderValue.glTexture=t_tex;
					this._submits[this._submits._length++]=submit;
				}
				GlUtils.fillQuadrangleImgVb(vb,x,y,point4,tex.uv,m || this._curMat,this._x,this._y);
			}
			else{
				if (!submit.shaderValue.fillStyle || !submit.shaderValue.fillStyle.equal(tex)|| shader.ALPHA!==curShader.ALPHA){
					shader.glTexture=null;
					submit=this._curSubmit=Submit.create(this,this._ib,vb,((vb._byteLength)/ 32)*3,Value2D.create(/*laya.webgl.shader.d2.ShaderDefines2D.COLOR2D*/0x02,0));
					submit.shaderValue.defines.add(/*laya.webgl.shader.d2.ShaderDefines2D.COLOR2D*/0x02);
					submit.shaderValue.fillStyle=DrawStyle.create(tex);
					this._submits[this._submits._length++]=submit;
				}
				GlUtils.fillQuadrangleImgVb(vb,x,y,point4,Texture.DEF_UV,m || this._curMat,this._x,this._y);
			}
			submit._numEle+=6;
		}

		__proto.drawTexture2=function(x,y,pivotX,pivotY,transform,alpha,blendMode,args){
			var curMat=this._curMat;
			this._x=x *curMat.a+y *curMat.c;
			this._y=y *curMat.d+x *curMat.b;
			if (transform){
				if (curMat.bTransform || transform.bTransform){
					Matrix.mul(transform,curMat,WebGLContext2D._tmpMatrix);
					transform=WebGLContext2D._tmpMatrix;
				}
				else{
					this._x+=transform.tx+curMat.tx;
					this._y+=transform.ty+curMat.ty;
					transform=Matrix.EMPTY;
				}
			}
			if (alpha===1 && !blendMode)
				this._drawTextureM(args[0],args[1]-pivotX,args[2]-pivotY,args[3],args[4],0,0,transform,1);
			else{
				var preAlpha=this._shader2D.ALPHA;
				var preblendType=this._nBlendType;
				this._shader2D.ALPHA=alpha;
				blendMode && (this._nBlendType=BlendMode.TOINT(blendMode));
				this._drawTextureM(args[0],args[1]-pivotX,args[2]-pivotY,args[3],args[4],0,0,transform,1);
				this._shader2D.ALPHA=preAlpha;
				this._nBlendType=preblendType;
			}
			this._x=this._y=0;
		}

		__proto.drawCanvas=function(canvas,x,y,width,height){
			var src=canvas.context;
			this._renderKey=0;
			if (src._targets){
				this._submits[this._submits._length++]=SubmitCanvas.create(src,0,null);
				this._curSubmit=Submit.RENDERBASE;
				src._targets.drawTo(this,x,y,width,height);
			}
			else{
				var submit=this._submits[this._submits._length++]=SubmitCanvas.create(src,this._shader2D.ALPHA,this._shader2D.filters);
				var sx=width / canvas.width;
				var sy=height / canvas.height;
				var mat=submit._matrix;
				this._curMat.copyTo(mat);
				sx !=1 && sy !=1 && mat.scale(sx,sy);
				var tx=mat.tx,ty=mat.ty;
				mat.tx=mat.ty=0;
				mat.transformPoint(Point.TEMP.setTo(x,y));
				mat.translate(Point.TEMP.x+tx,Point.TEMP.y+ty);
				this._curSubmit=Submit.RENDERBASE;
			}
			if (Config.showCanvasMark){
				this.save();
				this.lineWidth=4;
				this.strokeStyle=src._targets ? "yellow" :"green";
				this.strokeRect(x-1,y-1,width+2,height+2,1);
				this.strokeRect(x,y,width,height,1);
				this.restore();
			}
		}

		__proto.drawTarget=function(scope,x,y,width,height,m,proName,shaderValue,uv,blend){
			(blend===void 0)&& (blend=-1);
			var vb=this._vb;
			if (GlUtils.fillRectImgVb(vb,this._clipRect,x,y,width,height,uv || Texture.DEF_UV,m || this._curMat,this._x,this._y,0,0)){
				this._renderKey=0;
				var shader=this._shader2D;
				shader.glTexture=null;
				var curShader=this._curSubmit.shaderValue;
				var submit=this._curSubmit=SubmitTarget.create(this,this._ib,vb,((vb._byteLength-16 */*laya.webgl.utils.Buffer2D.FLOAT32*/4)/ 32)*3,shaderValue,proName);
				if (blend==-1){
					submit.blendType=this._nBlendType;
				}
				else{
					submit.blendType=blend;
				}
				submit.scope=scope;
				this._submits[this._submits._length++]=submit;
				this._curSubmit._numEle+=6;
			}
		}

		__proto.transform=function(a,b,c,d,tx,ty){
			SaveTransform.save(this);
			Matrix.mul(Matrix.TEMP.setTo(a,b,c,d,tx,ty),this._curMat,this._curMat);
			this._curMat._checkTransform();
		}

		__proto.setTransformByMatrix=function(value){
			value.copyTo(this._curMat);
		}

		__proto.transformByMatrix=function(value){
			SaveTransform.save(this);
			Matrix.mul(value,this._curMat,this._curMat);
			this._curMat._checkTransform();
		}

		__proto.rotate=function(angle){
			SaveTransform.save(this);
			this._curMat.rotateEx(angle);
		}

		__proto.scale=function(scaleX,scaleY){
			SaveTransform.save(this);
			this._curMat.scaleEx(scaleX,scaleY);
		}

		__proto.clipRect=function(x,y,width,height){
			width *=this._curMat.a;
			height *=this._curMat.d;
			var p=Point.TEMP;
			this._curMat.transformPoint(p.setTo(x,y));
			this._renderKey=0;
			var submit=this._curSubmit=SubmitScissor.create(this);
			this._submits[this._submits._length++]=submit;
			submit.submitIndex=this._submits._length;
			submit.submitLength=9999999;
			SaveClipRect.save(this,submit);
			var clip=this._clipRect;
			var x1=clip.x,y1=clip.y;
			var r=p.x+width,b=p.y+height;
			x1 < p.x && (clip.x=p.x);
			y1 < p.y && (clip.y=p.y);
			clip.width=Math.min(r,x1+clip.width)-clip.x;
			clip.height=Math.min(b,y1+clip.height)-clip.y;
			this._shader2D.glTexture=null;
			submit.clipRect.copyFrom(clip);
			this._curSubmit=Submit.RENDERBASE;
		}

		__proto.setIBVB=function(x,y,ib,vb,numElement,mat,shader,shaderValues,startIndex,offset,type){
			(startIndex===void 0)&& (startIndex=0);
			(offset===void 0)&& (offset=0);
			(type===void 0)&& (type=0);
			if (ib===null){
				if (!Render.isFlash){
					ib=this._ib;
				}
				else{
					var falshVB=vb;
					(falshVB._selfIB)|| (falshVB._selfIB=IndexBuffer2D.create(/*laya.webgl.WebGLContext.STATIC_DRAW*/0x88E4));
					falshVB._selfIB.clear();
					ib=falshVB._selfIB;
				}
				GlUtils.expandIBQuadrangle(ib,(vb.byteLength / (/*laya.webgl.utils.Buffer2D.FLOAT32*/4 *vb.vertexStride *4)));
			}
			if (!shaderValues || !shader)
				throw Error("setIBVB must input:shader shaderValues");
			var submit=SubmitOtherIBVB.create(this,vb,ib,numElement,shader,shaderValues,startIndex,offset,type);
			mat || (mat=Matrix.EMPTY);
			mat.translate(x,y);
			Matrix.mul(mat,this._curMat,submit._mat);
			mat.translate(-x,-y);
			this._submits[this._submits._length++]=submit;
			this._curSubmit=Submit.RENDERBASE;
			this._renderKey=0;
		}

		__proto.addRenderObject=function(o){
			this._submits[this._submits._length++]=o;
		}

		__proto.fillTrangles=function(tex,x,y,points,m){
			var submit=this._curSubmit;
			var vb=this._vb;
			var shader=this._shader2D;
			var curShader=submit.shaderValue;
			var length=points.length >> 4;
			var t_tex=tex.bitmap;
			this._renderKey=0;
			if (shader.glTexture !=t_tex || shader.ALPHA!==curShader.ALPHA){
				submit=this._curSubmit=Submit.create(this,this._ib,vb,((vb._byteLength)/ 32)*3,Value2D.create(/*laya.webgl.shader.d2.ShaderDefines2D.TEXTURE2D*/0x01,0));
				submit.shaderValue.textureHost=tex;
				this._submits[this._submits._length++]=submit;
			}
			GlUtils.fillTranglesVB(vb,x,y,points,m || this._curMat,this._x,this._y);
			submit._numEle+=length *6;
		}

		__proto.submitElement=function(start,end){
			var renderList=this._submits;
			end < 0 && (end=renderList._length);
			while (start < end){
				start+=renderList[start].renderSubmit();
			}
		}

		__proto.finish=function(){
			WebGL.mainContext.finish();
		}

		__proto.flush=function(){
			var maxNum=Math.max(this._vb.byteLength / (/*laya.webgl.utils.Buffer2D.FLOAT32*/4 *16),this._maxNumEle / 6)+8;
			if (maxNum > (this._ib.bufferLength / (6 */*laya.webgl.utils.Buffer2D.SHORT*/2))){
				GlUtils.expandIBQuadrangle(this._ib,maxNum);
			}
			if (!this._isMain && AtlasResourceManager.enabled && AtlasResourceManager._atlasRestore > this._atlasResourceChange){
				this._atlasResourceChange=AtlasResourceManager._atlasRestore;
				var renderList=this._submits;
				for (var i=0,s=renderList._length;i < s;i++){
					var submit=renderList [i];
					if (submit.getRenderType()===/*laya.webgl.submit.Submit.TYPE_TEXTURE*/10016)
						(submit).checkTexture();
				}
			}
			this.submitElement(0,this._submits._length);
			this._path && this._path.reset();
			SkinMeshBuffer.instance && SkinMeshBuffer.getInstance().reset();
			this._curSubmit=Submit.RENDERBASE;
			this._renderKey=0;
			return this._submits._length;
		}

		__proto.setPathId=function(id){
			this.mId=id;
			if (this.mId !=-1){
				this.mHaveKey=false;
				var tVGM=VectorGraphManager.getInstance();
				if (tVGM.shapeDic[this.mId]){
					this.mHaveKey=true;
				}
				this.mHaveLineKey=false;
				if (tVGM.shapeLineDic[this.mId]){
					this.mHaveLineKey=true;
				}
			}
		}

		__proto.movePath=function(x,y){
			this.mX+=x;
			this.mY+=y;
		}

		__proto.beginPath=function(){
			var tPath=this._getPath();
			tPath.tempArray.length=0;
			tPath.closePath=false;
			this.mX=0;
			this.mY=0;
		}

		__proto.closePath=function(){
			this._path.closePath=true;
		}

		__proto.fill=function(isConvexPolygon){
			(isConvexPolygon===void 0)&& (isConvexPolygon=false);
			var tPath=this._getPath();
			this.drawPoly(0,0,tPath.tempArray,this.fillStyle._color.numColor,0,0,isConvexPolygon);
		}

		__proto.stroke=function(){
			var tPath=this._getPath();
			if (this.lineWidth > 0){
				if (this.mId==-1){
					tPath.drawLine(0,0,tPath.tempArray,this.lineWidth,this.strokeStyle._color.numColor);
				}
				else{
					if (this.mHaveLineKey){
						var tShapeLine=VectorGraphManager.getInstance().shapeLineDic[this.mId];
						tPath.setGeomtry(tShapeLine);
					}
					else{
						VectorGraphManager.getInstance().addLine(this.mId,tPath.drawLine(0,0,tPath.tempArray,this.lineWidth,this.strokeStyle._color.numColor));
					}
				}
				tPath.update();
				var tArray=RenderState2D.getMatrArray();
				RenderState2D.mat2MatArray(this._curMat,tArray);
				var tPosArray=[this.mX,this.mY];
				var tempSubmit=Submit.createShape(this,tPath.ib,tPath.vb,tPath.count,tPath.offset,Value2D.create(/*laya.webgl.shader.d2.ShaderDefines2D.PRIMITIVE*/0x04,0));
				tempSubmit.shaderValue.ALPHA=this._shader2D.ALPHA;
				(tempSubmit.shaderValue).u_pos=tPosArray;
				tempSubmit.shaderValue.u_mmat2=tArray;
				this._submits[this._submits._length++]=tempSubmit;
			}
		}

		__proto.line=function(fromX,fromY,toX,toY,lineWidth,mat){
			var submit=this._curSubmit;
			var vb=this._vb;
			if (GlUtils.fillLineVb(vb,this._clipRect,fromX,fromY,toX,toY,lineWidth,mat)){
				this._renderKey=0;
				var shader=this._shader2D;
				var curShader=submit.shaderValue;
				if (shader.strokeStyle!==curShader.strokeStyle || shader.ALPHA!==curShader.ALPHA){
					shader.glTexture=null;
					submit=this._curSubmit=Submit.create(this,this._ib,vb,((vb._byteLength-16 */*laya.webgl.utils.Buffer2D.FLOAT32*/4)/ 32)*3,Value2D.create(/*laya.webgl.shader.d2.ShaderDefines2D.COLOR2D*/0x02,0));
					submit.shaderValue.strokeStyle=shader.strokeStyle;
					submit.shaderValue.mainID=/*laya.webgl.shader.d2.ShaderDefines2D.COLOR2D*/0x02;
					submit.shaderValue.ALPHA=shader.ALPHA;
					this._submits[this._submits._length++]=submit;
				}
				submit._numEle+=6;
			}
		}

		__proto.moveTo=function(x,y){
			var tPath=this._getPath();
			tPath.addPoint(x,y);
		}

		__proto.lineTo=function(x,y){
			var tPath=this._getPath();
			tPath.addPoint(x,y);
		}

		__proto.arcTo=function(x1,y1,x2,y2,r){
			if (this.mId !=-1){
				if (this.mHaveKey){
					return;
				}
			};
			var tPath=this._getPath();
			var x0=tPath.getEndPointX();
			var y0=tPath.getEndPointY();
			var dx0=NaN,dy0=NaN,dx1=NaN,dy1=NaN,a=NaN,d=NaN,cx=NaN,cy=NaN,a0=NaN,a1=NaN;
			var dir=false;
			dx0=x0-x1;
			dy0=y0-y1;
			dx1=x2-x1;
			dy1=y2-y1;
			Point.TEMP.setTo(dx0,dy0);
			Point.TEMP.normalize();
			dx0=Point.TEMP.x;
			dy0=Point.TEMP.y;
			Point.TEMP.setTo(dx1,dy1);
			Point.TEMP.normalize();
			dx1=Point.TEMP.x;
			dy1=Point.TEMP.y;
			a=Math.acos(dx0 *dx1+dy0 *dy1);
			var tTemp=Math.tan(a / 2.0);
			d=r / tTemp;
			if (d > 10000){
				this.lineTo(x1,y1);
				return;
			}
			if (dx0 *dy1-dx1 *dy0 <=0.0){
				cx=x1+dx0 *d+dy0 *r;
				cy=y1+dy0 *d-dx0 *r;
				a0=Math.atan2(dx0,-dy0);
				a1=Math.atan2(-dx1,dy1);
				dir=false;
			}
			else{
				cx=x1+dx0 *d-dy0 *r;
				cy=y1+dy0 *d+dx0 *r;
				a0=Math.atan2(-dx0,dy0);
				a1=Math.atan2(dx1,-dy1);
				dir=true;
			}
			this.arc(cx,cy,r,a0,a1,dir);
		}

		__proto.arc=function(cx,cy,r,startAngle,endAngle,counterclockwise){
			(counterclockwise===void 0)&& (counterclockwise=false);
			if (this.mId !=-1){
				if (this.mHaveKey){
					return;
				}
				cx=0;
				cy=0;
			};
			var a=0,da=0,hda=0,kappa=0;
			var dx=0,dy=0,x=0,y=0,tanx=0,tany=0;
			var px=0,py=0,ptanx=0,ptany=0;
			var i=0,ndivs=0,nvals=0;
			da=endAngle-startAngle;
			if (!counterclockwise){
				if (Math.abs(da)>=Math.PI *2){
					da=Math.PI *2;
				}
				else{
					while (da < 0.0){
						da+=Math.PI *2;
					}
				}
			}
			else{
				if (Math.abs(da)>=Math.PI *2){
					da=-Math.PI *2;
				}
				else{
					while (da > 0.0){
						da-=Math.PI *2;
					}
				}
			}
			if (r < 101){
				ndivs=Math.max(10,da *r / 5);
			}
			else if (r < 201){
				ndivs=Math.max(10,da *r / 20);
			}
			else{
				ndivs=Math.max(10,da *r / 40);
			}
			hda=(da / ndivs)/ 2.0;
			kappa=Math.abs(4 / 3 *(1-Math.cos(hda))/ Math.sin(hda));
			if (counterclockwise)
				kappa=-kappa;
			nvals=0;
			var tPath=this._getPath();
			for (i=0;i <=ndivs;i++){
				a=startAngle+da *(i / ndivs);
				dx=Math.cos(a);
				dy=Math.sin(a);
				x=cx+dx *r;
				y=cy+dy *r;
				if (x !=this._path.getEndPointX()|| y !=this._path.getEndPointY()){
					tPath.addPoint(x,y);
				}
			}
			dx=Math.cos(endAngle);
			dy=Math.sin(endAngle);
			x=cx+dx *r;
			y=cy+dy *r;
			if (x !=this._path.getEndPointX()|| y !=this._path.getEndPointY()){
				tPath.addPoint(x,y);
			}
		}

		__proto.quadraticCurveTo=function(cpx,cpy,x,y){
			var tBezier=Bezier.I;
			var tResultArray=[];
			var tArray=tBezier.getBezierPoints([this._path.getEndPointX(),this._path.getEndPointY(),cpx,cpy,x,y],30,2);
			for (var i=0,n=tArray.length / 2;i < n;i++){
				this.lineTo(tArray[i *2],tArray[i *2+1]);
			}
			this.lineTo(x,y);
		}

		__proto.rect=function(x,y,width,height){
			this._other=this._other.make();
			this._other.path || (this._other.path=new Path());
			this._other.path.rect(x,y,width,height);
		}

		__proto.strokeRect=function(x,y,width,height,parameterLineWidth){
			var tW=parameterLineWidth *0.5;
			this.line(x-tW,y,x+width+tW,y,parameterLineWidth,this._curMat);
			this.line(x+width,y,x+width,y+height,parameterLineWidth,this._curMat);
			this.line(x,y,x,y+height,parameterLineWidth,this._curMat);
			this.line(x-tW,y+height,x+width+tW,y+height,parameterLineWidth,this._curMat);
		}

		__proto.clip=function(){}
		/**
		*????????????(???)
		*@param x
		*@param y
		*@param points
		*/
		__proto.drawPoly=function(x,y,points,color,lineWidth,boderColor,isConvexPolygon){
			(isConvexPolygon===void 0)&& (isConvexPolygon=false);
			this._renderKey=0;
			this._shader2D.glTexture=null;
			var tPath=this._getPath();
			if (this.mId==-1){
				tPath.polygon(x,y,points,color,lineWidth ? lineWidth :1,boderColor)
			}
			else{
				if (this.mHaveKey){
					var tShape=VectorGraphManager.getInstance().shapeDic[this.mId];
					tPath.setGeomtry(tShape);
				}
				else{
					VectorGraphManager.getInstance().addShape(this.mId,tPath.polygon(x,y,points,color,lineWidth ? lineWidth :1,boderColor));
				}
			}
			tPath.update();
			var tPosArray=[this.mX,this.mY];
			var tArray=RenderState2D.getMatrArray();
			RenderState2D.mat2MatArray(this._curMat,tArray);
			var tempSubmit;
			if (!isConvexPolygon){
				var submit=SubmitStencil.create(4);
				this.addRenderObject(submit);
				tempSubmit=Submit.createShape(this,tPath.ib,tPath.vb,tPath.count,tPath.offset,Value2D.create(/*laya.webgl.shader.d2.ShaderDefines2D.PRIMITIVE*/0x04,0));
				tempSubmit.shaderValue.ALPHA=this._shader2D.ALPHA;
				(tempSubmit.shaderValue).u_pos=tPosArray;
				tempSubmit.shaderValue.u_mmat2=tArray;
				this._submits[this._submits._length++]=tempSubmit;
				submit=SubmitStencil.create(5);
				this.addRenderObject(submit);
			}
			tempSubmit=Submit.createShape(this,tPath.ib,tPath.vb,tPath.count,tPath.offset,Value2D.create(/*laya.webgl.shader.d2.ShaderDefines2D.PRIMITIVE*/0x04,0));
			tempSubmit.shaderValue.ALPHA=this._shader2D.ALPHA;
			(tempSubmit.shaderValue).u_pos=tPosArray;
			tempSubmit.shaderValue.u_mmat2=tArray;
			this._submits[this._submits._length++]=tempSubmit;
			if (!isConvexPolygon){
				submit=SubmitStencil.create(3);
				this.addRenderObject(submit);
			}
			if (lineWidth > 0){
				if (this.mHaveLineKey){
					var tShapeLine=VectorGraphManager.getInstance().shapeLineDic[this.mId];
					tPath.setGeomtry(tShapeLine);
				}
				else{
					VectorGraphManager.getInstance().addShape(this.mId,tPath.drawLine(x,y,points,lineWidth,boderColor));
				}
				tPath.update();
				tempSubmit=Submit.createShape(this,tPath.ib,tPath.vb,tPath.count,tPath.offset,Value2D.create(/*laya.webgl.shader.d2.ShaderDefines2D.PRIMITIVE*/0x04,0));
				tempSubmit.shaderValue.ALPHA=this._shader2D.ALPHA;
				tempSubmit.shaderValue.u_mmat2=tArray;
				this._submits[this._submits._length++]=tempSubmit;
			}
		}

		/*******************************************end????????????***************************************************/
		__proto.drawParticle=function(x,y,pt){
			pt.x=x;
			pt.y=y;
			this._submits[this._submits._length++]=pt;
		}

		__proto._getPath=function(){
			return this._path || (this._path=new Path());
		}

		/*,_shader2D.ALPHA=1*/
		__getset(0,__proto,'globalCompositeOperation',function(){
			return BlendMode.NAMES[this._nBlendType];
			},function(value){
			var n=BlendMode.TOINT[value];
			n==null || (this._nBlendType===n)|| (SaveBase.save(this,/*laya.webgl.canvas.save.SaveBase.TYPE_GLOBALCOMPOSITEOPERATION*/0x10000,this,true),this._curSubmit=Submit.RENDERBASE,this._renderKey=0,this._nBlendType=n);
		});

		__getset(0,__proto,'strokeStyle',function(){
			return this._shader2D.strokeStyle;
			},function(value){
			this._shader2D.strokeStyle.equal(value)|| (SaveBase.save(this,/*laya.webgl.canvas.save.SaveBase.TYPE_STROKESTYLE*/0x200,this._shader2D,false),this._shader2D.strokeStyle=DrawStyle.create(value));
		});

		__getset(0,__proto,'globalAlpha',function(){
			return this._shader2D.ALPHA;
			},function(value){
			value=Math.floor(value *1000)/ 1000;
			if (value !=this._shader2D.ALPHA){
				SaveBase.save(this,/*laya.webgl.canvas.save.SaveBase.TYPE_ALPHA*/0x1,this._shader2D,true);
				this._shader2D.ALPHA=value;
			}
		});

		__getset(0,__proto,'asBitmap',null,function(value){
			if (value){
				this._targets || (this._targets=new RenderTargetMAX());
				this._targets.repaint=true;
				if (!this._width || !this._height)
					throw Error("asBitmap no size!");
				this._targets.size(this._width,this._height);
			}
			else
			this._targets=null;
		});

		__getset(0,__proto,'fillStyle',function(){
			return this._shader2D.fillStyle;
			},function(value){
			this._shader2D.fillStyle.equal(value)|| (SaveBase.save(this,/*laya.webgl.canvas.save.SaveBase.TYPE_FILESTYLE*/0x2,this._shader2D,false),this._shader2D.fillStyle=DrawStyle.create(value));
		});

		__getset(0,__proto,'textAlign',function(){
			return this._other.textAlign;
			},function(value){
			(this._other.textAlign===value)|| (this._other=this._other.make(),SaveBase.save(this,/*laya.webgl.canvas.save.SaveBase.TYPE_TEXTALIGN*/0x8000,this._other,false),this._other.textAlign=value);
		});

		__getset(0,__proto,'lineWidth',function(){
			return this._other.lineWidth;
			},function(value){
			(this._other.lineWidth===value)|| (this._other=this._other.make(),SaveBase.save(this,/*laya.webgl.canvas.save.SaveBase.TYPE_LINEWIDTH*/0x100,this._other,false),this._other.lineWidth=value);
		});

		__getset(0,__proto,'textBaseline',function(){
			return this._other.textBaseline;
			},function(value){
			(this._other.textBaseline===value)|| (this._other=this._other.make(),SaveBase.save(this,/*laya.webgl.canvas.save.SaveBase.TYPE_TEXTBASELINE*/0x4000,this._other,false),this._other.textBaseline=value);
		});

		__getset(0,__proto,'font',null,function(str){
			if (str==this._other.font.toString())
				return;
			this._other=this._other.make();
			SaveBase.save(this,/*laya.webgl.canvas.save.SaveBase.TYPE_FONT*/0x8,this._other,false);
			this._other.font===FontInContext.EMPTY ? (this._other.font=new FontInContext(str)):(this._other.font.setFont(str));
		});

		WebGLContext2D.__init__=function(){
			ContextParams.DEFAULT=new ContextParams();
		}

		WebGLContext2D._SUBMITVBSIZE=32000;
		WebGLContext2D._MAXSIZE=99999999;
		WebGLContext2D._RECTVBSIZE=16;
		WebGLContext2D.MAXCLIPRECT=new Rectangle(0,0,99999999,99999999);
		WebGLContext2D._COUNT=0;
		WebGLContext2D._tmpMatrix=new Matrix();
		__static(WebGLContext2D,
		['_fontTemp',function(){return this._fontTemp=new FontInContext();},'_drawStyleTemp',function(){return this._drawStyleTemp=new DrawStyle(null);}
		]);
		WebGLContext2D.__init$=function(){
			//class ContextParams
			ContextParams=(function(){
				function ContextParams(){
					this.lineWidth=1;
					this.path=null;
					this.textAlign=null;
					this.textBaseline=null;
					this.font=FontInContext.EMPTY;
				}
				__class(ContextParams,'');
				var __proto=ContextParams.prototype;
				__proto.clear=function(){
					this.lineWidth=1;
					this.path && this.path.clear();
					this.textAlign=this.textBaseline=null;
					this.font=FontInContext.EMPTY;
				}
				__proto.make=function(){
					return this===ContextParams.DEFAULT ? new ContextParams():this;
				}
				ContextParams.DEFAULT=null
				return ContextParams;
			})()
		}

		return WebGLContext2D;
	})(Context)


	//class laya.webgl.shader.d2.value.Value2D extends laya.webgl.shader.ShaderValue
	var Value2D=(function(_super){
		function Value2D(mainID,subID){
			this.size=[0,0];
			this.alpha=1.0;
			//this.mmat=null;
			this.ALPHA=1.0;
			//this.shader=null;
			//this.mainID=0;
			this.subID=0;
			//this.filters=null;
			//this.textureHost=null;
			//this.texture=null;
			//this.fillStyle=null;
			//this.color=null;
			//this.strokeStyle=null;
			//this.colorAdd=null;
			//this.glTexture=null;
			//this.u_mmat2=null;
			//this._inClassCache=null;
			this._cacheID=0;
			Value2D.__super.call(this);
			this.defines=new ShaderDefines2D();
			this.position=Value2D._POSITION;
			this.mainID=mainID;
			this.subID=subID;
			this.textureHost=null;
			this.texture=null;
			this.fillStyle=null;
			this.color=null;
			this.strokeStyle=null;
			this.colorAdd=null;
			this.glTexture=null;
			this.u_mmat2=null;
			this._cacheID=mainID|subID;
			this._inClassCache=Value2D._cache[this._cacheID];
			if (mainID>0 && !this._inClassCache){
				this._inClassCache=Value2D._cache[this._cacheID]=[];
				this._inClassCache._length=0;
			}
			this.clear();
		}

		__class(Value2D,'laya.webgl.shader.d2.value.Value2D',_super);
		var __proto=Value2D.prototype;
		__proto.setValue=function(value){}
		//throw new Error("todo in subclass");
		__proto.refresh=function(){
			var size=this.size;
			size[0]=RenderState2D.width;
			size[1]=RenderState2D.height;
			this.alpha=this.ALPHA *RenderState2D.worldAlpha;
			this.mmat=RenderState2D.worldMatrix4;
			return this;
		}

		__proto._ShaderWithCompile=function(){
			return Shader.withCompile2D(0,this.mainID,this.defines.toNameDic(),this.mainID | this.defines._value,Shader2X.create);
		}

		__proto._withWorldShaderDefines=function(){
			var defs=RenderState2D.worldShaderDefines;
			var sd=Shader.sharders [this.mainID | this.defines._value | defs.getValue()];
			if (!sd){
				var def={};
				var dic;
				var name;
				dic=this.defines.toNameDic();for (name in dic)def[name]="";
				dic=defs.toNameDic();for (name in dic)def[name]="";
				sd=Shader.withCompile2D(0,this.mainID,def,this.mainID | this.defines._value| defs.getValue(),Shader2X.create);
			};
			var worldFilters=RenderState2D.worldFilters;
			if (!worldFilters)return sd;
			var n=worldFilters.length,f;
			for (var i=0;i < n;i++){
				((f=worldFilters[i]))&& f.action.setValue(this);
			}
			return sd;
		}

		__proto.upload=function(){
			var renderstate2d=RenderState2D;
			this.alpha=this.ALPHA *renderstate2d.worldAlpha;
			if (RenderState2D.worldMatrix4!==RenderState2D.TEMPMAT4_ARRAY)this.defines.add(/*laya.webgl.shader.d2.ShaderDefines2D.WORLDMAT*/0x80);
			var sd=renderstate2d.worldShaderDefines?this._withWorldShaderDefines():(Shader.sharders [this.mainID | this.defines._value] || this._ShaderWithCompile());
			var params;
			this.size[0]=renderstate2d.width,this.size[1]=renderstate2d.height;
			this.mmat=renderstate2d.worldMatrix4;
			if (Shader.activeShader!==sd){
				if (sd._shaderValueWidth!==renderstate2d.width || sd._shaderValueHeight!==renderstate2d.height){
					sd._shaderValueWidth=renderstate2d.width;
					sd._shaderValueHeight=renderstate2d.height;
				}
				else{
					params=sd._params2dQuick2 || sd._make2dQuick2();
				}
				sd.upload(this,params);
			}
			else{
				if (sd._shaderValueWidth!==renderstate2d.width || sd._shaderValueHeight!==renderstate2d.height){
					sd._shaderValueWidth=renderstate2d.width;
					sd._shaderValueHeight=renderstate2d.height;
				}
				else{
					params=(sd._params2dQuick1)|| sd._make2dQuick1();
				}
				sd.upload(this,params);
			}
		}

		__proto.setFilters=function(value){
			this.filters=value;
			if (!value)
				return;
			var n=value.length,f;
			for (var i=0;i < n;i++){
				f=value[i];
				if (f){
					this.defines.add(f.type);
					f.action.setValue(this);
				}
			}
		}

		__proto.clear=function(){
			this.defines.setValue(this.subID);
		}

		__proto.release=function(){
			this._inClassCache[this._inClassCache._length++]=this;
			this.fillStyle=null;
			this.strokeStyle=null;
			this.clear();
		}

		Value2D._initone=function(type,classT){
			Value2D._typeClass[type]=classT;
			Value2D._cache[type]=[];
			Value2D._cache[type]._length=0;
		}

		Value2D.__init__=function(){
			Value2D._POSITION=[2,/*laya.webgl.WebGLContext.FLOAT*/0x1406,false,4 *CONST3D2D.BYTES_PE,0];
			Value2D._TEXCOORD=[2,/*laya.webgl.WebGLContext.FLOAT*/0x1406,false,4 *CONST3D2D.BYTES_PE,2 *CONST3D2D.BYTES_PE];
			Value2D._initone(/*laya.webgl.shader.d2.ShaderDefines2D.COLOR2D*/0x02,Color2dSV);
			Value2D._initone(/*laya.webgl.shader.d2.ShaderDefines2D.PRIMITIVE*/0x04,PrimitiveSV);
			Value2D._initone(/*laya.webgl.shader.d2.ShaderDefines2D.FILLTEXTURE*/0x100,FillTextureSV);
			Value2D._initone(/*laya.webgl.shader.d2.ShaderDefines2D.SKINMESH*/0x200,SkinSV);
			Value2D._initone(/*laya.webgl.shader.d2.ShaderDefines2D.TEXTURE2D*/0x01,TextureSV);
			Value2D._initone(/*laya.webgl.shader.d2.ShaderDefines2D.TEXTURE2D*/0x01 | /*laya.webgl.shader.d2.ShaderDefines2D.COLORADD*/0x40,TextSV);
			Value2D._initone(/*laya.webgl.shader.d2.ShaderDefines2D.TEXTURE2D*/0x01 | /*laya.webgl.shader.d2.ShaderDefines2D.FILTERGLOW*/0x08,TextureSV);
		}

		Value2D.create=function(mainType,subType){
			var types=Value2D._cache[mainType|subType];
			if (types._length)
				return types[--types._length];
			else
			return new Value2D._typeClass[mainType|subType](subType);
		}

		Value2D._POSITION=null
		Value2D._TEXCOORD=null
		Value2D._cache=[];
		Value2D._typeClass=[];
		Value2D.TEMPMAT4_ARRAY=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1];
		return Value2D;
	})(ShaderValue)


	//class laya.webgl.utils.RenderSprite3D extends laya.renders.RenderSprite
	var RenderSprite3D=(function(_super){
		function RenderSprite3D(type,next){
			RenderSprite3D.__super.call(this,type,next);
		}

		__class(RenderSprite3D,'laya.webgl.utils.RenderSprite3D',_super);
		var __proto=RenderSprite3D.prototype;
		__proto.onCreate=function(type){
			switch (type){
				case 0x20:
					this._fun=this._blend;
					return;
				case 0x04:
					this._fun=this._transform;
					return;
				}
		}

		__proto._blend=function(sprite,context,x,y){
			var style=sprite._style;
			var next=this._next;
			var mask=sprite.mask;
			var submitCMD;
			var submitStencil;
			context.ctx.save();
			if (mask){
				var preBlendMode=(context.ctx).globalCompositeOperation;
				var tRect=new Rectangle();
				tRect.copyFrom(mask.getBounds());
				if (tRect.width > 0 && tRect.height > 0){
					var scope=SubmitCMDScope.create();
					scope.addValue("bounds",tRect);
					submitCMD=SubmitCMD.create([scope,context],laya.webgl.utils.RenderSprite3D.tmpTarget);
					context.addRenderObject(submitCMD);
					mask.render(context,-tRect.x,-tRect.y);
					submitCMD=SubmitCMD.create([scope],laya.webgl.utils.RenderSprite3D.endTmpTarget);
					context.addRenderObject(submitCMD);
					context.ctx.save();
					context.clipRect(x+tRect.x,y+tRect.y,tRect.width,tRect.height);
					next._fun.call(next,sprite,context,x,y);
					context.ctx.restore();
					submitStencil=SubmitStencil.create(6);
					preBlendMode=(context.ctx).globalCompositeOperation;
					submitStencil.blendMode="mask";
					context.addRenderObject(submitStencil);
					Matrix.TEMP.identity();
					var shaderValue=Value2D.create(/*laya.webgl.shader.d2.ShaderDefines2D.TEXTURE2D*/0x01,0);
					(context.ctx).drawTarget(scope,x+tRect.x,y+tRect.y,tRect.width,tRect.height,Matrix.TEMP,"tmpTarget",shaderValue,Texture.INV_UV,6);
					submitCMD=SubmitCMD.create([scope],laya.webgl.utils.RenderSprite3D.recycleTarget);
					context.addRenderObject(submitCMD);
					submitStencil=SubmitStencil.create(6);
					submitStencil.blendMode=preBlendMode;
					context.addRenderObject(submitStencil);
				}
				}else {
				context.ctx.globalCompositeOperation=style.blendMode;
				next=this._next;
				next._fun.call(next,sprite,context,x,y);
			}
			context.ctx.restore();
		}

		__proto._transform=function(sprite,context,x,y){
			'use strict';
			var transform=sprite.transform,_next=this._next;
			if (transform && _next !=RenderSprite.NORENDER){
				var ctx=context.ctx;
				var style=sprite._style;
				transform.tx=x;
				transform.ty=y;
				var m2=ctx._getTransformMatrix();
				var m1=m2.clone();
				Matrix.mul(transform,m2,m2);
				m2._checkTransform();
				_next._fun.call(_next,sprite,context,0,0);
				m1.copyTo(m2);
				m1.destroy();
				transform.tx=transform.ty=0;
				}else {
				_next._fun.call(_next,sprite,context,x,y);
			}
		}

		RenderSprite3D.tmpTarget=function(scope,context){
			var b=scope.getValue("bounds");
			var tmpTarget=RenderTarget2D.create(b.width,b.height);
			tmpTarget.start();
			tmpTarget.clear(0,0,0,0);
			scope.addValue("tmpTarget",tmpTarget);
		}

		RenderSprite3D.endTmpTarget=function(scope){
			var tmpTarget=scope.getValue("tmpTarget");
			tmpTarget.end();
		}

		RenderSprite3D.recycleTarget=function(scope){
			var tmpTarget=scope.getValue("tmpTarget");
			tmpTarget.recycle();
			scope.recycle();
		}

		return RenderSprite3D;
	})(RenderSprite)


	//class laya.filters.webgl.ColorFilterActionGL extends laya.filters.webgl.FilterActionGL
	var ColorFilterActionGL=(function(_super){
		function ColorFilterActionGL(){
			this.data=null;
			ColorFilterActionGL.__super.call(this);
		}

		__class(ColorFilterActionGL,'laya.filters.webgl.ColorFilterActionGL',_super);
		var __proto=ColorFilterActionGL.prototype;
		Laya.imps(__proto,{"laya.filters.IFilterActionGL":true})
		__proto.setValue=function(shader){
			shader.colorMat=this.data._mat;
			shader.colorAlpha=this.data._alpha;
		}

		__proto.apply3d=function(scope,sprite,context,x,y){
			var b=scope.getValue("bounds");
			var shaderValue=Value2D.create(/*laya.webgl.shader.d2.ShaderDefines2D.TEXTURE2D*/0x01,0);
			shaderValue.setFilters([this.data]);
			var tMatrix=Matrix.EMPTY;
			tMatrix.identity();
			context.ctx.drawTarget(scope,0,0,b.width,b.height,tMatrix,"src",shaderValue);
		}

		return ColorFilterActionGL;
	})(FilterActionGL)


	//class laya.webgl.atlas.Atlaser extends laya.webgl.atlas.AtlasGrid
	var Atlaser=(function(_super){
		function Atlaser(gridNumX,gridNumY,width,height,atlasID){
			this._atlasCanvas=null;
			this._inAtlasTextureKey=null;
			this._inAtlasTextureBitmapValue=null;
			this._inAtlasTextureOriUVValue=null;
			this._InAtlasWebGLImagesKey=null;
			this._InAtlasWebGLImagesOffsetValue=null;
			Atlaser.__super.call(this,gridNumX,gridNumY,atlasID);
			this._inAtlasTextureKey=[];
			this._inAtlasTextureBitmapValue=[];
			this._inAtlasTextureOriUVValue=[];
			this._InAtlasWebGLImagesKey=[];
			this._InAtlasWebGLImagesOffsetValue=[];
			this._atlasCanvas=new AtlasWebGLCanvas();
			this._atlasCanvas.width=width;
			this._atlasCanvas.height=height;
			this._atlasCanvas.activeResource();
			this._atlasCanvas.lock=true;
		}

		__class(Atlaser,'laya.webgl.atlas.Atlaser',_super);
		var __proto=Atlaser.prototype;
		__proto.computeUVinAtlasTexture=function(texture,oriUV,offsetX,offsetY){
			var tex=texture;
			var _width=AtlasResourceManager.atlasTextureWidth;
			var _height=AtlasResourceManager.atlasTextureHeight;
			var u1=offsetX / _width,v1=offsetY / _height,u2=(offsetX+texture.bitmap.width)/ _width,v2=(offsetY+texture.bitmap.height)/ _height;
			var inAltasUVWidth=texture.bitmap.width / _width,inAltasUVHeight=texture.bitmap.height / _height;
			texture.uv=[u1+oriUV[0] *inAltasUVWidth,v1+oriUV[1] *inAltasUVHeight,u2-(1-oriUV[2])*inAltasUVWidth,v1+oriUV[3] *inAltasUVHeight,u2-(1-oriUV[4])*inAltasUVWidth,v2-(1-oriUV[5])*inAltasUVHeight,u1+oriUV[6] *inAltasUVWidth,v2-(1-oriUV[7])*inAltasUVHeight];
		}

		/**
		*
		*@param inAtlasRes
		*@return ???????????????????????????
		*/
		__proto.addToAtlasTexture=function(mergeAtlasBitmap,offsetX,offsetY){
			((mergeAtlasBitmap instanceof laya.webgl.resource.WebGLImage ))&& (this._InAtlasWebGLImagesKey.push(mergeAtlasBitmap),this._InAtlasWebGLImagesOffsetValue.push([offsetX,offsetY]));
			this._atlasCanvas.texSubImage2D(offsetX,offsetY,mergeAtlasBitmap.atlasSource);
			mergeAtlasBitmap.clearAtlasSource();
		}

		__proto.addToAtlas=function(texture,offsetX,offsetY){
			var oriUV=texture.uv.slice();
			var oriBitmap=texture.bitmap;
			this._inAtlasTextureKey.push(texture);
			this._inAtlasTextureOriUVValue.push(oriUV);
			this._inAtlasTextureBitmapValue.push(oriBitmap);
			this.computeUVinAtlasTexture(texture,oriUV,offsetX,offsetY);
			texture.bitmap=this._atlasCanvas;
		}

		__proto.clear=function(){
			for (var i=0,n=this._inAtlasTextureKey.length;i < n;i++){
				this._inAtlasTextureKey[i].bitmap=this._inAtlasTextureBitmapValue[i];
				this._inAtlasTextureKey[i].uv=this._inAtlasTextureOriUVValue[i];
				this._inAtlasTextureKey[i].bitmap.lock=false;
				this._inAtlasTextureKey[i].bitmap.releaseResource();
			}
			this._inAtlasTextureKey.length=0;
			this._inAtlasTextureBitmapValue.length=0;
			this._inAtlasTextureOriUVValue.length=0;
			this._InAtlasWebGLImagesKey.length=0;
			this._InAtlasWebGLImagesOffsetValue.length=0;
		}

		__proto.dispose=function(){
			this.clear();
			this._atlasCanvas.dispose();
		}

		__getset(0,__proto,'InAtlasWebGLImagesOffsetValue',function(){
			return this._InAtlasWebGLImagesOffsetValue;
		});

		__getset(0,__proto,'texture',function(){
			return this._atlasCanvas;
		});

		__getset(0,__proto,'inAtlasWebGLImagesKey',function(){
			return this._InAtlasWebGLImagesKey;
		});

		return Atlaser;
	})(AtlasGrid)


	//class laya.webgl.shader.d2.ShaderDefines2D extends laya.webgl.shader.ShaderDefines
	var ShaderDefines2D=(function(_super){
		function ShaderDefines2D(){
			ShaderDefines2D.__super.call(this,ShaderDefines2D.__name2int,ShaderDefines2D.__int2name,ShaderDefines2D.__int2nameMap);
		}

		__class(ShaderDefines2D,'laya.webgl.shader.d2.ShaderDefines2D',_super);
		ShaderDefines2D.__init__=function(){
			ShaderDefines2D.reg("TEXTURE2D",0x01);
			ShaderDefines2D.reg("COLOR2D",0x02);
			ShaderDefines2D.reg("PRIMITIVE",0x04);
			ShaderDefines2D.reg("GLOW_FILTER",0x08);
			ShaderDefines2D.reg("BLUR_FILTER",0x10);
			ShaderDefines2D.reg("COLOR_FILTER",0x20);
			ShaderDefines2D.reg("COLOR_ADD",0x40);
			ShaderDefines2D.reg("WORLDMAT",0x80);
			ShaderDefines2D.reg("FILLTEXTURE",0x100);
		}

		ShaderDefines2D.reg=function(name,value){
			ShaderDefines._reg(name,value,ShaderDefines2D.__name2int,ShaderDefines2D.__int2name);
		}

		ShaderDefines2D.toText=function(value,int2name,int2nameMap){
			return ShaderDefines._toText(value,int2name,int2nameMap);
		}

		ShaderDefines2D.toInt=function(names){
			return ShaderDefines._toInt(names,ShaderDefines2D.__name2int);
		}

		ShaderDefines2D.TEXTURE2D=0x01;
		ShaderDefines2D.COLOR2D=0x02;
		ShaderDefines2D.PRIMITIVE=0x04;
		ShaderDefines2D.FILTERGLOW=0x08;
		ShaderDefines2D.FILTERBLUR=0x10;
		ShaderDefines2D.FILTERCOLOR=0x20;
		ShaderDefines2D.COLORADD=0x40;
		ShaderDefines2D.WORLDMAT=0x80;
		ShaderDefines2D.FILLTEXTURE=0x100;
		ShaderDefines2D.SKINMESH=0x200;
		ShaderDefines2D.__name2int={};
		ShaderDefines2D.__int2name=[];
		ShaderDefines2D.__int2nameMap=[];
		return ShaderDefines2D;
	})(ShaderDefines)


	//class laya.webgl.shapes.Ellipse extends laya.webgl.shapes.BasePoly
	var Ellipse=(function(_super){
		function Ellipse(x,y,width,height,color,borderWidth,borderColor){
			Ellipse.__super.call(this,x,y,width,height,40,color,borderWidth,borderColor);
		}

		__class(Ellipse,'laya.webgl.shapes.Ellipse',_super);
		return Ellipse;
	})(BasePoly)


	//class laya.webgl.shapes.Line extends laya.webgl.shapes.BasePoly
	var Line=(function(_super){
		function Line(x,y,points,borderWidth,color){
			this._points=[];
			var tCurrX=NaN;
			var tCurrY=NaN;
			var tLastX=-1;
			var tLastY=-1;
			var tLen=points.length / 2;
			for (var i=0;i < tLen;i++){
				tCurrX=points[i *2];
				tCurrY=points[i *2+1];
				if (Math.abs(tLastX-tCurrX)> 0.01 || Math.abs(tLastY-tCurrY)>0.01){
					this._points.push(tCurrX,tCurrY);
				}
				tLastX=tCurrX;
				tLastY=tCurrY;
			}
			Line.__super.call(this,x,y,0,0,0,color,borderWidth,color,0);
		}

		__class(Line,'laya.webgl.shapes.Line',_super);
		var __proto=Line.prototype;
		__proto.getData=function(ib,vb,start){
			var indices=[];
			var verts=[];
			(this.borderWidth > 0)&& this.createLine2(this._points,indices,this.borderWidth,start,verts,this._points.length / 2);
			ib.append(new Uint16Array(indices));
			vb.append(new Float32Array(verts));
		}

		return Line;
	})(BasePoly)


	//class laya.webgl.shapes.LoopLine extends laya.webgl.shapes.BasePoly
	var LoopLine=(function(_super){
		function LoopLine(x,y,points,width,color){
			this._points=[];
			var tCurrX=NaN;
			var tCurrY=NaN;
			var tLastX=-1;
			var tLastY=-1;
			var tLen=points.length / 2-1;
			for (var i=0;i < tLen;i++){
				tCurrX=points[i *2];
				tCurrY=points[i *2+1];
				if (Math.abs(tLastX-tCurrX)> 0.01 || Math.abs(tLastY-tCurrY)> 0.01){
					this._points.push(tCurrX,tCurrY);
				}
				tLastX=tCurrX;
				tLastY=tCurrY;
			}
			tCurrX=points[tLen *2];
			tCurrY=points[tLen *2+1];
			tLastX=this._points[0];
			tLastY=this._points[1];
			if (Math.abs(tLastX-tCurrX)> 0.01 || Math.abs(tLastY-tCurrY)> 0.01){
				this._points.push(tCurrX,tCurrY);
			}
			LoopLine.__super.call(this,x,y,0,0,this._points.length / 2,0,width,color);
		}

		__class(LoopLine,'laya.webgl.shapes.LoopLine',_super);
		var __proto=LoopLine.prototype;
		__proto.getData=function(ib,vb,start){
			if (this.borderWidth > 0){
				var color=this.color;
				var r=((color >> 16)& 0x0000ff)/ 255,g=((color >> 8)& 0xff)/ 255,b=(color & 0x0000ff)/ 255;
				var verts=[];
				var tLastX=-1,tLastY=-1;
				var tCurrX=0,tCurrY=0;
				var indices=[];
				var tLen=Math.floor(this._points.length / 2);
				for (var i=0;i < tLen;i++){
					tCurrX=this._points[i *2];
					tCurrY=this._points[i *2+1];
					verts.push(this.x+tCurrX,this.y+tCurrY,r,g,b);
				}
				this.createLoopLine(verts,indices,this.borderWidth,start+verts.length / 5);
				ib.append(new Uint16Array(indices));
				vb.append(new Float32Array(verts));
			}
		}

		__proto.createLoopLine=function(p,indices,lineWidth,len,outVertex,outIndex){
			var tLen=p.length / 5;
			var points=p.concat();
			var result=outVertex ? outVertex :p;
			var color=this.borderColor;
			var r=((color >> 16)& 0x0000ff)/ 255,g=((color >> 8)& 0xff)/ 255,b=(color & 0x0000ff)/ 255;
			var firstPoint=[points[0],points[1]];
			var lastPoint=[points[points.length-5],points[points.length-4]];
			var midPointX=lastPoint[0]+(firstPoint[0]-lastPoint[0])*0.5;
			var midPointY=lastPoint[1]+(firstPoint[1]-lastPoint[1])*0.5;
			points.unshift(midPointX,midPointY,0,0,0);
			points.push(midPointX,midPointY,0,0,0);
			var length=points.length / 5;
			var iStart=len,w=lineWidth / 2;
			var px,py,p1x,p1y,p2x,p2y,p3x,p3y;
			var perpx,perpy,perp2x,perp2y,perp3x,perp3y;
			var a1,b1,c1,a2,b2,c2;
			var denom,pdist,dist;
			p1x=points[0];
			p1y=points[1];
			p2x=points[5];
			p2y=points[6];
			perpx=-(p1y-p2y);
			perpy=p1x-p2x;
			dist=Math.sqrt(perpx *perpx+perpy *perpy);
			perpx=perpx / dist *w;
			perpy=perpy / dist *w;
			result.push(p1x-perpx,p1y-perpy,r,g,b,p1x+perpx,p1y+perpy,r,g,b);
			for (var i=1;i < length-1;i++){
				p1x=points[(i-1)*5];
				p1y=points[(i-1)*5+1];
				p2x=points[(i)*5];
				p2y=points[(i)*5+1];
				p3x=points[(i+1)*5];
				p3y=points[(i+1)*5+1];
				perpx=-(p1y-p2y);
				perpy=p1x-p2x;
				dist=Math.sqrt(perpx *perpx+perpy *perpy);
				perpx=perpx / dist *w;
				perpy=perpy / dist *w;
				perp2x=-(p2y-p3y);
				perp2y=p2x-p3x;
				dist=Math.sqrt(perp2x *perp2x+perp2y *perp2y);
				perp2x=perp2x / dist *w;
				perp2y=perp2y / dist *w;
				a1=(-perpy+p1y)-(-perpy+p2y);
				b1=(-perpx+p2x)-(-perpx+p1x);
				c1=(-perpx+p1x)*(-perpy+p2y)-(-perpx+p2x)*(-perpy+p1y);
				a2=(-perp2y+p3y)-(-perp2y+p2y);
				b2=(-perp2x+p2x)-(-perp2x+p3x);
				c2=(-perp2x+p3x)*(-perp2y+p2y)-(-perp2x+p2x)*(-perp2y+p3y);
				denom=a1 *b2-a2 *b1;
				if (Math.abs(denom)< 0.1){
					denom+=10.1;
					result.push(p2x-perpx,p2y-perpy,r,g,b,p2x+perpx,p2y+perpy,r,g,b);
					continue ;
				}
				px=(b1 *c2-b2 *c1)/ denom;
				py=(a2 *c1-a1 *c2)/ denom;
				pdist=(px-p2x)*(px-p2x)+(py-p2y)+(py-p2y);
				result.push(px,py,r,g,b,p2x-(px-p2x),p2y-(py-p2y),r,g,b);
			}
			if (outIndex){
				indices=outIndex;
			};
			var groupLen=this.edges+1;
			for (i=1;i < groupLen;i++){
				indices.push(iStart+(i-1)*2,iStart+(i-1)*2+1,iStart+i *2+1,iStart+i *2+1,iStart+i *2,iStart+(i-1)*2);
			}
			indices.push(iStart+(i-1)*2,iStart+(i-1)*2+1,iStart+1,iStart+1,iStart,iStart+(i-1)*2);
			return result;
		}

		return LoopLine;
	})(BasePoly)


	//class laya.webgl.shapes.Polygon extends laya.webgl.shapes.BasePoly
	var Polygon=(function(_super){
		function Polygon(x,y,points,color,borderWidth,borderColor){
			this._points=null;
			this._start=-1;
			this.mUint16Array=null;
			this.mFloat32Array=null;
			this._points=points.slice(0,points.length);
			Polygon.__super.call(this,x,y,0,0,this._points.length / 2,color,borderWidth,borderColor);
		}

		__class(Polygon,'laya.webgl.shapes.Polygon',_super);
		var __proto=Polygon.prototype;
		__proto.getData=function(ib,vb,start){
			var indices,i=0;
			var tArray=this._points;
			var tLen=0;
			if (this.mUint16Array && this.mFloat32Array){
				if (this._start !=start){
					this._start=start;
					indices=[];
					tLen=Math.floor(tArray.length / 2);
					for (i=2;i < tLen;i++){
						indices.push(start,start+i-1,start+i);
					}
					this.mUint16Array=new Uint16Array(indices);
				}
				}else {
				this._start=start;
				indices=[];
				var verts=[];
				var color=this.color;
				var r=((color >> 16)& 0x0000ff)/ 255,g=((color >> 8)& 0xff)/ 255,b=(color & 0x0000ff)/ 255;
				tLen=Math.floor(tArray.length / 2);
				for (i=0;i < tLen;i++){
					verts.push(this.x+tArray[i *2],this.y+tArray[i *2+1],r,g,b);
				}
				for (i=2;i < tLen;i++){
					indices.push(start,start+i-1,start+i);
				}
				this.mUint16Array=new Uint16Array(indices);
				this.mFloat32Array=new Float32Array(verts);
			}
			ib.append(this.mUint16Array);
			vb.append(this.mFloat32Array);
		}

		return Polygon;
	})(BasePoly)


	//class laya.webgl.submit.SubmitCanvas extends laya.webgl.submit.Submit
	var SubmitCanvas=(function(_super){
		function SubmitCanvas(){
			//this._ctx_src=null;
			this._matrix=new Matrix();
			this._matrix4=CONST3D2D.defaultMatrix4.concat();
			SubmitCanvas.__super.call(this,/*laya.webgl.submit.Submit.TYPE_2D*/10000);
			this.shaderValue=new Value2D(0,0);
		}

		__class(SubmitCanvas,'laya.webgl.submit.SubmitCanvas',_super);
		var __proto=SubmitCanvas.prototype;
		__proto.renderSubmit=function(){
			if (this._ctx_src._targets){
				this._ctx_src._targets.flush(this._ctx_src);
				return 1;
			};
			var preAlpha=RenderState2D.worldAlpha;
			var preMatrix4=RenderState2D.worldMatrix4;
			var preMatrix=RenderState2D.worldMatrix;
			var preFilters=RenderState2D.worldFilters;
			var preWorldShaderDefines=RenderState2D.worldShaderDefines;
			var v=this.shaderValue;
			var m=this._matrix;
			var m4=this._matrix4;
			var mout=Matrix.TEMP;
			Matrix.mul(m,preMatrix,mout);
			m4[0]=mout.a;
			m4[1]=mout.b;
			m4[4]=mout.c;
			m4[5]=mout.d;
			m4[12]=mout.tx;
			m4[13]=mout.ty;
			RenderState2D.worldMatrix=mout.clone();
			RenderState2D.worldMatrix4=m4;
			RenderState2D.worldAlpha=RenderState2D.worldAlpha *v.alpha;
			if (v.filters && v.filters.length){
				RenderState2D.worldFilters=v.filters;
				RenderState2D.worldShaderDefines=v.defines;
			}
			this._ctx_src.flush();
			RenderState2D.worldAlpha=preAlpha;
			RenderState2D.worldMatrix4=preMatrix4;
			RenderState2D.worldMatrix.destroy();
			RenderState2D.worldMatrix=preMatrix;
			RenderState2D.worldFilters=preFilters;
			RenderState2D.worldShaderDefines=preWorldShaderDefines;
			return 1;
		}

		__proto.releaseRender=function(){
			var cache=SubmitCanvas._cache;
			cache[cache._length++]=this;
		}

		__proto.getRenderType=function(){
			return /*laya.webgl.submit.Submit.TYPE_CANVAS*/10003;
		}

		SubmitCanvas.create=function(ctx_src,alpha,filters){
			var o=(!SubmitCanvas._cache._length)? (new SubmitCanvas()):SubmitCanvas._cache[--SubmitCanvas._cache._length];
			o._ctx_src=ctx_src;
			var v=o.shaderValue;
			v.alpha=alpha;
			v.defines.setValue(0);
			filters && filters.length && v.setFilters(filters);
			return o;
		}

		SubmitCanvas._cache=(SubmitCanvas._cache=[],SubmitCanvas._cache._length=0,SubmitCanvas._cache);
		return SubmitCanvas;
	})(Submit)


	//class laya.webgl.submit.SubmitTexture extends laya.webgl.submit.Submit
	var SubmitTexture=(function(_super){
		function SubmitTexture(renderType){
			this._preIsSameTextureShader=false;
			this._isSameTexture=true;
			this._texs=new Array;
			this._texsID=new Array;
			this._vbPos=new Array;
			(renderType===void 0)&& (renderType=10000);
			SubmitTexture.__super.call(this,renderType);
		}

		__class(SubmitTexture,'laya.webgl.submit.SubmitTexture',_super);
		var __proto=SubmitTexture.prototype;
		__proto.releaseRender=function(){
			var cache=SubmitTexture._cache;
			cache[cache._length++]=this;
			this.shaderValue.release();
			this._preIsSameTextureShader=false;
			this._vb=null;
			this._texs.length=0;
			this._isSameTexture=true;
		}

		__proto.addTexture=function(tex,vbpos){
			this._texsID[this._texs.length]=tex._uvID;
			this._texs.push(tex);
			this._vbPos.push(vbpos);
		}

		//?????????????????????????????????UV??????????????????????????????
		__proto.checkTexture=function(){
			if (this._texs.length < 1){
				this._isSameTexture=true;
				return;
			};
			var _tex=this.shaderValue.textureHost;
			var webGLImg=_tex.bitmap;
			if (webGLImg===null)return;
			var vbdata=this._vb.getFloat32Array();
			for (var i=0,s=this._texs.length;i < s;i++){
				var tex=this._texs[i];
				tex.active();
				var newUV=tex.uv;
				if (this._texsID[i]!==tex._uvID){
					this._texsID[i]=tex._uvID;
					var vbPos=this._vbPos[i];
					vbdata[vbPos+2]=newUV[0];
					vbdata[vbPos+3]=newUV[1];
					vbdata[vbPos+6]=newUV[2];
					vbdata[vbPos+7]=newUV[3];
					vbdata[vbPos+10]=newUV[4];
					vbdata[vbPos+11]=newUV[5];
					vbdata[vbPos+14]=newUV[6];
					vbdata[vbPos+15]=newUV[7];
					this._vb.setNeedUpload();
				}
				if (tex.bitmap!==webGLImg){
					this._isSameTexture=false;
				}
			}
		}

		__proto.renderSubmit=function(){
			if (this._numEle===0)return 1;
			var _tex=this.shaderValue.textureHost;
			if (_tex){
				var source=_tex.source;
				if (!_tex.bitmap || !source){
					SubmitTexture._shaderSet=false;
					return 1;
				}
				this.shaderValue.texture=source;
			}
			this._vb.bind_upload(this._ib);
			var gl=WebGL.mainContext;
			if (BlendMode.activeBlendFunction!==this._blendFn){
				gl.enable(/*laya.webgl.WebGLContext.BLEND*/0x0BE2);
				this._blendFn(gl);
				BlendMode.activeBlendFunction=this._blendFn;
			}
			Stat.drawCall++;
			Stat.trianglesFaces+=this._numEle / 3;
			if (this._preIsSameTextureShader && Shader.activeShader && SubmitTexture._shaderSet)
				Shader.activeShader.uploadTexture2D(this.shaderValue.texture);
			else this.shaderValue.upload();
			SubmitTexture._shaderSet=true;
			if (this._texs.length > 1 && !this._isSameTexture){
				var webGLImg=_tex.bitmap;
				var index=0;
				var shader=Shader.activeShader;
				for (var i=0,s=this._texs.length;i < s;i++){
					var tex2=this._texs[i];
					if (tex2.bitmap!==webGLImg || (i+1)===s){
						shader.uploadTexture2D(tex2.source);
						gl.drawElements(/*laya.webgl.WebGLContext.TRIANGLES*/0x0004,(i-index+1)*6,/*laya.webgl.WebGLContext.UNSIGNED_SHORT*/0x1403,this._startIdx+index *6 *CONST3D2D.BYTES_PIDX);
						webGLImg=tex2.bitmap;
						index=i;
					}
				}
				}else {
				gl.drawElements(/*laya.webgl.WebGLContext.TRIANGLES*/0x0004,this._numEle,/*laya.webgl.WebGLContext.UNSIGNED_SHORT*/0x1403,this._startIdx);
			}
			return 1;
		}

		SubmitTexture.create=function(context,ib,vb,pos,sv){
			var o=SubmitTexture._cache._length ? SubmitTexture._cache[--SubmitTexture._cache._length] :new SubmitTexture();
			if (vb==null){
				vb=o._selfVb || (o._selfVb=VertexBuffer2D.create(-1));
				vb.clear();
				pos=0;
			}
			o._ib=ib;
			o._vb=vb;
			o._startIdx=pos *CONST3D2D.BYTES_PIDX;
			o._numEle=0;
			var blendType=context._nBlendType;
			o._blendFn=context._targets ? BlendMode.targetFns[blendType] :BlendMode.fns[blendType];
			o.shaderValue=sv;
			o.shaderValue.setValue(context._shader2D);
			var filters=context._shader2D.filters;
			filters && o.shaderValue.setFilters(filters);
			return o;
		}

		SubmitTexture._cache=(SubmitTexture._cache=[],SubmitTexture._cache._length=0,SubmitTexture._cache);
		SubmitTexture._shaderSet=true;
		return SubmitTexture;
	})(Submit)


	//class laya.webgl.shader.Shader extends laya.resource.Resource
	var Shader=(function(_super){
		function Shader(vs,ps,saveName,nameMap){
			this.customCompile=false;
			//this._nameMap=null;
			//this._vs=null;
			//this._ps=null;
			this._curActTexIndex=0;
			//this._reCompile=false;
			this.tag={};
			//this._vshader=null;
			//this._pshader=null;
			this._program=null;
			this._params=null;
			this._paramsMap={};
			this._offset=0;
			//this._id=0;
			Shader.__super.call(this);
			if ((!vs)|| (!ps))throw "Shader Error";
			if (Render.isConchApp || Render.isFlash){
				this.customCompile=true;
			}
			this._id=++Shader._count;
			this._vs=vs;
			this._ps=ps;
			this._nameMap=nameMap ? nameMap :{};
			saveName !=null && (Shader.sharders[saveName]=this);
		}

		__class(Shader,'laya.webgl.shader.Shader',_super);
		var __proto=Shader.prototype;
		__proto.recreateResource=function(){
			this.startCreate();
			this._compile();
			this.completeCreate();
			this.memorySize=0;
		}

		//??????????????????
		__proto.detoryResource=function(){
			WebGL.mainContext.deleteShader(this._vshader);
			WebGL.mainContext.deleteShader(this._pshader);
			WebGL.mainContext.deleteProgram(this._program);
			this._vshader=this._pshader=this._program=null;
			this._params=null;
			this._paramsMap={};
			this.memorySize=0;
			this._curActTexIndex=0;
		}

		__proto._compile=function(){
			if (!this._vs || !this._ps || this._params)
				return;
			this._reCompile=true;
			this._params=[];
			var text=[this._vs,this._ps];
			var result;
			if (this.customCompile)
				result=this._preGetParams(this._vs,this._ps);
			var gl=WebGL.mainContext;
			this._program=gl.createProgram();
			this._vshader=Shader._createShader(gl,text[0],/*laya.webgl.WebGLContext.VERTEX_SHADER*/0x8B31);
			this._pshader=Shader._createShader(gl,text[1],/*laya.webgl.WebGLContext.FRAGMENT_SHADER*/0x8B30);
			gl.attachShader(this._program,this._vshader);
			gl.attachShader(this._program,this._pshader);
			gl.linkProgram(this._program);
			if (!this.customCompile && !gl.getProgramParameter(this._program,/*laya.webgl.WebGLContext.LINK_STATUS*/0x8B82)){
				throw gl.getProgramInfoLog(this._program);
			};
			var one,i=0,j=0,n=0,location;
			var attribNum=this.customCompile ? result.attributes.length :gl.getProgramParameter(this._program,/*laya.webgl.WebGLContext.ACTIVE_ATTRIBUTES*/0x8B89);
			for (i=0;i < attribNum;i++){
				var attrib=this.customCompile ? result.attributes[i] :gl.getActiveAttrib(this._program,i);
				location=gl.getAttribLocation(this._program,attrib.name);
				one={vartype:"attribute",ivartype:0,attrib:attrib,location:location,name:attrib.name,type:attrib.type,isArray:false,isSame:false,preValue:null,indexOfParams:0};
				this._params.push(one);
			};
			var nUniformNum=this.customCompile ? result.uniforms.length :gl.getProgramParameter(this._program,/*laya.webgl.WebGLContext.ACTIVE_UNIFORMS*/0x8B86);
			for (i=0;i < nUniformNum;i++){
				var uniform=this.customCompile ? result.uniforms[i] :gl.getActiveUniform(this._program,i);
				location=gl.getUniformLocation(this._program,uniform.name);
				one={vartype:"uniform",ivartype:1,attrib:attrib,location:location,name:uniform.name,type:uniform.type,isArray:false,isSame:false,preValue:null,indexOfParams:0};
				if (one.name.indexOf('[0]')> 0){
					one.name=one.name.substr(0,one.name.length-3);
					one.isArray=true;
					one.location=gl.getUniformLocation(this._program,one.name);
				}
				this._params.push(one);
			}
			for (i=0,n=this._params.length;i < n;i++){
				one=this._params[i];
				one.indexOfParams=i;
				one.index=1;
				one.value=[one.location,null];
				one.codename=one.name;
				one.name=this._nameMap[one.codename] ? this._nameMap[one.codename] :one.codename;
				this._paramsMap[one.name]=one;
				one._this=this;
				one.uploadedValue=[];
				if (one.vartype==="attribute"){
					one.fun=this._attribute;
					continue ;
				}
				switch (one.type){
					case /*laya.webgl.WebGLContext.INT*/0x1404:
						one.fun=one.isArray ? this._uniform1iv :this._uniform1i;
						break ;
					case /*laya.webgl.WebGLContext.FLOAT*/0x1406:
						one.fun=one.isArray ? this._uniform1fv :this._uniform1f;
						break ;
					case /*laya.webgl.WebGLContext.FLOAT_VEC2*/0x8B50:
						one.fun=one.isArray ? this._uniform_vec2v:this._uniform_vec2;
						break ;
					case /*laya.webgl.WebGLContext.FLOAT_VEC3*/0x8B51:
						one.fun=one.isArray ? this._uniform_vec3v:this._uniform_vec3;
						break ;
					case /*laya.webgl.WebGLContext.FLOAT_VEC4*/0x8B52:
						one.fun=one.isArray ? this._uniform_vec4v:this._uniform_vec4;
						break ;
					case /*laya.webgl.WebGLContext.SAMPLER_2D*/0x8B5E:
						one.fun=this._uniform_sampler2D;
						break ;
					case /*laya.webgl.WebGLContext.SAMPLER_CUBE*/0x8B60:
						one.fun=this._uniform_samplerCube;
						break ;
					case /*laya.webgl.WebGLContext.FLOAT_MAT4*/0x8B5C:
						one.fun=this._uniformMatrix4fv;
						break ;
					case /*laya.webgl.WebGLContext.BOOL*/0x8B56:
						one.fun=this._uniform1i;
						break ;
					case /*laya.webgl.WebGLContext.FLOAT_MAT2*/0x8B5A:
					case /*laya.webgl.WebGLContext.FLOAT_MAT3*/0x8B5B:
						throw new Error("compile shader err!");
						break ;
					default :
						throw new Error("compile shader err!");
						break ;
					}
			}
		}

		/**
		*????????????????????????
		*@param name
		*@return
		*/
		__proto.getUniform=function(name){
			return this._paramsMap[name];
		}

		__proto._attribute=function(one,value){
			var gl=WebGL.mainContext;
			gl.enableVertexAttribArray(one.location);
			gl.vertexAttribPointer(one.location,value[0],value[1],value[2],value[3],value[4]+this._offset);
			return 2;
		}

		__proto._uniform1f=function(one,value){
			var uploadedValue=one.uploadedValue;
			if (uploadedValue[0]!==value){
				WebGL.mainContext.uniform1f(one.location,uploadedValue[0]=value);
				return 1;
			}
			return 0;
		}

		__proto._uniform1fv=function(one,value){
			if (value.length < 4){
				var uploadedValue=one.uploadedValue;
				if (uploadedValue[0]!==value[0] || uploadedValue[1]!==value[1] || uploadedValue[2]!==value[2] || uploadedValue[3]!==value[3]){
					WebGL.mainContext.uniform1fv(one.location,value);
					uploadedValue[0]=value[0];
					uploadedValue[1]=value[1];
					uploadedValue[2]=value[2];
					uploadedValue[3]=value[3];
					return 1;
				}
				return 0;
				}else {
				WebGL.mainContext.uniform1fv(one.location,value);
				return 1;
			}
		}

		__proto._uniform_vec2=function(one,value){
			var uploadedValue=one.uploadedValue;
			if (uploadedValue[0]!==value[0] || uploadedValue[1]!==value[1]){
				WebGL.mainContext.uniform2f(one.location,uploadedValue[0]=value[0],uploadedValue[1]=value[1]);
				return 1;
			}
			return 0;
		}

		__proto._uniform_vec2v=function(one,value){
			if (value.length < 2){
				var uploadedValue=one.uploadedValue;
				if (uploadedValue[0]!==value[0] || uploadedValue[1]!==value[1] || uploadedValue[2]!==value[2] || uploadedValue[3]!==value[3]){
					WebGL.mainContext.uniform2fv(one.location,value);
					uploadedValue[0]=value[0];
					uploadedValue[1]=value[1];
					uploadedValue[2]=value[2];
					uploadedValue[3]=value[3];
					return 1;
				}
				return 0;
				}else {
				WebGL.mainContext.uniform2fv(one.location,value);
				return 1;
			}
		}

		__proto._uniform_vec3=function(one,value){
			var uploadedValue=one.uploadedValue;
			if (uploadedValue[0]!==value[0] || uploadedValue[1]!==value[1] || uploadedValue[2]!==value[2]){
				WebGL.mainContext.uniform3f(one.location,uploadedValue[0]=value[0],uploadedValue[1]=value[1],uploadedValue[2]=value[2]);
				return 1;
			}
			return 0;
		}

		__proto._uniform_vec3v=function(one,value){
			WebGL.mainContext.uniform3fv(one.location,value);
			return 1;
		}

		__proto._uniform_vec4=function(one,value){
			var uploadedValue=one.uploadedValue;
			if (uploadedValue[0]!==value[0] || uploadedValue[1]!==value[1] || uploadedValue[2]!==value[2] || uploadedValue[3]!==value[3]){
				WebGL.mainContext.uniform4f(one.location,uploadedValue[0]=value[0],uploadedValue[1]=value[1],uploadedValue[2]=value[2],uploadedValue[3]=value[3]);
				return 1;
			}
			return 0;
		}

		__proto._uniform_vec4v=function(one,value){
			WebGL.mainContext.uniform4fv(one.location,value);
			return 1;
		}

		__proto._uniformMatrix2fv=function(one,value){
			WebGL.mainContext.uniformMatrix2fv(one.location,false,value);
			return 1;
		}

		__proto._uniformMatrix3fv=function(one,value){
			WebGL.mainContext.uniformMatrix3fv(one.location,false,value);
			return 1;
		}

		__proto._uniformMatrix4fv=function(one,value){
			WebGL.mainContext.uniformMatrix4fv(one.location,false,value);
			return 1;
		}

		__proto._uniform1i=function(one,value){
			var uploadedValue=one.uploadedValue;
			if (uploadedValue[0]!==value){
				WebGL.mainContext.uniform1i(one.location,uploadedValue[0]=value);
				return 1;
			}
			return 0;
		}

		__proto._uniform1iv=function(one,value){
			WebGL.mainContext.uniform1iv(one.location,value);
			return 1;
		}

		__proto._uniform_ivec2=function(one,value){
			var uploadedValue=one.uploadedValue;
			if (uploadedValue[0]!==value[0] || uploadedValue[1]!==value[1]){
				WebGL.mainContext.uniform2i(one.location,uploadedValue[0]=value[0],uploadedValue[1]=value[1]);
				return 1;
			}
			return 0;
		}

		__proto._uniform_ivec2v=function(one,value){
			WebGL.mainContext.uniform2iv(one.location,value);
			return 1;
		}

		__proto._uniform_vec3i=function(one,value){
			var uploadedValue=one.uploadedValue;
			if (uploadedValue[0]!==value[0] || uploadedValue[1]!==value[1] || uploadedValue[2]!==value[2]){
				WebGL.mainContext.uniform3i(one.location,uploadedValue[0]=value[0],uploadedValue[1]=value[1],uploadedValue[2]=value[2]);
				return 1;
			}
			return 0;
		}

		__proto._uniform_vec3vi=function(one,value){
			WebGL.mainContext.uniform3iv(one.location,value);
			return 1;
		}

		__proto._uniform_vec4i=function(one,value){
			var uploadedValue=one.uploadedValue;
			if (uploadedValue[0]!==value[0] || uploadedValue[1]!==value[1] || uploadedValue[2]!==value[2] || uploadedValue[3]!==value[3]){
				WebGL.mainContext.uniform4i(one.location,uploadedValue[0]=value[0],uploadedValue[1]=value[1],uploadedValue[2]=value[2],uploadedValue[3]=value[3]);
				return 1;
			}
			return 0;
		}

		__proto._uniform_vec4vi=function(one,value){
			WebGL.mainContext.uniform4iv(one.location,value);
			return 1;
		}

		__proto._uniform_sampler2D=function(one,value){
			var gl=WebGL.mainContext;
			var uploadedValue=one.uploadedValue;
			if (uploadedValue[0]==null){
				uploadedValue[0]=this._curActTexIndex;
				gl.uniform1i(one.location,this._curActTexIndex);
				gl.activeTexture(Shader._TEXTURES[this._curActTexIndex]);
				WebGLContext.bindTexture(gl,/*laya.webgl.WebGLContext.TEXTURE_2D*/0x0DE1,value);
				this._curActTexIndex++;
				return 1;
				}else {
				gl.activeTexture(Shader._TEXTURES[uploadedValue[0]]);
				WebGLContext.bindTexture(gl,/*laya.webgl.WebGLContext.TEXTURE_2D*/0x0DE1,value);
				return 0;
			}
		}

		__proto._uniform_samplerCube=function(one,value){
			var gl=WebGL.mainContext;
			var uploadedValue=one.uploadedValue;
			if (uploadedValue[0]==null){
				uploadedValue[0]=this._curActTexIndex;
				gl.uniform1i(one.location,this._curActTexIndex);
				gl.activeTexture(Shader._TEXTURES[this._curActTexIndex]);
				WebGLContext.bindTexture(gl,/*laya.webgl.WebGLContext.TEXTURE_CUBE_MAP*/0x8513,value);
				this._curActTexIndex++;
				return 1;
				}else {
				gl.activeTexture(Shader._TEXTURES[uploadedValue[0]]);
				WebGLContext.bindTexture(gl,/*laya.webgl.WebGLContext.TEXTURE_CUBE_MAP*/0x8513,value);
				return 0;
			}
		}

		__proto._noSetValue=function(one){
			console.log("no....:"+one.name);
		}

		//throw new Error("upload shader err,must set value:"+one.name);
		__proto.uploadOne=function(name,value){
			this.activeResource();
			WebGLContext.UseProgram(this._program);
			var one=this._paramsMap[name];
			one.fun.call(this,one,value);
		}

		__proto.uploadTexture2D=function(value){
			Stat.shaderCall++;
			var gl=WebGL.mainContext;
			gl.activeTexture(/*laya.webgl.WebGLContext.TEXTURE0*/0x84C0);
			WebGLContext.bindTexture(gl,/*laya.webgl.WebGLContext.TEXTURE_2D*/0x0DE1,value);
		}

		/**
		*??????shader???GPU
		*@param shaderValue
		*/
		__proto.upload=function(shaderValue,params){
			Shader.activeShader=this;
			this.activeResource();
			WebGLContext.UseProgram(this._program);
			if (this._reCompile){
				params=this._params;
				this._reCompile=false;
				}else {
				params=params || this._params;
			};
			var one,value,n=params.length,shaderCall=0;
			for (var i=0;i < n;i++){
				one=params[i];
				((value=shaderValue[one.name])!==null)&& (shaderCall+=one.fun.call(this,one,value));
			}
			Stat.shaderCall+=shaderCall;
		}

		/**
		*????????????????????????
		*@param shaderValue ????????????[name,value,...]
		*/
		__proto.uploadArray=function(shaderValue,length,_bufferUsage){
			Shader.activeShader=this;
			this.activeResource();
			WebGLContext.UseProgram(this._program);
			var params=this._params,value;
			var one,shaderCall=0;
			for (var i=length-2;i >=0;i-=2){
				one=this._paramsMap[shaderValue[i]];
				if (!one)
					continue ;
				value=shaderValue[i+1];
				if (value !=null){
					_bufferUsage && _bufferUsage[one.name] && _bufferUsage[one.name].bind();
					shaderCall+=one.fun.call(this,one,value);
				}
			}
			Stat.shaderCall+=shaderCall;
		}

		/**
		*??????????????????????????????????????????
		*@return
		*/
		__proto.getParams=function(){
			return this._params;
		}

		__proto._preGetParams=function(vs,ps){
			var text=[vs,ps];
			var result={};
			var attributes=[];
			var uniforms=[];
			var definesInfo={};
			var definesName=[];
			result.attributes=attributes;
			result.uniforms=uniforms;
			result.defines=definesInfo;
			var removeAnnotation=new RegExp("(/\\*([^*]|[\\r\\\n]|(\\*+([^*/]|[\\r\\n])))*\\*+/)|(//.*)","g");
			var reg=new RegExp("(\".*\")|('.*')|([#\\w\\*-\\.+/()=<>{}\\\\]+)|([,;:\\\\])","g");
			var i=0,n=0,one;
			for (var s=0;s < 2;s++){
				text[s]=text[s].replace(removeAnnotation,"");
				var words=text[s].match(reg);
				var tempelse;
				for (i=0,n=words.length;i < n;i++){
					var word=words[i];
					if (word !="attribute" && word !="uniform"){
						if (word=="#define"){
							word=words[++i];
							definesName[word]=1;
							continue ;
							}else if (word=="#ifdef"){
							tempelse=words[++i];
							var def=definesInfo[tempelse]=definesInfo[tempelse] || [];
							for (i++;i < n;i++){
								word=words[i];
								if (word !="attribute" && word !="uniform"){
									if (word=="#else"){
										for (i++;i < n;i++){
											word=words[i];
											if (word !="attribute" && word !="uniform"){
												if (word=="#endif"){
													break ;
												}
												continue ;
											}
											i=this.parseOne(attributes,uniforms,words,i,word,!definesName[tempelse]);
										}
									}
									continue ;
								}
								i=this.parseOne(attributes,uniforms,words,i,word,definesName[tempelse]);
							}
						}
						continue ;
					}
					i=this.parseOne(attributes,uniforms,words,i,word,true);
				}
			}
			return result;
		}

		__proto.parseOne=function(attributes,uniforms,words,i,word,b){
			var one={type:Shader.shaderParamsMap[words[i+1]],name:words[i+2],size:isNaN(parseInt(words[i+3]))? 1 :parseInt(words[i+3])};
			if (b){
				if (word=="attribute"){
					attributes.push(one);
					}else {
					uniforms.push(one);
				}
			}
			if (words[i+3]==':'){
				one.type=words[i+4];
				i+=2;
			}
			i+=2;
			return i;
		}

		__proto.dispose=function(){
			this.resourceManager.removeResource(this);
			_super.prototype.dispose.call(this);
		}

		Shader.getShader=function(name){
			return Shader.sharders[name];
		}

		Shader.create=function(vs,ps,saveName,nameMap){
			return new Shader(vs,ps,saveName,nameMap);
		}

		Shader.withCompile=function(nameID,define,shaderName,createShader){
			if (shaderName && Shader.sharders[shaderName])
				return Shader.sharders[shaderName];
			var pre=Shader._preCompileShader[0.0002 *nameID];
			if (!pre)
				throw new Error("withCompile shader err!"+nameID);
			return pre.createShader(define,shaderName,createShader);
		}

		Shader.withCompile2D=function(nameID,mainID,define,shaderName,createShader){
			if (shaderName && Shader.sharders[shaderName])
				return Shader.sharders[shaderName];
			var pre=Shader._preCompileShader[0.0002 *nameID+mainID];
			if (!pre)
				throw new Error("withCompile shader err!"+nameID+" "+mainID);
			return pre.createShader(define,shaderName,createShader);
		}

		Shader.addInclude=function(fileName,txt){
			if (!txt || txt.length===0)
				throw new Error("add shader include file err:"+fileName);
			if (Shader._includeFiles[fileName])
				throw new Error("add shader include file err, has add:"+fileName);
			Shader._includeFiles[fileName]=txt;
		}

		Shader.preCompile=function(nameID,vs,ps,nameMap){
			var id=0.0002 *nameID;
			Shader._preCompileShader[id]=new ShaderCompile(id,vs,ps,nameMap,Shader._includeFiles);
		}

		Shader.preCompile2D=function(nameID,mainID,vs,ps,nameMap){
			var id=0.0002 *nameID+mainID;
			Shader._preCompileShader[id]=new ShaderCompile(id,vs,ps,nameMap,Shader._includeFiles);
		}

		Shader._createShader=function(gl,str,type){
			var shader=gl.createShader(type);
			gl.shaderSource(shader,str);
			gl.compileShader(shader);
			if (!gl.getShaderParameter(shader,/*laya.webgl.WebGLContext.COMPILE_STATUS*/0x8B81)){
				throw gl.getShaderInfoLog(shader);
			}
			return shader;
		}

		Shader._TEXTURES=[ /*laya.webgl.WebGLContext.TEXTURE0*/0x84C0,/*laya.webgl.WebGLContext.TEXTURE1*/0x84C1,/*laya.webgl.WebGLContext.TEXTURE2*/0x84C2,/*laya.webgl.WebGLContext.TEXTURE3*/0x84C3,/*laya.webgl.WebGLContext.TEXTURE4*/0x84C4,/*laya.webgl.WebGLContext.TEXTURE5*/0x84C5,/*laya.webgl.WebGLContext.TEXTURE6*/0x84C6,,/*laya.webgl.WebGLContext.TEXTURE7*/0x84C7,/*laya.webgl.WebGLContext.TEXTURE8*/0x84C8];
		Shader._includeFiles={};
		Shader._count=0;
		Shader._preCompileShader={};
		Shader.SHADERNAME2ID=0.0002;
		Shader.activeShader=null
		Shader.sharders=(Shader.sharders=[],Shader.sharders.length=0x20,Shader.sharders);
		__static(Shader,
		['shaderParamsMap',function(){return this.shaderParamsMap={"float":/*laya.webgl.WebGLContext.FLOAT*/0x1406,"int":/*laya.webgl.WebGLContext.INT*/0x1404,"bool":/*laya.webgl.WebGLContext.BOOL*/0x8B56,"vec2":/*laya.webgl.WebGLContext.FLOAT_VEC2*/0x8B50,"vec3":/*laya.webgl.WebGLContext.FLOAT_VEC3*/0x8B51,"vec4":/*laya.webgl.WebGLContext.FLOAT_VEC4*/0x8B52,"ivec2":/*laya.webgl.WebGLContext.INT_VEC2*/0x8B53,"ivec3":/*laya.webgl.WebGLContext.INT_VEC3*/0x8B54,"ivec4":/*laya.webgl.WebGLContext.INT_VEC4*/0x8B55,"bvec2":/*laya.webgl.WebGLContext.BOOL_VEC2*/0x8B57,"bvec3":/*laya.webgl.WebGLContext.BOOL_VEC3*/0x8B58,"bvec4":/*laya.webgl.WebGLContext.BOOL_VEC4*/0x8B59,"mat2":/*laya.webgl.WebGLContext.FLOAT_MAT2*/0x8B5A,"mat3":/*laya.webgl.WebGLContext.FLOAT_MAT3*/0x8B5B,"mat4":/*laya.webgl.WebGLContext.FLOAT_MAT4*/0x8B5C,"sampler2D":/*laya.webgl.WebGLContext.SAMPLER_2D*/0x8B5E,"samplerCube":/*laya.webgl.WebGLContext.SAMPLER_CUBE*/0x8B60};},'nameKey',function(){return this.nameKey=new StringKey();}
		]);
		return Shader;
	})(Resource)


	//class laya.webgl.resource.RenderTarget2D extends laya.resource.Texture
	var RenderTarget2D=(function(_super){
		function RenderTarget2D(width,height,surfaceFormat,surfaceType,depthStencilFormat,mipMap,repeat,minFifter,magFifter){
			this._type=0;
			this._svWidth=NaN;
			this._svHeight=NaN;
			this._preRenderTarget=null;
			this._alreadyResolved=false;
			this._looked=false;
			this._surfaceFormat=0;
			this._surfaceType=0;
			this._depthStencilFormat=0;
			this._mipMap=false;
			this._repeat=false;
			this._minFifter=0;
			this._magFifter=0;
			this._destroy=false;
			(surfaceFormat===void 0)&& (surfaceFormat=/*laya.webgl.WebGLContext.RGBA*/0x1908);
			(surfaceType===void 0)&& (surfaceType=/*laya.webgl.WebGLContext.UNSIGNED_BYTE*/0x1401);
			(depthStencilFormat===void 0)&& (depthStencilFormat=/*laya.webgl.WebGLContext.DEPTH_COMPONENT16*/0x81A5);
			(mipMap===void 0)&& (mipMap=false);
			(repeat===void 0)&& (repeat=false);
			(minFifter===void 0)&& (minFifter=-1);
			(magFifter===void 0)&& (magFifter=-1);
			this._type=1;
			this._w=width;
			this._h=height;
			this._surfaceFormat=surfaceFormat;
			this._surfaceType=surfaceType;
			this._depthStencilFormat=depthStencilFormat;
			this._mipMap=mipMap;
			this._repeat=repeat;
			this._minFifter=minFifter;
			this._magFifter=magFifter;
			this._createWebGLRenderTarget();
			this.bitmap.lock=true;
			RenderTarget2D.__super.call(this,this.bitmap,Texture.INV_UV);
		}

		__class(RenderTarget2D,'laya.webgl.resource.RenderTarget2D',_super);
		var __proto=RenderTarget2D.prototype;
		Laya.imps(__proto,{"laya.resource.IDispose":true})
		//TODO:??????......................................................
		__proto.getType=function(){
			return this._type;
		}

		//*/
		__proto.getTexture=function(){
			return this;
		}

		__proto.size=function(w,h){
			if (this.bitmap && this._w==w && this._h==h)
				return;
			this._w=w;
			this._h=h;
			this.release();
			this._createWebGLRenderTarget();
		}

		__proto.release=function(){
			this.destroy();
		}

		__proto.recycle=function(){
			RenderTarget2D.POOL.push(this);
		}

		__proto.start=function(){
			var gl=WebGL.mainContext;
			this._preRenderTarget=RenderState2D.curRenderTarget;
			RenderState2D.curRenderTarget=this;
			gl.bindFramebuffer(/*laya.webgl.WebGLContext.FRAMEBUFFER*/0x8D40,this.bitmap.frameBuffer);
			this._alreadyResolved=false;
			if (this._type==1){
				gl.viewport(0,0,this._w,this._h);
				this._svWidth=RenderState2D.width;
				this._svHeight=RenderState2D.height;
				RenderState2D.width=this._w;
				RenderState2D.height=this._h;
				Shader.activeShader=null;
			}
			return this;
		}

		__proto.clear=function(r,g,b,a){
			(r===void 0)&& (r=0.0);
			(g===void 0)&& (g=0.0);
			(b===void 0)&& (b=0.0);
			(a===void 0)&& (a=1.0);
			var gl=WebGL.mainContext;
			gl.clearColor(r,g,b,a);
			var clearFlag=/*laya.webgl.WebGLContext.COLOR_BUFFER_BIT*/0x00004000;
			switch (this._depthStencilFormat){
				case /*laya.webgl.WebGLContext.DEPTH_COMPONENT16*/0x81A5:
					clearFlag |=/*laya.webgl.WebGLContext.DEPTH_BUFFER_BIT*/0x00000100;
					break ;
				case /*laya.webgl.WebGLContext.STENCIL_INDEX8*/0x8D48:
					clearFlag |=/*laya.webgl.WebGLContext.STENCIL_BUFFER_BIT*/0x00000400;
					break ;
				case /*laya.webgl.WebGLContext.DEPTH_STENCIL*/0x84F9:
					clearFlag |=/*laya.webgl.WebGLContext.DEPTH_BUFFER_BIT*/0x00000100;
					clearFlag |=/*laya.webgl.WebGLContext.STENCIL_BUFFER_BIT*/0x00000400
					break ;
				}
			gl.clear(clearFlag);
		}

		__proto.end=function(){
			var gl=WebGL.mainContext;
			gl.bindFramebuffer(/*laya.webgl.WebGLContext.FRAMEBUFFER*/0x8D40,this._preRenderTarget ? this._preRenderTarget.bitmap.frameBuffer :null);
			this._alreadyResolved=true;
			RenderState2D.curRenderTarget=this._preRenderTarget;
			if (this._type==1){
				gl.viewport(0,0,this._svWidth,this._svHeight);
				RenderState2D.width=this._svWidth;
				RenderState2D.height=this._svHeight;
				Shader.activeShader=null;
			}else gl.viewport(0,0,Laya.stage.width,Laya.stage.height);
		}

		__proto.getData=function(x,y,width,height){
			var gl=WebGL.mainContext;
			gl.bindFramebuffer(/*laya.webgl.WebGLContext.FRAMEBUFFER*/0x8D40,(this.bitmap).frameBuffer);
			var canRead=(gl.checkFramebufferStatus(/*laya.webgl.WebGLContext.FRAMEBUFFER*/0x8D40)===/*laya.webgl.WebGLContext.FRAMEBUFFER_COMPLETE*/0x8CD5);
			if (!canRead){
				gl.bindFramebuffer(/*laya.webgl.WebGLContext.FRAMEBUFFER*/0x8D40,null);
				return null;
			};
			var pixels=new Uint8Array(this._w *this._h *4);
			gl.readPixels(x,y,width,height,this._surfaceFormat,this._surfaceType,pixels);
			gl.bindFramebuffer(/*laya.webgl.WebGLContext.FRAMEBUFFER*/0x8D40,null);
			return pixels;
		}

		/**??????????????????,???????????????????????????*/
		__proto.destroy=function(foreDiposeTexture){
			(foreDiposeTexture===void 0)&& (foreDiposeTexture=false);
			if (!this._destroy){
				this._loaded=false;
				this.bitmap.dispose();
				this.bitmap=null;
				this._destroy=true;
				_super.prototype.destroy.call(this);
			}
		}

		//?????????
		__proto.dispose=function(){}
		__proto._createWebGLRenderTarget=function(){
			this.bitmap=new WebGLRenderTarget(this.width,this.height,this._surfaceFormat,this._surfaceType,this._depthStencilFormat,this._mipMap,this._repeat,this._minFifter,this._magFifter);
			this.bitmap.activeResource();
			this._alreadyResolved=true;
			this._destroy=false;
			this._loaded=true;
		}

		__getset(0,__proto,'surfaceFormat',function(){
			return this._surfaceFormat;
		});

		__getset(0,__proto,'magFifter',function(){
			return this._magFifter;
		});

		__getset(0,__proto,'surfaceType',function(){
			return this._surfaceType;
		});

		__getset(0,__proto,'mipMap',function(){
			return this._mipMap;
		});

		__getset(0,__proto,'depthStencilFormat',function(){
			return this._depthStencilFormat;
		});

		//}
		__getset(0,__proto,'minFifter',function(){
			return this._minFifter;
		});

		/**??????RenderTarget???Texture*/
		__getset(0,__proto,'source',function(){
			if (this._alreadyResolved)
				return _super.prototype._$get_source.call(this);
			throw new Error("RenderTarget  ??????????????????");
		});

		RenderTarget2D.create=function(w,h,surfaceFormat,surfaceType,depthStencilFormat,mipMap,repeat,minFifter,magFifter){
			(surfaceFormat===void 0)&& (surfaceFormat=/*laya.webgl.WebGLContext.RGBA*/0x1908);
			(surfaceType===void 0)&& (surfaceType=/*laya.webgl.WebGLContext.UNSIGNED_BYTE*/0x1401);
			(depthStencilFormat===void 0)&& (depthStencilFormat=/*laya.webgl.WebGLContext.DEPTH_COMPONENT16*/0x81A5);
			(mipMap===void 0)&& (mipMap=false);
			(repeat===void 0)&& (repeat=false);
			(minFifter===void 0)&& (minFifter=-1);
			(magFifter===void 0)&& (magFifter=-1);
			var t=RenderTarget2D.POOL.pop();
			t || (t=new RenderTarget2D(w,h));
			if (!t.bitmap || t._w !=w || t._h !=h || t._surfaceFormat !=surfaceFormat || t._surfaceType !=surfaceType || t._depthStencilFormat !=depthStencilFormat || t._mipMap !=mipMap || t._repeat !=repeat || t._minFifter !=minFifter || t._magFifter !=magFifter){
				t._w=w;
				t._h=h;
				t._surfaceFormat=surfaceFormat;
				t._surfaceType=surfaceType;
				t._depthStencilFormat=depthStencilFormat;
				t._mipMap=mipMap;
				t._repeat=repeat;
				t._minFifter=minFifter;
				t._magFifter=magFifter;
				t.release();
				t._createWebGLRenderTarget();
			}
			return t;
		}

		RenderTarget2D.TYPE2D=1;
		RenderTarget2D.TYPE3D=2;
		RenderTarget2D.POOL=[];
		return RenderTarget2D;
	})(Texture)


	//class laya.webgl.utils.Buffer extends laya.resource.Resource
	var Buffer=(function(_super){
		function Buffer(){
			this._glBuffer=null;
			this._buffer=null;
			this._bufferType=0;
			this._bufferUsage=0;
			this._byteLength=0;
			Buffer.__super.call(this);
			Buffer._gl=WebGL.mainContext;
		}

		__class(Buffer,'laya.webgl.utils.Buffer',_super);
		var __proto=Buffer.prototype;
		__proto._bind=function(){
			this.activeResource();
			(Buffer._bindActive[this._bufferType]===this._glBuffer)|| (Buffer._gl.bindBuffer(this._bufferType,Buffer._bindActive[this._bufferType]=this._glBuffer),Shader.activeShader=null);
		}

		__proto.recreateResource=function(){
			this.startCreate();
			this._glBuffer || (this._glBuffer=Buffer._gl.createBuffer());
			this.completeCreate();
		}

		__proto.detoryResource=function(){
			if (this._glBuffer){
				WebGL.mainContext.deleteBuffer(this._glBuffer);
				this._glBuffer=null;
			}
			this.memorySize=0;
		}

		__proto.dispose=function(){
			this.resourceManager.removeResource(this);
			_super.prototype.dispose.call(this);
		}

		//TODO:??????
		__getset(0,__proto,'byteLength',function(){
			return this._byteLength;
		});

		__getset(0,__proto,'bufferType',function(){
			return this._bufferType;
		});

		__getset(0,__proto,'bufferUsage',function(){
			return this._bufferUsage;
		});

		Buffer._gl=null
		Buffer._bindActive={};
		return Buffer;
	})(Resource)


	//class laya.webgl.shader.d2.skinAnishader.SkinSV extends laya.webgl.shader.d2.value.Value2D
	var SkinSV=(function(_super){
		function SkinSV(type){
			this.texcoord=null;
			this.offsetX=300;
			this.offsetY=0;
			SkinSV.__super.call(this,/*laya.webgl.shader.d2.ShaderDefines2D.SKINMESH*/0x200,0);
			var _vlen=8 *CONST3D2D.BYTES_PE;
			this.position=[2,/*laya.webgl.WebGLContext.FLOAT*/0x1406,false,_vlen,0];
			this.texcoord=[2,/*laya.webgl.WebGLContext.FLOAT*/0x1406,false,_vlen,2 *CONST3D2D.BYTES_PE];
			this.color=[4,/*laya.webgl.WebGLContext.FLOAT*/0x1406,false,_vlen,4 *CONST3D2D.BYTES_PE];
		}

		__class(SkinSV,'laya.webgl.shader.d2.skinAnishader.SkinSV',_super);
		return SkinSV;
	})(Value2D)


	//class laya.webgl.shader.d2.value.Color2dSV extends laya.webgl.shader.d2.value.Value2D
	var Color2dSV=(function(_super){
		function Color2dSV(args){
			Color2dSV.__super.call(this,/*laya.webgl.shader.d2.ShaderDefines2D.COLOR2D*/0x02,0);
			this.color=[];
		}

		__class(Color2dSV,'laya.webgl.shader.d2.value.Color2dSV',_super);
		var __proto=Color2dSV.prototype;
		__proto.setValue=function(value){
			value.fillStyle&&(this.color=value.fillStyle._color._color);
			value.strokeStyle&&(this.color=value.strokeStyle._color._color);
		}

		return Color2dSV;
	})(Value2D)


	//class laya.webgl.shader.d2.value.FillTextureSV extends laya.webgl.shader.d2.value.Value2D
	var FillTextureSV=(function(_super){
		function FillTextureSV(type){
			this.u_colorMatrix=null;
			this.strength=0;
			this.colorMat=null;
			this.colorAlpha=null;
			this.u_TexRange=[0,1,0,1];
			this.u_offset=[0,0];
			this.texcoord=Value2D._TEXCOORD;
			FillTextureSV.__super.call(this,/*laya.webgl.shader.d2.ShaderDefines2D.FILLTEXTURE*/0x100,0);
		}

		__class(FillTextureSV,'laya.webgl.shader.d2.value.FillTextureSV',_super);
		var __proto=FillTextureSV.prototype;
		//this.color=[4,WebGLContext.FLOAT,false,_vlen,4 *CONST3D2D.BYTES_PE];
		__proto.setValue=function(vo){
			this.ALPHA=vo.ALPHA;
			vo.filters && this.setFilters(vo.filters);
		}

		__proto.clear=function(){
			this.texture=null;
			this.shader=null;
			this.defines.setValue(0);
		}

		return FillTextureSV;
	})(Value2D)


	//class laya.webgl.shader.d2.value.TextureSV extends laya.webgl.shader.d2.value.Value2D
	var TextureSV=(function(_super){
		function TextureSV(subID){
			this.u_colorMatrix=null;
			this.strength=0;
			this.colorMat=null;
			this.colorAlpha=null;
			this.texcoord=Value2D._TEXCOORD;
			(subID===void 0)&& (subID=0);
			TextureSV.__super.call(this,/*laya.webgl.shader.d2.ShaderDefines2D.TEXTURE2D*/0x01,subID);
		}

		__class(TextureSV,'laya.webgl.shader.d2.value.TextureSV',_super);
		var __proto=TextureSV.prototype;
		__proto.setValue=function(vo){
			this.ALPHA=vo.ALPHA;
			vo.filters && this.setFilters(vo.filters);
		}

		__proto.clear=function(){
			this.texture=null;
			this.shader=null;
			this.defines.setValue(0);
		}

		return TextureSV;
	})(Value2D)


	//class laya.webgl.shader.d2.value.PrimitiveSV extends laya.webgl.shader.d2.value.Value2D
	var PrimitiveSV=(function(_super){
		function PrimitiveSV(args){
			this.a_color=null;
			this.u_pos=[0,0];
			PrimitiveSV.__super.call(this,/*laya.webgl.shader.d2.ShaderDefines2D.PRIMITIVE*/0x04,0);
			this.position=[2,/*laya.webgl.WebGLContext.FLOAT*/0x1406,false,5 *CONST3D2D.BYTES_PE,0];
			this.a_color=[3,/*laya.webgl.WebGLContext.FLOAT*/0x1406,false,5 *CONST3D2D.BYTES_PE,2 *CONST3D2D.BYTES_PE];
		}

		__class(PrimitiveSV,'laya.webgl.shader.d2.value.PrimitiveSV',_super);
		return PrimitiveSV;
	})(Value2D)


	//class laya.webgl.atlas.AtlasWebGLCanvas extends laya.resource.Bitmap
	var AtlasWebGLCanvas=(function(_super){
		function AtlasWebGLCanvas(){
			this._flashCacheImage=null;
			this._flashCacheImageNeedFlush=false;
			AtlasWebGLCanvas.__super.call(this);
		}

		__class(AtlasWebGLCanvas,'laya.webgl.atlas.AtlasWebGLCanvas',_super);
		var __proto=AtlasWebGLCanvas.prototype;
		/***??????????????????*/
		__proto.recreateResource=function(){
			this.startCreate();
			var gl=WebGL.mainContext;
			var glTex=this._source=gl.createTexture();
			var preTarget=WebGLContext.curBindTexTarget;
			var preTexture=WebGLContext.curBindTexValue;
			WebGLContext.bindTexture(gl,/*laya.webgl.WebGLContext.TEXTURE_2D*/0x0DE1,glTex);
			gl.texImage2D(/*laya.webgl.WebGLContext.TEXTURE_2D*/0x0DE1,0,/*laya.webgl.WebGLContext.RGBA*/0x1908,this._w,this._h,0,/*laya.webgl.WebGLContext.RGBA*/0x1908,/*laya.webgl.WebGLContext.UNSIGNED_BYTE*/0x1401,null);
			gl.texParameteri(/*laya.webgl.WebGLContext.TEXTURE_2D*/0x0DE1,/*laya.webgl.WebGLContext.TEXTURE_MIN_FILTER*/0x2801,/*laya.webgl.WebGLContext.LINEAR*/0x2601);
			gl.texParameteri(/*laya.webgl.WebGLContext.TEXTURE_2D*/0x0DE1,/*laya.webgl.WebGLContext.TEXTURE_MAG_FILTER*/0x2800,/*laya.webgl.WebGLContext.LINEAR*/0x2601);
			gl.texParameteri(/*laya.webgl.WebGLContext.TEXTURE_2D*/0x0DE1,/*laya.webgl.WebGLContext.TEXTURE_WRAP_S*/0x2802,/*laya.webgl.WebGLContext.CLAMP_TO_EDGE*/0x812F);
			gl.texParameteri(/*laya.webgl.WebGLContext.TEXTURE_2D*/0x0DE1,/*laya.webgl.WebGLContext.TEXTURE_WRAP_T*/0x2803,/*laya.webgl.WebGLContext.CLAMP_TO_EDGE*/0x812F);
			(preTarget && preTexture)&& (WebGLContext.bindTexture(gl,preTarget,preTexture));
			this.memorySize=this._w *this._h *4;
			this.completeCreate();
		}

		/***????????????*/
		__proto.detoryResource=function(){
			if (this._source){
				WebGL.mainContext.deleteTexture(this._source);
				this._source=null;
				this.memorySize=0;
			}
		}

		/**??????image???WebGLTexture????????????*/
		__proto.texSubImage2D=function(xoffset,yoffset,bitmap){
			if (!Render.isFlash){
				var gl=WebGL.mainContext;
				var preTarget=WebGLContext.curBindTexTarget;
				var preTexture=WebGLContext.curBindTexValue;
				WebGLContext.bindTexture(gl,/*laya.webgl.WebGLContext.TEXTURE_2D*/0x0DE1,this._source);
				(xoffset-1 >=0)&& (gl.texSubImage2D(/*laya.webgl.WebGLContext.TEXTURE_2D*/0x0DE1,0,xoffset-1,yoffset,/*laya.webgl.WebGLContext.RGBA*/0x1908,/*laya.webgl.WebGLContext.UNSIGNED_BYTE*/0x1401,bitmap));
				(xoffset+1 <=this._w)&& (gl.texSubImage2D(/*laya.webgl.WebGLContext.TEXTURE_2D*/0x0DE1,0,xoffset+1,yoffset,/*laya.webgl.WebGLContext.RGBA*/0x1908,/*laya.webgl.WebGLContext.UNSIGNED_BYTE*/0x1401,bitmap));
				(yoffset-1 >=0)&& (gl.texSubImage2D(/*laya.webgl.WebGLContext.TEXTURE_2D*/0x0DE1,0,xoffset,yoffset-1,/*laya.webgl.WebGLContext.RGBA*/0x1908,/*laya.webgl.WebGLContext.UNSIGNED_BYTE*/0x1401,bitmap));
				(yoffset+1 <=this._h)&& (gl.texSubImage2D(/*laya.webgl.WebGLContext.TEXTURE_2D*/0x0DE1,0,xoffset,yoffset+1,/*laya.webgl.WebGLContext.RGBA*/0x1908,/*laya.webgl.WebGLContext.UNSIGNED_BYTE*/0x1401,bitmap));
				gl.texSubImage2D(/*laya.webgl.WebGLContext.TEXTURE_2D*/0x0DE1,0,xoffset,yoffset,/*laya.webgl.WebGLContext.RGBA*/0x1908,/*laya.webgl.WebGLContext.UNSIGNED_BYTE*/0x1401,bitmap);
				(preTarget && preTexture)&& (WebGLContext.bindTexture(gl,preTarget,preTexture));
				}else {
				if (!this._flashCacheImage){
					this._flashCacheImage=HTMLImage.create(null);
					this._flashCacheImage.image.createCanvas(this._w,this._h);
				};
				var bmData=bitmap.bitmapdata;
				(xoffset-1 >=0)&& (this._flashCacheImage.image.copyPixels(bmData,0,0,bmData.width-1,bmData.height,xoffset,yoffset));
				(xoffset+1 <=this._w)&& (this._flashCacheImage.image.copyPixels(bmData,0,0,bmData.width+1,bmData.height,xoffset,yoffset));
				(yoffset-1 >=0)&& (this._flashCacheImage.image.copyPixels(bmData,0,0,bmData.width,bmData.height-1,xoffset,yoffset));
				(yoffset+1 <=this._h)&& (this._flashCacheImage.image.copyPixels(bmData,0,0,bmData.width+1,bmData.height,xoffset,yoffset));
				this._flashCacheImage.image.copyPixels(bmData,0,0,bmData.width,bmData.height,xoffset,yoffset);
				(this._flashCacheImageNeedFlush)|| (this._flashCacheImageNeedFlush=true);
			}
		}

		/**??????image???WebGLTexture????????????*/
		__proto.texSubImage2DPixel=function(xoffset,yoffset,width,height,pixel){
			var gl=WebGL.mainContext;
			var preTarget=WebGLContext.curBindTexTarget;
			var preTexture=WebGLContext.curBindTexValue;
			WebGLContext.bindTexture(gl,/*laya.webgl.WebGLContext.TEXTURE_2D*/0x0DE1,this._source);
			var pixels=new Uint8Array(pixel.data);
			gl.texSubImage2D(/*laya.webgl.WebGLContext.TEXTURE_2D*/0x0DE1,0,xoffset,yoffset,width,height,/*laya.webgl.WebGLContext.RGBA*/0x1908,/*laya.webgl.WebGLContext.UNSIGNED_BYTE*/0x1401,pixels);
			(preTarget && preTexture)&& (WebGLContext.bindTexture(gl,preTarget,preTexture));
		}

		/***
		*??????????????????
		*@param value ????????????
		*/
		__getset(0,__proto,'width',_super.prototype._$get_width,function(value){
			this._w=value;
		});

		/***
		*??????????????????
		*@param value ????????????
		*/
		__getset(0,__proto,'height',_super.prototype._$get_height,function(value){
			this._h=value;
		});

		return AtlasWebGLCanvas;
	})(Bitmap)


	//class laya.webgl.resource.WebGLCanvas extends laya.resource.Bitmap
	var WebGLCanvas=(function(_super){
		function WebGLCanvas(type){
			//this._ctx=null;
			this._is2D=false;
			//this._canvas=null;
			//this.iscpuSource=false;
			var _$this=this;
			WebGLCanvas.__super.call(this);
			this._canvas=this;
			if (type==="2D" || (type==="AUTO" && !Render.isWebGL)){
				this._is2D=true;
				this._canvas=this._source=Browser.createElement("canvas");
				this.iscpuSource=true;
				var o=this;
				o.getContext=function (contextID,other){
					if (_$this._ctx)return _$this._ctx;
					var ctx=_$this._ctx=_$this._canvas.getContext(contextID,other);
					if (ctx){
						ctx._canvas=o;
						ctx.size=function (){
						};
					}
					return ctx;
				}
			}else this._canvas={};
		}

		__class(WebGLCanvas,'laya.webgl.resource.WebGLCanvas',_super);
		var __proto=WebGLCanvas.prototype;
		__proto.clear=function(){
			this._ctx && this._ctx.clear();
		}

		__proto.destroy=function(){
			this._ctx && this._ctx.destroy();
			this._ctx=null;
		}

		__proto._setContext=function(context){
			this._ctx=context;
		}

		__proto.getContext=function(contextID,other){
			return this._ctx ? this._ctx :(this._ctx=WebGLCanvas._createContext(this));
		}

		/*override public function copyTo(dec:Bitmap):void {
		super.copyTo(dec);
		(dec as WebGLCanvas)._ctx=_ctx;
	}*/


	__proto.size=function(w,h){
		if (this._w !=w || this._h !=h){
			this._w=w;
			this._h=h;
			this._ctx && this._ctx.size(w,h);
			this._canvas && (this._canvas.height=h,this._canvas.width=w);
		}

	}


	__proto.recreateResource=function(){
		this.startCreate();
		this.createWebGlTexture();
		this.completeCreate();
	}


	__proto.detoryResource=function(){
		if (this._source && !this.iscpuSource){
			WebGL.mainContext.deleteTexture(this._source);
			this._source=null;
			this.memorySize=0;
		}

	}


	__proto.createWebGlTexture=function(){
		var gl=WebGL.mainContext;
		if (!this._canvas){
			throw "create GLTextur err:no data:"+this._canvas;
		};

		var glTex=this._source=gl.createTexture();
		this.iscpuSource=false;
		var preTarget=WebGLContext.curBindTexTarget;
		var preTexture=WebGLContext.curBindTexValue;
		WebGLContext.bindTexture(gl,/*laya.webgl.WebGLContext.TEXTURE_2D*/0x0DE1,glTex);
		gl.texImage2D(/*laya.webgl.WebGLContext.TEXTURE_2D*/0x0DE1,0,/*laya.webgl.WebGLContext.RGBA*/0x1908,this._w,this._h,0,/*laya.webgl.WebGLContext.RGBA*/0x1908,/*laya.webgl.WebGLContext.UNSIGNED_BYTE*/0x1401,null);
		gl.texParameteri(/*laya.webgl.WebGLContext.TEXTURE_2D*/0x0DE1,/*laya.webgl.WebGLContext.TEXTURE_MAG_FILTER*/0x2800,/*laya.webgl.WebGLContext.LINEAR*/0x2601);
		gl.texParameteri(/*laya.webgl.WebGLContext.TEXTURE_2D*/0x0DE1,/*laya.webgl.WebGLContext.TEXTURE_MIN_FILTER*/0x2801,/*laya.webgl.WebGLContext.LINEAR*/0x2601);
		gl.texParameteri(/*laya.webgl.WebGLContext.TEXTURE_2D*/0x0DE1,/*laya.webgl.WebGLContext.TEXTURE_WRAP_S*/0x2802,/*laya.webgl.WebGLContext.CLAMP_TO_EDGE*/0x812F);
		gl.texParameteri(/*laya.webgl.WebGLContext.TEXTURE_2D*/0x0DE1,/*laya.webgl.WebGLContext.TEXTURE_WRAP_T*/0x2803,/*laya.webgl.WebGLContext.CLAMP_TO_EDGE*/0x812F);
		this.memorySize=this._w *this._h *4;
		(preTarget && preTexture)&& (WebGLContext.bindTexture(gl,preTarget,preTexture));
		this._canvas=null;
	}


	__proto.texSubImage2D=function(webglCanvas,xoffset,yoffset){
		var gl=WebGL.mainContext;
		var preTarget=WebGLContext.curBindTexTarget;
		var preTexture=WebGLContext.curBindTexValue;
		WebGLContext.bindTexture(gl,/*laya.webgl.WebGLContext.TEXTURE_2D*/0x0DE1,this._source);
		gl.texSubImage2D(/*laya.webgl.WebGLContext.TEXTURE_2D*/0x0DE1,0,xoffset,yoffset,/*laya.webgl.WebGLContext.RGBA*/0x1908,/*laya.webgl.WebGLContext.UNSIGNED_BYTE*/0x1401,webglCanvas._source);
		(preTarget && preTexture)&& (WebGLContext.bindTexture(gl,preTarget,preTexture));
	}


	/**
	*??????HTML Image,as3???internal???friend??????????????????????????????image??????????????????
	*@param HTML Image
	*/
	__getset(0,__proto,'canvas',function(){
		return this._canvas;
	});


	__getset(0,__proto,'context',function(){
		return this._ctx;
	});


	__getset(0,__proto,'asBitmap',null,function(value){
		this._ctx && (this._ctx.asBitmap=value);
	});


	WebGLCanvas.create=function(type){
		return new WebGLCanvas(type);
	}


	WebGLCanvas._createContext=null
	return WebGLCanvas;
	})(Bitmap)


	//class laya.webgl.resource.WebGLCharImage extends laya.resource.Bitmap
	var WebGLCharImage=(function(_super){
		function WebGLCharImage(canvas,char){
			this.borderSize=12;
			//this._ctx=null;
			//this._allowMerageInAtlas=false;
			//this._enableMerageInAtlas=false;
			//this.canvas=null;
			//this.char=null;
			WebGLCharImage.__super.call(this);
			this.canvas=canvas;
			this.char=char;
			this._enableMerageInAtlas=true;
			var bIsConchApp=Render.isConchApp;
			if (bIsConchApp){
				/*__JS__ */this._ctx=canvas;
				}else {
				this._ctx=canvas.getContext('2d',undefined);
			};
			var xs=char.xs,ys=char.ys;
			var t=null;
			if (bIsConchApp){
				this._ctx.font=char.font;
				t=this._ctx.measureText(char.char);
				char.width=t.width *xs;
				char.height=t.height *ys;
				}else {
				t=Utils.measureText(char.char,char.font);
				char.width=t.width *xs;
				char.height=t.height *ys;
			}
			this.onresize(char.width+this.borderSize *2,char.height+this.borderSize *2);
		}

		__class(WebGLCharImage,'laya.webgl.resource.WebGLCharImage',_super);
		var __proto=WebGLCharImage.prototype;
		Laya.imps(__proto,{"laya.webgl.resource.IMergeAtlasBitmap":true})
		__proto.recreateResource=function(){
			this.startCreate();
			var char=this.char;
			var bIsConchApp=Render.isConchApp;
			var xs=char.xs,ys=char.ys;
			this.onresize(char.width+this.borderSize *2,char.height+this.borderSize *2);
			this.canvas && (this.canvas.height=this._h,this.canvas.width=this._w);
			if (bIsConchApp){
				var nFontSize=char.fontSize;
				if (xs !=1 || ys !=1){
					nFontSize=parseInt(nFontSize *((xs > ys)? xs :ys)+"");
				};
				var sFont="normal 100 "+nFontSize+"px Arial";
				if (char.borderColor){
					sFont+=" 1 "+char.borderColor;
				}
				this._ctx.font=sFont;
				this._ctx.textBaseline="top";
				this._ctx.fillStyle=char.fillColor;
				this._ctx.fillText(char.char,this.borderSize,this.borderSize,null,null,null);
				}else {
				this._ctx.save();
				(this._ctx).clearRect(0,0,char.width+this.borderSize *2,char.height+this.borderSize *2);
				this._ctx.font=char.font;
				this._ctx.textBaseline="top";
				this._ctx.translate(this.borderSize,this.borderSize);
				if (xs !=1 || ys !=1){
					this._ctx.scale(xs,ys);
				}
				if (char.fillColor && char.borderColor){
					/*__JS__ */this._ctx.strokeStyle=char.borderColor;
					/*__JS__ */this._ctx.lineWidth=char.lineWidth;
					this._ctx.strokeText(char.char,0,0,null,null,0,null);
					this._ctx.fillStyle=char.fillColor;
					this._ctx.fillText(char.char,0,0,null,null,null);
					}else {
					if (char.lineWidth===-1){
						this._ctx.fillStyle=char.fillColor ? char.fillColor :"white";
						this._ctx.fillText(char.char,0,0,null,null,null);
						}else {
						/*__JS__ */this._ctx.strokeStyle=char.borderColor?char.borderColor:'white';
						/*__JS__ */this._ctx.lineWidth=char.lineWidth;
						this._ctx.strokeText(char.char,0,0,null,null,0,null);
					}
				}
				this._ctx.restore();
			}
			char.borderSize=this.borderSize;
			this.completeCreate();
		}

		__proto.onresize=function(w,h){
			this._w=w;
			this._h=h;
			if ((this._w < AtlasResourceManager.atlasLimitWidth && this._h < AtlasResourceManager.atlasLimitHeight)){
				this._allowMerageInAtlas=true
				}else {
				this._allowMerageInAtlas=false;
				throw new Error("???????????????????????????????????????");
			}
		}

		__proto.clearAtlasSource=function(){}
		/**
		*??????????????????Source
		*@return ????????????
		*/
		__getset(0,__proto,'allowMerageInAtlas',function(){
			return this._allowMerageInAtlas;
		});

		__getset(0,__proto,'atlasSource',function(){
			return this.canvas;
		});

		/**
		*??????????????????Source,??????????????????
		*@param value ????????????
		*/
		/**
		*??????????????????Source
		*@return ????????????
		*/
		__getset(0,__proto,'enableMerageInAtlas',function(){
			return this._enableMerageInAtlas;
			},function(value){
			this._enableMerageInAtlas=value;
		});

		return WebGLCharImage;
	})(Bitmap)


	//class laya.webgl.resource.WebGLRenderTarget extends laya.resource.Bitmap
	var WebGLRenderTarget=(function(_super){
		function WebGLRenderTarget(width,height,surfaceFormat,surfaceType,depthStencilFormat,mipMap,repeat,minFifter,magFifter){
			//this._frameBuffer=null;
			//this._depthStencilBuffer=null;
			//this._surfaceFormat=0;
			//this._surfaceType=0;
			//this._depthStencilFormat=0;
			//this._mipMap=false;
			//this._repeat=false;
			//this._minFifter=0;
			//this._magFifter=0;
			(surfaceFormat===void 0)&& (surfaceFormat=/*laya.webgl.WebGLContext.RGBA*/0x1908);
			(surfaceType===void 0)&& (surfaceType=/*laya.webgl.WebGLContext.UNSIGNED_BYTE*/0x1401);
			(depthStencilFormat===void 0)&& (depthStencilFormat=/*laya.webgl.WebGLContext.DEPTH_COMPONENT16*/0x81A5);
			(mipMap===void 0)&& (mipMap=false);
			(repeat===void 0)&& (repeat=false);
			(minFifter===void 0)&& (minFifter=-1);
			(magFifter===void 0)&& (magFifter=1);
			WebGLRenderTarget.__super.call(this);
			this._w=width;
			this._h=height;
			this._surfaceFormat=surfaceFormat;
			this._surfaceType=surfaceType;
			this._depthStencilFormat=depthStencilFormat;
			this._mipMap=mipMap;
			this._repeat=repeat;
			this._minFifter=minFifter;
			this._magFifter=magFifter;
		}

		__class(WebGLRenderTarget,'laya.webgl.resource.WebGLRenderTarget',_super);
		var __proto=WebGLRenderTarget.prototype;
		__proto.recreateResource=function(){
			this.startCreate();
			var gl=WebGL.mainContext;
			this._frameBuffer || (this._frameBuffer=gl.createFramebuffer());
			this._source || (this._source=gl.createTexture());
			var preTarget=WebGLContext.curBindTexTarget;
			var preTexture=WebGLContext.curBindTexValue;
			WebGLContext.bindTexture(gl,/*laya.webgl.WebGLContext.TEXTURE_2D*/0x0DE1,this._source);
			gl.texImage2D(/*laya.webgl.WebGLContext.TEXTURE_2D*/0x0DE1,0,/*laya.webgl.WebGLContext.RGBA*/0x1908,this._w,this._h,0,this._surfaceFormat,this._surfaceType,null);
			var minFifter=this._minFifter;
			var magFifter=this._magFifter;
			var repeat=this._repeat ? /*laya.webgl.WebGLContext.REPEAT*/0x2901 :/*laya.webgl.WebGLContext.CLAMP_TO_EDGE*/0x812F;
			var isPot=Arith.isPOT(this._w,this._h);
			if (isPot){
				if (this._mipMap)
					(minFifter!==-1)|| (minFifter=/*laya.webgl.WebGLContext.LINEAR_MIPMAP_LINEAR*/0x2703);
				else
				(minFifter!==-1)|| (minFifter=/*laya.webgl.WebGLContext.LINEAR*/0x2601);
				(magFifter!==-1)|| (magFifter=/*laya.webgl.WebGLContext.LINEAR*/0x2601);
				gl.texParameteri(/*laya.webgl.WebGLContext.TEXTURE_2D*/0x0DE1,/*laya.webgl.WebGLContext.TEXTURE_MIN_FILTER*/0x2801,minFifter);
				gl.texParameteri(/*laya.webgl.WebGLContext.TEXTURE_2D*/0x0DE1,/*laya.webgl.WebGLContext.TEXTURE_MAG_FILTER*/0x2800,magFifter);
				gl.texParameteri(/*laya.webgl.WebGLContext.TEXTURE_2D*/0x0DE1,/*laya.webgl.WebGLContext.TEXTURE_WRAP_S*/0x2802,repeat);
				gl.texParameteri(/*laya.webgl.WebGLContext.TEXTURE_2D*/0x0DE1,/*laya.webgl.WebGLContext.TEXTURE_WRAP_T*/0x2803,repeat);
				this._mipMap && gl.generateMipmap(/*laya.webgl.WebGLContext.TEXTURE_2D*/0x0DE1);
				}else {
				(minFifter!==-1)|| (minFifter=/*laya.webgl.WebGLContext.LINEAR*/0x2601);
				(magFifter!==-1)|| (magFifter=/*laya.webgl.WebGLContext.LINEAR*/0x2601);
				gl.texParameteri(/*laya.webgl.WebGLContext.TEXTURE_2D*/0x0DE1,/*laya.webgl.WebGLContext.TEXTURE_MIN_FILTER*/0x2801,minFifter);
				gl.texParameteri(/*laya.webgl.WebGLContext.TEXTURE_2D*/0x0DE1,/*laya.webgl.WebGLContext.TEXTURE_MAG_FILTER*/0x2800,magFifter);
				gl.texParameteri(/*laya.webgl.WebGLContext.TEXTURE_2D*/0x0DE1,/*laya.webgl.WebGLContext.TEXTURE_WRAP_S*/0x2802,/*laya.webgl.WebGLContext.CLAMP_TO_EDGE*/0x812F);
				gl.texParameteri(/*laya.webgl.WebGLContext.TEXTURE_2D*/0x0DE1,/*laya.webgl.WebGLContext.TEXTURE_WRAP_T*/0x2803,/*laya.webgl.WebGLContext.CLAMP_TO_EDGE*/0x812F);
			}
			gl.bindFramebuffer(/*laya.webgl.WebGLContext.FRAMEBUFFER*/0x8D40,this._frameBuffer);
			gl.framebufferTexture2D(/*laya.webgl.WebGLContext.FRAMEBUFFER*/0x8D40,/*laya.webgl.WebGLContext.COLOR_ATTACHMENT0*/0x8CE0,/*laya.webgl.WebGLContext.TEXTURE_2D*/0x0DE1,this._source,0);
			if (this._depthStencilFormat){
				this._depthStencilBuffer || (this._depthStencilBuffer=gl.createRenderbuffer());
				gl.bindRenderbuffer(/*laya.webgl.WebGLContext.RENDERBUFFER*/0x8D41,this._depthStencilBuffer);
				gl.renderbufferStorage(/*laya.webgl.WebGLContext.RENDERBUFFER*/0x8D41,this._depthStencilFormat,this._w,this._h);
				switch (this._depthStencilFormat){
					case /*laya.webgl.WebGLContext.DEPTH_COMPONENT16*/0x81A5:
						gl.framebufferRenderbuffer(/*laya.webgl.WebGLContext.FRAMEBUFFER*/0x8D40,/*laya.webgl.WebGLContext.DEPTH_ATTACHMENT*/0x8D00,/*laya.webgl.WebGLContext.RENDERBUFFER*/0x8D41,this._depthStencilBuffer);
						break ;
					case /*laya.webgl.WebGLContext.STENCIL_INDEX8*/0x8D48:
						gl.framebufferRenderbuffer(/*laya.webgl.WebGLContext.FRAMEBUFFER*/0x8D40,/*laya.webgl.WebGLContext.STENCIL_ATTACHMENT*/0x8D20,/*laya.webgl.WebGLContext.RENDERBUFFER*/0x8D41,this._depthStencilBuffer);
						break ;
					case /*laya.webgl.WebGLContext.DEPTH_STENCIL*/0x84F9:
						gl.framebufferRenderbuffer(/*laya.webgl.WebGLContext.FRAMEBUFFER*/0x8D40,/*laya.webgl.WebGLContext.DEPTH_STENCIL_ATTACHMENT*/0x821A,/*laya.webgl.WebGLContext.RENDERBUFFER*/0x8D41,this._depthStencilBuffer);
						break ;
					}
			}
			gl.bindFramebuffer(/*laya.webgl.WebGLContext.FRAMEBUFFER*/0x8D40,null);
			(preTarget && preTexture)&& (WebGLContext.bindTexture(gl,preTarget,preTexture));
			gl.bindRenderbuffer(/*laya.webgl.WebGLContext.RENDERBUFFER*/0x8D41,null);
			this.memorySize=this._w *this._h *4;
			this.completeCreate();
		}

		__proto.detoryResource=function(){
			if (this._frameBuffer){
				WebGL.mainContext.deleteTexture(this._source);
				WebGL.mainContext.deleteFramebuffer(this._frameBuffer);
				WebGL.mainContext.deleteRenderbuffer(this._depthStencilBuffer);
				this._source=null;
				this._frameBuffer=null;
				this._depthStencilBuffer=null;
				this.memorySize=0;
			}
		}

		__getset(0,__proto,'depthStencilBuffer',function(){
			return this._depthStencilBuffer;
		});

		__getset(0,__proto,'frameBuffer',function(){
			return this._frameBuffer;
		});

		return WebGLRenderTarget;
	})(Bitmap)


	//class laya.webgl.resource.WebGLSubImage extends laya.resource.Bitmap
	var WebGLSubImage=(function(_super){
		function WebGLSubImage(canvas,offsetX,offsetY,width,height,atlasImage,src,enableMerageInAtlas){
			//this._ctx=null;
			//this._allowMerageInAtlas=false;
			//this._enableMerageInAtlas=false;
			//this.canvas=null;
			//this.repeat=false;
			//this.mipmap=false;
			//this.minFifter=0;
			//this.magFifter=0;
			//this.atlasImage=null;
			this.offsetX=0;
			this.offsetY=0;
			//this.src=null;
			(enableMerageInAtlas===void 0)&& (enableMerageInAtlas=true);
			WebGLSubImage.__super.call(this);
			this.repeat=true;
			this.mipmap=false;
			this.minFifter=-1;
			this.magFifter=-1;
			this.atlasImage=atlasImage;
			this.canvas=canvas;
			this._ctx=canvas.getContext('2d',undefined);
			this._w=width;
			this._h=height;
			this.offsetX=offsetX;
			this.offsetY=offsetY;
			this.src=src;
			this._enableMerageInAtlas=enableMerageInAtlas;
		}

		__class(WebGLSubImage,'laya.webgl.resource.WebGLSubImage',_super);
		var __proto=WebGLSubImage.prototype;
		Laya.imps(__proto,{"laya.webgl.resource.IMergeAtlasBitmap":true})
		/*override public function copyTo(dec:Bitmap):void {
		var d:WebGLSubImage=dec as WebGLSubImage;
		super.copyTo(dec);
		d._ctx=_ctx;
	}*/


	__proto.size=function(w,h){
		this._w=w;
		this._h=h;
		this._ctx && this._ctx.size(w,h);
		this.canvas && (this.canvas.height=h,this.canvas.width=w);
	}


	__proto.recreateResource=function(){
		this.startCreate();
		this.size(this._w,this._h);
		this._ctx.drawImage(this.atlasImage,this.offsetX,this.offsetY,this._w,this._h,0,0,this._w,this._h);
		(!(AtlasResourceManager.enabled && this._allowMerageInAtlas))&& (this.createWebGlTexture());
		this.completeCreate();
	}


	__proto.createWebGlTexture=function(){
		var gl=WebGL.mainContext;
		if (!this.canvas){
			throw "create GLTextur err:no data:"+this.canvas;
		};

		var glTex=this._source=gl.createTexture();
		var preTarget=WebGLContext.curBindTexTarget;
		var preTexture=WebGLContext.curBindTexValue;
		WebGLContext.bindTexture(gl,/*laya.webgl.WebGLContext.TEXTURE_2D*/0x0DE1,glTex);
		gl.texImage2D(/*laya.webgl.WebGLContext.TEXTURE_2D*/0x0DE1,0,/*laya.webgl.WebGLContext.RGBA*/0x1908,/*laya.webgl.WebGLContext.RGBA*/0x1908,/*laya.webgl.WebGLContext.UNSIGNED_BYTE*/0x1401,this.canvas);
		var minFifter=this.minFifter;
		var magFifter=this.magFifter;
		var repeat=this.repeat ? /*laya.webgl.WebGLContext.REPEAT*/0x2901 :/*laya.webgl.WebGLContext.CLAMP_TO_EDGE*/0x812F;
		var isPOT=Arith.isPOT(this.width,this.height);
		if (isPOT){
			if (this.mipmap)
				(minFifter!==-1)|| (minFifter=/*laya.webgl.WebGLContext.LINEAR_MIPMAP_LINEAR*/0x2703);
			else
			(minFifter!==-1)|| (minFifter=/*laya.webgl.WebGLContext.LINEAR*/0x2601);
			(magFifter!==-1)|| (magFifter=/*laya.webgl.WebGLContext.LINEAR*/0x2601);
			gl.texParameteri(/*laya.webgl.WebGLContext.TEXTURE_2D*/0x0DE1,/*laya.webgl.WebGLContext.TEXTURE_MAG_FILTER*/0x2800,magFifter);
			gl.texParameteri(/*laya.webgl.WebGLContext.TEXTURE_2D*/0x0DE1,/*laya.webgl.WebGLContext.TEXTURE_MIN_FILTER*/0x2801,minFifter);
			gl.texParameteri(/*laya.webgl.WebGLContext.TEXTURE_2D*/0x0DE1,/*laya.webgl.WebGLContext.TEXTURE_WRAP_S*/0x2802,repeat);
			gl.texParameteri(/*laya.webgl.WebGLContext.TEXTURE_2D*/0x0DE1,/*laya.webgl.WebGLContext.TEXTURE_WRAP_T*/0x2803,repeat);
			this.mipmap && gl.generateMipmap(/*laya.webgl.WebGLContext.TEXTURE_2D*/0x0DE1);
			}else {
			(minFifter!==-1)|| (minFifter=/*laya.webgl.WebGLContext.LINEAR*/0x2601);
			(magFifter!==-1)|| (magFifter=/*laya.webgl.WebGLContext.LINEAR*/0x2601);
			gl.texParameteri(/*laya.webgl.WebGLContext.TEXTURE_2D*/0x0DE1,/*laya.webgl.WebGLContext.TEXTURE_MIN_FILTER*/0x2801,minFifter);
			gl.texParameteri(/*laya.webgl.WebGLContext.TEXTURE_2D*/0x0DE1,/*laya.webgl.WebGLContext.TEXTURE_MAG_FILTER*/0x2800,magFifter);
			gl.texParameteri(/*laya.webgl.WebGLContext.TEXTURE_2D*/0x0DE1,/*laya.webgl.WebGLContext.TEXTURE_WRAP_S*/0x2802,/*laya.webgl.WebGLContext.CLAMP_TO_EDGE*/0x812F);
			gl.texParameteri(/*laya.webgl.WebGLContext.TEXTURE_2D*/0x0DE1,/*laya.webgl.WebGLContext.TEXTURE_WRAP_T*/0x2803,/*laya.webgl.WebGLContext.CLAMP_TO_EDGE*/0x812F);
		}

		(preTarget && preTexture)&& (WebGLContext.bindTexture(gl,preTarget,preTexture));
		this.canvas=null;
		this.memorySize=this._w *this._h *4;
	}


	__proto.detoryResource=function(){
		if (!(AtlasResourceManager.enabled && this._allowMerageInAtlas)&& this._source){
			WebGL.mainContext.deleteTexture(this._source);
			this._source=null;
			this.memorySize=0;
		}

	}


	__proto.clearAtlasSource=function(){
		this.canvas=null;
	}


	__proto.dispose=function(){
		this.resourceManager.removeResource(this);
		_super.prototype.dispose.call(this);
	}


	/**
	*??????????????????Source
	*@return ????????????
	*/
	__getset(0,__proto,'allowMerageInAtlas',function(){
		return this._allowMerageInAtlas;
	});


	//public var createFromPixel:Boolean=true;
	__getset(0,__proto,'atlasSource',function(){
		return this.canvas;
	});


	/**
	*??????????????????Source,??????????????????
	*@param value ????????????
	*/
	/**
	*??????????????????Source
	*@return ????????????
	*/
	__getset(0,__proto,'enableMerageInAtlas',function(){
		return this._allowMerageInAtlas;
		},function(value){

		this._allowMerageInAtlas=value;
	});


	return WebGLSubImage;
	})(Bitmap)


	//class laya.webgl.shader.d2.Shader2X extends laya.webgl.shader.Shader
	var Shader2X=(function(_super){
		function Shader2X(vs,ps,saveName,nameMap){
			this._params2dQuick1=null;
			this._params2dQuick2=null;
			this._shaderValueWidth=NaN;
			this._shaderValueHeight=NaN;
			Shader2X.__super.call(this,vs,ps,saveName,nameMap);
		}

		__class(Shader2X,'laya.webgl.shader.d2.Shader2X',_super);
		var __proto=Shader2X.prototype;
		__proto.upload2dQuick1=function(shaderValue){
			this.upload(shaderValue,this._params2dQuick1 || this._make2dQuick1());
		}

		__proto._make2dQuick1=function(){
			if (!this._params2dQuick1){
				this.activeResource();
				this._params2dQuick1=[];
				var params=this._params,one;
				for (var i=0,n=params.length;i < n;i++){
					one=params[i];
					if (!Render.isFlash && (one.name==="size" || one.name==="mmat" || one.name==="position" || one.name==="texcoord"))continue ;
					this._params2dQuick1.push(one);
				}
			}
			return this._params2dQuick1;
		}

		__proto.detoryResource=function(){
			_super.prototype.detoryResource.call(this);
			this._params2dQuick1=null;
			this._params2dQuick2=null;
		}

		__proto.upload2dQuick2=function(shaderValue){
			this.upload(shaderValue,this._params2dQuick2 || this._make2dQuick2());
		}

		__proto._make2dQuick2=function(){
			if (!this._params2dQuick2){
				this.activeResource();
				this._params2dQuick2=[];
				var params=this._params,one;
				for (var i=0,n=params.length;i < n;i++){
					one=params[i];
					if (!Render.isFlash && (one.name==="size"))continue ;
					this._params2dQuick2.push(one);
				}
			}
			return this._params2dQuick2;
		}

		Shader2X.create=function(vs,ps,saveName,nameMap){
			return new Shader2X(vs,ps,saveName,nameMap);
		}

		return Shader2X;
	})(Shader)


	//class laya.webgl.utils.Buffer2D extends laya.webgl.utils.Buffer
	var Buffer2D=(function(_super){
		function Buffer2D(){
			this._maxsize=0;
			this._upload=true;
			this._uploadSize=0;
			Buffer2D.__super.call(this);
			this.lock=true;
		}

		__class(Buffer2D,'laya.webgl.utils.Buffer2D',_super);
		var __proto=Buffer2D.prototype;
		__proto._bufferData=function(){
			this._maxsize=Math.max(this._maxsize,this._byteLength);
			if (Stat.loopCount % 30==0){
				if (this._buffer.byteLength > (this._maxsize+64)){
					this.memorySize=this._buffer.byteLength;
					this._buffer=this._buffer.slice(0,this._maxsize+64);
					this._checkArrayUse();
				}
				this._maxsize=this._byteLength;
			}
			if (this._uploadSize < this._buffer.byteLength){
				this._uploadSize=this._buffer.byteLength;
				Buffer._gl.bufferData(this._bufferType,this._uploadSize,this._bufferUsage);
				this.memorySize=this._uploadSize;
			}
			Buffer._gl.bufferSubData(this._bufferType,0,this._buffer);
		}

		__proto._bufferSubData=function(offset,dataStart,dataLength){
			(offset===void 0)&& (offset=0);
			(dataStart===void 0)&& (dataStart=0);
			(dataLength===void 0)&& (dataLength=0);
			this._maxsize=Math.max(this._maxsize,this._byteLength);
			if (Stat.loopCount % 30==0){
				if (this._buffer.byteLength > (this._maxsize+64)){
					this.memorySize=this._buffer.byteLength;
					this._buffer=this._buffer.slice(0,this._maxsize+64);
					this._checkArrayUse();
				}
				this._maxsize=this._byteLength;
			}
			if (this._uploadSize < this._buffer.byteLength){
				this._uploadSize=this._buffer.byteLength;
				Buffer._gl.bufferData(this._bufferType,this._uploadSize,this._bufferUsage);
				this.memorySize=this._uploadSize;
			}
			if (dataStart || dataLength){
				var subBuffer=this._buffer.slice(dataStart,dataLength);
				Buffer._gl.bufferSubData(this._bufferType,offset,subBuffer);
				}else {
				Buffer._gl.bufferSubData(this._bufferType,offset,this._buffer);
			}
		}

		__proto._checkArrayUse=function(){}
		__proto._bind_upload=function(){
			if (!this._upload)
				return false;
			this._upload=false;
			this._bind();
			this._bufferData();
			return true;
		}

		__proto._bind_subUpload=function(offset,dataStart,dataLength){
			(offset===void 0)&& (offset=0);
			(dataStart===void 0)&& (dataStart=0);
			(dataLength===void 0)&& (dataLength=0);
			if (!this._upload)
				return false;
			this._upload=false;
			this._bind();
			this._bufferSubData(offset,dataStart,dataLength);
			return true;
		}

		__proto._resizeBuffer=function(nsz,copy){
			if (nsz < this._buffer.byteLength)
				return this;
			this.memorySize=nsz;
			if (copy && this._buffer && this._buffer.byteLength > 0){
				var newbuffer=new ArrayBuffer(nsz);
				var n=new Uint8Array(newbuffer);
				n.set(new Uint8Array(this._buffer),0);
				this._buffer=newbuffer;
			}else
			this._buffer=new ArrayBuffer(nsz);
			this._checkArrayUse();
			this._upload=true;
			return this;
		}

		__proto.append=function(data){
			this._upload=true;
			var byteLen=0,n;
			byteLen=data.byteLength;
			if ((data instanceof Uint8Array)){
				this._resizeBuffer(this._byteLength+byteLen,true);
				n=new Uint8Array(this._buffer,this._byteLength);
				}else if ((data instanceof Uint16Array)){
				this._resizeBuffer(this._byteLength+byteLen,true);
				n=new Uint16Array(this._buffer,this._byteLength);
				}else if ((data instanceof Float32Array)){
				this._resizeBuffer(this._byteLength+byteLen,true);
				n=new Float32Array(this._buffer,this._byteLength);
			}
			n.set(data,0);
			this._byteLength+=byteLen;
			this._checkArrayUse();
		}

		__proto.getBuffer=function(){
			return this._buffer;
		}

		__proto.setNeedUpload=function(){
			this._upload=true;
		}

		__proto.getNeedUpload=function(){
			return this._upload;
		}

		__proto.upload=function(){
			var scuess=this._bind_upload();
			Buffer._gl.bindBuffer(this._bufferType,null);
			Buffer._bindActive[this._bufferType]=null;
			Shader.activeShader=null
			return scuess;
		}

		__proto.subUpload=function(offset,dataStart,dataLength){
			(offset===void 0)&& (offset=0);
			(dataStart===void 0)&& (dataStart=0);
			(dataLength===void 0)&& (dataLength=0);
			var scuess=this._bind_subUpload();
			Buffer._gl.bindBuffer(this._bufferType,null);
			Buffer._bindActive[this._bufferType]=null;
			Shader.activeShader=null
			return scuess;
		}

		__proto.detoryResource=function(){
			_super.prototype.detoryResource.call(this);
			this._upload=true;
			this._uploadSize=0;
		}

		__proto.clear=function(){
			this._byteLength=0;
			this._upload=true;
		}

		__getset(0,__proto,'bufferLength',function(){
			return this._buffer.byteLength;
		});

		__getset(0,__proto,'byteLength',_super.prototype._$get_byteLength,function(value){
			if (this._byteLength===value)
				return;
			value <=this._buffer.byteLength || (this._resizeBuffer(value *2+256,true));
			this._byteLength=value;
		});

		Buffer2D.__int__=function(gl){
			IndexBuffer2D.QuadrangleIB=IndexBuffer2D.create(/*laya.webgl.WebGLContext.STATIC_DRAW*/0x88E4);
			GlUtils.fillIBQuadrangle(IndexBuffer2D.QuadrangleIB,16);
		}

		Buffer2D.FLOAT32=4;
		Buffer2D.SHORT=2;
		return Buffer2D;
	})(Buffer)


	//class laya.webgl.shader.d2.value.GlowSV extends laya.webgl.shader.d2.value.TextureSV
	var GlowSV=(function(_super){
		function GlowSV(args){
			this.u_blurX=false;
			this.u_color=null;
			this.u_offset=null;
			this.u_strength=NaN;
			this.u_texW=0;
			this.u_texH=0;
			GlowSV.__super.call(this,/*laya.webgl.shader.d2.ShaderDefines2D.FILTERGLOW*/0x08| /*laya.webgl.shader.d2.ShaderDefines2D.TEXTURE2D*/0x01);
		}

		__class(GlowSV,'laya.webgl.shader.d2.value.GlowSV',_super);
		var __proto=GlowSV.prototype;
		__proto.setValue=function(vo){
			_super.prototype.setValue.call(this,vo);
		}

		__proto.clear=function(){
			_super.prototype.clear.call(this);
		}

		return GlowSV;
	})(TextureSV)


	//class laya.webgl.shader.d2.value.TextSV extends laya.webgl.shader.d2.value.TextureSV
	var TextSV=(function(_super){
		function TextSV(args){
			TextSV.__super.call(this,/*laya.webgl.shader.d2.ShaderDefines2D.COLORADD*/0x40);
			this.defines.add(/*laya.webgl.shader.d2.ShaderDefines2D.COLORADD*/0x40);
		}

		__class(TextSV,'laya.webgl.shader.d2.value.TextSV',_super);
		var __proto=TextSV.prototype;
		__proto.release=function(){
			TextSV.pool[TextSV._length++]=this;
			this.clear();
		}

		__proto.clear=function(){
			_super.prototype.clear.call(this);
		}

		TextSV.create=function(){
			if (TextSV._length)return TextSV.pool[--TextSV._length];
			else return new TextSV(null);
		}

		TextSV.pool=[];
		TextSV._length=0;
		return TextSV;
	})(TextureSV)


	//class laya.webgl.utils.IndexBuffer2D extends laya.webgl.utils.Buffer2D
	var IndexBuffer2D=(function(_super){
		function IndexBuffer2D(bufferUsage){
			this._uint8Array=null;
			this._uint16Array=null;
			(bufferUsage===void 0)&& (bufferUsage=/*laya.webgl.WebGLContext.STATIC_DRAW*/0x88E4);
			IndexBuffer2D.__super.call(this);
			this._bufferUsage=bufferUsage;
			this._bufferType=/*laya.webgl.WebGLContext.ELEMENT_ARRAY_BUFFER*/0x8893;
			Render.isFlash || (this._buffer=new ArrayBuffer(8));
		}

		__class(IndexBuffer2D,'laya.webgl.utils.IndexBuffer2D',_super);
		var __proto=IndexBuffer2D.prototype;
		__proto._checkArrayUse=function(){
			this._uint8Array && (this._uint8Array=new Uint8Array(this._buffer));
			this._uint16Array && (this._uint16Array=new Uint16Array(this._buffer));
		}

		__proto.getUint8Array=function(){
			return this._uint8Array || (this._uint8Array=new Uint8Array(this._buffer));
		}

		__proto.getUint16Array=function(){
			return this._uint16Array || (this._uint16Array=new Uint16Array(this._buffer));
		}

		IndexBuffer2D.QuadrangleIB=null
		IndexBuffer2D.create=function(bufferUsage){
			(bufferUsage===void 0)&& (bufferUsage=/*laya.webgl.WebGLContext.STATIC_DRAW*/0x88E4);
			return new IndexBuffer2D(bufferUsage);
		}

		return IndexBuffer2D;
	})(Buffer2D)


	//class laya.webgl.utils.VertexBuffer2D extends laya.webgl.utils.Buffer2D
	var VertexBuffer2D=(function(_super){
		function VertexBuffer2D(vertexStride,bufferUsage){
			this._floatArray32=null;
			this._vertexStride=0;
			VertexBuffer2D.__super.call(this);
			this._vertexStride=vertexStride;
			this._bufferUsage=bufferUsage;
			this._bufferType=/*laya.webgl.WebGLContext.ARRAY_BUFFER*/0x8892;
			Render.isFlash || (this._buffer=new ArrayBuffer(8));
			this.getFloat32Array();
		}

		__class(VertexBuffer2D,'laya.webgl.utils.VertexBuffer2D',_super);
		var __proto=VertexBuffer2D.prototype;
		__proto.getFloat32Array=function(){
			return this._floatArray32 || (this._floatArray32=new Float32Array(this._buffer));
		}

		__proto.bind=function(ibBuffer){
			(ibBuffer)&& (ibBuffer._bind());
			this._bind();
		}

		__proto.insertData=function(data,pos){
			var vbdata=this.getFloat32Array();
			vbdata.set(data,pos);
			this._upload=true;
		}

		__proto.bind_upload=function(ibBuffer){
			(ibBuffer._bind_upload())|| (ibBuffer._bind());
			(this._bind_upload())|| (this._bind());
		}

		__proto._checkArrayUse=function(){
			this._floatArray32 && (this._floatArray32=new Float32Array(this._buffer));
		}

		__proto.detoryResource=function(){
			_super.prototype.detoryResource.call(this);
			for (var i=0;i < 10;i++)
			WebGL.mainContext.disableVertexAttribArray(i);
		}

		__getset(0,__proto,'vertexStride',function(){
			return this._vertexStride;
		});

		VertexBuffer2D.create=function(vertexStride,bufferUsage){
			(bufferUsage===void 0)&& (bufferUsage=/*laya.webgl.WebGLContext.DYNAMIC_DRAW*/0x88E8);
			return new VertexBuffer2D(vertexStride,bufferUsage);
		}

		return VertexBuffer2D;
	})(Buffer2D)


	//class laya.webgl.resource.WebGLImage extends laya.resource.HTMLImage
	var WebGLImage=(function(_super){
		function WebGLImage(src,def){
			this._image=null;
			this._allowMerageInAtlas=false;
			this._enableMerageInAtlas=false;
			this.repeat=false;
			this.mipmap=false;
			this.minFifter=0;
			this.magFifter=0;
			WebGLImage.__super.call(this,src,def);
			this.repeat=false;
			this.mipmap=false;
			this.minFifter=-1;
			this.magFifter=-1;
			this._src=src;
			this._image=new Browser.window.Image();
			if (def){
				def.onload && (this.onload=def.onload);
				def.onerror && (this.onerror=def.onerror);
				def.onCreate && def.onCreate(this);
			}
			this._image.crossOrigin=(src && (src.indexOf("data:")==0))? null :"";
			(src)&& (this._image.src=src);
			this._enableMerageInAtlas=true;
		}

		__class(WebGLImage,'laya.webgl.resource.WebGLImage',_super);
		var __proto=WebGLImage.prototype;
		Laya.imps(__proto,{"laya.webgl.resource.IMergeAtlasBitmap":true})
		__proto._init_=function(src,def){}
		__proto._createWebGlTexture=function(){
			if (!this._image){
				throw "create GLTextur err:no data:"+this._image;
			};
			var gl=WebGL.mainContext;
			var glTex=this._source=gl.createTexture();
			var preTarget=WebGLContext.curBindTexTarget;
			var preTexture=WebGLContext.curBindTexValue;
			WebGLContext.bindTexture(gl,/*laya.webgl.WebGLContext.TEXTURE_2D*/0x0DE1,glTex);
			gl.texImage2D(/*laya.webgl.WebGLContext.TEXTURE_2D*/0x0DE1,0,/*laya.webgl.WebGLContext.RGBA*/0x1908,/*laya.webgl.WebGLContext.RGBA*/0x1908,/*laya.webgl.WebGLContext.UNSIGNED_BYTE*/0x1401,this._image);
			var minFifter=this.minFifter;
			var magFifter=this.magFifter;
			var repeat=this.repeat ? /*laya.webgl.WebGLContext.REPEAT*/0x2901 :/*laya.webgl.WebGLContext.CLAMP_TO_EDGE*/0x812F;
			var isPot=Arith.isPOT(this._w,this._h);
			if (isPot){
				if (this.mipmap)
					(minFifter!==-1)|| (minFifter=/*laya.webgl.WebGLContext.LINEAR_MIPMAP_LINEAR*/0x2703);
				else
				(minFifter!==-1)|| (minFifter=/*laya.webgl.WebGLContext.LINEAR*/0x2601);
				(magFifter!==-1)|| (magFifter=/*laya.webgl.WebGLContext.LINEAR*/0x2601);
				gl.texParameteri(/*laya.webgl.WebGLContext.TEXTURE_2D*/0x0DE1,/*laya.webgl.WebGLContext.TEXTURE_MIN_FILTER*/0x2801,minFifter);
				gl.texParameteri(/*laya.webgl.WebGLContext.TEXTURE_2D*/0x0DE1,/*laya.webgl.WebGLContext.TEXTURE_MAG_FILTER*/0x2800,magFifter);
				gl.texParameteri(/*laya.webgl.WebGLContext.TEXTURE_2D*/0x0DE1,/*laya.webgl.WebGLContext.TEXTURE_WRAP_S*/0x2802,repeat);
				gl.texParameteri(/*laya.webgl.WebGLContext.TEXTURE_2D*/0x0DE1,/*laya.webgl.WebGLContext.TEXTURE_WRAP_T*/0x2803,repeat);
				this.mipmap && gl.generateMipmap(/*laya.webgl.WebGLContext.TEXTURE_2D*/0x0DE1);
				}else {
				(minFifter!==-1)|| (minFifter=/*laya.webgl.WebGLContext.LINEAR*/0x2601);
				(magFifter!==-1)|| (magFifter=/*laya.webgl.WebGLContext.LINEAR*/0x2601);
				gl.texParameteri(/*laya.webgl.WebGLContext.TEXTURE_2D*/0x0DE1,/*laya.webgl.WebGLContext.TEXTURE_MIN_FILTER*/0x2801,minFifter);
				gl.texParameteri(/*laya.webgl.WebGLContext.TEXTURE_2D*/0x0DE1,/*laya.webgl.WebGLContext.TEXTURE_MAG_FILTER*/0x2800,magFifter);
				gl.texParameteri(/*laya.webgl.WebGLContext.TEXTURE_2D*/0x0DE1,/*laya.webgl.WebGLContext.TEXTURE_WRAP_S*/0x2802,/*laya.webgl.WebGLContext.CLAMP_TO_EDGE*/0x812F);
				gl.texParameteri(/*laya.webgl.WebGLContext.TEXTURE_2D*/0x0DE1,/*laya.webgl.WebGLContext.TEXTURE_WRAP_T*/0x2803,/*laya.webgl.WebGLContext.CLAMP_TO_EDGE*/0x812F);
			}
			(preTarget && preTexture)&& (WebGLContext.bindTexture(gl,preTarget,preTexture));
			this._image.onload=null;
			this._image=null;
			if (isPot)
				this.memorySize=this._w *this._h *4 *(1+1 / 3);
			else
			this.memorySize=this._w *this._h *4;
			this._recreateLock=false;
		}

		/***????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????*/
		__proto.recreateResource=function(){
			var _$this=this;
			if (this._src==null || this._src==="")
				return;
			this._needReleaseAgain=false;
			if (!this._image){
				this._recreateLock=true;
				this.startCreate();
				var _this=this;
				this._image=new Browser.window.Image();
				this._image.crossOrigin=this._src.indexOf("data:")==0 ? null :"";
				this._image.onload=function (){
					if (_this._needReleaseAgain){
						_this._needReleaseAgain=false;
						_this._image.onload=null;
						_this._image=null;
						return;
					}
					(!(_this._allowMerageInAtlas && _this._enableMerageInAtlas))? (_this._createWebGlTexture()):(_$this.memorySize=0,_$this._recreateLock=false);
					_this.completeCreate();
				};
				this._image.src=this._src;
				}else {
				if (this._recreateLock){
					return;
				}
				this.startCreate();
				(!(this._allowMerageInAtlas && this._enableMerageInAtlas))? (this._createWebGlTexture()):(this.memorySize=0,this._recreateLock=false);
				this.completeCreate();
			}
		}

		/***????????????*/
		__proto.detoryResource=function(){
			if (this._recreateLock){
				this._needReleaseAgain=true;
			}
			if (this._source){
				WebGL.mainContext.deleteTexture(this._source);
				this._source=null;
				this._image=null;
				this.memorySize=0;
			}
		}

		/***????????????*/
		__proto.onresize=function(){
			this._w=this._image.width;
			this._h=this._image.height;
			(AtlasResourceManager.enabled)&& (this._w < AtlasResourceManager.atlasLimitWidth && this._h < AtlasResourceManager.atlasLimitHeight)? this._allowMerageInAtlas=true :this._allowMerageInAtlas=false;
		}

		__proto.clearAtlasSource=function(){
			this._image=null;
		}

		/**
		*??????HTML Image,as3???internal???friend??????????????????????????????image??????????????????
		*@param HTML Image
		*/
		__getset(0,__proto,'image',function(){
			return this._image;
		});

		/**
		*??????????????????Source
		*@return ????????????
		*/
		__getset(0,__proto,'allowMerageInAtlas',function(){
			return this._allowMerageInAtlas;
		});

		__getset(0,__proto,'atlasSource',function(){
			return this._image;
		});

		/**
		*??????????????????Source,??????????????????
		*@param value ????????????
		*/
		/**
		*??????????????????Source
		*@return ????????????
		*/
		__getset(0,__proto,'enableMerageInAtlas',function(){
			return this._enableMerageInAtlas;
			},function(value){
			this._enableMerageInAtlas=value;
		});

		/***
		*??????onload??????
		*@param value onload??????
		*/
		__getset(0,__proto,'onload',null,function(value){
			var _$this=this;
			this._onload=value;
			this._image && (this._image.onload=this._onload !=null ? (function(){
				_$this.onresize();
				_$this._onload();
			}):null);
		});

		/***
		*??????onerror??????
		*@param value onerror??????
		*/
		__getset(0,__proto,'onerror',null,function(value){
			var _$this=this;
			this._onerror=value;
			this._image && (this._image.onerror=this._onerror !=null ? (function(){
				_$this._onerror()
			}):null);
		});

		return WebGLImage;
	})(HTMLImage)


	Laya.__init([DrawText,WebGLContext,AtlasGrid,WebGLContext2D,RenderTargetMAX,ShaderCompile]);
	new LayaMain();

})(window,document,Laya);
