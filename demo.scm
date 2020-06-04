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
  
  (lambda ()
    (set! cur-step (+ cur-step 1))
    ;; mutate the arrow
    
    (set-arrow-dir! arrow (mk-vector (/ cur-step 10) 1 0))
    
    ;; return true when cur-step > num-steps
    ;; this indicates when the easing computation is done.
    (> cur-step num-steps)))

(define (interpolate-nums x y num-steps)
  ;;(console-log (list x y))
  (let ((delta (/ (- y x) num-steps)))
    (if (< num-steps 1) (list)
        (cons x (interpolate-nums (+ x delta) y (- num-steps 1))))))

(define (zip-with-3 f xs ys zs)
  (if (or (null? xs) (null? ys) (null? zs))
      (list)
      (cons (f (car xs) (car ys) (car zs))
            (zip-with-3 f (cdr xs) (cdr ys) (cdr zs)))))

(define (interpolate-vectors vec1 vec2 num-steps)
  (let ((xs (interpolate-nums (vec-x vec1) (vec-x vec2) num-steps))
        (ys (interpolate-nums (vec-y vec1) (vec-y vec2) num-steps))
        (zs (interpolate-nums (vec-z vec1) (vec-z vec2) num-steps)))
    (zip-with-3 mk-vector xs ys zs)))


(define (ease-camera-to target-vector num-steps)
  ;; return a function that interpolates a path which is stepped over
  ;; mutating the arrow depending on the frame.
  (if (< num-steps 0) (raise "num-steps must be greater than 0"))
  (define cur-step 0)


  (define cam (get-camera))
  (define start-vector (get-camera-pos cam))
  (define origin (mk-vector 0 0 0))
  
  ;; generate a list of positions which will be indexed by the current
  ;; step.
  (define vector-list (interpolate-vectors start-vector target-vector num-steps))

  
  (lambda ()
    (set-camera-pos! cam (car vector-list))
    ;; (console-log (car vector-list))
    ;; (console-log (get-camera-pos cam))
    (set! vector-list (cdr vector-list))
    (set-camera-look! cam origin)
    ;; return true when vector-list empty    
    ;; this indicates when the easing computation is done.
    (null? vector-list)
    ))

(define (gram-schmidt)
  ;; grid plane.
  
  ;; introduce some persistant objects
  (define red-arrow   (mk-arrow (mk-vector 1 0 0) (mk-vector 0 0 0) 0xFF0000))
  (define green-arrow (mk-arrow (mk-vector 0 1 0) (mk-vector 0 0 0) 0x00FF00))
  (define blue-arrow  (mk-arrow (mk-vector 0 0 1) (mk-vector 0 0 0) 0x0000FF))
  (scene-add red-arrow)
  (scene-add green-arrow)
  (scene-add blue-arrow)

  (define num-steps 200)
  
  ;; (define red-move (ease-arrow-head-to red-arrow (mk-vector 1 1 1) num-steps))  
  ;; ((mk-animator (js-closure red-move)))
  
  (define cam-move (ease-camera-to (mk-vector 7 7 7) (/ num-steps 5)))
  ((mk-animator (js-closure cam-move)))
  
  
  ;;;;
  )
  
(console-log "finished")

(gram-schmidt)


