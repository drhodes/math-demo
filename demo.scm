(load "wrapper.scm")
(console-log "starting demo")

(animate) ;; start rendering.

;; TODO figure out how to pass a (js-closure) into the frame renderer,
;; or alternatively, setup some global render function which is
;; visible to the _animate js function

(define (ease-arrow-head-to arrow target-vector num-steps)
  ;; return a function that interpolates a path which is stepped over
  ;; mutating the arrow depending on the frame.
  
  (lambda (start-frame end-frame current-frame)
    ;; eventually, mutate the arrow
    (console-log (list start-frame end-frame current-frame))
    
    ;; return false when current-frame == end-frame.    
    (eq? current-frame end-frame)))


(define (gram-schmidt)
  ;; introduce some persistant objects
  (define red-arrow   (mk-arrow (mk-vector 1 0 0) (mk-vector 0 0 0) 0xFF0000))
  (define green-arrow (mk-arrow (mk-vector 0 1 0) (mk-vector 0 0 0) 0x00FF00))
  (define blue-arrow  (mk-arrow (mk-vector 0 0 1) (mk-vector 0 0 0) 0x0000FF))
  (ease-arrow red-arrow '(1 1 1))
  
  ;;(sequence-states (state "first"))
  )
