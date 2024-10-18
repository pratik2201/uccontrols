import { Usercontrol } from 'ucbuilder/Usercontrol';
import { intenseGenerator } from 'ucbuilder/intenseGenerator';
import { UcOptions } from 'ucbuilder/enumAndMore';

/**
 *  code filename must same and case sensitive with classname 
 */
import { Menu } from './Menu.uc';


export class Designer extends Usercontrol {    
    static get giveMeHug(): string {
        return Usercontrol.giveMeHug;
    }
    static setCSS_globalVar (key: string, value: string): void  {
        intenseGenerator.setCSS_globalVar(key, value,`uccontrols/controls/Menu.uc`);
    }
    static Create(pera: UcOptions, ...args: any[]): Menu { 
        /** uccontrols/controls/Menu.uc */
        return intenseGenerator.generateUC('uccontrols/controls/Menu.uc',pera,...args) as Menu;
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