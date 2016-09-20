slideCalendar.prototype = {
    //初始化
    init:function(){
        this.initNewDate();
        this.slide();
        this.click();
    },
    //保存年，月，日，方便后续调用
    keepNewDate:[],
    //上下滑动选择
    slide: function () {
        //定时器

        var timer5 = {};
        var ul = this.id;
        var slideCalendar = this;
        ul.addEventListener("touchstart", function (e) {
            e = e || event;
            var slideUl = e.target.parentNode.getAttribute("class");
            if (slideUl == "date-year" || slideUl == "date-month" || slideUl == "date-day") {
                //获取首次触碰的坐标，后续计算移动的距离
                var jl = e.touches[0].pageY;
                var eNumber = e.target.parentNode.getAttribute("style");
                e.preventDefault();
                e.stopPropagation();
                //手指移动时，不断刷新当前元素的坐标
                ul.addEventListener("touchmove", function (e) {
                    e  =  e || event;
                    e.stopPropagation();
                    var slideUl = e.target.parentNode.getAttribute("class");
                    if (slideUl == "date-year" || slideUl == "date-month" || slideUl == "date-day") {
                        var top = -(jl-e.touches[0].pageY)/2;
                        if(eNumber){
                            var sum  = Math.round(parseFloat(eNumber.slice("4","-2")))+top;
                            e.target.parentNode.setAttribute("style","top:"+sum+"px");
                        }else{
                            e.target.parentNode.setAttribute("style","top:"+top+"px");
                        }
                    }
                })
            }
        });
        ul.addEventListener("touchend",function(e){
            e = e || event;
            e.stopPropagation();
            var slideUl = e.target.parentNode.getAttribute("class");
            if (slideUl == "date-year" || slideUl == "date-month" || slideUl == "date-day") {
                var ul =e.target.parentNode;
                var timerNumber = 0;
                var liHeight = e.target.offsetHeight;
                var eNumber = ul.getAttribute("style");
                var sum = Math.round(parseFloat(eNumber.slice("4","-2")) );
                var reduce = Math.round(sum/liHeight)*liHeight;
                var reduceSum = reduce-sum;
                //限制拖动的范围，超出最大距离，进行回滚
                var limitHeight = -(ul.offsetHeight - ul.parentNode.offsetHeight);
                var newTop = ul.getAttribute("style");
                var newSum = Math.round(parseFloat(newTop.slice("4","-2")));
                var round = Math.round(newSum/liHeight)*liHeight;
                if(newSum>e.target.offsetHeight){
                    //每次触发时先清除定时器
                   clearInterval(timer5[ul.getAttribute("id")]);
                    timer5[ul.getAttribute("id")] = setInterval(function(){
                        var newENumber = ul.getAttribute("style");
                        var newSum =  Math.round(parseFloat(newENumber.slice("4","-2")));
                        var jg = (e.target.offsetHeight-newSum)/8;
                        var njl = jg > 0 ? Math.ceil(jg):Math.floor(jg);
                        ul.setAttribute("style","top:"+Math.ceil(njl+newSum)+"px");
                        if(njl >= 0){
                            clearInterval(timer5[ul.getAttribute("id")]);
                            var selectNumber =  Math.round(parseFloat(ul.getAttribute("style").slice("4","-2")));
                            slideCalendar.slideDate(selectNumber,e,ul);
                            timer5[ul.getAttribute("id")] = null;
                        }
                    },"10");
                }
                else if(round < limitHeight-e.target.offsetHeight){
                        //每次触发时先清除定时器
                        clearInterval(timer5[ul.getAttribute("id")]);
                        timer5[ul.getAttribute("id")] = setInterval(function(){
                        var newENumber = ul.getAttribute("style");
                        var newSum = Math.round(parseFloat(newENumber.slice("4","-2")));
                        var offParentHeight = -( ul.offsetHeight - e.target.offsetHeight -e.target.offsetHeight);
                        var jg = (offParentHeight-newSum)/8;
                        var njl = jg > 0 ?Math.ceil(jg):Math.floor(jg);
                            ul.setAttribute("style","top:"+Math.ceil(njl+newSum)+"px");
                        if(njl == offParentHeight || njl==0){
                            clearInterval(timer5[ul.getAttribute("id")]);
                            var selectNumber = Math.round(parseFloat(ul.getAttribute("style").slice("4","-2")));
                            slideCalendar.slideDate(selectNumber,e,ul);
                            timer5[ul.getAttribute("id")] = null;
                        }
                    },"10");
                }
                else{
                    //每次触发时先清除定时器
                    clearInterval(timer5[ul.getAttribute("id")]);
                    //当手指离开屏幕时，触发回调动画效果
                    timer5[ul.getAttribute("id")] = setInterval(function(){
                        if(reduceSum >= (1)){
                            timerNumber =timerNumber+1;
                        }
                        else if(reduceSum == 0){
                            clearInterval(timer5[ul.getAttribute("id")]);
                            timerNumber = 0;
                        }
                        else if(reduceSum <= (-1)){
                            timerNumber =timerNumber-1;
                        }
                        ul.setAttribute("style","top:"+Math.ceil(sum+timerNumber)+"px");
                        if(reduceSum == timerNumber){
                            clearInterval(timer5[ul.getAttribute("id")]);
                            var selectNumber =  Math.round(parseFloat(ul.getAttribute("style").slice("4","-2")));
                            slideCalendar.slideDate(selectNumber,e,ul);
                            timerNumber=0;
                            timer5[ul.getAttribute("id")] = null;
                        }
                    },"10");
                }
            }
        })
    },
    //滑动时，判断坐标，获取当前时间
    slideDate:function(slectNumber,e,ul){
        /*获取父元素的高度+当前top的偏移量，再获取父元素的高度+额外一个子元素的高度（因为是要取居中li的坐标）。两者向减，
         最后除以li的高度，并转换成绝对值，得到当前坐标的索引值*/
        var thisIndex =  Math.abs(((ul.offsetHeight + slectNumber) - (ul.offsetHeight+ e.target.offsetHeight)) / e.target.offsetHeight);
        var liLen = ul.getElementsByTagName("li");
        for(var i= 0,item=liLen.length;i<item;i++){
            liLen[i].setAttribute("class","");
        }
        if(liLen[thisIndex]){
        liLen[thisIndex].setAttribute("class","select");
        if(ul.getAttribute("class") == "date-year"){
            this.keepNewDate[0] =  liLen[thisIndex].innerText;
        }else if(ul.getAttribute("class") == "date-month"){
            this.keepNewDate[1] =  liLen[thisIndex].innerText;
        }else{
            this.keepNewDate[2] =  liLen[thisIndex].innerText;
        }
        this.month(liLen[thisIndex],e.target.offsetHeight);
        }
    },
    //初始化内容
    initNewDate:function(){
        //初始化结构
        var slideCalendar = this.id;
        slideCalendar.innerHTML ="<div class='control'><span id='Calendar-hidden'>取消</span><span id='Calendar-confirm'>确定</span></div><ul class='date-tile'><li>年</li><li>月</li><li>日</li></ul><div class='date-d'> <ul class='date-year' id='date-year'></ul><ul class='date-month' id='date-month'></ul><ul class='date-day' id='date-day'></ul>";
        //初始化年份
        var year = document.getElementById("date-year");
        year.innerHTML = null;
        for(var i=this.year[0];i<=this.year[1];i++){
            year.innerHTML += "<li>"+i+"</li>";
        }
        this.keepNewDate[0] = this.initDate.getFullYear();
        this.keepNewDate[1] = this.initDate.getMonth()+1;
        this.keepNewDate[2] = this.initDate.getDate();
        //初始化月份
        var month = document.getElementById("date-month");
        month.innerHTML = null;
        for(var z=1;z<13;z++){
            month.innerHTML += "<li>"+z+"</li>";
        }
        var day = document.getElementById("date-day");
        day.innerHTML=null;
        //初始化天数
        for(var d=1;d<32;d++){
            var newDate = new Date(this.keepNewDate[0],this.keepNewDate[1],d);
            if(d>25 && newDate.getDate()<5){
                continue;
            }
            day.innerHTML+="<li>"+newDate.getDate()+"</li>";
        }
        this.initTop(year,this.keepNewDate[0]);
        this.initTop(month,this.keepNewDate[1]);
        this.initTop(day,this.keepNewDate[2]);
        //初始化完毕之后，手动清除初始化方法
        this.initTop = null;
    },
    //初始化年、月、日
     initTop:function(li,dateNumber){
     var monthLi = li.getElementsByTagName("li");
     for(var m= 0,item2=monthLi.length;m<item2;m++){
        if(monthLi[m].innerText ==  dateNumber){
            var top2 = m * monthLi[m].offsetHeight -monthLi[m].offsetHeight;
            monthLi[m].setAttribute("class","select");
            li.setAttribute("style","top:"+(-top2)+"px");
            break;
        }
    }
},
    //滑动年or月时，重置天
    month:function(date1,liheight){
        if(date1.parentNode.getAttribute("class") == "date-month"){
            this.day(date1,this.keepNewDate[0],liheight);
        }else if(date1.parentNode.getAttribute("class") == "date-year"){
            this.day(this.keepNewDate[1],this.keepNewDate[0],liheight);
        }
    },
    //月份改变，天数变化
    day:function(date,dateN,liheight){
        var newday = this;
        var celaerTimeout1 = setTimeout(function(){
            var day = document.getElementById("date-day");
            day.innerHTML = null;
            for(var i=1;i<32;i++){
                if(date.innerText){
                    var newDate = new Date(dateN,date.innerText-1,i);
                }else{
                    var newDate = new Date(dateN,date-1,i);
                }
                if(i>25 && newDate.getDate()<5){
                    continue;
                }
                day.innerHTML+="<li>"+newDate.getDate()+"</li>";
            }
            //防止当前天数的高小于top的值
            var dateDay = document.getElementById("date-day");
            if(dateDay.getAttribute("style")){
                var dayTop = dateDay.getAttribute("style");
                var dateDayTop  = Math.round(parseFloat(dayTop.slice("4","-2")));
                if(dateDay.offsetHeight-liheight <= Math.abs(dateDayTop)){
                    dateDay.setAttribute("style","top:"+(-(dateDay.offsetHeight-liheight*2))+"px");
                }
                //当坐标改变时，重新获取当前坐标内天数的值
                var newTop = Math.round(parseFloat(dateDay.getAttribute("style").slice("4","-2")));
                var reduce1 = Math.round(newTop/liheight)*liheight;
                var thisIndex =  Math.abs(((dateDay.offsetHeight + reduce1) - (dateDay.offsetHeight+ liheight)) / liheight);
                if(dateDay.getElementsByTagName("li")[thisIndex]){
                    dateDay.getElementsByTagName("li")[thisIndex].setAttribute("class","select");
                    newday.keepNewDate[2] = dateDay.getElementsByTagName("li")[thisIndex].innerText;
                }
            }
            clearTimeout(celaerTimeout1);
        },100)
},
    //绑定到input上，点击显示
    click:function(){
        var Calendar = this;
        Calendar.id.setAttribute("style","display:none");
        this.binding.addEventListener("click",function(){
            Calendar.id.setAttribute("style","display:block");
        });
        document.getElementById("Calendar-hidden").addEventListener("click",function(){
            Calendar.id.setAttribute("style","display:none");
        })
        document.getElementById("Calendar-confirm").addEventListener("click",function(){
            Calendar.binding.value = Calendar.keepNewDate.join("-");
            Calendar.id.setAttribute("style","display:none");
        })
    }
};
var Calendar = new slideCalendar();
Calendar.init();