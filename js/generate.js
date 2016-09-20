
//生成canvas
function pageLoad(text){
    var package1 =  document.getElementById("code");
    package1.innerHTML = "";
    var can = document.createElement("canvas");
    package1.appendChild(can);
    can.setAttribute("id","code2");
    can.setAttribute("class","login-z");
    var cans = can.getContext('2d');
    cans.clearRect(0,0,100,100);
    cans.font = '500 22px  ';
    cans.scale(5,5);
    cans.textAlign = 'left';
    cans.textBaseline = 'top';
    cans.strokeStyle = '#6b8923';
    cans.transform(1.2,fRandomBy(0,0.4),fRandomBy(0,1),1,10,10);
    cans.strokeText(text, 0, 0);
}

//输出指定范围内的随机数
function fRandomBy(under, over){
    return (Math.random()*(over-under) + under).toFixed(1);
}

//生成验证码
var code;
function createCode(){
    code = "";
    var codeLength = 4;//验证码的长度
    var random = [1,2,3,4,5,6,7,8,9,'A','B','C','D','E','F','G','H','I','J','K','L','M','N','P','Q','R',
        'S','T','U','V','W','X','Y','Z'];//随机数
    for(var i = 0; i < codeLength; i++) {//循环操作
        var index = Math.floor(Math.random()*34);//取得随机数的索引（0~35）
        code += random[index];//根据索引取得随机数加到code上
    }
    pageLoad(code);
    //把code值赋给验证码
}

(function(){
    createCode();
    $("code").onclick = function(){
        createCode();
    };
    window.onkeydown = function(e){
        e = e || event;
       if(e.keyCode == "13"){
           $("login").onclick();
       }
    }
})();
function $(id){
    return document.getElementById(id);
}
$("login").onclick = function(){
        var account =$("account");
        var password = $("password");
        var code1 = $("code1");
        var prompt = $("prompt");
        if(!account.value ){
            prompt.innerText = "账户不能为空！";
            account.focus();
            return false;
        }else if(!password.value ){
            prompt.innerText = "密码不能为空！";
            password.focus();
            return false;
        }else if(!code1.value ){
            prompt.innerText = "验证码不能为空！";
            code1.focus();
            return false;
        }else if(code1.value.toUpperCase() != code.toUpperCase()){
            $("code1").value = "";
            prompt.innerText = "验证码输入错误，请重新输入！";
            createCode();
            return false;
        }
        $("login").submit();
};

window.onload = function(){
    $("account").focus();
};