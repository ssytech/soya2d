﻿/**
 * 渲染器模块定义了soya2d中内置的渲染器，目前仅实现了CanvasRenderer
 * @module renderer
 */
/**
 * 图形类,提供了贴图和矢量绘制的接口。<br/>
 * 注意，该类不应被实例化。引擎会在onRender回调中注入该类的实例。<br/>
 * 该图形对象基于Canvas构建。
 * 
 * @class soya2d.CanvasGraphics
 * @constructor
 * @param ctx CanvasRenderingContext2D的实例
 */
soya2d.CanvasGraphics = function(ctx){
    /**
     * 一个对当前绘图对象的引用
     * @property ctx
     * @type {CanvasRenderingContext2D}
     */
	this.ctx = ctx;

    /**
     * 设置或者获取当前绘图环境的渲染透明度
     * @method opacity
     * @param {Number} op 0.0 - 1.0
     * @return {this|Number}
     */
    this.opacity = function(op){
        if(op===0 || op){
            this.ctx.globalAlpha = op;
            return this;
        }else{
            return this.ctx.globalAlpha;
        }
    };

    /**
     * 闭合当前路径
     * @method closePath
     * @chainable
     */
    this.closePath = function(){
        this.ctx.closePath();
        return this;
    };
    /**
     * 移动当前画笔
     * @method moveTo
     * @param {Number} x
     * @param {Number} y
     * @chainable
     */
    this.moveTo = function(x,y){
        this.ctx.moveTo(x,y);
        return this;
    };
    /**
     * 向当前path中添加直线subpath<br/>
     * 线条起点为path绘制前画笔坐标，终点为x,y
     * @method lineTo
     * @param {Number} x
     * @param {Number} y
     * @chainable
     */
    this.lineTo = function(x,y){
        this.ctx.lineTo(x,y);
        return this;
    };
    /**
     * 向当前path中添加2次曲线subpath<br/>
     * 线条起点为path绘制前画笔坐标，终点为x,y
     * @method quadraticCurveTo
     * @param {Number} cpx 控制点
     * @param {Number} cpy 控制点
     * @param {Number} x
     * @param {Number} y
     * @chainable
     */
    this.quadraticCurveTo = function(cpx,cpy,x,y){
        this.ctx.quadraticCurveTo(cpx,cpy,x,y);
        return this;
    };
    /**
     * 向当前path中添加贝塞尔曲线subpath<br/>
     * 线条起点为path绘制前画笔坐标，终点为x,y
     * @method bezierCurveTo
     * @param {Number} cp1x 控制点1
     * @param {Number} cp1y 控制点1
     * @param {Number} cp2x 控制点2
     * @param {Number} cp2y 控制点2
     * @param {Number} x
     * @param {Number} y
     * @chainable
     */
    this.bezierCurveTo = function(cp1x,cp1y,cp2x,cp2y,x,y){
        this.ctx.bezierCurveTo(cp1x,cp1y,cp2x,cp2y,x,y);
        return this;
    };
    /**
     * 向当前path中添加使用控制点和半径定义的弧型subpath<br/>
     * @method arcTo
     * @param {Number} x1
     * @param {Number} y1
     * @param {Number} x2
     * @param {Number} y2
     * @param {Number} radius
     * @chainable
     */
    this.arcTo = function(x1,y1,x2,y2,radius){
        this.ctx.arcTo(x1,y1,x2,y2,radius);
        return this;
    };
    /**
     * 向当前path中添加圆弧形subpath
     * @method arc
     * @param {Number} cx 圆心
     * @param {Number} cy 圆心
     * @param {Number} r 半径
     * @param {Number} [sr=0] 起始弧度
     * @param {Number} [er=soya2d.Math.PIM2] 结束弧度
     * @chainable
     */
    this.arc = function(cx,cy,r,sr,er){
        this.ctx.arc(cx,cy,r,sr||0,er||soya2d.Math.PIM2);
        return this;
    };
    /**
     * 向当前path中添加椭圆弧形subpath
     * @method eArc
     * @param {Number} cx 圆心
     * @param {Number} cy 圆心
     * @param {Number} a 长半径
     * @param {Number} b 短半径
     * @param {int} [sa=0] 起始角度
     * @param {int} [ea=360] 结束角度
     * @chainable
     */
    this.eArc = function(cx,cy,a,b,sa,ea){
        sa = (sa || 0)>>0;
        ea = (ea || 360)>>0;
        var m = soya2d.Math;
        var x = cx+a*m.COSTABLE[sa];
        var y = cy+b*m.SINTABLE[sa];
        ctx.moveTo(x,y);
        var len = 0;
        if(ea < sa){
            len = 360-sa+ea;
        }else{
            len = ea - sa;
        }
        for(var i=1;i<=len;i++){
            var angle = (sa+i)%360;
            x = cx+a*m.COSTABLE[angle];
            y = cy+b*m.SINTABLE[angle];
            ctx.lineTo(x,y);
        }
        return this;
    };
    /**
     * 向当前path中添加矩形subpath
     * @method rect
     * @param {Number} x
     * @param {Number} y
     * @param {Number} w
     * @param {Number} h
     * @chainable
     */
    this.rect = function(x,y,w,h){
        this.ctx.rect(x,y,w,h);
        return this;
    };
    /**
     * 向当前path中添加多边形subpath，边的数量由顶点数决定
     * @method polygon
     * @param {Array} vtx 一维顶点数组,坐标为相对中心点。<br/>
     * 比如绘制[0,0]点为重心的正三角形:<br/>
     * ```
     * [0,-5,//top point<br/>
     * -5,x,//left point<br/>
     * 5,y]
     * ```
     * 
     * @chainable
     */
    this.polygon = function(vtx){
        var c = this.ctx;
        var l = vtx.length - 1;

        c.moveTo(vtx[0],vtx[1]);
        for(var i=2;i<l;i+=2){
            c.lineTo(vtx[i],vtx[i+1]);
        }
        return this;
    };
    /**
     * 向当前path中添加椭圆形subpath
     * @method ellipse
     * @param {Number} x
     * @param {Number} y
     * @param {Number} w
     * @param {Number} h
     * @chainable
     */
    this.ellipse = function(x,y,w,h){
        var kappa = 0.5522848;
        var ox = (w / 2) * kappa, // control point offset horizontal
            oy = (h / 2) * kappa, // control point offset vertical
            xe = x + w,           // x-end
            ye = y + h,           // y-end
            xm = x + w / 2,       // x-middle
            ym = y + h / 2;       // y-middle
        var c = this.ctx;
        c.moveTo(x, ym);
        c.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
        c.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
        c.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
        c.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);
        return this;
    };
    /**
     * 向当前path中添加圆角矩形subpath
     * @method roundRect
     * @param {Number} x
     * @param {Number} y
     * @param {Number} w
     * @param {Number} h
     * @param {Number} r 圆角半径
     * @chainable
     */
    this.roundRect = function(x,y,w,h,r){
        var c = this.ctx;
        c.moveTo(x+r,y);
        c.lineTo(x+(w-(r<<1)),y);
        c.arc(x+w-r,y+r,r,Math.PI*3/2,0);
        c.lineTo(x+w,y+h-r);
        c.arc(x+w-r,y+h-r,r,0,soya2d.Math.PID2);
        c.lineTo(x+r,y+h);
        c.arc(x+r,y+h-r,r,soya2d.Math.PID2,Math.PI);
        c.lineTo(x,y+r);
        c.arc(x+r,y+r,r,Math.PI,Math.PI*3/2);
        return this;
    };
    /**
     * 向当前path中添加正多边形subpath
     * @method regularPolygon
     * @param {Number} cx 多边形重心
     * @param {Number} cy 多边形重心
     * @param {Number} ec 多边形的边数，不能小于3
     * @param {Number} r1 半径1
     * @param {Number} r2 半径2
     * @chainable
     */
    this.regularPolygon = function(cx,cy,ec,r1,r2){
        cx = cx||0;
        cy = cy||0;
        ec = ec<3?3:ec;
        var M = soya2d.Math;
        var vtx = [];
        var step = 360/ec;
        for(var i=0,j=0;i<360;i+=step,j++){
            var tr = r1;
            if(r2){
                if(j%2!==0)tr=r1;
                else{tr=r2};
            }

            if(!M.COSTABLE[i]){
                vtx.push(cx+tr*M.COSTABLE[Math.round(i)],cy+tr*M.SINTABLE[Math.round(i)]);
            }else{
                vtx.push(cx+tr*M.COSTABLE[i],cy+tr*M.SINTABLE[i]);
            }
        }
        this.polygon(vtx);
        return this;
    };

    /**
     * 设置或者获取当前绘图环境的图元混合模式
     * @method blendMode
     * @param {String} blendMode 混合方式
     * @default soya2d.BLEND_NORMAL
     * @see soya2d.BLEND_NORMAL
     * @chainable
     */
    this.blendMode = function(blendMode){
        if(blendMode){
            this.ctx.globalCompositeOperation = blendMode;
            return this;
        }else{
            return this.ctx.globalCompositeOperation;
        }
    };
    /**
     * 设置或者获取当前绘图环境的线框样式
     * @method strokeStyle
     * @param {Object} style 可以是命名颜色、RGB、16进制等标准颜色。也可以是CanvasGradient或者CanvasPattern
     * @chainable
     */
    this.strokeStyle = function(style){
        if(style){
            this.ctx.strokeStyle = style;
            return this;
        }else{
            return this.ctx.strokeStyle;
        }
    };
    /**
     * 设置或者获取当前绘图环境的填充样式
     * @method fillStyle
     * @param {Object} style 可以是命名颜色、RGB、16进制等标准颜色。也可以是CanvasGradient或者CanvasPattern
     * @chainable
     */
    this.fillStyle = function(style){
        if(style){
            this.ctx.fillStyle = style;
            return this;
        }else{
            return this.ctx.fillStyle;
        }
    };

    /**
     * 设置当前绘图环境的阴影样式
     * @method shadow
     * @param {Number} blur 模糊度
     * @param {String} [color=rgba(0,0,0,0)] 颜色
     * @param {Number} [offx=0] x偏移
     * @param {Number} [offy=0] y偏移
     * @chainable
     */
    this.shadow = function(blur,color,offx,offy){
        this.ctx.shadowBlur = blur;
        this.ctx.shadowColor = color;
        this.ctx.shadowOffsetX = offx;
        this.ctx.shadowOffsetY = offy;
        return this;
    };

    /**
     * 设置当前绘图环境的线条样式
     * @method lineStyle
     * @param {Number} width 宽度
     * @param {String} cap 线条末端样式
     * @param {String} join 线条交点样式
     * @param {Number} miterLimit 交点延长限制。join为PeaJS.LINEJOIN_MITER时生效
     * @chainable
     * @see soya2d.LINEJOIN_MITER
     */
    this.lineStyle = function(width,cap,join,miterLimit){
        var c = this.ctx;
        c.lineWidth = width;
        c.lineCap = cap || c.lineCap;
        c.lineJoin = join || c.lineJoin;
        c.miterLimit = miterLimit || c.miterLimit;
        return this;
    };

    /**
     * 设置当前绘图环境的字体样式
     * @method font
     * @param {soya2d.Font} font
     * @chainable
     */
    this.font = function(font){
        var c = this.ctx;
        c.font = font.getDesc();
        return this;
    };

    /**
     * 裁剪路径
     * @method clip
     * @chainable
     */
	this.clip = function(){
        this.ctx.clip();
        return this;
	};
    /**
     * 保存当前绘图状态
     * @method push
     * @chainable
     */
	this.push = function(){
		this.ctx.save();	
		return this;
	};
    /**
     * 恢复最近一次push的绘图状态
     * @method pop
     * @chainable
     */
	this.pop = function(){
		this.ctx.restore();	
		return this;
	};
    /**
     * 清空当前path中的所有subpath
     * @method beginPath
     * @chainable
     */
	this.beginPath = function(){
		this.ctx.beginPath();	
		return this;
	};
    /**
     * 关闭当前path
     * @method closePath
     * @chainable
     */
    this.closePath = function(){
        this.ctx.closePath();
        return this;
    };

    /**
     * 填充path
     * @method fill
     * @chainable
     */
    this.fill = function(){
        this.ctx.fill();
        return this;
    };
    /**
     * 描绘path的轮廓
     * @method stroke
     * @chainable
     */
    this.stroke = function(){
        this.ctx.stroke();
        return this;
    };

    /**
     * 向当前path中添加指定的subpath
     * 
     * @param {soya2d.Path} path 路径结构
     * @method path
     * @chainable
     */
    this.path = function(path){
        path._insQ.forEach(function(ins){
            var type = ins[0].toLowerCase();
            switch(type){
                case 'm':this.ctx.moveTo(ins[1][0],ins[1][1]);break;
                case 'l':
                    var xys = ins[1];
                    if(xys.length>2){
                        for(var i=0;i<xys.length;i+=2){
                            this.ctx.lineTo(xys[i],xys[i+1]);
                        }
                    }else{
                        this.ctx.lineTo(xys[0],xys[1]);
                    }
                    break;
                case 'c':
                    var xys = ins[1];
                    if(xys.length>6){
                        for(var i=0;i<xys.length;i+=6){
                            this.ctx.bezierCurveTo((xys[i]),(xys[i+1]),(xys[i+2]),
                                                (xys[i+3]),(xys[i+4]),(xys[i+5]));
                        }
                    }else{
                        this.ctx.bezierCurveTo(xys[0],xys[1],xys[2],xys[3],xys[4],xys[5]);
                    }
                    break;
                case 'q':
                    var xys = ins[1];
                    if(xys.length>4){
                        for(var i=0;i<xys.length;i+=4){
                            this.ctx.quadraticCurveTo((xys[i]),(xys[i+1]),(xys[i+2]),
                                                (xys[i+3]));
                        }
                    }else{
                        this.ctx.quadraticCurveTo(xys[0],xys[1],xys[2],xys[3]);
                    }
                    break;
                case 'z':this.ctx.closePath();break;
            }
        },this);
    }

    /**
     * 以x,y为左上角填充一个宽w高h的矩形
     * @method fillRect
     * @param {Number} x
     * @param {Number} y
     * @param {Number} w
     * @param {Number} h
     * @chainable
     */
	this.fillRect = function(x,y,w,h){
		this.ctx.fillRect(x,y,w,h);
		return this;
	};
    /**
     * 以x,y为左上角描绘一个宽w高h的矩形
     * @method strokeRect
     * @param {Number} x
     * @param {Number} y
     * @param {Number} w
     * @param {Number} h
     * @chainable
     */
	this.strokeRect = function(x,y,w,h){
		this.ctx.strokeRect(x,y,w,h);
		return this;
	};
    /**
     * 以x,y为左上角清空一个宽w高h的矩形区域<br/>
     * 清空颜色为rgba(0,0,0,0);
     * @method clearRect
     * @param {Number} x
     * @param {Number} y
     * @param {Number} w
     * @param {Number} h
     * @chainable
     */
    this.clearRect = function(x,y,w,h){
        this.ctx.clearRect(x,y,w,h);
        return this;
    };
	/**
     * 
     * 贴图接口
     * @method map
     * @param {HTMLImageElement} tex 需要绘制的纹理
     * @param  {int} [sx]  纹理起始坐标x
     * @param  {int} [sy]  纹理起始坐标y
     * @param  {int} [sw]  纹理起始尺寸w
     * @param  {int} [sh]  纹理起始尺寸h
     * @param  {int} [dx]  纹理目标坐标x
     * @param  {int} [dy]  纹理目标坐标y
     * @param  {int} [dw]  纹理目标尺寸w
     * @param  {int} [dh]  纹理目标尺寸h
     * @chainable
     */
	this.map = function(img,dx,dy,dw,dh,sx,sy,sw,sh){
		sx = sx || 0;
        sy = sy || 0;
        sw = sw || img.width;
        sh = sh || img.height;

        if(sw===0 || sh===0 || dw===0 || dh===0){
            return;
        }

		this.ctx.drawImage(img,
                            sx>>0,sy>>0,sw>>0,sh>>0,
                            dx>>0,dy>>0,dw>>0,dh>>0);
		return this;
	};
    /**
     * 填充文字
     * @method fillText
     * @param {String} str 需要绘制的文字
     * @param {int} [x=0] x坐标，相对于当前精灵的x
     * @param {int} [y=0] y坐标，相对于当前精灵的y
     * @param {int} [mw] 绘制文字最大宽度
     * @chainable
     */
    this.fillText = function(str,x,y,mw){
        if(mw)
            this.ctx.fillText(str, x||0, y||0 ,mw );
        else{
            this.ctx.fillText(str, x||0, y||0 );
        }
        return this;
    };
    /**
     * 描绘文字
     * @method strokeText
     * @param {String} str 需要绘制的文字
     * @param {int} [x=0] x坐标，相对于当前精灵的x
     * @param {int} [y=0] y坐标，相对于当前精灵的y
     * @param {int} [mw] 绘制文字最大宽度
     * @chainable
     */
    this.strokeText = function(str,x,y,mw){
        if(mw)
            this.ctx.strokeText(str, x||0, y||0 ,mw );
        else{
            this.ctx.strokeText(str, x||0, y||0 )
        }
        return this;
    };
};
