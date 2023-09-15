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
        containerLayout:undefined,
    }
    init() {
        let changed = false;
        
        this.detail.addEventListener("mouseover", (e) => {
            let cell = this.getCell(e.target);
            let row = this.getRow(cell);
            if (cell == undefined || row == undefined) return;            
            if (cell.is(this.overInfo.lastCell) && row.is(this.overInfo.lastRow)) return;
            else {
                let crect = new Rect();
                crect.setBy.HTMLEle(cell);
                //console.log(this.overInfo.containerLayout);
                //let cnt = this.detail.getClientRects()[0];
                //crect.location.Subtract(cnt);
               // console.log(cnt);
                Object.assign(this.transHoverTopline.style,{
                    "left":`0px`,"right":`0px`, "top":`${row.offsetTop}px`,
                });
                Object.assign(this.transHoverBottomline.style,{
                    "left":`0px`,"right":`0px`, "top":`${row.offsetTop+row.offsetHeight}px`,
                });
                Object.assign(this.transHoverLeftline.style,{
                    "top":`0px`,"bottom":`0px`, "left":`${cell.offsetLeft}px`,
                });
                Object.assign(this.transHoverRightline.style,{
                    "top":`0px`,"bottom":`0px`, "left":`${cell.offsetLeft+cell.offsetWidth}px`,
                });
                this.overInfo.lastCell = cell;
                this.overInfo.lastRow = row;
                /*this.overInfo.columnIndex = cell.index();
                this.overInfo.lastCell = cell;
                this.overInfo.rowIndex = row.index();
                this.overInfo.lastRow = row;*/
                //console.log(this.overInfo.rowIndex+" : "+this.overInfo.columnIndex);
            }

        });
    }
    /**
     * @param {HTMLElement} elem 
     * @returns {HTMLElement}
     */
    getCell(elem) {
        if (elem == undefined) return undefined;
        if (elem.nodeName.toLowerCase() == this.node.cellNodeName.toLowerCase()) return elem;
        else return this.getCell(elem.parentElement);
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