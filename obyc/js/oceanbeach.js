$(function() {


  Parse.$ = jQuery;

  // Initialize Parse with your Parse application javascript keys
  Parse.initialize("9rLATExjPUM5V8e1bsOSAOVdlGNS0tAaUeGNFon6",
                   "lk2w0HTTsJpuhp0IPth8CtpDOeJMvoYA2u9lVk2J");


  // This is the transient application state, not persisted on Parse
  var AppState = Parse.Object.extend("AppState", {
    defaults: {
    }
  });


  var UserView = Parse.View.extend({
    events: {
      "click .log-out": "logOut"
    },

    el: ".content",

    initialize: function() {
      var self = this;

      _.bindAll(this, 'logOut');

      // Main user template
      this.$el.html(_.template($("#user-template").html()));

      this.$('#side-menu').metisMenu();

      this.render();
    },

    // Logs out the user and shows the login view
    logOut: function(e) {
      Parse.User.logOut();
      new LogInView();
      this.undelegateEvents();
      delete this;
    },

    render: function() {
      this.delegateEvents();



    }
  });

  var LogInView = Parse.View.extend({
    events: {
      "submit form.form-signin": "logIn",
      "click .signup-link": "goToSignUp"
    },

    el: ".content",

    initialize: function() {
      _.bindAll(this, "logIn", "goToSignUp");
      this.render();
    },

    logIn: function(e) {
      var self = this;
      var username = this.$("#inputEmail").val();
      var password = this.$("#inputPassword").val();

      Parse.User.logIn(username, password, {
        success: function(user) {
          new UserView();
          self.undelegateEvents();
          delete self;
        },

        error: function(user, error) {
          self.$(".form-signin .error").html("Invalid username or password. Please try again.").show();
          self.$(".form-signin button").removeAttr("disabled");
        }
      });

      this.$(".form-signin button").attr("disabled", "disabled");

      return false;
    },

    goToSignUp: function(e) {
      var self = this;
      new SignUpView();
      self.undelegateEvents();
      delete self;
    },


    render: function() {
      this.$el.html(_.template($("#login-template").html()));
      this.delegateEvents();
    }
  });



  var SignUpView = Parse.View.extend({
    events: {
      "submit form.form-signup": "signUp",
      "click .signin-link": "goToLogin"
    },

    el: ".content",

    initialize: function() {
      _.bindAll(this, "signUp", "goToLogin");
      this.render();
    },

    signUp: function(e) {
      var self = this;
      var username = this.$("#inputEmail").val();
      var password = this.$("#inputPassword").val();

      Parse.User.signUp(username, password, { ACL: new Parse.ACL() }, {
        success: function(user) {

          new UserView();

          self.undelegateEvents();
          delete self;
        },

        error: function(user, error) {
          self.$(".form-signup .error").html(_.escape(error.message)).show();
          self.$(".form-signup button").removeAttr("disabled");
        }
      });

      this.$(".form-signup button").attr("disabled", "disabled");

      return false;
    },

    goToLogin: function(e) {
      var self = this;
      new LogInView();
      self.undelegateEvents();
      delete self;
    },

    render: function() {
      this.$el.html(_.template($("#signup-template").html()));
      this.delegateEvents();
    }
  });




  // The main view for the app
  var AppView = Parse.View.extend({
    // Instead of generating a new element, bind to the existing skeleton of
    // the App already present in the HTML.
    el: $("#oceanbeachapp"),

    initialize: function() {
      this.render();
    },

    render: function() {
      if (Parse.User.current()) {
        new UserView();
      } else {
        new LogInView();
      }
    }
  });

  var AppRouter = Parse.Router.extend({
    routes: {
      "all": "all",
      "active": "active",
      "completed": "completed"
    },

    initialize: function(options) {
    },

    all: function() {
      state.set({ filter: "all" });
    },

    active: function() {
      state.set({ filter: "active" });
    },

    completed: function() {
      state.set({ filter: "completed" });
    }
  });

  var state = new AppState;

  new AppRouter;
  new AppView;
  Parse.history.start();

});