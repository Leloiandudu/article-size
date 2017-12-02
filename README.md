This Wikipedia gadget adds "Article stats" to the top menu and shows some size-related data:
* total article size in bytes,
* word count (excluding tables, quotes, lists, titles, footnotes and comments),
* character count (excluding tables, quotes, lists, titles, footnotes and comments).

This gadget works for the currently open revision as well as the diff page.

## Buidling

```
gulp
```

builds and minifies the script to `./dist/wiki-article-size.js`

```
gulp --usercript /path/to/firefox/profile/
```

builds the script as a [userscript](http://wiki.greasespot.net/User_script) to `/path/to/firefox/profile/gm_scripts/wiki-article-size/wiki-article-size.user.js`.

You can also use

```
gulp watch
```

with or without `--userscript` to automatically build the script whenever any of the source files change.
