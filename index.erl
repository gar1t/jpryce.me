-module(index).

data(_) ->
    #{
      personal => "personal.md",
      about => "about.md",
      education => "education.md",
      employment => "employment.md",
      skills => "skills.md"
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
