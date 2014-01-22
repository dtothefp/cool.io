// NAMESPACE THE APP
var CoolioApp = {
  Models:       {}, 
  Collections:  {},
  Views:        {},
  Router:       null,
  initialize:   function() {
    CoolioApp.currentUserModel = new CoolioApp.Models.User();
    CoolioApp.Session = new CoolioApp.Models.Session();
    new CoolioApp.Router();
    Backbone.history.start();
  }, 
  checkLoginStatus: function() {
    
    FB.getLoginStatus(function(response) {
      if (response.status === 'connected') {
        // SET THE SESSION -- WE KNOW THE USER ALREADY EXISTS
        var token = response.authResponse.accessToken;
        var tokenExpires = response.authResponse.expiresIn;
        CoolioApp.Session.save({fb_id: response.authResponse.userID, oauth_token: response.authResponse.accessToken, oauth_expires_at: response.authResponse.expiresIn}, {
          success: function(response) {
            // FETCH THE CURRENT USER DATA
            console.log(response);
            CoolioApp.currentUserModel.set({id: response.get("id"), oauth_token: token, oauth_expires_at: tokenExpires, returning_user: response.get("returning_user")});
            CoolioApp.currentUserModel.fetch({
              success: function(response) {
                Backbone.history.navigate("user/" + CoolioApp.currentUserModel.get("id"), {trigger: true});
              },
              error: function(response) {
              }
            });
          }, 
          error: function(response) {
            alert("User Does Not Exist, Please Signup");
          }
        });
      } else if (response.status === 'not_authorized') {
        Backbone.history.navigate("welcome", {trigger: true});
      } else {
        Backbone.history.navigate("welcome", {trigger: true});
      }
    });
  }

} 



