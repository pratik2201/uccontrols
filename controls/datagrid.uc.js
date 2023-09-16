const { Rect } = require('ucbuilder/global/drawing/shapes.js');
const { designer } = require('./datagrid.uc.designer.js');
class datagrid extends designer {
    constructor() {
        eval(designer.giveMeHug);
        this.init();
    }
    node = {
        rowNodeName: "ROW",
        cellNodeName: "CELL"
    }
    overInfo = {
        /** @type {HTMLElement}  */
        lastCell: undefined,
        /** @type {HTMLElement}  */
        lastRow: undefined,
        columnIndex: -1,
        rowIndex: -1,
        /** @type {DOMRect}  */
        containerLayout: undefined,
    }
    init() {
        let changed = false;
        this.detail.addEventListener("mouseenter", (e) => {
            this.dgvDomRect.setBy.HTMLEle(this.detail);
            this.ucExtends.self.prepend(this.transHoverHorizontalline);
            this.ucExtends.self.prepend(this.transHoverVerticalline);
            window.addEventListener("mousemove", this.mouseoverlistner);
        });

        this.detail.addEventListener("mouseleave", (e) => {
            window.removeEventListener("mousemove", this.mouseoverlistner);
        });
    }
    /** @type {Rect}  */ 
    dgvDomRect = new Rect();
    /**
     * @param {MouseEvent} e 
     */
    mouseoverlistner = (e) => {
        let cell = this.getCell(document.elementsFromPoint(e.clientX, e.clientY));
        //console.log(cell);
        if (cell != undefined) {
            Object.assign(this.transHoverVerticalline.style, {
                "left": `${cell.offsetLeft+this.dgvDomRect.left}px`,
                "width": `${cell.offsetWidth}px`,
                "top": `${this.dgvDomRect.top}px`,
                "height": `${this.dgvDomRect.height}px`,
            });
        }
        let row = this.getRow(cell);
        if (row != undefined) {
            Object.assign(this.transHoverHorizontalline.style, {
                "left": `${this.dgvDomRect.left}px`,
                "width": `${this.dgvDomRect.width}px`,
                "top": `${row.offsetTop+this.dgvDomRect.top-this.detail.scrollTop}px`,
                "height": `${row.offsetHeight}px`,
            });
        }
        // this.overInfo.lastCell = cell;
        //this.overInfo.lastRow = row;
    }
    /**
     * @param {HTMLElement[]} elem 
     * @returns {HTMLElement}
     */
    getCell(elem = []) {
        let lname = this.node.cellNodeName.toUpperCase();
        return elem.find(s=>s.nodeName == lname);
        /*if (elem == undefined) return undefined;
        if (elem.nodeName.toLowerCase() == this.node.cellNodeName.toLowerCase()) return elem;
        else return this.getCell(elem.parentElement);*/
    }
    /**
     * @param {HTMLElement} cell 
     * @returns {HTMLElement}
     */
    getRow(cell) {
        if (cell == undefined) return undefined;
        if (cell.nodeName.toLowerCase() == this.node.rowNodeName.toLowerCase()) return cell;
        else return this.getRow(cell.parentElement);
    }
}
module.exports = datagrid;