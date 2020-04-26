import compiler from '../compiler';
// import { Thing } from '../src';

describe('it', () => {
  it('renders without crashing', async () => {
    const stats = await compiler('input.tsx');
    console.log('stats', stats);
    // @ts-ignore
    const output = stats.toJson().modules[0].source;

    expect(output).toBe('export default "Hey Alice!\\n"');
  });
});
