import { SourceManage } from "ucbuilder/global/datasources/SourceManage";
import { TabContainerClearNode } from "ucbuilder/global/tabIndexManager";
import { ResourcesUC } from "ucbuilder/ResourcesUC";
import { ListView } from "uccontrols/controls/lv/ListView.uc";

export class editorManage {
  main: ListView;

  EditorMode = false;
  constructor(main: ListView) {
    this.main = main;
  }
  init(onDemandNewRow: () => {}) {
    let resEvents = ResourcesUC.tabMng.Events;
    let lst = this.main;
    let lstEle = lst.ll_view;
    let cfg = lst.navigate.config;
    let src = this.main.source;
    resEvents.onContainerBottomLeave.push({
      target: lstEle,
      callback: () => {
        if (lst.currentIndex == lst.source.length - 1) {
          src.pushNew(onDemandNewRow());
          this.main.Events.refreshScrollSize();
          let bRInfo = SourceManage.getRow(src[cfg.bottomIndex]);
          if (!bRInfo.element.isConnected) {
            lst.nodes.append(bRInfo.index);
            //this.indexing();
          }
        }
        this.main.navigate.moveTo.nextSide.Go(undefined, 1);
        this.main.Events.refreshScrollbarSilantly();
      }
    });
    resEvents.onContainerTopEnter.push({
      target: lstEle,
      callback: () => {
        //cfg.top = 0;
        this.main.currentIndex = this.main.source.info.defaultIndex;
        ResourcesUC.tabMng.moveNext(lstEle);
        return true;
      }
    });
    resEvents.onContainerTopLeave.push({
      target: lstEle,
      callback: () => {
        if (lst.currentIndex == src.info.defaultIndex) return;
        this.main.navigate.moveTo.prevSide.Go(undefined, 1);
        this.main.Events.refreshScrollbarSilantly();
      }
    });
    this.EditorMode = true;
  }

  indexing() {
    //let ar = this.main.ll_view.children;
    //for (let i = 0; i < ar.length; i++) ar[i].setAttribute('x-tabindex', '' + i);
  }
}