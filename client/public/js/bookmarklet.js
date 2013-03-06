(function(){
  if(typeof jQuery=='undefined') {
    var headTag = document.getElementsByTagName("head")[0];
    var jqTag = document.createElement('script');
    jqTag.type = 'text/javascript';
    jqTag.src = '3p/js/jquery-1.9.1.js';
    jqTag.onload = grabDocument;
    headTag.appendChild(jqTag);
  } else {
    grabDocument();
  };

  function getDoctype(doctype)
  {
    return '<!DOCTYPE ' + doctype.name + (doctype.publicId ? ' PUBLIC "' + doctype.publicId + '"': '') + (doctype.systemId ? ' "' + doctype.systemId + '"' : '') + '>';
  }

  function grabDocument() {
    var docType = getDoctype(document.doctype);
    var htmlTag = document.getElementsByTagName('html')[0];
    var html = '<html ';
    for (var ii = 0; ii < htmlTag.attributes.length; ++ii) {
      html += htmlTag.attributes.item(ii).nodeName +'="'+ htmlTag.attributes.item(ii).nodeValue +'"';
    }
    html += '>';
    var content = document.getElementsByTagName('html')[0].innerHTML;

    var pageObj = {
      'URL': document.URL,
      // content: {
      // _content_type: "text/html; charset=UTF-8",
      // _name: document.URL,
      'content': getDoctype(document.doctype) + "\n" + html + content + "</html>"
      // }
    };

    // $.ajax({
      // 'type': 'POST',
      // 'url': 'http://localhost:9200/bookmarks/bookmark/',
      // 'data': pageObj,
      // 'success': function(data, textStatus, jqXHR) { console.log(data); console.log(textStatus); },
      // 'datatype': 'json'
    // });

    console.dir(pageObj);
  };
})();
