import { Usercontrol } from "@ucbuilder/Usercontrol.js";
import { intenseGenerator } from "@ucbuilder/intenseGenerator.js";
import { IUcOptions } from "@ucbuilder/enumAndMore.js";
import { VariableList } from "@ucbuilder/lib/stylers/StylerRegs.js";

/**
 *  code filename must same and case sensitive with classname 
 */
import { LinearList } from 'uccontrols/controls/LinearList.uc';


export class Designer extends Usercontrol {    
    /**  uccontrols/controls/LinearList.uc
     *  AUTO RENAMING IS DEPEND ON `_FILE_PATH` SO KEEP YOUR SELF FAR FROM THIS :-)
     */
    private static _FILE_PATH = 'uccontrols/controls/LinearList.uc';//window.atob('dWNjb250cm9scy9jb250cm9scy9MaW5lYXJMaXN0LnVj');
    public static get FILE_PATH() {
        return Designer._FILE_PATH;
    }
    static get designerToCode(): string {
        return Usercontrol.designerToCode;
    }
    static setCSS_globalVar (varList:VariableList /*key: string, value: string*/): void  {
        intenseGenerator.setCSS_globalVar(varList,this.FILE_PATH);
    }
    static Create(pera: IUcOptions, ...args: any[]): LinearList { 
        /** uccontrols/controls/LinearList.uc */
        return intenseGenerator.generateUC(this.FILE_PATH,LinearList,pera,...args) as LinearList;
    }
    get(id:"") {
        return this.ucExtends.find(`[id="${id}"]`)[0];
    }


    

    
    constructor(){ super(); }
    initializecomponent(argsLst: IArguments, form: LinearList) {
        let fargs = Usercontrol.extractArgs(arguments);
        let args = fargs[fargs.length-1] as IUcOptions;
        let ucExt = this.ucExtends;
        
        ucExt.initializecomponent(args);        
        let CONTROLS = ucExt.designer.getAllControls();

        ucExt.finalizeInit(args);
        ucExt.session.prepareForAutoLoadIfExist();
        if (args.loadAt) args.loadAt.appendChild(ucExt.wrapperHT);
       
        Usercontrol.assignPropertiesFromDesigner(form);
    }
}