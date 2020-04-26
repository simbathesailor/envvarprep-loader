import * as React from 'react';
import { SOMEPARAM } from './consts';

console.log('SOMEPARAM outside', SOMEPARAM);

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
