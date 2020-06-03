# WIN=$(xdotool search --name "math demo")
# xdotool key --clearmodifiers --window $WIN Ctrl+r

# echo $WIN

CUR_WIN=$(xdotool getactivewindow)
xdotool search --name "math demo"  windowfocus key 'ctrl+r'
xdotool windowactivate $CUR_WIN
