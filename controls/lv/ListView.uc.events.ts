import { CommonEvent } from "ucbuilder/global/commonEvent";
import { R } from "uccontrols/R";
import { ItemIndexChangeBy } from "./ListView.uc.navigate";
import { pagerATTR } from "./ListView.uc.nodeHandler";
import { keyBoard } from "ucbuilder/global/hardware/keyboard";
export class eventHandler {
  //#region  EVENT DECLARATION
  itemDoubleClick = new CommonEvent<(index: number, evt: MouseEvent) => void>();
  itemMouseDown = new CommonEvent<(index: number, evt: MouseEvent) => void>();
  itemMouseUp = new CommonEvent<(index: number, evt: MouseEvent) => void>();
  beforeOldItemRemoved = new CommonEvent<(itemHT: HTMLElement) => void>();
  onClearContainer = new CommonEvent<() => void>();
  newItemGenerate = new CommonEvent<(itemnode: HTMLElement, index: number) => void>();
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
  private _main = R.controls.lv.ListView.type;
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
    this.main.ll_view.addEventListener("mousedown", (e: MouseEvent) => {
      let itm = this.main.nodes.getItemFromChild(e.target as HTMLElement);
      if (itm != null) {
        this.main.navigate.setCurrentIndex(itm.data(pagerATTR.itemIndex), e, "Mouse");
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
      let scrollTop = Math.floor(this.main.vscrollbar1.scrollTop / this.navigatePages.config.itemSize.height);
      this.doVerticalContentScrollAt(scrollTop, false);
    });
    this.main.hscrollbar1.addEventListener("scroll", (e: Event) => {
      let scrollLeft = this.main.hscrollbar1.scrollLeft; //Math.floor(this.main.scroller1.scrollLeft / this.navigatePages.config.itemSize.width);
      //console.log(this.main.hscrollbar1.scrollLeft);
      this.main.scroller1.scrollLeft = scrollLeft;
    });

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
        this.navigatePages.config.currentIndex = this.navigatePages.config.top;
        this.main.Refresh();
        break;
      case keyBoard.keys.pageDown: // page down key
        this.navigatePages.pageTo.downSide.Go(e);
        this.navigatePages.config.currentIndex = this.navigatePages.config.minBottomIndex;
        this.main.Refresh();
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
    
    if (this.isfilling ) return;
    this.isfilling = true;
    let _this = this;
    let element = this.main.vscrollbar1;
    if (element.scrollTop + element.offsetHeight >= element.scrollHeight - 1) { // is bottom reached
      scrollval = this.main.source.length - this.navigatePages.config.perPageRecord;
    }
    if (useTimeOut) setTimeout(doscroll);
    else doscroll();
    function doscroll() {
      _this.navigatePages.config.top = Math.floor(scrollval);
      _this.main.nodes.fill();
      _this.isfilling = false;
    }
  }
  refreshScrollbarSilantly() {
    this.fireScrollEvent = false;
    this.main.vscrollbar1.scrollTop = (this.navigatePages.config.top * this.navigatePages.config.itemSize.height);
    //this.Events.onChangeHiddenCount.fire([this.pageLvExtend.topHiddenRowCount, this.pageLvExtend.bottomHiddenRowCount]);
  }
  refreshScrollSize() {
    this.scrollSubElements.verticalSizerHT.style['height'] = this.main.navigate.config.itemsTotalSize.height + 'px';
    this.scrollSubElements.horizontalSizerHT.style['width'] = this.main.navigate.config.itemsTotalSize.width + 'px';
  }
  scrollSubElements = {
    verticalSizerHT: '<sizer></sizer>'.$(),
    horizontalSizerHT: '<sizer></sizer>'.$(),
  }
  initVerticalScroller() {
    this.main.vscrollbar1.appendChild(this._main.ucExtends.passElement(this.scrollSubElements.verticalSizerHT) as HTMLElement);
    this.main.hscrollbar1.appendChild(this._main.ucExtends.passElement(this.scrollSubElements.horizontalSizerHT) as HTMLElement);
  }
}