import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
const base=path.resolve('dist');
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.png':'image/png','.jpg':'image/jpeg'};
http.createServer((request,response)=>{
 const pathname=new URL(request.url,'http://localhost').pathname;
 const file=path.join(base,pathname==='/'?'index.html':decodeURIComponent(pathname));
 if(!file.startsWith(base+path.sep)){response.writeHead(403).end();return;}
 fs.readFile(file,(error,data)=>{if(error){response.writeHead(404).end();return;}
 response.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream','Cache-Control':'no-cache'});response.end(data);});
}).listen(4180,'127.0.0.1',()=>console.log('Local: http://127.0.0.1:4180'));
