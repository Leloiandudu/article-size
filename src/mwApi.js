import { loadUsing } from './loader';
import pkg from '../package.json';

let Api;

loadUsing('mediawiki.api', () => {
   Api = new mw.Api({
      ajax: {
         headers: { 'Api-User-Agent': `${pkg.name}/${pkg.version}` }
      }
   });
})

export default function mwApi(params) {
   return new Promise((resolve, reject) => {
      if (!Api) {
         reject('Api not set.');
         return;
      }

      var data = {
        format: 'json',
        formatversion: '2',
        ...params,
      };

      Api.post(data).done(resolve).fail(reject);
   })
};
