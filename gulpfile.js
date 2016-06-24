//CSS压缩，css里面引用图片带摘要
var gulp = require('gulp'),
    cssmin = require('gulp-minify-css'),//css压缩
    csslint = require('gulp-csslint'),//css检测
    //确保已本地安装gulp-make-css-url-version []
    cssver = require('gulp-make-css-url-version'),
    rev    = require('gulp-rev'),    //- 对文件名加MD5后缀
    notify = require('gulp-notify'),//构建
    manifest = require('gulp-appcache'),//前端缓存
    revCollector = require('gulp-rev-collector'),//执行文件内css名的替换 
    watch = require('gulp-watch'),//只重新编译被更改过的文件
    jshint = require('gulp-jshint'),//Link任务会检查js/目录下得js文件有没有报错或警告。
    fs = require('fs');
    fontmin = require('gulp-fontmin'),//Gulp plugin for minify TTF font to SVG, EOT, WOFF
    minifyHTML   = require('gulp-minify-html');//压缩html
    htmlmin = require('gulp-htmlmin');//压缩html
    pngquant = require('imagemin-pngquant'),//深度压缩
    cache = require('gulp-cache'),//构建过程中使用缓存，即不处理之前处理过的图片
    imagemin = require('gulp-imagemin'); //图片压缩
    rename = require('gulp-rename'),//文件夹重命名
    uglify = require('gulp-uglify'),//js压缩
    concat = require('gulp-concat'),//文件合并
    fs = require('fs');//读取本地文件
	 var json = JSON.parse(fs.readFileSync('./package.json','utf-8'));    
	 var manifestAr = [];
	 var obj = json.manifest;

	 for(var i=0;i<obj.length;i++)
	 {
		 var temp = obj[i];
		 manifestAr.push(temp);
	 }     
 var buildPath = json.path?json.path:json.name;
 var sourceDest = 'deploy/'+json.version+"/"+json.verType+'/source-'+json.name;//源代码输出目录
 var sourcehHseaDest = 'deploy/'+json.version+"/"+json.verType+'/source-'+json.frameworkVersion;//源代码输出目录
 
 var cssDest = 'deploy/'+json.version+"/"+json.verType+'/'+json.name+'/';//CSS文件输出路径
 var jsDest = 'deploy/'+json.version+"/"+json.verType+'/'+json.name+'/';//JS文件输出路径 
 var imgDest = 'deploy/'+json.version+"/"+json.verType+'/'+json.name+'/';//img文件输出路径
 var fontDest = 'deploy/'+json.version+"/"+json.verType+'/'+json.name+'/';//字体文件输出路径
 var pluginsDest = 'deploy/'+json.version+"/"+json.verType+'/'+json.name+'/';//插件文件输出路径
 var htmlDest = rootDest = 'deploy/'+json.version+"/"+json.verType+'/'+json.name+'/';//html文件输出路径,项目根

 
 
 var cacheMfDest = htmlDest;//前端cachemainfest文件输出路径
 var manifestDest = htmlDest+"manifest.json";//生成md5对照表路径和格式    
 var revcssDest = 'deploy/'+json.version+"/"+json.verType+"/"+json.name+'/**/*.css';//替换css文件里面版路径
 var revhtmlDest = 'deploy/'+json.version+"/"+json.verType+"/"+json.name+'/**/*.html';//替换html里面版本路径
 var revpluginsCssDest = 'deploy/'+json.version+"/"+json.verType+"/"+json.name+'/**/*.css';
 var revjsDest = 'deploy/'+json.version+"/"+json.verType+"/"+json.name+'/**/*.js';
 var revjsPluginsDest = 'deploy/'+json.version+"/"+json.verType+"/"+json.name+'/**/*.js';
 var revmainfestDest = 'deploy/'+json.version+"/"+json.verType+"/"+json.name+'/app.appcache';
 var frameDest = 'deploy/'+json.version+"/"+json.verType+"/"+json.frameworkVersion+'/';
 var hseaDest = json.frameworkVersion+'/';//框架HSEA构建目录
 

//JS不合并压缩重命名
var gulp = require('gulp'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat');

//备份源文件
function sourceSave(){    
     return gulp.src([buildPath+'/**/*'])
        .pipe(gulp.dest(sourceDest))
           .pipe(notify({ message: 'sourceSave do finished' })); 
}

//备份框架文件
function sourceHseaSave(){    
     return gulp.src([hseaDest+'/**/*'])
        .pipe(gulp.dest(sourcehHseaDest))
           .pipe(notify({ message: 'sourceSave do finished' })); 
}

//备份package.json
function sourcePkgSave(){    
     return gulp.src('./package.json')
        .pipe(gulp.dest(sourceDest))
           .pipe(notify({ message: 'package do finished' })); 
}
//字体压缩,Gulp plugin for minify TTF font to SVG, EOT, WOFF
function fontmins(){
     return gulp.src([buildPath+'/font/*.woff'])
        .pipe(fontmin({
            text: 'font',
         }))
        .pipe(gulp.dest(fontDest))//统一所有js和css和html文件在一个目录下一个文件中
        .pipe(notify({ message: 'font min do finished' }));
        
}

//css检测
function csslints(){
     return gulp.src([buildPath+'/css/**/*.css'])
        .pipe(csslint())
        .pipe(csslint.reporter())
        .pipe(csslint.reporter('fail'))
        .pipe(notify({ message: 'css lint do finished' }));
        
}

//css先合并压缩
function cssmins(){
     return gulp.src([buildPath+'/**/*.css'])
        //.pipe(cssver()) //给css文件里引用文件加版本号（文件MD5）,修改了文件内容 一定要重新生成新的css（如果里面有变化则URL变化，没变化则URL的MD5不会变）
        //.pipe(concat('main.css'))
        //.pipe(rename({ suffix: '.min' }))
        //.pipe(gulp.dest(cssDest))        
        .pipe(cssmin())
        .pipe(rev())  //- 文件名加MD5后缀
        .pipe(gulp.dest(cssDest))//输出文件
        .pipe(rev.manifest({path:manifestDest},{//生成的目录在根下面
            base: rootDest,
            merge: true }))  //生成md5配置文件
        //.pipe(gulp.dest('deploy/'+json.version+"/"+json.name+'/css/'))  //生成所有css的md5 mainifest文件在这个目录
        .pipe(gulp.dest(rootDest))//统一所有js和css和html文件在一个目录下一个文件中
        .pipe(notify({ message: 'css do finished' }));
        
}

//插件里面css先合并压缩
function csspluginsmins(){
     return gulp.src([buildPath+'/**/*.css'])
        .pipe(cssmin())
        .pipe(rev())  //- 文件名加MD5后缀
        .pipe(gulp.dest(pluginsDest))//输出文件
        .pipe(rev.manifest({path:manifestDest},{//生成的目录在根下面
            base: rootDest,
            merge: true }))  //生成md5配置文件
        .pipe(gulp.dest(rootDest))//统一所有js和css和html文件在一个目录下一个文件中
        .pipe(notify({ message: 'css plugins do finished' }));        
}



  // 检查js
function jshints(){
    return gulp.src([buildPath+'/**/*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(notify({ message: 'js do finished' }));
    
          //,排除使用'!src/js/**/{test3}.js'

};
 

//js工程合并压缩
function jsmins(){
      var config = {
        mangle: {except: ['define', 'require', 'module', 'exports','$']},//类型：Boolean 默认：true 是否修改变量名
        compress:  {
         drop_console: true
    },//类型：Boolean 默认：true 是否完全压缩
//       preserveComments: 'all' //保留所有注释
    };
    return gulp.src([buildPath+'/**/*.js'])//,排除使用'!src/js/**/{test3}.js'
        //.pipe(concat('all.js'))
        //.pipe(gulp.dest(jsDest))
        //.pipe(rename({ suffix: '.min' }))
        .pipe(uglify(config))    //压缩
        //.pipe(rename({suffix: '.min'}))   //rename压缩后的文件名       
        .pipe(rev())  //- 文件名加MD5后缀
        .pipe(gulp.dest(jsDest)) 
 
        .pipe(rev.manifest({path:manifestDest},{
            base: rootDest,
            merge: true }))  //生成md5配置文件
        //.pipe(gulp.dest('deploy/'+json.version+"/"+json.name+'/js'))    //js单独生成md5配置文件
        .pipe(gulp.dest(rootDest))
        .pipe(notify({ message: 'js do finished' }));
        
}

//压缩plugins插件JS
function jspluginsmins(){
      var config = {
        mangle: {except: ['define', 'require', 'module', 'exports']},
        compress: false
    };
    return gulp.src([buildPath+'/**/*.js'])//,排除使用'!src/js/**/{test3}.js'
        .pipe(uglify(config))    //压缩    
        .pipe(rev())  //- 文件名加MD5后缀
        .pipe(gulp.dest(pluginsDest))  //注意插件是输出在根目录下面
        .pipe(rev.manifest({path:manifestDest},{
            base: rootDest,
            merge: true }))  //生成md5配置文件
        //.pipe(gulp.dest('deploy/'+json.version+"/"+json.name+'/js'))    //js单独生成md5配置文件
        .pipe(gulp.dest(rootDest))
        .pipe(notify({ message: 'js plugins do finished' }));
        
}


//站点favico图片处理
function imageFavmins(){
    var imgSrc = buildPath+'/images/favicon.ico';
     return gulp.src([imgSrc])
       .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        }))        
        .pipe(gulp.dest(rootDest))
        .pipe(notify({ message: 'favicon do finished' }));
        
}

//项目里面图片处理
function imagemins(){
    var imgSrc = buildPath+'/**/*.{png,jpg,gif,ico}';
     return gulp.src([imgSrc])
        //.pipe(imagemin())
        /* .pipe(imagemin({
            optimizationLevel: 5, //类型：Number  默认：3  取值范围：0-7（优化等级）
            progressive: true, //类型：Boolean 默认：false 无损压缩jpg图片
            interlaced: true, //类型：Boolean 默认：false 隔行扫描gif进行渲染
            multipass: true //类型：Boolean 默认：false 多次优化svg直到完全优化
        }))*/
       
        //深度压缩图片
        /*.pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],//不要移除svg的viewbox属性
            use: [pngquant()] //使用pngquant深度压缩png图片的imagemin插件
        }))*/
        /*缓存
        .pipe(cache(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        })))*/
        //
       .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        }))
        .pipe(rev())  //- 文件名加MD5后缀
        .pipe(gulp.dest(imgDest))
        .pipe(rev.manifest({path:manifestDest},{
            base: rootDest,
            merge: true }))  //生成md5配置文件
        //.pipe(gulp.dest('deploy/'+json.version+"/"+json.name+'/img'))//图片单独生成md5配置文件
        .pipe(gulp.dest(rootDest))
        .pipe(notify({ message: 'img do finished' }));
        
}

//插件里面图片处理
function imagepluginsmins(){
    var imgSrc = buildPath+'/**/*.{png,jpg,gif,ico}';
     return gulp.src([imgSrc])        
       .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        }))
        .pipe(rev())  //- 文件名加MD5后缀
        .pipe(gulp.dest(pluginsDest))
        .pipe(rev.manifest({path:manifestDest},{
            base: rootDest,
            merge: true }))  //生成md5配置文件
        //.pipe(gulp.dest('deploy/'+json.version+"/"+json.name+'/img'))//图片单独生成md5配置文件
        .pipe(gulp.dest(rootDest))
        .pipe(notify({ message: 'img plugins do finished' }));
        
}


function htmlmins(){
    var options = {
        removeComments: true,//清除HTML注释
        collapseWhitespace: true,//压缩HTML
        collapseBooleanAttributes: true,//省略布尔属性的值 <input checked="true"/> ==> <input />
        removeEmptyAttributes: true,//删除所有空格作属性值 <input id="" /> ==> <input />
        removeScriptTypeAttributes: true,//删除<script>的type="text/javascript"
        removeStyleLinkTypeAttributes: true,//删除<style>和<link>的type="text/css"
        minifyJS: true,//压缩页面JS
        minifyCSS: true//压缩页面CSS

    };
     return gulp.src([buildPath+'/**/*.html','!'+json.name+'/**/docs.html','!'+json.name+'/**/oldapi.html'])
        .pipe(htmlmin(options))
        .pipe(rev())  //- 文件名加MD5后缀
        .pipe(gulp.dest(htmlDest))
        .pipe(rev.manifest({path:manifestDest},{
            base: rootDest,
            merge: true }))  //生成md5配置文件
        //.pipe(gulp.dest(rootDest))//页面单独生成md5配置文件
        .pipe(gulp.dest(rootDest))
        .pipe(notify({ message: 'html do finished' }));
        
}

//压缩框架MD5文件化(JS)
function hseamins(){
      var config = {
        mangle: {except: ['define', 'require', 'module', 'exports','$']},//类型：Boolean 默认：true 是否修改变量名
        compress: true,//类型：Boolean 默认：true 是否完全压缩
    };
    return gulp.src([hseaDest+'**/*.js'])//,排除使用'!src/js/**/{test3}.js'
        .pipe(uglify(config))    //压缩
        .pipe(rev())  //- 文件名加MD5后缀
        .pipe(gulp.dest(frameDest)) 
 
        .pipe(rev.manifest({path:manifestDest},{
            base: rootDest,
            merge: true }))  //生成md5配置文件
        //.pipe(gulp.dest('deploy/'+json.version+"/"+json.name+'/js'))    //js单独生成md5配置文件
        .pipe(gulp.dest(rootDest))
        .pipe(notify({ message: 'hseamins do finished' }));
        
}

function hseaminscss(){
     return gulp.src([hseaDest+'/**/*.css'])
        .pipe(cssmin())
        .pipe(rev())  //- 文件名加MD5后缀
        .pipe(gulp.dest(frameDest))//输出文件
        .pipe(rev.manifest({path:manifestDest},{//生成的目录在根下面
            base: rootDest,
            merge: true }))  //生成md5配置文件
        .pipe(gulp.dest(rootDest))//统一所有js和css和html文件在一个目录下一个文件中
        .pipe(notify({ message: 'hseaminscss do finished' }));
        
}

function hseaminsImage(){
    var imgSrc = hseaDest+'/**/*.{png,jpg,gif,ico}';
     return gulp.src([imgSrc])
       .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        }))
        .pipe(rev())  //- 文件名加MD5后缀
        .pipe(gulp.dest(frameDest))
        .pipe(rev.manifest({path:manifestDest},{
            base: rootDest,
            merge: true }))  //生成md5配置文件
        //.pipe(gulp.dest('deploy/'+json.version+"/"+json.name+'/img'))//图片单独生成md5配置文件
        .pipe(gulp.dest(rootDest))
        .pipe(notify({ message: 'img do finished' }));
        
}


//增加前端缓存mainfest文件

function manifests(){
	if(manifestAr.length >0)
	{
	    return gulp.src(manifestAr)//过滤下不需要增加缓存文件
	        .pipe(manifest({
	          relativePath: '../',
		      hash: true,
		      preferOnline: true,
		      network: ['*'],
		      filename: 'app.appcache',
		      exclude: 'app.appcache'	              
	         }))
	        .pipe(gulp.dest(cacheMfDest))
	        .pipe(notify({ message: '前端缓存mainfest修改完成' }));
    }else{
    	return gulp.src([hseaDest]).pipe(notify({ message: '前端缓存mainfest修改完成(未执行)' }));  
    }
        
}



/*对所有md5 json文件在一个文件中的处理方式,替换文件中路径*/

function revhsea(){
     return gulp.src([manifestDest, frameDest+'**/*.js'])
        .pipe(revCollector({replaceReved: true}))
        .pipe(gulp.dest(frameDest))
        .pipe(notify({ message: 'revhsea rev cover do finished' }));
        
}

function revhtml(){
     return gulp.src([manifestDest, revhtmlDest])
        .pipe(revCollector({replaceReved: true}))
        .pipe(gulp.dest(rootDest))
        .pipe(notify({ message: 'html rev cover do finished' }));
        
}

function revcss(){
     return gulp.src([manifestDest, revcssDest])
        .pipe(revCollector({replaceReved: true}))
        .pipe(gulp.dest(cssDest))
        .pipe(notify({ message: 'css rev cover do finished' }));
        
}

function revfluginscss(){
     return gulp.src([manifestDest, revpluginsCssDest])
        .pipe(revCollector({replaceReved: true}))
        .pipe(gulp.dest(cssDest))
        .pipe(notify({ message: 'pluginscss rev cover do finished' }));
        
}

function revjs(){
     return gulp.src([manifestDest, revjsDest])
        .pipe(revCollector({replaceReved: true}))
        .pipe(gulp.dest(jsDest))
        .pipe(notify({ message: 'js rev cover do finished' }));
        
}

function revpluginsjs(){
     return gulp.src([manifestDest, revjsPluginsDest])
        .pipe(revCollector({replaceReved: true}))
        .pipe(gulp.dest(jsDest))
        .pipe(notify({ message: 'js rev cover do finished' }));
        
}

function revcachemainfest(){
	if(manifestAr.length >0)
	{
		 return gulp.src([manifestDest, revmainfestDest])
        .pipe(revCollector({replaceReved: true}))
        .pipe(gulp.dest(rootDest))
        .pipe(notify({ message: 'md5manifest rev cover do finished' }))
	}else
	{
		return gulp.src([hseaDest]).pipe(notify({ message: 'revcachemainfest(未执行)' })); 
	}

        
}



/*
gulp 4.0 series里的任务是顺序执行的，parallel里的任务是同步执行的。
*/

//gulp.task('default', gulp.series(sourceSave,sourcePkgSave,fontmins,cssmins,csspluginsmins,/*jshints,*/jsmins,jspluginsmins,imageFavmins,imagemins,imagepluginsmins,htmlmins,manifests,revcss,revfluginscss,revjs,revpluginsjs,revhtml,revcachemainfest));
gulp.task('default', gulp.series(sourceHseaSave,sourceSave,sourcePkgSave,fontmins,cssmins,/*csspluginsmins，jshints,*/jsmins,/*jspluginsmins,imageFavmins,*/imagemins/*,imagepluginsmins*/,htmlmins,hseamins,hseaminscss,hseaminsImage,manifests,revhsea,revcss,revjs,revhtml,revcachemainfest));





