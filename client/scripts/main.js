const baseURL = "http://localhost:3000"

new Vue({
  el: '#app',
  components: {
  },
  data: {
    searchInput: "",
    articleTitle: "",
    articleContent: "",
    articleIdUpdate: "",
    articleFeaturedImage: "",
    editedArticleId: "",
    articleTitleUpdate: "",
    articleContentUpdate: "",
    formData: {},
    articles: [],
    dialog: false,
    showBlogPostsPage: true,
    updateAnArticleModal: false,
    showCreateArticleForm: false,
    token: localStorage.getItem("token"),
  },

  components: {
    wysiwyg: vueWysiwyg.default.component,
  },

  created() {
    this.clearAllForms()
    this.getAllArticles()
  },

  mounted() {
    gapi.signin2.render('google-signin-btn', {
      onsuccess: this.onSignIn
    })
  },

  computed: {
    searchArticleByTitle: function() {
      return this.articles.filter(article =>
        article.title.toLowerCase().match(this.searchInput.toLowerCase())
      )
    },
  },

  methods: {
    getAllArticles() {
      axios.get(`${baseURL}/articles`, {
        headers: {
          authentication: this.token
        }
      })
      .then(({ data }) => {
        data = data.sort(function(a, b) {
          return new Date(b.created_at) - new Date(a.created_at)
        })
        this.articles = data
      })
      .catch(err => {
        console.log(err);
      })
    },

    submitArticle() {
      axios.post(`${baseURL}/articles`, this.formData, {
        headers: {
          authentication: this.token,
          "Content-Type": "multipart/form-data"
        }
      })
      .then(({ data }) => {
        this.clearAllForms()
        this.showCreateArticleForm = false
        this.articles.unshift(data)
      })
      .catch(err => {
        this.clearAllForms()
        console.log(err);
      })
    },

    clearArticleForm() {
      this.articleTitle = ''
      this.articleContent = ''
    },

    deleteAnArticle(articleId, userId) {
      Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this.",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      }).then((result) => {
        if (result.value) {
          return axios.delete(`${baseURL}/articles/${articleId}`, {
            headers: {
              authentication: this.token,
              authorization: userId
            }
          })
        }
      })
      .then(() => {
        Swal.fire(
          'Deleted!',
          'Your file has been deleted.',
          'success'
        )
        return axios.get(`${baseURL}/articles`)
      })
      .then(({ data }) => {
        data = data.sort(function(a, b) {
          return new Date(b.created_at) - new Date(a.created_at)
        })
        this.articles = data
      })
      .catch(err => {
        console.log(err);
      })
    },

    updateAnArticle(articleId, userId) {
      axios.patch(`${baseURL}/articles/${articleId}`, {
        title: this.articleTitleUpdate,
        content: this.articleContentUpdate,
        featured_image: this.articleFeaturedImage,
      }, {
        headers: {
          authentication: this.token,
          authorization: userId
        }
      })
      .then(() => {
        Swal.fire(
          'Updated!',
          'Your file has been deleted.',
          'success'
        )
        this.articleTitleUpdate = ""
        this.articleContentUpdate = ""
        this.articleIdUpdate = ""
        this.updateAnArticleModal = false
        this.showCreateArticleForm = false
        return axios.get(`${baseURL}/articles`)
      })
      .then(({ data }) => {
        data = data.sort(function(a, b) {
          return new Date(b.created_at) - new Date(a.created_at)
        })
        this.articles = data
      })
      .catch(err => {
        console.log(err);
      })
    },

    onSignIn(googleUser) {
      var idToken = googleUser.getAuthResponse().id_token;
      console.log(idToken);

      axios.post(`${baseURL}/users/google-sign-in`, {
        idToken
      })
      .then(({ data }) => {
        localStorage.setItem("token", data.token)
        localStorage.setItem("id", data.id)
        localStorage.setItem("name", data.name)
        localStorage.setItem("authMethod", "google")

        Swal.fire({
          type: "success",
          title: `Welcome, ${localStorage.getItem("name")}!`,
          showConfirmButton: false,
          timer: 1500
        })
      })
      .catch(err => {
        console.log(err);
      })
    },

    signOut() {
      // var auth2 = gapi.auth2.getAuthInstance();
      // auth2.signOut().then(function () {
      //   console.log('User signed out.');
      // });
      this.token = null

      localStorage.clear()
    },

    obtainImage(fieldName, fileList) {
      console.log(fileList, "<= fileList");
      const formData = new FormData();
      if (!fileList.length) return;
      Array
      .from(Array(fileList.length).keys())
      .map(x => {
        // formData.append(fieldName, fileList[x], fileList[x].name);
        formData.append("image", fileList[x])
      });

    // articleTitle: "",
    // articleContent: "",

      formData.set('title', this.articleTitle);
      formData.set("content", this.articleContent)
      console.log(formData.get("title"), "<= formData");
      this.formData = formData
    },

    clearAllForms() {
      this.searchInput = ""
      this.articleTitle = ""
      this.articleContent = ""
      this.articleIdUpdate = ""
      this.articleFeaturedImage = ""
      this.editedArticleId = ""
      this.articleTitleUpdate = ""
      this.articleContentUpdate = ""
    }
  }
})