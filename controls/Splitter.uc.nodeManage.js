"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nodeManage = void 0;
const intenseGenerator_js_1 = require("ucbuilder/intenseGenerator.js");
const Splitter_uc_boxHandler_js_1 = require("uccontrols/controls/Splitter.uc.boxHandler.js");
class nodeManage {
    init(main) {
        this.main = main;
    }
    givePlainNode(splGrid) {
        let node = document.createElement('node');
        let view = document.createElement('view');
        node.appendChild(view);
        this.main.ucExtends.passElement(node);
        let box = new Splitter_uc_boxHandler_js_1.boxHandler();
        node.data('box', box);
        box.init(splGrid, node, view);
        return {
            node: node,
            view: view,
            box: box
        };
    }
    giveReadyNode(splGrid) {
        let sadoNode = this.givePlainNode(splGrid);
        let ucs = intenseGenerator_js_1.intenseGenerator.generateUC(this.main.SESSION_DATA.primaryContainer, { parentUc: this.main });
        sadoNode.view.appendChild(ucs.ucExtends.self);
        sadoNode.box.uc = ucs;
        return {
            node: sadoNode.node,
            view: sadoNode.view,
            box: sadoNode.box,
        };
    }
    giveNewGrid(type = 'notdefined') {
        let elementHT = document.createElement('Splitter');
        elementHT.setAttribute("x.SESSION_DATA.type", `=${type}`);
        elementHT.setAttribute("x:generateNode", "false");
        let uc = intenseGenerator_js_1.intenseGenerator.generateUC("uccontrols/controls/Splitter.uc.html", {
            wrapperHT: elementHT,
            parentUc: this.main
        });
        /*let ms = nodeManage.getMod('uccontrols/controls/Splitter.uc.js').then((v) => {
           
        })*/
        return uc;
    }
}
exports.nodeManage = nodeManage;
