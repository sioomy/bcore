if exist sourcecode (
rmdir /s /q sourcecode
)
mkdir sourcecode
if exist doc_tmp1.0 (
rmdir /s /q doc_tmp1.0
)
mkdir doc_tmp1.0
copy ..\Modules\Core\tags\BCore530\*.js sourcecode
::copy ..\Modules\Components\trank\*.js sourcecode
copy ..\Modules\Components\tags\BCore530\Input.js sourcecode
copy ..\Modules\Components\tags\BCore530\NetUser.js sourcecode
copy ..\Modules\Components\tags\BCore530\Recommend.js sourcecode
copy ..\Modules\Components\tags\BCore530\Tools.js sourcecode
copy ..\Modules\Products\tags\BCore530\*.js sourcecode
::java -jar ../tools/jsdoc-toolkit/jsrun.jar ../tools/jsdoc-toolkit/app/run.js -s -a -d=doc_tmp1.0 -o=log.txt -t=../tools/jsdoc-toolkit/templates/Codeview  -D="noGlobal:true" -D="title:BAIFENDIAN BCore Library" -D="index:files" sourcecode/*.js
::java -jar ../tools/jsdoc-toolkit/jsrun.jar ../tools/jsdoc-toolkit/app/run.js -s -a -d=doc_tmp1.0 -o=log.txt -t=../tools/jsdoc-toolkit/templates/simple  -D="noGlobal:true" -D="title:BAIFENDIAN BCore Library" -D="index:files" sourcecode/*.js
::java -jar ../tools/jsdoc-toolkit/jsrun.jar ../tools/jsdoc-toolkit/app/run.js -s -a -d=doc_tmp1.0 -o=log.txt -t=../tools/jsdoc-toolkit/templates/outline  -D="noGlobal:true" -D="title:BAIFENDIAN BCore Library" -D="index:files" sourcecode/*.js
java -jar ../tools/jsdoc-toolkit/jsrun.jar ../tools/jsdoc-toolkit/app/run.js -s -a -d=doc_tmp1.0 -o=log.txt -t=../tools/jsdoc-toolkit/templates/jsdoc  -D="noGlobal:true" -D="title:BAIFENDIAN BCore1.x Library" -D="index:files" sourcecode/*.js
if exist sourcecode (
rmdir /s /q sourcecode
)
echo complate!
pause