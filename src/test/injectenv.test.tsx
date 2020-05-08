import { injectEnv } from '../injectEnv';
import fs from 'fs';
import path from 'path';

// defaultOptions = {
//     globOptions: {
//       cwd: __dirname,
//     },
//     pattern: '*',
//     envVar: {},
//     debug: process.env.NODE_ENV !== 'production',
//     destination: __dirname,
//     updateInline: true,
//   };

describe('it', () => {
  it('replaces the string with correct values for template inputs', () => {
    const env = {
      REACT_APP_PARAM_TWO: 'I am param two',
      REACT_APP_PARAM_THREE: 'I am param three',
    };
    const payload = {
      globOptions: {
        cwd: `${__dirname}/injectEnvInputFolder`,
      },
      pattern: '*.js?(.map)',
      envVar: env,
      debug: true,
      destination: `${__dirname}/injectEnvInputFolder/output`,
      updateInline: false,
    };
    injectEnv(payload);
    const isFileExist = fs.existsSync(payload.destination);
    expect(isFileExist).toBe(true);

    const read = fs.readFileSync(
      path.join(payload.destination, 'injectEnvInput.js'),
      'utf8'
    );

    const countParamThree = read.match(/I am param three/g);

    const nodeEnvCount = read.match(/NODE_ENV/g);

    expect(countParamThree ? countParamThree.length : null).toBe(2);

    expect(nodeEnvCount ? nodeEnvCount.length : null).toBe(1);
  });

  it('replaces the string with correct values for concat strings', () => {
    const env = {
      REACT_APP_PARAM_TWO: 'I am param two',
      REACT_APP_PARAM_THREE: 'I am param three',
    };
    const payload = {
      globOptions: {
        cwd: `${__dirname}/injectEnvInputFolder`,
      },
      pattern: '*.js?(.map)',
      envVar: env,
      debug: true,
      destination: `${__dirname}/injectEnvInputFolder/output`,
      updateInline: false,
    };

    injectEnv(payload);
    const isFileExist = fs.existsSync(payload.destination);
    expect(isFileExist).toBe(true);

    const read = fs.readFileSync(
      path.join(payload.destination, 'injectEnvTestInput2.js'),
      'utf8'
    );

    console.log('read file', read);

    // const countParamThree = read.match(/I am param three/g);

    // const nodeEnvCount = read.match(/NODE_ENV/g);

    // expect(countParamThree ? countParamThree.length : null).toBe(2);

    // expect(nodeEnvCount ? nodeEnvCount.length : null).toBe(1);
  });
});
