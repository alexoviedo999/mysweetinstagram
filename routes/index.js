var ig = require('instagram-node').instagram();
    db = require('../models');
    conf = require('../conf');

ig.use({
  client_id: 'bbf0db19536440e5a4e639c862db3998',
  client_secret: 'ce657a84880f4a5f8c474a9dfe78ac41'
});

module.exports.create = function (app) {
  app.get('/authorize', function(req, res) {
    res.redirect(ig.get_authorization_url('http://application-name.alexoviedo999.jit.su/handleAuth', {scope: ['basic']}))
  });

  app.get('/handleAuth', function(req, res){
    ig.authorize_user(req.query.code, 'http://application-name.alexoviedo999.jit.su/handleAuth', function(err, result) {
      console.log(err)
      console.log(result)
      var username = result.user.username;
      var name = result.user.full_name;
      var access_token = result.access_token;
      var bio = result.user.bio;
      var profile_picture = result.user.profile_picture;
      var id = result.user.id;

      db.User.findOne({username: username}, function(err,user){
        if (!user) {
          user = new db.User();
          user.username = username;
        }
        user.bio = bio;
        user.accessToken = access_token;
        user.profileImage = profile_picture;
        user.name = name;
        user.id = id;

        user.save(function(err) {
          req.session.user = user;

          res.redirect('/followers');
        });
      });
    });
  });

   app.get('/followers', function(req, res){
    var user = req.session.user;

    ig.user_followers(user.id, function(err, followers, pagination, limit) {
      var followersCount = followers.length;

      ig.user_follows(user.id, function(err, follows, pagination, limit){
        // var followingCount = follows.length;

        res.render('followers', {
          followers: followers,
          follows: follows,
          followersCount: followersCount,
          //followingCount: folowingCount,
          title: 'Followers'
        })
      })
    })
   })

   app.get('/', function (req, res) {
      res.render('index', {
        title: "home"
      });
    });

  app.get('/explore', function (req, res, next){
    ig.media_popular(function(err, medias, limit) {
      res.render('explore', {
        title: 'Exlore Page',
        medias: medias
      });
    });
  });

  app.get('/location/:latitude/:longitude', function (req, res, next) {
    var lat = Number(req.param('latitude'))
    var lng = Number(req.param('longitude'))

  ig.location_search({ lat: lat, lng: lng }, function(err, result, limit) {
      if (err) {
        console.log(err);
        return next(err);
      }

      if (result.length == 0) {
        return res.send('empty');
      }

      var location = result[0]

      ig.location_media_recent(location.id, function(err, result, pagination, limit) {
  if (err) {
    console.log(err);
    return next(err);
  }

        console.log(require('util').inspect(result));
        console.log(require('util').inspect(limit));

        res.render('location', {
          title: 'location',
          medias: result,
          location: location
        });
      });
    });
  });
}




