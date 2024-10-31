import { CommonEvent } from "ucbuilder/global/commonEvent";
import { ItemIndexChangeBy } from "uccontrols/controls/lv/ListView.uc.navigate";
import { SourceIndexElementAttr } from "ucbuilder/global/datasources/SourceManage";
import { keyBoard } from "ucbuilder/global/hardware/keyboard";
import { numOpt } from "ucbuilder/build/common";
import { log } from "console";
import { ListView } from "uccontrols/controls/lv/ListView.uc";
export class eventHandler {
  //#region  EVENT DECLARATION
  itemDoubleClick = new CommonEvent<(index: number, evt: MouseEvent) => void>();
  itemMouseDown = new CommonEvent<(index: number, evt: MouseEvent) => void>();
  itemMouseUp = new CommonEvent<(index: number, evt: MouseEvent) => void>();
  beforeOldItemRemoved = new CommonEvent<(itemHT: HTMLElement) => void>();
  onClearContainer = new CommonEvent<() => void>();
  newItemGenerate = new CommonEvent<(itemnode: HTMLElement, index: number) => void>();
  onChangeHiddenCount = new CommonEvent<(topHiddenCount: number, bottomHiddenCount: number) => void>();
  currentItemIndexChange = new CommonEvent<(
    oldIndex: number,
    newIndex: number,
    evt: MouseEvent | KeyboardEvent,
    eventType: ItemIndexChangeBy
  ) => void>();
  onRowNavigationChanged = (
    callback: (evt: KeyboardEvent, valToAddRemove: number) => void,
    event: KeyboardEvent,
    valToAddRemove: number
  ): void => {
    callback(event, valToAddRemove);
  };
  onReachFirstRecord = (): boolean => {
    return false;
  };
  onReachLastRecord = (): boolean => {
    return false;
  };
  //#endregion
  private _main : ListView;
  public get main() {
    return this._main;
  }
  public set main(value) {
    this._main = value;
  }
  get navigatePages() {
    return this._main.navigate;
  }
  fireScrollEvent: boolean = true;
  constructor() {

  }
  init() {
    this.main.ll_view.addEventListener("dblclick", (e: MouseEvent) => {
      let itm = this.main.nodes.getItemFromChild(e.target as HTMLElement);
      if (itm != null) {
        this.main.navigate.setCurrentIndex(itm.data(SourceIndexElementAttr), e, "Mouse");
        this.itemDoubleClick.fire([this.main.currentIndex, e]);
      }
    });

    this.main.ll_view.addEventListener("mousedown", (e: MouseEvent) => {
      let itm = this.main.nodes.getItemFromChild(e.target as HTMLElement);
      if (itm != null) {
        
        this.main.navigate.setCurrentIndex(itm.data(SourceIndexElementAttr), e, "Mouse");
        this.itemMouseDown.fire([this.main.currentIndex, e]);
      }
    });
    this.main.ll_view.addEventListener("mouseup", (e: MouseEvent) => {
      let itm = this.main.nodes.getItemFromChild(e.target as HTMLElement);
      
      if (itm != null) {
        this.itemMouseUp.fire([this.main.currentIndex, e]);
      }
    });
    this.fireScrollEvent = true;
    this.main.vscrollbar1.addEventListener("scroll", (e: Event) => {
      if (!this.fireScrollEvent) { this.fireScrollEvent = true; return; }
      let vScroll = this.main.vscrollbar1;
   
      const scrollTop = vScroll.scrollTop || document.body.scrollTop;
      const scrollHeight = vScroll.scrollHeight - vScroll.clientHeight;
      const scrollPercentage = Math.ceil((scrollTop / scrollHeight) * 100);
      
      let cfg = this.navigatePages.config;
      let src = this.main.source;
      
      //let scrollTop = Math.floor(this.main.vscrollbar1.scrollTop / this.navigatePages.config.itemSize.height);
      let tval = numOpt.gtvc(100, cfg.itemsTotalSize.height-cfg.viewSize.height, scrollPercentage);
      tval = Math.floor(tval);
     // console.log(tval);
      let top = this.main.source.getIndex(tval);
      this.doVerticalContentScrollAt(top, false);
      
      //console.log([top,tval]);
     // this.doVerticalContentScrollAt(top, false);
      //let topInfo = src.getTopIndex(bottom,cfg.viewSize.height,{overflowed:false});  
     // console.log([topInfo.index,topInfo.status,tval]);
      
      //this.doVerticalContentScrollAt(top, false);
    });
    /*this.main.hscrollbar1.addEventListener("scroll", (e: Event) => {
      let scrollLeft = this.main.hscrollbar1.scrollLeft; //Math.floor(this.main.scroller1.scrollLeft / this.navigatePages.config.itemSize.width);
      //console.log(this.main.hscrollbar1.scrollLeft);
      this.main.scroller1.scrollLeft = scrollLeft;
    });*/

    this.main.ll_view.addEventListener("wheel", (e: WheelEvent) => {
      if (e.deltaY > 0) {
        this.navigatePages.pageTo.downSide.Go(e as unknown as KeyboardEvent);
      } else {
        this.navigatePages.pageTo.upSide.Go(e as unknown as KeyboardEvent);
      }
      this.refreshScrollbarSilantly();
    });
    let hasCompleteKeyDownEvent = true;
    this.main.scroller1.addEventListener("keydown", (e: KeyboardEvent) => {
      if (!hasCompleteKeyDownEvent) return;
      hasCompleteKeyDownEvent = false;
      setTimeout(() => {
        this.doKeyEvent(e);
        hasCompleteKeyDownEvent = true;
      }, 1);
    });
    /*this.pagerLv.Events.onkeydown = (e: KeyboardEvent) => {
        if (!hasCompleteKeyDownEvent) return;
        hasCompleteKeyDownEvent = false;
        setTimeout(() => {
            this.doKeyEvent(e);
            hasCompleteKeyDownEvent = true;
        }, 1);
    };*/

    this.initVerticalScroller();
  }
  onkeyDown_callback = (e): boolean => {
    return false;
  }
  
  doKeyEvent(e: KeyboardEvent): boolean {
    if (this.onkeyDown_callback(e) === true) return true;
    switch (e.keyCode) {
      case keyBoard.keys.up: // up key
        this.navigatePages.moveTo.prevSide.Go(e);
        break;
      case keyBoard.keys.down: // down key
        this.navigatePages.moveTo.nextSide.Go(e);
        break;
      case keyBoard.keys.pageUp: // page up key
        this.navigatePages.pageTo.upSide.Go(e);
        let cfg = this.navigatePages.config;
        cfg.currentIndex = cfg.top == 0 ? cfg.defaultIndex : cfg.top;
        //this.main.Refresh();
        break;
      case keyBoard.keys.pageDown: // page down key
        this.navigatePages.pageTo.downSide.Go(e);
        this.navigatePages.config.currentIndex = this.navigatePages.config.bottomIndex;
        //this.main.Refresh();
        break;
      case keyBoard.keys.end: // end key
        this.navigatePages.config.top = this.navigatePages.config.lastSideTopIndex;
        this.main.Refresh();
        this.main.currentIndex = this.main.source.length - 1;
        break;
      case keyBoard.keys.home: // home key  
        this.navigatePages.config.top = 0;
        this.main.Refresh();
        this._main.currentIndex = 0;
        break;
      default: return false;
    }
    this.refreshScrollbarSilantly();
    return true;
  }
  isfilling: boolean = false;
  doVerticalContentScrollAt(scrollval: number, useTimeOut: boolean = true) {
    //console.log(this.navigatePages.config.top);
    if (this.isfilling) return;
    this.isfilling = true;
    let _this = this;
    /*let element = this.main.vscrollbar1;
    if (element.scrollTop + element.offsetHeight >= element.scrollHeight - 1) { // is bottom reached
      scrollval = this.main.source.length - this.navigatePages.config.perPageRecord;
    }*/
    if (useTimeOut) setTimeout(doscroll);
    else doscroll();
    function doscroll() {
      let config = _this.navigatePages.config;
      config.top = Math.floor(scrollval);
      _this.main.nodes.fill();
      _this.isfilling = false;
       
      _this.main.changeHiddenCount(config.topHiddenRowCount, config.bottomHiddenRowCount);
    }
  }
  refreshScrollbarSilantly() {
    this.fireScrollEvent = false;
    let config = this.navigatePages.config;
    let vScroll = this.main.vscrollbar1;
    let src = this.main.source;
    let top = src.getRow(config.top);
    let rw = top.runningHeight-top.height;
    vScroll.scrollTo(0,rw);
    this.onChangeHiddenCount.fire([config.topHiddenRowCount, config.bottomHiddenRowCount]);
  }
  refreshScrollSize() {
    this.scrollSubElements.verticalSizerHT.style['height'] = this.main.navigate.config.itemsTotalSize.height + 'px';
    //this.scrollSubElements.horizontalSizerHT.style['width'] = this.main.navigate.config.itemsTotalSize.width + 'px';
  }
  scrollSubElements = {
    verticalSizerHT: '<sizer></sizer>'.$(),
    //horizontalSizerHT: '<sizer></sizer>'.$(),
  }
  initVerticalScroller() {
    let config = this.navigatePages.config;
    this.main.vscrollbar1.appendChild(this._main.ucExtends.passElement(this.scrollSubElements.verticalSizerHT) as HTMLElement);
    // this.onChangeHiddenCount.fire([config.topHiddenRowCount, config.bottomHiddenRowCount]);
    //this.main.hscrollbar1.appendChild(this._main.ucExtends.passElement(this.scrollSubElements.horizontalSizerHT) as HTMLElement);
  }
}