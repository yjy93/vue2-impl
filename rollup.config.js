import babel from 'rollup-plugin-babel';
import serve from 'rollup-plugin-serve';
export default { // 用于打包的配置
    input: './src/index.js',
    output: {
        format: 'umd', // 模块化类型  统一模块规范
        file: 'dist/vue.js',
        name: 'Vue', // 打包后的全局变量的名字  window.Vue
        sourcemap: true
    },
    plugins: [
        babel({
            exclude: 'node_modules/**' // 这个目录不需要用 babel 转换
        }),
        serve({
            open: true,
            openPage: '/public/index.html',
            port: 3000,
            contentBase: '' // 以当前这个根目录为准查找文件
        })
    ]
}
