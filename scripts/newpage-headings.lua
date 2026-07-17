-- Delete all content from # Lampiran onward (including lampiran content)
-- Insert \newpage before # BAB headings and ## numbered sub-bab headings
-- Skip ## Daftar Isi (use pandoc --toc instead)
-- Replace Unicode ✓ ✗ ☐ with LaTeX

function Pandoc(doc)
  local blocks = {}
  local stop = false
  for _, blk in ipairs(doc.blocks) do
    if not stop then
      if blk.t == 'Header' and blk.level == 1 then
        local text = pandoc.utils.stringify(blk)
        if text == 'Lampiran' then
          stop = true
        end
      end
      if not stop then
        table.insert(blocks, blk)
      end
    end
  end
  doc.blocks = blocks
  return doc
end

function Header(el)
  if el.level == 1 then
    local text = pandoc.utils.stringify(el)
    if text:match("^BAB ") then
      return { pandoc.RawBlock('tex', '\\newpage'), el }
    end
  end
  if el.level == 2 then
    local text = pandoc.utils.stringify(el)
    if text == 'Daftar Isi' then
      return {}
    end
    if text == 'Lembar Pengesahan' then
      return { pandoc.RawBlock('tex', '\\newpage'), el }
    end
    if text:match("^%d") then
      return { pandoc.RawBlock('tex', '\\newpage'), el }
    end
  end
  return el
end

function Str(el)
  el.text = el.text:gsub("✓", "\\checkmark ")
  el.text = el.text:gsub("✗", "\\texttimes ")
  el.text = el.text:gsub("☐", "$\\square$ ")
  return el
end
