Vue.component('new-comment-modal', {
    template: '#new-comment',
    props: ['id'],
    data: function() {
        return {
            username: '',
            comment: '',
            timeStamp: null
        };
    },
    mounted: function() {},
    methods: {
        submit: function(e) {
            e.preventDefault();
            var self = this;

            axios
                .post('/addComment', { username: self.username, comment: self.comment, id: self.id })
                .then(function(res) {
                    self.timeStamp = res.data['created_at'].replace(/[a-zA-Z]/g, ' ').substring(0, 16);
                    self.$emit('submit', { username: self.username, comment: self.comment, created_at: self.timeStamp });
                    self.username = '';
                    self.comment = '';
                    self.timeStamp = null;
                })
                .catch(function(err) {
                    console.log('Error in POST /addComment: ', err);
                });
        }
    }
});
