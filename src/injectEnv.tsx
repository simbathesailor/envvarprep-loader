import path from 'path';
import glob from 'glob';
import fs from 'fs';
// import * as BabelTypeModule from '@babel/types';
// import { parse } from '@babel/parser';
// import generator from '@babel/generator';
// import traverse from '@babel/traverse';
// import get from 'lodash/get';

// const envFromParamStore = {
// 	REACT_APP_PARAM_ONE: 'I AM PARAM ONE',

// 	REACT_APP_PARAM_TWO: 'I AM PARAM TWO',

// 	REACT_APP_PARAM_THREE: 'I AM PARAM THREE',
// };
// const read = fs.readFileSync("./testbuildfile.js", "utf8");
// console.log("read", read);

const defaultOptions = {
  globOptions: {
    cwd: __dirname,
  },
  pattern: '*',
  envVar: {},
  debug: process.env.NODE_ENV !== 'production',
  destination: __dirname,
  updateInline: true,
  getReplacementValue: () => '',
};

interface IEnvObj {
  [key: string]: string;
}

interface IgetReplacementValue {
  key?: string;
}
interface IInjectEnv {
  globOptions: glob.IOptions;
  envVar?: IEnvObj;
  debug?: boolean;
  destination?: string;
  pattern?: string;
  updateInline?: boolean;
  getReplacementValue?: (input: IgetReplacementValue) => string;
}

interface IAccRes {
  result: string[];
  remove?: boolean;
}
function injectEnv(options: IInjectEnv) {
  const {
    globOptions = defaultOptions.globOptions,
    envVar = defaultOptions.envVar,
    debug = defaultOptions.debug,
    pattern = defaultOptions.pattern,
    updateInline = defaultOptions.updateInline,
    getReplacementValue = defaultOptions.getReplacementValue,
  } = options;

  const { cwd = defaultOptions.globOptions.cwd } = globOptions;

  let envFromParamStore = envVar;

  let destination = options.destination || defaultOptions.destination;
  if (updateInline) {
    destination = cwd;
  }

  const Files = glob.sync(pattern, {
    cwd: cwd,
  });

  if (debug) {
    console.log('Files are ==>', Files); // got the files, not need to replace
  }

  Files.forEach(fileName => {
    let source = '';
    const pathToCheckAndUpdate = path.join(cwd, fileName);
    if (debug) {
      console.log('pathToCheckAndUpdate', pathToCheckAndUpdate);
    }

    const read = fs.readFileSync(pathToCheckAndUpdate, 'utf8');
    const divider = '$$_INTERNAL__';
    source = read;
    const extension = path.extname(pathToCheckAndUpdate);
    if (debug) {
      console.log('injectEnv -> extension', extension);
    }

    const noOfMatches = source.match(/\$\$_INTERNAL__/g);
    if (noOfMatches && noOfMatches.length > 1) {
      let changed = false;
      // start
      // if (extension === '.js') {
      //   const ast = parse(source, {
      //     sourceType: 'module',
      //     plugins: ['jsx'],
      //   });

      //   traverse(ast, {
      //     enter(path) {
      //       /**
      //        * For template literals
      //        */
      //       if (BabelTypeModule.isTemplateLiteral(path.node)) {
      //         // const quasis = path.node.quasis
      //         const leftQuasisValue = get(path.node, 'quasis[0].value', null);
      //         const rightQuasisValue = get(path.node, 'quasis[1].value', null);

      //         if (leftQuasisValue && rightQuasisValue) {
      //           const isLeftQuasisValid =
      //             leftQuasisValue.raw.startsWith('$$_INTERNAL__process.env') &&
      //             leftQuasisValue.raw.endsWith('MATH_RANDOM_START');
      //           const isRightQuasisValid = rightQuasisValue.raw.endsWith(
      //             'MATH_RANDOM_END$$_INTERNAL__'
      //           );

      //           if (isLeftQuasisValid && isRightQuasisValid) {
      //             let v = leftQuasisValue.raw;
      //             v = v.replace('$$_INTERNAL__process.env.', '');
      //             v = v.replace('MATH_RANDOM_START', '');
      //             // @ts-ignore
      //             const valueInParamStore = envFromParamStore[v.trim()];
      //             if (valueInParamStore !== undefined) {
      //               const MM = BabelTypeModule.stringLiteral(valueInParamStore);
      //               path.replaceWith(MM);
      //               changed = true;
      //             }
      //           }
      //         }
      //       }

      //       /**
      //        * For string formats
      //        */
      //       if (BabelTypeModule.isStringLiteral(path.node)) {
      //         // console.log(`String is: ==> ${path.node.value}`);

      //         if (path.node.value === 'MATH_RANDOM_END$$_INTERNAL__') {
      //           const MM = BabelTypeModule.stringLiteral('');
      //           path.replaceWith(MM);
      //           changed = true;
      //         }

      //         if (
      //           path.node.value.startsWith('$$_INTERNAL__process.env') &&
      //           path.node.value.endsWith('MATH_RANDOM_START')
      //         ) {
      //           let v = path.node.value;
      //           v = v.replace('$$_INTERNAL__process.env.', '');
      //           v = v.replace('MATH_RANDOM_START', '');

      //           if (v && v.trim()) {
      //             // @ts-ignore
      //             const valueInParamStore = envFromParamStore[v.trim()];
      //             if (valueInParamStore !== undefined) {
      //               const MM = BabelTypeModule.stringLiteral(valueInParamStore);
      //               path.replaceWith(MM);
      //               changed = true;
      //             }
      //           }
      //         }
      //       }
      //     },
      //   });

      //   source = generator(ast).code;
      // }

      /**
       * For cases when filee is not .js extension
       */
      const splitSource = source.split(divider);
      source = splitSource
        .reduce(
          (acc: IAccRes, elem) => {
            let stringToBeReplaced = elem;
            if (acc.remove) {
              // need to replace the extra ) added for concat

              stringToBeReplaced = stringToBeReplaced.replace(/\)/, '');
              // }
              acc.remove = false;
            }
            const ifElementStartsWithProcessEnv = elem.startsWith(
              'process.env.'
            );
            const indexOfMathRandomStart = elem.search('MATH_RANDOM_START');
            if (
              indexOfMathRandomStart !== -1 &&
              ifElementStartsWithProcessEnv
            ) {
              const temp = elem.slice(indexOfMathRandomStart);
              stringToBeReplaced = stringToBeReplaced.replace(temp, '');

              const splittedString = stringToBeReplaced.split('.');
              const [
                firstVariable,
                secondVariable,
                ThirdVariable,
              ] = splittedString;
              const isValidFirstVariable = firstVariable.trim() === 'process';
              const isValidSecondVariable = secondVariable.trim() === 'env';

              let paramValue: string | undefined =
                // @ts-ignore
                envFromParamStore[ThirdVariable.trim()] || undefined;
              if (debug) {
                console.log(
                  '🚀 ~ file: injectEnv.tsx ~ line 205 ~ injectEnv ~ paramValue',
                  ThirdVariable.trim(),
                  '||||',
                  paramValue
                );
              }

              if (getReplacementValue && !paramValue) {
                paramValue =
                  getReplacementValue({
                    key: ThirdVariable.trim(),
                  }) || '';
              }

              const isValidThirdVariable = paramValue !== undefined;
              if (
                isValidFirstVariable &&
                isValidSecondVariable &&
                isValidThirdVariable
              ) {
                if (paramValue !== undefined) {
                  acc.result.push(paramValue);
                }
                const countOfOpeningBrackets = temp.match(/\(/g);
                const countClosingBrackets = temp.match(/\)/g);
                if (
                  countOfOpeningBrackets &&
                  countClosingBrackets &&
                  countOfOpeningBrackets.length > countClosingBrackets.length
                ) {
                  acc.remove = true;
                }

                changed = true;
                return acc;
              }
            }

            acc.result.push(stringToBeReplaced);
            acc.remove = false;
            return acc;
          },
          { result: [], remove: false }
        )
        .result.join('');

      // end

      if (changed) {
        let pathToUpdate = updateInline
          ? pathToCheckAndUpdate
          : path.join(destination, fileName);

        // if (fs.existsSync(pathToUpdate)) {
        fs.writeFileSync(pathToUpdate, source, {
          flag: 'w+',
        });
        // }
        if (debug) {
          console.log('wrote to file', pathToUpdate);
        }
      }
    }
  });
  console.log('Successfully injected env to all the files ');
}

export { injectEnv };
