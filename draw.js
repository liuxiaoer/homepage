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
    this.element();
}

Signature.prototype.max = function(n1,n2){
    return n1 > n2 ? n1 : n2;
}

Signature.prototype.min = function(n1,n2){
    return n1 > n2 ? n2 : n1;
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

    var minX = maxX = minY = maxY = 0;

    //开始绘制
    this.canvas.addEventListener("touchstart", function(e) {
        this.cxt.beginPath();
        minX = this.min(minX,e.changedTouches[0].pageX);
        maxX = this.max(maxX,e.changedTouches[0].pageX);
        minY = this.min(minY,e.changedTouches[0].pageY);
        maxY = this.max(maxY,e.changedTouches[0].pageY);
        this.cxt.moveTo(e.changedTouches[0].pageX, e.changedTouches[0].pageY);
    }.bind(this), false);
    //绘制中
    this.canvas.addEventListener("touchmove", function(e) {
        minX = this.min(minX,e.changedTouches[0].pageX);
        maxX = this.max(maxX,e.changedTouches[0].pageX);
        minY = this.min(minY,e.changedTouches[0].pageY);
        maxY = this.max(maxY,e.changedTouches[0].pageY);
        this.cxt.lineTo(e.changedTouches[0].pageX, e.changedTouches[0].pageY);
        this.cxt.stroke();
    }.bind(this), false);
    //结束绘制
    this.canvas.addEventListener("touchend", function() {
        alert(minX,minY,maxX,maxY);
        this.cxt.closePath();
    }.bind(this), false);
    //清除画布
    this.clearEl.addEventListener("click", function() {
        this.cxt.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }.bind(this), false);
    //保存图片，直接转base64
    this.saveEl.addEventListener("click", function() {
        !!this.onsubmit && this.onsubmit(this.canvas.toDataURL());
        if(this.clearOnSubmit){
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
