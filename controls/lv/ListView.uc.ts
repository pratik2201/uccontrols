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
        this.navigate.config.itemSize.setBy.size(this.itemTemplate.extended.size);
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

    constructor() {
        super(); this.initializecomponent(arguments, this);
        this.navigate.main =
            this.nodes.main =
            this.Events.main = this;
        let config = this.navigate.config;
        this.source.onUpdate.on((len) => {            
            config.length = len;
            config.itemsTotalSize.setBy.value(config.itemSize.width, config.itemSize.height * this.source.length);
            this.Events.refreshScrollSize();
            this.Refresh();
        });
        this.init();

    }

    private init(): void {
        let config = this.navigate.config;
        let rectObs = new ResizeObserver((e) => {
            let rect = e[0].contentRect;
            config.viewSize.setBy.value(rect.width, rect.height);
            config.perPageRecord = Math.floor(config.viewSize.height / config.itemSize.height);
            config.itemsTotalSize.setBy.value(config.itemSize.width, config.itemSize.height * this.source.length);
            this.Events.refreshScrollSize();
            this.Refresh();
        }).observe(this.scroller1);

        this.Events.init();
    }
    calledToFill = false;
    public Refresh(): void {
        if (this.calledToFill) return;
        this.calledToFill = true;
        timeoutCall.start(() => {
            if (this.Events.beforeOldItemRemoved.length != 0) {
                let cntnr = this.ll_view.children;
                for (let index = 0; index < cntnr.length; index++) {
                    const element = cntnr.item(index) as HTMLElement;
                    this.Events.beforeOldItemRemoved.fire([element]);
                    element.remove();
                }
            }
            this.nodes.fill();
            this.calledToFill = false;
        });

    }

}