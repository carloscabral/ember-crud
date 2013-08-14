App.DraggableView = Em.View.extend({

    // touch gestures properties
    startX      : 0,
    dist        : 0,
    active      : null,
    maxDist     : 250,
    threshold   : 40,
    activeWidth : null,

    touchStart: function(event){
        var touchEvent = event.originalEvent.changedTouches[0];
        var layer = $(touchEvent.target).closest('.pane')[0];
        if (layer) {
            this.active = layer;
            this.onStart(event, touchEvent);
            this.activeWidth = $('.pane').outerWidth();
            this.active.style.webkitTransform = 'translate3d(' + (-this.activeWidth) + 'px, 0, 0)';
        }
    },

    touchMove: function(event){
        event.preventDefault();
        if (!this.active) return;
        this.onMove(event, event.originalEvent.changedTouches[0]);
    },

    touchEnd: function(event){
        if (!this.active) return;
        this.onEnd(event);
    },

    onStart: function(e,d) {
        e.stopPropagation();
        this.startX = d.pageX;
        this.active.classList.add('drag');
    },

    onMove: function(e,d) {
        e.stopPropagation();
        this.dist = (d.pageX - this.startX) / 2;

        // drag ⇚
        if (this.dist > 0) { 
            this.active.style.webkitTransform = 'translate3d(' + (-this.activeWidth + this.dist) + 'px, 0, 0)';
        } 
        // drag ⇛
        else { 
            this.active.style.webkitTransform = 'translate3d(' + (-this.activeWidth + this.dist) + 'px, 0, 0)';
        }
    },

    onEnd: function(e) {
        e.stopPropagation();
        this.active.classList.remove('drag');

        // dragged ⇛
        if (this.dist >= this.threshold) { 
            //console.log('⇛');
            this.active.classList.remove('active');
            this.active.classList.add('slide-from-left-to-right');
            
            Em.run.later(this, function(){
                // there is no customTransitionTo in the controller so it will bubble up to routes
                // the customTransitionTo event is located in the ApplicationRoute
                this.get('controller').send('goBack');
            }, 600);
        }
        // cancel
        /*else if (this.dist > -this.threshold && this.dist < this.threshold) { 
            // no need to do anything in this case
        }*/
        // dragged ⇚
        else { 
            //console.log('⇚');
            this.active.classList.add('slide-from-right-to-left');
        }

        this.dist = 0;
        this.active = null;
    }
});