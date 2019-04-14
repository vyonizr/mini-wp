Vue.component('article-card', {
    props: {
      name: String,
      articles: Array,
      searchArticleByTitle: Array,
      showBlogPostsPage: Boolean,
      showDetailedArticleModal: Boolean
    },
    template :`
      <div>
        <v-layout
          id="post-container"
          class="my-5"
          style="background-color: #e6e6e6"
          align-start
          justify-center
          fill-height
          row
          wrap
          v-if="showBlogPostsPage"
          v-for="(article, index) in searchArticleByTitle" :key="article._id"
          data-aos="fade-up"/>
          <template v-if="name == article.UserId.name">
            <v-flex lg10 md6 class="pt-3 pl-3" @click="showDetailedArticleModal = true;
              articleOnDetailedModal = {
                title: article.title,
                content: article.content,
                author: article.UserId.name,
                featured_image: article.featured_image,
                created_at: article.created_at
              }">
                <h4 class="title">{{ article.title }}</h4>
                <p class="subheading">You | {{ parseDate(article.created_at) }}</p>
            </v-flex>
            <v-flex lg2>
              <div class="text-xs-center">
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn flat icon color="red" v-on="on" @click="deleteAnArticle(article._id, article.UserId._id)">
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
                        @click="updateAnArticleModal = true; articleTitleUpdate = article.title; articleContentUpdate = article.content; articleIdUpdate = article._id; articleUserId = article.UserId._id">
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
                author: article.UserId.name,
                featured_image: article.featured_image
              }"> <!-- style="background-color: khaki" -->
              <h4 class="title">{{ article.title }}</h4>
              <p class="subheading">{{ article.UserId.name }} | {{ parseDate(article.created_at) }}</p>
            </v-flex>
          </template>
          <v-flex lg2 class="pl-3 pb-3 pr-3"
            @click="showDetailedArticleModal = true;
              articleOnDetailedModal = {
                title: article.title,
                content: article.content,
                created_at: parseDate(article.created_at),
                author: article.UserId.name,
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
                author: article.UserId.name,
                featured_image: article.featured_image
              }">
            <div class="nunito" >
              <p v-html="article.content.substring(0, 350) + '...'"></p>
            </div>
          </v-flex>
        </v-layout>
      </div>
    `
})
