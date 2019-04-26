Vue.component('article-card', {
    props: ["article", "search-input"],
    data() {
      return {
        loggedinId: localStorage.getItem("id"),
        articleOnDetailedModal: {}
      }
    },
    methods: {
      parseDate(date) {
        return moment(date).calendar();
      },
      showDetailedArticleModal(objArticle) {
        this.$emit('toggle-detailed-article-modal', objArticle)
      },
      showUpdateArticleModal(objArticleModal) {
        console.log("invoked");
        this.$emit('toggle-update-article-modal', objArticleModal)
      },
      deleteAnArticle(objArticle) {
        this.$emit('delete-an-article-modal', objArticle)
      }
    },
    template :`
    <div>
    <v-layout>
      <v-flex lg10 md6 class="pt-3 pl-3"
        @click="showDetailedArticleModal({
          title: article.title,
          content: article.content,
          author: article.author.name,
          featured_image: article.featured_image,
          created_at: article.created_at
        });">
          <h4 class="title">{{ article.title }}</h4>
          <p class="body-1">{{ article.author.name }} | {{ parseDate(article.created_at) }}</p>
      </v-flex>
      <v-flex lg2 v-if="loggedinId == article.author._id.toString()">
        <div class="text-xs-center">
          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <v-btn flat icon color="red" v-on="on" @click="deleteAnArticle({
                  articleId: article._id,
                  authorId: article.author._id
                })">
                <v-icon
                  >
                  delete
                </v-icon>
              </v-btn>
            </template>
            <span>Delete</span>
          </v-tooltip>
          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <v-btn flat icon color="blue" v-on="on">
                <v-icon
                  @click="showUpdateArticleModal(article)">
                  edit
                </v-icon>
              </v-btn>
            </template>
            <span>Edit</span>
          </v-tooltip>
        </div>
      </v-flex>
      <v-flex lg2 v-else
        @click="showDetailedArticleModal({
          title: article.title,
          content: article.content,
          author: article.author.name,
          featured_image: article.featured_image,
          created_at: article.created_at
        });"
      />
    </v-layout>

    <v-layout>
      <v-flex lg2 class="pl-3 pb-3 pr-3"
        @click="showDetailedArticleModal({
          title: article.title,
          content: article.content,
          author: article.author.name,
          featured_image: article.featured_image,
          created_at: article.created_at
        });">
        <v-img
          :src="article.featured_image"
          max-height="100"
          :alt="article.title"
        ></v-img>
      </v-flex>
      <v-flex lg10 class="pa-2"
        @click="showDetailedArticleModal({
          title: article.title,
          content: article.content,
          author: article.author.name,
          featured_image: article.featured_image,
          created_at: article.created_at
        });">
          <p v-if="article.content.length > 350" v-html="article.content.substring(0, 350) + '...'" class="nunito"></p>
          <p v-else v-html="article.content" class="nunito"></p>
      </v-flex>
    </v-layout>

    </div>
    `
})
