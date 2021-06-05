// Last Modification : 2021.06.05
// by HYOSITIVE
// based on WEB5 - Passport.js - 4.2

var express = require('express');
var router = express.Router(); // Router 메소드 호출 시 router라는 객체 return, main.js에서 express라는 모듈 자체는 app이라는 객체를 return
var path = require('path');
var fs = require('fs');
var sanitizeHtml = require('sanitize-html');
var template = require('../lib/template.js');

router.get('/login', function(request, response) {
	var title = 'WEB - login';
	var list = template.list(request.list);
	var html = template.HTML(title, list, `
		<form action="/auth/login_process" method="post">
			<p><input type ="text" name="email" placeholder="email"></p>
			<p><input type ="password" name="pwd" placeholder="password"></p>
			<p>
				<input type="submit" value="login">
			</p>
		</form>
	`, ''); // control이 존재하지 않기 때문에 argument에 공백 문자 입력
	response.send(html);
});

/*
router.post('/login_process', function(request, response) {
	var post = request.body; // bodyParser가 내부적으로 작동. callback 함수의 request의 body property에 parsing한 내용을 저장
	var email = post.email;
	var password = post.pwd;
	if (email === authData.email && password === authData.password) {
		request.session.is_logined = true;
		request.session.nickname = authData.nickname;
		request.session.save(function() { // session middleware는 기록한 데이터를 session store에 기록(메모리에 저장된 세션 데이터를 저장소에 반영)하는데, 기록 작업 종료 이전에 리다이렉션이 이루어질 경우 에러가 발생. 이를 방지하고자 save 함수로 기록하고, save가 끝난 경우 callback 함수로 리다이렉션을 진행
			response.redirect(`/`);
		});
	}
	else {
		response.send('Who?');
	}
});
*/

router.get('/logout', function(request, response) {
	request.session.destroy(function(err) {
		response.redirect('/');
	});
});

module.exports = router;