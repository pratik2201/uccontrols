import path from "path";
import ucr from "ucbuilder";
import 'module-alias/register';
import "ucbuilder/extension";

ucr.registar({
    outDir: "/out/",    
    designerDir:"/designer/",
    rootDir: path.dirname(__dirname)
});