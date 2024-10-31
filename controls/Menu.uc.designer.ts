import { Usercontrol } from 'ucbuilder/Usercontrol';
import { intenseGenerator } from 'ucbuilder/intenseGenerator';
import { UcOptions } from 'ucbuilder/enumAndMore';
import { VariableList } from 'ucbuilder/global/stylerRegs';

/**
 *  code filename must same and case sensitive with classname 
 */
import { Menu } from 'uccontrols/controls/Menu.uc';


export class Designer extends Usercontrol {    
    /**  uccontrols/controls/Menu.uc
     *  AUTO RENAMING IS DEPEND ON `_FILE_PATH` SO KEEP YOUR SELF FAR FROM THIS :-)
     */
    private static _FILE_PATH = window.atob('dWNjb250cm9scy9jb250cm9scy9NZW51LnVj');
    public static get FILE_PATH() {
        return Designer._FILE_PATH;
    }
    static get giveMeHug(): string {
        return Usercontrol.giveMeHug;
    }
    static setCSS_globalVar (varList:VariableList /*key: string, value: string*/): void  {
        intenseGenerator.setCSS_globalVar(varList,this.FILE_PATH);
    }
    static Create(pera: UcOptions, ...args: any[]): Menu { 
        /** uccontrols/controls/Menu.uc */
        return intenseGenerator.generateUC(this.FILE_PATH,pera,...args) as Menu;
    }
    

    
    constructor(){ super(); }
    initializecomponent(argsLst: IArguments, form: Menu) {
        let fargs = Usercontrol.extractArgs(arguments);
        let args = fargs[fargs.length-1] as UcOptions;
        let ucExt = this.ucExtends;
        
        ucExt.initializecomponent(args);        
        let CONTROLS = ucExt.designer.getAllControls();

        ucExt.finalizeInit(args);
        ucExt.session.prepareForAutoLoadIfExist();
        if (args.loadAt) args.loadAt.appendChild(ucExt.wrapperHT);
       
        Usercontrol.assignPropertiesFromDesigner(form);
    }
}