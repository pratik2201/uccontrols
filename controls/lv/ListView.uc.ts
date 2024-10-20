import { R } from 'uccontrols/R';
import { Designer } from './ListView.uc.designer';
import { TemplateNode } from 'ucbuilder/Template';
import { CommonEvent } from 'ucbuilder/global/commonEvent';
import { SourceManage } from './ListView.uc.sourceManage';
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
    constructor() {
        super(); this.initializecomponent(arguments, this);
        this.navigate.main =
            this.nodes.main =
            this.Events.main = this;
        let config = this.navigate.config;
        this.source.onUpdate.on((len) => {
            config.length = len; //this.source.length;

            config.itemsTotalSize.setBy.value(config.itemSize.width, config.itemSize.height * this.source.length);
            this.Events.fireScrollEvent = false;
            this.Events.refreshScrollSize();
            this.Refresh();
            this.currentIndex = config.defaultIndex; // 0 changed..
            //let config = this.navigate.config;
            this.changeHiddenCount(config.topHiddenRowCount, config.bottomHiddenRowCount);

        });
        this.init();

    }
    rectObs: ResizeObserver;
    private init(): void {
        let config = this.navigate.config;
        let _this = this;
        _this.rectObs = new ResizeObserver((e: ResizeObserverEntry[]) => {
            let rect = e[0].contentRect;
            this.resizerCall({ width: rect.width, height: rect.height });
        });
        _this.rectObs.observe(this.scroller1);
        _this.Events.init();
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
    private resizerCall = ({ width = 0, height = 0 }: { width: number, height: number }): void => {
        let _this = this;
        let config = _this.navigate.config;
        // console.log("Refresh =  0: "+_this.calledToFill);

        let ppr = config.perPageRecord;

        config.viewSize.setBy.value(width, height);
        config.perPageRecord = Math.floor(config.viewSize.height / config.itemSize.height);
        config.itemsTotalSize.setBy.value(config.itemSize.width, config.itemSize.height * _this.source.length);
        // console.log(width,height);

        _this.Events.refreshScrollSize();
        //if (!_this.calledToFill) {
        //_this.isResizing = true;
        //setTimeout(() => {
        _this.Refresh();

        //console.log(rect.height + ' : Refresh..');
        // _this.isResizing = false;
        //}, 1);
        // }
    }
    isResizing = false;
    calledToFill = false;
    public Refresh(): boolean {
        //console.log("Refresh = 1 : "+this.calledToFill);
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