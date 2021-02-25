window.onload = function() {
    new lineCanvas({
        el: document.getElementById("canvas"),//绘制canvas的父级div
        clearEl: document.getElementById("clearCanvas"),//清除按钮
        saveEl: document.getElementById("saveCanvas"),//保存按钮
        //      linewidth:1,//线条粗细，选填
        //      color:"black",//线条颜色，选填
        //      background:"#ffffff"//线条背景，选填
    });
};
function lineCanvas(obj) {
    this.linewidth = 1;
    this.color = "#000000";
    this.background = "#ffffff";
    for (var i in obj) {
        this[i] = obj[i];
    };
    this.canvas = document.createElement("canvas");
    this.el.appendChild(this.canvas);
    this.cxt = this.canvas.getContext("2d");
    this.canvas.width = this.el.clientWidth;
    this.canvas.height = this.el.clientHeight;
    this.cxt.fillStyle = this.background;
    this.cxt.fillRect(0, 0, this.canvas.width, this.canvas.width);
    this.cxt.strokeStyle = this.color;
    this.cxt.lineWidth = this.linewidth;
    this.cxt.lineCap = "round";
    //开始绘制
    this.canvas.addEventListener("touchstart", function(e) {
        this.cxt.beginPath();
        this.cxt.moveTo(e.changedTouches[0].pageX, e.changedTouches[0].pageY);
    }.bind(this), false);
    //绘制中
    this.canvas.addEventListener("touchmove", function(e) {
        this.cxt.lineTo(e.changedTouches[0].pageX, e.changedTouches[0].pageY);
        this.cxt.stroke();
    }.bind(this), false);
    //结束绘制
    this.canvas.addEventListener("touchend", function() {
        this.cxt.closePath();
    }.bind(this), false);
    //清除画布
    this.clearEl.addEventListener("click", function() {
        this.cxt.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }.bind(this), false);
    //保存图片，直接转base64
    this.saveEl.addEventListener("click", function() {
        var top = 0,left = 0, right = 0, bottom = 0;

        for (var i = 0; i < this.canvas.width && !!!top; i++) {
            for(var j = 0; j < this.canvas.height  && !!!top; j++){
                var data = this.cxt.getImageData(i,j,1,1);
                for(var k = 0; k < 4 && !!!top; k++){
                    if(data.data[k] != 0){
                        top = i;
                    }
                }
            }
        }
        for (var i = 0; i < this.canvas.height && !!!left; i++) {
            for(var j = 0; j < this.canvas.width  && !!!left; j++){
                var data = this.cxt.getImageData(i,j,1,1);
                for(var k = 0; k < 4 && !!!left; k++){
                    if(data.data[k] != 0){
                        left = i;
                    }
                }
            }
        }
        for (var i = this.canvas.height; i > 0 && !!!bottom; i--) {
            for(var j = 0; j < this.canvas.width  && !!!bottom; j++){
                var data = this.cxt.getImageData(i,j,1,1);
                for(var k = 0; k < 4 && !!!bottom; k++){
                    if(data.data[k] != 0){
                        bottom = i;
                    }
                }
            }
        }
        for (var i = this.canvas.width; i > 0 && !!!right; i--) {
            for(var j = 0; j < this.canvas.height  && !!!right; j++){
                var data = this.cxt.getImageData(i,j,1,1);
                for(var k = 0; k < 4 && !!!right; k++){
                    if(data.data[k] != 0){
                        right = i;
                    }
                }
            }
        }


        var imgData = this.canvas.getImageData(left,top,right - left,bottom - top);
        this.canvas1 = document.createElement("canvas");
        this.el.appendChild(this.canvas1);
        this.canvas1.width = right - left;
        this.canvas1.height = bottom - top;
        this.cxt1 = this.canvas1.getContext("2d");
        this.cxt1.putImageData(imgData,0,0);

        var imgBase64 = this.canvas1.toDataURL();
        console.log(imgBase64);



        this.cxt.clearRect(0, 0, this.canvas.width, this.canvas.height);
        var img = document.getElementById("img");
        img.style.display = 'block';
        img.src = imgBase64;
        this.el.removeChild(this.canvas1);
    }.bind(this), false);
};
