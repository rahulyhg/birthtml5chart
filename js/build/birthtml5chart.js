/**
 * New node file
 */
(function(chart){
	
;/**
 * 
 */
// Inject extended d3 funciton
d3.selection.prototype.bbox = function (refresh) {
    if (!refresh && this._bbox) {
        return this._bbox;
    }
    
    this._bbox = {x: 0, y: 0, width: 0, height: 0};
    for (var j = 0, m = this.length; j < m; j++) {
        for (var group = this[j], i = 0, n = group.length; i < n; i++) {
          var node = group[i];
          if (node && (node.nodeName === 'g' || node.nodeName === 'text')) {
              var bbox = node._bbox;
              if (!bbox || refresh) {
                  bbox = bbox || node.getBBox();
              }
              this._bbox.x = (bbox.x < this._bbox.x) ? bbox.x: this._bbox.x;
              this._bbox.y = (bbox.y < this._bbox.y) ? bbox.y : this._bbox.y;
              this._bbox.width = (bbox.x + bbox.width > this._bbox.x + this._bbox.width) ? bbox.width: this._bbox.width;
              this._bbox.height = (bbox.y + bbox.height > this._bbox.y + this._bbox.height) ? bbox.height: this._bbox.height;
          };
        }
    }
    return this._bbox;
};

d3.transition.prototype.bbox = d3.selection.prototype.bbox;;/**
 * New node file
 */
var Element = function() {};
var Label = function(){};
var Series = function(){};
var DataPoint = function(){};
var Axis = function(){};
var Legend = function(){};
var LegendItem = function(){};
var Title = function(){};
var ChartContext = function() {};
var Chart = function() {};
var Tooltip = function(){};;/** Check if specified value is number.
 * 
 * @param v
 * @returns {Boolean}
 */
function isNumber(v) {
    return typeof v === 'number';
}

/**
 * Check if specified value is string.
 * 
 * @param v
 * @returns {Boolean}
 */
function isString(v) {
    return typeof v === 'stirng';
}

/**
 * Check if specified value is function.
 * 
 * @param v
 * @returns {Boolean}
 */
function isFunction(v) {
    return typeof v === 'funciton';
}

/**
 * Check if specified value is object.
 * 
 * @param v
 * @returns {Boolean}
 */
function isObject(v) {
    return typeof v === 'object';
}

/**
 * Convert degree to radian.
 * 
 * @param deg
 * @returns {Number}
 */
function toRadian(deg) {
    return deg * Math.PI / 180;
}

/**
 * Convert radian to degree
 * 
 * @param radian
 * @returns {Number}
 */
function toDegree(radian) {
	return radian * 180 / Math.PI; 
}

/**
 * Visit each element of specified object and process with specified function.
 * 
 * @param obj
 * @param functor
 * @returns
 */
function each(obj, functor) {
    for (var k in obj) {
        if (obj.hasOwnProperty(k)) {
            obj[k] = functor.call(obj, obj[k]);
        }
    }
    return obj;
}

/**
 * Clone an object and its properties.
 * 
 * @param obj
 *            the object will be cloned.
 * @returns an new instance of specified object.
 */
function clone(obj) {
    if (obj === null || (typeof obj) !== 'object') {
        return obj;
    }
    var temp = new obj.constructor();
    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            temp[key] = d3c_clone(obj[key]);
        }
    }
    return temp;
}

/**
 * Simple copy object.
 * 
 * @param obj
 * @returns
 */
function copy(obj) {
    if (obj === null || (typeof obj) !== 'object') {
        return obj;
    }
    var temp = {};
    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            temp[key] = d3c_copy(obj[key]);
        }
    }
    return temp;
}

/**
 * Return bounding box of specified svg node.
 * 
 * @param node
 * @param refresh
 * @returns
 */
function bbox(node, refresh) {
    if (!refresh && node._bbox) {
        return node._bbox;
    }
    
    var b = (node.nodeName === 'g' || node.nodeName === 'text') ? node.getBBox() : {'x': 0, 'y': 0, 'width': 0, 'height': 0};
    node._bbox = {'x': b.x, 'y': b.y, 'width': b.width, 'height': b.height};
    return node._bbox;
}


/**
 * Merge properties of source object into target object and override.
 * 
 * @param a
 *            the target object.
 * @param b
 *            the source object.
 * @returns target object
 */
function merge(a, b) {
    if (!b) {
        return a;
    }
    if (!a) {
        return d3c_clone(b);
    }
    
    for (var prop in b) {
        if (b.hasOwnProperty(prop)) {
            if (b[prop] === null || (typeof b[prop]) !== 'object') {
                a[prop] = b[prop];
            } else {
                a[prop] = d3c_merge(a[prop], b[prop]);
            }
        }
    }
    
    return a;
}

/**
 * Merge property of source object into target object.
 * 
 * @param a
 * @param b
 * @returns
 */
function extend(a, b) {
    var k = null;
    if (!a) {
        a = {};
    }
    for (k in b) {
        if (b.hasOwnProperty(k)) {
            a[k] = b[k];
        }
    }
    return a;
}
/**
 * Define and extend class.
 * 
 * @param selfFunction
 * @param pClass
 * @param protoObj
 * @returns
 */
function extendClass(selfFunction, pClass, protoObj) {
    function constructor(container, chartContext, options) {
        // Initialize private variable set.
        this._p = {};
        
        // Init this object.
        if (this.fInit) {
            this.fInit.apply(this, arguments);
        }
        return this;
    }
    
    var newClass = selfFunction ? selfFunction : constructor;
    newClass.prototype = pClass ? new pClass() : {};
    d3c_extend(newClass.prototype, protoObj);
    newClass.prototype.__super__ = pClass ? pClass.prototype : null;
    return newClass;
}

/**
 * Rotate a svg node.
 * <p>
 * The _mode values include start, end, middle. Middle means the x and y
 * coordinates of rotation point is at center of text. Start means the x
 * coordinate of rotation point is at start of text, y coordinate is center of
 * text. End is similar to Start.
 * 
 * @param svgNode
 * @param degree
 * @param mode 'auto'/'start'/'end'/'middle'
 */
function rotateNode(svgNode, degree, mode) {
    var box, cx, cy, tran, tranA, cxy;

    if (degree) {
        box = svgNode.getBBox();
        if (mode === 'auto') {
            cxy = '';
        } else {
            cx = (mode === 'start') ? box.x : (mode === 'end') ? box.x +
                    box.width : (box.x + box.width / 2);
            cy = box.y + box.height / 2;  
            cxy = ' ' + cx + ' ' + cy;
        }
        tran = svgNode.getAttribute('transform');
        if (tran) {
            tranA = tran.split(/\)/g);
            if (tranA.length) {
                tran = '';
                for (var i in tranA) {
                    if (tranA.hasOwnProperty(i)) {
                        tran += ' ' + (tranA[i].indexOf('rotate') >= 0) ? 'rotate(' +
                                degree + cxy + ')'
                                : tranA[i].trim() + ')';
                    }
                }
            }
        } else {
            tran = 'rotate(' + degree + cxy + ')';
        }
        svgNode.setAttribute('transform', tran);
    }
    return svgNode;
}

/**
 * Rotate elements of selection.
 * 
 * @param d3Sel d3js selection object
 * @param degree
 * @param mode start/middle/end/auto
 */
function rotate(d3Sel, degree, mode) {
    return d3Sel.attr('transform', function (_d) {
        var box, cx, cy, tran = null, tranA, cxy;

        if (degree) {
            box = this.getBBox();
            if (mode === 'auto') {
                cxy = '';
            } else {
                cx = (mode === 'start') ? box.x : (mode === 'end') ? box.x +
                        box.width : (box.x + box.width / 2);
                cy = box.y + box.height / 2;  
                cxy = ' ' + cx + ',' + cy;
            }
            
            tran = this.getAttribute('transform');
            if (tran) {
                tranA = tran.split(/\)/g);
                if (tranA.length) {
                    tran = '';
                    for (var i in tranA) {
                        if (tranA.hasOwnProperty(i)) {
                            tran += ' ' + (tranA[i].indexOf('rotate') >= 0) ? 'rotate(' +
                                    degree + cxy + ')'
                                    : tranA[i].trim() + ')';
                        }
                    }
                }
            } else {
                tran = 'rotate(' + degree + cxy + ')';
            }
        }
        return tran;
    });
}

/**
 * Translate elements of selection.
 * 
 * @param d3Sel d3js selection object
 * @param x
 * @param y
 */
function translate(d3Sel, x, y) {
    if (arguments.length === 1) {
        // Return x and y of current translate.
        var transXY = [];
        d3Sel.each(function(){
            var tran = this.getAttribute('transform');
            if (tran && tran.indexOf('translate') >= 0) {
                tran = tran.match(/translate\([0-9\s\.\-,]+\)/);
                if (tran && tran.length) {
                    tran = tran[0].match(/([0-9\.\-]+)/g);
                    if (tran && tran.length && tran.length > 1) {
                        transXY.push({'x':tran[0], 'y': tran[1]});
                    }
                }
            }
        });
        return transXY;
    }
    
    function f (x, d) {
        return typeof x === 'function' ? x(d) : x; 
    }
    return d3Sel.attr('transform', function (d) {
        var tran = this.getAttribute('transform');
        if (tran && tran.indexOf('translate') >= 0) {
            tranA = tran.split(/\)/g);
            if (tranA.length) {
                tran = '';
                for (var i in tranA) {
                    if (tranA.hasOwnProperty(i) && tranA[i].trim() !== '') {
                        tran += ' ' + (tranA[i].indexOf('translate') >= 0) ? 'translate(' +
                                f(x, d) + ',' + f(y, d) + ')'
                                : tranA[i].trim() + ')';
                    }
                }
            }
        } else {
            tran = 'translate(' + f(x, d) + ',' + f(y, d) + ') ' + (tran || '');
        }
        return tran;
    });
}

var LINEAR_GRADIENT_SHORT_NAME_PARTS = {
        'L' : ['0%', '50%'],
        'R' : ['100%', '50%'],
        'T' : ['50%', '0%'],
        'B' : ['50%', '100%'],
        'LT' : ['0%', '0%'],
        'TL' : ['0%', '0%'],
        'LB' : ['0%', '100%'],
        'BL' : ['0%', '100%'],
        'RT' : ['100%', '0%'],
        'TR' : ['100%', '0%'],
        'RB' : ['100%', '100%'],
        'BR' : ['100%', '100%']
    };

/**
 * Convert gradient color options to svg gradient color paramters.
 * 
 * @param gradientOpts
 * @returns
 */
function adaptColorGradient(gradientOpts) {
    var params = gradientOpts.parameters,
        parts = null;
    if (gradientOpts.type === 'linearGradient') {
        params = params || ['0%',  '0%', '100%', '100%'];
        if (typeof params === 'string') {
            /**
             * It uses short name. The short name include L,T,R,B and mean Left
             * side, Top side, Right side and Bottom Side.
             * <p>
             * The form should be like 'L,R' or 'T,B' or 'LT,RB' and so on
             * separated with comma, the first part means start and the second
             * part means end. The short name will be convert to percent value form.
             */
            parts = params.split(',');
            params = [];
            params[0] = LINEAR_GRADIENT_SHORT_NAME_PARTS[parts[0]][0];
            params[1] = LINEAR_GRADIENT_SHORT_NAME_PARTS[parts[0]][1];
            params[2] = LINEAR_GRADIENT_SHORT_NAME_PARTS[parts[1]][0];
            params[3] = LINEAR_GRADIENT_SHORT_NAME_PARTS[parts[1]][1];
        }
        return {x1 : params[0], y1 : params[1], x2 : params[2], y2 : params[3]};
    } else if (gradientOpts.type === 'radialGradient') {
        return {cx : params[0], cy : params[1], r : params[2], fx : params[3], fy : params[4]};
    }
}

/**
 * {@link http://www.websiteoptimization.com/secrets/css/font-shorthand.html}
 * <br>The syntax of the font: shorthand property is as follows:
 * <br>
 * font: &lt;font-style&gt; &lt;font-variant&gt; &lt;font-weight&gt; &lt;font-size&gt; / &lt;line-height&gt; &lt;fontfamily&gt;
 * 
 * @param fontOpts
 * @returns
 */
function adaptFontShorthand(fontOpts) {
	var fstyle = fontOpts;
	if (isObject(fontOpts)) {
		
	}
	return fstyle;
	
};var DefaultTextOpts = {
	value:'',
	format:'',
	font:'',
	color:'',
	rotate:'',
	rotateMode:''
};

var Text = function(opts) {
	this.opts = opts;

	return this;
}

Text.prototype = {
	render : function(sel) {
		this.sel = sel;
		this.redraw();
	},
	redraw: function() {
		var all = this.sel.selectAll('.text').data([this.opts]),
		enterText = all.enter().append('svg:text');
		
		all.exit().remove();
		all.update().style()
	}
};/**
 * Merge options from text.
 */
var DefaultLabelOpts = {
	value : '',
	format : '',
	font : {
		name : '',
		size : '',
		color : ''
	},
	rotate : '',
	rotateMode : '',
	outline: {
		style:'',
		color:'',
		width:''
			
	},
	style : null

}
/**
 * New node file
 */
var Label = function(opts) {
	this.opts = opts;

	return this;
}

Label.prototype = {
	render: function(sel) {

	}
}
;/**
 * New node file
 */
})(chart)