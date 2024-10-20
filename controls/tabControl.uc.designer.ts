import { Usercontrol } from 'ucbuilder/Usercontrol';
import { intenseGenerator } from 'ucbuilder/intenseGenerator';
import { UcOptions } from 'ucbuilder/enumAndMore';
import { VariableList } from 'ucbuilder/global/stylerRegs';
import { itemNode } from 'uccontrols/controls/tabControl/itemNode.tpt';

/**
 *  code filename must same and case sensitive with classname 
 */
import { tabControl } from './tabControl.uc';


export class Designer extends Usercontrol {    
    static FILE_PATH = `uccontrols/controls/tabControl.uc`;
    static get giveMeHug(): string {
        return Usercontrol.giveMeHug;
    }
    static setCSS_globalVar (varList:VariableList /*key: string, value: string*/): void  {
        intenseGenerator.setCSS_globalVar(varList,this.FILE_PATH);
    }
    static Create(pera: UcOptions, ...args: any[]): tabControl { 
        /** uccontrols/controls/tabControl.uc */
        return intenseGenerator.generateUC(this.FILE_PATH,pera,...args) as tabControl;
    }
    
        
    public tpt_itemnode: import('uccontrols/controls/tabControl/itemNode.tpt').itemNode;
    public container1: HTMLUnknownElement;
    public tabHeader: HTMLElement;
    public tabView: HTMLUnknownElement;

    
    constructor(){ super(); }
    initializecomponent(argsLst: IArguments, form: tabControl) {
        let fargs = Usercontrol.extractArgs(arguments);
        let args = fargs[fargs.length-1] as UcOptions;
        let ucExt = this.ucExtends;
        
        ucExt.initializecomponent(args);        
        let CONTROLS = ucExt.designer.getAllControls();
        
        
        this.tpt_itemnode = intenseGenerator.generateTPT('uccontrols/controls/tabControl/itemNode.tpt.ts',{ 
                            parentUc : this, 
                            elementHT : CONTROLS.tpt_itemnode 
                       }) as any;
        this.container1 = CONTROLS.container1 as HTMLUnknownElement;
        this.tabHeader = CONTROLS.tabHeader as HTMLElement;
        this.tabView = CONTROLS.tabView as HTMLUnknownElement;

        ucExt.finalizeInit(args);
        ucExt.session.prepareForAutoLoadIfExist();
        if (args.loadAt) args.loadAt.appendChild(ucExt.wrapperHT);
       
        Usercontrol.assignPropertiesFromDesigner(form);
    }
}