if exist min (
rmdir /s /q min
)
mkdir min
java -jar yuicompressor-2.4.2.jar ..\Modules\Core\trank\BCore.js>min\BCore.min.js --charset utf-8
java -jar yuicompressor-2.4.2.jar ..\Modules\Components\trank\Check.js>min\Check.min.js --charset utf-8
java -jar yuicompressor-2.4.2.jar ..\Modules\Components\trank\2.1\Input.js>min\Input.min.js --charset utf-8
java -jar yuicompressor-2.4.2.jar ..\Modules\Components\trank\2.1\Recommend.js>min\Recommend.min.js --charset utf-8
java -jar yuicompressor-2.4.2.jar ..\Modules\Tool\trank\2.1\Tools.js>min\Tools.min.js --charset utf-8
java -jar yuicompressor-2.4.2.jar ..\Modules\Components\trank\Extends.js>min\Extends.min.js --charset utf-8
java -jar yuicompressor-2.4.2.jar ..\Modules\Products\trank\InputEx.js>min\InputEx.min.js --charset utf-8
java -jar yuicompressor-2.4.2.jar ..\Modules\Products\trank\2.1\UIDisplay.js>min\ui.min.js --charset utf-8
java -jar yuicompressor-2.4.2.jar ..\Modules\Components\trank\Sid.js>min\Sid.min.js --charset utf-8




if exist bcore.ui.min.js (
del bcore.ui.min.js
)
copy min\BCore.min.js/b+min\Tools.min.js/b+min\Check.min.js/b+min\Input.min.js/b+min\Recommend.min.js/b+min\Sid.min.js/b+min\Extends.min.js/b+min\InputEx.min.js/b+min\ui.min.js/b bcore.ui.min.js
echo complate!
pause