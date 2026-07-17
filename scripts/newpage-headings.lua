-- Insert \newpage before each level-1 (#) and level-2 (##) heading
function Header(el)
  if el.level <= 2 then
    return { pandoc.RawBlock('tex', '\\newpage'), el }
  end
end

-- Replace Unicode symbols with LaTeX equivalents
function Str(el)
  el.text = el.text:gsub("✓", "\\checkmark ")
  el.text = el.text:gsub("✗", "\\texttimes ")
  el.text = el.text:gsub("☐", "$\\square$ ")
  return el
end
