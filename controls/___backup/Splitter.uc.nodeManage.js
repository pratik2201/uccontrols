const { splitersGrid } = require("uccontrols/controls/Splitter.uc.splitersGrid");
const { intenseGenerator } = require('ucbuilder/intenseGenerator.js');
const { spliterType } = require('uccontrols/controls/Splitter.uc.enumAndMore.js');
const { boxHandler } = require('uccontrols/controls/Splitter.uc.boxHandler.js');
/**  
 * @typedef {import("uccontrols/controls/Splitter.uc")} Splitter 
 **/
class nodeManage {
    constructor() { }
    /** @type {Splitter}  */
    main = undefined;
    /** @param {Splitter} main   */
    init(main) {
        this.main = main;
    }

    /**  @param {splitersGrid} splGrid */
    givePlainNode(splGrid) {
        /** @type {HTMLElement}  */
        let node = '<node></node>'.$();
        /** @type {HTMLElement}  */
        let view = '<view></view>'.$();
        node.appendChild(view);
        this.main.ucExtends.passElement(node);
        let box = new boxHandler();
        node.data('box', box);
        box.init(splGrid, node, view);
        return {
            node: node,
            view: view,
            box: box
        };
    }

    /** @param {splitersGrid} splGrid */
    giveReadyNode(splGrid) {
        let sadoNode = this.givePlainNode(splGrid);
        let ucs = intenseGenerator.generateUC(this.main.SESSION_DATA.primaryContainer, { parentUc: this.main });
        sadoNode.view.appendChild(ucs.ucExtends.self);
        sadoNode.box.uc = ucs;
        return {
            node: sadoNode.node,
            view: sadoNode.view,
            box: sadoNode.box,
        }
    }


    /** 
     * @param {spliterType} type
     * @returns {Splitter}
     */
    giveNewGrid(type = 'notdefined') {
        /** @type {HTMLElement}  */
        let elementHT = `<Splitter x.SESSION_DATA.type="=${type}"  ${this.main.myPropertiesText}  ></Splitter>`.$();
        elementHT.setAttribute("x:generateNode", false);
        /** @type {Splitter}  */
        let uc = intenseGenerator.generateUC("uccontrols/controls/Splitter.uc.html", {
            wrapperHT: elementHT,
            parentUc: this
        });
        return uc;
    }
}
module.exports = { nodeManage };