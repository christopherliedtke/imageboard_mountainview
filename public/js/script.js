(function() {
    new Vue({
        el: '#main',
        data: {
            images: [],
            title: '',
            description: '',
            username: '',
            tags: '',
            file: null,
            currentImageId: null,
            currentTag: null,
            deleteTag: false,
            hideLoadMoreButton: false,
            newImage: false,
            // searchTerm: '',
            checkTimeoutId: null
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
                    clearTimeout(this.checkTimeoutId);
                    self.currentImageId = location.hash.slice(1);
                } else if (location.hash) {
                    clearTimeout(this.checkTimeoutId);
                    self.currentImageId = null;
                    self.hideLoadMoreButton = false; // !to be checked

                    var oldCurrentTag = self.currentTag;
                    self.currentTag = location.hash.slice(1);
                    if (oldCurrentTag != self.currentTag) {
                        self.getImagesByTag();
                    }
                } else if (self.deleteTag === true) {
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
                    clearTimeout(this.checkTimeoutId);

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
                            self.tags = '';
                            self.file = null;
                            self.newImage = false;
                            spinner.classList.add('hide');
                            fileLabel.classList.remove('uploaded', 'error');
                            fileLabel.innerHTML = 'Choose file';

                            setTimeout(self.checkForNewImages, 10000);
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
                        self.newImage = false;

                        if (payload.data[payload.data.length - 1].lowestId === self.images[self.images.length - 1].id) {
                            self.hideLoadMoreButton = true;
                        }

                        setTimeout(self.checkForNewImages, 10000);
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
                this.currentTag = null;
                this.deleteTag = true;
                location.hash = null;
                history.replaceState(null, null, ' ');
            },
            reloadImages: function() {
                this.getImages();
                clearTimeout(this.checkTimeoutId);
            },
            checkForNewImages: function() {
                var self = this;
                var newestImageId = self.images[0].id;

                self.checkTimeoutId = setTimeout(() => {
                    axios
                        .get('/getHighestImageId')
                        .then(function(response) {
                            if (response.data.id != newestImageId) {
                                self.newImage = true;
                            } else {
                                self.newImage = false;
                            }

                            self.checkForNewImages();
                        })
                        .catch(function(err) {
                            console.log('Error in GET to /getHighestImageId: ', err);
                        });
                }, 5000);
            }
            // search: function() {
            //     var self = this;

            //     axios
            //         .get('/imagesBySearchterm', {
            //             params: {
            //                 q: self.searchTerm
            //             }
            //         })
            //         .then(function(payload) {
            //             alert('test');
            //             self.images = payload.data;
            //             console.log('self.images: ', self.images);

            //             if (payload.data[payload.data.length - 1].lowestId === self.images[self.images.length - 1].id) {
            //                 self.hideLoadMoreButton = true;
            //             }
            //         })
            //         .catch(function(err) {
            //             console.log('Error in GET to /imagesBySearchterm: ', err);
            //         });
            // }
        }
    });
})();
