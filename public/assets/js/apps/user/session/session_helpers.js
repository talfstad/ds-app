define(["app"], function(Moonlander){
  Moonlander.session.isLoggedIn = function(){
	return (Moonlander.session.get("logged_in") ? true : false);
  }

  return Moonlander.session;
});