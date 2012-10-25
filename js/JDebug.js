Debug = Base.extend(0, {
    run:0,
    t:null,
    div:null,
    ifr:null,
    init:function () {
        if (typeof G_DEBUG != "undefined") {
            if (G_DEBUG == 1) this.run = 1;
        }
    },
    onResize:function(){
        var scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
        Debug.div.style.top = (scrollTop + document.documentElement.clientHeight - Debug.div.offsetHeight) + " px";
        var hh = Math.max(document.documentElement.clientHeight , document.body.clientHeight);
        var h = (scrollTop + hh - 200);
        Debug.div.style.top = h + "px";
    },
    trace:function (src) {
        if (!this.run) return;
        if (!this.div) {
            this.createDIV();
            this.createIFR();
            window.onresize=Debug.onResize;
            this.onResize();
        }
        var span = this.ifr.createElement("SPAN");
        var tt = new Date();
        var mm = tt.getMinutes();
        mm = mm < 10 ? "0" + mm : mm;
        var ss = tt.getSeconds();
        ss = ss < 10 ? "0" + ss : ss;
        var temp = "<font color='#FFDD66'>" + tt.getHours() + ":" + mm + ":" + ss + "></font>";
        var type = typeof src;
        switch (type) {
            case "function":
                temp += src.toString();
                break;
            case "object":
                if (src.length || src.length == 0) {
                    temp += "[" + Debug.obj2Str(src, 1) + "],";
                } else {
                    temp += "{" + Debug.obj2Str(src) + "}";
                }
                break;
            default:
                if (src) temp += this.light(String(src), 'str');
                break;
        }
        span.innerHTML = temp;
        this.ifr.body.appendChild(span);
        this.ifr.body.appendChild(this.ifr.createElement("BR"));
    },
    light:function (str, type) {
        var color;
        switch (type) {
            case "attr":
                color = "#8AC6F2";
                break;
            case "str":
                color = "#c80000";
                break;
            case "value":
                color = "#88DD66";
                break;
            default:
                color = "#9B3866";
                break;
        }
        return this.color(str, color);
    },
    color:function (str, clr) {
        return "<font color='" + clr + "'>" + str + "</font>";
    },
    obj2Str:function (obj, type) {
        var str = "";
        for (var o in obj) {
            if (typeof obj[o] == "object") {
                if (!obj[o]) return str += (o + "=null");
                if (obj[o].length || obj[o].length === 0) {//inner is Array
                    str += (this.light(o) + ":[" + Debug.obj2Str(obj[o], 1) + "],");
                } else {
                    if (type == 1) str += ('{' + Debug.obj2Str(obj[o]) + "},");
                    else str += (this.light(o, "attr") + ":{" + Debug.obj2Str(obj[o]) + "},");
                }
            } else {
                if (o) {
                    if (type == 1) str += this.light(obj[o], "value");
                    else str += this.light(o, "attr") + ":" + this.light("'" + obj[o] + "'", "value") + ",";
                }
            }
        }
        return str.substring(0, str.length - 1);
    },
    createIFR:function () {
        var ifr, ifrdoc;
        try {
            ifr = document.createElement("<iframe frameBorder='0'>");
        } catch (e) {
            ifr = document.createElement("iframe");
            ifr.frameBorder = 0;
        }
        document.getElementById("debugDIV").appendChild(ifr);
        ifrdoc = ifr.contentWindow.document;
        ifr.style.border = "none";
        ifr.style.width = "300px";
        ifr.style.height = "200px";
        ifr.src = "";
        ifr.frameBorder = 0;
        ifr.setAttribute('frameborder', '0', 0);
        ifrdoc.open();
        ifrdoc.writeln("<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Transitional//EN\" \"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd\"><html xmlns=\" http://www.w3.org/1999/xhtml\"><head><meta http-equiv=\"Content-Type\" content=\"text/html; charset=utf-8\" /><style type=\"text/css\" media=\"all\">body{margin:0px; padding:0px;background:#000;color:#fff;word-break:break-all;word-wrap:break-word;font-family:verdana;font-size:12px;}</style><title>无标题文档</title></head><body>");
        ifrdoc.writeln("<div id='debugDIV'></div></body></html>");
        ifrdoc.close();
        this.ifr = ifrdoc;
    },
    createDIV:function () {
        var div = document.createElement("DIV");
        div.style.width = "300px";
        div.style.height = "200px";
        div.style.zIndex = 9999;
        div.style.position = "absolute";
        div.style.left = "0";
        div.style.padding = "0px";
        div.style.margin = "0px";
        div.id = "debugDIV";
        this.div = div;
        document.body.appendChild(Debug.div);
    }
});