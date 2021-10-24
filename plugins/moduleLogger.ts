import { Compiler } from 'webpack';
import fs from 'fs';

class ModuleLogger {
    apply(compiler: Compiler) {
        compiler.hooks.normalModuleFactory.tap(
            'ModuleLogger',
            (normalModuleFactory) => {
                normalModuleFactory.hooks.module.tap('ModuleLogger', (_module, _createData, resolveData) => {
                    console.log(resolveData.context);
                    return _module;
                });
            }
        );
    }
}

export default ModuleLogger;