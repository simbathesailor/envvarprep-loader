import * as React from 'react';
export var SOMEPARAM = `$$_INTERNAL__process.env.REACT_APP_PARAM_TWOMATH_RANDOM_START\${Math.random()}MATH_RANDOM_END$$_INTERNAL__`;
console.log('SOMEPARAM outside', SOMEPARAM);

function App() {
  console.log(process.env.NODE_ENV);
  console.log('SOMEPARAM inside', SOMEPARAM);
  console.log(
    `$$_INTERNAL__process.env.REACT_APP_PARAM_THREEMATH_RANDOM_START${Math.random()}MATH_RANDOM_END$$_INTERNAL__`
  );
  return React.createElement(
    'div',
    {
      className: 'App',
    },
    `$$_INTERNAL__process.env.REACT_APP_PARAM_THREEMATH_RANDOM_START${Math.random()}MATH_RANDOM_END$$_INTERNAL__` ===
      'I AM PARAM THREE' &&
      React.createElement('p', null, 'Conditional got rendered')
  );
}
export default App;
