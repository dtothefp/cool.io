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
        console.log("CONNECTED IN CHECK LOGIN STATUS", response);
        // SET THE SESSION -- WE KNOW THE USER ALREADY EXISTS
        var token = response.authResponse.accessToken;
        var tokenExpires = response.authResponse.expiresIn;
        CoolioApp.Session.save({fb_id: response.authResponse.userID, oauth_token: response.authResponse.accessToken, oauth_expires_at: response.authResponse.expiresIn}, {
          success: function(response) {
            // console.log("SESSION ESTABLISHED", response.get("id"));
            // FETCH THE CURRENT USER DATA
            CoolioApp.currentUserModel.set({id: response.get("id"), oauth_token: token, oauth_expires_at: tokenExpires});
            console.log("CURRENT USER MODEL IN THE CHECK LOGIN FUNCTION", CoolioApp.currentUserModel.attributes);
            CoolioApp.currentUserModel.fetch({
              success: function(response) {
                console.log("CURRENT USER FETCHED IN MAIN.JS", response.attributes);
              },
              error: function(response) {
                console.log("ERROR FETCHING CURRENT USER IN MAIN.JS");
              }
            });
          }, 
          error: function(response) {
            console.log("ERROR INITIATING SESSION");
          }
        });
      } else if (response.status === 'not_authorized') {
        console.log("LOGGED INTO FB BUT NOT AUTHORIZED ON APP");
        Backbone.history.navigate("welcome", {trigger: true});
      } else {
        console.log("NOT LOGGED IN");
        Backbone.history.navigate("welcome", {trigger: true});
      }
    });
  }

} 


