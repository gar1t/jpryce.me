-module(index).

data(_) ->
    #{
      personal => "personal.md",
      about => "about.md",
      education => "education.md",
      employment => "employment.md",
      skills => "skills.md",
      portfolio =>
          [
           #{
              title => "LA Marathon 2014 I",
              type => "youtube",
              embed_id => "oh1RqJ5W1Qo",
              thumbnail => "thumb-compassion.jpg",
              tags => "all video"
            },
           #{
              title => "LA Marathon 2014 II",
              type => "youtube",
              embed_id => "kiYfzz9lpLo",
              thumbnail => "thumb-addicted.jpg",
              tags => "all video"
            },
           #{
              title => "LA Marathon 2014 III",
              type => "youtube",
              embed_id => "MJ3MuW5extI",
              thumbnail => "thumb-determination.jpg",
              tags => "all video"
            },
           #{
              title => "Evolution",
              type => "youtube",
              embed_id => "K7owaOR3h_Y",
              thumbnail => "thumb-evolution.jpg",
              tags => "all video"
            }
          ]
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

skills_table(Markdown) ->
    ["<table>", [skill_tr(Skill) || Skill <- skills(Markdown)], "</table>"].

skills(Meta) ->
    lists:reverse([{Name, Val} || {Name, Val} <- Meta, Name /= '__file__']).

skill_tr({Name, Percent}) ->
    io_lib:format(
      "<tr>"
      "  <td class=\"skill\">~s</td>"
      "  <td class=\"level\">~s%</td>"
      "  <td class=\"skill-bar\">"
      "    <pre data-skill=\"~s\">&nbsp;</pre>"
      "  </td>"
      "</tr>", [Name, Percent, Percent]).
