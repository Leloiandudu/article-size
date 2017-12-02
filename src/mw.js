import mwApi from './mwApi';
import { getWordCount, getPlainText } from './parser';

async function getArticle(revId) {
   var [ result, html ] = await Promise.all([ mwApi({
      action: 'query',
      prop: 'revisions',
      rvprop: 'size',
      revids: revId,
   }), mwApi({
      oldid: revId,
      action: 'parse',
      redirects: true,
      prop: [ 'text' ],
      wrapoutputclass: '',
   }) ]);

   var revs = result.query && result.query.pages[0].revisions;
   var rev = revs ? revs[0] : {};
   return {
      size: rev.size,
      html: html.parse.text,
   };
}

export function getCurrentRevId() {
   return mw.config.get('wgRevisionId');
}

export async function getArticleSize(revId) {
   const { size, html } = await getArticle(revId);
   const text = getPlainText(html);

   return {
      bytes: size,
      words: getWordCount(text),
      chars: text.length,
   };
}
