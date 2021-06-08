// Last Modification : 2021.06.05
// by HYOSITIVE
// based on WEB5 - Passport.js - 10

var express = require('express');
var router = express.Router(); // Router 메소드 호출 시 router라는 객체 return, main.js에서 express라는 모듈 자체는 app이라는 객체를 return
var path = require('path');
var fs = require('fs');
var sanitizeHtml = require('sanitize-html');
var template = require('../lib/template.js');

module.exports = function (passport) {
	router.get('/login', function(request, response) {
		var fmsg = request.flash();
		var feedback = '';
		if (fmsg.error) {
			feedback = fmsg.error[0];
		}
		var title = 'WEB - login';
		var list = template.list(request.list);
		var html = template.HTML(title, list, `
			<div style="color:red;">${feedback}</div>
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

	router.post('/login_process', // passport API (local)
  		passport.authenticate('local', { 
			successRedirect: '/',
			failureRedirect: '/auth/login',
			failureFlash:true,
			successFlash:true
	}));

	router.get('/logout', function(request, response) {
		request.logout();
		request.session.save(function() {
			response.redirect('/');
		});	
	});
	return router;
}