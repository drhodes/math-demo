(load "wrapper.scm")
(load "colors.scm")
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
    ;; (set-arrow-dir! arrow (mk-vector (/ cur-step 10) 1 0))
    
    ;; return true when cur-step > num-steps
    ;; this indicates when the easing computation is done.
    (> cur-step num-steps)))

(define (ease-camera-to target-vector look-vector num-steps)
  ;; return a function that interpolates a path which is stepped over
  ;; mutating the arrow depending on the frame.
  (if (< num-steps 0) (raise "num-steps must be greater than 0"))
  (let* ((cur-step 0)
         (cam (get-camera))         
         (start-vector (get-camera-pos cam))
         
         ;; generate a list of positions which will be indexed by the current
         ;; step.
         (positions (interpolate-vectors start-vector target-vector num-steps)))
    (lambda ()
      ;; grab the first position and put the camera there.
      (set-camera-pos! cam (car positions))
      ;; drop the first position off the list.    
      (set! positions (cdr positions))
      ;; aim the camera 
      (set-camera-look! cam look-vector)
      ;; return true when positions empty    
      ;; this indicates when the easing computation is done.
      (null? positions))))

(define (ease-camera-from-to from-vector to-vector look-vector num-steps)
  ;; return a function that interpolates a path which is stepped over
  ;; mutating the arrow depending on the frame.
  (if (< num-steps 0) (raise "num-steps must be greater than 0"))
  (let* ((cur-step 0)
         (cam (get-camera))         
         ;; generate a list of positions which will be indexed by the current
         ;; step.
         (positions (interpolate-vectors from-vector to-vector num-steps)))
    (lambda ()
      ;; grab the first position and put the camera there.
      (set-camera-pos! cam (car positions))
      ;; drop the first position off the list.    
      (set! positions (cdr positions))
      ;; aim the camera 
      (set-camera-look! cam look-vector)
      ;; return true when positions empty    
      ;; this indicates when the easing computation is done.
      (null? positions))))


(define (add-coordinate-system)
  (let ((arr (mk-arrow (mk-vector 10 0 0) (mk-vector -100 0 0) 0xFFAAAA)))
    (set-arrow-len! arr 1000)
    (scene-add arr))
  (let ((arr (mk-arrow (mk-vector 0 10 0) (mk-vector 0 -100 0) 0xAAFFAA)))
    (set-arrow-len! arr 1000)
    (scene-add arr))
  (let ((arr (mk-arrow (mk-vector 0 0 10) (mk-vector 0 0 -100) 0xAAAAFF)))
    (set-arrow-len! arr 1000)
    (scene-add arr)))

(define (gram-schmidt)
  (add-coordinate-system)  
  (define num-steps 75)
  
  (let ((red-arrow (add-fat-arrow color-red))
        (green-arrow (add-fat-arrow color-green))
        (blue-arrow (add-fat-arrow color-blue)))

    (fat-arrow-update red-arrow (mk-vector 1 0 0) (mk-vector 5 0 0))
    (fat-arrow-update green-arrow (mk-vector 0 1 0) (mk-vector 0 5 0))
    (fat-arrow-update blue-arrow (mk-vector 0 0 1) (mk-vector 0 0 5))
    
    ((sequence-animators
      (list (ease-camera-from-to (mk-vector 10 0 0) (mk-vector 10 10 0) (mk-vector 0 0 0) num-steps)
            (ease-camera-from-to (mk-vector 10 10 0) (mk-vector 10 10 10) (mk-vector 0 0 0) num-steps)
            (ease-camera-from-to (mk-vector 10 10 10) (mk-vector 10 0 10) (mk-vector 0 0 0) num-steps)
            (ease-camera-from-to (mk-vector 10 0 10) (mk-vector 10 0 0) (mk-vector 0 0 0) num-steps)
            (ease-camera-from-to (mk-vector 10 0 10) (mk-vector 10 4 10) (mk-vector 0 0 0) num-steps))))))
  ;;;;
  

(console-log "finished")

(gram-schmidt)


