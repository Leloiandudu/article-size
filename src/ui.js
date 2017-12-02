import { loadUsing } from './loader';
import { getCurrentRevId, getArticleSize } from './mw';
import css from './style.less';

loadUsing([ 'jquery.ui.dialog', 'mediawiki.util' ], function () {
   mw.util.addCSS(css);

   $(mw.util.addPortletLink('p-cactions', '#', 'Article stats')).click(ev => {
      ev.preventDefault();
      show();
   });
});

function show() {
   createDialog().dialog({
      modal: true,
      resizable: false,
   });
}

function createDialog() {
   const parent = $('<dl />');

   showStats(parent, {});
   loadData(parent);

   return $('<div />')
      .attr('title', 'Article stats')
      .addClass('article-stats')
      .append(parent);
}

async function loadData(parent) {
   const revId = getCurrentRevId();
   showStats(parent, await getArticleSize(revId));
}

function showStats(parent, { bytes, words, chars }) {
   $(parent).empty();
   $(parent).append(
      showStat('Size, bytes', bytes),
      showStat('Word count', words),
      showStat('Character count', chars)
   );
}

function showStat(title, item) {
   return [
      $('<dt />').text(title),
      $('<dd />').text((item || '…').toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 ')),
   ]
}
