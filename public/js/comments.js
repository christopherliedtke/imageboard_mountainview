Vue.component('comments-modal', {
    template: '#comments',
    props: ['id', 'newComment'],
    data: function() {
        return {
            comments: []
        };
    },
    mounted: function() {
        this.getComments();
    },
    watch: {
        newComment: function(newVal, oldVal) {
            if (newVal != oldVal) {
                if (this.newComment.username && this.newComment.comment) {
                    this.comments.push(this.newComment);
                }
            }
        },
        id: function() {
            this.getComments();
        }
    },
    methods: {
        getComments: function() {
            var self = this;
            axios
                .get('/comments?id=' + self.id)
                .then(function(payload) {
                    self.comments = payload.data;

                    for (var i = 0, arrLength = self.comments.length; i < arrLength; i++) {
                        self.comments[i]['created_at'] = self.comments[i]['created_at'].replace(/[a-zA-Z]/g, ' ').substring(0, 16);
                    }
                })
                .catch(function(err) {
                    console.log('Error in GET to /comments: ', err);
                });
        }
    }
});
