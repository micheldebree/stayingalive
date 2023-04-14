packadd vim-c64jasm
set makeprg=make
noremap <F1> :!./doc/opcode.sh <cword><CR>
noremap <F2> :!open https://c64os.com/post/6502instructions
noremap <F5> :wa<CR>:silent! make %<.prg<CR>
noremap <F6> :wa<CR>:silent! make main.run<bar>vertical botright cwindow 80<CR>:redraw!<CR>
noremap <F7> :wa<CR>:make main.debug<bar>cwindow<CR>:redraw!<CR>
noremap <F8> :wa<CR>:silent! make clean main.prg<bar>vertical botright copen 80<CR>:redraw!<CR>
noremap <F9> :vert term ++close telnet 127.0.0.1 6510<CR>
set errorformat=%EError:\ %m,%Cat\ line\ %l\\,\ column\ %c\ in\ %f,%Z
set autoindent
set textwidth=80
set shiftwidth=2
set tabstop=2
set softtabstop=2
set smartindent
set expandtab
set foldlevel=999
set foldcolumn=3
set expandtab
" set autochdir
au BufNewFile,BufRead *.asm set ft=c64jasm
au BufNewFile,BufRead *.dbg set ft=xml
au BufNewFile,BufRead *.petmate set ft=json
au BufNewFile,BufRead *.asm setlocal foldmarker={,}
au FileType asm set commentstring=;%s
au FileType asm set errorformat=%f:%l:%c:\ %m
au FileType asm set foldmethod=marker
au VimLeave *.asm,*.js,Makefile mks!

let g:ale_linters = {'javascript': ['standard']}
let g:ale_fixers = {'javascript': ['standard'], 'json': ['jq'] }
