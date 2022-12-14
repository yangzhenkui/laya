
(function(window,document,Laya){
	var __un=Laya.un,__uns=Laya.uns,__static=Laya.static,__class=Laya.class,__getset=Laya.getset,__newvec=Laya.__newvec;

	var Browser=laya.utils.Browser,Byte=laya.utils.Byte,Event=laya.events.Event,EventDispatcher=laya.events.EventDispatcher;
	var Graphics=laya.display.Graphics,Handler=laya.utils.Handler,Loader=laya.net.Loader,MathUtil=laya.maths.MathUtil;
	var Matrix=laya.maths.Matrix,Render=laya.renders.Render,Resource=laya.resource.Resource,RunDriver=laya.utils.RunDriver;
	var Sprite=laya.display.Sprite,Stat=laya.utils.Stat,Texture=laya.resource.Texture,URL=laya.net.URL;
	/**
	*@private
	*/
	//class laya.ani.AnimationState
	var AnimationState=(function(){
		function AnimationState(){}
		__class(AnimationState,'laya.ani.AnimationState');
		AnimationState.stopped=0;
		AnimationState.paused=1;
		AnimationState.playing=2;
		return AnimationState;
	})()


	/**
	*@private
	*/
	//class laya.ani.bone.Bone
	var Bone=(function(){
		function Bone(){
			this.name=null;
			this.root=null;
			this.parentBone=null;
			this.length=10;
			this.transform=null;
			this.inheritScale=true;
			this.inheritRotation=true;
			this.rotation=NaN;
			this.resultRotation=NaN;
			this._tempMatrix=null;
			this._sprite=null;
			this.resultTransform=new Transform();
			this.resultMatrix=new Matrix();
			this._children=[];
		}

		__class(Bone,'laya.ani.bone.Bone');
		var __proto=Bone.prototype;
		__proto.setTempMatrix=function(matrix){
			this._tempMatrix=matrix;
			var i=0,n=0;
			var tBone;
			for (i=0,n=this._children.length;i < n;i++){
				tBone=this._children[i];
				tBone.setTempMatrix(this._tempMatrix);
			}
		}

		__proto.update=function(pMatrix){
			this.rotation=this.transform.skX;
			var tResultMatrix;
			if (pMatrix){
				tResultMatrix=this.resultTransform.getMatrix();
				Matrix.mul(tResultMatrix,pMatrix,this.resultMatrix);
				this.resultRotation=this.rotation;
				}else {
				this.resultRotation=this.rotation+this.parentBone.resultRotation;
				if (this.parentBone){
					if (this.inheritRotation && this.inheritScale){
						tResultMatrix=this.resultTransform.getMatrix();
						Matrix.mul(tResultMatrix,this.parentBone.resultMatrix,this.resultMatrix);
						}else {
						var temp=0;
						var parent=this.parentBone;
						var tAngle=NaN;
						var cos=NaN;
						var sin=NaN;
						var tParentMatrix=this.parentBone.resultMatrix;
						var worldX=tParentMatrix.a *this.transform.x+tParentMatrix.c *this.transform.y+tParentMatrix.tx;
						var worldY=tParentMatrix.b *this.transform.x+tParentMatrix.d *this.transform.y+tParentMatrix.ty;
						var tTestMatrix=new Matrix();
						if (this.inheritRotation){
							tAngle=Math.atan2(parent.resultMatrix.b,parent.resultMatrix.a);
							cos=Math.cos(tAngle),sin=Math.sin(tAngle);
							tTestMatrix.setTo(cos,sin,-sin,cos,0,0);
							Matrix.mul(this._tempMatrix,tTestMatrix,Matrix.TEMP);
							Matrix.TEMP.copyTo(tTestMatrix);
							tResultMatrix=this.resultTransform.getMatrix();
							Matrix.mul(tResultMatrix,tTestMatrix,this.resultMatrix);
							this.resultMatrix.tx=worldX;
							this.resultMatrix.ty=worldY;
							}else if (this.inheritScale){
							tResultMatrix=this.resultTransform.getMatrix();
							Matrix.TEMP.identity();
							Matrix.TEMP.d=-1;
							Matrix.mul(tResultMatrix,Matrix.TEMP,this.resultMatrix);
							this.resultMatrix.tx=worldX;
							this.resultMatrix.ty=worldY;
							}else {
							tResultMatrix=this.resultTransform.getMatrix();
							Matrix.TEMP.identity();
							Matrix.TEMP.d=-1;
							Matrix.mul(tResultMatrix,Matrix.TEMP,this.resultMatrix);
							this.resultMatrix.tx=worldX;
							this.resultMatrix.ty=worldY;
						}
					}
					}else {
					tResultMatrix=this.resultTransform.getMatrix();
					tResultMatrix.copyTo(this.resultMatrix);
				}
			};
			var i=0,n=0;
			var tBone;
			for (i=0,n=this._children.length;i < n;i++){
				tBone=this._children[i];
				tBone.update();
			}
		}

		__proto.updateChild=function(){
			var i=0,n=0;
			var tBone;
			for (i=0,n=this._children.length;i < n;i++){
				tBone=this._children[i];
				tBone.update();
			}
		}

		__proto.updateDraw=function(x,y){
			if (this._sprite){
				this._sprite.x=x+this.resultMatrix.tx;
				this._sprite.y=y+this.resultMatrix.ty;
				}else {
				this._sprite=new Sprite();
				this._sprite.graphics.drawCircle(0,0,5,"#ff0000");
				this._sprite.graphics.fillText(this.name,0,0,"20px Arial","#00ff00","center");
				Laya.stage.addChild(this._sprite);
				this._sprite.x=x+this.resultMatrix.tx;
				this._sprite.y=y+this.resultMatrix.ty;
			};
			var i=0,n=0;
			var tBone;
			for (i=0,n=this._children.length;i < n;i++){
				tBone=this._children[i];
				tBone.updateDraw(x,y);
			}
		}

		__proto.addChild=function(bone){
			this._children.push(bone);
			bone.parentBone=this;
		}

		__proto.findBone=function(boneName){
			if (this.name==boneName){
				return this;
				}else {
				var i=0,n=0;
				var tBone;
				var tResult;
				for (i=0,n=this._children.length;i < n;i++){
					tBone=this._children[i];
					tResult=tBone.findBone(boneName);
					if (tResult){
						return tResult;
					}
				}
			}
			return null;
		}

		__proto.localToWorld=function(local){
			var localX=local[0];
			var localY=local[1];
			local[0]=localX *this.resultMatrix.a+localY *this.resultMatrix.c+this.resultMatrix.tx;
			local[1]=localX *this.resultMatrix.b+localY *this.resultMatrix.d+this.resultMatrix.ty;
		}

		return Bone;
	})()


	/**
	*@private
	*/
	//class laya.ani.bone.BoneSlot
	var BoneSlot=(function(){
		function BoneSlot(){
			this.name=null;
			this.parent=null;
			this.attachmentName=null;
			this.srcDisplayIndex=-1;
			this.type="src";
			this.templet=null;
			this.currSlotData=null;
			this.currTexture=null;
			this.currDisplayData=null;
			this.displayIndex=-1;
			this._diyTexture=null;
			this._parentMatrix=null;
			this._resultMatrix=null;
			this._skinSprite=null;
			this.deformData=null;
		}

		__class(BoneSlot,'laya.ani.bone.BoneSlot');
		var __proto=BoneSlot.prototype;
		/**
		*??????????????????????????????
		*@param slotData
		*@param disIndex
		*/
		__proto.showSlotData=function(slotData){
			this.currSlotData=slotData;
			this.displayIndex=this.srcDisplayIndex;
			this.currDisplayData=null;
			this.currTexture=null;
		}

		/**
		*??????????????????????????????
		*@param name
		*/
		__proto.showDisplayByName=function(name){
			if (this.currSlotData){
				this.showDisplayByIndex(this.currSlotData.getDisplayByName(name));
			}
		}

		/**
		*??????????????????
		*@param index
		*/
		__proto.showDisplayByIndex=function(index){
			if (this.currSlotData && index >-1 && index < this.currSlotData.displayArr.length){
				this.displayIndex=index;
				this.currDisplayData=this.currSlotData.displayArr[index];
				if (this.currDisplayData){
					var tName=this.currDisplayData.name;
					this.currTexture=this.templet.getTexture(tName);
					if (this.currTexture && Render.isWebGL && this.currDisplayData.type==0 && this.currDisplayData.uvs){
						this.currTexture=this.currDisplayData.createTexture(this.currTexture);
					}
				}
				}else {
				this.displayIndex=-1;
				this.currDisplayData=null;
				this.currTexture=null;
			}
		}

		/**
		*????????????
		*@param _texture
		*/
		__proto.replaceSkin=function(_texture){
			this._diyTexture=_texture;
		}

		/**
		*????????????????????????
		*@param parentMatrix
		*/
		__proto.setParentMatrix=function(parentMatrix){
			this._parentMatrix=parentMatrix;
		}

		/**
		*???????????????Graphics???
		*@param graphics
		*@param noUseSave
		*/
		__proto.draw=function(graphics,boneMatrixArray,noUseSave,alpha){
			(noUseSave===void 0)&& (noUseSave=false);
			(alpha===void 0)&& (alpha=1);
			if ((this._diyTexture==null && this.currTexture==null)|| this.currDisplayData==null){
				if (!(this.currDisplayData && this.currDisplayData.type==3)){
					return;
				}
			};
			var tTexture=this.currTexture;
			if (this._diyTexture)tTexture=this._diyTexture;
			var tSkinSprite;
			switch (this.currDisplayData.type){
				case 0:
					if (graphics){
						var tCurrentMatrix=this.getDisplayMatrix();
						if (this._parentMatrix){
							var tRotateKey=false;
							if (tCurrentMatrix){
								Matrix.mul(tCurrentMatrix,this._parentMatrix,Matrix.TEMP);
								var tResultMatrix;
								if (noUseSave){
									if (this._resultMatrix==null)this._resultMatrix=new Matrix();
									tResultMatrix=this._resultMatrix;
									}else {
									tResultMatrix=new Matrix();
								}
								if ((!Render.isWebGL && this.currDisplayData.uvs)|| (Render.isWebGL && this._diyTexture && this.currDisplayData.uvs)){
									var tTestMatrix=new Matrix(1,0,0,1);
									if (this.currDisplayData.uvs[1] > this.currDisplayData.uvs[5]){
										tTestMatrix.d=-1;
									}
									if (this.currDisplayData.uvs[0] > this.currDisplayData.uvs[4]
										&& this.currDisplayData.uvs[1] > this.currDisplayData.uvs[5]){
										tRotateKey=true;
										tTestMatrix.rotate(-Math.PI/2);
									}
									Matrix.mul(tTestMatrix,Matrix.TEMP,tResultMatrix);
									}else {
									Matrix.TEMP.copyTo(tResultMatrix);
								}
								if (tRotateKey){
									graphics.drawTexture(tTexture,-this.currDisplayData.height / 2,-this.currDisplayData.width / 2,this.currDisplayData.height,this.currDisplayData.width,tResultMatrix);
									}else {
									graphics.drawTexture(tTexture,-this.currDisplayData.width / 2,-this.currDisplayData.height / 2,this.currDisplayData.width,this.currDisplayData.height,tResultMatrix);
								}
							}
						}
					}
					break ;
				case 1:
					if (noUseSave){
						if (this._skinSprite==null){
							this._skinSprite=RunDriver.skinAniSprite();
						}
						tSkinSprite=this._skinSprite;
						}else {
						tSkinSprite=RunDriver.skinAniSprite();
					}
					if (tSkinSprite==null){
						return;
					};
					var tVBArray=[];
					var tIBArray=[];
					var tRed=1;
					var tGreed=1;
					var tBlue=1;
					var tAlpha=1;
					if (this.currDisplayData.bones==null){
						var tVertices=this.currDisplayData.weights;
						if (this.deformData){
							tVertices=this.deformData;
						}
						for (var i=0,ii=0;i < tVertices.length && ii< this.currDisplayData.uvs.length;){
							var tX=tVertices[i++];
							var tY=tVertices[i++];
							tVBArray.push(tX,tY,this.currDisplayData.uvs[ii++],this.currDisplayData.uvs[ii++],tRed,tGreed,tBlue,tAlpha);
						};
						var tTriangleNum=this.currDisplayData.triangles.length / 3;
						for (i=0;i < tTriangleNum;i++){
							tIBArray.push(this.currDisplayData.triangles[i *3]);
							tIBArray.push(this.currDisplayData.triangles[i *3+1]);
							tIBArray.push(this.currDisplayData.triangles[i *3+2]);
						}
						tSkinSprite.init(this.currTexture,tVBArray,tIBArray);
						var tCurrentMatrix2=this.getDisplayMatrix();
						if (this._parentMatrix){
							if (tCurrentMatrix2){
								Matrix.mul(tCurrentMatrix2,this._parentMatrix,Matrix.TEMP);
								var tResultMatrix2;
								if (noUseSave){
									if (this._resultMatrix==null)this._resultMatrix=new Matrix();
									tResultMatrix2=this._resultMatrix;
									}else {
									tResultMatrix2=new Matrix();
								}
								Matrix.TEMP.copyTo(tResultMatrix2);
								tSkinSprite.transform=tResultMatrix2;
							}
						}
						}else {
						this.skinMesh(boneMatrixArray,tSkinSprite,alpha);
					}
					graphics.drawSkin(tSkinSprite);
					break ;
				case 2:
					if (noUseSave){
						if (this._skinSprite==null){
							this._skinSprite=RunDriver.skinAniSprite();
						}
						tSkinSprite=this._skinSprite;
						}else {
						tSkinSprite=RunDriver.skinAniSprite();
					}
					if (tSkinSprite==null){
						return;
					}
					this.skinMesh(boneMatrixArray,tSkinSprite,alpha);
					graphics.drawSkin(tSkinSprite);
					break ;
				case 3:
					break ;
				}
		}

		/**
		*??????????????????
		*@param boneMatrixArray ????????????????????????
		*/
		__proto.skinMesh=function(boneMatrixArray,skinSprite,alpha){
			var tBones=this.currDisplayData.bones;
			var tUvs=this.currDisplayData.uvs;
			var tWeights=this.currDisplayData.weights;
			var tTriangles=this.currDisplayData.triangles;
			var tVBArray=[];
			var tIBArray=[];
			var tRx=0;
			var tRy=0;
			var nn=0;
			var tMatrix;
			var tX=NaN;
			var tY=NaN;
			var tB=0;
			var tWeight=0;
			var tVertices=[];
			var i=0,j=0,n=0;
			var tRed=1;
			var tGreed=1;
			var tBlue=1;
			var tAlpha=alpha;
			if (this.deformData && this.deformData.length > 0){
				var f=0;
				for (i=0,n=tBones.length;i < n;){
					nn=tBones[i++]+i;
					tRx=0,tRy=0;
					for (;i < nn;i++){
						tMatrix=boneMatrixArray[tBones[i]]
						tX=tWeights[tB]+this.deformData[f++];
						tY=tWeights[tB+1]+this.deformData[f++];
						tWeight=tWeights[tB+2];
						tRx+=(tX *tMatrix.a+tY *tMatrix.c+tMatrix.tx)*tWeight;
						tRy+=(tX *tMatrix.b+tY *tMatrix.d+tMatrix.ty)*tWeight;
						tB+=3;
					}
					tVertices.push(tRx,tRy);
				}
				}else {
				for (i=0,n=tBones.length;i < n;){
					nn=tBones[i++]+i;
					tRx=0,tRy=0;
					for (;i < nn;i++){
						tMatrix=boneMatrixArray[tBones[i]]
						tX=tWeights[tB];
						tY=tWeights[tB+1];
						tWeight=tWeights[tB+2];
						tRx+=(tX *tMatrix.a+tY *tMatrix.c+tMatrix.tx)*tWeight;
						tRy+=(tX *tMatrix.b+tY *tMatrix.d+tMatrix.ty)*tWeight;
						tB+=3;
					}
					tVertices.push(tRx,tRy);
				}
			}
			for (i=0,j=0;i < tVertices.length && j < tUvs.length;){
				tRx=tVertices[i++];
				tRy=tVertices[i++];
				tVBArray.push(tRx,tRy,tUvs[j++],tUvs[j++],tRed,tGreed,tBlue,tAlpha);
			}
			for (i=0,n=tTriangles.length;i < n;i++){
				tIBArray.push(tTriangles[i]);
			}
			skinSprite.init(this.currTexture,tVBArray,tIBArray);
		}

		/**
		*????????????????????????????????????
		*@param graphics
		*/
		__proto.drawBonePoint=function(graphics){
			if (graphics && this._parentMatrix){
				graphics.drawCircle(this._parentMatrix.tx,this._parentMatrix.ty,5,"#ff0000");
			}
		}

		/**
		*???????????????????????????
		*@return
		*/
		__proto.getDisplayMatrix=function(){
			if (this.currDisplayData){
				return this.currDisplayData.transform.getMatrix();
			}
			return null;
		}

		/**
		*?????????????????????
		*@return
		*/
		__proto.getMatrix=function(){
			return this._resultMatrix;
		}

		/**
		*??????????????????????????????
		*@return
		*/
		__proto.copy=function(){
			var tBoneSlot=new BoneSlot();
			tBoneSlot.type="copy";
			tBoneSlot.name=this.name;
			tBoneSlot.attachmentName=this.attachmentName;
			tBoneSlot.srcDisplayIndex=this.srcDisplayIndex;
			tBoneSlot.parent=this.parent;
			tBoneSlot.displayIndex=this.displayIndex;
			tBoneSlot.templet=this.templet;
			tBoneSlot.currSlotData=this.currSlotData;
			tBoneSlot.currTexture=this.currTexture;
			tBoneSlot.currDisplayData=this.currDisplayData;
			return tBoneSlot;
		}

		return BoneSlot;
	})()


	/**
	*@private
	*/
	//class laya.ani.bone.DeformAniData
	var DeformAniData=(function(){
		function DeformAniData(){
			this.skinName=null;
			this.deformSlotDataList=[];
		}

		__class(DeformAniData,'laya.ani.bone.DeformAniData');
		return DeformAniData;
	})()


	/**
	*...
	*@author
	*/
	//class laya.ani.bone.DeformSlotData
	var DeformSlotData=(function(){
		function DeformSlotData(){
			this.deformSlotDisplayList=[];
		}

		__class(DeformSlotData,'laya.ani.bone.DeformSlotData');
		return DeformSlotData;
	})()


	/**
	*@private
	*/
	//class laya.ani.bone.DeformSlotDisplayData
	var DeformSlotDisplayData=(function(){
		function DeformSlotDisplayData(){
			this.boneSlot=null;
			this.slotIndex=-1;
			this.attachment=null;
			this.deformData=null;
			this.frameIndex=0;
			this.timeList=[];
			this.vectices=[];
			this.tweenKeyList=[];
		}

		__class(DeformSlotDisplayData,'laya.ani.bone.DeformSlotDisplayData');
		var __proto=DeformSlotDisplayData.prototype;
		__proto.binarySearch1=function(values,target){
			var low=0;
			var high=values.length-2;
			if (high==0)
				return 1;
			var current=high >>> 1;
			while (true){
				if (values[Math.floor(current+1)] <=target)
					low=current+1;
				else
				high=current;
				if (low==high)
					return low+1;
				current=(low+high)>>> 1;
			}
			return 0;
		}

		// Can't happen.
		__proto.apply=function(time,boneSlot,alpha){
			(alpha===void 0)&& (alpha=1);
			if (this.timeList.length <=0){
				return;
			};
			var i=0;
			var n=0;
			var tTime=this.timeList[0];
			if (time < tTime){
				return;
			};
			var tVertexCount=this.vectices[0].length;
			var tVertices=[];
			var tFrameIndex=this.binarySearch1(this.timeList,time);
			this.frameIndex=tFrameIndex;
			if (time >=this.timeList[this.timeList.length-1]){
				var lastVertices=this.vectices[this.vectices.length-1];
				if (alpha < 1){
					for (i=0;i < tVertexCount;i++){
						tVertices[i]+=(lastVertices[i]-tVertices[i])*alpha;
					}
					}else {
					for (i=0;i < tVertexCount;i++){
						tVertices[i]=lastVertices[i];
					}
				}
				this.deformData=tVertices;
				return;
			};
			var tTweenKey=this.tweenKeyList[this.frameIndex];
			var tPrevVertices=this.vectices[this.frameIndex-1];
			var tNextVertices=this.vectices[this.frameIndex];
			var tPreFrameTime=this.timeList[this.frameIndex-1];
			var tFrameTime=this.timeList[this.frameIndex];
			if (this.tweenKeyList[tFrameIndex-1]){
				alpha=(time-tPreFrameTime)/ (tFrameTime-tPreFrameTime);
			};
			var tPrev=NaN;
			for (i=0;i < tVertexCount;i++){
				tPrev=tPrevVertices[i];
				tVertices[i]=tPrev+(tNextVertices[i]-tPrev)*alpha;
			}
			this.deformData=tVertices;
		}

		return DeformSlotDisplayData;
	})()


	/**
	*...
	*@author
	*/
	//class laya.ani.bone.DrawOrderData
	var DrawOrderData=(function(){
		function DrawOrderData(){
			this.time=NaN;
			this.drawOrder=[];
		}

		__class(DrawOrderData,'laya.ani.bone.DrawOrderData');
		return DrawOrderData;
	})()


	//class laya.ani.bone.EventData
	var EventData=(function(){
		function EventData(){
			this.name=null;
			this.intValue=0;
			this.floatValue=NaN;
			this.stringValue=null;
			this.time=NaN;
		}

		__class(EventData,'laya.ani.bone.EventData');
		return EventData;
	})()


	/**
	*@private
	*/
	//class laya.ani.bone.IkConstraint
	var IkConstraint=(function(){
		function IkConstraint(data,bones){
			this._targetBone=null;
			this._bones=null;
			this._data=null;
			this.name=null;
			this.mix=NaN;
			this.bendDirection=NaN;
			this._data=data;
			this._targetBone=bones[data.targetBoneIndex];
			if (this._bones==null)this._bones=[];
			this._bones.length=0;
			for (var i=0,n=data.boneIndexs.length;i < n;i++){
				this._bones.push(bones[data.boneIndexs[i]]);
			}
			this.name=data.name;
			this.mix=data.mix;
			this.bendDirection=data.bendDirection;
		}

		__class(IkConstraint,'laya.ani.bone.IkConstraint');
		var __proto=IkConstraint.prototype;
		__proto.apply=function(){
			switch (this._bones.length){
				case 1:
					this._applyIk1(this._bones[0],this._targetBone.resultMatrix.tx,this._targetBone.resultMatrix.ty,this.mix);
					break ;
				case 2:
					this._applyIk2(this._bones[0],this._bones[1],this._targetBone.resultMatrix.tx,this._targetBone.resultMatrix.ty,this.bendDirection,this.mix);
					break ;
				}
		}

		__proto._applyIk1=function(bone,targetX,targetY,alpha){
			var pp=bone.parentBone;
			var id=1 / (pp.resultMatrix.a *pp.resultMatrix.d-pp.resultMatrix.b *pp.resultMatrix.c);
			var x=targetX-pp.resultMatrix.tx;
			var y=targetY-pp.resultMatrix.ty;
			var tx=(x *pp.resultMatrix.d-y *pp.resultMatrix.c)*id-bone.transform.x;
			var ty=(y *pp.resultMatrix.a-x *pp.resultMatrix.b)*id-bone.transform.y;
			var rotationIK=Math.atan2(ty,tx)*IkConstraint.radDeg-0-bone.transform.skX;
			if (bone.transform.scX < 0)rotationIK+=180;
			if (rotationIK > 180)
				rotationIK-=360;
			else if (rotationIK <-180)rotationIK+=360;
			bone.transform.skX=bone.transform.skY=bone.transform.skX+rotationIK *alpha;
			bone.update();
		}

		__proto._applyIk2=function(parent,child,targetX,targetY,bendDir,alpha){
			if (alpha==0){
				return;
			};
			var px=parent.resultTransform.x,py=parent.resultTransform.y;
			var psx=parent.transform.scX,psy=parent.transform.scY;
			var csx=child.transform.scX;
			var os1=0,os2=0,s2=0;
			if (psx < 0){
				psx=-psx;
				os1=180;
				s2=-1;
				}else {
				os1=0;
				s2=1;
			}
			if (psy < 0){
				psy=-psy;
				s2=-s2;
			}
			if (csx < 0){
				csx=-csx;
				os2=180;
				}else {
				os2=0
			};
			var cx=child.resultTransform.x,cy=NaN,cwx=NaN,cwy=NaN;
			var a=parent.resultMatrix.a,b=parent.resultMatrix.c;
			var c=parent.resultMatrix.b,d=parent.resultMatrix.d;
			var u=Math.abs(psx-psy)<=0.0001;
			if (!u){
				cy=0;
				cwx=a *cx+parent.resultMatrix.tx;
				cwy=c *cx+parent.resultMatrix.ty;
				}else {
				cy=child.resultTransform.y;
				cwx=a *cx+b *cy+parent.resultMatrix.tx;
				cwy=c *cx+d *cy+parent.resultMatrix.ty;
			};
			var pp=parent.parentBone;
			a=pp.resultMatrix.a;
			b=pp.resultMatrix.c;
			c=pp.resultMatrix.b;
			d=pp.resultMatrix.d;
			var id=1 / (a *d-b *c);
			var x=targetX-pp.resultMatrix.tx,y=targetY-pp.resultMatrix.ty;
			var tx=(x *d-y *b)*id-px;
			var ty=(y *a-x *c)*id-py;
			x=cwx-pp.resultMatrix.tx;
			y=cwy-pp.resultMatrix.ty;
			var dx=(x *d-y *b)*id-px;
			var dy=(y *a-x *c)*id-py;
			var l1=Math.sqrt(dx *dx+dy *dy);
			var l2=child.length *csx;
			var a1=NaN,a2=NaN;
			if (u){
				l2 *=psx;
				var cos=(tx *tx+ty *ty-l1 *l1-l2 *l2)/ (2 *l1 *l2);
				if (cos <-1)
					cos=-1;
				else if (cos > 1)cos=1;
				a2=Math.acos(cos)*bendDir;
				a=l1+l2 *cos;
				b=l2 *Math.sin(a2);
				a1=Math.atan2(ty *a-tx *b,tx *a+ty *b);
				}else {
				a=psx *l2;
				b=psy *l2;
				var aa=a *a,bb=b *b,dd=tx *tx+ty *ty,ta=Math.atan2(ty,tx);
				c=bb *l1 *l1+aa *dd-aa *bb;
				var c1=-2 *bb *l1,c2=bb-aa;
				d=c1 *c1-4 *c2 *c;
				if (d > 0){
					var q=Math.sqrt(d);
					if (c1 < 0)q=-q;
					q=-(c1+q)/ 2;
					var r0=q / c2,r1=c / q;
					var r=Math.abs(r0)< Math.abs(r1)? r0 :r1;
					if (r *r <=dd){
						y=Math.sqrt(dd-r *r)*bendDir;
						a1=ta-Math.atan2(y,r);
						a2=Math.atan2(y / psy,(r-l1)/ psx);
					}
				};
				var minAngle=0,minDist=Number.MAX_VALUE,minX=0,minY=0;
				var maxAngle=0,maxDist=0,maxX=0,maxY=0;
				x=l1+a;
				d=x *x;
				if (d > maxDist){
					maxAngle=0;
					maxDist=d;
					maxX=x;
				}
				x=l1-a;
				d=x *x;
				if (d < minDist){
					minAngle=Math.PI;
					minDist=d;
					minX=x;
				};
				var angle=Math.acos(-a *l1 / (aa-bb));
				x=a *Math.cos(angle)+l1;
				y=b *Math.sin(angle);
				d=x *x+y *y;
				if (d < minDist){
					minAngle=angle;
					minDist=d;
					minX=x;
					minY=y;
				}
				if (d > maxDist){
					maxAngle=angle;
					maxDist=d;
					maxX=x;
					maxY=y;
				}
				if (dd <=(minDist+maxDist)/ 2){
					a1=ta-Math.atan2(minY *bendDir,minX);
					a2=minAngle *bendDir;
					}else {
					a1=ta-Math.atan2(maxY *bendDir,maxX);
					a2=maxAngle *bendDir;
				}
			};
			var os=Math.atan2(cy,cx)*s2;
			var rotation=parent.resultTransform.skX;
			a1=(a1-os)*IkConstraint.radDeg+os1-rotation;
			if (a1 > 180)
				a1-=360;
			else if (a1 <-180)a1+=360;
			parent.resultTransform.x=px;
			parent.resultTransform.y=py;
			parent.resultTransform.skX=parent.resultTransform.skY=rotation+a1 *alpha;
			rotation=child.resultTransform.skX;
			rotation=rotation % 360;
			a2=((a2+os)*IkConstraint.radDeg-0)*s2+os2-rotation;
			if (a2 > 180)
				a2-=360;
			else if (a2 <-180)a2+=360;
			child.resultTransform.x=cx;
			child.resultTransform.y=cy;
			child.resultTransform.skX=child.resultTransform.skY=child.resultTransform.skY+a2 *alpha;
			parent.update();
		}

		__static(IkConstraint,
		['radDeg',function(){return this.radDeg=180 / Math.PI;},'degRad',function(){return this.degRad=Math.PI / 180;}
		]);
		return IkConstraint;
	})()


	/**
	*@private
	*/
	//class laya.ani.bone.IkConstraintData
	var IkConstraintData=(function(){
		function IkConstraintData(){
			this.name=null;
			this.targetBoneName=null;
			this.bendDirection=1;
			this.mix=1;
			this.targetBoneIndex=-1;
			this.boneNames=[];
			this.boneIndexs=[];
		}

		__class(IkConstraintData,'laya.ani.bone.IkConstraintData');
		return IkConstraintData;
	})()


	/**
	*@private
	*???????????????
	*1????????????????????????????????????
	*2????????????????????????????????????????????????????????????
	*3??????????????????????????????????????????
	*/
	//class laya.ani.bone.PathConstraint
	var PathConstraint=(function(){
		function PathConstraint(data,bones){
			this.target=null;
			this.data=null;
			this.bones=null;
			this.position=NaN;
			this.spacing=NaN;
			this.rotateMix=NaN;
			this.translateMix=NaN;
			this._debugKey=false;
			this._spaces=null;
			this._segments=[];
			this._curves=[];
			this.data=data;
			this.position=data.position;
			this.spacing=data.spacing;
			this.rotateMix=data.rotateMix;
			this.translateMix=data.translateMix;
			this.bones=[];
			var tBoneIds=this.data.bones;
			for (var i=0,n=tBoneIds.length;i < n;i++){
				this.bones.push(bones[tBoneIds[i]]);
			}
		}

		__class(PathConstraint,'laya.ani.bone.PathConstraint');
		var __proto=PathConstraint.prototype;
		/**
		*?????????????????????????????????
		*@param boneSlot
		*@param boneMatrixArray
		*@param graphics
		*/
		__proto.apply=function(boneList,graphics){
			var tTranslateMix=this.translateMix;
			var tRotateMix=this.translateMix;
			var tTranslate=tTranslateMix > 0;
			var tRotate=tRotateMix > 0;
			var tSpacingMode=this.data.spacingMode;
			var tLengthSpacing=tSpacingMode=="length";
			var tRotateMode=this.data.rotateMode;
			var tTangents=tRotateMode=="tangent";
			var tScale=tRotateMode=="chainScale";
			var lengths=[];
			var boneCount=this.bones.length;
			var spacesCount=tTangents ? boneCount :boneCount+1;
			var spaces=[];
			this._spaces=spaces;
			spaces[0]=this.position;
			var spacing=this.spacing;
			if (tScale || tLengthSpacing){
				for (var i=0,n=spacesCount-1;i < n;){
					var bone=this.bones[i];
					var length=bone.length;
					var x=length *bone.transform.getMatrix().a;
					var y=length *bone.transform.getMatrix().c;
					length=Math.sqrt(x *x+y *y);
					if (tScale)lengths[i]=length;
					spaces[++i]=tLengthSpacing ? Math.max(0,length+spacing):spacing;
				}
				}else {
				for (i=1;i < spacesCount;i++){
					spaces[i]=spacing;
				}
			};
			var positions=this.computeWorldPositions(this.target,boneList,graphics,spacesCount,tTangents,this.data.positionMode=="percent",tSpacingMode=="percent");
			if (this._debugKey){
				for (i=0;i < positions.length;i++){
					graphics.drawCircle(positions[i++],positions[i++],5,"#00ff00");
				};
				var tLinePos=[];
				for (i=0;i < positions.length;i++){
					tLinePos.push(positions[i++],positions[i++]);
				}
				graphics.drawLines(0,0,tLinePos,"#ff0000");
			};
			var skeletonX=NaN;
			var skeletonY=NaN;
			var boneX=positions[0];
			var boneY=positions[1];
			var offsetRotation=this.data.offsetRotation;
			var tip=tRotateMode=="chain" && offsetRotation==0;
			var p=NaN;
			for (i=0,p=3;i < boneCount;i++,p+=3){
				bone=this.bones[i];
				bone.resultMatrix.tx+=(boneX-bone.resultMatrix.tx)*tTranslateMix;
				bone.resultMatrix.ty+=(boneY-bone.resultMatrix.ty)*tTranslateMix;
				x=positions[p];
				y=positions[p+1];
				var dx=x-boneX,dy=y-boneY;
				if (tScale){
					length=lengths[i];
					if (length !=0){
						var s=(Math.sqrt(dx *dx+dy *dy)/ length-1)*tRotateMix+1;
						bone.resultMatrix.a *=s;
						bone.resultMatrix.c *=s;
					}
				}
				boneX=x;
				boneY=y;
				if (tRotate){
					var a=bone.resultMatrix.a;
					var b=bone.resultMatrix.b;
					var c=bone.resultMatrix.c;
					var d=bone.resultMatrix.d;
					var r=NaN;
					var cos=NaN;
					var sin=NaN;
					if (tTangents){
						r=positions[p-1];
						}else if (spaces[i+1]==0){
						r=positions[p+2];
						}else {
						r=Math.atan2(dy,dx);
					}
					r-=Math.atan2(c,a)-offsetRotation / 180 *Math.PI;
					if (tip){
						cos=Math.cos(r);
						sin=Math.sin(r);
						length=bone.length;
						boneX+=(length *(cos *a-sin *c)-dx)*tRotateMix;
						boneY+=(length *(sin *a+cos *c)-dy)*tRotateMix;
					}
					if (r > Math.PI){
						r-=(Math.PI *2);
						}else if (r <-Math.PI){
						r+=(Math.PI *2);
					}
					r *=tRotateMix;
					cos=Math.cos(r);
					sin=Math.sin(r);
					bone.resultMatrix.a=cos *a-sin *c;
					bone.resultMatrix.c=cos *b-sin *d;
					bone.resultMatrix.b=sin *a+cos *c;
					bone.resultMatrix.d=sin *b+cos *d;
				}
			}
		}

		/**
		*???????????????????????????
		*@param boneSlot
		*@param boneList
		*@param start
		*@param count
		*@param worldVertices
		*@param offset
		*/
		__proto.computeWorldVertices2=function(boneSlot,boneList,start,count,worldVertices,offset){
			var tBones=boneSlot.currDisplayData.bones;
			var tWeights=boneSlot.currDisplayData.weights;
			var tTriangles=boneSlot.currDisplayData.triangles;
			var tMatrix;
			var i=0;
			var v=0;
			var skip=0;
			var n=0;
			var w=0;
			var b=0;
			var wx=0;
			var wy=0;
			var vx=0;
			var vy=0;
			for (i=0;i < start;i+=2){
				n=tBones[v];
				v+=n+1;
				skip+=n;
			};
			var skeletonBones=boneList;
			for (w=offset,b=skip *3;w < count;w+=2){
				wx=0,wy=0;
				n=tBones[v++];
				n+=v;
				for (;v < n;v++,b+=3){
					tMatrix=skeletonBones[tBones[v]].resultMatrix;
					vx=tWeights[b];
					vy=tWeights[b+1];
					var weight=tWeights[b+2];
					wx+=(vx *tMatrix.a+vy *tMatrix.c+tMatrix.tx)*weight;
					wy+=(vx *tMatrix.b+vy *tMatrix.d+tMatrix.ty)*weight;
				}
				worldVertices[w]=wx;
				worldVertices[w+1]=wy;
			}
		}

		/**
		*????????????????????????
		*@param boneSlot
		*@param boneList
		*@param graphics
		*@param spacesCount
		*@param tangents
		*@param percentPosition
		*@param percentSpacing
		*@return
		*/
		__proto.computeWorldPositions=function(boneSlot,boneList,graphics,spacesCount,tangents,percentPosition,percentSpacing){
			var tBones=boneSlot.currDisplayData.bones;
			var tWeights=boneSlot.currDisplayData.weights;
			var tTriangles=boneSlot.currDisplayData.triangles;
			var tRx=0;
			var tRy=0;
			var nn=0;
			var tMatrix;
			var tX=NaN;
			var tY=NaN;
			var tB=0;
			var tWeight=0;
			var tVertices=[];
			var i=0,j=0,n=0;
			var verticesLength=boneSlot.currDisplayData.verLen;
			var target=boneSlot;
			var position=this.position;
			var spaces=this._spaces;
			var world=[];
			var out=[];
			var closed=false;
			var curveCount=verticesLength / 6;
			var prevCurve=-1;
			var pathLength=NaN;
			var o=0,curve=0;
			var p=NaN;
			var space=NaN;
			var prev=NaN;
			var length=NaN;
			if (!true){
				var lengths=boneSlot.currDisplayData.lengths;
				curveCount-=closed ? 1 :2;
				pathLength=lengths[curveCount];
				if (percentPosition)position *=pathLength;
				if (percentSpacing){
					for (i=0;i < spacesCount;i++)
					spaces[i] *=pathLength;
				}
				world.length=8;
				for (i=0,o=0,curve=0;i < spacesCount;i++,o+=3){
					space=spaces[i];
					position+=space;
					p=position;
					if (closed){
						p %=pathLength;
						if (p < 0)p+=pathLength;
						curve=0;
						}else if (p < 0){
						if (prevCurve !=PathConstraint.BEFORE){
							prevCurve=PathConstraint.BEFORE;
							this.computeWorldVertices2(target,boneList,2,4,world,0);
						}
						this.addBeforePosition(p,world,0,out,o);
						continue ;
						}else if (p > pathLength){
						if (prevCurve !=PathConstraint.AFTER){
							prevCurve=PathConstraint.AFTER;
							this.computeWorldVertices2(target,boneList,verticesLength-6,4,world,0);
						}
						this.addAfterPosition(p-pathLength,world,0,out,o);
						continue ;
					}
					for (;;curve++){
						length=lengths[curve];
						if (p > length)continue ;
						if (curve==0)
							p /=length;
						else {
							prev=lengths[curve-1];
							p=(p-prev)/ (length-prev);
						}
						break ;
					}
					if (curve !=prevCurve){
						prevCurve=curve;
						if (closed && curve==curveCount){
							this.computeWorldVertices2(target,boneList,verticesLength-4,4,world,0);
							this.computeWorldVertices2(target,boneList,0,4,world,4);
						}else
						this.computeWorldVertices2(target,boneList,curve *6+2,8,world,0);
					}
					this.addCurvePosition(p,world[0],world[1],world[2],world[3],world[4],world[5],world[6],world[7],out,o,tangents || (i > 0 && space==0));
				}
				return out;
			}
			if (closed){
				verticesLength+=2;
				world[verticesLength-2]=world[0];
				world[verticesLength-1]=world[1];
				}else {
				curveCount--;
				verticesLength-=4;
				this.computeWorldVertices2(boneSlot,boneList,2,verticesLength,tVertices,0);
				if (this._debugKey){
					for (i=0;i < tVertices.length;){
						graphics.drawCircle(tVertices[i++],tVertices[i++],10,"#ff0000");
					}
				}
				world=tVertices;
			}
			this._curves.length=curveCount;
			var curves=this._curves;
			pathLength=0;
			var x1=world[0],y1=world[1],cx1=0,cy1=0,cx2=0,cy2=0,x2=0,y2=0;
			var tmpx=NaN,tmpy=NaN,dddfx=NaN,dddfy=NaN,ddfx=NaN,ddfy=NaN,dfx=NaN,dfy=NaN;
			var w=0;
			for (i=0,w=2;i < curveCount;i++,w+=6){
				cx1=world[w];
				cy1=world[w+1];
				cx2=world[w+2];
				cy2=world[w+3];
				x2=world[w+4];
				y2=world[w+5];
				tmpx=(x1-cx1 *2+cx2)*0.1875;
				tmpy=(y1-cy1 *2+cy2)*0.1875;
				dddfx=((cx1-cx2)*3-x1+x2)*0.09375;
				dddfy=((cy1-cy2)*3-y1+y2)*0.09375;
				ddfx=tmpx *2+dddfx;
				ddfy=tmpy *2+dddfy;
				dfx=(cx1-x1)*0.75+tmpx+dddfx *0.16666667;
				dfy=(cy1-y1)*0.75+tmpy+dddfy *0.16666667;
				pathLength+=Math.sqrt(dfx *dfx+dfy *dfy);
				dfx+=ddfx;
				dfy+=ddfy;
				ddfx+=dddfx;
				ddfy+=dddfy;
				pathLength+=Math.sqrt(dfx *dfx+dfy *dfy);
				dfx+=ddfx;
				dfy+=ddfy;
				pathLength+=Math.sqrt(dfx *dfx+dfy *dfy);
				dfx+=ddfx+dddfx;
				dfy+=ddfy+dddfy;
				pathLength+=Math.sqrt(dfx *dfx+dfy *dfy);
				curves[i]=pathLength;
				x1=x2;
				y1=y2;
			}
			if (percentPosition)position *=pathLength;
			if (percentSpacing){
				for (i=0;i < spacesCount;i++)
				spaces[i] *=pathLength;
			};
			var segments=this._segments;
			var curveLength=0;
			var segment=0;
			for (i=0,o=0,curve=0,segment=0;i < spacesCount;i++,o+=3){
				space=spaces[i];
				position+=space;
				p=position;
				if (closed){
					p %=pathLength;
					if (p < 0)p+=pathLength;
					curve=0;
					}else if (p < 0){
					this.addBeforePosition(p,world,0,out,o);
					continue ;
					}else if (p > pathLength){
					this.addAfterPosition(p-pathLength,world,verticesLength-4,out,o);
					continue ;
				}
				for (;;curve++){
					length=curves[curve];
					if (p > length)continue ;
					if (curve==0)
						p /=length;
					else {
						prev=curves[curve-1];
						p=(p-prev)/ (length-prev);
					}
					break ;
				}
				if (curve !=prevCurve){
					prevCurve=curve;
					var ii=curve *6;
					x1=world[ii];
					y1=world[ii+1];
					cx1=world[ii+2];
					cy1=world[ii+3];
					cx2=world[ii+4];
					cy2=world[ii+5];
					x2=world[ii+6];
					y2=world[ii+7];
					tmpx=(x1-cx1 *2+cx2)*0.03;
					tmpy=(y1-cy1 *2+cy2)*0.03;
					dddfx=((cx1-cx2)*3-x1+x2)*0.006;
					dddfy=((cy1-cy2)*3-y1+y2)*0.006;
					ddfx=tmpx *2+dddfx;
					ddfy=tmpy *2+dddfy;
					dfx=(cx1-x1)*0.3+tmpx+dddfx *0.16666667;
					dfy=(cy1-y1)*0.3+tmpy+dddfy *0.16666667;
					curveLength=Math.sqrt(dfx *dfx+dfy *dfy);
					segments[0]=curveLength;
					for (ii=1;ii < 8;ii++){
						dfx+=ddfx;
						dfy+=ddfy;
						ddfx+=dddfx;
						ddfy+=dddfy;
						curveLength+=Math.sqrt(dfx *dfx+dfy *dfy);
						segments[ii]=curveLength;
					}
					dfx+=ddfx;
					dfy+=ddfy;
					curveLength+=Math.sqrt(dfx *dfx+dfy *dfy);
					segments[8]=curveLength;
					dfx+=ddfx+dddfx;
					dfy+=ddfy+dddfy;
					curveLength+=Math.sqrt(dfx *dfx+dfy *dfy);
					segments[9]=curveLength;
					segment=0;
				}
				p *=curveLength;
				for (;;segment++){
					length=segments[segment];
					if (p > length)continue ;
					if (segment==0)
						p /=length;
					else {
						prev=segments[segment-1];
						p=segment+(p-prev)/ (length-prev);
					}
					break ;
				}
				this.addCurvePosition(p *0.1,x1,y1,cx1,cy1,cx2,cy2,x2,y2,out,o,tangents || (i > 0 && space==0));
			}
			return out;
		}

		__proto.addBeforePosition=function(p,temp,i,out,o){
			var x1=temp[i],y1=temp[i+1],dx=temp[i+2]-x1,dy=temp[i+3]-y1,r=Math.atan2(dy,dx);
			out[o]=x1+p *Math.cos(r);
			out[o+1]=y1+p *Math.sin(r);
			out[o+2]=r;
		}

		__proto.addAfterPosition=function(p,temp,i,out,o){
			var x1=temp[i+2],y1=temp[i+3],dx=x1-temp[i],dy=y1-temp[i+1],r=Math.atan2(dy,dx);
			out[o]=x1+p *Math.cos(r);
			out[o+1]=y1+p *Math.sin(r);
			out[o+2]=r;
		}

		__proto.addCurvePosition=function(p,x1,y1,cx1,cy1,cx2,cy2,x2,y2,out,o,tangents){
			if (p==0)p=0.0001;
			var tt=p *p,ttt=tt *p,u=1-p,uu=u *u,uuu=uu *u;
			var ut=u *p,ut3=ut *3,uut3=u *ut3,utt3=ut3 *p;
			var x=x1 *uuu+cx1 *uut3+cx2 *utt3+x2 *ttt,y=y1 *uuu+cy1 *uut3+cy2 *utt3+y2 *ttt;
			out[o]=x;
			out[o+1]=y;
			if (tangents){
				out[o+2]=Math.atan2(y-(y1 *uu+cy1 *ut *2+cy2 *tt),x-(x1 *uu+cx1 *ut *2+cx2 *tt));
				}else {
				out[o+2]=0;
			}
		}

		PathConstraint.NONE=-1;
		PathConstraint.BEFORE=-2;
		PathConstraint.AFTER=-3;
		return PathConstraint;
	})()


	/**
	*@private
	*/
	//class laya.ani.bone.PathConstraintData
	var PathConstraintData=(function(){
		function PathConstraintData(){
			this.name=null;
			this.target=null;
			this.positionMode=null;
			this.spacingMode=null;
			this.rotateMode=null;
			this.offsetRotation=NaN;
			this.position=NaN;
			this.spacing=NaN;
			this.rotateMix=NaN;
			this.translateMix=NaN;
			this.bones=[];
		}

		__class(PathConstraintData,'laya.ani.bone.PathConstraintData');
		return PathConstraintData;
	})()


	/**
	*@private
	*/
	//class laya.ani.bone.SkinData
	var SkinData=(function(){
		function SkinData(){
			this.name=null;
			this.slotArr=[];
		}

		__class(SkinData,'laya.ani.bone.SkinData');
		return SkinData;
	})()


	/**
	*@private
	*/
	//class laya.ani.bone.SkinSlotDisplayData
	var SkinSlotDisplayData=(function(){
		function SkinSlotDisplayData(){
			this.name=null;
			this.attachmentName=null;
			this.type=0;
			this.transform=null;
			this.width=NaN;
			this.height=NaN;
			this.texture=null;
			this.bones=null;
			this.uvs=null;
			this.weights=null;
			this.triangles=null;
			this.vertices=null;
			this.lengths=null;
			this.verLen=0;
		}

		__class(SkinSlotDisplayData,'laya.ani.bone.SkinSlotDisplayData');
		var __proto=SkinSlotDisplayData.prototype;
		__proto.createTexture=function(currTexture){
			if (this.texture)return this.texture;
			this.texture=new Texture(currTexture.bitmap,this.uvs);
			if (this.uvs[0] > this.uvs[4]
				&& this.uvs[1] > this.uvs[5]){
				this.texture.width=currTexture.height;
				this.texture.height=currTexture.width;
				this.texture.offsetX=-currTexture.offsetX;
				this.texture.offsetY=-currTexture.offsetY;
				this.texture.sourceWidth=currTexture.sourceHeight;
				this.texture.sourceHeight=currTexture.sourceWidth;
				}else {
				this.texture.width=currTexture.width;
				this.texture.height=currTexture.height;
				this.texture.offsetX=-currTexture.offsetX;
				this.texture.offsetY=-currTexture.offsetY;
				this.texture.sourceWidth=currTexture.sourceWidth;
				this.texture.sourceHeight=currTexture.sourceHeight;
			}
			return this.texture;
		}

		__proto.destory=function(){
			if (this.texture)this.texture.destroy();
		}

		return SkinSlotDisplayData;
	})()


	/**
	*@private
	*/
	//class laya.ani.bone.SlotData
	var SlotData=(function(){
		function SlotData(){
			this.name=null;
			this.displayArr=[];
		}

		__class(SlotData,'laya.ani.bone.SlotData');
		var __proto=SlotData.prototype;
		__proto.getDisplayByName=function(name){
			var tDisplay;
			for (var i=0,n=this.displayArr.length;i < n;i++){
				tDisplay=this.displayArr[i];
				if (tDisplay.attachmentName==name){
					return i;
				}
			}
			return-1;
		}

		return SlotData;
	})()


	/**
	*@private
	*/
	//class laya.ani.bone.TfConstraint
	var TfConstraint=(function(){
		function TfConstraint(data,bones){
			this._data=null;
			this._bones=null;
			this.target=null;
			this.rotateMix=NaN;
			this.translateMix=NaN;
			this.scaleMix=NaN;
			this.shearMix=NaN;
			this._temp=__newvec(2,0);
			this._data=data;
			if (this._bones==null){
				this._bones=[];
			}
			this.target=bones[data.targetIndex];
			var j=0,n=0;
			for (j=0,n=data.boneIndexs.length;j < n;j++){
				this._bones.push(bones[data.boneIndexs[j]]);
			}
			this.rotateMix=data.rotateMix;
			this.translateMix=data.translateMix;
			this.scaleMix=data.scaleMix;
			this.shearMix=data.shearMix;
		}

		__class(TfConstraint,'laya.ani.bone.TfConstraint');
		var __proto=TfConstraint.prototype;
		__proto.apply=function(){
			var tTfBone;
			var ta=this.target.resultMatrix.a,tb=this.target.resultMatrix.b,tc=this.target.resultMatrix.c,td=this.target.resultMatrix.d;
			for (var j=0,n=this._bones.length;j < n;j++){
				tTfBone=this._bones[j];
				if (this.rotateMix > 0){
					var a=tTfBone.resultMatrix.a,b=tTfBone.resultMatrix.b,c=tTfBone.resultMatrix.c,d=tTfBone.resultMatrix.d;
					var r=Math.atan2(tc,ta)-Math.atan2(c,a)+this._data.offsetRotation *Math.PI / 180;
					if (r > Math.PI)
						r-=Math.PI *2;
					else if (r <-Math.PI)r+=Math.PI *2;
					r *=this.rotateMix;
					var cos=Math.cos(r),sin=Math.sin(r);
					tTfBone.resultMatrix.a=cos *a-sin *c;
					tTfBone.resultMatrix.b=cos *b-sin *d;
					tTfBone.resultMatrix.c=sin *a+cos *c;
					tTfBone.resultMatrix.d=sin *b+cos *d;
				}
				if (this.translateMix){
					this._temp[0]=this._data.offsetX;
					this._temp[1]=this._data.offsetY;
					this.target.localToWorld(this._temp);
					tTfBone.resultMatrix.tx+=(this._temp[0]-tTfBone.resultMatrix.tx)*this.translateMix;
					tTfBone.resultMatrix.ty+=(this._temp[1]-tTfBone.resultMatrix.ty)*this.translateMix;
					tTfBone.updateChild();
				}
				if (this.scaleMix > 0){
					var bs=Math.sqrt(tTfBone.resultMatrix.a *tTfBone.resultMatrix.a+tTfBone.resultMatrix.c *tTfBone.resultMatrix.c);
					var ts=Math.sqrt(ta *ta+tc *tc);
					var s=bs > 0.00001 ? (bs+(ts-bs+this._data.offsetScaleX)*this.scaleMix)/ bs :0;
					tTfBone.resultMatrix.a *=s;
					tTfBone.resultMatrix.c *=s;
					bs=Math.sqrt(tTfBone.resultMatrix.b *tTfBone.resultMatrix.b+tTfBone.resultMatrix.d *tTfBone.resultMatrix.d);
					ts=Math.sqrt(tb *tb+td *td);
					s=bs > 0.00001 ? (bs+(ts-bs+this._data.offsetScaleY)*this.scaleMix)/ bs :0;
					tTfBone.resultMatrix.b *=s;
					tTfBone.resultMatrix.d *=s;
				}
				if (this.shearMix > 0){
					b=tTfBone.resultMatrix.b,d=tTfBone.resultMatrix.d;
					var by=Math.atan2(d,b);
					r=Math.atan2(td,tb)-Math.atan2(tc,ta)-(by-Math.atan2(tTfBone.resultMatrix.c,tTfBone.resultMatrix.a));
					if (r > Math.PI)
						r-=Math.PI *2;
					else if (r <-Math.PI)r+=Math.PI *2;
					r=by+(r+this._data.offsetShearY *Math.PI / 180)*this.shearMix;
					s=Math.sqrt(b *b+d *d);
					tTfBone.resultMatrix.b=Math.cos(r)*s;
					tTfBone.resultMatrix.d=Math.sin(r)*s;
				}
			}
		}

		return TfConstraint;
	})()


	/**
	*@private
	*/
	//class laya.ani.bone.TfConstraintData
	var TfConstraintData=(function(){
		function TfConstraintData(){
			this.name=null;
			this.targetIndex=0;
			this.rotateMix=NaN;
			this.translateMix=NaN;
			this.scaleMix=NaN;
			this.shearMix=NaN;
			this.offsetRotation=NaN;
			this.offsetX=NaN;
			this.offsetY=NaN;
			this.offsetScaleX=NaN;
			this.offsetScaleY=NaN;
			this.offsetShearY=NaN;
			this.boneIndexs=[];
		}

		__class(TfConstraintData,'laya.ani.bone.TfConstraintData');
		return TfConstraintData;
	})()


	/**
	*@private
	*/
	//class laya.ani.bone.Transform
	var Transform=(function(){
		function Transform(){
			this.skX=0;
			this.skY=0;
			this.scX=1;
			this.scY=1;
			this.x=0;
			this.y=0;
			this.mMatrix=null;
		}

		__class(Transform,'laya.ani.bone.Transform');
		var __proto=Transform.prototype;
		__proto.initData=function(data){
			if (data.x !=undefined){
				this.x=data.x;
			}
			if (data.y !=undefined){
				this.y=data.y;
			}
			if (data.skX !=undefined){
				this.skX=data.skX;
			}
			if (data.skY !=undefined){
				this.skY=data.skY;
			}
			if (data.scX !=undefined){
				this.scX=data.scX;
			}
			if (data.scY !=undefined){
				this.scY=data.scY;
			}
		}

		__proto.getMatrix=function(){
			var tMatrix;
			if (this.mMatrix){
				tMatrix=this.mMatrix;
				}else {
				tMatrix=this.mMatrix=new Matrix();
			}
			tMatrix.a=Math.cos(this.skY);
			if (this.skX !=0 || this.skY !=0){
				var tAngle=this.skX *Math.PI / 180;
				var cos=Math.cos(tAngle),sin=Math.sin(tAngle);
				tMatrix.setTo(this.scX *cos,this.scX *sin,this.scY *-sin,this.scY *cos,this.x,this.y);
				}else {
				tMatrix.setTo(this.scX,this.skX,this.skY,this.scY,this.x,this.y);
			}
			return tMatrix;
		}

		return Transform;
	})()


	/**
	*<code>AnimationPlayer</code> ???????????????????????????
	*/
	//class laya.ani.AnimationPlayer extends laya.events.EventDispatcher
	var AnimationPlayer=(function(_super){
		function AnimationPlayer(){
			this._templet=null;
			this._currentTime=NaN;
			this._currentFrameTime=NaN;
			this._playStart=NaN;
			this._playEnd=NaN;
			this._playDuration=NaN;
			this._overallDuration=NaN;
			this._stopWhenCircleFinish=false;
			this._elapsedPlaybackTime=NaN;
			this._startUpdateLoopCount=NaN;
			this._currentAnimationClipIndex=0;
			this._currentKeyframeIndex=0;
			this._paused=false;
			this._cacheFrameRate=0;
			this._cacheFrameRateInterval=NaN;
			this._cachePlayRate=NaN;
			this._fullFrames=null;
			this.isCache=true;
			this.playbackRate=1.0;
			this.returnToZeroStopped=true;
			AnimationPlayer.__super.call(this);
			this._currentAnimationClipIndex=-1;
			this._currentKeyframeIndex=-1;
			this._currentTime=0.0;
			this._overallDuration=Number.MAX_VALUE;
			this._stopWhenCircleFinish=false;
			this._elapsedPlaybackTime=0;
			this._startUpdateLoopCount=-1;
			this._cachePlayRate=1.0;
			this.cacheFrameRate=60;
		}

		__class(AnimationPlayer,'laya.ani.AnimationPlayer',_super);
		var __proto=AnimationPlayer.prototype;
		/**
		*@private
		*/
		__proto._onTempletLoadedComputeFullKeyframeIndices=function(cachePlayRate,cacheFrameRate,templet){
			if (this._templet===templet && this._cachePlayRate===cachePlayRate && this._cacheFrameRate===cacheFrameRate)
				this._computeFullKeyframeIndices();
		}

		/**
		*@private
		*/
		__proto._computeFullKeyframeIndices=function(){
			var anifullFrames=this._fullFrames=[];
			var templet=this._templet;
			var cacheFrameInterval=this._cacheFrameRateInterval*this._cachePlayRate;
			for (var i=0,iNum=templet.getAnimationCount();i < iNum;i++){
				var aniFullFrame=[];
				for (var j=0,jNum=templet.getAnimation(i).nodes.length;j < jNum;j++){
					var node=templet.getAnimation(i).nodes[j];
					var frameCount=Math.floor(node.playTime / cacheFrameInterval);
					var nodeFullFrames=new Uint16Array(frameCount+1);
					var lastFrameIndex=-1;
					for (var n=0,nNum=node.keyFrame.length;n < nNum;n++){
						var keyFrame=node.keyFrame[n];
						var tm=keyFrame.startTime;
						var endTm=tm+keyFrame.duration+cacheFrameInterval;
						do {
							var frameIndex=Math.floor(tm / cacheFrameInterval+0.5);
							for (var k=lastFrameIndex+1;k < frameIndex;k++)
							nodeFullFrames[k]=n;
							lastFrameIndex=frameIndex;
							nodeFullFrames[frameIndex]=n;
							tm+=cacheFrameInterval;
						}while (tm <=endTm);
					}
					aniFullFrame.push(nodeFullFrames);
				}
				anifullFrames.push(aniFullFrame);
			}
			this.event(Event.CACHEFRAMEINDEX_CHANGED,this);
		}

		/**
		*@private
		*/
		__proto._calculatePlayDuration=function(){
			if (this.state!==/*laya.ani.AnimationState.stopped*/0){
				var oriDuration=this._templet.getAniDuration(this._currentAnimationClipIndex);
				(this._playEnd===0)&& (this._playEnd=oriDuration);
				if (Math.floor(this._playEnd)> oriDuration)
					this._playEnd=oriDuration;
				this._playDuration=this._playEnd-this._playStart;
			}
		}

		/**
		*???????????????
		*@param index ???????????????
		*@param playbackRate ???????????????
		*@param duration ???????????????0???1???,Number.MAX_VALUE?????????????????????
		*@param playStart ??????????????????????????????
		*@param playEnd ?????????????????????????????????0??????????????????????????????????????????????????????
		*/
		__proto.play=function(index,playbackRate,overallDuration,playStart,playEnd){
			(index===void 0)&& (index=0);
			(playbackRate===void 0)&& (playbackRate=1.0);
			(overallDuration===void 0)&& (overallDuration=2147483647);
			(playStart===void 0)&& (playStart=0);
			(playEnd===void 0)&& (playEnd=0);
			if (!this._templet)
				throw new Error("AnimationPlayer:templet must not be null,maybe you need to set url.");
			if (overallDuration < 0 || playStart < 0 || playEnd < 0)
				throw new Error("AnimationPlayer:overallDuration,playStart and playEnd must large than zero.");
			if ((playEnd!==0)&& (playStart > playEnd))
				throw new Error("AnimationPlayer:start must less than end.");
			this._currentTime=0;
			this._currentFrameTime=0;
			this._elapsedPlaybackTime=0;
			this.playbackRate=playbackRate;
			this._overallDuration=overallDuration;
			this._playStart=playStart;
			this._playEnd=playEnd;
			this._paused=false;
			this._currentAnimationClipIndex=index;
			this._currentKeyframeIndex=0;
			this._startUpdateLoopCount=Stat.loopCount;
			this.event(/*laya.events.Event.PLAYED*/"played");
			if (this._templet.loaded)
				this._calculatePlayDuration();
			else
			this._templet.once(/*laya.events.Event.LOADED*/"loaded",this,this._calculatePlayDuration);
			this.update(0);
		}

		/**
		*???????????????
		*@param index ???????????????
		*@param playbackRate ???????????????
		*@param duration ???????????????0???1???,Number.MAX_VALUE?????????????????????
		*@param playStartFrame ????????????????????????????????????
		*@param playEndFrame ???????????????????????????????????????0??????????????????????????????????????????????????????
		*/
		__proto.playByFrame=function(index,playbackRate,overallDuration,playStartFrame,playEndFrame,fpsIn3DBuilder){
			(index===void 0)&& (index=0);
			(playbackRate===void 0)&& (playbackRate=1.0);
			(overallDuration===void 0)&& (overallDuration=9007199254740991);
			(playStartFrame===void 0)&& (playStartFrame=0);
			(playEndFrame===void 0)&& (playEndFrame=0);
			(fpsIn3DBuilder===void 0)&& (fpsIn3DBuilder=30);
			var interval=1000.0 / fpsIn3DBuilder;
			this.play(index,playbackRate,overallDuration,playStartFrame *interval,playEndFrame *interval);
		}

		/**
		*????????????????????????
		*@param immediate ??????????????????
		*/
		__proto.stop=function(immediate){
			(immediate===void 0)&& (immediate=true);
			if (immediate){
				this._currentAnimationClipIndex=this._currentKeyframeIndex=-1;
				this.event(/*laya.events.Event.STOPPED*/"stopped");
				}else {
				this._stopWhenCircleFinish=true;
			}
		}

		/**????????????????????? */
		__proto.update=function(elapsedTime){
			if (this._currentAnimationClipIndex===-1 || this._paused || !this._templet || !this._templet.loaded)
				return;
			var cacheFrameInterval=this._cacheFrameRateInterval *this._cachePlayRate;
			var time=0;
			(this._startUpdateLoopCount!==Stat.loopCount)&& (time=elapsedTime *this.playbackRate,this._elapsedPlaybackTime+=time);
			var currentAniClipPlayDuration=this.playDuration;
			if ((this._overallDuration!==0 && this._elapsedPlaybackTime >=this._overallDuration)|| (this._overallDuration===0 && this._elapsedPlaybackTime >=currentAniClipPlayDuration)){
				this._currentAnimationClipIndex=this._currentKeyframeIndex=-1;
				this.event(/*laya.events.Event.STOPPED*/"stopped");
				return;
			}
			time+=this._currentTime;
			if (currentAniClipPlayDuration > 0){
				while (time >=currentAniClipPlayDuration){
					if (this._stopWhenCircleFinish){
						this._currentAnimationClipIndex=this._currentKeyframeIndex=-1;
						this._stopWhenCircleFinish=false;
						this.event(/*laya.events.Event.STOPPED*/"stopped");
						return;
					}
					time-=currentAniClipPlayDuration;
					this.event(/*laya.events.Event.COMPLETE*/"complete");
				}
				this._currentTime=time;
				this._currentKeyframeIndex=Math.floor((this.currentPlayTime)/ cacheFrameInterval);
				this._currentFrameTime=this._currentKeyframeIndex *cacheFrameInterval;
				}else {
				if (this._stopWhenCircleFinish){
					this._currentAnimationClipIndex=this._currentKeyframeIndex=-1;
					this._stopWhenCircleFinish=false;
					this.event(/*laya.events.Event.STOPPED*/"stopped");
					return;
				}
				this._currentTime=this._currentFrameTime=this._currentKeyframeIndex=0;
				this.event(/*laya.events.Event.COMPLETE*/"complete");
			}
		}

		/**
		*????????????????????????????????????
		*@return ?????????????????????
		*/
		__getset(0,__proto,'playEnd',function(){
			return this._playEnd;
		});

		/**
		*????????????????????????,??????????????????????????????????????????
		*@param value ??????????????????
		*/
		/**
		*????????????????????????
		*@param value ??????????????????
		*/
		__getset(0,__proto,'templet',function(){
			return this._templet;
			},function(value){
			if (!this.state===/*laya.ani.AnimationState.stopped*/0)
				this.stop(true);
			if (this._templet!==value){
				this._templet=value;
				if (value.loaded)
					this._computeFullKeyframeIndices();
				else
				value.once(/*laya.events.Event.LOADED*/"loaded",this,this._onTempletLoadedComputeFullKeyframeIndices,[this._cachePlayRate,this._cacheFrameRate]);
			}
		});

		/**
		*????????????????????????????????????
		*@return ?????????????????????
		*/
		__getset(0,__proto,'playStart',function(){
			return this._playStart;
		});

		/**
		*????????????????????????????????????
		*@return ??????????????????????????????
		*/
		__getset(0,__proto,'playDuration',function(){
			return this._playDuration;
		});

		/**
		*????????????????????????
		*@return ??????????????????
		*/
		__getset(0,__proto,'state',function(){
			if (this._currentAnimationClipIndex===-1)
				return /*laya.ani.AnimationState.stopped*/0;
			if (this._paused)
				return /*laya.ani.AnimationState.paused*/1;
			return /*laya.ani.AnimationState.playing*/2;
		});

		/**
		*??????????????????
		*@return ????????????
		*/
		__getset(0,__proto,'currentKeyframeIndex',function(){
			return this._currentKeyframeIndex;
		});

		/**
		*?????????????????????????????????
		*@return ????????????????????????
		*/
		__getset(0,__proto,'overallDuration',function(){
			return this._overallDuration;
		});

		/**
		*?????????????????????????????????????????????
		*@return value ????????????
		*/
		__getset(0,__proto,'currentFrameTime',function(){
			return this._currentFrameTime;
		});

		/**
		*????????????????????????
		*@return value ??????????????????
		*/
		__getset(0,__proto,'currentAnimationClipIndex',function(){
			return this._currentAnimationClipIndex;
		});

		/**
		*????????????????????????????????????????????????
		*@return value ????????????
		*/
		__getset(0,__proto,'currentPlayTime',function(){
			return this._currentTime+this._playStart;
		});

		/**
		*????????????????????????,????????????1.0,??????????????????????????????????????????*
		*@return value ?????????????????????
		*/
		/**
		*???????????????????????????*
		*@return ?????????????????????
		*/
		__getset(0,__proto,'cachePlayRate',function(){
			return this._cachePlayRate;
			},function(value){
			if (this._cachePlayRate!==value){
				this._cachePlayRate=value;
				if (this._templet)
					if (this._templet.loaded)
				this._computeFullKeyframeIndices();
				else
				this._templet.once(/*laya.events.Event.LOADED*/"loaded",this,this._onTempletLoadedComputeFullKeyframeIndices,[value,this._cacheFrameRate]);
			}
		});

		/**
		*??????????????????,??????60???,??????????????????????????????????????????*
		*@return value ????????????
		*/
		/**
		*??????????????????*
		*@return value ????????????
		*/
		__getset(0,__proto,'cacheFrameRate',function(){
			return this._cacheFrameRate;
			},function(value){
			if (this._cacheFrameRate!==value){
				this._cacheFrameRate=value;
				this._cacheFrameRateInterval=1000.0 / this._cacheFrameRate;
				if (this._templet)
					if (this._templet.loaded)
				this._computeFullKeyframeIndices();
				else
				this._templet.once(/*laya.events.Event.LOADED*/"loaded",this,this._onTempletLoadedComputeFullKeyframeIndices,[this._cachePlayRate,value]);
			}
		});

		/**
		*????????????????????????
		*@param value ????????????
		*/
		__getset(0,__proto,'currentTime',null,function(value){
			if (this._currentAnimationClipIndex===-1 || !this._templet || !this._templet.loaded)
				return;
			if (value < this._playStart || value > this._playEnd)
				throw new Error("AnimationPlayer:value must large than playStartTime,small than playEndTime.");
			this._startUpdateLoopCount=Stat.loopCount;
			var cacheFrameInterval=this._cacheFrameRateInterval *this._cachePlayRate;
			this._currentTime=value;
			this._currentKeyframeIndex=Math.floor(this.currentPlayTime / cacheFrameInterval);
			this._currentFrameTime=this._currentKeyframeIndex *cacheFrameInterval;
		});

		/**
		*??????????????????
		*@param value ????????????
		*/
		/**
		*????????????????????????
		*@return ????????????
		*/
		__getset(0,__proto,'paused',function(){
			return this._paused;
			},function(value){
			this._paused=value;
			value && this.event(/*laya.events.Event.PAUSED*/"paused");
		});

		/**
		*??????????????????????????????
		*@return ????????????????????????
		*/
		__getset(0,__proto,'cacheFrameRateInterval',function(){
			return this._cacheFrameRateInterval;
		});

		return AnimationPlayer;
	})(EventDispatcher)


	//class laya.ani.GraphicsAni extends laya.display.Graphics
	var GraphicsAni=(function(_super){
		function GraphicsAni(){
			GraphicsAni.__super.call(this);
			if (Render.isConchNode){
				this["drawSkin"]=function (skin){
					skin.transform || (skin.transform=Matrix.EMPTY);
					this.setSkinMesh&&this.setSkinMesh(skin._ps,skin.mVBData,skin.mEleNum,0,skin.mTexture,skin.transform);
				};
			}
		}

		__class(GraphicsAni,'laya.ani.GraphicsAni',_super);
		var __proto=GraphicsAni.prototype;
		/**
		*@private
		*????????????????????????
		*@param skin
		*/
		__proto.drawSkin=function(skin){
			var arr=[skin];
			this._saveToCmd(Render._context._drawSkin,arr);
		}

		return GraphicsAni;
	})(Graphics)


	/**
	*<code>AnimationTemplet</code> ??????????????????????????????
	*/
	//class laya.ani.AnimationTemplet extends laya.resource.Resource
	var AnimationTemplet=(function(_super){
		function AnimationTemplet(){
			this._aniMap={};
			//this._publicExtData=null;
			//this._useParent=false;
			//this.unfixedCurrentFrameIndexes=null;
			//this.unfixedCurrentTimes=null;
			//this.unfixedKeyframes=null;
			this.unfixedLastAniIndex=-1;
			//this._aniVersion=null;
			//this._animationDatasCache=null;
			AnimationTemplet.__super.call(this);
			this._anis=new Array;
		}

		__class(AnimationTemplet,'laya.ani.AnimationTemplet',_super);
		var __proto=AnimationTemplet.prototype;
		__proto._endLoaded=function(){
			this._loaded=true;
			this.event(/*laya.events.Event.LOADED*/"loaded",this);
		}

		__proto.parse=function(data){
			var i=0,j=0,k=0,n=0,l=0;
			var read=new Byte(data);
			this._aniVersion=read.readUTFString();
			var aniClassName=read.readUTFString();
			var strList=read.readUTFString().split("\n");
			var aniCount=read.getUint8();
			var publicDataPos=read.getUint32();
			var publicExtDataPos=read.getUint32();
			var publicData;
			if (publicDataPos > 0)
				publicData=data.slice(publicDataPos,publicExtDataPos);
			var publicRead=new Byte(publicData);
			if (publicExtDataPos > 0)
				this._publicExtData=data.slice(publicExtDataPos,data.byteLength);
			this._useParent=!!read.getUint8();
			this._anis.length=aniCount;
			for (i=0;i < aniCount;i++){
				var ani=this._anis[i]=
				{};
				ani.nodes=new Array;
				var name=ani.name=strList[read.getUint16()];
				this._aniMap[name]=i;
				ani.bone3DMap={};
				ani.playTime=read.getFloat32();
				var boneCount=ani.nodes.length=read.getUint8();
				ani.totalKeyframesLength=0;
				for (j=0;j < boneCount;j++){
					var node=ani.nodes[j]=
					{};
					node.childs=[];
					var nameIndex=read.getInt16();
					if (nameIndex >=0){
						node.name=strList[nameIndex];
						ani.bone3DMap[node.name]=j;
					}
					node.keyFrame=new Array;
					node.parentIndex=read.getInt16();
					node.parentIndex==-1 ? node.parent=null :node.parent=ani.nodes[node.parentIndex];
					var isLerp=!!read.getUint8();
					var keyframeParamsOffset=read.getUint32();
					publicRead.pos=keyframeParamsOffset;
					var keyframeDataCount=node.keyframeWidth=publicRead.getUint16();
					ani.totalKeyframesLength+=keyframeDataCount;
					if (isLerp){
						node.interpolationMethod=[];
						node.interpolationMethod.length=keyframeDataCount;
						for (k=0;k < keyframeDataCount;k++)
						node.interpolationMethod[k]=AnimationTemplet.interpolation[publicRead.getUint8()];
					}
					if (node.parent !=null)
						node.parent.childs.push(node);
					var privateDataLen=read.getUint16();
					if (privateDataLen > 0){
						node.extenData=data.slice(read.pos,read.pos+privateDataLen);
						read.pos+=privateDataLen;
					};
					var keyframeCount=read.getUint16();
					node.keyFrame.length=keyframeCount;
					var startTime=0;
					for (k=0,n=keyframeCount;k < n;k++){
						var keyFrame=node.keyFrame[k]=
						{};
						keyFrame.duration=read.getFloat32();
						keyFrame.startTime=startTime;
						keyFrame.data=new Float32Array(keyframeDataCount);
						keyFrame.dData=new Float32Array(keyframeDataCount);
						keyFrame.nextData=new Float32Array(keyframeDataCount);
						for (l=0;l < keyframeDataCount;l++){
							keyFrame.data[l]=read.getFloat32();
							if (keyFrame.data[l] >-0.00000001 && keyFrame.data[l] < 0.00000001)keyFrame.data[l]=0;
						}
						startTime+=keyFrame.duration;
					}
					node.playTime=ani.playTime;
					this._calculateKeyFrame(node,keyframeCount,keyframeDataCount);
				}
			}
		}

		__proto._calculateKeyFrame=function(node,keyframeCount,keyframeDataCount){
			var keyFrames=node.keyFrame;
			keyFrames[keyframeCount]=keyFrames[0];
			for (var i=0;i < keyframeCount;i++){
				var keyFrame=keyFrames[i];
				for (var j=0;j < keyframeDataCount;j++){
					keyFrame.dData[j]=(keyFrame.duration===0)? 0 :(keyFrames[i+1].data[j]-keyFrame.data[j])/ keyFrame.duration;
					keyFrame.nextData[j]=keyFrames[i+1].data[j];
				}
			}
			keyFrames.length--;
		}

		/**
		*@private
		*/
		__proto.onAsynLoaded=function(url,data){
			this.parse(data);
			this._endLoaded();
		}

		__proto.getAnimationCount=function(){
			return this._anis.length;
		}

		__proto.getAnimation=function(aniIndex){
			return this._anis[aniIndex];
		}

		__proto.getAniDuration=function(aniIndex){
			return this._anis[aniIndex].playTime;
		}

		__proto.getNodes=function(aniIndex){
			return this._anis[aniIndex].nodes;
		}

		__proto.getNodeIndexWithName=function(aniIndex,name){
			return this._anis[aniIndex].bone3DMap[name];
		}

		__proto.getNodeCount=function(aniIndex){
			return this._anis[aniIndex].nodes.length;
		}

		__proto.getTotalkeyframesLength=function(aniIndex){
			return this._anis[aniIndex].totalKeyframesLength;
		}

		__proto.getPublicExtData=function(){
			return this._publicExtData;
		}

		__proto.getAnimationDataWithCache=function(key,cacheDatas,aniIndex,frameIndex){
			var aniDatas=cacheDatas[aniIndex];
			if (!aniDatas){
				return null;
				}else {
				var keyDatas=aniDatas[key];
				if (!keyDatas)
					return null;
				else {
					return keyDatas[frameIndex];
				}
			}
		}

		__proto.setAnimationDataWithCache=function(key,cacheDatas,aniIndex,frameIndex,data){
			var aniDatas=(cacheDatas[aniIndex])|| (cacheDatas[aniIndex]={});
			var aniDatasCache=(aniDatas[key])|| (aniDatas[key]=[]);
			aniDatasCache[frameIndex]=data;
		}

		__proto.getOriginalData=function(aniIndex,originalData,nodesFrameIndices,frameIndex,playCurTime){
			var oneAni=this._anis[aniIndex];
			var nodes=oneAni.nodes;
			var j=0;
			for (var i=0,n=nodes.length,outOfs=0;i < n;i++){
				var node=nodes[i];
				var key;
				key=node.keyFrame[nodesFrameIndices[i][frameIndex]];
				node.dataOffset=outOfs;
				var dt=playCurTime-key.startTime;
				for (j=0;j < node.keyframeWidth;){
					j+=node.interpolationMethod[j](node,j,originalData,outOfs+j,key.data,dt,key.dData,key.duration,key.nextData);
				}
				outOfs+=node.keyframeWidth;
			}
		}

		__proto.getNodesCurrentFrameIndex=function(aniIndex,playCurTime){
			var ani=this._anis[aniIndex];
			var nodes=ani.nodes;
			if (aniIndex!==this.unfixedLastAniIndex){
				this.unfixedCurrentFrameIndexes=new Uint32Array(nodes.length);
				this.unfixedCurrentTimes=new Float32Array(nodes.length);
				this.unfixedLastAniIndex=aniIndex;
			}
			for (var i=0,n=nodes.length,outOfs=0;i < n;i++){
				var node=nodes[i];
				if (playCurTime < this.unfixedCurrentTimes[i])
					this.unfixedCurrentFrameIndexes[i]=0;
				this.unfixedCurrentTimes[i]=playCurTime;
				while ((this.unfixedCurrentFrameIndexes[i] < node.keyFrame.length)){
					if (node.keyFrame[this.unfixedCurrentFrameIndexes[i]].startTime > this.unfixedCurrentTimes[i])
						break ;
					this.unfixedCurrentFrameIndexes[i]++;
				}
				this.unfixedCurrentFrameIndexes[i]--;
			}
			return this.unfixedCurrentFrameIndexes;
		}

		__proto.getOriginalDataUnfixedRate=function(aniIndex,originalData,playCurTime){
			var oneAni=this._anis[aniIndex];
			var nodes=oneAni.nodes;
			if (aniIndex!==this.unfixedLastAniIndex){
				this.unfixedCurrentFrameIndexes=new Uint32Array(nodes.length);
				this.unfixedCurrentTimes=new Float32Array(nodes.length);
				this.unfixedKeyframes=__newvec(nodes.length);
				this.unfixedLastAniIndex=aniIndex;
			};
			var j=0;
			for (var i=0,n=nodes.length,outOfs=0;i < n;i++){
				var node=nodes[i];
				if (playCurTime < this.unfixedCurrentTimes[i])
					this.unfixedCurrentFrameIndexes[i]=0;
				this.unfixedCurrentTimes[i]=playCurTime;
				while (this.unfixedCurrentFrameIndexes[i] < node.keyFrame.length){
					if (node.keyFrame[this.unfixedCurrentFrameIndexes[i]].startTime > this.unfixedCurrentTimes[i])
						break ;
					this.unfixedKeyframes[i]=node.keyFrame[this.unfixedCurrentFrameIndexes[i]];
					this.unfixedCurrentFrameIndexes[i]++;
				};
				var key=this.unfixedKeyframes[i];
				node.dataOffset=outOfs;
				var dt=playCurTime-key.startTime;
				for (j=0;j < node.keyframeWidth;){
					j+=node.interpolationMethod[j](node,j,originalData,outOfs+j,key.data,dt,key.dData,key.duration,key.nextData);
				}
				outOfs+=node.keyframeWidth;
			}
		}

		__proto.dispose=function(){
			this.resourceManager.removeResource(this);
			_super.prototype.dispose.call(this);
		}

		AnimationTemplet._LinearInterpolation_0=function(bone,index,out,outOfs,data,dt,dData,duration,nextData){
			out[outOfs]=data[index]+dt *dData[index];
			return 1;
		}

		AnimationTemplet._QuaternionInterpolation_1=function(bone,index,out,outOfs,data,dt,dData,duration,nextData){
			var amount=duration===0 ? 0 :dt / duration;
			MathUtil.slerpQuaternionArray(data,index,nextData,index,amount,out,outOfs);
			return 4;
		}

		AnimationTemplet._AngleInterpolation_2=function(bone,index,out,outOfs,data,dt,dData,duration,nextData){
			return 0;
		}

		AnimationTemplet._RadiansInterpolation_3=function(bone,index,out,outOfs,data,dt,dData,duration,nextData){
			return 0;
		}

		AnimationTemplet._Matrix4x4Interpolation_4=function(bone,index,out,outOfs,data,dt,dData,duration,nextData){
			for (var i=0;i < 16;i++,index++)
			out[outOfs+i]=data[index]+dt *dData[index];
			return 16;
		}

		AnimationTemplet._NoInterpolation_5=function(bone,index,out,outOfs,data,dt,dData,duration,nextData){
			out[outOfs]=data[index];
			return 1;
		}

		AnimationTemplet.load=function(url){
			return Laya.loader.create(url,null,null,AnimationTemplet);
		}

		AnimationTemplet.interpolation=[AnimationTemplet._LinearInterpolation_0,AnimationTemplet._QuaternionInterpolation_1,AnimationTemplet._AngleInterpolation_2,AnimationTemplet._RadiansInterpolation_3,AnimationTemplet._Matrix4x4Interpolation_4,AnimationTemplet._NoInterpolation_5];
		AnimationTemplet.LAYA_ANIMATION_VISION="LAYAANIMATION:1.0.6";
		return AnimationTemplet;
	})(Resource)


	/**
	*???????????????Templet,AnimationPlayer,Skeleton???????????????
	*/
	//class laya.ani.bone.Skeleton extends laya.display.Sprite
	var Skeleton=(function(_super){
		function Skeleton(templet,aniMode){
			this._templet=null;
			this._player=null;
			this._curOriginalData=null;
			this._boneMatrixArray=[];
			this._lastTime=0;
			this._currAniName=null;
			this._currAniIndex=-1;
			this._pause=true;
			this._aniClipIndex=-1;
			this._clipIndex=-1;
			this._skinIndex=0;
			this._skinName="default";
			this._aniMode=0;
			this._graphicsCache=null;
			this._boneSlotDic=null;
			this._bindBoneBoneSlotDic=null;
			this._boneSlotArray=null;
			this._index=-1;
			this._total=-1;
			this._indexControl=false;
			this._aniPath=null;
			this._texturePath=null;
			this._complete=null;
			this._loadAniMode=0;
			this._yReverseMatrix=null;
			this._ikArr=null;
			this._tfArr=null;
			this._pathDic=null;
			this._rootBone=null;
			this._boneList=null;
			this._aniSectionDic=null;
			this._eventIndex=0;
			this._drawOrderIndex=0;
			this._drawOrder=null;
			this._lastAniClipIndex=-1;
			Skeleton.__super.call(this);
			(aniMode===void 0)&& (aniMode=0);
			if (templet)this.init(templet,aniMode);
		}

		__class(Skeleton,'laya.ani.bone.Skeleton',_super);
		var __proto=Skeleton.prototype;
		/**
		*???????????????
		*0,????????????????????????????????????????????????????????????????????? ?????????????????????????????????????????????????????????
		*1,????????????????????????????????????????????????????????????????????????????????????????????? ??????????????????????????????????????????????????????
		*2,???????????????????????????????????? ???????????????????????????????????????????????????,??????????????????
		*@param templet ??????
		*@param aniMode ???????????????0:???????????????,1,2????????????
		*/
		__proto.init=function(templet,aniMode){
			(aniMode===void 0)&& (aniMode=0);
			var i=0,n=0;
			if (aniMode==1){
				this._graphicsCache=[];
				for (i=0,n=templet.getAnimationCount();i < n;i++){
					this._graphicsCache.push([]);
				}
			}
			this._yReverseMatrix=templet.yReverseMatrix;
			this._aniMode=aniMode;
			this._templet=templet;
			this._player=new AnimationPlayer();
			this._player.cacheFrameRate=templet.rate;
			this._player.templet=templet;
			this._player.play();
			this._parseSrcBoneMatrix();
			this._boneList=templet.mBoneArr;
			this._rootBone=templet.mRootBone;
			this._aniSectionDic=templet.aniSectionDic;
			if (templet.ikArr.length > 0){
				this._ikArr=[];
				for (i=0,n=templet.ikArr.length;i < n;i++){
					this._ikArr.push(new IkConstraint(templet.ikArr[i],this._boneList));
				}
			}
			if (templet.pathArr.length > 0){
				var tPathData;
				var tPathConstraint;
				if (this._pathDic==null)this._pathDic={};
				var tBoneSlot;
				for (i=0,n=templet.pathArr.length;i < n;i++){
					tPathData=templet.pathArr[i];
					tPathConstraint=new PathConstraint(tPathData,this._boneList);
					tBoneSlot=this._boneSlotDic[tPathData.name];
					if (tBoneSlot){
						tPathConstraint=new PathConstraint(tPathData,this._boneList);
						tPathConstraint.target=tBoneSlot;
					}
					this._pathDic[tPathData.name]=tPathConstraint;
				}
			}
			if (templet.tfArr.length > 0){
				this._tfArr=[];
				for (i=0,n=templet.tfArr.length;i < n;i++){
					this._tfArr.push(new TfConstraint(templet.tfArr[i],this._boneList));
				}
			}
			if (templet.skinDataArray.length > 0){
				var tSkinData=this._templet.skinDataArray[this._skinIndex];
				this._skinName=tSkinData.name;
			}
			this._player.on(/*laya.events.Event.PLAYED*/"played",this,this._onPlay);
			this._player.on(/*laya.events.Event.STOPPED*/"stopped",this,this._onStop);
			this._player.on(/*laya.events.Event.PAUSED*/"paused",this,this._onPause);
		}

		/**
		*??????????????????????????????
		*@param path ??????????????????????????????
		*@param complete ???????????????????????????
		*@param aniMode 0,?????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????? 1,????????????????????????????????????????????????????????????????????????????????????????????? ??????????????????????????????????????????????????????2,???????????????????????????????????????????????????????????????????????????????????????,??????????????????
		*/
		__proto.load=function(path,complete,aniMode){
			(aniMode===void 0)&& (aniMode=0);
			this._aniPath=path;
			this._complete=complete;
			this._loadAniMode=aniMode;
			this._texturePath=path.replace(".sk",".png").replace(".bin",".png");
			Laya.loader.load([{url:path,type:/*laya.net.Loader.BUFFER*/"arraybuffer"},{url:this._texturePath,type:/*laya.net.Loader.IMAGE*/"image"}],Handler.create(this,this._onLoaded));
		}

		/**
		*????????????
		*/
		__proto._onLoaded=function(){
			var tTexture=Loader.getRes(this._texturePath);
			var arraybuffer=Loader.getRes(this._aniPath);
			if (tTexture==null || arraybuffer==null)return;
			if (Templet.TEMPLET_DICTIONARY==null){
				Templet.TEMPLET_DICTIONARY={};
			};
			var tFactory;
			tFactory=Templet.TEMPLET_DICTIONARY[this._aniPath];
			if (tFactory){
				tFactory.isParseFail ? this._parseFail():this._parseComplete();
				}else {
				tFactory=new Templet();
				tFactory.url=this._aniPath;
				Templet.TEMPLET_DICTIONARY[this._aniPath]=tFactory;
				tFactory.on(/*laya.events.Event.COMPLETE*/"complete",this,this._parseComplete);
				tFactory.on(/*laya.events.Event.ERROR*/"error",this,this._parseFail);
				tFactory.parseData(tTexture,arraybuffer,60);
			}
		}

		/**
		*????????????
		*/
		__proto._parseComplete=function(){
			var tTemple=Templet.TEMPLET_DICTIONARY[this._aniPath];
			if (tTemple){
				this.init(tTemple,this._loadAniMode);
				this.play(0,true);
			}
			this._complete && this._complete.runWith(this);
		}

		/**
		*????????????
		*/
		__proto._parseFail=function(){
			console.log("[Error]:"+this._aniPath+"????????????");
		}

		/**
		*??????PLAY??????
		*/
		__proto._onPlay=function(){
			this.event(/*laya.events.Event.PLAYED*/"played");
		}

		/**
		*??????STOP??????
		*/
		__proto._onStop=function(){
			var tEventData;
			var tEventAniArr=this._templet.eventAniArr;
			var tEventArr=tEventAniArr[this._aniClipIndex];
			if (tEventArr && this._eventIndex < tEventArr.length){
				for (;this._eventIndex < tEventArr.length;this._eventIndex++){
					tEventData=tEventArr[this._eventIndex];
					if (tEventData.time >=this._player.playStart && tEventData.time <=this._player.playEnd){
						this.event(/*laya.events.Event.LABEL*/"label",tEventData);
					}
				}
			}
			this._eventIndex=0;
			this._drawOrder=null;
			this.event(/*laya.events.Event.STOPPED*/"stopped");
		}

		/**
		*??????PAUSE??????
		*/
		__proto._onPause=function(){
			this.event(/*laya.events.Event.PAUSED*/"paused");
		}

		/**
		*?????????????????????????????????????????????????????????
		*/
		__proto._parseSrcBoneMatrix=function(){
			var i=0,n=0;
			n=this._templet.srcBoneMatrixArr.length;
			for (i=0;i < n;i++){
				this._boneMatrixArray.push(new Matrix());
			}
			if (this._aniMode==0){
				this._boneSlotDic=this._templet.boneSlotDic;
				this._bindBoneBoneSlotDic=this._templet.bindBoneBoneSlotDic;
				this._boneSlotArray=this._templet.boneSlotArray;
				}else {
				if (this._boneSlotDic==null)this._boneSlotDic={};
				if (this._bindBoneBoneSlotDic==null)this._bindBoneBoneSlotDic={};
				if (this._boneSlotArray==null)this._boneSlotArray=[];
				var tArr=this._templet.boneSlotArray;
				var tBS;
				var tBSArr;
				for (i=0,n=tArr.length;i < n;i++){
					tBS=tArr[i];
					tBSArr=this._bindBoneBoneSlotDic[tBS.parent];
					if (tBSArr==null){
						this._bindBoneBoneSlotDic[tBS.parent]=tBSArr=[];
					}
					this._boneSlotDic[tBS.name]=tBS=tBS.copy();
					tBSArr.push(tBS);
					this._boneSlotArray.push(tBS);
				}
			}
		}

		/**
		*????????????
		*@param autoKey true??????????????????false???index????????????
		*/
		__proto._update=function(autoKey){
			(autoKey===void 0)&& (autoKey=true);
			if (this._pause)return;
			if (autoKey && this._indexControl){
				return;
			};
			var tCurrTime=Laya.timer.currTimer;
			if (autoKey){
				this._player.update(tCurrTime-this._lastTime)
			}
			this._lastTime=tCurrTime;
			this._aniClipIndex=this._player.currentAnimationClipIndex;
			this._clipIndex=this._player.currentKeyframeIndex;
			var tEventData;
			var tEventAniArr=this._templet.eventAniArr;
			var tEventArr=tEventAniArr[this._aniClipIndex];
			if (tEventArr && this._eventIndex < tEventArr.length){
				tEventData=tEventArr[this._eventIndex];
				if (tEventData.time >=this._player.playStart && tEventData.time <=this._player.playEnd){
					if (this._player.currentPlayTime >=tEventData.time){
						this.event(/*laya.events.Event.LABEL*/"label",tEventData);
						this._eventIndex++;
					}
					}else {
					this._eventIndex++;
				}
			}
			if (this._aniClipIndex==-1)return;
			var tGraphics;
			if (this._aniMode==0){
				tGraphics=this._templet.getGrahicsDataWithCache(this._aniClipIndex,this._clipIndex);
				if (tGraphics){
					if (this.graphics !=tGraphics){
						this.graphics=tGraphics;
					}
					return;
				}
				}else if (this._aniMode==1){
				tGraphics=this._getGrahicsDataWithCache(this._aniClipIndex,this._clipIndex);
				if (tGraphics){
					if (this.graphics !=tGraphics){
						this.graphics=tGraphics;
					}
					return;
				}
			}
			this._createGraphics();
		}

		/**
		*??????grahics??????
		*/
		__proto._createGraphics=function(){
			var tDrawOrderData;
			var tDrawOrderAniArr=this._templet.drawOrderAniArr;
			var tDrawOrderArr=tDrawOrderAniArr[this._aniClipIndex];
			if (tDrawOrderArr && tDrawOrderArr.length > 0){
				this._drawOrderIndex=0;
				tDrawOrderData=tDrawOrderArr[this._drawOrderIndex];
				while (this._player.currentPlayTime >=tDrawOrderData.time){
					this._drawOrder=tDrawOrderData.drawOrder;
					this._drawOrderIndex++;
					if (this._drawOrderIndex >=tDrawOrderArr.length){
						break ;
					}
					tDrawOrderData=tDrawOrderArr[this._drawOrderIndex];
				}
			};
			var tGraphics;
			if (this._aniMode==0 || this._aniMode==1){
				this.graphics=new GraphicsAni();
				}else {
				if ((this.graphics instanceof laya.ani.GraphicsAni )){
					this.graphics.clear();
					}else {
					this.graphics=new GraphicsAni();
				}
			}
			tGraphics=this.graphics;
			var bones=this._templet.getNodes(this._aniClipIndex);
			this._templet.getOriginalData(this._aniClipIndex,this._curOriginalData,this._player._fullFrames[this._aniClipIndex],this._clipIndex,this._player.currentFrameTime);
			var tSectionArr=this._aniSectionDic[this._aniClipIndex];
			var tParentMatrix;
			var tStartIndex=0;
			var i=0,j=0,k=0,n=0;
			var tDBBoneSlot;
			var tDBBoneSlotArr;
			var tParentTransform;
			var tSrcBone;
			var boneCount=this._templet.srcBoneMatrixArr.length;
			for (i=0,n=tSectionArr[0];i < boneCount;i++){
				tSrcBone=this._boneList[i];
				tParentTransform=this._templet.srcBoneMatrixArr[i];
				tSrcBone.resultTransform.scX=tParentTransform.scX *this._curOriginalData[tStartIndex++];
				tSrcBone.resultTransform.skX=tParentTransform.skX+this._curOriginalData[tStartIndex++];
				tSrcBone.resultTransform.skY=tParentTransform.skY+this._curOriginalData[tStartIndex++];
				tSrcBone.resultTransform.scY=tParentTransform.scY *this._curOriginalData[tStartIndex++];
				tSrcBone.resultTransform.x=tParentTransform.x+this._curOriginalData[tStartIndex++];
				tSrcBone.resultTransform.y=tParentTransform.y+this._curOriginalData[tStartIndex++];
			};
			var tSlotDic={};
			var tSlotAlphaDic={};
			var tBoneData;
			for (n+=tSectionArr[1];i < n;i++){
				tBoneData=bones[i];
				tSlotDic[tBoneData.name]=this._curOriginalData[tStartIndex++];
				tSlotAlphaDic[tBoneData.name]=this._curOriginalData[tStartIndex++];
				this._curOriginalData[tStartIndex++];
				this._curOriginalData[tStartIndex++];
				this._curOriginalData[tStartIndex++];
				this._curOriginalData[tStartIndex++];
			};
			var tBendDirectionDic={};
			var tMixDic={};
			for (n+=tSectionArr[2];i < n;i++){
				tBoneData=bones[i];
				tBendDirectionDic[tBoneData.name]=this._curOriginalData[tStartIndex++];
				tMixDic[tBoneData.name]=this._curOriginalData[tStartIndex++];
				this._curOriginalData[tStartIndex++];
				this._curOriginalData[tStartIndex++];
				this._curOriginalData[tStartIndex++];
			}
			if (this._pathDic){
				var tPathConstraint;
				for (n+=tSectionArr[3];i < n;i++){
					tBoneData=bones[i];
					tPathConstraint=this._pathDic[tBoneData.name];
					if (tPathConstraint){
						var tByte=new Byte(tBoneData.extenData);
						switch(tByte.getByte()){
							case 1:
								tPathConstraint.position=this._curOriginalData[tStartIndex++];
								break ;
							case 2:
								tPathConstraint.spacing=this._curOriginalData[tStartIndex++];
								break ;
							case 3:
								tPathConstraint.rotateMix=this._curOriginalData[tStartIndex++];
								tPathConstraint.translateMix=this._curOriginalData[tStartIndex++];
								break ;
							}
					}
				}
			}
			if (this._yReverseMatrix){
				this._rootBone.update(this._yReverseMatrix);
				}else {
				this._rootBone.update(Matrix.TEMP.identity());
			}
			if (this._ikArr){
				var tIkConstraint;
				for (i=0,n=this._ikArr.length;i < n;i++){
					tIkConstraint=this._ikArr[i];
					if (tBendDirectionDic.hasOwnProperty(tIkConstraint.name)){
						tIkConstraint.bendDirection=tBendDirectionDic[tIkConstraint.name];
					}
					if (tMixDic.hasOwnProperty(tIkConstraint.name)){
						tIkConstraint.mix=tMixDic[tIkConstraint.name]
					}
					tIkConstraint.apply();
				}
			}
			if (this._pathDic){
				for (var tPathStr in this._pathDic){
					tPathConstraint=this._pathDic[tPathStr];
					tPathConstraint.apply(this._boneList,tGraphics);
				}
			}
			if (this._tfArr){
				var tTfConstraint;
				for (i=0,k=this._tfArr.length;i < k;i++){
					tTfConstraint=this._tfArr[i];
					tTfConstraint.apply();
				}
			}
			for (i=0,k=this._boneList.length;i < k;i++){
				tSrcBone=this._boneList[i];
				tDBBoneSlotArr=this._bindBoneBoneSlotDic[tSrcBone.name];
				tSrcBone.resultMatrix.copyTo(this._boneMatrixArray[i]);
				if (tDBBoneSlotArr){
					for (j=0,n=tDBBoneSlotArr.length;j < n;j++){
						tDBBoneSlot=tDBBoneSlotArr[j];
						if (tDBBoneSlot){
							tDBBoneSlot.setParentMatrix(tSrcBone.resultMatrix);
						}
					}
				}
			};
			var tDeformDic={};
			var tDeformAniArr=this._templet.deformAniArr;
			var tDeformAniData;
			var tDeformSlotData;
			var tDeformSlotDisplayData;
			if (tDeformAniArr && tDeformAniArr.length > 0){
				if (this._lastAniClipIndex !=this._aniClipIndex){
					this._lastAniClipIndex=this._aniClipIndex;
					for (i=0,n=this._boneSlotArray.length;i < n;i++){
						tDBBoneSlot=this._boneSlotArray[i];
						tDBBoneSlot.deformData=null;
					}
				};
				var tSkinDeformAni=tDeformAniArr[this._aniClipIndex];
				tDeformAniData=tSkinDeformAni ["default"];
				if (tDeformAniData){
					for (i=0,n=tDeformAniData.deformSlotDataList.length;i < n;i++){
						tDeformSlotData=tDeformAniData.deformSlotDataList[i];
						for (j=0;j < tDeformSlotData.deformSlotDisplayList.length;j++){
							tDeformSlotDisplayData=tDeformSlotData.deformSlotDisplayList[j];
							tDBBoneSlot=this._boneSlotArray[tDeformSlotDisplayData.slotIndex];
							tDeformSlotDisplayData.apply(this._player.currentPlayTime,tDBBoneSlot);
							if (!tDeformDic[tDeformSlotDisplayData.slotIndex]){
								tDeformDic[tDeformSlotDisplayData.slotIndex]={};
							}
							tDeformDic[tDeformSlotDisplayData.slotIndex][tDeformSlotDisplayData.attachment]=tDeformSlotDisplayData.deformData;
						}
					}
				}
				tDeformAniData=tSkinDeformAni [this._skinName];
				if (tDeformAniData){
					for (i=0,n=tDeformAniData.deformSlotDataList.length;i < n;i++){
						tDeformSlotData=tDeformAniData.deformSlotDataList[i];
						for (j=0;j < tDeformSlotData.deformSlotDisplayList.length;j++){
							tDeformSlotDisplayData=tDeformSlotData.deformSlotDisplayList[j];
							tDBBoneSlot=this._boneSlotArray[tDeformSlotDisplayData.slotIndex];
							tDeformSlotDisplayData.apply(this._player.currentPlayTime,tDBBoneSlot);
							if (!tDeformDic[tDeformSlotDisplayData.slotIndex]){
								tDeformDic[tDeformSlotDisplayData.slotIndex]={};
							}
							tDeformDic[tDeformSlotDisplayData.slotIndex][tDeformSlotDisplayData.attachment]=tDeformSlotDisplayData.deformData;
						}
					}
				}
			};
			var tSlotData2;
			var tSlotData3;
			var tObject;
			if (this._drawOrder){
				for (i=0,n=this._drawOrder.length;i < n;i++){
					tDBBoneSlot=this._boneSlotArray[this._drawOrder[i]];
					tSlotData2=tSlotDic[tDBBoneSlot.name];
					tSlotData3=tSlotAlphaDic[tDBBoneSlot.name];
					if (!isNaN(tSlotData3)){
						tGraphics.save();
						tGraphics.alpha(tSlotData3);
					}
					if (!isNaN(tSlotData2)){
						if (this._templet.attachmentNames){
							tDBBoneSlot.showDisplayByName(this._templet.attachmentNames[tSlotData2]);
							}else {
							tDBBoneSlot.showDisplayByIndex(tSlotData2);
						}
					}
					if (tDeformDic[this._drawOrder[i]]){
						tObject=tDeformDic[this._drawOrder[i]];
						if (tDBBoneSlot.currDisplayData && tObject[tDBBoneSlot.currDisplayData.attachmentName]){
							tDBBoneSlot.deformData=tObject[tDBBoneSlot.currDisplayData.attachmentName];
							}else {
							tDBBoneSlot.deformData=null;
						}
						}else {
						tDBBoneSlot.deformData=null;
					}
					if (!isNaN(tSlotData3)){
						tDBBoneSlot.draw(tGraphics,this._boneMatrixArray,this._aniMode==2,tSlotData3);
						}else {
						tDBBoneSlot.draw(tGraphics,this._boneMatrixArray,this._aniMode==2);
					}
					if (!isNaN(tSlotData3)){
						tGraphics.restore();
					}
				}
				}else {
				for (i=0,n=this._boneSlotArray.length;i < n;i++){
					tDBBoneSlot=this._boneSlotArray[i];
					tSlotData2=tSlotDic[tDBBoneSlot.name];
					tSlotData3=tSlotAlphaDic[tDBBoneSlot.name];
					if (!isNaN(tSlotData3)){
						tGraphics.save();
						tGraphics.alpha(tSlotData3);
					}
					if (!isNaN(tSlotData2)){
						if (this._templet.attachmentNames){
							tDBBoneSlot.showDisplayByName(this._templet.attachmentNames[tSlotData2]);
							}else {
							tDBBoneSlot.showDisplayByIndex(tSlotData2);
						}
					}
					if (tDeformDic[i]){
						tObject=tDeformDic[i];
						if (tDBBoneSlot.currDisplayData && tObject[tDBBoneSlot.currDisplayData.attachmentName]){
							tDBBoneSlot.deformData=tObject[tDBBoneSlot.currDisplayData.attachmentName];
							}else {
							tDBBoneSlot.deformData=null;
						}
						}else {
						tDBBoneSlot.deformData=null;
					}
					if (!isNaN(tSlotData3)){
						tDBBoneSlot.draw(tGraphics,this._boneMatrixArray,this._aniMode==2,tSlotData3);
						}else {
						tDBBoneSlot.draw(tGraphics,this._boneMatrixArray,this._aniMode==2);
					}
					if (!isNaN(tSlotData3)){
						tGraphics.restore();
					}
				}
			}
			if (this._aniMode==0){
				this._templet.setGrahicsDataWithCache(this._aniClipIndex,this._clipIndex,tGraphics);
				}else if (this._aniMode==1){
				this._setGrahicsDataWithCache(this._aniClipIndex,this._clipIndex,tGraphics);
			}
		}

		/**
		*???????????????????????????
		*@return
		*/
		__proto.getAnimNum=function(){
			return this._templet.getAnimationCount();
		}

		/**
		*???????????????????????????
		*@param index ???????????????
		*/
		__proto.getAniNameByIndex=function(index){
			return this._templet.getAniNameByIndex(index);
		}

		/**
		*?????????????????????????????????
		*@param name ???????????????
		*@return
		*/
		__proto.getSlotByName=function(name){
			return this._boneSlotDic[name];
		}

		/**
		*??????????????????????????????
		*@param name ???????????????
		*/
		__proto.showSkinByName=function(name){
			this.showSkinByIndex(this._templet.getSkinIndexByName(name));
		}

		/**
		*??????????????????????????????
		*@param skinIndex ????????????
		*/
		__proto.showSkinByIndex=function(skinIndex){
			for (var i=0;i < this._boneSlotArray.length;i++){
				(this._boneSlotArray [i]).showSlotData(null);
			}
			if (this._templet.showSkinByIndex(this._boneSlotDic,skinIndex)){
				var tSkinData=this._templet.skinDataArray[skinIndex];
				this._skinIndex=skinIndex;
				this._skinName=tSkinData.name;
			}
			this._clearCache();
		}

		/**
		*????????????????????????
		*@param slotName ????????????
		*@param index ?????????????????????
		*/
		__proto.showSlotSkinByIndex=function(slotName,index){
			if (this._aniMode==0)return;
			var tBoneSlot=this.getSlotByName(slotName);
			if (tBoneSlot){
				tBoneSlot.showDisplayByIndex(index);
			}
			this._clearCache();
		}

		/**
		*?????????????????????
		*@param name ???????????????
		*@param texture ??????????????????
		*/
		__proto.setSlotSkin=function(slotName,texture){
			if (this._aniMode==0)return;
			var tBoneSlot=this.getSlotByName(slotName);
			if (tBoneSlot){
				tBoneSlot.replaceSkin(texture);
			}
			this._clearCache();
		}

		/**
		*??????????????????????????????????????????
		*/
		__proto._clearCache=function(){
			if (this._aniMode==1){
				for (var i=0,n=this._graphicsCache.length;i < n;i++){
					this._graphicsCache[i].length=0;
				}
			}
		}

		/**
		*????????????
		*@param nameOrIndex ????????????????????????
		*@param loop ??????????????????
		*@param force false,???????????????????????????????????????????????????,true,????????????
		*@param start ????????????
		*@param end ????????????
		*/
		__proto.play=function(nameOrIndex,loop,force,start,end){
			(force===void 0)&& (force=true);
			(start===void 0)&& (start=0);
			(end===void 0)&& (end=0);
			this._indexControl=false;
			var index=-1;
			var duration=NaN;
			if (loop){
				duration=2147483647;
				}else {
				duration=0;
			}
			if ((typeof nameOrIndex=='string')){
				for (var i=0,n=this._templet.getAnimationCount();i < n;i++){
					var animation=this._templet.getAnimation(i);
					if (animation && nameOrIndex==animation.name){
						index=i;
						break ;
					}
				}
				}else {
				index=nameOrIndex;
			}
			if (index >-1 && index < this.getAnimNum()){
				if (force || this._pause || this._currAniIndex !=index){
					this._currAniIndex=index;
					this._curOriginalData=new Float32Array(this._templet.getTotalkeyframesLength(index));
					this._drawOrder=null;
					this._eventIndex=0;
					this._player.play(index,this._player.playbackRate,duration,start,end);
					this._templet.showSkinByIndex(this._boneSlotDic,this._skinIndex);
					if (this._pause){
						this._pause=false;
						this._lastTime=Browser.now();
						Laya.stage.frameLoop(1,this,this._update,null,true);
					}
				}
			}
		}

		/**
		*????????????
		*/
		__proto.stop=function(){
			if (!this._pause){
				this._pause=true;
				if (this._player){
					this._player.stop(true);
				}
				Laya.timer.clear(this,this._update);
			}
		}

		/**
		*????????????????????????
		*@param value 1???????????????
		*/
		__proto.playbackRate=function(value){
			if (this._player){
				this._player.playbackRate=value;
			}
		}

		/**
		*?????????????????????
		*/
		__proto.paused=function(){
			if (!this._pause){
				this._pause=true;
				if (this._player){
					this._player.paused=true;
				}
				Laya.timer.clear(this,this._update);
			}
		}

		/**
		*?????????????????????
		*/
		__proto.resume=function(){
			this._indexControl=false;
			if (this._pause){
				this._pause=false;
				if (this._player){
					this._player.paused=false;
				}
				this._lastTime=Browser.now();
				Laya.stage.frameLoop(1,this,this._update,null,true);
			}
		}

		/**
		*@private
		*??????????????????
		*@param aniIndex
		*@param frameIndex
		*@return
		*/
		__proto._getGrahicsDataWithCache=function(aniIndex,frameIndex){
			return this._graphicsCache[aniIndex][frameIndex];
		}

		/**
		*@private
		*????????????grahpics
		*@param aniIndex
		*@param frameIndex
		*@param graphics
		*/
		__proto._setGrahicsDataWithCache=function(aniIndex,frameIndex,graphics){
			this._graphicsCache[aniIndex][frameIndex]=graphics;
		}

		/**
		*??????????????????
		*/
		__proto.destroy=function(destroyChild){
			(destroyChild===void 0)&& (destroyChild=true);
			_super.prototype.destroy.call(this,destroyChild);
			this._templet=null;
			this._player.offAll();
			this._player=null;
			this._curOriginalData=null;
			this._boneMatrixArray.length=0;
			this._lastTime=0;
			Laya.timer.clear(this,this._update);
		}

		/**
		*??????????????????
		*/
		/**
		*???????????????URL
		*/
		__getset(0,__proto,'url',function(){
			return this._aniPath;
			},function(path){
			this.load(path);
		});

		/**
		*@private
		*???????????????
		*/
		/**
		*@private
		*???????????????
		*/
		__getset(0,__proto,'index',function(){
			return this._index;
			},function(value){
			if (this.player){
				this._index=value;
				this._player.currentTime=this._index *1000 / this._player.cacheFrameRate;
				this._indexControl=true;
				this._update(false);
			}
		});

		/**
		*??????????????????
		*/
		__getset(0,__proto,'total',function(){
			if (this._templet && this._player){
				this._total=Math.floor(this._templet.getAniDuration(this._player.currentAnimationClipIndex)/ 1000 *this._player.cacheFrameRate);
				}else {
				this._total=-1;
			}
			return this._total;
		});

		/**
		*????????????????????????
		*/
		__getset(0,__proto,'player',function(){
			return this._player;
		});

		return Skeleton;
	})(Sprite)


	/**
	*<p> <code>MovieClip</code> ???????????????????????????????????? swf ?????????</p>
	*/
	//class laya.ani.swf.MovieClip extends laya.display.Sprite
	var MovieClip=(function(_super){
		function MovieClip(parentMovieClip){
			this._start=0;
			this._Pos=0;
			this._data=null;
			this._curIndex=0;
			this._preIndex=0;
			this._playIndex=0;
			this._playing=false;
			this._ended=true;
			this._count=0;
			this._ids=null;
			this._loadedImage={};
			this._idOfSprite=null;
			this._parentMovieClip=null;
			this._movieClipList=null;
			this._labels=null;
			this.basePath=null;
			this._atlasPath=null;
			this._url=null;
			this._isRoot=false;
			this.interval=30;
			this.loop=false;
			MovieClip.__super.call(this);
			this._ids={};
			this._idOfSprite=[];
			this._reset();
			this._playing=false;
			this._parentMovieClip=parentMovieClip;
			if (!parentMovieClip){
				this._movieClipList=[this];
				this._isRoot=true;
				}else {
				this._isRoot=false;
				this._movieClipList=parentMovieClip._movieClipList;
				this._movieClipList.push(this);
			}
		}

		__class(MovieClip,'laya.ani.swf.MovieClip',_super);
		var __proto=MovieClip.prototype;
		/**
		*<p>???????????????????????????????????????Texture</p>
		*@param destroyChild ???????????????????????????????????????true,????????????????????????????????????????????????
		*/
		__proto.destroy=function(destroyChild){
			(destroyChild===void 0)&& (destroyChild=true);
			this._clear();
			_super.prototype.destroy.call(this,destroyChild);
		}

		/**@private */
		__proto._setDisplay=function(value){
			_super.prototype._setDisplay.call(this,value);
			if (this._isRoot){
				this._$3__onDisplay();
			}
		}

		/**@private */
		__proto._$3__onDisplay=function(){
			if (this._displayedInStage)Laya.timer.loop(this.interval,this,this.updates,null,true);
			else Laya.timer.clear(this,this.updates);
		}

		/**@private ???????????????*/
		__proto.updates=function(){
			if (this._parentMovieClip)return;
			var i=0,len=0;
			len=this._movieClipList.length;
			for (i=0;i < len;i++){
				this._movieClipList[i]&&this._movieClipList[i]._update();
			}
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
			else if (!this._labels){
				for (var name in this._labels){
					if (this._labels[name]===label){
						delete this._labels[name];
						break ;
					}
				}
			}
		}

		/**
		*@private
		*?????????????????????????????????
		*/
		__proto._update=function(){
			if (!this._data)return;
			if (!this._playing)return;
			this._playIndex++;
			if (this._playIndex >=this._count){
				if (!this.loop){
					this._playIndex--;
					this.stop();
					return;
				}
				this._playIndex=0;
			}
			this._parse(this._playIndex);
			if (this._labels && this._labels[this._playIndex])this.event(/*laya.events.Event.LABEL*/"label",this._labels[this._playIndex]);
		}

		/**
		*?????????????????????
		*/
		__proto.stop=function(){
			this._playing=false;
		}

		/**
		*????????????????????????????????????
		*@param frame ???????????????
		*/
		__proto.gotoAndStop=function(index){
			this.index=index;
			this.stop();
		}

		/**
		*@private
		*?????????
		*/
		__proto._clear=function(){
			this.stop();
			this._idOfSprite.length=0;
			if (!this._parentMovieClip){
				Laya.timer.clear(this,this.updates);
				var i=0,len=0;
				len=this._movieClipList.length;
				for (i=0;i < len;i++){
					if (this._movieClipList[i] !=this)
						this._movieClipList[i]._clear();
				}
				this._movieClipList.length=0;
			};
			var key;
			for (key in this._loadedImage){
				if (this._loadedImage[key]){
					Loader.clearRes(key);
					this._loadedImage[key]=false;
				}
			}
			this.removeChildren();
			this.graphics=null;
			this._parentMovieClip=null;
		}

		/**
		*???????????????
		*@param index ????????????
		*/
		__proto.play=function(index,loop){
			(index===void 0)&& (index=0);
			(loop===void 0)&& (loop=true);
			this.loop=loop;
			this._playing=true;
			if (this._data)
				this._displayFrame(index);
		}

		/**@private */
		__proto._displayFrame=function(frameIndex){
			(frameIndex===void 0)&& (frameIndex=-1);
			if (frameIndex !=-1){
				if (this._curIndex > frameIndex)this._reset();
				this._parse(frameIndex);
			}
		}

		/**@private */
		__proto._reset=function(rm){
			(rm===void 0)&& (rm=true);
			if (rm && this._curIndex !=1)this.removeChildren();
			this._preIndex=this._curIndex=-1;
			this._Pos=this._start;
		}

		/**@private */
		__proto._parse=function(frameIndex){
			var curChild=this;
			var mc,sp,key=0,type=0,tPos=0,ttype=0,ifAdd=false;
			var _idOfSprite=this._idOfSprite,_data=this._data,eStr;
			if (this._ended)this._reset();
			_data.pos=this._Pos;
			this._ended=false;
			this._playIndex=frameIndex;
			if (this._curIndex > frameIndex&&frameIndex<this._preIndex){
				this._reset(true);
				_data.pos=this._Pos;
			}
			while ((this._curIndex <=frameIndex)&& (!this._ended)){
				type=_data.getUint16();
				switch (type){
					case 12:
						key=_data.getUint16();
						tPos=this._ids[_data.getUint16()];
						this._Pos=_data.pos;
						_data.pos=tPos;
						if ((ttype=_data.getUint8())==0){
							var pid=_data.getUint16();
							sp=_idOfSprite[key]
							if (!sp){
								sp=_idOfSprite[key]=new Sprite();
								var spp=new Sprite();
								spp.loadImage(this.basePath+pid+".png");
								this._loadedImage[this.basePath+pid+".png"]=true;
								sp.addChild(spp);
								spp.size(_data.getFloat32(),_data.getFloat32());
								var mat=_data._getMatrix();
								spp.transform=mat;
							}
							sp.alpha=1;
							}else if (ttype==1){
							mc=_idOfSprite[key]
							if (!mc){
								_idOfSprite[key]=mc=new MovieClip(this);
								mc.interval=this.interval;
								mc._ids=this._ids;
								mc.basePath=this.basePath;
								mc._setData(_data,tPos);
								mc._initState();
								mc.play(0);
							}
							mc.alpha=1;
						}
						_data.pos=this._Pos;
						break ;
					case 3:
						(this.addChild(_idOfSprite[ _data.getUint16()])).zOrder=_data.getUint16();
						ifAdd=true;
						break ;
					case 4:
						_idOfSprite[ _data.getUint16()].removeSelf();
						break ;
					case 5:
						_idOfSprite[_data.getUint16()][MovieClip._ValueList[_data.getUint16()]]=(_data.getFloat32());
						break ;
					case 6:
						_idOfSprite[_data.getUint16()].visible=(_data.getUint8()> 0);
						break ;
					case 7:
						sp=_idOfSprite[ _data.getUint16()];
						var mt=sp.transform || Matrix.create();
						mt.setTo(_data.getFloat32(),_data.getFloat32(),_data.getFloat32(),_data.getFloat32(),_data.getFloat32(),_data.getFloat32());
						sp.transform=mt;
						break ;
					case 8:
						_idOfSprite[_data.getUint16()].setPos(_data.getFloat32(),_data.getFloat32());
						break ;
					case 9:
						_idOfSprite[_data.getUint16()].setSize(_data.getFloat32(),_data.getFloat32());
						break ;
					case 10:
						_idOfSprite[ _data.getUint16()].alpha=_data.getFloat32();
						break ;
					case 11:
						_idOfSprite[_data.getUint16()].setScale(_data.getFloat32(),_data.getFloat32());
						break ;
					case 98:
						eStr=_data.getString();
						this.event(eStr);
						if (eStr=="stop")this.stop();
						break ;
					case 99:
						this._curIndex=_data.getUint16();
						ifAdd && this.updateZOrder();
						break ;
					case 100:
						this._count=this._curIndex+1;
						this._ended=true;
						if (this._playing){
							this.event(/*laya.events.Event.FRAME*/"enterframe");
							this.event(/*laya.events.Event.END*/"end");
							this.event(/*laya.events.Event.COMPLETE*/"complete");
						}
						this._reset(false);
						break ;
					}
			}
			if (this._playing&&!this._ended)this.event(/*laya.events.Event.FRAME*/"enterframe");
			this._Pos=_data.pos;
		}

		/**@private */
		__proto._setData=function(data,start){
			this._data=data;
			this._start=start+3;
		}

		/**
		*???????????????
		*@param url swf ???????????????
		*@param atlas ????????????????????????
		*@param atlasPath ??????????????????????????????swf???????????????
		*/
		__proto.load=function(url,atlas,atlasPath){
			(atlas===void 0)&& (atlas=false);
			this._url=url=URL.formatURL(url);
			if(atlas)this._atlasPath=atlasPath?atlasPath:url.split(".swf")[0]+".json";
			this.stop();
			this._clear();
			this._movieClipList=[this];
			var urls;
			urls=[ {url:url,type:/*laya.net.Loader.BUFFER*/"arraybuffer" }];
			if (this._atlasPath){
				urls.push({url:this._atlasPath,type:/*laya.net.Loader.ATLAS*/"atlas" });
			}
			Laya.loader.load(urls,Handler.create(this,this._onLoaded));
		}

		/**@private */
		__proto._onLoaded=function(){
			this.basePath=this._atlasPath?Loader.getAtlas(this._atlasPath).dir:this._url.split(".swf")[0]+"/image/";
			var data;
			data=Loader.getRes(this._url);
			if (!data)return;
			this._initData(data);
		}

		/**@private */
		__proto._initState=function(){
			this._reset();
			this._ended=false;
			var preState=this._playing;
			this._playing=false;
			this._curIndex=0;
			while (!this._ended)this._parse(++this._curIndex);
			this._playing=preState;
		}

		/**@private */
		__proto._initData=function(data){
			this._data=new Byte(data);
			var i=0,len=this._data.getUint16();
			for (i=0;i < len;i++)this._ids[this._data.getInt16()]=this._data.getInt32();
			this.interval=1000 / this._data.getUint16();
			this._setData(this._data,this._ids[32767]);
			this._initState();
			this.play(0);
			this.event(/*laya.events.Event.LOADED*/"loaded");
			if (!this._parentMovieClip)Laya.timer.loop(this.interval,this,this.updates,null,true);
		}

		/**?????????????????????*/
		__getset(0,__proto,'index',function(){
			return this._playIndex;
			},function(value){
			this._playIndex=value;
			if (this._data)
				this._displayFrame(this._playIndex);
			if (this._labels && this._labels[value])this.event(/*laya.events.Event.LABEL*/"label",this._labels[value]);
		});

		/**
		*????????????
		*/
		__getset(0,__proto,'count',function(){
			return this._count;
		});

		/**
		*??????????????????
		*/
		__getset(0,__proto,'playing',function(){
			return this._playing;
		});

		/**
		*???????????????
		*/
		__getset(0,__proto,'url',null,function(path){
			this.load(path);
		});

		MovieClip._ValueList=["x","y","width","height","scaleX","scaleY","rotation","alpha"];
		return MovieClip;
	})(Sprite)


	/**
	*???????????????
	*/
	//class laya.ani.bone.Templet extends laya.ani.AnimationTemplet
	var Templet=(function(_super){
		function Templet(){
			this._mainTexture=null;
			this._textureJson=null;
			this._graphicsCache=[];
			this.srcBoneMatrixArr=[];
			this.ikArr=[];
			this.tfArr=[];
			this.pathArr=[];
			this.boneSlotDic={};
			this.bindBoneBoneSlotDic={};
			this.boneSlotArray=[];
			this.skinDataArray=[];
			this.skinDic={};
			this.subTextureDic={};
			this.isParseFail=false;
			this.url=null;
			this.yReverseMatrix=null;
			this.drawOrderAniArr=[];
			this.eventAniArr=[];
			this.attachmentNames=null;
			this.deformAniArr=[];
			this._rate=60;
			this.aniSectionDic={};
			this._skBufferUrl=null;
			this._textureDic={};
			this._loadList=null;
			this._path=null;
			this.mRootBone=null;
			Templet.__super.call(this);
			this.skinSlotDisplayDataArr=[];
			this.mBoneArr=[];
		}

		__class(Templet,'laya.ani.bone.Templet',_super);
		var __proto=Templet.prototype;
		__proto.loadAni=function(url){
			this._skBufferUrl=url;
			Laya.loader.load(url,Handler.create(this,this.onComplete),null,/*laya.net.Loader.BUFFER*/"arraybuffer");
		}

		__proto.onComplete=function(content){
			var tSkBuffer=Loader.getRes(this._skBufferUrl);
			this._path=this._skBufferUrl.slice(0,this._skBufferUrl.lastIndexOf("/"))+"/";
			this.parseData(null,tSkBuffer);
		}

		/**
		*????????????????????????
		*@param texture ???????????????????????????
		*@param skeletonData ???????????????????????????????????????
		*@param playbackRate ???????????????????????????????????????????????????
		*/
		__proto.parseData=function(texture,skeletonData,playbackRate){
			(playbackRate===void 0)&& (playbackRate=60);
			this._mainTexture=texture;
			if (this._mainTexture){
				if (Render.isWebGL && texture.bitmap){
					texture.bitmap.enableMerageInAtlas=false;
				}
			}
			this._rate=playbackRate;
			this.parse(skeletonData);
		}

		/**
		*????????????
		*0,????????????????????????????????????????????????????????????????????? ?????????????????????????????????????????????????????????
		*1,????????????????????????????????????????????????????????????????????????????????????????????? ??????????????????????????????????????????????????????
		*2,???????????????????????????????????? ???????????????????????????????????????????????????,??????????????????
		*@param aniMode 0 ???????????????0:???????????????,1,2????????????
		*@return
		*/
		__proto.buildArmature=function(aniMode){
			(aniMode===void 0)&& (aniMode=0);
			return new Skeleton(this,aniMode);
		}

		/**
		*@private
		*????????????
		*@param data ????????????????????????
		*@param playbackRate ??????
		*/
		__proto.parse=function(data){
			_super.prototype.parse.call(this,data);
			this._endLoaded();
			if (this._aniVersion !=AnimationTemplet.LAYA_ANIMATION_VISION){
				console.log("[Error] ???????????????????????????IDE?????????1.5.3???????????????");
				this._loaded=false;
			}
			if (this._loaded){
				if (this._mainTexture){
					this._parsePublicExtData();
					}else {
					this._parseTexturePath();
				}
				}else {
				this.event(/*laya.events.Event.ERROR*/"error",this);
				this.isParseFail=true;
			}
		}

		__proto._parseTexturePath=function(){
			var i=0;
			this._loadList=[];
			var tByte=new Byte(this.getPublicExtData());
			var tX=0,tY=0,tWidth=0,tHeight=0;
			var tFrameX=0,tFrameY=0,tFrameWidth=0,tFrameHeight=0;
			var tTempleData=0;
			var tTextureLen=tByte.getUint8();
			var tTextureName=tByte.readUTFString();
			var tTextureNameArr=tTextureName.split("\n");
			var tTexture;
			var tSrcTexturePath;
			for (i=0;i < tTextureLen;i++){
				tSrcTexturePath=this._path+tTextureNameArr[i *2];
				tTextureName=tTextureNameArr[i *2+1];
				tX=tByte.getFloat32();
				tY=tByte.getFloat32();
				tWidth=tByte.getFloat32();
				tHeight=tByte.getFloat32();
				tTempleData=tByte.getFloat32();
				tFrameX=isNaN(tTempleData)? 0 :tTempleData;
				tTempleData=tByte.getFloat32();
				tFrameY=isNaN(tTempleData)? 0 :tTempleData;
				tTempleData=tByte.getFloat32();
				tFrameWidth=isNaN(tTempleData)? tWidth :tTempleData;
				tTempleData=tByte.getFloat32();
				tFrameHeight=isNaN(tTempleData)? tHeight :tTempleData;
				if (this._loadList.indexOf(tSrcTexturePath)==-1){
					this._loadList.push(tSrcTexturePath);
				}
			}
			Laya.loader.load(this._loadList,Handler.create(this,this._textureComplete));
		}

		/**
		*??????????????????
		*/
		__proto._textureComplete=function(){
			var tTexture;
			var tTextureName;
			for (var i=0,n=this._loadList.length;i < n;i++){
				tTextureName=this._loadList[i];
				tTexture=this._textureDic[tTextureName]=Loader.getRes(tTextureName);
				if (Render.isWebGL && tTexture && tTexture.bitmap){
					tTexture.bitmap.enableMerageInAtlas=false;
				}
			}
			this._parsePublicExtData();
		}

		/**
		*?????????????????????
		*/
		__proto._parsePublicExtData=function(){
			var i=0,j=0,k=0,l=0,n=0;
			for (i=0,n=this.getAnimationCount();i < n;i++){
				this._graphicsCache.push([]);
			};
			var tByte=new Byte(this.getPublicExtData());
			var tX=0,tY=0,tWidth=0,tHeight=0;
			var tFrameX=0,tFrameY=0,tFrameWidth=0,tFrameHeight=0;
			var tTempleData=0;
			var tTextureLen=tByte.getUint8();
			var tTextureName=tByte.readUTFString();
			var tTextureNameArr=tTextureName.split("\n");
			var tTexture;
			var tSrcTexturePath;
			for (i=0;i < tTextureLen;i++){
				tTexture=this._mainTexture;
				tSrcTexturePath=this._path+tTextureNameArr[i *2];
				tTextureName=tTextureNameArr[i *2+1];
				if (this._mainTexture==null){
					tTexture=this._textureDic[tSrcTexturePath];
				}
				tX=tByte.getFloat32();
				tY=tByte.getFloat32();
				tWidth=tByte.getFloat32();
				tHeight=tByte.getFloat32();
				tTempleData=tByte.getFloat32();
				tFrameX=isNaN(tTempleData)? 0 :tTempleData;
				tTempleData=tByte.getFloat32();
				tFrameY=isNaN(tTempleData)? 0 :tTempleData;
				tTempleData=tByte.getFloat32();
				tFrameWidth=isNaN(tTempleData)? tWidth :tTempleData;
				tTempleData=tByte.getFloat32();
				tFrameHeight=isNaN(tTempleData)? tHeight :tTempleData;
				this.subTextureDic[tTextureName]=Texture.create(tTexture,tX,tY,tWidth,tHeight,-tFrameX,-tFrameY,tFrameWidth,tFrameHeight);
			}
			this._mainTexture=tTexture;
			var tAniCount=tByte.getUint16();
			var tSectionArr;
			for (i=0;i < tAniCount;i++){
				tSectionArr=[];
				tSectionArr.push(tByte.getUint16());
				tSectionArr.push(tByte.getUint16());
				tSectionArr.push(tByte.getUint16());
				tSectionArr.push(tByte.getUint16());
				this.aniSectionDic[i]=tSectionArr;
			};
			var tBone;
			var tParentBone;
			var tName;
			var tParentName;
			var tBoneLen=tByte.getInt16();
			var tBoneDic={};
			var tRootBone;
			for (i=0;i < tBoneLen;i++){
				tBone=new Bone();
				if (i==0){
					tRootBone=tBone;
					}else {
					tBone.root=tRootBone;
				}
				tName=tByte.readUTFString();
				tParentName=tByte.readUTFString();
				tBone.length=tByte.getFloat32();
				if (tByte.getByte()==1){
					tBone.inheritRotation=false;
				}
				if (tByte.getByte()==1){
					tBone.inheritScale=false;
				}
				tBone.name=tName;
				if (tParentName){
					tParentBone=tBoneDic[tParentName];
					if (tParentBone){
						tParentBone.addChild(tBone);
						}else {
						this.mRootBone=tBone;
					}
				}
				tBoneDic[tName]=tBone;
				this.mBoneArr.push(tBone);
			};
			var tMatrixDataLen=tByte.getUint16();
			var tLen=tByte.getUint16();
			var parentIndex=0;
			var boneLength=Math.floor(tLen / tMatrixDataLen);
			var tResultTransform;
			var tMatrixArray=this.srcBoneMatrixArr;
			for (i=0;i < boneLength;i++){
				tResultTransform=new Transform();
				tResultTransform.scX=tByte.getFloat32();
				tResultTransform.skX=tByte.getFloat32();
				tResultTransform.skY=tByte.getFloat32();
				tResultTransform.scY=tByte.getFloat32();
				tResultTransform.x=tByte.getFloat32();
				tResultTransform.y=tByte.getFloat32();
				tMatrixArray.push(tResultTransform);
				tBone=this.mBoneArr[i];
				tBone.transform=tResultTransform;
			};
			var tIkConstraintData;
			var tIkLen=tByte.getUint16();
			var tIkBoneLen=0;
			for (i=0;i < tIkLen;i++){
				tIkConstraintData=new IkConstraintData();
				tIkBoneLen=tByte.getUint16();
				for (j=0;j < tIkBoneLen;j++){
					tIkConstraintData.boneNames.push(tByte.readUTFString());
					tIkConstraintData.boneIndexs.push(tByte.getInt16());
				}
				tIkConstraintData.name=tByte.readUTFString();
				tIkConstraintData.targetBoneName=tByte.readUTFString();
				tIkConstraintData.targetBoneIndex=tByte.getInt16();
				tIkConstraintData.bendDirection=tByte.getFloat32();
				tIkConstraintData.mix=tByte.getFloat32();
				this.ikArr.push(tIkConstraintData);
			};
			var tTfConstraintData;
			var tTfLen=tByte.getUint16();
			var tTfBoneLen=0;
			for (i=0;i < tTfLen;i++){
				tTfConstraintData=new TfConstraintData();
				tTfBoneLen=tByte.getUint16();
				for (j=0;j < tTfBoneLen;j++){
					tTfConstraintData.boneIndexs.push(tByte.getInt16());
				}
				tTfConstraintData.name=tByte.getUTFString();
				tTfConstraintData.targetIndex=tByte.getInt16();
				tTfConstraintData.rotateMix=tByte.getFloat32();
				tTfConstraintData.translateMix=tByte.getFloat32();
				tTfConstraintData.scaleMix=tByte.getFloat32();
				tTfConstraintData.shearMix=tByte.getFloat32();
				tTfConstraintData.offsetRotation=tByte.getFloat32();
				tTfConstraintData.offsetX=tByte.getFloat32();
				tTfConstraintData.offsetY=tByte.getFloat32();
				tTfConstraintData.offsetScaleX=tByte.getFloat32();
				tTfConstraintData.offsetScaleY=tByte.getFloat32();
				tTfConstraintData.offsetShearY=tByte.getFloat32();
				this.tfArr.push(tTfConstraintData);
			};
			var tPathConstraintData;
			var tPathLen=tByte.getUint16();
			var tPathBoneLen=0;
			for (i=0;i < tPathLen;i++){
				tPathConstraintData=new PathConstraintData();
				tPathConstraintData.name=tByte.readUTFString();
				tPathBoneLen=tByte.getUint16();
				for (j=0;j < tPathBoneLen;j++){
					tPathConstraintData.bones.push(tByte.getInt16());
				}
				tPathConstraintData.target=tByte.readUTFString();
				tPathConstraintData.positionMode=tByte.readUTFString();
				tPathConstraintData.spacingMode=tByte.readUTFString();
				tPathConstraintData.rotateMode=tByte.readUTFString();
				tPathConstraintData.offsetRotation=tByte.getFloat32();
				tPathConstraintData.position=tByte.getFloat32();
				tPathConstraintData.spacing=tByte.getFloat32();
				tPathConstraintData.rotateMix=tByte.getFloat32();
				tPathConstraintData.translateMix=tByte.getFloat32();
				this.pathArr.push(tPathConstraintData);
			};
			var tDeformSlotLen=0;
			var tDeformSlotDisplayLen=0;
			var tDSlotIndex=0;
			var tDAttachment;
			var tDeformTimeLen=0;
			var tDTime=NaN;
			var tDeformVecticesLen=0;
			var tDeformAniData;
			var tDeformSlotData;
			var tDeformSlotDisplayData;
			var tDeformVectices;
			var tDeformAniLen=tByte.getInt16();
			for (i=0;i < tDeformAniLen;i++){
				var tDeformSkinLen=tByte.getUint8();
				var tSkinDic={};
				this.deformAniArr.push(tSkinDic);
				for (var f=0;f < tDeformSkinLen;f++){
					tDeformAniData=new DeformAniData();
					tDeformAniData.skinName=tByte.getUTFString();
					tSkinDic[tDeformAniData.skinName]=tDeformAniData;
					tDeformSlotLen=tByte.getInt16();
					for (j=0;j < tDeformSlotLen;j++){
						tDeformSlotData=new DeformSlotData();
						tDeformAniData.deformSlotDataList.push(tDeformSlotData);
						tDeformSlotDisplayLen=tByte.getInt16();
						for (k=0;k < tDeformSlotDisplayLen;k++){
							tDeformSlotDisplayData=new DeformSlotDisplayData();
							tDeformSlotData.deformSlotDisplayList.push(tDeformSlotDisplayData);
							tDeformSlotDisplayData.slotIndex=tDSlotIndex=tByte.getInt16();
							tDeformSlotDisplayData.attachment=tDAttachment=tByte.getUTFString();
							tDeformTimeLen=tByte.getInt16();
							for (l=0;l < tDeformTimeLen;l++){
								if (tByte.getByte()==1){
									tDeformSlotDisplayData.tweenKeyList.push(true);
									}else {
									tDeformSlotDisplayData.tweenKeyList.push(false);
								}
								tDTime=tByte.getFloat32();
								tDeformSlotDisplayData.timeList.push(tDTime);
								tDeformVectices=[];
								tDeformSlotDisplayData.vectices.push(tDeformVectices);
								tDeformVecticesLen=tByte.getInt16();
								for (n=0;n < tDeformVecticesLen;n++){
									tDeformVectices.push(tByte.getFloat32());
								}
							}
						}
					}
				}
			};
			var tDrawOrderArr;
			var tDrawOrderAniLen=tByte.getInt16();
			var tDrawOrderLen=0;
			var tDrawOrderData;
			var tDoLen=0;
			for (i=0;i < tDrawOrderAniLen;i++){
				tDrawOrderLen=tByte.getInt16();
				tDrawOrderArr=[];
				for (j=0;j < tDrawOrderLen;j++){
					tDrawOrderData=new DrawOrderData();
					tDrawOrderData.time=tByte.getFloat32();
					tDoLen=tByte.getInt16();
					for (k=0;k < tDoLen;k++){
						tDrawOrderData.drawOrder.push(tByte.getInt16());
					}
					tDrawOrderArr.push(tDrawOrderData);
				}
				this.drawOrderAniArr.push(tDrawOrderArr);
			};
			var tEventArr;
			var tEventAniLen=tByte.getInt16();
			var tEventLen=0;
			var tEventData;
			for (i=0;i < tEventAniLen;i++){
				tEventLen=tByte.getInt16();
				tEventArr=[];
				for (j=0;j < tEventLen;j++){
					tEventData=new EventData();
					tEventData.name=tByte.getUTFString();
					tEventData.intValue=tByte.getInt32();
					tEventData.floatValue=tByte.getFloat32();
					tEventData.stringValue=tByte.getUTFString();
					tEventData.time=tByte.getFloat32();
					tEventArr.push(tEventData);
				}
				this.eventAniArr.push(tEventArr);
			};
			var tAttachmentLen=tByte.getInt16();
			if (tAttachmentLen > 0){
				this.attachmentNames=[];
				for (i=0;i < tAttachmentLen;i++){
					this.attachmentNames.push(tByte.getUTFString());
				}
			};
			var tBoneSlotLen=tByte.getInt16();
			var tDBBoneSlot;
			var tDBBoneSlotArr;
			for (i=0;i < tBoneSlotLen;i++){
				tDBBoneSlot=new BoneSlot();
				tDBBoneSlot.name=tByte.readUTFString();
				tDBBoneSlot.parent=tByte.readUTFString();
				tDBBoneSlot.attachmentName=tByte.readUTFString();
				tDBBoneSlot.srcDisplayIndex=tDBBoneSlot.displayIndex=tByte.getInt16();
				tDBBoneSlot.templet=this;
				this.boneSlotDic[tDBBoneSlot.name]=tDBBoneSlot;
				tDBBoneSlotArr=this.bindBoneBoneSlotDic[tDBBoneSlot.parent];
				if (tDBBoneSlotArr==null){
					this.bindBoneBoneSlotDic[tDBBoneSlot.parent]=tDBBoneSlotArr=[];
				}
				tDBBoneSlotArr.push(tDBBoneSlot);
				this.boneSlotArray.push(tDBBoneSlot);
			};
			var tNameString=tByte.readUTFString();
			var tNameArray=tNameString.split("\n");
			var tNameStartIndex=0;
			var tSkinDataLen=tByte.getUint8();
			var tSkinData,tSlotData,tDisplayData;
			var tSlotDataLen=0,tDisplayDataLen=0;
			var tUvLen=0,tWeightLen=0,tTriangleLen=0,tVerticeLen=0,tLengthLen=0;
			for (i=0;i < tSkinDataLen;i++){
				tSkinData=new SkinData();
				tSkinData.name=tNameArray[tNameStartIndex++];
				tSlotDataLen=tByte.getUint8();
				for (j=0;j < tSlotDataLen;j++){
					tSlotData=new SlotData();
					tSlotData.name=tNameArray[tNameStartIndex++];
					tDBBoneSlot=this.boneSlotDic[tSlotData.name];
					tDisplayDataLen=tByte.getUint8();
					for (k=0;k < tDisplayDataLen;k++){
						tDisplayData=new SkinSlotDisplayData();
						this.skinSlotDisplayDataArr.push(tDisplayData);
						tDisplayData.name=tNameArray[tNameStartIndex++];
						tDisplayData.attachmentName=tNameArray[tNameStartIndex++];
						tDisplayData.transform=new Transform();
						tDisplayData.transform.scX=tByte.getFloat32();
						tDisplayData.transform.skX=tByte.getFloat32();
						tDisplayData.transform.skY=tByte.getFloat32();
						tDisplayData.transform.scY=tByte.getFloat32();
						tDisplayData.transform.x=tByte.getFloat32();
						tDisplayData.transform.y=tByte.getFloat32();
						tSlotData.displayArr.push(tDisplayData);
						tDisplayData.width=tByte.getFloat32();
						tDisplayData.height=tByte.getFloat32();
						tDisplayData.type=tByte.getUint8();
						tDisplayData.verLen=tByte.getUint16();
						tBoneLen=tByte.getUint16();
						if (tBoneLen > 0){
							tDisplayData.bones=[];
							for (l=0;l < tBoneLen;l++){
								var tBoneId=tByte.getUint16();
								tDisplayData.bones.push(tBoneId);
							}
						}
						tUvLen=tByte.getUint16();
						if (tUvLen > 0){
							tDisplayData.uvs=[];
							for (l=0;l < tUvLen;l++){
								tDisplayData.uvs.push(tByte.getFloat32());
							}
						}
						tWeightLen=tByte.getUint16();
						if (tWeightLen > 0){
							tDisplayData.weights=[];
							for (l=0;l < tWeightLen;l++){
								tDisplayData.weights.push(tByte.getFloat32());
							}
						}
						tTriangleLen=tByte.getUint16();
						if (tTriangleLen > 0){
							tDisplayData.triangles=[];
							for (l=0;l < tTriangleLen;l++){
								tDisplayData.triangles.push(tByte.getUint16());
							}
						}
						tVerticeLen=tByte.getUint16();
						if (tVerticeLen > 0){
							tDisplayData.vertices=[];
							for (l=0;l < tVerticeLen;l++){
								tDisplayData.vertices.push(tByte.getFloat32());
							}
						}
						tLengthLen=tByte.getUint16();
						if (tLengthLen > 0){
							tDisplayData.lengths=[];
							for (l=0;l < tLengthLen;l++){
								tDisplayData.lengths.push(tByte.getFloat32());
							}
						}
					}
					tSkinData.slotArr.push(tSlotData);
				}
				this.skinDic[tSkinData.name]=tSkinData;
				this.skinDataArray.push(tSkinData);
			};
			var tReverse=tByte.getUint8();
			if (tReverse==1){
				this.yReverseMatrix=new Matrix(1,0,0,-1,0,0);
				if (tRootBone){
					tRootBone.setTempMatrix(this.yReverseMatrix);
				}
				}else {
				if (tRootBone){
					tRootBone.setTempMatrix(new Matrix());
				}
			}
			this.showSkinByIndex(this.boneSlotDic,0);
			this.event(/*laya.events.Event.COMPLETE*/"complete",this);
		}

		/**
		*?????????????????????
		*@param name ???????????????
		*@return
		*/
		__proto.getTexture=function(name){
			var tTexture=this.subTextureDic[name];
			if (tTexture==null){
				return this._mainTexture;
			}
			return tTexture;
		}

		/**
		*@private
		*?????????????????????
		*@param boneSlotDic ?????????????????????
		*@param skinIndex ???????????????
		*/
		__proto.showSkinByIndex=function(boneSlotDic,skinIndex){
			if (skinIndex < 0 && skinIndex >=this.skinDataArray.length)return false;
			var i=0,n=0;
			var tBoneSlot;
			var tSlotData;
			var tSkinData=this.skinDataArray[skinIndex];
			if (tSkinData){
				for (i=0,n=tSkinData.slotArr.length;i < n;i++){
					tSlotData=tSkinData.slotArr[i];
					if (tSlotData){
						tBoneSlot=boneSlotDic[tSlotData.name];
						if (tBoneSlot){
							tBoneSlot.showSlotData(tSlotData);
							if (tBoneSlot.attachmentName !="undefined" && tBoneSlot.attachmentName !="null"){
								tBoneSlot.showDisplayByName(tBoneSlot.attachmentName);
								}else {
								tBoneSlot.showDisplayByIndex(tBoneSlot.displayIndex);
							}
						}
					}
				}
				return true;
			}
			return false;
		}

		/**
		*????????????????????????????????????
		*@param skinName ????????????
		*@return
		*/
		__proto.getSkinIndexByName=function(skinName){
			var tSkinData;
			for (var i=0,n=this.skinDataArray.length;i < n;i++){
				tSkinData=this.skinDataArray[i];
				if (tSkinData.name==skinName){
					return i;
				}
			}
			return-1;
		}

		/**
		*@private
		*??????????????????
		*@param aniIndex ????????????
		*@param frameIndex ?????????
		*@return
		*/
		__proto.getGrahicsDataWithCache=function(aniIndex,frameIndex){
			return this._graphicsCache[aniIndex][frameIndex];
		}

		/**
		*@private
		*????????????grahpics
		*@param aniIndex ????????????
		*@param frameIndex ?????????
		*@param graphics ??????????????????
		*/
		__proto.setGrahicsDataWithCache=function(aniIndex,frameIndex,graphics){
			this._graphicsCache[aniIndex][frameIndex]=graphics;
		}

		/**
		*????????????
		*/
		__proto.destroy=function(){
			var tTexture;
			/*for each*/for(var $each_tTexture in this.subTextureDic){
				tTexture=this.subTextureDic[$each_tTexture];
				tTexture.destroy();
			}
			var $each_tTexture;
			/*for each*/for($each_tTexture in this._textureDic){
				tTexture=this._textureDic[$each_tTexture];
				tTexture.destroy();
			};
			var tSkinSlotDisplayData;
			for (var i=0,n=this.skinSlotDisplayDataArr.length;i < n;i++){
				tSkinSlotDisplayData=this.skinSlotDisplayDataArr[i];
				tSkinSlotDisplayData.destory();
			}
			this.skinSlotDisplayDataArr.length=0;
			if (this.url){
				delete Templet.TEMPLET_DICTIONARY[this.url];
			}
		}

		/**
		*???????????????????????????
		*@param index
		*@return
		*/
		__proto.getAniNameByIndex=function(index){
			var tAni=this.getAnimation(index);
			if (tAni)return tAni.name;
			return null;
		}

		__getset(0,__proto,'rate',function(){
			return this._rate;
		});

		Templet.TEMPLET_DICTIONARY=null
		return Templet;
	})(AnimationTemplet)



})(window,document,Laya);
