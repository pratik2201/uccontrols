const designer = require('./Pager.uc.designer.js');
const { PageManage } = require('@wfroot/appBuilder/Window/Util/Pager.uc.Manage.js');
const { pathInfo, propOpt, strOpt } = require('@wfroot/appBuilder/Window/build/common.js');
const { PageMouseEvent } = require('@wfroot/appBuilder/Window/codeFile/PageManage.enum.js');
const { nodeGenerator } = require('@wfroot/appBuilder/Window/codeFile/nodeGenerator.js');
const { fileDataBank } = require('@wfroot/appBuilder/Window/codeFile/fileDataBank.js');

class Pager extends designer {
    accessKey = propOpt.ATTR.ACCESS_KEY;
    pageMng = new PageManage();
    //source = [];
    source = [];

    /** @type {number} */
    topSpace = 0;

    constructor() {
        super(arguments);
       
        this.init();

        this.ucEvents.sizeChanged(() => {
            let lvHeight = parseFloat(this.Usercontrol_extended.wrapper.styles.height) - 10;
            lvHeight -= this.topSpace;
            this.container1.height(lvHeight);
            let records = parseInt(lvHeight / this.pageMng.nodes.height);
            if (this.pageMng.PageManage_extended.options.perPageRecord != records) {
                this.pageMng.PageManage_extended.options.perPageRecord = records;
                this.pageMng.PageManage_extended.records.fill();
            }
        });
        
        //console.log(this.topSpace);
        this.topSpace = this.cmd_prev.height() + this.cmd_next.height();
    }

    set itemWidth(val) { this.pageMng.PageManage_extended.nodes.width = val; }
    get itemWidth() { return this.pageMng.PageManage_extended.nodes.width; }

    set itemHeight(val) { this.pageMng.PageManage_extended.nodes.height = val; }
    get itemHeight() { return this.pageMng.PageManage_extended.nodes.height; }



    getElementAt(itemIndex) {
        return this.container1.find(` > [item-index="${itemIndex}"]`);
    }

  
    init() {
        this.node_Generator = new nodeGenerator();
        this.__itemtemplete_orignal = strOpt.decode_utf8(fileDataBank.readFile('appBuilder/Window/Util/Pager.uc.itemtemplete.html'));
        this.__itemtemplete_filtered = this.node_Generator.sizingFilter(this.__itemtemplete_orignal);
        this.rowHeaderVisible = true;
        this.initPager();
    }

    set rowHeaderVisible(val) {
        let $ele = $(this.__itemtemplete_orignal);
        if (val) $ele.find(">td.row-header").show(0);
        else $ele.find(">td.row-header").hide(0);
        this.__itemtemplete_filtered = this.node_Generator.sizingFilter($ele.get(0).outerHTML);
    }


    /** @param {{}[]} objs */
    setOptionsToAllRows() {
        //this.pageMng.setOptionsToAllRows()
        return PageManage.____refreshSource(this.source);
    }

    /** @private */
    __itemtemplete_orignal = "";

    /** @private */
    __itemtemplete_filtered = "";


    _templateText = "";
    set templateText(ttext) {
        this._templateText = ttext;
    }
    get templateText() { return this._templateText; }


    /**
     * @param {number} index 
     * @param {[]} row 
     * @returns {string}
     */
    getTempleteText = (index, row) => {
        return this.templateText;
    }

    /**
     * @param {number} index 
     * @param {[]} row 
     * @returns {string}
     */
    getNodeText = (index, row) => {
        return this.node_Generator.generateNew(this.source[index], this.getTempleteText(index, row));
    };

    initPager() {
        let _this = this;
        let uc = this.Usercontrol_extended.wrapper.elementHT;
        uc.attr('tabindex', -1);
        this.pageMng.usercontrol = this;
        //this.pageMng.PageManage_extended.options.commonthing = this.Usercontrol_extended.common;
        this.pageMng.Events.onDemandRecordCount = () => { return _this.source.length; }
        this.pageMng.element.$container = uc;
        this.pageMng.element.$listview = this.container1;
        this.pageMng.element.$nextRecordCount = this.cmd_next;
        this.pageMng.element.$prevRecordCount = this.cmd_prev;
        this.pageMng.nodes.getNode = (index) => {
            let obj = _this.source[index];
            /** @type {pageRowOption */
            let opt = obj[propOpt.ATTR.OPTION];
            return $(_this.node_Generator.generateNew({
                itemIndex: opt.index + 1,
                itemContent: _this.getNodeText(index, obj),
            }, _this.__itemtemplete_filtered));
        }
        this.pageMng.nodes.setup(this.pageMng.element.$container);
        this.pageMng.Events.onNewItemGenerate = (ele) => {
            //this.eventManager.on(ele);
        };
        this.pageMng.Events.onItemMouseDown = (evnt) => {
            this.pageMng.PageManage_extended.records.currentIndex = evnt.index;
            this.pageMng.PageManage_extended.records.render();
        };
        
        this.Usercontrol_extended.wrapper.elementHT.on("keydown",(event)=>{
            this.pageMng.PageManage_extended.options.checkForKeys(event);
        });


        this.Usercontrol_extended.wrapper.elementHT.on("mousewheel", (e) => {
            if(!this.isFocused)return;
            if (e.originalEvent.wheelDelta / 120 > 0) {
                this.pageMng.PageManage_extended.navigatePages.pageTo.upSide.Go();
            }
            else {
                this.pageMng.PageManage_extended.navigatePages.pageTo.downSide.Go();
            }
        });
        uc.on('focus', (event) => {
            this.isFocused = true;
        });
        uc.on('blur', (event) => {
            this.isFocused = false;
        });
    }
    set isFocused(val) {
        this.Usercontrol_extended.wrapper.elementHT.setAttribute('active-indicator', val ? "1" : "0");
        this.pageMng.isFocused = val;
    }
    get isFocused() { return this.Usercontrol_extended.wrapper.elementHT.is(document.activeElement); }
}
module.exports = Pager;