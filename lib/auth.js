// Last Modification : 2021.06.08
// by HYOSITIVE
// based on WEB5 - Passport.js - 6

module.exports = {
	isOwner:function(request, response) {
		if (request.user) { // 로그인 성공 (passport에서는 request.user로 판단)
			return true;
		}
		else { // 로그인 실패
			return false;
		}
	},
	statusUI:function(request, response) {
		var statusUI = '<a href="/auth/login">login</a>' // 로그인 되지 않았을 때
		if (this.isOwner(request, response)) { // 로그인 되었을 때
			statusUI = `${request.user.nickname} | <a href="/auth/logout">logout</a>`; 
		}
		return statusUI;
	}
}
