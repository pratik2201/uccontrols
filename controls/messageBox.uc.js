"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageBox = void 0;
const keyboard_1 = require("ucbuilder/global/hardware/keyboard");
const intenseGenerator_js_1 = require("ucbuilder/intenseGenerator.js");
const MessageBox_uc_designer_js_1 = require("./MessageBox.uc.designer.js");
class MessageBox extends MessageBox_uc_designer_js_1.Designer {
    constructor({ title = "", detail = "", buttonType = 'Ok', } = {}) {
        super();
        this.resultCallback = (res) => { };
        this.result = "none";
        this.finalResult = (res) => {
            this.result = res;
            this.ucExtends.destruct();
        };
        this.initializecomponent(arguments, this);
        this.lbl_messagedetail.innerHTML = detail;
        this.initByButtonType(buttonType);
        this.ucExtends.Events.beforeClose.on(() => {
            this.resultCallback(this.result);
        });
        this.buttonList.addEventListener("mouseup", (e) => {
            this.fire(document.activeElement.stamp());
        });
        this.buttonList.addEventListener('keyup', (e) => {
            switch (e.keyCode) {
                case keyboard_1.keyBoard.keys.enter:
                    this.fire(document.activeElement.stamp());
                    break;
                case keyboard_1.keyBoard.keys.y:
                    this.fire(this.cmd_yes.stamp());
                    break;
                case keyboard_1.keyBoard.keys.n:
                    this.fire(this.cmd_no.stamp());
                    break;
                case keyboard_1.keyBoard.keys.o:
                    this.fire(this.cmd_ok.stamp());
                    break;
                case keyboard_1.keyBoard.keys.c:
                    this.fire(this.cmd_cancel.stamp());
                    break;
                case keyboard_1.keyBoard.keys.a:
                    this.fire(this.cmd_abort.stamp());
                    break;
                case keyboard_1.keyBoard.keys.r:
                    this.fire(this.cmd_retry.stamp());
                    break;
                case keyboard_1.keyBoard.keys.i:
                    this.fire(this.cmd_ignore.stamp());
                    break;
            }
        });
    }
    static Show(message = "", result = (res) => { }, { title = undefined, detail = "", buttonType = 'Ok', defaultFocus = 'ok', } = {}) {
        let uc = intenseGenerator_js_1.intenseGenerator.generateUC('uccontrols/controls/messageBox.uc', {}, arguments[2]);
        uc.resultCallback = result;
        uc.lbl_message.innerHTML = message;
        if (title == undefined) {
            switch (buttonType) {
                case 'Ok':
                    uc.ucExtends.caption = 'Message';
                    break;
                case 'OkCancel':
                    uc.ucExtends.caption = 'Message';
                    break;
                case 'YesNo':
                    uc.ucExtends.caption = 'Confirm';
                    break;
                case 'RetryCancel':
                    uc.ucExtends.caption = 'Retry';
                    break;
                case 'YesNoCancel':
                    uc.ucExtends.caption = 'Confirm';
                    break;
                case 'AbortRetryIgnore':
                    uc.ucExtends.caption = 'Choose';
                    break;
            }
        }
        else {
            uc.ucExtends.caption = title;
        }
        let eleToFocus = undefined;
        let ele = uc.ucExtends.find(`[role="${defaultFocus}"]`);
        if (ele.length == 1)
            eleToFocus = ele[0];
        uc.winframe1.showDialog({
            defaultFocusAt: eleToFocus
        });
    }
    fire(stmp) {
        switch (stmp) {
            case this.cmd_ok.stamp():
                this.finalResult('ok');
                break;
            case this.cmd_cancel.stamp():
                this.finalResult('cancel');
                break;
            case this.cmd_no.stamp():
                this.finalResult('no');
                break;
            case this.cmd_yes.stamp():
                this.finalResult('yes');
                break;
            case this.cmd_abort.stamp():
                this.finalResult('abort');
                break;
            case this.cmd_retry.stamp():
                this.finalResult('retry');
                break;
            case this.cmd_ignore.stamp():
                this.finalResult('ignore');
                break;
        }
    }
    initByButtonType(type) {
        switch (type) {
            case 'Ok':
                this.cmd_ok.style.display = 'inline-block';
                break;
            case 'OkCancel':
                this.cmd_ok.style.display =
                    this.cmd_cancel.style.display = 'inline-block';
                break;
            case 'AbortRetryIgnore':
                this.cmd_abort.style.display =
                    this.cmd_retry.style.display =
                        this.cmd_ignore.style.display = 'inline-block';
                break;
            case 'RetryCancel':
                this.cmd_retry.style.display =
                    this.cmd_cancel.style.display = 'inline-block';
                break;
            case 'YesNo':
                this.cmd_yes.style.display =
                    this.cmd_no.style.display = 'inline-block';
                break;
            case 'YesNoCancel':
                this.cmd_yes.style.display =
                    this.cmd_no.style.display =
                        this.cmd_cancel.style.display = 'inline-block';
                break;
        }
    }
}
exports.MessageBox = MessageBox;
