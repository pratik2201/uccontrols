import { Template, TemplateNode } from 'ucbuilder/Template.js';
import { TptOptions, templatePathOptions } from 'ucbuilder/enumAndMore';
 

type primary_ELEMENT_MAP = {}
class primary_TEMPLATE extends TemplateNode{
    constructor(tpt:Template) { super(tpt);   }
   
    getAllControls(elementHT: HTMLElement): primary_ELEMENT_MAP {
        return this.extended.getAllControls(undefined,elementHT) as primary_ELEMENT_MAP;
    }
}


export class Designer extends Template {
        
    public primary:primary_TEMPLATE; 
   

    constructor(args:IArguments){    
        super();    
        let aargs = Template.extractArgs(arguments);
        let fargs = aargs[aargs.length - 1] as TptOptions;
        
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