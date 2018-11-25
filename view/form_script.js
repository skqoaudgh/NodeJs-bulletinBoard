var myform = document.getElementById('myform');

var erorr_msg = document.getElementById('error');

var _error_code = document.getElementById('get_error');
var error_code = _error_code.innerHTML;
if(error_code == 1 || error_code == 2  || error_code == 4) {
    $('form').animate({height: "toggle", opacity: "toggle"},"slow");
}

$('.message span').click(function(){
    $('form').animate({height: "toggle", opacity: "toggle"},"slow");
    erorr_msg.innerHTML = ' ';
 });

 function Regcheck() {
    if(myform.action == '/regist')
    {
        var exp_email = /^[-A-Za-z0-9_]+[-A-Za-z0-9_.]*[@]{1}[-A-Za-z0-9_]+[-A-Za-z0-9_.]*[.]{1}[A-Za-z]{1,5}$/;
        var exp_name = /^[A-za-z0-9]/g;
        var exp_nick = /^[ㄱ-ㅎ|가-힣|a-z|A-Z|0-9|\*]+$/;

        var email = document.getElementById('reg_email');
        var name = document.getElementById('reg_id');
        var nick = document.getElementById('reg_nick');
        var password = document.getElementById('reg_pwd');

        if(exp_name.test(name.value) == false) {
            erorr_msg.innerHTML = '아이디에는 숫자와 영어만 들어갈 수 있습니다.';
            return false;
        }
        else if(exp_nick.test(nick.value) == false) {
            erorr_msg.innerHTML = '닉네임에는 숫자와 영어만 들어갈 수 있습니다.';
            return false;
        }
        else if(password.value.length < 6) {
            erorr_msg.innerHTML = '비밀번호가 너무 짧습니다.';
            return false;
        }
        else if(exp_email.test(email.value) == false) {
            erorr_msg.innerHTML = '이메일 형식이 옳바르지 않습니다.';
            return false;
        }
        else if(error_code != 4) {
            erorr_msg.innerHTML = '이메일이 인증되지 않았습니다.';
            return false;
        }
    }
    return true;
}


function custom_submit(str) {
    if(str == 'verify')
    {
        myform.action = '/requestMail';
        myform.target = 'temp_frame';
    }
    else if(str == 'create')
    {
        myform.action = '/regist';
    }
    myform.submit();
}