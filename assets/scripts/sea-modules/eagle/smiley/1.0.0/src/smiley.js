/**
 * 表情
 * @author: chenyukun
 * @date 2013/4/13
 * @updat 2013-5-25
 * @updat 2013 6-9
 */
define(function(require, exports, module) {
  
    var $ = require('$');


    //默认配置
   var defaultSettings ={

    	//文本输入框
    	textCont: '',

    	//添加表情按钮
    	smilies: '',

        //表情显示区域 
        emotionBox:'',

        //表情json路径
        emotionSrc:'',

    	//表情显示框,自定义宽、高、边框颜色
    	smiliesBox:{
    		Width: '',
    		Height: '',
    		Border_color: ''
    	},
    	
    	//表情显示框left值
    	smiliesBox_left: '',

    	//表情显示框top值
    	smiliesBox_top: '',

        //表情显示框是否手动关闭，默认插入后关闭，失去焦点关闭
        smiliesBox_close: true,

        //可编辑div插入表情显示是否img，默认显示data-text，[伤心]
        insertEmoDiv_img: true,

        // callbacks 回调函数集合
        callbacks: {
            // 点击插入表情执行的回调函数
            'intervene': function(){},
            // 插入表情以后执行回调函数
            'insertfinish': function(){},
            //ajax加载json失败执行回调函数
            'ajaxError' : function(){},
            //ajax加载json成功执行回调函数
            'ajaxSucceed' :function(){}
        }

    }
  
  	// 模块化扩展接口，用于表情插入
    var smiley_init = function(options){
    	var options = $.extend(true, {}, defaultSettings, options || {}),
    		$textCont = $(options.textCont), //文本输入框
    		$smilies = $(options.smilies), //添加表情按钮
            $emotionBox = $(options.emotionBox), //表情显示区域
            $emotionCont = null,
			_emotionCont_sign =options.emotionBox+'_cont01', //添加表情框的id/class
    		_width = options.smiliesBox.Width, //表情框 width
    		_height = options.smiliesBox.Height, //表情框 height
    		_border_color = options.smiliesBox.Border_color, //表情框 边框颜色
    		_smiliesBox_left = options.smiliesBox_left,  //表情框left值，前提 css定义position:relative
    		_smiliesBox_top = options.smiliesBox_top,	//表情框top值，前提 css定义position:relative
            eventintervene = options.callbacks.intervene, // 点击插入表情执行的回调函数
            eventinsertfinish = options.callbacks.insertfinish, // 插入表情以后执行回调函数
            eventajaxError = options.callbacks.ajaxError, //ajax加载json失败执行回调函数
            eventajaxSucceed = options.callbacks.ajaxSucceed, //ajax加载json成功执行回调函数
            contentEditable = $textCont.is('[contentEditable="true"]'),
    		emotion= true,
            show =true;   	

        /*
		 * 判断内容元素和提示元素是否存在
		*/
		if (!$textCont.length || !$smilies.length || $textCont.length != $smilies.length) {
			return null;
		}

		// 获取内容元素的data-smiley，如果已初始化，则直接返回
		var data_smiley = $textCont.data('data-smiley');

		if (typeof data_smiley == 'object') {
			return data_smiley;
		}

    	// 返回操作对象
    	var smiley ={
    		
    		options : options,

            hand_close : function(){
                $emotionCont.hide();   
            }
    	};

        //添加显示文本框
        function _add_emotionBox(){
            var _emotionBox_id = $emotionBox.attr('id'),
                _id = _emotionBox_id + '_cont01',
                emotion_html = '<div id="'+ _id +'" class="emotion-box"><span class="arrow-up relative"><i class="arrow-up-innr"></i></span></div>';
                $emotionBox.append(emotion_html);
                $emotionCont = $('#'+_id);
                $emotionCont.css({
                    width : _width,
                    height : _height,
                    border : '1px solid '+ _border_color +'' ,
                    left:_smiliesBox_left,
                    top:_smiliesBox_top
                });      
        };

        
        //加载表情 ajax
        function _add_ajax(){
            $.ajax({
                url: options.emotionSrc,
                type: 'GET',
                dataType: 'json',
                timeout: 1000,
                cache:false,
                error: function(data){
                   eventajaxError(this);
                },
                success: function(data){
                    var drops=[];
                    $.each( data , function(i,k){
                        var name=k['title'],
                            links=k['link'];
                        var _html=[
                            '<img data-text="['+name+']" alt="['+name+']" title="'+name+'" src="'+ links +'" />'
                        ].join('\n');
                        drops.push(_html);
                    });
                    $emotionBox.find('.emotion-login').hide();
                    $emotionCont.append(drops.join('\n'));
                    eventajaxSucceed.call(this);
                }
            })
        };

        
        /**
         *  textarea
         *  表情插入(公用函数)
         *  @argument [@Object] elemEmo 表情的jQuery对象
         *  @argument [@Object] elemText 对应输入框的jQuery对象
         */
        function insertEmoTextarea(elemEmo, elemText){
            if(!contentEditable){
                var _$elemEmo = elemEmo
                    _$elemText = elemText,
                    _elemText = _$elemText[0];
                var _code =$.trim(_$elemEmo.attr("data-text"));
                var _sel = '';
                if(document.selection){
                    _$elemText.focus();
                    _sel = document.selection.createRange();
                    _sel.text = _code;
                    _$elemText.focus();
                }else if(_elemText.selectionStart || _elemText.selectionStart =="0"){
                    var _star = _elemText.selectionStart,
                        _end = _elemText.selectionEnd,
                        _cursor = _end;
                    _elemText.value = _elemText.value.substring(0, _star)
                                                  + _code
                                                  + _elemText.value.substring(_end, _elemText.value.length);
                    _cursor += _code.length;
                    _elemText.focus();
                    _elemText.selectionStart = _cursor;
                    _elemText.selectionEnd = _cursor;
                }else{
                    _elemText.value += _code;
                    _$elemText.focus();
                };
            }else{
                return
            } 
        };


        //IE浏览器 获取焦点位置
        function insertEmoDivRange(){
           if(document.all){
               this._range = document.selection.createRange();
            } 
        }

        /**
         *  IE 可编辑div 插入表情 <img>
         *  表情插入(公用函数)
         *  @argument [@Object] elemEmo <img>
         *  @argument [@Object] elemDiv 对应输入框的jQuery对象
         */
        function insertEmoDivIE(elemEmo, elemDiv){
            var  _elemEmo = elemEmo,
                 _elemEmoHtml = '',
                 _elemDiv = elemDiv;

            if(options.insertEmoDiv_img){
                
                _elemEmoHtml =_elemEmo.attr('data-text');
               
                if(_elemDiv[0]._range == null){
                   
                    _elemDiv[0].focus();
                    var rangeText = document.selection.createRange();
                    rangeText.text = _elemEmoHtml; 

                    
                }else{
                    
                    _elemDiv[0]._range.text = _elemEmoHtml;
                    document.selection.empty();
                    _elemDiv[0]._range.collapse();  
                    _elemDiv[0]._range.select(); 

                }

           }else{
               
                _elemEmoHtml = $('<div></div>').append(_elemEmo.clone()).html(); //获取img标签
               
               if(_elemDiv[0]._range == null){
                   
                    _elemDiv[0].focus();
                    var rangeImg = document.selection.createRange();
                    rangeImg.pasteHTML(_elemEmoHtml);

               }else{

                    _elemDiv[0]._range.pasteHTML(_elemEmoHtml);
                    document.selection.empty();
                    _elemDiv[0]._range.collapse();  
                    _elemDiv[0]._range.select(); 

               }

           }
                     
        }

         /**
         *  NO-IE 可编辑div, 插入表情 <img>
         *  表情插入(公用函数)
         *  @argument [@Object] elemEmo 表情的jQuery对象
         *  @argument [@Object] elemDiv 对应输入框的jQuery对象
         */
         function insertEmoDiv(elemEmo, elemDiv){
                var _elemEmo = elemEmo,
                _elemDiv = elemDiv[0], 
                _elemDivId = elemDiv.attr('id'),
                sel, 
                range; 

               if(options.insertEmoDiv_img){
                    
                    _elemEmoHtml =_elemEmo.attr('data-text');

               }else{
                   
                    _elemEmoHtml = $('<div></div>').append(_elemEmo.clone()).html(); //获取img标签

               }
      
                if (window.getSelection)  
                 {  
                        
                        sel = window.getSelection();  
                        range = sel.rangeCount > 0 ? sel.getRangeAt(0) : null;
                        if (range == undefined || range == null || (range.commonAncestorContainer.id != _elemDivId  &&  range.commonAncestorContainer.parentNode.id != _elemDivId )){
                            
                        }else{
                            
                            range.deleteContents(); 

                            var el = document.createElement('div');  
                            el.innerHTML = _elemEmoHtml;  
                            //<div><img src=" " title= /></div>  
                            var frag = document.createDocumentFragment(), 
                                node, 
                                lastNode;  
                        
                            //el.firstChild 确认在子节点中的第一个元素 <img>
                            while ( (node = el.firstChild) )  
                             {  
                                lastNode = frag.appendChild(node);  
                             }  

                            range.insertNode(frag);  
                            if (lastNode) {  
                                range = range.cloneRange();  
                                range.setStartAfter(lastNode);  
                                range.collapse(true);  
                                sel.removeAllRanges();  
                                sel.addRange(range); 
                                _elemDiv.focus();
                            }  
                        }
                }      
         }        

		//表情选择按钮
		$smilies.off('.add').on('click.add', function(e){
            if(show){
			   _add_emotionBox();
			   show = false;
			}else{   
				 $emotionCont.show();
			}

			e.stopPropagation();// 表情添加按钮(防止冒泡)

			if(emotion){
				$emotionCont.append('<div class="emotion-login"></div>');
				_add_ajax();
				emotion = false;
			}else{
				return;
			}
		   
		});


        //点击文本域获取焦点位置
        $textCont.keyup(insertEmoDivRange).mouseup(insertEmoDivRange); 

        //添加表情
        if(!contentEditable){
            $emotionBox.off('.add').on('click.add','img',function(e){
			   
			   eventintervene.call(this);
               
			   insertEmoTextarea($(this),$textCont);
               
			   eventinsertfinish.call(this);
			  
			   if(options.smiliesBox_close){
                    smiley.hand_close();
               }

            });
        }else{
            $emotionBox.off('.add').on('click.add','img',function(e){

               eventintervene.call(this);

               if(document.all){
                    insertEmoDivIE($(this), $textCont);
               }else{
                   insertEmoDiv($(this), $textCont);
               }
               eventinsertfinish.call(this);
               if(options.smiliesBox_close){
                    smiley.hand_close();
               }

            });
        }

        // 表情选择区域(防止冒泡)
        $emotionBox.off('.hide').on('click.hide', _emotionCont_sign, function(e){
            e.stopPropagation();
        });

        // 绑定document的操作(控制表情选择区域)
       if(options.smiliesBox_close){
            $(document).off('.hide').on('click.hide', function(e){  
                if($emotionCont===null || !$emotionCont.length){ 
                }else{
                  $emotionCont.hide();  
                } 
                
            });
        }

    	$textCont.data('data-smiley', smiley);

    	return smiley;
    }
	
	exports.render = smiley_init

});

