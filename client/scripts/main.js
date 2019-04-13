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
    articleTitleUpdate: "",
    articleContentUpdate: "",
    articleUserId: "",
    signUpEmailInput: "",
    signUpNameInput: "",
    signUpPasswordInput: "",
    signInEmailInput: "",
    signInPasswordInput: "",
    formData: {},
    articles: [],
    createAnArticleModal: false,
    showBlogPostsPage: true,
    updateAnArticleModal: false,
    showCreateArticleForm: false,
    showSignUpForm: false,
    showSignInForm: false,
    token: localStorage.getItem("token"),
    name: localStorage.getItem("name")
  },
  // localStorage.getItem("token")

  components: {
    wysiwyg: vueWysiwyg.default.component,
  },

  created() {
    if(localStorage.getItem("token") !== null) {
      this.getAllArticles()
    }
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
      this.formData.set('title', this.articleTitle);
      this.formData.set("content", this.articleContent)

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
      const swalWithVuetifyButtons = Swal.mixin({
        customClass: {
          confirmButton: 'v-btn theme--light error',
          cancelButton: 'v-btn outline'
        },
        buttonsStyling: false,
      })


      swalWithVuetifyButtons.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel',
        confirmButtonColor: "#d9534f"
      })
      .then((result) => {
        console.log(result.value, "<= result value");
        if (result.value) {
          Swal.fire(
          'Deleted!',
          'Your file has been deleted.',
          'success'
          )
          return axios.delete(`${baseURL}/articles/${articleId}`, {
            headers: {
              authentication: this.token,
              authorization: userId
            }
          })
        }
        else {
          return Swal.fire({
            text: "Cancelled",
            type: 'info',
          })
        }
      })
      .then(() => {
        return axios.get(`${baseURL}/articles`, {
          headers: {
            authentication: this.token
          }
        })
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

    updateAnArticle() {
      this.formData.set('title', this.articleTitleUpdate);
      this.formData.set("content", this.articleContentUpdate)

      axios.patch(`${baseURL}/articles/${this.articleIdUpdate}`, this.formData, {
        headers: {
          authentication: this.token,
          authorization: this.articleUserId,
          "Content-Type": "multipart/form-data"
        }
      })
      .then(() => {
        Swal.fire(
          'Updated!',
          'success'
        )
        this.articleTitleUpdate = ""
        this.articleContentUpdate = ""
        this.articleIdUpdate = ""
        this.articleUserId = ""
        this.updateAnArticleModal = false
        this.showCreateArticleForm = false

        return axios.get(`${baseURL}/articles`, {
          headers: {
            authentication: this.token
          }
        })
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

    signUp() {
      console.log("signp");
      axios.post(`${baseURL}/users/register`, {
        email: this.signUpEmailInput,
        name: this.signUpNameInput,
        password: this.signUpPasswordInput
      })
      .then(({ data }) => {
        Swal.fire({
          type: 'success',
          title: 'Way to go!',
        })
        this.clearAllForms()
      })
      .catch(err => {
        console.log(err);
      })
    },

    signIn() {
      axios.post(`${baseURL}/users/login`, {
        email: this.signInEmailInput,
        password: this.signInPasswordInput
      })
      .then(({ data }) => {
        localStorage.setItem("token", data.token)
        localStorage.setItem("id", data.id)
        localStorage.setItem("name", data.name)
        localStorage.setItem("authMethod", "basic")

        Swal.fire({
          type: "success",
          title: `Welcome, ${localStorage.getItem("name")}!`,
          showConfirmButton: false,
          timer: 1500
        })
        this.clearAllForms()
        this.showSignInForm = false;
        this.token = localStorage.getItem("token");
        this
      })
      .catch(err => {
        console.log(err);
      })
    },

    onSignIn(googleUser) {
      let idToken = googleUser.getAuthResponse().id_token;
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

        this.token = localStorage.getItem("token");
      })
      .catch(err => {
        console.log(err);
      })
    },

    signOut() {
      this.clearCredentials()

      if (gapi.auth2) {
        const auth2 = gapi.auth2.getAuthInstance();
        auth2.signOut().then(function () {
          console.log('User signed out.');
        });
      }
    },

    obtainImage(fieldName, fileList) {
      const formData = new FormData();
      if (!fileList.length) return;
      Array
      .from(Array(fileList.length).keys())
      .map(x => {
        // formData.append(fieldName, fileList[x], fileList[x].name);
        formData.append("image", fileList[x])
      });

      this.formData = formData
    },

    clearCredentials() {
      this.token = null,
      localStorage.clear()
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
      this.signUpEmailInput = ""
      this.signUpNameInput = ""
      this.signUpPasswordInput = ""
    }
  }
})