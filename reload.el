


(add-hook 'after-save-hook
          (lambda ()
            (shell-command "./reload.sh")))

