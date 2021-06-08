// Last Modification : 2021.06.08
// by HYOSITIVE
// based on WEB5 - Passport.js - 10

module.exports = function(app) {
	
	var authData = { // 실제 구현에서는 사용자 정보 주로 데이터베이스에 보관
		email:'hyositive_test@gmail.com',
		password:'111111',
		nickname:'hyositive'
	};
	
	// passport는 session을 내부적으로 사용하기 때문에, session을 활성화시키는 코드 다음에 passport 코드가 위치해야 한다.
	var passport = require('passport')
		, LocalStrategy = require('passport-local').Strategy;

	app.use(passport.initialize()); // passport middleware Express에 설치
	app.use(passport.session()); // passport를 통해 session 사용

	passport.serializeUser(function(user, done) { // 로그인이 성공했을 때, 사용자의 식별자를 session store에 저장. serializeUser은 최초 로그인 성공 시 1회만 호출. 인증 성공 시, authData가 serializeUser의 callback 함수의 user에 들어감
		done(null, user.email); // session 데이터로 user.email 전송
	});

	passport.deserializeUser(function(id, done) { // 로그인 성공 후 다른 페이지에 방문할 때 마다 로그인 한 사용자인지 체크. 사용자 정보 조회를 위해 페이지에 방문할 때마다 deserializeUser 호출. 이를 위해 done의 인자에 원본 데이터 제공
		done(null, authData); // done의 두 번째 인자로 주입한 유저 정보(authData)가 request의 user라는 객체로 전달
	});

	passport.use(new LocalStrategy(
		{ // passport local 인증을 위한 기본 데이터명은 'username', 'password'이지만, 직접 작성한 프로그램에서는 'email'과 'pwd'를 사용하므로, 명시적으로 알려줘야 함
			usernameField: 'email',
			passwordField: 'pwd'
		},
  		function(username, password, done) {
	  		if (username === authData.email) {
		  		if(password === authData.password) { // 인증 성공
			  		return done(null, authData, {message: 'Welcome' }); // serializeUser의 callback 함수 호출
		  		}
		  		else { // 잘못된 password 입력
			  		return done(null, false, { message: 'Incorrect password.' });
		  		}
	  		}
	  		else { // 잘못된 email 입력
		  		return done(null, false, { message: 'Incorrect username.' });
	  		}
  		}
	));
	return passport;
}
