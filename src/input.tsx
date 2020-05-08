import * as React from 'react';

export const SOMEPARAM = process.env.REACT_APP_PARAM_TWO;

// @ts-ignore
const { REACT_APP_PARAM_THREE } = process.env;

console.log(REACT_APP_PARAM_THREE)
console.log('SOMEPARAM outside', SOMEPARAM);
// const { env } = process;
// const { REACT_APP_PARAM_TWO } = env;
// console.log('REACT_APP_PARAM_TWO HI ', REACT_APP_PARAM_TWO);

function App(): React.ReactElement {
  console.log(process.env.NODE_ENV);
  console.log('SOMEPARAM inside', SOMEPARAM);

  console.log(process.env['REACT_APP_PARAM_THREE']);

  return (
    <div className="App">
      {process.env['REACT_APP_PARAM_THREE'] === 'I AM PARAM THREE' && (
        <p>Conditional got rendered</p>
      )}
    </div>
  );
}

export default App;
