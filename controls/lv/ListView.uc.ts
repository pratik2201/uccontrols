import { R } from 'uccontrols/R';
import { Designer } from './ListView.uc.designer';
import { TemplateNode } from 'ucbuilder/Template';
import { CommonEvent } from 'ucbuilder/global/commonEvent';
import { BasicSize, SourceManage } from './ListView.uc.sourceManage';
import { Size } from 'ucbuilder/global/drawing/shapes';
import { ItemIndexChangeBy, NavigatePages } from './ListView.uc.navigate';
import { timeoutCall } from 'ucbuilder/global/timeoutCall';
import { nodeHandler, pagerATTR } from './ListView.uc.nodeHandler';
import { eventHandler } from './ListView.uc.events';


export class ListView extends Designer {

    private _itemTemplate: TemplateNode = undefined;
    public get itemTemplate(): TemplateNode {
        return this._itemTemplate;
    }
    public set itemTemplate(value: TemplateNode) {
        this._itemTemplate = value;
        this.ll_view.appendChild(this._itemTemplate.extended.sampleNode);
        let cmp = window.getComputedStyle(this._itemTemplate.extended.sampleNode);
        this.itemTemplate.extended.size.setBy.style(cmp);

        this.navigate.config.itemSize.setBy.size(this.itemTemplate.extended.size);

        this._itemTemplate.extended.sampleNode.remove();
    }
    source = new SourceManage();
    navigate = new NavigatePages();
    nodes = new nodeHandler();
    Events = new eventHandler();
    public get currentIndex() {
        return this.navigate.config.currentIndex;
    }
    public set currentIndex(value) {
        this.navigate.config.currentIndex = value;
    }
    public get currentRecord() {
        return this.source[this.currentIndex];
    }
    constructor() { super(); this.initializecomponent(arguments, this); console.clear();
    }
    0() {
        this.navigate.main =
            this.nodes.main =
            this.Events.main = this;
        let config = this.navigate.config;
        this.source.onUpdate.on((len) => {
            this.setRowInfos();
           // console.log(this.source.rowInfo.map(s=>s.size.height));
            
            config.length = len; //this.source.length;
            //config.itemsTotalSize.setBy.value(config.itemSize.width, config.itemSize.height * this.source.length);
            this.Events.fireScrollEvent = false;
            config.top = 0;
            this.currentIndex = config.defaultIndex; // 0 changed..
            this.vscrollbar1.scrollTop = 0;
            this.Refresh();
            //console.log(config.defaultIndex);
            this.Events.refreshScrollSize();
            //let config = this.navigate.config;
            // debugger;
            this.changeHiddenCount(config.topHiddenRowCount, config.bottomHiddenRowCount);

        });
        this.init();
        this.source.onUpdateRowInfo.on(() => {
            
        });
    }
    onLoaded = new CommonEvent<() => {}>();
    setRowInfos = () => {
        let _this = this;
        _this.ll_view.innerHTML = '';
        _this.source.loop_RowInfo((row, rowInfo, index) => {
            let genNode = _this.itemTemplate.extended.generateNode(row);
            _this.ll_view.appendChild(genNode);
            rowInfo.element = genNode;
            genNode.data(pagerATTR.itemIndex, index);
            let cmp = window.getComputedStyle(genNode);
            rowInfo.height = Size.getFullHeight(cmp);
            rowInfo.width = Size.getFullWidth(cmp);
            genNode.remove();

        });
        
        this.navigate.config.itemsTotalSize.height = this.source.allElementSize.height;
        this.navigate.config.itemsTotalSize.width = this.source.allElementSize.width;
        this.onLoaded.fire();
    }
    private _paging = false;
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
        let hasCalled_resizerCall = false;

        this.ucExtends.PARENT.ucExtends.Events.loaded.on(() => {
            this.resizerCall(Size.getFullSize(window.getComputedStyle(this.scroller1)), false);
            _this.rectObs.observe(this.scroller1);
        });

        _this.rectObs = new ResizeObserver((e: ResizeObserverEntry[]) => {
            let rect = e[0].contentRect;
            //console.log(this.scroller1.offsetHeight);
            _this.resizerCall({ width: rect.width, height: rect.height });
        });


        _this.Events.init();
        // console.log(window.getComputedStyle(this.scroller1));
        // console.log("====> "+this.scroller1.isConnected);


        this.Events.onChangeHiddenCount.on(this.changeHiddenCount);
    }
    changeHiddenCount = (topCount: number, bottomCount: number) => {
        this.begin_scroll_text.innerHTML = topCount == 0 ? "&nbsp;" : "▲ " + topCount + "";
        this.end_scroll_text.innerHTML = bottomCount == 0 ? "&nbsp;" : "▼ " + bottomCount + "";

    }

    focusAt0(fireScrollEvent = true) {
        this.Events.fireScrollEvent = fireScrollEvent;
        this.vscrollbar1.scrollTop = 0;
        this.currentIndex = this.navigate.config.defaultIndex;
    }
    scrollTop(topPos: number, fireScrollEvent = true) {
        this.Events.fireScrollEvent = fireScrollEvent;
        this.vscrollbar1.scrollTop = topPos;
    }
    private resizerCall = ({ width = 0, height = 0 }: { width: number, height: number }, callRefresh = true): void => {
        let _this = this;
        let config = _this.navigate.config;
        config.viewSize.setBy.value(width, height);
        config.perPageRecord = Math.floor(config.viewSize.height / config.itemSize.height);
      //  config.itemsTotalSize.setBy.value(config.itemSize.width, config.itemSize.height * _this.source.length);
        _this.Events.refreshScrollSize();
        // console.log("*** "+height);
        if (callRefresh)
            _this.Refresh();
    }
    isResizing = false;
    calledToFill = false;
    public Refresh(): boolean {
        // console.log("Refresh =  : "+this.calledToFill);
        if (this.calledToFill) return false;

        this.calledToFill = true;
        //timeoutCall.start(() => {
        if (this.Events.beforeOldItemRemoved.length != 0) {
            let cntnr = this.ll_view.children;
            for (let index = 0; index < cntnr.length; index++) {
                const element = cntnr.item(index) as HTMLElement;
                this.Events.beforeOldItemRemoved.fire([element]);
                element.remove();
            }
        }

        // this.ll_view.innerHTML = '';
        this.nodes.fill();
        //console.log("Refresh = 2 : "+this.calledToFill);

        this.calledToFill = false;
        //console.log("Refresh = 3 : "+this.calledToFill);
        return true;
        //});
    }

}