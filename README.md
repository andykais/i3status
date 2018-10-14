# i3status-rx

i3bar status command for i3wm

## Installation
```bash
npm i i3status-rx
```

## Usage
add this line to your `~/.config/i3/config`
```
bar {
    status_command i3status-rx /path/to/your/sample-config.toml
}
```
optionally you can add volume control to your i3 config as well
```
bindsym XF86AudioMute exec amixer -q set Master toggle && pkill -SIGUSR1 i3status-rx
bindsym XF86AudioRaiseVolume exec amixer -q set Master 5%+ unmute && pkill -SIGUSR1 i3status-rx
bindsym XF86AudioLowerVolume exec amixer -q set Master 5%- unmute && pkill -SIGUSR1 i3status-rx
```

## Configuration
look at (or use) [sample-config.toml](./sample-config.toml). Each block uses defaults from
[default-config.toml]('./default-config.toml'). They can all be overridden in your config file. 
