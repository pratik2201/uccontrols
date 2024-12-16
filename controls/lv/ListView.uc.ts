import { Designer } from "uccontrols/_designer/controls/lv/ListView.uc.designer";
import { TemplateNode } from "ucbuilder/Template";
import { Size } from "ucbuilder/global/drawing/shapes";
import { SourceManage } from "ucbuilder/lib/datasources/SourceManage";
import { eventHandler } from "uccontrols/controls/lv/ListView.uc.events";
import { SourceProperties } from "ucbuilder/lib/datasources/PropertiesHandler";
import { SourceScrollHandler } from "ucbuilder/lib/datasources/ScrollHandler";


export class ListView extends Designer {

    public get itemTemplate(): TemplateNode {
        return this.source.nodes.template;
    }
    public set itemTemplate(value: TemplateNode) {
        this.source.nodes.template = value;
        if (this.autoGenerateHeader) {
            this.GenerateHeader();
        }
        if (this.autoGenerateFooter) {
            this.GenerateFooter();
        }
    }
    GenerateHeader(row = {}): { tpt: TemplateNode, node: HTMLElement } {
        this.headerrow.innerHTML = '';
        let tpt = this.source.nodes.template.extended.main;
        let headerTptNode = tpt['_header'] as TemplateNode;
        if (headerTptNode != undefined) {
            let node = headerTptNode.extended.generateNode(row);
            node.removeAttribute('x-tabindex');
            this.headerrow.appendChild(node);
            return {
                tpt: headerTptNode,
                node: node
            };
        }

    }
    GenerateFooter(row = {}): { tpt: TemplateNode, node: HTMLElement } {
        this.footerrow.innerHTML = '';
        let tpt = this.source.nodes.template.extended.main;
        let footerTptNode = tpt['_footer'] as TemplateNode;
        if (footerTptNode != undefined) {
            let node = footerTptNode.extended.generateNode(row);
            node.removeAttribute('x-tabindex');
            this.footerrow.appendChild(node);
            return {
                tpt: footerTptNode,
                node: node
            };
        }
    }
    set autoGenerateBoth(val: boolean) {
        this.autoGenerateFooter = this.autoGenerateHeader = val;
    }
    autoGenerateHeader = true;
    autoGenerateFooter = true;
    sconfig: SourceProperties;
    source = new SourceManage();
    scrollbar: SourceScrollHandler;
    Events = new eventHandler();
    public get currentIndex() {
        return this.sconfig.currentIndex;
    }
    public set currentIndex(value) {
        try {
            this.sconfig.currentIndex = value;
        } catch {
            debugger;
        }
    }
    public get currentRecord() {
        return this.source[this.currentIndex];
    }
    constructor() {
        super(); this.initializecomponent(arguments, this);
        this.sconfig = this.source.info;
        this.scrollbar = this.source.scrollbar;
        this.sconfig.refUC = this;
    }
    $() {
        this.Events.main = this;
        let config = this.sconfig;
        config.container = this.ll_view;
        this.source.Events.onUpdate.on((len, fillRecommand) => {

            // console.log(this.source.rowInfo.map(s=>s.size.height));
            //this.navigate.config.itemsTotalSize.height = this.source.info.height;
            //this.navigate.config.itemsTotalSize.width = this.source.info.width;

            //config.length = len; //this.source.length;
            //config.itemsTotalSize.setBy.value(config.itemSize.width, config.itemSize.height * this.source.length);
            this.scrollbar.fireScrollEvent = false;
            config.top = 0;
            this.vscrollbar1.scrollTop = 0;
            // debugger;

            if (fillRecommand) {
                let ci = (this.source.category.startWithBeginIndex == -1) ?
                    this.source.info.defaultIndex : this.source.category.startWithBeginIndex;

                this.sconfig.setPos(ci, true);
                //this.source.nodes.fill();
                //console.log(config.defaultIndex);
                this.scrollbar.refreshScrollSize();
                //let config = this.navigate.config;
                // debugger;
                this.changeHiddenCount(config.topHiddenRowCount, config.bottomHiddenRowCount);
            } else {
                if (this.source.category.startWithBeginIndex == -1)
                    this.currentIndex = this.source.info.defaultIndex; // 0 changed..
                else
                    this.currentIndex = this.source.category.startWithBeginIndex;

            }
            // console.log([this.source.info.defaultIndex,this.source]);


        });
        let _this = this;
        _this.ll_view.innerHTML = '';

        this.init();

        this.ucExtends.PARENT.ucExtends.Events.loaded.on(() => {
            let onDemandNewItem = this.source.Events.onDemandNewItem;
            if (onDemandNewItem != undefined && this.source.length == 0) {
                this.source.push(onDemandNewItem());
            }
            //            console.log(['here',this.ucExtends.PARENT]);
            if (this.source.isLoaded == false) {
                this.source.ihaveCompletedByMySide();
            }

        });
    }

    /*
    measureItems = (src: any[], indexCounter = 0) => {
        let _this = this;
        let tExtebded = _this.itemTemplate.extended;
        _this.source.loop_RowInfo(src, (row, rowInfo, index) => {
            let genNode = tExtebded.generateNode(row);
            if (rowInfo.elementReplaceWith == undefined)
                _this.ll_view.appendChild(genNode);
            else {
                rowInfo.elementReplaceWith.after(genNode);
                genNode.setAttribute('x-tabindex', rowInfo.elementReplaceWith.getAttribute('x-tabindex'));
                rowInfo.element = genNode;
                rowInfo.elementReplaceWith.remove();
                rowInfo.elementReplaceWith = undefined;
            }
            rowInfo.element = genNode;
            //genNode.data(SourceIndexElementAttr, index);
            let cmp = window.getComputedStyle(genNode);
            rowInfo.height = Size.getFullHeight(cmp) || genNode.offsetHeight;
            rowInfo.width = Size.getFullWidth(cmp) || genNode.offsetWidth;
            //console.log(_this.ll_view.offsetHeight);
            //genNode.remove();
        }, indexCounter);
        //console.log(this.source.info);
        //this.navigate.config.itemsTotalSize.height = this.source.info.height;
        //this.navigate.config.itemsTotalSize.width = this.source.info.width;
        //this.onLoaded.fire();
    }*/
    private _paging = true;
    public get paging() {
        return this._paging;
    }
    public set paging(value) {
        let config = this.sconfig;

        if (!value) {
            this.rectObs.disconnect();
            config.viewSize.setBy.value(Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER);
            this.begin_scroll_text.style.display =
                this.end_scroll_text.style.display = 'none';

        } else {
            this.begin_scroll_text.style.display =
                this.end_scroll_text.style.display = 'block';

            // this.resizerCall({ width: config.viewSize.width, height: config.viewSize.height });
            if (!this.paging)
                this.rectObs.observe(this.scroller1);
        }
        this._paging = value;
    }
    rectObs: ResizeObserver;
    private init(): void {
        let _this = this;

        this.ucExtends.PARENT.ucExtends.Events.loaded.on(() => {
            if (_this.paging) {
                _this.resizerCall(Size.getFullSize(window.getComputedStyle(_this.scroller1)), false);
                _this.rectObs.observe(_this.scroller1);
            }
        });

        _this.rectObs = new ResizeObserver((e: ResizeObserverEntry[]) => {
            let rect = e[0].contentRect;
            let visibility = _this.ucExtends.getVisibility();
            //console.log(['....resizerCall',rect.height]);
            if (_this.source.ArrangingContents) {
                _this.source.ArrangingContents = false; return;
            }
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

        this.source.Events.onChangeHiddenCount.on(this.changeHiddenCount);

        this.source.scrollbar.setup(this.vscrollbar1);
        this.ucExtends.passElement(this.source.scrollbar.sizerElement);


        _this.Events.init();
        this.Events.onChangeHiddenCount.on(this.changeHiddenCount);
    }
    changeHiddenCount = (topCount: number, bottomCount: number) => {
        this.begin_scroll_text.innerHTML = topCount == 0 ? "&nbsp;  " : "&#11165; " + topCount + "";
        this.end_scroll_text.innerHTML = bottomCount == 0 ? "&nbsp;  " : bottomCount + " &#11167;";

    }

    focusAt0(fireScrollEvent = true) {
        this.scrollbar.fireScrollEvent = fireScrollEvent;
        this.vscrollbar1.scrollTop = 0;
        this.currentIndex = this.source.info.defaultIndex;
    }
    scrollTop(topPos: number, fireScrollEvent = true) {
        this.scrollbar.fireScrollEvent = fireScrollEvent;
        this.vscrollbar1.scrollTop = topPos;
    }
    private resizerCall = ({ width = 0, height = 0 }: { width: number, height: number }, callRefresh = true): void => {
        let _this = this;
        let config = _this.sconfig;
        config.viewSize.setBy.value(width, height);
       // console.log([this, 'resizerCall']);

        config.setPos();
        /*if (callRefresh) {

            config.top = config.getPos().topIndex;
            console.log([_this.scroller1]);
            console.log(['resizerCall',config.viewSize.height]);

            _this.source.nodes.fill();
            _this.scrollbar.refreshScrollSize();
        }*/
    }
    isResizing = false;


}