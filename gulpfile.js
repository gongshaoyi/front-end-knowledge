const {dest,watch,src} = require("gulp");
const ts = require("gulp-typescript");
const tsProject = ts.createProject("tsconfig.json");

const defaultTask = () => {
    return tsProject.src()
    .pipe(tsProject())
    .js.pipe(dest("dist"));
}

// const watcher = watch(['src'])
// watcher.on('change',(path)=>{
//     console.log('====开始编译改动====')

//     let pathArr = path.split("/");
//     pathArr.pop();
//     pathArr[0] = 'dist';
//     const fPath = pathArr.join("/");
//     src(path)
//       .pipe(
//         ts({
//           noImplicitAny: true,
//           target: "es5",
//         })
//       )
//       .pipe(dest(fPath));

//     console.log('====编译改动结束====')
// })

exports.default = defaultTask;
