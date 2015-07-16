-module(index).

data(_) ->
    #{
      personal => "personal.md",
      about => "about.md",
      education => "education.md",
      employment => "employment.md",
      skills => "skills.config",
      portfolio => "portfolio.config",
      tags => "tags.config"
     }.

site(_) ->
    #{
      "site/index.html" => {template, "template/index.html"},
      "site/css" => {dir, "static/css"},
      "site/js" => {dir, "static/js"},
      "site/images" => {dir, "static/images"}
     }.

resume_ul(Markdown) ->
    HTML = lpad_markdown:to_html(Markdown),
    ["<ul>", [resume_li(Item) || Item <- split_items(HTML)], "</ul>"].

split_items(HTML) ->
    re:split(HTML, "<hr />").

resume_li(HTML) ->
    io_lib:format("<li>~s</li>", [HTML]).
    
