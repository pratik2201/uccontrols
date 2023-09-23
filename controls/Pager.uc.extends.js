const { keyBoard, controlOpt } = require("@wfroot/appBuilder/Window/build/common");
const { CommonThings } = require("@wfroot/appBuilder/Window/codeFile/commonThing");
const { PageNavigationResult, PageMouseEvent } = require("@wfroot/appBuilder/Window/codeFile/PageManage.enum");
const { Usercontrol } = require("@wfroot/appBuilder/Window/Usercontrol");

class Pager_extends {
    constructor() { }
    /** @type {Usercontrol}  */
    usercontrol = undefined

    PageManage_extended = {
        ATTR: Object.freeze({ ROW_DATA: 'rowData' }),
        options: {
            perPageRecord: 29,
            /** @type CommonThings */
            commonthing: undefined,
            /**
            * @param {KeyboardEvent} event 
            * @returns 
            */
            checkForKeys: (event) => {
                let indx = this.PageManage_extended.Events.extended._keydownEvent.findIndex(s => s.key == event.keyCode);
                if (indx != -1)
                    if (this.PageManage_extended.Events.extended._keydownEvent[indx].callback(event) === true)
                        return true;
                switch (event.keyCode) {
                    case keyBoard.keys.left: // left key
                    case keyBoard.keys.right: // right key
                        this.PageManage_extended.Events.onCellNavigationChanged(() => { }, event);
                        return true;
                    case keyBoard.keys.up: // up key
                        //console.log('UP');
                        this.PageManage_extended.navigatePages.moveTo.prevSide.Go(event);
                        return true;
                    case keyBoard.keys.down: // down key
                        this.PageManage_extended.navigatePages.moveTo.nextSide.Go(event);
                        return true;
                    case keyBoard.keys.pageUp: // page up key
                        this.PageManage_extended.navigatePages.pageTo.upSide.Go(event);
                        return true;
                    case keyBoard.keys.pageDown: // page down key
                        this.PageManage_extended.navigatePages.pageTo.downSide.Go(event);
                        return true;
                    case keyBoard.keys.end: // end key
                        this.PageManage_extended.records.currentIndex = this.PageManage_extended.records.extended.__recordCount - 1;
                        this.PageManage_extended.records.callToFill();
                        return true;
                    case keyBoard.keys.home: // home key
                        this.PageManage_extended.records.currentIndex = 0;
                        this.PageManage_extended.records.callToFill();
                        return true;
                    default: return false;
                }
            },
        },
        element: {

            /** @type {JQuery} CONTAINER ELEMENT */
            $container: undefined,

            /** @type {JQuery} LIST ELEMENT */
            $listview: undefined,

            /** @type {JQuery} PREVIUS BUTTON ELEMENT */
            $prevRecordCount: $(`<hrc abhinay="prev-record-count">▲</hrc>`),

            /** @type {JQuery} NEXT BUTTON ELEMENT */
            $nextRecordCount: $(`<hrc abhinay="next-record-count">▼</hrc>`),

            isFocused: "0",

            addNextPrevElement() {
                this.extended.addNextElement(this.$listview);
                this.extended.addPrevElement(this.$listview);
            },
            /** @private */
            extended: {
                addPrevElement: ($tarEle) => {
                    let pe = $tarEle.prev();
                    if (pe.length == 0) {
                        $tarEle.before(this.PageManage_extended.element.$prevRecordCount);
                    } else if (pe.length == 1 && pe.get(0).nodeName != "hrc") {
                        $tarEle.before(this.PageManage_extended.element.$prevRecordCount);
                    }
                },
                addNextElement: ($tarEle) => {
                    let pe = $tarEle.next();
                    if (pe.length == 0) {
                        $tarEle.after(this.PageManage_extended.element.$nextRecordCount);
                    } else if (pe.length == 1 && pe.get(0).nodeName != "hrc") {
                        $tarEle.after(this.PageManage_extended.element.$nextRecordCount);
                    }
                }
            }
        },
        Events: {
            stamp: "",
            /** @private */
            extended: {
                callBeforeNodeRemove($ele) {
                    this._beforeOldItemRemoved.forEach(callback => {
                        callback($ele);
                    });
                },
                /**
                * @param {[]} callbacks 
                * @param {PageMouseEvent} event 
                */
                callEvent: (callbacks, event) => {
                    callbacks.forEach(callback => {
                        if (callback(event) === true) {
                            this.PageManage_extended.element.$container.focus();
                            event.event.preventDefault();
                        }
                    });
                },
                _onItemDoubleClick: [],
                _onItemMouseDown: [],
                _onItemMouseUp: [],
                _onNewItemGenerate: [],
                _beforeOldItemRemoved: [],
                _keydownEvent: [],
            },
            set onItemDoubleClick(callback = (pera = PageMouseEvent) => { }) {
                this.extended._onItemDoubleClick.push(callback);
            },
            set onItemMouseDown(callback = (pera = PageMouseEvent) => { }) {
                this.extended._onItemMouseDown.push(callback);
            },
            set onItemMouseUp(callback = (pera = PageMouseEvent) => { }) {
                this.extended._onItemMouseUp.push(callback);
            },
            set onNewItemGenerate(callback = (ele, index) => { }) {
                this.extended._onNewItemGenerate.push(callback);
            },
            set beforeOldItemRemoved(callback = (elems) => { }) {
                this.extended._beforeOldItemRemoved.push(callback);
            },

            /**
             * @returns `true` will moveto first record `false` will remain as it is
             */
            onReachLastRecord: () => { return false; },

            /**
             * @returns `true` will moveto last record `false` will remain as it is
             */
            onReachFirstRecord: () => { return false; },

            /**
            * @param {Function} callback mandetory to call
            * @param {KeyboardEvent} event 
            */
            onRowNavigationChanged: (callback = () => { }, event) => {
                callback();
            },
            /**
            * @param {KeyboardEvent} event 
            */
            onCellNavigationChanged: (callback = () => { }, event) => { },

            keyBoard: {

                /**
                 * @param {keyBoard} key                  
                 */
                down: (key, callback = (event = KeyboardEvent) => { return true; }) => {
                    this.PageManage_extended.Events.extended._keydownEvent.push({
                        key: key,
                        callback: callback
                    });
                }
            },

            onDemandRecordCount: () => { return this.PageManage_extended.records.count; },
        },
        nodes: {
            height: 22,
            width: -1,
            /** @param {JQuery} element */
            initSize(element) {
                /*if (this.height <= 0 || this.width <= 0) {
                    let style = window.getComputedStyle(element.get(0));
                    // console.log(style);
                    this.height = controlOpt.getFullHeight(style);
                    //console.log( this.height);
                    this.width = controlOpt.getFullWidth(style);
                }*/
            },
            /**
             * 
             * @param {number} index 
             * @returns {JQuery}
             */
            getNode: (index) => { return null; },
            addToBegin: (index) => {
                let _this = this;
                let nodes = _this.PageManage_extended.nodes;
                let itemNode = nodes.getNode(index);
                this.usercontrol.Usercontrol_extended.passElement(itemNode.get(0));
                itemNode.attr("item-index", index);

                this.PageManage_extended.element.$listview.prepend(itemNode);
                this.PageManage_extended.Events.extended._onNewItemGenerate.forEach(callback => {
                    callback(itemNode, index);
                });
                //this.PageManage_extended.options.commonthing.dospring(itemNode);
                nodes.initSize(itemNode);
                return itemNode;
            },
            addToEnd: (index) => {
                let _this = this;
                let nodes = _this.PageManage_extended.nodes;
                let itemNode = nodes.getNode(index);
                this.usercontrol.Usercontrol_extended.passElement(itemNode.get(0));
                itemNode.attr("item-index", index);
                this.PageManage_extended.element.$listview.append(itemNode);
                this.PageManage_extended.Events.extended._onNewItemGenerate.forEach(callback => {
                    callback(itemNode, index);
                });
                //this.PageManage_extended.options.commonthing.dospring(itemNode);
                nodes.initSize(itemNode);
                return itemNode;
            },

            loopVisibleRows: (callback = (ele) => { return true; }) => {
                let __element = this.PageManage_extended.element;
                let __records = this.PageManage_extended.records;
                let $litems = __element.$listview.children();
                let _this = this;
                $litems.each((inx, ele) => {
                    let element = $(ele);
                    //console.log('loopVisibleRows:'+element.outerHeight());
                    let index = parseInt(element.attr('item-index'));
                    
                    //element.find('*').attr('child-stamp',this.usercontrol.Usercontrol_extended.stamp);  
                    if (index == __records.currentIndex) {
                        __records.selectedRow = element.get(0).data(this.PageManage_extended.ATTR.ROW_DATA);
                        element.attr('current-index', '1');
                        element.attr('active-indicator', __element.isFocused);
                    }
                    else {
                        element.removeAttr('current-index');
                        element.removeAttr('active-indicator');
                    }
                    if (!callback(element)) return;
                });
            },
            removeSpaceForHiddenCountLabel: false,
            refreshHiddenCount: () => {
                let __indexes = this.PageManage_extended.records;
                let __element = this.PageManage_extended.element;
                let topHRC = __indexes.extended.topHiddenRowCount;
                let bottomHRC = __indexes.extended.bottomHiddenRowCount;
                if (!this.PageManage_extended.nodes.removeSpaceForHiddenCountLabel) {
                    if (topHRC > 0) {
                        __element.$prevRecordCount.css('visibility', 'inherit');
                        //__element.$prevRecordCount.removeClass('disabled');
                        __element.$prevRecordCount.html(" ▲ " + topHRC); //  Row(s)
                        //console.log('show');
                    } else {
                        __element.$prevRecordCount.css('visibility', 'hidden');
                        //__element.$prevRecordCount.addClass('disabled');
                        __element.$prevRecordCount.html(" ▲ ");
                        //__element.$prevRecordCount.html('adaf');
                    }
                    if (bottomHRC > 0) {
                        __element.$nextRecordCount.css('visibility', 'inherit');
                        //__element.$nextRecordCount.removeClass('disabled');
                        __element.$nextRecordCount.html(" ▼ " + bottomHRC);
                    } else {
                        __element.$nextRecordCount.css('visibility', 'hidden');
                        //__element.$nextRecordCount.addClass('disabled');
                        __element.$nextRecordCount.html(" ▼ ");
                    }
                } else {
                    if (topHRC > 0) {
                        ///__element.$prevRecordCount.css('visibility', 'inherit');
                        __element.$prevRecordCount.html(" ▲ " + topHRC + " "); //  Row(s)
                    } else {
                        __element.$prevRecordCount.css('display', 'none');
                    }
                    if (bottomHRC > 0) {
                        //               __element.$prevRecordCount.css('visibility', 'inherit');
                        __element.$nextRecordCount.css('display', 'block');
                        __element.$nextRecordCount.html(" ▼ " + bottomHRC);// Row(s)
                    } else __element.$nextRecordCount.css('display', 'none');
                }
            },

            /**
             * @param {JQuery} $container 
             */
            setup: ($container) => {
                let __element = this.PageManage_extended.element;
                let __events = this.PageManage_extended.Events;
                __element.$container = $container;
                __element.$container.on('mouseup', (event) => {
                    let ele = $(event.target);
                    if (ele.length == 0) return;
                    if (ele == __element.$nextRecordCount) {
                    } else if (ele == __element.$prevRecordCount) {
                    } else {
                        let itmEle = ele.closest('[item-index]');
                        if (itmEle.length == 1) {
                            __events.extended.callEvent(__events.extended._onItemMouseUp, {
                                index: parseInt(itmEle.attr('item-index')),
                                stamp: __events.stamp,
                                itemHT: itmEle,
                                eventElementHT: ele,
                                event: event,
                            });
                        }
                    }
                });
                __element.$container.on('dblclick', (event) => {
                    let ele = $(event.target);
                    if (event.target.is(__element.$nextRecordCount.get(0))) {
                        this.PageManage_extended.navigatePages.pageTo.downSide.Go();
                    } else if (ele.target.is(__element.$prevRecordCount.get(0))) {
                        this.PageManage_extended.navigatePages.pageTo.upSide.Go();
                    } else {
                        let itmEle = ele.closest('[item-index]');
                        if (itmEle.length == 1) {
                            __events.extended.callEvent(__events.extended._onItemDoubleClick, {
                                index: parseInt(itmEle.attr('item-index')),
                                stamp: __events.stamp,
                                itemHT: itmEle,
                                event: event,
                                eventElementHT: ele
                            });
                        }
                    }
                })
                __element.$container.on('mousedown', (event) => {
                    let ele = $(event.target);
                    if (event.target.is(__element.$nextRecordCount.get(0))) {
                        this.PageManage_extended.navigatePages.pageTo.downSide.Go();
                    } else if (event.target.is(__element.$prevRecordCount.get(0))) {
                        this.PageManage_extended.navigatePages.pageTo.upSide.Go();
                    } else {
                        let itmEle = ele.closest('[item-index]');
                        if (itmEle.length == 1) {
                            __events.extended.callEvent(__events.extended._onItemMouseDown, {
                                index: parseInt(itmEle.attr('item-index')),
                                stamp: __events.stamp,
                                itemHT: itmEle,
                                event: event,
                                eventElementHT: ele
                            });
                        }
                    }
                });
            }

        },
        records: {
            /** @private */
            extended: {
                _top: 0,
                _currentIndex: 0,
                __options: () => this.PageManage_extended.options,
                __events: () => this.PageManage_extended.Events,
                get __recordCount() { return this.__events().onDemandRecordCount(); },
                get bottomIndex() { return (this._top + this.__options().perPageRecord) - 1; },
                get topHiddenRowCount() {
                    return ((this.bottomIndex - this.__options().perPageRecord) + 1);
                },
                get bottomHiddenRowCount() {
                    return Math.max(0, (this.__recordCount - (this._top + this.__options().perPageRecord)));
                },
                get lastSideTopIndex() { return Math.max(0, this.__recordCount - this.__options().perPageRecord); },
                get isLastSideTopIndex() { return this.extended.lastSideTopIndex == this.top; },
            },
            defaultIndex: 0,
            selectedRow: undefined,
            //resetIndex(){ this.top = 0; }
            set top(val) {
                this.extended._top = Math.max((this.extended.__recordCount <= this.extended.__options().perPageRecord) ? 0 : val, 0);
            },
            get top() { return this.extended._top; },

            set currentIndex(val) {
                let bIndex = this.minBottomIndex;
                if (val >= this.extended._top && val <= bIndex) {
                    this.extended._currentIndex = val;
                } else {
                    if (val < this.extended._top) {
                        this.top = val;
                    } else {
                        this.top = val - this.extended.__options().perPageRecord + 1;
                    }
                    this.extended._currentIndex = val;
                }
            },
            get currentIndex() { return this.extended._currentIndex; },
            get minBottomIndex() { return Math.min(this.extended.bottomIndex, this.extended.__recordCount - 1); },
            count: 0,

            fill: () => {
                let _records = this.PageManage_extended.records;
                _records.clear();
                for (let index = _records.top, len = _records.minBottomIndex; index <= len; index++)
                    this.PageManage_extended.nodes.addToEnd(index);
                _records.render();
            },
            callToFill: () => {
                if (this.PageManage_extended.Events.extended._beforeOldItemRemoved.length > 0) {
                    this.PageManage_extended.element.$listview.children().each(() => {
                        this.PageManage_extended.Events.extended.callBeforeNodeRemove($(this));
                    });
                }
                this.PageManage_extended.records.fill();
            },
            clear: () => {
                this.PageManage_extended.element.$listview.html('');
            },


            onRendar: () => {
                this.PageManage_extended.nodes.loopVisibleRows((ele) => { return ele; });
            },
            __doactualRendar: () => {
                this.PageManage_extended.records.onRendar();
                this.PageManage_extended.nodes.refreshHiddenCount();
            },
            render() {
                this.__doactualRendar();
            },
        },
        navigatePages: {
            callNavigate: (callback = () => { }, event) => {
                this.PageManage_extended.Events.onRowNavigationChanged(callback, event);
            },
            pageTo: {
                downSide: {
                    /**
                     * 
                     * @returns {PageNavigationResult} 
                     *      
                     *      `OUTSIDE` indicate can be move to one page down side
                     * 
                     *      `LAST` indicate already reached to last page record
                     */
                    check: () => {
                        let nextPageBottom = this.PageManage_extended.records.extended.bottomIndex + this.PageManage_extended.options.perPageRecord;
                        return (nextPageBottom < this.PageManage_extended.records.extended.__recordCount - 1) ?
                            PageNavigationResult.OUTSIDE
                            :
                            PageNavigationResult.LAST;
                    },
                    Advance: {
                        outside: () => {
                            this.PageManage_extended.records.extended._top += this.PageManage_extended.options.perPageRecord;
                        },
                        last: () => {
                            if (this.PageManage_extended.records.extended.bottomIndex > this.PageManage_extended.records.extended.__recordCount) {
                                this.PageManage_extended.records.extended._top = 0;
                                this.PageManage_extended.records.extended._currentIndex = this.PageManage_extended.records.defaultIndex;
                            } else this.PageManage_extended.records.extended._top = this.PageManage_extended.records.extended.__recordCount - this.PageManage_extended.options.perPageRecord;
                        },
                    },
                    /**
                     * 
                     * @param {KeyboardEvent} event 
                     */
                    Go: (event) => {
                        let dwnSide = this.PageManage_extended.navigatePages.pageTo.downSide;
                        let cmd = dwnSide.check();
                        switch (cmd) {
                            case PageNavigationResult.OUTSIDE:
                                this.PageManage_extended.navigatePages.callNavigate(dwnSide.Advance.outside, event);
                                break;
                            case PageNavigationResult.LAST:
                                this.PageManage_extended.navigatePages.callNavigate(dwnSide.Advance.last, event);
                                break;
                        }
                        this.PageManage_extended.records.callToFill();
                        this.PageManage_extended.records.extended._currentIndex = this.PageManage_extended.records.minBottomIndex;
                        this.PageManage_extended.records.render();
                    }
                },
                upSide: {
                    /**
                     * 
                     * @returns {PageNavigationResult} 
                     *      
                     *      `OUTSIDE` indicate can be move to one page up side
                     * 
                     *      `FIRST` indicate already reached to first page record
                     */
                    check: () => {
                        let prevPageTop = this.PageManage_extended.records.top - this.PageManage_extended.options.perPageRecord;
                        return (prevPageTop > this.PageManage_extended.records.defaultIndex) ?
                            PageNavigationResult.OUTSIDE
                            :
                            PageNavigationResult.FIRST;
                    },
                    Advance: {
                        outside: () => {
                            this.PageManage_extended.records.extended._top -= this.PageManage_extended.options.perPageRecord;
                            this.PageManage_extended.records.extended._currentIndex = this.PageManage_extended.records.extended._top;
                            this.PageManage_extended.records.callToFill();
                        },
                        first: () => {
                            this.PageManage_extended.records.extended._top = 0;
                            this.PageManage_extended.records.extended._currentIndex = this.PageManage_extended.records.defaultIndex;
                            this.PageManage_extended.records.callToFill();
                        },
                    },
                    /**
                     * 
                     * @param {KeyboardEvent} event 
                     */
                    Go: (event) => {
                        let upSd = this.PageManage_extended.navigatePages.pageTo.upSide;
                        let cmd = upSd.check();
                        switch (cmd) {
                            case PageNavigationResult.OUTSIDE:
                                this.PageManage_extended.navigatePages.callNavigate(upSd.Advance.outside, event);
                                break;
                            case PageNavigationResult.FIRST:
                                this.PageManage_extended.navigatePages.callNavigate(upSd.Advance.first, event);
                                break;
                        }
                        this.PageManage_extended.records.render();
                    }
                }
            },
            moveTo: {
                prevSide: {
                    /**
                     * 
                     * @returns {PageNavigationResult} 
                     *      `DISPLAYED` indicate currentIndex inside displayed items 
                     * 
                     *      `OUTSIDE` indicate currentIndex is the first item of displayed items
                     * 
                     *      `FIRST` indicate currentIndex is the first item of list
                     */
                    check: () => {
                        return (this.PageManage_extended.records.currentIndex > this.PageManage_extended.records.top) ?
                            PageNavigationResult.DISPLAYED
                            :
                            (this.PageManage_extended.records.top > this.PageManage_extended.records.defaultIndex) ?
                                PageNavigationResult.OUTSIDE
                                :
                                PageNavigationResult.FIRST;
                    },
                    Advance: {
                        dispayed: () => {
                            this.PageManage_extended.records.extended._currentIndex--;
                        },
                        /**
                         * 
                         * @returns {JQuery} first item of displayed list
                         */
                        outside: () => {
                            let $eleToRem = this.PageManage_extended.element.$listview.children('[item-index="' + this.PageManage_extended.records.extended.bottomIndex + '"]');
                            this.PageManage_extended.Events.extended.callBeforeNodeRemove($eleToRem);
                            $eleToRem.remove();
                            this.PageManage_extended.records.extended._top--;
                            let ele = this.PageManage_extended.nodes.addToBegin(this.PageManage_extended.records.top);
                            this.PageManage_extended.records.extended._currentIndex--;
                            return ele;
                        },
                        first: () => {
                            if (this.PageManage_extended.Events.onReachFirstRecord()) {
                                this.PageManage_extended.records.extended._top = this.PageManage_extended.records.extended.lastSideTopIndex;//Math.max(0, this.PageManage_extended.indexes.__recordCount - this.PageManage_extended.options.perPageRecord);
                                this.PageManage_extended.records.callToFill();
                                this.PageManage_extended.records.extended._currentIndex = this.PageManage_extended.records.minBottomIndex;
                            }
                        }
                    },
                    /**
                     * 
                     * @param {KeyboardEvent} event 
                     */
                    Go: (event) => {
                        let prvSide = this.PageManage_extended.navigatePages.moveTo.prevSide;
                        let cmd = prvSide.check();
                        switch (cmd) {
                            case PageNavigationResult.DISPLAYED:
                                this.PageManage_extended.navigatePages.callNavigate(prvSide.Advance.dispayed, event);
                                break;
                            case PageNavigationResult.OUTSIDE:
                                this.PageManage_extended.navigatePages.callNavigate(prvSide.Advance.outside, event);
                                break;
                            case PageNavigationResult.FIRST:
                                this.PageManage_extended.navigatePages.callNavigate(prvSide.Advance.first, event);
                                break;
                        }
                        this.PageManage_extended.records.render();
                    }
                },
                nextSide: {
                    /**
                     * 
                     * @returns {PageNavigationResult} 
                     *      `DISPLAYED` indicate currentIndex inside displayed items 
                     * 
                     *      `OUTSIDE` indicate currentIndex is the last item of displayed items
                     * 
                     *      `LAST` indicate currentIndex is the last item of list
                     */
                    check: () => {
                        return (this.PageManage_extended.records.currentIndex < this.PageManage_extended.records.minBottomIndex) ?
                            PageNavigationResult.DISPLAYED
                            :
                            (this.PageManage_extended.records.extended.bottomIndex < this.PageManage_extended.records.extended.__recordCount - 1) ?
                                PageNavigationResult.OUTSIDE
                                :
                                PageNavigationResult.LAST;
                    },
                    Advance: {
                        dispayed: () => {
                            this.PageManage_extended.records.extended._currentIndex++;
                        },
                        /**
                        * 
                        * @returns {JQuery} last item of displayed list
                        */
                        outside: () => {
                            let lastTopIndex = this.PageManage_extended.records.extended.lastSideTopIndex;
                            if (this.PageManage_extended.records.top < lastTopIndex) {
                                let $eleToRem = this.PageManage_extended.element.$listview.children('[item-index="' + this.PageManage_extended.records.top + '"]');
                                this.PageManage_extended.Events.extended.callBeforeNodeRemove($eleToRem);
                                $eleToRem.remove();
                                this.PageManage_extended.records.extended._top++;
                            } else this.PageManage_extended.records.extended._top = lastTopIndex;
                            let $ele = this.PageManage_extended.nodes.addToEnd(this.PageManage_extended.records.minBottomIndex); // this.PageManage_extended.indexes.bottomIndex
                            this.PageManage_extended.records.extended._currentIndex++;
                            return $ele;
                        },
                        last: () => {
                            if (this.PageManage_extended.Events.onReachLastRecord()) {
                                this.PageManage_extended.records.extended._top = 0;
                                this.PageManage_extended.records.extended._currentIndex = this.PageManage_extended.records.defaultIndex;
                                this.PageManage_extended.records.callToFill();
                            }
                        }
                    },
                    /**
                     * 
                     * @param {KeyboardEvent} event 
                     */
                    Go: (event) => {
                        let nxtSide = this.PageManage_extended.navigatePages.moveTo.nextSide;
                        let cmd = nxtSide.check();
                        switch (cmd) {
                            case PageNavigationResult.DISPLAYED:
                                this.PageManage_extended.navigatePages.callNavigate(nxtSide.Advance.dispayed, event);
                                break;
                            case PageNavigationResult.OUTSIDE:
                                this.PageManage_extended.navigatePages.callNavigate(nxtSide.Advance.outside, event);
                                break;
                            case PageNavigationResult.LAST:
                                this.PageManage_extended.navigatePages.callNavigate(nxtSide.Advance.last, event);
                                break;
                        }
                        this.PageManage_extended.records.render();
                    }
                }
            },
        }
    };
}
module.exports = Pager_extends;