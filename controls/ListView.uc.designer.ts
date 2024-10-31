import { Usercontrol } from 'ucbuilder/Usercontrol';
import { intenseGenerator } from 'ucbuilder/intenseGenerator';
import { UcOptions } from 'ucbuilder/enumAndMore';
import { VariableList } from 'ucbuilder/global/stylerRegs';

/**
 *  code filename must same and case sensitive with classname 
 */
import { ListView } from 'uccontrols/controls/ListView.uc';


export class Designer extends Usercontrol {    
    /**  uccontrols/controls/ListView.uc
     *  AUTO RENAMING IS DEPEND ON `_FILE_PATH` SO KEEP YOUR SELF FAR FROM THIS :-)
     */
    private static _FILE_PATH = 'uccontrols/controls/ListView.uc';//window.atob('dWNjb250cm9scy9jb250cm9scy9MaXN0Vmlldy51Yw==');
    public static get FILE_PATH() {
        return Designer._FILE_PATH;
    }
    static get giveMeHug(): string {
        return Usercontrol.giveMeHug;
    }
    static setCSS_globalVar (varList:VariableList /*key: string, value: string*/): void  {
        intenseGenerator.setCSS_globalVar(varList,this.FILE_PATH);
    }
    static Create(pera: UcOptions, ...args: any[]): ListView { 
        /** uccontrols/controls/ListView.uc */
        return intenseGenerator.generateUC(this.FILE_PATH,pera,...args) as ListView;
    }
    
    public begin_scroll_text: HTMLElement;
    public scroller1: HTMLUnknownElement;
    public ll_view: HTMLUnknownElement;
    public end_scroll_text: HTMLElement;
    public hscrollbar1: HTMLUnknownElement;
    public vscrollbar1: HTMLUnknownElement;

    
    constructor(){ super(); }
    initializecomponent(argsLst: IArguments, form: ListView) {
        let fargs = Usercontrol.extractArgs(arguments);
        let args = fargs[fargs.length-1] as UcOptions;
        let ucExt = this.ucExtends;
        
        ucExt.initializecomponent(args);        
        let CONTROLS = ucExt.designer.getAllControls();
        this.begin_scroll_text = CONTROLS.begin_scroll_text as HTMLElement;
        this.scroller1 = CONTROLS.scroller1 as HTMLUnknownElement;
        this.ll_view = CONTROLS.ll_view as HTMLUnknownElement;
        this.end_scroll_text = CONTROLS.end_scroll_text as HTMLElement;
        this.hscrollbar1 = CONTROLS.hscrollbar1 as HTMLUnknownElement;
        this.vscrollbar1 = CONTROLS.vscrollbar1 as HTMLUnknownElement;

        ucExt.finalizeInit(args);
        ucExt.session.prepareForAutoLoadIfExist();
        if (args.loadAt) args.loadAt.appendChild(ucExt.wrapperHT);
       
        Usercontrol.assignPropertiesFromDesigner(form);
    }
}