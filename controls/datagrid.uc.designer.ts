import { Usercontrol } from 'ucbuilder/Usercontrol';
import { intenseGenerator } from 'ucbuilder/intenseGenerator';
import { UcOptions } from 'ucbuilder/enumAndMore';
import { VariableList } from 'ucbuilder/global/stylerRegs';

/**
 *  code filename must same and case sensitive with classname 
 */
import { datagrid } from 'uccontrols/controls/datagrid.uc';


export class Designer extends Usercontrol {    
    /**  uccontrols/controls/datagrid.uc
     *  AUTO RENAMING IS DEPEND ON `_FILE_PATH` SO KEEP YOUR SELF FAR FROM THIS :-)
     */
    private static _FILE_PATH = window.atob('dWNjb250cm9scy9jb250cm9scy9kYXRhZ3JpZC51Yw==');
    public static get FILE_PATH() {
        return Designer._FILE_PATH;
    }
    static get giveMeHug(): string {
        return Usercontrol.giveMeHug;
    }
    static setCSS_globalVar (varList:VariableList /*key: string, value: string*/): void  {
        intenseGenerator.setCSS_globalVar(varList,this.FILE_PATH);
    }
    static Create(pera: UcOptions, ...args: any[]): datagrid { 
        /** uccontrols/controls/datagrid.uc */
        return intenseGenerator.generateUC(this.FILE_PATH,pera,...args) as datagrid;
    }
    
    public headerSectionHT: HTMLElement;
    public headerGridHT1: HTMLUnknownElement;
    public begin_scroll_text: HTMLElement;
    public pagercntnr1: HTMLUnknownElement;
    public detailGridHT1: HTMLUnknownElement;
    public end_scroll_text: HTMLElement;
    public footerSectionHT: HTMLElement;
    public footerGridHT1: HTMLUnknownElement;
    public vscrollbar1: HTMLUnknownElement;
    public hscrollbar1: HTMLUnknownElement;

    
    constructor(){ super(); }
    initializecomponent(argsLst: IArguments, form: datagrid) {
        let fargs = Usercontrol.extractArgs(arguments);
        let args = fargs[fargs.length-1] as UcOptions;
        let ucExt = this.ucExtends;
        
        ucExt.initializecomponent(args);        
        let CONTROLS = ucExt.designer.getAllControls();
        this.headerSectionHT = CONTROLS.headerSectionHT as HTMLElement;
        this.headerGridHT1 = CONTROLS.headerGridHT1 as HTMLUnknownElement;
        this.begin_scroll_text = CONTROLS.begin_scroll_text as HTMLElement;
        this.pagercntnr1 = CONTROLS.pagercntnr1 as HTMLUnknownElement;
        this.detailGridHT1 = CONTROLS.detailGridHT1 as HTMLUnknownElement;
        this.end_scroll_text = CONTROLS.end_scroll_text as HTMLElement;
        this.footerSectionHT = CONTROLS.footerSectionHT as HTMLElement;
        this.footerGridHT1 = CONTROLS.footerGridHT1 as HTMLUnknownElement;
        this.vscrollbar1 = CONTROLS.vscrollbar1 as HTMLUnknownElement;
        this.hscrollbar1 = CONTROLS.hscrollbar1 as HTMLUnknownElement;

        ucExt.finalizeInit(args);
        ucExt.session.prepareForAutoLoadIfExist();
        if (args.loadAt) args.loadAt.appendChild(ucExt.wrapperHT);
       
        Usercontrol.assignPropertiesFromDesigner(form);
    }
}