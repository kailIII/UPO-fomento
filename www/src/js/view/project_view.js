app.view.Project = Backbone.View.extend({
    _template : _.template( $('#project_template').html() ),
    
    initialize: function() {
    	app.events.trigger("menu", 3);
        this.render();
    },
    
    events:{
    	"click .participantesTitle": "showParticipants"
    },

    showParticipants: function() {
        if($(".participantes").is(":visible")){
            $(".participantes").slideUp();
        }else{
            $(".participantes").slideDown();

            setTimeout(function(){
                $('html, body').animate({scrollTop:document.body.scrollHeight}, 'slow');
            }, 100);
        }
    },
    
    onClose: function(){
        // Remove events on close
        this.stopListening();
    },
    
    render: function() {
        this.$el.html(this._template());
        return this;
    }
    
});



