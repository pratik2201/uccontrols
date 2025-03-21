import { Usercontrol } from 'ucbuilder/Usercontrol';
import { intenseGenerator } from 'ucbuilder/intenseGenerator';
import { IUcOptions } from 'ucbuilder/enumAndMore';
import { VariableList } from 'ucbuilder/lib/stylers/StylerRegs';
import { itemNode } from 'uccontrols/controls/tabControl/itemNode.tpt';

/**
 *  code filename must same and case sensitive with classname 
 */
import { tabControl } from 'uccontrols/controls/tabControl.uc';


export class Designer extends Usercontrol {    
    /**  uccontrols/controls/tabControl.uc
     *  AUTO RENAMING IS DEPEND ON `_FILE_PATH` SO KEEP YOUR SELF FAR FROM THIS :-)
     */
    private static _FILE_PATH = 'uccontrols/controls/tabControl.uc';//window.atob('dWNjb250cm9scy9jb250cm9scy90YWJDb250cm9sLnVj');
    public static get FILE_PATH() {
        return Designer._FILE_PATH;
    }
    static get designerToCode(): string {
        return Usercontrol.designerToCode;
    }
    static setCSS_globalVar (varList:VariableList /*key: string, value: string*/): void  {
        intenseGenerator.setCSS_globalVar(varList,this.FILE_PATH);
    }
    static Create(pera: IUcOptions, ...args: any[]): tabControl { 
        /** uccontrols/controls/tabControl.uc */
        return intenseGenerator.generateUC(this.FILE_PATH,tabControl,pera,...args) as tabControl;
    }
    get(id:"") {
        return this.ucExtends.find(`[id="${id}"]`)[0];
    }


    
        
    public tpt_itemnode: import('uccontrols/controls/tabControl/itemNode.tpt').itemNode;
    public container1: HTMLUnknownElement;
    public tabHeader: HTMLElement;
    public tabView: HTMLUnknownElement;

    
    constructor(){ super(); }
    initializecomponent(argsLst: IArguments, form: tabControl) {
        let fargs = Usercontrol.extractArgs(arguments);
        let args = fargs[fargs.length-1] as IUcOptions;
        let ucExt = this.ucExtends;
        
        ucExt.initializecomponent(args);        
        let CONTROLS = ucExt.designer.getAllControls();
        
        
    this.tpt_itemnode = itemNode.Create({ 
                        parentUc: this, 
                        accessName:"tpt_itemnode" , 
                        elementHT :CONTROLS.tpt_itemnode 
                    });
        this.container1 = CONTROLS.container1 as FieldBox;
        this.tabHeader = CONTROLS.tabHeader as FieldBox;
        this.tabView = CONTROLS.tabView as FieldBox;

        ucExt.finalizeInit(args);
        ucExt.session.prepareForAutoLoadIfExist();
        if (args.loadAt) args.loadAt.appendChild(ucExt.wrapperHT);
       
        Usercontrol.assignPropertiesFromDesigner(form);
    }
}