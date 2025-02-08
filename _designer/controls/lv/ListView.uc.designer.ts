import { Usercontrol } from 'ucbuilder/Usercontrol';
import { intenseGenerator } from 'ucbuilder/intenseGenerator';
import { IUcOptions } from 'ucbuilder/enumAndMore';
import { VariableList } from 'ucbuilder/lib/stylers/StylerRegs';

/**
 *  code filename must same and case sensitive with classname 
 */
import { ListView } from 'uccontrols/controls/lv/ListView.uc';


export class Designer extends Usercontrol {    
    /**  uccontrols/controls/lv/ListView.uc
     *  AUTO RENAMING IS DEPEND ON `_FILE_PATH` SO KEEP YOUR SELF FAR FROM THIS :-)
     */
    private static _FILE_PATH = 'uccontrols/controls/lv/ListView.uc';//window.atob('dWNjb250cm9scy9jb250cm9scy9sdi9MaXN0Vmlldy51Yw==');
    public static get FILE_PATH() {
        return Designer._FILE_PATH;
    }
    static get designerToCode(): string {
        return Usercontrol.designerToCode;
    }
    static setCSS_globalVar (varList:VariableList /*key: string, value: string*/): void  {
        intenseGenerator.setCSS_globalVar(varList,this.FILE_PATH);
    }
    static Create(pera: IUcOptions, ...args: any[]): ListView { 
        /** uccontrols/controls/lv/ListView.uc */
        return intenseGenerator.generateUC(this.FILE_PATH,pera,...args) as ListView;
    }
    get(id:"") {
        return this.ucExtends.find(`[id="${id}"]`)[0];
    }


    
    public headerrow: HTMLElement;
    public begin_scroll_text: HTMLElement;
    public scroller1: HTMLUnknownElement;
    public ll_view: HTMLUnknownElement;
    public end_scroll_text: HTMLElement;
    public vscrollbar1: HTMLUnknownElement;
    public footerrow: HTMLElement;

    
    constructor(){ super(); }
    initializecomponent(argsLst: IArguments, form: ListView) {
        let fargs = Usercontrol.extractArgs(arguments);
        let args = fargs[fargs.length-1] as IUcOptions;
        let ucExt = this.ucExtends;
        
        ucExt.initializecomponent(args);        
        let CONTROLS = ucExt.designer.getAllControls();
        this.headerrow = CONTROLS.headerrow as FieldBox;
        this.begin_scroll_text = CONTROLS.begin_scroll_text as FieldBox;
        this.scroller1 = CONTROLS.scroller1 as FieldBox;
        this.ll_view = CONTROLS.ll_view as FieldBox;
        this.end_scroll_text = CONTROLS.end_scroll_text as FieldBox;
        this.vscrollbar1 = CONTROLS.vscrollbar1 as FieldBox;
        this.footerrow = CONTROLS.footerrow as FieldBox;

        ucExt.finalizeInit(args);
        ucExt.session.prepareForAutoLoadIfExist();
        if (args.loadAt) args.loadAt.appendChild(ucExt.wrapperHT);
       
        Usercontrol.assignPropertiesFromDesigner(form);
    }
}