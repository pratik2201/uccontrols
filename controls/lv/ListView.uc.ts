import { Designer } from "uccontrols/designer/controls/lv/ListView.uc.designer";
import { TemplateNode } from "ucbuilder/Template";
import { CommonEvent } from "ucbuilder/global/commonEvent";
import { Size } from "ucbuilder/global/drawing/shapes";
import { ItemIndexChangeBy, NavigatePages } from "uccontrols/controls/lv/ListView.uc.navigate";
import { timeoutCall } from "ucbuilder/global/timeoutCall";
import { nodeHandler } from "uccontrols/controls/lv/ListView.uc.nodeHandler";
import { SourceIndexElementAttr, BasicSize, SourceManage } from "ucbuilder/global/datasources/SourceManage";
import { eventHandler } from "uccontrols/controls/lv/ListView.uc.events";
import { editorManage } from "uccontrols/controls/lv/ListView.uc.editorManage";


export class ListView extends Designer {

    private _itemTemplate: TemplateNode = undefined;
    public get itemTemplate(): TemplateNode {
        return this._itemTemplate;
    }
    public set itemTemplate(value: TemplateNode) {
        this._itemTemplate = value;
    }
    source = new SourceManage();
    navigate = new NavigatePages();
    nodes = new nodeHandler();
    Events = new eventHandler();
    editor: editorManage;
    public get currentIndex() {
        return this.navigate.config.currentIndex;
    }
    public set currentIndex(value) {
        this.navigate.config.currentIndex = value;
    }
    public get currentRecord() {
        return this.source[this.currentIndex];
    }
    constructor() {
        super(); this.initializecomponent(arguments, this);
        this.editor = new editorManage(this);
    }
    $() {
        this.navigate.main =
            this.nodes.main =
            this.Events.main = this;
        let config = this.navigate.config;
        this.source.onUpdate.on((len) => {

            // console.log(this.source.rowInfo.map(s=>s.size.height));
            //this.navigate.config.itemsTotalSize.height = this.source.info.height;
            //this.navigate.config.itemsTotalSize.width = this.source.info.width;

            config.length = len; //this.source.length;
            //config.itemsTotalSize.setBy.value(config.itemSize.width, config.itemSize.height * this.source.length);
            this.Events.fireScrollEvent = false;
            config.top = 0;
            this.vscrollbar1.scrollTop = 0;
            this.currentIndex = this.source.info.defaultIndex; // 0 changed..
            this.Refresh();
            //console.log(config.defaultIndex);
            this.Events.refreshScrollSize();
            //let config = this.navigate.config;
            // debugger;
            this.changeHiddenCount(config.topHiddenRowCount, config.bottomHiddenRowCount);
            // console.log([this.source.info.defaultIndex,this.source]);


        });
        let _this = this;
        _this.ll_view.innerHTML = '';
        this.source.onCompleteUserSide.on((rows,indexCounter) => {
            _this.measureItems(rows,indexCounter);
        });
        this.init();
        /* this.source.onUpdateRowInfo.on(() => {
             
         });*/
        this.ucExtends.PARENT.ucExtends.Events.loaded.on(() => {
            this.changeHiddenCount(config.topHiddenRowCount, config.bottomHiddenRowCount);

        });
    }
    //onLoaded = new CommonEvent<() => {}>();
    /**
     * 
     * @param src source items which will add and measure
     */
    measureItems = (src: any[],indexCounter = 0) => {
        let _this = this;

        let tExtebded = _this.itemTemplate.extended;
        _this.source.loop_RowInfo(src, (row, rowInfo, index) => {
            
            let genNode = tExtebded.generateNode(row);
            _this.ll_view.appendChild(genNode);
            rowInfo.element = genNode;
            genNode.data(SourceIndexElementAttr, index);
            let cmp = window.getComputedStyle(genNode);
            rowInfo.height = Size.getFullHeight(cmp) || genNode.offsetHeight;
            rowInfo.width = Size.getFullWidth(cmp) || genNode.offsetWidth;
            //console.log(_this.ll_view.offsetHeight);
            genNode.remove();
        },indexCounter);
        //console.log(this.source.info);

        //this.navigate.config.itemsTotalSize.height = this.source.info.height;
        //this.navigate.config.itemsTotalSize.width = this.source.info.width;

        //this.onLoaded.fire();

    }
    private _paging = true;
    public get paging() {
        return this._paging;
    }
    public set paging(value) {
        if (!value) {
            this.rectObs.disconnect();
            let config = this.navigate.config;
            config.viewSize.setBy.HTMLEle(this.scroller1);
            config.perPageRecord = Number.MAX_VALUE;
            this.begin_scroll_text.style.display =
                this.end_scroll_text.style.display = 'none';

        } else {
            this.begin_scroll_text.style.display =
                this.end_scroll_text.style.display = 'block';
            let config = this.navigate.config;
            config.viewSize.setBy.HTMLEle(this.scroller1);

            this.resizerCall({ width: config.viewSize.width, height: config.viewSize.height });
            if (!this.paging)
                this.rectObs.observe(this.scroller1);
        }
        this._paging = value;
    }
    rectObs: ResizeObserver;
    private init(): void {
        let config = this.navigate.config;
        let _this = this;

        this.ucExtends.PARENT.ucExtends.Events.loaded.on(() => {
            this.resizerCall(Size.getFullSize(window.getComputedStyle(this.scroller1)), false);
            if (_this.paging)
                _this.rectObs.observe(this.scroller1);
        });

        _this.rectObs = new ResizeObserver((e: ResizeObserverEntry[]) => {
            let rect = e[0].contentRect;
            let visibility = _this.ucExtends.getVisibility();
            //console.log(['....resizerCall',rect.height]);

            switch (visibility) {
                case 'visible':
                    _this.resizerCall({ width: rect.width, height: rect.height });
                    break;
                case 'hidden':
                    _this.rectObs.disconnect();
                    break;
            }

        });
        this.ucExtends.Events.afterClose.on(() => {
            _this.rectObs.disconnect();
        });

        _this.Events.init();
        this.Events.onChangeHiddenCount.on(this.changeHiddenCount);
    }
    changeHiddenCount = (topCount: number, bottomCount: number) => {
        this.begin_scroll_text.innerHTML = topCount == 0 ? "&nbsp;  " : "&#11165; " + topCount + "";
        this.end_scroll_text.innerHTML = bottomCount == 0 ? "&nbsp;  " : "&#11167; " + bottomCount + "";

    }

    focusAt0(fireScrollEvent = true) {
        this.Events.fireScrollEvent = fireScrollEvent;
        this.vscrollbar1.scrollTop = 0;
        this.currentIndex = this.source.info.defaultIndex;
    }
    scrollTop(topPos: number, fireScrollEvent = true) {
        this.Events.fireScrollEvent = fireScrollEvent;
        this.vscrollbar1.scrollTop = topPos;
    }
    private resizerCall = ({ width = 0, height = 0 }: { width: number, height: number }, callRefresh = true): void => {
        let _this = this;
        let config = _this.navigate.config;
        config.viewSize.setBy.value(width, height);
        _this.Events.refreshScrollSize();
        if (callRefresh) {
            config.top = config.getPos().topIndex;
            _this.Refresh();           
        }

    }
    isResizing = false;
    calledToFill = false;
    public Refresh(): boolean {
        // console.log("Refresh =  : "+this.calledToFill);
        if (this.calledToFill) return false;

        this.calledToFill = true;
        //timeoutCall.start(() => {
        /* if (this.Events.beforeOldItemRemoved.length != 0) {
             let cntnr = this.ll_view.children;
             for (let index = 0; index < cntnr.length; index++) {
                 const element = cntnr.item(index) as HTMLElement;
                 this.Events.beforeOldItemRemoved.fire([element]);
                 element.remove();
             }
         }*/

        // this.ll_view.innerHTML = '';
        this.nodes.fill();
        //console.log("Refresh = 2 : "+this.calledToFill);
        this.Events.refreshScrollbarSilantly();
        this.calledToFill = false;
        //console.log("Refresh = 3 : "+this.calledToFill);
        return true;
        //});
    }

}