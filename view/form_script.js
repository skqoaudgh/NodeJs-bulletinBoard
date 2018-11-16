$('.message a').click(function(){
    $('form').animate({height: "toggle", opacity: "toggle"},"slow");
 });
 function check() {
    var exp_email = /^[-A-Za-z0-9_]+[-A-Za-z0-9_.]*[@]{1}[-A-Za-z0-9_]+[-A-Za-z0-9_.]*[.]{1}[A-Za-z]{1,5}$/;
    var exp_name = /^[A-za-z0-9]/g;

    var erorr_msg = document.getElementById('error');
    var email = document.getElementById('reg_email');
    var name = document.getElementById('reg_id');
    var password = document.getElementById('reg_pwd');

    if(exp_name.test(name.value) == false) {
        erorr_msg.innerHTML = '아이디에는 숫자와 영어만 들어갈 수 있습니다.';
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
    return true;
}