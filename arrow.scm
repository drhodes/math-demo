(load )

;; arrow ------------------------------------------------------------------
(define arrow-cmd-name cadr)
(define arrow-cmd-tail caddr)
(define arrow-cmd-head cadddr)
(define arrow-cmd-color caddddr)

(define (eval-add-arrow cmd)
  (let ((arrow (mk-arrow
                (apply mk-vector (arrow-cmd-head cmd))
                (apply mk-vector (arrow-cmd-tail cmd))
                (arrow-cmd-color cmd))))
    (put-arrow (arrow-cmd-name cmd) arrow)
    (scene-add arrow)
    ))
