;; Some wrappers around three.js objects.

(define (set-camera-pos-x! camera x) (js-call (js-eval "setCameraPosX") camera x))
(define (set-camera-pos-y! camera y) (js-call (js-eval "setCameraPosY") camera y))
(define (set-camera-pos-z! camera z) (js-call (js-eval "setCameraPosZ") camera z))

(define (get-camera-pos-x camera) (js-call (js-eval "getCameraPosX") camera))
(define (get-camera-pos-y camera) (js-call (js-eval "getCameraPosY") camera))
(define (get-camera-pos-z camera) (js-call (js-eval "getCameraPosZ") camera))
(define (get-camera-pos camera) (js-ref camera "position"))
;;(define (set-camera-pos! camera vec) (js-set! camera "position" vec))
(define (set-camera-pos! camera vec)
  (set-camera-pos-x! camera (vec-x vec))
  (set-camera-pos-y! camera (vec-y vec))
  (set-camera-pos-z! camera (vec-z vec)))

(define (set-camera-look! camera vector) (js-invoke camera "lookAt" vector))


(define (mk-color hex) (js-obj "color" hex))

(define (mesh-basic-material color)
  (js-new "THREE.MeshBasicMaterial" color))

;; SCENE
(define (set-scene-prop p x) (js-set! scene p x))
(define (set-scene-background color) (set-scene-prop "background" color))
(define (scene-add! scene obj) (js-invoke scene "add" obj))

;; renderer
(define (mk-renderer) (js-new "THREE.WebGLRenderer"))
(define (set-renderer-size! w h) (js-invoke renderer "setSize" w h))

;; arrow
(define (mk-arrow dir       ; vector
                  origin    ; vector
                  hex-color ; color
                  )
  (js-call (js-eval "Arrow") dir origin hex-color))

(define (normalize-vector! vec)
  (js-invoke vec "normalize"))

(define (set-arrow-dir! arrow dir)
  (normalize-vector! dir)
  (js-invoke arrow "setDirection" dir))


;; vector
(define (mk-vector x y z) (js-new "THREE.Vector3" x y z))

(define (vec-x vec) (js-ref vec "x"))
(define (vec-y vec) (js-ref vec "y"))
(define (vec-z vec) (js-ref vec "z"))

;; utility
(define (caddddr xs) (car (cdr (cdr (cdr (cdr xs))))))
(define (get-current-frame) (js-eval "FRAME"))


(define (neq? x y) (not (eq? x y)))

(define (random) (js-call (js-eval "Math.random")))

;; animators

;; TODO document this name
(define (mk-animator f)
  (js-call (js-eval "_make_animator") f))


;; kick off the global rendering, this should not be called more than
;; once, because then there will be two render loops going.

(define (animate) (js-call (js-eval "_animate")))



;; camera
(define (get-camera) (js-eval "camera"))

;; (define (set-camera-zoom! cam zoom-level)
;;   (console-log "ok")
;;   ;;(js-invoke cam "zoom" zoom-level)
;;   )


(define (set-camera-position! cam v) (js-set! (js-eval "camera.position") "set" v))


;; scene
(define (scene-add obj) (js-call (js-eval "_scene_add") obj))
