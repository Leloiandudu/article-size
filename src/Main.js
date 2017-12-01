import React from 'react';
import { render } from 'react-dom';

var api;

var mwApi = (params) => {
   return new Promise((resolve, reject) => {
      var data = {
         format: "json",
         formatversion: "2",         
      };

      for (var param in params)
         data[param] = params[param];

      api.post(data).done(resolve).fail(reject);
   })
};

async function getArticle(revId) {
   var [ result, html ] = await Promise.all([ mwApi({
      action: "query",
      prop: "revisions",
      rvprop: "size",
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
};

function getCurrentRevId() {
   return mw.config.get("wgRevisionId");
};

var eraseTags = (tag, tags) => {
   if (!tag.childNodes.length)
      return tag.textContent;

   return [...tag.childNodes]
      .filter(tag => tags.indexOf(tag.nodeName.toLowerCase()) === -1)
      .map(tag => eraseTags(tag, tags).trim())
      .filter(tag => tag)
      .join(" ");
};

var getPlainText = (text) => {
   var tags = ["sup", "sub", "table", "div", "ul", "ol", "li", "dl", "dd", "dt", "#comment", "h1", "h2", "h3", "h4", "h5", "h6"];
   var parser = new DOMParser();
   var html = parser.parseFromString(text, "text/html");
   return eraseTags(html.body, tags);
};

var getWordCount = (text) => {
   return (getPlainText(text).match(/[^\s]*[^\s.,;:()\-—\[\]'"«»„“$%*°]+[^\s]*(\s|$)+/g) || []).length;
};

var Application = React.createClass({
   getInitialState() {
      return {};
   },

   showStat(title, item) {
      return [
         <dt>{title}</dt>,
         <dd>{(item || "…").toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1 ")}</dd>
      ]
   },

   async loadStats() {
      var revId = getCurrentRevId();
      var { size, html } = await getArticle(revId);

      this.setState({
         articleSize: size,
         articleWordCount: getWordCount(html),
         articleCharCount: getPlainText(html).length,
      });
   },

   componentWillMount() {
      this.loadStats();
   },

   render() {
      return (
         <Dialog header="Article stats" isOpen={this.props.isOpen} className="article-stats" onClose={() => showApp(false)}>
            <dl>
               {[
                  this.showStat("Size, bytes", this.state.articleSize),
                  this.showStat("Word count", this.state.articleWordCount),
                  this.showStat("Character count", this.state.articleCharCount),
               ]}
            </dl>
         </Dialog>
      )
   },
});

var Dialog = React.createClass({
   render() {
      return (
         !!this.props.isOpen && <div className="dialog">
            <div className="dialog-dimmer wrapper" />
            <div className="dialog-wrapper wrapper">
               <div className={this.props.className}>
                  <div className="header">
                     <span>{this.props.header}</span>
                     <button className="button" onClick={this.props.onClose}>×</button>
                  </div>
                  <div className="dialog-body">
                     {this.props.children}
                  </div>
               </div>
            </div>
         </div>
      );
   }
});

function showApp(show) {
   render(
      <Application isOpen={show} />,
      document.getElementById("article-stats-container")
   );
}

window.RLQ.push(function() { mw.loader.using([ 'mediawiki.api' ], function () {
   api = new mw.Api({
      ajax: {
         headers: { "Api-User-Agent": "ArticleStats/1.0" }
      }
   });
   $("<div>").attr('id', 'article-stats-container').appendTo(document.body);
   showApp(true);
})});
