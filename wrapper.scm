;; Some wrappers around three.js objects.

(define (set-camera-pos-x camera x) (js-call (js-eval "setCameraPosX") camera x))
(define (set-camera-pos-y camera y) (js-call (js-eval "setCameraPosY") camera y))
(define (set-camera-pos-z camera z) (js-call (js-eval "setCameraPosZ") camera z))

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

;; vector
(define (mk-vector x y z) (js-new "THREE.Vector3" x y z))

(define (scene-add obj) (js-call (js-eval "_scene_add") obj))

(define (animate) (js-call (js-eval "_animate")))

;; utility
(define (caddddr xs) (car (cdr (cdr (cdr (cdr xs))))))
