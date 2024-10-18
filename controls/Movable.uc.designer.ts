import { Usercontrol } from 'ucbuilder/Usercontrol';
import { intenseGenerator } from 'ucbuilder/intenseGenerator';
import { UcOptions } from 'ucbuilder/enumAndMore';
import { VariableList } from 'ucbuilder/global/stylerRegs';

/**
 *  code filename must same and case sensitive with classname 
 */
import { Movable } from './Movable.uc';


export class Designer extends Usercontrol {    
    static get giveMeHug(): string {
        return Usercontrol.giveMeHug;
    }
    static setCSS_globalVar (varList:VariableList /*key: string, value: string*/): void  {
        intenseGenerator.setCSS_globalVar(varList,`uccontrols/controls/Movable.uc`);
    }
    static Create(pera: UcOptions, ...args: any[]): Movable { 
        /** uccontrols/controls/Movable.uc */
        return intenseGenerator.generateUC('uccontrols/controls/Movable.uc',pera,...args) as Movable;
    }
    
    public dragme: HTMLUnknownElement;
    public title_panel: HTMLElement;
    public lbl_title: HTMLElement;
    public cmd_close: HTMLUnknownElement;
    public container1: HTMLUnknownElement;

    
    constructor(){ super(); }
    initializecomponent(argsLst: IArguments, form: Movable) {
        let fargs = Usercontrol.extractArgs(arguments);
        let args = fargs[fargs.length-1] as UcOptions;
        let ucExt = this.ucExtends;
        
        ucExt.initializecomponent(args);        
        let CONTROLS = ucExt.designer.getAllControls();
        this.dragme = CONTROLS.dragme as HTMLUnknownElement;
        this.title_panel = CONTROLS.title_panel as HTMLElement;
        this.lbl_title = CONTROLS.lbl_title as HTMLElement;
        this.cmd_close = CONTROLS.cmd_close as HTMLUnknownElement;
        this.container1 = CONTROLS.container1 as HTMLUnknownElement;

        ucExt.finalizeInit(args);
        ucExt.session.prepareForAutoLoadIfExist();
        if (args.loadAt) args.loadAt.appendChild(ucExt.wrapperHT);
       
        Usercontrol.assignPropertiesFromDesigner(form);
    }
}