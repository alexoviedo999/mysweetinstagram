var ig = require('instagram-node').instagram();

ig.use({
  client_id: 'bbf0db19536440e5a4e639c862db3998',
  client_secret: 'ce657a84880f4a5f8c474a9dfe78ac41'
});

module.exports.create = function (app) {
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




