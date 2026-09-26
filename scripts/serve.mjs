import {createServer} from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import {resolve,extname,sep} from 'node:path';
const root=resolve('_site');
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.svg':'image/svg+xml','.jpg':'image/jpeg'};
createServer(async(req,res)=>{try{let file=resolve(root,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname));if(!file.startsWith(root+sep)&&file!==root){res.writeHead(403);return res.end('Forbidden');}if((await stat(file)).isDirectory())file=resolve(file,'index.html');res.writeHead(200,{'Content-Type':types[extname(file)]||'application/octet-stream'});res.end(await readFile(file));}catch{res.writeHead(404);res.end('Not found');}}).listen(8080,'127.0.0.1',()=>console.log('Open http://127.0.0.1:8080 — Ctrl+C to stop.'));
