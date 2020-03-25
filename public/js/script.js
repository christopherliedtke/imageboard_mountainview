(function() {
    new Vue({
        el: '#main',
        data: {
            images: [],
            title: '',
            description: '',
            username: '',
            file: null,
            currentImageId: null
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
                    formData.append('file', this.file);

                    axios
                        .post('/upload', formData)
                        .then(function(res) {
                            self.images.unshift(res.data);
                            self.title = '';
                            self.description = '';
                            self.username = '';
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
            openModal: function(imageId) {
                this.currentImageId = imageId;
            },
            closeModal: function() {
                this.currentImageId = null;
            }
        }
    });
})();
