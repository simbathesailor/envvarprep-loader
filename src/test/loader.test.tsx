import compiler from '../../compiler';
// import { Thing } from '../src';

describe('it', () => {
  it('process.env replacement count is right', async () => {
    const stats = await compiler('input.tsx');
    jest.setTimeout(30000);
    // @ts-ignore
    const output = stats.toJson().modules[1].source;
    console.log('output', output);
    expect(output.match(/\$\$_INTERNAL__process.env/gi).length).toBe(3);
    // expect(output).toBe(`import * as React from 'react';
    // export var SOMEPARAM = \`$$_INTERNAL__process.env.REACT_APP_PARAM_TWOMATH_RANDOM_START\${Math.random()}MATH_RANDOM_END$$_INTERNAL__\`;
    // console.log('SOMEPARAM outside', SOMEPARAM);

    // function App() {
    //   console.log(process.env.NODE_ENV);
    //   console.log('SOMEPARAM inside', SOMEPARAM);
    //   console.log(\`$$_INTERNAL__process.env.REACT_APP_PARAM_THREEMATH_RANDOM_START\${Math.random()}MATH_RANDOM_END$$_INTERNAL__\`);
    //   return React.createElement("div", {
    //     className: "App"
    //   }, \`$$_INTERNAL__process.env.REACT_APP_PARAM_THREEMATH_RANDOM_START\${Math.random()}MATH_RANDOM_END$$_INTERNAL__\` === 'I AM PARAM THREE' && React.createElement("p", null, "Conditional got rendered"));
    // }
    // export default App;`);
  });
  it('math.random replacement count is right', async () => {
    const stats = await compiler('input.tsx');
    // console.log('stats', stats);
    // @ts-ignore
    const output = stats.toJson().modules[1].source;
    console.log('output', output);
    expect(output.match(/MATH_RANDOM_END/gi).length).toBe(3);
    expect(output.match(/MATH_RANDOM_START/gi).length).toBe(3);
  });

  it('math.random replacement count is right', async () => {
    const stats = await compiler('input.tsx');
    // console.log('stats', stats);
    // @ts-ignore
    const output = stats.toJson().modules[1].source;
    console.log('output', output);
    expect(output.match(/MATH_RANDOM_END/gi).length).toBe(3);
    expect(output.match(/MATH_RANDOM_START/gi).length).toBe(3);
  });

  it('NODE_ENV is not replaces as it is in blacklist', async () => {
    const stats = await compiler('input.tsx');
    // console.log('stats', stats);
    // @ts-ignore
    const output = stats.toJson().modules[1].source;
    console.log('output', output);
    expect(output.match(/process.env.NODE_ENV/gi).length).toBe(1);
  });
});
