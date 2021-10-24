import { Compiler } from 'webpack';

class ModuleLogger {
    apply(compiler: Compiler) {
        compiler.hooks.normalModuleFactory.tap(
            'ModuleLogger',
            (normalModuleFactory) => {
                normalModuleFactory.hooks.module.tap('ModuleLogger', (_module, _createData, resolveData) => {
                    // @ts-ignore
                    console.log('1 ' + _createData.resource);

                    console.log('2 ' +resolveData.context);
                    console.log('3 ' + module.paths);

                    return _module;
                });
            }
        );
    }
}

export default ModuleLogger;