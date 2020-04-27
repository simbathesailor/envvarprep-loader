import * as React from 'react';
export var SOMEPARAM = `I am param two`;
console.log('SOMEPARAM outside', SOMEPARAM);

function App() {
  console.log(process.env.NODE_ENV);
  console.log('SOMEPARAM inside', SOMEPARAM);
  console.log(`I am param three`);
  return React.createElement(
    'div',
    {
      className: 'App',
    },
    `I am param three` === 'I AM PARAM THREE' &&
      React.createElement('p', null, 'Conditional got rendered')
  );
}
export default App;
