const postcssFlexboxfixer = require('postcss-flexboxfixer');
const autoprefixer = require('autoprefixer');

module.exports = {
  plugins: [
    postcssFlexboxfixer,
    autoprefixer({
      browsers: ['> 1%', 'last 2 versions']
    })
  ]
};