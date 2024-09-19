//console.log('~~~:['+ __dirname +']');
import path from "path";
import ucb from "ucbuilder/register"; 
ucb.registar({
    //srcDir: __dirname,
    outDir: "/out/",
    rootDir: path.dirname(__dirname),
    /*html: __dirname,
    style: __dirname,
    perameters: __dirname,
    designer:__dirname,
    designerSrc:__dirname,
    code: __dirname,
    codeSrc: __dirname,*/
});