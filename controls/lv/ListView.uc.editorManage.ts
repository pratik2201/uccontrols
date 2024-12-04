import { RowInfo, SourceManage } from "ucbuilder/lib/datasources/SourceManage";
import { TabIndexManager } from "ucbuilder/lib/TabIndexManager";
import { ListView } from "uccontrols/controls/lv/ListView.uc";

export class editorManage {
  main: ListView;

  EditorMode = false;
  constructor(main: ListView) {
    this.main = main;
  }
  init(onDemandNewRow: () => {}) {
    let resEvents = TabIndexManager.Events;
    let lst = this.main;
    let lstEle = lst.ll_view;
    let src = this.main.source;
    let cfg = src.info;
    resEvents.onContainerBottomLeave.push({
      target: lstEle,
      callback: () => {
        let bRInfo: RowInfo<any>;
        let srclen = lst.source.length;

        if (lst.currentIndex == srclen - 1) {
          src.pushNew(onDemandNewRow());
          src.scrollbar.refreshScrollSize();
          bRInfo = SourceManage.getRow(src[cfg.bottomIndex]);
          src.generator.refresh();
          if (bRInfo.index >= srclen) {
            src.nodes.generate(bRInfo.index, true);
            lst.currentIndex = bRInfo.index;
          }
          cfg.moveNext(undefined, 1);
          TabIndexManager.moveNext(bRInfo.element);
          TabIndexManager.breakTheLoop = true;
          TabIndexManager.music = false;
          src.scrollbar.refreshScrollbarSilantly();
        } else {
        
          cfg.moveNext(undefined, 1);
          bRInfo = SourceManage.getRow(src[cfg.bottomIndex]);
          TabIndexManager.moveNext(bRInfo.element);
          TabIndexManager.breakTheLoop = true;
          TabIndexManager.music = false;
          src.scrollbar.refreshScrollbarSilantly();
        }
      }
    });
    resEvents.onContainerTopEnter.push({
      target: lstEle,
      callback: () => {
        //cfg.top = 0;
        this.main.currentIndex = this.main.source.info.defaultIndex;
        this.main.source.info.setPos();
        TabIndexManager.moveNext(lstEle);
        return true;
      }
    });
    resEvents.onContainerTopLeave.push({
      target: lstEle,
      callback: () => {
        if (lst.currentIndex == src.info.defaultIndex) return;
        cfg.movePrev(undefined, 1);
        src.scrollbar.refreshScrollbarSilantly();
      }
    });

    /*node.addEventListener('focusin', (e) => {
      let rInfo = SourceManage.getRow(row);
      if (this.lastTabIndex != rInfo.index) {
          this.main.lst_ledgerExpenses.currentIndex = rInfo.index;

          this.lastTabIndex = rInfo.index;
      }
  });*/


    this.EditorMode = true;
  }

  indexing() {
    //let ar = this.main.ll_view.children;
    //for (let i = 0; i < ar.length; i++) ar[i].setAttribute('x-tabindex', '' + i);
  }
}