import { Usercontrol } from "ucbuilder/Usercontrol.js";
import { intenseGenerator } from "ucbuilder/intenseGenerator.js";
import { IUcOptions } from "ucbuilder/enumAndMore.js";
import { VariableList } from "ucbuilder/lib/stylers/StylerRegs.js";
import { winFrame } from 'uccontrols/controls/winFrame.uc';

/**
 *  code filename must same and case sensitive with classname 
 */
import { MessageBox } from 'uccontrols/controls/MessageBox.uc';


export class Designer extends Usercontrol {    
    /**  uccontrols/controls/MessageBox.uc
     *  AUTO RENAMING IS DEPEND ON `_FILE_PATH` SO KEEP YOUR SELF FAR FROM THIS :-)
     */
    private static _FILE_PATH = 'uccontrols/controls/MessageBox.uc';//window.atob('dWNjb250cm9scy9jb250cm9scy9NZXNzYWdlQm94LnVj');
    public static get FILE_PATH() {
        return Designer._FILE_PATH;
    }
    static get designerToCode(): string {
        return Usercontrol.designerToCode;
    }
    static setCSS_globalVar (varList:VariableList /*key: string, value: string*/): void  {
        intenseGenerator.setCSS_globalVar(varList,this.FILE_PATH);
    }
    static Create(pera: IUcOptions, ...args: any[]): MessageBox { 
        /** uccontrols/controls/MessageBox.uc */
        return intenseGenerator.generateUC(this.FILE_PATH,MessageBox,pera,...args) as MessageBox;
    }
    get(id:"") {
        return this.ucExtends.find(`[id="${id}"]`)[0];
    }


    
         
   
    public winframe1: import('uccontrols/controls/winFrame.uc').winFrame;
    public lbl_message: HTMLUnknownElement;
    public lbl_messagedetail: HTMLElement;
    public buttonList: HTMLElement;
    public cmd_yes: HTMLUnknownElement;
    public cmd_no: HTMLUnknownElement;
    public cmd_ok: HTMLUnknownElement;
    public cmd_cancel: HTMLUnknownElement;
    public cmd_abort: HTMLUnknownElement;
    public cmd_retry: HTMLUnknownElement;
    public cmd_ignore: HTMLUnknownElement;

    
    constructor(){ super(); }
    initializecomponent(argsLst: IArguments, form: MessageBox) {
        let fargs = Usercontrol.extractArgs(arguments);
        let args = fargs[fargs.length-1] as IUcOptions;
        let ucExt = this.ucExtends;
        
        ucExt.initializecomponent(args);        
        let CONTROLS = ucExt.designer.getAllControls();
         
        
       
        this.winframe1 = winFrame.Create({ 
                            parentUc : this, 
                            mode:args.mode,
                            accessName:"winframe1" , 
                            session:{
                                loadBySession:args.session.loadBySession,
                                uniqueIdentity:"winframe1" , 
                                addNodeToParentSession:true,
                            },   
                            decisionForTargerElement:'replace',
                            targetElement : CONTROLS.winframe1 
                        });
            this.winframe1.ucExtends.show();
        this.lbl_message = CONTROLS.lbl_message as FieldBox;
        this.lbl_messagedetail = CONTROLS.lbl_messagedetail as FieldBox;
        this.buttonList = CONTROLS.buttonList as FieldBox;
        this.cmd_yes = CONTROLS.cmd_yes as FieldBox;
        this.cmd_no = CONTROLS.cmd_no as FieldBox;
        this.cmd_ok = CONTROLS.cmd_ok as FieldBox;
        this.cmd_cancel = CONTROLS.cmd_cancel as FieldBox;
        this.cmd_abort = CONTROLS.cmd_abort as FieldBox;
        this.cmd_retry = CONTROLS.cmd_retry as FieldBox;
        this.cmd_ignore = CONTROLS.cmd_ignore as FieldBox;

        ucExt.finalizeInit(args);
        ucExt.session.prepareForAutoLoadIfExist();
        if (args.loadAt) args.loadAt.appendChild(ucExt.wrapperHT);
       
        Usercontrol.assignPropertiesFromDesigner(form);
    }
}