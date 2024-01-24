import {  dropIndictors, splitterMeasurementRow,SplitterMeasurementRow } from "uccontrols/controls/Splitter.uc.enumAndMore";
import { dragHandler } from "uccontrols/controls/Splitter.uc.dragHandler";
import { Usercontrol } from "ucbuilder/Usercontrol";
import {Splitter} from "uccontrols/controls/Splitter.uc";
import { DragHelper } from "ucbuilder/global/drag/dragHelper";
import { objectOpt, controlOpt } from "ucbuilder/build/common";
import { splitersGrid } from "uccontrols/controls/Splitter.uc.splitersGrid";

export class boxHandler {
    main: splitersGrid;
    splMain: Splitter;
    uc: Usercontrol;
    drag: dragHandler;
    node: HTMLElement;
    view: HTMLElement;

    constructor() {
        this.drag = new dragHandler();
    }

    get index(): number {
        return this.node.index();
    }

    changeGrid(newMain: splitersGrid): void {
        this.main = newMain;
    }

    init(main: splitersGrid, node: HTMLElement, view?: HTMLElement): void {
        this.main = main;
        this.splMain = main.main;
        this.node = node;
        this.view = (view == undefined) ? node.children.item(0) : view;
        this.drag.init(this);
        this.drag.onDropNeeded = (dir, importUcFromDrag = false) => {
            switch (dir) {
                case dropIndictors.possiblePlaces.rightRect:
                case dropIndictors.possiblePlaces.leftRect:
                    this.dropH(dir, importUcFromDrag);
                    break;
                case dropIndictors.possiblePlaces.topRect:
                case dropIndictors.possiblePlaces.bottomRect:
                    this.dropV(dir, importUcFromDrag);
                    break;
            }
        }
    }

    pushData(index: number, halfSize: number, appendAfter: boolean, importUcFromDrag = false): any {
        let nnode = this.splMain.nodeMng.giveReadyNode(this.main);
        let atIndex = appendAfter ? index : index - 1;
        let ns: SplitterMeasurementRow = objectOpt.clone(splitterMeasurementRow);
        ns.size = halfSize;
        ns.data.ucPath = nnode.box.uc.ucExtends.fileInfo.html.rootPath;
        ns.data.attribList = controlOpt.xPropToAttr(nnode.box.uc.ucExtends.self);
        nnode.box.uc.ucExtends.session.exchangeParentWith(ns.data.session);
        if (appendAfter) {
            this.main.measurement.splice(index + 1, 0, ns);
            this.main.measurement[index].size = halfSize;
        } else {
            this.main.measurement.splice(index, 0, ns);
            this.main.measurement[index + 1].size = halfSize;
        }
        this.main.pushBox(nnode.box, atIndex);
        if (importUcFromDrag)
            DragHelper.dragResult = nnode.box.uc.ucExtends.Events.onDataImport(DragHelper.draggedData);
        this.splMain.resizer.giveResizer();
        return nnode;
    }

    dropH(dir: dropIndictors.possiblePlaces, importUcFromDrag = false): void {
        switch (this.main.info.type) {
            case 'notdefined':
            case 'columns':
                let index = this.index;
                let len = this.main.length;
                this.main.type = 'columns';
                switch (dir) {
                    case dropIndictors.possiblePlaces.rightRect:
                        if (len == 0 || index == this.main.lastIndex) {
                            this.pushData(index, this.node.offsetWidth / 2, true, importUcFromDrag);
                        } else {
                            let size = this.main.measurement[index].size;
                            this.pushData(index, size / 2, true, importUcFromDrag);
                        }
                        break;
                    case dropIndictors.possiblePlaces.leftRect:
                        if (len == 0 || index == this.main.lastIndex) {
                            this.pushData(index, this.node.offsetWidth / 2, false, importUcFromDrag);
                        } else {
                            let size = this.main.measurement[index].size;
                            this.pushData(index, size / 2, false, importUcFromDrag);
                        }
                        break;
                }
                break;
            default:
                let ngrid = this.splMain.nodeMng.giveNewGrid('columns');
                let topMeasurement = this.splMain.tree.measurement[this.node.index()].data;
                let ndm1 = ngrid.nodeMng.giveReadyNode(ngrid.tree);
                let ndm2 = ngrid.nodeMng.giveReadyNode(ngrid.tree);
                ngrid.tree.pushBox(ndm2);
                ngrid.tree.pushBox(ndm1);
                this.view.appendChild(ngrid.ucExtends.self);
                ngrid.tree.refresh();
                topMeasurement.ucPath = ngrid.ucExtends.fileInfo.html.rootPath;
                topMeasurement.attribList = controlOpt.xPropToAttr(ngrid.ucExtends.self);
                if (this.view.children.length != 0) {
                    switch (dir) {
                        case dropIndictors.possiblePlaces.rightRect:
                            ndm1.view.innerHTML = "";
                            ndm1.view.appendChild(this.uc.ucExtends.self);
                            DragHelper.dragResult = ndm2.box.uc.ucExtends.Events.onDataImport(DragHelper.draggedData);
                            this.uc.ucExtends.session.exchangeParentWith(ngrid.tree.measurement[0].data.session);
                            break;
                        case dropIndictors.possiblePlaces.leftRect:
                            ndm2.view.innerHTML = "";
                            ndm2.view.appendChild(this.uc.ucExtends.self);
                            DragHelper.dragResult = ndm1.box.uc.ucExtends.Events.onDataImport(DragHelper.draggedData);
                            this.uc.ucExtends.session.exchangeParentWith(ngrid.tree.measurement[1].data.session);
                            break;
                    }
                }
                ngrid.ucExtends.session.exchangeParentWith(topMeasurement.session);
                break;
        }
    }

    dropV(dir: dropIndictors.possiblePlaces, importUcFromDrag = false): void {
        switch (this.main.info.type) {
            case 'notdefined':
            case 'rows':
                let index = this.index;
                let len = this.main.length;
                this.main.type = 'rows';
                switch (dir) {
                    case dropIndictors.possiblePlaces.bottomRect:
                        if (len == 0 || index == this.main.lastIndex) {
                            this.pushData(index, this.node.offsetHeight / 2, true, importUcFromDrag);
                        } else {
                            let size = this.main.measurement[index].size;
                            this.pushData(index, size / 2, true, importUcFromDrag);
                        }
                        break;
                    case dropIndictors.possiblePlaces.topRect:
                        if (len == 0 || index == this.main.lastIndex) {
                            this.pushData(index, this.node.offsetHeight / 2, false, importUcFromDrag);
                        } else {
                            let size = this.main.measurement[index].size;
                            this.pushData(index, size / 2, false, importUcFromDrag);
                        }
                        break;
                }
                break;
            default:
                let ngrid = this.splMain.nodeMng.giveNewGrid('rows');
                let topMeasurement = this.splMain.tree.measurement[this.node.index()].data;
                let ndm1 = ngrid.nodeMng.giveReadyNode(ngrid.tree);
                let ndm2 = ngrid.nodeMng.giveReadyNode(ngrid.tree);
                ngrid.tree.pushBox(ndm2);
                ngrid.tree.pushBox(ndm1);
                this.view.appendChild(ngrid.ucExtends.self);
                ngrid.tree.refresh();
                topMeasurement.ucPath = ngrid.ucExtends.fileInfo.html.rootPath;
                topMeasurement.attribList = controlOpt.xPropToAttr(ngrid.ucExtends.self);
                if (this.view.children.length != 0) {
                    switch (dir) {
                        case dropIndictors.possiblePlaces.bottomRect:
                            ndm1.view.innerHTML = "";
                            ndm1.view.appendChild(this.uc.ucExtends.self);
                            DragHelper.dragResult = ndm2.box.uc.ucExtends.Events.onDataImport(DragHelper.draggedData);
                            this.uc.ucExtends.session.exchangeParentWith(ngrid.tree.measurement[0].data.session);
                            break;
                        case dropIndictors.possiblePlaces.topRect:
                            ndm2.view.innerHTML = "";
                            ndm2.view.appendChild(this.uc.ucExtends.self);
                            DragHelper.dragResult = ndm1.box.uc.ucExtends.Events.onDataImport(DragHelper.draggedData);
                            this.uc.ucExtends.session.exchangeParentWith(ngrid.tree.measurement[1].data.session);
                            break;
                    }
                }
                ngrid.ucExtends.session.exchangeParentWith(topMeasurement.session);
                break;
        }
    }
}