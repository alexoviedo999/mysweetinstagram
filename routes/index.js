var ig = require('instagram-node').instagram();

ig.use({
  client_id: 'bbf0db19536440e5a4e639c862db3998',
  client_secret: 'ce657a84880f4a5f8c474a9dfe78ac41'
});

module.exports.create = function (app) {
  app.get('/', function (req, res) {
    res.render('index', {
      title: "test"
    });
  });

  app.get('/explore', function (req, res, next){
    ig.media_popular(function(err, medias, limit) {
      res.json(medias);
    });
  });
}
