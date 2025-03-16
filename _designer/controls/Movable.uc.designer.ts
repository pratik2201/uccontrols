import { Usercontrol } from "@ucbuilder/Usercontrol.js";
import { intenseGenerator } from "@ucbuilder/intenseGenerator.js";
import { IUcOptions } from "@ucbuilder/enumAndMore.js";
import { VariableList } from "@ucbuilder/lib/stylers/StylerRegs.js";

/**
 *  code filename must same and case sensitive with classname 
 */
import { Movable } from 'uccontrols/controls/Movable.uc';


export class Designer extends Usercontrol {    
    /**  uccontrols/controls/Movable.uc
     *  AUTO RENAMING IS DEPEND ON `_FILE_PATH` SO KEEP YOUR SELF FAR FROM THIS :-)
     */
    private static _FILE_PATH = 'uccontrols/controls/Movable.uc';//window.atob('dWNjb250cm9scy9jb250cm9scy9Nb3ZhYmxlLnVj');
    public static get FILE_PATH() {
        return Designer._FILE_PATH;
    }
    static get designerToCode(): string {
        return Usercontrol.designerToCode;
    }
    static setCSS_globalVar (varList:VariableList /*key: string, value: string*/): void  {
        intenseGenerator.setCSS_globalVar(varList,this.FILE_PATH);
    }
    static Create(pera: IUcOptions, ...args: any[]): Movable { 
        /** uccontrols/controls/Movable.uc */
        return intenseGenerator.generateUC(this.FILE_PATH,Movable,pera,...args) as Movable;
    }
    get(id:"") {
        return this.ucExtends.find(`[id="${id}"]`)[0];
    }


    
    public dragme: HTMLUnknownElement;
    public title_panel: HTMLElement;
    public lbl_title: HTMLElement;
    public cmd_close: HTMLUnknownElement;
    public container1: HTMLUnknownElement;

    
    constructor(){ super(); }
    initializecomponent(argsLst: IArguments, form: Movable) {
        let fargs = Usercontrol.extractArgs(arguments);
        let args = fargs[fargs.length-1] as IUcOptions;
        let ucExt = this.ucExtends;
        
        ucExt.initializecomponent(args);        
        let CONTROLS = ucExt.designer.getAllControls();
        this.dragme = CONTROLS.dragme as FieldBox;
        this.title_panel = CONTROLS.title_panel as FieldBox;
        this.lbl_title = CONTROLS.lbl_title as FieldBox;
        this.cmd_close = CONTROLS.cmd_close as FieldBox;
        this.container1 = CONTROLS.container1 as FieldBox;

        ucExt.finalizeInit(args);
        ucExt.session.prepareForAutoLoadIfExist();
        if (args.loadAt) args.loadAt.appendChild(ucExt.wrapperHT);
       
        Usercontrol.assignPropertiesFromDesigner(form);
    }
}