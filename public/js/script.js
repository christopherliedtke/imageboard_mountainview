(function() {
    new Vue({
        el: '#main',
        data: {
            images: [],
            title: null,
            description: null,
            username: null,
            tags: null,
            file: null,
            currentImageId: null,
            currentTag: null,
            hideLoadMoreButton: false
        },
        mounted: function() {
            if (!isNaN(parseInt(location.hash.slice(1), 10))) {
                this.currentImageId = location.hash.slice(1);
                this.getImages();
            } else if (location.hash) {
                this.currentTag = location.hash.slice(1);
                this.currentImageId = null;
                this.getImagesByTag();
            } else {
                this.getImages();
            }

            var self = this;
            addEventListener('hashchange', function() {
                if (!isNaN(parseInt(location.hash.slice(1), 10))) {
                    self.currentImageId = location.hash.slice(1);
                } else if (location.hash) {
                    self.currentImageId = null;
                    self.hideLoadMoreButton = false; // !to be checked

                    var oldCurrentTag = self.currentTag;
                    self.currentTag = location.hash.slice(1);
                    if (oldCurrentTag != self.currentTag) {
                        self.getImagesByTag();
                    }
                } else if (self.currentTag === 'deleteTag') {
                    self.currentTag = null;
                    self.hideLoadMoreButton = false;
                    self.getImages();
                }
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
                            if (!self.currentTag || self.tags.includes(self.currentTag)) {
                                self.images.unshift(res.data);
                            }

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
            closeModal: function() {
                location.hash = this.currentTag || '';
                this.currentImageId = null;

                if (!location.hash) {
                    history.replaceState(null, null, ' ');
                }

                document.querySelector('body').classList.remove('modal-open');
            },
            nextImage: function(nextId) {
                location.hash = nextId;
            },
            prevImage: function(prevId) {
                location.hash = prevId;
            },
            getImages: function() {
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
            loadMore: function() {
                var self = this;
                var reqUrl = '';
                var reqParams = {
                    params: {
                        lastImageId: self.images[self.images.length - 1].id
                    }
                };

                if (self.currentTag) {
                    reqUrl = '/moreImagesByTag';
                    reqParams.params.tag = self.currentTag;
                } else {
                    reqUrl = '/moreImages';
                }

                axios
                    .get(reqUrl, reqParams)
                    .then(function(res) {
                        self.images = self.images.concat(res.data);

                        if (res.data[res.data.length - 1].lowestId === self.images[self.images.length - 1].id) {
                            self.hideLoadMoreButton = true;
                        }
                    })
                    .catch(function(err) {
                        console.log('Error in GET', reqUrl, err);
                    });
            },
            getImagesByTag: function() {
                var self = this;

                axios
                    .get('/imagesByTag', {
                        params: {
                            tag: self.currentTag
                        }
                    })
                    .then(function(payload) {
                        self.images = payload.data;
                        if (payload.data[payload.data.length - 1].lowestId === self.images[self.images.length - 1].id) {
                            self.hideLoadMoreButton = true;
                        }
                    })
                    .catch(function(err) {
                        console.log('Error in GET to /images: ', err);
                    });
            },
            removeCurrentTag: function() {
                this.currentTag = 'deleteTag';
                location.hash = null;
                history.replaceState(null, null, ' ');
            }
        }
    });
})();
