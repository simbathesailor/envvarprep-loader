import path from 'path';
import glob from 'glob';
import fs from 'fs';

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
};

interface IEnvObj {
  [key: string]: string;
}

interface IInjectEnv {
  globOptions: glob.IOptions;
  envVar?: IEnvObj;
  debug?: boolean;
  destination?: string;
  pattern?: string;
  updateInline?: boolean;
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
    const noOfMatches = source.match(/\$\$_INTERNAL__/g);
    if (noOfMatches && noOfMatches.length > 1) {
      let changed = false;

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

              const paramValue: string | undefined =
                // @ts-ignore
                envFromParamStore[ThirdVariable.trim()] || undefined;

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
