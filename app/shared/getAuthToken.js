const getAuthToken = req => {
  const token = req.cookies['auth-token'];
  return token || false;
}

module.exports = getAuthToken;