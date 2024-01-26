"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.boxHandler = void 0;
const Splitter_uc_enumAndMore_1 = require("uccontrols/controls/Splitter.uc.enumAndMore");
const Splitter_uc_dragHandler_1 = require("uccontrols/controls/Splitter.uc.dragHandler");
const dragHelper_1 = require("ucbuilder/global/drag/dragHelper");
const common_1 = require("ucbuilder/build/common");
class boxHandler {
    constructor() {
        this.drag = new Splitter_uc_dragHandler_1.dragHandler();
    }
    get index() {
        return this.node.index();
    }
    changeGrid(newMain) {
        this.main = newMain;
    }
    init(main, node, view) {
        this.main = main;
        this.splMain = main.main;
        this.node = node;
        this.view = (view == undefined) ? node.children.item(0) : view;
        this.drag.init(this);
        this.drag.onDropNeeded = (dir, importUcFromDrag = false) => {
            switch (dir) {
                case 'rightRect':
                case 'leftRect':
                    this.dropH(dir, importUcFromDrag);
                    break;
                case 'topRect':
                case 'bottomRect':
                    this.dropV(dir, importUcFromDrag);
                    break;
            }
        };
    }
    pushData(index, halfSize, appendAfter, importUcFromDrag = false) {
        let nnode = this.splMain.nodeMng.giveReadyNode(this.main);
        let atIndex = appendAfter ? index : index - 1;
        let ns = common_1.objectOpt.clone(Splitter_uc_enumAndMore_1.splitterMeasurementRow);
        ns.size = halfSize;
        ns.data.ucPath = nnode.box.uc.ucExtends.fileInfo.html.rootPath;
        ns.data.attribList = common_1.controlOpt.xPropToAttr(nnode.box.uc.ucExtends.self);
        nnode.box.uc.ucExtends.session.exchangeParentWith(ns.data.session);
        if (appendAfter) {
            this.main.measurement.splice(index + 1, 0, ns);
            this.main.measurement[index].size = halfSize;
        }
        else {
            this.main.measurement.splice(index, 0, ns);
            this.main.measurement[index + 1].size = halfSize;
        }
        this.main.pushBox(nnode.box, atIndex);
        if (importUcFromDrag)
            dragHelper_1.DragHelper.dragResult = nnode.box.uc.ucExtends.Events.onDataImport(dragHelper_1.DragHelper.draggedData);
        this.splMain.resizer.giveResizer();
        return nnode;
    }
    dropH(dir, importUcFromDrag = false) {
        switch (this.main.info.type) {
            case 'notdefined':
            case 'columns':
                let index = this.index;
                let len = this.main.length;
                this.main.type = 'columns';
                switch (dir) {
                    case 'rightRect':
                        if (len == 0 || index == this.main.lastIndex) {
                            this.pushData(index, this.node.offsetWidth / 2, true, importUcFromDrag);
                        }
                        else {
                            let size = this.main.measurement[index].size;
                            this.pushData(index, size / 2, true, importUcFromDrag);
                        }
                        break;
                    case 'leftRect':
                        if (len == 0 || index == this.main.lastIndex) {
                            this.pushData(index, this.node.offsetWidth / 2, false, importUcFromDrag);
                        }
                        else {
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
                ngrid.tree.pushBox(ndm2.box);
                ngrid.tree.pushBox(ndm1.box);
                this.view.appendChild(ngrid.ucExtends.self);
                ngrid.tree.refresh();
                topMeasurement.ucPath = ngrid.ucExtends.fileInfo.html.rootPath;
                topMeasurement.attribList = common_1.controlOpt.xPropToAttr(ngrid.ucExtends.self);
                if (this.view.children.length != 0) {
                    switch (dir) {
                        case 'rightRect':
                            ndm1.view.innerHTML = "";
                            ndm1.view.appendChild(this.uc.ucExtends.self);
                            dragHelper_1.DragHelper.dragResult = ndm2.box.uc.ucExtends.Events.onDataImport(dragHelper_1.DragHelper.draggedData);
                            this.uc.ucExtends.session.exchangeParentWith(ngrid.tree.measurement[0].data.session);
                            break;
                        case 'leftRect':
                            ndm2.view.innerHTML = "";
                            ndm2.view.appendChild(this.uc.ucExtends.self);
                            dragHelper_1.DragHelper.dragResult = ndm1.box.uc.ucExtends.Events.onDataImport(dragHelper_1.DragHelper.draggedData);
                            this.uc.ucExtends.session.exchangeParentWith(ngrid.tree.measurement[1].data.session);
                            break;
                    }
                }
                ngrid.ucExtends.session.exchangeParentWith(topMeasurement.session);
                break;
        }
    }
    dropV(dir, importUcFromDrag = false) {
        switch (this.main.info.type) {
            case 'notdefined':
            case 'rows':
                let index = this.index;
                let len = this.main.length;
                this.main.type = 'rows';
                switch (dir) {
                    case 'bottomRect':
                        if (len == 0 || index == this.main.lastIndex) {
                            this.pushData(index, this.node.offsetHeight / 2, true, importUcFromDrag);
                        }
                        else {
                            let size = this.main.measurement[index].size;
                            this.pushData(index, size / 2, true, importUcFromDrag);
                        }
                        break;
                    case 'topRect':
                        if (len == 0 || index == this.main.lastIndex) {
                            this.pushData(index, this.node.offsetHeight / 2, false, importUcFromDrag);
                        }
                        else {
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
                ngrid.tree.pushBox(ndm2.box);
                ngrid.tree.pushBox(ndm1.box);
                this.view.appendChild(ngrid.ucExtends.self);
                ngrid.tree.refresh();
                topMeasurement.ucPath = ngrid.ucExtends.fileInfo.html.rootPath;
                topMeasurement.attribList = common_1.controlOpt.xPropToAttr(ngrid.ucExtends.self);
                if (this.view.children.length != 0) {
                    switch (dir) {
                        case 'bottomRect':
                            ndm1.view.innerHTML = "";
                            ndm1.view.appendChild(this.uc.ucExtends.self);
                            dragHelper_1.DragHelper.dragResult = ndm2.box.uc.ucExtends.Events.onDataImport(dragHelper_1.DragHelper.draggedData);
                            this.uc.ucExtends.session.exchangeParentWith(ngrid.tree.measurement[0].data.session);
                            break;
                        case 'topRect':
                            ndm2.view.innerHTML = "";
                            ndm2.view.appendChild(this.uc.ucExtends.self);
                            dragHelper_1.DragHelper.dragResult = ndm1.box.uc.ucExtends.Events.onDataImport(dragHelper_1.DragHelper.draggedData);
                            this.uc.ucExtends.session.exchangeParentWith(ngrid.tree.measurement[1].data.session);
                            break;
                    }
                }
                ngrid.ucExtends.session.exchangeParentWith(topMeasurement.session);
                break;
        }
    }
}
exports.boxHandler = boxHandler;
