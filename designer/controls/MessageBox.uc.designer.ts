import { Usercontrol } from 'ucbuilder/Usercontrol';
import { intenseGenerator } from 'ucbuilder/intenseGenerator';
import { UcOptions } from 'ucbuilder/enumAndMore';
import { VariableList } from 'ucbuilder/global/stylerRegs';
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
    static get giveMeHug(): string {
        return Usercontrol.giveMeHug;
    }
    static setCSS_globalVar (varList:VariableList /*key: string, value: string*/): void  {
        intenseGenerator.setCSS_globalVar(varList,this.FILE_PATH);
    }
    static Create(pera: UcOptions, ...args: any[]): MessageBox { 
        /** uccontrols/controls/MessageBox.uc */
        return intenseGenerator.generateUC(this.FILE_PATH,pera,...args) as MessageBox;
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
        let args = fargs[fargs.length-1] as UcOptions;
        let ucExt = this.ucExtends;
        
        ucExt.initializecomponent(args);        
        let CONTROLS = ucExt.designer.getAllControls();
         
        
       
        this.winframe1 = winFrame.Create({ 
                            parentUc : this, 
                            mode:args.mode,
                            session:{
                                loadBySession:args.session.loadBySession,
                                uniqueIdentity:"winframe1" , 
                                addNodeToParentSession:true,
                            },   
                            decisionForTargerElement:'replace',
                            targetElement : CONTROLS.winframe1 
                        });
        this.winframe1.ucExtends.show();
        this.lbl_message = CONTROLS.lbl_message as HTMLUnknownElement;
        this.lbl_messagedetail = CONTROLS.lbl_messagedetail as HTMLElement;
        this.buttonList = CONTROLS.buttonList as HTMLElement;
        this.cmd_yes = CONTROLS.cmd_yes as HTMLUnknownElement;
        this.cmd_no = CONTROLS.cmd_no as HTMLUnknownElement;
        this.cmd_ok = CONTROLS.cmd_ok as HTMLUnknownElement;
        this.cmd_cancel = CONTROLS.cmd_cancel as HTMLUnknownElement;
        this.cmd_abort = CONTROLS.cmd_abort as HTMLUnknownElement;
        this.cmd_retry = CONTROLS.cmd_retry as HTMLUnknownElement;
        this.cmd_ignore = CONTROLS.cmd_ignore as HTMLUnknownElement;

        ucExt.finalizeInit(args);
        ucExt.session.prepareForAutoLoadIfExist();
        if (args.loadAt) args.loadAt.appendChild(ucExt.wrapperHT);
       
        Usercontrol.assignPropertiesFromDesigner(form);
    }
}