import passport from '../helpers/passport';

let login = (req, res, next)=>{
  var url = req.query.redirect_to || '/';
  passport.authenticate('local')(req, res, next);
}

let logout = (req, res, next)=>{
  req.logout();
  res.redirect('/');
}

let ensure = (req, res, next)=>{
  if (req.isAuthenticated())
    return next();
  else {
    var redirect;
    if (!req.query.redirect_to)
      redirect = req.protocol + '://' + req.get('host') + req.originalUrl;
    else
      redirect = req.query.redirect_to;
    res.redirect(`/login?redirect_to=${redirect}`);
  }
}

let auth = {
  login,
  logout,
  ensure
}

export default auth;
