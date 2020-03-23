(function() {
    new Vue({
        el: '#main',
        data: {
            images: []
        },
        mounted: function() {
            var self = this;
            axios.get('/images').then(function(payload) {
                self.images = payload.data;
            });
        },
        methods: {}
    });
})();
