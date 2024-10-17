//console.log('~~~:['+ __dirname +']');
import path from "path";
import ucb from "ucbuilder/register"; 
import "ucbuilder/extension";
ucb.registar({
    outDir: "/out/",
    rootDir: path.dirname(__dirname)
});