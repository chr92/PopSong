// Iron router Routes
Router.configure({
  layoutTemplate: 'main'
})
Router.route('/leaderboard', {
  template: 'scores'
});
Router.route('/', {
  template: 'home'
});

// This shouldn't be hardcoded
auto_clickers = [{name: "YouTube Subscriber", cost:500},
            {name: "Radio Feature", cost:1000},
            {name: "Blog Interview", cost:2000},
            {name: "Magazine Cover", cost:10000},
            {name: "Record Deal", cost:25000},
            {name: "Festival Tiny Stage", cost: 50000},
            {name: "Sold out Show", cost: 200000},
            {name: "Guests on Radio Show", cost: 1000000},
            {name: "Hardcore Fans", cost: 10000000},
            {name: "Festival Headliner", cost: 50000000},
            {name: "World Tour", cost: 200000000}
        ];

Items = [{name: "", cost:100},
         {name: "", cost:500},
         {name: "", cost: 1000},
         {name: "", cost: 2000}
        ];

if (Meteor.isClient) {
  Meteor.subscribe('userData');

  Accounts.ui.config({
    passwordSignupFields: 'USERNAME_ONLY'
  });

  Template.write_song.user = function () {
    return Meteor.user();
  };

  Template.write_song.events({
    'click input.code': function () {
      Meteor.call('click');
    }
  });

  Template.shop.auto_clickers = function () {
    // Make this a collection
    return auto_clickers;
  };

  Template.shop.events({
    'click input.buy': function (event) {
      Meteor.call('buy', event.target.id);
    }
  });

  Template.scores.players = function () {
    return Meteor.users.find({}, {sort: {'money' : -1}});
  }
  
}

if (Meteor.isServer) {
  
  Accounts.onCreateUser(function(options,user){
    if (user.username == null) {
      user.username = user.services.facebook.name
    } else {
      
    };
    user.money = 0;
    user.rate = 0;
    return user;
  });

  Meteor.publish("userData", function() {
    return Meteor.users.find({}, {sort: {'money' : -1}});
  });

  Meteor.startup(function () {
    Meteor.setInterval(function() {
      Meteor.users.find({}).map(function(user) {
        Meteor.users.update({_id: user._id}, {$inc: {'money': user.rate}})
      })
    }, 1000)
  });
}

Meteor.methods({
  click: function () {
    Meteor.users.update({_id: this.userId},  {$inc: {'money' : 25}});
  },

  buy: function(amount){
    if(Meteor.user().money >= amount && amount > 0)
      Meteor.users.update({_id: this.userId}, {$inc: {'rate': (Math.floor(amount/500)), 'money': (0-amount)}});
    },
})
