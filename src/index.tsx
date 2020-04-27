import { getOptions } from 'loader-utils';
import { loader } from 'webpack';
import { parse, ParserPlugin, ParserOptions } from '@babel/parser';
import * as BabelTypeModule from '@babel/types';
import generator from '@babel/generator';
import traverse from '@babel/traverse';
import toPath from 'lodash/topath';
import { injectEnv } from './injectEnv';

// So why i am not using plugin, because i need to transform the code
// before the any transform done by any plugin  itself

interface IOptions {
  exclude?: string[];
  plugins?: ParserPlugin[];
  enable?: boolean;
  debug?: boolean;
  sourceType?: ParserOptions['sourceType'];
}
function T(this: loader.LoaderContext, source: string) {
  const options: IOptions = getOptions(this);

  const { exclude, plugins, enable, debug = false, sourceType } = options;
  if (enable) {
    const ast = parse(source, {
      sourceType: sourceType || 'module',
      plugins: plugins || ['jsx'],
    });
    let codalo = source;

    traverse(ast, {
      enter(path) {
        // Why doing the ast traverse ?
        // I want to be sure , that the modification is happening
        // only for process.env member Identifiers. There is no
        // way to guarantee that with string parsing.
        if (BabelTypeModule.isMemberExpression(path.node)) {
          const generatedCode = generator(path.node);

          const pathArr = toPath(generatedCode.code);
          if (
            pathArr[0] === 'process' &&
            pathArr[1] === 'env' &&
            pathArr.length === 3
          ) {
            let paramName = '';

            if (pathArr[2]) {
              paramName = pathArr[2].trim();
            }

            if (debug) {
              console.log(`Path found in the code is : ${pathArr}`);
              console.log(`Path name is : ${paramName}`);
            }
            const isBlackList = exclude
              ? exclude.findIndex((blackListedItem: string) => {
                  return blackListedItem === paramName;
                }) !== -1
              : false;

            if (!isBlackList) {
              try {
                const MM = BabelTypeModule.templateLiteral(
                  [
                    BabelTypeModule.templateElement({
                      raw: `$$_INTERNAL__process.env.${paramName}MATH_RANDOM_START`,
                      cooked: `$$_INTERNAL__process.env.${paramName}MATH_RANDOM_START`,
                    }),
                    BabelTypeModule.templateElement({
                      raw: 'MATH_RANDOM_END$$_INTERNAL__',
                      cooked: 'MATH_RANDOM_END$$_INTERNAL__',
                    }),
                  ],
                  [
                    BabelTypeModule.callExpression(
                      BabelTypeModule.memberExpression(
                        BabelTypeModule.identifier('Math'), // most important part, for confusing //babel not to replace the values in the code
                        BabelTypeModule.identifier('random'),
                        false
                      ),
                      []
                    ),
                  ]
                );

                path.replaceWith(MM);
              } catch (e) {
                console.log('error is ===>', e);
              }
              codalo = generator(ast).code;
            }
          }
        }
      },
    });
    return codalo;
  }

  return source;
}

export { injectEnv };
export default T;
