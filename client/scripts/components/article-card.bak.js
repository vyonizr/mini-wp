Vue.component('article-card', {
    props: ["article", "searchInput"],
    data() {
      return {
        loggedInName: localStorage.getItem("name")
      }
    },
    computed: {
      searchArticleByTitle: function() {
        return articles.filter(article =>
          article.title.toLowerCase().match(this.searchInput.toLowerCase())
          )
      }
    },
    methods: {
      parseDate(date) {
        return moment(date).calendar();
      }
    },
    template :`
      <div>
          <template v-if="this.loggedInName == article.author.name">
            <v-flex lg10 md6 class="pt-3 pl-3" @click="showDetailedArticleModal = true;
              articleOnDetailedModal = {
                title: article.title,
                content: article.content,
                author: article.author.name,
                featured_image: article.featured_image,
                created_at: article.created_at
              }">
                <h4 class="title">{{ article.title }}</h4>
                <p class="body-1">You | {{ parseDate(article.created_at) }}</p>
            </v-flex>
            <v-flex lg2>
              <div class="text-xs-center">
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn flat icon color="red" v-on="on" @click="deleteAnArticle(article._id, article.author._id)">
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
                        @click="updateAnArticleModal = true; articleTitleUpdate = article.title; articleContentUpdate = article.content; articleIdUpdate = article._id; articleAuthorId = article.author._id">
                        edit
                      </v-icon>
                    </v-btn>
                  </template>
                  <span>Edit</span>
                </v-tooltip>
              </div>
            </v-flex>
          </template>
          <template v-else>
            <v-flex lg12 md6 class="pt-3 pl-3"
              @click="showDetailedArticleModal = true;
              articleOnDetailedModal = {
                title: article.title,
                content: article.content,
                created_at: parseDate(article.created_at),
                author: article.author.name,
                featured_image: article.featured_image
              }">
              <h4 class="title">{{ article.title }}</h4>
              <p class="body-1">{{ article.author.name }} | {{ parseDate(article.created_at) }}</p>
            </v-flex>
          </template>
          <v-flex lg2 class="pl-3 pb-3 pr-3"
            @click="showDetailedArticleModal = true;
              articleOnDetailedModal = {
                title: article.title,
                content: article.content,
                created_at: parseDate(article.created_at),
                author: article.author.name,
                featured_image: article.featured_image
              }">
            <v-img
              :src="article.featured_image"
              max-height="100"
              :alt="article.title"
            ></v-img>
          </v-flex>
          <v-flex lg10 class="pa-2"
          @click="showDetailedArticleModal = true;
              articleOnDetailedModal = {
                title: article.title,
                content: article.content,
                created_at: parseDate(article.created_at),
                author: article.author.name,
                featured_image: article.featured_image
              }">
            <div class="nunito" >
              <p v-if="article.content.length > 350" v-html="article.content.substring(0, 350) + '...'"></p>
              <p v-else v-html="article.content"></p>
            </div>
          </v-flex>
      </div>
    `
})
