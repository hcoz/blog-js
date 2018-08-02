exports.catchError = (err, res) => {
  console.error(err);

  if (err.name === 'TokenExpiredError')
    res.status(401).json({ 'message': 'Your session is expired, need to login again.', 'redirect': '/' });
  else
    res.status(400).json({ 'message': 'An error occured' });
};
