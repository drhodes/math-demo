(load "wrapper.scm")

;; -----------------------------------------------------------------------------
;;
;;  ██████   ██████   █████████   ███████████ █████   █████
;; ░░██████ ██████   ███░░░░░███ ░█░░░███░░░█░░███   ░░███ 
;;  ░███░█████░███  ░███    ░███ ░   ░███  ░  ░███    ░███ 
;;  ░███░░███ ░███  ░███████████     ░███     ░███████████ 
;;  ░███ ░░░  ░███  ░███░░░░░███     ░███     ░███░░░░░███ 
;;  ░███      ░███  ░███    ░███     ░███     ░███    ░███ 
;;  █████     █████ █████   █████    █████    █████   █████
;; ░░░░░     ░░░░░ ░░░░░   ░░░░░    ░░░░░    ░░░░░   ░░░░░ 

;;  ██████████   ██████████ ██████   ██████    ███████     
;; ░░███░░░░███ ░░███░░░░░█░░██████ ██████   ███░░░░░███   
;;  ░███   ░░███ ░███  █ ░  ░███░█████░███  ███     ░░███  
;;  ░███    ░███ ░██████    ░███░░███ ░███ ░███      ░███  
;;  ░███    ░███ ░███░░█    ░███ ░░░  ░███ ░███      ░███  
;;  ░███    ███  ░███ ░   █ ░███      ░███ ░░███     ███   
;;  ██████████   ██████████ █████     █████ ░░░███████░    
;; ░░░░░░░░░░   ░░░░░░░░░░ ░░░░░     ░░░░░    ░░░░░░░      
;;
;;                             NERD AMBASSADORS!
;; 

(console-log "starting demo")

(define (is-cmd? cmd symb) (eq? symb (car cmd)))
(define (add-state-cmd? cmd) (is-cmd? cmd 'add-state))
(define (add-arrow-cmd? cmd) (is-cmd? cmd 'add-arrow))
(define (sum-arrows-cmd? cmd) (is-cmd? cmd 'sum-arrows))

;; ------------------------------------------------------------------
;; some global mutable state for the demo, egads. it might get nasty.
;;

(define DEMO-STATE (js-obj "arrows" (js-obj)))

(define (get-arrow-store) (js-ref DEMO-STATE "arrows"))
(define (put-arrow symb arr) (js-set! (get-arrow-store) (symbol->string symb) arr))

;; (define (get-arrow symb)
;;   (let ((store (get-arrow-store)))
;;     (if (eq? undf))))

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


(define (eval-cmd cmd)
  ;;(console-log (format "running command: ~a" (car cmd)))
  (cond
   ;; add a state to the demo, these appear in the demo in the order they are added.
   ;; (add-state-cmd? cmd) (eval-add-state cmd)
   
   ;; add arrow to scene.
   ((add-arrow-cmd? cmd) (eval-add-arrow cmd))
   ;;((sum-arrows-cmd? cmd) (eval-sum-arrows cmd))

   
   
   (else (console-log "eval-cmd found a bad command"))
   ))

(define (run-demo cmds) (map eval-cmd cmds))

(animate)

(run-demo
 '(;; demo gram-schmidt.
   
   (add-arrow red   (0 0 0) (1 0 0) 0xFF0000)
   (add-arrow green (0 0 0) (0 1 0) 0x00FF00)
   (add-arrow blue  (0 0 0) (0 0 1) 0x0000FF)
   
   ;; (add-state 'start-state "\[x = {-b \pm \sqrt{b^2-4ac} \over 2a}.\]")   
   (camera-to (0 0 0))
   
   ;;(sum-arrows red green blue)
   ;;(camera-to )
   ;; 
   ))

;; (define (gram-schmidt)
;;   (define red-arrow   (mk-arrow (mk-vector 1 0 0) (mk-vector 0 0 0) 0xFF0000))
;;   (define green-arrow (mk-arrow (mk-vector 0 1 0) (mk-vector 0 0 0) 0x00FF00))
;;   (define blue-arrow  (mk-arrow (mk-vector 0 0 1) (mk-vector 0 0 0) 0x0000FF))

  
  
;;   )


;; TESTING ------------------------------------------------------------------
;;;;;

(define (test-put-arrow-1)
  (put-arrow 'a1 (mk-arrow (mk-vector 1 0 0)
                           (mk-vector 0 0 0)
                           0x0000FF))
  (console-log DEMO-STATE)
  )
 '(test-put-arrow-1)


;; (define scene (js-new "THREE.Scene"))
;; (set-scene-background (mk-color 0xFFFFFF))

;; (define camera (js-new "THREE.PerspectiveCamera"
;;                        75   ;; something
;;                        1    ;; aspect ratio
;;                        0.1  ;; near plane
;;                        1000 ;; far plane
;;                        ))

;; (define renderer (js-new "THREE.WebGLRenderer"))

;; (define geometry (js-new "THREE.WireframeGeometry"
;;                          (js-new "THREE.SphereGeometry" 5 32 32)))

;; (define material (js-new "THREE.MeshBasicMaterial" (mk-color 0xffffff)))

;; (mesh-basic-material (mk-color 0xffffff))

;; (set-camera-pos-z camera 10)
