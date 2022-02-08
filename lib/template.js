
module.exports = {
  // 실질적으로 사용자에게 보여주는 part. (HTML 파일)
  // template. title, list, body를 통해 제목, 리스트, body를 결정함
  /*
    title
    list
    (
      listTemplate
    )
    body
  */
  HTML:function(title, list, body, control){
    return `
    <!doctype html>
    <html>
    <head>
      <title>WEB1 - ${title}</title>
      <meta charset="utf-8">
    </head>
    <body>
      <h1><a href="/">WEB</a></h1>
      ${list}
      ${control}
      ${body}
    </body>
    </html>
    `;
  },
  // list의 template
  // 상단 templateHTML함수의 list부분 참고.
  /*
    list(
      1
      2
      3
      // listTemplate
    )
  */
  list:function(topics){
    var list = '<ul>';
    var i = 0;
    while(i < topics.length){
      list = list + `<li><a href="/?id=${topics[i].id}">${topics[i].title}</a></li>`;
      i++;
    }
    list +='</ul>';
    return list;
  }
}
