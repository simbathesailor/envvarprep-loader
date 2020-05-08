var Terser = require('terser');

const code = `
(this['webpackJsonppoc-separate-env-injection'] =
  this['webpackJsonppoc-separate-env-injection'] || []).push([
  [0],
  [
    ,
    ,
    ,
    function(e, n, o) {
      e.exports = o.p + 'static/media/logo.5d5d9eef.svg';
    },
    function(e, n, o) {
      e.exports = o(11);
    },
    ,
    ,
    ,
    ,
    function(e, n, o) {},
    function(e, n, o) {},
    function(e, n, o) {
      'use strict';
      o.r(n);
      var t = o(0),
        a = o.n(t),
        r = o(2),
        c = o.n(r),
        s = (o(9), o(3)),
        l = o.n(s),
        A = (o(10), 'I am param two');
      console.log('SOMEPARAM outside', A);
      var i = function() {
        return (
          console.log('production'),
          console.log('SOMEPARAM inside', A),
          console.log('I am param three'),
          t.createElement(
            'div',
            { className: 'App' },
            t.createElement(
              'header',
              { className: 'App-header' },
              t.createElement('img', {
                src: l.a,
                className: 'App-logo',
                alt: 'logo',
              }),
              t.createElement(
                'p',
                null,
                'Edit ',
                t.createElement('code', null, 'src/App.js'),
                ' and save to reload.'
              ),
              t.createElement(
                'a',
                {
                  className: 'App-link',
                  href: 'https://reactjs.org',
                  target: '_blank',
                  rel: 'noopener noreferrer',
                },
                'Learn React'
              )
            ),
            'I AM PARAM THREE' === 'I am param three' &&
              t.createElement('p', null, 'COnditional got rendered')
          )
        );
      };
      'localhost' !== window.location.hostname &&
        '[::1]' !== window.location.hostname &&
        window.location.hostname.match(
          /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
        );
      c.a.render(
        a.a.createElement(a.a.StrictMode, null, a.a.createElement(i, null)),
        document.getElementById('root')
      ),
        'serviceWorker' in navigator &&
          navigator.serviceWorker.ready
            .then(function(e) {
              e.unregister();
            })
            .catch(function(e) {
              console.error(e.message);
            });
    },
  ],
  [[4, 1, 2]],
]);
//# sourceMappingURL=main.46f0c750.chunk.js.map


`;

// console.log(
//   babel.transformSync(
//     code,
//     {
//       plugins: [['minify-dead-code-elimination', {}]],
//     },
//     {
//       filename: 'test.js',
//     }
//   )
// );

// const code2 = `

// export const SOMEPARAM = process.env.REACT_APP_PARAM_TWO;

// // "I AM PARAM TWO",
// `;
var result = Terser.minify(code, {
  output: {
    ast: false,
    code: true, // optional - faster if false
  },
});
console.log('result', result);
