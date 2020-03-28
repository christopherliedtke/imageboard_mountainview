Vue.component('image-modal', {
    template: '#modal',
    props: ['id'],
    data: function() {
        return {
            title: null,
            description: null,
            username: null,
            url: null,
            timeStamp: null,
            tags: null,
            prevId: null,
            nextId: null,
            newComment: {}
        };
    },
    mounted: function() {
        this.getImage();
    },
    watch: {
        id: function() {
            this.getImage();
        }
    },
    methods: {
        closeModal: function() {
            this.$emit('close');
        },
        addComment: function(commentObj) {
            this.newComment = commentObj;
        },
        getImage: function() {
            var self = this;

            Promise.all([
                axios
                    .get('/image?id=' + self.id)
                    .then(function(payload) {
                        if (!payload.data) {
                            self.$emit('close');
                        } else {
                            self.title = payload.data.title;
                            self.description = payload.data.description;
                            self.username = payload.data.username;
                            self.url = payload.data.url;
                            self.timeStamp = payload.data['created_at'].replace(/[a-zA-Z]/g, ' ').substring(0, 16);

                            self.prevId = payload.data.prevId;
                            self.nextId = payload.data.nextId;
                        }
                    })
                    .catch(function(err) {
                        self.$emit('close');
                        console.log('Error in GET to /image: ', err);
                    }),
                axios
                    .get('/tags', {
                        params: {
                            imageId: self.id
                        }
                    })
                    .then(function(payload) {
                        self.tags = payload.data;
                    })
                    .catch(function(err) {
                        console.log('Error in GET to /tags: ', err);
                    })
            ]);
        },
        nextImage: function() {
            this.$emit('next', this.nextId);
        },
        prevImage: function() {
            this.$emit('prev', this.prevId);
        }
    }
});
