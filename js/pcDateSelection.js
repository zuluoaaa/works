function DateSelection(date){
    this.id = date.dateId;
    //将点击返回值传给某个input
    this.bind = date.bind;
    calandar.call(this);
}
DateSelection.prototype = {
    date1Init:function(){
        this.htmlInit();
        this.initDom();
        this.windowOnclick();
        this.dateInit();
        this.init();
        this.mouseover();
        this.leftClick();
    },
    htmlInit:function(){
        if(!this.id) return false;
        this.id.innerHTML= "<div><input type='button' id='left-C' value='<' /> <span id='date'><span id='year'>2016</span>/<span id='month'>2</span></span> <input type='button' id='right-C' value='>' /> " +
            "</div><ul class='week' id='week'><li>日</li><li>一</li><li>二</li><li>三</li><li>四</li><li>五</li><li>六</li></ul><ul class='day' id='day'></ul><h6 id='new-date'></h6>";
    },
    windowOnclick:function(){
        var self = this;
        this.id.setAttribute("style","display:none");
        window.addEventListener("click",function(e){
            e = e || event;
            var panretN =  e.target.parentNode;
            if(!panretN.tagName){
                panretN = e.target;
            }
            var panretNp = panretN.parentNode;
            if(!panretNp.tagName){
                panretNp = e.target;
            }
            if(e.target.getAttribute("id") == self.bind.getAttribute("id")  || panretN.getAttribute("id") == self.id.getAttribute("id") || panretNp.getAttribute("id") == self.id.getAttribute("id")){
                self.id.setAttribute("style","display:block");
            }else{
                self.id.setAttribute("style","display:none");
            }
        })
    }
};
function calandar(){
    var self = this;
    var calandar = {};
    this.initDom = function(){
       var wholeDom = self.id.getElementsByTagName("*");
        for(var i= 0,item=wholeDom.length;i<item;i++){
            if(wholeDom[i].getAttribute("id") == "date"){
                calandar.date = wholeDom[i];
            }else if(wholeDom[i].getAttribute("id") == "day"){
                calandar.day = wholeDom[i];
            }else if(wholeDom[i].getAttribute("id") == "month"){
                calandar.month = wholeDom[i];
            }else if(wholeDom[i].getAttribute("id") == "year"){
                calandar.year = wholeDom[i];
            }else if(wholeDom[i].getAttribute("id") == "left-C"){
                calandar.leftC = wholeDom[i];
            }else if(wholeDom[i].getAttribute("id") == "right-C"){
                calandar.rightC = wholeDom[i];
            }
            continue
        }
    };
    //把时间默认为当前月份
    this.dateInit = function(){
        var newDate = new Date(),
            newYear = newDate.getFullYear(),
            newMonth = newDate.getMonth()+1;
        calandar.date.innerHTML = "<span id='year'>"+newYear+"</span>/<span id='month'>"+newMonth+"</span>";
        self.initDom();
    };
    //获取到当前HTML内的指定时间
    this.date = function(){
        var kkk = new Date(calandar.date.innerText+"/1");
        return kkk;
    };
    //获取指定时间的月份
    this.getMonth1 = function(){
        var month = self.date().getMonth() +1;
        return month;
    };
    //输出指定月份的天数
    this.init = function(){
        var day =  calandar.day;
        day.innerHTML = null;
        var week = self.date().getDay();
        for(var z= 0;z<week;z++){
            day.innerHTML += "<li></li>";
        }
        for(var i=1;i<35;i++){
            var date = self.date().getFullYear() +"/"+self.getMonth1() +"/"+ i;
            var sky = new Date(date).getDate();
            if(!sky){
                sky = 4;
            }
            if(i>=25 && sky<=5){
                return false;
            }
            day.innerHTML +="<li>"+sky+"</li>";
        }
    };
    this.mouseover = function(){
        var day =  calandar.day.getElementsByTagName("li");
        for(var i= 0,item=day.length;i<item;i++){
            if(day[i].innerText){
                day[i].setAttribute("class","li-hover");
                //点击输出当前日历
                day[i].onclick = function(){
                    var    month = calandar.month.innerText,
                        year  = calandar.year.innerText;
                    if(self.bind.tagName.toUpperCase() == "INPUT" || self.bind.tagName.toUpperCase() == "TEXTAREA"){
                        self.bind.value =  year +"年"+month + "月" + this.innerText +"日";
                    }else{
                        self.bind.innerText =  year +"年"+month + "月" + this.innerText +"日";
                    }
                    self.id.setAttribute("style","display:none");
                                if (event.stopPropagation) {
                                    event.stopPropagation();
                                }
                                else if (window.event) {
                                    window.event.cancelBubble = true;
                                }
                }
            }
        }
    };
    this.leftClick = function(){
        var leftC = calandar.leftC,
            rightC =calandar.rightC;
        leftC.onclick = function(){

            calandar.month.innerText = calandar.month.innerText -1;
            if(calandar.month.innerText == 0){
                calandar.month.innerText = 12;
                calandar.year.innerText =  calandar.year.innerText -1;
            }
            self.init();
            self.mouseover();
        };
        rightC.onclick = function(){
            calandar.month.innerText = parseInt( calandar.month.innerText) + 1;
            if(parseInt(calandar.month.innerText) == 13){
                calandar.month.innerText = 1;
                calandar.year.innerText = parseInt(calandar.year.innerText) +1;
            }
            self.init();
            self.mouseover();
        };
    }
};