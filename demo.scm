(load "wrapper.scm")
(console-log "starting demo")

(animate) ;; start rendering.

;; TODO figure out how to pass a (js-closure) into the frame renderer,
;; or alternatively, setup some global render function which is
;; visible to the _animate js function


(define (ease-arrow-head-to arrow target-vector num-steps)
  ;; return a function that interpolates a path which is stepped over
  ;; mutating the arrow depending on the frame.
  (if (< num-steps 0) (raise "num-steps must be greater than 0"))
  (define cur-step 0)

  ;; need to implement arrow component functions.
  
  (lambda ()
    (set! cur-step (+ cur-step 1))
    ;; mutate the arrow
    (console-log arrow)
    ;; (set-arrow-dir! arrow (mk-vector (/ cur-step 10) 1 0))
    
    ;; return true when cur-step > num-steps
    ;; this indicates when the easing computation is done.
    (> cur-step num-steps)))



(define (ease-camera-to target-vector look-vector num-steps)
  ;; return a function that interpolates a path which is stepped over
  ;; mutating the arrow depending on the frame.
  (if (< num-steps 0) (raise "num-steps must be greater than 0"))
  (define cur-step 0)

  (define cam (get-camera))
  (define start-vector (get-camera-pos cam))
  
  ;; generate a list of positions which will be indexed by the current
  ;; step.
  (define positions (interpolate-vectors start-vector target-vector num-steps))

  
  (lambda ()
    ;; grab the first position and put the camera there.
    (set-camera-pos! cam (car positions))
    ;; drop the first position off the list.    
    (set! positions (cdr positions))
    ;; aim the camera 
    (set-camera-look! cam look-vector)
    ;; return true when positions empty    
    ;; this indicates when the easing computation is done.
    (null? positions)
    ))

(define (gram-schmidt)
  ;; coordinate
  ;; grid plane.

  
  (let ((arr (mk-arrow (mk-vector 10 0 0) (mk-vector -100 0 0) 0xEEEEEE)))
    (set-arrow-len! arr 1000)
    (scene-add arr))
  (let ((arr (mk-arrow (mk-vector 0 10 0) (mk-vector 0 -100 0) 0xEEEEEE)))
    (set-arrow-len! arr 1000)
    (scene-add arr))
  (let ((arr (mk-arrow (mk-vector 0 0 10) (mk-vector 0 0 -100) 0xEEEEEE)))
    (set-arrow-len! arr 1000)
    (scene-add arr))
  
  
  ;; introduce some persistant objects
  (define red-arrow   (mk-arrow (mk-vector 1 0 0) (mk-vector 0 0 0) 0xFF0000))
  (define green-arrow (mk-arrow (mk-vector 0 1 0) (mk-vector 0 0 0) 0x00FF00))
  (define blue-arrow  (mk-arrow (mk-vector 0 0 1) (mk-vector 0 0 0) 0x0000FF))
  (scene-add red-arrow)
  (scene-add green-arrow)
  (scene-add blue-arrow)

  (define num-steps 100)
  
  (define red-move (ease-arrow-head-to red-arrow (mk-vector 1 1 1) num-steps))  
  ((mk-animator (js-closure red-move)))
  
  (define cam-move (ease-camera-to (mk-vector 7 7 7) (mk-vector 0 0 0) num-steps))
  ((mk-animator (js-closure cam-move)))
  

  
  ;;;;
  )

(console-log "finished")

(gram-schmidt)


