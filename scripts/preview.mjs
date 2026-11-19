const {createServer}=await import('node:http');
const {readFile}=await import('node:fs/promises');
const path=await import('node:path');
const {fileURLToPath}=await import('node:url');
const root=fileURLToPath(new URL('../dist/',import.meta.url));
const prefix='/Yatharth-Portfolio/',port=Number(process.env.PORT||4173);
const types={'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.svg':'image/svg+xml','.webp':'image/webp','.png':'image/png','.woff2':'font/woff2','.xml':'application/xml','.txt':'text/plain','.jpg':'image/jpeg','.ttf':'font/ttf'};
createServer(async(req,res)=>{
  try{
    const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
    if(pathname==='/'){res.writeHead(302,{Location:prefix}).end();return;}
    if(!pathname.startsWith(prefix))throw Error('Outside base path');
    const file=path.resolve(root,pathname.slice(prefix.length)||'index.html');
    const relative=path.relative(root,file);
    if(relative.startsWith('..')||path.isAbsolute(relative))throw Error('Outside build');
    const body=await readFile(file);
    res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream','X-Content-Type-Options':'nosniff'}).end(body);
  }catch{res.writeHead(404).end('Not found');}
}).listen(port,'127.0.0.1',()=>console.log(`http://127.0.0.1:${port}${prefix}`));

