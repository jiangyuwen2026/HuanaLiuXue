#!/usr/bin/expect -f

set timeout 30
set ip "159.75.91.195"
set user "root"
set password "Heb-QwgV8SB}q%5"

spawn ssh -o StrictHostKeyChecking=no $user@$ip
expect {
    "password:" {
        send "$password\r"
        exp_continue
    }
    "Password:" {
        send "$password\r"
        exp_continue
    }
    "$ " {
        send "echo '登录成功'\r"
        expect "$ "
        send "exit\r"
    }
    "# " {
        send "echo '登录成功'\r"
        expect "# "
        send "exit\r"
    }
}
interact
