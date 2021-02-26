// window.onload = function() {
//     var lc = new Signature({
//         onsubmit:function(imgData){
//             //imgData 字符串
//             document.querySelector('#img').src=imgData
//         }
//     });
// };

function Signature(params){
    this.clearOnSubmit = true;
    this.closeOnSubmit = true;
    if (typeof params == "object"){
        if (!!params.container) {
            if(typeof params.container == Element){
                this.el = params.container;
            }else if(typeof params.container == "string"){
                this.el = document.querySelector(params)   
            }
        }else{
            this.el = document.querySelector('body');
        }
        if(typeof params.onsubmit == "function")this.onsubmit = params.onsubmit;
        !!params.clearOnSubmit && this.clearOnSubmit == params.clearOnSubmit;
        !!params.closeOnSubmit && this.closeOnSubmit == params.closeOnSubmit;
    }else if(typeof params == "string"){
        this.el = document.querySelector(params)   
    }else{
        this.el = document.querySelector('body');
    }
    this.resetRect();
    this.element();
}

Signature.prototype.resetRect = function(){
    this.rect = {
        x0:-1,
        y0:-1,
        x1:-1,
        y1:-1
    }
}

Signature.prototype.max = function(n1,n2){
    if(n1 == -1)return Math.ceil(n2);
    if(n2 == -1)return Math.ceil(n1);
    return n1 > n2 ? Math.ceil(n1) : Math.ceil(n2);
}

Signature.prototype.min = function(n1,n2){
    if(n1 == -1)return Math.floor(n2);
    if(n2 == -1)return Math.floor(n1);
    return n1 > n2 ? Math.floor(n2) : Math.floor(n1);
}

Signature.prototype.clip = function(){
    var clipX = this.rect.x0;
    var clipY = this.rect.y0;
    this.clipWidth = this.rect.x1 - this.rect.x0;
    this.clipHeight = this.rect.y1 - this.rect.y0;
    this.clipCanvas = document.createElement("canvas");
    this.container.appendChild(this.clipCanvas);
    this.clipCxt = this.clipCanvas.getContext("2d");
    this.clipCanvas.width = this.clipWidth;
    this.clipCanvas.height = this.clipHeight;
    this.clipCanvas.style.display = 'none';


    var clipData = this.cxt.getImageData(clipX,clipY,this.clipWidth,this.clipHeight);
    this.clipCxt.putImageData(clipData,0,0);
    var clipImage = this.clipCanvas.toDataURL()
    this.container.removeChild(this.clipCanvas);
    return clipImage;
}

Signature.prototype.element = function() {
    this.container = document.createElement('div');
    this.container.style.position = 'fixed';
    this.container.style.top = 0;
    this.container.style.left = 0;
    this.container.style.width = this.el.clientWidth + 'px';
    this.container.style.height = this.el.clientHeight + 'px';
    this.el.appendChild(this.container);

    this.clearEl = document.createElement('p');
    this.clearEl.innerText = '清除';
    this.clearEl.style.width = '50%';
    this.clearEl.style.height = '40px';
    this.clearEl.style.lineHeight = '40px';
    this.clearEl.style.textAlign = 'center';
    this.clearEl.style.position = 'absolute';
    this.clearEl.style.bottom = 0;
    this.clearEl.style.right = 0;
    this.clearEl.style.border = '1px solid #DEDEDE';
    this.clearEl.style.zIndex = 1001;
    this.container.appendChild(this.clearEl);

    this.saveEl = document.createElement('p');
    this.saveEl.innerText = '保存';
    this.saveEl.style.width = '50%';
    this.saveEl.style.height = '40px';
    this.saveEl.style.lineHeight = '40px';
    this.saveEl.style.textAlign = 'center';
    this.saveEl.style.position = 'absolute';
    this.saveEl.style.bottom = 0;
    this.saveEl.style.left = 0;
    this.saveEl.style.border = '1px solid #DEDEDE';
    this.saveEl.style.zIndex = 1001;
    this.container.appendChild(this.saveEl);


    this.close = document.createElement('span');
    this.close.style.position = 'absolute';
    this.close.style.top = '10px';
    this.close.style.right = '10px';
    this.close.innerText = 'X';
    this.close.style.zIndex = 1001;
    this.close.style.border = '1px solid #999';
    this.close.style.color = '#999';
    this.close.style.borderRadius = '50%';
    this.close.style.width = '20px';
    this.close.style.height = '20px';
    this.close.style.lineHeight = '20px';
    this.close.style.textAlign = 'center';
    this.container.appendChild(this.close);


    this.linewidth = 1;
    this.color = "#000000";
    this.background = "#ffffff";

    

    this.canvas = document.createElement("canvas");
    this.container.appendChild(this.canvas);
    this.cxt = this.canvas.getContext("2d");
    this.canvas.width = this.el.clientWidth;
    this.canvas.height = this.el.clientHeight;
    this.canvas.style.position = 'absolute';
    this.canvas.style.top = 0;
    this.canvas.style.left = 0;
    this.cxt.fillStyle = this.background;
    this.cxt.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.cxt.strokeStyle = this.color;
    this.cxt.lineWidth = this.linewidth;
    this.cxt.lineCap = "round";

    //开始绘制
    this.canvas.addEventListener("touchstart", function(e) {
        this.cxt.beginPath();
        this.rect.x0 = this.min(this.rect.x0,e.changedTouches[0].pageX);
        this.rect.x1 = this.max(this.rect.x1,e.changedTouches[0].pageX);
        this.rect.y0 = this.min(this.rect.y0,e.changedTouches[0].pageY);
        this.rect.y1 = this.max(this.rect.y1,e.changedTouches[0].pageY);
        this.cxt.moveTo(e.changedTouches[0].pageX, e.changedTouches[0].pageY);
    }.bind(this), false);
    //绘制中
    this.canvas.addEventListener("touchmove", function(e) {
        this.rect.x0 = this.min(this.rect.x0,e.changedTouches[0].pageX);
        this.rect.x1 = this.max(this.rect.x1,e.changedTouches[0].pageX);
        this.rect.y0 = this.min(this.rect.y0,e.changedTouches[0].pageY);
        this.rect.y1 = this.max(this.rect.y1,e.changedTouches[0].pageY);
        this.cxt.lineTo(e.changedTouches[0].pageX, e.changedTouches[0].pageY);
        this.cxt.stroke();
    }.bind(this), false);
    //结束绘制
    this.canvas.addEventListener("touchend", function() {
        this.cxt.closePath();
    }.bind(this), false);
    //清除画布
    this.clearEl.addEventListener("click", function() {
        this.resetRect();
        this.cxt.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }.bind(this), false);
    //保存图片，直接转base64
    this.saveEl.addEventListener("click", function() {
        !!this.onsubmit && this.onsubmit(this.clip(),this.clipWidth,this.clipHeight);
        if(this.clearOnSubmit){
            this.resetRect();
            this.cxt.fillRect(0, 0, this.canvas.width, this.canvas.height);
        }
        if(this.closeOnSubmit){
            this.el.removeChild(this.container);
        }
    }.bind(this), false);

    this.close.addEventListener("touchstart",function(){
        this.el.removeChild(this.container);
    }.bind(this), false);
};
