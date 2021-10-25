import { Compiler, Compilation} from 'webpack';
import path from 'path';
import glob from 'glob';
import fs from 'fs';

class ModuleLogger {
    async apply(compiler: Compiler) {
        compiler.hooks.afterEmit.tapAsync("WebpackDeadcodePlugin", async (compilation, callback) => {
            const assets = this.getAssets(compilation);
            const compiledFiles = this.getCompiledFiles(assets);
            let includedFiles : string[] = await this.getIncludedFiles();
            let unusedFiles = includedFiles.filter(file => !compiledFiles[file]);
            fs.writeFile('unused', JSON.stringify(unusedFiles), callback);
        });
    }
    async getIncludedFiles() : Promise<string[]> {
        return new Promise(res => {
            glob('./src/**/*.*', (er, file) => {
                res(file.map(name => path.resolve(name)));
            })
        })
    }
    getAssets(compilation: Compilation): string[]{
        const assets = Array.from(compilation.fileDependencies);
            const compiler = compilation.compiler;
            const outputPath = compilation.getPath(compiler.outputPath);
            compilation.getAssets().forEach(asset => {
                const assetPath = path.join(outputPath, asset.name);
                assets.push(assetPath);
        });
        return assets;
    }
    getCompiledFiles(assets : string[]):Record<string, boolean> {
        return assets
            .filter(file => file && file.indexOf("node_modules") === -1)
            .reduce((acc : Record<string,boolean>, file) => {
                acc[file] = true;
                return acc;
        }, {});
    }
}

export default ModuleLogger;
