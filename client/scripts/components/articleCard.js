Vue.component('article-card', {
    props : ["articles"],
    filters: {
      truncate: function (text, length, suffix) {
        if (text.length > 15) {
          return text.substring(0, length) + suffix;
        } else return text
      }
    },
    template :`
      <div>
        <v-layout id="post-container" class="my-5" style="background-color: #e6e6e6" align-start justify-center fill-height row wrap v-if="showBlogPostsPage" v-for="(article, index) in searchArticleByTitle" :key="article._id" data-aos="fade-up"/>
          <template v-if="name == article.UserId.name">
            <v-flex lg10 md6 class="pt-3 pl-3"> <!-- style="background-color: khaki" -->
                <h4 class="title">{{ article.title }}</h4>
                <p class="subheading">by {{ article.UserId.name }}</p>
            </v-flex>
            <v-flex lg2>
              <div class="text-xs-center">
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn flat icon color="red" v-on="on">
                      <v-icon @click="deleteAnArticle(article._id, article.UserId)">delete</v-icon>
                    </v-btn>
                  </template>
                  <span>Delete</span>
                </v-tooltip>
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn flat icon color="blue" v-on="on">
                      <v-icon
                      @click="updateAnArticleModal = true; articleTitleUpdate = article.title; articleContentUpdate = article.content; articleIdUpdate = article._id; articleUserId = article.UserId">
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
            <v-flex lg12 md6 class="pt-3 pl-3"> <!-- style="background-color: khaki" -->
              <h4 class="title">{{ article.title }}</h4>
              <p class="subheading">by {{ article.UserId.name }}</p>
            </v-flex>
          </template>
          <v-flex lg2 class="pl-3 pb-3 pr-3">
            <v-img
              :src="article.featured_image"
              max-height="100"
              :alt="article.title"
            ></v-img>
          </v-flex>
          <v-flex lg10 class="pa-2">
            <div class="nunito" >
              <p v-html="article.content"></p>
            </div>
          </v-flex>
        </v-layout>
      </div>
    `
})
