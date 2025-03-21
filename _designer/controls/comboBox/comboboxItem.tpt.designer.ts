import { Template, TemplateNode } from 'ucbuilder/Template';
import { intenseGenerator } from 'ucbuilder/intenseGenerator';
import { ITptOptions, templatePathOptions } from 'ucbuilder/enumAndMore';
import { VariableList } from 'ucbuilder/lib/stylers/StylerRegs';

 /**
 *  code filename must same and case sensitive with classname 
 */
import { comboboxItem } from 'uccontrols/controls/comboBox/comboboxItem.tpt';

    
 

type primary_ELEMENT_MAP = {}
class primary_TEMPLATE extends TemplateNode{
    constructor(tpt:Template) { super(tpt);   }
   
    getAllControls(elementHT?: HTMLElement): primary_ELEMENT_MAP {
        return this.extended.getAllControls(undefined,elementHT) as primary_ELEMENT_MAP;
    }
}




export const cMap_comboboxItem: {
    primary?: primary_ELEMENT_MAP;
} = {};

export class Designer extends Template {
    /** uccontrols/controls/comboBox/comboboxItem.tpt
     *  AUTO RENAMING IS DEPEND ON `_FILE_PATH` SO KEEP YOUR SELF FAR FROM THIS :-)
     */
    private static _FILE_PATH =  'uccontrols/controls/comboBox/comboboxItem.tpt'; //window.atob('dWNjb250cm9scy9jb250cm9scy9jb21ib0JveC9jb21ib2JveEl0ZW0udHB0');
    public static get FILE_PATH() {
        return Designer._FILE_PATH;
    }
    
    static setCSS_globalVar (varList:VariableList): void  {
        intenseGenerator.setCSS_globalVar(varList,this.FILE_PATH);
    }
    static Create(pera: ITptOptions): comboboxItem { 
        return intenseGenerator.generateTPT(this.FILE_PATH,comboboxItem,pera) as comboboxItem;
    }

    
        
    public primary:primary_TEMPLATE; 
   

    constructor(args:IArguments){    
        super();    
        let aargs = Template.extractArgs(arguments);
        let fargs = aargs[aargs.length - 1] as ITptOptions;
        this.extended.parentUc = fargs.parentUc;
        //let fargs = Template.extractArgs(arguments) as TptOptions;
        
        //fargs = fargs[fargs.length-1] as TptOptions;
        let ext = this.extended;
        let tpts = Template.getTemplates.byDirectory(fargs.source.cfInfo.code.fullPath,false);
        
        
        ext._templeteNode = new primary_TEMPLATE(this);
        this.primary = ext._templeteNode as primary_TEMPLATE;
        this.primary.extended.initializecomponent(fargs,tpts['primary'],"primary"); 
       

        fargs.elementHT.remove();
    }
}