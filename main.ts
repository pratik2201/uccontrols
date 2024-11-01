//console.log('~~~:['+ __dirname +']');
import path from "path";
import ucb from "ucbuilder/register"; 
import "ucbuilder/extension";
ucb.registar({
    outDir: "/out/",    
    designerDir:"/designer/",
    rootDir: path.dirname(__dirname)
});