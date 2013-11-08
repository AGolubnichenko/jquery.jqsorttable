(function($){
	
//default options
	var _options = {
		group_name: '',			//unique name for table
		sort_field: '',			//default sort field
		sort_mode: 'asc',		//default sorting mode ('asc', 'desc')
		fields: {},
		on_click : null,
		on_init : null
	};			
	
/**
 * -------------------------------------------------			
 * Methods
 * -------------------------------------------------			
 */	
	var methods = {
		// Initialize
		init : function(options) {
			//setup options
			_options = $.extend(_options, options);

			return this.each(function(){
				var $this = $(this), data = $this.data('jqsorttable');
		
				if (!data) {
					$this.data('jqsorttable', {
						key : _options.group_name,
						target : $this,
						state: {
							sort_field : _options.sort_field,
							sort_mode : _options.sort_mode							
						}
					});				
					data = $this.data('jqsorttable');
					if (!!_options.on_init)	_options.on_init();
				};
				
				//refresh current state from cookie
				data.state=$.extend(data.state, _private._get_cookie(this, 'table_state'));
				$this.data('jqsorttable',data);
				_private._set_cookie(this, 'table_state', data.state);
				
				//events
				$this.bind('click.jqsorttable', methods.click);
			});
		 },
				 
		// Destroy
		destroy : function( ) {
			return this.each(function(){
				var $this = $(this); 
				$(window).unbind('.jqsorttable');
				$this.removeData('jqsorttable');
		   });
		},

		// click by header for sorting
		click : function (event) {
			event = event || window.event;			
			var $this = $(this), data = $this.data('jqsorttable');			
			var $obj = $(event.target);
			
			for (var value in _options.fields) {
				if ($(_options.fields[value]).get(0)===$obj.get(0)) {
					
					if (data.state.sort_field===$obj.eq(0).attr('name')) {
						data.state.sort_mode=_private._convert_sort_mode(data.state.sort_mode);
					} else {
						data.state.sort_field=$obj.eq(0).attr('name');	
						data.state.sort_mode=_options.sort_mode;						
					}

					$this.data('jqsorttable',data);
					_private._set_cookie(this, 'table_state', data.state);			
					
					if (!!_options.on_click) {
						_options.on_click();
					} else {
						window.location.href = "";								
					}
				}
			}
			
			//return false;
			return true;
		}
	};		

/**
 * -------------------------------------------------			
 * Private methods
 * -------------------------------------------------			
 */	

	var _private = {
		_convert_sort_mode: function ($mode) {
			if ($mode=='asc') {
				$mode='desc';
			} else {
				$mode='asc';
			}
			return $mode;
		},
		// Sets a cookie with given key.
        _set_cookie: function (obj, key, value) {
			var $this = $(obj), data = $this.data('jqsorttable');			
			if (!!data) {
				key = data.key + '_' + key;
				value=this._serialize(value);
				var expireDate = new Date();
				expireDate.setDate(expireDate.getDate() + 30);
				document.cookie = encodeURIComponent(key) + '=' + encodeURIComponent(value)+"; path=/"; // + "; expires=" + expireDate.toUTCString();
			}
        },

		// Gets a cookie with given key.
        _get_cookie: function (obj, key) {
			var $this = $(obj), data = $this.data('jqsorttable');						
			if (!!data) {
				key = data.key + '_' + key;				

				var equalities = document.cookie.split('; ');
				for (var i = 0; i < equalities.length; i++) {
					if (!equalities[i])	continue;

					var splitted = equalities[i].split('=');
					if (splitted.length != 2) continue;

					if (decodeURIComponent(splitted[0]) === key) {
						return this._unserialize(decodeURIComponent(splitted[1] || ''));
					}
				}
			}	
            return null;
        },
		
		// Serialize data to string
		_serialize: function( mixed_value ) {
	
			var _getType = function( inp ) {
				var type = typeof inp, match;
				var key;
				if (type == 'object' && !inp) {
					return 'null';
				}
				if (type == "object") {
					if (!inp.constructor) {
						return 'object';
					}
					var cons = inp.constructor.toString();
					if (match = cons.match(/(\w+)\(/)) {
						cons = match[1].toLowerCase();
					}
					var types = ["boolean", "number", "string", "array"];
					for (key in types) {
						if (cons == types[key]) {
							type = types[key];
							break;
						}
					}
				}
				return type;
			};
			
			var type = _getType(mixed_value);
			var val, ktype = '';

			switch (type) {
				case "function": 
					val = ""; 
					break;
				case "undefined":
					val = "N";
					break;
				case "boolean":
					val = "b:" + (mixed_value ? "1" : "0");
					break;
				case "number":
					val = (Math.round(mixed_value) == mixed_value ? "i" : "d") + ":" + mixed_value;
					break;
				case "string":
					val = "s:" + mixed_value.length + ":\"" + mixed_value + "\"";
					break;
				case "array":
				case "object":
					val = "a";
					var count = 0;
					var vals = "";
					var okey;
					var key;
					for (key in mixed_value) {
						ktype = _getType(mixed_value[key]);
						if (ktype == "function") { 
							continue; 
						}

						okey = (key.match(/^[0-9]+$/) ? parseInt(key) : key);
						vals += this._serialize(okey) +
								this._serialize(mixed_value[key]);
						count++;
					}
					val += ":" + count + ":{" + vals + "}";
					break;
			}
			if (type != "object" && type != "array") val += ";";
			return val;
		}, 	
				
		// Unserialize data from string				
		_unserialize: function (phpstr) {
			var idx = 0
			, rstack = []
			, ridx = 0

			, readLength = function () {
				var del = phpstr.indexOf(':', idx)
				  , val = phpstr.substring(idx, del);
				idx = del + 2;
				return parseInt(val);
			  } //end readLength

			, parseAsInt = function () {
				var del = phpstr.indexOf(';', idx)
				  , val = phpstr.substring(idx, del);
				idx = del + 1;
				return parseInt(val);
			  } //end parseAsInt

			, parseAsFloat = function () {
				var del = phpstr.indexOf(';', idx)
				  , val = phpstr.substring(idx, del);
				idx = del + 1;
				return parseFloat(val);
			  } //end parseAsFloat

			, parseAsBoolean = function () {
				var del = phpstr.indexOf(';', idx)
				  , val = phpstr.substring(idx, del);
				idx = del + 1;
				return ("1" === val)? true: false;
			  } //end parseAsBoolean

			, parseAsString = function () {
				var len = readLength()
				  , utfLen = 0
				  , bytes = 0
				  , ch
				  , val;
				while (bytes < len) {
				  ch = phpstr.charCodeAt(idx + utfLen++);
				  if (ch <= 0x007F) {
					bytes++;
				  } else if (ch > 0x07FF) {
					bytes += 3;
				  } else {
					bytes += 2;
				  }
				}
				val = phpstr.substring(idx, idx + utfLen);
				idx += utfLen + 2;
				return val;
			  } //end parseAsString

			, parseAsArray = function () {
				var len = readLength()
				  , resultArray = []
				  , resultHash = {}
				  , keep = resultArray
				  , lref = ridx++
				  , key
				  , val;

				rstack[lref] = keep;
				for (var i = 0; i < len; i++) {
				  key = parseNext();
				  val = parseNext();
				  if (keep === resultArray && parseInt(key) == i) {
					// store in array version
					resultArray.push(val);
				  } else {
					if (keep !== resultHash) {
					  // found first non-sequential numeric key
					  // convert existing data to hash
					  for (var j = 0, alen = resultArray.length; j < alen; j++) {
						resultHash[j] = resultArray[j];
					  }
					  keep = resultHash;
					  rstack[lref] = keep;
					}
					resultHash[key] = val;
				  } //end if
				} //end for

				idx++;
				return keep;
			  } //end parseAsArray

			, parseAsObject = function () {
				var len = readLength()
				  , obj = {}
				  , lref = ridx++
				  , clazzname = phpstr.substring(idx, idx + len)
				  , re_strip = new RegExp("^\u0000(\\*|" + clazzname + ")\u0000")
				  , key
				  , val;

				rstack[lref] = obj;
				idx += len + 2;
				len = readLength();
				for (var i = 0; i < len; i++) {
				  key = parseNext();
				  // private members start with "\u0000CLASSNAME\u0000"
				  // protected members start with "\u0000*\u0000"
				  // we will strip these prefixes
				  key = key.replace(re_strthis.ip, '');
				  val = parseNext();
				  obj[key] = val;
				}
				idx++;
				return obj;
			  } //end parseAsObject

			, parseAsRef = function () {
				var ref = parseAsInt();
				// php's ref counter is 1-based; our stack is 0-based.
				return rstack[ref - 1];
			  } //end parseAsRef

			, readType = function () {
				var type = phpstr.charAt(idx);
				idx += 2;
				return type;
			  } //end readType

			, parseNext = function () {
				var type = readType();
				switch (type) {
				  case 'i': return parseAsInt();
				  case 'd': return parseAsFloat();
				  case 'b': return parseAsBoolean();
				  case 's': return parseAsString();
				  case 'a': return parseAsArray();
				  case 'O': return parseAsObject();
				  case 'r': return parseAsRef();
				  case 'R': return parseAsRef();
				  case 'N': return null;
				  default:
					throw {
					  name: "Parse Error",
					  message: "Unknown type '" + type + "' at postion " + (idx - 2)
					}
				} //end switch
			}; //end parseNext

			return parseNext();
		} //end phpUnserialize		
	};
	
//*************************************************

	$.fn.jqsorttable = function(method){
		if (methods[method]) {
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		} else if (typeof method === 'object' || !method) {
			return methods.init.apply( this, arguments );
		} else {
			$.error( 'Method "' +  method + '" does not exist in jQuery.jqsorttable' );
		}    		

	};
})(jQuery);