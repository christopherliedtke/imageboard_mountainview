(function() {
    new Vue({
        el: '#main',
        data: {
            images: [],
            title: '',
            description: '',
            username: '',
            tags: null,
            file: null,
            currentImageId: location.hash.slice(1),
            hideLoadMoreButton: false
        },
        mounted: function() {
            var self = this;
            axios
                .get('/images')
                .then(function(payload) {
                    self.images = payload.data;
                })
                .catch(function(err) {
                    console.log('Error in GET to /images: ', err);
                });

            addEventListener('hashchange', function() {
                self.currentImageId = location.hash.slice(1);
            });
        },
        methods: {
            handleClick: function(e) {
                e.preventDefault();
                var self = this;
                var spinner = document.getElementById('button-spinner');
                var fileLabel = document.getElementById('file-label');

                if (this.file) {
                    spinner.classList.remove('hide');

                    var formData = new FormData();
                    formData.append('title', this.title);
                    formData.append('description', this.description);
                    formData.append('username', this.username);
                    formData.append('tags', this.tags);
                    formData.append('file', this.file);

                    axios
                        .post('/upload', formData)
                        .then(function(res) {
                            self.images.unshift(res.data);
                            self.title = '';
                            self.description = '';
                            self.username = '';
                            self.tags = null;
                            self.file = null;
                            spinner.classList.add('hide');
                            fileLabel.classList.remove('uploaded');
                            fileLabel.innerHTML = 'Choose file';
                        })
                        .catch(function(err) {
                            console.log('Error in POST /upload: ', err);
                        });
                } else {
                    fileLabel.classList.add('error');
                }
            },
            handleChange: function(e) {
                var fileLabel = document.getElementById('file-label');

                this.file = e.target.files[0];
                if (this.file) {
                    fileLabel.classList.add('uploaded');
                    fileLabel.innerHTML = 'Ready';

                    if (fileLabel.classList.contains('error')) {
                        fileLabel.classList.remove('error');
                    }
                } else {
                    fileLabel.classList.remove('uploaded');
                    fileLabel.innerHTML = 'Choose file';
                }
            },
            // openModal: function(imageId) {
            //     this.currentImageId = imageId;
            //     document.querySelector('body').classList.add('modal-open');
            // },
            closeModal: function() {
                this.currentImageId = null;
                location.hash = null;
                history.replaceState(null, null, ' ');
                document.querySelector('body').classList.remove('modal-open');
            },
            nextImage: function(nextId) {
                location.hash = nextId;
            },
            prevImage: function(prevId) {
                location.hash = prevId;
            },
            loadMore: function() {
                var self = this;
                var lastImageId = self.images[self.images.length - 1].id;

                axios
                    .get('/moreImages', {
                        params: {
                            lastImageId
                        }
                    })
                    .then(function(res) {
                        self.images = self.images.concat(res.data);

                        if (res.data[res.data.length - 1].lowestId === self.images[self.images.length - 1].id) {
                            self.hideLoadMoreButton = true;
                        }
                    })
                    .catch(function(err) {
                        console.log('Error in GET /moreImages: ', err);
                    });
            }
        }
    });
})();
