import compiler from '../../compiler';
// import { Thing } from '../src';

describe('it', () => {
  it('Replacement count is right for _INTERNAL__process.env substr', async () => {
    const stats = await compiler('input.tsx');
    // jest.setTimeout(30000);
    // @ts-ignore
    const output = stats.toJson().modules[1].source;
    console.log('output', output);
    expect(output.match(/\$\$_INTERNAL__process.env/gi).length).toBe(4);
  });

  it('math.random replacement count is right for MATH_RANDOM_END & MATH_RANDOM_START', async () => {
    const stats = await compiler('input.tsx');
    // console.log('stats', stats);
    // @ts-ignore
    const output = stats.toJson().modules[1].source;
    console.log('output', output);
    expect(output.match(/MATH_RANDOM_END/gi).length).toBe(4);
    expect(output.match(/MATH_RANDOM_START/gi).length).toBe(4);
  });

  it('NODE_ENV is not replaced as it is in blacklist', async () => {
    const stats = await compiler('input.tsx');
    // console.log('stats', stats);
    // @ts-ignore
    const output = stats.toJson().modules[1].source;
    console.log('output', output);
    expect(output.match(/process.env.NODE_ENV/gi).length).toBe(1);
  });
});
