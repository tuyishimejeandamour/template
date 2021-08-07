import { execSync } from 'child_process';
import dns from 'dns'
import url from 'url';



export function checkIfOnline(useYarn:any) {
    if (!useYarn) {
      // Don't ping the Yarn registry.
      // We'll just assume the best case.
      return Promise.resolve(true);
    }
  
    return new Promise(resolve => {
      dns.lookup('registry.yarnpkg.com', err => {
        let proxy;
        if (err != null && (proxy = getProxy())) {
          // If a proxy is defined, we likely can't resolve external hostnames.
          // Try to resolve the proxy name as an indication of a connection.
          const hostname = url.parse(proxy).hostname;
          if (hostname != null) {
            dns.lookup( hostname, proxyErr => {
                resolve(proxyErr == null);
              }); 
          }
         
        } else {
          resolve(err == null);
        }
      });
    });
  }

  export function getProxy():any {
    if (process.env.https_proxy) {
      return process.env.https_proxy;
    } else {
      try {
        // Trying to read https-proxy from .npmrc
        let httpsProxy = execSync('npm config get https-proxy').toString().trim();
        return httpsProxy !== 'null' ? httpsProxy : undefined;
      } catch (e) {
        return;
      }
    }
  }