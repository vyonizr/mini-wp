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
    articleAuthorId: "",
    articleOnDetailedModal: {},
    signUpEmailInput: "",
    signUpNameInput: "",
    signUpPasswordInput: "",
    signInEmailInput: "",
    signInPasswordInput: "",
    emailInputRules: [
      v => !!v || 'E-mail is required',
      v => /.+@.+/.test(v) || 'E-mail must be valid'
    ],
    nameInputRules: [
      v => !!v || 'Name is required',
    ],
    passwordRules: [
      v => !!v || 'Password is required',
    ],
    formData: new FormData(),
    articles: [],
    validSignUp: true,
    validSignIn: true,
    showBlogPostsPage: true,
    createAnArticleModal: false,
    showMyPostsPage: false,
    updateAnArticleModal: false,
    showDetailedArticleModal: false,
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

    if(gapi.auth2) {
      gapi.load('auth2', function() {
        gapi.auth2.init();
      });
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
    }
  },

  methods: {
    validate () {
      if (this.$refs.form.validate()) {
        this.snackbar = true
      }
    },

    getAllArticles() {
      axios.get(`${baseURL}/articles`, {
        headers: {
          authentication: this.token
        }
      })
      .then(({ data }) => {
        this.articles = data
      })
      .catch(err => {
        console.log(err);
      })
    },

    getOwnedArticles() {
      axios.get(`${baseURL}/articles/${localStorage.getItem("id")}`, {
        headers: {
          authentication: this.token
        }
      })
      .then(({ data }) => {
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
        Swal.fire({
          position: 'top-end',
          type: 'success',
          title: 'Article published',
          showConfirmButton: false,
          timer: 1200
        })
        this.clearAllForms()
        this.showCreateArticleForm = false
        // this.articles.unshift(data)
        this.getAllArticles()
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

    deleteAnArticle(objArticle) {
      const swalWithVuetifyButtons = Swal.mixin({
        customClass: {
          confirmButton: 'v-btn theme--light error',
          cancelButton: 'v-btn outline'
        },
        buttonsStyling: false,
      })
// objArticle
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
          'Article has been deleted',
          'success'
          )
          return axios.delete(`${baseURL}/articles/${objArticle.articleId}`, {
            headers: {
              authentication: this.token,
              authorization: objArticle.userId
            }
          })
        }
      })
      .then(() => {
        this.getAllArticles()
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
          authorization: this.articleAuthorId,
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
        this.articles = data
      })
      .catch(err => {
        console.log(err);
      })
    },

    signUp() {
      axios.post(`${baseURL}/users/register`, {
        email: this.signUpEmailInput,
        name: this.signUpNameInput,
        password: this.signUpPasswordInput
      })
      .then(({ data }) => {
        Swal.fire({
          type: 'success',
          title: 'Way to go',
        })
        this.showSignUpForm = false;
        this.showSignInForm = true;
        this.clearAllForms()
      })
      .catch(err => {
        this.clearAllForms()
        if (err.response.data) {
          Swal.fire({
            type: "error",
            text: "Please fill in all fields"
          })
        }
        console.log(err.response.data, "<= error register");
      })
    },

    signIn() {
      axios.post(`${baseURL}/users/login`, {
        email: this.signInEmailInput,
        password: this.signInPasswordInput
      })
      .then(({ data }) => {
        this.showSignInForm = false;
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
        this.name = localStorage.getItem("name");
        this.getAllArticles()
      })
      .catch((err) => {
        this.clearAllForms()
        Swal.fire({
          type: "error",
          text: `${err.response.data.message}`,
          showConfirmButton: false,
          timer: 1500
        })

        console.log(Object.keys(err), "<= error login");
        console.log(err.response.data.message, "<= error login");
      })
    },

    onSignIn(googleUser) {
      gapi.load('auth2', function() {
        gapi.auth2.init();
      });

      let idToken = googleUser.getAuthResponse().id_token;

      axios.post(`${baseURL}/users/google-sign-in`, {
        idToken
      })
      .then(({ data }) => {
        this.showSignInForm = false;
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
        this.name = localStorage.getItem("name");
        this.getAllArticles()
      })
      .catch(err => {
        console.log(err);
      })
    },

    signOut() {
      this.clearCredentials()
      if (gapi) {
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
      this.name = null,
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
      this.signInEmailInput = ""
      this.signUpPasswordInput = ""
      this.formData = new FormData()
    },

    toggleDetailedArticleModal(articleOnDetailedModal) {
      console.log("listened");
      this.showDetailedArticleModal = !this.showDetailedArticleModal
      this.articleOnDetailedModal = articleOnDetailedModal
    },
    toggleUpdateArticleModal (article) {
      this.updateAnArticleModal = !this.updateAnArticleModal
      this.articleTitleUpdate = article.title;
      this.articleContentUpdate = article.content;
      this.articleIdUpdate = article._id;
      this.articleAuthorId = article.author._id
    },
    parseDate(date) {
      return moment(date).calendar();
    }
  }
})