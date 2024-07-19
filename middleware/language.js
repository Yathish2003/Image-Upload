const fs = require('fs');
const path = require('path');

module.exports = function(req, res, next) {
  const lang = req.cookies.lang || 'en';
  const filePath = path.join(__dirname, '..', 'locales', `${lang}.json`);
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading language file:', err);
      return next();
    }
    res.locals.translations = JSON.parse(data);
    next();
  });
};
