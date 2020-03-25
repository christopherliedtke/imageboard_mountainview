Vue.component('image-modal', {
    template: '#modal',
    props: ['id'],
    data: function() {
        return {
            title: '',
            description: '',
            username: '',
            url: '',
            timeStamp: ''
        };
    },
    mounted: function() {
        var self = this;

        axios
            .get('/image?id=' + self.id)
            .then(function(payload) {
                console.log('payload: ', payload);
                self.title = payload.data.title;
                self.description = payload.data.description;
                self.username = payload.data.username;
                self.url = payload.data.url;
                self.timeStamp = payload.data['created_at'].replace(/[a-zA-Z]/g, ' ').substring(0, 16);
            })
            .catch(function(err) {
                console.log('Error in GET to /image: ', err);
            });
    },
    methods: {
        closeModal: function() {
            this.$emit('close');
        }
    }
});
